import React from 'react';

/**
 * @component WizardStepper
 * @description Visual progress stepper showing N steps with done/active/pending states.
 * @props {number} currentStep - 1-indexed active step.
 * @props {number} totalSteps
 * @a11y role=list + aria-current="step" on active step; каждый step has aria-label.
 */
export const WizardStepper = ({ currentStep, totalSteps }) => {
  const checkSvg = (
    <svg viewBox="0 0 24 24" fill="none" style={{ width: 24, height: 24 }} aria-hidden="true">
      <path d="M10.7396 15.7695L17.0416 9.46739L16.4752 8.90099C16.1173 8.54301 15.5369 8.54301 15.1789 8.90099L10.7396 13.3403L8.82108 11.4218C8.4631 11.0638 7.8827 11.0638 7.52472 11.4218L6.95831 11.9882L10.7396 15.7695Z" fill="#31865B" />
      <path fillRule="evenodd" clipRule="evenodd" d="M21.1666 11.9997C21.1666 17.0623 17.0626 21.1663 12 21.1663C6.93737 21.1663 2.83331 17.0623 2.83331 11.9997C2.83331 6.93706 6.93737 2.83301 12 2.83301C17.0626 2.83301 21.1666 6.93706 21.1666 11.9997ZM19.3333 11.9997C19.3333 16.0498 16.0501 19.333 12 19.333C7.94989 19.333 4.66665 16.0501 4.66665 11.9997C4.66665 7.94959 7.94989 4.66634 12 4.66634C16.0501 4.66634 19.3333 7.94959 19.3333 11.9997Z" fill="#31865B" />
    </svg>
  );

  const items = [];
  for (let i = 1; i <= totalSteps; i++) {
    const isDone = i < currentStep;
    const isActive = i === currentStep;
    const stateLabel = isDone ? 'завершён' : isActive ? 'активный' : 'следующий';
    items.push(
      <div
        key={`d${i}`}
        className={`wizard-dot ${isActive ? 'wizard-dot--active' : ''} ${isDone ? 'wizard-dot--done' : ''}`}
        role="listitem"
        aria-current={isActive ? 'step' : undefined}
        aria-label={`Шаг ${i} из ${totalSteps} — ${stateLabel}`}
      >
        {isDone ? checkSvg : <svg aria-hidden="true"><use href={`#i-digit-${i}`} /></svg>}
      </div>
    );
    if (i < totalSteps) {
      items.push(<div key={`c${i}`} className={`wizard-connector ${i < currentStep ? 'wizard-connector--done' : ''}`} aria-hidden="true" />);
    }
  }
  return <div className="wizard-steps" role="list" aria-label="Шаги создания контеста">{items}</div>;
};
