import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms & Conditions — AskFirst',
  description:
    'The terms and conditions governing your use of the AskFirst human-in-the-loop approval API and website.',
}

export default function TermsPage() {
  return (
    <>
      <nav>
        <Link href="/" className="logo-link">
          <img src="/logoaiskfirst.svg" alt="AskFirst Logo" className="logo-img" />
        </Link>
        <div className="nav-links">
          <Link href="/#how">How it works</Link>
          <Link href="/#integrations">Integrations</Link>
          <Link href="/#pricing">Pricing</Link>
        </div>
        <Link href="/#waitlist" className="nav-cta">Join waitlist</Link>
      </nav>

      <header className="legal-hero">
        <div className="legal-hero-grid" />
        <div className="legal-hero-glow" />
        <span className="legal-eyebrow">Legal</span>
        <h1>Terms &amp; Conditions</h1>
        <p className="legal-updated">Last updated: June 16, 2026</p>
      </header>

      <main className="legal-wrap">
        <aside className="toc">
          <div className="toc-title">On this page</div>
          <ol>
            <li><a href="#acceptance">Acceptance of terms</a></li>
            <li><a href="#definitions">Definitions</a></li>
            <li><a href="#service">The service</a></li>
            <li><a href="#eligibility">Eligibility &amp; accounts</a></li>
            <li><a href="#acceptable-use">Acceptable use</a></li>
            <li><a href="#responsibility">Your responsibility for agents</a></li>
            <li><a href="#api-keys">API keys &amp; security</a></li>
            <li><a href="#plans">Plans, fees &amp; billing</a></li>
            <li><a href="#availability">Availability &amp; changes</a></li>
            <li><a href="#ip">Intellectual property</a></li>
            <li><a href="#your-data">Your data</a></li>
            <li><a href="#third-party">Third-party services</a></li>
            <li><a href="#warranties">Disclaimer of warranties</a></li>
            <li><a href="#liability">Limitation of liability</a></li>
            <li><a href="#indemnity">Indemnification</a></li>
            <li><a href="#termination">Termination</a></li>
            <li><a href="#changes">Changes to these terms</a></li>
            <li><a href="#law">Governing law</a></li>
            <li><a href="#contact">Contact</a></li>
          </ol>
        </aside>

        <article className="legal-content">
          <p className="intro">
            These Terms &amp; Conditions (&quot;Terms&quot;) govern your access to and use of the
            AskFirst website at <code>aiskfirst.com</code>, the AskFirst API at{' '}
            <code>api.aiskfirst.com</code>, and all related services (together, the
            &quot;Service&quot;), operated by AskFirst (&quot;we&quot;, &quot;us&quot;, or
            &quot;our&quot;). Please read them carefully — by using the Service you agree to be
            bound by them.
          </p>

          <h2 id="acceptance"><span className="num">01</span> Acceptance of terms</h2>
          <p>
            By accessing the Service, joining the waitlist, creating an account, or making a request
            to our API, you confirm that you have read, understood, and agree to be bound by these
            Terms and by our <Link href="/privacy">Privacy Policy</Link>. If you are using the
            Service on behalf of an organization, you represent that you have authority to bind that
            organization, and &quot;you&quot; refers to that organization.
          </p>
          <p>If you do not agree with these Terms, you must not use the Service.</p>

          <h2 id="definitions"><span className="num">02</span> Definitions</h2>
          <ul>
            <li>
              <strong>&quot;Service&quot;</strong> means the AskFirst website, API, dashboards,
              notifications, and any associated software or documentation.
            </li>
            <li>
              <strong>&quot;Agent&quot;</strong> means any AI agent, automation, or software you
              operate that integrates with AskFirst.
            </li>
            <li>
              <strong>&quot;Approval Request&quot;</strong> means a request your Agent sends to
              AskFirst asking a human to approve or deny a proposed action.
            </li>
            <li>
              <strong>&quot;Approver&quot;</strong> means a person you designate to receive and
              respond to Approval Requests.
            </li>
            <li>
              <strong>&quot;Customer Data&quot;</strong> means the questions, context, metadata,
              decisions, and audit records you submit to or generate through the Service.
            </li>
          </ul>

          <h2 id="service"><span className="num">03</span> The service</h2>
          <p>
            AskFirst provides a human-in-the-loop approval layer for AI agents. When your Agent
            reaches a decision point, it sends an Approval Request to our API. We notify a
            designated Approver (by email, Slack, or webhook, depending on your plan), wait for a
            response or timeout, and return the decision to your Agent along with an audit record.
          </p>
          <p>
            AskFirst is a coordination and notification tool.{' '}
            <strong>
              It does not itself perform, review, or judge the underlying action your Agent
              proposes.
            </strong>{' '}
            The decision to approve or deny — and the quality of that decision — rests entirely with
            your Approvers.
          </p>

          <h2 id="eligibility"><span className="num">04</span> Eligibility &amp; accounts</h2>
          <p>
            You must be at least 18 years old (or the age of majority in your jurisdiction) and
            capable of forming a binding contract to use the Service. You are responsible for the
            accuracy of the information you provide, including the email addresses of your Approvers,
            and for keeping your account credentials confidential. You are responsible for all
            activity that occurs under your account.
          </p>

          <h2 id="acceptable-use"><span className="num">05</span> Acceptable use</h2>
          <p>You agree not to use the Service to:</p>
          <ul>
            <li>Violate any law, regulation, or third-party right;</li>
            <li>
              Send Approval Requests containing unlawful, harmful, deceptive, or infringing content;
            </li>
            <li>
              Attempt to gain unauthorized access to the Service, other accounts, or our
              infrastructure;
            </li>
            <li>
              Probe, scan, or test the vulnerability of the Service, or breach its security or
              authentication;
            </li>
            <li>
              Interfere with or disrupt the integrity or performance of the Service, including
              through excessive or abusive request volume;
            </li>
            <li>Reverse engineer, resell, or sublicense the Service except as expressly permitted;</li>
            <li>
              Use the Service to facilitate decisions where doing so would be illegal or where
              automated/human-assisted approval is prohibited by applicable law.
            </li>
          </ul>
          <p>
            We may suspend or terminate access for conduct that we reasonably believe violates these
            Terms or harms the Service, other users, or third parties.
          </p>

          <h2 id="responsibility">
            <span className="num">06</span> Your responsibility for agents and actions
          </h2>
          <div className="callout">
            <p>
              <strong>This is important.</strong> AskFirst pauses your Agent and relays a human
              decision. It does not control your Agent, execute the approved or denied action, or
              guarantee that any decision is correct, timely, or appropriate.
            </p>
            <p>
              You remain solely responsible for your Agents, the actions they take, the prompts and
              context you send, your choice of Approvers, your timeout and fallback behavior, and the
              consequences of any action taken or not taken — whether approved, denied, or
              unanswered.
            </p>
          </div>
          <p>
            You are responsible for configuring sensible fallback behavior for cases where an
            Approval Request times out, fails, or cannot be delivered. You should not rely on
            AskFirst as your only safeguard for irreversible or high-risk actions.
          </p>

          <h2 id="api-keys"><span className="num">07</span> API keys &amp; security</h2>
          <p>
            API keys are confidential and are issued to you for your use only. You are responsible
            for securing them and for all requests made with them. If you believe a key has been
            compromised, you must rotate it and notify us promptly. We may rate-limit, throttle, or
            revoke keys to protect the Service.
          </p>

          <h2 id="plans"><span className="num">08</span> Plans, fees &amp; billing</h2>
          <p>
            The Service is offered on free and paid plans as described on our{' '}
            <Link href="/#pricing">pricing page</Link>. Paid features are currently offered via
            waitlist and may change before general availability.
          </p>
          <ul>
            <li>
              <strong>Fees.</strong> Paid plans are billed in advance on a recurring (e.g., monthly)
              basis at the rates shown at sign-up. Usage-based limits (such as monthly approval
              volume) apply per plan.
            </li>
            <li>
              <strong>Trials &amp; promotions.</strong> Free trials and early-access offers (such as
              free months for early waitlist members) are provided at our discretion and may be
              modified or withdrawn.
            </li>
            <li>
              <strong>Payment.</strong> Payments are processed by a third-party payment provider. By
              providing payment details you authorize us and our provider to charge the applicable
              fees and taxes.
            </li>
            <li>
              <strong>Changes.</strong> We may change prices or plan features with reasonable
              notice. Changes take effect on your next billing cycle.
            </li>
            <li>
              <strong>Refunds.</strong> Except where required by law, fees are non-refundable. Paid
              plans are billed monthly and you may cancel at any time; cancellation stops future
              renewals but does not refund the current billing period or unused approvals.
            </li>
          </ul>

          <h2 id="availability"><span className="num">09</span> Availability &amp; changes</h2>
          <p>
            We work to keep the Service available and reliable, but we do not guarantee uninterrupted
            or error-free operation. The Service is provided during early access and may change, and
            we may add, modify, suspend, or discontinue features at any time. Unless a separate
            written service-level agreement applies, no uptime or response-time guarantee is made.
          </p>

          <h2 id="ip"><span className="num">10</span> Intellectual property</h2>
          <p>
            The Service, including its software, design, branding, and documentation, is owned by
            AskFirst and its licensors and is protected by intellectual-property laws. We grant you
            a limited, non-exclusive, non-transferable, revocable license to use the Service in
            accordance with these Terms. You may not use our trademarks without prior written
            permission. All rights not expressly granted are reserved.
          </p>

          <h2 id="your-data"><span className="num">11</span> Your data</h2>
          <p>
            You retain all rights to your Customer Data. You grant us a limited license to host,
            process, transmit, and display Customer Data solely to operate and improve the Service,
            and as described in our <Link href="/privacy">Privacy Policy</Link>. You are responsible
            for ensuring you have the right to send any data you submit, and for not including
            sensitive personal data in Approval Requests unless necessary and lawful.
          </p>

          <h2 id="third-party"><span className="num">12</span> Third-party services</h2>
          <p>
            The Service integrates with third-party tools and frameworks (for example, agent
            frameworks, email and messaging providers, and payment processors). We are not
            responsible for third-party services, and your use of them is governed by their own
            terms. Integrations may change or break as third parties update their products.
          </p>

          <h2 id="warranties"><span className="num">13</span> Disclaimer of warranties</h2>
          <p>
            To the maximum extent permitted by law, the Service is provided{' '}
            <strong>&quot;as is&quot; and &quot;as available&quot;</strong>, without warranties of
            any kind, whether express, implied, or statutory, including implied warranties of
            merchantability, fitness for a particular purpose, non-infringement, and any warranty
            that the Service will be uninterrupted, secure, error-free, or that any decision relayed
            through it will be correct or timely.
          </p>

          <h2 id="liability"><span className="num">14</span> Limitation of liability</h2>
          <p>
            To the maximum extent permitted by law, AskFirst and its officers, employees, and
            suppliers will not be liable for any indirect, incidental, special, consequential, or
            punitive damages, or for any loss of profits, revenue, data, or business, arising out of
            or related to your use of (or inability to use) the Service, or to any action taken or
            not taken by your Agent or Approvers — even if advised of the possibility of such
            damages.
          </p>
          <p>
            To the extent liability cannot be excluded, our total aggregate liability arising out of
            or relating to the Service will not exceed the greater of USD 100 or the total fees you
            paid to us in the three (3) months preceding the event giving rise to the claim.
          </p>

          <h2 id="indemnity"><span className="num">15</span> Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless AskFirst from any claims, damages, liabilities,
            and expenses (including reasonable legal fees) arising out of your use of the Service,
            your Customer Data, your Agents and the actions they take, or your violation of these
            Terms or applicable law.
          </p>

          <h2 id="termination"><span className="num">16</span> Termination</h2>
          <p>
            You may stop using the Service and close your account at any time. We may suspend or
            terminate your access if you breach these Terms, if required by law, or to protect the
            Service or other users. On termination, your right to use the Service ends. Sections that
            by their nature should survive termination (including ownership, disclaimers, limitation
            of liability, and indemnification) will survive.
          </p>

          <h2 id="changes"><span className="num">17</span> Changes to these terms</h2>
          <p>
            We may update these Terms from time to time. When we make material changes, we will
            update the &quot;Last updated&quot; date above and, where appropriate, notify you. Your
            continued use of the Service after changes take effect constitutes acceptance of the
            revised Terms.
          </p>

          <h2 id="law"><span className="num">18</span> Governing law &amp; disputes</h2>
          <p>
            These Terms are governed by the laws of Wyoming, without regard to conflict-of-law
            principles. You agree that any dispute arising out of or relating to these Terms or the
            Service will be subject to the exclusive jurisdiction of the courts located in TX, except
            where applicable law provides otherwise.
          </p>

          <h2 id="contact"><span className="num">19</span> Contact</h2>
          <p>
            Questions about these Terms? Reach us at{' '}
            <a href="mailto:legal@aiskfirst.com">legal@aiskfirst.com</a>.
          </p>
        </article>
      </main>

      <footer>
        <Link href="/" className="logo-link">
          <img src="/logoaiskfirst.svg" alt="AskFirst Logo" className="logo-img" />
        </Link>
        <div className="footer-links">
          <Link href="/terms">Terms &amp; Conditions</Link>
          <Link href="/privacy">Privacy Policy</Link>
        </div>
        <p>© 2025 AskFirst. Built for AI agent builders.</p>
      </footer>
    </>
  )
}
