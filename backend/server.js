/* const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const audioRoutes = require('./routes/audioRoutes');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/moustasweb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connecté'))
  .catch(err => console.error(err));

app.use('/api/auth', authRoutes);
app.use('/api/audio', audioRoutes);
app.use('/api', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});

module.exports = app; */
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// 📌 Connexion MongoDB via Docker
mongoose.connect(process.env.MONGO_URI || 'mongodb://root:root@mongodb:27017/moustasweb?authSource=admin', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB connecté via Docker'))
  .catch(err => console.error('❌ Erreur MongoDB:', err));

// Servir les fichiers statiques du frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Route pour afficher `connexion.html` à la racine
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'connexion.html'));
});

// 📌 Routes API
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/audio', require('./routes/audioRoutes'));
app.use('/api', require('./routes/userRoutes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});

module.exports = app;
