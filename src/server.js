require("express-async-errors")

const AppError = require("./utils/AppError")
const express = require("express"); 
const migrationsRun = require("./database/sqlite/migrations")

const routes = require("./routes"); 

const app = express(); 
app.use(express.json()); 
app.use(routes); 

migrationsRun(); 

app.use((error, request, response, next) => {
  // erro gerado pelo cliente
  if(error instanceof AppError){
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message
    });
  }

  console.error(error)

  // erro gerado pelo servidor
  return response.status(500).json({
    status: "error",
    message: "Internal server error",
  })
});


const PORT = 3333; 
app.listen(PORT, () => console.log(`server rodando na porta ${PORT}`)); 