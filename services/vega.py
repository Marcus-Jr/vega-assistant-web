import os

from dotenv import load_dotenv
from openai import OpenAI

from services.time_service import TimeService
from services.weather_service import WeatherService
from services.conversation_service import ConversationService

load_dotenv()

OPENROUTER_MODEL = os.getenv(
    "OPENROUTER_MODEL",
    "nemotron-3-ultra-550b-a55b:free"
)


class VegaService:

    def __init__(self):

        key = os.getenv("OPENROUTER_API_KEY")

        if not key:
            raise ValueError("OPENROUTER_API_KEY não encontrada.")

        self.client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=key,
        )

        self.time = TimeService()

        self.weather = WeatherService()

        self.conversation = ConversationService()

    def chat(self, text: str):

        direct = self.try_direct_answer(text)

        if direct is not None:
            return direct

        return self.think(text)

    def try_direct_answer(self, text):

        text_lower = text.lower()

        hour_triggers = [
            "que horas",
            "que horas são",
            "qual a hora",
            "hora atual",
            "horário",
            "horario",
        ]

        if any(trigger in text_lower for trigger in hour_triggers):
            return self.time.get_time()

        weather_triggers = [
            "clima",
            "tempo",
            "previsão",
            "previsao",
            "temperatura",
            "vai chover",
            "chuva",
        ]

        if any(trigger in text_lower for trigger in weather_triggers):

            city = self.weather.extract_city(text)

            if city is None:
                city = "Joinville"

            day_offset, week_summary = (
                self.weather.detect_forecast_target(text)
            )

            return self.weather.get_weather(
                city,
                day_offset,
                week_summary,
            )

        return None

    def think(self, text):

        try:

            self.conversation.add_user_message(text)

            response = self.client.chat.completions.create(

                extra_headers={
                    "HTTP-Referer": "https://github.com/vega-assistant",
                    "X-OpenRouter-Title": "Vega Assistant",
                },

                model=OPENROUTER_MODEL,

                messages=self.conversation.get_messages(),

            )

            answer = response.choices[0].message.content.strip()

            self.conversation.add_assistant_message(answer)

            return answer

        except Exception as e:

            print(e)

            return "Desculpe, ocorreu um erro ao consultar a IA."