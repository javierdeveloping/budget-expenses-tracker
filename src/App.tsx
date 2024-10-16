import { useEffect, useMemo } from "react";
import "./App.css";
import BudgetForm from "./components/BudgetForm";
import BudgetTracker from "./components/BudgetTracker";
import ExpenseList from "./components/ExpenseList";
import ExpenseModal from "./components/ExpenseModal";
import { useBudget } from "./hooks/useBudget";
import FilterByCategory from "./components/FilterByCategory";

function App() {
  // const context = useContext(BudgetContext);
  const { state } = useBudget();

  const isValidBudget = useMemo(() => state.budget, [state.budget]);

  useEffect(() => {
    localStorage.setItem("budget", state.budget.toString());
    localStorage.setItem("expenses", JSON.stringify(state.expenses));
  }, [state]);
  return (
    <>
      <header className="py-8 bg-blue-600 max-h-72">
        <h1 className="uppercase text-center font-black text-4xl text-white">
          Planificador de gastos
        </h1>
      </header>
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg mt-10 p-10">
        {!isValidBudget ? <BudgetForm /> : <BudgetTracker />}
      </div>
      {isValidBudget ? (
        <main className="max-w-3xl mx-auto py-10">
          <FilterByCategory />
          <ExpenseList />
          <ExpenseModal />
        </main>
      ) : (
        <></>
      )}
    </>
  );
}

export default App;
