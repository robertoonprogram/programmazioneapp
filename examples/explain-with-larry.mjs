/**
 * Optional authenticated integration smoke test.
 * Configure EVOLUS_API_KEY, EVOLUS_APPLICATION_ID and EVOLUS_AGENT_ID
 * in environment variables before executing.
 *
 * Does not run in CI or the default npm demo.
 */
import {packOrder} from "../src/warehouse.mjs";
import {askLarry} from "../src/evolus-client.mjs";
import {orders, products, boxes} from "./sample-data.mjs";

const packingPlan = packOrder({order: orders[0], products, boxes});
try {
  const answer = await askLarry({packingPlan});
  console.log("Agent:", answer.model);
  console.log(answer.explanation);
} catch (error) {
  console.error("Larry integration unavailable:", error.message);
  process.exitCode = 1;
}
