export type Json =
 | string
 | number
 | boolean
 | null
 | { [key: string]: Json | undefined }
 | Json[]

export type Database = {
 public: {
 Tables: {
 organizations: {
 Row: {
 id: string
 name: string
 slug: string
 country: string | null
 settings: Json | null
 created_at: string
 updated_at: string
 }
 Insert: {
 id?: string
 name: string
 slug: string
 country?: string | null
 settings?: Json | null
 created_at?: string
 updated_at?: string
 }
 Update: {
 id?: string
 name?: string
 slug?: string
 country?: string | null
 settings?: Json | null
 created_at?: string
 updated_at?: string
 }
 Relationships: []
 }
 users: {
 Row: {
 id: string
 email: string
 full_name: string | null
 password_hash: string | null
 default_org_id: string | null
 avatar_url: string | null
 locale: string | null
 invited_at: string | null
 last_sign_in_at: string | null
 created_at: string
 updated_at: string
 }
 Insert: {
 id?: string
 email: string
 full_name?: string | null
 password_hash?: string | null
 default_org_id?: string | null
 avatar_url?: string | null
 locale?: string | null
 invited_at?: string | null
 last_sign_in_at?: string | null
 created_at?: string
 updated_at?: string
 }
 Update: {
 id?: string
 email?: string
 full_name?: string | null
 password_hash?: string | null
 default_org_id?: string | null
 avatar_url?: string | null
 locale?: string | null
 invited_at?: string | null
 last_sign_in_at?: string | null
 created_at?: string
 updated_at?: string
 }
 Relationships: [
 {
 foreignKeyName: 'users_default_org_id_fkey'
 columns: ['default_org_id']
 referencedRelation: 'organizations'
 referencedColumns: ['id']
 },
 ]
 }
 organization_members: {
 Row: {
 org_id: string
 user_id: string
 role: string
 status: string
 invited_by: string | null
 created_at: string
 }
 Insert: {
 org_id: string
 user_id: string
 role?: string
 status?: string
 invited_by?: string | null
 created_at?: string
 }
 Update: {
 org_id?: string
 user_id?: string
 role?: string
 status?: string
 invited_by?: string | null
 created_at?: string
 }
 Relationships: [
 {
 foreignKeyName: 'organization_members_org_id_fkey'
 columns: ['org_id']
 referencedRelation: 'organizations'
 referencedColumns: ['id']
 },
 {
 foreignKeyName: 'organization_members_user_id_fkey'
 columns: ['user_id']
 referencedRelation: 'users'
 referencedColumns: ['id']
 },
 {
 foreignKeyName: 'organization_members_invited_by_fkey'
 columns: ['invited_by']
 referencedRelation: 'users'
 referencedColumns: ['id']
 },
 ]
 }
 organization_invites: {
 Row: {
 id: string
 org_id: string
 email: string
 role: string
 invited_by: string | null
 token: string
 expires_at: string
 accepted_at: string | null
 created_at: string
 }
 Insert: {
 id?: string
 org_id: string
 email: string
 role?: string
 invited_by?: string | null
 token: string
 expires_at: string
 accepted_at?: string | null
 created_at?: string
 }
 Update: {
 id?: string
 org_id?: string
 email?: string
 role?: string
 invited_by?: string | null
 token?: string
 expires_at?: string
 accepted_at?: string | null
 created_at?: string
 }
 Relationships: [
 {
 foreignKeyName: 'organization_invites_org_id_fkey'
 columns: ['org_id']
 referencedRelation: 'organizations'
 referencedColumns: ['id']
 },
 {
 foreignKeyName: 'organization_invites_invited_by_fkey'
 columns: ['invited_by']
 referencedRelation: 'users'
 referencedColumns: ['id']
 },
 ]
 }
 password_resets: {
 Row: {
 id: string
 user_id: string
 token_hash: string
 expires_at: string
 used_at: string | null
 created_at: string
 }
 Insert: {
 id?: string
 user_id: string
 token_hash: string
 expires_at: string
 used_at?: string | null
 created_at?: string
 }
 Update: {
 id?: string
 user_id?: string
 token_hash?: string
 expires_at?: string
 used_at?: string | null
 created_at?: string
 }
 Relationships: [
 {
 foreignKeyName: 'password_resets_user_id_fkey'
 columns: ['user_id']
 referencedRelation: 'users'
 referencedColumns: ['id']
 },
 ]
 }
 subscriptions: {
 Row: {
 org_id: string
 plan: string
 status: string
 token_quota: number
 token_used: number
 renews_at: string | null
 created_at: string
 updated_at: string
 }
 Insert: {
 org_id: string
 plan: string
 status?: string
 token_quota?: number
 token_used?: number
 renews_at?: string | null
 created_at?: string
 updated_at?: string
 }
 Update: {
 org_id?: string
 plan?: string
 status?: string
 token_quota?: number
 token_used?: number
 renews_at?: string | null
 created_at?: string
 updated_at?: string
 }
 Relationships: [
 {
 foreignKeyName: 'subscriptions_org_id_fkey'
 columns: ['org_id']
 referencedRelation: 'organizations'
 referencedColumns: ['id']
 },
 ]
 }
 usage_daily: {
 Row: {
 org_id: string
 usage_date: string
 agent_responses: number
 tokens_consumed: number
 interactions: number
 errors: number
 }
 Insert: {
 org_id: string
 usage_date: string
 agent_responses?: number
 tokens_consumed?: number
 interactions?: number
 errors?: number
 }
 Update: {
 org_id?: string
 usage_date?: string
 agent_responses?: number
 tokens_consumed?: number
 interactions?: number
 errors?: number
 }
 Relationships: [
 {
 foreignKeyName: 'usage_daily_org_id_fkey'
 columns: ['org_id']
 referencedRelation: 'organizations'
 referencedColumns: ['id']
 },
 ]
 }
 agents: {
 Row: {
 id: string
 org_id: string
 connection_id: string | null
 name: string
 status: 'active' | 'inactive' | 'draft'
 default_model: string | null
 owner_name: string | null
 messages_total: number
 last_activity_at: string | null
 temperature: number
 max_tokens: number | null
 instructions: string | null
 system_prompt: string | null
 response_delay_seconds: number | null
 settings: Json | null
 created_at: string
 updated_at: string
 }
 Insert: {
 id?: string
 org_id: string
 connection_id?: string | null
 name: string
 status?: 'active' | 'inactive' | 'draft'
 default_model?: string | null
 owner_name?: string | null
 messages_total?: number
 last_activity_at?: string | null
 temperature?: number
 max_tokens?: number | null
 instructions?: string | null
 system_prompt?: string | null
 response_delay_seconds?: number | null
 settings?: Json | null
 created_at?: string
 updated_at?: string
 }
 Update: {
 id?: string
 org_id?: string
 connection_id?: string | null
 name?: string
 status?: 'active' | 'inactive' | 'draft'
 default_model?: string | null
 owner_name?: string | null
 messages_total?: number
 last_activity_at?: string | null
 temperature?: number
 max_tokens?: number | null
 instructions?: string | null
 system_prompt?: string | null
 response_delay_seconds?: number | null
 settings?: Json | null
 created_at?: string
 updated_at?: string
 }
 Relationships: [
 {
 foreignKeyName: 'agents_connection_id_fkey'
 columns: ['connection_id']
 referencedRelation: 'crm_connections'
 referencedColumns: ['id']
 },
 {
 foreignKeyName: 'agents_org_id_fkey'
 columns: ['org_id']
 referencedRelation: 'organizations'
 referencedColumns: ['id']
 },
 ]
 }
 crm_connections: {
 Row: {
 id: string
 org_id: string
 provider: string
 base_domain: string
 access_token: string
 refresh_token: string | null
 expires_at: string | null
 scope: string[] | null
 account_id: string | null
 metadata: Json | null
 created_at: string
 updated_at: string
 }
 Insert: {
 id?: string
 org_id: string
 provider?: string
 base_domain: string
 access_token: string
 refresh_token?: string | null
 expires_at?: string | null
 scope?: string[] | null
 account_id?: string | null
 metadata?: Json | null
 created_at?: string
 updated_at?: string
 }
 Update: {
 id?: string
 org_id?: string
 provider?: string
 base_domain?: string
 access_token?: string
 refresh_token?: string | null
 expires_at?: string | null
 scope?: string[] | null
 account_id?: string | null
 metadata?: Json | null
 created_at?: string
 updated_at?: string
 }
 Relationships: [
 {
 foreignKeyName: 'crm_connections_org_id_fkey'
 columns: ['org_id']
 referencedRelation: 'organizations'
 referencedColumns: ['id']
 },
 ]
 }
 crm_credentials: {
 Row: {
 id: string
 org_id: string
 provider: string
 client_id: string
 client_secret: string
 redirect_uri: string | null
 created_at: string
 updated_at: string
 }
 Insert: {
 id?: string
 org_id: string
 provider?: string
 client_id: string
 client_secret: string
 redirect_uri?: string | null
 created_at?: string
 updated_at?: string
 }
 Update: {
 id?: string
 org_id?: string
 provider?: string
 client_id?: string
 client_secret?: string
 redirect_uri?: string | null
 created_at?: string
 updated_at?: string
 }
 Relationships: [
 {
 foreignKeyName: 'crm_credentials_org_id_fkey'
 columns: ['org_id']
 referencedRelation: 'organizations'
 referencedColumns: ['id']
 },
 ]
 }
 crm_pipelines: {
 Row: {
 id: string
 connection_id: string
 external_id: string
 name: string
 is_active: boolean | null
 sort_order: number | null
 metadata: Json | null
 created_at: string
 updated_at: string
 }
 Insert: {
 id?: string
 connection_id: string
 external_id: string
 name: string
 is_active?: boolean | null
 sort_order?: number | null
 metadata?: Json | null
 created_at?: string
 updated_at?: string
 }
 Update: {
 id?: string
 connection_id?: string
 external_id?: string
 name?: string
 is_active?: boolean | null
 sort_order?: number | null
 metadata?: Json | null
 created_at?: string
 updated_at?: string
 }
 Relationships: [
 {
 foreignKeyName: 'crm_pipelines_connection_id_fkey'
 columns: ['connection_id']
 referencedRelation: 'crm_connections'
 referencedColumns: ['id']
 },
 ]
 }
 crm_pipeline_stages: {
 Row: {
 id: string
 pipeline_id: string
 external_id: string
 name: string
 sort_order: number | null
 metadata: Json | null
 created_at: string
 updated_at: string
 }
 Insert: {
 id?: string
 pipeline_id: string
 external_id: string
 name: string
 sort_order?: number | null
 metadata?: Json | null
 created_at?: string
 updated_at?: string
 }
 Update: {
 id?: string
 pipeline_id?: string
 external_id?: string
 name?: string
 sort_order?: number | null
 metadata?: Json | null
 created_at?: string
 updated_at?: string
 }
 Relationships: [
 {
 foreignKeyName: 'crm_pipeline_stages_pipeline_id_fkey'
 columns: ['pipeline_id']
 referencedRelation: 'crm_pipelines'
 referencedColumns: ['id']
 },
 ]
 }
 knowledge_base_categories: {
 Row: {
 id: string
 org_id: string
 name: string
 description: string | null
 parent_id: string | null
 sort_order: number | null
 created_at: string
 updated_at: string
 }
 Insert: {
 id?: string
 org_id: string
 name: string
 description?: string | null
 parent_id?: string | null
 sort_order?: number | null
 created_at?: string
 updated_at?: string
 }
 Update: {
 id?: string
 org_id?: string
 name?: string
 description?: string | null
 parent_id?: string | null
 sort_order?: number | null
 created_at?: string
 updated_at?: string
 }
 Relationships: [
 {
 foreignKeyName: 'knowledge_base_categories_org_id_fkey'
 columns: ['org_id']
 referencedRelation: 'organizations'
 referencedColumns: ['id']
 },
 {
 foreignKeyName: 'knowledge_base_categories_parent_id_fkey'
 columns: ['parent_id']
 referencedRelation: 'knowledge_base_categories'
 referencedColumns: ['id']
 },
 ]
 }
 knowledge_base_articles: {
 Row: {
 id: string
 org_id: string
 category_id: string | null
 title: string
 content: string
 slug: string | null
 is_published: boolean | null
 views_count: number | null
 created_at: string
 updated_at: string
 }
 Insert: {
 id?: string
 org_id: string
 category_id?: string | null
 title: string
 content: string
 slug?: string | null
 is_published?: boolean | null
 views_count?: number | null
 created_at?: string
 updated_at?: string
 }
 Update: {
 id?: string
 org_id?: string
 category_id?: string | null
 title?: string
 content?: string
 slug?: string | null
 is_published?: boolean | null
 views_count?: number | null
 created_at?: string
 updated_at?: string
 }
 Relationships: [
 {
 foreignKeyName: 'knowledge_base_articles_category_id_fkey'
 columns: ['category_id']
 referencedRelation: 'knowledge_base_categories'
 referencedColumns: ['id']
 },
 {
 foreignKeyName: 'knowledge_base_articles_org_id_fkey'
 columns: ['org_id']
 referencedRelation: 'organizations'
 referencedColumns: ['id']
 },
 ]
 }
 knowledge_chunks: {
 Row: {
 id: string
 agent_id: string | null
 org_id: string
 asset_id: string | null
 article_id: string | null
 content: string
 metadata: Json | null
 embedding: number[] | null
 created_at: string
 }
 Insert: {
 id?: string
 agent_id?: string | null
 org_id: string
 asset_id?: string | null
 article_id?: string | null
 content: string
 metadata?: Json | null
 embedding?: number[] | null
 created_at?: string
 }
 Update: {
 id?: string
 agent_id?: string | null
 org_id?: string
 asset_id?: string | null
 article_id?: string | null
 content?: string
 metadata?: Json | null
 embedding?: number[] | null
 created_at?: string
 }
 Relationships: [
 {
 foreignKeyName: 'knowledge_chunks_agent_id_fkey'
 columns: ['agent_id']
 referencedRelation: 'agents'
 referencedColumns: ['id']
 },
 {
 foreignKeyName: 'knowledge_chunks_article_id_fkey'
 columns: ['article_id']
 referencedRelation: 'knowledge_base_articles'
 referencedColumns: ['id']
 },
 {
 foreignKeyName: 'knowledge_chunks_asset_id_fkey'
 columns: ['asset_id']
 referencedRelation: 'agent_assets'
 referencedColumns: ['id']
 },
 {
 foreignKeyName: 'knowledge_chunks_org_id_fkey'
 columns: ['org_id']
 referencedRelation: 'organizations'
 referencedColumns: ['id']
 },
 ]
 }
 oauth_states: {
 Row: {
 id: string
 org_id: string
 provider: string
 state: string
 redirect_uri: string
 base_domain: string
 created_at: string
 expires_at: string
 }
 Insert: {
 id?: string
 org_id: string
 provider?: string
 state: string
 redirect_uri: string
 base_domain: string
 created_at?: string
 expires_at?: string
 }
 Update: {
 id?: string
 org_id?: string
 provider?: string
 state?: string
 redirect_uri?: string
 base_domain?: string
 created_at?: string
 expires_at?: string
 }
 Relationships: [
 {
 foreignKeyName: 'oauth_states_org_id_fkey'
 columns: ['org_id']
 referencedRelation: 'organizations'
 referencedColumns: ['id']
 },
 ]
 }
 agent_activity_metrics: {
 Row: {
 id: string
 agent_id: string
 org_id: string
 activity_date: string
 messages_count: number
 created_at: string
 }
 Insert: {
 id?: string
 agent_id: string
 org_id: string
 activity_date: string
 messages_count: number
 created_at?: string
 }
 Update: {
 id?: string
 agent_id?: string
 org_id?: string
 activity_date?: string
 messages_count?: number
 created_at?: string
 }
 Relationships: [
 {
 foreignKeyName: 'agent_activity_metrics_agent_id_fkey'
 columns: ['agent_id']
 referencedRelation: 'agents'
 referencedColumns: ['id']
 },
 {
 foreignKeyName: 'agent_activity_metrics_org_id_fkey'
 columns: ['org_id']
 referencedRelation: 'organizations'
 referencedColumns: ['id']
 },
 ]
 }
 agent_sequences: {
 Row: {
 id: string
 org_id: string
 agent_id: string
 name: string
 description: string | null
 is_active: boolean | null
 sort_order: number | null
 settings: Json | null
 created_at: string
 updated_at: string
 }
 Insert: {
 id?: string
 org_id: string
 agent_id: string
 name: string
 description?: string | null
 is_active?: boolean | null
 sort_order?: number | null
 settings?: Json | null
 created_at?: string
 updated_at?: string
 }
 Update: {
 id?: string
 org_id?: string
 agent_id?: string
 name?: string
 description?: string | null
 is_active?: boolean | null
 sort_order?: number | null
 settings?: Json | null
 created_at?: string
 updated_at?: string
 }
 Relationships: [
 {
 foreignKeyName: 'agent_sequences_agent_id_fkey'
 columns: ['agent_id']
 referencedRelation: 'agents'
 referencedColumns: ['id']
 },
 {
 foreignKeyName: 'agent_sequences_org_id_fkey'
 columns: ['org_id']
 referencedRelation: 'organizations'
 referencedColumns: ['id']
 },
 ]
 }
 agent_sequence_steps: {
 Row: {
 id: string
 sequence_id: string
 step_type: string
 payload: Json | null
 delay_seconds: number | null
 sort_order: number | null
 created_at: string
 updated_at: string
 }
 Insert: {
 id?: string
 sequence_id: string
 step_type: string
 payload?: Json | null
 delay_seconds?: number | null
 sort_order?: number | null
 created_at?: string
 updated_at?: string
 }
 Update: {
 id?: string
 sequence_id?: string
 step_type?: string
 payload?: Json | null
 delay_seconds?: number | null
 sort_order?: number | null
 created_at?: string
 updated_at?: string
 }
 Relationships: [
 {
 foreignKeyName: 'agent_sequence_steps_sequence_id_fkey'
 columns: ['sequence_id']
 referencedRelation: 'agent_sequences'
 referencedColumns: ['id']
 },
 ]
 }
 agent_channels: {
 Row: {
 id: string
 org_id: string
 agent_id: string
 channel: string
 is_enabled: boolean | null
 settings: Json | null
 created_at: string
 updated_at: string
 }
 Insert: {
 id?: string
 org_id: string
 agent_id: string
 channel: string
 is_enabled?: boolean | null
 settings?: Json | null
 created_at?: string
 updated_at?: string
 }
 Update: {
 id?: string
 org_id?: string
 agent_id?: string
 channel?: string
 is_enabled?: boolean | null
 settings?: Json | null
 created_at?: string
 updated_at?: string
 }
 Relationships: [
 {
 foreignKeyName: 'agent_channels_agent_id_fkey'
 columns: ['agent_id']
 referencedRelation: 'agents'
 referencedColumns: ['id']
 },
 {
 foreignKeyName: 'agent_channels_org_id_fkey'
 columns: ['org_id']
 referencedRelation: 'organizations'
 referencedColumns: ['id']
 },
 ]
 }
 webhook_events: {
 Row: {
 id: string
 org_id: string
 provider: string
 event_type: string
 payload: Json
 status: string
 error: string | null
 created_at: string
 processed_at: string | null
 }
 Insert: {
 id?: string
 org_id: string
 provider: string
 event_type: string
 payload: Json
 status?: string
 error?: string | null
 created_at?: string
 processed_at?: string | null
 }
 Update: {
 id?: string
 org_id?: string
 provider?: string
 event_type?: string
 payload?: Json
 status?: string
 error?: string | null
 created_at?: string
 processed_at?: string | null
 }
 Relationships: [
 {
 foreignKeyName: 'webhook_events_org_id_fkey'
 columns: ['org_id']
 referencedRelation: 'organizations'
 referencedColumns: ['id']
 },
 ]
 }
 audit_logs: {
 Row: {
 id: string
 org_id: string
 user_id: string | null
 action: string
 entity: string
 entity_id: string | null
 metadata: Json | null
 created_at: string
 }
 Insert: {
 id?: string
 org_id: string
 user_id?: string | null
 action: string
 entity: string
 entity_id?: string | null
 metadata?: Json | null
 created_at?: string
 }
 Update: {
 id?: string
 org_id?: string
 user_id?: string | null
 action?: string
 entity?: string
 entity_id?: string | null
 metadata?: Json | null
 created_at?: string
 }
 Relationships: [
 {
 foreignKeyName: 'audit_logs_org_id_fkey'
 columns: ['org_id']
 referencedRelation: 'organizations'
 referencedColumns: ['id']
 },
 {
 foreignKeyName: 'audit_logs_user_id_fkey'
 columns: ['user_id']
 referencedRelation: 'users'
 referencedColumns: ['id']
 },
 ]
 }
 }
 Views: {
 dashboard_kpis: {
 Row: {
 organization_id: string
 monthly_responses: number
 monthly_change: number
 weekly_responses: number
 today_responses: number
 }
 }
 }
 Functions: {
 calculate_dashboard_stats: {
 Args: {
 organization_uuid: string
 reference_date?: string | null
 }
 Returns: {
 monthly_responses: number
 monthly_change: number
 weekly_responses: number
 today_responses: number
 }
 }
 }
 Enums: {
 agent_status: 'active' | 'inactive' | 'draft'
 }
 CompositeTypes: {
 [_ in never]: never
 }
 }
}

