const knex = require("../database/knex")

class DishController {
  async create(request, response) {
    const { image, name, category, price, description } = request.body
    const { user_id } = request.params;

    const [dishes_id] = await knex("dishes").insert({
      user_id,
      image,
      name,
      category,
      price,
      description
    });

    const ingredientsInsert = category.map(name => {
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
    const category = await knex("ingredients").where({ dishes_id: id }).orderBy("name");

    return response.json({
      ...dishes,
      category
    });
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex("dishes").where({ id }).delete();

    return response.json({
      message: "Prato excluido."
    });
  }

  async index(request, response) {
    const { user_id, name, category } = request.query;

    let dishes;

    if (category) {
      const filterIngredients = category.split(",").map(name => category.trim())

      dishes = await knex("ingredients")
        .select([
          "dishes.id",
          "dishes.name",
          "dishes.price",
          "dishes.description",
          "dishes.category",
          "dishes.created_at",
        ])
        .where("dishes.user_id", user_id) //
        .whereLike("dishes.name", `%${name}%`)
        .whereIn("ingredients.name", filterIngredients)
        .innerJoin("dishes", "dishes.id", "ingredients.dishes_id")
        .orderBy("dishes.name")

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
        category: dishIngredients.map(ingredients => ingredients.name) // Adicionando os ingredientes na chave category
      };
    });

    return response.json(dishesWithIngredients)
  }

}

module.exports = DishController