import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { SignInInputs } from "../utils/models";
import { login as loginApi } from "../services/apiAuth";
import SpinnerMini from "../ui/SpinnerMini";

export function LoginForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignInInputs>();

  const { mutate: login, isPending } = useMutation({
    mutationFn: ({ email, password }: SignInInputs) =>
      loginApi({ email, password }),
    onSuccess: (user) => {
      queryClient.setQueryData(["user"], user.user);
      navigate("/homepage", { replace: true });
    },
    onError: () => {
      toast.error("Provided email or password are incorrect");
    },
  });

  const onSubmit = (data: SignInInputs) => {
    login({ email: data.email, password: data.password });
    reset();
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "var(--color-bg-main)" }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="form-container">
        <h2 className="text-3xl font-bold text-center mb-2 text-yoruba-indigo">
          Welcome back
        </h2>
        <div className="form-footer mb-5">
          <p>
            Don't have an account? <Link to="/signup">Sign up!</Link>
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
              disabled={isPending}
              aria-label="Email"
            />
            {errors.email && (
              <p className="error-message">{errors.email.message}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              disabled={isPending}
              aria-label="Password"
            />
            {errors.password && (
              <p className="error-message">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="flex items-center justify-center gap-2"
          >
            {isPending ? (
              <span className="spinner-container">
                <SpinnerMini />
              </span>
            ) : (
              "Log in"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
