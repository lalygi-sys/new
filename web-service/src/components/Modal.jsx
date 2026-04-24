import React, { useRef, useEffect, useId } from 'react';
import { createPortal } from 'react-dom';

/**
 * @component Modal
 * @description Accessible modal dialog — traps focus while open, closes on Escape, returns focus to previously focused element on close.
 * @props {boolean} open
 * @props {function} onClose - close handler (overlay click + Escape key).
 * @props {ReactNode} title - exposed via aria-labelledby.
 * @props {ReactNode} children - body content.
 * @props {ReactNode} [footer]
 * @props {'m'|'l'} [size='m']
 * @a11y role=dialog, aria-modal=true, Escape closes, focus trap inside modal, focus restored on close. Body scroll locked while open.
 * @octa see Components library → Modal / Dialog.
 */
export const Modal = ({ open, onClose, title, children, footer, size = 'm' }) => {
  const modalRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusables = () => modalRef.current?.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ) || [];
    const first = focusables()[0];
    if (first) first.focus(); else modalRef.current?.focus();

    const onKey = e => {
      if (e.key === 'Escape') { e.stopPropagation(); onClose?.(); return; }
      if (e.key !== 'Tab') return;
      const list = Array.from(focusables());
      if (!list.length) { e.preventDefault(); return; }
      const firstEl = list[0], lastEl = list[list.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) { e.preventDefault(); lastEl.focus(); }
      else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); firstEl.focus(); }
    };
    document.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus();
      }
    };
  }, [open, onClose]);

  if (!open) return null;
  const maxWidth = size === 'l' ? 640 : 520;
  const content = (
    <div className="ds-modal-overlay" onClick={onClose}>
      <div
        className="ds-modal"
        style={{ maxWidth }}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        ref={modalRef}
        tabIndex={-1}
      >
        <div className="ds-modal__header">
          <h2 className="ds-heading-03" id={titleId} style={{ margin: 0 }}>{title}</h2>
          <button
            type="button"
            className="ds-modal__close"
            onClick={onClose}
            aria-label="Закрыть"
            data-testid="modal-close"
          >&times;</button>
        </div>
        <div className="ds-modal__body">{children}</div>
        {footer && <div className="ds-modal__footer">{footer}</div>}
      </div>
    </div>
  );
  return createPortal(content, document.body);
};
