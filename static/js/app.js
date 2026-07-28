const chat = document.getElementById("chat");

const input = document.getElementById("message");

const sendButton = document.getElementById("sendButton");

const voiceButton = document.getElementById("voiceButton");

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

let recognition = null;

if(SpeechRecognition){

    recognition = new SpeechRecognition();

    recognition.lang = "pt-BR";

    recognition.interimResults = false;

    recognition.maxAlternatives = 1;

    recognition.onstart = ()=>{

        sphere.setState("listening");

        voiceButton.classList.add("listening");

    };

    recognition.onend = ()=>{

        sphere.idle();

        voiceButton.classList.remove("listening");

    };

    recognition.onerror = ()=>{

        sphere.idle();

        voiceButton.classList.remove("listening");

    };

    recognition.onresult = (event)=>{

        const text = event.results[0][0].transcript;

        input.value = text;

        sendMessage();

    };

}

function showTyping(){

    const div=document.createElement("div");

    div.className="message assistant typing";

    div.id="typingIndicator";

    div.innerHTML=`

        <span class="dot"></span>

        <span class="dot"></span>

        <span class="dot"></span>

    `;

    chat.appendChild(div);

    chat.scrollTop=chat.scrollHeight;

}

function hideTyping(){

    const el=document.getElementById("typingIndicator");

    if(el) el.remove();

}

function addMessage(text,type){

    const div=document.createElement("div");

    div.className=`message ${type}`;

    div.innerText=text;

    chat.appendChild(div);

    chat.scrollTop=chat.scrollHeight;

}

function showTyping(){

    const div=document.createElement("div");

    div.className="message assistant typing";

    div.id="typingIndicator";

    div.innerHTML=`

        <span class="dot"></span>

        <span class="dot"></span>

        <span class="dot"></span>

    `;

    chat.appendChild(div);

    chat.scrollTop=chat.scrollHeight;

}

function hideTyping(){

    const el=document.getElementById("typingIndicator");

    if(el) el.remove();

}

async function sendMessage(){

    const text=input.value.trim();

    if(text==="") return;

    addMessage(text,"user");

    input.value="";

    sendButton.disabled=true;

    sphere.thinking();

    showTyping();

    try{

        const response=await api.chat(text);

        hideTyping();

        addMessage(response.message.content,"assistant");

        speech.speak(response.message.content);

    }

    catch(e){

        hideTyping();

        addMessage(
            "Erro ao comunicar com o servidor.",
            "assistant"
        );

    }

    sphere.idle();

    sendButton.disabled=false;

}

sendButton.addEventListener("click",sendMessage);

voiceButton.addEventListener("click",()=>{

    if(recognition){

        recognition.start();

    }

    else{

        alert(
            "Seu navegador não suporta reconhecimento de voz."
        );

    }

});

input.addEventListener("keypress",(e)=>{

    if(e.key==="Enter"){

        sendMessage();

    }

});

const infoButton = document.getElementById("infoButton");

const infoOverlay = document.getElementById("infoOverlay");

const infoClose = document.getElementById("infoClose");

infoButton.addEventListener("click", ()=>{

    infoOverlay.classList.add("open");

});

infoClose.addEventListener("click", ()=>{

    infoOverlay.classList.remove("open");

});

infoOverlay.addEventListener("click", (e)=>{

    if(e.target === infoOverlay){

        infoOverlay.classList.remove("open");

    }

});