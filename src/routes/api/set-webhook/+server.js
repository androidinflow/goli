import { Telegraf } from 'telegraf';
import { json } from '@sveltejs/kit';

const TELEGRAM_BOT_TOKEN = '1147929416:AAHD2SqVSq-nQGtyrcxhIQbNEkcovUuB0bI'; // Hard-coded token (replace with your actual token)
const WEBHOOK_URL = 'https://goli.redruby.one/api/set-webhook'; // Hard-coded webhook URL (replace with your actual URL)

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

export async function GET() {
    try {
        // Set the webhook
        await bot.telegram.setWebhook(WEBHOOK_URL);
        
        // Get webhook info to verify it's set correctly
        const webhookInfo = await bot.telegram.getWebhookInfo();
        
        return json({
            ok: true,
            webhookInfo
        }, { status: 200 });
    } catch (error) {
        console.error('Error setting webhook:', error);
        return json({
            ok: false,
            error: error.message
        }, { status: 500 });
    }
}

export async function POST({ request }) {
    try {
        const update = await request.json();
        await bot.handleUpdate(update);
        return new Response(null, { status: 200 });
    } catch (error) {
        console.error('Error handling update:', error);
        return json({
            ok: false,
            error: error.message
        }, { status: 500 });
    }
}

// Bot commands
bot.command('start', (ctx) => {
    ctx.reply('Welcome to the CS2 Hub bot! How can I assist you today?');
});

bot.command('help', (ctx) => {
    ctx.reply('Here are the available commands:\n/start - Start the bot\n/help - Show this help message\n/latest - Get the latest CS2 news');
});

bot.command('latest', async (ctx) => {
    // This is a placeholder. In a real scenario, you'd fetch the latest news from an API or database.
    ctx.reply('The latest CS2 update includes new maps and weapon balancing. Check our website for more details!');
});

// Handle text messages
bot.on('text', (ctx) => {
    ctx.reply('I received your message. If you need help, type /help for a list of commands.');
});

// Error handling
bot.catch((err, ctx) => {
    console.error(`Error for ${ctx.updateType}`, err);
});
