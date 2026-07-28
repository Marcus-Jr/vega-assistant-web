from flask import Blueprint, jsonify, request

from services.vega import VegaService

api = Blueprint("api", __name__)

vega = VegaService()


@api.route("/chat", methods=["POST"])
def chat():

    data = request.get_json()

    message = data.get("message", "").strip()

    if not message:

        return jsonify({
            "success": False,
            "error": "Mensagem vazia."
        }), 400

    response = vega.chat(message)

    return jsonify({

        "success": True,

        "message": {

            "role": "assistant",

            "content": response

        }

    })