import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Copy,
  Check,
  RotateCcw
} from 'lucide-react';
import { BrandProject, VisualDirectionData, ColorSwatch } from '../../types/brand';
import { generateVisualSystem } from '../../services/api';
import { ChromeOrb } from '../ChromeOrb';
import { EditorialAnnotation } from '../EditorialAnnotation';

interface VisualizeStageProps {
  project: BrandProject;
  onUpdateProject: (updated: BrandProject) => void;
  onContinue: () => void;
}

export const VisualizeStage: React.FC<VisualizeStageProps> = ({
  project,
  onUpdateProject,
  onContinue,
}) => {
  const [visuals, setVisuals] = useState<VisualDirectionData | null>(project.visualize);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const selectedPositioning = project.positioning.directions.find(
    (d) => d.id === project.positioning.selectedDirectionId
  ) || project.positioning.directions[0];

  useEffect(() => {
    if (!visuals && project.discovery.brandBrief && selectedPositioning && project.shape && !loading) {
      handleGenerateVisuals();
    }
  }, [visuals, project.discovery.brandBrief, selectedPositioning, project.shape]);

  const handleGenerateVisuals = async () => {
    if (!project.discovery.brandBrief || !selectedPositioning || !project.shape) return;
    setLoading(true);
    setErrorMessage(null);
    try {
      const generated = await generateVisualSystem(
        project,
        project.discovery.brandBrief,
        selectedPositioning,
        project.shape
      );
      setVisuals(generated);
      const updatedProject: BrandProject = {
        ...project,
        visualize: generated,
        completedStages: Array.from(new Set([...project.completedStages, 'visualize'])),
      };
      onUpdateProject(updatedProject);
    } catch (err: any) {
      console.error('Error generating visual system:', err);
      setErrorMessage(err.message || 'Failed to synthesize visual identity');
    } finally {
      setLoading(false);
    }
  };

  const copyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const palette: ColorSwatch[] = visuals?.colorMood?.palette || visuals?.palette || [];
  const displayFont = visuals?.typography?.headlineFont || visuals?.typography?.primaryDisplay || 'Newsreader + Plus Jakarta Sans';
  const dataFont = visuals?.typography?.bodyFont || visuals?.typography?.secondaryBody || 'JetBrains Mono';

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-16">
      {/* Header Stamp */}
      <div className="border-b border-[#D9D9D2] pb-6">
        <div className="flex items-center justify-between font-tech-mono text-[10px] uppercase tracking-widest text-[#111111]/50 mb-2">
          <div className="flex items-center gap-2">
            <ChromeOrb size={14} isThinking={loading} />
            <span className="text-[#3157FF] font-semibold">04 / VISUALIZE</span>
          </div>
          <span>SPECIFICATION // CHROMATIC_TYPOGRAPHIC</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#111111]">
              VISUAL SYSTEM SPECIFICATION
            </h1>
            <p className="font-editorial text-sm sm:text-base text-[#111111]/75 mt-1 italic max-w-2xl">
              Calibrated chromatic values, typographic pairings, and geometric insignia geometry tailored for distinction.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleGenerateVisuals}
              disabled={loading}
              className="px-3.5 py-2 border border-[#D9D9D2] hover:border-[#111111] bg-white text-[#111111] text-xs font-tech-mono uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              <span>{loading ? 'Synthesizing...' : 'Regenerate'}</span>
            </button>

            {visuals && (
              <button
                onClick={onContinue}
                className="inline-flex items-center gap-2 bg-[#111111] hover:bg-[#3157FF] text-white px-5 py-2 text-xs font-tech-mono uppercase font-semibold tracking-wider transition-colors"
              >
                <span>Stage 05: Challenge</span>
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

      {/* SECTION 1: CHROMATIC PALETTE SPECIFICATION */}
      <div className="border border-[#D9D9D2] bg-white p-6 sm:p-10 space-y-6">
        <div className="border-b border-[#D9D9D2] pb-4 flex items-center justify-between">
          <div>
            <div className="font-tech-mono text-[10px] text-[#3157FF] uppercase tracking-widest font-semibold">
              COLOR SYSTEM
            </div>
            <h2 className="font-display font-extrabold text-2xl uppercase tracking-tight text-[#111111] mt-0.5">
              Calibrated Color Hierarchy
            </h2>
          </div>
          <div className="font-tech-mono text-xs text-[#111111]/50 uppercase">
            5 CHROMATIC NODES
          </div>
        </div>

        {/* 5 Swatches Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {palette.map((swatch, idx) => (
            <div
              key={idx}
              className="border border-[#D9D9D2] p-3 space-y-3 bg-[#F7F6F2]/30 hover:border-[#111111] transition-colors group"
            >
              <div
                className="h-20 w-full border border-[#111111]/10 transition-transform group-hover:scale-[1.02]"
                style={{ backgroundColor: swatch.hex }}
              />

              <div className="space-y-1">
                <div className="font-tech-mono text-[9px] text-[#3157FF] font-semibold uppercase">
                  {swatch.role || `NODE 0${idx + 1}`}
                </div>
                <div className="font-display font-bold text-xs uppercase text-[#111111] truncate">
                  {swatch.name}
                </div>
                <button
                  onClick={() => copyHex(swatch.hex)}
                  className="font-tech-mono text-[10px] text-[#111111]/60 hover:text-[#3157FF] flex items-center gap-1 transition-colors uppercase pt-1"
                >
                  {copiedHex === swatch.hex ? (
                    <Check className="h-3 w-3 text-[#3157FF]" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  <span>{copiedHex === swatch.hex ? 'COPIED' : swatch.hex}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {visuals?.colorMood?.moodDescription && (
          <p className="font-editorial text-xs text-[#111111]/75 italic pt-2">
            “{visuals.colorMood.moodDescription}”
          </p>
        )}
      </div>

      {/* SECTION 2: TYPOGRAPHIC MATRIX */}
      <div className="border border-[#D9D9D2] bg-white p-6 sm:p-10 space-y-6">
        <div className="border-b border-[#D9D9D2] pb-4">
          <div className="font-tech-mono text-[10px] text-[#3157FF] uppercase tracking-widest font-semibold">
            TYPOGRAPHY MATRIX
          </div>
          <h2 className="font-display font-extrabold text-2xl uppercase tracking-tight text-[#111111] mt-0.5">
            Display & Data Typefaces
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Display Headline Font */}
          <div className="p-6 border border-[#D9D9D2] bg-[#F7F6F2]/30 space-y-3">
            <div className="font-tech-mono text-[10px] text-[#3157FF] font-semibold uppercase">
              PRIMARY DISPLAY HEADLINE
            </div>
            <div className="font-display font-black text-3xl uppercase tracking-tight text-[#111111]">
              {displayFont}
            </div>
            <p className="font-editorial text-sm text-[#111111]/75 italic leading-relaxed">
              "We build for hackers who finish what they start. No filler networking."
            </p>
            <div className="font-tech-mono text-[10px] text-[#111111]/50 border-t border-[#D9D9D2] pt-2">
              USAGE: Brand Marks, Hero Declarations, Section Signatures
            </div>
          </div>

          {/* Data Font */}
          <div className="p-6 border border-[#D9D9D2] bg-[#F7F6F2]/30 space-y-3">
            <div className="font-tech-mono text-[10px] text-[#3157FF] font-semibold uppercase">
              DATA & METADATA MONOSPACE
            </div>
            <div className="font-tech-mono font-bold text-2xl text-[#111111]">
              {dataFont}
            </div>
            <p className="font-tech-mono text-xs text-[#111111]/75 leading-relaxed">
              SIGNAL_RATIO: 94.2% // LATENCY: 0.12ms // VERIFIED_SKILLS: [REACT, RUST]
            </p>
            <div className="font-tech-mono text-[10px] text-[#111111]/50 border-t border-[#D9D9D2] pt-2">
              USAGE: Diagnostic Telemetry, System Parameters, Swatches
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: GEOMETRIC INSIGNIA SPECIFICATION */}
      <div className="border border-[#D9D9D2] bg-white p-6 sm:p-10 space-y-6">
        <div className="border-b border-[#D9D9D2] pb-4 flex items-center justify-between">
          <div>
            <div className="font-tech-mono text-[10px] text-[#3157FF] uppercase tracking-widest font-semibold">
              INSIGNIA GEOMETRY
            </div>
            <h2 className="font-display font-extrabold text-2xl uppercase tracking-tight text-[#111111] mt-0.5">
              Abstract Intelligence Symbol
            </h2>
          </div>
          <ChromeOrb size={28} />
        </div>

        <div className="p-8 border border-[#D9D9D2] bg-[#F7F6F2]/40 flex flex-col md:flex-row items-center gap-8">
          <div className="w-36 h-36 bg-white border border-[#D9D9D2] flex items-center justify-center shrink-0">
            <ChromeOrb size={72} />
          </div>

          <div className="space-y-3 text-xs">
            <div className="font-display font-bold text-base uppercase text-[#111111]">
              Metallic Refraction Mark
            </div>
            <p className="font-editorial text-sm text-[#111111]/80 italic leading-relaxed">
              {visuals?.logoConcept?.description ||
                'A fluid chrome sphere capturing dynamic multi-spectrum light, communicating autonomous precision and liquid adaptability.'}
            </p>
            <div className="font-tech-mono text-[10px] text-[#111111]/50 space-y-0.5">
              <div>GEOMETRY: Refractive Spherical Surface</div>
              <div>METALLIC MATRIX: Pearl #F7F6F2 · Cobalt #3157FF · Charcoal #111111</div>
            </div>
          </div>
        </div>
      </div>

      {/* Editorial Observation */}
      <EditorialAnnotation
        timestamp="10:35"
        observation="The chromatic palette and high-contrast typography achieve immediate visual restraint without resorting to generic purple neon."
        actionText="PROCEED TO STAGE 05: CHALLENGE & AUDIT →"
        onAction={onContinue}
      />
    </div>
  );
};
