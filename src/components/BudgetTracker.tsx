import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { useBudget } from "../hooks/useBudget";
import AmountDisplay from "./AmountDisplay";
import { useMemo } from "react";
import { BudgetActionsNames } from "../reducers/budget-reducer";
import "react-circular-progressbar/dist/styles.css";

export default function BudgetTracker() {
  const { state, totalExpenses, remainingBudget, dispatch } = useBudget();

  const percentage = useMemo(
    () => ((totalExpenses / state.budget) * 100).toFixed(2),
    [totalExpenses, state.budget]
  );
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div>
        {/* <img src="/grafico.jpg" alt="Grafica de gasto"></img> */}
        <CircularProgressbar
          value={+percentage}
          styles={buildStyles({
            pathColor: +percentage === 100 ? "#DC2626" : "#3b82f6",
            trailColor: "#F5F5F5",
            textColor: +percentage === 100 ? "#DC2626" : "#3b82f6",
            textSize: 8,
          })}
          text={`${percentage}% Gastado`}
        />
      </div>
      <div className="flex flex-col justify-center items-center gap-8">
        <button
          type="button"
          onClick={() => dispatch({ type: BudgetActionsNames.RESET_APP })}
          className="bg-pink-600 w-full p-2 text-white uppercase font-bold rounded-lg"
        >
          Resetear app
        </button>
        <AmountDisplay label="Presupuesto" amount={state.budget} />
        <AmountDisplay label="Disponible" amount={remainingBudget} />
        <AmountDisplay label="Gastado" amount={totalExpenses} />
      </div>
    </div>
  );
}
