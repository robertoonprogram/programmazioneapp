/**
 * LiberaPack reference packing engine.
 *
 * This engine models relative "sixths of a box" capacity and parcel weight.
 * It does NOT validate 3D geometry, orientations, stacking or compartments.
 * It has no connection to OS1, Shopify or Evolus by itself.
 */

export class PackingError extends Error {
  constructor(message) {
    super(message);
    this.name = "PackingError";
  }
}

function fail(message) { throw new PackingError(message); }

function text(value, label) {
  if (typeof value !== "string" || !value.trim()) fail(label + " is required");
  return value.trim();
}

function number(value, label, {positive = false} = {}) {
  if (typeof value !== "number" || !Number.isFinite(value)) fail(label + " must be a finite number");
  if (positive ? value <= 0 : value < 0) fail(label + (positive ? " must be positive" : " must not be negative"));
  return value;
}

function int(value, label, min, max) {
  if (!Number.isInteger(value) || value < min || value > max) {
    fail(label + " must be an integer from " + min + " to " + max);
  }
  return value;
}

function productMap(products) {
  if (!Array.isArray(products) || !products.length) fail("Product catalog is required");
  const map = new Map();
  for (const p of products) {
    if (!p || typeof p !== "object") fail("Invalid product");
    const sku = text(p.sku, "Product SKU");
    if (map.has(sku)) fail("Duplicate product SKU: " + sku);
    map.set(sku, {
      sku,
      name: text(p.name, "Product name"),
      zone: text(p.zone || "Unassigned", "Picking zone"),
      category: typeof p.category === "string" ? p.category : "",
      sixths: int(p.sixths, sku + " space/sixths", 1, 6),
      weightKg: number(p.weightKg, sku + " unit weight (kg)"),
      active: p.active !== false
    });
  }
  return map;
}

function boxCatalog(boxes) {
  if (!Array.isArray(boxes) || !boxes.length) fail("At least one box type is required");
  const seen = new Set();
  const result = boxes.map((box) => {
    if (!box || typeof box !== "object") fail("Invalid box type");
    const code = text(box.code, "Box code");
    if (seen.has(code)) fail("Duplicate box code: " + code);
    seen.add(code);
    const capacitySixths = int(box.capacitySixths, code + " capacity", 1, 6);
    const tareKg = number(box.tareKg ?? 0, code + " tareKg");
    const materialKg = number(box.materialKg ?? 0, code + " materialKg");
    const maxGrossKg = number(box.maxGrossKg ?? 25, code + " maxGrossKg", {positive: true});
    if (maxGrossKg > 25) fail(code + " exceeds the 25 kg gross-weight safety limit");
    if (tareKg + materialKg >= maxGrossKg) fail(code + " is too heavy without products");
    return {code, capacitySixths, tareKg, materialKg, maxGrossKg};
  });
  return result.sort((a, b) =>
    a.capacitySixths - b.capacitySixths ||
    (a.tareKg + a.materialKg) - (b.tareKg + b.materialKg) ||
    a.code.localeCompare(b.code)
  );
}

function checkedOrder(order, products) {
  if (!order || typeof order !== "object") fail("Order is required");
  const id = text(order.id, "Order id");
  if (!Array.isArray(order.items) || !order.items.length) fail("Order " + id + " has no items");
  const counts = new Map();
  for (const line of order.items) {
    if (!line || typeof line !== "object") fail("Invalid order line in " + id);
    const sku = text(line.sku, "Order SKU");
    const quantity = int(line.quantity, sku + " quantity", 1, 5000);
    const product = products.get(sku);
    if (!product) fail("Unknown SKU in order " + id + ": " + sku);
    if (!product.active) fail("Inactive SKU in order " + id + ": " + sku);
    counts.set(sku, (counts.get(sku) || 0) + quantity);
  }
  const totalPieces = [...counts.values()].reduce((sum, qty) => sum + qty, 0);
  if (totalPieces > 5000) fail("Order " + id + " is too large for demo processing");
  return {id, counts, totalPieces};
}

const displayedWeight = (weight) => Math.round((weight + Number.EPSILON) * 1000) / 1000;

/**
 * Assign every product unit to a box using best-fit decreasing.
 * Returns a reproducible heuristic proposal, not a proven global optimum.
 */
