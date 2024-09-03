import fetch from 'node-fetch';

const handler = async (_0x5b04ea, { conn: _0x24d45b, command: _0x38ad25, text: _0x29b0ac, isAdmin: _0x9e35ac }) => {
    // Verificar si el comando es 'mute'
    if (_0x38ad25 === 'mute') {
        if (!_0x9e35ac) throw '🐦‍🔥 *Solo un administrador puede ejecutar este comando*';

        const ownerNumber = global['owner'][0][0] + '@s.whatsapp.net';
        if (_0x5b04ea['sender'] === ownerNumber) throw '🐦‍🔥 *El creador del bot no puede ser mutado*';

        let targetUser = _0x5b04ea['mentionedJid'][0] || _0x5b04ea['quoted']?.sender || _0x29b0ac;

        if (targetUser === _0x24d45b['user']['id']) throw '🐦‍🔥 *No puedes mutar el bot*';

        let chat = await _0x24d45b.groupMetadata(_0x5b04ea['chat']);
        let groupOwner = chat.owner || _0x5b04ea['chat'].split`-`[0] + '@s.whatsapp.net';

        if (_0x5b04ea['sender'] === groupOwner) throw '🐦‍🔥 *El creador del grupo no puede ser mutado*';

        let user = global.db['data']['users'][targetUser];
        let muteMessage = {
            'key': { 'participants': '0@s.whatsapp.net', 'fromMe': false, 'id': 'Halo' },
            'message': { 'locationMessage': { 'name': 'Mute', 'jpegThumbnail': await (await fetch('https://telegra.ph/file/f8324d9798fa2ed2317bc.png')).buffer(), 'vcard': 'BEGIN:VCARD\nVERSION:3.0\nFN:Muted\nEND:VCARD' } },
            'participant': '0@s.whatsapp.net'
        };

        if (!_0x5b04ea['mentionedJid'][0] && !_0x5b04ea['quoted']) return _0x24d45b.reply(_0x5b04ea['chat'], '🐦‍🔥 *Menciona a la persona que deseas mutar*', _0x5b04ea);

        if (user['muted'] === true) throw '🐦‍🔥 *Este usuario ya está mutado*';

        _0x24d45b.reply(_0x5b04ea['chat'], '🐦‍🔥 *Tus mensajes serán eliminados*', muteMessage, null, { 'mentions': [targetUser] });
        global.db['data']['users'][targetUser]['muted'] = true;

    } else if (_0x38ad25 === 'unmute') {
        if (!_0x9e35ac) throw _0x5b04ea.reply('🐦‍🔥 *Solo un administrador puede ejecutar este comando*');

        let targetUser = _0x5b04ea['mentionedJid'][0] || _0x5b04ea['quoted']?.sender || _0x29b0ac;
        let user = global.db['data']['users'][targetUser];
        let unmuteMessage = {
            'key': { 'participants': '0@s.whatsapp.net', 'fromMe': false, 'id': 'Halo' },
            'message': { 'locationMessage': { 'name': 'Unmute', 'jpegThumbnail': await (await fetch('https://telegra.ph/file/aea704d0b242b8c41bf15.png')).buffer(), 'vcard': 'BEGIN:VCARD\nVERSION:3.0\nFN:Unmuted\nEND:VCARD' } },
            'participant': '0@s.whatsapp.net'
        };

        if (targetUser === _0x5b04ea['sender']) throw '🐦‍🔥 *No puedes desmutarte a ti mismo*';
        if (!_0x5b04ea['mentionedJid'][0] && !_0x5b04ea['quoted']) return _0x24d45b.reply(_0x5b04ea['chat'], '🐦‍🔥 *Menciona a la persona que deseas desmutar*', _0x5b04ea);

        if (user['muted'] === false) throw '🐦‍🔥 *Este usuario no ha sido mutado*';

        global.db['data']['users'][targetUser]['muted'] = false;
        _0x24d45b.reply(_0x5b04ea['chat'], '*Tus mensajes no serán eliminados*', unmuteMessage, null, { 'mentions': [targetUser] });
    }
};

export default handler;
