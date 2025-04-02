const AppError = require("../utils/AppError");

function verifyUserAdmin(roleToVerify) {
  return (request, response, next) => {
    const { role } = request.user;

    if (role !== roleToVerify) {
      throw new AppError("Não Autorizado.", 401)
    };

    return next();
  }
}

module.exports = verifyUserAdmin; 