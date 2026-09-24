import React, { useState } from 'react';
import {
  ArrowRight,
  Sparkles,
  RotateCcw,
  Layers,
  Shield,
  FileText
} from 'lucide-react';
import { BENCHMARK_IDEA } from '../data/sampleIdeas';
import { WorkflowStage } from '../types/brand';
import { ChromeOrb } from './ChromeOrb';
import { EditorialAnnotation } from './EditorialAnnotation';

interface LandingPageProps {
  onStartBuilding: (initialIdea?: string) => void;
  onLoadDemo: () => void;
  onNavigateStage: (stage: WorkflowStage) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartBuilding,
  onLoadDemo,
  onNavigateStage,
}) => {
  const [roughIdeaInput, setRoughIdeaInput] = useState<string>('');

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    onStartBuilding(roughIdeaInput.trim() || undefined);
  };

  return (
    <div className="flex-1 bg-[#F7F6F2] text-[#111111] overflow-y-auto">
      {/* Editorial Hero Section */}
      <section className="border-b border-[#D9D9D2] pt-12 sm:pt-20 pb-16 px-4 sm:px-12 max-w-7xl mx-auto">
        {/* Subtle Top Metadata */}
        <div className="flex items-center justify-between pb-8 border-b border-[#D9D9D2]/70 font-tech-mono text-[10px] text-[#111111]/50 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <ChromeOrb size={16} />
            <span>BRANDPULSE AI // LUXURY EDITORIAL STUDIO</span>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <span>AUTONOMOUS BRAND STRATEGY</span>
            <span>·</span>
            <span>SPECIFICATION 2026</span>
          </div>
        </div>

        {/* Extremely Large Headline with Short Phrases */}
        <div className="py-12 sm:py-20 max-w-5xl">
          <div className="font-tech-mono text-xs uppercase tracking-widest text-[#3157FF] font-semibold mb-4">
            SYSTEM 01 / BRAND INTELLIGENCE
          </div>

          <h1 className="font-display font-black text-6xl sm:text-8xl md:text-9xl leading-[0.88] tracking-[-0.04em] text-[#111111] uppercase select-none">
            MAKE<br />
            IT<br />
            DISTINCT.
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-10 sm:mt-16 pt-8 border-t border-[#D9D9D2]">
            <div className="md:col-span-7">
              <p className="font-editorial text-xl sm:text-2xl text-[#111111]/85 leading-snug italic">
                Transform rough ideas into enduring, defensible brand architectures.
                Reasoning across market stance, sharp voice laws, and ruthless consistency audits.
              </p>
            </div>

            <div className="md:col-span-5 font-tech-mono text-xs text-[#111111]/60 space-y-2">
              <p className="leading-relaxed">
                Replaces conventional agency delays with a 6-stage autonomous editorial pipeline. From raw problem space to physical brand dossier.
              </p>
            </div>
          </div>
        </div>

        {/* Streamlined Ingestion Area - Clean & Direct without junk clutter */}
        <div className="pt-6">
          <form
            onSubmit={handleStart}
            className="border border-[#D9D9D2] bg-white p-6 sm:p-8 shadow-[0_4px_24px_rgba(17,17,17,0.03)] space-y-5 max-w-4xl"
          >
            <div className="flex items-center justify-between font-tech-mono text-[11px] uppercase tracking-wider text-[#111111]/60">
              <span className="font-semibold text-[#111111]">RAW THESIS / PROBLEM DEFINITION</span>
              <span>INPUT 01</span>
            </div>

            <div>
              <textarea
                rows={3}
                value={roughIdeaInput}
                onChange={(e) => setRoughIdeaInput(e.target.value)}
                placeholder="Describe your rough concept, target audience friction, or unfair technical advantage..."
                className="w-full p-4 border border-[#D9D9D2] bg-[#F7F6F2]/40 text-sm sm:text-base font-editorial text-[#111111] placeholder-[#111111]/30 focus:outline-none focus:border-[#3157FF] transition-colors resize-none"
              />
            </div>

            {/* Action Bar: Primary Start + Single Benchmark Reference */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2 border-t border-[#D9D9D2]">
              <div className="flex items-center gap-2">
                <span className="font-tech-mono text-[10px] text-[#111111]/45 uppercase">
                  BENCHMARK REFERENCE:
                </span>
                <button
                  type="button"
                  onClick={onLoadDemo}
                  className="px-3 py-1 border border-[#D9D9D2] bg-[#F7F6F2] hover:border-[#111111] text-[#111111] text-xs font-tech-mono uppercase transition-colors"
                >
                  Load TeamMatch
                </button>
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 bg-[#111111] hover:bg-[#3157FF] text-white px-7 py-3 font-tech-mono text-xs uppercase font-semibold tracking-wider transition-colors"
              >
                <span>Initialize Pipeline</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>

          {/* Sample AI Observation Annotation (Prompt requirement) */}
          <div className="max-w-4xl pt-4">
            <EditorialAnnotation
              timestamp="09:42"
              observation="Your positioning is clear, but the language is similar to three existing categories."
              actionText="EXPLORE CONTRASTING VECTOR →"
              onAction={() => onNavigateStage('position')}
            />
          </div>
        </div>
      </section>

      {/* The 6 Horizontal Editorial Stages Breakdown */}
      <section className="py-16 sm:py-24 px-4 sm:px-12 max-w-7xl mx-auto">
        <div className="border-b border-[#D9D9D2] pb-6 mb-12 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <div className="font-tech-mono text-xs uppercase text-[#3157FF] font-semibold">
              WORKFLOW ARCHITECTURE
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-[#111111] mt-1">
              THE 6 EDITORIAL PHASES
            </h2>
          </div>
          <p className="font-editorial text-sm text-[#111111]/60 italic">
            Linear precision. Every stage stress-tests the previous assumption.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 01 DISCOVER */}
          <div
            onClick={() => onNavigateStage('discover')}
            className="border border-[#D9D9D2] bg-white p-6 hover:border-[#111111] transition-all cursor-pointer group space-y-4"
          >
            <div className="flex items-center justify-between font-tech-mono text-[11px] text-[#111111]/45 uppercase">
              <span className="font-bold text-[#3157FF]">01 / DISCOVER</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
            <h3 className="font-display font-bold text-lg uppercase text-[#111111]">
              Brief & Needs
            </h3>
            <p className="font-editorial text-xs text-[#111111]/70 leading-relaxed">
              Targeted Socratic diagnostics extract real user pain, contrarian insights, and true market friction.
            </p>
          </div>

          {/* 02 POSITION */}
          <div
            onClick={() => onNavigateStage('position')}
            className="border border-[#D9D9D2] bg-white p-6 hover:border-[#111111] transition-all cursor-pointer group space-y-4"
          >
            <div className="flex items-center justify-between font-tech-mono text-[11px] text-[#111111]/45 uppercase">
              <span className="font-bold text-[#3157FF]">02 / POSITION</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
            <h3 className="font-display font-bold text-lg uppercase text-[#111111]">
              Market Stance
            </h3>
            <p className="font-editorial text-xs text-[#111111]/70 leading-relaxed">
              Generate 3 distinct strategic vectors. Select your moat, core promise, and competitive angle.
            </p>
          </div>

          {/* 03 SHAPE */}
          <div
            onClick={() => onNavigateStage('shape')}
            className="border border-[#D9D9D2] bg-white p-6 hover:border-[#111111] transition-all cursor-pointer group space-y-4"
          >
            <div className="flex items-center justify-between font-tech-mono text-[11px] text-[#111111]/45 uppercase">
              <span className="font-bold text-[#3157FF]">03 / SHAPE</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
            <h3 className="font-display font-bold text-lg uppercase text-[#111111]">
              Name & Voice
            </h3>
            <p className="font-editorial text-xs text-[#111111]/70 leading-relaxed">
              Curate high-memorability name candidates, personality traits with banned anti-traits, and voice principles.
            </p>
          </div>

          {/* 04 VISUALIZE */}
          <div
            onClick={() => onNavigateStage('visualize')}
            className="border border-[#D9D9D2] bg-white p-6 hover:border-[#111111] transition-all cursor-pointer group space-y-4"
          >
            <div className="flex items-center justify-between font-tech-mono text-[11px] text-[#111111]/45 uppercase">
              <span className="font-bold text-[#3157FF]">04 / VISUALIZE</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
            <h3 className="font-display font-bold text-lg uppercase text-[#111111]">
              Visual System
            </h3>
            <p className="font-editorial text-xs text-[#111111]/70 leading-relaxed">
              Calibrated 5-color palette, high-contrast typography hierarchy, and geometric insignia concept.
            </p>
          </div>

          {/* 05 CHALLENGE */}
          <div
            onClick={() => onNavigateStage('challenge')}
            className="border border-[#D9D9D2] bg-white p-6 hover:border-[#111111] transition-all cursor-pointer group space-y-4"
          >
            <div className="flex items-center justify-between font-tech-mono text-[11px] text-[#111111]/45 uppercase">
              <span className="font-bold text-[#3157FF]">05 / CHALLENGE</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
            <h3 className="font-display font-bold text-lg uppercase text-[#111111]">
              Battle & Audit
            </h3>
            <p className="font-editorial text-xs text-[#111111]/70 leading-relaxed">
              Split-screen debate between The Advocate and The Critic. Luxury product diagnostic report for consistency.
            </p>
          </div>

          {/* 06 LAUNCH */}
          <div
            onClick={() => onNavigateStage('launch')}
            className="border border-[#D9D9D2] bg-white p-6 hover:border-[#111111] transition-all cursor-pointer group space-y-4"
          >
            <div className="flex items-center justify-between font-tech-mono text-[11px] text-[#111111]/45 uppercase">
              <span className="font-bold text-[#3157FF]">06 / LAUNCH</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
            <h3 className="font-display font-bold text-lg uppercase text-[#111111]">
              Brand Dossier / 001
            </h3>
            <p className="font-editorial text-xs text-[#111111]/70 leading-relaxed">
              Physical magazine-style brand dossier. Executive-ready identity book with landing copy and press assets.
            </p>
          </div>
        </div>
      </section>

      {/* Luxury Footer */}
      <footer className="border-t border-[#D9D9D2] py-8 px-4 sm:px-12 text-center text-xs font-tech-mono text-[#111111]/40 uppercase tracking-widest">
        BRANDPULSE AI · LUXURY EDITORIAL STUDIO · ALL RIGHTS RESERVED
      </footer>
    </div>
  );
};
