import React, { useState, useCallback, useRef, createContext, useContext } from 'react';
import { TOAST_DURATION_MS } from '../lib/helpers.js';

const ToastContext = createContext();

/**
 * @component ToastProvider
 * @description App-wide transient message layer. Exposes showToast(msg, type) via ToastContext.
 * @param {ReactNode} children
 * @a11y Single role="status" aria-live="polite" — SR announces changes politely. 4000ms auto-dismiss.
 */
export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const timerRef = useRef();

  const showToast = useCallback((msg, type = 'negative') => {
    clearTimeout(timerRef.current);
    setToast({ msg, type });
    timerRef.current = setTimeout(() => setToast(null), TOAST_DURATION_MS);
  }, []);

  const iconSvg = toast?.type === 'positive'
    ? (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
        <path d="M10.7396 15.77L17.0416 9.46788L16.4752 8.90148C16.1173 8.5435 15.5369 8.5435 15.1789 8.90148L10.7396 13.3408L8.82108 11.4223C8.4631 11.0643 7.8827 11.0643 7.52472 11.4223L6.95831 11.9887L10.7396 15.77Z" fill="#31865B" />
        <path fillRule="evenodd" clipRule="evenodd" d="M21.1666 12C21.1666 17.0626 17.0626 21.1666 12 21.1666C6.93737 21.1666 2.83331 17.0626 2.83331 12C2.83331 6.93737 6.93737 2.83331 12 2.83331C17.0626 2.83331 21.1666 6.93737 21.1666 12ZM19.3333 12C19.3333 16.0501 16.0501 19.3333 12 19.3333C7.94989 19.3333 4.66665 16.0501 4.66665 12C4.66665 7.94989 7.94989 4.66665 12 4.66665C16.0501 4.66665 19.3333 7.94989 19.3333 12Z" fill="#31865B" />
      </svg>
    )
    : (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
        <circle cx="12" cy="12" r="9.17" stroke="#e32d2d" strokeWidth="1.83" />
        <path d="M12 8v4M12 16h.01" stroke="#e32d2d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div
        className={`toast toast--${toast?.type || 'negative'} ${toast ? 'toast--visible' : ''}`}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {toast && iconSvg}
        <span>{toast?.msg}</span>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
