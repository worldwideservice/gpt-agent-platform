// Типы для Kommo CRM API
export interface KommoPipeline {
 id: number
 name: string
 sort: number
 is_main: boolean
 is_unsorted_on: boolean
 is_archive: boolean
 account_id: number
 _links: {
 self: {
 href: string
 }
 }
}

export interface KommoStatus {
 id: number
 name: string
 sort: number
 is_editable: boolean
 pipeline_id: number
 color: string
 type: number
 account_id: number
 _links: {
 self: {
 href: string
 }
 }
}

export interface KommoContact {
 id: number
 name: string
 first_name?: string
 last_name?: string
 responsible_user_id: number
 group_id: number
 created_by: number
 updated_by: number
 created_at: number
 updated_at: number
 is_deleted: boolean
 account_id: number
 custom_fields_values?: KommoCustomField[]
 _links: {
 self: {
 href: string
 }
 }
}

export interface KommoLead {
 id: number
 name: string
 responsible_user_id: number
 group_id: number
 status_id: number
 pipeline_id: number
 loss_reason_id?: number
 created_by: number
 updated_by: number
 created_at: number
 updated_at: number
 closed_at?: number
 closest_task_at?: number
 is_deleted: boolean
 custom_fields_values?: KommoCustomField[]
 score?: number
 account_id: number
 labor_cost?: number
 _links: {
 self: {
 href: string
 }
 }
}

export interface KommoTask {
 id: number
 responsible_user_id: number
 group_id: number
 entity_id: number
 entity_type: string
 created_by: number
 updated_by: number
 created_at: number
 updated_at: number
 result?: {
 text: string
 }
 task_type_id: number
 text: string
 duration?: number
 complete_till?: number
 is_completed: boolean
 account_id: number
 _links: {
 self: {
 href: string
 }
 }
}

export interface KommoCustomField {
 field_id: number
 field_name: string
 field_code: string
 field_type: string
 values: Array<{
 value: string | number | boolean
 enum_id?: number
 enum_code?: string
 }>
}

export interface KommoOAuthResponse {
 token_type: string
 expires_in: number
 access_token: string
 refresh_token: string
}

export interface KommoApiResponse<T> {
 _page: number
 _links: {
 self: {
 href: string
 }
 next?: {
 href: string
 }
 }
 _embedded: {
 [key: string]: T[]
 }
}

// Типы для каналов в Kommo
export interface KommoChannel {
 id: number
 name: string
 type: 'email' | 'phone' | 'chat' | 'social' | 'web'
 is_active: boolean
 account_id: number
}