export type AgentRow = Database['public']['Tables']['agents']['Row']
export type AgentStatus = AgentRow['status']
export type OrganizationRow = Database['public']['Tables']['organizations']['Row']
export type UserRow = Database['public']['Tables']['users']['Row']
export type OrganizationMemberRow = Database['public']['Tables']['organization_members']['Row']
export type CrmConnectionRow = Database['public']['Tables']['crm_connections']['Row']
export type CrmCredentialsRow = Database['public']['Tables']['crm_credentials']['Row']
export type CrmPipelineRow = Database['public']['Tables']['crm_pipelines']['Row']
export type CrmPipelineStageRow = Database['public']['Tables']['crm_pipeline_stages']['Row']
export type OAuthStateRow = Database['public']['Tables']['oauth_states']['Row']
export type PasswordResetRow = Database['public']['Tables']['password_resets']['Row']
export type UsageDailyRow = Database['public']['Tables']['usage_daily']['Row']
export type WebhookEventRow = Database['public']['Tables']['webhook_events']['Row']
export type KnowledgeBaseCategoryRow = Database['public']['Tables']['knowledge_base_categories']['Row']
export type KnowledgeBaseArticleRow = Database['public']['Tables']['knowledge_base_articles']['Row']
export type KnowledgeChunkRow = Database['public']['Tables']['knowledge_chunks']['Row']
export type AgentSequenceRow = Database['public']['Tables']['agent_sequences']['Row']
export type AgentSequenceStepRow = Database['public']['Tables']['agent_sequence_steps']['Row']
export type AgentChannelRow = Database['public']['Tables']['agent_channels']['Row']
export type AuditLogRow = Database['public']['Tables']['audit_logs']['Row']

export type AgentActivityMetricRow = Database['public']['Tables']['agent_activity_metrics']['Row']

// Типы для таблиц, которые могут отсутствовать в Database, но используются в коде
export type AgentAssetRow = {
 id: string
 agent_id: string
 org_id: string
 type: string
 source_name: string | null
 storage_path: string | null
 status: 'pending' | 'processing' | 'completed' | 'failed'
 error: string | null
 file_size: number | null
 mime_type: string | null
 chunks_count: number | null
 processing_error: string | null
 created_at: string
 processed_at: string | null
}

export type SubscriptionRow = Database['public']['Tables']['subscriptions']['Row']

export type DashboardStatsViewRow = Database['public']['Views']['dashboard_kpis']['Row']

export type DashboardStatsFunctionResult = Database['public']['Functions']['calculate_dashboard_stats']['Returns']
