import React from 'react';

/**
 * @component Breadcrumb
 * @description Page-path navigation. Items с onClick render as keyboard-focusable <button>; final item — non-interactive current.
 * @param {Array<{label: string, onClick?: function}>} items - parent links + final current label.
 * @a11y Wrapped в <nav aria-label="Хлебные крошки"> landmark. Clickable crumbs — <button>. Ordered list semantics.
 */
export const Breadcrumb = ({ items }) => (
  <nav aria-label="Хлебные крошки">
    <ol className="breadcrumb">
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="sep" aria-hidden="true">/</span>}
          <li>
            {item.onClick ? (
              <button type="button" className="breadcrumb__link" onClick={item.onClick}>{item.label}</button>
            ) : (
              <span className="current" aria-current="page">{item.label}</span>
            )}
          </li>
        </React.Fragment>
      ))}
    </ol>
  </nav>
);
