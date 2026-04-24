import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button.jsx';
import { ContestIcon3D } from '../components/ContestIcon3D.jsx';

/**
 * @screen NotFound
 * @description 404 fallback. Characterful — 3D trophy icon + honest copy + two exits.
 *   Per looi signal #220 — "продающий" принцип также применим для error state: не сухой отчёт.
 */
export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="empty-state empty-state--lg" role="alert">
      <div className="empty-state__icon"><ContestIcon3D typeId="top" size={96} /></div>
      <h1 className="ds-heading-02">Такого контеста пока нет</h1>
      <p className="u-text-muted empty-state__body">
        Возможно, ссылка устарела, контест уже завершён, или мы ещё его не запустили.
        Загляните на главную — там всё что идёт прямо сейчас.
      </p>
      <div className="u-row u-row--sm empty-state__actions">
        <Button variant="primary" icon="home" onClick={() => navigate('/ib/contests')}>К контестам</Button>
        <Button variant="outline" icon="arrow-left" onClick={() => navigate(-1)}>Назад</Button>
      </div>
    </div>
  );
}
