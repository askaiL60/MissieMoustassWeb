const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const router = express.Router();

// 🔹 Récupérer tous les utilisateurs
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, '_id email');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// 🔹 Ajouter un nouvel utilisateur (avec mot de passe sécurisé)
router.post('/users', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email et mot de passe requis' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Utilisateur ajouté' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// 🔹 Modifier un utilisateur (email et/ou mot de passe)
router.put('/users/:id', async (req, res) => {
  try {
    const { email, password } = req.body;
    let updateData = {};

    if (email) updateData.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!updatedUser) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    res.json({ message: 'Utilisateur modifié' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// 🔹 Supprimer un utilisateur après confirmation
router.delete('/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    res.json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
