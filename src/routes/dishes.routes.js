const { Router } = require("express"); 
const ensureAuthenticator = require("../middlewares/ensureAuthenticator");
const verifyUserAdmin = require("../middlewares/verifyUserAdmin")

const dishRoutes = Router(); 

const DishController = require("../controllers/DishController");
const dishController = new DishController();


const multer = require("multer");
const uploadConfig = require("../configs/upload");
const upload = multer(uploadConfig.MULTER);


dishRoutes.use(ensureAuthenticator);
dishRoutes.get("/", dishController.index); 
dishRoutes.post("/", verifyUserAdmin("admin"), upload.single("image"), dishController.create); 
dishRoutes.get("/:id", dishController.show); 
dishRoutes.delete("/:id", verifyUserAdmin("admin"), dishController.delete); 
dishRoutes.patch("/:id", verifyUserAdmin("admin"), upload.single("image"), dishController.update)



module.exports = dishRoutes; 