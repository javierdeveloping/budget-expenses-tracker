import { Category } from "../data/categories";
import { DraftExpense, Expense } from "../types";
import { v4 as uuidv4 } from "uuid";

export enum BudgetActionsNames {
  ADD_BUDGET = "add-budget",
  SHOW_MODAL = "show-modal",
  CLOSE_MODAL = "close-modal",
  ADD_EXPENSE = "add-expense",
  DELETE_EXPENSE = "delete-expense",
  EDIT_EXPENSE = "edit-expense",
  UPDATE_EXPENSE = "update-expense",
  RESET_APP = "reset-app",
  ADD_FILTER_CATEGORY = "add-filter-category",
}

export type BudgetState = {
  budget: number;
  modal: boolean;
  expenses: Expense[];
  editingId: Expense["id"];
  currentCategory: Category["id"];
};

export function initialBudget(): number {
  console.log("initial budget");
  const localStorageContent = localStorage.getItem("budget");
  const localStorageBudget = localStorageContent ? +localStorageContent : 0;
  return localStorageBudget;
}

export function localStorageExpenses(): Expense[] {
  console.log("initial expenses");
  const localStorageContent = localStorage.getItem("expenses");
  const localStorageExpenses = localStorageContent
    ? JSON.parse(localStorageContent)
    : [];

  return localStorageExpenses;
}

export const initialState: BudgetState = {
  budget: initialBudget(),
  modal: false,
  expenses: localStorageExpenses(),
  editingId: "",
  currentCategory: "",
};

export type BudgetActions =
  | {
      type: BudgetActionsNames.ADD_BUDGET;
      payload: { budget: number };
    }
  | { type: BudgetActionsNames.SHOW_MODAL }
  | { type: BudgetActionsNames.CLOSE_MODAL }
  | {
      type: BudgetActionsNames.ADD_EXPENSE;
      payload: { expense: DraftExpense };
    }
  | {
      type: BudgetActionsNames.DELETE_EXPENSE;
      payload: { id: Expense["id"] };
    }
  | {
      type: BudgetActionsNames.EDIT_EXPENSE;
      payload: { id: Expense["id"] };
    }
  | {
      type: BudgetActionsNames.UPDATE_EXPENSE;
      payload: { expense: Expense };
    }
  | {
      type: BudgetActionsNames.RESET_APP;
    }
  | {
      type: BudgetActionsNames.ADD_FILTER_CATEGORY;
      payload: { id: Category["id"] };
    };

export function budgetReducer(state: BudgetState, action: BudgetActions) {
  if (action.type === BudgetActionsNames.ADD_BUDGET) {
    return {
      ...state,
      budget: action.payload.budget,
    };
  }

  if (action.type === BudgetActionsNames.SHOW_MODAL) {
    return {
      ...state,
      modal: true,
    };
  }

  if (action.type === BudgetActionsNames.CLOSE_MODAL) {
    return {
      ...state,
      modal: false,
      editingId: "",
    };
  }

  if (action.type === BudgetActionsNames.ADD_EXPENSE) {
    const expense = createExpense(action.payload.expense);
    return {
      ...state,
      expenses: [...state.expenses, expense],
      modal: false,
    };
  }

  if (action.type === BudgetActionsNames.DELETE_EXPENSE) {
    return {
      ...state,
      expenses: state.expenses.filter(
        (expense) => expense.id !== action.payload.id
      ),
    };
  }

  if (action.type === BudgetActionsNames.EDIT_EXPENSE) {
    return {
      ...state,
      editingId: action.payload.id,
      modal: true,
    };
  }

  if (action.type === BudgetActionsNames.UPDATE_EXPENSE) {
    return {
      ...state,
      expenses: state.expenses.map((expense) =>
        expense.id === action.payload.expense.id
          ? action.payload.expense
          : expense
      ),
      modal: false,
      editingId: "",
    };
  }

  if (action.type === BudgetActionsNames.RESET_APP) {
    return {
      ...state,
      expenses: [],
      budget: 0,
    };
  }

  if (action.type === BudgetActionsNames.ADD_FILTER_CATEGORY) {
    return { ...state, currentCategory: action.payload.id };
  }

  return state;
}

function createExpense(draftExpense: DraftExpense): Expense {
  return { ...draftExpense, id: uuidv4() };
}
