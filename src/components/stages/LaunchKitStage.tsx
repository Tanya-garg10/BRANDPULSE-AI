import React, { useState } from 'react';
import {
  Copy,
  Check,
  Printer,
  FileText,
  ChevronLeft,
  ChevronRight,
  Globe,
  Linkedin,
  Sparkles
} from 'lucide-react';
import {
  BrandProject,
  LaunchKitData,
  ColorSwatch
} from '../../types/brand';
import { generateLaunchKit } from '../../services/api';
import { ChromeOrb } from '../ChromeOrb';

interface LaunchKitStageProps {
  project: BrandProject;
  onUpdateProject: (updated: BrandProject) => void;
  onOpenExport: () => void;
}

export const LaunchKitStage: React.FC<LaunchKitStageProps> = ({
  project,
  onUpdateProject,
  onOpenExport,
}) => {
  const [activeSpread, setActiveSpread] = useState<number>(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [launchKit, setLaunchKit] = useState<LaunchKitData | null>(
    project.launchKit || null
  );

  const selectedPositioning = project.positioning.directions.find(
    (d) => d.id === project.positioning.selectedDirectionId
  ) || project.positioning.directions[0];

  const brandName = project.shape?.naming.selectedName || project.projectName;
  const tagline = project.shape?.messaging.tagline || selectedPositioning?.oneLiner || '';
  const personality = project.shape?.personality;
  const messaging = project.shape?.messaging;
  const visuals = project.visualize;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRegenerateLaunchKit = async () => {
    if (!project.discovery.brandBrief || !selectedPositioning || !project.shape) return;
    setLoading(true);
    try {
      const generated = await generateLaunchKit(
        project,
        project.discovery.brandBrief,
        selectedPositioning,
        project.shape,
        project.visualize || undefined
      );
      setLaunchKit(generated);
      onUpdateProject({
        ...project,
        launchKit: generated,
        completedStages: Array.from(new Set([...project.completedStages, 'launch'])),
      });
    } catch (err) {
      console.error('Error generating launch kit:', err);
    } finally {
      setLoading(false);
    }
  };

  const paletteList: ColorSwatch[] = visuals?.colorMood?.palette || visuals?.palette || [];
  const displayFont = visuals?.typography?.headlineFont || visuals?.typography?.primaryDisplay || 'Newsreader + Plus Jakarta Sans';
  const dataFont = visuals?.typography?.bodyFont || visuals?.typography?.secondaryBody || 'JetBrains Mono';

  const linkedInContent = launchKit?.linkedInPost
    ? `${launchKit.linkedInPost.hook}\n\n${launchKit.linkedInPost.body}\n\n${launchKit.linkedInPost.callToAction}`
    : launchKit?.founderPostLinkedIn || `We're launching ${brandName}. ${tagline}\n\nEngineered for builders who prioritize execution over hollow networking.`;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      {/* Editorial Header Stamp */}
      <div className="border-b border-[#D9D9D2] pb-6">
        <div className="flex items-center justify-between font-tech-mono text-[10px] uppercase tracking-widest text-[#111111]/50 mb-2">
          <div className="flex items-center gap-2">
            <ChromeOrb size={14} isThinking={loading} />
            <span className="text-[#3157FF] font-semibold">06 / LAUNCH</span>
          </div>
          <span>SPECIFICATION // BRAND_DOSSIER_001</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tight text-[#111111]">
              BRAND DOSSIER / 001
            </h1>
            <p className="font-editorial text-sm sm:text-base text-[#111111]/75 mt-1 italic max-w-2xl">
              The finalized strategic identity record. Formatted as an editorial physical publication for executive alignment, team onboarding, and launch execution.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenExport}
              className="inline-flex items-center gap-2 bg-[#111111] hover:bg-[#3157FF] text-white px-5 py-2.5 text-xs font-tech-mono uppercase font-semibold tracking-wider transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Export Book (PDF / MD)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Magazine Spread Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-[#D9D9D2] pb-3 text-xs font-tech-mono">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 1, label: 'SPREAD 01 // COVER & THESIS' },
            { id: 2, label: 'SPREAD 02 // POSITION & VOICE' },
            { id: 3, label: 'SPREAD 03 // VISUAL SYSTEM' },
            { id: 4, label: 'SPREAD 04 // LAUNCH CAMPAIGN' },
          ].map((spread) => (
            <button
              key={spread.id}
              onClick={() => setActiveSpread(spread.id)}
              className={`px-3 py-1.5 transition-colors uppercase whitespace-nowrap ${
                activeSpread === spread.id
                  ? 'bg-white border border-[#D9D9D2] text-[#3157FF] font-bold'
                  : 'text-[#111111]/50 hover:text-[#111111]'
              }`}
            >
              {spread.label}
            </button>
          ))}
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[10px] text-[#111111]/45">
          <button
            onClick={() => setActiveSpread((prev) => Math.max(1, prev - 1))}
            disabled={activeSpread === 1}
            className="p-1 hover:text-[#111111] disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span>P. 0{activeSpread} / 04</span>
          <button
            onClick={() => setActiveSpread((prev) => Math.min(4, prev + 1))}
            disabled={activeSpread === 4}
            className="p-1 hover:text-[#111111] disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* DIGITAL MAGAZINE PHYSICAL DOSSIER SPREADS */}
      <div className="border border-[#D9D9D2] bg-white p-8 sm:p-14 shadow-[0_12px_40px_rgba(17,17,17,0.04)] min-h-[580px] page-fade-in key={activeSpread}">
        {/* SPREAD 01: COVER & THESIS */}
        {activeSpread === 1 && (
          <div className="space-y-12 page-fade-in">
            {/* Magazine Cover Header */}
            <div className="border-b-2 border-[#111111] pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div>
                <div className="font-tech-mono text-[10px] text-[#3157FF] uppercase tracking-widest font-semibold mb-2">
                  BRANDPULSE AI // DOSSIER ARCHIVE // EDITION 001
                </div>
                <h1 className="font-display font-black text-6xl sm:text-7xl uppercase tracking-[-0.03em] text-[#111111]">
                  {brandName}
                </h1>
                <p className="font-editorial text-xl sm:text-2xl text-[#111111]/80 italic mt-2">
                  "{tagline}"
                </p>
              </div>

              <div className="font-tech-mono text-[10px] uppercase text-[#111111]/50 space-y-1 sm:text-right shrink-0">
                <div>REF: DOSSIER-2026-001</div>
                <div>COHERENCE: <span className="text-[#3157FF] font-bold">94% VERIFIED</span></div>
                <div>STATUS: <span className="text-[#111111] font-bold">DEPLOYMENT READY</span></div>
              </div>
            </div>

            {/* Core Thesis & Problem Statement */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <span className="font-tech-mono text-[10px] uppercase text-[#3157FF] tracking-widest font-semibold block">
                  01 / AUDIENCE REALITY
                </span>
                <p className="font-sans font-medium text-sm text-[#111111] leading-relaxed">
                  {project.discovery.brandBrief?.targetAudience || project.targetAudience}
                </p>
                <div className="pt-2">
                  <span className="font-tech-mono text-[10px] uppercase text-[#111111]/45 tracking-wider block mb-1">
                    ACUTE UNMET FRICTION:
                  </span>
                  <p className="font-sans text-xs text-[#111111]/75 leading-relaxed">
                    {project.discovery.brandBrief?.problem || project.roughIdea}
                  </p>
                </div>
              </div>

              <div className="space-y-4 border-t md:border-t-0 md:border-l border-[#D9D9D2] pt-6 md:pt-0 md:pl-10">
                <span className="font-tech-mono text-[10px] uppercase text-[#3157FF] tracking-widest font-semibold block">
                  02 / CONTRARIAN TRUTH
                </span>
                <p className="font-editorial text-lg italic text-[#111111] leading-relaxed">
                  “{project.discovery.brandBrief?.initialInsight || 'The best teams are not formed by friendships or charisma, but by complementary capability asymmetry.'}”
                </p>
                <div className="pt-2 text-xs font-tech-mono text-[#111111]/60">
                  <span className="text-[#3157FF] font-bold">OUTCOME:</span> {project.discovery.brandBrief?.userNeed || 'Shipping complete, demoed products with zero team dropoff.'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SPREAD 02: POSITION & VOICE */}
        {activeSpread === 2 && (
          <div className="space-y-12 page-fade-in">
            <div className="border-b border-[#D9D9D2] pb-6 flex items-center justify-between">
              <div>
                <span className="font-tech-mono text-[10px] text-[#3157FF] uppercase tracking-widest font-semibold">
                  SPREAD 02 // POSITIONING & VERBAL LAWS
                </span>
                <h2 className="font-display font-extrabold text-3xl uppercase tracking-tight text-[#111111] mt-1">
                  STRATEGIC MOAT & VOICE MATRIX
                </h2>
              </div>
              <span className="font-tech-mono text-xs text-[#111111]/50">P. 02</span>
            </div>

            {/* Strategic Stance */}
            <div className="space-y-4">
              <div className="font-tech-mono text-xs uppercase font-bold text-[#111111] border-b border-[#D9D9D2] pb-1">
                [STRATEGIC POSITIONING]
              </div>
              <h3 className="font-display font-black text-2xl uppercase text-[#111111]">
                {selectedPositioning?.name}
              </h3>
              <p className="font-editorial text-lg text-[#111111] italic leading-relaxed">
                "{selectedPositioning?.oneLiner}"
              </p>
              <div className="font-tech-mono text-xs text-[#3157FF] pt-1">
                COMPETITIVE DIFFERENTIATOR: {selectedPositioning?.differentiator}
              </div>
            </div>

            {/* Personality & Banned Traits */}
            <div className="space-y-4 pt-4 border-t border-[#D9D9D2]">
              <div className="font-tech-mono text-xs uppercase font-bold text-[#111111] border-b border-[#D9D9D2] pb-1">
                [PERSONALITY PILLARS & GUARDRAILS]
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {personality?.traits ? (
                  personality.traits.map((t, idx) => (
                    <div key={idx} className="p-4 border border-[#D9D9D2] bg-[#F7F6F2]/30 space-y-1">
                      <div className="font-tech-mono text-[10px] text-[#3157FF] font-bold">PILLAR 0{idx + 1}</div>
                      <div className="font-display font-bold text-sm uppercase text-[#111111]">{t.trait}</div>
                      <p className="font-editorial text-xs text-[#111111]/75 leading-relaxed">{t.rationale}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-[#111111]/60">Hacker-Native, Pragmatic, High-Signal</div>
                )}
              </div>

              {personality?.avoidTraits && (
                <div className="p-3 border border-[#FF6B5F] bg-[#FF6B5F]/5 text-xs font-tech-mono text-[#111111]">
                  <span className="text-[#FF6B5F] font-bold uppercase">BANNED ANTI-TRAITS:</span>{' '}
                  {personality.avoidTraits.map((a) => a.trait).join(' · ')}
                </div>
              )}
            </div>

            {/* Voice Laws */}
            <div className="space-y-4 pt-4 border-t border-[#D9D9D2]">
              <div className="font-tech-mono text-xs uppercase font-bold text-[#111111] border-b border-[#D9D9D2] pb-1">
                [VOICE GOVERNANCE RULES]
              </div>
              <p className="font-editorial text-sm text-[#111111] italic leading-relaxed">
                "{messaging?.brandVoice}"
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {messaging?.voicePrinciples?.map((vp, idx) => (
                  <div key={idx} className="p-3.5 border border-[#D9D9D2] bg-[#F7F6F2]/30 text-xs font-tech-mono space-y-1">
                    <div className="text-[#3157FF] font-bold">✓ DO: {vp.do}</div>
                    <div className="text-[#FF6B5F]">✕ DON'T: {vp.dont}</div>
                    {vp.example && (
                      <div className="text-[10px] text-[#111111]/60 italic font-editorial mt-1">
                        "{vp.example}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SPREAD 03: VISUAL SYSTEM */}
        {activeSpread === 3 && (
          <div className="space-y-12 page-fade-in">
            <div className="border-b border-[#D9D9D2] pb-6 flex items-center justify-between">
              <div>
                <span className="font-tech-mono text-[10px] text-[#3157FF] uppercase tracking-widest font-semibold">
                  SPREAD 03 // CHROMATIC & TYPOGRAPHIC STANDARDS
                </span>
                <h2 className="font-display font-extrabold text-3xl uppercase tracking-tight text-[#111111] mt-1">
                  VISUAL ARCHITECTURE
                </h2>
              </div>
              <span className="font-tech-mono text-xs text-[#111111]/50">P. 03</span>
            </div>

            {/* Chromatic Palette Display */}
            <div className="space-y-4">
              <div className="font-tech-mono text-xs uppercase font-bold text-[#111111] border-b border-[#D9D9D2] pb-1">
                [CALIBRATED COLOR HIERARCHY]
              </div>

              {paletteList.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  {paletteList.map((swatch, idx) => (
                    <div key={idx} className="border border-[#D9D9D2] p-3 space-y-2 bg-[#F7F6F2]/30">
                      <div
                        className="h-16 w-full border border-[#111111]/10"
                        style={{ backgroundColor: swatch.hex }}
                      />
                      <div className="font-tech-mono text-[10px] font-bold text-[#3157FF] uppercase">
                        {swatch.role || `NODE 0${idx + 1}`}
                      </div>
                      <div className="font-display font-bold text-xs uppercase text-[#111111] truncate">
                        {swatch.name}
                      </div>
                      <div className="font-tech-mono text-[10px] text-[#111111]/60">
                        {swatch.hex}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Typography Standards */}
            <div className="space-y-4 pt-4 border-t border-[#D9D9D2]">
              <div className="font-tech-mono text-xs uppercase font-bold text-[#111111] border-b border-[#D9D9D2] pb-1">
                [TYPOGRAPHIC HIERARCHY]
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-tech-mono">
                <div className="p-5 border border-[#D9D9D2] bg-[#F7F6F2]/30 space-y-2">
                  <span className="text-[#3157FF] font-semibold uppercase block">PRIMARY DISPLAY TYPEFACE:</span>
                  <span className="font-display font-black text-2xl uppercase text-[#111111] block">
                    {displayFont}
                  </span>
                  <p className="font-editorial text-xs italic text-[#111111]/70">
                    Used for oversized editorial headlines, section stamps, and brand marks.
                  </p>
                </div>

                <div className="p-5 border border-[#D9D9D2] bg-[#F7F6F2]/30 space-y-2">
                  <span className="text-[#3157FF] font-semibold uppercase block">DATA & METADATA TYPEFACE:</span>
                  <span className="font-tech-mono font-bold text-2xl text-[#111111] block">
                    {dataFont}
                  </span>
                  <p className="font-tech-mono text-xs text-[#111111]/70">
                    Used for diagnostic telemetry, specs, indices, and system parameters.
                  </p>
                </div>
              </div>
            </div>

            {/* Brand Mark Preview */}
            <div className="p-8 border border-[#D9D9D2] bg-[#F7F6F2]/40 flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-tech-mono text-[10px] text-[#3157FF] uppercase font-semibold">
                  DIGITAL INSIGNIA
                </div>
                <div className="font-display font-black text-3xl uppercase tracking-tight text-[#111111]">
                  {brandName}
                </div>
              </div>
              <ChromeOrb size={48} />
            </div>
          </div>
        )}

        {/* SPREAD 04: LAUNCH CAMPAIGN */}
        {activeSpread === 4 && (
          <div className="space-y-10 page-fade-in">
            <div className="border-b border-[#D9D9D2] pb-6 flex items-center justify-between">
              <div>
                <span className="font-tech-mono text-[10px] text-[#3157FF] uppercase tracking-widest font-semibold">
                  SPREAD 04 // DEPLOYMENT & GO-TO-MARKET ASSETS
                </span>
                <h2 className="font-display font-extrabold text-3xl uppercase tracking-tight text-[#111111] mt-1">
                  LAUNCH MESSAGING SPECIFICATION
                </h2>
              </div>
              <span className="font-tech-mono text-xs text-[#111111]/50">P. 04</span>
            </div>

            {/* Landing Page Hero Copy */}
            <div className="p-6 border border-[#D9D9D2] bg-[#F7F6F2]/30 space-y-4">
              <div className="flex items-center justify-between font-tech-mono text-[10px] text-[#111111]/50 uppercase">
                <span className="font-bold text-[#111111] flex items-center gap-1.5">
                  <Globe className="h-3 w-3 text-[#3157FF]" /> LANDING HERO COPY
                </span>
                <button
                  onClick={() => copyToClipboard(
                    `${launchKit?.landingHero?.headline || `Make it distinct. Find the missing skill for your hackathon squad.`}\n${launchKit?.landingHero?.subheadline || `Verify complementary skills, work styles, and commitment before the countdown begins.`}\nCTA: ${launchKit?.landingHero?.ctaButtonText || 'Find Your Teammate'}`,
                    'landing-hero'
                  )}
                  className="hover:text-[#3157FF] flex items-center gap-1 font-bold text-[#111111]"
                >
                  {copiedId === 'landing-hero' ? <Check className="h-3 w-3 text-[#3157FF]" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedId === 'landing-hero' ? 'COPIED' : 'COPY'}</span>
                </button>
              </div>

              <h3 className="font-display font-black text-2xl uppercase tracking-tight text-[#111111]">
                {launchKit?.landingHero?.headline || `Find teammates who actually finish.`}
              </h3>
              <p className="font-editorial text-sm text-[#111111]/80 leading-relaxed">
                {launchKit?.landingHero?.subheadline || `No chaotic Discord mixers. Pair on verified skills and work styles.`}
              </p>
              <div className="pt-2 flex items-center gap-3">
                <span className="px-5 py-2.5 bg-[#111111] text-white font-tech-mono text-xs font-semibold uppercase">
                  {launchKit?.landingHero?.ctaButtonText || launchKit?.landingHero?.primaryCta || 'Launch Workspace'}
                </span>
              </div>
            </div>

            {/* Founder Announcement Post */}
            <div className="p-6 border border-[#D9D9D2] bg-[#F7F6F2]/30 space-y-4">
              <div className="flex items-center justify-between font-tech-mono text-[10px] text-[#111111]/50 uppercase">
                <span className="font-bold text-[#111111] flex items-center gap-1.5">
                  <Linkedin className="h-3 w-3 text-[#3157FF]" /> FOUNDER ANNOUNCEMENT (LINKEDIN / X)
                </span>
                <button
                  onClick={() => copyToClipboard(linkedInContent, 'linkedin')}
                  className="hover:text-[#3157FF] flex items-center gap-1 font-bold text-[#111111]"
                >
                  {copiedId === 'linkedin' ? <Check className="h-3 w-3 text-[#3157FF]" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedId === 'linkedin' ? 'COPIED' : 'COPY'}</span>
                </button>
              </div>

              <p className="text-xs text-[#111111] leading-relaxed whitespace-pre-line font-sans bg-white p-5 border border-[#D9D9D2]">
                {linkedInContent}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation Controls */}
      <div className="flex items-center justify-between pt-4 border-t border-[#D9D9D2] font-tech-mono text-xs">
        <button
          onClick={() => setActiveSpread((prev) => Math.max(1, prev - 1))}
          disabled={activeSpread === 1}
          className="inline-flex items-center gap-1 text-[#111111]/60 hover:text-[#111111] disabled:opacity-30 uppercase"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span>Previous Spread</span>
        </button>

        <button
          onClick={onOpenExport}
          className="inline-flex items-center gap-1.5 text-[#3157FF] font-semibold hover:underline uppercase"
        >
          <Printer className="h-3.5 w-3.5" />
          <span>Export Entire Dossier</span>
        </button>

        <button
          onClick={() => setActiveSpread((prev) => Math.min(4, prev + 1))}
          disabled={activeSpread === 4}
          className="inline-flex items-center gap-1 text-[#111111]/60 hover:text-[#111111] disabled:opacity-30 uppercase"
        >
          <span>Next Spread</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
