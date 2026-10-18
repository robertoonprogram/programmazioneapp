/**
 * Optional server-side adapter for Larry (Evolus agent chat).
 * No credentials are embedded and no requests occur until the caller invokes askLarry().
 * Endpoint shape follows the event's documented OpenAI-compatible interface.
 */
export class EvolusConfigError extends Error {
  constructor(message) {
    super(message);
    this.name = "EvolusConfigError";
  }
}

function requireValue(value, name) {
  if (typeof value !== "string" || !value.trim()) {
    throw new EvolusConfigError("Missing required environment setting: " + name);
  }
  return value.trim();
}

export function sanitizePackingSummary(plan) {
  if (!plan || !Array.isArray(plan.parcels)) {
    throw new TypeError("A verified packing plan with parcels is required");
  }
  if (plan.parcels.length > 250) throw new TypeError("Too many parcels for a single agent request");
  const parcels = plan.parcels.map((p) => ({
    boxCode: typeof p.boxCode === "string" ? p.boxCode.slice(0, 48) : "unknown",
    grossWeightKg: Number.isFinite(p.grossWeightKg) ? p.grossWeightKg : null,
    usedSixths: Number.isInteger(p.usedSixths) ? p.usedSixths : null,
    capacitySixths: Number.isInteger(p.capacitySixths) ? p.capacitySixths : null,
    units: Array.isArray(p.items) ? p.items.reduce((total, line) => {
      return total + (Number.isInteger(line.quantity) && line.quantity >= 0 ? line.quantity : 0);
    }, 0) : null
  }));
  return {
    totalPieces: Number.isInteger(plan.totalPieces) ? plan.totalPieces : null,
    parcelCount: parcels.length,
    parcels,
    geometryValidated: plan.geometryValidated === true
  };
}

/**
 * @param {object} options
 * @param {object} options.packingPlan - Result of packOrder() or compatible verified summary.
 * @param {object} [options.config] - Environment variables; defaults to process.env.
 * @param {Function} [options.transport] - Fetch implementation, injectable for tests.
 * @returns {Promise<{explanation:string,provider:string,model:string}>}
 */
export async function askLarry({packingPlan, config = process.env, transport = fetch}) {
  const apiKey = requireValue(config.EVOLUS_API_KEY, "EVOLUS_API_KEY");
  const applicationId = requireValue(config.EVOLUS_APPLICATION_ID, "EVOLUS_APPLICATION_ID");
  const agentId = requireValue(config.EVOLUS_AGENT_ID, "EVOLUS_AGENT_ID");
  const base = config.EVOLUS_BASE_URL || "https://api.evolus.ai/v1";
  const url = new URL((base.endsWith("/") ? base : base + "/") + "chat/completions");
  if (url.protocol !== "https:") throw new EvolusConfigError("Evolus endpoint must use HTTPS");
  const model = applicationId + ":" + agentId;
  const summary = sanitizePackingSummary(packingPlan);
  const body = {
    model,
    temperature: 0.1,
    messages: [
      {
        role: "system",
        content: "You are Larry, a warehouse assistant. Explain only the supplied packing result, clearly label uncertainties, and flag anomalies. Never invent quantities, claim geometry has been proven, or change packing rules. Leave final decisions to the human operator."
      },
      {
        role: "user",
        content: "Explain this verified numerical packing summary, with concise practical advice. It excludes personal customer data: " + JSON.stringify(summary)
      }
    ]
  };
  const response = await transport(url.toString(), {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + apiKey,
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(20_000)
  });
  if (!response?.ok) {
    throw new Error("Evolus request failed with HTTP status " + String(response?.status ?? "unknown"));
  }
  const result = await response.json();
  const explanation = result?.choices?.[0]?.message?.content;
  if (typeof explanation !== "string" || !explanation.trim()) {
    throw new Error("Evolus returned no usable agent explanation");
  }
  return {provider: "Evolus", model, explanation: explanation.trim()};
}
