import React from 'react';

interface ChromeOrbProps {
  size?: number;
  isThinking?: boolean;
  className?: string;
}

export const ChromeOrb: React.FC<ChromeOrbProps> = ({
  size = 28,
  isThinking = false,
  className = '',
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
      title={isThinking ? 'BrandPulse AI reasoning...' : 'BrandPulse Intelligence Core'}
    >
      <svg
        viewBox="0 0 100 100"
        className={`w-full h-full ${isThinking ? 'animate-spin-slow' : ''}`}
        style={{ filter: 'drop-shadow(0 2px 6px rgba(17, 17, 17, 0.08))' }}
      >
        <defs>
          {/* Chrome / Liquid Metal Reflection Gradient */}
          <radialGradient id="chromeGradient" cx="38%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="28%" stopColor="#ECEBE6" />
            <stop offset="55%" stopColor="#C8C7BF" />
            <stop offset="78%" stopColor="#9C9B94" />
            <stop offset="92%" stopColor="#E5E4DC" />
            <stop offset="100%" stopColor="#4A4944" />
          </radialGradient>

          {/* Specular Highlight Sheen */}
          <linearGradient id="specularSheen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#3157FF" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#111111" stopOpacity="0.3" />
          </linearGradient>

          {/* Refraction Rim */}
          <linearGradient id="rimLight" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#3157FF" stopOpacity="0.45" />
            <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="85%" stopColor="#FF6B5F" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.1" />
          </linearGradient>

          {/* Ambient Glow */}
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Rim Ring */}
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="none"
          stroke="url(#rimLight)"
          strokeWidth="1.5"
          className={isThinking ? 'opacity-80' : 'opacity-40'}
        />

        {/* Base Metallic Sphere */}
        <circle
          cx="50"
          cy="50"
          r="44"
          fill="url(#chromeGradient)"
        />

        {/* Specular Glint */}
        <ellipse
          cx="42"
          cy="36"
          rx="22"
          ry="14"
          fill="url(#specularSheen)"
          transform="rotate(-25 42 36)"
        />

        {/* Fluid Chrome Core Highlight */}
        <circle
          cx="38"
          cy="32"
          r="4.5"
          fill="#FFFFFF"
          opacity="0.95"
        />

        {/* Dynamic cobalt pulse ring during thinking */}
        {isThinking && (
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="#3157FF"
            strokeWidth="1.2"
            strokeDasharray="16 12"
            className="animate-spin"
            opacity="0.75"
          />
        )}
      </svg>
    </div>
  );
};
