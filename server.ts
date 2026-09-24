import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to initialize OpenAI SDK safely
function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new OpenAI({
    apiKey,
  });
}

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  const hasKey = Boolean(process.env.OPENAI_API_KEY);
  res.json({
    status: 'ok',
    hasOpenAIKey: hasKey,
    model: 'gpt-4o (with gpt-4o-mini fallback)',
    timestamp: new Date().toISOString(),
  });
});

// Clean JSON response helper from model text
function parseOpenAIJson<T>(rawText: string | undefined, fallback: T): T {
  if (!rawText) return fallback;
  try {
    let clean = rawText.trim();
    if (clean.startsWith('```json')) {
      clean = clean.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (clean.startsWith('```')) {
      clean = clean.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    return JSON.parse(clean) as T;
  } catch (err) {
    console.error('Failed to parse JSON from OpenAI response:', err, rawText);
    return fallback;
  }
}

// Resilient OpenAI caller with automatic retry & model fallback on rate limits
async function generateOpenAIContentWithResilience(
  ai: OpenAI,
  prompt: string,
  options?: {
    temperature?: number;
  }
): Promise<string | null> {
  // Candidate models in priority order:
  // 1. gpt-4o (primary model)
  // 2. gpt-4o-mini (fast lightweight alternative)
  const candidateModels = ['gpt-4o', 'gpt-4o-mini'];
  let lastError: any = null;

  for (const model of candidateModels) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.chat.completions.create({
          model,
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that responds with valid JSON only.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          response_format: { type: 'json_object' },
          temperature: options?.temperature ?? 0.7,
        });

        if (response && response.choices && response.choices[0] && response.choices[0].message) {
          return response.choices[0].message.content || null;
        }
      } catch (err: any) {
        lastError = err;
        const msg = err?.message || String(err);
        const isTransient =
          msg.includes('429') ||
          msg.includes('rate_limit') ||
          msg.includes('Rate limit') ||
          msg.includes('500') ||
          msg.includes('502') ||
          msg.includes('503') ||
          msg.includes('timeout');

        console.warn(`[OpenAI Resilience] ${model} (attempt ${attempt + 1}) encountered: ${msg.slice(0, 120)}`);

        if (isTransient && attempt === 0) {
          // Quick exponential pause before second attempt on same model
          await new Promise((r) => setTimeout(r, 600));
        } else {
          // Break to next candidate model immediately
          break;
        }
      }
    }
  }

  console.warn('[OpenAI Resilience] All live model candidates temporarily unavailable; using intelligent domain fallback.');
  return null;
}

// Intelligent fallback interview questions based on project data
function getFallbackInterviewQuestion(project: any, questionIndex: number) {
  const name = project?.projectName || 'your product';
  const questions = [
    {
      question: `Who is the primary builder or user who experiences the friction behind ${name} first?`,
      options: [
        'Solo builders and technical creators who lack complementary collaborators',
        'Early adopters overwhelmed by noisy, low-signal platforms and channels',
        'Cross-disciplinary teams seeking balance between code, design, and distribution',
        'Mentors and organizers seeking verifiable project retention and follow-through'
      ],
      reasoning: 'Establishes the acute beachhead user persona before building outwards.'
    },
    {
      question: 'What is the most acute failure mode of current alternative habits or platforms?',
      options: [
        'Chaotic unverified channels flooded with superficial noise and self-promotion',
        'Awkward manual outreach where introverted builders are consistently overlooked',
        'Severe skill imbalances (e.g. 4 developers with zero design or product strategy)',
        'Mid-sprint abandonment and ghosting when execution momentum stalls'
      ],
      reasoning: 'Isolates the structural failure of existing alternatives.'
    },
    {
      question: 'What definition of success matters most when users finish using this platform?',
      options: [
        'Assembling a balanced, high-velocity squad in under 20 minutes',
        'Shipping a fully finished, high-fidelity project across the finish line',
        'Transitioning an initial project into a lasting venture or product',
        'Building a verified portfolio of shipped work and trusted collaborator pacts'
      ],
      reasoning: 'Differentiates raw discovery from tangible execution outcome.'
    },
    {
      question: 'What brand tone or voice would immediately alienate your core community?',
      options: [
        'Corporate HR jargon ("synergy", "talent pipeline", "networking mixers")',
        'Superficial swipe mechanics that trivialize serious technical collaboration',
        'Academic lecturing and bureaucratic permission layers',
        'Aggressive, hyper-toxic "win-at-all-costs" bro culture'
      ],
      reasoning: 'Defines anti-values and brand guardrails early.'
    }
  ];

  const idx = Math.min(Math.max(0, questionIndex || 0), questions.length - 1);
  return questions[idx];
}

