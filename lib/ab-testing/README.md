# A/B Testing System

Statistical A/B testing framework for optimizing AI agent configurations.

## Overview

The A/B testing system allows you to:
- Test different agent configurations (model, temperature, prompts)
- Automatically split traffic between variants
- Track conversion metrics and performance
- Calculate statistical significance
- Make data-driven decisions

## Quick Start

### 1. Create an Experiment

```typescript
import { createExperiment } from '@/lib/ab-testing'

const experiment = await createExperiment({
  org_id: 'org_123',
  name: 'GPT-4 vs GPT-3.5 Conversion Test',
  description: 'Testing if GPT-4 increases conversion rate',
  hypothesis: 'GPT-4 will have 20% higher conversion than GPT-3.5',

  traffic_percentage: 50, // 50% of users in experiment

  control_variant: {
    name: 'Control - GPT-3.5',
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
  },

  test_variant: {
    name: 'Test - GPT-4',
    model: 'gpt-4-turbo',
    temperature: 0.7,
  },

  primary_metric: 'conversion_rate',
  secondary_metrics: ['avg_rating', 'response_time'],

  confidence_level: 0.95, // 95% confidence
  min_sample_size: 100,   // Minimum 100 conversions per variant
})
```

### 2. Start the Experiment

```typescript
import { startExperiment } from '@/lib/ab-testing'

await startExperiment(experiment.id)
```

### 3. Assign Users to Variants

```typescript
import { assignVariant } from '@/lib/ab-testing'

// For authenticated users
const assignment = await assignVariant(
  experimentId,
  userId
)

// For anonymous users
const assignment = await assignVariant(
  experimentId,
  undefined,
  sessionId
)

console.log(`User assigned to: ${assignment.variant}`)
// Use the variant config
const config = assignment.variant === 'control'
  ? experiment.control_variant
  : experiment.test_variant
```

### 4. Track Events

```typescript
import { trackEvent } from '@/lib/ab-testing'

// Track conversion
await trackEvent(
  experimentId,
  'conversion',
  1, // value
  { source: 'chat' }, // metadata
  userId
)

// Track rating
await trackEvent(
  experimentId,
  'rating',
  4.5,
  undefined,
  userId
)

// Track response time
await trackEvent(
  experimentId,
  'response_time',
  1250, // milliseconds
  undefined,
  userId
)
```

### 5. View Results

```typescript
import { getExperimentStats, calculateResults } from '@/lib/ab-testing'

// Get current stats
const stats = await getExperimentStats(experimentId)

console.log('Control:', stats.control)
console.log('Test:', stats.test)

// Calculate results with statistical significance
const results = await calculateResults(experimentId)

console.log('Winner:', results.winner)
console.log('Improvement:', results.improvement_percentage)
console.log('Recommendation:', results.recommendation)
```

### 6. Stop the Experiment

```typescript
import { stopExperiment } from '@/lib/ab-testing'

const experiment = await stopExperiment(experimentId)

console.log('Final winner:', experiment.winner)
console.log('Results:', experiment.results)
```

## API Endpoints

### List Experiments

```typescript
GET /api/experiments?status=running

Response: {
  experiments: [{
    id: "exp_123",
    name: "GPT-4 vs GPT-3.5",
    status: "running",
    traffic_percentage: 50,
    ...
  }]
}
```

### Create Experiment

```typescript
POST /api/experiments

Body: {
  name: "Test Name",
  control_variant: { ... },
  test_variant: { ... },
  primary_metric: "conversion_rate"
}

Response: {
  experiment: { ... }
}
```

### Get Experiment Details

```typescript
GET /api/experiments/exp_123

Response: {
  experiment: { ... },
  stats: {
    control: {
      total_users: 523,
      conversions: 45,
      conversion_rate: 0.086,
      avg_rating: 4.2
    },
    test: {
      total_users: 511,
      conversions: 58,
      conversion_rate: 0.113,
      avg_rating: 4.5
    }
  }
}
```

### Start/Stop Experiment

```typescript
PATCH /api/experiments/exp_123

Body: {
  action: "start" // or "stop"
}

Response: {
  experiment: { status: "running", ... }
}
```

### Assign Variant

```typescript
POST /api/experiments/exp_123/assign

Body: {
  session_id: "session_abc" // optional if authenticated
}

Response: {
  assignment: {
    variant: "test",
    experiment_id: "exp_123"
  },
  config: {
    model: "gpt-4-turbo",
    temperature: 0.7
  }
}
```

### Track Event

```typescript
POST /api/experiments/exp_123/track

Body: {
  event_type: "conversion",
  event_value: 1,
  metadata: { source: "chat" },
  session_id: "session_abc" // optional if authenticated
}

Response: {
  success: true
}
```

## Metrics

### Primary Metrics

**Conversion Rate** - Most common
```typescript
primary_metric: 'conversion_rate'

// Track conversions
await trackEvent(experimentId, 'conversion', 1, {}, userId)
```

**Average Rating**
```typescript
primary_metric: 'avg_rating'

// Track ratings (1-5)
await trackEvent(experimentId, 'rating', 4.5, {}, userId)
```

**Response Time**
```typescript
primary_metric: 'avg_response_time'

// Track time in milliseconds
await trackEvent(experimentId, 'response_time', 1250, {}, userId)
```

### Secondary Metrics

Track multiple metrics simultaneously:

```typescript
secondary_metrics: ['avg_rating', 'response_time', 'token_usage']
```

## Statistical Significance

The system uses Chi-square test for statistical significance:

- **p < 0.05** - Statistically significant (95% confidence)
- **p < 0.01** - Highly significant (99% confidence)
- **p > 0.05** - Not significant

