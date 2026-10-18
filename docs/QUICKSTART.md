# Start LiberaPack locally

Requirements: Node.js 20 or later. No npm packages or API keys are required for the reference demo.

## Download and test

From a terminal:

```bash
git clone https://github.com/robertoonprogram/programmazioneapp.git
cd programmazioneapp
npm test
npm run demo
npm start
```

Open **http://127.0.0.1:4173/** for the offline UI, or **http://127.0.0.1:4173/shopify-demo.html** for the separate Shopify-oriented UI demonstration.

You can also download the repository ZIP and open `index.html` without a server for the offline version.

## Reference API (synthetic data only)

- `GET /api/health` checks the local process and reports that external services are not connected.
- `GET /api/sample` shows sample product/box/order records.
- `POST /api/pack` produces a deterministic parcel proposal.
- `POST /api/picking` totals quantities for consolidated warehouse picking.

Try the sample order:

```bash
curl -s http://127.0.0.1:4173/api/pack \
  -H 'Content-Type: application/json' \
  -d '{"order":{"id":"TEST-001","items":[{"sku":"PESTO180","quantity":2},{"sku":"OIL500","quantity":1}]}}'
```

To build one picking list for all sample orders:

```bash
curl -s http://127.0.0.1:4173/api/picking \
  -H 'Content-Type: application/json' \
  -d '{}'
```

The server binds to `127.0.0.1` by default. It has **no authentication or permanent storage**, so do not put it on the public Internet without replacing its demo-only security architecture.

## Test commands

```bash
npm run check  # syntax validation
npm test       # packing / picking invariants
npm run demo   # demonstrate results in JSON
```

## What this does not prove

- No live Shopify installation or payment/fulfillment processing.
- No verified AMD or Evolus deployment.
- No physically validated 3D packing geometry or printer connection.
- No historical OS1 compatibility certification.
