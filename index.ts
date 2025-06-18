// Supabase Edge Function: /functions/process-llm
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Client } from "npm:@gradio/client";
console.log("🔐 YoruQA Edge Function with CORS ready");
serve(async (req)=>{
  // === CORS Preflight Handler ===
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      }
    });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({
      error: "Only POST requests allowed"
    }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
  try {
    const { question, id, conversation_id } = await req.json();
    if (!question || question.trim() === "" || !id || !conversation_id) {
      return new Response(JSON.stringify({
        error: "Missing question, id, or conversation_id"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    const temperature = 0.1;
    const max_new_tokens = 10;
    const hf_token = Deno.env.get("HF_TOKEN");
    if (!hf_token) throw new Error("Missing Hugging Face token (HF_TOKEN)");
    const client = await Client.connect("olutobi23/yoruQA", {
      hf_token
    });
    const result = await client.predict("/generate_response", {
      prompt: question,
      temperature,
      max_new_tokens
    });
    const answer = result.data[0]?.trim();
    if (!result.data || !answer) throw new Error("Invalid Gradio response format");
    const supabase = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_ANON_KEY"));
    const { error: updateError } = await supabase.from("messages").update({
      answer
    }).eq("id", id);
    if (updateError) throw new Error(`Failed to save answer: ${updateError.message}`);
    return new Response(JSON.stringify({
      answer
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (err) {
    console.error("❌ Error:", err);
    return new Response(JSON.stringify({
      error: err.message || "Internal Server Error"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
});
