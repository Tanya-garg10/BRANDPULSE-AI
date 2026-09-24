import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Check,
  RotateCcw
} from 'lucide-react';
import { BrandProject, ShapeData, NamingTerritory, BrandNameProposal } from '../../types/brand';
import { generateBrandShape } from '../../services/api';
import { ChromeOrb } from '../ChromeOrb';
import { EditorialAnnotation } from '../EditorialAnnotation';

interface ShapeStageProps {
  project: BrandProject;
  onUpdateProject: (updated: BrandProject) => void;
  onContinue: () => void;
}

export const ShapeStage: React.FC<ShapeStageProps> = ({
  project,
  onUpdateProject,
  onContinue,
}) => {
  const [activeTab, setActiveTab] = useState<'naming' | 'personality' | 'messaging'>('naming');
  const [shape, setShape] = useState<ShapeData | null>(project.shape);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [customNameInput, setCustomNameInput] = useState<string>(
    project.shape?.naming.customName || ''
  );

  const selectedPositioning = project.positioning.directions.find(
    (d) => d.id === project.positioning.selectedDirectionId
  ) || project.positioning.directions[0];

  useEffect(() => {
    if (!shape && project.discovery.brandBrief && selectedPositioning && !loading) {
      handleGenerateShape();
    }
  }, [shape, project.discovery.brandBrief, selectedPositioning]);

  const handleGenerateShape = async () => {
    if (!project.discovery.brandBrief || !selectedPositioning) return;
    setLoading(true);
    setErrorMessage(null);
    try {
      const generated = await generateBrandShape(
        project,
        project.discovery.brandBrief,
        selectedPositioning
      );
      setShape(generated);
      const updatedProject: BrandProject = {
        ...project,
        shape: generated,
        completedStages: Array.from(new Set([...project.completedStages, 'shape'])),
      };
      onUpdateProject(updatedProject);
    } catch (err: any) {
      console.error('Error generating brand shape:', err);
      setErrorMessage(err.message || 'Failed to synthesize brand identity');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectName = (name: string) => {
    if (!shape) return;
    const updatedShape: ShapeData = {
      ...shape,
      naming: {
        ...shape.naming,
        selectedName: name,
      },
    };
    setShape(updatedShape);
    onUpdateProject({
      ...project,
      shape: updatedShape,
      completedStages: Array.from(new Set([...project.completedStages, 'shape'])),
    });
  };

  const handleApplyCustomName = () => {
    if (!customNameInput.trim() || !shape) return;
    const name = customNameInput.trim();
    const updatedShape: ShapeData = {
      ...shape,
      naming: {
        ...shape.naming,
        selectedName: name,
        customName: name,
      },
    };
    setShape(updatedShape);
    onUpdateProject({
      ...project,
      shape: updatedShape,
      completedStages: Array.from(new Set([...project.completedStages, 'shape'])),
    });
  };

  const selectedName = shape?.naming.selectedName || project.projectName;

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-16">
      {/* Header Stamp */}
      <div className="border-b border-[#D9D9D2] pb-6">
        <div className="flex items-center justify-between font-tech-mono text-[10px] uppercase tracking-widest text-[#111111]/50 mb-2">
          <div className="flex items-center gap-2">
            <ChromeOrb size={14} isThinking={loading} />
            <span className="text-[#3157FF] font-semibold">03 / SHAPE</span>
          </div>
          <span>SPECIFICATION // VERBAL_IDENTITY</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#111111]">
              NAME, PERSONALITY & VOICE
            </h1>
            <p className="font-editorial text-sm sm:text-base text-[#111111]/75 mt-1 italic max-w-2xl">
              Crystallize your mark with phonetic distinctiveness, intentional character traits, and non-negotiable voice principles.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleGenerateShape}
              disabled={loading}
              className="px-3.5 py-2 border border-[#D9D9D2] hover:border-[#111111] bg-white text-[#111111] text-xs font-tech-mono uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              <span>{loading ? 'Synthesizing...' : 'Regenerate'}</span>
            </button>

            {shape && (
              <button
                onClick={onContinue}
                className="inline-flex items-center gap-2 bg-[#111111] hover:bg-[#3157FF] text-white px-5 py-2 text-xs font-tech-mono uppercase font-semibold tracking-wider transition-colors"
              >
                <span>Stage 04: Visualize</span>
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

      {/* Selected Name Oversized Display Banner */}
      <div className="border border-[#D9D9D2] bg-white p-6 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="font-tech-mono text-[10px] text-[#3157FF] uppercase tracking-widest font-semibold">
            CURRENT CHOSEN MARK
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl uppercase tracking-tight text-[#111111] mt-1">
            {selectedName}
          </h2>
          {shape?.messaging.tagline && (
            <p className="font-editorial text-sm sm:text-base text-[#111111]/75 italic mt-1">
              "{shape.messaging.tagline}"
            </p>
          )}
        </div>

        <div className="font-tech-mono text-xs text-[#111111]/60 space-y-1 sm:text-right">
          <div>PHONETIC FIT: <span className="text-[#3157FF] font-semibold">NOMINAL</span></div>
          <div>BANNED TRAITS: <span className="text-[#FF6B5F] font-semibold">{shape?.personality.avoidTraits.length || 0} ENFORCED</span></div>
        </div>
      </div>

      {/* Segmented Filter Control for Facets */}
      <div className="flex border-b border-[#D9D9D2] font-tech-mono text-xs">
        <button
          onClick={() => setActiveTab('naming')}
          className={`py-2.5 px-6 font-semibold uppercase tracking-wider transition-colors relative ${
            activeTab === 'naming'
              ? 'text-[#3157FF] bg-white border-t border-l border-r border-[#D9D9D2]'
              : 'text-[#111111]/60 hover:text-[#111111]'
          }`}
        >
          01 / NAMING TERRITORIES
        </button>
        <button
          onClick={() => setActiveTab('personality')}
          className={`py-2.5 px-6 font-semibold uppercase tracking-wider transition-colors relative ${
            activeTab === 'personality'
              ? 'text-[#3157FF] bg-white border-t border-l border-r border-[#D9D9D2]'
              : 'text-[#111111]/60 hover:text-[#111111]'
          }`}
        >
          02 / PERSONALITY MATRIX
        </button>
        <button
          onClick={() => setActiveTab('messaging')}
          className={`py-2.5 px-6 font-semibold uppercase tracking-wider transition-colors relative ${
            activeTab === 'messaging'
              ? 'text-[#3157FF] bg-white border-t border-l border-r border-[#D9D9D2]'
              : 'text-[#111111]/60 hover:text-[#111111]'
          }`}
        >
          03 / VOICE & CADENCE
        </button>
      </div>

      {/* TAB 1: NAMING TERRITORIES */}
      {activeTab === 'naming' && shape && (
        <div className="space-y-6">
          <div className="space-y-6">
            {shape.naming.territories.map((territory, tIdx) => (
              <div key={tIdx} className="border border-[#D9D9D2] bg-white p-6 space-y-4">
                <div className="border-b border-[#D9D9D2] pb-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <div>
                    <span className="font-tech-mono text-[10px] text-[#3157FF] font-semibold uppercase">
                      TERRITORY 0{tIdx + 1}
                    </span>
                    <h3 className="font-display font-extrabold text-lg uppercase text-[#111111]">
                      {territory.name}
                    </h3>
                  </div>
                  <p className="font-editorial text-xs text-[#111111]/60 italic">
                    {territory.theme}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {territory.names.map((prop, pIdx) => {
                    const isChosen = selectedName.toLowerCase() === prop.name.toLowerCase();
                    return (
                      <div
                        key={pIdx}
                        onClick={() => handleSelectName(prop.name)}
                        className={`p-4 border transition-all cursor-pointer space-y-2 ${
                          isChosen
                            ? 'border-[#3157FF] bg-white shadow-[0_2px_8px_rgba(49,87,255,0.06)]'
                            : 'border-[#D9D9D2] bg-[#F7F6F2]/30 hover:border-[#111111] hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-display font-extrabold text-lg uppercase text-[#111111]">
                            {prop.name}
                          </span>
                          {isChosen ? (
                            <span className="text-[#3157FF] font-tech-mono text-[10px] font-bold">
                              ✓ CHOSEN
                            </span>
                          ) : (
                            <span className="text-[#111111]/40 font-tech-mono text-[10px]">
                              SELECT
                            </span>
                          )}
                        </div>

                        <p className="font-editorial text-xs text-[#111111]/75 leading-relaxed">
                          {prop.rationale || prop.meaning}
                        </p>

                        <div className="font-tech-mono text-[10px] text-[#111111]/50 border-t border-[#D9D9D2] pt-1">
                          FIT: {prop.personalityFit || 'High Distinctiveness'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Custom Name Override */}
          <div className="border border-[#D9D9D2] bg-white p-5 flex flex-col sm:flex-row items-center justify-between gap-4 font-tech-mono text-xs">
            <div className="w-full sm:w-auto">
              <span className="text-[10px] uppercase text-[#111111]/50 block">OR USE CUSTOM IDENTITY NAME:</span>
              <span className="text-xs text-[#111111]/80">Override with your chosen trademark or legal brand name.</span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                value={customNameInput}
                onChange={(e) => setCustomNameInput(e.target.value)}
                placeholder="e.g. AURA"
                className="p-2 border border-[#D9D9D2] bg-[#F7F6F2]/30 text-xs text-[#111111] outline-none focus:border-[#3157FF]"
              />
              <button
                onClick={handleApplyCustomName}
                disabled={!customNameInput.trim()}
                className="px-4 py-2 bg-[#111111] hover:bg-[#3157FF] text-white text-xs uppercase font-semibold transition-colors disabled:opacity-40"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PERSONALITY MATRIX & ANTI-TRAITS */}
      {activeTab === 'personality' && shape && (
        <div className="space-y-6">
          <div className="border border-[#D9D9D2] bg-white p-6 sm:p-8 space-y-6">
            <div className="border-b border-[#D9D9D2] pb-3">
              <div className="font-tech-mono text-[10px] text-[#3157FF] font-semibold uppercase tracking-widest">
                DEFINING PILLARS
              </div>
              <h3 className="font-display font-extrabold text-xl uppercase text-[#111111]">
                Endorsed Core Traits
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {shape.personality.traits.map((trait, idx) => (
                <div key={idx} className="p-4 border border-[#D9D9D2] bg-[#F7F6F2]/30 space-y-2">
                  <div className="font-tech-mono text-[10px] text-[#3157FF] font-bold">
                    TRAIT 0{idx + 1}
                  </div>
                  <div className="font-display font-bold text-base uppercase text-[#111111]">
                    {trait.trait}
                  </div>
                  <p className="font-editorial text-xs text-[#111111]/75 leading-relaxed">
                    {trait.rationale}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Banned Anti-Traits (Soft Coral Accent) */}
          <div className="border border-[#FF6B5F] bg-white p-6 sm:p-8 space-y-4">
            <div className="border-b border-[#FF6B5F]/30 pb-3 flex items-center justify-between">
              <div>
                <div className="font-tech-mono text-[10px] text-[#FF6B5F] font-bold uppercase tracking-widest">
                  GUARDRAIL PROTOCOL
                </div>
                <h3 className="font-display font-extrabold text-xl uppercase text-[#111111]">
                  Banned Anti-Traits
                </h3>
              </div>
              <span className="font-tech-mono text-xs text-[#FF6B5F] font-bold uppercase">
                ✕ ABSOLUTE REJECTION
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {shape.personality.avoidTraits.map((avoid, idx) => (
                <div key={idx} className="p-4 border border-[#D9D9D2] bg-[#F7F6F2]/30 space-y-2">
                  <div className="font-tech-mono text-[10px] text-[#FF6B5F] font-bold">
                    BANNED 0{idx + 1}
                  </div>
                  <div className="font-display font-bold text-base uppercase text-[#FF6B5F]">
                    {avoid.trait}
                  </div>
                  <p className="font-editorial text-xs text-[#111111]/75 leading-relaxed">
                    {avoid.rationale}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: VOICE & MESSAGING */}
      {activeTab === 'messaging' && shape && (
        <div className="border border-[#D9D9D2] bg-white p-6 sm:p-10 space-y-8">
          <div>
            <div className="font-tech-mono text-[10px] text-[#3157FF] uppercase tracking-widest font-semibold mb-1">
              VOICE OVERVIEW
            </div>
            <h3 className="font-display font-extrabold text-2xl uppercase tracking-tight text-[#111111]">
              Tonality & Cadence
            </h3>
            <p className="font-editorial text-base text-[#111111] italic mt-2 leading-relaxed">
              "{shape.messaging.brandVoice}"
            </p>
          </div>

          {/* Voice Principles (Do's & Don'ts) */}
          <div className="space-y-4 pt-4 border-t border-[#D9D9D2]">
            <div className="font-tech-mono text-xs uppercase font-semibold text-[#111111]/60">
              VOICE GOVERNANCE RULES
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shape.messaging.voicePrinciples.map((rule, idx) => (
                <div key={idx} className="p-4 border border-[#D9D9D2] bg-[#F7F6F2]/30 space-y-2 text-xs font-tech-mono">
                  <div className="text-[#3157FF] font-semibold">
                    ✓ DO: {rule.do}
                  </div>
                  <div className="text-[#FF6B5F]">
                    ✕ DON'T: {rule.dont}
                  </div>
                  {rule.example && (
                    <div className="font-editorial text-xs text-[#111111]/65 italic border-t border-[#D9D9D2] pt-1 mt-1">
                      "{rule.example}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Editorial Observation */}
      <EditorialAnnotation
        timestamp="10:24"
        observation={`The mark '${selectedName}' holds strong phonetic economy. Its lack of generic syllables gives it high brand recall in competitive hackathons.`}
        actionText="CONTINUE TO VISUAL SYSTEM →"
        onAction={onContinue}
      />
    </div>
  );
};
