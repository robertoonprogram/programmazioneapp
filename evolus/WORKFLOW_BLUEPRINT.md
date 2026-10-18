# Evolus workflow blueprint — Larry

**Blueprint only.** The active workflow must be exported from the authorized Evolus environment; this document is not an actual Evolus-native import file.

## Trigger

An operator requests an explanation for an existing deterministic packing proposal or a scheduled warehouse summary is generated. The workflow receives the minimum sanitized data needed for analysis.

## Example input contract

\`\`\`json
{
  "batch_id": "DEMO-2026-10-18",
  "mode": "explain",
  "orders": [{"order_id":"DEMO-1001","item_count":4}],
  "packing_plan": {
    "order_id":"DEMO-1001",
    "parcels":[{"box_code":"V6","gross_weight_kg":3.2,"used_sixths":5}]
  },
  "warnings": []
}
\`\`\`

The values above are illustrative, not a real external call.

## Logical steps

1. Validate request schema and deduplicate by batch ID.
2. Receive the verified packing summary from LiberaPack.
3. Retrieve non-sensitive warehouse knowledge relevant to the result.
4. Ask Larry to explain the choice and identify possible anomalies.
5. Structure any suggestion as an operator-review item, not a silent database mutation.
6. Send the explanation and alerts to the LiberaPack user interface.
7. Record outcome, decision and errors with no private customer details.

## Expected output contract

\`\`\`json
{
  "batch_id": "DEMO-2026-10-18",
  "summary": "Explanation from the agent, subject to operator review",
  "alerts": [],
  "proposed_rules": [],
  "requires_review": false
}
\`\`\`

## Safety requirements

- Do not let the model invent quantities or override the deterministic packing calculator.
- Treat external order text, product names and knowledge documents as untrusted input.
- Scope tokens on the server/platform only; never pass them through a public browser.
- Review and approve proposed new packing constraints before using them.
- Retry safely without double-printing labels or double-processing orders.
- Confirm actual SDK/API names and runtime configuration in Evolus; do not assume this blueprint is compatible with its import format.