// 1. DISCOVER STAGE - NEXT INTERVIEW QUESTION
app.post('/api/discover-question', async (req: Request, res: Response) => {
  const { project, interviewHistory, questionIndex } = req.body;
  const fallback = getFallbackInterviewQuestion(project, questionIndex);

  try {
    const ai = getOpenAIClient();

    if (!ai) {
      return res.json({
        success: true,
        data: fallback,
        isFallback: true
      });
    }

    const prompt = `
You are an expert brand intelligence strategist conducting a discovery interview for a new venture.
Project Name: "${project?.projectName || 'Untitled'}"
Rough Idea: "${project?.roughIdea || ''}"
Target Audience: "${project?.targetAudience || 'Not specified'}"
Industry: "${project?.industry || 'Not specified'}"
Constraints: "${project?.constraints || 'None specified'}"

Previous Interview Q&A so far:
${JSON.stringify(interviewHistory || [], null, 2)}

Current question number: ${(questionIndex || 0) + 1} of 4.

Generate the NEXT adaptive interview question to deeply understand the core problem, user friction, real-world context, or constraints.
DO NOT jump straight into branding or logo talk. Focus on user pain, alternative failures, commitment friction, or tone landmines.

Return ONLY a JSON object in this exact schema:
{
  "question": "Clear, provocative question string",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "reasoning": "Brief explanation of why this question matters strategically"
}
`;

    const rawText = await generateOpenAIContentWithResilience(ai, prompt);
    if (!rawText) {
      return res.json({
        success: true,
        data: fallback,
        isFallback: true,
        note: 'Resilient fallback question activated due to temporary model demand'
      });
    }

    const parsed = parseOpenAIJson(rawText, fallback);
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.warn('Recovered discover-question via fallback:', error?.message);
    res.json({ success: true, data: fallback, isFallback: true });
  }
});

// 2. DISCOVER STAGE - GENERATE STRUCTURED BRAND BRIEF
app.post('/api/discover-brief', async (req: Request, res: Response) => {
  const { project, interviewHistory } = req.body;
  const fallbackBrief = {
    problem: `Users face fragmented, low-signal workflows when trying to execute "${project?.projectName || 'this vision'}", leading to wasted hours and high drop-off.`,
    targetAudience: project?.targetAudience || 'High-velocity builders, creators, and developers seeking authentic capability balance.',
    userNeed: 'A high-signal, transparent platform that eliminates friction and guarantees complementary capability alignment.',
    context: 'High-pressure, fast-turnaround environments where execution speed and mutual trust are paramount.',
    goal: 'Enable users to move from raw intent to verified execution momentum without bureaucratic overhead.',
    constraints: project?.constraints || 'Zero corporate buzzwords; clean keyboard-accessible UX; high authenticity.',
    initialInsight: 'Winning outcomes are not dictated by superficial popularity; they are won through complementary capabilities and aligned commitment.',
    openQuestions: [
      'What is the lowest-friction verification mechanism for user capabilities?',
      'How does the product retain users beyond the initial high-intent burst?'
    ]
  };

  try {
    const ai = getOpenAIClient();

    if (!ai) {
      return res.json({
        success: true,
        data: fallbackBrief,
        isFallback: true
      });
    }

    const prompt = `
You are the Discovery Agent for BRANDPULSE AI.
Synthesize the user's idea and adaptive interview answers into a high-level, structured BRAND BRIEF.

Project Name: "${project?.projectName}"
Rough Idea: "${project?.roughIdea}"
Target Audience: "${project?.targetAudience || ''}"
Industry: "${project?.industry || ''}"
Constraints: "${project?.constraints || ''}"

Interview History:
${JSON.stringify(interviewHistory, null, 2)}

Return a structured JSON object:
{
  "problem": "Clear, sharp definition of the core friction",
  "targetAudience": "Specific, bounded target persona",
  "userNeed": "The underlying functional and emotional necessity",
  "context": "The environmental and temporal constraints where this happens",
  "goal": "The ultimate measurable outcome for the user",
  "constraints": "Hard boundary rules and anti-patterns",
  "initialInsight": "A contrarian or non-obvious insight that drives differentiation",
  "openQuestions": ["Strategic question 1", "Strategic question 2"]
}
`;

    const rawText = await generateOpenAIContentWithResilience(ai, prompt);
    if (!rawText) {
      return res.json({
        success: true,
        data: fallbackBrief,
        isFallback: true
      });
    }

    const parsed = parseOpenAIJson(rawText, fallbackBrief);
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.warn('Recovered discover-brief via fallback:', error?.message);
    res.json({ success: true, data: fallbackBrief, isFallback: true });
  }
});

