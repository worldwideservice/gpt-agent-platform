# ДЕТАЛЬНЫЕ ПРИМЕРЫ ИСПРАВЛЕНИЙ
## Docker & Kubernetes конфигурации - Решения и Code примеры

---

## ИСПРАВЛЕНИЕ #1: Закрытие открытых портов в dev/staging

### ДО (docker-compose.dev.yml)
```yaml
services:
  redis:
    image: redis:7-alpine
    container_name: gpt-agent-redis-dev
    ports:
      - "6379:6379"  # ❌ Открыт для всех!
    
  supabase:
    image: supabase/postgres:15.1.1.61
    container_name: gpt-agent-supabase-dev
    ports:
      - "5432:5432"  # ❌ Открыт для всех!
```

### ПОСЛЕ (docker-compose.dev.yml)
```yaml
services:
  redis:
    image: redis:7-alpine
    container_name: gpt-agent-redis-dev
    ports:
      - "127.0.0.1:6379:6379"  # ✅ Только localhost
    
  supabase:
    image: supabase/postgres:15.1.1.61
    container_name: gpt-agent-supabase-dev
    ports:
      - "127.0.0.1:5432:5432"  # ✅ Только localhost
```

**Применить также к:**
- docker-compose.staging.yml (все порты)
- Опционально: docker-compose.yml (если используется локально)

---

## ИСПРАВЛЕНИЕ #2: Добавление Resource Limits

### ДО (docker-compose.yml)
```yaml
version: '3.8'

services:
  app:
    build: .
    container_name: gpt-agent-app
    ports:
      - "3000:3000"
    # ❌ Нет limits!

  redis:
    image: redis:7-alpine
    # ❌ Нет limits!
```

### ПОСЛЕ (docker-compose.yml)
```yaml
version: '3.8'

services:
  app:
    build: .
    container_name: gpt-agent-app
    ports:
      - "3000:3000"
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1024M
        reservations:
          cpus: '0.5'
          memory: 512M

  redis:
    image: redis:7-alpine
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M

  worker:
    build:
      context: .
      dockerfile: services/worker/Dockerfile
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 2048M
        reservations:
          cpus: '1.0'
          memory: 1024M
```

**Рекомендуемые значения для production:**
```yaml
Next.js App:
  limits: { cpus: '1.0', memory: '1024M' }
  reservations: { cpus: '0.5', memory: '512M' }

Worker:
  limits: { cpus: '2.0', memory: '2048M' }
  reservations: { cpus: '1.0', memory: '1024M' }

Redis:
  limits: { cpus: '0.5', memory: '512M' }
  reservations: { cpus: '0.25', memory: '256M' }

PostgreSQL:
  limits: { cpus: '1.0', memory: '2048M' }
  reservations: { cpus: '0.5', memory: '1024M' }
```

---

## ИСПРАВЛЕНИЕ #3: Оптимизация Main Dockerfile

### ДО (Dockerfile)
```dockerfile
# Используем Node.js 20 Alpine для минимального размера образа
FROM node:20-alpine AS base

WORKDIR /app

COPY package*.json ./

# ❌ Установка зависимостей в base stage
RUN npm ci --only=production

COPY . .

RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

COPY --from=base /app/package*.json ./
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/next.config.js ./
COPY --from=base /app/services ./services
COPY --from=base /app/scripts ./scripts

# ❌ Снова устанавливаем зависимости
RUN npm ci --only=production

RUN apk add --no-cache curl

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["npm", "start"]
```

### ПОСЛЕ (Dockerfile) - Оптимизированный вариант
```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
# Результат: /app/node_modules с production зависимостями

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci  # Полные зависимости для сборки
COPY . .
RUN npm run build
# Результат: /app/.next с собранным приложением

# Stage 3: Production Runtime
FROM node:20-alpine AS production
WORKDIR /app

# Копируем только необходимые файлы
COPY package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./
COPY --from=deps /app/node_modules ./node_modules

# Установка tools для health check
RUN apk add --no-cache curl tini

# Безопасность: непривилегированный пользователь
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN chown -R nextjs:nodejs /app

# Ограничение прав доступа
RUN chmod -R 755 /app
RUN find /app -type f -exec chmod 644 {} \;

USER nextjs

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://127.0.0.1:3000/api/health || exit 1

# Использовать tini для правильной обработки сигналов
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["npm", "start"]
```

**Преимущества:**
- ✅ Более эффективное использование слоев
- ✅ Меньше переустановок зависимостей
- ✅ Лучше кэширование Docker слоев
- ✅ Меньший финальный размер образа

---

## ИСПРАВЛЕНИЕ #4: Оптимизация Worker Dockerfile

