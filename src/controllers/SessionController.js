const knex = require("../database/knex")
const { compare } = require("bcryptjs")
const AppError = require("../utils/AppError")

class SessionController {
  async create(request, response) {
    const { email, password } = request.body;

    const user = await knex("users").where({ email }).first();

    if (!user) {
      throw new AppError("Email e/ou senha incorretos.", 401);
    }

    const passwordCompare = await compare(password, user.password);

    if(!passwordCompare){
      throw new AppError("Email e/ou senha incorretos.", 401);
    }

    return response.json({ user, passwordCompare });
  }
}

module.exports = SessionController;