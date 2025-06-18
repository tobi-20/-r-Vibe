from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import PeftModel
import torch
import gradio as gr
import os
import re
from huggingface_hub import login

# === Hugging Face Auth ===
hf_token = os.environ.get("HF_TOKEN")  # optional, but recommended for gated models
if hf_token:
    login(token=hf_token)

# === Load Model ===
print("⏳ Loading model...")
base_model_id = "google/gemma-2b"
adapter_id = "olutobi23/yoruCALL"

tokenizer = AutoTokenizer.from_pretrained(base_model_id)
if tokenizer.pad_token is None:
    tokenizer.pad_token = tokenizer.eos_token

base_model = AutoModelForCausalLM.from_pretrained(
    base_model_id,
    device_map="auto",
    torch_dtype=torch.float16,
    offload_folder="offload"  # optional: saves memory
)

model = PeftModel.from_pretrained(base_model, adapter_id)
print("✅ Model loaded successfully!")

# === Response Cleaner ===
def clean_text(text):
    # Remove HTML tags
    text = re.sub(r"<[^>]+>", "", text)
    # Normalize spaces
    text = text.strip().replace("\n", " ").replace("\t", " ")
    # Remove garbage characters except Yoruba diacritics
    text = re.sub(r"[^\w\s.,!?–—À-ÿ]", "", text)
    return text

# === Generate Response ===
def generate_response(prompt, temperature=0.8, max_new_tokens=200):
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)

    outputs = model.generate(
        **inputs,
        max_new_tokens=max_new_tokens,
        do_sample=True,
        temperature=temperature,
        pad_token_id=tokenizer.eos_token_id,
        eos_token_id=tokenizer.eos_token_id,
    )

    full_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    response = full_text[len(prompt):].strip()
    return clean_text(response)

# === Gradio UI ===
with gr.Blocks() as demo:
    gr.Markdown("## 🗣️ YoruCALL: Yoruba LLM (Gemma-2B + LoRA)")
    with gr.Row():
        input_box = gr.Textbox(label="Ask a question in Yorùbá", placeholder="Bawo ni mo ṣe le lo kọ̀m̀pútà?")
    with gr.Row():
        temp_slider = gr.Slider(0.1, 1.5, value=0.8, label="Temperature")
        token_slider = gr.Slider(10, 300, value=200, label="Max New Tokens")
    output_box = gr.Textbox(label="Model's Response")

    submit_btn = gr.Button("Submit")

    submit_btn.click(
        fn=generate_response,
        inputs=[input_box, temp_slider, token_slider],
        outputs=output_box
    )

# === Launch Space ===
demo.launch(server_name="0.0.0.0", server_port=7860 , show_api=True)
