import { NavBar } from "../../components/navbar"
import { Footer } from "../../components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Shield, Users, Stethoscope, AlertTriangle } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">About Soma</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              AI-powered symptom checking for better health decisions
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Stethoscope className="h-5 w-5 text-primary" />
                  <CardTitle>How It Works</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Soma uses advanced AI algorithms to analyze your symptoms and provide personalized health insights.
                  Simply answer a series of questions about how you're feeling, and receive instant guidance.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <CardTitle>Privacy & Security</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Your health information is completely confidential. We use industry-standard encryption and never
                  store personal health data without your explicit consent.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <CardTitle>Medical Partners</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Soma is developed in collaboration with healthcare professionals and medical institutions to ensure
                  accuracy and reliability of our AI models.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <CardTitle>Important Notice</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Soma is not a replacement for professional medical advice. Always consult with a qualified healthcare
                  provider for serious symptoms or medical emergencies.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <div className="mt-16 rounded-lg bg-muted p-8">
            <h2 className="text-xl font-semibold text-foreground">Contact & Support</h2>
            <p className="mt-2 text-muted-foreground">
              For questions about Soma or technical support, please contact our team. We're committed to helping you
              make informed health decisions.
            </p>
            <div className="mt-4 space-y-1 text-sm text-muted-foreground">
              <p>Email: support@soma-health.com</p>
              <p>Emergency: Always call your local emergency services</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
