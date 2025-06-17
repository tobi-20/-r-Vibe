import { sendQueryToModelById } from "./apiModel";
import { DispatchQuestionPayload, MessageObj } from "../utils/models";
import supabase from "./supabase";

export async function dispatchQuestion({
  query,
  conversationId,
}: MessageObj): Promise<DispatchQuestionPayload> {
  const { data: insertedData, error } = await supabase
    .from("messages")
    .insert([
      {
        question: query,
        conversation_id: conversationId, // ✅ pass FK here
      },
    ])
    .select()
    .single();

  if (error) throw new Error(error.message || "Failed to send message");
  // Trigger LLM processing

  sendQueryToModelById(insertedData.id)
    .then(() => {
      console.log("✅ LLM processing completed for message", insertedData.id);
    })
    .catch((error) => {
      console.error("❌ Failed to process LLM response:", error);
      // Update message with error status
      supabase
        .from("messages")
        .update({ answer: "Error processing response" })
        .eq("id", insertedData.id)
        .then(() => console.log("Updated message with error status"));
    });

  return insertedData;
}
