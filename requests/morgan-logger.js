/**
 * @fileoverview Middleware Morgan pour la journalisation des requêtes HTTP.
 * Ce module configure Morgan pour utiliser le format "combined" et écrire les logs
 * dans un fichier nommé "access.log". En environnement non-production, les logs
 * sont également affichés dans la console.
 *
 * @module morganLogger
 */

const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// Définition du chemin vers le fichier de log
const logFilePath = path.join(__dirname, 'access.log');

/**
 * Création d'un flux d'écriture en mode "append" pour le fichier de log.
 * @type {fs.WriteStream}
 */
const accessLogStream = fs.createWriteStream(logFilePath, { flags: 'a' });

/**
 * Flux personnalisé qui écrit les logs dans le fichier et, en environnement de développement,
 * affiche également les logs dans la console.
 *
 * @type {{write: function(string): void}}
 */
const combinedStream = {
  /**
   * Méthode d'écriture du log.
   * @param {string} message - Le message de log à écrire.
   */
  write: (message) => {
    accessLogStream.write(message);
    if (process.env.NODE_ENV !== 'production') {
      process.stdout.write(message);
    }
  }
};

/**
 * Middleware Morgan configuré pour utiliser le format "combined".
 * @constant
 * @type {Function}
 */
const logger = morgan('combined', { stream: combinedStream });

module.exports = logger;
