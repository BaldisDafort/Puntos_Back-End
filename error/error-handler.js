/**
 * Middleware pour la gestion des erreurs dans Express.
 * Il intercepte toutes les erreurs non traitées dans la chaîne de middlewares.
 *
 * @param {Error} err - L'erreur survenue dans l'application.
 * @param {import('express').Request} req - L'objet de requête Express.
 * @param {import('express').Response} res - L'objet de réponse Express.
 * @param {import('express').NextFunction} next - La fonction next d'Express.
 */
function errorHandler(err, req, res, next) {
    // Log de l'erreur pour le débogage
    console.error('Erreur détectée :', err.message);
    console.error('Details :', err.details);
  
    // Définition du code d'erreur (500 par défaut)
    const statusCode = err.statusCode || 500;
  
    // Message d'erreur à retourner
    const message = err.message || 'Erreur interne du serveur';
  
    // Envoi de la réponse JSON avec le statut et le message d'erreur
    res.status(statusCode).json(message);
  }
  
  module.exports = errorHandler;
  