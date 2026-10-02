'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function MyDonationsPage() {
  const router = useRouter()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const donorId = sessionStorage.getItem('donorId')
    if (!donorId) { router.push('/donation-drive/register'); return }
    fetch(`/api/donation-drive/my-donations?donorId=${encodeURIComponent(donorId)}`)
      .then(response => response.json())
      .then(result => setItems((result.success ? result.data : result).itemDonations || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [router])

  return <main className="min-h-screen bg-gray-50 px-6 py-12"><div className="mx-auto max-w-4xl"><a href="/" className="font-bold text-green-700">KindBites</a><h1 className="mt-6 text-3xl font-bold">My item donations</h1>{loading ? <p className="mt-6">Loading…</p> : items.length === 0 ? <p className="mt-6 rounded-xl bg-white p-6 text-gray-600">You have not submitted any item donations yet.</p> : <div className="mt-6 space-y-3">{items.map(item => <article key={item.id} className="rounded-xl bg-white p-5 shadow-sm"><div className="flex justify-between gap-4"><div><h2 className="font-semibold">{item.item_title} · {item.quantity}</h2><p className="mt-1 text-sm text-gray-600">Pickup {new Date(item.pickup_datetime).toLocaleString()} at {item.pickup_address}</p></div><span className="h-fit rounded-full bg-green-50 px-3 py-1 text-sm capitalize text-green-800">{item.status}</span></div></article>)}</div>}</div></main>
}
