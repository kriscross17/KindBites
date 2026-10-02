import Link from 'next/link'

export default function DonationDrivePage() {
  return <main className="min-h-screen bg-green-50 px-6 py-16"><div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow"><Link href="/" className="font-bold text-green-700">KindBites</Link><h1 className="mt-8 text-4xl font-bold">Share food and essential items</h1><p className="mt-4 text-lg text-gray-600">Offer surplus food or useful essentials and coordinate a pickup with your community.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/donation-drive/register" className="rounded-lg bg-green-700 px-5 py-3 font-semibold text-white">Register to donate</Link><Link href="/donation-drive/login" className="rounded-lg border border-green-700 px-5 py-3 font-semibold text-green-700">Donor login</Link><Link href="/donation-drive/my-donations" className="rounded-lg border px-5 py-3">My donations</Link></div></div></main>
}
