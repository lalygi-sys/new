(function () {
  function bindChipGroup(container) {
    if (!container) return;
    container.addEventListener('click', function (e) {
      var chip = e.target.closest('.chip');
      if (!chip || !container.contains(chip)) return;
      container.querySelectorAll('.chip').forEach(function (c) {
        c.classList.remove('is-active');
        c.removeAttribute('aria-selected');
      });
      chip.classList.add('is-active');
      chip.setAttribute('aria-selected', 'true');
    });
  }

  function bindPinnedTooltip(trigger, options) {
    if (!trigger) return;
    var tooltipEl = document.createElement('div');
    tooltipEl.className = 'dashboard-tooltip';
    tooltipEl.id = options.id;
    tooltipEl.setAttribute('role', 'tooltip');
    tooltipEl.innerHTML = options.html;
    document.body.appendChild(tooltipEl);
    var pinned = false;

    trigger.setAttribute('aria-expanded', 'false');
    if (options.controlsId) trigger.setAttribute('aria-controls', options.controlsId);

    function positionTooltip() {
      var triggerRect = trigger.getBoundingClientRect();
      tooltipEl.dataset.visible = 'true';
      tooltipEl.style.visibility = 'hidden';
      var tipRect = tooltipEl.getBoundingClientRect();
      var gap = 8;
      var placement = 'top';
      var top = triggerRect.top - tipRect.height - gap;
      if (top < 8) {
        placement = 'bottom';
        top = triggerRect.bottom + gap;
      }
      var left = triggerRect.left + triggerRect.width / 2 - tipRect.width / 2;
      if (left < 8) left = 8;
      if (left + tipRect.width > window.innerWidth - 8) {
        left = window.innerWidth - tipRect.width - 8;
      }
      var arrowLeft = triggerRect.left + triggerRect.width / 2 - left;
      arrowLeft = Math.max(12, Math.min(tipRect.width - 12, arrowLeft));
      tooltipEl.dataset.placement = placement;
      tooltipEl.style.setProperty('--tip-arrow-left', arrowLeft + 'px');
      tooltipEl.style.top = top + 'px';
      tooltipEl.style.left = left + 'px';
      tooltipEl.style.visibility = '';
    }

    function showTooltip() {
      pinned = true;
      trigger.setAttribute('aria-expanded', 'true');
      tooltipEl.style.pointerEvents = 'auto';
      positionTooltip();
    }

    function hideTooltip() {
      pinned = false;
      trigger.setAttribute('aria-expanded', 'false');
      tooltipEl.removeAttribute('data-visible');
      tooltipEl.style.pointerEvents = '';
    }

    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      if (pinned) hideTooltip();
      else showTooltip();
    });

    document.addEventListener('click', function (e) {
      if (!pinned) return;
      if (tooltipEl.contains(e.target) || trigger.contains(e.target)) return;
      hideTooltip();
    });

    window.addEventListener('scroll', function () {
      if (pinned) positionTooltip();
    }, true);

    window.addEventListener('resize', function () {
      if (pinned) hideTooltip();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && pinned) hideTooltip();
    });
  }

  var revenueBanners = document.querySelector('.revenue-card .stat-banners');
  var revenuePeriodChips = document.querySelector('.revenue-card .card-head__chips');
  var revenueChartLine = document.getElementById('revenue-chart-line');
  var revenueChartFill = document.getElementById('revenue-chart-fill');
  var revenueChartYLabels = document.getElementById('revenue-chart-ylabels');
  var revenueChartXLabels = document.getElementById('revenue-chart-xlabels');
  var revenueChartSvg = document.querySelector('.revenue-chart__svg');
  var revenueChartHit = document.querySelector('.revenue-chart__hit');
  var revenueChartCrosshair = document.getElementById('revenue-chart-crosshair');
  var revenueChartCrosshairLine = revenueChartCrosshair && revenueChartCrosshair.querySelector('.revenue-chart__crosshair-line');
  var revenueChartCrosshairDot = revenueChartCrosshair && revenueChartCrosshair.querySelector('.revenue-chart__crosshair-dot');
  var CHART_HEIGHT = 156;
  var CHART_WIDTH = 658;
  var currentRevenuePeriod = '30d';
  var revenueMetricLabels = {
    profit: 'IB profit',
    traders: 'Active traders',
    volume: 'Traded volume',
    deposit: 'Total deposit'
  };
  var revenueChartPaths = {
    profit: 'M0 121 L55 111 L104 114 L165 102 L220 83 L261 90 L330 62 L387 73 L441 42 L493 49 L550 28 L606 35 L658 21',
    traders: 'M0 104 L55 100 L104 95 L165 91 L220 87 L261 82 L330 78 L387 76 L441 74 L493 71 L550 68 L606 65 L658 61',
    volume: 'M0 130 L55 87 L104 113 L165 69 L220 104 L261 61 L330 95 L387 52 L441 87 L493 43 L550 78 L606 48 L658 35',
    deposit: 'M0 139 L55 130 L104 121 L165 113 L220 104 L261 95 L330 87 L387 78 L441 69 L493 61 L550 52 L606 43 L658 30'
  };

  function makeChartEntry(line, yLabels) {
    return {
      line: line,
      area: line + ' L658 156 L0 156 Z',
      yLabels: yLabels
    };
  }

  function buildPeriodCharts(yLabelsByMetric) {
    var chart = {};
    Object.keys(revenueChartPaths).forEach(function (metric) {
      chart[metric] = makeChartEntry(revenueChartPaths[metric], yLabelsByMetric[metric]);
    });
    return chart;
  }

  var revenuePeriods = {
    '1d': {
      banners: {
        profit: { value: '$842', delta: '↑ 4%', trend: 'up' },
        traders: { value: '2', delta: '→ 0%', trend: 'inflow' },
        volume: { value: '3', delta: '↓ 12%', trend: 'down' },
        deposit: { value: '$320', delta: '↑ 2%', trend: 'up' }
      },
      xLabels: ['00:00', '06:00', '12:00', '18:00', '24:00'],
      chartDates: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '23:59'],
      yMax: { profit: 1000, traders: 4, volume: 10, deposit: 500 },
      chart: buildPeriodCharts({
        profit: ['$0', '$250', '$500', '$750', '$1k'],
        traders: ['0', '1', '2', '3', '4'],
        volume: ['0', '3', '5', '8', '10'],
        deposit: ['$0', '$125', '$250', '$375', '$500']
      })
    },
    '7d': {
      banners: {
        profit: { value: '$4,280', delta: '↑ 9%', trend: 'up' },
        traders: { value: '2', delta: '↓ 3%', trend: 'down' },
        volume: { value: '18', delta: '↑ 6%', trend: 'up' },
        deposit: { value: '$2,840', delta: '↓ 1%', trend: 'down' }
      },
      xLabels: ['Mon 4', 'Wed 6', 'Fri 8', 'Sun 10', 'Sun 10'],
      chartDates: ['Mon 4', 'Tue 5', 'Wed 6', 'Thu 7', 'Fri 8', 'Sat 9', 'Sun 10', 'Mon 11', 'Tue 12', 'Wed 13', 'Thu 14', 'Fri 15', 'Sat 16'],
      yMax: { profit: 5000, traders: 4, volume: 25, deposit: 3000 },
      chart: buildPeriodCharts({
        profit: ['$0', '$1.25k', '$2.5k', '$3.75k', '$5k'],
        traders: ['0', '1', '2', '3', '4'],
        volume: ['0', '6', '13', '19', '25'],
        deposit: ['$0', '$750', '$1.5k', '$2.25k', '$3k']
      })
    },
    '30d': {
      banners: {
        profit: { value: '$20,000', delta: '↑ 21%', trend: 'up' },
        traders: { value: '2', delta: '↓ 8%', trend: 'down' },
        volume: { value: '44', delta: '↑ 3%', trend: 'up' },
        deposit: { value: '$12,456', delta: '↓ 5%', trend: 'down' }
      },
      xLabels: ['1 Aug', '8 Aug', '15 Aug', '22 Aug', '29 Aug'],
      chartDates: ['1 Aug', '3 Aug', '5 Aug', '8 Aug', '10 Aug', '12 Aug', '15 Aug', '17 Aug', '19 Aug', '22 Aug', '24 Aug', '27 Aug', '29 Aug'],
      yMax: { profit: 20000, traders: 4, volume: 60, deposit: 12000 },
      chart: buildPeriodCharts({
        profit: ['$0', '$5k', '$10k', '$15k', '$20k'],
        traders: ['0', '1', '2', '3', '4'],
        volume: ['0', '15', '30', '45', '60'],
        deposit: ['$0', '$3k', '$6k', '$9k', '$12k']
      })
    },
    all: {
      banners: {
        profit: { value: '$186,400', delta: '↑ 34%', trend: 'up' },
        traders: { value: '2', delta: '↓ 8%', trend: 'down' },
        volume: { value: '512', delta: '↑ 28%', trend: 'up' },
        deposit: { value: '$94,200', delta: '↑ 18%', trend: 'up' }
      },
      xLabels: ['Jan', 'Apr', 'Jul', 'Oct', 'Dec'],
      chartDates: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Dec'],
      yMax: { profit: 200000, traders: 4, volume: 600, deposit: 120000 },
      chart: buildPeriodCharts({
        profit: ['$0', '$50k', '$100k', '$150k', '$200k'],
        traders: ['0', '1', '2', '3', '4'],
        volume: ['0', '150', '300', '450', '600'],
        deposit: ['$0', '$30k', '$60k', '$90k', '$120k']
      })
    }
  };
  var revenueChartPoints = [];
  var revenueChartMetric = 'profit';
  var revenueChartTooltipEl = null;
  var revenueChartTooltipDateEl = null;
  var revenueChartTooltipValueEl = null;

  function formatChartCurrency(value) {
    var rounded = Math.round(value);
    if (rounded >= 1000) return '$' + rounded.toLocaleString('en-US');
    return '$' + rounded;
  }

  function formatChartCount(value) {
    var rounded = Math.round(value * 10) / 10;
    return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
  }

  function formatChartLots(value) {
    return Math.round(value) + ' lots';
  }

  function parseChartLine(path) {
    return path.replace(/^M/, '').split(' L').map(function (pair) {
      var parts = pair.trim().split(/\s+/);
      return { x: Number(parts[0]), y: Number(parts[1]) };
    });
  }

  function chartValueFromY(y, yMax) {
    return yMax * (1 - y / CHART_HEIGHT);
  }

  function getRevenueMetricMeta(metric) {
    var period = revenuePeriods[currentRevenuePeriod];
    var formatters = {
      profit: formatChartCurrency,
      traders: formatChartCount,
      volume: formatChartLots,
      deposit: formatChartCurrency
    };
    return {
      yMax: period.yMax[metric],
      formatValue: formatters[metric]
    };
  }

  function getChartDates() {
    return revenuePeriods[currentRevenuePeriod].chartDates;
  }

  function buildChartPoints(metric, linePath) {
    var meta = getRevenueMetricMeta(metric);
    if (!meta) return [];
    return parseChartLine(linePath).map(function (point, index) {
      var value = chartValueFromY(point.y, meta.yMax);
      return {
        x: point.x,
        y: point.y,
        date: getChartDates()[index] || '',
        valueLabel: meta.formatValue(value)
      };
    });
  }

  function hideRevenueChartTooltip() {
    if (!revenueChartTooltipEl) return;
    revenueChartTooltipEl.removeAttribute('data-visible');
    if (revenueChartCrosshair) revenueChartCrosshair.hidden = true;
  }

  function setRevenueChart(metric) {
    var periodData = revenuePeriods[currentRevenuePeriod];
    var data = periodData && periodData.chart[metric];
    if (!data) return;
    revenueChartMetric = metric;
    revenueChartPoints = buildChartPoints(metric, data.line);
    if (revenueChartLine) revenueChartLine.setAttribute('d', data.line);
    if (revenueChartFill) revenueChartFill.setAttribute('d', data.area);
    if (revenueChartYLabels && data.yLabels) {
      var labels = revenueChartYLabels.querySelectorAll('span');
      data.yLabels.forEach(function (label, i) {
        if (labels[labels.length - 1 - i]) labels[labels.length - 1 - i].textContent = label;
      });
    }
    hideRevenueChartTooltip();
  }

  function updateRevenueBanners(period) {
    if (!revenueBanners) return;
    var banners = revenuePeriods[period].banners;
    revenueBanners.querySelectorAll('.stat-banner').forEach(function (banner) {
      var metric = banner.dataset.metric;
      var item = banners[metric];
      if (!item) return;
      var valueEl = banner.querySelector('.stat-banner__value');
      var deltaEl = banner.querySelector('.stat-banner__delta');
      if (valueEl) valueEl.textContent = item.value;
      if (deltaEl) {
        deltaEl.textContent = item.delta;
        deltaEl.className = 'stat-banner__delta stat-banner__delta--' + item.trend;
      }
      var label = revenueMetricLabels[metric] || metric;
      var ariaDelta = item.delta.replace('↑', 'up').replace('↓', 'down').replace('→', 'flat');
      banner.setAttribute('aria-label', label + ', ' + item.value + ', ' + ariaDelta);
    });
  }

  function updateRevenueXLabels(period) {
    if (!revenueChartXLabels) return;
    var labels = revenuePeriods[period].xLabels;
    var spans = revenueChartXLabels.querySelectorAll('span');
    labels.forEach(function (label, index) {
      if (spans[index]) spans[index].textContent = label;
    });
  }

  function setRevenuePeriod(period) {
    if (!revenuePeriods[period]) return;
    currentRevenuePeriod = period;
    updateRevenueBanners(period);
    updateRevenueXLabels(period);
    var selectedBanner = revenueBanners && revenueBanners.querySelector('.stat-banner.is-selected');
    if (selectedBanner) setRevenueChart(selectedBanner.dataset.metric);
  }

  function selectRevenueBanner(banner) {
    if (!revenueBanners || !banner) return;
    revenueBanners.querySelectorAll('.stat-banner').forEach(function (b) {
      b.classList.remove('is-selected');
      b.setAttribute('aria-checked', 'false');
      b.setAttribute('tabindex', '-1');
    });
    banner.classList.add('is-selected');
    banner.setAttribute('aria-checked', 'true');
    banner.setAttribute('tabindex', '0');
    setRevenueChart(banner.dataset.metric);
  }

  if (revenueBanners) {
    revenueBanners.addEventListener('click', function (e) {
      if (revenueBanners._suppressDragScrollClick) return;
      var banner = e.target.closest('.stat-banner');
      if (!banner || !revenueBanners.contains(banner)) return;
      selectRevenueBanner(banner);
    });

    var initialBanner = revenueBanners.querySelector('.stat-banner.is-selected') ||
      revenueBanners.querySelector('.stat-banner');
    if (initialBanner) selectRevenueBanner(initialBanner);
  }

  if (revenuePeriodChips) {
    revenuePeriodChips.addEventListener('click', function (e) {
      var chip = e.target.closest('.chip');
      if (!chip || !revenuePeriodChips.contains(chip)) return;
      revenuePeriodChips.querySelectorAll('.chip').forEach(function (c) {
        c.classList.remove('is-active');
        c.removeAttribute('aria-selected');
      });
      chip.classList.add('is-active');
      chip.setAttribute('aria-selected', 'true');
      setRevenuePeriod(chip.dataset.period);
    });
  }

  if (revenueChartHit && revenueChartSvg) {
    revenueChartTooltipEl = document.createElement('div');
    revenueChartTooltipEl.className = 'dashboard-tooltip dashboard-tooltip--chart';
    revenueChartTooltipEl.id = 'revenue-chart-tooltip';
    revenueChartTooltipEl.setAttribute('role', 'tooltip');
    revenueChartTooltipDateEl = document.createElement('span');
    revenueChartTooltipDateEl.className = 'dashboard-tooltip__date';
    revenueChartTooltipValueEl = document.createElement('span');
    revenueChartTooltipValueEl.className = 'dashboard-tooltip__value';
    revenueChartTooltipEl.appendChild(revenueChartTooltipDateEl);
    revenueChartTooltipEl.appendChild(revenueChartTooltipValueEl);
    document.body.appendChild(revenueChartTooltipEl);

    function findNearestChartPoint(svgX) {
      if (!revenueChartPoints.length) return null;
      var nearestIndex = 0;
      var nearestDistance = Infinity;
      revenueChartPoints.forEach(function (point, index) {
        var distance = Math.abs(point.x - svgX);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });
      return revenueChartPoints[nearestIndex];
    }

    function positionRevenueChartTooltip(point) {
      if (!revenueChartTooltipEl || !revenueChartSvg) return;
      var plotRect = revenueChartSvg.getBoundingClientRect();
      var anchorX = plotRect.left + (point.x / CHART_WIDTH) * plotRect.width;
      var anchorY = plotRect.top + (point.y / CHART_HEIGHT) * plotRect.height;
      revenueChartTooltipEl.dataset.visible = 'true';
      revenueChartTooltipEl.style.visibility = 'hidden';
      var tipRect = revenueChartTooltipEl.getBoundingClientRect();
      var gap = 10;
      var placement = 'top';
      var top = anchorY - tipRect.height - gap;
      if (top < 8) {
        placement = 'bottom';
        top = anchorY + gap;
      }
      var left = anchorX - tipRect.width / 2;
      if (left < 8) left = 8;
      if (left + tipRect.width > window.innerWidth - 8) {
        left = window.innerWidth - tipRect.width - 8;
      }
      var arrowLeft = anchorX - left;
      arrowLeft = Math.max(12, Math.min(tipRect.width - 12, arrowLeft));
      revenueChartTooltipEl.dataset.placement = placement;
      revenueChartTooltipEl.style.setProperty('--tip-arrow-left', arrowLeft + 'px');
      revenueChartTooltipEl.style.top = top + 'px';
      revenueChartTooltipEl.style.left = left + 'px';
      revenueChartTooltipEl.style.visibility = '';
    }

    function updateRevenueChartCrosshair(point) {
      if (!revenueChartCrosshair || !revenueChartCrosshairLine || !revenueChartCrosshairDot) return;
      revenueChartCrosshairLine.setAttribute('x1', point.x);
      revenueChartCrosshairLine.setAttribute('x2', point.x);
      revenueChartCrosshairLine.setAttribute('y1', point.y);
      revenueChartCrosshairLine.setAttribute('y2', CHART_HEIGHT);
      revenueChartCrosshairDot.setAttribute('cx', point.x);
      revenueChartCrosshairDot.setAttribute('cy', point.y);
      revenueChartCrosshair.hidden = false;
    }

    function showRevenueChartTooltip(point) {
      if (!point || !revenueChartTooltipDateEl || !revenueChartTooltipValueEl) return;
      revenueChartTooltipDateEl.textContent = point.date;
      revenueChartTooltipValueEl.textContent = point.valueLabel;
      updateRevenueChartCrosshair(point);
      positionRevenueChartTooltip(point);
    }

    function handleRevenueChartHover(clientX) {
      if (!revenueChartSvg || !revenueChartPoints.length) return;
      var plotRect = revenueChartSvg.getBoundingClientRect();
      if (!plotRect.width) return;
      var svgX = ((clientX - plotRect.left) / plotRect.width) * CHART_WIDTH;
      svgX = Math.max(0, Math.min(CHART_WIDTH, svgX));
      var point = findNearestChartPoint(svgX);
      if (point) showRevenueChartTooltip(point);
    }

    revenueChartHit.addEventListener('mousemove', function (e) {
      handleRevenueChartHover(e.clientX);
    });

    revenueChartHit.addEventListener('mouseleave', hideRevenueChartTooltip);

    window.addEventListener('scroll', function () {
      if (!revenueChartTooltipEl || !revenueChartTooltipEl.hasAttribute('data-visible')) return;
      var activePoint = findNearestChartPoint(
        ((revenueChartCrosshairDot && Number(revenueChartCrosshairDot.getAttribute('cx'))) || 0)
      );
      if (activePoint) positionRevenueChartTooltip(activePoint);
    }, true);

    window.addEventListener('resize', hideRevenueChartTooltip);
  }

  var revenueInfoBtn = document.getElementById('revenue-info-btn');
  var REVENUE_HELP_URL = '#';
  var CLIENTS_HELP_URL = '#';

  bindPinnedTooltip(revenueInfoBtn, {
    id: 'revenue-info-tooltip',
    controlsId: 'revenue-info-tooltip',
    html:
      '<p class="dashboard-tooltip__title">Revenue metrics</p>' +
      '<ul class="dashboard-tooltip__list">' +
      '<li><strong>IB profit</strong> — commission earned from referred clients.</li>' +
      '<li><strong>Active traders</strong> — clients who placed at least one trade.</li>' +
      '<li><strong>Traded volume</strong> — total lots traded by your network.</li>' +
      '<li><strong>Total deposit</strong> — cumulative deposits from referred clients.</li>' +
      '</ul>' +
      '<p class="dashboard-tooltip__note">Select a metric to update the chart. Percentage change compares to the previous period.</p>' +
      '<a class="dashboard-tooltip__link" href="' + REVENUE_HELP_URL + '">Learn more about revenue statistics</a>'
  });

  bindPinnedTooltip(document.getElementById('clients-info-btn'), {
    id: 'clients-info-tooltip',
    controlsId: 'clients-info-tooltip',
    html:
      '<p class="dashboard-tooltip__title">Client rankings</p>' +
      '<ul class="dashboard-tooltip__list">' +
      '<li><strong>New</strong> — clients who joined in the selected period.</li>' +
      '<li><strong>Top profit</strong> — clients generating the most IB profit.</li>' +
      '<li><strong>Top active</strong> — clients with the highest trading activity.</li>' +
      '</ul>' +
      '<p class="dashboard-tooltip__note">Switch tabs to compare client segments. Values reflect the current ranking metric.</p>' +
      '<a class="dashboard-tooltip__link" href="' + CLIENTS_HELP_URL + '">Learn more about clients</a>'
  });

  var clientTabs = document.querySelector('.clients-card__tabs');
  var clientsList = document.querySelector('.clients-list');
  var metricLabel = document.getElementById('clients-metric-label');
  var viewAllBtn = document.getElementById('clients-view-all');
  var clientLabels = {
    new: { metric: 'Joined', cta: 'View all New clients' },
    profit: { metric: 'Profit', cta: 'View all Top profit clients' },
    active: { metric: 'Lots', cta: 'View all Top active clients' }
  };
  var clientRankings = {
    new: [
      { name: 'Olivia Bennett', value: '03.06.26' },
      { name: 'Ethan Walker', value: '28.05.26' },
      { name: 'Sophia Nguyen', value: '21.05.26' },
      { name: 'Liam Carter', value: '15.05.26' },
      { name: 'Ava Mitchell', value: '08.05.26' }
    ],
    profit: [
      { name: 'Olivia Bennett', value: '$4,820' },
      { name: 'Ethan Walker', value: '$3,960' },
      { name: 'Sophia Nguyen', value: '$2,740' },
      { name: 'Liam Carter', value: '$2,110' },
      { name: 'Ava Mitchell', value: '$1,880' }
    ],
    active: [
      { name: 'Ethan Walker', value: '52.4' },
      { name: 'Olivia Bennett', value: '48.1' },
      { name: 'Liam Carter', value: '39.8' },
      { name: 'Sophia Nguyen', value: '31.2' },
      { name: 'Ava Mitchell', value: '24.6' }
    ]
  };

  function renderClientsList(tab) {
    if (!clientsList || !clientRankings[tab]) return;
    clientsList.querySelectorAll('.clients-list__row').forEach(function (row) {
      row.remove();
    });
    clientRankings[tab].forEach(function (item) {
      var row = document.createElement('div');
      row.className = 'clients-list__row';
      row.innerHTML =
        '<span class="clients-list__name">' + item.name + '</span>' +
        '<span class="clients-list__value">' + item.value + '</span>';
      clientsList.appendChild(row);
    });
  }

  if (clientTabs) {
    clientTabs.addEventListener('click', function (e) {
      var chip = e.target.closest('.chip');
      if (!chip) return;
      var tab = chip.dataset.clientTab;
      if (!tab || !clientLabels[tab]) return;
      clientTabs.querySelectorAll('.chip').forEach(function (c) {
        c.classList.remove('is-active');
        c.removeAttribute('aria-selected');
      });
      chip.classList.add('is-active');
      chip.setAttribute('aria-selected', 'true');
      if (metricLabel) metricLabel.textContent = clientLabels[tab].metric;
      if (viewAllBtn) viewAllBtn.textContent = clientLabels[tab].cta;
      renderClientsList(tab);
    });
  }

  var historySlide = document.getElementById('clients-history-slide');

  function openClientsHistory() {
    if (!historySlide) return;
    historySlide.hidden = false;
    historySlide.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(function () {
      historySlide.classList.add('is-open');
    });
    document.body.style.overflow = 'hidden';
  }

  function closeClientsHistory() {
    if (!historySlide) return;
    historySlide.classList.remove('is-open');
    historySlide.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    window.setTimeout(function () {
      if (!historySlide.classList.contains('is-open')) historySlide.hidden = true;
    }, 280);
  }

  if (historySlide) {
    historySlide.querySelectorAll('[data-close-clients-history]').forEach(function (el) {
      el.addEventListener('click', closeClientsHistory);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && historySlide.classList.contains('is-open')) closeClientsHistory();
    });
    document.addEventListener('ib-chrome:operation-history', openClientsHistory);
  }

  var copyBtn = document.getElementById('copy-referral');
  var referralInput = document.getElementById('referral-url');
  if (copyBtn && referralInput) {
    copyBtn.addEventListener('click', function () {
      var value = referralInput.value;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).catch(function () {
          referralInput.select();
          document.execCommand('copy');
        });
      } else {
        referralInput.select();
        document.execCommand('copy');
      }
      copyBtn.setAttribute('aria-label', 'Copied');
      setTimeout(function () {
        copyBtn.setAttribute('aria-label', 'Copy referral link');
      }, 1500);
    });
  }

  var openModalId = null;

  function openModal(id) {
    var overlay = document.getElementById(id);
    if (!overlay) return;
    overlay.hidden = false;
    openModalId = id;
    document.body.style.overflow = 'hidden';
    var closeBtn = overlay.querySelector('[data-close-modal]');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    if (!openModalId) return;
    var overlay = document.getElementById(openModalId);
    if (overlay) overlay.hidden = true;
    openModalId = null;
    document.body.style.overflow = '';
  }

  document.getElementById('share-link-btn')?.addEventListener('click', function () {
    openModal('share-link-modal');
  });

  document.getElementById('commission-calc-btn')?.addEventListener('click', function () {
    openModal('commission-calc-modal');
  });

  document.getElementById('promo-platinum-cta')?.addEventListener('click', function () {
    openModal('commission-calc-modal');
  });

  document.querySelectorAll('.dashboard-overlay').forEach(function (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });
    overlay.querySelectorAll('[data-close-modal]').forEach(function (btn) {
      btn.addEventListener('click', closeModal);
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && openModalId) closeModal();
  });

  var promoCarousel = document.getElementById('promo-carousel');
  if (promoCarousel) {
    var promoSlides = promoCarousel.querySelectorAll('.promo-card__slide');
    var promoDots = promoCarousel.querySelectorAll('.promo-pagination__dot');
    var promoIndex = 0;
    var promoTimer = null;
    var promoIntervalMs = 5000;

    function setPromoSlide(index) {
      promoIndex = (index + promoSlides.length) % promoSlides.length;
      promoSlides.forEach(function (slide, i) {
        var active = i === promoIndex;
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', active ? 'false' : 'true');
        if (active && slide.dataset.promoTheme) {
          promoCarousel.dataset.promoTheme = slide.dataset.promoTheme;
        }
      });
      promoDots.forEach(function (dot, i) {
        var active = i === promoIndex;
        dot.classList.toggle('is-active', active);
        dot.setAttribute('aria-selected', active ? 'true' : 'false');
      });
    }

    function startPromoAutoplay() {
      if (promoTimer) clearInterval(promoTimer);
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      promoTimer = setInterval(function () {
        setPromoSlide(promoIndex + 1);
      }, promoIntervalMs);
    }

    promoDots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var idx = Number(dot.dataset.promoDot);
        if (Number.isNaN(idx)) return;
        setPromoSlide(idx);
        startPromoAutoplay();
      });
    });

    promoCarousel.addEventListener('mouseenter', function () {
      if (promoTimer) clearInterval(promoTimer);
    });

    promoCarousel.addEventListener('mouseleave', startPromoAutoplay);

    startPromoAutoplay();
  }

  function updateHorizontalScrollable(el, scrollableClass) {
    if (!el || !scrollableClass) return;
    el.classList.toggle(scrollableClass, el.scrollWidth > el.clientWidth + 1);
  }

  function bindHorizontalDragScroll(el, options) {
    if (!el || el._hDragScrollBound) return;
    var scrollableClass = options.scrollableClass || 'is-stat-banners-scrollable';
    var draggingClass = options.draggingClass || 'is-stat-banners-dragging';
    el._hDragScrollBound = true;
    updateHorizontalScrollable(el, scrollableClass);

    var pid = null;
    var startX = 0;
    var startY = 0;
    var startScroll = 0;
    var dragged = false;

    el.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse') return;
      if (e.button !== 0) return;
      if (el.scrollWidth <= el.clientWidth + 1) return;
      pid = e.pointerId;
      startX = e.clientX;
      startY = e.clientY;
      startScroll = el.scrollLeft;
      dragged = false;
    });

    function endDrag(e) {
      if (pid === null || e.pointerId !== pid) return;
      if (dragged) el._suppressDragScrollClick = true;
      pid = null;
      dragged = false;
      el.classList.remove(draggingClass);
      try { el.releasePointerCapture(e.pointerId); } catch (_) {}
    }

    el.addEventListener('pointermove', function (e) {
      if (pid === null || e.pointerId !== pid) return;
      var dx = e.clientX - startX;
      var dy = e.clientY - startY;
      if (!dragged) {
        if (Math.abs(dx) <= 4 || Math.abs(dx) <= Math.abs(dy)) return;
        dragged = true;
        startX = e.clientX;
        startScroll = el.scrollLeft;
        el.classList.add(draggingClass);
        try { el.setPointerCapture(e.pointerId); } catch (_) {}
      }
      el.scrollLeft = startScroll - (e.clientX - startX);
      e.preventDefault();
    }, { passive: false });

    el.addEventListener('pointerup', endDrag);
    el.addEventListener('pointercancel', endDrag);

    el.addEventListener('click', function (e) {
      if (!el._suppressDragScrollClick) return;
      el._suppressDragScrollClick = false;
      e.preventDefault();
      e.stopImmediatePropagation();
    }, true);

    el.addEventListener('wheel', function (e) {
      if (el.scrollWidth <= el.clientWidth + 1) return;
      var delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (!delta) return;
      el.scrollLeft += delta;
      e.preventDefault();
    }, { passive: false });

    var touchStartX = 0;
    var touchStartY = 0;
    var touchScrolled = false;

    el.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchScrolled = false;
    }, { passive: true });

    el.addEventListener('touchmove', function (e) {
      if (e.touches.length !== 1) return;
      var dx = Math.abs(e.touches[0].clientX - touchStartX);
      var dy = Math.abs(e.touches[0].clientY - touchStartY);
      if (dx > 8 && dx > dy) touchScrolled = true;
    }, { passive: true });

    el.addEventListener('touchend', function () {
      if (!touchScrolled) return;
      el._suppressDragScrollClick = true;
      window.setTimeout(function () {
        el._suppressDragScrollClick = false;
      }, 350);
      touchScrolled = false;
    }, { passive: true });
  }

  function initStatBannersScroll() {
    var statBanners = document.querySelectorAll('.stat-banners');
    statBanners.forEach(function (el) {
      bindHorizontalDragScroll(el, {
        scrollableClass: 'is-stat-banners-scrollable',
        draggingClass: 'is-stat-banners-dragging'
      });
    });

    if (typeof ResizeObserver !== 'undefined') {
      var ro = new ResizeObserver(function () {
        statBanners.forEach(function (el) {
          updateHorizontalScrollable(el, 'is-stat-banners-scrollable');
        });
      });
      statBanners.forEach(function (root) {
        ro.observe(root);
        root.querySelectorAll('.stat-banner').forEach(function (banner) {
          ro.observe(banner);
        });
      });
    }

    window.addEventListener('resize', function () {
      statBanners.forEach(function (el) {
        updateHorizontalScrollable(el, 'is-stat-banners-scrollable');
      });
    });
  }

  initStatBannersScroll();
})();
