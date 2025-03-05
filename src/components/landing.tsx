import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle,
  Lock,
  Smartphone,
  CreditCard,
  BarChart4,
  Users,
  Shield,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Liquidity</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link
              href="#features"
              className="text-sm font-medium hover:text-primary"
            >
              Features
            </Link>
            <Link
              href="#security"
              className="text-sm font-medium hover:text-primary"
            >
              Security
            </Link>
            <Link
              href="#mobile"
              className="text-sm font-medium hover:text-primary"
            >
              Mobile App
            </Link>
            <Link
              href="#business"
              className="text-sm font-medium hover:text-primary"
            >
              Business
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="hidden text-sm font-medium hover:underline md:inline-block"
            >
              Log in
            </Link>
            <Button>Get Started</Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white py-20 md:py-32">
          <div className="container relative z-10 grid gap-12 md:grid-cols-2 md:items-center">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Banking Reimagined{" "}
                <span className="text-primary">for the Digital Age</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Experience seamless, secure, and accessible banking from
                anywhere, on any device.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button size="lg" className="gap-2">
                  Open an Account <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>No Hidden Fees</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>24/7 Support</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>FDIC Insured</span>
                </div>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-md">
              <div className="relative z-10 overflow-hidden rounded-2xl border bg-background shadow-xl">
                <Image
                  src="/placeholder.svg?height=600&width=400"
                  width={400}
                  height={600}
                  alt="Banking app dashboard"
                  className="w-full"
                />
              </div>
              <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-primary/20 blur-3xl"></div>
              <div className="absolute -bottom-12 -left-12 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl"></div>
            </div>
          </div>
          <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] dark:bg-grid-slate-700/25"></div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="container">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Everything You Need in One Place
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Our comprehensive banking platform offers all the services you'd
                expect from a traditional bank, but with the convenience and
                innovation of modern technology.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                  <div className="mt-4 flex items-center text-sm font-medium text-primary">
                    Learn more <ChevronRight className="ml-1 h-4 w-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section id="security" className="bg-slate-50 py-20">
          <div className="container">
            <div className="grid gap-12 md:grid-cols-2 md:items-center">
              <div>
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  Bank-Grade Security
                </div>
                <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                  Your Security is Our Top Priority
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  We've implemented multiple layers of protection to ensure your
                  financial data and transactions remain secure.
                </p>
                <ul className="mt-8 space-y-4">
                  {securityFeatures.map((feature) => (
                    <li key={feature.title} className="flex items-start gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <feature.icon className="h-3 w-3" />
                      </div>
                      <div>
                        <h3 className="font-medium">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
                <Button className="mt-8">Learn About Our Security</Button>
              </div>
              <div className="relative mx-auto w-full max-w-md">
                <div className="relative z-10 overflow-hidden rounded-2xl border bg-background p-6 shadow-xl">
                  <div className="mb-6 flex items-center justify-center rounded-full bg-primary/10 p-4">
                    <Lock className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mb-2 text-center text-xl font-bold">
                    Multi-Factor Authentication
                  </h3>
                  <p className="mb-6 text-center text-muted-foreground">
                    Add an extra layer of security to your account with our
                    advanced authentication options.
                  </p>
                  <div className="space-y-4">
                    <div className="rounded-lg border bg-slate-50 p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-200"></div>
                        <div>
                          <div className="h-4 w-32 rounded bg-slate-200"></div>
                          <div className="mt-1 h-3 w-24 rounded bg-slate-200"></div>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg border bg-slate-50 p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-200"></div>
                        <div>
                          <div className="h-4 w-32 rounded bg-slate-200"></div>
                          <div className="mt-1 h-3 w-24 rounded bg-slate-200"></div>
                        </div>
                      </div>
                    </div>
                    <Button className="w-full">Enable 2FA</Button>
                  </div>
                </div>
                <div className="absolute -bottom-6 -left-6 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile App Section */}
        <section id="mobile" className="py-20">
          <div className="container">
            <div className="grid gap-12 md:grid-cols-2 md:items-center">
              <div className="order-2 md:order-1">
                <div className="relative mx-auto flex max-w-xs justify-center">
                  <div className="relative z-10 overflow-hidden rounded-3xl border bg-background shadow-xl">
                    <Image
                      src="/placeholder.svg?height=600&width=300"
                      width={300}
                      height={600}
                      alt="Banking mobile app"
                      className="w-full"
                    />
                  </div>
                  <div className="absolute -bottom-6 -right-6 h-64 w-64 rounded-full bg-primary/20 blur-3xl"></div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  Mobile Banking
                </div>
                <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                  Banking in Your Pocket
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Our mobile app gives you the power to bank anytime, anywhere
                  with the same security and features as our desktop platform.
                </p>
                <ul className="mt-8 space-y-4">
                  {mobileFeatures.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Employee Dashboard Section */}
        <section id="business" className="bg-slate-50 py-20">
          <div className="container">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                For Bank Employees
              </div>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Powerful Tools for Bank Management
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Our dedicated dashboard gives bank employees the tools they need
                to provide exceptional service.
              </p>
            </div>
            <div className="relative mx-auto max-w-4xl overflow-hidden rounded-xl border bg-background shadow-xl">
              <div className="border-b bg-slate-50 p-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <div className="ml-4 h-6 w-64 rounded bg-slate-200"></div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="col-span-2 space-y-6">
                    <div className="h-8 w-48 rounded bg-slate-200"></div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-lg border bg-slate-50 p-4">
                        <div className="mb-2 h-4 w-24 rounded bg-slate-200"></div>
                        <div className="h-8 w-32 rounded bg-slate-200"></div>
                        <div className="mt-4 h-24 w-full rounded bg-slate-200"></div>
                      </div>
                      <div className="rounded-lg border bg-slate-50 p-4">
                        <div className="mb-2 h-4 w-24 rounded bg-slate-200"></div>
                        <div className="h-8 w-32 rounded bg-slate-200"></div>
                        <div className="mt-4 h-24 w-full rounded bg-slate-200"></div>
                      </div>
                    </div>
                    <div className="rounded-lg border bg-slate-50 p-4">
                      <div className="mb-4 h-4 w-32 rounded bg-slate-200"></div>
                      <div className="h-32 w-full rounded bg-slate-200"></div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="h-8 w-32 rounded bg-slate-200"></div>
                    <div className="rounded-lg border bg-slate-50 p-4">
                      <div className="mb-2 h-4 w-24 rounded bg-slate-200"></div>
                      <div className="space-y-2">
                        <div className="h-4 w-full rounded bg-slate-200"></div>
                        <div className="h-4 w-full rounded bg-slate-200"></div>
                        <div className="h-4 w-3/4 rounded bg-slate-200"></div>
                      </div>
                    </div>
                    <div className="rounded-lg border bg-slate-50 p-4">
                      <div className="mb-2 h-4 w-24 rounded bg-slate-200"></div>
                      <div className="space-y-2">
                        <div className="h-4 w-full rounded bg-slate-200"></div>
                        <div className="h-4 w-full rounded bg-slate-200"></div>
                        <div className="h-4 w-3/4 rounded bg-slate-200"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 text-center">
              <p className="mb-4 text-muted-foreground">
                Empower your team with real-time data and customer insights
              </p>
              <Button size="lg">Request Employee Access</Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-slate-50 py-12">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">Liquidity</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Banking reimagined for the digital age. Secure, accessible, and
                user-friendly.
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-medium">Products</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-primary">
                    Checking Accounts
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Savings Accounts
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Credit Cards
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Loans
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Investments
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-medium">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-primary">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Press
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-medium">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-primary">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    FDIC Information
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Accessibility
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} Liquidity. All rights reserved.
            </p>
            <p className="mt-2">
              Liquidity is a member FDIC and an Equal Housing Lender. Banking
              services provided by Liquidity, N.A.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Data
const features = [
  {
    icon: CreditCard,
    title: "Account Management",
    description:
      "Open and manage accounts with ease. View balances, transactions, and statements in real-time.",
  },
  {
    icon: Smartphone,
    title: "Mobile Check Deposit",
    description:
      "Deposit checks instantly by taking a photo with your smartphone camera.",
  },
  {
    icon: ArrowRight,
    title: "Easy Transfers",
    description:
      "Transfer money between accounts or to other banks quickly and securely.",
  },
  {
    icon: BarChart4,
    title: "Automated Bill Pay",
    description:
      "Set up recurring payments for bills and never miss a due date again.",
  },
  {
    icon: Users,
    title: "Joint Accounts",
    description:
      "Easily manage shared finances with family members or business partners.",
  },
  {
    icon: Lock,
    title: "Secure Messaging",
    description:
      "Communicate with bank representatives through our encrypted messaging system.",
  },
];

const securityFeatures = [
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description:
      "All data is encrypted in transit and at rest using industry-leading encryption standards.",
  },
  {
    icon: Lock,
    title: "Multi-Factor Authentication",
    description:
      "Add an extra layer of security with biometric verification, SMS codes, or authenticator apps.",
  },
  {
    icon: Lock,
    title: "Real-time Fraud Monitoring",
    description:
      "Our AI-powered system detects and prevents suspicious activities 24/7.",
  },
  {
    icon: Lock,
    title: "Secure Infrastructure",
    description:
      "Our systems are hosted in SOC 2 compliant data centers with multiple redundancies.",
  },
];

const mobileFeatures = [
  "Check balances and view transactions",
  "Deposit checks with your camera",
  "Send and receive money instantly",
  "Freeze/unfreeze your cards",
  "Set up alerts and notifications",
  "Locate ATMs and branches",
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Small Business Owner",
    quote:
      "Liquidity has transformed how I manage my business finances. The mobile app is intuitive and the customer service is exceptional.",
  },
  {
    name: "Michael Chen",
    role: "Software Engineer",
    quote:
      "As someone who values security, I'm impressed with the robust protection measures. The biometric login and instant fraud alerts give me peace of mind.",
  },
  {
    name: "Emily Rodriguez",
    role: "Graduate Student",
    quote:
      "The fee-free checking account and easy mobile deposits have made banking so much simpler during my busy school schedule.",
  },
];
