import 'dotenv/config';

export const config = {
  botToken: process.env.BOT_TOKEN!,
  xui: {
    baseUrl: process.env.XUI_BASE_URL!,
    username: process.env.XUI_USERNAME!,
    password: process.env.XUI_PASSWORD!,
    inboundId: parseInt(process.env.XUI_INBOUND_ID || '1', 10),
  },
  dbPath: process.env.DATABASE_PATH || './data/vpn-bot.db',
  adminTelegramId: process.env.ADMIN_TELEGRAM_ID || '',
};
