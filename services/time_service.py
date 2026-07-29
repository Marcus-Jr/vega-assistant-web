from datetime import datetime
from zoneinfo import ZoneInfo


class TimeService:

    def get_time(self):

        fuso_brasil = ZoneInfo("America/Sao_Paulo")
        now = datetime.now(fuso_brasil)

        hora = now.hour

        if hora < 12:
            saudacao = "Bom dia"

        elif hora < 18:
            saudacao = "Boa tarde"

        else:
            saudacao = "Boa noite"

        return f"{saudacao}! Agora são {now.strftime('%H:%M')}."