const { hash, compare } = require("bcryptjs")
const AppError = require("../utils/AppError")
const sqliteConnection = require("../database/sqlite")

class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body; 

    const database = await sqliteConnection();
    const checkUserExist = await database.get("SELECT * FROM users WHERE email = (?)", [email]); 
    const passwordHashed = await hash(password, 8);

    if(checkUserExist) {
      throw new AppError("Usuário já existente")
    }

    await database.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [ name, email, passwordHashed]);

    return response.status(201).json();
  } 

  async update(request, response) {
   const { name, email, password, old_password } = request.body;
   const user_id = request.user.id;

   const database = await sqliteConnection();
   const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id]);

   if(!user){
     throw new AppError("Cadastro não encontrado.");
   }

   const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

   if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
     throw new AppError("Este email já está em uso.")
   }

   user.name = name ?? user.name;
   user.email = email ?? user.email;

   if(password && !old_password){
    throw new AppError("Favor digitar a senha antiga.");
   } 
   
   if(password && old_password) {
    const checkOldPassword = await compare(old_password, user.password);

    if(!checkOldPassword){
      throw new AppError("Senha antiga não confere.")
    }

    user.password = await hash(password, 8)
   }


   await database.run(`
       UPDATE users SET 
       name = ?, 
       email = ?, 
       password = ?,
       updated_at = DATETIME('now') 
       WHERE id = ?`,
        [user.name, user.email, user.password, user_id]

     )
     return response.status(200).json();
  }
};

module.exports = UsersController;