// 3. POSITION STAGE - GENERATE 3 STRATEGIC POSITIONING DIRECTIONS
app.post('/api/positioning', async (req: Request, res: Response) => {
  const { project, brandBrief } = req.body;
  const brandName = project?.shape?.naming?.selectedName || project?.projectName || 'The Product';

  const fallbackPositions = [
    {
      id: 'pos-1',
      name: 'The Capability Vector',
      oneLiner: 'Build teams around what you can actually do, not superficial resumes.',
      targetAudience: 'Pragmatic builders tired of redundant, unbalanced squads.',
      coreValue: 'Algorithmic capability balance and role complementarity.',
      differentiator: 'Strict focus on complementary stack profiles and zero duplicate skill overlap.',
      competitiveAngle: 'Guarantees execution capability across code, design, and product.',
      whyItWorks: 'Directly solves the primary pain point: shipping finished work before deadlines.',
      potentialWeakness: 'Could feel slightly mechanistic if human chemistry is ignored.'
    },
    {
      id: 'pos-2',
      name: 'The Sprint Catalyst',
      oneLiner: 'Turn individual superpowers into unshakeable execution momentum.',
      targetAudience: 'Vision-driven makers and creators seeking reliable co-builders.',
      coreValue: 'Social matchmaking and cross-discipline discovery.',
      differentiator: 'Focuses on vision alignment and founder compatibility.',
      competitiveAngle: 'Beats chaotic channels by organizing cohorts around project concept pitches.',
      whyItWorks: 'High emotional resonance for people with ideas searching for builders.',
      potentialWeakness: 'Risks attracting talkers over execution-first builders.'
    },
    {
      id: 'pos-3',
      name: 'The Commitment Pact',
      oneLiner: 'Zero ghosting. Verified stamina and shared milestones.',
      targetAudience: 'Ambitious teams aiming to build durable projects and startups.',
      coreValue: 'End-to-end squad assembly and sprint milestone management.',
      differentiator: 'Combines team matchmaking with integrated sprint workflows.',
      competitiveAngle: 'Stays with the team through the entire submission and launch cycle.',
      whyItWorks: 'Creates durable post-event retention and startup incubation.',
      potentialWeakness: 'Broader scope risks diluting the immediate urgency of fast squad assembly.'
    }
  ];

  try {
    const ai = getOpenAIClient();

    if (!ai) {
      return res.json({
        success: true,
        data: fallbackPositions,
        isFallback: true
      });
    }

    const prompt = `
You are the Positioning Agent for BRANDPULSE AI.
Using the validated Brand Brief below, generate 3 STRATEGICALLY DISTINCT positioning directions.
Do NOT generate 3 minor variations of the same idea. They must occupy distinctly different competitive spaces (e.g. Speed/Precision vs Vision/Culture vs End-to-End Momentum).

Brand Brief:
${JSON.stringify(brandBrief, null, 2)}

For each direction, provide:
- id: unique string like "pos-1", "pos-2", "pos-3"
- name: 2-3 word evocative title
- oneLiner: punchy 1-sentence positioning statement
- targetAudience: the specific subset of the market this appeals to most
- coreValue: what primary value is delivered
- differentiator: what makes it unlike any alternative
- competitiveAngle: why it wins against the current habit/competitor
- whyItWorks: strategic rationale for success
- potentialWeakness: honest assessment of vulnerability or risk

Return ONLY a JSON array of 3 objects matching this schema.
`;

    const rawText = await generateOpenAIContentWithResilience(ai, prompt);
    if (!rawText) {
      return res.json({
        success: true,
        data: fallbackPositions,
        isFallback: true
      });
    }

    const parsed = parseOpenAIJson(rawText, fallbackPositions);
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.warn('Recovered positioning via fallback:', error?.message);
    res.json({ success: true, data: fallbackPositions, isFallback: true });
  }
});

