import React from 'react';

/**
 * @component ProgressBar
 * @description Determinate progress bar with three visual variants и full WCAG 4.1.2 `role="progressbar"` semantics.
 * @props {number} value - Current progress 0..max.
 * @props {number} [min=0]
 * @props {number} [max=100]
 * @props {string} label - aria-label (required, describes what is progressing).
 * @props {'default'|'mini'|'on-primary'} [size='default']
 */
export const ProgressBar = ({ value, min = 0, max = 100, label, size = 'default' }) => {
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  const wrapCls = size === 'mini' ? 'progress-mini'
                : size === 'on-primary' ? 'up-progress-wrap'
                : 'progress';
  const barCls = size === 'mini' ? 'progress-mini__bar'
               : size === 'on-primary' ? 'up-progress-fill'
               : 'progress__bar progress__bar--primary';
  return (
    <div
      className={wrapCls}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-label={label}
    >
      <div className={barCls} style={{ width: `${pct}%` }} />
    </div>
  );
};
