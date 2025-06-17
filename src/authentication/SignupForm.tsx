import { useForm } from "react-hook-form";
import { SignupInputs } from "../utils/models";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { signup } from "../services/apiAuth";
// Ensure this path is correct

function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm<SignupInputs>();

  const { mutate, isPending } = useMutation({
    mutationFn: signup,
    onSuccess: (user) => {
      console.log(user);
      toast.success(
        "Account successfully created! Please verify the new account from your email address"
      );
      reset(); // Clear form after success
    },
    onError: (err) => {
      toast.error(err?.message || "Signup failed");
    },
  });

  function onSubmit({ fullName, email, password }: SignupInputs) {
    mutate({ fullName, email, password });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Full Name */}
      <div>
        <input
          placeholder="Full Name"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          {...register("fullName", { required: "Full name is required" })}
        />
        {errors.fullName && (
          <p className="text-sm text-red-500 mt-1">{errors.fullName.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <input
          placeholder="Email"
          type="email"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email address",
            },
          })}
        />
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <input
          placeholder="Password"
          type="password"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          })}
        />
        {errors.password && (
          <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <input
          placeholder="Confirm Password"
          type="password"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) =>
              value === getValues().password || "Passwords need to match",
          })}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500 mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-between gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 bg-indigo-700 hover:bg-indigo-800 text-white font-semibold rounded-xl transition duration-200 disabled:opacity-50"
        >
          {isPending ? "Creating..." : "Sign Up"}
        </button>

        <button
          type="button"
          className="w-full py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-xl transition duration-200"
          onClick={() => reset()}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default SignupForm;
