import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading, Text } from "@/components/ui/typography";

export const metadata: Metadata = {
  title: "Privacy Policy — Casevia",
  description:
    "Privacy Policy for Casevia, including what information we collect, how we use it, and how to contact us.",
  alternates: {
    canonical: "/privacy",
  },
};

const lastUpdated = "June 20, 2026";

export default function PrivacyPage() {
  return (
    <Section spacing="sm" className="pb-14 pt-10 sm:pb-20 sm:pt-14 lg:pt-16">
      <Container>
        <div className="mx-auto max-w-3xl">
          <Heading as="h1" variant="section">
            Privacy Policy.
          </Heading>

          <Text variant="body" className="mt-4">
            Last updated: {lastUpdated}
          </Text>

          <div className="mt-10 space-y-10">
            <LegalSection title="1. Introduction">
              <p>
                Casevia operates the website casevia.io and provides software
                design, development, and strategy services. This Privacy Policy
                explains what information we collect, how we use it, and what
                choices you have.
              </p>

              <p>
                By using this website or submitting a contact form, you agree to
                the practices described in this Privacy Policy.
              </p>
            </LegalSection>

            <LegalSection title="2. Information we collect">
              <p>
                When you contact us through the website, we may collect the
                information you choose to provide, including:
              </p>

              <ul>
                <li>Your name</li>
                <li>Email address</li>
                <li>Company name</li>
                <li>Project type</li>
                <li>Budget range</li>
                <li>Project details or message content</li>
              </ul>

              <p>
                We may also receive basic technical information automatically,
                such as your IP address, browser type, device information,
                referring page, and general usage data.
              </p>
            </LegalSection>

            <LegalSection title="3. How we use your information">
              <p>We use the information we collect to:</p>

              <ul>
                <li>Respond to your project inquiry</li>
                <li>Understand your project goals and requirements</li>
                <li>Prepare scope, timelines, proposals, or next steps</li>
                <li>Communicate with you about services</li>
                <li>Improve the website and user experience</li>
                <li>Protect against spam, abuse, or unauthorized activity</li>
              </ul>

              <p>
                We do not sell your personal information to advertisers or data
                brokers.
              </p>
            </LegalSection>

            <LegalSection title="4. Contact form and email delivery">
              <p>
                When you submit the contact form, your message may be processed
                through third-party email infrastructure, including Resend, so
                that we can receive your inquiry and send you a confirmation
                email.
              </p>

              <p>
                Your information is used only for communication related to your
                inquiry, project discussion, or related business relationship.
              </p>
            </LegalSection>

            <LegalSection title="5. Service providers">
              <p>
                We may use trusted third-party providers to operate the website,
                host infrastructure, send emails, analyze website performance,
                or maintain security.
              </p>

              <p>
                These providers only receive the information necessary to
                perform their services and are expected to handle it securely.
              </p>
            </LegalSection>

            <LegalSection title="6. Cookies and analytics">
              <p>
                The website may use cookies or similar technologies to support
                basic functionality, improve performance, understand usage, or
                protect the site from abuse.
              </p>

              <p>
                You can control or disable cookies through your browser
                settings. Some parts of the website may not function properly if
                cookies are disabled.
              </p>
            </LegalSection>

            <LegalSection title="7. Data retention">
              <p>
                We keep inquiry and communication records for as long as needed
                to respond to you, manage potential or active projects, comply
                with legal obligations, resolve disputes, and maintain business
                records.
              </p>

              <p>
                You may request deletion of your personal information by
                contacting us, unless we are required to keep it for legitimate
                business or legal reasons.
              </p>
            </LegalSection>

            <LegalSection title="8. Your rights">
              <p>
                Depending on where you live, you may have rights to access,
                correct, delete, restrict, or object to the processing of your
                personal information.
              </p>

              <p>
                To make a request, contact us at{" "}
                <a href="mailto:hello@casevia.io">hello@casevia.io</a>. We may
                need to verify your identity before completing certain requests.
              </p>
            </LegalSection>

            <LegalSection title="9. Security">
              <p>
                We use reasonable technical and organizational measures to
                protect your information. However, no method of transmission or
                storage is completely secure, and we cannot guarantee absolute
                security.
              </p>
            </LegalSection>

            <LegalSection title="10. International users">
              <p>
                If you access the website from outside the country where we
                operate, your information may be processed in countries with
                different data protection laws.
              </p>

              <p>
                By using the website or submitting information, you understand
                that your information may be processed where our service
                providers operate.
              </p>
            </LegalSection>

            <LegalSection title="11. Changes to this Privacy Policy">
              <p>
                We may update this Privacy Policy from time to time. When we do,
                we will update the “Last updated” date at the top of this page.
              </p>
            </LegalSection>

            <LegalSection title="12. Contact">
              <p>
                For questions about this Privacy Policy or your personal
                information, contact us at:
              </p>

              <p>
                <strong>Casevia</strong>
                <br />
                Email: <a href="mailto:hello@casevia.io">hello@casevia.io</a>
                <br />
                Website: <a href="https://casevia.io">https://casevia.io</a>
              </p>
            </LegalSection>
          </div>
        </div>
      </Container>
    </Section>
  );
}

function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-border pt-8">
      <Heading as="h2" variant="subsection">
        {title}
      </Heading>

      <div className="mt-4 space-y-4 text-base leading-8 text-muted-foreground [&_a]:font-semibold [&_a]:text-primary [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-2">
        {children}
      </div>
    </section>
  );
}
