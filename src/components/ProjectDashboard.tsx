import React from 'react';
import {
  Sparkles,
  Compass,
  Crosshair,
  Shapes,
  Palette,
  ShieldAlert,
  CheckCheck,
  Rocket,
  CheckCircle2,
  ArrowRight,
  Printer,
  Trash2,
  RotateCcw,
  Clock,
  Award,
  Check
} from 'lucide-react';
import { BrandProject, WorkflowStage } from '../types/brand';

interface ProjectDashboardProps {
  project: BrandProject;
  onNavigateStage: (stage: WorkflowStage) => void;
  onOpenExport: () => void;
  onResetDemo: () => void;
  onDeleteProject: () => void;
}

const STAGES_LIST: { id: WorkflowStage; label: string; number: string; desc: string }[] = [
  { id: 'discover', label: '01 / DISCOVER', number: '01', desc: 'Adaptive AI interview & structured Brand Brief' },
  { id: 'position', label: '02 / POSITION', number: '02', desc: 'Strategic market angles & contrarian contrast' },
  { id: 'shape', label: '03 / SHAPE', number: '03', desc: 'Personality traits, naming territories & voice laws' },
  { id: 'visualize', label: '04 / VISUALIZE', number: '04', desc: 'Calibrated color palette & typography rules' },
  { id: 'challenge', label: '05 / CHALLENGE', number: '05', desc: 'Brand Battle: AI Advocate vs. Critic debate' },
  { id: 'validate', label: '06 / VALIDATE', number: '06', desc: 'Brand X-Ray: 6-point coherence inspection' },
  { id: 'launch', label: '07 / LAUNCH', number: '07', desc: 'Physical-style brand dossier & multi-channel kit' },
];

