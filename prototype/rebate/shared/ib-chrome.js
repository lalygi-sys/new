(function () {
  var script = document.currentScript;
  var activeKey = (script && script.dataset.active) || 'rebate';
  var contestsHref = (script && script.dataset.contestsHref) || '../index.html';
  var growthActive = activeKey === 'contests' || activeKey === 'rebate';

  var html =
    '<div class="role-bar" role="region" aria-label="Demo: role preview">' +
      '<span class="role-bar__label">Demo preview:</span>' +
      '<div class="ds-button-group ds-button-group--s" role="radiogroup" aria-label="Preview role">' +
        '<button type="button" class="ds-button-group__segment ds-button-group__segment--active" aria-pressed="true">IB Partner</button>' +
        '<button type="button" class="ds-button-group__segment" aria-pressed="false">Client</button>' +
        '<button type="button" class="ds-button-group__segment" aria-pressed="false">Admin</button>' +
      '</div>' +
      '<span class="role-bar__pill">Demo: you — IB Partner</span>' +
    '</div>' +
    '<header class="app-header" role="banner">' +
      '<div class="app-header__logo" aria-label="Logo"></div>' +
      '<nav class="app-header__menu" aria-label="Main menu">' +
        '<button type="button" class="app-header__menu-item" data-nav="dashboard">IB Dashboard</button>' +
        '<button type="button" class="app-header__menu-item" data-nav="revenue">Revenue statistics</button>' +
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
        '<button type="button" class="app-header__menu-item' + (activeKey === 'promo' ? ' app-header__menu-item--active' : '') + '" data-nav="promo">Promo materials</button>' +
      '</nav>' +
      '<div class="app-header__right">' +
        '<button type="button" class="app-header__wallet" aria-label="Wallet">' +
          '<span class="app-header__wallet-label">Wallet</span>' +
          '<span class="app-header__wallet-amount">$0.00</span>' +
        '</button>' +
        '<button type="button" class="app-header__avatar" aria-label="Profile">' +
          '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
            '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>' +
            '<circle cx="12" cy="7" r="4"></circle>' +
          '</svg>' +
        '</button>' +
      '</div>' +
    '</header>';

  document.body.classList.add('has-ib-chrome');
  document.body.insertAdjacentHTML('afterbegin', html);

  document.body.addEventListener('click', function (event) {
    var btn = event.target.closest('[data-nav]');
    if (!btn) return;
    var key = btn.dataset.nav;
    if (key === 'contests') {
      window.location.assign(contestsHref);
      return;
    }
    if (key === 'rebate') return;
    var labels = {
      dashboard: 'IB Dashboard',
      revenue: 'Revenue statistics',
      promo: 'Promo materials'
    };
    if (labels[key]) {
      window.alert('«' + labels[key] + '» — section not implemented in this prototype.');
    }
  });
})();
