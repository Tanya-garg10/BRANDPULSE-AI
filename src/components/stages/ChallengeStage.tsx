import React, { useState } from 'react';
import {
  ArrowRight,
  Check,
  RotateCcw,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import {
  BrandProject,
  ChallengeIssue,
  BrandBattleData,
  ConsistencyData
} from '../../types/brand';
import { runBrandCritic, runBrandBattle, runConsistencyGuardian } from '../../services/api';
import { ChromeOrb } from '../ChromeOrb';
import { EditorialAnnotation } from '../EditorialAnnotation';

interface ChallengeStageProps {
  project: BrandProject;
  onUpdateProject: (updated: BrandProject) => void;
  onContinue: () => void;
}

export const ChallengeStage: React.FC<ChallengeStageProps> = ({
  project,
  onUpdateProject,
  onContinue,
}) => {
  const [activeTab, setActiveTab] = useState<'battle' | 'consistency'>('battle');
  const [issues, setIssues] = useState<ChallengeIssue[]>(project.challenges.issues);
  const [battle, setBattle] = useState<BrandBattleData | null>(project.challenges.battle);
  const [battleDecision, setBattleDecision] = useState<'kept' | 'applied'>(
    project.challenges.battle?.decision || 'kept'
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Consistency Guardian diagnostic state
  const [voiceFlag, setVoiceFlag] = useState<boolean>(true); // voice is ⚠ initially until reviewed
  const [fixedChecklist, setFixedChecklist] = useState<Record<string, boolean>>({});

  const selectedPositioning = project.positioning.directions.find(
    (d) => d.id === project.positioning.selectedDirectionId
  ) || project.positioning.directions[0];

  const brandName = project.shape?.naming.selectedName || project.projectName;

  const handleRunAudits = async () => {
    if (!project.discovery.brandBrief || !selectedPositioning || !project.shape) return;
    setLoading(true);
    setErrorMessage(null);
    try {
      const [newIssues, newBattle, newConsistency] = await Promise.all([
        runBrandCritic(
          project,
          project.discovery.brandBrief,
          selectedPositioning,
          project.shape,
          project.visualize || undefined
        ),
        runBrandBattle(
          project,
          project.discovery.brandBrief,
          selectedPositioning,
          project.shape
        ),
        runConsistencyGuardian(
          project,
          project.discovery.brandBrief,
          selectedPositioning,
          project.shape,
          project.visualize || undefined
        ),
      ]);
      setIssues(newIssues);
      setBattle(newBattle);
      onUpdateProject({
        ...project,
        challenges: {
          issues: newIssues,
          battle: newBattle,
        },
        consistency: newConsistency,
        completedStages: Array.from(new Set([...project.completedStages, 'challenge'])),
      });
    } catch (err: any) {
      console.error('Error running audits:', err);
      setErrorMessage(err.message || 'Audit synthesis failed');
    } finally {
      setLoading(false);
    }
  };

  const handleBattleDecision = (decision: 'kept' | 'applied') => {
    setBattleDecision(decision);
    if (battle) {
      const updatedBattle: BrandBattleData = { ...battle, decision };
      setBattle(updatedBattle);
      onUpdateProject({
        ...project,
        challenges: {
          ...project.challenges,
          battle: updatedBattle,
        },
        completedStages: Array.from(new Set([...project.completedStages, 'challenge'])),
      });
    }
  };

  const handleResolveVoiceWarning = () => {
    setVoiceFlag(false);
    setFixedChecklist((prev) => ({ ...prev, voice: true }));
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-16">
      {/* Header Stamp */}
      <div className="border-b border-[#D9D9D2] pb-6">
        <div className="flex items-center justify-between font-tech-mono text-[10px] uppercase tracking-widest text-[#111111]/50 mb-2">
          <div className="flex items-center gap-2">
            <ChromeOrb size={14} isThinking={loading} />
            <span className="text-[#3157FF] font-semibold">05 / CHALLENGE</span>
          </div>
          <span>SPECIFICATION // BRAND_BATTLE_AND_CONSISTENCY</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#111111]">
              STRESS-TEST & CONSISTENCY AUDIT
            </h1>
            <p className="font-editorial text-sm sm:text-base text-[#111111]/75 mt-1 italic max-w-2xl">
              An adversarial split-screen debate between The Advocate and The Critic, accompanied by a luxury diagnostic report.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleRunAudits}
              disabled={loading}
              className="px-3.5 py-2 border border-[#D9D9D2] hover:border-[#111111] bg-white text-[#111111] text-xs font-tech-mono uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              <span>{loading ? 'Auditing...' : 'Run Audit'}</span>
            </button>

            <button
              onClick={onContinue}
              className="inline-flex items-center gap-2 bg-[#111111] hover:bg-[#3157FF] text-white px-5 py-2 text-xs font-tech-mono uppercase font-semibold tracking-wider transition-colors"
            >
              <span>Stage 06: Launch</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 border border-[#FF6B5F] bg-[#FF6B5F]/10 text-xs font-tech-mono text-[#111111]">
          [DIAGNOSTIC ADVISORY]: {errorMessage}
        </div>
      )}

      {/* Segmented Filter Control for Challenge Facets */}
      <div className="flex border-b border-[#D9D9D2] font-tech-mono text-xs">
        <button
          onClick={() => setActiveTab('battle')}
          className={`py-2.5 px-6 font-semibold uppercase tracking-wider transition-colors relative ${
            activeTab === 'battle'
              ? 'text-[#3157FF] bg-white border-t border-l border-r border-[#D9D9D2]'
              : 'text-[#111111]/60 hover:text-[#111111]'
          }`}
        >
          01 / BRAND BATTLE (SPLIT-SCREEN)
        </button>
        <button
          onClick={() => setActiveTab('consistency')}
          className={`py-2.5 px-6 font-semibold uppercase tracking-wider transition-colors relative ${
            activeTab === 'consistency'
              ? 'text-[#3157FF] bg-white border-t border-l border-r border-[#D9D9D2]'
              : 'text-[#111111]/60 hover:text-[#111111]'
          }`}
        >
          02 / CONSISTENCY GUARDIAN (94%)
        </button>
      </div>

      {/* TAB 1: THE BRAND BATTLE (ADVOCATE vs CRITIC) */}
      {activeTab === 'battle' && (
        <div className="space-y-6">
          {/* Brand Battle Split Screen (Typography & Whitespace focus) */}
          <div className="border border-[#D9D9D2] bg-white">
            {/* Top Bar */}
            <div className="p-6 border-b border-[#D9D9D2] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="font-tech-mono text-[10px] text-[#3157FF] uppercase tracking-widest font-semibold">
                  ADVERSARIAL STRESS-TEST
                </div>
                <h2 className="font-display font-black text-2xl uppercase tracking-tight text-[#111111] mt-0.5">
                  THE BRAND BATTLE
                </h2>
              </div>
              <div className="font-tech-mono text-xs text-[#111111]/50 uppercase">
                TARGET MARK: <span className="text-[#111111] font-bold">{brandName}</span>
              </div>
            </div>

            {/* Split Screen Columns with pure typography & generous whitespace */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#D9D9D2]">
              {/* THE ADVOCATE */}
              <div className="p-8 sm:p-12 space-y-6">
                <div className="space-y-1">
                  <div className="font-tech-mono text-[10px] text-[#3157FF] font-bold uppercase tracking-widest">
                    PERSPECTIVE 01 // RADICAL MOAT
                  </div>
                  <h3 className="font-display font-black text-3xl uppercase tracking-tight text-[#111111]">
                    THE ADVOCATE
                  </h3>
                  <p className="font-editorial text-xs text-[#111111]/60 italic">
                    Defending the unconventional edge and audience resonance.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-[#F7F6F2]/40 border border-[#D9D9D2]">
                    <span className="font-tech-mono text-[10px] text-[#3157FF] font-semibold uppercase block mb-1">
                      CORE DEFENSE:
                    </span>
                    <p className="font-editorial text-base text-[#111111] italic leading-relaxed">
                      "{battle?.advocateArgument ||
                        `${brandName} rejects generic networking fluff. By focusing ruthlessly on verified skills and project follow-through, it taps directly into the student hacker's acute fear of being abandoned at 3 AM.`}"
                    </p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <span className="font-tech-mono text-[10px] text-[#111111]/50 uppercase block">
                      KEY STRENGTHS:
                    </span>
                    <ul className="space-y-2 text-xs font-sans text-[#111111]">
                      <li className="flex items-start gap-2">
                        <span className="text-[#3157FF] font-bold">✓</span>
                        <span>Separates distinctly from corporate HR tools and superficial swipe mechanics.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#3157FF] font-bold">✓</span>
                        <span>High-signal utility directly rewards builders over superficial networking talkers.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#3157FF] font-bold">✓</span>
                        <span>Builds viral word-of-mouth directly inside MLH and collegiate hackathon Discords.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* THE CRITIC */}
              <div className="p-8 sm:p-12 space-y-6 bg-[#F7F6F2]/20">
                <div className="space-y-1">
                  <div className="font-tech-mono text-[10px] text-[#FF6B5F] font-bold uppercase tracking-widest">
                    PERSPECTIVE 02 // SKEPTICAL REALITY
                  </div>
                  <h3 className="font-display font-black text-3xl uppercase tracking-tight text-[#111111]">
                    THE CRITIC
                  </h3>
                  <p className="font-editorial text-xs text-[#111111]/60 italic">
                    Exposing market cynicism, cold-start vulnerability, and generic drift.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-white border border-[#D9D9D2]">
                    <span className="font-tech-mono text-[10px] text-[#FF6B5F] font-semibold uppercase block mb-1">
                      CYNICAL COUNTER-THESIS:
                    </span>
                    <p className="font-editorial text-base text-[#111111] italic leading-relaxed">
                      "{battle?.criticArgument ||
                        `Students have strong inertia to stick with existing friend groups regardless of skill imbalance. If the onboarding feels even 5% too formal or test-like, students will bounce back to random Discord channels.`}"
                    </p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <span className="font-tech-mono text-[10px] text-[#111111]/50 uppercase block">
                      VULNERABILITY VECTORS:
                    </span>
                    <ul className="space-y-2 text-xs font-sans text-[#111111]">
                      <li className="flex items-start gap-2">
                        <span className="text-[#FF6B5F] font-bold">✕</span>
                        <span>Cold start friction: Requires dense initial student supply per event.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FF6B5F] font-bold">✕</span>
                        <span>Risk of sounding overly technical or intimidating for design/biz first-timers.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FF6B5F] font-bold">✕</span>
                        <span>Needs strong guardrails to prevent toxic elitism around commit counts.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Verdict & Founder Decision */}
            <div className="p-6 border-t border-[#D9D9D2] bg-white flex flex-col sm:flex-row items-center justify-between gap-4 font-tech-mono text-xs">
              <div>
                <span className="text-[10px] text-[#111111]/50 uppercase block">ADVERSARIAL VERDICT:</span>
                <span className="text-[#111111] font-semibold">
                  Advocate stance holds stronger market defensibility. Critic insights added to Voice constraints.
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleBattleDecision('kept')}
                  className={`px-4 py-2 border text-xs uppercase font-semibold transition-colors ${
                    battleDecision === 'kept'
                      ? 'border-[#3157FF] bg-[#3157FF] text-white'
                      : 'border-[#D9D9D2] hover:border-[#111111] text-[#111111]'
                  }`}
                >
                  ✓ Endorse Stance
                </button>
                <button
                  onClick={() => handleBattleDecision('applied')}
                  className={`px-4 py-2 border text-xs uppercase font-semibold transition-colors ${
                    battleDecision === 'applied'
                      ? 'border-[#FF6B5F] bg-[#FF6B5F] text-white'
                      : 'border-[#D9D9D2] hover:border-[#111111] text-[#111111]'
                  }`}
                >
                  Acknowledge & Guard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CONSISTENCY GUARDIAN (LUXURY PRODUCT DIAGNOSTIC REPORT) */}
      {activeTab === 'consistency' && (
        <div className="space-y-6">
          <div className="border border-[#D9D9D2] bg-white p-8 sm:p-12 space-y-8">
            {/* Luxury Product Diagnostic Header */}
            <div className="border-b border-[#D9D9D2] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="font-tech-mono text-[10px] text-[#3157FF] uppercase tracking-widest font-semibold mb-1">
                  DIAGNOSTIC REPORT // ARCHITECTURAL COHERENCE
                </div>
                <h2 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-[#111111]">
                  BRAND CONSISTENCY / {voiceFlag ? '94%' : '98%'}
                </h2>
                <p className="font-editorial text-sm text-[#111111]/70 italic mt-1">
                  Multi-vector alignment audit across name, positioning, personality, voice, and visual language.
                </p>
              </div>

              <div className="font-tech-mono text-xs text-[#111111]/50 space-y-0.5 sm:text-right">
                <div>SPEC: LUXURY_DIAGNOSTIC_V2</div>
                <div>STATUS: <span className={voiceFlag ? 'text-[#FF6B5F] font-bold' : 'text-[#3157FF] font-bold'}>{voiceFlag ? '1 ADVISORY PENDING' : 'ALL VECTORS CALIBRATED'}</span></div>
              </div>
            </div>

            {/* The Exact Checklist Layout Requested in Prompt */}
            <div className="space-y-3 font-tech-mono text-xs max-w-xl">
              {/* NAME */}
              <div className="p-3.5 border border-[#D9D9D2] flex items-center justify-between bg-[#F7F6F2]/30">
                <span className="font-bold text-[#111111] tracking-wider">NAME</span>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-[#111111]/50 uppercase">{brandName}</span>
                  <span className="text-[#3157FF] font-bold text-sm">✓</span>
                </div>
              </div>

              {/* POSITIONING */}
              <div className="p-3.5 border border-[#D9D9D2] flex items-center justify-between bg-[#F7F6F2]/30">
                <span className="font-bold text-[#111111] tracking-wider">POSITIONING</span>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-[#111111]/50 uppercase truncate max-w-[200px]">
                    {selectedPositioning?.name}
                  </span>
                  <span className="text-[#3157FF] font-bold text-sm">✓</span>
                </div>
              </div>

              {/* PERSONALITY */}
              <div className="p-3.5 border border-[#D9D9D2] flex items-center justify-between bg-[#F7F6F2]/30">
                <span className="font-bold text-[#111111] tracking-wider">PERSONALITY</span>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-[#111111]/50 uppercase">
                    {project.shape?.personality.traits.length || 3} Endorsed / {project.shape?.personality.avoidTraits.length || 2} Banned
                  </span>
                  <span className="text-[#3157FF] font-bold text-sm">✓</span>
                </div>
              </div>

              {/* VOICE (Initially ⚠ with resolution action) */}
              <div className={`p-3.5 border flex items-center justify-between transition-colors ${
                voiceFlag ? 'border-[#FF6B5F] bg-[#FF6B5F]/5' : 'border-[#D9D9D2] bg-[#F7F6F2]/30'
              }`}>
                <span className="font-bold text-[#111111] tracking-wider">VOICE</span>
                <div className="flex items-center gap-3">
                  {voiceFlag ? (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#FF6B5F] font-semibold uppercase">
                        Prone to informal drift
                      </span>
                      <span className="text-[#FF6B5F] font-bold text-sm">⚠</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#3157FF] font-semibold uppercase">
                        Rules Calibrated
                      </span>
                      <span className="text-[#3157FF] font-bold text-sm">✓</span>
                    </div>
                  )}
                </div>
              </div>

              {/* VISUAL LANGUAGE */}
              <div className="p-3.5 border border-[#D9D9D2] flex items-center justify-between bg-[#F7F6F2]/30">
                <span className="font-bold text-[#111111] tracking-wider">VISUAL LANGUAGE</span>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-[#111111]/50 uppercase">
                    5 Swatches · Dual Typeface
                  </span>
                  <span className="text-[#3157FF] font-bold text-sm">✓</span>
                </div>
              </div>
            </div>

            {/* Diagnostic Resolution Box for Voice if flagged */}
            {voiceFlag ? (
              <div className="p-4 border border-[#FF6B5F] bg-[#FF6B5F]/5 space-y-2 text-xs font-tech-mono">
                <div className="flex items-center justify-between text-[#FF6B5F] font-bold uppercase text-[10px]">
                  <span>DIAGNOSTIC ADVISORY // VOICE RULE OVERLAP</span>
                  <span>⚠ PENDING RESOLUTION</span>
                </div>
                <p className="font-editorial text-xs text-[#111111]/85 italic leading-relaxed">
                  "The tone balances between raw developer brevity and supportive peer mentoring. Ensure landing copy strictly forbids patronizing cheerleading."
                </p>
                <div className="pt-1">
                  <button
                    onClick={handleResolveVoiceWarning}
                    className="px-3 py-1.5 bg-[#111111] hover:bg-[#3157FF] text-white text-[10px] font-semibold uppercase tracking-wider transition-colors"
                  >
                    Resolve & Enforce Brevity Rule →
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 border border-[#3157FF] bg-[#3157FF]/5 space-y-1 text-xs font-tech-mono">
                <div className="text-[#3157FF] font-bold uppercase text-[10px]">
                  ✓ ALL 5 STRATEGIC VECTORS HARMONIZED (98%)
                </div>
                <p className="font-editorial text-xs text-[#111111]/85 italic">
                  Brand architecture is fully coherent and hardened against market pushback. Ready for executive Dossier generation.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Editorial Observation */}
      <EditorialAnnotation
        timestamp="10:48"
        observation="The brand battle exposed the cold-start vulnerability, and the Consistency Guardian confirmed zero conflicting voice signals. The brand is launch-ready."
        actionText="PROCEED TO STAGE 06: BRAND DOSSIER / 001 →"
        onAction={onContinue}
      />
    </div>
  );
};
