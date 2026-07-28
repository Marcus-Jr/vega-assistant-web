class SpeechService {

    constructor() {

        this.synth = window.speechSynthesis;

        this.voice = null;

        this.loadVoices();

    }

    loadVoices() {

        const load = () => {

            const voices = this.synth.getVoices();

            this.voice =
                voices.find(v =>
                    v.lang.toLowerCase().startsWith("pt-br")
                ) ||
                voices.find(v =>
                    v.lang.toLowerCase().startsWith("pt")
                ) ||
                voices[0];

        };

        load();

        window.speechSynthesis.onvoiceschanged = load;

    }

    speak(text) {

        if (!text) return;

        this.synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        utterance.voice = this.voice;

        utterance.lang = "pt-BR";

        utterance.rate = 1.5;

        utterance.pitch = 1;

        utterance.volume = 1;

        utterance.onstart = () => {

            sphere.speaking();

        };

        utterance.onend = () => {

            sphere.idle();

        };

        utterance.onerror = () => {

            sphere.idle();

        };

        this.synth.speak(utterance);

    }

    stop() {

        this.synth.cancel();

        sphere.idle();

    }

}

const speech = new SpeechService();