import React from 'react';
import { BrandProject, WorkflowStage } from '../types/brand';
import { ChromeOrb } from './ChromeOrb';

interface BrandDnaSidebarProps {
  project: BrandProject;
  onNavigateStage?: (stage: WorkflowStage) => void;
}

export const BrandDnaSidebar: React.FC<BrandDnaSidebarProps> = ({
  project,
  onNavigateStage,
}) => {
  const selectedPositioning = project.positioning.directions.find(
    (d) => d.id === project.positioning.selectedDirectionId
  ) || project.positioning.directions[0];

  const brief = project.discovery.brandBrief;
  const personality = project.shape?.personality;
  const messaging = project.shape?.messaging;
  const coherenceVal = project.consistency?.coherenceScore || 94;

  return (
    <aside className="w-72 shrink-0 border-r border-[#D9D9D2] bg-[#F7F6F2] flex flex-col h-full text-xs font-tech-mono overflow-y-auto">
      {/* Studio Header */}
      <div className="p-4 sm:p-5 border-b border-[#D9D9D2] bg-white">
        <div className="flex items-center justify-between text-[10px] text-[#111111]/45 uppercase tracking-widest mb-1.5">
          <div className="flex items-center gap-1.5">
            <ChromeOrb size={12} />
            <span>DNA MATRIX</span>
          </div>
          <span className="text-[#3157FF] font-semibold">LIVE</span>
        </div>
        <h2 className="font-display font-extrabold text-base uppercase text-[#111111] tracking-tight">
          BRAND CORE
        </h2>
        <p className="font-editorial text-xs text-[#111111]/60 italic mt-0.5">
          Continuously synthesized identity attributes across the 6 stages.
        </p>
      </div>

      {/* The 6 Continously Updated Facets */}
      <div className="p-4 sm:p-5 space-y-6 flex-1">
        {/* 01 AUDIENCE */}
        <section className="space-y-1 border-b border-[#D9D9D2] pb-4">
          <div className="flex items-center justify-between text-[10px] text-[#111111]/50 uppercase">
            <span className="font-bold text-[#111111]">01 / AUDIENCE</span>
            {onNavigateStage && (
              <button
                onClick={() => onNavigateStage('discover')}
                className="hover:text-[#3157FF] text-[9px] transition-colors"
              >
                EDIT →
              </button>
            )}
          </div>
          <p className="font-sans font-medium text-xs text-[#111111] leading-snug">
            {brief?.targetAudience || project.targetAudience || 'In discovery...'}
          </p>
        </section>

        {/* 02 PROBLEM */}
        <section className="space-y-1 border-b border-[#D9D9D2] pb-4">
          <div className="flex items-center justify-between text-[10px] text-[#111111]/50 uppercase">
            <span className="font-bold text-[#111111]">02 / PROBLEM</span>
            {onNavigateStage && (
              <button
                onClick={() => onNavigateStage('discover')}
                className="hover:text-[#3157FF] text-[9px] transition-colors"
              >
                EDIT →
              </button>
            )}
          </div>
          <p className="font-sans text-xs text-[#111111]/80 leading-snug line-clamp-3">
            {brief?.problem || project.roughIdea}
          </p>
        </section>

        {/* 03 PROMISE */}
        <section className="space-y-1 border-b border-[#D9D9D2] pb-4">
          <div className="flex items-center justify-between text-[10px] text-[#111111]/50 uppercase">
            <span className="font-bold text-[#111111]">03 / PROMISE</span>
            {onNavigateStage && (
              <button
                onClick={() => onNavigateStage('position')}
                className="hover:text-[#3157FF] text-[9px] transition-colors"
              >
                EDIT →
              </button>
            )}
          </div>
          <p className="font-editorial text-sm text-[#111111] italic leading-snug">
            "{selectedPositioning?.oneLiner || 'Awaiting position selection...'}"
          </p>
          {selectedPositioning?.differentiator && (
            <div className="text-[10px] text-[#3157FF] font-medium pt-0.5">
              + {selectedPositioning.differentiator}
            </div>
          )}
        </section>

        {/* 04 PERSONALITY */}
        <section className="space-y-1 border-b border-[#D9D9D2] pb-4">
          <div className="flex items-center justify-between text-[10px] text-[#111111]/50 uppercase">
            <span className="font-bold text-[#111111]">04 / PERSONALITY</span>
            {onNavigateStage && (
              <button
                onClick={() => onNavigateStage('shape')}
                className="hover:text-[#3157FF] text-[9px] transition-colors"
              >
                EDIT →
              </button>
            )}
          </div>
          {personality?.traits && personality.traits.length > 0 ? (
            <div className="space-y-1 text-xs">
              <div className="text-[#111111] font-medium">
                {personality.traits.map((t) => t.trait).join(' · ')}
              </div>
              {personality.avoidTraits && personality.avoidTraits.length > 0 && (
                <div className="text-[10px] text-[#FF6B5F] pt-0.5">
                  ✕ BANNED: {personality.avoidTraits.map((a) => a.trait).join(', ')}
                </div>
              )}
            </div>
          ) : (
            <p className="text-[11px] text-[#111111]/40 italic">
              Configured in Stage 03 Shape
            </p>
          )}
        </section>

        {/* 05 POSITIONING */}
        <section className="space-y-1 border-b border-[#D9D9D2] pb-4">
          <div className="flex items-center justify-between text-[10px] text-[#111111]/50 uppercase">
            <span className="font-bold text-[#111111]">05 / POSITIONING</span>
            {onNavigateStage && (
              <button
                onClick={() => onNavigateStage('position')}
                className="hover:text-[#3157FF] text-[9px] transition-colors"
              >
                EDIT →
              </button>
            )}
          </div>
          <div className="font-display font-bold text-xs uppercase text-[#111111]">
            {selectedPositioning?.name || 'Standard Vector'}
          </div>
        </section>

        {/* 06 VOICE */}
        <section className="space-y-1">
          <div className="flex items-center justify-between text-[10px] text-[#111111]/50 uppercase">
            <span className="font-bold text-[#111111]">06 / VOICE</span>
            {onNavigateStage && (
              <button
                onClick={() => onNavigateStage('shape')}
                className="hover:text-[#3157FF] text-[9px] transition-colors"
              >
                EDIT →
              </button>
            )}
          </div>
          <p className="font-editorial text-xs text-[#111111] leading-snug">
            {messaging?.brandVoice || 'Defined in Stage 03 Shape'}
          </p>
        </section>
      </div>

      {/* Footer Diagnostic Ribbon */}
      <div className="p-3.5 border-t border-[#D9D9D2] bg-white text-[10px] text-[#111111]/60 flex items-center justify-between">
        <span>COHERENCE INDEX:</span>
        <span className="text-[#3157FF] font-bold">
          {coherenceVal}% VERIFIED
        </span>
      </div>
    </aside>
  );
};