### ДО (services/worker/Dockerfile)
```dockerfile
FROM node:20-alpine AS base
WORKDIR /app

COPY services/worker/package.json services/worker/package-lock.json* ./services/worker/
COPY . .

WORKDIR /app/services/worker
RUN npm ci
RUN npm run build

FROM node:20-alpine AS production
RUN apk add --no-cache wget
WORKDIR /app

COPY --from=base /app/services/worker/package.json ./services/worker/
COPY --from=base /app/services/worker/package-lock.json* ./services/worker/
COPY --from=base /app/services/worker/dist ./services/worker/dist
COPY --from=base /app/services/worker/src/lib ./services/worker/lib  # ❌ src/lib?
COPY --from=base /app/lib ./lib
COPY --from=base /app/types ./types
COPY --from=base /app/tsconfig.json ./tsconfig.json

WORKDIR /app/services/worker
RUN npm ci --only=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 worker

RUN chown -R worker:nodejs /app
USER worker

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT:-3001}/health || exit 1

WORKDIR /app/services/worker
CMD ["node", "node_modules/.bin/tsx", "--tsconfig", "/app/tsconfig.json", "./dist/index.js"]
```

### ПОСЛЕ (services/worker/Dockerfile) - Упрощённый вариант
```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Копируем package files
COPY services/worker/package*.json ./services/worker/
COPY package*.json ./

# Установляем зависимости
RUN cd services/worker && npm ci --only=production
RUN npm ci --only=production

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY services/worker/package*.json ./services/worker/

# Полные зависимости для сборки
RUN cd services/worker && npm ci
RUN npm ci

# Копируем source код
COPY . .

# Собираем worker
RUN cd services/worker && npm run build

# Stage 3: Runtime
FROM node:20-alpine AS production
WORKDIR /app

# Установим runtime tools
RUN apk add --no-cache curl tini

# Копируем package файлы
COPY package*.json ./
COPY services/worker/package*.json ./services/worker/

# Копируем compiled output
COPY --from=builder /app/services/worker/dist ./services/worker/dist
COPY --from=builder /app/services/worker/lib ./services/worker/lib
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/types ./types

# Копируем production node_modules
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/services/worker/node_modules ./services/worker/node_modules

# Безопасность: непривилегированный пользователь
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 worker

RUN chown -R worker:nodejs /app
RUN chmod -R 755 /app

USER worker
WORKDIR /app/services/worker

EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://127.0.0.1:${PORT:-3001}/health || exit 1

# Используем tini для правильной обработки сигналов
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/index.js"]
```

**Улучшения:**
- ✅ Упрощена структура копирования
- ✅ Удалены src/lib копирования (используется только dist/lib)
- ✅ Явная установка health check порта
- ✅ Правильная иерархия слоев
- ✅ Использование tini для graceful shutdown

---

## ИСПРАВЛЕНИЕ #5: Health Checks для всех сервисов

