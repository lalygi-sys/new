import React from 'react';

/**
 * @component Notification
 * @description In-page banner for status/alert/info messages. Leading 4px sentiment bar + icon + title + description + optional action cluster.
 * @param {'positive'|'negative'|'warning'|'info'|'neutral'} [variant='negative']
 * @param {ReactNode} [title]
 * @param {ReactNode} [description]
 * @param {ReactNode} [actions] - cluster of <Button />; wraps + stacks fullwidth on mobile.
 * @param {string} [icon] - sprite id (без i- prefix).
 * @a11y Wrap caller в aria-live="polite" if message appears dynamically.
 */
export const Notification = ({ variant = 'negative', title, description, actions, icon, className = '' }) => (
  <div className={`ds-notification ds-notification--${variant} ${className}`.trim()}>
    {icon && <span className="ds-notification__icon" style={{ color: variant === 'negative' ? 'var(--ds-negative)' : variant === 'warning' ? 'var(--ds-warning)' : 'var(--ds-primary)' }}>
      <svg width="20" height="20"><use href={`#i-${icon}`} /></svg>
    </span>}
    <div className="ds-notification__content">
      {title && <div className="ds-notification__title" style={{ color: variant === 'negative' ? 'var(--ds-negative-text-on-bg)' : variant === 'warning' ? 'var(--ds-warning-text-on-bg)' : undefined }}>{title}</div>}
      {description && <div className="ds-notification__desc">{description}</div>}
      {actions && <div className="ds-notification__actions">{actions}</div>}
    </div>
  </div>
);
