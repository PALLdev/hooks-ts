import React, { useCallback, useReducer, useMemo } from "react";
import Ingredient from "../../models/ingredient";
import ErrorModal from "../UI/ErrorModal";
import useHttp from "../../hooks/http";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";
import { useEffect } from "react";

type IngredientActionType =
  | { type: "SET"; ingredients: Ingredient[] }
  | { type: "ADD"; ingredient: Ingredient }
  | { type: "DELETE"; ingredientId: string | undefined | Ingredient };

const ingredientsReducer = (
  currentIngredients: Ingredient[],
  action: IngredientActionType
) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...currentIngredients, action.ingredient];
    case "DELETE":
      return currentIngredients.filter((ig) => ig.id !== action.ingredientId);
    default:
      throw new Error("No deberia ejecutarme");
  }
};

const Ingredients: React.FC = () => {
  const [userIngredients, dispatch] = useReducer(ingredientsReducer, []);

  const {
    isLoading,
    data,
    error,
    sendRequest,
    requestExtra,
    requestIdentifier,
    clear,
  } = useHttp(); // custom hook that sets up the logic for making a request

  useEffect(() => {
    if (!isLoading && !error && requestIdentifier === "REMOVE_INGREDIENT") {
      dispatch({ type: "DELETE", ingredientId: requestExtra });
    } else if (!isLoading && !error && requestIdentifier === "ADD_INGREDIENT") {
      const objIngredient = Object(requestExtra);
      dispatch({
        type: "ADD",
        ingredient: { ...objIngredient, id: data.name },
      });
    }
  }, [data, requestExtra, requestIdentifier, isLoading, error]);

  const addIngredient = useCallback(
    async (ingredient: Ingredient): Promise<void> => {
      sendRequest(
        "https://hooks-ts-default-rtdb.firebaseio.com/ingredientes.json",
        "POST",
        JSON.stringify({
          title: ingredient.title,
          amount: ingredient.amount,
          createdAt: ingredient.id,
        }),
        ingredient,
        "ADD_INGREDIENT"
      );
    },
    [sendRequest]
  );

  const removeItem = useCallback(
    (ingredientId: string): void => {
      sendRequest(
        `https://hooks-ts-default-rtdb.firebaseio.com/ingredientes/${ingredientId}.json`,
        "DELETE",
        undefined,
        ingredientId,
        "REMOVE_INGREDIENT"
      );
    },
    [sendRequest]
  );

  const filterIngredients = useCallback((filter: Ingredient[]): void => {
    dispatch({ type: "SET", ingredients: filter });
  }, []);

  const ingredientList = useMemo(() => {
    return <IngredientList items={userIngredients} onRemoveItem={removeItem} />;
  }, [userIngredients, removeItem]); // remove item nunca deberia cambiar ya que esta en un useCallback

  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}

      <IngredientForm onAddIngredient={addIngredient} isLoading={isLoading} />

      <section>
        <Search onFilterIngredients={filterIngredients} />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;
