#!/bin/bash

# Скрипт для запуска мониторинга локально (Prometheus/Grafana/Alertmanager)
# Использование: ./scripts/start-monitoring-local.sh

set -e

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
MONITORING_DIR="$PROJECT_DIR/monitoring"

echo "📊 Запуск локального мониторинга"
echo "================================="
echo ""

# Проверка наличия Docker
if ! command -v docker &> /dev/null; then
  echo -e "${RED}❌ Ошибка: Docker не установлен${NC}"
  echo ""
  echo "Установите Docker:"
  echo "  macOS: https://docs.docker.com/desktop/install/mac-install/"
  echo "  Ubuntu: sudo apt-get install docker.io docker-compose"
  exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
  echo -e "${RED}❌ Ошибка: Docker Compose не установлен${NC}"
  echo ""
  echo "Установите Docker Compose:"
  echo "  macOS: Входит в состав Docker Desktop"
  echo "  Ubuntu: sudo apt-get install docker-compose"
  exit 1
fi

# Проверка наличия директории monitoring
if [ ! -d "$MONITORING_DIR" ]; then
  echo -e "${RED}❌ Ошибка: Директория monitoring не найдена${NC}"
  exit 1
fi

# Проверка наличия docker-compose.yml
if [ ! -f "$MONITORING_DIR/docker-compose.yml" ]; then
  echo -e "${RED}❌ Ошибка: docker-compose.yml не найден${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Docker и Docker Compose найдены${NC}"
echo ""

# Проверка, не запущены ли уже контейнеры
if docker ps | grep -q "prometheus\|grafana\|alertmanager"; then
  echo -e "${YELLOW}⚠️  Обнаружены запущенные контейнеры мониторинга${NC}"
  echo ""
  echo "Выберите действие:"
  echo "1. Остановить существующие и запустить заново"
  echo "2. Просто запустить (если контейнеры остановлены)"
  echo "3. Отменить"
  echo ""
  read -p "Ваш выбор (1-3): " choice
  
  case $choice in
    1)
      echo "🛑 Остановка существующих контейнеров..."
      cd "$MONITORING_DIR"
      docker-compose down 2>/dev/null || docker compose down 2>/dev/null
      echo -e "${GREEN}✅ Контейнеры остановлены${NC}"
      ;;
    2)
      echo "▶️  Запуск существующих контейнеров..."
      ;;
    3)
      echo -e "${YELLOW}⚠️  Отменено${NC}"
      exit 0
      ;;
  esac
fi

# Запуск мониторинга
echo ""
echo "🚀 Запуск мониторинга..."
cd "$MONITORING_DIR"

if docker-compose up -d 2>/dev/null || docker compose up -d 2>/dev/null; then
  echo -e "${GREEN}✅ Мониторинг запущен${NC}"
else
  echo -e "${RED}❌ Ошибка при запуске мониторинга${NC}"
  exit 1
fi

# Подождать немного для запуска
echo ""
echo "⏳ Ожидание запуска сервисов (10 секунд)..."
sleep 10

# Проверка статуса
echo ""
echo "📊 Статус контейнеров:"
cd "$MONITORING_DIR"
docker-compose ps 2>/dev/null || docker compose ps 2>/dev/null

echo ""
echo "✅ Мониторинг запущен!"
echo ""
echo "🔗 Доступ к сервисам:"
echo "   - Prometheus: http://localhost:9090"
echo "   - Grafana: http://localhost:3000 (admin/admin)"
echo "   - Alertmanager: http://localhost:9093"
echo ""
echo "💡 Полезные команды:"
echo "   - Просмотр логов: cd monitoring && docker-compose logs -f"
echo "   - Остановка: cd monitoring && docker-compose down"
echo "   - Перезапуск: cd monitoring && docker-compose restart"
echo ""

