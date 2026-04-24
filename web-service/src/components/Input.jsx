import React, { useId } from 'react';

/**
 * @component Input
 * @description Labelled text / select / textarea with description + error slots. Native HTML inside, DS styling outside.
 * @param {string} [label] - visible label text linked via htmlFor.
 * @param {ReactNode} [description] - helper text below input.
 * @param {string} [error] - error message below input (mutually exclusive with description).
 * @param {'text'|'number'|'select'|'textarea'|'email'|'password'|string} [type='text']
 * @param {ReactNode} [children] - <option> list when type="select".
 * @a11y Label ↔ field связаны через useId → htmlFor + id. aria-describedby указывает на description/error.
 * @octa see Components library → Input / Select / Textarea.
 */
export const Input = ({ label, description, error, type = 'text', children, id: idProp, ...props }) => {
  const autoId = useId();
  const id = idProp || autoId;
  const descId = `${id}-desc`;
  const errId = `${id}-err`;
  const describedBy = [error ? errId : null, !error && description ? descId : null].filter(Boolean).join(' ') || undefined;
  const fieldClass = `ds-input-field ${error ? 'ds-input-field--error' : ''}`.trim();
  const commonFieldProps = { id, 'aria-describedby': describedBy, 'aria-invalid': error ? true : undefined };
  return (
    <div className="ds-input-wrap">
      {label && <label className="ds-input-label" htmlFor={id}>{label}</label>}
      {type === 'select' ? (
        <select className={fieldClass} {...commonFieldProps} {...props}>{children}</select>
      ) : type === 'textarea' ? (
        <textarea className={fieldClass} {...commonFieldProps} {...props} />
      ) : (
        <input type={type} className={fieldClass} {...commonFieldProps} {...props} />
      )}
      {error && <div id={errId} className="ds-input-error" role="alert">{error}</div>}
      {description && !error && <div id={descId} className="ds-input-desc">{description}</div>}
    </div>
  );
};
