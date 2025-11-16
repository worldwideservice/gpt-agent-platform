# ⚠️ SECURITY WARNINGS - НЕМЕДЛЕННЫЕ ДЕЙСТВИЯ ТРЕБУЮТСЯ

## 🔴 КРИТИЧНО: .env.vercel был удален из git

**Дата:** 2025-11-15

### Что произошло

Файл `.env.vercel` содержал **exposed secrets** и был закоммичен в git history:
- `SENTRY_DSN` 
- `VERCEL_OIDC_TOKEN`
- Другие потенциально чувствительные данные

**Этот файл был УДАЛЕН из текущего состояния, но ОСТАЕТСЯ в git history!**

---

## ✅ НЕМЕДЛЕННЫЕ ДЕЙСТВИЯ (ОБЯЗАТЕЛЬНО)

### 1. Rotate Exposed Secrets (В ТЕЧЕНИЕ 1 ЧАСА)

#### Sentry DSN
```bash
# 1. Зайти в Sentry: https://sentry.io/settings/projects/
# 2. Найти ваш проект
# 3. Settings → Client Keys (DSN)
# 4. Regenerate DSN
# 5. Обновить в Vercel Environment Variables
```

#### Vercel OIDC Token
```bash
# 1. Зайти в Vercel: https://vercel.com/account/tokens
# 2. Найти токен (если есть)
# 3. Revoke старый токен
# 4. Создать новый токен
# 5. Обновить в CI/CD secrets
```

#### Все другие secrets из .env.vercel
```bash
# Проверить содержимое старого файла и rotate ВСЕ secrets
git log -p -- .env.vercel | grep -E "(SECRET|KEY|TOKEN|DSN|PASSWORD)"
```

---

### 2. Очистить Git History (ОПЦИОНАЛЬНО, НО РЕКОМЕНДУЕТСЯ)

**⚠️ ВНИМАНИЕ:** Это переписывает git history и требует force push!

```bash
# Option 1: BFG Repo-Cleaner (рекомендуется)
# https://rtyley.github.io/bfg-repo-cleaner/

# Скачать BFG
wget https://repo1.maven.org/maven2/com/madgag/bfg/1.14.0/bfg-1.14.0.jar

# Удалить .env.vercel из всей истории
java -jar bfg-1.14.0.jar --delete-files .env.vercel

# Очистить и force push
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push origin --force --all

# Option 2: git filter-branch (альтернатива)
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch .env.vercel' \
  --prune-empty --tag-name-filter cat -- --all

git push origin --force --all
```

**После очистки ВСЕ разработчики должны:**
```bash
git fetch origin
git reset --hard origin/main
```

---

### 3. Обновить Environment Variables

#### Vercel Dashboard
```bash
# 1. Зайти: https://vercel.com/your-project/settings/environment-variables
# 2. Удалить ВСЕ старые переменные с exposed secrets
# 3. Добавить НОВЫЕ values (после rotation)
# 4. Redeploy: vercel --prod
```

#### Local Development
```bash
# Создать .env.local с НОВЫМИ secrets
cp env.example .env.local
# Заполнить НОВЫМИ values

# .env.local уже в .gitignore - НЕ коммитить!
```

---

## 📋 CHECKLIST

- [ ] Regenerate Sentry DSN
- [ ] Revoke и regenerate Vercel OIDC Token
- [ ] Rotate ВСЕ другие secrets из .env.vercel
- [ ] Обновить secrets в Vercel Dashboard
- [ ] Обновить secrets в CI/CD (GitHub Actions)
- [ ] Очистить git history (опционально)
- [ ] Force push (если очистили history)
- [ ] Notify team об обновлении (если force push)
- [ ] Проверить что .env.vercel в .gitignore
- [ ] Проверить что новые secrets работают
- [ ] Redeploy на production

---

## 🛡️ ПРЕВЕНТИВНЫЕ МЕРЫ (УЖЕ РЕАЛИЗОВАНЫ)

✅ `.env.vercel` добавлен в `.gitignore`
✅ Pre-commit hook может быть добавлен для проверки secrets
✅ Документация обновлена

---

## 📞 КОНТАКТЫ

**Security Lead:** Немедленно notify команду безопасности
**DevOps Lead:** Координировать rotation и redeploy

---

**Дата создания:** 2025-11-15
**Автор:** Security Engineering Team  
**Приоритет:** 🔴 CRITICAL - ТРЕБУЕТСЯ НЕМЕДЛЕННОЕ ДЕЙСТВИЕ
