import React, { useState } from "react";
import Ingredient from "../../models/ingredient";

import Card from "../UI/Card";
import "./IngredientForm.css";

type IngredientObj = {
  title: string;
  amount: string;
};

const IngredientForm: React.FC<{
  onAddIngredient: (ingred: Ingredient) => void;
}> = React.memo((props) => {
  const [data, setData] = useState<IngredientObj>({
    title: "",
    amount: "",
  });

  const onChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const name = event.target.name;
    setData((oldData) => ({ ...oldData, [name]: event.target.value }));
  };

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    const ingredient = new Ingredient(data.title, Number(data.amount));
    props.onAddIngredient(ingredient);
    setData(() => ({ title: "", amount: "" }));
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Nombre</label>
            <input
              type="text"
              id="title"
              name="title"
              value={data.title}
              onChange={onChangeHandler}
            />
          </div>
          <div className="form-control">
            <label htmlFor="amount">Cantidad</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={data.amount}
              onChange={onChangeHandler}
            />
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Agregar Ingrediente</button>
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
