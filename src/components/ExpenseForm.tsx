import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import { validate as uuidvalidate } from "uuid";
import { categories } from "../data/categories";
import { useBudget } from "../hooks/useBudget";
import { BudgetActionsNames } from "../reducers/budget-reducer";
import { DraftExpense, Value } from "../types";
import ErrorMessage from "./ErrorMessage";
export default function ExpenseForm() {
  const initialDraftExpense = {
    amount: 0,
    expenseName: "",
    category: "",
    date: new Date(),
  };

  const [expense, setExpense] = useState<DraftExpense>(initialDraftExpense);

  const [error, setError] = useState("");
  const [previousAmount, setPreviousAmount] = useState(0);

  const { dispatch, state, remainingBudget } = useBudget();

  useEffect(() => {
    if (uuidvalidate(state.editingId)) {
      const editingExpense = state.expenses.filter(
        (currentExpense) => currentExpense.id === state.editingId
      )[0];

      setExpense(editingExpense);
      setPreviousAmount(editingExpense.amount);
    }
  }, [state.editingId, state.expenses]);

  function handleChangeDate(value: Value) {
    setExpense({
      ...expense,
      date: value,
    });
  }

  function handleChange(
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) {
    console.log(event);
    const { name, value } = event.target;
    const isAmountField = ["amount"].includes(name);
    setExpense({
      ...expense,
      [name]: isAmountField ? Number(value) : value,
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    if (Object.values(expense).includes("")) {
      console.log("error...");
      setError("Todos los campos son obligatorios");
      return;
    }

    if (expense.amount - previousAmount > remainingBudget) {
      setError("Ese gasto excede el presupuesto disponible");
      return;
    }

    //Agregar un nuevo gasto
    if (!uuidvalidate(state.editingId)) {
      dispatch({ type: BudgetActionsNames.ADD_EXPENSE, payload: { expense } });
    } else {
      dispatch({
        type: BudgetActionsNames.UPDATE_EXPENSE,
        payload: { expense: { id: state.editingId, ...expense } },
      });
    }

    setExpense(initialDraftExpense);
  }

  return (
    <>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <legend className="uppercase text-center text-2xl font-black border-b-4 border-blue-500 py-2">
          {uuidvalidate(state.editingId) ? "Guardar cambios" : "Nuevo gasto"}
        </legend>

        {error.length > 0 && <ErrorMessage>{error}</ErrorMessage>}

        <div className="flex flex-col gap-2">
          <label htmlFor="expenseName" className="text-xl">
            Nombre Gasto:
          </label>
          <input
            type="text"
            id="expenseName"
            placeholder="Añade el Nombre del gasto"
            className="bg-slate-100 p-2"
            name="expenseName"
            onChange={(event) => {
              handleChange(event);
            }}
            value={expense.expenseName}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="amount" className="text-xl">
            Cantidad:
          </label>
          <input
            type="number"
            id="amount"
            placeholder="Añade la cantaidad del gasto: ej. 300"
            className="bg-slate-100 p-2"
            name="amount"
            onChange={handleChange}
            value={expense.amount}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="category" className="text-xl">
            Categoría:
          </label>
          <select
            id="category"
            className="bg-slate-100 p-2"
            name="category"
            onChange={handleChange}
            value={expense.category}
          >
            <option value="">-- Seleccione --</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="date" className="text-xl">
            Fecha Gasto:
          </label>
          <DatePicker
            className="bg-slate-100 p-2 border-0"
            value={expense.date}
            onChange={handleChangeDate}
          />
        </div>

        <input
          type="submit"
          className="bg-blue-600 cursor-pointer w-full p-2 text-white uppercase font-bold rounded-lg"
          value={
            uuidvalidate(state.editingId) ? "Guardar cambios" : "Nuevo gasto"
          }
        />
      </form>
    </>
  );
}
