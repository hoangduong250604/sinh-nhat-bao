document.addEventListener('DOMContentLoaded', () => {
    const DOM = {
        loading: document.getElementById('loading'),
        bgMusic: document.getElementById('bgMusic'),
        vinylRecord: document.querySelector('.vinyl-record'),
        musicHint: document.querySelector('.music-hint'),
        snowCanvas: document.getElementById('snowCanvas'),
        startBtn: document.getElementById('startBtn'),
        nightOverlay: document.getElementById('nightOverlay'),
        typingText: document.getElementById('typingText'),
        heartRainContainer: document.getElementById('heartRainContainer'),
        candle: document.getElementById('candle'),
        instruction: document.querySelector('.instruction'),
        lightMsg: document.getElementById('lightMsg'),
        nextToGiftBtn: document.getElementById('nextToGiftBtn'),
        finalMessage: document.getElementById('finalMessage'),
        musicControl: document.querySelector('.music-control')
    };

    let state = {
        giftsOpened: 0,
        isMusicPlaying: false,
        lastDustTime: 0
    };

    const vibrate = () => {
        if (navigator.vibrate) navigator.vibrate(50);
    };

    const switchScene = (fromId, toId) => {
        const from = document.getElementById(fromId);
        const to = document.getElementById(toId);
        if (!from || !to) return;

        from.style.opacity = '0';
        from.style.transform = 'translateY(-20px)';
        from.style.pointerEvents = 'none';

        setTimeout(() => {
            from.classList.remove('active');
            from.style.display = 'none';

            to.style.display = 'flex';
            to.style.opacity = '0';
            to.style.transform = 'translateY(20px)';
            
            void to.offsetWidth;

            to.classList.add('active');
            to.style.opacity = '1';
            to.style.transform = 'translateY(0)';
            to.style.pointerEvents = 'auto';

            if (toId === 'scene2') DOM.nightOverlay.classList.add('active');
            if (fromId === 'scene2') {
                DOM.nightOverlay.classList.remove('active');
                DOM.nightOverlay.classList.remove('lit');
            }
        }, 500);
    };

    const typeWriter = (text, speed = 50) => {
        DOM.typingText.innerHTML = "";
        let i = 0;
        const typing = setInterval(() => {
            if (i < text.length) {
                DOM.typingText.innerHTML += text.charAt(i);
                i++;
            } else {
                clearInterval(typing);
            }
        }, speed);
    };

    window.toggleMusic = () => {
        vibrate();
        if (DOM.bgMusic.paused) {
            DOM.bgMusic.play().then(() => {
                state.isMusicPlaying = true;
                DOM.vinylRecord.classList.add('running');
                if (DOM.musicHint) DOM.musicHint.style.opacity = '0';
            }).catch(e => console.log("Chưa tương tác, chưa phát nhạc được"));
        } else {
            DOM.bgMusic.pause();
            state.isMusicPlaying = false;
            DOM.vinylRecord.classList.remove('running');
        }
    };

    const initSnow = () => {
        const ctx = DOM.snowCanvas.getContext('2d');
        let width = window.innerWidth;
        let height = window.innerHeight;
        
        DOM.snowCanvas.width = width;
        DOM.snowCanvas.height = height;

        const flakes = Array.from({ length: 100 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            r: Math.random() * 2 + 0.5,
            s: Math.random() * 1 + 0.5
        }));

        function draw() {
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
            ctx.beginPath();
            
            for (let f of flakes) {
                ctx.moveTo(f.x, f.y);
                ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
                f.y += f.s;
                if (f.y > height) {
                    f.y = -5;
                    f.x = Math.random() * width;
                }
            }
            
            ctx.fill();
            requestAnimationFrame(draw);
        }
        draw();

        window.addEventListener('resize', () => {
            width = window.innerWidth;
            height = window.innerHeight;
            DOM.snowCanvas.width = width;
            DOM.snowCanvas.height = height;
        });
    };

    const createHeartRain = () => {
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < 20; i++) {
            const heart = document.createElement('div');
            heart.classList.add('heart');
            heart.innerHTML = '❤️';
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.fontSize = Math.random() * 20 + 15 + 'px';
            heart.style.animationDuration = Math.random() * 2 + 3 + 's';
            heart.style.animationDelay = i * 0.15 + 's';
            fragment.appendChild(heart);
            
            setTimeout(() => heart.remove(), 6000);
        }
        DOM.heartRainContainer.appendChild(fragment);
    };

    const createMagicDust = (x, y) => {
        const now = Date.now();
        if (now - state.lastDustTime < 50) return; 
        state.lastDustTime = now;

        const dust = document.createElement('div');
        Object.assign(dust.style, {
            position: 'fixed', left: x + 'px', top: y + 'px',
            width: '4px', height: '4px', background: '#fff',
            borderRadius: '50%', pointerEvents: 'none',
            boxShadow: '0 0 5px #fff, 0 0 10px #f1c40f',
            zIndex: '9999', transition: 'all 0.8s ease-out'
        });
        document.body.appendChild(dust);

        requestAnimationFrame(() => {
            const angle = Math.random() * Math.PI * 2;
            const velocity = 40;
            dust.style.transform = `translate(${Math.cos(angle) * velocity}px, ${Math.sin(angle) * velocity}px) scale(0)`;
            dust.style.opacity = '0';
        });

        setTimeout(() => dust.remove(), 800);
    };

    const spawnConfetti = (x, y, isFullScreen = false) => {
        const count = isFullScreen ? 100 : 30;
        const colors = ['#e74c3c', '#f1c40f', '#3498db', '#ffffff', '#2ecc71'];
        
        if (isFullScreen && !document.getElementById('confettiKeyframes')) {
            const style = document.createElement('style');
            style.id = 'confettiKeyframes';
            style.innerHTML = `@keyframes fall { to { top: 120vh; transform: rotate(720deg); opacity: 0; } }`;
            document.head.appendChild(style);
        }

        for (let i = 0; i < count; i++) {
            const el = document.createElement('div');
            el.style.position = 'fixed';
            el.style.zIndex = '1000';
            el.style.pointerEvents = 'none';

            if (isFullScreen) {
                el.style.left = Math.random() * 100 + 'vw';
                el.style.top = '-20px';
                el.style.width = Math.random() * 10 + 5 + 'px';
                el.style.height = Math.random() * 10 + 5 + 'px';
                el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                el.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
                el.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
            } else {
                el.innerHTML = ['✨', '❤️', '🎉'][Math.floor(Math.random() * 3)];
                el.style.left = x + 'px';
                el.style.top = y + 'px';
                el.style.fontSize = Math.random() * 15 + 10 + 'px';
                el.style.transition = 'all 1s ease-out';
                
                setTimeout(() => {
                    const rx = Math.random() * 200 - 100;
                    const ry = Math.random() * 200 + 50;
                    el.style.transform = `translate(${rx}px, -${ry}px) scale(0) rotate(${Math.random() * 360}deg)`;
                    el.style.opacity = '0';
                }, 50);
            }
            document.body.appendChild(el);
            if(!isFullScreen) setTimeout(() => el.remove(), 1000);
        }
    };

    window.onload = () => {
        initSnow();
        setTimeout(() => {
            DOM.loading.style.opacity = '0';
            setTimeout(() => DOM.loading.style.display = 'none', 800);
        }, 1500);
    };

    document.addEventListener('mousemove', e => createMagicDust(e.clientX, e.clientY));
    document.addEventListener('touchmove', e => createMagicDust(e.touches[0].clientX, e.touches[0].clientY), {passive: true});

    DOM.startBtn.addEventListener('click', () => {
        vibrate();
        if (!state.isMusicPlaying) window.toggleMusic();
        
        switchScene('scene1', 'scene2');
        setTimeout(() => {
            typeWriter("Tối quá anh không thấy đường... Bảo ơi, soi sáng cho anh đi! 🥺");
        }, 1200);
    });

    DOM.candle.addEventListener('click', () => {
        if (!DOM.candle.classList.contains('lit')) {
            vibrate();
            DOM.candle.classList.add('lit');
            createHeartRain();
            
            DOM.instruction.style.opacity = '0';
            setTimeout(() => DOM.lightMsg.classList.add('visible'), 500);
            DOM.nightOverlay.classList.add('lit');

            setTimeout(() => switchScene('scene2', 'scene3'), 5000);
        }
    });

    DOM.nextToGiftBtn.addEventListener('click', () => {
        vibrate();
        switchScene('scene3', 'scene4');
    });

    window.openGift = (id) => {
        const giftEl = document.getElementById(`gift${id}`);
        const sockContainer = giftEl.parentElement;
        
        if (!giftEl.classList.contains('revealed')) {
            vibrate();
            giftEl.classList.add('revealed');
            
            const rect = sockContainer.getBoundingClientRect();
            spawnConfetti(rect.left + rect.width / 2, rect.top);

            if (!giftEl.dataset.counted) {
                giftEl.dataset.counted = "true";
                state.giftsOpened++;
                
                if (state.giftsOpened === 3) {
                    setTimeout(() => {
                        DOM.finalMessage.classList.add('visible');
                        spawnConfetti(0, 0, true);
                        createHeartRain();
                    }, 1000);
                }
            }
        }
    };
});