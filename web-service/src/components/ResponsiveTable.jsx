import React from 'react';
import { onKeyActivate } from '../lib/helpers.js';

/**
 * @component ResponsiveTable
 * @description Dual-mode table: desktop <table>, mobile card-list via same props. Hard rule 3 enforced
 *              (no inner scroll — mobile switches to cards below 643px via CSS).
 * @props {Array<{key:string,label:string,align?:'left'|'right'|'center',render?:(row:any)=>ReactNode}>} columns
 * @props {Array<object>} rows - каждая row должна иметь стабильный id/key.
 * @props {(row)=>string} rowKey - extracts stable key per row.
 * @props {(row)=>void} [onRowClick] - makes whole row clickable (role=button + keyboard).
 * @props {(row)=>string} [rowClassName]
 * @props {(row)=>string} [rowAriaLabel]
 * @props {(row)=>string} [rowTestId]
 * @props {(row)=>ReactNode} [mobileCard] - override mobile card body; defaults to simple title + meta list.
 * @props {(row)=>string} [mobileTitle]
 * @props {(row)=>Array<{label:string,value:ReactNode}>} [mobileMeta]
 * @props {ReactNode} [emptyState]
 * @props {string} [ariaLabel]
 * @props {{title?:string,meta?:ReactNode}} [title]
 * @props {boolean} [borderless]
 */
export const ResponsiveTable = ({
  columns, rows, rowKey, onRowClick, rowClassName, rowAriaLabel, rowTestId,
  mobileCard, mobileTitle, mobileMeta,
  emptyState, ariaLabel, title, borderless,
}) => {
  const wrapCls = `table-wrap table-wrap--mobile-cards${borderless ? '' : ''}`;
  const wrapStyle = borderless ? { border: 'none' } : undefined;

  const clickableProps = row => {
    const testId = rowTestId ? rowTestId(row) : undefined;
    const base = onRowClick ? {
      className: `table-row-clickable ${rowClassName ? rowClassName(row) : ''}`.trim(),
      role: 'button', tabIndex: 0,
      'aria-label': rowAriaLabel ? rowAriaLabel(row) : undefined,
      onClick: () => onRowClick(row),
      onKeyDown: onKeyActivate(() => onRowClick(row)),
    } : {
      className: rowClassName ? rowClassName(row) : undefined,
    };
    return testId ? { ...base, 'data-testid': testId } : base;
  };

  return (
    <div className={wrapCls} style={wrapStyle}>
      {title && (
        <div className="table-title">
          {title.title && <h4 className="ds-heading-04">{title.title}</h4>}
          {title.meta && <span className="meta" role="status">{title.meta}</span>}
        </div>
      )}
      <table aria-label={ariaLabel}>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} style={col.align === 'right' ? { textAlign: 'right' } : undefined}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={columns.length} className="u-text-center u-text-muted" style={{ padding: '32px 16px' }}>{emptyState || 'Нет данных'}</td></tr>
          ) : rows.map(row => (
            <tr key={rowKey(row)} {...clickableProps(row)}>
              {columns.map(col => (
                <td key={col.key} style={col.align === 'right' ? { textAlign: 'right' } : undefined}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="card-list" role="list" aria-label={ariaLabel}>
        {rows.length === 0 ? (
          <div className="u-text-center u-text-muted" style={{ padding: '32px 16px' }}>{emptyState || 'Нет данных'}</div>
        ) : rows.map(row => {
          const testId = rowTestId ? rowTestId(row) : undefined;
          if (mobileCard) {
            return (
              <div
                key={rowKey(row)}
                className={`card-list__item ${rowClassName ? rowClassName(row) : ''}`.trim()}
                role={onRowClick ? 'button' : 'listitem'}
                tabIndex={onRowClick ? 0 : undefined}
                aria-label={rowAriaLabel ? rowAriaLabel(row) : undefined}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                onKeyDown={onRowClick ? onKeyActivate(() => onRowClick(row)) : undefined}
                data-testid={testId}
              >
                {mobileCard(row)}
              </div>
            );
          }
          const metaItems = mobileMeta ? mobileMeta(row) : [];
          return (
            <div
              key={rowKey(row)}
              className={`card-list__item ${rowClassName ? rowClassName(row) : ''}`.trim()}
              role={onRowClick ? 'button' : 'listitem'}
              tabIndex={onRowClick ? 0 : undefined}
              aria-label={rowAriaLabel ? rowAriaLabel(row) : undefined}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              onKeyDown={onRowClick ? onKeyActivate(() => onRowClick(row)) : undefined}
              data-testid={testId}
            >
              {mobileTitle && <div className="card-list__row"><span className="card-list__title">{mobileTitle(row)}</span></div>}
              {metaItems.length > 0 && (
                <dl className="card-list__meta">
                  {metaItems.map((m, i) => (
                    <div key={i}><dt>{m.label}</dt><dd>{m.value}</dd></div>
                  ))}
                </dl>
              )}
              {!mobileTitle && metaItems.length === 0 && columns.length > 0 && (
                <>
                  <div className="card-list__row">
                    <span className="card-list__title">
                      {columns[0].render ? columns[0].render(row) : row[columns[0].key]}
                    </span>
                  </div>
                  {columns.length > 1 && (
                    <dl className="card-list__meta">
                      {columns.slice(1).map(col => (
                        <div key={col.key}>
                          <dt>{col.label}</dt>
                          <dd>{col.render ? col.render(row) : row[col.key]}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
