import { Telegraf } from 'telegraf';
import { json } from '@sveltejs/kit';
import { pb } from '$lib/pocketbase';

const TELEGRAM_BOT_TOKEN = '1147929416:AAHD2SqVSq-nQGtyrcxhIQbNEkcovUuB0bI';
const WEBHOOK_URL = 'https://goli.redruby.one/api/set-webhook';

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

export async function GET() {
    try {
        await bot.telegram.setWebhook(WEBHOOK_URL);
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

bot.command('start', (ctx) => {
    ctx.reply('Welcome to the CS2 Hub bot! How can I assist you today?');
});

bot.command('help', (ctx) => {
    ctx.reply('Here are the available commands:\n/start - Start the bot\n/help - Show this help message\n/latest - Get the latest CS2 news');
});

bot.command('latest', async (ctx) => {
    try {
        const latestPosts = await pb.collection('posts').getList(1, 5, {
            sort: '-created',
        });

        if (latestPosts.items.length > 0) {
            let message = 'Here are the latest CS2 news:\n\n';
            latestPosts.items.forEach((post, index) => {
                message += `${index + 1}. ${post.title}\n`;
                message += `   Created: ${new Date(post.created).toLocaleDateString()}\n`;
            });
            message += 'Visit our website for full articles!';
            ctx.reply(message);
        } else {
            ctx.reply('No recent news available. Check our website for updates!');
        }
    } catch (error) {
        console.error('Error fetching latest news:', error);
        ctx.reply('Sorry, I couldn\'t fetch the latest news. Please try again later.');
    }
});

bot.on('text', (ctx) => {
    ctx.reply('I received your message. If you need help, type /help for a list of commands.');
});

bot.catch((err, ctx) => {
    console.error(`Error for ${ctx.updateType}`, err);
});
