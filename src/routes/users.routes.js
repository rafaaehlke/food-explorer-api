const { Router } = require("express"); 
const multer = require("multer");
const ensureAuthenticator = require("../middlewares/ensureAuthenticator");
const uploadConfig = require("../configs/upload");

const usersRoutes = Router(); 
const upload = multer(uploadConfig.MULTER);

const UsersController = require("../controllers/UsersController");
const usersController = new UsersController();


usersRoutes.post("/", usersController.create); 
usersRoutes.put("/", ensureAuthenticator, usersController.update); 
usersRoutes.patch("/pictureDish", ensureAuthenticator, upload.single("pictureDish"), (request, response) => {
  console.log("imagem enviada", request.file.filename);

  response.json()
})

module.exports = usersRoutes; 