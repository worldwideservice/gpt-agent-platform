import { NextRequest, NextResponse } from 'next/server'

import { KommoAPI } from '@/lib/crm/kommo'

/**
 * API endpoint для работы с Kommo CRM
 */

// GET - Получение данных из Kommo
export async function GET(request: NextRequest) {
 try {
 const searchParams = request.nextUrl.searchParams
 const action = searchParams.get('action')

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
 const leadId = searchParams.get('id')
 if (!leadId) {
 return NextResponse.json(
 { success: false, error: 'Lead ID required' },
 { status: 400 }
 )
 }
 const lead = await kommo.getLead(parseInt(leadId, 10))
 return NextResponse.json({ success: true, data: lead })
 }

 case 'contact': {
 const contactId = searchParams.get('id')
 if (!contactId) {
 return NextResponse.json(
 { success: false, error: 'Contact ID required' },
 { status: 400 }
 )
 }
 const contact = await kommo.getContact(parseInt(contactId, 10))
 return NextResponse.json({ success: true, data: contact })
 }

 default:
 return NextResponse.json(
 { success: false, error: 'Invalid action' },
 { status: 400 }
 )
 }
 } catch (error) {
 console.error('Kommo API Error:', error)
 return NextResponse.json(
 { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
 { status: 500 }
 )
 }
}

// POST - Создание данных в Kommo
export async function POST(request: NextRequest) {
 try {
 const body = await request.json()
 const { action, data } = body

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
 return NextResponse.json(
 { success: false, error: 'Invalid action' },
 { status: 400 }
 )
 }
 } catch (error) {
 console.error('Kommo API Error:', error)
 return NextResponse.json(
 { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
 { status: 500 }
 )
 }
}

