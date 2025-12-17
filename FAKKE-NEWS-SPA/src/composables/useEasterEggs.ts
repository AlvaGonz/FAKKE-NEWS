import { onMounted, onUnmounted } from 'vue';

export function useEasterEggs() {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    const logs = [
        "Fakke News: Because truth is boring.",
        "Big Brother is mostly watching cat videos.",
        "This site is 100% organic, non-GMO pixels.",
        "Warning: Reading may cause critical thinking.",
        "Loading alternative facts...",
        "Nothing to see here, just code.",
        "If you can read this, you're the chosen one.",
        "Red pill or Blue pill? We only have purple gummies.",
        "System 32 deleted... just kidding.",
        "404: Truth not found.",
        "Trying to reach the server... server says 'New phone, who dis?'",
        "Don't click the 'K' too hard.",
        "Did you know? 87% of statistics are made up on the spot.",
        "Aliens built this website.",
        "The cake is a lie.",
        "Error: Coffee levels critically low.",
        "Initializing conspiracy protocol...",
        "Have you tried turning it off and on again?",
        "Searching for meaning of life... result: 42.",
        "Downloading more RAM...",
        "Injecting humor into HTML...",
        "Beware of the spinning letters.",
        "Encryption level: Tinfoil Hat.",
        "Secret area unlocked! (Actually, no.)",
        "Why are you looking at the console? Go read the news!",
        "CSS is awesome (and painful).",
        "Undefined is not a function. It's a lifestyle.",
        "Fakke News: Trusted by 0 out of 0 doctors.",
        "Zoom in closer, maybe you'll see the pixels.",
        "Don't trust the scrolling marquee.",
        "Is this the real life? Is this just fantasy?",
        "Running on potato servers (not really).",
        "Easter egg #33: You found the end of the list."
    ];

    function randomLog() {
        if (Math.random() > 0.9) {
            const idx = Math.floor(Math.random() * logs.length);
            console.log(`%c 🥚 ${logs[idx]}`, 'color: #e23b2e; font-weight: bold; font-size: 12px;');
        }
    }

    function handleKeydown(e: KeyboardEvent) {
        // Konami Code
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                alert("KONAMI CODE ACTIVATED: UNLIMITED LIES MODE!");
                document.body.style.filter = "invert(1)";
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }

        // Typing 'fake'
        if (e.key === 'f') (window as any).magicWord = 'f';
        else if (e.key === 'a' && (window as any).magicWord === 'f') (window as any).magicWord = 'fa';
        else if (e.key === 'k' && (window as any).magicWord === 'fa') (window as any).magicWord = 'fak';
        else if (e.key === 'e' && (window as any).magicWord === 'fak') {
            (window as any).magicWord = '';
            document.body.style.transform = `rotate(${Math.random() * 4 - 2}deg)`;
            setTimeout(() => document.body.style.transform = 'none', 500);
            console.log('%c ✨ FAKE DETECTED ✨', 'font-size: 20px; color: gold;');
        } else {
            (window as any).magicWord = '';
        }
    }

    function handleTitleClick(e: MouseEvent) {
        const target = e.target as HTMLElement;
        const logoText = target.closest('.logo-text') as HTMLElement;

        if (logoText) {
            // Chance to change text
            if (Math.random() > 0.5) {
                logoText.innerText = "THE REAL NEWS";
                setTimeout(() => logoText.innerHTML = 'THE FA<span class="spinning-k">K</span><span class="spinning-k">K</span>E NEWS', 2000);
            }
        }
    }

    function init() {
        window.addEventListener('keydown', handleKeydown);
        // Random log on init
        randomLog();

        // Periodically log something random
        const interval = setInterval(randomLog, 30000);

        // Add click listener to logo if possible (though router-link handles navigation)
        // We can add global click tracking for funny business
        window.addEventListener('click', (e) => {
            if ((e.target as HTMLElement).tagName === 'IMG' && Math.random() > 0.95) {
                console.log("Nice picture, right?");
            }
        });
        window.addEventListener('click', handleTitleClick);

        onUnmounted(() => {
            window.removeEventListener('keydown', handleKeydown);
            window.removeEventListener('click', handleTitleClick);
            clearInterval(interval);
        });
    }

    return {
        init
    };
}
