import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HiArrowRightOnRectangle } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import SpinnerMini from "../ui/SpinnerMini";
import { logout as logoutApi } from "../services/apiAuth";

function Logout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: logout, isPending } = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      queryClient.removeQueries(); // 🚨 Optional: Replace with `clear()` in latest versions of react-query
      navigate("/login", { replace: true });
    },
  });

  return (
    <button
      disabled={isPending}
      onClick={() => logout()}
      className="flex items-center gap-2 cursor-pointer"
    >
      {isPending ? <SpinnerMini /> : <HiArrowRightOnRectangle />}
      {!isPending && <span>Logout</span>}
    </button>
  );
}

export default Logout;
