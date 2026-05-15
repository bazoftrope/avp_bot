import { bot } from "./bot.js";

console.log("🚀 Starting VPN bot...");

bot
  .start({
    onStart: (botInfo) => {
      console.log(`✅ Bot @${botInfo.username} is running on polling`);
    },
  })
  .catch((err) => {
    console.error("❌ Failed to start bot:", err);
    process.exit(1);
  });
