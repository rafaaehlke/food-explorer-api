const { Router } = require("express"); 
const ensureAuthenticator = require("../middlewares/ensureAuthenticator");

const usersRoutes = Router(); 

const UsersController = require("../controllers/UsersController");
const usersController = new UsersController();


usersRoutes.post("/", usersController.create); 
usersRoutes.put("/", ensureAuthenticator, usersController.update);
module.exports = usersRoutes; 