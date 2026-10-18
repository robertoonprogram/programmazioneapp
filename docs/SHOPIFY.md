# Shopify integration and demonstration

The repository includes `shopify-demo.html`, a browser demonstration of a warehouse interface intended for Shopify merchants.

**Important:** the HTML file is not proof of an installed Shopify app. The original separate Shopify application ZIP, its production server, and its test suite have not yet been imported into this repository.

## Intended integration

- Orders are imported using authenticated Shopify Admin APIs, with unfulfilled quantities respected.
- Variants use SKU and configurable warehouse attributes (position, relative space, mass, active status).
- The system calculates consolidated picking by SKU and keeps individual customers' parcels separate.
- Planned outputs include A4 picking sheets, packing labels and compatible print formats.
- Shopify is one possible source: normalized orders from other online stores should use the same internal packing contract.

## Production implementation

Use a current Shopify CLI app scaffold and the official Shopify app backend/authentication library. Version controlled app-owned metafield definitions should be established before writing or reading configuration values; use the appropriate supported Shopify API version and verify permissions.

Do not put Shopify Admin API access tokens or client secrets in HTML or client-side JavaScript. Deploy an HTTPS application, use a development store for acceptance tests, confirm required scopes, and validate mutations against current Shopify documentation.

## Useful links

- [Shopify app development](https://shopify.dev/docs/apps)
- [Shopify CLI](https://shopify.dev/docs/api/shopify-cli)
- [Admin GraphQL API](https://shopify.dev/docs/api/admin-graphql)
- [Custom data](https://shopify.dev/docs/apps/build/custom-data)

## Next implementation artifact

Import the original application source package from a verified ZIP export. Only then can the Node/Shopify integration code and its existing tests be represented as part of this repository.
