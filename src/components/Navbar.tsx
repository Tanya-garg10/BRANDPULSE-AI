import React from 'react';
import { 
  Sparkles, 
  FolderGit2, 
  PlayCircle, 
  RotateCcw, 
  Printer, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  Home,
  PlusCircle
} from 'lucide-react';
import { BrandProject, WorkflowStage } from '../types/brand';

interface NavbarProps {
  activeProject: BrandProject;
  projects: BrandProject[];
  onSelectProject: (id: string) => void;
  onNewProject: () => void;
  onLoadDemo: () => void;
  onNavigateStage: (stage: WorkflowStage) => void;
  onOpenExport: () => void;
  onGoHome: () => void;
  isLanding: boolean;
}

const STAGES: { id: WorkflowStage; label: string; number: string }[] = [
  { id: 'discover', label: 'Discover', number: '01' },
  { id: 'position', label: 'Position', number: '02' },
  { id: 'shape', label: 'Shape', number: '03' },
  { id: 'visualize', label: 'Visualize', number: '04' },
  { id: 'challenge', label: 'Challenge', number: '05' },
  { id: 'validate', label: 'Validate', number: '06' },
  { id: 'launch', label: 'Launch', number: '07' },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeProject,
  projects,
  onSelectProject,
  onNewProject,
  onLoadDemo,
  onNavigateStage,
  onOpenExport,
  onGoHome,
  isLanding,
}) => {
  const currentStageIndex = STAGES.findIndex((s) => s.id === activeProject.currentStage);
  const completedCount = activeProject.completedStages.length;
  const progressPercent = Math.round((completedCount / STAGES.length) * 100);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0B0D17]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Identity & Project Selector */}
        <div className="flex items-center gap-4">
          <button
            onClick={onGoHome}
            className="flex items-center gap-2.5 transition-opacity hover:opacity-85 text-left"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-violet-600 to-cyan-500 shadow-md shadow-violet-500/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-white">BRANDPULSE</span>
                <span className="rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  AI STUDIO
                </span>
              </div>
              <p className="hidden text-[10px] text-gray-400 sm:block">Stress-test before launch</p>
            </div>
          </button>

          {!isLanding && (
            <div className="hidden h-5 w-px bg-white/10 md:block" />
          )}

          {!isLanding && (
            <div className="hidden items-center gap-2 md:flex">
              <FolderGit2 className="h-4 w-4 text-violet-400" />
              <select
                value={activeProject.id}
                onChange={(e) => onSelectProject(e.target.value)}
                className="rounded-md border border-white/10 bg-black/40 px-2.5 py-1 text-xs font-medium text-gray-200 hover:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id} className="bg-[#0B0D17] text-white">
                    {p.projectName}
                  </option>
                ))}
              </select>
              <button
                onClick={onNewProject}
                className="flex items-center gap-1 rounded border border-white/10 bg-white/5 px-2 py-1 text-xs text-gray-300 transition-colors hover:border-violet-500/40 hover:bg-violet-600/10 hover:text-white"
                title="Create New Project"
              >
                <PlusCircle className="h-3.5 w-3.5 text-violet-400" />
                <span className="hidden lg:inline">New</span>
              </button>
            </div>
          )}
        </div>

        {/* Center: Stage Progress Pipeline (when inside studio) */}
        {!isLanding && (
          <nav className="hidden lg:flex items-center gap-1">
            {STAGES.map((st, i) => {
              const isActive = activeProject.currentStage === st.id;
              const isCompleted = activeProject.completedStages.includes(st.id);

              return (
                <button
                  key={st.id}
                  onClick={() => onNavigateStage(st.id)}
                  className={`group relative flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-violet-600/20 text-violet-300 border border-violet-500/40 shadow-sm shadow-violet-500/10'
                      : isCompleted
                      ? 'text-gray-300 hover:text-white hover:bg-white/5'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <span className={`text-[10px] font-mono ${isActive ? 'text-violet-400 font-bold' : 'text-gray-500'}`}>
                    {st.number}
                  </span>
                  <span>{st.label}</span>
                  {isCompleted && (
                    <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  )}
                  {i < STAGES.length - 1 && (
                    <ChevronRight className="ml-1 h-3 w-3 text-white/15" />
                  )}
                </button>
              );
            })}
          </nav>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Quick Demo Loader */}
          <button
            onClick={onLoadDemo}
            className="flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 transition-all hover:bg-cyan-500/20 hover:border-cyan-500/60 shadow-sm"
            title="Load full TeamMatch demo project for instant evaluation"
          >
            <PlayCircle className="h-3.5 w-3.5 text-cyan-400" />
            <span>Load Demo</span>
          </button>

          {!isLanding && (
            <>
              <button
                onClick={onOpenExport}
                className="hidden sm:flex items-center gap-1.5 rounded-lg border border-violet-500/40 bg-violet-600/15 px-3 py-1.5 text-xs font-medium text-violet-200 transition-all hover:bg-violet-600/30"
              >
                <Printer className="h-3.5 w-3.5 text-violet-300" />
                <span>Export Kit</span>
              </button>

              <button
                onClick={onGoHome}
                className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-gray-300 hover:bg-white/10 hover:text-white"
                title="Landing Overview"
              >
                <Home className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Overview</span>
              </button>
            </>
          )}

          {isLanding && (
            <button
              onClick={() => onNavigateStage('discover')}
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-1.5 text-xs font-semibold text-white shadow-md shadow-violet-500/25 hover:from-violet-500 hover:to-indigo-500 transition-all"
            >
              <span>Open Studio</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Stage Scroller (when inside studio) */}
      {!isLanding && (
        <div className="flex lg:hidden overflow-x-auto border-t border-white/5 bg-[#090A10]/95 px-4 py-2 gap-2 scrollbar-none">
          {STAGES.map((st) => {
            const isActive = activeProject.currentStage === st.id;
            const isCompleted = activeProject.completedStages.includes(st.id);
            return (
              <button
                key={st.id}
                onClick={() => onNavigateStage(st.id)}
                className={`whitespace-nowrap flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${
                  isActive
                    ? 'bg-violet-600/30 text-violet-200 border border-violet-500/40'
                    : 'text-gray-400 hover:text-gray-200 bg-white/5'
                }`}
              >
                <span className="text-[10px] font-mono text-gray-500">{st.number}</span>
                <span>{st.label}</span>
                {isCompleted && <CheckCircle2 className="h-3 w-3 text-emerald-400" />}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
