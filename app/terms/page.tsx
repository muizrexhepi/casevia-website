import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading, Text } from "@/components/ui/typography";

export const metadata: Metadata = {
  title: "Terms of Service — Casevia",
  description:
    "Terms of Service for using the Casevia website and contacting Casevia about software design and development services.",
  alternates: {
    canonical: "/terms",
  },
};

const lastUpdated = "June 20, 2026";

export default function TermsPage() {
  return (
    <Section spacing="sm" className="pb-14 pt-10 sm:pb-20 sm:pt-14 lg:pt-16">
      <Container>
        <div className="mx-auto max-w-3xl">
          <Heading as="h1" variant="section">
            Terms of Service.
          </Heading>

          <Text variant="body" className="mt-4">
            Last updated: {lastUpdated}
          </Text>

          <div className="mt-10 space-y-10">
            <LegalSection title="1. Introduction">
              <p>
                These Terms of Service govern your use of the Casevia website
                and any communication with Casevia through the website.
              </p>

              <p>
                By using this website, submitting a contact form, or contacting
                Casevia, you agree to these Terms.
              </p>
            </LegalSection>

            <LegalSection title="2. About Casevia">
              <p>
                Casevia provides software design, development, strategy, and
                related digital product services. This may include websites, web
                apps, dashboards, e-commerce platforms, booking systems, AI
                features, automation, and related consulting.
              </p>
            </LegalSection>

            <LegalSection title="3. Website use">
              <p>You agree not to use this website to:</p>

              <ul>
                <li>Submit false, misleading, or unlawful information</li>
                <li>Attempt to interfere with the website or its security</li>
                <li>Send spam, malicious code, or automated abuse</li>
                <li>
                  Copy, scrape, or misuse website content without permission
                </li>
                <li>Violate any applicable law or third-party rights</li>
              </ul>
            </LegalSection>

            <LegalSection title="4. Project inquiries">
              <p>
                Submitting a contact form or project inquiry does not create a
                client relationship, contract, or obligation for Casevia to
                accept your project.
              </p>

              <p>
                Any project work, pricing, timelines, ownership rights, payment
                terms, deliverables, and support terms must be agreed separately
                in writing before work begins.
              </p>
            </LegalSection>

            <LegalSection title="5. Proposals and estimates">
              <p>
                Any estimate, timeline, or proposal shared before a signed
                agreement is non-binding unless clearly stated otherwise in a
                written contract.
              </p>

              <p>
                Project scope may change if requirements, content, integrations,
                feedback rounds, technical constraints, or business priorities
                change.
              </p>
            </LegalSection>

            <LegalSection title="6. Intellectual property">
              <p>
                All content on this website, including text, design, graphics,
                layouts, branding, and code examples, belongs to Casevia or its
                respective owners unless stated otherwise.
              </p>

              <p>
                You may not copy, reproduce, distribute, or create derivative
                works from this website without written permission.
              </p>
            </LegalSection>

            <LegalSection title="7. Portfolio and case studies">
              <p>
                Casevia may display selected work, case studies, logos,
                screenshots, and project descriptions on the website unless a
                separate written agreement restricts this.
              </p>

              <p>
                Third-party logos, names, and trademarks shown on this website
                belong to their respective owners.
              </p>
            </LegalSection>

            <LegalSection title="8. Third-party links">
              <p>
                The website may include links to third-party websites or
                services. Casevia is not responsible for the content, policies,
                security, or practices of third-party websites.
              </p>

              <p>
                Visiting third-party links is at your own discretion and risk.
              </p>
            </LegalSection>

            <LegalSection title="9. No guarantees">
              <p>
                The website and its content are provided for general
                informational purposes. Casevia makes reasonable efforts to keep
                the website accurate and available, but we do not guarantee that
                it will always be error-free, uninterrupted, or fully up to
                date.
              </p>

              <p>
                Casevia does not guarantee specific business results, revenue,
                rankings, conversions, traffic, or growth from using the website
                or from any general information shown on it.
              </p>
            </LegalSection>

            <LegalSection title="10. Limitation of liability">
              <p>
                To the maximum extent permitted by law, Casevia will not be
                liable for indirect, incidental, special, consequential, or
                punitive damages arising from your use of the website.
              </p>

              <p>
                This includes loss of data, loss of profits, business
                interruption, or damages related to website availability,
                third-party services, or reliance on website content.
              </p>
            </LegalSection>

            <LegalSection title="11. Privacy">
              <p>
                Your use of the website is also governed by our{" "}
                <a href="/privacy">Privacy Policy</a>, which explains how we
                collect and use information.
              </p>
            </LegalSection>

            <LegalSection title="12. Changes to these Terms">
              <p>
                We may update these Terms from time to time. When we do, we will
                update the “Last updated” date at the top of this page.
              </p>

              <p>
                Continued use of the website after changes means you accept the
                updated Terms.
              </p>
            </LegalSection>

            <LegalSection title="13. Contact">
              <p>For questions about these Terms, contact us at:</p>

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
