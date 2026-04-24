import React, { useState } from 'react';
import { Modal } from './Modal.jsx';
import { Button } from './Button.jsx';
import { CONTEST_TYPES } from '../lib/seed.js';

/**
 * @component ContestTypeInfo
 * @description Inline info-button that opens a Modal с Score formula, rules, и tiebreak для типа контеста.
 * @param {'volume'|'streak'|'top'|'grow'} typeId - CONTEST_TYPES key.
 * @param {string} [className] - extra class for trigger button.
 * @a11y Trigger — native <button type="button"> with aria-label. Modal inherits dialog a11y contract.
 */
export const ContestTypeInfo = ({ typeId, className = '' }) => {
  const [open, setOpen] = useState(false);
  const t = CONTEST_TYPES[typeId];
  if (!t) return null;

  const stop = e => e.stopPropagation();

  return (
    <>
      <button
        type="button"
        className={`type-info-btn ${className}`}
        onClick={e => { e.stopPropagation(); setOpen(true); }}
        title={`Как считается Score — ${t.title}`}
        aria-label={`Информация о подсчёте Score для ${t.title}`}
      >
        <svg><use href="#i-info" /></svg>
      </button>
      {open && (
        <div onClick={stop}>
          <Modal
            open={open}
            onClose={() => setOpen(false)}
            size="l"
            title={
              <span className="u-inline-flex-center" style={{ gap: 'var(--ds-space-03)' }}>
                <span className={`icon-circle icon-circle--${t.circle} icon-circle--32`}>
                  <svg width="18" height="18"><use href={`#i-${t.icon}`} /></svg>
                </span>
                <span>{t.title} — как считается Score</span>
              </span>
            }
            footer={<Button variant="primary" onClick={() => setOpen(false)}>Понятно</Button>}
          >
            <div className="u-col u-gap-06">
              <div className="ds-t-body-02 u-text-secondary">{t.desc}. Участники ранжируются по метрике <strong className="u-text-primary">«{t.metric}»</strong>.</div>

              <div className="score-section">
                <div className="score-section__title">Формула</div>
                <div className="score-formula">{t.scoring.formula}</div>
              </div>

              <div className="score-section">
                <div className="score-section__title">Правила учёта</div>
                <ul className="score-rules">
                  {t.scoring.rules.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>

              <div className="score-section">
                <div className="score-section__title">Тай-брейк</div>
                <div className="ds-t-body-02 u-text-secondary">{t.scoring.tiebreak}</div>
              </div>
            </div>
          </Modal>
        </div>
      )}
    </>
  );
};
