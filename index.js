import axios from "axios";

export default async function ({ req, res, log }) {
    try {
        // ✅ 1. Получаем данные из запроса с обработкой ошибок
        let payload = {};
        try {
            payload = JSON.parse(req.payload || "{}");
        } catch (parseError) {
            log("❌ Ошибка парсинга payload: " + parseError.message);
            return res.json({ error: "Invalid payload format" }, 400);
        }

        const name = payload.name || "Аноним";
        const email = payload.email || "Не указан";
        const message = payload.message || "Пустое сообщение";

        // ✅ 2. Переменные окружения (из Appwrite)
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        if (!botToken || !chatId) {
            log("❌ Ошибка: Отсутствует TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID");
            return res.json({ error: "Missing Telegram credentials" }, 400);
        }

        // ✅ 3. Формируем текст сообщения
        const telegramMessage = `
             *Новое сообщение с сайта*
             *Имя:* ${name}
             *Email:* ${email}
             *Сообщение:* ${message}
        `;

        // ✅ 4. Отправляем сообщение в Telegram
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const response = await axios.post(url, {
            chat_id: chatId,
            text: telegramMessage,
            parse_mode: "Markdown",
        });

        log("✅ Telegram ответ: " + JSON.stringify(response.data));
        return res.json({ success: true, telegramResponse: response.data });

    } catch (error) {
        log("❌ Ошибка при отправке: " + (error.response?.data || error.message));
        log("❌ Полная ошибка: " + JSON.stringify(error));
        return res.json({ error: error.response?.data || error.message }, 500);
    }
}