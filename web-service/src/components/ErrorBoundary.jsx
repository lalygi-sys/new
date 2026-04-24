import React from 'react';

/**
 * @component ErrorBoundary
 * @description Catches render errors anywhere below in the React tree и рендерит graceful fallback UI вместо white screen.
 * @props {ReactNode} children
 * @props {ReactNode} [fallback]
 * @a11y Fallback announces via role="alert" + aria-live="assertive". Primary CTA reload = recoverable path.
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    if (typeof console !== 'undefined') console.error('[Disko] render error', error, info);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div
          role="alert"
          aria-live="assertive"
          className="empty-state--lg"
          style={{ maxWidth: 560, margin: '80px auto' }}
        >
          <div className="empty-state__icon">
            <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
              <circle cx="32" cy="32" r="28" fill="var(--ds-negative-bg)" />
              <path d="M32 18v16m0 6v4" stroke="var(--ds-negative)" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="ds-heading-02">Что-то пошло не так</h1>
          <p className="u-text-muted empty-state__body">
            На этой странице сломался рендеринг. Обычно помогает перезагрузка.
            Если проблема повторяется — сообщите команде, мы быстро починим.
          </p>
          <div className="empty-state__actions u-row u-row--sm">
            <button
              type="button"
              className="ds-btn ds-btn--m ds-btn--primary"
              onClick={() => window.location.reload()}
              data-testid="error-boundary-reload"
            >
              Перезагрузить
            </button>
            <button
              type="button"
              className="ds-btn ds-btn--m ds-btn--outline"
              onClick={() => window.history.back()}
            >
              Назад
            </button>
          </div>
          {this.state.error?.message && (
            <details style={{ marginTop: 24, fontSize: 12, color: 'var(--ds-text-muted)', textAlign: 'left' }}>
              <summary style={{ cursor: 'pointer' }}>Технические детали</summary>
              <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: '8px 0 0' }}>{this.state.error.message}</pre>
            </details>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
