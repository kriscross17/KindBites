import { executeQuery } from '@/lib/database'
import { handleError, handleSuccess } from '@/lib/errors'
import { parseInteger, validateFields, validateRequired } from '@/lib/validation'

export async function GET(request: Request) {
  try {
    const donorIdParam = new URL(request.url).searchParams.get('donorId')
    validateFields([{ result: validateRequired(donorIdParam, 'Donor ID'), field: 'donorId' }])
    const donorId = parseInteger(donorIdParam!, 'Donor ID')
    const itemDonations = await executeQuery<any[]>(
      'SELECT * FROM item_donations WHERE donor_id = ? ORDER BY created_at DESC', [donorId]
    )
    return handleSuccess({ itemDonations })
  } catch (error) {
    return handleError(error as Error)
  }
}
