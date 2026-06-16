# IB Dashboard — prototype

Standalone HTML page matching Figma `Dashboard_desktop` (node `157:170646`).

## Open locally

From the `prototype` folder:

```bash
python3 -m http.server 8765
```

Then open:

- http://localhost:8765/ib-dashboard/

## Structure

- `index.html` — page markup (commission, referral links, revenue stats, promo, clients)
- `styles.css` — layout and card styles
- `app.js` — period chips, client tabs, copy referral link
- `../shared/ib-chrome.css` + `../shared/ib-chrome.js` — shared IB header and role bar

## Navigation

Header links to Contests, Rebate, and IB Dashboard work across prototype pages.
