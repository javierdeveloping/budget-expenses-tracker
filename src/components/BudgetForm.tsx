import { useMemo, useState } from "react";
import { useBudget } from "../hooks/useBudget";
import { BudgetActionsNames } from "../reducers/budget-reducer";

export default function BudgetForm() {
  const [budget, setBudget] = useState(0);

  const { dispatch } = useBudget();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(event);
    setBudget(+event.target.value);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    dispatch({ type: BudgetActionsNames.ADD_BUDGET, payload: { budget } });
  }

  const isNotValidBudget = useMemo(
    () => isNaN(budget) || budget <= 0,
    [budget]
  );
  return (
    <form
      onSubmit={(event) => {
        handleSubmit(event);
      }}
      className="space-y-5"
    >
      <div className="flex flex-col space-y-5">
        <label
          htmlFor="budget"
          className="text-4xl text-blue-600 font-bold text-center"
        ></label>
        <input
          type="number"
          className="w-full bg-white border border-gray-200 p-2"
          placeholder="Define tu presupuesto"
          name="budget"
          id="budgetId"
          onChange={(event) => handleChange(event)}
          value={budget}
        ></input>
      </div>
      <input
        type="submit"
        disabled={isNotValidBudget}
        value="Definir presupuesto"
        name="submit"
        className="disabled:opacity-40 bg-blue-600 hover:bg-blue-700 cursor-pointer w-full p-2 text-white font-black uppercase"
      ></input>
    </form>
  );
}
