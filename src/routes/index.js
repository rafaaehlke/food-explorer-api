// reune todas as rotas da aplicaçao
const { Router } = require("express");

const usersRouter = require("./users.routes");
const dishesRouter = require("./dishes.routes");
const sessionRouter = require("./session.routes");


const routes = Router(); 

routes.use("/session", sessionRouter);
routes.use("/users", usersRouter); 
routes.use("/dishes", dishesRouter); 

module.exports = routes;