import { Composer } from 'grammy';
import type { MyContext } from '../bot.js';
import { startHandler } from './start.js';
import { keyHandler } from './key.js';

export const handlers = new Composer<MyContext>();
handlers.use(startHandler);
handlers.use(keyHandler);
