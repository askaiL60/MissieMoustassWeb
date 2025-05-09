const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const fs = require('fs');
const AudioMessage = require('../models/audioMessage');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

const AES_SECRET = process.env.AES_SECRET || '12345678901234567890123456789012'; // 32 octets

// 📌 **Route pour le chiffrement et l'enregistrement du message vocal**
router.post('/upload', upload.single('audio'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileBuffer = fs.readFileSync(filePath);

    // 🔒 **Chiffrement AES-256-CBC**
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(AES_SECRET), iv);
    let encrypted = cipher.update(fileBuffer);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    const newAudio = new AudioMessage({
      audio: encrypted,
      iv
    });

    await newAudio.save();
    fs.unlinkSync(filePath); // Nettoyage du fichier temporaire

    res.status(201).json({ message: 'Fichier audio chiffré enregistré.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de l’enregistrement.' });
  }
});

// 🎧 **Route pour récupérer et déchiffrer les messages vocaux**
router.get('/messages', async (req, res) => {
  try {
    const audios = await AudioMessage.find();

    const decryptedAudios = audios.map(audio => {
      const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(AES_SECRET), audio.iv);
      let decrypted = decipher.update(audio.audio);
      decrypted = Buffer.concat([decrypted, decipher.final()]);

      return {
        id: audio._id,
        audio: decrypted.toString('base64'), // Converti en Base64 pour affichage
        createdAt: audio.createdAt
      };
    });

    res.json(decryptedAudios);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la récupération des messages audio.' });
  }
});

module.exports = router;
