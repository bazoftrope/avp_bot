import type { MyContext } from '../bot.js';
import { config } from '../config.js';

export function isAdmin(ctx: MyContext): boolean {
  return ctx.from?.id === parseInt(config.adminTelegramId, 10);
}

export async function requireAdmin(ctx: MyContext, next: () => Promise<void>): Promise<void> {
  if (!isAdmin(ctx)) {
    await ctx.reply('⛔ У тебя нет доступа к этой команде.');
    return;
  }
  await next();
}
