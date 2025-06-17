import { HiPaperAirplane } from "react-icons/hi2";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dispatchQuestion } from "../services/apiQuestion";
import toast from "react-hot-toast";
import TextareaAutosize from "react-textarea-autosize";
import Spinner from "../ui/Spinner";
import { DispatchQuestionPayload } from "../utils/models";
import { createConversation } from "../services/apiConversations";
// import { sendQueryToModelById } from "../services/apiModel";
// import { sendQueryToModelById } from "../services/apiModel";

interface MyFormInputs {
  userQuery: string;
}

function Form() {
  const navigate = useNavigate();
  const location = useLocation();
  const { conversationId: paramConversationId } = useParams<{
    conversationId: string;
  }>();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MyFormInputs>({
    defaultValues: { userQuery: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: dispatchQuestion,
    onSuccess: (data: DispatchQuestionPayload) => {
      const updatedConversationId = data.conversationId || paramConversationId;
      queryClient.invalidateQueries({
        queryKey: ["messages", updatedConversationId],
      });

      // If a new conversation was created and we’re on homepage, navigate to it
      if (
        (location.pathname === "/homepage" || !paramConversationId) &&
        updatedConversationId
      ) {
        navigate(`/chat/${updatedConversationId}`);
      }
    },
    onError: (error: Error) => {
      console.error("Mutation error:", error);
      toast.error(
        `Unable to send message: ${error.message || "Please try again"}`
      );
    },
  });

  async function onSubmit({ userQuery }: MyFormInputs) {
    if (!userQuery.trim()) {
      toast.error("Query cannot be empty");
      return;
    }

    let conversationIdToUse = paramConversationId;
    // Create a new conversation if we're on the homepage or there's no param ID
    if (location.pathname === "/homepage" || !conversationIdToUse) {
      try {
        const newConversationId = await createConversation();

        if (!newConversationId) {
          toast.error("Failed to create a new conversation");
          return;
        }
        conversationIdToUse = newConversationId;
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
        navigate(`/chat/${conversationIdToUse}`);
      } catch (error) {
        console.error("Create conversation error:", error);
        toast.error("Could not start a new conversation");
        return;
      }
    }

    // Dispatch the user question with the conversationId
    mutate({
      query: userQuery,
      conversationId: conversationIdToUse,
    });

    reset();
  }

  // Redirect if no ID and not on homepage
  if (!paramConversationId && location.pathname !== "/homepage") {
    toast.error("No conversation selected");
    navigate("/homepage");
    return null;
  }

  return (
    <div className="w-full border-gray-300 p-4 relative">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center justify-center gap-2 max-w-4xl mx-auto"
      >
        <TextareaAutosize
          disabled={isPending}
          id="userQuery"
          {...register("userQuery", { required: "Query is required" })}
          placeholder="bèèrè ohunkóhun"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // prevent newline
              handleSubmit(onSubmit)(); // manually trigger form submission
            }
          }}
          className="flex-1 p-3 rounded-lg border border-[var(--color-yoruba-indigo)] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        />
        {errors.userQuery && (
          <span className="text-red-500 text-sm absolute -bottom-6 left-0">
            {errors.userQuery.message}
          </span>
        )}
        <button
          disabled={isPending}
          type="submit"
          aria-label="Send message"
          className="bg-[var(--color-yoruba-indigo)] px-4 py-4 rounded-full"
        >
          {isPending ? <Spinner /> : <HiPaperAirplane />}
        </button>
      </form>
    </div>
  );
}

export default Form;
