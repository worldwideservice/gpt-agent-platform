#!/usr/bin/env node

/**
 * Скрипт для синхронизации тарифных планов с Stripe
 * Создает продукты и цены в Stripe на основе данных из billing_plans
 */

const { getStripe } = require('../lib/services/billing');
const { getSupabaseServiceRoleClient } = require('../lib/supabase/admin');

async function syncStripePlans() {
  console.log('🔄 Начинаем синхронизацию планов с Stripe...\n');

  const stripe = getStripe();
  const supabase = getSupabaseServiceRoleClient();

  try {
    // Получаем все планы из БД
    const { data: plans, error } = await supabase
      .from('billing_plans')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (error) {
      throw new Error(`Ошибка получения планов: ${error.message}`);
    }

    if (!plans || plans.length === 0) {
      console.log('⚠️  Планы не найдены в БД. Сначала выполните миграцию add_stripe_plans.sql');
      return;
    }

    console.log(`📋 Найдено ${plans.length} планов для синхронизации\n`);

    for (const plan of plans) {
      console.log(`📦 Обрабатываем план: ${plan.name}`);

      try {
        // Проверяем, существует ли продукт в Stripe
        let product;
        const existingProducts = await stripe.products.list({
          limit: 100,
        });

        product = existingProducts.data.find(
          (p) => p.metadata?.plan_id === plan.id
        );

        if (!product) {
          // Создаем новый продукт
          console.log(`  ➕ Создаем продукт в Stripe...`);
          product = await stripe.products.create({
            name: plan.name,
            description: plan.description || '',
            metadata: {
              plan_id: plan.id,
              org_plan_name: plan.name,
            },
          });
          console.log(`  ✅ Продукт создан: ${product.id}`);
        } else {
          console.log(`  ✓ Продукт уже существует: ${product.id}`);
        }

        // Проверяем, существует ли цена в Stripe
        let price;
        const existingPrices = await stripe.prices.list({
          product: product.id,
          limit: 100,
        });

        price = existingPrices.data.find(
          (p) => p.unit_amount === plan.price_cents && p.recurring?.interval === plan.interval
        );

        if (!price) {
          // Создаем новую цену
          console.log(`  ➕ Создаем цену в Stripe...`);
          price = await stripe.prices.create({
            product: product.id,
            unit_amount: plan.price_cents,
            currency: plan.currency || 'usd',
            recurring: {
              interval: plan.interval,
            },
            metadata: {
              plan_id: plan.id,
            },
          });
          console.log(`  ✅ Цена создана: ${price.id}`);
        } else {
          console.log(`  ✓ Цена уже существует: ${price.id}`);
        }

        // Обновляем stripe_price_id в БД
        if (plan.stripe_price_id !== price.id) {
          console.log(`  🔄 Обновляем stripe_price_id в БД...`);
          const { error: updateError } = await supabase
            .from('billing_plans')
            .update({ stripe_price_id: price.id })
            .eq('id', plan.id);

          if (updateError) {
            console.error(`  ❌ Ошибка обновления: ${updateError.message}`);
          } else {
            console.log(`  ✅ stripe_price_id обновлен: ${price.id}`);
          }
        } else {
          console.log(`  ✓ stripe_price_id уже актуален`);
        }

        console.log(`  ✅ План "${plan.name}" синхронизирован\n`);
      } catch (error) {
        console.error(`  ❌ Ошибка обработки плана "${plan.name}":`, error.message);
        console.log('');
      }
    }

    console.log('✅ Синхронизация завершена!');
    console.log('\n📝 Следующие шаги:');
    console.log('1. Проверьте созданные продукты и цены в Stripe Dashboard');
    console.log('2. Убедитесь, что stripe_price_id обновлены в БД');
    console.log('3. Протестируйте создание подписки через UI');
  } catch (error) {
    console.error('❌ Критическая ошибка:', error);
    process.exit(1);
  }
}

// Запуск скрипта
if (require.main === module) {
  syncStripePlans()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { syncStripePlans };






