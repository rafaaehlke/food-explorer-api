const { Router } = require("express"); 
const ensureAuthenticator = require("../middlewares/ensureAuthenticator");

const dishRoutes = Router(); 

const DishController = require("../controllers/DishController");
const dishController = new DishController();


const multer = require("multer");
const uploadConfig = require("../configs/upload");
const upload = multer(uploadConfig.MULTER);


dishRoutes.use(ensureAuthenticator);
dishRoutes.get("/", dishController.index); 
dishRoutes.post("/", dishController.create); 
dishRoutes.get("/:id", dishController.show); 
dishRoutes.delete("/:id", dishController.delete); 
dishRoutes.patch("/:id/pictureDish", ensureAuthenticator, upload.single("pictureDish"), dishController.update)



module.exports = dishRoutes; 