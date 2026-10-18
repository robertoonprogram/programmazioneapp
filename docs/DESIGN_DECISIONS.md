# LiberaPack — retrospective product decisions

**Prepared:** 18 October 2026.

This is a **retrospective summary** of the project requirements discussed during development. It is not a claim that each choice was invented on this date, nor a legal proof of priority.

## Product direction

The LiberaPack prototype addresses warehouse preparation for online sales: too much manual processing, repeated picking operations, inconsistent box selection and fragmented product information.

The project was directed around three principal working sections: **Orders**, **Products**, and **Boxes**.

### Orders

- Collect and inspect orders before warehouse processing.
- Keep product quantities and parcel assignments auditable.
- Support a demonstration dataset independently of production stores.

### Products

- Record SKU, product name, classification and picking position.
- Assign a relative space measure starting with the **sixths of a box** model.
- Allow changes and deactivation of products, with invalid/unknown products blocked before packing.

### Boxes

- Maintain a configurable set of packaging formats.
- Select suitable box proposals deterministically, accounting for relative space and gross weight.
- Avoid claiming that a sixths-based calculation proves real physical 3D packability.

## Warehouse requirements

- Aggregate picking quantities across selected orders into one warehouse tour, grouped by area and SKU.
- Preserve separation between parcels of different orders/customers.
- Prepare future A4 picking sheets and parcel/label workflows.
- Keep operator review when a rule, box configuration or product measurement is unclear.

## AI responsibilities

- **Larry** is the named warehouse AI agent hosted in the Evolus ecosystem.
- The AI role is to explain, summarize, identify anomalies and propose operator-review actions.
- The numeric packaging core remains deterministic; AI must not invent packed quantities or silently rewrite approved packing rules.

## Integration strategy

- The demo should run without a live account or access credentials.
- Shopify is an optional real-commerce source and must be authenticated with the official server-side mechanism before production.
- Other e-commerce sources may be supported by normalizing their orders into the internal order contract.
- Evolus agent configuration and AMD model execution belong to a separately authorized workspace; evidence of live deployment is required before claiming verified operation.

## Scope and attribution

This file records **project direction and documented decisions**, not exclusive legal ownership of every underlying idea, software algorithm or implementation. The current codebase includes AI-assisted development, and prior vendor/OS1 material is not claimed as proprietary work of the repository maintainer.

For publicly verifiable dates and file identities, consult [PROVENANCE.md](PROVENANCE.md), [the snapshot manifest](INTEGRITY_2026-10-18.json) and [GitHub issue #1](https://github.com/robertoonprogram/programmazioneapp/issues/1).
