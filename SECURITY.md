# Security policy

The project includes demonstration software. **Do not use it for production orders without a full security review.**

## Sensitive information

- Never commit API keys, access tokens, shop passwords, Shopify client secrets, database dumps, or customer records.
- Use development stores and synthetic orders while evaluating the integration.
- Keep Shopify authentication and Evolus/AMD credentials on a server or in the platform's secret manager, never in the browser bundle.
- Use HTTPS, verify request signatures/session tokens for commerce integrations, and apply authorization to all write operations.
- Keep deterministic packing rules under operator review; the AI agent must not modify them or finalize physical packing decisions without validation.
- Proprietary source code or internal rules supplied by a third party require separate permission before publication.

## Demo boundaries

The two standalone HTML demos contain only sample data and are not a secure commerce backend. Any endpoints described in the documentation must be treated as planned until implemented and tested.

For security concerns, contact the repository owner privately rather than opening a public issue containing secret material.
