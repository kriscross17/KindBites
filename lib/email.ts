import nodemailer from 'nodemailer'
import { EMAIL_CONFIG } from './config'

interface EmailOptions {
  to: string
  subject: string
  html: string
  attachments?: Array<{ filename: string; content?: string; encoding?: string; cid?: string; contentType?: string }>
}

export async function sendEmail({ to, subject, html, attachments }: EmailOptions) {
  try {
    const { from, ...transportConfig } = EMAIL_CONFIG
    const transporter = nodemailer.createTransport(transportConfig)
    const info = await transporter.sendMail({
      from: `${from.name} <${from.email}>`,
      to, subject, html, attachments,
    })
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Email error:', error)
    return { success: false, error }
  }
}
