# Base Node.js légère
FROM node:18-alpine

# Définir le dossier de travail
WORKDIR /app

# Copier les fichiers de dépendances et installer les modules
COPY package.json package-lock.json ./
RUN npm install

# Copier tout le backend dans le conteneur
COPY . .

# Définir la connexion MongoDB
ENV MONGO_URI="mongodb://root:root@mongodb:27017/moustasweb?authSource=admin"

# Exposer le port utilisé par l'API
EXPOSE 3000

# Lancer le serveur Node.js
CMD ["npm", "start"]
