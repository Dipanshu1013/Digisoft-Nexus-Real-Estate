import type { Metadata } from 'next'
import SiteLayout from '@/components/layout/SiteLayout'

export const metadata: Metadata = {
  title: 'Terms of Service | DigiSoft Nexus Real Estate',
  description: 'Terms and conditions for using DigiSoft Nexus real estate platform and services.',
}

export default function TermsPage() {
  return (
    <SiteLayout>
      <section className="bg-navy py-12">
        <div className="container-site text-center">
          <h1 className="font-display text-4xl text-white font-semibold mb-2">Terms of Service</h1>
          <p className="text-white/50 text-sm">Last updated: February 2026</p>
        </div>
      </section>
      <section className="section bg-warm-white">
        <div className="container-site max-w-3xl prose-luxury">
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing digisoftnexus.com, you agree to these Terms of Service. If you do not agree, please do not use our platform.</p>

          <h2>2. Services Provided</h2>
          <p>Digisoft Nexus OPC Private Limited provides real estate advisory, lead generation, and affiliate marketing services. We are an authorised channel partner for real estate developers and do not own, develop, or manage any properties listed on this platform.</p>

          <h2>3. Information Accuracy</h2>
          <p>Property details, prices, and availability are provided in good faith but may change without notice. Always verify details directly with the developer before making any financial commitment. DigiSoft Nexus is not liable for any decisions made based on website content.</p>

          <h2>4. Lead Data & Privacy</h2>
          <p>When you submit an inquiry, your contact information is shared with the relevant property developer as stated in our Privacy Policy and consent checkbox. Please review our Privacy Policy for complete data handling information.</p>

          <h2>5. No Guarantee of Outcomes</h2>
          <p>Real estate investments carry risk. Past appreciation figures cited on this website are historical and not a guarantee of future performance. All investment decisions should be made with due diligence and professional legal/financial advice.</p>

          <h2>6. Intellectual Property</h2>
          <p>All content on digisoftnexus.com — including text, images, design elements, and code — is owned by Digisoft Nexus OPC Private Limited. Reproduction without written permission is prohibited.</p>

          <h2>7. Limitation of Liability</h2>
          <p>Digisoft Nexus shall not be liable for any direct, indirect, or consequential damages arising from the use of this platform or any property transaction facilitated through it.</p>

          <h2>8. Governing Law</h2>
          <p>These terms are governed by the laws of India, specifically the laws of the state of Haryana. Any disputes shall be subject to the exclusive jurisdiction of courts in Gurugram, Haryana.</p>

          <h2>9. Changes to Terms</h2>
          <p>We reserve the right to modify these terms at any time. Continued use of the platform constitutes acceptance of the updated terms.</p>

          <h2>10. Contact</h2>
          <p>For questions about these terms: legal@digisoftnexus.com</p>
        </div>
      </section>
    </SiteLayout>
  )
}
