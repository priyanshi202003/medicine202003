import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gradient-to-r from-green-500 to-teal-500 py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-white text-2xl font-bold">MediDispose</h1>
            <div className="space-x-2">
              <Link href="/login">
                <Button variant="outline" className="text-white border-white hover:bg-white hover:text-green-600">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-white text-green-600 hover:bg-gray-100">Register</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2 space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
                  Dispose Medicine <span className="text-green-500">Safely</span> with AI
                </h2>
                <p className="text-lg text-gray-600">
                  Our smart system uses artificial intelligence to identify the safest and most environmentally friendly
                  way to dispose of your unused or expired medications.
                </p>
                <div className="pt-4">
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="bg-green-500 hover:bg-green-600 text-white px-8 py-6 text-lg rounded-xl"
                    >
                      Get Started <ArrowRight className="ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-teal-400 rounded-2xl blur opacity-30"></div>
                  <div className="relative bg-white p-6 rounded-2xl shadow-xl">
                    <img
                      src="/placeholder.svg?height=400&width=500"
                      alt="Medicine Disposal Illustration"
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-green-600 font-bold text-xl">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Take a Photo</h3>
                <p className="text-gray-600">Simply take a clear photo of your medicine or its packaging.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-green-600 font-bold text-xl">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
                <p className="text-gray-600">Our AI model analyzes the medicine and identifies its composition.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-green-600 font-bold text-xl">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Get Recommendations</h3>
                <p className="text-gray-600">Receive safe disposal recommendations based on the medicine type.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>© 2025 MediDispose. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-green-400">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-green-400">
                Terms of Service
              </a>
              <a href="#" className="hover:text-green-400">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

