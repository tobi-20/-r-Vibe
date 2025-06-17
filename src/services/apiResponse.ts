import supabase from "./supabase";

export async function getResponse(conversationId: string | undefined) {
  if (!conversationId) {
    console.warn("No conversation ID provided");
    return [];
  }

  // ✅ ADDED: Validate conversation exists and user has access
  const { data: conversation, error: convError } = await supabase
    .from("conversations")
    .select("id")
    .eq("id", conversationId)
    .single();

  if (convError || !conversation) {
    console.error("Conversation not found:", convError?.message);
    throw new Error("Conversation not found or access denied");
  }
  console.log(conversation);

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to fetch messages:", error);
    throw new Error("Failed to fetch messages");
  }

  console.log(data);

  // ✅ ADDED: Filter out messages without questions (shouldn't happen, but safety)
  return data.filter((msg) => msg.question?.trim());
}

// ✅ NEW: Get single message status
export async function getMessageStatus(messageId: number) {
  const { data, error } = await supabase
    .from("messages")
    .select("id, question, answer, created_at, updated_at")
    .eq("id", messageId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch message status: ${error.message}`);
  }

  return {
    ...data,
    status: data.answer ? "answered" : "processing",
  };
}
