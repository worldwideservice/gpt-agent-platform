/**
 * Email сервис для отправки системных писем
 * Использует SendGrid SMTP для отправки писем пользователям платформы
 */

import nodemailer from 'nodemailer'
import { logger } from '@/lib/utils'

let transporter: nodemailer.Transporter | null = null

/**
 * Инициализация email транспортера
 */
const getEmailTransporter = (): nodemailer.Transporter => {
  if (transporter) {
    return transporter
  }

  const smtpHost = process.env.SMTP_HOST || 'smtp.sendgrid.net'
  const smtpPort = Number.parseInt(process.env.SMTP_PORT || '587', 10)
  const smtpUser = process.env.SMTP_USER || 'apikey'
  const smtpPass = process.env.SMTP_PASS

  if (!smtpPass) {
    throw new Error('SMTP_PASS is not configured. Please set SMTP_PASS environment variable.')
  }

  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465, // true for 465, false for other ports
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  })

  return transporter
}

export interface SendEmailOptions {
  to: string | string[]
  subject: string
  html: string
  text?: string
  from?: string
  cc?: string[]
  bcc?: string[]
  attachments?: Array<{
    filename: string
    path?: string
    content?: string | Buffer
    contentType?: string
  }>
}

/**
 * Отправляет email через SMTP
 */
export const sendEmail = async (options: SendEmailOptions): Promise<boolean> => {
  try {
    const emailTransporter = getEmailTransporter()

    const fromEmail = options.from || process.env.FROM_EMAIL || 'noreply@worldwideservices.eu'

    const mailOptions = {
      from: fromEmail,
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ''), // Plain text версия
      cc: options.cc?.join(', '),
      bcc: options.bcc?.join(', '),
      attachments: options.attachments,
    }

    const info = await emailTransporter.sendMail(mailOptions)

    logger.info('Email sent successfully', {
      messageId: info.messageId,
      to: options.to,
      subject: options.subject,
    })

    return true
  } catch (error) {
    logger.error('Error sending email', error instanceof Error ? error : new Error(String(error)), {
      to: options.to,
      subject: options.subject,
    })
    return false
  }
}

/**
 * Отправляет email для восстановления пароля
 */
export const sendPasswordResetEmail = async (
  to: string,
  resetToken: string,
  resetUrl: string,
): Promise<boolean> => {
  const subject = 'Восстановление пароля - World Wide Services'
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .button { display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .button:hover { background-color: #0056b3; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Восстановление пароля</h1>
        <p>Вы запросили восстановление пароля для вашего аккаунта.</p>
        <p>Нажмите на кнопку ниже, чтобы сбросить пароль:</p>
        <a href="${resetUrl}" class="button">Сбросить пароль</a>
        <p>Или скопируйте и вставьте эту ссылку в браузер:</p>
        <p style="word-break: break-all; background: #f5f5f5; padding: 10px; border-radius: 5px;">${resetUrl}</p>
        <p><strong>Ссылка действительна в течение 1 часа.</strong></p>
        <p>Если вы не запрашивали восстановление пароля, проигнорируйте это письмо.</p>
        <div class="footer">
          <p>World Wide Services</p>
          <p>Это автоматическое письмо, пожалуйста, не отвечайте на него.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return await sendEmail({
    to,
    subject,
    html,
  })
}

/**
 * Отправляет email для подтверждения email адреса
 */
export const sendEmailVerificationEmail = async (
  to: string,
  verificationToken: string,
  verificationUrl: string,
): Promise<boolean> => {
  const subject = 'Подтвердите ваш email - World Wide Services'
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .button { display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .button:hover { background-color: #0056b3; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Подтвердите ваш email</h1>
        <p>Спасибо за регистрацию! Пожалуйста, подтвердите ваш email адрес, нажав на кнопку ниже:</p>
        <a href="${verificationUrl}" class="button">Подтвердить email</a>
        <p>Или скопируйте и вставьте эту ссылку в браузер:</p>
        <p style="word-break: break-all; background: #f5f5f5; padding: 10px; border-radius: 5px;">${verificationUrl}</p>
        <p><strong>Ссылка действительна в течение 24 часов.</strong></p>
        <div class="footer">
          <p>World Wide Services</p>
          <p>Это автоматическое письмо, пожалуйста, не отвечайте на него.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return await sendEmail({
    to,
    subject,
    html,
  })
}

/**
 * Отправляет email с шаблоном (для sequences и rule-engine)
 */
export const sendTemplateEmail = async (
  to: string,
  subject: string,
  htmlTemplate: string,
  variables?: Record<string, string>,
): Promise<boolean> => {
  // Заменяем переменные в шаблоне
  let html = htmlTemplate
  if (variables) {
    Object.entries(variables).forEach(([key, value]) => {
      html = html.replace(new RegExp(`{{${key}}}`, 'g'), value)
      html = html.replace(new RegExp(`\\{${key}\\}`, 'g'), value)
    })
  }

  return await sendEmail({
    to,
    subject,
    html,
  })
}