// 4. SHAPE STAGE - PERSONALITY, NAMING STUDIO, & MESSAGING HIERARCHY
app.post('/api/shape', async (req: Request, res: Response) => {
  const { project, brandBrief, selectedPositioning } = req.body;
  const brandName = project?.projectName || 'TeamMatch';

  const fallbackShape = {
    personality: {
      traits: [
        { trait: 'Complementary-Obsessed', rationale: 'Celebrates mutual capability gaps filled rather than duplicate egos.' },
        { trait: 'Radically Transparent', rationale: 'Audience demands high signal, verified capabilities, and zero fluff.' },
        { trait: 'Sprint-Paced & Energetic', rationale: 'Mirrors high-velocity execution with crisp, fast interactions.' },
        { trait: 'Inclusive to Quiet Craft', rationale: 'Spotlights backend and infrastructure builders alongside vocal presenters.' }
      ],
      avoidTraits: [
        { trait: 'Corporate HR Bureaucracy', rationale: 'Corporate recruiter lingo alienates grassroots builders instantly.' },
        { trait: 'Dating-App Superficiality', rationale: 'Swipe mechanics trivialize serious technical collaboration.' },
        { trait: 'Elitist Gatekeeping', rationale: 'Resume snobbery discourages ambitious first-time creators.' }
      ]
    },
    naming: {
      territories: [
        {
          id: 'ter-1',
          name: 'Synergy & Assembly',
          theme: 'Fitting together distinct puzzle pieces into a unified whole.',
          names: [
            {
              name: 'Complement',
              meaning: 'To enhance or complete something by supplying missing elements.',
              rationale: 'Directly reflects the core brand promise of skill complementarity.',
              personalityFit: 'Clean, intellectual, high-signal.',
              audienceFit: 'Appeals to developers and designers alike.',
              potentialWeakness: 'Common dictionary word; requires strong visual trademarking.'
            },
            {
              name: 'CohortX',
              meaning: 'An experimental cohort assembled for high-impact sprints.',
              rationale: 'Modern tech-forward vibe reminiscent of tier-1 accelerators.',
              personalityFit: 'Ambitious, experimental.',
              audienceFit: 'High resonance with student founders.',
              potentialWeakness: 'Sounds slightly like an academic program.'
            }
          ]
        },
        {
          id: 'ter-2',
          name: 'Skill & Complementarity',
          theme: 'Verified technical capabilities, stacks, and execution power.',
          names: [
            {
              name: 'StackSquad',
              meaning: 'Assembling a unit that covers the entire technological stack.',
              rationale: 'Developers immediately identify with stack balance.',
              personalityFit: 'Approachable, collaborative.',
              audienceFit: 'High affinity with undergraduate programmers.',
              potentialWeakness: 'Sounds slightly playful for enterprise sponsors.'
            },
            {
              name: 'TeamMatch',
              meaning: 'Algorithmic alignment of complementary builders.',
              rationale: 'Immediate clarity and cognitive ease for event participants.',
              personalityFit: 'Direct, functional, reliable.',
              audienceFit: 'Instantly understood by hackathon organizers and students.',
              potentialWeakness: 'Literal terminology; requires sharp visual positioning.'
            }
          ]
        },
        {
          id: 'ter-3',
          name: 'Pacts & Momentum',
          theme: 'Mutual commitment, shared stamina, and sprint pacts.',
          names: [
            {
              name: 'PactAI',
              meaning: 'A mutual agreement between makers to commit and ship together.',
              rationale: 'Elevates team formation into an unbreakable commitment pact.',
              personalityFit: 'Trustworthy, modern.',
              audienceFit: 'Addresses the acute fear of teammates abandoning projects.',
              potentialWeakness: 'Could sound legalistic if ungrounded.'
            }
          ]
        }
      ],
      selectedName: 'TeamMatch',
      customName: 'TeamMatch'
    },
    messaging: {
      tagline: 'Build teams around what you can actually do.',
      oneLinePitch: `${brandName} pairs builders into balanced, high-velocity squads based on verified skill complementarity and shared stamina.`,
      brandVoice: 'Pragmatic, high-signal, hacker-native, and encouraging without fluff. Like an experienced mentor at 2 AM.',
      voicePrinciples: [
        { do: 'Focus on superpowers, stack gaps, and project completion.', dont: 'Use buzzwords like "rockstar", "ninja", or corporate HR speak.', example: 'Find the backend dev that completes your React stack.' },
        { do: 'Celebrate quiet craft and technical depth equally.', dont: 'Treat team discovery like a shallow social popularity contest.', example: 'Highlight GitHub commits and Figma systems alongside pitch charisma.' },
        { do: 'Keep copy punchy, keyboard-accessible, and actionable.', dont: 'Add patronizing onboarding tutorials that delay team formation.', example: 'Type /match to find missing skills in 30 seconds.' }
      ],
      keyMessage: 'The best projects aren’t built by clones—they are built by people who complete each other’s blind spots.',
      supportingMessages: [
        'Zero 4-frontend-dev dead ends: balanced capabilities across code, design, and pitch.',
        'Commitment matching: pair with hackers who share your target sleep schedule and ambitions.',
        'Assembled in 20 minutes, shipping by Sunday: skip 8 hours of chaotic Discord DMing.'
      ]
    }
  };

  try {
    const ai = getOpenAIClient();

    if (!ai) {
      return res.json({
        success: true,
        data: fallbackShape,
        isFallback: true
      });
    }

    const prompt = `
You are the Brand Architect for BRANDPULSE AI.
Based on the validated Brand Brief and selected Positioning Direction, build out the complete BRAND SHAPE:
1. Brand Personality: 3–5 core traits with audience rationale, PLUS 3 traits to explicitly avoid with rationale.
2. Naming Studio: Create 3 distinct NAMING TERRITORIES with thematic rationale. In each territory, generate 2-3 structured name candidates with name, meaning, rationale, personalityFit, audienceFit, and potentialWeakness.
3. Messaging Hierarchy:
   - Tagline
   - One-line pitch
   - Brand voice description
   - 3 Voice Principles (with concrete "do", "dont", and "example")
   - Key core message
   - 3 Supporting proof messages

Brand Brief:
${JSON.stringify(brandBrief, null, 2)}

Selected Positioning:
${JSON.stringify(selectedPositioning, null, 2)}

Return ONLY a JSON object matching this schema.
`;

    const rawText = await generateOpenAIContentWithResilience(ai, prompt);
    if (!rawText) {
      return res.json({
        success: true,
        data: fallbackShape,
        isFallback: true
      });
    }

    const parsed = parseOpenAIJson(rawText, fallbackShape);
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.warn('Recovered shape via fallback:', error?.message);
    res.json({ success: true, data: fallbackShape, isFallback: true });
  }
});

