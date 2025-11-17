/**
 * A/B Testing Service
 * Manages experiments, variant assignments, and statistical analysis
 */

import { createClient } from '@supabase/supabase-js'
import { logger } from '@/lib/logger'
import type {
  Experiment,
  ExperimentAssignment,
  ExperimentEvent,
  VariantStats,
  ExperimentResults,
  CreateExperimentInput,
  UpdateExperimentInput,
  Variant,
  MetricType,
} from '@/lib/types/ab-testing'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * Create a new experiment
 */
export async function createExperiment(
  input: CreateExperimentInput
): Promise<Experiment> {
  try {
    logger.info('Creating experiment', {
      name: input.name,
      orgId: input.org_id,
    })

    const { data, error } = await supabase
      .from('experiments')
      .insert({
        org_id: input.org_id,
        name: input.name,
        description: input.description,
        hypothesis: input.hypothesis,
        traffic_percentage: input.traffic_percentage || 50,
        control_variant: input.control_variant,
        test_variant: input.test_variant,
        primary_metric: input.primary_metric,
        secondary_metrics: input.secondary_metrics,
        confidence_level: input.confidence_level || 0.95,
        min_sample_size: input.min_sample_size || 100,
        status: 'draft',
      })
      .select()
      .single()

    if (error) throw error

    logger.info('Experiment created', { experimentId: data.id })
    return data
  } catch (error) {
    logger.error('Failed to create experiment', { error })
    throw error
  }
}

/**
 * Get experiment by ID
 */
export async function getExperiment(id: string): Promise<Experiment | null> {
  try {
    const { data, error } = await supabase
      .from('experiments')
      .select()
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }

    return data
  } catch (error) {
    logger.error('Failed to get experiment', { error, id })
    throw error
  }
}

/**
 * Update experiment
 */
export async function updateExperiment(
  id: string,
  updates: UpdateExperimentInput
): Promise<Experiment> {
  try {
    const { data, error } = await supabase
      .from('experiments')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    logger.info('Experiment updated', { experimentId: id })
    return data
  } catch (error) {
    logger.error('Failed to update experiment', { error, id })
    throw error
  }
}

/**
 * Start experiment (changes status to running)
 */
export async function startExperiment(id: string): Promise<Experiment> {
  return updateExperiment(id, {
    status: 'running',
  })
}

/**
 * Stop experiment (changes status to completed)
 */
export async function stopExperiment(id: string): Promise<Experiment> {
  // Calculate final results
  const results = await calculateResults(id)

  return updateExperiment(id, {
    status: 'completed',
    results,
    winner: results.winner,
  })
}

/**
 * Assign user to variant (with traffic percentage consideration)
 */
export async function assignVariant(
  experimentId: string,
  userId?: string,
  sessionId?: string
): Promise<ExperimentAssignment> {
  try {
    // Get experiment
    const experiment = await getExperiment(experimentId)
    if (!experiment) {
      throw new Error('Experiment not found')
    }

    // Check if already assigned
    const existing = await getAssignment(experimentId, userId, sessionId)
    if (existing) {
      return existing
    }

    // Determine if user should be in experiment based on traffic percentage
    const random = Math.random() * 100
    if (random > experiment.traffic_percentage) {
      // User not in experiment, assign to control
      return createAssignment(experimentId, 'control', userId, sessionId)
    }

    // Randomly assign to control or test (50/50 split)
    const variant: Variant = Math.random() < 0.5 ? 'control' : 'test'

    return createAssignment(experimentId, variant, userId, sessionId)
  } catch (error) {
    logger.error('Failed to assign variant', { error, experimentId })
    throw error
  }
}

/**
 * Get existing assignment
 */
async function getAssignment(
  experimentId: string,
  userId?: string,
  sessionId?: string
): Promise<ExperimentAssignment | null> {
  try {
    let query = supabase
      .from('experiment_assignments')
      .select()
      .eq('experiment_id', experimentId)

    if (userId) {
      query = query.eq('user_id', userId)
    } else if (sessionId) {
      query = query.eq('session_id', sessionId)
    } else {
      return null
    }

    const { data, error } = await query.maybeSingle()

    if (error) throw error

    return data
  } catch (error) {
    logger.error('Failed to get assignment', { error })
    throw error
  }
}

/**
 * Create new assignment
 */
async function createAssignment(
  experimentId: string,
  variant: Variant,
  userId?: string,
  sessionId?: string
): Promise<ExperimentAssignment> {
  try {
    const { data, error } = await supabase
      .from('experiment_assignments')
      .insert({
        experiment_id: experimentId,
        variant,
        user_id: userId,
        session_id: sessionId,
      })
      .select()
      .single()

    if (error) throw error

    logger.debug('Variant assigned', {
      experimentId,
      variant,
      userId,
      sessionId,
    })

    return data
  } catch (error) {
    logger.error('Failed to create assignment', { error })
    throw error
  }
}

