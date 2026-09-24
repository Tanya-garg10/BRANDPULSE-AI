import React from 'react';
import { ChromeOrb } from './ChromeOrb';

interface EditorialAnnotationProps {
  timestamp?: string;
  observation: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EditorialAnnotation: React.FC<EditorialAnnotationProps> = ({
  timestamp = '09:42',
  observation,
  actionText = 'REWORK →',
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`border-l-2 border-[#3157FF] bg-white/70 backdrop-blur-xs p-3.5 sm:p-4 my-4 space-y-2 border border-[#D9D9D2] shadow-[0_1px_2px_rgba(17,17,17,0.03)] ${className}`}
    >
      <div className="flex items-center justify-between font-tech-mono text-[10px] text-[#111111]/55 uppercase tracking-widest">
        <div className="flex items-center gap-1.5">
          <ChromeOrb size={14} />
          <span className="font-semibold text-[#111111]/80">AI OBSERVATION</span>
          <span>/</span>
          <span>{timestamp}</span>
        </div>
        <span className="text-[#3157FF] text-[9px] font-bold">REASONING ACTIVE</span>
      </div>

      <p className="font-editorial text-xs sm:text-[13px] text-[#111111] italic leading-relaxed">
        "{observation}"
      </p>

      {actionText && (
        <div className="pt-1">
          <button
            onClick={onAction}
            className="font-tech-mono text-[11px] text-[#3157FF] hover:text-[#111111] font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-1 group"
          >
            <span>{actionText}</span>
          </button>
        </div>
      )}
    </div>
  );
};
