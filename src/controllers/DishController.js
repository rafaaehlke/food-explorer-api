const knex = require("../database/knex")
const AppError = require("../utils/AppError")
const DiskStorage = require("../providers/DiskStorage");

class DishController {
  async create(request, response) {
    const {name, category, ingredients, price, description } = request.body;
    const user_id = request.user.id;

    const image = request.file?.filename;

    const [dishes_id] = await knex("dishes").insert({
      user_id,
      image,
      name,
      category,
      price,
      description
    });

    const ingredientsInsert = ingredients.map(name => {
      return {
        dishes_id,
        name
      }
    });

    await knex("ingredients").insert(ingredientsInsert);

    return response.status(201).json({
      message: 'Prato cadastrado com sucesso.'
    });
  }

  async show(request, response) {
    const { id } = request.params;

    const dishes = await knex("dishes").where({ id }).first();
    
    const ingredients = await knex("ingredients").where({ dishes_id: id }).orderBy("name");

    return response.json({
      ...dishes,
      ingredients
    });
  }

  async index(request, response) {
    const { name, ingredients } = request.query;
    const user_id = request.user.id;

    let dishes;

    if (ingredients) {
      const filterIngredients = ingredients.split(",").map(name => ingredients.trim());

      dishes = await knex("ingredients")
        .select([
          "dishes.id",
          "dishes.name",
          "dishes.price",
          "dishes.description",
          "dishes.ingredients",
          "dishes.created_at",
        ])
        .where("dishes.user_id", user_id) //
        .whereLike("dishes.name", `%${name}%`)
        .whereIn("ingredients.name", filterIngredients)
        .innerJoin("dishes", "dishes.id", "ingredients.dishes_id")
        .orderBy("dishes.name");

    } else {

      dishes = await knex("dishes")
        .where({ user_id }) // busca por id
        .whereLike("name", `%${name}%`)  //busca palavra chave
        .orderBy("name"); // organiza por ordem alfabética

    }

    const dishesIngredients = await knex("ingredients")
      .select("ingredients.name", "ingredients.dishes_id")
      .innerJoin("dishes", "dishes.id", "ingredients.dishes_id")
      .where("dishes.user_id", user_id); // Fazendo o join e filtrando pelos pratos do usuário

    // Associando ingredientes aos pratos
    const dishesWithIngredients = dishes.map(dish => {
      const dishIngredients = dishesIngredients.filter(ingredient => ingredient.dishes_id === dish.id);

      return {
        ...dish,
        ingredients: dishIngredients.map(ingredients => ingredients.name) // Adicionando os ingredientes na chave category
      };
    });

    return response.json(dishesWithIngredients);
  }

  async update(request, response) {
    const { id } = request.params;
    const dishFileName = request.file.filename;

    const diskStorage = new DiskStorage();

    const dish = await knex("dishes").where({ id }).first();

    if (!dish) {
      throw new AppError("Prato não encontrado.");
    }

    if (dish.image) {
      await diskStorage.deleteFile(dish.image);
    }

    const filename = await diskStorage.saveFile(dishFileName);
    dish.image = filename;

    await knex("dishes").where({ id: dish.id }).update({ image: dish.image });

    return response.json(dish);
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex("dishes").where({ id }).delete();

    return response.json({
      message: "Prato excluido."
    });
  }

}

module.exports = DishController