import React from 'react';
import { JURISDICTION_TRUSTED, JURISDICTION_LABELS } from '../lib/seed.js';

/**
 * @component JurisdictionChip
 * @description Colored chip indicating IB regulatory jurisdiction. Brand anchor для admin screens —
 *   trusted regulators (CySEC / FCA / ASIC / DFSA) use --brand4-accent. Offshore / unknown — muted.
 * @props {'cysec'|'offshore'|'asic'|'dfsa'|'fca'|string|undefined} regulatory - jurisdiction code from SEED.ib_partners[].regulatory.
 * @props {'sm'|'md'} [size='sm']
 * @a11y aria-label expands для SR ("Юрисдикция: CySEC").
 */
export const JurisdictionChip = React.memo(({ regulatory, size = 'sm' }) => {
  const code = regulatory ? String(regulatory).toLowerCase() : '';
  const fallback = regulatory ? String(regulatory).charAt(0).toUpperCase() + String(regulatory).slice(1).toLowerCase() : '—';
  const label = JURISDICTION_LABELS[code] || fallback;
  const tier = !regulatory ? 'unknown'
    : JURISDICTION_TRUSTED.has(code) ? 'trusted'
    : code === 'offshore' ? 'offshore'
    : 'unknown';
  const sizeCls = size === 'md' ? 'ds-jurisdiction-chip--md' : '';
  return (
    <span
      className={`ds-jurisdiction-chip ds-jurisdiction-chip--${tier} ${sizeCls}`.trim()}
      aria-label={`Юрисдикция: ${label}`}
    >
      {label}
    </span>
  );
});
