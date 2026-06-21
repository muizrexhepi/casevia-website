import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

const BRAND_BLUE = "#2563EB";
const ICON_URL = "https://casevia.io/icon.png";
const SITE_URL = "https://casevia.io";

export async function POST(request: Request) {
    try {
        const { name, email, company, projectType, budget, message } =
            await request.json();

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 },
            );
        }

        await Promise.all([
            resend.emails.send({
                from: "Casevia <hello@muizrexhepi.com>",
                to: email,
                subject: "Thanks for reaching out — Casevia",
                html: confirmationEmail(name),
            }),
            resend.emails.send({
                from: "Casevia <hello@muizrexhepi.com>",
                to: "007lazi@gmail.com",
                replyTo: email,
                subject: `New inquiry from ${name}${company ? ` (${company})` : ""}`,
                html: notificationEmail({ name, email, company, projectType, budget, message }),
            }),
        ]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Contact form error:", error);
        return NextResponse.json(
            { error: "Failed to send message" },
            { status: 500 },
        );
    }
}

function emailShell(content: string) {
    return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #F1F3F6; padding: 48px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Inter', Helvetica, Arial, sans-serif;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background-color: #ffffff; border-radius: 20px; border: 1px solid #E5E7EB; overflow: hidden;">
          <tr>
            <td style="padding: 40px 40px 0 40px;">
              <img src="${ICON_URL}" alt="Casevia" width="36" height="36" style="border-radius: 8px; display: block;" />
            </td>
          </tr>
          <tr>
            <td style="padding: 28px 40px 40px 40px;">
              ${content}
            </td>
          </tr>
        </table>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; margin-top: 24px;">
          <tr>
            <td align="center" style="padding: 0 24px;">
              <p style="font-family: 'Manrope', -apple-system, sans-serif; font-size: 13px; font-weight: 600; color: #0F1115; margin: 0 0 6px;">
                Casevia
              </p>
              <p style="font-size: 12px; line-height: 1.7; color: #9CA3AF; margin: 0 0 14px;">
                Tetovo, North Macedonia
              </p>
              <p style="font-size: 12px; color: #9CA3AF; margin: 0;">
                <a href="${SITE_URL}" style="color: #9CA3AF; text-decoration: none;">casevia.io</a>
                <span style="color: #D1D5DB; padding: 0 8px;">·</span>
                <a href="${SITE_URL}/privacy" style="color: #9CA3AF; text-decoration: none;">Privacy Policy</a>
                <span style="color: #D1D5DB; padding: 0 8px;">·</span>
                <a href="${SITE_URL}/terms" style="color: #9CA3AF; text-decoration: none;">Terms of Service</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  `;
}

function confirmationEmail(name: string) {
    const firstName = name.split(" ")[0];

    const content = `
    <h1 style="font-family: 'Manrope', -apple-system, sans-serif; font-size: 22px; font-weight: 700; color: #0F1115; margin: 0 0 18px; letter-spacing: -0.02em;">
      Thanks for reaching out, ${firstName}
    </h1>

    <p style="font-size: 15px; line-height: 1.7; color: #4B5563; margin: 0 0 16px;">
      We've received your message and our team is reviewing the details now. You can expect a reply within 24 hours, along with clear next steps for your project.
    </p>

    <p style="font-size: 15px; line-height: 1.7; color: #4B5563; margin: 0 0 32px;">
      In the meantime, feel free to look through some recent work.
    </p>

    <table role="presentation" cellpadding="0" cellspacing="0">
      <tr>
        <td style="border-radius: 999px; background-color: ${BRAND_BLUE};">
          <a href="${SITE_URL}/work" style="display: inline-block; padding: 13px 26px; font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none;">
            View our work
          </a>
        </td>
      </tr>
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top: 36px; padding-top: 24px; border-top: 1px solid #F1F3F6;">
      <tr>
        <td>
          <p style="font-size: 14px; line-height: 1.6; color: #0F1115; margin: 0;">
            Best,<br />
            <strong>The Casevia Team</strong>
          </p>
        </td>
      </tr>
    </table>
  `;

    return emailShell(content);
}

function notificationEmail({
    name,
    email,
    company,
    projectType,
    budget,
    message,
}: {
    name: string;
    email: string;
    company?: string;
    projectType?: string;
    budget?: string;
    message: string;
}) {
    const row = (label: string, value?: string) =>
        value
            ? `<tr>
          <td style="padding: 9px 0; color: #9CA3AF; font-size: 13px; width: 110px; vertical-align: top;">${label}</td>
          <td style="padding: 9px 0; color: #0F1115; font-size: 14px; font-weight: 500;">${value}</td>
        </tr>`
            : "";

    const content = `
    <h1 style="font-family: 'Manrope', -apple-system, sans-serif; font-size: 20px; font-weight: 700; color: #0F1115; margin: 0 0 20px; letter-spacing: -0.02em;">
      New project inquiry
    </h1>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8FAFC; border: 1px solid #E5E7EB; border-radius: 14px;">
      <tr><td colspan="2" style="height: 4px;"></td></tr>
      ${row("Name", name)}
      ${row("Email", `<a href="mailto:${email}" style="color: ${BRAND_BLUE}; text-decoration: none;">${email}</a>`)}
      ${row("Company", company)}
      ${row("Project type", projectType)}
      ${row("Budget", budget)}
      <tr><td colspan="2" style="height: 4px;"></td></tr>
    </table>
    <style>td:first-child { padding-left: 20px; } td:last-child { padding-right: 20px; }</style>

    <p style="font-size: 13px; color: #9CA3AF; margin: 24px 0 8px;">Message</p>
    <p style="font-size: 15px; line-height: 1.7; color: #0F1115; white-space: pre-wrap; margin: 0 0 32px;">${message}</p>

    <table role="presentation" cellpadding="0" cellspacing="0">
      <tr>
        <td style="border-radius: 999px; background-color: ${BRAND_BLUE};">
          <a href="mailto:${email}" style="display: inline-block; padding: 12px 24px; font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none;">
            Reply to ${name.split(" ")[0]}
          </a>
        </td>
      </tr>
    </table>
  `;

    return emailShell(content);
}