import { NavBar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
          
          <div className="space-y-6 text-sm">
            <section>
              <p className="text-muted-foreground mb-4">
                <strong>Last updated:</strong> {new Date().toLocaleDateString()}
              </p>
              <p>
                Welcome to Soma. These Terms of Service ("Terms") govern your use of our 
                AI-powered symptom checker service. By using Soma, you agree to these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using Soma, you accept and agree to be bound by the terms 
                and provision of this agreement. If you do not agree to abide by the above, 
                please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Medical Disclaimer</h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-800">
                  <strong>IMPORTANT:</strong> Soma is NOT a medical device and does NOT provide 
                  medical diagnosis. Our service is for informational and educational purposes only.
                </p>
              </div>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Soma does not replace professional medical advice, diagnosis, or treatment</li>
                <li>Always seek the advice of qualified healthcare providers</li>
                <li>Never disregard professional medical advice because of something you read on Soma</li>
                <li>If you think you have a medical emergency, call 911 immediately</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Service Description</h2>
              <p className="text-muted-foreground">
                Soma provides AI-powered symptom analysis to help users understand potential 
                health conditions based on reported symptoms. Our service uses machine learning 
                algorithms to provide educational information only.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">User Responsibilities</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Provide accurate and truthful information</li>
                <li>Use the service responsibly and for lawful purposes only</li>
                <li>Not attempt to reverse engineer or compromise our systems</li>
                <li>Respect intellectual property rights</li>
                <li>Not use the service for commercial purposes without permission</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Privacy and Data</h2>
              <p className="text-muted-foreground">
                Your privacy is important to us. Please review our Privacy Policy to understand 
                how we collect, use, and protect your information. By using Soma, you consent 
                to our data practices as described in our Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Limitation of Liability</h2>
              <p className="text-muted-foreground">
                To the maximum extent permitted by law, Soma and its affiliates shall not be 
                liable for any indirect, incidental, special, consequential, or punitive damages, 
                or any loss of profits or revenues, whether incurred directly or indirectly, 
                or any loss of data, use, goodwill, or other intangible losses.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Service Availability</h2>
              <p className="text-muted-foreground">
                We strive to provide reliable service but cannot guarantee 100% uptime. 
                We reserve the right to modify, suspend, or discontinue the service at any 
                time without notice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Intellectual Property</h2>
              <p className="text-muted-foreground">
                All content, features, and functionality of Soma are owned by us and are 
                protected by international copyright, trademark, patent, trade secret, and 
                other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Termination</h2>
              <p className="text-muted-foreground">
                We may terminate or suspend your access immediately, without prior notice, 
                for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Changes to Terms</h2>
              <p className="text-muted-foreground">
                We reserve the right to modify these Terms at any time. We will notify users 
                of any changes by posting the new Terms on this page and updating the 
                "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Contact Information</h2>
              <p className="text-muted-foreground">
                If you have questions about these Terms, please contact us at:
                <br />
                Email: legal@soma-health.com
                <br />
                Address: 123 Health Street, Medical City, MC 12345
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}