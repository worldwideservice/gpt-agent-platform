# 🔔 Настройка Alertmanager уведомлений

**Дата создания:** 2025-01-26  
**Версия:** 1.0

---

## 📋 Обзор

Alertmanager отправляет уведомления при алертах из Prometheus. Поддерживаются следующие типы уведомлений:

- **Email** - SMTP уведомления
- **Slack** - интеграция с Slack
- **Webhook** - интеграция с любым webhook endpoint

---

## 📧 Настройка Email уведомлений

### 1. Выберите SMTP провайдера

**Популярные варианты:**

- **Gmail** (для тестирования):
  - SMTP: `smtp.gmail.com:587`
  - Требуется App Password (не обычный пароль)

- **SendGrid** (рекомендуется для production):
  - SMTP: `smtp.sendgrid.net:587`
  - API Key из SendGrid Dashboard

- **Mailgun**:
  - SMTP: `smtp.mailgun.org:587`
  - API Key из Mailgun Dashboard

- **AWS SES**:
  - SMTP: `email-smtp.region.amazonaws.com:587`
  - AWS Access Key и Secret Key

### 2. Настройте `monitoring/alertmanager/alertmanager.yml`

Отредактируйте файл и раскомментируйте/настройте SMTP параметры:

```yaml
global:
  resolve_timeout: 5m
  smtp_smarthost: 'smtp.gmail.com:587'
  smtp_from: 'alerts@yourdomain.com'
  smtp_auth_username: 'your-email@gmail.com'
  smtp_auth_password: 'your-app-password'
```

### 3. Настройте получателей

В секции `receivers` раскомментируйте `email_configs`:

```yaml
receivers:
  - name: 'critical-alerts'
    email_configs:
      - to: 'admin@yourdomain.com'
        headers:
          Subject: '🚨 Critical Alert: {{ .GroupLabels.alertname }}'
```

### 4. Перезапустите Alertmanager

```bash
cd monitoring
docker-compose restart alertmanager
```

---

## 💬 Настройка Slack уведомлений

### 1. Создайте Slack Webhook

1. Откройте: https://api.slack.com/messaging/webhooks
2. Создайте новый Incoming Webhook
3. Выберите канал для уведомлений (например, `#alerts`)
4. Скопируйте Webhook URL

### 2. Настройте `monitoring/alertmanager/alertmanager.yml`

Раскомментируйте `slack_configs` в секции `receivers`:

```yaml
receivers:
  - name: 'critical-alerts'
    slack_configs:
      - api_url: 'https://hooks.slack.com/services/YOUR/WEBHOOK/URL'
        channel: '#alerts'
        title: '🚨 Critical Alert'
        text: '{{ range .Alerts }}{{ .Annotations.description }}{{ end }}'
        send_resolved: true
```

### 3. Перезапустите Alertmanager

```bash
cd monitoring
docker-compose restart alertmanager
```

---

## 🔗 Настройка Webhook уведомлений

### 1. Создайте webhook endpoint

Создайте endpoint для получения алертов (например, Discord, Telegram, или кастомный сервис).

### 2. Настройте `monitoring/alertmanager/alertmanager.yml`

```yaml
receivers:
  - name: 'critical-alerts'
    webhook_configs:
      - url: 'https://your-webhook-url.com/alerts'
        send_resolved: true
```

### 3. Перезапустите Alertmanager

```bash
cd monitoring
docker-compose restart alertmanager
```

---

## 🧪 Тестирование уведомлений

### 1. Отправить тестовый алерт

```bash
# Создать тестовый алерт через Prometheus
curl -X POST http://localhost:9093/api/v1/alerts \
  -H "Content-Type: application/json" \
  -d '[
    {
      "labels": {
        "alertname": "TestAlert",
        "severity": "critical"
      },
      "annotations": {
        "description": "This is a test alert"
      }
    }
  ]'
```

### 2. Проверить получение уведомления

- **Email:** Проверьте почтовый ящик
- **Slack:** Проверьте канал `#alerts`
- **Webhook:** Проверьте логи вашего webhook endpoint

---

## 📊 Настройка маршрутизации алертов

Текущая конфигурация маршрутизации:

- **Критические алерты** (`severity: critical`) → отправляются немедленно в `critical-alerts`
- **Предупреждения** (`severity: warning`) → группируются и отправляются в `warning-alerts`

Вы можете изменить маршрутизацию в секции `route` файла `alertmanager.yml`.

---

## 🔧 Дополнительные настройки

### Группировка алертов

Алерты группируются по:
- `alertname` - название алерта
- `cluster` - кластер
- `service` - сервис

### Интервалы уведомлений

- `group_wait: 10s` - ждать 10 секунд перед отправкой группы алертов
- `group_interval: 10s` - интервал между группами
- `repeat_interval: 12h` - повторять алерт каждые 12 часов (если не решен)

### Подавление дублирующихся алертов

Если критический алерт активен, предупреждения с тем же `alertname`, `cluster`, `service` будут подавлены.

---

## 📚 Дополнительные ресурсы

- [Alertmanager Documentation](https://prometheus.io/docs/alerting/latest/alertmanager/)
- [Email Configuration](https://prometheus.io/docs/alerting/latest/configuration/#email_config)
- [Slack Configuration](https://prometheus.io/docs/alerting/latest/notification_examples/#slack)
- [Webhook Configuration](https://prometheus.io/docs/alerting/latest/configuration/#webhook_config)

---

## ✅ Чеклист настройки

- [ ] Выбран SMTP провайдер (или Slack/Webhook)
- [ ] Настроены параметры в `alertmanager.yml`
- [ ] Настроены получатели уведомлений
- [ ] Перезапущен Alertmanager
- [ ] Протестированы уведомления
- [ ] Проверена работа алертов в production

---

**Последнее обновление:** 2025-01-26

