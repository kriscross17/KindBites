import { NextRequest } from 'next/server'
import { executeQuery } from '@/lib/database'
import { handleError, handleSuccess } from '@/lib/errors'
import { createAuthContext } from '@/lib/middleware'

export async function GET(request: NextRequest) {
  try {
    createAuthContext(request).requireAdmin()
    const itemDonations = await executeQuery<any[]>(
      `SELECT i.*, d.full_name, d.email, d.phone
       FROM item_donations i JOIN individual_donors d ON i.donor_id = d.id
       WHERE i.status IN ('pending', 'approved') ORDER BY i.pickup_datetime ASC`
    )
    return handleSuccess({ itemDonations, pagination: { item: { total: itemDonations.length, page: 1, limit: itemDonations.length, totalPages: 1 } } })
  } catch (error) {
    return handleError(error as Error)
  }
}
