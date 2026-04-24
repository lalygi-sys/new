import React from 'react';

/**
 * @component ContestIcon3D
 * @description Flat DS icon wrapper. Tinted rounded square bg + inline SVG icon.
 *   Uses DS tokens only (no custom gradients, no drop shadows). Legacy name kept
 *   for backward compatibility — icons are no longer 3D (audit 2026-04-24).
 * @props {string} typeId - volume | streak | top | grow
 * @props {number} [size=48] - square dimension in px
 * @a11y aria-hidden=true (decorative). Callers provide text label separately.
 */
const CONTEST_ICON_CONFIG = {
  volume: { iconId: 'chart',       bg: 'var(--ds-primary-content)',  fg: 'var(--ds-primary)'   },
  streak: { iconId: 'flame',       bg: 'var(--ds-warning-bg)',       fg: 'var(--ds-warning)'   },
  top:    { iconId: 'trophy',      bg: 'var(--ds-positive-bg)',      fg: 'var(--ds-positive)'  },
  grow:   { iconId: 'trending-up', bg: 'var(--ds-grow-bg)',          fg: 'var(--ds-grow)'      },
};

export const ContestIcon3D = React.memo(({ typeId, size = 48 }) => {
  const cfg = CONTEST_ICON_CONFIG[typeId];
  if (!cfg) return null;
  const iconSize = Math.round(size * 0.5); // inner icon 50% of bg square
  return (
    <span
      className="contest-icon"
      style={{
        width: size,
        height: size,
        background: cfg.bg,
        color: cfg.fg,
      }}
      aria-hidden="true"
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <use href={`#i-${cfg.iconId}`} />
      </svg>
    </span>
  );
});
