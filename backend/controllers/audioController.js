const AudioMessage = require('../models/audioMessage');
const crypto = require('crypto');

const AES_SECRET = process.env.AES_SECRET || '12345678901234567890123456789012'; // 32 bytes

exports.getAudioMessages = async (req, res) => {
  try {
    const audios = await AudioMessage.find();

    const decryptedAudios = audios.map(audio => {
      const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(AES_SECRET), audio.iv);
      let decrypted = decipher.update(audio.audio);
      decrypted = Buffer.concat([decrypted, decipher.final()]);

      return {
        id: audio._id,
        audio: decrypted.toString('base64'), // Converti en Base64 pour affichage dans HTML
        createdAt: audio.createdAt
      };
    });

    res.json(decryptedAudios);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la récupération des messages audio.' });
  }
};
