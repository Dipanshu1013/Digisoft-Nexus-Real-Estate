import type { Metadata } from 'next'
import SiteLayout from '@/components/layout/SiteLayout'

export const metadata: Metadata = {
  title: 'Privacy Policy | DPDP Act 2023 Compliant | DigiSoft Nexus',
  description: 'DigiSoft Nexus Privacy Policy — how we collect, use, and protect your personal data in compliance with India\'s DPDP Act 2023.',
}

export default function PrivacyPolicyPage() {
  return (
    <SiteLayout>
      <section className="bg-navy py-12">
        <div className="container-site text-center">
          <h1 className="font-display text-4xl text-white font-semibold mb-2">Privacy Policy</h1>
          <p className="text-white/50 text-sm">Last updated: February 2026 | DPDP Act 2023 Compliant</p>
        </div>
      </section>
      <section className="section bg-warm-white">
        <div className="container-site max-w-3xl prose-luxury">
          <h2>1. Who We Are</h2>
          <p>Digisoft Nexus OPC Private Limited ("Digisoft Nexus", "we", "us") operates digisoftnexus.com, a real estate lead generation and advisory platform. We are registered under the Real Estate (Regulation and Development) Act, 2016 (RERA) as an authorised channel partner.</p>

          <h2>2. Data We Collect</h2>
          <p>We collect the following personal data when you interact with our platform:</p>
          <p><strong>Stage 1 (Awareness):</strong> First name, email address — collected when you request a brochure or 3D tour access.</p>
          <p><strong>Stage 2 (Interest):</strong> Phone number, buyer/investor/renter status — collected when you subscribe to VIP listing alerts.</p>
          <p><strong>Stage 3 (Consideration):</strong> Budget range, job title — collected when you access floor plans or financial tools.</p>
          <p><strong>Stage 4 (Intent):</strong> Current city, specific requirements — collected when you schedule a site visit or consultation.</p>
          <p>We also collect anonymised technical data (IP address, browser type, page views) for analytics purposes.</p>

          <h2>3. Legal Basis for Processing (DPDP Act 2023)</h2>
          <p>We process your personal data under the following lawful bases as per India's Digital Personal Data Protection (DPDP) Act, 2023:</p>
          <p><strong>Consent:</strong> You provide explicit, unchecked-by-default consent on every form before submitting. You may withdraw consent at any time by emailing privacy@digisoftnexus.com.</p>
          <p><strong>Legitimate Interest:</strong> We may process data to prevent fraud, spam, and abuse on our platform.</p>

          <h2>4. How We Use Your Data</h2>
          <p>We use your personal data to: (a) Connect you with relevant property developers, (b) Send property alerts and investment reports you've subscribed to, (c) Provide personalised property recommendations, (d) Comply with legal obligations.</p>

          <h2>5. Data Sharing</h2>
          <p>We share your data with the specific property developer you express interest in, as stated in our consent checkbox. We do not sell your data to third parties. We may share data with our CRM providers (HubSpot, Zoho) solely for customer relationship management purposes.</p>

          <h2>6. Your Rights (DPDP Act 2023)</h2>
          <p>As a data principal under the DPDP Act 2023, you have the following rights:</p>
          <p><strong>Right to Access:</strong> Request a copy of all personal data we hold about you.</p>
          <p><strong>Right to Correction:</strong> Request correction of inaccurate data.</p>
          <p><strong>Right to Erasure:</strong> Request deletion of all your personal data from our systems and connected CRMs.</p>
          <p><strong>Right to Withdraw Consent:</strong> Withdraw your consent at any time without affecting prior processing.</p>
          <p>To exercise any right, email: <strong>privacy@digisoftnexus.com</strong> with subject "Data Rights Request".</p>

          <h2>7. Data Retention</h2>
          <p>We retain personal data for 3 years from the date of collection, or until you request erasure, whichever is earlier. Anonymised analytics data may be retained indefinitely.</p>

          <h2>8. Security</h2>
          <p>We implement industry-standard security measures including encryption of data at rest and in transit, access controls, rate limiting, and regular security audits. However, no system is 100% secure and we cannot guarantee absolute security.</p>

          <h2>9. Cookies</h2>
          <p>We use first-party cookies to maintain session state and persist your UTM attribution (campaign tracking) for up to 30 days. We do not use third-party tracking cookies. You may clear cookies at any time through your browser settings.</p>

          <h2>10. Contact Us</h2>
          <p>For any privacy-related questions or to exercise your rights:</p>
          <p><strong>Email:</strong> privacy@digisoftnexus.com<br /><strong>Data Protection Officer:</strong> Digisoft Nexus OPC Private Limited, Gurugram, Haryana, India</p>
        </div>
      </section>
    </SiteLayout>
  )
}
