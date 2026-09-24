export type WorkflowStage =
  | 'discover'
  | 'position'
  | 'shape'
  | 'visualize'
  | 'challenge'
  | 'validate'
  | 'launch';

export interface InterviewQnA {
  id: string;
  question: string;
  options: string[];
  answer: string;
  reasoning?: string;
}

export interface BrandBrief {
  problem: string;
  targetAudience: string;
  userNeed: string;
  context: string;
  goal: string;
  constraints: string;
  initialInsight: string;
  openQuestions: string[];
}

export interface PositioningDirection {
  id: string;
  name: string;
  oneLiner: string;
  targetAudience: string;
  coreValue: string;
  differentiator: string;
  competitiveAngle: string;
  whyItWorks: string;
  potentialWeakness: string;
}

export interface BrandPersonalityTrait {
  trait: string;
  rationale: string;
}

export interface BrandPersonality {
  traits: BrandPersonalityTrait[];
  avoidTraits: BrandPersonalityTrait[];
}

export interface BrandNameProposal {
  name: string;
  meaning: string;
  rationale: string;
  personalityFit: string;
  audienceFit: string;
  potentialWeakness: string;
  memorabilityScore?: number | string;
}

export interface NamingTerritory {
  id: string;
  name: string;
  theme: string;
  names: BrandNameProposal[];
}

export interface NamingStudioData {
  territories: NamingTerritory[];
  selectedName: string | null;
  customName?: string;
}

export interface MessagingHierarchy {
  tagline: string;
  oneLinePitch: string;
  brandVoice: string;
  voicePrinciples: Array<{ do: string; dont: string; example?: string }>;
  keyMessage: string;
  supportingMessages: string[];
}

export interface ShapeData {
  personality: BrandPersonality;
  naming: NamingStudioData;
  messaging: MessagingHierarchy;
}

export interface ColorSwatch {
  name: string;
  hex: string;
  role: 'Dominant' | 'Secondary' | 'Accent' | 'Background' | 'Surface' | 'Neutral' | string;
  psychologicalMeaning?: string;
  psychology?: string;
}

export interface VisualDirectionData {
  logoDirection: {
    concept: string;
    symbolIdeas: string[];
    shapeLanguage: string;
    avoidConcepts: string[];
  };
  typography: {
    primaryDisplay: string;
    secondaryBody: string;
    fontPairingRationale: string;
    rule: string;
    headlineFont?: string;
    bodyFont?: string;
  };
  colorMood: {
    moodDescription: string;
    palette: ColorSwatch[];
  };
  imageryStyle: {
    artDirection: string;
    subjects: string[];
    composition: string;
    mood: string;
  };
  visualKeywords: string[];
  conceptsToAvoid: string[];
  palette?: ColorSwatch[];
  logoConcept?: {
    description: string;
    rationale: string;
  };
}

export type VisualizeData = VisualDirectionData;

export type ChallengeSeverity = 'CRITICAL' | 'WARNING' | 'SUGGESTION';

export interface ChallengeIssue {
  id: string;
  severity: ChallengeSeverity;
  category: string;
  issue: string;
  whyItMatters: string;
  evidence: string;
  suggestedImprovement: string;
  status: 'pending' | 'accepted' | 'rejected' | 'edited';
  userNote?: string;
}

export interface BrandBattleData {
  topic: string;
  advocateArgument: string;
  criticArgument: string;
  recommendation: string;
  appliedRevision?: string;
  decision?: 'kept' | 'applied';
}

export interface ConsistencyConflict {
  id: string;
  elementA?: string;
  elementB?: string;
  stageA?: string;
  stageB?: string;
  expected: string;
  detected: string;
  whyItConflicts: string;
  suggestedRevision?: string;
  suggestedFix?: string;
  fixed?: boolean;
  isFixed?: boolean;
}

export interface ConsistencyChecklistItem {
  check?: string;
  item?: string;
  status: 'pass' | 'warning' | 'fail';
  detail?: string;
  reasoning?: string;
}

export type AlignmentItem = ConsistencyChecklistItem;

export interface ConsistencyData {
  status: 'Aligned' | 'Needs Review' | 'Conflict';
  coherenceScore?: number;
  scoreExplanation: string;
  summary?: string;
  conflicts: ConsistencyConflict[];
  alignmentChecklist?: ConsistencyChecklistItem[];
  checklist?: ConsistencyChecklistItem[];
}

export interface LaunchKitData {
  headline: string;
  subheadline: string;
  cta: string;
  primaryCta?: string;
  secondaryCta?: string;
  founderPostLinkedIn?: string;
  landingHero?: {
    headline: string;
    subheadline: string;
    ctaButtonText: string;
    primaryCta?: string;
    secondaryCta?: string;
  };
  instagramPost: {
    caption: string;
    hashtags: string[];
    visualConcept?: string;
    visualDescription?: string;
  };
  linkedInPost: {
    hook: string;
    body: string;
    callToAction: string;
  };
  productHuntTeaser: {
    tagline: string;
    makerComment: string;
  };
  pressBlurb: string;
  pressReleaseBlurb?: string;
  finalSummary: string;
}

export interface BrandProject {
  id: string;
  projectName: string;
  roughIdea: string;
  targetAudience?: string;
  industry?: string;
  marketLocation?: string;
  constraints?: string;
  currentStage: WorkflowStage;
  completedStages: WorkflowStage[];
  
  // Stages data
  discovery: {
    interview: InterviewQnA[];
    currentQuestionIndex: number;
    brandBrief: BrandBrief | null;
  };
  positioning: {
    directions: PositioningDirection[];
    selectedDirectionId: string | null;
  };
  shape: ShapeData | null;
  visualize: VisualDirectionData | null;
  challenges: {
    issues: ChallengeIssue[];
    battle: BrandBattleData | null;
  };
  consistency: ConsistencyData | null;
  launchKit: LaunchKitData | null;
  
  createdAt: string;
  updatedAt: string;
}
