import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteConversations,
  getConversations,
} from "../services/apiConversations";
import { HiOutlineTrash } from "react-icons/hi2";
import toast from "react-hot-toast";
import Spinner from "./Spinner";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

function History() {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { conversationId } = useParams();

  const { data: conversations, isPending } = useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations,
  });

  const { mutate } = useMutation({
    mutationFn: deleteConversations,
    onMutate: (id) => setDeletingId(id),
    onSuccess: (_, id) => {
      toast.success("Conversation successfully deleted");

      // ✅ Check if the deleted one is the one in the URL param
      if (String(conversationId) === String(id)) {
        navigate("/homepage");
      }

      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      setDeletingId(null);
    },
    onError: () => {
      toast.error("Unable to delete conversation");
      setDeletingId(null);
    },
  });

  function handleConversationClick(id: string) {
    if (!deletingId) {
      navigate(`/chat/${id}`);
    }
  }

  return isPending ? (
    <Spinner />
  ) : (
    <div>
      {conversations?.length === 0 && (
        <p className="text-center text-gray-500">No conversations found.</p>
      )}
      <ul className="flex flex-col-reverse px-4 py-2 gap-3">
        {conversations?.map(({ title, id }) => {
          const isActive = String(id) === String(conversationId);

          return (
            <li
              key={id}
              onClick={() => handleConversationClick(id)}
              className="w-full"
            >
              <div
                className={`flex items-center justify-between gap-2  hover:bg-[var(--color-hover-history)] rounded-[8px] px-2 py-1 ${isActive ? "bg-[var(--color-active-history)]" : "bg-transparent"}`}
              >
                <button
                  className="flex-grow text-left"
                  disabled={deletingId === id}
                >
                  {title}
                </button>
                <HiOutlineTrash
                  className={`h-4 w-4 text-gray-600 hover:text-red-500 cursor-pointer ${
                    deletingId === id ? "opacity-50 pointer-events-none" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    mutate(id);
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default History;
