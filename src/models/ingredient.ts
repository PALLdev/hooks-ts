class Ingredient {
  id: string;
  title: string;
  amount: number;

  constructor(ingredientTitle: string, ingredientAmount: number) {
    this.id = new Date().toISOString();
    this.title = ingredientTitle;
    this.amount = ingredientAmount;
  }
}

export default Ingredient;
