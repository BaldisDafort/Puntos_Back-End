// jwtUtils.js
const jwt = require('jsonwebtoken');

// Clé secrète pour signer les tokens et temps d'expiration, configurables via l'environnement
const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN;

/**
 * 
 * @returns permet de vérifier si les variables d'environnement de JWT sont bien initialisées
 */
function isJSONWebTokenInitialized() {
    if(!jwtSecret || !jwtExpiresIn) {
        return false;
    }
    return true;
}

/**
 * Génère un token JWT à partir d'un payload.
 * @param {Object} payload - Les données à intégrer dans le token.
 * @returns {string} Le token signé.
 */
function generateToken(payload) {

    if(!isJSONWebTokenInitialized()) {
        throw Error("Les variables d environement de JSON Web Token ne sont pas initialisée. Vérifier le fichier .env")
    }

    try {
    return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });
    } catch (error) {
    throw new Error(`Erreur lors de la génération du token: ${error.message}`);
    }
}

/**
 * Vérifie un token JWT.
 * @param {string} token - Le token à vérifier.
 * @returns {Object} Le payload décodé du token.
 * @throws {Error} Si la vérification échoue.
 */
function verifyToken(token) {
    
    if(!isJSONWebTokenInitialized()) {
        throw Error("Les variables d'environnement de JSON Web Token ne sont pas initialisées. Vérifier le fichier .env")
    }

    try {
    return jwt.verify(token, jwtSecret);
    } catch (error) {
    throw new Error(`Token invalide ou expiré: ${error.message}`);
    }
}

module.exports = {
    verifyToken,
    isJSONWebTokenInitialized,
    generateToken
  };