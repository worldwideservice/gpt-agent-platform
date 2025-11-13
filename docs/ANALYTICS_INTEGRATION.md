# Analytics Integration Guide

## Overview

Product analytics tracking is set up using **Segment** and **PostHog** for comprehensive event tracking and user behavior analysis.

## Setup

Analytics providers are configured in `components/providers/ProductAnalyticsProvider.tsx` and initialized automatically when the app loads.

### Environment Variables

```bash
NEXT_PUBLIC_SEGMENT_WRITE_KEY=your_segment_key
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com  # Optional
```

## Usage

### 1. Identify Users

Call `identifyUser()` after successful authentication:

```typescript
import { identifyUser } from '@/lib/analytics/events'

// After successful login/signup
identifyUser(user.id, {
  email: user.email,
  name: user.name,
  organizationId: user.organizationId,
  organizationName: user.organizationName,
  plan: user.subscriptionPlan,
  createdAt: user.createdAt,
  role: user.role,
})
```

### 2. Track Custom Events

Use `trackEvent()` to track user actions:

```typescript
import { trackEvent, AnalyticsEvents } from '@/lib/analytics/events'

// Track agent creation
trackEvent(AnalyticsEvents.AGENT_CREATED, {
  agentId: agent.id,
  agentName: agent.name,
  model: agent.model,
  organizationId: currentOrgId,
})

// Track onboarding progress
trackEvent(AnalyticsEvents.ONBOARDING_STEP_COMPLETED, {
  step: 'create_first_agent',
  stepNumber: 2,
  totalSteps: 5,
})
```

### 3. Reset on Logout

Call `resetUser()` when user logs out:

```typescript
import { resetUser } from '@/lib/analytics/events'

const handleLogout = async () => {
  await signOut()
  resetUser()
}
```

## Integration Points

### Authentication Flow

**app/(auth)/register/RegisterClient.tsx:**
```typescript
import { identifyUser, trackEvent, AnalyticsEvents } from '@/lib/analytics/events'

useEffect(() => {
  trackEvent(AnalyticsEvents.SIGNUP_STARTED)
}, [])

const onSubmit = async (data) => {
  const response = await fetch('/api/auth/register', { ... })

  if (response.ok) {
    const { user } = await response.json()

    // Identify the new user
    identifyUser(user.id, {
      email: user.email,
      name: user.name,
      createdAt: new Date().toISOString(),
    })

    // Track successful signup
    trackEvent(AnalyticsEvents.SIGNUP_COMPLETED, {
      userId: user.id,
      email: user.email,
    })
  }
}
```

**app/(auth)/login/LoginClient.tsx:**
```typescript
import { identifyUser, trackEvent, AnalyticsEvents } from '@/lib/analytics/events'

const handleLogin = async (data) => {
  const result = await signIn('credentials', { ... })

  if (result?.ok) {
    const session = await getSession()

    identifyUser(session.user.id, {
      email: session.user.email,
      name: session.user.name,
      organizationId: session.user.organizationId,
    })

    trackEvent(AnalyticsEvents.LOGIN_COMPLETED, {
      userId: session.user.id,
    })
  }
}
```

### Agent Management

**app/manage/[tenantId]/ai-agents/page.tsx:**
```typescript
import { trackEvent, AnalyticsEvents } from '@/lib/analytics/events'

const handleCreateAgent = async (agentData) => {
  const response = await fetch('/api/agents', {
    method: 'POST',
    body: JSON.stringify(agentData),
  })

  if (response.ok) {
    const agent = await response.json()

    trackEvent(AnalyticsEvents.AGENT_CREATED, {
      agentId: agent.id,
      agentName: agent.name,
      model: agent.model,
      hasInstructions: !!agent.instructions,
      hasKnowledge: agent.knowledgeBaseIds?.length > 0,
      organizationId: currentOrgId,
    })
  }
}

const handleActivateAgent = async (agentId) => {
  await updateAgent(agentId, { isActive: true })

  trackEvent(AnalyticsEvents.AGENT_ACTIVATED, {
    agentId,
    organizationId: currentOrgId,
  })
}
```

### Knowledge Base

