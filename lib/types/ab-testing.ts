/**
 * A/B Testing Types
 * Types for experiment management and statistical testing
 */

export type ExperimentStatus = 'draft' | 'running' | 'paused' | 'completed'
export type Variant = 'control' | 'test'
export type Winner = 'control' | 'test' | 'inconclusive' | null

export interface Experiment {
  id: string
  org_id: string

  // Metadata
  name: string
  description?: string
  hypothesis?: string

  // Status
  status: ExperimentStatus

  // Traffic
  traffic_percentage: number // 0-100

  // Variants
  control_variant: VariantConfig
  test_variant: VariantConfig

  // Metrics
  primary_metric: string
  secondary_metrics?: string[]

  // Statistical settings
  confidence_level: number // 0.95 = 95%
  min_sample_size: number

  // Time period
  started_at?: string
  ended_at?: string

  // Results
  winner?: Winner
  results?: ExperimentResults

  // Metadata
  created_by?: string
  created_at: string
  updated_at: string
}

export interface VariantConfig {
  // Agent configuration
  agent_id?: string

  // Override settings
  model?: string
  temperature?: number
  max_tokens?: number
  system_prompt?: string

  // Or complete agent config
  config?: Record<string, any>

  // Variant metadata
  name: string
  description?: string
}

export interface ExperimentAssignment {
  id: string
  experiment_id: string
  user_id?: string
  session_id?: string
  variant: Variant
  assigned_at: string
}

export interface ExperimentEvent {
  id: string
  experiment_id: string
  assignment_id?: string
  event_type: string
  event_value?: number
  event_metadata?: Record<string, any>
  variant: Variant
  created_at: string
}

export interface VariantStats {
  variant: Variant
  total_users: number
  total_events: number
  conversions: number
  conversion_rate: number
  avg_rating?: number
  avg_response_time?: number
}

export interface ExperimentResults {
  control: VariantStats
  test: VariantStats

  // Statistical test results
  statistical_significance?: {
    chi_square: number
    p_value: number
    is_significant: boolean
    confidence_level: number
  }

  // Winner determination
  winner: Winner
  improvement_percentage?: number // % improvement of test over control

  // Recommendation
  recommendation: string
}

export interface CreateExperimentInput {
  org_id: string
  name: string
  description?: string
  hypothesis?: string

  traffic_percentage?: number

  control_variant: VariantConfig
  test_variant: VariantConfig

  primary_metric: string
  secondary_metrics?: string[]

  confidence_level?: number
  min_sample_size?: number
}

export interface UpdateExperimentInput {
  name?: string
  description?: string
  hypothesis?: string
  status?: ExperimentStatus
  traffic_percentage?: number
  winner?: Winner
  results?: ExperimentResults
}

export type MetricType =
  | 'conversion'
  | 'rating'
  | 'response_time'
  | 'token_usage'
  | 'cost'
  | 'error'
  | 'custom'
