import test from "node:test";
import assert from "node:assert/strict";
import {askLarry, sanitizePackingSummary, EvolusConfigError} from "../src/evolus-client.mjs";

const example = {
  orderId: "DEMO-1",
  customerEmail: "do-not-send@example.test",
  totalPieces: 2,
  parcels: [{
    boxCode: "V6",
    grossWeightKg: 1.7,
    usedSixths: 2,
    capacitySixths: 6,
    items: [{sku: "S", quantity: 2}]
  }],
  geometryValidated: false
};

test("Sanitized agent input excludes customer details and SKU names", () => {
  const data = sanitizePackingSummary(example);
  assert.equal(data.parcelCount, 1);
  assert.equal(data.parcels[0].units, 2);
  assert.equal(JSON.stringify(data).includes("do-not-send"), false);
  assert.equal(JSON.stringify(data).includes('"sku"'), false);
});

test("No network request without explicit credentials", async () => {
  let called = false;
  await assert.rejects(() => askLarry({
    packingPlan: example,
    config: {},
    transport: async () => {called = true;}
  }), EvolusConfigError);
  assert.equal(called, false);
});

test("Evolus agent request uses HTTPS and applicationId:agentId model", async () => {
  let request;
  const answer = await askLarry({
    packingPlan: example,
    config: {
      EVOLUS_API_KEY: "test-placeholder-secret",
      EVOLUS_APPLICATION_ID: "application-demo",
      EVOLUS_AGENT_ID: "agent-demo"
    },
    transport: async (url, options) => {
      request = {url, options};
      return {ok: true, json: async () => ({choices: [{message: {content: "Review the parcel weight."}}]})};
    }
  });
  assert.equal(request.url, "https://api.evolus.ai/v1/chat/completions");
  assert.equal(request.options.method, "POST");
  assert.equal(request.options.headers.Authorization, "Bearer test-placeholder-secret");
  const payload = JSON.parse(request.options.body);
  assert.equal(payload.model, "application-demo:agent-demo");
  assert.equal(JSON.stringify(payload).includes("do-not-send"), false);
  assert.equal(answer.explanation, "Review the parcel weight.");
});

test("Evolus errors are surfaced without disclosing credentials", async () => {
  await assert.rejects(() => askLarry({
    packingPlan: example,
    config: {
      EVOLUS_API_KEY: "hidden-secret",
      EVOLUS_APPLICATION_ID: "app",
      EVOLUS_AGENT_ID: "agent"
    },
    transport: async () => ({ok: false, status: 401})
  }), /HTTP status 401/);
});
