// src/components/ChatInstance.tsx
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getResponse } from "../services/apiResponse";
import Spinner from "./Spinner";
import { useParams } from "react-router-dom";
import Form from "../components/Form";
import { useEffect } from "react";
import supabase from "../services/supabase";
import TypingBubbles from "../components/TypingBubbles";

function ChatInstance() {
  const { conversationId } = useParams();
  const queryClient = useQueryClient();
  console.log(conversationId);

  const { data: messages, isPending } = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => getResponse(conversationId),
  });

  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel("realtime-messages")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`, // 👈 narrow down to only relevant messages
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: ["messages", conversationId],
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, queryClient]);

  return isPending ? (
    <Spinner />
  ) : (
    <div className="flex-1 overflow-y-auto flex flex-col space-y-4 p-4">
      {messages?.map((msg, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-end">
            <div className="bg-blue-500 text-white rounded-lg px-4 py-2 max-w-xs rounded-br-none">
              {msg.question}
            </div>
          </div>
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-900 rounded-lg px-4 py-2 max-w-xs rounded-bl-none">
              {msg.answer === null ? <TypingBubbles /> : msg.answer}
            </div>
          </div>
        </div>
      ))}

      {/* Sticky form input at the bottom */}
      <div className="fixed bottom-0 md:left-64 left-0 right-0  p-4 z-10">
        <Form />
      </div>
    </div>
  );
}

export default ChatInstance;
