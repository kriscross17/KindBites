import { jsPDF } from 'jspdf'

export interface DonationReceiptData {
  receiptNumber: string
  transactionId?: string
  dateOfIssue: string
  donorName: string
  donorEmail: string
  itemDescription?: string
  quantity?: number
}

export async function generateDonationReceipt(data: DonationReceiptData): Promise<Buffer> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const center = doc.internal.pageSize.getWidth() / 2
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.text('KindBites', center, 30, { align: 'center' })
  doc.setFontSize(16)
  doc.text('ITEM DONATION ACKNOWLEDGEMENT', center, 48, { align: 'center' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  const rows = [
    ['Reference', data.receiptNumber],
    ['Date', data.dateOfIssue],
    ['Donor', data.donorName],
    ['Email', data.donorEmail],
    ['Item', data.itemDescription || 'Food or essential items'],
    ['Quantity', String(data.quantity ?? '')],
    ...(data.transactionId ? [['Submission reference', data.transactionId]] : []),
  ]
  let y = 72
  for (const [label, value] of rows) {
    doc.setFont('helvetica', 'bold')
    doc.text(`${label}:`, 25, y)
    doc.setFont('helvetica', 'normal')
    doc.text(String(value), 70, y)
    y += 12
  }
  doc.setFontSize(10)
  doc.setTextColor(90)
  doc.text('Acknowledgement for the collection of the listed items.', center, y + 18, { align: 'center' })
  return Buffer.from(doc.output('arraybuffer'))
}
