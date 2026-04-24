import React, { useState, useRef, useEffect, useCallback, useId } from 'react';
import { MONTHS, DOW, formatDate } from '../lib/helpers.js';

/**
 * @component CalendarInput
 * @description Custom date picker trigger + dropdown dialog (WCAG 2.1.1, 4.1.2). Full keyboard navigation.
 * @props {Date} value
 * @props {function} onChange - receives selected Date.
 * @props {string} [label] - input label.
 * @a11y Trigger role=button, aria-expanded/haspopup. Dropdown role=dialog. Grid role=grid; каждый day — role=gridcell + aria-selected + aria-label. Esc closes. Return focus to trigger.
 */
export const CalendarInput = ({ value, onChange, label }) => {
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(value.getFullYear());
  const [viewMonth, setViewMonth] = useState(value.getMonth());
  const [focusedDay, setFocusedDay] = useState(value.getDate());
  const ref = useRef();
  const triggerRef = useRef();
  const gridRef = useRef();
  const dialogId = useId();

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) { if (open) setOpen(false); } };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [open]);

  useEffect(() => {
    if (!open || !gridRef.current) return;
    const btn = gridRef.current.querySelector(`[data-cal-day="${focusedDay}"]`);
    if (btn) btn.focus();
  }, [focusedDay, viewYear, viewMonth, open]);

  const closeAndRestore = useCallback(() => {
    setOpen(false);
    setTimeout(() => triggerRef.current?.focus(), 0);
  }, []);

  const firstDay = new Date(viewYear, viewMonth, 1);
  let startDow = firstDay.getDay();
  startDow = startDow === 0 ? 6 : startDow - 1;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const today = new Date(); today.setHours(0, 0, 0, 0);

  const nav = dir => {
    let m = viewMonth + dir, y = viewYear;
    if (m > 11) { m = 0; y++; } else if (m < 0) { m = 11; y--; }
    setViewMonth(m); setViewYear(y);
    setFocusedDay(prev => Math.min(prev, new Date(y, m + 1, 0).getDate()));
  };

  const select = d => { onChange(new Date(viewYear, viewMonth, d)); closeAndRestore(); };

  const onTriggerKey = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(v => !v);
    } else if (e.key === 'ArrowDown' && !open) {
      e.preventDefault();
      setOpen(true);
    }
  };

  const onGridKey = e => {
    if (e.key === 'Escape') { e.preventDefault(); closeAndRestore(); return; }
    const cap = d => Math.max(1, Math.min(daysInMonth, d));
    if (e.key === 'ArrowRight')      { e.preventDefault(); setFocusedDay(d => cap(d + 1)); }
    else if (e.key === 'ArrowLeft')  { e.preventDefault(); setFocusedDay(d => cap(d - 1)); }
    else if (e.key === 'ArrowDown')  { e.preventDefault(); setFocusedDay(d => cap(d + 7)); }
    else if (e.key === 'ArrowUp')    { e.preventDefault(); setFocusedDay(d => cap(d - 7)); }
    else if (e.key === 'Home')       { e.preventDefault(); setFocusedDay(1); }
    else if (e.key === 'End')        { e.preventDefault(); setFocusedDay(daysInMonth); }
  };

  return (
    <div className="ds-input-wrap">
      {label && <label className="ds-input-label">{label}</label>}
      <div style={{ position: 'relative' }} ref={ref}>
        <div
          className={`cal-input ${open ? 'cal-input--open' : ''}`}
          onClick={() => setOpen(!open)}
          onKeyDown={onTriggerKey}
          role="button"
          tabIndex={0}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={dialogId}
          aria-label={`${label || 'Дата'}: ${formatDate(value)}`}
          ref={triggerRef}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M3 10h18M8 2v4M16 2v4" />
          </svg>
          <span>{formatDate(value)}</span>
        </div>
        {open && (
          <div
            className="cal-dropdown"
            id={dialogId}
            role="dialog"
            aria-label={`Выбор даты. ${MONTHS[viewMonth]} ${viewYear}`}
            onKeyDown={onGridKey}
          >
            <div className="cal-header">
              <button type="button" aria-label="Предыдущий месяц" className="cal-nav-btn" onClick={() => nav(-1)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6" /></svg>
              </button>
              <span className="cal-month-title" aria-live="polite">{MONTHS[viewMonth]} {viewYear}</span>
              <button type="button" aria-label="Следующий месяц" className="cal-nav-btn" onClick={() => nav(1)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            </div>
            <div className="cal-grid" role="grid" aria-label={`${MONTHS[viewMonth]} ${viewYear}`} ref={gridRef}>
              {DOW.map(d => <div key={d} role="columnheader" className="cal-dow">{d}</div>)}
              {Array.from({ length: startDow }).map((_, i) => <div key={`e${i}`} role="gridcell" />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const d = i + 1;
                const dt = new Date(viewYear, viewMonth, d);
                const isToday = dt.getTime() === today.getTime();
                const isSelected = value && dt.getTime() === value.getTime();
                const isFocused = d === focusedDay;
                return (
                  <button
                    key={d}
                    type="button"
                    data-cal-day={d}
                    role="gridcell"
                    aria-selected={!!isSelected}
                    aria-label={`${d} ${MONTHS[viewMonth]} ${viewYear}${isToday ? ', сегодня' : ''}`}
                    tabIndex={isFocused ? 0 : -1}
                    className={`cal-day ${isToday ? 'cal-day--today' : ''} ${isSelected ? 'cal-day--selected' : ''}`}
                    onClick={() => select(d)}
                  >{d}</button>
                );
              })}
            </div>
            <div className="cal-footer">
              <button type="button" className="cal-close-btn" onClick={closeAndRestore}>Закрыть</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
