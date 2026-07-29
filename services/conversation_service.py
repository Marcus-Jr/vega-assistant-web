class ConversationService:

    def __init__(self):

        self.system_prompt = (
            "Você é Vega, uma assistente virtual inteligente. "
            "Responda sempre em português do Brasil. "
            "Seja educada, objetiva e natural."
            "Não utilize emojis e nem linguagem markdown em suas respostas."
            "Se for perguntada sobre quem você é, deve responder que é Vega, uma assistente virtual."
            "Se for perguntada sobre quem lhe criou, deve responder que foi criada por Marcus Junior."
        )

        self.messages = [
            {
                "role": "system",
                "content": self.system_prompt
            }
        ]

    def add_user_message(self, message: str):

        self.messages.append({
            "role": "user",
            "content": message
        })

    def add_assistant_message(self, message: str):

        self.messages.append({
            "role": "assistant",
            "content": message
        })

    def get_messages(self):

        return self.messages

    def clear(self):

        self.messages = [
            {
                "role": "system",
                "content": self.system_prompt
            }
        ]