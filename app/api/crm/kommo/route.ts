import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { auth } from '@/auth'
import { KommoAPI } from '@/lib/crm/kommo'
import { createErrorResponse } from '@/lib/utils/error-handler'

/**
 * API endpoint для работы с Kommo CRM
 */

const kommoActionSchema = z.object({
  action: z.enum(['pipelines', 'users', 'lead', 'contact']),
  id: z.string().optional(),
})

const kommoPostSchema = z.object({
  action: z.string().min(1),
  data: z.record(z.unknown()),
})

// GET - Получение данных из Kommo
export async function GET(request: NextRequest) {
 try {
 const session = await auth()
 if (!session?.user?.orgId) {
 const { response, status } = createErrorResponse(
   new Error('Unauthorized'),
   { code: 'AUTHENTICATION_ERROR', logToSentry: false }
 )
 return NextResponse.json(response, { status })
 }

 const searchParams = request.nextUrl.searchParams
 const action = searchParams.get('action')
 const id = searchParams.get('id')

 // Инициализация Kommo API
 const kommo = new KommoAPI({
 domain: process.env.KOMMO_DOMAIN || '',
 clientId: process.env.KOMMO_CLIENT_ID || '',
 clientSecret: process.env.KOMMO_CLIENT_SECRET || '',
 redirectUri: process.env.KOMMO_REDIRECT_URI || '',
 accessToken: process.env.KOMMO_ACCESS_TOKEN || '',
 refreshToken: process.env.KOMMO_REFRESH_TOKEN || '',
 })

 switch (action) {
 case 'pipelines': {
 const pipelines = await kommo.getPipelines()
 return NextResponse.json({ success: true, data: pipelines })
 }

 case 'users': {
 const users = await kommo.getUsers()
 return NextResponse.json({ success: true, data: users })
 }

 case 'lead': {
 if (!id) {
 const { response, status } = createErrorResponse(
   new Error('Lead ID required'),
   { code: 'VALIDATION_ERROR', logToSentry: false }
 )
 return NextResponse.json(response, { status })
 }
 const lead = await kommo.getLead(parseInt(id, 10))
 return NextResponse.json({ success: true, data: lead, timestamp: new Date().toISOString() })
 }

 case 'contact': {
 if (!id) {
 const { response, status } = createErrorResponse(
   new Error('Contact ID required'),
   { code: 'VALIDATION_ERROR', logToSentry: false }
 )
 return NextResponse.json(response, { status })
 }
 const contact = await kommo.getContact(parseInt(id, 10))
 return NextResponse.json({ success: true, data: contact, timestamp: new Date().toISOString() })
 }

 default:
 const { response: defaultResponse, status: defaultStatus } = createErrorResponse(
   new Error('Invalid action'),
   { code: 'INVALID_ACTION', logToSentry: false }
 )
 return NextResponse.json(defaultResponse, { status: defaultStatus })
 }
 } catch (error) {
 const { response, status } = createErrorResponse(error, {
   code: 'KOMMO_API_ERROR',
   logToSentry: true,
 })
 return NextResponse.json(response, { status })
 }
}

// POST - Создание данных в Kommo
export async function POST(request: NextRequest) {
 try {
 const session = await auth()
 if (!session?.user?.orgId) {
 const { response, status } = createErrorResponse(
   new Error('Unauthorized'),
   { code: 'AUTHENTICATION_ERROR', logToSentry: false }
 )
 return NextResponse.json(response, { status })
 }

 const body = await request.json()
 const parsed = kommoPostSchema.safeParse(body)

 if (!parsed.success) {
 const issues = parsed.error.issues.map((issue) => issue.message)
 const { response, status } = createErrorResponse(
   new Error('Validation failed'),
   {
     code: 'VALIDATION_ERROR',
     details: issues,
     logToSentry: false,
   }
 )
 return NextResponse.json(response, { status })
 }

 const { action, data } = parsed.data

 const kommo = new KommoAPI({
 domain: process.env.KOMMO_DOMAIN || '',
 clientId: process.env.KOMMO_CLIENT_ID || '',
 clientSecret: process.env.KOMMO_CLIENT_SECRET || '',
 redirectUri: process.env.KOMMO_REDIRECT_URI || '',
 accessToken: process.env.KOMMO_ACCESS_TOKEN || '',
 refreshToken: process.env.KOMMO_REFRESH_TOKEN || '',
 })

 switch (action) {
 case 'create_lead': {
 const lead = await kommo.createLead(data)
 return NextResponse.json({ success: true, data: lead })
 }

 case 'update_lead': {
 const { id, ...leadData } = data
 const lead = await kommo.updateLead(id, leadData)
 return NextResponse.json({ success: true, data: lead })
 }

 case 'create_contact': {
 const contact = await kommo.createContact(data)
 return NextResponse.json({ success: true, data: contact })
 }

 case 'update_contact': {
 const { id, ...contactData } = data
 const contact = await kommo.updateContact(id, contactData)
 return NextResponse.json({ success: true, data: contact })
 }

 case 'add_note': {
 const { lead_id, note_text } = data
 await kommo.addNoteToLead(lead_id, {
 note_type: 'common',
 params: { text: note_text },
 })
 return NextResponse.json({ success: true })
 }

 case 'search_leads': {
 const leads = await kommo.searchLeads(data.query)
 return NextResponse.json({ success: true, data: leads })
 }

 case 'search_contacts': {
 const contacts = await kommo.searchContacts(data.query)
 return NextResponse.json({ success: true, data: contacts })
 }

 default:
 const { response: defaultResponse, status: defaultStatus } = createErrorResponse(
   new Error('Invalid action'),
   { code: 'INVALID_ACTION', logToSentry: false }
 )
 return NextResponse.json(defaultResponse, { status: defaultStatus })
 }
 } catch (error) {
 const { response, status } = createErrorResponse(error, {
   code: 'KOMMO_API_ERROR',
   logToSentry: true,
 })
 return NextResponse.json(response, { status })
 }
}

