const knex = require("../database/knex")

class DishController {
  async create(request, response) {
    const { image, name, category, price, description, ingredients } = request.body
    const { user_id } = request.params;

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
      const filterIngredints = category.split(",").map(ingredient => ingredient.trim());
      //console.log(filterIngredints)

      dishes = await knex("ingredients")
        .select([
          "ingredients.id",
          "ingredients.name",
        ])
        .where("dishes.user_id", user_id)
        .whereLike("dishes.name", `%${name}%`)
        .whereIn("ingredients.name", filterIngredints)
        .innerJoin("dishes", "ingredients.dishes_id", "dishes.id");

    } else {

      dishes = await knex("dishes")
        .where({ user_id }) // busca por id
        .whereLike("name", `%${name}%`)  //busca palavra chave
        .orderBy("name"); // organiza por ordem alfabética

    }

    const ingredientsTags = await knex("ingredients").where({ name });
    console.log(ingredientsTags)
    
    const dishesWithIngredients = dishes.map(dish => {
      
      const dishTags = ingredientsTags.filter(ingredient => ingredient.dishes_id === dishes.user_id)

      return {
        ...dish,
        category: dishTags
      }
    })
    return response.json(dishesWithIngredients)
  }

}

module.exports = DishController