**app/manage/[tenantId]/knowledge-base/page.tsx:**
```typescript
import { trackEvent, AnalyticsEvents } from '@/lib/analytics/events'

const handleCreateArticle = async (articleData) => {
  const response = await fetch('/api/knowledge-base/articles', {
    method: 'POST',
    body: JSON.stringify(articleData),
  })

  if (response.ok) {
    const article = await response.json()

    trackEvent(AnalyticsEvents.KNOWLEDGE_ARTICLE_CREATED, {
      articleId: article.id,
      categoryId: article.categoryId,
      wordCount: article.content.split(' ').length,
      organizationId: currentOrgId,
    })
  }
}
```

### Automation Rules

**app/manage/[tenantId]/automation/page.tsx:**
```typescript
import { trackEvent, AnalyticsEvents } from '@/lib/analytics/events'

const handleCreateRule = async (ruleData) => {
  const response = await fetch('/api/rules', {
    method: 'POST',
    body: JSON.stringify(ruleData),
  })

  if (response.ok) {
    const rule = await response.json()

    trackEvent(AnalyticsEvents.RULE_CREATED, {
      ruleId: rule.id,
      triggerType: rule.triggerType,
      actionType: rule.actionType,
      organizationId: currentOrgId,
    })
  }
}
```

### CRM Integration

**app/manage/[tenantId]/integrations/page.tsx:**
```typescript
import { trackEvent, AnalyticsEvents } from '@/lib/analytics/events'

const handleConnectKommo = async () => {
  const response = await fetch('/api/integrations/kommo/connect')

  if (response.ok) {
    trackEvent(AnalyticsEvents.INTEGRATION_CONNECTED, {
      integrationType: 'kommo',
      organizationId: currentOrgId,
    })
  }
}
```

## Available Events

See `lib/analytics/events.ts` for the complete list of predefined events:

- **Authentication**: `signup_started`, `signup_completed`, `login_completed`, `logout_completed`
- **Onboarding**: `onboarding_started`, `onboarding_step_completed`, `onboarding_completed`
- **Agents**: `agent_created`, `agent_updated`, `agent_deleted`, `agent_activated`
- **Knowledge Base**: `knowledge_category_created`, `knowledge_article_created`
- **Chat**: `chat_started`, `message_sent`, `chat_completed`
- **Automation**: `rule_created`, `sequence_created`
- **Integrations**: `integration_connected`, `crm_synced`
- **Billing**: `subscription_upgraded`, `payment_completed`

## Best Practices

1. **Always identify users** after authentication
2. **Track critical user actions** (signups, purchases, feature usage)
3. **Include relevant context** in event properties (orgId, userId, etc.)
4. **Use predefined event names** from `AnalyticsEvents` constant
5. **Reset analytics** on logout for privacy
6. **Test in development** - events will be sent to Segment/PostHog test environment

## Debugging

Enable debug logging:

```typescript
// In browser console
localStorage.setItem('LOG_LEVEL', 'debug')

// Then track an event
trackEvent('test_event', { foo: 'bar' })
// Check console for: "Event tracked {eventName: 'test_event', properties: {...}}"
```

## Data Privacy

Analytics automatically redacts sensitive fields:

- Credit card numbers
- Passwords
- API tokens
- Authorization headers

See `ProductAnalyticsProvider.tsx` for the complete denylist.

## Monitoring

### Segment Dashboard
- Real-time event stream
- User journey tracking
- Conversion funnels
- Event volume metrics

### PostHog Dashboard
- Feature flags
- Session recordings
- Heatmaps
- A/B testing

## Next Steps

1. **Implement events** in key user flows (auth, onboarding, agent creation)
2. **Set up conversion funnels** in Segment/PostHog dashboards
3. **Create GTM tags** for marketing attribution
4. **Configure alerts** for critical events (signups, errors)
5. **Build dashboards** for product metrics

---

**Files Modified:**
- ✅ `lib/analytics/events.ts` - Analytics utilities
- ✅ `components/providers/ProductAnalyticsProvider.tsx` - Provider setup
- 📋 `docs/ANALYTICS_INTEGRATION.md` - This guide

**Status**: ✅ Analytics infrastructure ready for integration
