const knex = require("../database/knex");
const { compare } = require("bcryptjs");
const AppError = require("../utils/AppError");
const authConfig = require("../configs/auth");
const { sign } = require("jsonwebtoken");

class SessionController {
  async create(request, response) {
    const { email, password } = request.body;

    const user = await knex("users").where({ email }).first();

    if (!user) {
      throw new AppError("Email e/ou senha incorretos.", 401);
    }

    const passwordCompare = await compare(password, user.password);

    if (!passwordCompare) {
      throw new AppError("Email e/ou senha incorretos.", 401);
    }

    const { secret, expiresIn } = authConfig.jwt
    const token = sign({ role: user.role }, secret, {
      subject: String(user.id),
      expiresIn
    }); 

    delete user.password;

    return response.json({ user, token });
  }
}

module.exports = SessionController;