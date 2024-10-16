import { useMemo } from "react";
import { useBudget } from "../hooks/useBudget";
import ExpenseDetail from "./ExpenseDetail";

export default function ExpenseList() {
  const { state } = useBudget();

  const filteredExpenses = useMemo(() => {
    return state.currentCategory.length > 0
      ? state.expenses.filter(
          (expense) => expense.category === state.currentCategory
        )
      : state.expenses;
  }, [state.expenses, state.currentCategory]);

  const isEmpty = useMemo(
    () => filteredExpenses.length < 1,
    [filteredExpenses]
  );

  return (
    <div className="mt-10">
      {isEmpty ? (
        <p className="text-gray-600 text-2xl font-bold">No hay gastos</p>
      ) : (
        <>
          <p className="text-gray-600 text-2xl font-bold my-5">
            Listado de gastos
          </p>
          {filteredExpenses.map((expense) => (
            <ExpenseDetail key={expense.id} expense={expense} />
          ))}
        </>
      )}
    </div>
  );
}
