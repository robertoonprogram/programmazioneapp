// Synthetic demo records. No production customer or store data.
export const products = [
  {sku: "PESTO180", name: "Pesto 180 g", category: "Conserve", zone: "A1", sixths: 1, weightKg: 0.42, active: true},
  {sku: "OLIVES300", name: "Olive 300 g", category: "Conserve", zone: "A2", sixths: 1, weightKg: 0.6, active: true},
  {sku: "PASTA500", name: "Pasta 500 g", category: "Pasta", zone: "B1", sixths: 2, weightKg: 0.52, active: true},
  {sku: "OIL500", name: "Olio 500 ml", category: "Olio", zone: "C1", sixths: 3, weightKg: 1.05, active: true},
  {sku: "WINE750", name: "Vino 750 ml", category: "Vino", zone: "D1", sixths: 3, weightKg: 1.4, active: true}
];

export const boxes = [
  {code: "V3", capacitySixths: 3, tareKg: 0.16, materialKg: 0.04, maxGrossKg: 25},
  {code: "V6", capacitySixths: 6, tareKg: 0.26, materialKg: 0.08, maxGrossKg: 25}
];

export const orders = [
  {id: "DEMO-1001", items: [{sku: "PESTO180", quantity: 2}, {sku: "PASTA500", quantity: 2}]},
  {id: "DEMO-1002", items: [{sku: "OIL500", quantity: 1}, {sku: "OLIVES300", quantity: 2}]},
  {id: "DEMO-1003", items: [{sku: "PASTA500", quantity: 2}, {sku: "WINE750", quantity: 1}, {sku: "PESTO180", quantity: 1}]},
  {id: "DEMO-1004", items: [{sku: "OIL500", quantity: 3}, {sku: "WINE750", quantity: 1}, {sku: "PESTO180", quantity: 4}]}
];
