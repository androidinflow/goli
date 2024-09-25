import { TELEGRAM_BOT_TOKEN } from '$env/static/private';

export async function sendTelegramMessage(chatId, message) {
    const botToken = TELEGRAM_BOT_TOKEN;
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to send Telegram message');
    }

    return await response.json();
}