import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/database'
import { generateItemDonationAcknowledgement } from '@/lib/itemDonationAcknowledgement'
import { createAuthContext } from '@/lib/middleware'
import { handleError, NotFoundError } from '@/lib/errors'
import { parseInteger } from '@/lib/validation'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = createAuthContext(request)
    auth.requireAdmin()
    const id = parseInteger(params.id, 'Donation ID')
    const rows = await executeQuery<any[]>(
      `SELECT i.id, i.item_title, i.quantity, i.collected_at, d.full_name, d.email
       FROM item_donations i JOIN individual_donors d ON i.donor_id = d.id
       WHERE i.id = ? AND i.status = 'collected'`, [id]
    )
    if (!rows.length) throw new NotFoundError('Collected item donation not found.')
    const donation = rows[0]
    const pdf = await generateItemDonationAcknowledgement({
      acknowledgementNumber: `KB-ITEM-${String(id).padStart(6, '0')}`,
      dateOfIssue: new Date(donation.collected_at).toLocaleDateString('en-IN'),
      donorName: donation.full_name,
      donorEmail: donation.email,
      itemDescription: donation.item_title,
      quantity: donation.quantity,
    })
    return new NextResponse(pdf as any, { headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="item-acknowledgement-${id}.pdf"` } })
  } catch (error) { return handleError(error as Error) }
}
