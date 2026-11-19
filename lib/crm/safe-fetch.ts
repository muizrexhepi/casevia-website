import { lookup } from "node:dns/promises";
import { request as httpsRequest } from "node:https";
import { isIP } from "node:net";
export function publicAddress(ip: string) {
  if (isIP(ip) === 4) {
    const p = ip.split(".").map(Number);
    return !(
      p[0] === 0 ||
      p[0] === 10 ||
      p[0] === 127 ||
      p[0] >= 224 ||
      (p[0] === 169 && p[1] === 254) ||
      (p[0] === 172 && p[1] >= 16 && p[1] <= 31) ||
      (p[0] === 192 && (p[1] === 168 || p[1] === 0)) ||
      (p[0] === 100 && p[1] >= 64 && p[1] <= 127) ||
      (p[0] === 198 && (p[1] === 18 || p[1] === 19))
    );
  }
  return (
    isIP(ip) === 6 &&
    /^2[0-9a-f]{3}:/i.test(ip) &&
    !ip.toLowerCase().startsWith("2001:db8:")
  );
}
export type FetchedSource = {
  url: string;
  text: string;
  title: string;
  verified: boolean;
  emails: string[];
};
export async function safeSource(raw: string): Promise<FetchedSource> {
  let url = new URL(raw);
  for (let redirect = 0; redirect < 4; redirect++) {
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      (url.port && url.port !== "443") ||
      isIP(url.hostname) ||
      !url.hostname.includes(".")
    )
      throw new Error("Source must be a public HTTPS website");
    const addresses = await lookup(url.hostname, { all: true });
    if (!addresses.length || addresses.some((a) => !publicAddress(a.address)))
      throw new Error("Private source address blocked");
    // Pin the TCP connection to the address just checked, preserving TLS hostname verification.
    const address = addresses.find((a) => a.family === 4) ?? addresses[0];
    const result = await new Promise<{
      status: number;
      location: string;
      contentType: string;
      html: string;
    }>((resolve, reject) => {
      const request = httpsRequest(
        {
          hostname: address.address,
          family: address.family,
          servername: url.hostname,
          port: 443,
          path: url.pathname + url.search,
          method: "GET",
          headers: {
            Host: url.host,
            "User-Agent":
              "MuizCRM/1.0 business research (+https://www.muizrexhepi.com)",
            Accept: "text/html,text/plain",
            "Accept-Encoding": "identity",
          },
          timeout: 12000,
        },
        (response) => {
          const status = response.statusCode ?? 500;
          if (status >= 300 && status < 400) {
            response.resume();
            resolve({
              status,
              location: response.headers.location ?? "",
              contentType: "",
              html: "",
            });
            return;
          }
          const chunks: Buffer[] = [];
          let size = 0;
          response.on("data", (chunk: Buffer) => {
            size += chunk.length;
            if (size > 200000) {
              request.destroy(new Error("Original source is too large"));
              return;
            }
            chunks.push(chunk);
          });
          response.on("end", () =>
            resolve({
              status,
              location: "",
              contentType: response.headers["content-type"] ?? "",
              html: Buffer.concat(chunks).toString("utf8"),
            }),
          );
          response.on("error", reject);
        },
      );
      request.on("timeout", () =>
        request.destroy(new Error("Original source timed out")),
      );
      request.on("error", reject);
      request.end();
    });
    if (result.status >= 300 && result.status < 400) {
      url = new URL(result.location, url);
      continue;
    }
    if (result.status < 200 || result.status >= 300)
      throw new Error(`Original source returned ${result.status}`);
    if (!/text\/(html|plain)/i.test(result.contentType))
      throw new Error("Source is not a text webpage");
    const html = result.html,
      title =
        html
          .match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]
          ?.replace(/<[^>]*>/g, "")
          .trim() ?? url.hostname,
      text = html
        .replace(/<(script|style|noscript)[\s\S]*?<\/\1>/gi, " ")
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;|&#160;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 18000);
    const emails = [
      ...new Set(
        (
          html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) ?? []
        ).map((e) => e.toLowerCase()),
      ),
    ]
      .filter((e) => !/@(example\.(com|org)|sentry\.io)$/i.test(e))
      .slice(0, 8);
    return {
      url: url.href,
      text,
      title: title.slice(0, 200),
      verified: true,
      emails,
    };
  }
  throw new Error("Too many source redirects");
}
