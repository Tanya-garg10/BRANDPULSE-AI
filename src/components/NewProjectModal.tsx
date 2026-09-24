import React, { useState } from 'react';
import { X, ArrowRight, RotateCcw } from 'lucide-react';
import { BENCHMARK_IDEA } from '../data/sampleIdeas';
import { ChromeOrb } from './ChromeOrb';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: {
    projectName: string;
    roughIdea: string;
    targetAudience?: string;
    industry?: string;
    marketLocation?: string;
    constraints?: string;
  }) => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [projectName, setProjectName] = useState('');
  const [roughIdea, setRoughIdea] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [industry, setIndustry] = useState('');
  const [marketLocation, setMarketLocation] = useState('');
  const [constraints, setConstraints] = useState('');
  const [showOptional, setShowOptional] = useState(false);

  if (!isOpen) return null;

  const handleApplyBenchmark = () => {
    setProjectName(BENCHMARK_IDEA.name);
    setRoughIdea(BENCHMARK_IDEA.roughIdea);
    setTargetAudience(BENCHMARK_IDEA.targetAudience);
    setIndustry(BENCHMARK_IDEA.industry);
    setMarketLocation(BENCHMARK_IDEA.marketLocation);
    setConstraints(BENCHMARK_IDEA.constraints);
    setShowOptional(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim() || !roughIdea.trim()) return;

    onCreate({
      projectName,
      roughIdea,
      targetAudience,
      industry,
      marketLocation,
      constraints,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111111]/30 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl border border-[#D9D9D2] bg-white p-6 sm:p-10 shadow-[0_20px_60px_rgba(17,17,17,0.08)] my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-1.5 text-[#111111]/40 hover:text-[#111111] transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="border-b border-[#D9D9D2] pb-5 mb-6">
          <div className="flex items-center gap-2 mb-2 font-tech-mono text-[10px] text-[#3157FF] uppercase font-semibold tracking-widest">
            <ChromeOrb size={14} />
            <span>01 / INGESTION PROTOCOL</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl uppercase tracking-tight text-[#111111]">
            New Brand Project
          </h2>
          <p className="font-editorial text-xs text-[#111111]/60 italic mt-1">
            Define your raw project thesis to initiate the 6-stage autonomous brand pipeline.
          </p>
        </div>

        {/* Single Streamlined Benchmark Reference */}
        <div className="mb-6 p-3 bg-[#F7F6F2] border border-[#D9D9D2] flex items-center justify-between">
          <div className="font-tech-mono text-[10px] uppercase text-[#111111]/60">
            BENCHMARK SPECIFICATION:
          </div>
          <button
            type="button"
            onClick={handleApplyBenchmark}
            className="px-2.5 py-1 text-[10px] font-tech-mono uppercase bg-white border border-[#D9D9D2] hover:border-[#111111] text-[#111111] transition-colors"
          >
            Load TeamMatch Sample
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-tech-mono">
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[#111111]/60 font-semibold mb-1.5">
              PROJECT TITLE *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. AURA or TeamMatch"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full p-3 border border-[#D9D9D2] bg-[#F7F6F2]/30 text-xs text-[#111111] outline-none focus:border-[#3157FF] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[#111111]/60 font-semibold mb-1.5">
              ROUGH THESIS & VALUE PROPOSITION *
            </label>
            <textarea
              required
              rows={3}
              placeholder="What friction exists, who experiences it, and what is your contrarian angle?"
              value={roughIdea}
              onChange={(e) => setRoughIdea(e.target.value)}
              className="w-full p-3 border border-[#D9D9D2] bg-[#F7F6F2]/30 text-xs font-editorial text-[#111111] outline-none focus:border-[#3157FF] transition-colors resize-none"
            />
          </div>

          {/* Optional parameters toggle */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowOptional(!showOptional)}
              className="text-[10px] uppercase text-[#3157FF] font-semibold hover:underline"
            >
              {showOptional ? '− HIDE PARAMETERS' : '+ SPECIFY AUDIENCE & CONSTRAINTS'}
            </button>
          </div>

          {showOptional && (
            <div className="space-y-3 pt-3 border-t border-[#D9D9D2] text-[11px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase text-[#111111]/50 mb-1">Target Audience:</label>
                  <input
                    type="text"
                    placeholder="e.g. Student engineers, solo founders"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full p-2.5 border border-[#D9D9D2] bg-[#F7F6F2]/30 text-xs text-[#111111]"
                  />
                </div>
                <div>
                  <label className="block uppercase text-[#111111]/50 mb-1">Category:</label>
                  <input
                    type="text"
                    placeholder="e.g. Developer Tools, EdTech"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full p-2.5 border border-[#D9D9D2] bg-[#F7F6F2]/30 text-xs text-[#111111]"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase text-[#111111]/50 mb-1">Guardrails / Anti-Traits:</label>
                <input
                  type="text"
                  placeholder="e.g. No corporate jargon; no gamified dating app swipe patterns"
                  value={constraints}
                  onChange={(e) => setConstraints(e.target.value)}
                  className="w-full p-2.5 border border-[#D9D9D2] bg-[#F7F6F2]/30 text-xs text-[#111111]"
                />
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="pt-5 border-t border-[#D9D9D2] flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="text-xs uppercase text-[#111111]/50 hover:text-[#111111]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!projectName.trim() || !roughIdea.trim()}
              className="inline-flex items-center gap-2 bg-[#111111] hover:bg-[#3157FF] text-white px-6 py-2.5 text-xs uppercase font-semibold tracking-wider transition-colors disabled:opacity-40"
            >
              <span>Initialize Pipeline</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
