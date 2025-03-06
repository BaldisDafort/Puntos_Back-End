const bcrypt = require('bcrypt');

// Nombre de rounds pour le sel, configurable via l'environnement
const saltRounds = process.env.BCRYPT_SALT_ROUNDS ? parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) : 10;

/**
 * Hache un mot de passe en utilisant bcrypt.
 * @param {string} password - Le mot de passe en clair à hacher.
 * @returns {Promise<string>} Le hash généré.
 */
async function hashPassword(password) {
  try {
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    throw new Error(`Erreur lors du hachage du mot de passe: ${error.message}`);
  }
}

/**
 * Compare un mot de passe en clair avec un hash bcrypt.
 * @param {string} password - Le mot de passe en clair.
 * @param {string} hash - Le hash à comparer.
 * @returns {Promise<boolean>} True si le mot de passe correspond, sinon false.
 */
async function comparePassword(password, hash) {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    throw new Error(`Erreur lors de la comparaison du mot de passe: ${error.message}`);
  }
}

module.exports = {
    hashPassword,
    comparePassword,
  };