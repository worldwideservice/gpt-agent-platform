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

export type AgentActivityMetricRow = Database['public']['Tables']['agent_activity_metrics']['Row']

export type DashboardStatsViewRow = Database['public']['Views']['dashboard_kpis']['Row']

export type DashboardStatsFunctionResult = Database['public']['Functions']['calculate_dashboard_stats']['Returns']
