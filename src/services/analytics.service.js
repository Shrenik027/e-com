const Order = require("../models/Order.model");

async function generateMarketBasketAnalysis(
  minSupport = 0.1,
  minConfidence = 0.3,
) {
  const orders = await Order.find({ paymentStatus: "paid" });

  if (orders.length === 0) return [];

  // Convert orders to transactions
  const transactions = orders.map((order) =>
    order.items.map((item) => item.name),
  );

  const totalTransactions = transactions.length;

  const itemCounts = {};
  const pairCounts = {};

  // Count single items and pairs
  transactions.forEach((transaction) => {
    const uniqueItems = [...new Set(transaction)];

    uniqueItems.forEach((item) => {
      itemCounts[item] = (itemCounts[item] || 0) + 1;
    });

    for (let i = 0; i < uniqueItems.length; i++) {
      for (let j = i + 1; j < uniqueItems.length; j++) {
        const pair = [uniqueItems[i], uniqueItems[j]].sort().join("||");
        pairCounts[pair] = (pairCounts[pair] || 0) + 1;
      }
    }
  });

  const rules = [];

  Object.keys(pairCounts).forEach((pair) => {
    const [itemA, itemB] = pair.split("||");

    const support = pairCounts[pair] / totalTransactions;

    if (support >= minSupport) {
      const confidenceAtoB = pairCounts[pair] / itemCounts[itemA];
      const confidenceBtoA = pairCounts[pair] / itemCounts[itemB];

      if (confidenceAtoB >= minConfidence) {
        rules.push({
          from: itemA,
          to: itemB,
          support: support.toFixed(2),
          confidence: confidenceAtoB.toFixed(2),
        });
      }

      if (confidenceBtoA >= minConfidence) {
        rules.push({
          from: itemB,
          to: itemA,
          support: support.toFixed(2),
          confidence: confidenceBtoA.toFixed(2),
        });
      }
    }
  });

  return rules.sort((a, b) => b.confidence - a.confidence);
}

module.exports = { generateMarketBasketAnalysis };
