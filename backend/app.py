from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
import os

app = Flask(__name__)
CORS(app)

model_name = "microsoft/DialoGPT-small"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

sessions = {}

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.json
    session_id = data.get("session_id")
    message = data.get("message", "")

    if session_id not in sessions:
        sessions[session_id] = []

    input_ids = tokenizer.encode(message + tokenizer.eos_token, return_tensors="pt")
    chat_history_ids = torch.cat(sessions[session_id], dim=-1) if sessions[session_id] else None

    bot_input_ids = torch.cat([chat_history_ids, input_ids], dim=-1) if chat_history_ids is not None else input_ids
    output_ids = model.generate(bot_input_ids, max_length=500, pad_token_id=tokenizer.eos_token_id)

    sessions[session_id].append(input_ids)

    reply = tokenizer.decode(output_ids[:, bot_input_ids.shape[-1]:][0], skip_special_tokens=True)
    return jsonify({"reply": reply})

@app.route("/api/reset", methods=["POST"])
def reset():
    data = request.json
    session_id = data.get("session_id")
    if session_id in sessions:
        del sessions[session_id]
    return jsonify({"status": "reset"})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
