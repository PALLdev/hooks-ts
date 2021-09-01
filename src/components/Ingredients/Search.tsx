import React, { useEffect, useState, useRef } from "react";
import useHttp from "../../hooks/http";
import Ingredient from "../../models/ingredient";

import Card from "../UI/Card";
import ErrorModal from "../UI/ErrorModal";
import "./Search.css";

const Search: React.FC<{
  onFilterIngredients: (filter: Ingredient[]) => void;
}> = React.memo((props) => {
  const [enteredFilter, setEnteredFilter] = useState("");
  const filterInputRef = useRef<HTMLInputElement>(null);
  const { onFilterIngredients } = props;
  const { data, sendRequest, isLoading, error, clear } = useHttp();

  useEffect(() => {
    const timer = setTimeout(() => {
      // si el valor del input es el mismo (enteredFilter: valor antiguo, cuando se ejecuto el timer | ref: valor actual)
      if (enteredFilter === filterInputRef.current?.value) {
        const query =
          enteredFilter.length === 0
            ? ""
            : `?orderBy="title"&equalTo="${enteredFilter}"`;
        sendRequest(
          "https://hooks-ts-default-rtdb.firebaseio.com/ingredientes.json" +
            query,
          "GET"
        );
      }
      // clean-up function, runs before this effect is recalled
      return () => {
        clearTimeout(timer);
      };
    }, 500);
  }, [enteredFilter, filterInputRef, sendRequest]);

  useEffect(() => {
    if (!isLoading && !error && data) {
      const loadedIngredients: Ingredient[] = [];
      for (const key in data) {
        loadedIngredients.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount,
        });
      }
      onFilterIngredients(loadedIngredients);
    }
  }, [data, isLoading, error, onFilterIngredients]);

  return (
    <section className="search">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label htmlFor="texto">Filtrar por titulo</label>
          {isLoading && <span>Cargando ...</span>}
          <input
            ref={filterInputRef}
            id="texto"
            type="text"
            value={enteredFilter}
            onChange={(e) => setEnteredFilter(e.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
