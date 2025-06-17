import { ReactNode } from "react";

export interface HeaderProps {
  children: ReactNode;
  icons?: ReactNode[];
}

// src/services/apiQuestion.ts
export interface MessageObj {
  query: string;
  sender?: string;
  conversationId: string;
}
export interface ResponseObj {
  id: string;
  created_at?: string;
  conversation_id: string;
  question: string;
  answer?: string;
}
export interface DispatchQuestionResponse {
  messageId: string;
  conversationId: string;
  query: string;
  sender: string;
  conversation_id: string;
}

export interface ModalProps {
  children: ReactNode;
}
export interface OverlayProps {
  children: ReactNode;
}
export interface DispatchQuestionPayload {
  query: string;
  messageId: string;

  conversationId: string;
}
// models.ts
export interface ModalProps {
  children: React.ReactNode;
}

export interface Props extends ModalProps {
  onClose: () => void; // ✅ Add this line
}
export interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface ChatInstanceProps {
  isCollapsed: boolean;
}
export interface UserInputs {
  username: string;
}
export interface RootState {
  user: {
    username: string;
    isAuthenticated: boolean;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
  };
}

export interface SignInInputs {
  email: string;
  password: string;
  username?: string; // Optional, since it's in defaultValues but not used
}
export interface ModalProps {
  children: React.ReactNode;
}
export interface SignupInputs {
  fullName: string;
  email: string;
  password: string;
  confirmPassword?: string;
}
