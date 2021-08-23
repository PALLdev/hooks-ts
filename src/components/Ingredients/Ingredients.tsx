import React, { useState } from "react";
import Ingredient from "../../models/ingredient";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";

const Ingredients: React.FC = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  const addIngredient = (ingredient: Ingredient): void => {
    // setIngredients((prevIngredList) => prevIngredList.concat(ingredient));
    setIngredients((prevIngredList) => [...prevIngredList, ingredient]);
  };

  const removeItem = (ingredientId: string): void => {
    setIngredients((prevIngredList) =>
      prevIngredList.filter((ing) => ing.id !== ingredientId)
    );
  };

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredient} />

      <section>
        <Search />
        <IngredientList items={ingredients} onRemoveItem={removeItem} />
      </section>
    </div>
  );
};

export default Ingredients;