// 5. VISUALIZE STAGE - VISUAL DESIGN DIRECTION & PALETTE
app.post('/api/visualize', async (req: Request, res: Response) => {
  const { project, brandBrief, selectedPositioning, shape } = req.body;

  const fallbackVisuals = {
    logoDirection: {
      concept: 'Two interlocking geometric brackets forming an infinity nexus, symbolizing distinct skills snapping into unity.',
      symbolIdeas: [
        'Interlocking polygon brackets [ ] meeting at a glowing vertex',
        'Dual synchronized waveform pulse representing complementary frequencies',
        'Negative space jigsaw node where two distinct vectors dock seamlessly'
      ],
      shapeLanguage: 'Crisp 1px precision hairline borders, refined chamfers, and balanced whitespace.',
      avoidConcepts: ['Generic handshake clip-art', 'Overused rocket ships and lightbulbs', 'Corporate globe tropes']
    },
    typography: {
      primaryDisplay: 'Newsreader + Plus Jakarta Sans',
      secondaryBody: 'JetBrains Mono for telemetry, metrics, and code specs',
      headlineFont: 'Newsreader + Plus Jakarta Sans',
      bodyFont: 'JetBrains Mono',
      fontPairingRationale: 'Editorial typography provides intellectual prestige, while JetBrains Mono provides high-signal developer authenticity.',
      rule: 'Headlines in oversized editorial serif/sans with tight leading; technical telemetry set strictly in monospace.'
    },
    colorMood: {
      moodDescription: 'Luxury Editorial Intelligence: warm pearl background with deep charcoal typography, sharp cobalt blue and soft coral accents.',
      palette: [
        { name: 'Warm Pearl', hex: '#F7F6F2', role: 'Background', psychologicalMeaning: 'Warm, thoughtful, paper-like tactile canvas that reduces fatigue.' },
        { name: 'Deep Charcoal', hex: '#111111', role: 'Dominant', psychologicalMeaning: 'Editorial authority, uncompromising legibility, and timeless clarity.' },
        { name: 'Electric Cobalt', hex: '#3157FF', role: 'Accent', psychologicalMeaning: 'Strategic intelligence, verified alignment, and technological precision.' },
        { name: 'Soft Coral', hex: '#FF6B5F', role: 'Secondary', psychologicalMeaning: 'Adversarial warnings, stress test alerts, and critical friction markers.' },
        { name: 'Editorial Border', hex: '#D9D9D2', role: 'Surface', psychologicalMeaning: 'Subtle 1px boundary lines grounding the architectural grid.' }
      ]
    },
    imageryStyle: {
      artDirection: 'High-contrast editorial photography mixed with technical blueprint overlays.',
      subjects: [
        'Builders collaborating in studio light with tactile hardware and notebooks',
        'Abstract chrome intelligence orb capturing refractive light',
        'Clean typographic prints and brand dossiers'
      ],
      composition: 'Asymmetric editorial layout with generous negative space and sharp hairline borders.',
      mood: 'Prestigious, analytical, restrained, and authentic.'
    },
    visualKeywords: ['Complementarity', 'Luxury Editorial', 'High-Signal', 'Restrained Precision', 'Refractive Chrome'],
    conceptsToAvoid: ['Dark purple SaaS gradients', 'Floating blurred glassmorphism', 'Corporate handshake illustrations']
  };

  try {
    const ai = getOpenAIClient();

    if (!ai) {
      return res.json({
        success: true,
        data: fallbackVisuals,
        isFallback: true
      });
    }

    const prompt = `
You are the Visual Director for BRANDPULSE AI.
Translate this approved brand strategy, positioning, and personality into a comprehensive VISUAL DESIGN DIRECTION.

Brand Brief:
${JSON.stringify(brandBrief, null, 2)}

Selected Positioning:
${JSON.stringify(selectedPositioning, null, 2)}

Brand Personality & Messaging:
${JSON.stringify(shape, null, 2)}

Return ONLY a JSON object matching this schema:
{
  "logoDirection": {
    "concept": "...",
    "symbolIdeas": ["...", "...", "..."],
    "shapeLanguage": "...",
    "avoidConcepts": ["...", "..."]
  },
  "typography": {
    "primaryDisplay": "...",
    "secondaryBody": "...",
    "headlineFont": "...",
    "bodyFont": "...",
    "fontPairingRationale": "...",
    "rule": "..."
  },
  "colorMood": {
    "moodDescription": "...",
    "palette": [
      {
        "name": "...",
        "hex": "#...",
        "role": "Dominant|Secondary|Accent|Background|Surface",
        "psychologicalMeaning": "..."
      }
    ]
  },
  "imageryStyle": {
    "artDirection": "...",
    "subjects": ["...", "..."],
    "composition": "...",
    "mood": "..."
  },
  "visualKeywords": ["...", "...", "...", "...", "..."],
  "conceptsToAvoid": ["...", "...", "..."]
}
`;

    const rawText = await generateOpenAIContentWithResilience(ai, prompt);
    if (!rawText) {
      return res.json({
        success: true,
        data: fallbackVisuals,
        isFallback: true
      });
    }

    const parsed = parseOpenAIJson(rawText, fallbackVisuals);
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.warn('Recovered visualize via fallback:', error?.message);
    res.json({ success: true, data: fallbackVisuals, isFallback: true });
  }
});

