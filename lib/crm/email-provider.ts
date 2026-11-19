import { Resend } from "resend";
export type SendRequest = {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  text: string;
  idempotencyKey: string;
};
export interface EmailProvider {
  send(input: SendRequest): Promise<{ id: string }>;
}
export class ResendProvider implements EmailProvider {
  constructor(private readonly key: string) {}
  async send(input: SendRequest) {
    const { data, error } = await new Resend(this.key).emails.send(
      {
        from: input.from,
        to: input.to,
        replyTo: input.replyTo,
        subject: input.subject,
        text: input.text,
      },
      { idempotencyKey: input.idempotencyKey },
    );
    if (error || !data?.id)
      throw new Error(`Provider rejected send: ${error?.name ?? "no-id"}`);
    return { id: data.id };
  }
}
/** A selected prospecting service must implement this idempotent HTTPS gateway contract. */
export class ProspectingProvider implements EmailProvider {
  constructor(
    private readonly endpoint: string,
    private readonly token: string,
  ) {}
  async send(input: SendRequest) {
    const url = new URL(this.endpoint);
    if (url.protocol !== "https:")
      throw new Error("Prospecting endpoint requires HTTPS");
    const response = await fetch(url, {
      method: "POST",
      redirect: "error",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
        "Idempotency-Key": input.idempotencyKey,
      },
      body: JSON.stringify(input),
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok)
      throw new Error(`Prospecting provider HTTP ${response.status}`);
    const data: unknown = await response.json();
    if (
      !data ||
      typeof data !== "object" ||
      !("id" in data) ||
      typeof data.id !== "string"
    )
      throw new Error("Provider did not return a message ID");
    return { id: data.id };
  }
}
