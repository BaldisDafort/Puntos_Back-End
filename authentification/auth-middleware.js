const { verifyToken } = require('./json_web_token-utility');

/**
 * Middleware pour protéger les routes nécessitant une authentification.
 * Il s'assure qu'un token JWT est fourni dans l'en-tête Authorization au format "Bearer <token>".
 * Si le token est valide, les informations décodées sont ajoutées à req.user pour un usage ultérieur.
 *
 * @param {import('express').Request} req - L'objet de requête Express.
 * @param {import('express').Response} res - L'objet de réponse Express.
 * @param {import('express').NextFunction} next - La fonction next d'Express.
 */
function authMiddleware(req, res, next) {
    // Extraction de l'en-tête Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({ message: "Accès refusé. Aucun token fourni." });
    }

    // Le token doit être au format "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ message: "Format du token invalide." });
    }

    const token = parts[1];

    try {
        // Vérification du token JWT
        const decoded = verifyToken(token);
        // Ajout des informations du token à la requête pour une utilisation ultérieure
        req.user = decoded;
        // Passage au middleware suivant
        next();
    } catch (error) {
        // En cas d'erreur, renvoyer une réponse 401
        return res.status(401).json({ message: error.message });
    }
}

module.exports = authMiddleware;
