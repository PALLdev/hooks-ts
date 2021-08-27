import React, { useCallback, useReducer, useMemo } from "react";
import Ingredient from "../../models/ingredient";
import ErrorModal from "../UI/ErrorModal";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";

type IngredientActionType =
  | { type: "SET"; ingredients: Ingredient[] }
  | { type: "ADD"; ingredient: Ingredient }
  | { type: "DELETE"; ingredientId: string };

type HttpActionType =
  | { type: "SEND" }
  | { type: "RESPONSE" }
  | { type: "ERROR"; errorMessage: string | null }
  | { type: "CLEAR" };

type HttpObj = {
  loading: boolean;
  error: string | null;
};

// const nameFunc = (state, action) => {return state} always returns a new state
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

const httpReducer = (currentHttpState: HttpObj, action: HttpActionType) => {
  switch (action.type) {
    case "SEND":
      return { loading: true, error: null };
    case "RESPONSE":
      return { ...currentHttpState, loading: false };
    case "ERROR":
      return { loading: false, error: action.errorMessage };
    case "CLEAR":
      return { ...currentHttpState, error: null };
    default:
      throw new Error("No se ejecuta");
  }
};

const Ingredients: React.FC = () => {
  const [userIngredients, dispatch] = useReducer(ingredientsReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null,
  });

  const addIngredient = useCallback(
    async (ingredient: Ingredient): Promise<void> => {
      dispatchHttp({ type: "SEND" });
      const response = await fetch(
        "https://hooks-ts-default-rtdb.firebaseio.com/ingredientes.json",
        {
          method: "POST",
          body: JSON.stringify({
            title: ingredient.title,
            amount: ingredient.amount,
            createdAt: ingredient.id,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      dispatchHttp({ type: "RESPONSE" });
      const responseData = await response.json();

      dispatch({
        type: "ADD",
        ingredient: {
          id: responseData.name,
          title: ingredient.title,
          amount: ingredient.amount,
        },
      });
    },
    []
  );

  const removeItem = useCallback((ingredientId: string): void => {
    dispatchHttp({ type: "SEND" });
    fetch(
      `https://hooks-ts-default-rtdb.firebaseio.com/ingredientes/${ingredientId}.json`,
      {
        method: "DELETE",
      }
    )
      .then((res) => {
        dispatchHttp({ type: "RESPONSE" });
        dispatch({ type: "DELETE", ingredientId: ingredientId });
      })
      .catch((err: Error) => {
        dispatchHttp({ type: "ERROR", errorMessage: err.message });
      });
  }, []);

  const filterIngredients = useCallback((filter: Ingredient[]): void => {
    dispatch({ type: "SET", ingredients: filter });
  }, []);

  const clearError = useCallback(() => dispatchHttp({ type: "CLEAR" }), []);

  const ingredientList = useMemo(() => {
    return <IngredientList items={userIngredients} onRemoveItem={removeItem} />;
  }, [userIngredients, removeItem]); // remove item nunca deberia cambiar ya que esta en un useCallback

  return (
    <div className="App">
      {httpState.error && (
        <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>
      )}

      <IngredientForm
        onAddIngredient={addIngredient}
        isLoading={httpState.loading}
      />

      <section>
        <Search onFilterIngredients={filterIngredients} />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;
