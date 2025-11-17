# Production Deployment Guide

Comprehensive guide for deploying GPT Agent Platform to production.

## Prerequisites

- Node.js 20+ installed
- PostgreSQL 15+ database
- Redis 7+ instance
- Supabase account (or self-hosted)
- Domain name with SSL certificate
- CI/CD pipeline (GitHub Actions recommended)

## Environment Setup

### 1. Environment Variables

Create `.env.production`:

```bash
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
PORT=3000

# Database (Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_JWT_SECRET=your_jwt_secret

# Authentication (NextAuth)
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your_generated_secret_here

# OpenAI / AI Provider
OPENAI_API_KEY=sk-your_openai_key
OPENROUTER_API_KEY=sk-or-your_key  # Optional

# Redis
REDIS_URL=redis://your-redis-host:6379
UPSTASH_REDIS_REST_URL=https://your-upstash.upstash.io  # If using Upstash
UPSTASH_REDIS_REST_TOKEN=your_token

# Encryption
ENCRYPTION_KEY=your_32_byte_hex_key  # Generate with: openssl rand -hex 32

# Monitoring (Optional)
SENTRY_DSN=https://your-sentry-dsn
SENTRY_AUTH_TOKEN=your_sentry_token
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX  # Google Analytics
VERCEL_ANALYTICS_ID=your_vercel_id  # Vercel Analytics
```

### 2. Generate Secrets

```bash
# NextAuth secret
openssl rand -base64 32

# Encryption key
openssl rand -hex 32

# JWT secret
openssl rand -base64 64
```

### 3. Verify Environment

```bash
npm run verify:env
```

## Database Setup

### 1. Run Migrations

```bash
# Apply all migrations
npm run db:migrate

# Verify migrations
npm run db:migrate:status
```

### 2. Enable Required Extensions

```sql
-- Run in Supabase SQL Editor
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS btree_gin;
```

### 3. Set Up Row Level Security

All tables already have RLS enabled. Verify:

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

### 4. Create Indexes

```bash
# Apply performance indexes
npm run db:indexes:create
```

## Build & Deploy

### Option 1: Vercel (Recommended)

#### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

#### Configure in Vercel Dashboard

1. **Environment Variables**: Add all from `.env.production`
2. **Build Settings**:
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`
3. **Domains**: Add custom domain
4. **Edge Config**: Enable if using Edge features

### Option 2: Docker

#### Build Docker Image

```bash
# Build
docker build -t gpt-agent-platform:latest .

# Tag for registry
docker tag gpt-agent-platform:latest your-registry/gpt-agent-platform:v1.0.0

# Push
docker push your-registry/gpt-agent-platform:v1.0.0
```

#### Docker Compose

```yaml
version: '3.8'

services:
  app:
    image: your-registry/gpt-agent-platform:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    env_file:
      - .env.production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    restart: unless-stopped

volumes:
  redis-data:
```

#### Deploy

```bash
docker-compose up -d
```

### Option 3: VPS/Server

#### Prerequisites

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install certbot for SSL
sudo apt install -y certbot python3-certbot-nginx
```

#### Deploy Application

```bash
# Clone repository
git clone https://github.com/your-repo/gpt-agent-platform.git
cd gpt-agent-platform

# Install dependencies
npm ci --production

# Build
npm run build

# Start with PM2
pm2 start npm --name "gpt-agent" -- start

# Save PM2 config
pm2 save

# Setup PM2 startup
pm2 startup
```

#### Configure Nginx

```nginx
# /etc/nginx/sites-available/gpt-agent-platform
server {
    listen 80;
    server_name your-domain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Proxy to Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files caching
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
}
```

#### Enable site

```bash
sudo ln -s /etc/nginx/sites-available/gpt-agent-platform /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### SSL Certificate

```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## Post-Deployment

### 1. Health Check

```bash
curl https://your-domain.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-01-18T00:00:00.000Z"
}
```

### 2. Verify Database Connection

```bash
curl https://your-domain.com/api/health/db
```

### 3. Check Redis

```bash
curl https://your-domain.com/api/health/redis
```

### 4. Run Smoke Tests

```bash
npm run test:smoke
```

## Monitoring Setup

### 1. Sentry Error Tracking

```bash
# Install Sentry
npm install @sentry/nextjs

# Initialize
npx @sentry/wizard@latest -i nextjs
```

### 2. Uptime Monitoring

Recommended services:
- **UptimeRobot**: Free tier available
- **Pingdom**: Enterprise monitoring
- **Better Uptime**: Modern alerting

Monitor endpoints:
- `/` - Homepage
- `/api/health` - Health check
- `/login` - Authentication

### 3. Performance Monitoring

- **Vercel Analytics**: Built-in (if using Vercel)
- **Google Analytics**: User analytics
- **Web Vitals**: Core performance metrics

### 4. Log Aggregation

```bash
# Ship logs to external service
pm2 install pm2-logrotate

# Configure log rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

## Security Checklist

- [ ] All environment variables are secure
- [ ] Database uses SSL connections
- [ ] Redis requires authentication
- [ ] Rate limiting is enabled
- [ ] CORS is properly configured
- [ ] CSP headers are set
- [ ] Secrets are not committed to git
- [ ] Dependencies are up to date
- [ ] Security headers are configured
- [ ] SSL/TLS is properly configured

## Backup Strategy

### Database Backups

```bash
# Daily backups (cron job)
0 2 * * * pg_dump $DATABASE_URL | gzip > /backups/db-$(date +\%Y\%m\%d).sql.gz

# Keep last 30 days
find /backups -name "db-*.sql.gz" -mtime +30 -delete
```

### File Backups

```bash
# Backup uploaded files (if storing locally)
0 3 * * * rsync -avz /app/public/uploads /backups/uploads-$(date +\%Y\%m\%d)
```

## Rollback Procedure

### Vercel

```bash
# List deployments
vercel list

# Rollback to previous
vercel rollback [deployment-url]
```

### Docker

```bash
# Rollback to previous version
docker pull your-registry/gpt-agent-platform:v0.9.0
docker-compose up -d
```

### PM2

```bash
# Checkout previous version
git checkout v0.9.0
npm ci
npm run build
pm2 restart gpt-agent
```

## Troubleshooting

### Application won't start

```bash
# Check logs
pm2 logs gpt-agent

# Check environment
npm run verify:env

# Check port availability
lsof -i :3000
```

### Database connection issues

```bash
# Test connection
psql $DATABASE_URL

# Check migrations
npm run db:migrate:status
```

### High memory usage

```bash
# Monitor with PM2
pm2 monit

# Increase memory limit
pm2 delete gpt-agent
pm2 start npm --name "gpt-agent" --max-memory-restart 1G -- start
```

## Scaling

### Horizontal Scaling

```bash
# Run multiple instances with PM2
pm2 start npm --name "gpt-agent" -i max -- start
```

### Load Balancing

Use Nginx upstream:

```nginx
upstream app {
    server localhost:3000;
    server localhost:3001;
    server localhost:3002;
}

server {
    location / {
        proxy_pass http://app;
    }
}
```

### Database Scaling

- Enable connection pooling (already configured)
- Use read replicas for analytics queries
- Implement caching layer with Redis

## Support

- **Documentation**: https://docs.your-domain.com
- **GitHub Issues**: https://github.com/your-repo/issues
- **Email**: support@your-domain.com
