# Vega Assistant Web

![GitHub repo size](https://img.shields.io/github/repo-size/Marcus-Jr/vega-assistant-web?style=for-the-badge)
![GitHub language count](https://img.shields.io/github/languages/count/Marcus-Jr/vega-assistant-web?style=for-the-badge)
![GitHub forks](https://img.shields.io/github/forks/Marcus-Jr/vega-assistant-web?style=for-the-badge)
![Bitbucket open issues](https://img.shields.io/bitbucket/issues/Marcus-Jr/vega-assistant-web?style=for-the-badge)
![Bitbucket open pull requests](https://img.shields.io/bitbucket/pr-raw/Marcus-Jr/vega-assistant-web?style=for-the-badge)

<img src="imagem.png" alt="vega assistant image">

Vega é um assistente virtual web construído com Flask e JavaScript puro, com reconhecimento e síntese de voz em português, respostas de IA via OpenRouter (modelo Nemotron 3 Ultra), consulta de clima e horário em tempo real, e uma esfera 3D animada (Three.js) que reage ao estado da conversa.

## 🚀 Começando

Essas instruções permitirão que você obtenha uma cópia do projeto em operação na sua máquina local para fins de desenvolvimento e teste.

Consulte [Implantação](#-implantação) para saber como implantar o projeto em um ambiente de produção.

## 📋 Pré-requisitos

- **Python 3.11+**
- **pip** (gerenciador de pacotes do Python)
- Uma **chave de API da OpenRouter** ([openrouter.ai](https://openrouter.ai)), usada para acessar o modelo de IA
- Navegador com suporte a **Web Speech API** (Chrome/Edge recomendados) para os recursos de voz

```
python --version
pip --version
```

## 🔧 Instalação

Clone o repositório:

```
git clone https://github.com/Marcus-Jr/vega-assistant-web.git
cd vega-assistant-web
```

Crie e ative um ambiente virtual:

```
python -m venv .venv
.venv\Scripts\activate      # Windows
source .venv/bin/activate   # Linux/Mac
```

Instale as dependências:

```
pip install -r requirements.txt
```

Crie um arquivo `.env` na raiz do projeto com as variáveis necessárias:

```
OPENROUTER_API_KEY=sua_chave_aqui
OPENROUTER_MODEL=nemotron-3-ultra-550b-a55b:free
```

Execute a aplicação:

```
python app.py
```

Acesse `http://127.0.0.1:5000` no navegador e envie uma mensagem pelo campo de texto ou pelo botão de microfone para ver o Vega responder.

## ⚙️ Executando os testes

Este projeto ainda não possui uma suíte de testes automatizados. Contribuições adicionando testes (ex.: `pytest`) para as rotas em `routes/api.py` e os serviços em `services/` são bem-vindas.

## 🔩 Analise os testes de ponta a ponta

Ainda não há testes end-to-end configurados. A validação manual recomendada cobre:

- Envio de mensagem de texto e recebimento de resposta da IA
- Reconhecimento de voz via botão de microfone
- Síntese de voz (leitura da resposta)
- Perguntas de horário (ex.: "que horas são?")
- Perguntas de clima (ex.: "vai chover amanhã em Joinville?")

```
"que horas são?"
"como está o tempo em São Paulo?"
"qual a previsão para o fim de semana?"
```

## ⌨️ E testes de estilo de codificação

O projeto não possui linter configurado no momento. Recomenda-se seguir PEP 8 para o código Python e manter a formatação consistente já usada nos arquivos JavaScript (indentação com espaçamento generoso entre blocos).

```
pip install flake8
flake8 .
```

## 📦 Implantação

O projeto já inclui `gunicorn` nas dependências, adequado para produção em serviços como Render, Railway ou uma VPS:

```
gunicorn app:app
```

Lembre-se de configurar as variáveis de ambiente (`OPENROUTER_API_KEY`, `OPENROUTER_MODEL`) no ambiente de produção, já que o `.env` local não é versionado (está no `.gitignore`).

## 🛠️ Construído com

* [Flask](https://flask.palletsprojects.com/) - Framework web em Python usado no backend
* [OpenRouter](https://openrouter.ai/) - Gateway de API usado para acessar o modelo de IA (Nemotron 3 Ultra)
* [Open-Meteo](https://open-meteo.com/) - API gratuita de geocodificação e previsão do tempo
* [Three.js](https://threejs.org/) - Renderização 3D da esfera animada do assistente
* [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) - Reconhecimento de voz (`SpeechRecognition`) e síntese de voz (`SpeechSynthesis`) no navegador
* [Gunicorn](https://gunicorn.org/) - Servidor WSGI para implantação em produção

## 📌 Versão

2.0 (Versão Web)

## ✒️ Autores

* **Marcus-Jr** - Desenvolvimento inicial - [Marcus-Jr](https://github.com/Marcus-Jr)


---
Feito por [Marcus-Jr](https://github.com/Marcus-Jr) 😊
