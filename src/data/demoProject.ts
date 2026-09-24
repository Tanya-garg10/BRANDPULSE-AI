import { BrandProject } from '../types/brand';

export const DEMO_PROJECT: BrandProject = {
  id: 'demo-teammatch-01',
  projectName: 'TeamMatch',
  roughIdea: 'An AI platform that helps college students find the right teammates for hackathons based on verified skills, working styles, and hackathon track ambitions.',
  targetAudience: 'College undergraduate students, CS/Design/Biz majors participating in collegiate & virtual hackathons',
  industry: 'EdTech / Student Developer Community / AI Matching',
  marketLocation: 'North America & Global Student Hackathon Circuit (MLH, HackMIT, CalHacks, TreeHacks)',
  constraints: 'Free for students; must avoid sounding like a corporate LinkedIn or a superficial dating app swipe interface.',
  currentStage: 'launch',
  completedStages: ['discover', 'position', 'shape', 'visualize', 'challenge', 'validate', 'launch'],

  discovery: {
    interview: [
      {
        id: 'q1',
        question: 'Who is the primary user experiencing this friction the hardest?',
        options: [
          'Solo hackers with niche skills (e.g. backend/hardware) unable to find designers',
          'First-time hackathon attendees intimidated by existing cliques',
          'Competitive hacker teams missing one specific capability (e.g. pitch lead or mobile dev)',
          'Student club organizers struggling to form balanced cohorts'
        ],
        answer: 'Solo hackers with niche skills and first-time attendees who get stuck in random, unbalanced Discord channels hours before submission deadlines.',
        reasoning: 'Highlights both technical imbalance and the acute emotional friction of last-minute scramble.'
      },
      {
        id: 'q2',
        question: 'What is the fatal flaw in how students find teammates right now?',
        options: [
          'Chaotic Discord/Slack #find-a-team channels with copy-pasted resumes',
          'Awkward in-person mixers where extroverts win and solo coders leave empty-handed',
          'Friend groups teaming up who have identical skillsets (e.g., four front-end devs)',
          'All of the above combined'
        ],
        answer: 'Friend groups team up with 4 frontend devs and zero backend/pitch skills, while Discord mixers are noisy resume dumps with zero signal on actual commitment.',
        reasoning: 'Pinpoints complementary capability gaps over simple social connection.'
      },
      {
        id: 'q3',
        question: 'What is the core metric of success for this platform in the user’s eyes?',
        options: [
          'Forming a team in under 15 minutes before hacking kicks off',
          'Shipping a completed project together that actually gets submitted and demoed',
          'Winning a sponsor track or podium prize',
          'Making lifelong collaborator friendships beyond the weekend'
        ],
        answer: 'Shipping a completed, fully demoed project with complementary teammates who do not abandon each other halfway through the night.',
        reasoning: 'Replaces superficial team formation with project completion and reliability.'
      },
      {
        id: 'q4',
        question: 'What tone would immediately turn off this student developer audience?',
        options: [
          'Overly corporate HR recruiting lingo ("synergy", "talent pipeline")',
          'Gamified dating-app vibes ("swipe right on your frontend dev")',
          'Condescending academic textbook language',
          'Aggressive hyper-competitive "win-at-all-costs" bro culture'
        ],
        answer: 'Corporate HR recruiting speak and gimmicky dating-app swipe mechanics. Developers hate superficial buzzwords.',
        reasoning: 'Critical boundary condition for brand personality and voice.'
      }
    ],
    currentQuestionIndex: 4,
    brandBrief: {
      problem: 'Hackathon participants waste the first crucial 8 hours scrambling in noisy Discord channels or awkward mixers, repeatedly forming unbalanced teams (e.g., 4 frontend coders) with high mid-event abandonment rates.',
      targetAudience: 'Student builders, collegiate developers, UI/UX designers, and campus entrepreneurs participating in 24–48h hackathons.',
      userNeed: 'A fast, high-signal way to discover teammates with complementary superpowers, shared work ethic, and aligned track ambitions without corporate friction.',
      context: 'High-stress, time-compressed collegiate hackathon weekend environments where speed and execution trust dictate survival.',
      goal: 'Enable any student builder to assemble a balanced, committed four-person squad within 20 minutes and complete their project together.',
      constraints: 'Zero corporate recruiter jargon; no patronizing dating-app swipe tropes; must respect introvert developers while spotlighting cross-functional skills.',
      initialInsight: 'Winning teams are not built by social popularity; they are built by mutual skill complementarity and aligned stamina.',
      openQuestions: [
        'How do we verify self-reported skills without adding onboarding friction?',
        'Should the platform disband teams after the event or persist them into incubator startups?'
      ]
    }
  },

  positioning: {
    directions: [
      {
        id: 'pos-1',
        name: 'The Connector',
        oneLiner: 'Find the people who complete your idea.',
        targetAudience: 'Idea-driven hackers and student project founders.',
        coreValue: 'Social matchmaking and cross-discipline discovery.',
        differentiator: 'Focuses on vision alignment and founder compatibility.',
        competitiveAngle: 'Beats Discord chaos by organizing teams around project concept pitches.',
        whyItWorks: 'Emotional pull; resonates with visionaries wanting co-creators.',
        potentialWeakness: 'Risk of over-indexing on charismatic talkers rather than hard execution builders.'
      },
      {
        id: 'pos-2',
        name: 'The Skill Matcher',
        oneLiner: 'Build teams around what you can actually do.',
        targetAudience: 'Pragmatic student builders tired of unbalanced, dead-end teams.',
        coreValue: 'Algorithmic capability complementarity & role balance.',
        differentiator: 'Focuses strictly on complementary stack profiles (e.g. Fast backend + Next.js UI + AI engineer + pitch lead).',
        competitiveAngle: 'Direct counter to awkward mixers; guarantees no redundant skill overlap.',
        whyItWorks: 'Directly solves the primary pain point: shipping a finished product before deadline.',
        potentialWeakness: 'Could feel slightly mechanistic if not balanced with personal working style and enthusiasm.'
      },
      {
        id: 'pos-3',
        name: 'The Collaboration Engine',
        oneLiner: 'Turn individual skills into collaborative momentum.',
        targetAudience: 'Ambitious hackers aiming to win sponsor tracks and launch startups.',
        coreValue: 'Squad assembly + hackathon sprint workflow management.',
        differentiator: 'Combines team matchmaking with integrated 36-hour sprint milestones.',
        competitiveAngle: 'Not just team formation; accompanies the squad through the entire submission cycle.',
        whyItWorks: 'Higher lifetime value and post-hackathon startup retention.',
        potentialWeakness: 'Broader scope risks diluting the immediate urgency of pre-event team finding.'
      }
    ],
    selectedDirectionId: 'pos-2'
  },

  shape: {
    personality: {
      traits: [
        {
          trait: 'Complementary-Obsessed',
          rationale: 'Every touchpoint highlights mutual capability gaps filled, celebrating what builders achieve when balanced.'
        },
        {
          trait: 'Radically Transparent',
          rationale: 'Student builders value straightforward capability breakdowns over inflated claims and vague bios.'
        },
        {
          trait: 'Sprint-Paced & Energetic',
          rationale: 'Mirrors the 48-hour hackathon rush with crisp, fast interactions and zero bureaucracy.'
        },
        {
          trait: 'Inclusive to Quiet Craft',
          rationale: 'Ensures introvert backend wizards, hardware hackers, and systems engineers get equal spotlight alongside charismatic presenters.'
        }
      ],
      avoidTraits: [
        {
          trait: 'Corporate HR Bureaucracy',
          rationale: 'Lingo like "synergy", "talent pipeline", and "KPIs" instantly alienates student hackers.'
        },
        {
          trait: 'Dating App Superficiality',
          rationale: 'Swipe mechanics make serious technical collaboration feel trivial and gamified.'
        },
        {
          trait: 'Elitist Gatekeeping',
          rationale: 'Overemphasizing resume pedigrees or Ivy League credentials discourages eager first-time builders.'
        }
      ]
    },
    naming: {
      territories: [
        {
          id: 'ter-1',
          name: 'Synergy & Assembly',
          theme: 'Names invoking the deliberate fitting together of puzzle pieces and complementary forces.',
          names: [
            {
              name: 'Complement',
              meaning: 'To add to something in a way that enhances or completes it.',
              rationale: 'Directly embodies the core brand promise: you don’t need another clone of yourself, you need your complement.',
              personalityFit: 'Clean, intellectual, high signal-to-noise.',
              audienceFit: 'Instantly understood by technical and design students alike.',
              potentialWeakness: 'Slightly dictionary-generic if used without distinctive styling.'
            },
            {
              name: 'CohortX',
              meaning: 'An experimental cohort of diverse makers grouped for a breakthrough sprint.',
              rationale: 'Modern tech-forward vibe, reminiscent of top-tier accelerators.',
              personalityFit: 'Ambitious, fast-paced.',
              audienceFit: 'Appeals strongly to startup-minded student builders.',
              potentialWeakness: 'Sounds a bit like a student society or academic course.'
            }
          ]
        },
        {
          id: 'ter-2',
          name: 'Skill & Complementarity',
          theme: 'Names centered on verified capabilities, stacks, and execution power.',
          names: [
            {
              name: 'StackSquad',
              meaning: 'Assembling a squad spanning the full technology and creative stack.',
              rationale: 'Developers immediately identify with the term "stack".',
              personalityFit: 'Approachable, collaborative, hacker-friendly.',
              audienceFit: 'High affinity with first and second year CS students.',
              potentialWeakness: 'Sounds somewhat informal or playful for enterprise hackathon sponsors.'
            },
            {
              name: 'SyncHacks',
              meaning: 'Synchronizing hackers across complementary disciplines in real time.',
              rationale: 'Short, active verb-noun pairing tailored for hackathon weekends.',
              personalityFit: 'Sprint-paced, technical.',
              audienceFit: 'Directly references the hackathon context.',
              potentialWeakness: 'Tethers the brand strictly to hackathons, making expansion to student startups harder.'
            }
          ]
        },
        {
          id: 'ter-3',
          name: 'Pacts & Momentum',
          theme: 'Names reflecting the commitment, mutual trust, and sprint contracts between teammates.',
          names: [
            {
              name: 'PactAI',
              meaning: 'A mutual agreement between makers to build, commit, and finish together.',
              rationale: 'Elevates team formation into a shared commitment pact, preventing mid-event ghosting.',
              personalityFit: 'Serious, trustworthy, modern.',
              audienceFit: 'Speaks to the pain point of teammates quitting at 3 AM.',
              potentialWeakness: 'Could sound legalistic if not paired with warm typography.'
            },
            {
              name: 'SprintSquad',
              meaning: 'A high-velocity unit formed specifically to ship in 48 hours.',
              rationale: 'Punchy alliteration that emphasizes speed and team cohesion.',
              personalityFit: 'Energetic, action-oriented.',
              audienceFit: 'Immediately clear utility.',
              potentialWeakness: 'Less distinctive in a crowded productivity SaaS landscape.'
            }
          ]
        }
      ],
      selectedName: 'Complement',
      customName: 'Complement AI'
    },
    messaging: {
      tagline: 'Build teams around what you can actually do.',
      oneLinePitch: 'Complement AI is the capability-first matchmaking studio that pairs student hackathon builders into balanced, unstoppable squads in under 20 minutes.',
      brandVoice: 'Pragmatic, high-signal, hacker-native, and encouraging without fluff. We talk like an experienced tech mentor at 2 AM: direct, respectful of time, and focused on helping you ship.',
      voicePrinciples: [
        {
          do: 'Focus on superpowers, stack complementary gaps, and project completion.',
          dont: 'Use buzzwords like "rockstar", "ninja", or corporate HR recruiter speak.'
        },
        {
          do: 'Celebrate the quiet craft of back-end coders and UX architects equally.',
          dont: 'Treat team matching like a shallow social popularity contest.'
        },
        {
          do: 'Keep instructions punchy, keyboard-accessible, and dark-mode native.',
          dont: 'Add patronizing onboarding tutorials that delay team formation.'
        }
      ],
      keyMessage: 'The best hackathon projects aren’t built by identical clones—they are built by people who complete each other’s blind spots.',
      supportingMessages: [
        'Zero 4-frontend-dev dead ends: our matchmaking engine balances code, design, and product pitch.',
        'Commitment matching over resume fluff: pair with hackers who share your target sleep schedule and prize track.',
        'Assembled in 20 minutes, shipping by Sunday: skip 8 hours of chaotic Discord DMing.'
      ]
    }
  },

  visualize: {
    logoDirection: {
      concept: 'Two interlocking geometric arcs forming a stylized "C" and squad nexus, symbolizing distinct skills snapping into unity.',
      symbolIdeas: [
        'Interlocking polygon brackets [ ] that meet at a shared glowing focal point',
        'Minimalist dual-waveform pulse representing synchronized hacker frequencies',
        'Negative space jigsaw node where two distinct vectors lock into a stable foundation'
      ],
      shapeLanguage: 'Crisp 45-degree chamfers, modular grid lines, and soft 12px pill geometry that balances engineering precision with human warmth.',
      avoidConcepts: [
        'Generic handshake clip-art or interlocking puzzle pieces',
        'Overused rocket ships, lightbulbs, or cartoon mascots',
        'Corporate globe or interlocking ring tropes'
      ]
    },
    typography: {
      primaryDisplay: 'Plus Jakarta Sans (SemiBold / ExtraBold)',
      secondaryBody: 'JetBrains Mono (Regular / Medium for tags and stats) + Inter for dense UI text',
      fontPairingRationale: 'Plus Jakarta Sans provides geometric friendliness and confident tech authority, while JetBrains Mono provides developer authenticity when displaying skills, terminal tags, and stack profiles.',
      rule: 'Headlines in crisp -0.03em letter-spacing; all technical metadata, stack badges, and time metrics set in monospace.'
    },
    colorMood: {
      moodDescription: 'Terminal Twilight: deep nocturnal workspace canvas illuminated by electric violet intelligence and cyan signal pulses.',
      palette: [
        {
          name: 'Nocturne Void',
          hex: '#090A10',
          role: 'Background',
          psychologicalMeaning: 'The 2 AM hacker terminal; reduces eye strain and establishes a focused deep-work arena.'
        },
        {
          name: 'Electric Violet',
          hex: '#8B5CF6',
          role: 'Accent',
          psychologicalMeaning: 'Creativity, breakthrough ideas, and AI-assisted synthesis.'
        },
        {
          name: 'Cyan Signal',
          hex: '#06B6D4',
          role: 'Secondary',
          psychologicalMeaning: 'Technical precision, live telemetry, and instant data synchronization.'
        },
        {
          name: 'Terminal Emerald',
          hex: '#10B981',
          role: 'Dominant',
          psychologicalMeaning: 'Validation, verified capabilities, and ready-to-launch squad confirmation.'
        },
        {
          name: 'Card Surface',
          hex: '#131622',
          role: 'Surface',
          psychologicalMeaning: 'Subtle dimensional elevation with 1px glass border highlighting modular card architecture.'
        }
      ]
    },
    imageryStyle: {
      artDirection: 'High-contrast nocturnal studio photography mixed with glowing schematic UI overlays. Real student builders collaborating around laptops, whiteboard blueprints, and tactile hardware boards.',
      subjects: [
        'Diverse student hackers collaborating intensely in late-night collegiate spaces',
        'Close-ups of fingers on mechanical keyboards, wireframes on iPads, and circuit prototypes',
        'Abstract 3D glass geometry that physically docks together seamlessly'
      ],
      composition: 'Asymmetrical modular grids with generous dark negative space and subtle radial gradients highlighting focal UI elements.',
      mood: 'Focused, authentic, electric with nocturnal adrenaline.'
    },
    visualKeywords: ['Complementarity', 'Nocturnal Velocity', 'High-Signal', 'Docked Geometry', 'Electric Cadence'],
    conceptsToAvoid: ['Stock photo corporate handshakes', 'Bright sterile pastel office settings', 'Silly cartoon hacker avatars with hoodies']
  },

  challenges: {
    issues: [
      {
        id: 'iss-1',
        severity: 'CRITICAL',
        category: 'Generic Language Cliché',
        issue: 'Overuse of the cliché "Build your dream team"',
        whyItMatters: 'Over 40+ competitor hackathon platforms, LinkedIn groups, and sports apps use "dream team". It is empty buzz and damages your claim of being high-signal.',
        evidence: 'Draft pitch originally stated: "Help hackathon students build their dream team."',
        suggestedImprovement: 'Replace with: "Assemble the skills your idea is missing."',
        status: 'accepted',
        userNote: 'Accepted. The skill-specific phrasing is much sharper.'
      },
      {
        id: 'iss-2',
        severity: 'WARNING',
        category: 'Audience Alienation',
        issue: 'Hyper-competitive phrasing intimidates first-time collegiate hackers',
        whyItMatters: 'Hackathons rely heavily on beginner enthusiasm. If the copy sounds like an elite high-frequency trading firm, first-time coders and design majors will bounce.',
        evidence: 'Initial positioning draft claimed: "Only for hackers who play to dominate the podium."',
        suggestedImprovement: 'Reframe toward shipping confidence: "Whether it’s your 1st hackathon or your 10th, ship a project you’re proud to put on your portfolio."',
        status: 'accepted',
        userNote: 'Updated to be inclusive to ambitious first-timers.'
      },
      {
        id: 'iss-3',
        severity: 'SUGGESTION',
        category: 'Visual Strategy Tension',
        issue: 'Monospace font could look too cold or intimidating for design & business majors',
        whyItMatters: 'A balanced squad needs UI/UX designers and pitch presenters, not only hardcore C++ kernel hackers.',
        evidence: 'Visual brief specifies JetBrains Mono for badges and stats.',
        suggestedImprovement: 'Ensure JetBrains Mono is strictly reserved for technical badges, while UI body and headings utilize the warm geometric curves of Plus Jakarta Sans.',
        status: 'accepted',
        userNote: 'Clarified font hierarchy in visual guidelines.'
      }
    ],
    battle: {
      topic: 'Should Complement AI emphasize algorithm-driven skill matching or human chemistry / vibe alignment?',
      advocateArgument: 'The Advocate argues: Hackathon failure almost never comes from bad vibes on hour one; it comes from realizing 12 hours in that nobody knows how to deploy a database or wire the API. Objective skill-balance is the foundational moat that saves teams from crashing.',
      criticArgument: 'The Critic warns: Teammates who look perfect on a skill matrix often implode at 4 AM due to conflicting sleep habits, stubborn egos, or mismatched ambitions (fun vs trophy). Pure skill matching treats humans like CPU cores and risks sterile, fragile squads.',
      recommendation: 'Synthesize the two: Match primarily on verified skill complementarity (70% weight), but gate it with an explicit "Sprint Vibe Anchor" (stamina goal, desired sleep schedule, and target track ambition).',
      appliedRevision: 'Updated Brand Brief & Messaging to include the "Sprint Vibe Anchor" alongside technical stack matching.',
      decision: 'applied'
    }
  },

  consistency: {
    status: 'Aligned',
    scoreExplanation: 'Rigorous 7-point alignment evaluation conducted across Brand Name, Tagline, Value Proposition, Personality, Voice Principles, Visual Direction, and Launch Messaging. All identified tensions have been reconciled.',
    conflicts: [
      {
        id: 'conf-1',
        elementA: 'Brand Personality (Inclusive & Hacker-Native)',
        elementB: 'Original Launch Post CTA ("Crush the competition")',
        expected: 'Collaborative, pragmatic builder phrasing.',
        detected: 'Aggressive combative tone ("Crush the competition").',
        whyItConflicts: 'Contradicts the core brand personality of empowering quiet craft and first-time hackathon inclusion.',
        suggestedRevision: 'Revised CTA: "Build with your missing half. Ship this weekend."',
        fixed: true
      },
      {
        id: 'conf-2',
        elementA: 'Positioning (Skill Matcher)',
        elementB: 'Landing Page Subheadline',
        expected: 'Focus on complementary stack balance.',
        detected: 'Generic networking promise ("Connect with thousands of students").',
        whyItConflicts: 'Dating-app / social network vibe rather than precision squad capability assembly.',
        suggestedRevision: 'Revised Subheadline: "Zero 4-frontend dead ends. Find the backend, design, and pitch partners that complete your hackathon squad."',
        fixed: true
      }
    ],
    alignmentChecklist: [
      {
        check: 'Name to Value Proposition Alignment',
        status: 'pass',
        detail: '"Complement" directly communicates adding what is missing to make a complete whole.'
      },
      {
        check: 'Tagline to Problem Statement Alignment',
        status: 'pass',
        detail: '"Build teams around what you can actually do" directly combats chaotic Discord resume bluffing.'
      },
      {
        check: 'Personality to Voice Consistency',
        status: 'pass',
        detail: 'Hacker-native, 2 AM mentor tone cleanly reflects the Complementary-Obsessed trait.'
      },
      {
        check: 'Visual Palette to Audience Fit',
        status: 'pass',
        detail: 'Deep terminal dark background with violet & cyan accents matches late-night student hacker aesthetic without feeling corporate.'
      },
      {
        check: 'Launch Messaging Integrity',
        status: 'pass',
        detail: 'Launch kit social copy reinforces the resolved challenges and avoids banned buzzwords.'
      }
    ]
  },

  launchKit: {
    headline: 'Stop looking for a team. Find your complement.',
    subheadline: 'Complement AI matches student builders by verified stack gaps, work styles, and hackathon track ambitions in under 20 minutes.',
    cta: 'Assemble Your Squad For Next Hackathon',
    instagramPost: {
      caption: '3 AM hackathon reality check: 4 front-end devs who all love React, but nobody knows how to write a backend endpoint or pitch to judges. 💀\n\nWinning teams aren’t clones. They’re complements.\n\nMeet Complement AI: the capability-first matchmaking studio that assembles balanced squads who actually ship by Sunday.\n\nDrop your tech stack in the comments and find your missing half. 🚀',
      hashtags: ['#Hackathon', '#StudentDeveloper', '#DevCommunity', '#BuildInPublic', '#TechStudents', '#UIUX', '#ComplementAI'],
      visualConcept: 'Side-by-side terminal card: Left side shows "4 Frontend Devs = 0 Database", Right side shows "1 Fullstack + 1 UI/UX + 1 AI Engineer + 1 Pitch Lead = Shipped Project" with glowing cyan/violet accents.'
    },
    linkedInPost: {
      hook: '80% of hackathon teams that fail don’t fail because of bad ideas. They fail because of unbalanced teams.',
      body: 'Every hackathon weekend starts the same way:\n1. Chaotic Discord channels flooded with 500 copy-pasted resumes\n2. Awkward in-person mixers where introverted systems coders leave solo\n3. Friend groups teaming up with 4 identical skillsets\n\nBy hour 14, half the room is demoralized.\n\nThat’s why we built Complement AI.\n\nInstead of social popularity contests or corporate resume parsing, Complement AI matches builders on skill complementarity, sprint stamina, and track ambition.\n\nIn under 20 minutes, solo hackers and partial teams find the exact capabilities needed to ship a working product by Sunday morning.',
      callToAction: 'Try it free for your next hackathon at complement.ai — built by students, for builders.'
    },
    productHuntTeaser: {
      tagline: 'The capability-first squad builder for student hackathons',
      makerComment: 'Hey Hunter community! As student builders, we spent too many hackathons stuck in 4-frontend teams scrambling at midnight. We built Complement AI to turn chaotic Discord mixers into high-signal squad assembly. Would love your feedback on our skill-complementarity engine!'
    },
    pressBlurb: 'Complement AI is an intelligent brand and squad-formation studio designed to solve the perennial hackathon team imbalance. By matching collegiate developers and designers around capability complementarity rather than social popularity, the platform ensures every student builder finds the exact teammates needed to ship complete projects.',
    finalSummary: 'From a rough concept to a stress-tested, launch-ready brand system. The brand strategy has been challenged on generic clichés, purged of corporate fluff, visually mapped to late-night student culture, and validated for complete multi-channel consistency.'
  },

  createdAt: '2026-09-24T00:00:00.000Z',
  updatedAt: '2026-09-24T03:00:00.000Z'
};
