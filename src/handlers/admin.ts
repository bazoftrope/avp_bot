import { Composer } from 'grammy';
import type { MyContext } from '../bot.js';
import { requireAdmin } from '../middlewares/admin.js';
import { getAllUsers, deactivateUser, getUser } from '../services/db.js';
import { getInbound } from '../services/xui-api.js';

export const adminHandler = new Composer<MyContext>();

// Middleware для всех админ-команд
adminHandler.use(requireAdmin);

adminHandler.command('users', async (ctx) => {
  const users = getAllUsers();
  if (users.length === 0) {
    await ctx.reply('👥 Пользователей пока нет.');
    return;
  }

  let text = `👥 Всего пользователей: ${users.length}\n\n`;
  for (const u of users) {
    const status = u.isActive ? '🟢' : '🔴';
    const date = new Date(u.createdAt).toLocaleDateString('ru-RU');
    text += `${status} <code>${u.telegramId}</code> | ${u.email} | ${date}\n`;
  }

  await ctx.reply(text, { parse_mode: 'HTML' });
});

adminHandler.command('stats', async (ctx) => {
  const users = getAllUsers();
  const active = users.filter((u) => u.isActive).length;
  const inactive = users.length - active;

  let text = '📊 <b>Статистика</b>\n\n';
  text += `👥 Всего пользователей: ${users.length}\n`;
  text += `🟢 Активных: ${active}\n`;
  text += `🔴 Заблокированных: ${inactive}\n`;

  try {
    const inboundData = await getInbound(1);
    const inbound = inboundData.obj;
    const settings = JSON.parse(inbound.settings || '{}');
    const clients = settings.clients || [];
    text += `\n🔌 Клиентов в 3X-UI: ${clients.length}`;
  } catch {
    // ignore
  }

  await ctx.reply(text, { parse_mode: 'HTML' });
});

adminHandler.command('ban', async (ctx) => {
  const args = ctx.message?.text?.split(' ').slice(1);
  const targetId = args?.[0] ? parseInt(args[0], 10) : NaN;

  if (isNaN(targetId)) {
    await ctx.reply('⚠️ Укажи ID пользователя: /ban 123456789');
    return;
  }

  const user = getUser(targetId);
  if (!user) {
    await ctx.reply('❌ Пользователь не найден.');
    return;
  }

  deactivateUser(targetId);
  await ctx.reply(`🔴 Пользователь <code>${targetId}</code> заблокирован.`, { parse_mode: 'HTML' });
});

adminHandler.command('broadcast', async (ctx) => {
  const args = ctx.message?.text?.split(' ').slice(1).join(' ');
  if (!args) {
    await ctx.reply('⚠️ Укажи текст для рассылки: /broadcast Привет всем!');
    return;
  }

  const users = getAllUsers();
  let sent = 0;
  let failed = 0;

  for (const u of users) {
    try {
      await ctx.api.sendMessage(u.telegramId, `📢 <b>Сообщение от администрации:</b>\n\n${args}`, { parse_mode: 'HTML' });
      sent++;
    } catch {
      failed++;
    }
  }

  await ctx.reply(`✅ Отправлено: ${sent}\n❌ Не удалось: ${failed}`);
});
