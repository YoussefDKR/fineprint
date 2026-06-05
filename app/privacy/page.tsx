import type { Metadata } from 'next';
import { LegalDocument, LegalSection } from '@/components/LegalDocument';

export const metadata: Metadata = {
  title: 'Privacy Policy — Fineprint',
  description: 'How Fineprint collects, uses, and protects your data.',
};

export default function PrivacyPage() {
  return (
    <LegalDocument title="Privacy Policy" lastUpdated="June 5, 2026">
      <LegalSection heading="Overview">
        <p>
          Fineprint (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) helps freelancers
          understand contract PDFs using AI-powered analysis. This Privacy Policy
          explains what information we collect, how we use it, and the choices you
          have.
        </p>
      </LegalSection>

      <LegalSection heading="Information we collect">
        <p>
          <strong className="text-gray-900">Account information.</strong> When you
          create an account, we collect your email address, display name, and
          optional profile photo.
        </p>
        <p>
          <strong className="text-gray-900">Contract files.</strong> PDFs you upload
          for analysis are stored so you can view your review history. We extract
          text from these files to generate summaries and risk scores.
        </p>
        <p>
          <strong className="text-gray-900">Usage data.</strong> We may collect
          basic technical information such as browser type, device information,
          and pages visited to keep the service secure and reliable.
        </p>
      </LegalSection>

      <LegalSection heading="How we use your information">
        <p>We use your information to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Provide contract analysis, summaries, and negotiation emails</li>
          <li>Maintain your account and review history</li>
          <li>Send account-related emails (e.g. sign-in, email confirmation)</li>
          <li>Improve and protect the service</li>
        </ul>
        <p>
          We do not sell your personal information. We do not use your contracts
          to train AI models.
        </p>
      </LegalSection>

      <LegalSection heading="Third-party services">
        <p>We rely on trusted providers to operate Fineprint:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-gray-900">Supabase</strong> — authentication,
            database, and file storage
          </li>
          <li>
            <strong className="text-gray-900">Anthropic</strong> — AI analysis of
            contract text you submit
          </li>
          <li>
            <strong className="text-gray-900">Vercel</strong> — hosting and
            delivery of the application
          </li>
        </ul>
        <p>
          These providers process data on our behalf under their own privacy and
          security terms.
        </p>
      </LegalSection>

      <LegalSection heading="Data retention">
        <p>
          We keep your account data and uploaded contracts for as long as your
          account is active. You may delete individual reviews from your dashboard
          or contact us to request deletion of your account and associated data.
        </p>
      </LegalSection>

      <LegalSection heading="Security">
        <p>
          We use industry-standard measures including encrypted connections (HTTPS),
          authenticated access, and private storage for uploaded files. No method of
          transmission or storage is 100% secure, and we cannot guarantee absolute
          security.
        </p>
      </LegalSection>

      <LegalSection heading="Your rights">
        <p>
          Depending on where you live, you may have the right to access, correct,
          delete, or export your personal data, or to object to certain processing.
          To exercise these rights, contact us at{' '}
          <a href="mailto:mr.youssefdaakir@gmail.com">mr.youssefdaakir@gmail.com</a>.
        </p>
      </LegalSection>

      <LegalSection heading="Children">
        <p>
          Fineprint is not intended for users under 18. We do not knowingly collect
          personal information from children.
        </p>
      </LegalSection>

      <LegalSection heading="Changes">
        <p>
          We may update this policy from time to time. We will post the revised
          version on this page and update the &quot;Last updated&quot; date above.
        </p>
      </LegalSection>

      <LegalSection heading="Contact">
        <p>
          Questions about this policy? Email{' '}
          <a href="mailto:mr.youssefdaakir@gmail.com">mr.youssefdaakir@gmail.com</a>.
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
