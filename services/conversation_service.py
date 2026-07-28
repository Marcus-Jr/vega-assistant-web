class ConversationService:

    def __init__(self):

        self.system_prompt = (
            "Você é Vega, um assistente virtual inteligente. "
            "Responda sempre em português do Brasil. "
            "Seja educado, objetivo e natural."
            "Não utilize emojis e nem linguagem markdown em suas respostas"
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