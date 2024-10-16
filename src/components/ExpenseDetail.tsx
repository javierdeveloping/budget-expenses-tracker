import { useMemo } from "react";
import { formatDate } from "../helpers";
import { Expense } from "../types";
import AmountDisplay from "./AmountDisplay";
import { categories, Category } from "../data/categories";
import {
  LeadingActions,
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
} from "react-swipeable-list";
import "react-swipeable-list/dist/styles.css";
import { useBudget } from "../hooks/useBudget";
import { BudgetActionsNames } from "../reducers/budget-reducer";

type ExpenseDetailProps = {
  expense: Expense;
};
export default function ExpenseDetail({ expense }: ExpenseDetailProps) {
  const categoryInfo: Category = useMemo(
    () => categories.filter((cat: Category) => cat.id === expense.category)[0],
    [expense]
  );

  const { dispatch } = useBudget();

  function leadingActions() {
    return (
      <LeadingActions>
        <SwipeAction
          onClick={() => {
            dispatch({
              type: BudgetActionsNames.EDIT_EXPENSE,
              payload: { id: expense.id },
            });
          }}
        >
          Actualizar
        </SwipeAction>
      </LeadingActions>
    );
  }

  function trailingActions() {
    return (
      <TrailingActions>
        <SwipeAction
          onClick={() => {
            dispatch({
              type: BudgetActionsNames.DELETE_EXPENSE,
              payload: { id: expense.id },
            });
          }}
          destructive={true}
        >
          Eliminar
        </SwipeAction>
      </TrailingActions>
    );
  }

  return (
    <SwipeableList>
      <SwipeableListItem
        maxSwipe={30}
        leadingActions={leadingActions()}
        trailingActions={trailingActions()}
      >
        <div className="bg-white shadow-lg p-10 w-full border-b border-gray-200 flex gap-5 items-center">
          <div>
            <img
              src={`/icono_${categoryInfo.icon}.svg`}
              alt="icono gasto"
              className="w-20"
            />
          </div>

          <div className="flex-1 space-y-2">
            <p className="text-sm font-bold uppercase text-slate-500">
              {categoryInfo.name}
            </p>
            <p className="font-bold">{expense.expenseName}</p>
            <p className="text-slate-600 text-sm">
              {formatDate(expense.date!.toString())}
            </p>
          </div>

          <AmountDisplay amount={expense.amount} />
        </div>
      </SwipeableListItem>
    </SwipeableList>
  );
}
