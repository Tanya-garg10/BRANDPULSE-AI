import React, { useState } from 'react';
import {
  ChevronDown,
  Check,
  Plus,
  Printer,
  Sparkles,
  RotateCcw,
  ArrowRight
} from 'lucide-react';
import { BrandProject, WorkflowStage } from '../types/brand';
import { ChromeOrb } from './ChromeOrb';

interface LabPipelineNavProps {
  activeProject: BrandProject;
  projects: BrandProject[];
  currentStage: WorkflowStage | 'dashboard';
  onNavigateStage: (stage: WorkflowStage | 'dashboard') => void;
  onSelectProject: (id: string) => void;
  onNewProject: () => void;
  onLoadBenchmark?: () => void;
  onOpenExport: () => void;
  onGoHome: () => void;
  isLanding?: boolean;
}

const EDITORIAL_STAGES: { id: WorkflowStage; num: string; label: string; sub: string }[] = [
  { id: 'discover', num: '01', label: 'DISCOVER', sub: 'Brief & Core' },
  { id: 'position', num: '02', label: 'POSITION', sub: 'Market Stance' },
  { id: 'shape', num: '03', label: 'SHAPE', sub: 'Name & Voice' },
  { id: 'visualize', num: '04', label: 'VISUALIZE', sub: 'Visual System' },
  { id: 'challenge', num: '05', label: 'CHALLENGE', sub: 'Battle & Audit' },
  { id: 'launch', num: '06', label: 'LAUNCH', sub: 'Brand Dossier' },
];

export const LabPipelineNav: React.FC<LabPipelineNavProps> = ({
  activeProject,
  projects,
  currentStage,
  onNavigateStage,
  onSelectProject,
  onNewProject,
  onLoadBenchmark,
  onOpenExport,
  onGoHome,
  isLanding = false,
}) => {
  const [projectMenuOpen, setProjectMenuOpen] = useState(false);

  return (
    <header className="border-b border-[#D9D9D2] bg-[#F7F6F2] sticky top-0 z-40 transition-colors">
      {/* Top Refined Utility Bar */}
      <div className="flex items-center justify-between px-4 sm:px-8 py-2.5 border-b border-[#D9D9D2]/70 text-xs">
        {/* Brand Studio Mark */}
        <div className="flex items-center gap-3">
          <button
            onClick={onGoHome}
            className="flex items-center gap-2.5 group text-left transition-opacity hover:opacity-80"
          >
            <ChromeOrb size={22} />
            <div className="flex items-baseline gap-2">
              <span className="font-display font-bold text-sm tracking-tight text-[#111111] uppercase">
                BRANDPULSE AI
              </span>
              <span className="hidden sm:inline font-tech-mono text-[10px] text-[#111111]/40 uppercase tracking-widest">
                / EDITORIAL STUDIO
              </span>
            </div>
          </button>
        </div>

        {/* Project Selector & Refined Studio Actions */}
        <div className="flex items-center gap-2 sm:gap-3 font-tech-mono text-xs">
          {/* Project Switcher */}
          <div className="relative">
            <button
              onClick={() => setProjectMenuOpen(!projectMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 border border-[#D9D9D2] bg-white hover:border-[#111111] text-[#111111] transition-all"
            >
              <span className="text-[10px] text-[#111111]/45 uppercase">PROJECT:</span>
              <span className="font-semibold text-xs truncate max-w-[140px]">
                {activeProject.shape?.naming.selectedName || activeProject.projectName}
              </span>
              <ChevronDown className="h-3 w-3 text-[#111111]/50" />
            </button>

            {projectMenuOpen && (
              <div className="absolute right-0 mt-1 w-64 border border-[#D9D9D2] bg-white shadow-[0_8px_20px_rgba(17,17,17,0.06)] z-50 p-2 space-y-1">
                <div className="text-[10px] font-semibold text-[#111111]/45 uppercase px-2 py-1">
                  Active Projects
                </div>
                {projects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelectProject(p.id);
                      setProjectMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 text-xs flex items-center justify-between transition-colors ${
                      p.id === activeProject.id
                        ? 'bg-[#3157FF]/10 text-[#3157FF] font-semibold'
                        : 'hover:bg-[#F7F6F2] text-[#111111]'
                    }`}
                  >
                    <span className="truncate">{p.shape?.naming.selectedName || p.projectName}</span>
                    {p.id === activeProject.id && <span className="h-1.5 w-1.5 rounded-full bg-[#3157FF]" />}
                  </button>
                ))}

                <div className="border-t border-[#D9D9D2] pt-1.5 mt-1.5 space-y-1">
                  <button
                    onClick={() => {
                      onNewProject();
                      setProjectMenuOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-[#3157FF] font-semibold hover:bg-[#3157FF]/5 transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="h-3 w-3" />
                    <span>+ New Brand Project</span>
                  </button>

                  {onLoadBenchmark && (
                    <button
                      onClick={() => {
                        onLoadBenchmark();
                        setProjectMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-[#111111]/70 hover:text-[#111111] hover:bg-[#F7F6F2] transition-colors flex items-center gap-1.5"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>Load Benchmark (TeamMatch)</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Clean Export Button */}
          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111111] hover:bg-[#3157FF] text-white text-[11px] font-semibold uppercase tracking-wider transition-colors"
          >
            <Printer className="h-3 w-3 text-white" />
            <span className="hidden sm:inline">Dossier</span>
          </button>
        </div>
      </div>

      {/* Horizontal Editorial Timeline (6 Stages) */}
      <nav className="overflow-x-auto no-scrollbar px-4 sm:px-8 bg-white/60">
        <div className="flex items-stretch min-w-max">
          {EDITORIAL_STAGES.map((stage) => {
            const isCurrent = currentStage === stage.id;
            const isCompleted = activeProject.completedStages.includes(stage.id);

            return (
              <button
                key={stage.id}
                onClick={() => onNavigateStage(stage.id)}
                className={`flex-1 min-w-[130px] sm:min-w-[150px] py-2.5 px-4 text-left border-r border-[#D9D9D2] transition-all relative group ${
                  isCurrent
                    ? 'bg-white'
                    : isCompleted
                    ? 'hover:bg-white/80'
                    : 'opacity-70 hover:opacity-100 hover:bg-white/40'
                }`}
              >
                {/* Active/Completed Indicator line */}
                {isCurrent && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#3157FF]" />
                )}

                <div className="flex items-center justify-between font-tech-mono text-[9px] mb-0.5">
                  <span className={isCurrent ? 'text-[#3157FF] font-bold' : 'text-[#111111]/45'}>
                    {stage.num}
                  </span>
                  {/* Subtle cobalt indicator for completed stages */}
                  {isCompleted && (
                    <span
                      className="inline-block h-1.5 w-1.5 rounded-full bg-[#3157FF]"
                      title="Stage completed"
                    />
                  )}
                </div>

                <div className="font-display font-bold text-xs uppercase tracking-tight text-[#111111]">
                  {stage.label}
                </div>

                <div className="text-[10px] text-[#111111]/50 font-editorial italic truncate">
                  {stage.sub}
                </div>
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
