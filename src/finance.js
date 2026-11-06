const validStatuses = new Set(["pending", "partial", "paid", "void"]);
function assertEntry(entry, index) {
  if (!entry || !["receivable", "payable"].includes(entry.type)) throw new TypeError(`entries[${index}].type is invalid`);
  if (!validStatuses.has(entry.status)) throw new TypeError(`entries[${index}].status is invalid`);
  if (!Number.isSafeInteger(entry.amountCents) || entry.amountCents <= 0) throw new TypeError(`entries[${index}].amountCents must be a positive safe integer`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.dueOn) || Number.isNaN(Date.parse(entry.dueOn))) throw new TypeError(`entries[${index}].dueOn must use YYYY-MM-DD`);
}
export function summarizeEntries(entries, asOfDate) {
  if (!Array.isArray(entries)) throw new TypeError("entries must be an array");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(asOfDate) || Number.isNaN(Date.parse(asOfDate))) throw new TypeError("asOfDate must use YYYY-MM-DD");
  const summary = { receivableCents: 0, payableCents: 0, paidCents: 0, overdueCents: 0, openCount: 0 };
  entries.forEach((entry, index) => {
    assertEntry(entry, index);
    if (entry.status === "void") return;
    if (entry.type === "receivable") summary.receivableCents += entry.amountCents;
    else summary.payableCents += entry.amountCents;
    if (entry.status === "paid") summary.paidCents += entry.amountCents;
    else {
      summary.openCount += 1;
      if (entry.dueOn < asOfDate) summary.overdueCents += entry.amountCents;
    }
  });
  for (const [key, value] of Object.entries(summary)) {
    if (!Number.isSafeInteger(value)) throw new RangeError(`${key} exceeds safe integer range`);
  }
  return summary;
}
