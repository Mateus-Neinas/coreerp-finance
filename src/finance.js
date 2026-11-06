const validStatuses = new Set(["pending", "paid", "void"]);
function isIsoDate(value) {
  if (typeof value !== "string" || !/^\\d{4}-\\d{2}-\\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}
function assertEntry(entry, index) {
  if (!entry || !["receivable", "payable"].includes(entry.type)) throw new TypeError(`entries[${index}].type is invalid`);
  if (!validStatuses.has(entry.status)) throw new TypeError(`entries[${index}].status is invalid`);
  if (!Number.isSafeInteger(entry.amountCents) || entry.amountCents <= 0) throw new TypeError(`entries[${index}].amountCents must be a positive safe integer`);
  if (!isIsoDate(entry.dueOn)) throw new TypeError(`entries[${index}].dueOn must be a valid YYYY-MM-DD date`);
}
export function summarizeEntries(entries, asOfDate) {
  if (!Array.isArray(entries)) throw new TypeError("entries must be an array");
  if (!isIsoDate(asOfDate)) throw new TypeError("asOfDate must be a valid YYYY-MM-DD date");
  const summary = {
    receivableCents: 0, payableCents: 0, receivedCents: 0, paidCents: 0,
    receivableOpenCents: 0, payableOpenCents: 0,
    receivableOverdueCents: 0, payableOverdueCents: 0, openCount: 0
  };
  entries.forEach((entry, index) => {
    assertEntry(entry, index);
    if (entry.status === "void") return;
    if (entry.type === "receivable") {
      summary.receivableCents += entry.amountCents;
      if (entry.status === "paid") summary.receivedCents += entry.amountCents;
      else {
        summary.receivableOpenCents += entry.amountCents;
        if (entry.dueOn < asOfDate) summary.receivableOverdueCents += entry.amountCents;
        summary.openCount += 1;
      }
    } else {
      summary.payableCents += entry.amountCents;
      if (entry.status === "paid") summary.paidCents += entry.amountCents;
      else {
        summary.payableOpenCents += entry.amountCents;
        if (entry.dueOn < asOfDate) summary.payableOverdueCents += entry.amountCents;
        summary.openCount += 1;
      }
    }
  });
  for (const [key, value] of Object.entries(summary)) {
    if (!Number.isSafeInteger(value)) throw new RangeError(`${key} exceeds safe integer range`);
  }
  return summary;
}
