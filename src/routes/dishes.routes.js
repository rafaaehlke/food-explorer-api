const { Router } = require("express"); 
const ensureAuthenticator = require("../middlewares/ensureAuthenticator");

const dishRoutes = Router(); 

const DishController = require("../controllers/DishController");
const dishController = new DishController();


dishRoutes.use(ensureAuthenticator);
dishRoutes.get("/", dishController.index); 
dishRoutes.post("/", dishController.create); 
dishRoutes.get("/:id", dishController.show); 
dishRoutes.delete("/:id", dishController.delete); 




module.exports = dishRoutes; 