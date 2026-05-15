import { Bot, Context, session, SessionFlavor } from 'grammy';
import { config } from './config.js';
import { handlers } from './handlers/index.js';

interface SessionData {
  step?: string;
}

export type MyContext = Context & SessionFlavor<SessionData>;

export const bot = new Bot<MyContext>(config.botToken);

bot.use(session({ initial: (): SessionData => ({}) }));
bot.use(handlers);

bot.catch((err) => {
  console.error('Bot error:', err);
});
