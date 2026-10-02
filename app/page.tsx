'use client'

import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-2xl font-bold text-green-700">KindBites</Link>
        <div className="flex items-center gap-5 text-sm font-medium">
          <Link href="/login" className="text-gray-700 hover:text-green-700">Log in</Link>
          <Link href="/register" className="rounded-lg bg-green-700 px-4 py-2 text-white hover:bg-green-800">Get started</Link>
        </div>
      </nav>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 md:grid-cols-2 md:py-36">
        <div>
          <p className="mb-4 font-semibold uppercase tracking-widest text-green-700">Share food. Nourish communities.</p>
          <h1 className="text-5xl font-bold leading-tight text-gray-900 md:text-6xl">Good food deserves to be shared.</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">KindBites connects people who have food to share with organizations serving their communities. Offer surplus food and coordinate a pickup.</p>
          <Link href="/donation-drive" className="mt-8 inline-flex rounded-xl bg-green-700 px-6 py-3 font-semibold text-white shadow-lg hover:bg-green-800">Donate food or items</Link>
        </div>
        <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-green-100">
          <h2 className="text-2xl font-bold text-gray-900">A simple way to help</h2>
          <ol className="mt-6 space-y-5 text-gray-600">
            <li><strong className="text-green-700">1. Create an account</strong><br/>Register as a donor, food provider, or community organization.</li>
            <li><strong className="text-green-700">2. Share food or items</strong><br/>Describe what you can offer and when it can be collected.</li>
            <li><strong className="text-green-700">3. Coordinate a pickup</strong><br/>Manage donations and food listings from your dashboard.</li>
          </ol>
        </div>
      </section>
    </main>
  )
}
