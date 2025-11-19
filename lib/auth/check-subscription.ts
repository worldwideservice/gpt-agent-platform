import { createClient } from '@supabase/supabase-js'

export async function checkSubscriptionStatus(orgId: string): Promise<boolean> {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    // Простая проверка даты окончания
    const { data } = await supabase
        .from('subscriptions')
        .select('status, current_period_end')
        .eq('org_id', orgId)
        .single()

    if (!data) return false // Нет подписки
    return new Date(data.current_period_end) > new Date()
}
