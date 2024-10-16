import { useReducer, createContext, Dispatch, ReactNode, useMemo } from "react";
import {
  BudgetActions,
  budgetReducer,
  BudgetState,
  initialState,
} from "../reducers/budget-reducer";

type BudgetContextProps = {
  state: BudgetState;
  dispatch: Dispatch<BudgetActions>;
  totalExpenses: number;
  remainingBudget: number;
};

export const BudgetContext = createContext<BudgetContextProps>({
  state: initialState,
  dispatch: () => initialState,
  totalExpenses: 0,
  remainingBudget: 0,
});
//null! or {} as BudgetContextProps

export type BudgetProviderProps = {
  children: ReactNode;
};
export function BudgetProvider({ children }: BudgetProviderProps) {
  //con nuestro provider, tendremos acceso al reducer
  const [state, dispatch] = useReducer(budgetReducer, initialState);
  const totalExpenses = useMemo(
    () => state.expenses.reduce((total, expense) => expense.amount + total, 0),
    [state.expenses]
  );

  const remainingBudget = useMemo(
    () => state.budget - totalExpenses,
    [state.budget, totalExpenses]
  );
  return (
    <BudgetContext.Provider
      value={{ state, dispatch, totalExpenses, remainingBudget }}
    >
      {children}
    </BudgetContext.Provider>
  );
}
