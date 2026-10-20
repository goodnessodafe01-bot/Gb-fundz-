const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('session');

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;

    for (const msg of messages) {
      if (!msg.message || msg.key.fromMe) continue;

      const from = msg.key.remoteJid;
      const text = msg.message.conversation ||
        msg.message.extendedTextMessage?.text || '';

      if (text.toLowerCase() === '.menu') {
        await sock.sendMessage(from, {
          text: '🤖 GBFUNDZ BOT\n\n.menu - Show menu\n.ping - Check bot\n.owner - Owner information\n\nPowered by GBFUNDZ 💚'
        });
      } else if (text.toLowerCase() === '.ping') {
        await sock.sendMessage(from, { text: 'GBFUNDZ is online! ✅' });
      } else if (text.toLowerCase() === '.owner') {
        await sock.sendMessage(from, { text: 'Bot owner: GBFUNDZ 💚' });
      } else {
        await sock.sendMessage(from, {
          text: 'Welcome to GBFUNDZ WhatsApp Bot! 🤖\nType .menu to see commands.'
        });
      }
    }
  });
}

startBot().catch(console.error);
