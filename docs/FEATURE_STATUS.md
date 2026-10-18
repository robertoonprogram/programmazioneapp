# Feature status — 18 October 2026

This file distinguishes code available in this repository from external systems and future features. All status statements below describe **repository evidence**, not assertions about the external Evolus workspace.

| Area | Included in GitHub | Scope / caveat |
| --- | --- | --- |
| Offline interactive UI | Yes: `index.html` | Browser-only demo, sample records |
| Shopify-styled UI | Yes: `shopify-demo.html` | Demo; real store integration unverified |
| Product information | Yes, in sample data and demos | SKU, category, zone, weight, relative space |
| Box formats | Yes, in sample data and demos | Capacity in sixths, tare and packaging mass |
| Order processing | Yes, in sample data and demos | Four synthetic sample orders |
| Deterministic pack assignment | Yes: `src/warehouse.mjs` | Best-fit decreasing heuristic, not 3D geometry |
| Aggregate picking | Yes: `buildPickingList()` | Combines quantities by SKU and zone |
| Unit and weight guards | Yes, tested | Default gross limit 25 kg per package |
| Automated tests | Yes, GitHub Actions | Functional tests on the reference engine |
| Larry AI chat | Server-side adapter included, mock-tested | Live credentials and authorized workspace still required |
| Evolus workflows and knowledge | Blueprint only | Export and verify active workflow |
| AMD open model runtime | Documentation only | Provide runtime evidence from workspace |
| Shopify Admin integration | Planned | Source ZIP and installation checks pending |
| ERP/OS1 integration | Not included | No unverified or proprietary source published |
| Bluetooth/direct thermal printing | Not integrated | Requires compatible printer bridge and tests |
| Physical geometry/stacking | Not in reference engine | Validate actual dimensions and constraints separately |

## Engineering principles

- Never claim a packing plan is 3D valid based only on sixths.
- Never silently accept AI-generated changes to packaging constraints.
- Never display fake live integration status.
- Never publish actual customer data or API secrets.
- Always reconcile picking quantities with order quantities.
