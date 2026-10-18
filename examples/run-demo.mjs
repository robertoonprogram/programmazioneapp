import {packOrder, buildPickingList} from "../src/warehouse.mjs";
import {products, boxes, orders} from "./sample-data.mjs";

const picking = buildPickingList({orders, products});
const packing = orders.map((order) => packOrder({order, products, boxes}));

console.log(JSON.stringify({
  environment: "sample-data-only",
  picking,
  packing,
  note: "Relative sixths-based packing. Not a 3D geometric validation, not a live Shopify/Evolus integration."
}, null, 2));
