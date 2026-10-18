import test from "node:test";
import assert from "node:assert/strict";
import {PackingError, packOrder, buildPickingList} from "../src/warehouse.mjs";
import {products, boxes, orders} from "../examples/sample-data.mjs";

test("Every ordered item is assigned to exactly one parcel for its order", () => {
  for (const order of orders) {
    const result = packOrder({order, products, boxes});
    assert.equal(result.orderId, order.id);
    const packed = new Map();
    for (const parcel of result.parcels) {
      assert.ok(parcel.usedSixths <= parcel.capacitySixths);
      assert.ok(parcel.grossWeightKg <= 25);
      for (const line of parcel.items) {
        packed.set(line.sku, (packed.get(line.sku) || 0) + line.quantity);
      }
    }
    for (const line of order.items) assert.equal(packed.get(line.sku), line.quantity);
    assert.equal(result.geometryValidated, false);
  }
});

test("Same input produces same deterministic plan", () => {
  const input = {order: orders[2], products, boxes};
  assert.deepEqual(packOrder(input), packOrder(input));
});

test("Choosing the smallest eligible box for a single unit", () => {
  const result = packOrder({
    order: {id: "ONE", items: [{sku: "PESTO180", quantity: 1}]},
    products, boxes
  });
  assert.equal(result.parcels[0].boxCode, "V3");
});

test("Picking consolidates repeated SKU quantities by zone", () => {
  const list = buildPickingList({orders, products});
  const expected = orders.flatMap(o => o.items).reduce((s, x) => s + x.quantity, 0);
  assert.equal(list.totalPieces, expected);
  assert.equal(list.orderCount, orders.length);
  assert.equal(list.lines.find(l => l.sku === "PESTO180").quantity, 7);
  assert.deepEqual(list.lines.map(l => l.zone), [...list.lines.map(l => l.zone)].sort());
});

test("Reject unknown and inactive products before assignment", () => {
  assert.throws(() => packOrder({
    order: {id: "BAD", items: [{sku: "UNKNOWN", quantity: 1}]}, products, boxes
  }), PackingError);
  assert.throws(() => packOrder({
    order: {id: "BAD", items: [{sku: "PESTO180", quantity: 1}]},
    products: products.map(p => p.sku === "PESTO180" ? {...p, active: false} : p),
    boxes
  }), /Inactive SKU/);
});

test("25 kg gross parcel limit includes packaging mass", () => {
  const heavy = [{sku: "H", name: "Heavy", sixths: 1, weightKg: 24.9, zone: "A"}];
  const singleBox = [{code: "B", capacitySixths: 6, tareKg: 0.2, materialKg: 0.1}];
  assert.throws(() => packOrder({
    order: {id: "OVER", items: [{sku: "H", quantity: 1}]},
    products: heavy, boxes: singleBox
  }), /No eligible box/);
});

test("Reject box formats larger than the weight safety limit", () => {
  assert.throws(() => packOrder({
    order: orders[0], products,
    boxes: [{code: "UNSAFE", capacitySixths: 6, maxGrossKg: 35, tareKg: 0.2}]
  }), /25 kg/);
});

test("Reject missing capacity, impossible fit and non-positive quantities", () => {
  assert.throws(() => packOrder({
    order: {id: "BAD", items: [{sku: "PESTO180", quantity: 0}]},
    products, boxes
  }), /quantity/);
  assert.throws(() => packOrder({
    order: {id: "BAD", items: [{sku: "OIL500", quantity: 1}]},
    products, boxes: [{code: "TINY", capacitySixths: 2, tareKg: 0.1}]
  }), /No eligible box/);
});

test("Reject duplicate orders in a consolidated picking batch", () => {
  assert.throws(() => buildPickingList({
    orders: [orders[0], orders[0]], products
  }), /Duplicate order/);
});
