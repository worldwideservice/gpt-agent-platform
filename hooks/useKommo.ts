'use client'

import { useState, useCallback } from 'react'

import type { KommoLead, KommoContact } from '@/lib/crm/kommo'

interface UseKommoReturn {
 loading: boolean
 error: string | null
 createLead: (lead: KommoLead) => Promise<KommoLead | null>
 updateLead: (id: number, lead: Partial<KommoLead>) => Promise<KommoLead | null>
 getLead: (id: number) => Promise<KommoLead | null>
 searchLeads: (query: string) => Promise<KommoLead[]>
 createContact: (contact: KommoContact) => Promise<KommoContact | null>
 updateContact: (id: number, contact: Partial<KommoContact>) => Promise<KommoContact | null>
 getContact: (id: number) => Promise<KommoContact | null>
 searchContacts: (query: string) => Promise<KommoContact[]>
 addNote: (leadId: number, noteText: string) => Promise<boolean>
 getPipelines: () => Promise<Array<{ id: number; name: string }>>
 getUsers: () => Promise<Array<{ id: number; name: string; email: string }>>
}

export const useKommo = (): UseKommoReturn => {
 const [loading, setLoading] = useState(false)
 const [error, setError] = useState<string | null>(null)

 const apiRequest = useCallback(async <T,>(
 endpoint: string,
 options: RequestInit = {}
 ): Promise<T | null> => {
 setLoading(true)
 setError(null)

 try {
 const response = await fetch(`/api/crm/kommo${endpoint}`, {
 ...options,
 headers: {
 'Content-Type': 'application/json',
 ...options.headers,
 },
 })

 const result = await response.json()

 if (!result.success) {
 throw new Error(result.error || 'API request failed')
 }

 return result.data
 } catch (err) {
 const errorMessage = err instanceof Error ? err.message : 'Unknown error'
 setError(errorMessage)
 console.error('Kommo API Error:', errorMessage)
 return null
 } finally {
 setLoading(false)
 }
 }, [])

 const createLead = useCallback(
 async (lead: KommoLead): Promise<KommoLead | null> => {
 return apiRequest<KommoLead>('', {
 method: 'POST',
 body: JSON.stringify({ action: 'create_lead', data: lead }),
 })
 },
 [apiRequest]
 )

 const updateLead = useCallback(
 async (id: number, lead: Partial<KommoLead>): Promise<KommoLead | null> => {
 return apiRequest<KommoLead>('', {
 method: 'POST',
 body: JSON.stringify({ action: 'update_lead', data: { id, ...lead } }),
 })
 },
 [apiRequest]
 )

 const getLead = useCallback(
 async (id: number): Promise<KommoLead | null> => {
 return apiRequest<KommoLead>(`?action=lead&id=${id}`)
 },
 [apiRequest]
 )

 const searchLeads = useCallback(
 async (query: string): Promise<KommoLead[]> => {
 const result = await apiRequest<KommoLead[]>('', {
 method: 'POST',
 body: JSON.stringify({ action: 'search_leads', data: { query } }),
 })
 return result || []
 },
 [apiRequest]
 )

 const createContact = useCallback(
 async (contact: KommoContact): Promise<KommoContact | null> => {
 return apiRequest<KommoContact>('', {
 method: 'POST',
 body: JSON.stringify({ action: 'create_contact', data: contact }),
 })
 },
 [apiRequest]
 )

 const updateContact = useCallback(
 async (id: number, contact: Partial<KommoContact>): Promise<KommoContact | null> => {
 return apiRequest<KommoContact>('', {
 method: 'POST',
 body: JSON.stringify({ action: 'update_contact', data: { id, ...contact } }),
 })
 },
 [apiRequest]
 )

 const getContact = useCallback(
 async (id: number): Promise<KommoContact | null> => {
 return apiRequest<KommoContact>(`?action=contact&id=${id}`)
 },
 [apiRequest]
 )

 const searchContacts = useCallback(
 async (query: string): Promise<KommoContact[]> => {
 const result = await apiRequest<KommoContact[]>('', {
 method: 'POST',
 body: JSON.stringify({ action: 'search_contacts', data: { query } }),
 })
 return result || []
 },
 [apiRequest]
 )

 const addNote = useCallback(
 async (leadId: number, noteText: string): Promise<boolean> => {
 const result = await apiRequest<boolean>('', {
 method: 'POST',
 body: JSON.stringify({
 action: 'add_note',
 data: { lead_id: leadId, note_text: noteText },
 }),
 })
 return result !== null
 },
 [apiRequest]
 )

 const getPipelines = useCallback(async () => {
 const result = await apiRequest<Array<{ id: number; name: string }>>('?action=pipelines')
 return result || []
 }, [apiRequest])

 const getUsers = useCallback(async () => {
 const result = await apiRequest<Array<{ id: number; name: string; email: string }>>(
 '?action=users'
 )
 return result || []
 }, [apiRequest])

 return {
 loading,
 error,
 createLead,
 updateLead,
 getLead,
 searchLeads,
 createContact,
 updateContact,
 getContact,
 searchContacts,
 addNote,
 getPipelines,
 getUsers,
 }
}

