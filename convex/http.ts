import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
const http = httpRouter();
http.route({
  path: "/webhooks/resend",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await boundedBody(request);
    if (body === null) return new Response("Too large", { status: 413 });
    const ok = await ctx.runAction(internal.webhooks.resend, {
      body,
      id: request.headers.get("svix-id") ?? "",
      timestamp: request.headers.get("svix-timestamp") ?? "",
      signature: request.headers.get("svix-signature") ?? "",
    });
    return new Response(ok ? "ok" : "Invalid signature", {
      status: ok ? 200 : 403,
    });
  }),
});
http.route({
  path: "/inquiry",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await boundedBody(request);
    if (body === null) return new Response("Too large", { status: 413 });
    const timestamp = request.headers.get("x-crm-timestamp") ?? "",
      signature = request.headers.get("x-crm-signature") ?? "",
      secret = process.env.CRM_CAPTURE_SECRET;
    if (
      !secret ||
      Math.abs(Date.now() - Number(timestamp)) > 300000 ||
      !/^\d{13}$/.test(timestamp) ||
      !/^[a-f0-9]{64}$/.test(signature)
    )
      return new Response("Unauthorized", { status: 403 });
    const encoder = new TextEncoder(),
      key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["verify"],
      );
    const bytes = Uint8Array.from(signature.match(/../g) ?? [], (x) =>
      parseInt(x, 16),
    );
    if (
      !(await crypto.subtle.verify(
        "HMAC",
        key,
        bytes,
        encoder.encode(`${timestamp}.${body}`),
      ))
    )
      return new Response("Unauthorized", { status: 403 });
    try {
      const input: unknown = JSON.parse(body);
      if (!input || typeof input !== "object")
        return new Response("Invalid", { status: 400 });
      const data = input as Record<string, unknown>;
      for (const field of [
        "key",
        "name",
        "email",
        "company",
        "projectType",
        "budget",
        "message",
      ])
        if (
          typeof data[field] !== "string" ||
          (data[field] as string).length > 12000
        )
          return new Response("Invalid", { status: 400 });
      await ctx.runMutation(internal.crm.captureInquiry, {
        key: data.key as string,
        name: data.name as string,
        email: data.email as string,
        company: data.company as string,
        projectType: data.projectType as string,
        budget: data.budget as string,
        message: data.message as string,
      });
      return Response.json({ ok: true });
    } catch {
      return new Response("Capture failed", { status: 503 });
    }
  }),
});
async function boundedBody(request: Request) {
  if (Number(request.headers.get("content-length")) > 1000000) return null;
  const reader = request.body?.getReader();
  if (!reader) return "";
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 1000000) {
        await reader.cancel();
        return null;
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const all = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    all.set(chunk, offset);
    offset += chunk.length;
  }
  return new TextDecoder().decode(all);
}
export default http;