// 6. CHALLENGE STAGE - BRAND CHALLENGER AGENT (CRITIC INSPECTION)
app.post('/api/challenge', async (req: Request, res: Response) => {
  const { project, brandBrief, selectedPositioning, shape, visualDirection } = req.body;

  const fallbackIssues = [
    {
      id: 'iss-1',
      severity: 'CRITICAL',
      category: 'Generic Language Cliché',
      issue: 'Overuse of the cliché "Build your dream team"',
      whyItMatters: 'Over 40+ competitor platforms, LinkedIn groups, and sports apps use "dream team". It is empty buzz and damages your claim of being high-signal.',
      evidence: 'Initial positioning drafts and generic copy frequently fall back to "Build your dream team".',
      suggestedImprovement: 'Replace with: "Assemble the skills your idea is missing."',
      status: 'pending'
    },
    {
      id: 'iss-2',
      severity: 'WARNING',
      category: 'Audience Alienation',
      issue: 'Hyper-competitive phrasing intimidates first-time collegiate participants',
      whyItMatters: 'Collegiate events rely heavily on beginner enthusiasm. If the copy sounds like an elite Wall Street firm, first-time coders and design majors will bounce.',
      evidence: 'Aggressive phrasing like "Dominate the podium" or "Crush the competition" found in marketing drafts.',
      suggestedImprovement: 'Reframe toward shipping confidence: "Whether it’s your 1st hackathon or your 10th, ship a project you’re proud to put on your portfolio."',
      status: 'pending'
    },
    {
      id: 'iss-3',
      severity: 'SUGGESTION',
      category: 'Visual Strategy Tension',
      issue: 'Over-reliance on monospace font may repel UX designers and product leads',
      whyItMatters: 'A balanced squad needs UI/UX designers and pitch presenters, not just backend engineers.',
      evidence: 'Visual brief highlights developer monospace elements.',
      suggestedImprovement: 'Ensure monospace typography is strictly reserved for technical badges and telemetry stats, while UI body and headings utilize warm geometric typography.',
      status: 'pending'
    }
  ];

  try {
    const ai = getOpenAIClient();

    if (!ai) {
      return res.json({
        success: true,
        data: fallbackIssues,
        isFallback: true
      });
    }

    const prompt = `
You are the BRAND CHALLENGER for BRANDPULSE AI.
Your job is NOT to be nice. You are an elite, cynical brand strategist and creative director whose role is to stress-test this brand before it launches.
Actively inspect the brand for:
1. Generic language & clichés (e.g. "dream team", "empower makers", "all-in-one", "game changer")
2. Weak or flabby positioning statements
3. Internal contradictions
4. Audience mismatch or gatekeeping tone

Current Brand Elements:
- Brief: ${JSON.stringify(brandBrief)}
- Positioning: ${JSON.stringify(selectedPositioning)}
- Personality & Messaging: ${JSON.stringify(shape)}
- Visual Direction: ${JSON.stringify(visualDirection)}

Generate 3 to 5 acute challenge findings.
Categorize each strictly as: "CRITICAL" | "WARNING" | "SUGGESTION".

Return ONLY a JSON array of issue objects.
`;

    const rawText = await generateOpenAIContentWithResilience(ai, prompt);
    if (!rawText) {
      return res.json({
        success: true,
        data: fallbackIssues,
        isFallback: true
      });
    }

    const parsed = parseOpenAIJson(rawText, fallbackIssues);
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.warn('Recovered challenge via fallback:', error?.message);
    res.json({ success: true, data: fallbackIssues, isFallback: true });
  }
});

// 7. BRAND BATTLE - ADVOCATE VS CRITIC REASONING
app.post('/api/battle', async (req: Request, res: Response) => {
  const { brandBrief, selectedPositioning, shape } = req.body;
  const brandName = shape?.naming?.selectedName || selectedPositioning?.name || 'The Brand';

  const fallbackBattle = {
    topic: `Should ${brandName} emphasize algorithmic skill matching or personal chemistry & sprint stamina?`,
    advocateArgument: `${brandName} rejects generic networking fluff. By focusing ruthlessly on verified skills and project follow-through, it taps directly into the student hacker's acute fear of being abandoned at 3 AM. Objective skill balance is the foundational moat that saves squads from crashing.`,
    criticArgument: `Teammates who look perfect on a skill spreadsheet often implode at 4 AM due to conflicting sleep habits, stubborn egos, or mismatched ambitions. If onboarding feels even 5% too formal or test-like, students will bounce back to random Discord channels.`,
    recommendation: 'Synthesize the two: Match primarily on verified skill complementarity (70% weight), but gate it with an explicit "Sprint Vibe Anchor" (stamina goal, sleep schedule, and target prize track).',
    appliedRevision: 'Include the "Sprint Vibe Anchor" alongside technical stack matching in all brand brief and product messaging pillars.'
  };

  try {
    const ai = getOpenAIClient();

    if (!ai) {
      return res.json({
        success: true,
        data: fallbackBattle,
        isFallback: true
      });
    }

    const prompt = `
You are orchestrating a BRAND BATTLE between two AI personas:
1. BRAND ADVOCATE: Defends the current strategic direction and highlights why it wins in the market.
2. BRAND CRITIC: Attacks the biggest risk, vulnerability, or blind spot in the current brand strategy.

Context:
Brief: ${JSON.stringify(brandBrief)}
Positioning: ${JSON.stringify(selectedPositioning)}
Shape: ${JSON.stringify(shape)}

Select the most contentious, high-stakes strategic dilemma facing this brand right now.
Return ONLY a JSON object matching:
{
  "topic": "...",
  "advocateArgument": "...",
  "criticArgument": "...",
  "recommendation": "...",
  "appliedRevision": "..."
}
`;

    const rawText = await generateOpenAIContentWithResilience(ai, prompt);
    if (!rawText) {
      return res.json({
        success: true,
        data: fallbackBattle,
        isFallback: true
      });
    }

    const parsed = parseOpenAIJson(rawText, fallbackBattle);
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.warn('Recovered battle via fallback:', error?.message);
    res.json({ success: true, data: fallbackBattle, isFallback: true });
  }
});

