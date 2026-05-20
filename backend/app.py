from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

app = Flask(__name__)

CORS(app)

API_KEY = "YOUR_API_KEY"

genai.configure(api_key=API_KEY)

model = genai.GenerativeModel("gemini-flash-latest")

chat = model.start_chat(history=[])

@app.route("/chat", methods=["POST"])

def chat_api():

    try:

        data = request.json

        user_message = data.get("message")

        response = chat.send_message(user_message)

        return jsonify({
            "response": response.text
        })

    except Exception as e:

        return jsonify({
            "response": str(e)
        })

if __name__ == "__main__":

    app.run(debug=True)