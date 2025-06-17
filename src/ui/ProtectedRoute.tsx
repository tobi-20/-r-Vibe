import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/apiAuth";
import { ModalProps } from "../utils/models";
import Spinner from "./Spinner";
import { useEffect } from "react";

export default function ProtectedRoute({ children }: ModalProps) {
  const navigate = useNavigate();
  const { isPending, data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
  });

  const isAuthenticated = user?.role === "authenticated";

  // 1. While loading, show a spinner

  // 2. If not authenticated, redirect to /login
  useEffect(
    function () {
      if (!isAuthenticated && !isPending) navigate("/login");
    },
    [isAuthenticated, isPending, navigate]
  );
  if (isPending)
    return (
      <div className="h-screen bg-[var(--color-bg-default)] flex items-center justify-center">
        <Spinner />
      </div>
    );

  // 3. Else render the protected content
  if (isAuthenticated) return children;
}
