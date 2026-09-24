import React, { useState } from 'react';
import {
  CheckCheck,
  Sparkles,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Layers,
  ChevronRight,
  Check,
  Cpu,
  Scan,
  Zap
} from 'lucide-react';
import {
  BrandProject,
  ConsistencyData,
  ConsistencyConflict
} from '../../types/brand';
import { runConsistencyGuardian } from '../../services/api';

interface ValidateStageProps {
  project: BrandProject;
  onUpdateProject: (updated: BrandProject) => void;
  onContinue: () => void;
}

interface XRayNode {
  id: string;
  name: string;
  label: string;
  status: 'pass' | 'warning' | 'fail';
  summary: string;
  details?: string;
  suggestedFix?: string;
  isFixed?: boolean;
}

export const ValidateStage: React.FC<ValidateStageProps> = ({
  project,
  onUpdateProject,
  onContinue,
}) => {
  const [consistency, setConsistency] = useState<ConsistencyData | null>(
    project.consistency || null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeXrayNode, setActiveXrayNode] = useState<string>('personality');
  const [fixedNodes, setFixedNodes] = useState<Record<string, boolean>>({});

  // 6 Primary Brand X-Ray diagnostic facets specified by user
  const initialXrayNodes: XRayNode[] = [
    {
      id: 'name',
      name: 'NAME',
      label: 'Brand Identity Mark',
      status: 'pass',
      summary: 'High memorability and phonetically sharp. Free of generic Silicon Valley suffixes.',
      details: 'The name "TeamMatch" (or active territory) is crisp and communicates function immediately without overpromising.',
    },
    {
      id: 'tagline',
      name: 'TAGLINE',
      label: 'Primary Verbal Hook',
      status: 'pass',
      summary: 'Direct contrastive promise ("Build with people who complete your skills, not just your friends").',
      details: 'Strictly avoids cliché verbs like "empower", "unlock", or "streamline". Sets an honest, pragmatic tone.',
    },
    {
      id: 'personality',
      name: 'PERSONALITY',
      label: 'Archetype Alignment',
      status: 'warning',
      summary: 'Your visual tone feels playful, but your messaging sounds corporate.',
      details: 'Detected slight tonal tension between informal developer slang in the Discovery Brief and institutional phrasing in the corporate messaging principles.',
      suggestedFix: 'Tone down legalistic language in messaging; align with the pragmatic, hacker-native voice defined in Stage 03.',
    },
    {
      id: 'visual',
      name: 'VISUAL',
      label: 'Chromatic & Typographic Rules',
      status: 'pass',
      summary: 'Deep obsidian backdrop with electric accent and high-contrast monospace tabular metadata.',
      details: 'Meets WCAG AA accessibility contrast ratios; typography pairs Newsreader with Plus Jakarta Sans and JetBrains Mono.',
    },
    {
      id: 'messaging',
      name: 'MESSAGING',
      label: 'Value Delivery Rhythm',
      status: 'warning',
      summary: 'Key landing headline implies automated teammate assignment, while value proposition promises builder autonomy.',
      details: 'Audience testing signals suggest collegiate hackers resist algorithmic assignments; they want autonomous mutual-opt-in.',
      suggestedFix: 'Clarify that AI provides compatibility intelligence while humans maintain final selection sovereignty.',
    },
    {
      id: 'audience',
      name: 'AUDIENCE',
      label: 'Relevance to Technical Builders',
      status: 'pass',
      summary: 'Speaks directly to solo developers facing 48-hour sprint deadlines.',
      details: 'Acknowledges late-night hackathon stressors, complementary skill voids, and project abandonment rates.',
    },
  ];

  const handleFixWithAi = (nodeId: string) => {
    setFixedNodes((prev) => ({ ...prev, [nodeId]: true }));
    // Update project state with resolved conflict
    if (project.consistency) {
      const updatedConflicts = (project.consistency.conflicts || []).map((c) => ({
        ...c,
        fixed: true,
        isFixed: true,
      }));
      const updatedConsistency: ConsistencyData = {
        ...project.consistency,
        coherenceScore: Math.min(99, (project.consistency.coherenceScore || 94) + 3),
        conflicts: updatedConflicts,
      };
      onUpdateProject({
        ...project,
        consistency: updatedConsistency,
        completedStages: Array.from(new Set([...project.completedStages, 'validate'])),
      });
    }
  };

  const handleRunAudit = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const result = await runConsistencyGuardian(project);
      setConsistency(result);
      onUpdateProject({
        ...project,
        consistency: result,
        completedStages: Array.from(new Set([...project.completedStages, 'validate'])),
      });
    } catch (err: any) {
      console.error('Error running audit:', err);
      setErrorMessage(err.message || 'Failed to complete consistency audit');
    } finally {
      setLoading(false);
    }
  };

  const activeNode = initialXrayNodes.find((n) => n.id === activeXrayNode) || initialXrayNodes[2];
  const isNodeFixed = fixedNodes[activeNode.id];
  const activeStatus = isNodeFixed ? 'pass' : activeNode.status;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header Stamp */}
      <div className="border-b border-[#0A1128]/15 pb-6">
        <div className="flex items-center justify-between font-tech-mono text-[11px] uppercase tracking-wider text-[#0A1128]/60 mb-1">
          <span className="text-[#16A34A] font-bold">06 / VALIDATE</span>
          <span>DIAGNOSTIC PROTOCOL // BRAND_X_RAY</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#0A1128]">
              BRAND X-RAY: SYSTEM COHERENCE AUDIT
            </h1>
            <p className="font-editorial text-sm sm:text-base text-[#0A1128]/75 mt-1 italic max-w-2xl">
              Cross-examining all 6 brand facets for tonal dissonance, semantic contradictions, and execution gaps.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleRunAudit}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-[#0A1128]/20 bg-white hover:border-[#0A1128] text-xs font-tech-mono uppercase text-[#0A1128] transition-colors"
            >
              <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
              <span>Re-Scan Brand X-Ray</span>
            </button>

            <button
              onClick={onContinue}
              className="flex items-center gap-1.5 bg-[#FF4400] hover:bg-[#0A1128] text-white px-4 py-1.5 text-xs font-tech-mono uppercase font-bold tracking-wider transition-colors"
            >
              <span>Unlock Launch Kit</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 border border-[#DC2626] bg-[#DC2626]/10 text-xs font-tech-mono text-[#DC2626]">
          [ERROR]: {errorMessage}
        </div>
      )}

      {loading && (
        <div className="lab-card p-12 border border-[#0A1128]/15 text-center space-y-3">
          <Scan className="h-7 w-7 text-[#16A34A] animate-pulse mx-auto" />
          <h3 className="font-display text-base font-bold uppercase text-[#0A1128]">
            Running full-system Brand X-Ray scan...
          </h3>
          <p className="font-editorial text-xs text-[#0A1128]/60 max-w-md mx-auto italic">
            Auditing cross-stage alignment across Name, Tagline, Personality, Visuals, Messaging and Audience.
          </p>
        </div>
      )}

      {/* Brand X-Ray Diagnostic Display */}
      <div className="space-y-6">
        {/* Top Diagnostic Facet Bar */}
        <div className="lab-card p-4 border-2 border-[#0A1128] bg-white">
          <div className="flex items-center justify-between border-b border-[#0A1128]/10 pb-2 mb-3 text-[11px] font-tech-mono uppercase text-[#0A1128]/60">
            <span className="font-bold text-[#0A1128]">BRAND X-RAY SENSOR ARRAY</span>
            <span>CLICK ANY FACET TO INSPECT / RESOLVE</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {initialXrayNodes.map((node) => {
              const fixed = fixedNodes[node.id];
              const st = fixed ? 'pass' : node.status;
              const isSelected = activeXrayNode === node.id;

              return (
                <button
                  key={node.id}
                  onClick={() => setActiveXrayNode(node.id)}
                  className={`p-3 border text-left transition-all relative ${
                    isSelected
                      ? 'border-2 border-[#FF4400] bg-[#F6F5F0]'
                      : 'border-[#0A1128]/15 bg-white hover:border-[#0A1128]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-display font-black text-sm uppercase text-[#0A1128]">
                      {node.name}
                    </span>
                    <span className="font-tech-mono text-xs font-bold">
                      {st === 'pass' ? (
                        <span className="text-[#16A34A]">✓</span>
                      ) : (
                        <span className="text-[#FF4400] animate-pulse">⚠</span>
                      )}
                    </span>
                  </div>
                  <div className="text-[10px] font-tech-mono uppercase text-[#0A1128]/50 truncate">
                    {st === 'pass' ? 'ALIGNED' : 'FRICTION'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Facet Inspection Card */}
        <div className="lab-card p-6 border-2 border-[#0A1128] bg-white space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#0A1128]/10 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-xl text-[#0A1128] uppercase tracking-tight">
                  {activeNode.name}
                </span>
                <span className="font-tech-mono text-xs text-[#0A1128]/60 uppercase">
                  // {activeNode.label}
                </span>
                <span className={`px-2 py-0.5 text-[10px] font-tech-mono font-bold uppercase ${
                  activeStatus === 'pass'
                    ? 'bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/30'
                    : 'bg-[#FF4400]/10 text-[#FF4400] border border-[#FF4400]/30'
                }`}>
                  {activeStatus === 'pass' ? '✓ SYSTEM ALIGNED' : '⚠ FRICTION DETECTED'}
                </span>
              </div>
            </div>

            <div className="font-tech-mono text-xs text-[#0A1128]/60">
              COHERENCE INDEX: <span className="font-bold text-[#0A1128]">{consistency?.coherenceScore ?? 94}/100</span>
            </div>
          </div>

          {/* Diagnostic finding */}
          <div className="space-y-2">
            <span className="font-tech-mono text-[10px] text-[#0A1128]/60 uppercase block">
              DIAGNOSTIC FINDING:
            </span>
            <p className="font-editorial text-base text-[#0A1128] font-medium leading-relaxed">
              "{activeNode.summary}"
            </p>
            {activeNode.details && (
              <p className="text-xs text-[#0A1128]/75 leading-relaxed font-sans">
                {activeNode.details}
              </p>
            )}
          </div>

          {/* If Warning: Suggested Harmonization & FIX WITH AI action */}
          {activeStatus === 'warning' && activeNode.suggestedFix && (
            <div className="bg-[#EFECE6] p-4 border border-[#0A1128]/20 space-y-3 mt-4">
              <div>
                <span className="font-tech-mono text-[10px] uppercase text-[#FF4400] font-bold block mb-1">
                  SUGGESTED HARMONIZATION REVISION:
                </span>
                <p className="font-editorial text-sm text-[#0A1128] italic">
                  "{activeNode.suggestedFix}"
                </p>
              </div>

              <div className="pt-2 border-t border-[#0A1128]/10 flex items-center justify-between">
                <span className="text-[11px] font-tech-mono text-[#0A1128]/60">
                  Ready to align with active Brand DNA rules
                </span>
                <button
                  type="button"
                  onClick={() => handleFixWithAi(activeNode.id)}
                  className="flex items-center gap-2 bg-[#FF4400] hover:bg-[#0A1128] text-white px-5 py-2 font-tech-mono text-xs uppercase font-bold tracking-wider transition-colors shadow-sm"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>FIX WITH AI →</span>
                </button>
              </div>
            </div>
          )}

          {activeStatus === 'pass' && (
            <div className="bg-[#16A34A]/5 p-3.5 border border-[#16A34A]/20 flex items-center gap-2 text-xs font-tech-mono text-[#16A34A]">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>NO FRICTION DETECTED. Brand facet is fully harmonized with active positioning stance.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
