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
  links: string[];
  truncated: boolean;
};
export const sourceByteLimit = 2_000_000;
export function extractSource(
  url: string,
  html: string,
  truncated = false,
): FetchedSource {
  const decode = (value: string) =>
    value
      .replace(/&nbsp;|&#160;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&quot;|&#34;/gi, '"')
      .replace(/&#39;|&apos;/gi, "'")
      .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
        parseInt(code, 16) <= 0x10ffff
          ? String.fromCodePoint(parseInt(code, 16))
          : " ",
      )
      .replace(/&rsquo;|&lsquo;/gi, "’")
      .replace(/&ldquo;|&rdquo;/gi, '"')
      .replace(/&ndash;/gi, "–")
      .replace(/&mdash;/gi, "—")
      .replace(/&#(\d+);/g, (_, code) =>
        Number(code) <= 0x10ffff ? String.fromCodePoint(Number(code)) : " ",
      );
  // Discard executable/hidden content, including an unfinished script at the
  // bounded end of a large page. Truncation never proves a feature is absent.
  const visible = html
    .replace(/<(script|style|noscript)\b[^>]*>[\s\S]*?(?:<\/\1\s*>|$)/gi, " ")
    .replace(/<!--[\s\S]*?(?:-->|$)/g, " ");
  const text = decode(visible.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
  const mailto = [
    ...visible.matchAll(/href\s*=\s*["']mailto:([^"'?]+)[^"']*["']/gi),
  ].map((m) => decode(m[1]));
  const emails = [
    ...new Set(
      (text + " " + mailto.join(" "))
        .match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g)
        ?.map((e) => e.toLowerCase()) ?? [],
    ),
  ]
    .filter((e) => !/@(example\.(com|org)|sentry\.io)$/i.test(e))
    .slice(0, 8);
  const links: string[] = [];
  for (const match of visible.matchAll(
    /<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi,
  )) {
    if (
      !/contact|about|kontakt|ueber|über|rreth|контакт|за.нас/i.test(
        match[1] + " " + match[2],
      )
    )
      continue;
    try {
      const link = new URL(decode(match[1]), url),
        base = new URL(url);
      link.hash = "";
      if (
        link.protocol === "https:" &&
        link.hostname.replace(/^www\./, "") ===
          base.hostname.replace(/^www\./, "") &&
        !link.username &&
        !link.password &&
        link.href !== base.href &&
        !links.includes(link.href)
      )
        links.push(link.href);
    } catch {
      /* Ignore malformed and non-web links. */
    }
    if (links.length >= 4) break;
  }
  return {
    url,
    text: text.slice(0, 18000),
    title: decode(
      html
        .match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]
        ?.replace(/<[^>]*>/g, "")
        .trim() ?? new URL(url).hostname,
    ).slice(0, 200),
    verified: true,
    emails,
    links,
    truncated,
  };
}
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
      truncated: boolean;
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
            response.destroy();
            resolve({
              status,
              location: response.headers.location ?? "",
              contentType: "",
              html: "",
              truncated: false,
            });
            return;
          }
          const chunks: Buffer[] = [];
          let size = 0,
            finished = false;
          const finish = (truncated: boolean) => {
            if (finished) return;
            finished = true;
            resolve({
              status,
              location: "",
              contentType: response.headers["content-type"] ?? "",
              html: Buffer.concat(chunks).toString("utf8"),
              truncated,
            });
          };
          response.on("data", (chunk: Buffer) => {
            if (finished) return;
            const remaining = sourceByteLimit - size;
            chunks.push(chunk.subarray(0, remaining));
            size += Math.min(remaining, chunk.length);
            if (chunk.length > remaining) {
              finish(true);
              request.destroy();
            }
          });
          response.on("end", () => finish(false));
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
    return extractSource(url.href, result.html, result.truncated);
  }
  throw new Error("Too many source redirects");
}
