'use client'

import { useCallback, useEffect, useState } from 'react'
import { AlertModal } from '../../../components/AlertModal'
import { useAlert } from '../../../hooks/useAlert'

type Tab = 'items' | 'verifications' | 'listings' | 'users'

export default function AdminDashboard() {
  const { alertState, showSuccess, showError, hideAlert } = useAlert()
  const [tab, setTab] = useState<Tab>('items')
  const [items, setItems] = useState<any[]>([])
  const [verifications, setVerifications] = useState<any[]>([])
  const [listings, setListings] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const token = localStorage.getItem('token')
    if (!token || localStorage.getItem('userType') !== 'admin') {
      window.location.href = '/login'
      return
    }
    const headers = { Authorization: `Bearer ${token}` }
    try {
      const [donationResponse, verificationResponse, listingResponse, activityResponse] = await Promise.all([
        fetch('/api/admin/donations', { headers }),
        fetch('/api/admin/verification', { headers }),
        fetch('/api/listings', { headers }),
        fetch('/api/admin/activities', { headers }),
      ])
      if (donationResponse.ok) {
        const result = await donationResponse.json()
        const data = result.success ? result.data : result
        setItems(data.itemDonations || [])
      }
      if (verificationResponse.ok) {
        const result = await verificationResponse.json()
        const data = result.success ? result.data : result
        setVerifications(data.users || [])
      }
      if (listingResponse.ok) {
        const result = await listingResponse.json()
        setListings(result.listings || [])
      }
      if (activityResponse.ok) {
        const result = await activityResponse.json()
        const data = result.success ? result.data : result
        setUsers(data.recentUsers || [])
      }
    } catch {
      showError('Could not load admin data.')
    } finally {
      setLoading(false)
    }
  }, [showError])

  useEffect(() => { void load() }, [load])

  async function donationAction(id: number, action: 'approve' | 'reject' | 'collected') {
    const token = localStorage.getItem('token')
    const response = await fetch(`/api/admin/donations/item/${id}/${action}`, {
      method: 'PUT', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({}),
    })
    if (!response.ok) { showError('Could not update the item donation.'); return }
    showSuccess(`Item donation ${action}d.`)
    await load()
  }

  async function verificationAction(userId: number, action: 'approve' | 'reject') {
    const token = localStorage.getItem('token')
    const response = await fetch('/api/admin/verification', {
      method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, action }),
    })
    if (!response.ok) { showError('Could not update verification.'); return }
    showSuccess(`Verification ${action}d.`)
    await load()
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 md:px-8">
      <AlertModal isOpen={alertState.isOpen} title={alertState.title} message={alertState.message} type={alertState.type} onClose={hideAlert} />
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div><a href="/" className="text-sm font-semibold text-green-700">KindBites</a><h1 className="mt-1 text-3xl font-bold">Admin dashboard</h1></div>
          <a href="/dashboard" className="rounded-lg border bg-white px-4 py-2 text-sm">Main dashboard</a>
        </header>
        <nav className="mb-6 flex gap-2">
          {(['items', 'verifications', 'listings', 'users'] as Tab[]).map(value => <button key={value} onClick={() => setTab(value)} className={`rounded-lg px-4 py-2 font-medium capitalize ${tab === value ? 'bg-green-700 text-white' : 'bg-white text-gray-700'}`}>{value === 'items' ? 'Item donations' : value}</button>)}
        </nav>
        {loading ? <p className="rounded-xl bg-white p-6">Loading…</p> : tab === 'items' ? (
          <section className="space-y-3">{items.length === 0 ? <p className="rounded-xl bg-white p-6 text-gray-600">No item donations to review.</p> : items.map(item => <article key={item.id} className="rounded-xl bg-white p-5 shadow-sm">
            <div className="flex flex-wrap justify-between gap-4"><div><h2 className="text-lg font-semibold">{item.item_title} · {item.quantity}</h2><p className="text-sm text-gray-600">{item.full_name} · {item.email}</p><p className="text-sm text-gray-600">Pickup: {item.pickup_datetime} · {item.pickup_address}</p><p className="mt-1 text-sm font-medium capitalize text-green-700">{item.status}</p></div><div className="flex flex-wrap items-start gap-2">{item.status === 'pending' && <><button onClick={() => donationAction(item.id, 'approve')} className="rounded bg-green-700 px-3 py-2 text-white">Approve</button><button onClick={() => donationAction(item.id, 'reject')} className="rounded bg-red-600 px-3 py-2 text-white">Reject</button></>}{item.status === 'approved' && <button onClick={() => donationAction(item.id, 'collected')} className="rounded bg-blue-700 px-3 py-2 text-white">Mark collected</button>}</div></div>
          </article>)}</section>
        ) : tab === 'verifications' ? (
          <section className="space-y-3">{verifications.length === 0 ? <p className="rounded-xl bg-white p-6 text-gray-600">No pending verifications.</p> : verifications.map(person => <article key={person.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white p-5"><div><h2 className="font-semibold">{person.full_name || person.name}</h2><p className="text-sm text-gray-600">{person.email} · {person.role}</p></div><div className="flex gap-2"><button onClick={() => verificationAction(person.id, 'approve')} className="rounded bg-green-700 px-3 py-2 text-white">Approve</button><button onClick={() => verificationAction(person.id, 'reject')} className="rounded bg-red-600 px-3 py-2 text-white">Reject</button></div></article>)}</section>
        ) : tab === 'listings' ? <section className="space-y-3">{listings.length === 0 ? <p className="rounded-xl bg-white p-6 text-gray-600">No food listings.</p> : listings.map(listing => <article key={listing.id} className="rounded-xl bg-white p-5"><h2 className="font-semibold">{listing.title}</h2><p className="text-sm text-gray-600">{listing.quantity} · {listing.status} · {listing.pickup_location}</p></article>)}</section>
          : <section className="space-y-3">{users.length === 0 ? <p className="rounded-xl bg-white p-6 text-gray-600">No user accounts.</p> : users.map(person => <article key={person.id} className="rounded-xl bg-white p-5"><h2 className="font-semibold">{person.name}</h2><p className="text-sm text-gray-600">{person.email} · {person.organization_name || person.role} · Joined {new Date(person.created_at).toLocaleDateString()}</p></article>)}</section>}
      </div>
    </main>
  )
}
