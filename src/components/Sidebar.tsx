import React from 'react';
import {
  Compass,
  Crosshair,
  Shapes,
  Palette,
  ShieldAlert,
  CheckCheck,
  Rocket,
  LayoutDashboard,
  Settings,
  DownloadCloud,
  CheckCircle2,
  Sparkles,
  Zap
} from 'lucide-react';
import { BrandProject, WorkflowStage } from '../types/brand';

interface SidebarProps {
  activeProject: BrandProject;
  activeStage: WorkflowStage | 'dashboard';
  onNavigate: (stage: WorkflowStage | 'dashboard') => void;
  onOpenExport: () => void;
  onOpenSettings: () => void;
}

interface NavItem {
  id: WorkflowStage | 'dashboard';
  label: string;
  number?: string;
  icon: React.ElementType;
  description: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    description: 'Project overview & readiness',
  },
  {
    id: 'discover',
    label: 'Discover',
    number: '01',
    icon: Compass,
    description: 'AI interview & brand brief',
  },
  {
    id: 'position',
    label: 'Position',
    number: '02',
    icon: Crosshair,
    description: 'Strategic market angles',
  },
  {
    id: 'shape',
    label: 'Shape',
    number: '03',
    icon: Shapes,
    description: 'Personality, naming & voice',
  },
  {
    id: 'visualize',
    label: 'Visualize',
    number: '04',
    icon: Palette,
    description: 'Palette, typography & mood',
  },
  {
    id: 'challenge',
    label: 'Challenge',
    number: '05',
    icon: ShieldAlert,
    description: 'AI critic & brand battle',
  },
  {
    id: 'validate',
    label: 'Validate',
    number: '06',
    icon: CheckCheck,
    description: 'Consistency guardian audit',
  },
  {
    id: 'launch',
    label: 'Launch',
    number: '07',
    icon: Rocket,
    description: 'Ready brand kit & distribution',
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeProject,
  activeStage,
  onNavigate,
  onOpenExport,
  onOpenSettings,
}) => {
  const completedStages = activeProject.completedStages;
  const progressPercent = Math.round((completedStages.length / 7) * 100);

  return (
    <aside className="w-64 flex-shrink-0 border-r border-white/10 bg-[#090A10] flex flex-col justify-between select-none">
      {/* Top Project Badge & Progress */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] font-mono tracking-wider uppercase text-emerald-400 font-semibold">
              Live Workspace
            </span>
          </div>
          <span className="text-xs font-mono text-gray-400">{progressPercent}% Ready</span>
        </div>

        <h2 className="text-sm font-bold text-white truncate" title={activeProject.projectName}>
          {activeProject.projectName}
        </h2>
        <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5" title={activeProject.roughIdea}>
          {activeProject.roughIdea}
        </p>

        {/* Mini progress bar */}
        <div className="mt-3 w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Middle: Stage Navigation List */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        <div className="px-3 pb-1 text-[10px] font-mono uppercase tracking-widest text-gray-500">
          Studio Pipeline
        </div>

        {NAV_ITEMS.map((item) => {
          const isActive = activeStage === item.id;
          const isCompleted = item.id !== 'dashboard' && completedStages.includes(item.id as WorkflowStage);
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full group flex items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-all ${
                isActive
                  ? 'bg-violet-600/20 text-white border border-violet-500/40 shadow-sm shadow-violet-500/10'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              <div
                className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md transition-colors ${
                  isActive
                    ? 'bg-violet-600 text-white'
                    : isCompleted
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : 'bg-white/5 text-gray-400 group-hover:text-gray-200'
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {item.number && (
                      <span className={`text-[10px] font-mono ${isActive ? 'text-violet-300' : 'text-gray-500'}`}>
                        {item.number}
                      </span>
                    )}
                    <span className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-gray-300'}`}>
                      {item.label}
                    </span>
                  </div>

                  {isCompleted && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                  )}
                  {item.id === 'challenge' && (
                    <span className="rounded bg-rose-500/20 px-1 py-0.2 text-[9px] font-semibold text-rose-300 border border-rose-500/30">
                      Stress-Test
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">
                  {item.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Actions: Settings & Export */}
      <div className="p-3 border-t border-white/10 space-y-1 bg-[#07080D]">
        <button
          onClick={onOpenExport}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-violet-300 bg-violet-600/10 border border-violet-500/30 hover:bg-violet-600/20 transition-all"
        >
          <div className="flex items-center gap-2">
            <DownloadCloud className="h-4 w-4 text-violet-400" />
            <span>Export Brand Kit</span>
          </div>
          <span className="text-[10px] font-mono bg-violet-500/30 px-1.5 py-0.5 rounded text-violet-200">
            PDF / MD
          </span>
        </button>

        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-all"
        >
          <Settings className="h-4 w-4" />
          <span>Project Settings & Data</span>
        </button>
      </div>
    </aside>
  );
};
