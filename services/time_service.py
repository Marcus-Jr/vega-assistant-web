from datetime import datetime


class TimeService:

    def get_time(self):

        now = datetime.now()

        hora = now.hour

        if hora < 12:
            saudacao = "Bom dia"

        elif hora < 18:
            saudacao = "Boa tarde"

        else:
            saudacao = "Boa noite"

        return f"{saudacao}! Agora são {now.strftime('%H:%M')}."