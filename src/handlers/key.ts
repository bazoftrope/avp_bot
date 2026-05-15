import { Composer, InlineKeyboard } from "grammy";
import type { MyContext } from "../bot.js";
import { getUser, createUser } from "../services/db.js";
import { addClient, getInbound } from "../services/xui-api.js";
import { generateUUID, generateVlessLink } from "../services/key-builder.js";
import { config } from "../config.js";

export const keyHandler = new Composer<MyContext>();

keyHandler.callbackQuery("get_key", async (ctx) => {
  await ctx.answerCallbackQuery();
  const tgId = ctx.from!.id;

  const existing = getUser(tgId);
  if (existing) {
    await ctx.reply(
      "🔑 У тебя уже есть ключ:\n\n" +
        `[Скопировать ссылку](${existing.keyUrl})\n\n` +
        `\`${existing.keyUrl}\`\n\n` +
        "Если нужен новый — обратись в поддержку.",
      { parse_mode: "Markdown" },
    );
    return;
  }

  await ctx.reply("⏳ Генерирую ключ, подожди...");

  try {
    const inboundData = await getInbound(config.xui.inboundId);
    const inbound = inboundData.obj;

    if (!inbound) {
      await ctx.reply(
        "❌ Ошибка: inbound не найден. Проверь настройки в .env (XUI_INBOUND_ID).",
      );
      return;
    }

    const streamSettings = JSON.parse(inbound.streamSettings || "{}");
    const realitySettings = streamSettings.realitySettings || {};

    const uuid = generateUUID();
    const email = `user_${tgId}_${Date.now()}`;
    const remark = `VPN_${tgId}`;

    const client = {
      id: uuid,
      email,
      limitIp: 0,
      totalGB: 0,
      expiryTime: 0,
      enable: true,
      tgId: String(tgId),
      subId: "",
    };

    await addClient(config.xui.inboundId, { clients: [client] });

    const link = generateVlessLink({
      uuid,
      address: "188.227.85.158",
      port: inbound.port,
      security: "reality",
      publicKey: realitySettings.settings?.publicKey || "",
      fingerprint: realitySettings.settings?.fingerprint || "chrome",
      serverName: realitySettings.serverNames?.[0] || "www.icloud.com",
      shortId: realitySettings.shortIds?.[0] || "",
      spiderX: realitySettings.settings?.spiderX || "/",
      remark,
    });

    createUser({
      telegramId: tgId,
      uuid,
      email,
      keyUrl: link,
      createdAt: Date.now(),
      expiresAt: null,
      isActive: 1,
    });

    await ctx.reply(
      "✅ Ключ создан!\n\n" +
        `[Скопировать ссылку](${link})\n\n` +
        `\`${link}\``,
      {
        parse_mode: "Markdown",
        reply_markup: new InlineKeyboard().text("📖 Инструкция", "instruction"),
      },
    );
  } catch (err: any) {
    console.error("Key generation error:", err);
    await ctx.reply(`❌ Ошибка при создании ключа: ${err.message}`);
  }
});
