# ⚡ Быстрая настройка GitHub Secrets

> Все значения готовы для добавления

## 🚀 Быстрый способ (через GitHub CLI)

### 1. Авторизуйтесь в GitHub CLI

```bash
gh auth login
```

Выберите:
- GitHub.com
- HTTPS
- Авторизация через браузер (рекомендуется)

### 2. Выполните команды

```bash
gh secret set VERCEL_TOKEN --body "g5wBHt7TxDknUEIHchTJUHEK"
gh secret set VERCEL_ORG_ID --body "team_eYhYqLCO9dqINAo5SeQGntIH"
gh secret set VERCEL_PROJECT_ID --body "prj_oK3wwLSXPxenw9FvFZVeVp0xhGKv"
```

### 3. Проверка

```bash
gh secret list
```

---

## 📋 Альтернативный способ (через GitHub Dashboard)

1. Откройте: https://github.com/worldwideservice/gpt-agent-platform/settings/secrets/actions
2. Нажмите **New repository secret** для каждого:

**Secret 1:**
- Name: `VERCEL_TOKEN`
- Value: `g5wBHt7TxDknUEIHchTJUHEK`

**Secret 2:**
- Name: `VERCEL_ORG_ID`
- Value: `team_eYhYqLCO9dqINAo5SeQGntIH`

**Secret 3:**
- Name: `VERCEL_PROJECT_ID`
- Value: `prj_oK3wwLSXPxenw9FvFZVeVp0xhGKv`

---

## ✅ После настройки

1. Создайте тестовый commit и push
2. Проверьте **Actions** tab в GitHub
3. Убедитесь что workflow запустился и деплой прошел

---

## 🔍 Проверка что все работает

После добавления secrets:

```bash
# Проверить список secrets
gh secret list

# Запустить workflow вручную (если нужно)
gh workflow run deploy.yml
```

---

**Готово к использованию!** 🎉