export function packOrder({order, products, boxes}) {
  const productBySku = productMap(products);
  const availableBoxes = boxCatalog(boxes);
  const requested = checkedOrder(order, productBySku);
  const units = [];
  for (const [sku, qty] of requested.counts) {
    const product = productBySku.get(sku);
    for (let i = 0; i < qty; i++) units.push(product);
  }
  units.sort((a, b) =>
    b.sixths - a.sixths ||
    b.weightKg - a.weightKg ||
    a.sku.localeCompare(b.sku)
  );
  const parcels = [];
  for (const item of units) {
    let best = null;
    for (let i = 0; i < parcels.length; i++) {
      const parcel = parcels[i];
      const available = parcel.box.capacitySixths - parcel.usedSixths;
      const newGross = parcel.grossWeightKg + item.weightKg;
      if (available < item.sixths || newGross > parcel.box.maxGrossKg + 1e-9) continue;
      const remaining = available - item.sixths;
      if (!best || remaining < best.remaining) best = {parcel, remaining};
    }
    let parcel = best?.parcel;
    if (!parcel) {
      const box = availableBoxes.find((candidate) =>
        candidate.capacitySixths >= item.sixths &&
        candidate.tareKg + candidate.materialKg + item.weightKg <= candidate.maxGrossKg + 1e-9
      );
      if (!box) fail("No eligible box for SKU " + item.sku + " (size/weight limits)");
      parcel = {
        box,
        usedSixths: 0,
        productWeightKg: 0,
        grossWeightKg: box.tareKg + box.materialKg,
        counts: new Map()
      };
      parcels.push(parcel);
    }
    parcel.usedSixths += item.sixths;
    parcel.productWeightKg += item.weightKg;
    parcel.grossWeightKg += item.weightKg;
    parcel.counts.set(item.sku, (parcel.counts.get(item.sku) || 0) + 1);
  }
  const packaged = new Map();
  const result = parcels.map((parcel, i) => {
    const items = [...parcel.counts].sort(([a], [b]) => a.localeCompare(b))
      .map(([sku, quantity]) => {
        packaged.set(sku, (packaged.get(sku) || 0) + quantity);
        return {sku, quantity};
      });
    if (parcel.usedSixths > parcel.box.capacitySixths) fail("Capacity invariant violated");
    if (parcel.grossWeightKg > parcel.box.maxGrossKg + 1e-9) fail("Weight invariant violated");
    return {
      parcelId: requested.id + "-P" + String(i + 1).padStart(2, "0"),
      boxCode: parcel.box.code,
      capacitySixths: parcel.box.capacitySixths,
      usedSixths: parcel.usedSixths,
      tareKg: parcel.box.tareKg,
      materialKg: parcel.box.materialKg,
      productWeightKg: displayedWeight(parcel.productWeightKg),
      grossWeightKg: displayedWeight(parcel.grossWeightKg),
      maxGrossKg: parcel.box.maxGrossKg,
      items
    };
  });
  for (const [sku, quantity] of requested.counts) {
    if (packaged.get(sku) !== quantity) fail("Quantity invariant violated for " + sku);
  }
  return {
    orderId: requested.id,
    totalPieces: requested.totalPieces,
    parcelCount: result.length,
    parcels: result,
    algorithm: "best-fit-decreasing-sixths-v1",
    geometryValidated: false,
    liveIntegrationVerified: false
  };
}

/** One consolidated picking route across the selected orders. */
export function buildPickingList({orders, products}) {
  const catalog = productMap(products);
  if (!Array.isArray(orders) || !orders.length) fail("At least one order is required");
  const ids = new Set();
  const lines = new Map();
  let totalPieces = 0;
  for (const order of orders) {
    const checked = checkedOrder(order, catalog);
    if (ids.has(checked.id)) fail("Duplicate order id: " + checked.id);
    ids.add(checked.id);
    totalPieces += checked.totalPieces;
    for (const [sku, quantity] of checked.counts) {
      const product = catalog.get(sku);
      if (!lines.has(sku)) lines.set(sku, {sku, name: product.name, zone: product.zone, category: product.category, quantity: 0});
      lines.get(sku).quantity += quantity;
    }
  }
  const result = [...lines.values()].sort((a, b) =>
    a.zone.localeCompare(b.zone) ||
    a.category.localeCompare(b.category) ||
    a.sku.localeCompare(b.sku)
  );
  if (result.reduce((sum, line) => sum + line.quantity, 0) !== totalPieces) {
    fail("Picking quantity invariant violated");
  }
  return {orderCount: orders.length, totalPieces, lines: result};
}
