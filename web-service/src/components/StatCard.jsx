import React from 'react';
import { Icon } from './Icon.jsx';

/**
 * @component StatCard
 * @description Single KPI cell для stats row — big value + label + optional trend indicator.
 * @param {ReactNode} value - main number / string.
 * @param {string} label - metric name.
 * @param {string} [color] - CSS color override for value (sentiment).
 * @param {{dir:'up'|'down'|'neutral', text:string}} [trend] - direction + explanatory text.
 * @a11y Trend direction carries only color + arrow icon; `text` должен word the change explicitly.
 */
export const StatCard = React.memo(({ value, label, color, trend }) => (
  <div className="stat-card">
    <div className="stat-value" style={color ? { color } : undefined}>{value}</div>
    <div className="stat-label">{label}</div>
    {trend && <div className={`stat-trend stat-trend--${trend.dir}`}>
      {trend.dir === 'up' && <Icon name="trending-up" size="xs" />}
      {trend.dir === 'down' && <Icon name="trending-down" size="xs" />}
      {trend.text}
    </div>}
  </div>
));
