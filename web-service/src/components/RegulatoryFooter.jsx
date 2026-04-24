import React from 'react';
import { Icon } from './Icon.jsx';

/**
 * @component RegulatoryFooter
 * @description CFD-broker regulatory disclosure. Required на client-facing screens per CySEC/ESMA/FCA rules.
 *   Shows entity name, license, risk warning. Muted visual — informational, not decorative.
 * @props {string} [entity='Octa Markets Limited'] - brand-specific tenant от --brand4 в prod
 * @props {string} [license='License XX-XXXXX'] - regulatory license number
 * @props {string} [warning] - risk warning copy (default CySEC-compliant generic)
 * @a11y role="contentinfo"; icon aria-hidden, text carries meaning.
 */
export const RegulatoryFooter = React.memo(({
  entity = 'Octa Markets Cyprus Ltd',
  license = 'CySEC 372/18',
  lossRate = 71.36,
  warning,
}) => {
  // Default ESMA-aligned warning (verbatim formula per R4 research; compliance sign-off pre-prod).
  // "XX% of retail investor accounts lose money when trading CFDs with this provider".
  const copy = warning || `${lossRate}% розничных счетов теряют деньги при торговле CFD с этим брокером. Оцените, можете ли вы позволить себе высокий риск потери вложений.`;
  return (
    <footer className="reg-footer" role="contentinfo" aria-label="Регуляторная информация">
      <div className="reg-footer__entity">
        <strong>{entity}</strong> · {license}
      </div>
      <div className="reg-footer__warning">
        <Icon name="alert-triangle" size="xs" /> {copy}
      </div>
    </footer>
  );
});
