import { NavBar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          
          <div className="space-y-6 text-sm">
            <section>
              <p className="text-muted-foreground mb-4">
                <strong>Last updated:</strong> {new Date().toLocaleDateString()}
              </p>
              <p>
                At Soma, we take your privacy seriously. This Privacy Policy explains how we collect, 
                use, disclose, and safeguard your information when you use our AI-powered symptom 
                checker service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Information We Collect</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold">Health Information</h3>
                  <p className="text-muted-foreground">
                    We collect symptom information, vital signs, and demographic data that you 
                    voluntarily provide to generate health insights.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Technical Information</h3>
                  <p className="text-muted-foreground">
                    We automatically collect certain technical information including IP address, 
                    browser type, device information, and usage patterns.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>To provide AI-powered symptom analysis and health insights</li>
                <li>To improve our machine learning models and service quality</li>
                <li>To maintain and enhance user experience</li>
                <li>To comply with legal obligations and regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Data Security</h2>
              <p className="text-muted-foreground">
                We implement appropriate technical and organizational security measures to protect 
                your personal information against unauthorized access, alteration, disclosure, or 
                destruction. All health data is encrypted both in transit and at rest.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Data Sharing</h2>
              <p className="text-muted-foreground">
                We do not sell, trade, or otherwise transfer your personal health information to 
                third parties without your explicit consent, except as described in this policy 
                or as required by law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Your Rights</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Access and review your personal information</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your personal information</li>
                <li>Opt-out of certain data processing activities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Medical Disclaimer</h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">
                  <strong>Important:</strong> Soma is not a medical device and does not provide 
                  medical diagnosis. Our AI-powered insights are for informational purposes only 
                  and should not replace professional medical advice, diagnosis, or treatment.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Contact Information</h2>
              <p className="text-muted-foreground">
                If you have questions about this Privacy Policy, please contact us at:
                <br />
                Email: privacy@soma-health.com
                <br />
                Address: 123 Health Street, Medical City, MC 12345
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Changes to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. We will notify you of any 
                changes by posting the new Privacy Policy on this page and updating the "Last 
                updated" date.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}