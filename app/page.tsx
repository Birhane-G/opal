import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Opal SACCO logo"
                className="h-26 w-26 object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Opal SACCO</h1>
              <p className="text-xs text-gray-600">
                Savings and Credit Cooperative
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Collective Efforts are the Foundation of a Brighter Tomorrow
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
            Join Opal SACCO, a trusted savings and credit cooperative serving
            our community with reliable financial services, competitive loan
            rates, and secure savings accounts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Become a Member
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto bg-transparent"
              >
                Member Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Our Services</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg border">
              <h4 className="text-xl font-semibold mb-3">Savings Accounts</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  Mandatory savings accounts
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  Voluntary savings with competitive returns
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  Fixed deposit accounts
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h4 className="text-xl font-semibold mb-3">Loans</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  Personal loans
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  Business development loans
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  Emergency loans
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h4 className="text-xl font-semibold mb-3">Share Capital</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  Own shares in the SACCO
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  Minimum 2 shares at 1,000 ETB each
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  Earn dividends on shares
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2">&copy; 2026 Opal SACCO. All rights reserved.</p>
          <p className="text-sm">
            Our Collective Efforts are the Foundation of a Brighter Tomorrow
          </p>
        </div>
      </footer>
    </div>
  );
}
