import React, { useState } from 'react';
import {
  ArrowRight,
  Check,
  RotateCcw
} from 'lucide-react';
import {
  BrandProject,
  PositioningDirection
} from '../../types/brand';
import { generatePositioning } from '../../services/api';
import { ChromeOrb } from '../ChromeOrb';
import { EditorialAnnotation } from '../EditorialAnnotation';

interface PositionStageProps {
  project: BrandProject;
  onUpdateProject: (updated: BrandProject) => void;
  onContinue: () => void;
}

export const PositionStage: React.FC<PositionStageProps> = ({
  project,
  onUpdateProject,
  onContinue,
}) => {
  const [directions, setDirections] = useState<PositioningDirection[]>(
    project.positioning.directions
  );
  const [selectedId, setSelectedId] = useState<string | null>(
    project.positioning.selectedDirectionId || (directions[0]?.id ?? null)
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSelectDirection = (id: string) => {
    setSelectedId(id);
    const updatedProject: BrandProject = {
      ...project,
      positioning: {
        ...project.positioning,
        selectedDirectionId: id,
      },
      completedStages: Array.from(new Set([...project.completedStages, 'position'])),
    };
    onUpdateProject(updatedProject);
  };

  const handleRegenerate = async () => {
    if (!project.discovery.brandBrief) return;
    setLoading(true);
    setErrorMessage(null);
    try {
      const generated = await generatePositioning(
        project,
        project.discovery.brandBrief
      );
      setDirections(generated);
      if (generated.length > 0) {
        handleSelectDirection(generated[0].id);
      }
    } catch (err: any) {
      console.error('Error generating positioning:', err);
      setErrorMessage(err.message || 'Failed to synthesize positioning stances');
    } finally {
      setLoading(false);
    }
  };

  const selectedDirection = directions.find((d) => d.id === selectedId) || directions[0];

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-16">
      {/* Header Stamp */}
      <div className="border-b border-[#D9D9D2] pb-6">
        <div className="flex items-center justify-between font-tech-mono text-[10px] uppercase tracking-widest text-[#111111]/50 mb-2">
          <div className="flex items-center gap-2">
            <ChromeOrb size={14} isThinking={loading} />
            <span className="text-[#3157FF] font-semibold">02 / POSITION</span>
          </div>
          <span>SPECIFICATION // STRATEGIC_VECTORS</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#111111]">
              SELECT YOUR MARKET STANCE
            </h1>
            <p className="font-editorial text-sm sm:text-base text-[#111111]/75 mt-1 italic max-w-2xl">
              Three divergent, defensible market territories. Choose where your brand establishes its competitive moat.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleRegenerate}
              disabled={loading}
              className="px-3.5 py-2 border border-[#D9D9D2] hover:border-[#111111] bg-white text-[#111111] text-xs font-tech-mono uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              <span>{loading ? 'Synthesizing...' : 'Regenerate'}</span>
            </button>

            {selectedId && (
              <button
                onClick={onContinue}
                className="inline-flex items-center gap-2 bg-[#111111] hover:bg-[#3157FF] text-white px-5 py-2 text-xs font-tech-mono uppercase font-semibold tracking-wider transition-colors"
              >
                <span>Stage 03: Shape</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 border border-[#FF6B5F] bg-[#FF6B5F]/10 text-xs font-tech-mono text-[#111111]">
          [DIAGNOSTIC ADVISORY]: {errorMessage}
        </div>
      )}

      {/* 3 Editorial Stance Vectors */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {directions.map((dir, idx) => {
            const isSelected = selectedId === dir.id;
            return (
              <div
                key={dir.id}
                onClick={() => handleSelectDirection(dir.id)}
                className={`border p-6 text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#3157FF] bg-white shadow-[0_4px_20px_rgba(49,87,255,0.06)]'
                    : 'border-[#D9D9D2] bg-white/70 hover:bg-white hover:border-[#111111]'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#3157FF]" />
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between font-tech-mono text-[10px] text-[#111111]/45 uppercase">
                    <span className={isSelected ? 'text-[#3157FF] font-semibold' : ''}>
                      VECTOR 0{idx + 1}
                    </span>
                    {isSelected ? (
                      <span className="text-[#3157FF] font-bold flex items-center gap-1">
                        <Check className="h-3 w-3" /> ACTIVE
                      </span>
                    ) : (
                      <span className="hover:text-[#111111]">SELECT</span>
                    )}
                  </div>

                  <h3 className="font-display font-extrabold text-xl uppercase tracking-tight text-[#111111]">
                    {dir.name}
                  </h3>

                  <p className="font-editorial text-sm italic text-[#111111] leading-relaxed">
                    "{dir.oneLiner}"
                  </p>

                  <div className="pt-2 border-t border-[#D9D9D2] space-y-2 text-xs font-tech-mono">
                    <div>
                      <span className="text-[10px] text-[#111111]/45 uppercase block">COMPETITIVE MOAT:</span>
                      <span className="text-[#111111] font-medium">{dir.differentiator}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-[#111111]/45 uppercase block">PRIMARY RISK:</span>
                      <span className="text-[#FF6B5F]">{dir.potentialWeakness}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#D9D9D2] flex justify-between items-center text-[10px] font-tech-mono text-[#111111]/50 uppercase">
                  <span>AUDIENCE FIT: HIGH</span>
                  <span className={isSelected ? 'text-[#3157FF] font-bold' : ''}>
                    {isSelected ? 'LOCKED' : 'CHOOSE →'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deep Dive on Active Stance */}
      {selectedDirection && (
        <div className="border border-[#D9D9D2] bg-white p-6 sm:p-10 space-y-6">
          <div className="border-b border-[#D9D9D2] pb-4 flex items-center justify-between">
            <div>
              <div className="font-tech-mono text-[10px] text-[#3157FF] uppercase tracking-widest font-semibold">
                ACTIVE STRATEGIC MOAT SPECIFICATION
              </div>
              <h2 className="font-display font-extrabold text-2xl uppercase tracking-tight text-[#111111] mt-1">
                {selectedDirection.name}
              </h2>
            </div>
            <div className="font-tech-mono text-xs text-[#3157FF] font-semibold border border-[#3157FF] px-2.5 py-1">
              PRIMARY VECTOR
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
            <div className="space-y-4">
              <div>
                <span className="font-tech-mono text-[10px] text-[#111111]/45 uppercase tracking-wider block mb-1">
                  CORE BRAND PROMISE:
                </span>
                <p className="font-editorial text-base text-[#111111] italic leading-relaxed">
                  "{selectedDirection.oneLiner}"
                </p>
              </div>

              <div>
                <span className="font-tech-mono text-[10px] text-[#111111]/45 uppercase tracking-wider block mb-1">
                  TACTICAL DIFFERENTIATOR:
                </span>
                <p className="text-[#111111] leading-relaxed">
                  {selectedDirection.differentiator}
                </p>
              </div>
            </div>

            <div className="space-y-4 border-t md:border-t-0 md:border-l border-[#D9D9D2] pt-4 md:pt-0 md:pl-8">
              <div>
                <span className="font-tech-mono text-[10px] text-[#FF6B5F] uppercase tracking-wider block mb-1 font-semibold">
                  STRESS POINT / CATEGORY RISK:
                </span>
                <p className="text-[#111111]/85 leading-relaxed">
                  {selectedDirection.potentialWeakness}
                </p>
              </div>

              <div>
                <span className="font-tech-mono text-[10px] text-[#111111]/45 uppercase tracking-wider block mb-1">
                  TARGET RECIPIENT ALIGNMENT:
                </span>
                <p className="text-[#111111]/85 leading-relaxed">
                  {project.discovery.brandBrief?.targetAudience || project.targetAudience}
                </p>
              </div>
            </div>
          </div>

          <EditorialAnnotation
            timestamp="10:18"
            observation="This stance firmly separates you from generic recruiting tools. Ensure Stage 03 Name and Voice strictly forbid corporate HR buzzwords."
            actionText="CONTINUE TO STAGE 03: SHAPE →"
            onAction={onContinue}
          />
        </div>
      )}
    </div>
  );
};
