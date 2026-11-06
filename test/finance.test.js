import test from "node:test";
import assert from "node:assert/strict";
import { summarizeEntries } from "../src/finance.js";

test("summarizes receivables, payables, settlements and overdue values in cents", () => {
  const result = summarizeEntries([
    { type: "receivable", status: "pending", amountCents: 12000, dueOn: "2026-11-01" },
    { type: "payable", status: "paid", amountCents: 5000, dueOn: "2026-11-05" },
    { type: "payable", status: "void", amountCents: 3000, dueOn: "2026-10-01" }
  ], "2026-11-06");
  assert.deepEqual(result, {
    receivableCents: 12000, payableCents: 5000, receivedCents: 0, paidCents: 5000,
    receivableOpenCents: 12000, payableOpenCents: 0,
    receivableOverdueCents: 12000, payableOverdueCents: 0, openCount: 1
  });
});
test("rejects invalid currency values and impossible dates", () => {
  assert.throws(() => summarizeEntries([{ type: "payable", status: "pending", amountCents: 1.5, dueOn: "2026-01-01" }], "2026-02-01"), /amountCents/);
  assert.throws(() => summarizeEntries([], "yesterday"), /asOfDate/);
  assert.throws(() => summarizeEntries([{ type: "receivable", status: "pending", amountCents: 1, dueOn: "2026-02-30" }], "2026-03-01"), /valid YYYY-MM-DD/);
});
