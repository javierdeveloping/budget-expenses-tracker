import { ChangeEvent } from "react";
import { categories } from "../data/categories";
import { useBudget } from "../hooks/useBudget";
import { BudgetActionsNames } from "../reducers/budget-reducer";

export default function FilterByCategory() {
  const { dispatch } = useBudget();

  function handleChange(event: ChangeEvent<HTMLSelectElement>): void {
    dispatch({
      type: BudgetActionsNames.ADD_FILTER_CATEGORY,
      payload: {
        id: event.target.value,
      },
    });
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-10">
      <form>
        <div className="flex flex-col md:flex-row md:items-center gap-5">
          <label htmlFor="category">Filtrar gastos</label>
          <select
            name="category"
            id="category"
            className="bg-slate-100 p-3 flex-1 rounded"
            onChange={(event) => handleChange(event)}
          >
            <option value="">--Todas las categorias</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </form>
    </div>
  );
}
