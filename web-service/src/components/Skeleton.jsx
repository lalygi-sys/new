import React from 'react';

/**
 * @component Skeleton
 * @description Shimmer placeholder для loading states. Shimmer через CSS animation (no lib).
 * @param {'rect'|'circle'|'text'|'card'} variant - shape preset.
 * @param {number|string} [width] - CSS width (px или %).
 * @param {number|string} [height] - CSS height.
 * @param {number} [lines=1] - для variant="text", число строк.
 * @param {string} [className]
 * @a11y role="status" + aria-live="polite"; inner aria-hidden text "Загрузка..."
 */
export const Skeleton = ({ variant = 'rect', width, height, lines = 1, className = '' }) => {
  const style = { width, height };
  if (variant === 'text') {
    return (
      <div className={`skeleton-stack ${className}`} role="status" aria-live="polite" aria-label="Загрузка">
        {Array.from({ length: lines }).map((_, i) => (
          <span
            key={i}
            className="skeleton skeleton--text"
            style={{ width: i === lines - 1 ? '65%' : '100%' }}
            aria-hidden="true"
          />
        ))}
      </div>
    );
  }
  return (
    <span
      className={`skeleton skeleton--${variant} ${className}`}
      style={style}
      role="status"
      aria-live="polite"
      aria-label="Загрузка"
    />
  );
};

/**
 * @component SkeletonCard
 * @description Preset композиция — contest-card shape (icon + title + meta + progress).
 */
export const SkeletonCard = () => (
  <div className="skeleton-card" role="status" aria-live="polite" aria-label="Загрузка контеста">
    <div className="skeleton-card__header">
      <Skeleton variant="circle" width={48} height={48} />
      <div className="skeleton-card__text">
        <Skeleton variant="text" lines={1} />
        <Skeleton variant="rect" width={72} height={22} />
      </div>
    </div>
    <Skeleton variant="text" lines={2} />
    <div className="skeleton-card__meta">
      <Skeleton variant="rect" width="30%" height={16} />
      <Skeleton variant="rect" width="30%" height={16} />
    </div>
    <Skeleton variant="rect" width="100%" height={6} />
  </div>
);
