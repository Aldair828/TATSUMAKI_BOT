import fetch from 'node-fetch';
import axios from 'axios';
import translate from '@vitalets/google-translate-api';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  organization: global.openai_org_id,
  apiKey: global.openai_key,
});

const openaiii = new OpenAIApi(configuration);

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply('*𝔼𝕊ℂℝ𝕀𝔹𝔸 𝕊𝕌 ℙℝ𝔼𝔾𝕌ℕ𝕋𝔸 ℙ𝔸ℝ𝔸 ℚ𝕌𝔼 𝔽𝔼́ℕ𝕀𝕏 𝕃𝔼 ℝ𝔼𝕊ℙ𝕆ℕ𝔻𝔸 🐦‍🔥*');
  }

  if (command === 'fenixgpt') {
    try {
      await conn.sendPresenceUpdate('composing', m.chat);

      async function luminsesi(q, username, logic) {
        try {
          const response = await axios.post("https://lumin-ai.xyz/", {
            content: q,
            user: username,
            prompt: logic,
            webSearchMode: true // true = resultado con url
          });
          return response.data.result;
        } catch (error) {
          console.error('Error al obtener:', error);
        }
      }

      let query = m.text;
      let username = `${m.pushName}`;

      let syms1 = `Actuarás como un Bot de WhatsApp el cual fue creado por Aldair, tu serás Fenix_bot 🐦‍🔥`;

      let result = await luminsesi(query, username, syms1);
      await m.reply(result);
    } catch {
      try {
        let gpt = await fetch(`https://deliriusapi-official.vercel.app/ia/gptweb?text=${text}`);
        let res = await gpt.json();
        await m.reply(res.gpt);
      } catch {
        // Manejar cualquier error adicional si es necesario
      }
    }
  }

  if (command === 'fenixgpt2') {
    conn.sendPresenceUpdate('composing', m.chat);
    let gpt = await fetch(`https://deliriusapi-official.vercel.app/ia/gptweb?text=${text}`);
    let res = await gpt.json();
    await m.reply(res.gpt);
  }
};

handler.command = /^(fenixgpt|fenixgpt2)$/i;

export default handler;