### docker-compose.yml с полными health checks
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://127.0.0.1:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    depends_on:
      redis:
        condition: service_healthy

  redis:
    image: redis:7-alpine
    ports:
      - "127.0.0.1:6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "${REDIS_PASSWORD:-change-me}", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  worker:
    build:
      context: .
      dockerfile: services/worker/Dockerfile
    environment:
      - PORT=3001
    healthcheck:
      test: ["CMD", "curl", "-f", "http://127.0.0.1:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
    depends_on:
      redis:
        condition: service_healthy
    restart: unless-stopped
```

**Требования для приложения:**
```typescript
// В Next.js app (pages/api/health.ts или app/api/health/route.ts):
export async function GET() {
  return new Response(JSON.stringify({ status: 'ok' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

// В Worker (src/health.ts):
export async function healthCheck(req: Request): Promise<Response> {
  return new Response(JSON.stringify({ status: 'ok' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
```

---

## ИСПРАВЛЕНИЕ #6: Мониторинг - Исправление Prometheus/AlertManager

### Проблема: AlertManager не поддерживает переменные окружения

### РЕШЕНИЕ 1: Создать entrypoint script

**monitoring/entrypoint.sh:**
```bash
#!/bin/sh
set -e

# Подставляем переменные окружения в alertmanager.yml
envsubst < /etc/alertmanager/alertmanager.yml.template > /etc/alertmanager/alertmanager.yml

# Запускаем alertmanager
exec alertmanager "$@"
```

**monitoring/alertmanager/alertmanager.yml.template:**
```yaml
global:
  resolve_timeout: 5m
  smtp_smarthost: ${SMTP_HOST}
  smtp_from: ${SMTP_FROM}
  smtp_auth_username: ${SMTP_USER}
  smtp_auth_password: ${SMTP_PASS}
  smtp_require_tls: true

route:
  receiver: 'default'
  group_by: ['alertname', 'cluster', 'service']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 12h
```

**monitoring/docker-compose.yml (для alertmanager):**
```yaml
alertmanager:
  image: prom/alertmanager:latest
  container_name: alertmanager
  ports:
    - "9093:9093"
  volumes:
    - ./alertmanager/alertmanager.yml.template:/etc/alertmanager/alertmanager.yml.template:ro
    - ./entrypoint.sh:/entrypoint.sh:ro
    - alertmanager_data:/alertmanager
  environment:
    - SMTP_HOST=${SMTP_HOST}
    - SMTP_FROM=${SMTP_FROM}
    - SMTP_USER=${SMTP_USER}
    - SMTP_PASS=${SMTP_PASS}
    - SLACK_WEBHOOK_URL=${SLACK_WEBHOOK_URL}
    - ALERT_EMAIL_TO=${ALERT_EMAIL_TO}
  entrypoint: ["/entrypoint.sh"]
  command:
    - '--config.file=/etc/alertmanager/alertmanager.yml'
    - '--storage.path=/alertmanager'
  restart: unless-stopped
  networks:
    - monitoring
```

### РЕШЕНИЕ 2: Использовать Kubernetes ConfigMap (для K8s)

**k8s/base/alertmanager-configmap.yaml:**
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: alertmanager-config
  namespace: monitoring
data:
  alertmanager.yml: |
    global:
      resolve_timeout: 5m
      smtp_smarthost: smtp.gmail.com:587
      smtp_from: alerts@yourdomain.com
      smtp_auth_username: your-email@gmail.com
      smtp_auth_password: "${SMTP_PASSWORD}"
      smtp_require_tls: true
    # ... остальная конфигурация
```

---

## ИСПРАВЛЕНИЕ #7: Prometheus - Исправить targets для K8s

### ДО (prometheus.yml)
```yaml
scrape_configs:
  - job_name: 'worker'
    static_configs:
      - targets:
          - 'host.docker.internal:3001'  # ❌ Не работает в K8s!
          
  - job_name: 'next-app'
    static_configs:
      - targets:
          - 'host.docker.internal:3000'  # ❌ Не работает в K8s!
```

### ПОСЛЕ (для Docker Compose и K8s совместимо)

**monitoring/prometheus/prometheus.yml:**
```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s
  external_labels:
    cluster: 'gpt-agent-platform'

alerting:
  alertmanagers:
    - static_configs:
        - targets:
            - 'alertmanager:9093'

rule_files:
  - 'alerts/*.yml'

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  # Docker Compose targets
  - job_name: 'worker'
    scrape_interval: 15s
    metrics_path: '/metrics/prometheus'
    static_configs:
      # Docker Compose: используем DNS имя сервиса
      - targets:
          - 'worker:3001'
        labels:
          service: 'worker'
    relabel_configs:
      # Для локального тестирования можно переопределить
      - source_labels: [__address__]
        regex: 'worker:3001'
        replacement: 'host.docker.internal:3001'
        target_label: __address__
        # Закомментировать для K8s!

  - job_name: 'next-app'
    scrape_interval: 15s
    metrics_path: '/api/metrics'
    static_configs:
      - targets:
          - 'app:3000'  # Docker Compose DNS имя
        labels:
          service: 'next-app'

  - job_name: 'redis-exporter'
    static_configs:
      - targets: ['redis-exporter:9121']

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']

  - job_name: 'cadvisor'
    static_configs:
      - targets: ['cadvisor:8080']
```

---

## ИСПРАВЛЕНИЕ #8: Рекомендации для K8s Deployment

### Минимальная K8s структура

**k8s/base/app-deployment.yaml:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: gpt-agent-app
  namespace: default
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: gpt-agent-app
  template:
    metadata:
      labels:
        app: gpt-agent-app
        version: v1
    spec:
      # SecurityContext
      securityContext:
        runAsNonRoot: true
        runAsUser: 1001
        fsGroup: 1001
        seccompProfile:
          type: RuntimeDefault

      # Pod Disruption Budget будет определён отдельно
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
            - weight: 100
              podAffinityTerm:
                labelSelector:
                  matchExpressions:
                    - key: app
                      operator: In
                      values:
                        - gpt-agent-app
                topologyKey: kubernetes.io/hostname

      containers:
        - name: app
          image: gpt-agent-app:latest
          imagePullPolicy: IfNotPresent
          
          ports:
            - name: http
              containerPort: 3000
              protocol: TCP
          
          env:
            - name: NODE_ENV
              value: production
            - name: PORT
              value: "3000"
            - name: REDIS_URL
              valueFrom:
                configMapKeyRef:
                  name: app-config
                  key: redis-url
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: app-secrets
                  key: database-url
          
          # Health checks
          livenessProbe:
            httpGet:
              path: /api/health
              port: http
              scheme: HTTP
            initialDelaySeconds: 40
            periodSeconds: 30
            timeoutSeconds: 10
            failureThreshold: 3
          
          readinessProbe:
            httpGet:
              path: /api/health
              port: http
              scheme: HTTP
            initialDelaySeconds: 10
            periodSeconds: 10
            timeoutSeconds: 5
            failureThreshold: 3
          
          # Resource limits
          resources:
            requests:
              cpu: 500m
              memory: 512Mi
            limits:
              cpu: 1000m
              memory: 1024Mi
          
          # Security context
          securityContext:
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true
            runAsNonRoot: true
            runAsUser: 1001
            capabilities:
              drop:
                - ALL
              add:
                - NET_BIND_SERVICE
          
          volumeMounts:
            - name: tmp
              mountPath: /tmp
            - name: cache
              mountPath: /app/.next/cache
      
      volumes:
        - name: tmp
          emptyDir: {}
        - name: cache
          emptyDir: {}
      
      # Service account
      serviceAccountName: gpt-agent-app
      
      # Termination
      terminationGracePeriodSeconds: 30
```

**k8s/base/app-service.yaml:**
```yaml
apiVersion: v1
kind: Service
metadata:
  name: gpt-agent-app
  namespace: default
spec:
  type: ClusterIP
  selector:
    app: gpt-agent-app
  ports:
    - name: http
      port: 80
      targetPort: 3000
      protocol: TCP
```

**k8s/base/hpa.yaml:**
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: gpt-agent-app-hpa
  namespace: default
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: gpt-agent-app
  minReplicas: 3
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
        - type: Percent
          value: 50
          periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
        - type: Percent
          value: 100
          periodSeconds: 30
        - type: Pods
          value: 2
          periodSeconds: 30
      selectPolicy: Max
```

---

## ИСПРАВЛЕНИЕ #9: Security Hardening для docker-compose

### docker-compose.yml с security контекстом

```yaml
version: '3.8'

services:
  app:
    build: .
    container_name: gpt-agent-app
    ports:
      - "3000:3000"
    
    # Security options
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE
    read_only: true  # Read-only filesystem
    tmpfs:
      - /tmp
      - /app/.next/cache
      - /var/cache
    
    # Logging
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
        labels: "service=app,version=latest"
    
    # Other configs...
    healthcheck:
      test: ["CMD", "curl", "-f", "http://127.0.0.1:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    
    depends_on:
      redis:
        condition: service_healthy
    
    restart: unless-stopped
    environment:
      - NODE_ENV=production
    env_file:
      - .env.local

  redis:
    image: redis:7-alpine
    container_name: gpt-agent-redis
    ports:
      - "127.0.0.1:6379:6379"
    
    # Security options
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    read_only: true
    tmpfs:
      - /tmp
    
    volumes:
      - redis-data:/data
    
    command: >
      redis-server
      --requirepass ${REDIS_PASSWORD:-change-me-in-production}
      --appendonly yes
      --maxmemory 256mb
      --maxmemory-policy allkeys-lru
    
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "${REDIS_PASSWORD:-change-me-in-production}", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    
    restart: unless-stopped
    
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
        labels: "service=redis"

volumes:
  redis-data:

networks:
  default:
    name: gpt-agent-network
    driver: bridge
```

---

## ИТОГОВЫЙ ЧЕКЛИСТ ИСПРАВЛЕНИЙ

```markdown
## Quick Fixes Checklist

### IMMEDIATE (Today)
- [ ] Fix port bindings in docker-compose.dev.yml
  - [ ] Add 127.0.0.1: to Redis port
  - [ ] Add 127.0.0.1: to PostgreSQL port
  - [ ] Apply same to docker-compose.staging.yml

### THIS WEEK
- [ ] Add resource limits to docker-compose.yml
  - [ ] CPU/Memory limits for app
  - [ ] CPU/Memory limits for worker
  - [ ] CPU/Memory limits for redis
- [ ] Optimize Dockerfile (remove npm ci duplication)
- [ ] Add health checks to all services
- [ ] Test health endpoints working

### NEXT WEEK
- [ ] Create Dockerfile.staging for staging environment
- [ ] Fix Prometheus configuration for K8s compatibility
- [ ] Create AlertManager entrypoint script
- [ ] Add security contexts to docker-compose
- [ ] Add logging configuration

### THIS MONTH
- [ ] Create basic K8s manifests (deployment, service, hpa)
- [ ] Create K8s ConfigMap and Secrets
- [ ] Document all environment variables
- [ ] Setup K8s Ingress configuration
- [ ] Create Helm chart (optional but recommended)
```

