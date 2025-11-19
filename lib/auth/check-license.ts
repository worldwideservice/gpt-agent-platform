/**
 * License Check Helper
 * Используется в API route handlers для проверки активности подписки
 */

import { NextRequest, NextResponse } from 'next/server'
import { checkLicense } from '@/lib/services/billing'
import { logger } from '@/lib/utils/logger'

export interface LicenseCheckResult {
  isValid: boolean
  response?: NextResponse
}

/**
 * Проверяет лицензию для организации
 * Возвращает объект с флагом isValid и опциональным response для возврата ошибки
 *
 * @example
 * ```ts
 * const licenseCheck = await checkLicenseMiddleware(request, tenantId)
 * if (!licenseCheck.isValid) {
 *   return licenseCheck.response // 402 Payment Required
 * }
 * ```
 */
export async function checkLicenseMiddleware(
  request: NextRequest,
  tenantId: string
): Promise<LicenseCheckResult> {
  // Проверяем, требуется ли проверка лицензии (middleware установит этот заголовок)
  const licenseCheckRequired = request.headers.get('x-license-check-required')

  if (!licenseCheckRequired) {
    // Проверка не требуется для этого endpoint
    return { isValid: true }
  }

  try {
    const license = await checkLicense(tenantId)

    if (!license.isValid) {
      logger.warn('License check failed', {
        tenantId,
        status: license.status,
        daysLeft: license.daysLeft,
      })

      return {
        isValid: false,
        response: NextResponse.json(
          {
            error: 'Subscription required',
            message: 'Your subscription has expired. Please renew to continue using this feature.',
            status: license.status,
            daysLeft: license.daysLeft,
          },
          { status: 402 } // 402 Payment Required
        ),
      }
    }

    // Лицензия активна
    return { isValid: true }
  } catch (error) {
    logger.error('Error checking license', error, { tenantId })
    // В случае ошибки пропускаем запрос (fail-open для лучшего UX)
    return { isValid: true }
  }
}

/**
 * Проверяет лицензию напрямую (для использования без request headers)
 */
export async function requireValidLicense(
  tenantId: string
): Promise<LicenseCheckResult> {
  try {
    const license = await checkLicense(tenantId)

    if (!license.isValid) {
      return {
        isValid: false,
        response: NextResponse.json(
          {
            error: 'Subscription required',
            message: 'Your subscription has expired. Please renew to continue using this feature.',
            status: license.status,
            daysLeft: license.daysLeft,
          },
          { status: 402 }
        ),
      }
    }

    return { isValid: true }
  } catch (error) {
    logger.error('Error checking license', error, { tenantId })
    // В случае ошибки пропускаем запрос
    return { isValid: true }
  }
}
