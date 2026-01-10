// AI assisted development
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-orange-600">Restaurant Builder</h1>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="px-4 py-2 text-gray-700 hover:text-orange-600 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Create Your Restaurant Website
            <span className="text-orange-600"> in Minutes</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            No coding required. Build a beautiful, professional website for your
            restaurant with our easy-to-use platform. Add your menu, photos, and
            contact information instantly.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-orange-600 text-white rounded-lg text-lg font-semibold hover:bg-orange-700 transition-colors"
            >
              Start Building Free
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 border-2 border-orange-600 text-orange-600 rounded-lg text-lg font-semibold hover:bg-orange-50 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold mb-2">Quick Setup</h3>
            <p className="text-gray-600">
              Get your restaurant website online in minutes, not days.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-semibold mb-2">Mobile Friendly</h3>
            <p className="text-gray-600">
              Your website looks great on all devices automatically.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">✏️</div>
            <h3 className="text-xl font-semibold mb-2">Easy Editing</h3>
            <p className="text-gray-600">
              Update your menu and information anytime, anywhere.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