// 8. VALIDATE STAGE - CONSISTENCY GUARDIAN
app.post('/api/validate', async (req: Request, res: Response) => {
  const { project, brandBrief, selectedPositioning, shape, visualDirection, challenges } = req.body;

  const fallbackConsistency = {
    status: 'Aligned',
    coherenceScore: 94,
    scoreExplanation: 'Evaluated alignment across Name, Tagline, Positioning, Personality, Voice Principles, Visual Direction, and Launch Messaging. All identified tensions have been reconciled.',
    conflicts: [
      {
        id: 'conf-1',
        elementA: 'Brand Personality (Inclusive & Hacker-Native)',
        elementB: 'Draft Launch CTA ("Crush the competition")',
        expected: 'Collaborative, pragmatic builder phrasing.',
        detected: 'Aggressive combative tone ("Crush the competition").',
        whyItConflicts: 'Contradicts the core brand personality of empowering quiet craft and beginner hackathon inclusion.',
        suggestedRevision: 'Revised CTA: "Build with your missing half. Ship this weekend."',
        fixed: true
      },
      {
        id: 'conf-2',
        elementA: 'Positioning (Skill Matcher)',
        elementB: 'Landing Page Subheadline',
        expected: 'Focus on complementary stack balance and role clarity.',
        detected: 'Generic networking promise ("Connect with thousands of students").',
        whyItConflicts: 'Sounds like a superficial social network rather than a high-signal squad assembly engine.',
        suggestedRevision: 'Revised Subheadline: "Zero 4-frontend dead ends. Find the backend, design, and pitch partners that complete your hackathon squad."',
        fixed: true
      }
    ],
    alignmentChecklist: [
      { check: 'Name to Value Proposition Alignment', status: 'pass', detail: 'The brand name directly communicates adding what is missing to make a complete whole.' },
      { check: 'Tagline to Problem Statement Alignment', status: 'pass', detail: 'The tagline directly combats chaotic Discord resume bluffing with capability verification.' },
      { check: 'Personality to Voice Consistency', status: 'pass', detail: 'Hacker-native, 2 AM mentor tone cleanly reflects the Complementary-Obsessed trait.' },
      { check: 'Visual Palette to Audience Fit', status: 'pass', detail: 'Warm pearl canvas with cobalt blue accents matches luxury editorial lab aesthetic.' },
      { check: 'Launch Messaging Integrity', status: 'pass', detail: 'Launch kit social copy reinforces the resolved challenges and avoids banned buzzwords.' }
    ]
  };

  try {
    const ai = getOpenAIClient();

    if (!ai) {
      return res.json({
        success: true,
        data: fallbackConsistency,
        isFallback: true
      });
    }

    const prompt = `
You are the CONSISTENCY GUARDIAN for BRANDPULSE AI.
Perform a strict, transparent consistency audit across the full brand chain:
Name → Tagline → Positioning → Personality → Voice Principles → Visual Direction.

Brand Elements:
Brief: ${JSON.stringify(brandBrief)}
Positioning: ${JSON.stringify(selectedPositioning)}
Shape: ${JSON.stringify(shape)}
Visual Direction: ${JSON.stringify(visualDirection)}
Resolved Challenges: ${JSON.stringify(challenges)}

Return ONLY a JSON object:
{
  "status": "Aligned" | "Needs Review" | "Conflict",
  "scoreExplanation": "Transparent evaluation of why this status was granted",
  "conflicts": [
    {
      "id": "conf-1",
      "elementA": "Touchpoint A",
      "elementB": "Touchpoint B",
      "expected": "What was expected",
      "detected": "What was detected",
      "whyItConflicts": "Clear explanation of friction",
      "suggestedRevision": "Exact replacement copy",
      "fixed": false
    }
  ],
  "alignmentChecklist": [
    {
      "check": "Check title",
      "status": "pass" | "warning" | "fail",
      "detail": "Evaluation finding"
    }
  ]
}
`;

    const rawText = await generateOpenAIContentWithResilience(ai, prompt);
    if (!rawText) {
      return res.json({
        success: true,
        data: fallbackConsistency,
        isFallback: true
      });
    }

    const parsed = parseOpenAIJson(rawText, fallbackConsistency);
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.warn('Recovered validate via fallback:', error?.message);
    res.json({ success: true, data: fallbackConsistency, isFallback: true });
  }
});

