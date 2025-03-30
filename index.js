import { Client } from "node-appwrite";
import axios from "axios"

export default async ({ req, res }) => {
  const { name, email, message } = JSON.parse(req.body);

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
  const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    await axios.post(TELEGRAM_API, {
      chat_id: TELEGRAM_CHAT_ID,
      text: `📩 Новое сообщение!\n\n👤 Имя: ${name}\n📧 Email: ${email}\n💬 Сообщение: ${message}`,
    });

    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};