export const ProjectDashboard: React.FC<ProjectDashboardProps> = ({
  project,
  onNavigateStage,
  onOpenExport,
  onResetDemo,
  onDeleteProject,
}) => {
  const completedCount = project.completedStages.length;
  const progressPercent = Math.round((completedCount / 7) * 100);
  const selectedPositioning = project.positioning.directions.find(
    (d) => d.id === project.positioning.selectedDirectionId
  ) || project.positioning.directions[0];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header Stamp */}
      <div className="border-b border-[#0A1128]/15 pb-6">
        <div className="flex items-center justify-between font-tech-mono text-[11px] uppercase tracking-wider text-[#0A1128]/60 mb-1">
          <span className="text-[#FF4400] font-bold">PROJECT OVERVIEW</span>
          <span>LAB_DOSSIER // ARCHIVE_STATUS</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#0A1128]">
              {project.shape?.naming.selectedName || project.projectName}
            </h1>
            <p className="font-editorial text-sm sm:text-base text-[#0A1128]/75 mt-1 italic max-w-2xl">
              {project.roughIdea}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigateStage(project.currentStage)}
              className="flex items-center gap-1.5 bg-[#FF4400] hover:bg-[#0A1128] text-white px-4 py-2 text-xs font-tech-mono uppercase font-bold tracking-wider transition-colors shadow-sm"
            >
              <span>Jump to Stage: {project.currentStage}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={onOpenExport}
              className="flex items-center gap-1.5 px-3 py-2 border border-[#0A1128]/20 bg-white hover:border-[#0A1128] text-xs font-tech-mono uppercase text-[#0A1128] transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Export Dossier</span>
            </button>
          </div>
        </div>
      </div>

      {/* Diagnostics Status Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="lab-card p-4 border border-[#0A1128]/15">
          <span className="font-tech-mono text-[10px] uppercase text-[#0A1128]/50 block mb-1 font-bold">
            PIPELINE PROGRESS
          </span>
          <div className="text-2xl font-tech-mono font-bold text-[#0A1128]">
            {progressPercent}%
          </div>
          <p className="font-tech-mono text-[10px] text-[#0A1128]/60 mt-1">
            {completedCount} OF 7 GATES PASSED
          </p>
        </div>

        <div className="lab-card p-4 border border-[#0A1128]/15">
          <span className="font-tech-mono text-[10px] uppercase text-[#0A1128]/50 block mb-1 font-bold">
            COHERENCE SCORE
          </span>
          <div className="text-2xl font-tech-mono font-bold text-[#16A34A]">
            {project.consistency?.coherenceScore || 94}/100
          </div>
          <p className="font-tech-mono text-[10px] text-[#0A1128]/60 mt-1">
            BRAND X-RAY VERIFIED
          </p>
        </div>

        <div className="lab-card p-4 border border-[#0A1128]/15">
          <span className="font-tech-mono text-[10px] uppercase text-[#0A1128]/50 block mb-1 font-bold">
            ACTIVE STANCE
          </span>
          <div className="text-sm font-display font-bold text-[#0A1128] uppercase truncate mt-1">
            {selectedPositioning?.name || 'Complementarity'}
          </div>
          <p className="font-editorial text-[11px] text-[#0A1128]/60 mt-1 truncate italic">
            "{selectedPositioning?.oneLiner}"
          </p>
        </div>

        <div className="lab-card p-4 border border-[#0A1128]/15">
          <span className="font-tech-mono text-[10px] uppercase text-[#0A1128]/50 block mb-1 font-bold">
            CRITIC ANNOTATIONS
          </span>
          <div className="text-2xl font-tech-mono font-bold text-[#FF4400]">
            {project.challenges.issues.filter((i) => i.status === 'accepted').length} RESOLVED
          </div>
          <p className="font-tech-mono text-[10px] text-[#0A1128]/60 mt-1">
            CLICHÉS REMOVED
          </p>
        </div>
      </div>

      {/* Stage Progression Matrix */}
      <div className="space-y-4">
        <div className="border-b border-[#0A1128]/15 pb-2">
          <h3 className="font-display font-extrabold text-lg uppercase text-[#0A1128]">
            Brand DNA Pipeline Stages
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STAGES_LIST.map((stage) => {
            const isCompleted = project.completedStages.includes(stage.id);
            const isCurrent = project.currentStage === stage.id;

            return (
              <div
                key={stage.id}
                onClick={() => onNavigateStage(stage.id)}
                className={`lab-card p-5 border transition-all cursor-pointer flex items-center justify-between group ${
                  isCurrent
                    ? 'border-2 border-[#FF4400] bg-white shadow-[4px_4px_0px_#FF4400]'
                    : isCompleted
                    ? 'border-[#0A1128]/20 bg-white hover:border-[#0A1128]'
                    : 'border-[#0A1128]/10 bg-[#F6F5F0] hover:border-[#0A1128]/30'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-extrabold text-base uppercase text-[#0A1128]">
                      {stage.label}
                    </span>
                    {isCompleted && (
                      <span className="font-tech-mono text-[10px] text-[#16A34A] font-bold uppercase flex items-center gap-0.5">
                        <Check className="h-3 w-3" /> PASSED
                      </span>
                    )}
                  </div>
                  <p className="font-sans text-xs text-[#0A1128]/70">
                    {stage.desc}
                  </p>
                </div>

                <div className="font-tech-mono text-xs text-[#0A1128]/40 group-hover:text-[#FF4400] transition-colors">
                  [ENTER →]
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Project Maintenance Footer */}
      <div className="pt-6 border-t border-[#0A1128]/15 flex items-center justify-between text-xs font-tech-mono">
        <button
          onClick={onResetDemo}
          className="text-[#0A1128]/60 hover:text-[#0A1128] uppercase flex items-center gap-1"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset Project to Fresh State</span>
        </button>

        <button
          onClick={onDeleteProject}
          className="text-[#DC2626] hover:underline uppercase flex items-center gap-1"
        >
          <Trash2 className="h-3 w-3" />
          <span>Purge Project from Lab</span>
        </button>
      </div>
    </div>
  );
};