/**
 * Track event for experiment
 */
export async function trackEvent(
  experimentId: string,
  eventType: MetricType | string,
  eventValue?: number,
  metadata?: Record<string, any>,
  userId?: string,
  sessionId?: string
): Promise<void> {
  try {
    // Get assignment
    const assignment = await getAssignment(experimentId, userId, sessionId)
    if (!assignment) {
      logger.warn('No assignment found for event', {
        experimentId,
        userId,
        sessionId,
      })
      return
    }

    // Track event
    const { error } = await supabase.from('experiment_events').insert({
      experiment_id: experimentId,
      assignment_id: assignment.id,
      event_type: eventType,
      event_value: eventValue,
      event_metadata: metadata,
      variant: assignment.variant,
    })

    if (error) throw error

    logger.debug('Event tracked', {
      experimentId,
      eventType,
      variant: assignment.variant,
    })
  } catch (error) {
    logger.error('Failed to track event', { error, experimentId, eventType })
    throw error
  }
}

/**
 * Get experiment statistics
 */
export async function getExperimentStats(
  experimentId: string
): Promise<{ control: VariantStats; test: VariantStats }> {
  try {
    const { data, error } = await supabase.rpc('get_experiment_stats', {
      p_experiment_id: experimentId,
    })

    if (error) throw error

    const control = data.find((s: VariantStats) => s.variant === 'control')
    const test = data.find((s: VariantStats) => s.variant === 'test')

    return {
      control: control || createEmptyStats('control'),
      test: test || createEmptyStats('test'),
    }
  } catch (error) {
    logger.error('Failed to get experiment stats', { error, experimentId })
    throw error
  }
}

function createEmptyStats(variant: Variant): VariantStats {
  return {
    variant,
    total_users: 0,
    total_events: 0,
    conversions: 0,
    conversion_rate: 0,
    avg_rating: undefined,
    avg_response_time: undefined,
  }
}

/**
 * Calculate experiment results with statistical significance
 */
export async function calculateResults(
  experimentId: string
): Promise<ExperimentResults> {
  try {
    const stats = await getExperimentStats(experimentId)
    const { control, test } = stats

    // Calculate statistical significance
    const { data: significance, error } = await supabase.rpc(
      'calculate_significance',
      {
        control_conversions: control.conversions,
        control_total: control.total_users,
        test_conversions: test.conversions,
        test_total: test.total_users,
      }
    )

    if (error) throw error

    const sig = significance[0]

    // Determine winner
    let winner: 'control' | 'test' | 'inconclusive' = 'inconclusive'
    let improvement = 0

    if (sig.is_significant) {
      if (test.conversion_rate > control.conversion_rate) {
        winner = 'test'
        improvement =
          ((test.conversion_rate - control.conversion_rate) /
            control.conversion_rate) *
          100
      } else {
        winner = 'control'
        improvement =
          ((control.conversion_rate - test.conversion_rate) /
            test.conversion_rate) *
          100
      }
    }

    // Generate recommendation
    const recommendation = generateRecommendation(winner, improvement, sig)

    return {
      control,
      test,
      statistical_significance: {
        chi_square: sig.chi_square,
        p_value: sig.p_value,
        is_significant: sig.is_significant,
        confidence_level: 0.95,
      },
      winner,
      improvement_percentage: improvement,
      recommendation,
    }
  } catch (error) {
    logger.error('Failed to calculate results', { error, experimentId })
    throw error
  }
}

function generateRecommendation(
  winner: 'control' | 'test' | 'inconclusive',
  improvement: number,
  significance: any
): string {
  if (winner === 'inconclusive') {
    if (!significance.is_significant) {
      return 'No statistically significant difference found. Consider running the experiment longer or with more traffic.'
    }
    return 'Results are inconclusive. Continue gathering data.'
  }

  if (winner === 'test') {
    return `Test variant shows ${improvement.toFixed(1)}% improvement over control (p < ${significance.p_value}). Recommend rolling out test variant to all users.`
  }

  return `Control variant performs ${improvement.toFixed(1)}% better than test variant. Recommend keeping control configuration.`
}

/**
 * List experiments for organization
 */
export async function listExperiments(
  orgId: string,
  status?: string
): Promise<Experiment[]> {
  try {
    let query = supabase
      .from('experiments')
      .select()
      .eq('org_id', orgId)
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) throw error

    return data || []
  } catch (error) {
    logger.error('Failed to list experiments', { error, orgId })
    throw error
  }
}