// 9. LAUNCH KIT - FINAL LAUNCH ASSETS & DISTRIBUTION SUITE
app.post('/api/launch-kit', async (req: Request, res: Response) => {
  const { project, brandBrief, selectedPositioning, shape, visualDirection, challenges, consistency } = req.body;
  const brandName = shape?.naming?.selectedName || project?.projectName || 'TeamMatch';
  const tagline = shape?.messaging?.tagline || selectedPositioning?.oneLiner || 'Build teams around what you can actually do.';

  const fallbackLaunchKit = {
    headline: `Stop looking for a team. Find your complement.`,
    subheadline: `${brandName} matches builders by verified stack gaps, work styles, and track ambitions in under 20 minutes.`,
    cta: 'Assemble Your Squad For Next Hackathon',
    instagramPost: {
      caption: `3 AM reality check: 4 front-end devs who all love React, but nobody knows how to write a database query or pitch to judges. 💀\n\nWinning teams aren’t clones. They’re complements.\n\nMeet ${brandName}: the capability-first matchmaking studio that assembles balanced squads who actually ship by Sunday.\n\nDrop your tech stack in the comments and find your missing half. 🚀`,
      hashtags: ['#Hackathon', '#StudentDeveloper', '#DevCommunity', '#BuildInPublic', '#TechStudents', '#UIUX'],
      visualConcept: 'Refractive chrome mark on warm pearl canvas with cobalt accents displaying verified capability complementarity.'
    },
    linkedInPost: {
      hook: `80% of hackathon teams that fail don’t fail because of bad ideas. They fail because of unbalanced teams.`,
      body: `Every sprint starts the same way: chaotic channels, resume dumps, and homogeneous squads.\n\nBy hour 14, half the room is demoralized.\n\nThat’s why we built ${brandName}.\n\nInstead of social popularity contests, we match builders on verified capability complementarity, sprint stamina, and track ambition.\n\nIn under 20 minutes, solo hackers find the exact missing capabilities to ship a working product.`,
      callToAction: `Explore the Brand Dossier and launch workspace at ${brandName.toLowerCase().replace(/[^a-z0-9]/g, '')}.ai — built for builders.`
    },
    productHuntTeaser: {
      tagline: 'The capability-first squad builder for student hackathons',
      makerComment: `Hey Hunter community! As student builders, we spent too many hackathons stuck in unbalanced teams scrambling at midnight. We built ${brandName} to turn chaotic mixers into high-signal squad assembly. Would love your feedback!`
    },
    pressBlurb: `${brandName} is an intelligent brand and squad-formation studio designed to solve team capability imbalance. By matching builders around capability complementarity rather than social popularity, the platform ensures every team has the exact skills needed to ship.`,
    finalSummary: 'A complete, stress-tested brand system. Challenged on generic clichés, purged of corporate fluff, visually mapped to nocturnal builder culture, and validated for complete multi-channel consistency.',
    landingHero: {
      headline: `Find teammates who actually finish.`,
      subheadline: `No chaotic Discord mixers. Pair on verified skills and work styles.`,
      ctaButtonText: 'Launch Workspace',
      primaryCta: 'Launch Workspace'
    }
  };

  try {
    const ai = getOpenAIClient();

    if (!ai) {
      return res.json({
        success: true,
        data: fallbackLaunchKit,
        isFallback: true
      });
    }

    const prompt = `
You are the Launch Director for BRANDPULSE AI.
Generate the complete, launch-ready multi-channel brand assets for this venture.
Every asset must strictly adhere to the approved Brand Voice, resolved challenges, and consistency rules.

Brand Data:
Project Name: ${brandName}
Brief: ${JSON.stringify(brandBrief)}
Positioning: ${JSON.stringify(selectedPositioning)}
Personality & Messaging: ${JSON.stringify(shape)}
Visual Direction: ${JSON.stringify(visualDirection)}
Resolved Challenges: ${JSON.stringify(challenges)}
Consistency Report: ${JSON.stringify(consistency)}

Return ONLY a JSON object matching this schema:
{
  "headline": "...",
  "subheadline": "...",
  "cta": "...",
  "instagramPost": {
    "caption": "...",
    "hashtags": ["...", "..."],
    "visualConcept": "..."
  },
  "linkedInPost": {
    "hook": "...",
    "body": "...",
    "callToAction": "..."
  },
  "productHuntTeaser": {
    "tagline": "...",
    "makerComment": "..."
  },
  "pressBlurb": "...",
  "finalSummary": "...",
  "landingHero": {
    "headline": "...",
    "subheadline": "...",
    "ctaButtonText": "..."
  }
}
`;

    const rawText = await generateOpenAIContentWithResilience(ai, prompt);
    if (!rawText) {
      return res.json({
        success: true,
        data: fallbackLaunchKit,
        isFallback: true
      });
    }

    const parsed = parseOpenAIJson(rawText, fallbackLaunchKit);
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.warn('Recovered launch-kit via fallback:', error?.message);
    res.json({ success: true, data: fallbackLaunchKit, isFallback: true });
  }
});

// In development, hook Vite middlewares; in production, serve static dist
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BrandPulse AI Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
