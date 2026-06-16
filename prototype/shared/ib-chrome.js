(function () {
  var script = document.currentScript;
  var activeKey = (script && script.dataset.active) || 'rebate';
  var contestsHref = (script && script.dataset.contestsHref) || '../index.html';
  var dashboardHref = (script && script.dataset.dashboardHref) || '../ib-dashboard/index.html';
  var rebateHref = (script && script.dataset.rebateHref) || '../rebate/index.html';
  var growthActive = activeKey === 'contests' || activeKey === 'rebate';

  var html =
    '<div class="role-bar" role="region" aria-label="Demo: role preview">' +
      '<span class="role-bar__label">Demo preview:</span>' +
      '<div class="ds-button-group ds-button-group--s" role="radiogroup" aria-label="Preview role">' +
        '<button type="button" class="ds-button-group__segment ds-button-group__segment--active" aria-pressed="true">IB Partner</button>' +
        '<button type="button" class="ds-button-group__segment" aria-pressed="false">Client</button>' +
      '</div>' +
      '<span class="role-bar__pill">Demo: you are IB Partner</span>' +
    '</div>' +
    '<header class="app-header" role="banner">' +
      '<div class="app-header__brand">' +
        '<div class="app-header__logo" aria-label="Logo"></div>' +
      '</div>' +
      '<nav class="app-header__menu" aria-label="Main menu">' +
        '<button type="button" class="app-header__menu-item' + (activeKey === 'dashboard' ? ' app-header__menu-item--active' : '') + '" data-nav="dashboard">IB Dashboard</button>' +
        '<button type="button" class="app-header__menu-item" data-nav="revenue" disabled title="Under maintenance">Revenue statistics</button>' +
        '<div class="app-header__menu-group">' +
          '<button type="button" class="app-header__menu-item app-header__menu-item--has-dropdown' + (growthActive ? ' app-header__menu-item--active' : '') + '" aria-haspopup="menu">' +
            'Client engagement' +
            '<svg class="app-header__menu-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
              '<polyline points="6 9 12 15 18 9"></polyline>' +
            '</svg>' +
          '</button>' +
          '<div class="app-header__dropdown" role="menu">' +
            '<button type="button" role="menuitem" class="app-header__dropdown-item' + (activeKey === 'contests' ? ' app-header__dropdown-item--active' : '') + '" data-nav="contests">Contests</button>' +
            '<button type="button" role="menuitem" class="app-header__dropdown-item' + (activeKey === 'rebate' ? ' app-header__dropdown-item--active' : '') + '" data-nav="rebate">Rebate</button>' +
          '</div>' +
        '</div>' +
        '<button type="button" class="app-header__menu-item" data-nav="promo" disabled title="Under maintenance">Promo materials</button>' +
      '</nav>' +
      '<div class="app-header__right">' +
        '<button type="button" class="app-header__wallet" aria-label="Wallet">' +
          '<span class="app-header__wallet-label">Wallet</span>' +
          '<span class="app-header__wallet-amount">$0.00</span>' +
        '</button>' +
        '<button type="button" class="app-header__balance" aria-label="Wallet">$0.00</button>' +
        '<div class="app-header__profile">' +
          '<button type="button" class="app-header__avatar" id="ib-profile-trigger" aria-label="Profile" aria-haspopup="dialog" aria-expanded="false" aria-controls="ib-profile-menu">' +
            '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
              '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>' +
              '<circle cx="12" cy="7" r="4"></circle>' +
            '</svg>' +
          '</button>' +
          '<div class="profile-menu" id="ib-profile-menu" role="dialog" aria-modal="true" aria-label="Profile menu" hidden>' +
            '<div class="profile-menu__topbar">' +
              '<button type="button" class="profile-menu__close" aria-label="Close profile menu">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"></path></svg>' +
              '</button>' +
            '</div>' +
            '<div class="profile-menu__body">' +
            '<div class="profile-menu__head">' +
              '<button type="button" class="profile-menu__identity">' +
                '<span class="profile-menu__identity-label">Profile </span>' +
                '<span class="profile-menu__name">Jaydon Rosser</span>' +
                '<svg class="profile-menu__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>' +
              '</button>' +
              '<div class="profile-menu__meta profile-menu__meta--desktop">' +
                '<button type="button" class="profile-menu__invite-block" data-profile-action="invite">' +
                  '<span class="profile-menu__company profile-menu__company--invite">Invite to Rosser Capital</span>' +
                  '<span class="profile-menu__accounts">' +
                    '<span class="profile-menu__account">' +
                      '<svg viewBox="0 0 46.239 46.239" fill="none" aria-hidden="true">' +
                        '<circle cx="23.1195" cy="23.1195" r="23.1193" fill="#ffffff"/>' +
                        '<path d="M23.1152 2.11426C11.5135 2.11426 2.09766 11.5301 2.09766 23.1318C2.09766 34.7334 11.5135 44.1493 23.1152 44.1493C34.7168 44.1493 44.1327 34.7334 44.1327 23.1318C44.1327 11.5301 34.7168 2.11426 23.1152 2.11426ZM23.1152 10.5213C27.1716 10.5213 30.4713 13.821 30.4713 17.8774C30.4713 21.9338 27.1716 25.2335 23.1152 25.2335C19.0588 25.2335 15.759 21.9338 15.759 17.8774C15.759 13.821 19.0588 10.5213 23.1152 10.5213ZM23.1152 39.9458C18.8486 39.9458 13.8044 38.2224 10.2104 33.8927C13.7624 31.1184 18.2391 29.437 23.1152 29.437C27.9912 29.437 32.468 31.1184 36.0199 33.8927C32.4259 38.2224 27.3817 39.9458 23.1152 39.9458Z" fill="#E2E6F9"/>' +
                      '</svg>' +
                    '</span>' +
                    '<span class="profile-menu__account profile-menu__account--add" aria-hidden="true">' +
                      '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">' +
                        '<path d="M7.58355 8.9667H3.97285C3.7769 8.9667 3.61264 8.9004 3.48009 8.7678C3.34753 8.6352 3.28125 8.4709 3.28125 8.2748C3.28125 8.0788 3.34753 7.91456 3.48009 7.78216C3.61264 7.64976 3.7769 7.58355 3.97285 7.58355H7.58355V3.97285C7.58355 3.7769 7.64985 3.61264 7.78246 3.48009C7.91508 3.34753 8.0794 3.28125 8.2754 3.28125C8.4715 3.28125 8.6357 3.34753 8.7681 3.48009C8.9005 3.61264 8.9667 3.7769 8.9667 3.97285V7.58355H12.5774C12.7734 7.58355 12.9376 7.64986 13.0702 7.78246C13.2027 7.91508 13.269 8.0794 13.269 8.2754C13.269 8.4715 13.2027 8.6357 13.0702 8.7681C12.9376 8.9005 12.7734 8.9667 12.5774 8.9667H8.9667V12.5774C8.9667 12.7734 8.9004 12.9376 8.7678 13.0702C8.6352 13.2027 8.4709 13.269 8.2748 13.269C8.0788 13.269 7.91456 13.2027 7.78216 13.0702C7.64975 12.9376 7.58355 12.7734 7.58355 12.5774V8.9667Z" fill="#161616"/>' +
                      '</svg>' +
                    '</span>' +
                  '</span>' +
                '</button>' +
              '</div>' +
            '</div>' +
            '<div class="profile-menu__links">' +
              '<button type="button" class="profile-menu__link" data-profile-action="notifications">' +
                '<span>Notification</span>' +
                '<span class="profile-menu__badge profile-menu__badge--warning">2</span>' +
              '</button>' +
              '<button type="button" class="profile-menu__link" data-profile-action="language">' +
                '<span>Language</span>' +
                '<span class="profile-menu__badge profile-menu__badge--lang">' +
                  '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.00016 1.3335C11.6821 1.3335 14.6668 4.31826 14.6668 8.00016C14.6668 11.6821 11.6821 14.6668 8.00016 14.6668C4.31826 14.6668 1.3335 11.6821 1.3335 8.00016C1.3335 4.31826 4.31826 1.3335 8.00016 1.3335ZM8.15391 13.3313C8.10283 13.3328 8.05158 13.3335 8.00016 13.3335C7.94874 13.3335 7.89749 13.3328 7.84642 13.3313L7.83404 13.3184C7.65398 13.128 7.43653 12.7881 7.22872 12.2685C7.09082 11.9238 6.96751 11.526 6.8644 11.0847C6.81013 10.8524 6.97982 10.6305 7.21812 10.6189C7.47355 10.6066 7.7345 10.6001 8.00015 10.6001C8.26581 10.6001 8.52678 10.6066 8.78221 10.6189C9.0205 10.6305 9.1902 10.8524 9.13592 11.0847C9.03282 11.526 8.9095 11.9238 8.77161 12.2685C8.56379 12.7881 8.34635 13.128 8.16628 13.3184L8.15391 13.3313ZM9.43042 9.06387C9.41529 9.28201 9.22284 9.44191 9.00454 9.42918C8.67531 9.40998 8.3399 9.40014 8.00015 9.40014C7.66038 9.40014 7.32498 9.40998 6.99578 9.42918C6.77748 9.44191 6.58503 9.28201 6.5699 9.06387C6.54611 8.7207 6.5335 8.36532 6.5335 8.00016C6.5335 7.63501 6.54611 7.27963 6.5699 6.93646C6.58503 6.71831 6.77748 6.55842 6.99578 6.57115C7.32498 6.59034 7.66038 6.60018 8.00015 6.60018C8.3399 6.60018 8.67531 6.59034 9.00454 6.57114C9.22284 6.55841 9.41529 6.71831 9.43042 6.93646C9.45422 7.27963 9.46683 7.63501 9.46683 8.00016C9.46683 8.36532 9.45422 8.7207 9.43042 9.06387ZM10.8087 10.8584C10.595 10.8167 10.3921 10.9608 10.3459 11.1736C10.1918 11.884 9.98761 12.5165 9.74514 13.0415C10.7428 12.6962 11.6061 12.0632 12.2357 11.2416C11.8144 11.0913 11.3348 10.9613 10.8087 10.8584ZM12.8625 10.1948C12.3 9.97617 11.6578 9.79762 10.9599 9.66554C10.7523 9.62624 10.6062 9.43679 10.6218 9.22605C10.6514 8.82868 10.6668 8.41893 10.6668 8.00016C10.6668 7.58139 10.6514 7.17164 10.6218 6.77428C10.6062 6.56353 10.7523 6.37408 10.9599 6.33479C11.6578 6.20271 12.3 6.02416 12.8625 5.80557C13.1651 6.47491 13.3335 7.21786 13.3335 8.00016C13.3335 8.78246 13.1651 9.52542 12.8625 10.1948ZM5.04043 9.66553C5.24807 9.62624 5.39415 9.43679 5.37848 9.22604C5.34894 8.82868 5.3335 8.41893 5.3335 8.00016C5.3335 7.5814 5.34894 7.17165 5.37848 6.77428C5.39415 6.56354 5.24807 6.37409 5.04043 6.33479C4.34242 6.20269 3.70019 6.02413 3.13783 5.80558C2.83526 6.47492 2.66683 7.21787 2.66683 8.00016C2.66683 8.78246 2.83526 9.52541 3.13783 10.1947C3.70019 9.97619 4.34242 9.79763 5.04043 9.66553ZM3.76458 11.2416C4.39425 12.0632 5.25755 12.6962 6.25519 13.0415C6.01271 12.5165 5.8085 11.8839 5.65441 11.1736C5.60826 10.9608 5.40529 10.8166 5.19161 10.8584C4.66561 10.9613 4.18597 11.0912 3.76458 11.2416ZM7.22872 3.73179C7.09082 4.07652 6.96751 4.47433 6.8644 4.91566C6.81013 5.14797 6.97982 5.36983 7.21812 5.38138C7.47355 5.39376 7.7345 5.40018 8.00015 5.40018C8.26581 5.40018 8.52678 5.39376 8.78221 5.38138C9.0205 5.36982 9.1902 5.14797 9.13592 4.91566C9.03282 4.47433 8.9095 4.07652 8.77161 3.73179C8.56379 3.21224 8.34635 2.87233 8.16628 2.68193L8.15391 2.669C8.10283 2.66756 8.05158 2.66683 8.00016 2.66683C7.94874 2.66683 7.89749 2.66756 7.84642 2.669L7.83404 2.68193C7.65398 2.87233 7.43653 3.21224 7.22872 3.73179ZM10.3459 4.82675C10.3921 5.03953 10.595 5.18367 10.8087 5.14189C11.3348 5.03902 11.8144 4.90905 12.2357 4.75868C11.6061 3.93714 10.7428 3.30409 9.74514 2.95883C9.98761 3.48385 10.1918 4.11637 10.3459 4.82675ZM3.76458 4.75868C4.18597 4.90909 4.66561 5.03904 5.19161 5.1419C5.40529 5.18368 5.60826 5.03954 5.65441 4.82676C5.8085 4.11638 6.01271 3.48385 6.25519 2.95883C5.25755 3.3041 4.39425 3.93714 3.76458 4.75868Z" fill="#173398"/></svg>' +
                  '<span>En</span>' +
                '</span>' +
              '</button>' +
              '<button type="button" class="profile-menu__link" data-profile-action="logout">Log out</button>' +
            '</div>' +
            '<div class="profile-menu__actions">' +
              '<button type="button" class="btn-tertiary btn-tertiary--s btn-tertiary--block" data-profile-action="profile-settings">Profile settings</button>' +
            '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<button type="button" class="app-header__burger" aria-label="Open menu">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
            '<line x1="4" y1="7" x2="20" y2="7"></line>' +
            '<line x1="4" y1="12" x2="20" y2="12"></line>' +
            '<line x1="4" y1="17" x2="20" y2="17"></line>' +
          '</svg>' +
        '</button>' +
      '</div>' +
    '</header>' +
    '<div class="mobile-drawer" id="ib-mobile-drawer" role="dialog" aria-modal="true" aria-label="Navigation menu" aria-hidden="true">' +
      '<div class="mobile-drawer__topbar">' +
        '<button type="button" class="mobile-drawer__close" aria-label="Close menu">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
            '<path d="M6 6l12 12M18 6L6 18"></path>' +
          '</svg>' +
        '</button>' +
      '</div>' +
      '<div class="mobile-drawer__body">' +
        '<nav class="mobile-drawer__menu" aria-label="Main menu">' +
          '<button type="button" class="mobile-drawer__item' + (activeKey === 'dashboard' ? ' mobile-drawer__item--active' : '') + '" data-nav="dashboard">IB Dashboard</button>' +
          '<button type="button" class="mobile-drawer__item" data-nav="revenue">Revenue statistics</button>' +
          '<div class="mobile-drawer__group">' +
            '<button type="button" class="mobile-drawer__item mobile-drawer__toggle" aria-expanded="' + (growthActive ? 'true' : 'false') + '">' +
              '<span class="mobile-drawer__item-row">' +
                'Client engagement' +
                '<svg class="mobile-drawer__chevron' + (growthActive ? ' mobile-drawer__chevron--open' : '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
                  '<polyline points="6 9 12 15 18 9"></polyline>' +
                '</svg>' +
              '</span>' +
            '</button>' +
            '<div class="mobile-drawer__submenu"' + (growthActive ? '' : ' hidden') + '>' +
              '<button type="button" class="mobile-drawer__subitem' + (activeKey === 'contests' ? ' mobile-drawer__subitem--active' : '') + '" data-nav="contests">Contests</button>' +
              '<button type="button" class="mobile-drawer__subitem' + (activeKey === 'rebate' ? ' mobile-drawer__subitem--active' : '') + '" data-nav="rebate">Rebate</button>' +
            '</div>' +
          '</div>' +
          '<button type="button" class="mobile-drawer__item" data-nav="promo">Promo materials</button>' +
        '</nav>' +
      '</div>' +
    '</div>';

  document.body.classList.add('has-ib-chrome');
  document.body.insertAdjacentHTML('afterbegin', html);

  var drawer = document.getElementById('ib-mobile-drawer');
  var burger = document.querySelector('.app-header__burger');
  var closeBtn = document.querySelector('.mobile-drawer__close');

  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add('mobile-drawer--open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('mobile-drawer--open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (burger) burger.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  var profileTrigger = document.getElementById('ib-profile-trigger');
  var profileMenu = document.getElementById('ib-profile-menu');
  var profileCloseBtn = document.querySelector('.profile-menu__close');

  function isMobileProfileMenu() {
    return window.matchMedia('(max-width: 639px)').matches;
  }

  function openProfileMenu() {
    if (!profileMenu || !profileTrigger) return;
    profileMenu.hidden = false;
    profileTrigger.setAttribute('aria-expanded', 'true');
    if (isMobileProfileMenu()) {
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(function () {
        profileMenu.classList.add('profile-menu--open');
      });
    } else {
      profileMenu.classList.add('profile-menu--open');
    }
  }

  function closeProfileMenu() {
    if (!profileMenu || !profileTrigger) return;
    profileTrigger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';

    if (isMobileProfileMenu() && profileMenu.classList.contains('profile-menu--open')) {
      profileMenu.classList.remove('profile-menu--open');
      var hideAfterTransition = function (event) {
        if (event.propertyName !== 'transform') return;
        profileMenu.removeEventListener('transitionend', hideAfterTransition);
        profileMenu.hidden = true;
      };
      profileMenu.addEventListener('transitionend', hideAfterTransition);
      window.setTimeout(function () {
        if (profileMenu.hidden === false && !profileMenu.classList.contains('profile-menu--open')) {
          profileMenu.hidden = true;
        }
      }, 300);
      return;
    }

    profileMenu.classList.remove('profile-menu--open');
    profileMenu.hidden = true;
  }

  function toggleProfileMenu() {
    if (!profileMenu) return;
    if (profileMenu.hidden) openProfileMenu();
    else closeProfileMenu();
  }

  if (profileTrigger) {
    profileTrigger.addEventListener('click', function (event) {
      event.stopPropagation();
      if (isMobileProfileMenu()) return;
      toggleProfileMenu();
    });
  }

  if (profileCloseBtn) {
    profileCloseBtn.addEventListener('click', function (event) {
      event.stopPropagation();
      closeProfileMenu();
    });
  }

  if (profileMenu) {
    profileMenu.addEventListener('click', function (event) {
      event.stopPropagation();
    });
  }

  document.addEventListener('click', function () {
    if (!isMobileProfileMenu()) closeProfileMenu();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeProfileMenu();
      closeDrawer();
    }
  });

  document.body.addEventListener('click', function (event) {
    var profileAction = event.target.closest('[data-profile-action]');
    if (profileAction) {
      var action = profileAction.dataset.profileAction;
      closeProfileMenu();
      if (action === 'invite') {
        window.alert('Invite — not implemented in this prototype.');
        return;
      }
      if (action === 'profile-settings') {
        window.alert('Profile settings — not implemented in this prototype.');
        return;
      }
      if (action === 'notifications') {
        window.alert('Notifications — not implemented in this prototype.');
        return;
      }
      if (action === 'language') {
        window.alert('Language — not implemented in this prototype.');
        return;
      }
      if (action === 'logout') {
        window.alert('Log out — not implemented in this prototype.');
      }
      return;
    }

    var identity = event.target.closest('.profile-menu__identity');
    if (identity) {
      closeProfileMenu();
      window.alert('Profile settings — not implemented in this prototype.');
      return;
    }

    var toggle = event.target.closest('.mobile-drawer__toggle');
    if (toggle) {
      var group = toggle.closest('.mobile-drawer__group');
      var submenu = group && group.querySelector('.mobile-drawer__submenu');
      var chevron = toggle.querySelector('.mobile-drawer__chevron');
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      if (submenu) submenu.hidden = expanded;
      if (chevron) chevron.classList.toggle('mobile-drawer__chevron--open', !expanded);
      return;
    }

    var btn = event.target.closest('[data-nav]');
    if (!btn) return;
    var key = btn.dataset.nav;
    if (key === 'dashboard') {
      if (activeKey !== 'dashboard') window.location.assign(dashboardHref);
      closeDrawer();
      return;
    }
    if (key === 'contests') {
      window.location.assign(contestsHref);
      return;
    }
    if (key === 'rebate') {
      if (activeKey !== 'rebate') window.location.assign(rebateHref);
      closeDrawer();
      return;
    }
    if (key === 'revenue') {
      window.alert('Revenue statistics — not implemented in this prototype.');
      closeDrawer();
      return;
    }
    if (key === 'promo') {
      window.alert('Promo materials — not implemented in this prototype.');
      closeDrawer();
      return;
    }
    closeDrawer();
  });
})();
