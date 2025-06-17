import { JW_SECRET } from "../assets/constant";
import supabase from "./supabase";

interface ProcessedQuery {
  question: string;
  answer: string;
}

export async function sendQueryToModelById(
  messageId: string
): Promise<ProcessedQuery> {
  try {
    console.log("🚀 Processing message ID:", messageId);

    if (!JW_SECRET) {
      throw new Error("Authentication token is not configured");
    }

    console.log("📍 Fetching specific message...");
    const { data, error } = await supabase
      .from("messages")
      .select("id, question, conversation_id")
      .eq("id", messageId)
      .single();

    if (error) {
      throw new Error(`Failed to fetch message ${messageId}: ${error.message}`);
    }

    if (!data?.question?.trim()) {
      throw new Error(`Message ${messageId} has no question`);
    }

    const { question } = data;
    console.log("📝 Processing question:", question);

    const requestPayload = {
      question,
      id: messageId,
      conversation_id: data.conversation_id,
    };

    const requestUrl =
      "https://oplukbtkjdrzusajtzje.supabase.co/functions/v1/hyper-api";
    console.log("🌐 Sending to Edge Function...");

    let response: Response;
    try {
      response = await fetch(requestUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JW_SECRET}`,
        },
        body: JSON.stringify(requestPayload),
      });
    } catch (fetchError) {
      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        throw new Error("Request to LLM service timed out");
      }
      throw new Error(`Network error: ${fetchError}`);
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      throw new Error(`LLM service error (${response.status}): ${errorText}`);
    }

    const responseText = await response.text();
    if (!responseText.trim()) {
      throw new Error("Empty response from LLM service");
    }

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      throw new Error("Invalid JSON response from LLM service");
    }

    if (!responseData.answer) {
      throw new Error("LLM response missing answer field");
    }

    const { answer } = responseData;
    console.log("🎯 LLM Response received, length:", answer.length);

    console.log("💾 Updating message with answer...");
    const { error: updateError } = await supabase
      .from("messages")
      .update({ answer }) // Removed updated_at
      .eq("id", messageId);

    if (updateError) {
      console.error("❌ Failed to save answer:", updateError.message);
      throw new Error(`Failed to save answer: ${updateError.message}`);
    }

    console.log("✅ Successfully processed message", messageId);
    return { question, answer };
  } catch (error) {
    console.error("💥 Error processing message", messageId, ":", error);

    try {
      await supabase
        .from("messages")
        .update({
          answer:
            "I'm sorry, I encountered an error processing your request. Please try again.",
        }) // Removed updated_at
        .eq("id", messageId);
    } catch (updateError) {
      console.error("Failed to update message with error status:", updateError);
    }

    throw error;
  }
}

// Deprecated
export async function sendQueryToModel(): Promise<ProcessedQuery> {
  console.warn(
    "⚠️ sendQueryToModel() is deprecated. Use sendQueryToModelById() instead."
  );

  const { data, error } = await supabase
    .from("messages")
    .select("id")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    throw new Error("No messages found to process");
  }

  return sendQueryToModelById(data.id);
}
