const { Router } = require("express"); 

const dishRoutes = Router(); 

const DishController = require("../controllers/DishController");
const dishController = new DishController();

dishRoutes.get("/", dishController.index); 
dishRoutes.post("/:user_id", dishController.create); 
dishRoutes.get("/:id", dishController.show); 
dishRoutes.delete("/:id", dishController.delete); 




module.exports = dishRoutes; 