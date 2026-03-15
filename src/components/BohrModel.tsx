import React from 'react';

/**
 * Enhanced Bohr model atom diagram.
 * Renders concentric electron shells with orbiting electrons as an SVG.
 *
 * Props:
 *  - shells:    number[] — electrons per shell, e.g. [2, 8, 1]
 *  - symbol:    string   — element symbol shown in the nucleus
 *  - color:     string   — accent colour for electrons and glow
 *  - size:      number   — SVG viewport size (default 200)
 *  - detailed:  boolean  — show shell labels, electron counts, and legend
 *  - onClick:   function — callback when the model is clicked
 */
interface BohrModelProps {
  shells: number[];
  symbol: string;
  color: string;
  size?: number;
  detailed?: boolean;
  onClick?: () => void;
  atomicNumber?: number;
}

const SHELL_NAMES = ['K', 'L', 'M', 'N', 'O', 'P', 'Q'];
const SHELL_MAX   = [2, 8, 18, 32, 32, 18, 8]; // max electrons per shell

export const BohrModel: React.FC<BohrModelProps> = ({
  shells,
  symbol,
  color,
  size = 200,
  detailed = false,
  onClick,
  atomicNumber,
}) => {
  const cx = size / 2;
  const cy = size / 2;
  const nucleusR = detailed ? size * 0.08 : size * 0.1;
  const maxShellR = size * 0.44;
  const minShellR = detailed ? size * 0.16 : size * 0.18;
  const shellCount = shells.length;
  const electronR = detailed ? Math.max(3, size * 0.012) : 3.5;
  const filterId = `electron-glow-${symbol}-${size}`;
  const nucleusGradId = `nucleus-grad-${symbol}-${size}`;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      className={`block mx-auto ${onClick ? 'cursor-pointer hover:drop-shadow-lg transition-all duration-200' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
    >
      <defs>
        {/* Glow filter for electrons */}
        <filter id={filterId} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation={detailed ? 3 : 2} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Nucleus radial gradient */}
        <radialGradient id={nucleusGradId}>
          <stop offset="0%" stopColor={color} stopOpacity="0.6" />
          <stop offset="100%" stopColor={color} stopOpacity="0.2" />
        </radialGradient>
        {/* Shell gradient for orbit rings */}
        {shells.map((_, i) => (
          <radialGradient key={`sg-${i}`} id={`shell-ring-${symbol}-${i}-${size}`}>
            <stop offset="85%" stopColor={color} stopOpacity={0.0} />
            <stop offset="100%" stopColor={color} stopOpacity={detailed ? 0.06 : 0.03} />
          </radialGradient>
        ))}
      </defs>

      {/* Shell orbits + electrons */}
      {shells.map((electronCount, i) => {
        const r =
          shellCount === 1
            ? minShellR
            : minShellR + ((maxShellR - minShellR) * i) / (shellCount - 1);
        const duration = 6 + i * 4;
        const direction = i % 2 === 0 ? 1 : -1;

        // Shell ring visual properties — more visible
        const ringOpacity = detailed ? 0.25 : 0.15;
        const ringWidth = detailed ? 1.5 : 1;
        const dashArray = detailed ? '6 4' : '4 4';

        // Color varies slightly per shell for clarity
        const shellHue = i * 30; // slight hue shift
        const shellColor = detailed ? `hsl(${230 + shellHue}, 70%, 70%)` : 'white';

        return (
          <g key={`shell-${i}`}>
            {/* Shell fill (subtle radial glow) */}
            {detailed && (
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill={`url(#shell-ring-${symbol}-${i}-${size})`}
              />
            )}

            {/* Orbit ring */}
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={shellColor}
              strokeOpacity={ringOpacity}
              strokeWidth={ringWidth}
              strokeDasharray={dashArray}
            />

            {/* Shell label (right side) */}
            <text
              x={cx + r + (detailed ? 8 : 4)}
              y={cy - (detailed ? 6 : 4)}
              fill={shellColor}
              fillOpacity={detailed ? 0.7 : 0.25}
              fontSize={detailed ? 11 : 7}
              fontFamily="monospace"
              fontWeight={detailed ? 700 : 400}
            >
              {SHELL_NAMES[i]}
            </text>

            {/* Electron count per shell (detailed mode) */}
            {detailed && (
              <text
                x={cx + r + 8}
                y={cy + 7}
                fill={shellColor}
                fillOpacity={0.45}
                fontSize={9}
                fontFamily="monospace"
              >
                {electronCount}e⁻
              </text>
            )}

            {/* Shell capacity indicator (detailed mode, left side) */}
            {detailed && (
              <text
                x={cx - r - 8}
                y={cy}
                fill="white"
                fillOpacity={0.2}
                fontSize={8}
                fontFamily="monospace"
                textAnchor="end"
                dominantBaseline="central"
              >
                {electronCount}/{SHELL_MAX[i]}
              </text>
            )}

            {/* Rotating electron group */}
            <g>
              <animateTransform
                attributeName="transform"
                type="rotate"
                from={`0 ${cx} ${cy}`}
                to={`${direction * 360} ${cx} ${cy}`}
                dur={`${duration}s`}
                repeatCount="indefinite"
              />
              {Array.from({ length: electronCount }).map((_, j) => {
                const angle = (360 / electronCount) * j;
                const rad = (angle * Math.PI) / 180;
                const ex = cx + r * Math.cos(rad);
                const ey = cy + r * Math.sin(rad);
                return (
                  <circle
                    key={`e-${i}-${j}`}
                    cx={ex}
                    cy={ey}
                    r={electronR}
                    fill={color}
                    filter={`url(#${filterId})`}
                    opacity={0.95}
                  />
                );
              })}
            </g>
          </g>
        );
      })}

      {/* Nucleus */}
      <circle
        cx={cx}
        cy={cy}
        r={nucleusR}
        fill={`url(#${nucleusGradId})`}
        stroke={color}
        strokeWidth={detailed ? 2 : 1.5}
        strokeOpacity={0.6}
      />

      {/* Nucleus inner glow */}
      {detailed && (
        <circle
          cx={cx}
          cy={cy}
          r={nucleusR * 0.6}
          fill={color}
          opacity={0.15}
        />
      )}

      {/* Element symbol */}
      <text
        x={cx}
        y={detailed ? cy - 2 : cy}
        textAnchor="middle"
        dominantBaseline="central"
        fill="white"
        fontSize={detailed ? nucleusR * 1.4 : nucleusR * 1.1}
        fontWeight="bold"
        fontFamily="system-ui, sans-serif"
      >
        {symbol}
      </text>

      {/* Atomic number (detailed mode) */}
      {detailed && atomicNumber && (
        <text
          x={cx}
          y={cy + nucleusR * 0.8}
          textAnchor="middle"
          dominantBaseline="central"
          fill="white"
          fillOpacity={0.4}
          fontSize={nucleusR * 0.6}
          fontFamily="monospace"
        >
          {atomicNumber}
        </text>
      )}

      {/* Click hint (non-detailed mode with onClick) */}
      {onClick && !detailed && (
        <text
          x={cx}
          y={size - 6}
          textAnchor="middle"
          fill="white"
          fillOpacity={0.2}
          fontSize={8}
          fontFamily="system-ui, sans-serif"
        >
          Click to expand
        </text>
      )}
    </svg>
  );
};
