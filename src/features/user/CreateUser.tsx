import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { updateName } from "./userSlice";
import { RootState, UserInputs } from "../../utils/models";

// Define TypeScript interface for form inputs

function CreateUser() {
  // Get username from Redux store
  const username = useSelector((state: RootState) => state.user.username);
  const dispatch = useDispatch();

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserInputs>({
    defaultValues: { username: username || "" }, // Sync with Redux state
  });

  // Handle form submission
  const onSubmit = (data: UserInputs) => {
    dispatch(updateName(data.username)); // Dispatch updateName action
    reset(); // Optional: Reset form after submission
  };

  return (
    <div className="w-full border-gray-300 p-4 relative">
      <form onSubmit={handleSubmit(onSubmit)}>
        <p className="mb-4 text-sm text-stone-600 md:text-base">
          👋 Welcome! Please start by telling us your name:
        </p>

        <input
          type="text"
          placeholder="Your full name"
          {...register("username", {
            required: "Username is required",
            minLength: {
              value: 1,
              message: "Username cannot be empty",
            },
          })}
          className="w-72 input mb-8"
        />

        {errors.username && (
          <p className="text-red-500 text-sm mb-4">{errors.username.message}</p>
        )}

        {username && (
          <div className="flex gap-4">
            <button type="submit">Start Conversing</button>
            <button
              type="button"
              onClick={() => {
                dispatch(resetName());
                reset(); // Reset form to match Redux state
              }}
            >
              Reset
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default CreateUser;
