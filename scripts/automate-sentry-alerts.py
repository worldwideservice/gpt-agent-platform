#!/usr/bin/env python3
"""
Автоматическая настройка Sentry алертов через браузер
"""

from playwright.sync_api import sync_playwright
import time
import sys

SENTRY_EMAIL = "admin@worldwideservice.eu"
SENTRY_PASSWORD = "l1tmw6u977c9!Q"
SENTRY_ORG = "world-wide-services"
SENTRY_PROJECT = "javascript-nextjs"
ALERT_EMAIL = "admin@worldwideservices.eu"

def wait_and_click(page, selector, timeout=5000):
    """Ждать элемент и кликнуть"""
    try:
        page.wait_for_selector(selector, timeout=timeout)
        page.click(selector)
        time.sleep(1)
        return True
    except Exception as e:
        print(f"⚠️  Не найден элемент: {selector}")
        return False

def fill_input(page, selector, value, timeout=5000):
    """Заполнить поле"""
    try:
        page.wait_for_selector(selector, timeout=timeout)
        page.fill(selector, value)
        time.sleep(0.5)
        return True
    except Exception as e:
        print(f"⚠️  Не найдено поле: {selector}")
        return False

def create_critical_errors_alert(page):
    """Создать алерт 1: Critical Errors"""
    print("\n📝 Алерт 1: Critical Errors - High Error Rate")
    
    # Переход к созданию алерта
    page.goto(f"https://sentry.io/organizations/{SENTRY_ORG}/projects/{SENTRY_PROJECT}/alerts/rules/")
    time.sleep(2)
    
    # Нажать Create Alert Rule
    if not wait_and_click(page, 'a:has-text("Create Alert Rule"), button:has-text("Create Alert Rule")'):
        # Попробовать другие селекторы
        page.click('text=Create Alert Rule', timeout=3000)
    time.sleep(3)
    
    # Выбрать Issue Alert
    page.click('text=Issue Alert', timeout=5000)
    time.sleep(2)
    
    # Заполнить имя
    page.fill('input[placeholder*="name" i], input[name*="name" i], input[type="text"]:first-of-type', 
              "Critical Errors - High Error Rate")
    time.sleep(1)
    
    # Настроить условия - будет сделано через UI
    print("   ⚠️  Ручная настройка условий в браузере")
    
    return True

def main():
    print("🔔 АВТОМАТИЧЕСКАЯ НАСТРОЙКА SENTRY АЛЕРТОВ")
    print("=" * 60)
    
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=False)
            context = browser.new_context(viewport={'width': 1920, 'height': 1080})
            page = context.new_page()
            
            # Вход в Sentry
            print("\n🔐 Шаг 1: Вход в Sentry...")
            page.goto("https://sentry.io/auth/login/")
            time.sleep(2)
            
            # Заполнить email
            email_input = page.wait_for_selector('input[type="email"], input[name="email"]', timeout=10000)
            email_input.fill(SENTRY_EMAIL)
            time.sleep(1)
            
            # Заполнить password
            password_input = page.wait_for_selector('input[type="password"], input[name="password"]', timeout=5000)
            password_input.fill(SENTRY_PASSWORD)
            time.sleep(1)
            
            # Нажать Sign in
            page.click('button[type="submit"], button:has-text("Sign in"), button:has-text("Log in")')
            print("   ✅ Форма отправлена, ожидание входа...")
            time.sleep(5)
            
            # Проверка успешного входа
            current_url = page.url
            if "sentry.io" in current_url and "auth/login" not in current_url:
                print("   ✅ Вход выполнен успешно!")
            else:
                print("   ⚠️  Проверьте статус входа вручную")
            
            # Переход к алертам
            print("\n📋 Шаг 2: Переход к настройке алертов...")
            alerts_url = f"https://sentry.io/organizations/{SENTRY_ORG}/projects/{SENTRY_PROJECT}/alerts/rules/"
            page.goto(alerts_url)
            time.sleep(3)
            
            print(f"\n✅ Браузер открыт на странице алертов")
            print(f"   URL: {alerts_url}")
            print("\n📋 ИНСТРУКЦИЯ:")
            print("   1. В открывшемся браузере создайте 4 алерта вручную")
            print("   2. Следуйте инструкции в SENTRY_FINAL_CHECKLIST.md")
            print("   3. После создания всех алертов нажмите Enter здесь...")
            
            input("\n⏸️  Нажмите Enter после завершения настройки алертов...")
            
            # Проверка результата
            print("\n🔍 Проверка созданных алертов...")
            page.reload()
            time.sleep(3)
            
            # Подсчет алертов на странице
            alert_count = len(page.query_selector_all('a[href*="/alerts/rules/"], tr, .alert-rule'))
            print(f"   Найдено элементов: {alert_count}")
            
            print("\n✅ Процесс завершен!")
            print(f"📖 Проверьте алерты: {alerts_url}")
            
            # Держать браузер открытым для проверки
            print("\n⏸️  Браузер останется открытым для проверки...")
            input("Нажмите Enter чтобы закрыть браузер...")
            
            browser.close()
            
    except Exception as e:
        print(f"\n❌ Ошибка: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()

