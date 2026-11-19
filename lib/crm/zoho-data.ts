/** Preserve Zoho's numeric 64-bit identifiers before JavaScript rounds them. */
export function parseZohoJson(text: string): unknown {
  return JSON.parse(
    text,
    (_key, value: unknown, context?: { source: string }) => {
      if (typeof value === "number" && !Number.isSafeInteger(value)) {
        if (!context?.source)
          throw new Error("Lossless JSON parsing requires Node 24");
        return context.source;
      }
      return value;
    },
  );
}
export function zohoPage(cursor?: string) {
  const start = Number(cursor ?? "1");
  return Number.isSafeInteger(start) && start >= 1 ? start : 1;
}
