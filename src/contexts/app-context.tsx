"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";
import type { Document } from "@/types/document";
import type { ApprovalLineTemplate } from "@/types/approval-flow";
import type { Department, Employee } from "@/types/metadata";

// 전역 상태 타입 정의
interface AppState {
  user: {
    id: string;
    name: string;
    email: string;
    department: string;
    position: string;
  } | null;
  documents: {
    drafts: Document[];
    pending: Document[];
    approved: Document[];
    rejected: Document[];
  };
  approvalLines: ApprovalLineTemplate[];
  departments: Department[];
  employees: Employee[];
  ui: {
    isLoading: boolean;
    error: string | null;
    modals: {
      employeeSelector: boolean;
      departmentSelector: boolean;
    };
  };
}

// 액션 타입 정의
type AppAction =
  | { type: "SET_USER"; payload: AppState["user"] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_DOCUMENTS"; payload: AppState["documents"] }
  | { type: "SET_APPROVAL_LINES"; payload: ApprovalLineTemplate[] }
  | { type: "SET_DEPARTMENTS"; payload: Department[] }
  | { type: "SET_EMPLOYEES"; payload: Employee[] }
  | {
      type: "TOGGLE_MODAL";
      payload: { modal: keyof AppState["ui"]["modals"]; isOpen: boolean };
    };

// 초기 상태
const initialState: AppState = {
  user: null,
  documents: {
    drafts: [],
    pending: [],
    approved: [],
    rejected: [],
  },
  approvalLines: [],
  departments: [],
  employees: [],
  ui: {
    isLoading: false,
    error: null,
    modals: {
      employeeSelector: false,
      departmentSelector: false,
    },
  },
};

// 리듀서
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_LOADING":
      return { ...state, ui: { ...state.ui, isLoading: action.payload } };
    case "SET_ERROR":
      return { ...state, ui: { ...state.ui, error: action.payload } };
    case "SET_DOCUMENTS":
      return { ...state, documents: action.payload };
    case "SET_APPROVAL_LINES":
      return { ...state, approvalLines: action.payload };
    case "SET_DEPARTMENTS":
      return { ...state, departments: action.payload };
    case "SET_EMPLOYEES":
      return { ...state, employees: action.payload };
    case "TOGGLE_MODAL":
      return {
        ...state,
        ui: {
          ...state.ui,
          modals: {
            ...state.ui.modals,
            [action.payload.modal]: action.payload.isOpen,
          },
        },
      };
    default:
      return state;
  }
};

// Context 생성
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider 컴포넌트
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Hook
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};
