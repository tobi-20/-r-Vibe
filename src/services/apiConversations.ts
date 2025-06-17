import supabase from "./supabase";
export async function createConversation(): Promise<string> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error(userError?.message || "User not authenticated");
  }

  const { data, error } = await supabase
    .from("conversations")
    .insert({
      title: "New Conversation",
      user_id: user.id, // required for RLS check
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message || "Failed to create conversation");
  return String(data.id);
}
export async function getConversations() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("user_id", user.id); // only fetch user's conversations

  if (error) {
    console.error(error);
    throw new Error("Conversations could not be loaded");
  }

  return data;
}


export async function deleteConversations(id: string) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated");
    
  }

  // First delete related messages (optional)
  const { error: messagesError } = await supabase
    .from("messages")
    .delete()
    .eq("conversation_id", id);

  if (messagesError) {
    console.warn("Failed to delete messages:", messagesError.message);
    // Continue anyway
  }

  // Then delete the conversation only if it belongs to the user
  const { data, error } = await supabase
    .from("conversations")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error(error);
    throw new Error("Conversation could not be deleted");
  }

  return data;
}