### Sample Size Calculator

```typescript
// Minimum sample size for 95% confidence, 80% power
// Detecting 10% improvement

const minSampleSize = 385 per variant
```

### When to Stop

✅ **Stop when:**
- Reached minimum sample size (e.g., 100 conversions per variant)
- Statistically significant result (p < 0.05)
- Clear winner emerges

❌ **Don't stop when:**
- Not enough data
- Results are borderline
- Traffic is too low

## Example Use Cases

### 1. Model Comparison

Test GPT-4 vs GPT-3.5:

```typescript
control_variant: {
  name: 'GPT-3.5',
  model: 'gpt-3.5-turbo'
}

test_variant: {
  name: 'GPT-4',
  model: 'gpt-4-turbo'
}
```

### 2. Temperature Optimization

Find optimal temperature:

```typescript
control_variant: {
  name: 'Temperature 0.5',
  temperature: 0.5
}

test_variant: {
  name: 'Temperature 0.9',
  temperature: 0.9
}
```

### 3. Prompt Testing

Test different system prompts:

```typescript
control_variant: {
  name: 'Formal Prompt',
  system_prompt: 'You are a professional assistant...'
}

test_variant: {
  name: 'Friendly Prompt',
  system_prompt: 'You are a friendly helper...'
}
```

### 4. Max Tokens

Optimize response length:

```typescript
control_variant: {
  name: '256 tokens',
  max_tokens: 256
}

test_variant: {
  name: '512 tokens',
  max_tokens: 512
}
```

## Integration with AI Agents

### Client-side (React)

```typescript
'use client'
import { useState, useEffect } from 'react'

export function useExperiment(experimentId: string) {
  const [variant, setVariant] = useState(null)
  const [config, setConfig] = useState(null)

  useEffect(() => {
    async function assignVariant() {
      const res = await fetch(`/api/experiments/${experimentId}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: getSessionId(), // Your session ID logic
        }),
      })

      const data = await res.json()
      setVariant(data.assignment.variant)
      setConfig(data.config)
    }

    assignVariant()
  }, [experimentId])

  const trackConversion = async () => {
    await fetch(`/api/experiments/${experimentId}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: 'conversion',
        event_value: 1,
        session_id: getSessionId(),
      }),
    })
  }

  return { variant, config, trackConversion }
}

// Usage
function ChatComponent() {
  const { variant, config, trackConversion } = useExperiment('exp_123')

  const handleSuccessfulResponse = () => {
    trackConversion()
  }

  return (
    <div>
      <p>Testing: {variant}</p>
      {/* Use config.model, config.temperature, etc. */}
    </div>
  )
}
```

### Server-side

```typescript
import { assignVariant, trackEvent } from '@/lib/ab-testing'

export async function handleChatRequest(userId: string) {
  // Assign variant
  const assignment = await assignVariant('exp_123', userId)

  // Use variant config
  const config = assignment.variant === 'control'
    ? experiment.control_variant
    : experiment.test_variant

  // Make API call with config
  const response = await openai.chat.completions.create({
    model: config.model,
    temperature: config.temperature,
    messages: [...]
  })

  // Track metrics
  await trackEvent('exp_123', 'response_time', responseTime, {}, userId)

  if (userConverted) {
    await trackEvent('exp_123', 'conversion', 1, {}, userId)
  }

  return response
}
```

## Best Practices

### Traffic Percentage

- Start with 50% (half of users in experiment)
- Increase to 100% once validated
- Use lower % (10-20%) for risky changes

### Sample Size

- Minimum 100 conversions per variant for reliable results
- Use online calculators for precise estimates
- Don't stop too early

### Hypothesis

Always state a clear hypothesis:

✅ Good: "GPT-4 will increase conversion rate by 15%"
❌ Bad: "Test GPT-4"

### Metrics

- Choose ONE primary metric
- Track secondary metrics for insights
- Ensure metrics are measurable

### Duration

- Run for at least 1 week (capture weekly patterns)
- Don't stop mid-week
- Account for seasonal effects

## Troubleshooting

### No Assignments

```
Error: No assignment found for event
```

**Solution:** User was not assigned to experiment. Call `assignVariant` before tracking events.

### Insufficient Data

```
Results: winner = null (inconclusive)
```

**Solution:** Continue running experiment until reaching minimum sample size.

### High P-value

```
p_value: 0.15 (not significant)
```

**Solution:**
- Continue gathering data
- Increase traffic percentage
- Consider larger effect size

## Database Schema

```sql
-- Experiments
experiments (
  id, org_id, name, status,
  traffic_percentage,
  control_variant JSONB,
  test_variant JSONB,
  primary_metric, secondary_metrics,
  winner, results
)

-- Assignments
experiment_assignments (
  id, experiment_id,
  user_id, session_id,
  variant
)

-- Events
experiment_events (
  id, experiment_id, assignment_id,
  event_type, event_value,
  variant
)
```

## Monitoring

Track experiment health:

```typescript
const stats = await getExperimentStats(experimentId)

// Check for issues
if (stats.control.total_users < 10) {
  console.warn('Low traffic in control group')
}

if (stats.test.conversions === 0) {
  console.warn('No conversions in test variant yet')
}

// Check balance
const ratio = stats.test.total_users / stats.control.total_users

if (ratio < 0.9 || ratio > 1.1) {
  console.warn('Traffic split is imbalanced')
}
```

## Resources

- [Sample Size Calculator](https://www.optimizely.com/sample-size-calculator/)
- [Chi-square Test](https://en.wikipedia.org/wiki/Chi-squared_test)
- [A/B Testing Statistics](https://www.evanmiller.org/ab-testing/)
