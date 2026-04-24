import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopNav } from './components/TopNav.jsx';
import { Container } from './components/Container.jsx';
import spriteRaw from './assets/sprite.svg?raw';

/**
 * @component App
 * @description Root shell. TopNav (role switcher) + skip-link + <main> landmark + <Outlet />.
 *   Role determined from URL prefix via TopNav's NavLink active state.
 *   Sprite injected inline once через dangerouslySetInnerHTML — delivers symbols
 *   для Icon / 3D variants.
 * @a11y TopNav role switcher exposed as role="tablist" с NavLink active state. Skip-link target = <main id="main-content">.
 */
export default function App() {
  return (
    <>
      <div
        style={{ display: 'none' }}
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: spriteRaw }}
      />
      <a href="#main-content" className="skip-link" data-testid="skip-link">
        Перейти к основному содержимому
      </a>
      <TopNav />
      <main role="main" id="main-content" className="app">
        <Container>
          <Outlet />
        </Container>
      </main>
    </>
  );
}
