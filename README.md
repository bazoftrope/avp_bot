# VPN Telegram Bot

MVP Telegram-бот для выдачи VPN-ключей (VLESS + XTLS-Reality).

## Стек

- **Node.js 18+** + TypeScript (ESM)
- **GrammY** — Telegram Bot API
- **better-sqlite3** — база данных пользователей
- **undici** — кастомный HTTP Agent для игнорирования self-signed сертификата 3X-UI

## Установка

```bash
npm install
```

## Настройка

Скопируй `.env.example` в `.env` и заполни:

```bash
cp .env.example .env
```

| Переменная | Описание |
|------------|----------|
| `BOT_TOKEN` | Токен от [@BotFather](https://t.me/BotFather) |
| `XUI_BASE_URL` | URL панели 3X-UI (с WebBasePath) |
| `XUI_USERNAME` | Логин от 3X-UI |
| `XUI_PASSWORD` | Пароль от 3X-UI |
| `XUI_INBOUND_ID` | ID inbound (обычно 1) |
| `DATABASE_PATH` | Путь к SQLite |
| `ADMIN_TELEGRAM_ID` | Твой Telegram ID для админки |

## Запуск

```bash
# Разработка
npm run dev

# Production
npm run build
npm start
```

## Что умеет бот

1. `/start` — приветствие и меню
2. **Получить VPN ключ** — создаёт клиента в 3X-UI, генерирует `vless://` ссылку, сохраняет в SQLite
3. **Инструкция** — как подключиться на Android/iOS/PC
4. **Поддержка** — заглушка

## TODO

- [ ] Интеграция платёжной системы
- [ ] Админ-панель (список пользователей, статистика)
- [ ] Автоматическая деактивация просроченных ключей
- [ ] QR-код для быстрого подключения
- [ ] Масштабирование на несколько серверов
