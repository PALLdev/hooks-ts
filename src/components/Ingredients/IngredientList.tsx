import React from "react";

import "./IngredientList.css";
import Ingredient from "../../models/ingredient";

const IngredientList: React.FC<{
  items: Ingredient[];
  onRemoveItem: (id: string) => void;
}> = (props) => {
  return (
    <section className="ingredient-list">
      <h2>Listado de Ingredientes</h2>
      <ul>
        {props.items.map((ig) => (
          <li key={ig.id} onClick={props.onRemoveItem.bind(this, ig.id)}>
            <span>{ig.title}</span>
            <span>{ig.amount}x</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default IngredientList;
