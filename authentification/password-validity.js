const PASSWORD_MIN_LENGTH = 8;
const MIN_SCORE_TO_VALIDATE = 1;

/**
 * Fonction pour valider la sécurité d'un mot de passe
 * @param {} password 
 * @returns boolean (true si le mot de passe est sécurisé)
 */
function isPasswordValid (password) {

    // Compteur de score
    var score = 0;

    // Check de longueur
    if (password.length >= PASSWORD_MIN_LENGTH) {
        
        score = score+=1;
    }

    // Validation
    if (score >= MIN_SCORE_TO_VALIDATE) {
        return true;
    }
    
    return false;
}

module.exports = {
    isPasswordValid
};