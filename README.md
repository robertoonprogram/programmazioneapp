# LiberaPack

**Intelligent packing and warehouse operations for e-commerce.**

LiberaPack helps businesses prepare orders, manage products and packaging formats, consolidate warehouse picking, and select suitable boxes. The project was developed for the October 2026 hackathon in Imperia.

## Explore the prototype

- **[Open the offline demo](./index.html)** — standalone browser prototype with editable products, box formats and sample orders.
- **[Open the Shopify-oriented demo](./shopify-demo.html)** — interface for order management, product catalog, aggregated picking, box assignment and label generation. Demo mode uses sample data.

Download the repository and open `index.html` in a modern browser. The offline demo does not require an account, credentials, or a server.

## Core modules

| Module | Description |
| --- | --- |
| Orders | Review and process orders, with a demonstration dataset. |
| Products | Maintain a configurable product catalog, including SKU and packaging requirements. |
| Boxes | Manage available box formats and calculate packing proposals. |
| Warehouse | Aggregate quantities by product and zone to streamline picking. |
| Larry / AI workflows | An agent-driven assistance layer developed in the Evolus workspace for warehouse operations. |

## Approach

The packing calculation and warehouse quantities should remain deterministic and verifiable. AI is used for explanation, workflow orchestration, anomaly detection and operational assistance, not to silently alter the packing constraints.

The broader architecture is designed for integrations with Shopify and other commerce platforms. Its live connectivity and agent deployment depend on the individual environments and credentials.

## Repository contents

- `index.html` — self-contained offline demonstrator.
- `shopify-demo.html` — Shopify-oriented front-end demonstration.
- `docs/SHOPIFY.md` — integration approach, setup and limitations.
- `docs/EVOLUS.md` — Evolus/AMD architecture and export checklist.
- `docs/PROJECT_SCOPE.md` — scope, operating flow and validation notes.
- `.gitignore` — excludes sensitive and generated files.

## Current status

This repository contains the **retrievable demo sources and technical documentation**, not a verified export of the entire Evolus workspace or all historical development archives. The Evolus agents, knowledge base, workflows, and any separate backend must be exported and added when available.

The Shopify-enabled app is **not represented as production-installed or live-verified**. Features demonstrated using sample data must not be mistaken for processing of real orders.

## Safety and licensing

Use sample records only until the relevant shop owner has authorized integration. Keep API tokens, app secrets, credentials, customer data and local databases outside version control. The historical Delphi/OS1 code and any third-party proprietary material should not be published without authorization.
