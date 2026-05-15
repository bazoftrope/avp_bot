import { Composer, InlineKeyboard } from "grammy";
import type { MyContext } from "../bot.js";

export const startHandler = new Composer<MyContext>();

startHandler.command("start", async (ctx) => {
  const keyboard = new InlineKeyboard()
    .text("🔑 Получить VPN ключ", "get_key")
    .row()
    .text("ℹ️ Инструкция", "instruction")
    .row()
    .text("📞 Поддержка", "support");

  await ctx.reply(
    "👋 Привет! Я бот для выдачи VPN-ключей.\n\n" +
      "Нажми кнопку ниже, чтобы получить ключ доступа.",
    { reply_markup: keyboard },
  );
});

startHandler.callbackQuery("instruction", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply(
    "📱 *Как подключиться:*\n\n" +
      "1. Установи приложение:\n" +
      "   • Android — V2RayNG / Hiddify\n" +
      "   • iOS — Shadowrocket / Streisand\n" +
      "   • Windows/Mac — V2RayN / Nekoray / Hiddify\n\n" +
      "2. Скопируй полученную ссылку `vless://...`\n\n" +
      "3. Вставь в приложение или отсканируй QR-код\n\n" +
      "4. Нажми «Подключиться» ✅",
    { parse_mode: "Markdown" },
  );
});

startHandler.callbackQuery("support", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply("📞 По вопросам обращайся к администратору.");
});
