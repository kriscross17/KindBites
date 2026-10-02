import { NextRequest } from 'next/server'
import { query } from '@/lib/database'
import { handleError, handleSuccess } from '@/lib/errors'
import { createAuthContext } from '@/lib/middleware'

export async function GET(request: NextRequest) {
  try {
    createAuthContext(request).requireAdmin()
    const logs = await query(
      `SELECT dl.*, d.full_name AS donor_name, d.email AS donor_email, u.name AS admin_name, 'Item Donation' AS type_label
       FROM donation_logs dl JOIN individual_donors d ON dl.donor_id = d.id
       LEFT JOIN users u ON dl.action_by = u.id
       WHERE dl.donation_type = 'item' ORDER BY dl.created_at DESC LIMIT 100`
    )
    return handleSuccess({ logs })
  } catch (error) { return handleError(error as Error) }
}
