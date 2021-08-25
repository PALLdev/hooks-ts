import React, { useEffect, useState, useRef } from "react";
import Ingredient from "../../models/ingredient";

import Card from "../UI/Card";
import "./Search.css";

const Search: React.FC<{
  onFilterIngredients: (filter: Ingredient[]) => void;
}> = React.memo((props) => {
  const [enteredFilter, setEnteredFilter] = useState("");
  const filterInputRef = useRef<HTMLInputElement>(null);
  const { onFilterIngredients } = props;

  useEffect(() => {
    const timer = setTimeout(() => {
      // si el valor del input es el mismo (enteredFilter: valor antiguo, cuando se ejecuto el timer | ref: valor actual)
      if (enteredFilter === filterInputRef.current?.value) {
        const query =
          enteredFilter.length === 0
            ? ""
            : `?orderBy="title"&equalTo="${enteredFilter}"`;
        fetch(
          "https://hooks-ts-default-rtdb.firebaseio.com/ingredientes.json" +
            query
        )
          .then((res) => res.json())
          .then((resData) => {
            const loadedIngredients: Ingredient[] = [];

            for (const key in resData) {
              loadedIngredients.push({
                id: key,
                title: resData[key].title,
                amount: resData[key].amount,
              });
            }

            onFilterIngredients(loadedIngredients);
          })
          .catch((e) => console.log(e));
      }
      // clean-up function, runs before this effect is recalled
      return () => {
        clearTimeout(timer);
      };
    }, 1500);
  }, [enteredFilter, onFilterIngredients, filterInputRef]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label htmlFor="texto">Filtrar por titulo</label>
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
