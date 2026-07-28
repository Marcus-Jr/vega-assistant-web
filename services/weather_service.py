from collections import Counter
from datetime import datetime

import requests


class WeatherService:

    WEATHER_CODES = {
        0: "céu limpo",
        1: "poucas nuvens",
        2: "parcialmente nublado",
        3: "nublado",
        45: "névoa",
        48: "névoa com geada",
        51: "garoa fraca",
        53: "garoa moderada",
        55: "garoa forte",
        61: "chuva fraca",
        63: "chuva moderada",
        65: "chuva forte",
        71: "neve fraca",
        73: "neve moderada",
        75: "neve forte",
        80: "pancadas de chuva fracas",
        81: "pancadas de chuva moderadas",
        82: "pancadas de chuva fortes",
        95: "trovoadas",
        96: "trovoadas com granizo leve",
        99: "trovoadas com granizo forte",
    }

    def get_weather(self, city, day_offset=None, week_summary=False):

        try:

            geo_response = requests.get(
                "https://geocoding-api.open-meteo.com/v1/search",
                params={
                    "name": city,
                    "count": 1,
                    "language": "pt",
                    "format": "json",
                },
                timeout=5,
            )

            geo_data = geo_response.json()

            results = geo_data.get("results")

            if not results:
                return f"Não consegui encontrar a cidade {city}."

            place = results[0]

            latitude = place["latitude"]

            longitude = place["longitude"]

            place_name = place.get("name", city)

            forecast_response = requests.get(
                "https://api.open-meteo.com/v1/forecast",
                params={
                    "latitude": latitude,
                    "longitude": longitude,
                    "current_weather": True,
                    "daily": "weathercode,temperature_2m_max,temperature_2m_min",
                    "forecast_days": 8,
                    "timezone": "auto",
                },
                timeout=5,
            )

            forecast_data = forecast_response.json()

            if day_offset is None and not week_summary:

                current = forecast_data.get("current_weather")

                if not current:
                    return f"Não consegui obter o clima de {place_name} agora."

                temperature = current["temperature"]

                code = current["weathercode"]

                description = self.WEATHER_CODES.get(
                    code,
                    "condição não identificada"
                )

                return (
                    f"Em {place_name} agora está {description}, "
                    f"com {temperature:.0f} graus."
                )

            daily = forecast_data.get("daily")

            if not daily:
                return f"Não consegui obter a previsão de {place_name}."

            if week_summary:

                codes = daily["weathercode"][1:8]

                max_temps = daily["temperature_2m_max"][1:8]

                min_temps = daily["temperature_2m_min"][1:8]

                dominant_code = Counter(codes).most_common(1)[0][0]

                description = self.WEATHER_CODES.get(
                    dominant_code,
                    "condição variada"
                )

                return (
                    f"Na semana que vem em {place_name}, "
                    f"a previsão é de {description}, "
                    f"com temperaturas entre "
                    f"{min(min_temps):.0f} e "
                    f"{max(max_temps):.0f} graus."
                )

            index = day_offset

            if index >= len(daily["time"]):

                return (
                    f"Só consigo prever até "
                    f"{len(daily['time'])-1} dias à frente."
                )

            date_str = daily["time"][index]

            tmax = daily["temperature_2m_max"][index]

            tmin = daily["temperature_2m_min"][index]

            code = daily["weathercode"][index]

            description = self.WEATHER_CODES.get(
                code,
                "condição não identificada"
            )

            day_label = self._format_day_label(day_offset, date_str)

            return (
                f"Para {day_label} em {place_name}, "
                f"a previsão é de {description}, "
                f"com mínima de {tmin:.0f} e "
                f"máxima de {tmax:.0f} graus."
            )

        except Exception as e:

            print(e)

            return "Desculpe, não consegui consultar o clima agora."

    def _format_day_label(self, day_offset, date_str):

        if day_offset == 0:
            return "hoje"

        if day_offset == 1:
            return "amanhã"

        if day_offset == 2:
            return "depois de amanhã"

        date_obj = datetime.strptime(date_str, "%Y-%m-%d")

        weekday_names = [
            "segunda-feira",
            "terça-feira",
            "quarta-feira",
            "quinta-feira",
            "sexta-feira",
            "sábado",
            "domingo",
        ]

        weekday = weekday_names[date_obj.weekday()]

        return f"{weekday} ({date_obj.strftime('%d/%m')})"

    def detect_forecast_target(self, text):

        text = text.lower()

        if (
            "semana que vem" in text
            or "próxima semana" in text
            or "proxima semana" in text
        ):
            return None, True

        if "depois de amanhã" in text or "depois de amanha" in text:
            return 2, False

        if "amanhã" in text or "amanha" in text:
            return 1, False

        if "hoje" in text:
            return 0, False

        weekday_map = {
            "segunda": 0,
            "terça": 1,
            "terca": 1,
            "quarta": 2,
            "quinta": 3,
            "sexta": 4,
            "sábado": 5,
            "sabado": 5,
            "domingo": 6,
        }

        for name, target in weekday_map.items():

            if name in text:

                today = datetime.now().weekday()

                diff = (target - today) % 7

                if diff == 0:
                    diff = 7

                return diff, False

        return None, False

    def extract_city(self, text):

        for prep in [" em ", " de ", " para ", " no ", " na "]:

            idx = text.lower().rfind(prep)

            if idx != -1:

                city = text[idx + len(prep):].strip(" ?.!")

                if city:
                    return city

        return None