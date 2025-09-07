import { NavBar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">Get in Touch</h2>
              <p className="text-muted-foreground mb-4">
                We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </section>

            <section className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Contact Information</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Email:</strong> support@soma-health.com</p>
                  <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                  <p><strong>Address:</strong> 123 Health Street, Medical City, MC 12345</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Business Hours</h3>
                <div className="space-y-1 text-sm">
                  <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM</p>
                  <p><strong>Saturday:</strong> 10:00 AM - 4:00 PM</p>
                  <p><strong>Sunday:</strong> Closed</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-semibold mb-2">Important Notice</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Medical Emergency:</strong> If you are experiencing a medical emergency, 
                  please call 911 or your local emergency services immediately. Do not use this 
                  contact form for urgent medical situations.
                </p>
              </div>
            </section>

            <section>
              <h3 className="font-semibold mb-2">Feedback</h3>
              <p className="text-sm text-muted-foreground">
                Your feedback helps us improve our service. Please let us know about your 
                experience with Soma and any suggestions you might have.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}