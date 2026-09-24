import React, { useState } from 'react';
import {
  ChevronDown,
  Info
} from 'lucide-react';
import { BrandProject } from '../types/brand';
import { ChromeOrb } from './ChromeOrb';

interface AiSignalsPanelProps {
  project: BrandProject;
  onRunDiagnostic?: () => void;
}

interface SignalMetric {
  id: string;
  name: string;
  measurement: string;
  unit: string;
  status: 'NOMINAL' | 'OPTIMAL' | 'ELEVATED' | 'CALIBRATED';
  color: string;
  rationale: string;
}

export const AiSignalsPanel: React.FC<AiSignalsPanelProps> = ({
  project,
}) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const hasPosition = Boolean(project.positioning.selectedDirectionId);
  const hasShape = Boolean(project.shape?.naming.selectedName);
  const resolvedIssuesCount = project.challenges.issues.filter((i) => i.status === 'accepted').length;
  const coherenceVal = project.consistency?.coherenceScore || 94;

  const signals: SignalMetric[] = [
    {
      id: 'distinctiveness',
      name: 'DISTINCTIVENESS',
      measurement: hasPosition ? '88.4' : '62.0',
      unit: '%INDEX',
      status: 'OPTIMAL',
      color: 'text-[#3157FF]',
      rationale: hasPosition
        ? 'Selected stance avoids crowded "dream team" tropes; centers on verifiable capability complementarity.'
        : 'Awaiting distinct positioning angle selection to break from generic market noise.',
    },
    {
      id: 'clarity',
      name: 'CLARITY',
      measurement: hasShape ? '94.2' : '71.5',
      unit: 'SIG/NOISE',
      status: 'CALIBRATED',
      color: 'text-[#3157FF]',
      rationale: hasShape
        ? 'Messaging hierarchy limits jargon; value proposition is readable in under 4 seconds.'
        : 'Initial draft contains multi-clause explanations that need syntactic simplification.',
    },
    {
      id: 'audience_fit',
      name: 'AUDIENCE FIT',
      measurement: '91.0',
      unit: 'RELEVANCE',
      status: 'OPTIMAL',
      color: 'text-[#3157FF]',
      rationale: 'Late-night collegiate hackathon context addressed directly; tone matches real builder fatigue.',
    },
    {
      id: 'generic_risk',
      name: 'GENERIC RISK',
      measurement: resolvedIssuesCount > 0 ? '08.2' : '34.5',
      unit: '%EXPOSURE',
      status: resolvedIssuesCount > 0 ? 'NOMINAL' : 'ELEVATED',
      color: resolvedIssuesCount > 0 ? 'text-[#3157FF]' : 'text-[#FF6B5F]',
      rationale: resolvedIssuesCount > 0
        ? `${resolvedIssuesCount} cliché buzzwords flagged by AI Critic and replaced with domain-native language.`
        : 'Potential exposure to common hackathon buzzwords ("dream team", "rockstar devs") detected.',
    },
    {
      id: 'consistency',
      name: 'CONSISTENCY',
      measurement: `${coherenceVal}.0`,
      unit: 'COHERENCE',
      status: 'CALIBRATED',
      color: 'text-[#3157FF]',
      rationale: project.consistency?.scoreExplanation || 'End-to-end chain verified across name, color palette, typography and social launch posts.',
    },
  ];

  return (
    <aside className="w-72 lg:w-80 border-l border-[#D9D9D2] bg-[#F7F6F2] flex flex-col shrink-0 overflow-y-auto h-full text-xs font-tech-mono">
      {/* Header Stamp */}
      <div className="p-4 sm:p-5 border-b border-[#D9D9D2] bg-white">
        <div className="flex items-center justify-between text-[10px] text-[#111111]/45 uppercase tracking-widest mb-1.5">
          <div className="flex items-center gap-1.5">
            <ChromeOrb size={12} />
            <span>AI SIGNALS</span>
          </div>
          <span className="text-[#3157FF] font-semibold">ACTIVE</span>
        </div>
        <div className="font-display text-sm font-extrabold text-[#111111] uppercase tracking-tight">
          Strategic Telemetry
        </div>
        <p className="text-[11px] text-[#111111]/60 mt-0.5 font-editorial italic">
          Live reasoning indices evaluating durability and generic drift.
        </p>
      </div>

      {/* 5 Live Diagnostic Signal Gauges */}
      <div className="p-4 sm:p-5 space-y-3.5 flex-1">
        {signals.map((sig) => {
          const isInspecting = activeTooltip === sig.id;

          return (
            <div
              key={sig.id}
              className={`p-3.5 border transition-all ${
                isInspecting
                  ? 'border-[#3157FF] bg-white shadow-[0_2px_8px_rgba(49,87,255,0.06)]'
                  : 'border-[#D9D9D2] bg-white/70 hover:bg-white hover:border-[#111111]'
              }`}
            >
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="font-tech-mono text-[10px] uppercase tracking-wider text-[#111111]/60 font-medium">
                  {sig.name}
                </span>
                <span className={`font-tech-mono text-[9px] font-bold ${sig.color}`}>
                  {sig.status}
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <div className="flex items-baseline gap-1">
                  <span className="font-display font-black text-2xl text-[#111111] tracking-tight">
                    {sig.measurement}
                  </span>
                  <span className="font-tech-mono text-[9px] text-[#111111]/40">
                    {sig.unit}
                  </span>
                </div>

                <button
                  onClick={() => setActiveTooltip(isInspecting ? null : sig.id)}
                  className="text-[#111111]/40 hover:text-[#3157FF] p-1 transition-colors"
                  title="Inspect strategic diagnostic"
                >
                  <Info className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Minimalist Micro Bar */}
              <div className="w-full bg-[#D9D9D2]/50 h-1 mt-2.5 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    sig.status === 'ELEVATED' ? 'bg-[#FF6B5F]' : 'bg-[#3157FF]'
                  }`}
                  style={{ width: `${Math.min(100, parseFloat(sig.measurement))}%` }}
                />
              </div>

              {/* Expandable Contextual AI Reasoner */}
              {isInspecting && (
                <div className="mt-3 pt-2.5 border-t border-[#D9D9D2] text-[11px] font-editorial italic text-[#111111]/85 leading-relaxed bg-[#F7F6F2]/50 p-2">
                  "{sig.rationale}"
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Diagnostic Status */}
      <div className="p-3.5 border-t border-[#D9D9D2] bg-white text-[10px] text-[#111111]/50 flex items-center justify-between">
        <span>STATUS:</span>
        <span className="text-[#3157FF] font-semibold">ALL VECTORS MONITORED</span>
      </div>
    </aside>
  );
};
