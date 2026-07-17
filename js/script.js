document.addEventListener("DOMContentLoaded", function () {
    // --- 1. CONFIGURATION & STATE ---
    let isPlaying = false;
    let wishes = {
        "Hoàng Chính": "Sang tuổi mới chúc m trưởng thành hơn 😏, sống lâu trăm tuổi, con cháu đầy nhà, mãi mãi hạnh phúc, lạc quan yêu đời hehe.",
        "Diễm Quỳnh": "Chúc pà chân cứng đá mềm, vững bước tiến về cuộc sống ước mơ và hoài bão của chính pà nhó 🥰.\n\nHông chỉ mỗi sinh nhật mà mọi ngày tui chúc pà lun hạnh phúc và mãi tích cực như vậy nhen!!!"
    };

    const urlParams = new URLSearchParams(window.location.search);
    const customName = urlParams.get("name");
    if (customName) {
        document.getElementById("mainName").innerText = customName;
        const introTitle = document.querySelector(".intro-card h1");
        if (introTitle) {
            introTitle.innerText = `Gửi ${customName}... ✨`;
        }
    }

    // --- 2. HIGH-PERFORMANCE SAKURA BACKGROUND & CURSOR TRAILS CANVAS ---
    const sakuraCanvas = document.getElementById("sakuraBg");
    const sCtx = sakuraCanvas.getContext("2d");
    
    let sakuraParticles = [];
    let mouseParticles = [];
    let wind = 0.5;
    let targetWind = 0.5;
    let lastMouseX = null;
    let lastMouseY = null;

    function resizeSakuraCanvas() {
        sakuraCanvas.width = window.innerWidth;
        sakuraCanvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeSakuraCanvas);
    resizeSakuraCanvas();

    // Cherry Blossom Petal Class
    class SakuraPetal {
        constructor() {
            this.reset(true);
        }

        reset(randomY = false) {
            this.x = Math.random() * sakuraCanvas.width;
            this.y = randomY ? Math.random() * sakuraCanvas.height : -20;
            this.r = Math.random() * 8 + 5; // radius
            this.speedY = Math.random() * 1.5 + 0.8;
            this.swing = Math.random() * 1.5 + 0.5;
            this.swingAngle = Math.random() * Math.PI * 2;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 2 - 1;
            const g = Math.floor(Math.random() * 40) + 160;
            const b = Math.floor(Math.random() * 40) + 190;
            this.color = `rgba(255, ${g}, ${b}, ${Math.random() * 0.4 + 0.5})`;
        }

        update() {
            this.y += this.speedY;
            this.x += wind + Math.sin(this.swingAngle) * 0.5;
            this.swingAngle += this.swing * 0.01;
            this.rotation += this.rotationSpeed;

            if (this.y > sakuraCanvas.height + 20 || this.x > sakuraCanvas.width + 20 || this.x < -20) {
                this.reset(false);
            }
        }

        draw() {
            sCtx.save();
            sCtx.translate(this.x, this.y);
            sCtx.rotate((this.rotation * Math.PI) / 180);
            sCtx.fillStyle = this.color;
            sCtx.beginPath();
            sCtx.moveTo(0, 0);
            sCtx.bezierCurveTo(-this.r, -this.r, -this.r * 1.5, this.r, 0, this.r * 2);
            sCtx.bezierCurveTo(this.r * 1.5, this.r, this.r, -this.r, 0, 0);
            sCtx.closePath();
            sCtx.fill();
            sCtx.restore();
        }
    }

    // Sparkle Cursor Particle Class
    class SparkleTrailParticle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 6 + 4;
            this.speedX = Math.random() * 3 - 1.5;
            this.speedY = Math.random() * 3 - 1.5 - 0.6;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 6 - 3;
            this.life = 1.0;
            this.decay = Math.random() * 0.02 + 0.02;
            const colors = ["#FF7597", "#FFB6E9", "#FFF0F2", "#FFD700", "#FFE3E8"];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.rotation += this.rotationSpeed;
            this.life -= this.decay;
        }

        draw() {
            sCtx.save();
            sCtx.translate(this.x, this.y);
            sCtx.rotate((this.rotation * Math.PI) / 180);
            sCtx.globalAlpha = this.life;
            sCtx.fillStyle = this.color;
            
            sCtx.beginPath();
            sCtx.moveTo(0, -this.size);
            sCtx.lineTo(this.size/3, -this.size/3);
            sCtx.lineTo(this.size, 0);
            sCtx.lineTo(this.size/3, this.size/3);
            sCtx.lineTo(0, this.size);
            sCtx.lineTo(-this.size/3, this.size/3);
            sCtx.lineTo(-this.size, 0);
            sCtx.lineTo(-this.size/3, -this.size/3);
            sCtx.closePath();
            sCtx.fill();
            sCtx.restore();
        }
    }

    // Init Sakura Background
    const maxSakura = 45;
    for (let i = 0; i < maxSakura; i++) {
        sakuraParticles.push(new SakuraPetal());
    }

    // Loop for Sakura background & Mouse Trail
    function loopSakura() {
        sCtx.clearRect(0, 0, sakuraCanvas.width, sakuraCanvas.height);
        wind += (targetWind - wind) * 0.05;

        sakuraParticles.forEach(p => {
            p.update();
            p.draw();
        });

        for (let i = mouseParticles.length - 1; i >= 0; i--) {
            const p = mouseParticles[i];
            p.update();
            if (p.life <= 0) {
                mouseParticles.splice(i, 1);
            } else {
                p.draw();
            }
        }
        requestAnimationFrame(loopSakura);
    }
    requestAnimationFrame(loopSakura);

    // Dynamic mouse trigger trail & wind gust
    window.addEventListener("mousemove", (e) => {
        mouseParticles.push(new SparkleTrailParticle(e.clientX, e.clientY));
        if (Math.random() < 0.3) {
            mouseParticles.push(new SparkleTrailParticle(e.clientX, e.clientY));
        }

        if (lastMouseX !== null && lastMouseY !== null) {
            const dx = e.clientX - lastMouseX;
            if (Math.abs(dx) > 20) {
                targetWind = dx > 0 ? 3.5 : -2.5;
                setTimeout(() => { targetWind = 0.5; }, 800);
            }
        }
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
    });

    // --- FANCY BUTTON CLICK PARTICLE EXPLOSION ---
    document.addEventListener("click", function (e) {
        const btn = e.target.closest("button") || e.target.closest(".btn-open") || e.target.closest(".btn-wish") || e.target.closest(".btn-send-wish") || e.target.closest(".btn-player");
        if (!btn) return;

        const rect = btn.getBoundingClientRect();
        const clickX = e.clientX || (rect.left + rect.width / 2);
        const clickY = e.clientY || (rect.top + rect.height / 2);

        for (let i = 0; i < 12; i++) {
            const particle = document.createElement("div");
            particle.classList.add("btn-ripple-particle");
            
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 45 + 25;
            const dx = Math.cos(angle) * distance;
            const dy = Math.sin(angle) * distance;
            
            particle.style.left = `${clickX}px`;
            particle.style.top = `${clickY}px`;
            particle.style.setProperty("--dx", `${dx}px`);
            particle.style.setProperty("--dy", `${dy}px`);
            
            const colors = ["#FF7597", "#FFB6E9", "#FFD700", "#FFF"];
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            document.body.appendChild(particle);
            setTimeout(() => {
                particle.remove();
            }, 600);
        }
    });

    // --- 3. ADVANCED SCROLL REVEAL ENGINE ---
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.15
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                const staggers = entry.target.querySelectorAll('.item-stagger');
                staggers.forEach((el, i) => {
                    el.style.transitionDelay = `${0.1 + (i * 0.15)}s`;
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll(".scroll-reveal");
    revealElements.forEach(el => {
        if (el.dataset.delay) {
            el.style.transitionDelay = el.dataset.delay;
        }
        scrollObserver.observe(el);
    });

    // --- 4. PREMIUM 3D TILT ENGINE ---
    const bentoCards = document.querySelectorAll(".bento-card");
    bentoCards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            // Ignore 3D tilt effects if any card inside is zoomed
            if (document.querySelector(".polaroid-photo.zoomed")) return;

            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const tiltX = -((y - centerY) / centerY) * 10; 
            const tiltY = ((x - centerX) / centerX) * 10;  
            
            card.style.setProperty("--tilt-x", `${tiltX}deg`);
            card.style.setProperty("--tilt-y", `${tiltY}deg`);
        });

        card.addEventListener("mouseleave", () => {
            card.style.setProperty("--tilt-x", `0deg`);
            card.style.setProperty("--tilt-y", `0deg`);
            card.style.setProperty("--mouse-x", `-1000px`);
        });
    });

    // --- 5. SCROLL WIND GUST ---
    window.addEventListener("scroll", () => {
        targetWind = 2.0;
        clearTimeout(window.scrollWindTimeout);
        window.scrollWindTimeout = setTimeout(() => { targetWind = 0.5; }, 500);
    });

    // --- 6. CANVAS CONFETTI SYSTEM ---
    const canvas = document.getElementById("confetti");
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let confettiActive = false;
    let particles = [];
    const particleCount = 120;
    const confettiColors = ["#FF7597", "#E05375", "#FFD7E0", "#FFF0F2", "#D4AF37", "#C5A059"];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    class ConfettiParticle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height - canvas.height;
            this.size = Math.random() * 8 + 6;
            this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
            this.speedX = Math.random() * 4 - 2;
            this.speedY = Math.random() * 3 + 4;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 4 - 2;
            this.opacity = Math.random() * 0.5 + 0.5;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.rotation += this.rotationSpeed;
            if (this.y > canvas.height) {
                this.y = -20;
                this.x = Math.random() * canvas.width;
                this.speedY = Math.random() * 3 + 4;
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            ctx.restore();
        }
    }

    function initConfetti() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new ConfettiParticle());
        }
    }

    function animateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        if (confettiActive) {
            animationFrameId = requestAnimationFrame(animateConfetti);
        }
    }

    function startConfetti(durationMs = 5000) {
        if (confettiActive) return;
        confettiActive = true;
        initConfetti();
        animateConfetti();
        if (durationMs > 0) {
            setTimeout(() => { stopConfetti(); }, durationMs);
        }
    }

    function stopConfetti() {
        confettiActive = false;
        cancelAnimationFrame(animationFrameId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function triggerBurst() {
        initConfetti();
        particles.forEach(p => {
            p.y = canvas.height * 0.8;
            p.x = Math.random() < 0.5 ? 0 : canvas.width;
            p.speedX = p.x === 0 ? Math.random() * 15 + 5 : -(Math.random() * 15 + 5);
            p.speedY = -(Math.random() * 15 + 10);
        });
        confettiActive = true;
        animateConfetti();
        setTimeout(() => { stopConfetti(); }, 3000);
    }

    // --- 7. TOAST MESSAGES ---
    const toast = document.getElementById("toastMsg");
    function showToast(message) {
        toast.innerText = message;
        toast.classList.add("show");
        setTimeout(() => { toast.classList.remove("show"); }, 3000);
    }

    // --- 8. AUDIO & VINYL PLAYER ---
    const audio = document.getElementById("bgMusic");
    const btnPlayPause = document.getElementById("btnPlayPause");
    const btnMute = document.getElementById("btnMute");
    const playIcon = document.getElementById("playIcon");
    const musicCard = document.querySelector(".bento-music");

    function togglePlay() {
        if (audio.paused) {
            audio.play().then(() => {
                isPlaying = true;
                if (musicCard) musicCard.classList.add("playing");
                playIcon.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path>';
            }).catch(err => {
                console.log("Audio play failed:", err);
                showToast("Vui lòng tương tác với trang để phát nhạc nhé! 🎵");
            });
        } else {
            audio.pause();
            isPlaying = false;
            if (musicCard) musicCard.classList.remove("playing");
            playIcon.innerHTML = '<path d="M8 5v14l11-7z"></path>';
        }
    }

    if (btnPlayPause) btnPlayPause.addEventListener("click", togglePlay);
    if (btnMute) {
        btnMute.addEventListener("click", function () {
            audio.muted = !audio.muted;
            if (audio.muted) {
                btnMute.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v6a3 3 0 0 0 3 3h1.586l4.707 4.707A1 1 0 0 0 20 22V4a1 1 0 0 0-1.707-.707L13.586 8H12a3 3 0 0 0-3 3z"></path></svg>';
                showToast("Đã tắt tiếng loa 🔇");
            } else {
                btnMute.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>';
                showToast("Đã bật tiếng loa 🔊");
            }
        });
    }

    // --- 9. INTRO FADE OUT & START ---
    const playBtn = document.getElementById("playBtn");
    const giftBox = document.getElementById("giftBox");
    const loader = document.getElementById("loader");
    const mainContent = document.getElementById("mainContent");

    function startExperience() {
        loader.classList.add("fade-out");
        mainContent.classList.add("visible");
        
        const bentoGrid = document.querySelector(".bento-grid");
        if (bentoGrid) {
            bentoGrid.style.opacity = "0";
            bentoGrid.style.transform = "rotateX(-15deg) translateZ(-150px)";
            setTimeout(() => {
                bentoGrid.style.transition = "all 1.5s cubic-bezier(0.16, 1, 0.3, 1)";
                bentoGrid.style.opacity = "1";
                bentoGrid.style.transform = "rotateX(0deg) translateZ(0px)";
            }, 100);
        }

        const hero = document.getElementById("hero-section");
        if(hero && scrollObserver) scrollObserver.observe(hero);

        audio.play().then(() => {
            isPlaying = true;
            if (musicCard) musicCard.classList.add("playing");
            playIcon.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path>';
        }).catch(err => {
            console.log("Auto-play blocked:", err);
        });

        startConfetti(6000);
        setTimeout(startTypewriter, 1200);
    }

    if (playBtn) playBtn.addEventListener("click", startExperience);
    if (giftBox) giftBox.addEventListener("click", startExperience);

    // --- 10. TYPEWRITER EFFECT ---
    const greetings = [
        "Chúc Thảo chợ chuối luôn ngập tràn niềm vui và tiếng cười! 🎉",
        "Tuổi mới chúc bà chân cứng đá mềm, luôn hạnh phúc và lạc quan! 🌸",
        "Mãi mãi xinh đẹp, tích cực và đạt được mọi hoài bão ước mơ của mình nhé! 💫"
    ];
    let greetingIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typedTextSpan = document.getElementById("typedText");
    
    function startTypewriter() {
        if (!typedTextSpan) return;
        const currentGreeting = greetings[greetingIndex];
        
        if (isDeleting) {
            typedTextSpan.innerText = currentGreeting.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedTextSpan.innerText = currentGreeting.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 25 : 60;
        if (!isDeleting && charIndex === currentGreeting.length) {
            typeSpeed = 2500;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            greetingIndex = (greetingIndex + 1) % greetings.length;
            typeSpeed = 500;
        }
        setTimeout(startTypewriter, typeSpeed);
    }

    // --- 11. WISHES MODAL OVERLAY ---
    const wishItems = document.querySelectorAll(".wish-item");
    const letterModal = document.getElementById("letterModal");
    const btnCloseLetter = document.getElementById("btnCloseLetter");
    const letterText = document.getElementById("letterText");
    const letterSign = document.getElementById("letterSign");

    wishItems.forEach(item => {
        item.addEventListener("click", function () {
            const sender = this.getAttribute("data-sender");
            const message = wishes[sender] || "";
            letterText.innerHTML = message.split("\n\n").map(p => `<p>${p}</p>`).join("");
            letterSign.innerText = `- ${sender}`;
            letterModal.classList.add("active");
        });
    });

    function closeLetter() { letterModal.classList.remove("active"); }
    if (btnCloseLetter) btnCloseLetter.addEventListener("click", closeLetter);
    if (letterModal) {
        letterModal.addEventListener("click", function (e) {
            if (e.target === letterModal) closeLetter();
        });
    }

    // --- 12. ADVANCED CANDLE BLOWING WITH MICROPHONE OPTION ---
    const candles = document.querySelectorAll(".candle");
    const btnMakeWish = document.getElementById("btnMakeWish");

    function blowOutCandle(c) {
        if (c.classList.contains("blown")) return;
        c.classList.add("blown");
        
        const rect = c.getBoundingClientRect();
        const smoke = document.createElement("div");
        smoke.classList.add("smoke-particle");
        smoke.style.left = `${rect.left + rect.width / 2 - 10 + window.scrollX}px`;
        smoke.style.top = `${rect.top + window.scrollY - 15}px`;
        document.body.appendChild(smoke);
        
        setTimeout(() => smoke.remove(), 1500);
        checkCandlesStatus();
    }

    candles.forEach(candle => {
        candle.addEventListener("click", function () {
            if (this.classList.contains("blown")) {
                this.classList.remove("blown");
                checkCandlesStatus();
            } else {
                blowOutCandle(this);
            }
        });
    });

    function checkCandlesStatus() {
        const allBlown = Array.from(candles).every(c => c.classList.contains("blown"));
        if (allBlown) {
            btnMakeWish.innerHTML = "Thắp lại nến 🕯️";
            triggerBurst();
            showToast("Chúc mừng sinh nhật! Điều ước đã bay tới các vì sao 🌟");
            
            document.body.classList.add("candles-blown-dim");
            setTimeout(() => document.body.classList.remove("candles-blown-dim"), 5000);
        } else {
            btnMakeWish.innerHTML = "Thổi tắt nến ✨";
        }
    }

    if (btnMakeWish) {
        btnMakeWish.addEventListener("click", function () {
            const allBlown = Array.from(candles).every(c => c.classList.contains("blown"));
            if (!allBlown) {
                candles.forEach(c => blowOutCandle(c));
            } else {
                candles.forEach(c => c.classList.remove("blown"));
                btnMakeWish.innerHTML = "Thổi tắt nến ✨";
                showToast("Ngọn nến đã được thắp sáng lại 🕯️");
            }
        });
    }

    // Microphone Blow Detection
    let audioContext, analyser, microphone, javascriptNode;
    let micInitialized = false;

    function initMicrophoneBlowing() {
        if (micInitialized) return;
        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
            .then(function(stream) {
                micInitialized = true;
                showToast("Đã kết nối micro! Hãy thổi vào mic để tắt nến 🎙️💨");
                
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                analyser = audioContext.createAnalyser();
                microphone = audioContext.createMediaStreamSource(stream);
                javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

                analyser.smoothingTimeConstant = 0.8;
                analyser.fftSize = 1024;

                microphone.connect(analyser);
                analyser.connect(javascriptNode);
                javascriptNode.connect(audioContext.destination);

                javascriptNode.onaudioprocess = function() {
                    const array = new Uint8Array(analyser.frequencyBinCount);
                    analyser.getByteFrequencyData(array);
                    let values = 0;

                    const length = array.length;
                    for (let i = 0; i < length; i++) {
                        values += array[i];
                    }

                    const average = values / length;
                    
                    if (average > 55) {
                        const activeCandles = Array.from(candles).filter(c => !c.classList.contains("blown"));
                        if (activeCandles.length > 0) {
                            const randomCandle = activeCandles[Math.floor(Math.random() * activeCandles.length)];
                            blowOutCandle(randomCandle);
                        }
                    }
                };
            })
            .catch(function(err) {
                console.warn("Microphone access denied or unsupported:", err);
            });
    }

    const cakeCard = document.getElementById("cake-section");
    if (cakeCard) {
        cakeCard.addEventListener("mouseenter", initMicrophoneBlowing);
        cakeCard.addEventListener("touchstart", initMicrophoneBlowing);
    }


    // --- 13. INTERACTIVE SWIPEABLE & ZOOMABLE PHOTO GALLERY ---
    const polaroidDeck = document.getElementById("polaroidDeck");
    const photoZoomBackdrop = document.getElementById("photoZoomBackdrop");
    
    if (polaroidDeck) {
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let currentX = 0;
        let currentY = 0;
        let topPhoto = null;
        let dragThreshold = 8; // Pixel distance below which we trigger zoom lightbox

        function getTopPhoto() {
            const photos = Array.from(polaroidDeck.querySelectorAll(".polaroid-photo:not(.zoomed)"));
            return photos[photos.length - 1]; 
        }

        function handleDragStart(e) {
            if (document.querySelector(".polaroid-photo.zoomed")) return;

            topPhoto = getTopPhoto();
            if (!topPhoto) return;

            isDragging = true;
            topPhoto.style.transition = 'none';
            startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            startY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
            currentX = startX;
            currentY = startY;
        }

        function handleDragMove(e) {
            if (!isDragging || !topPhoto) return;
            
            currentX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            currentY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
            const deltaX = currentX - startX;
            const deltaY = currentY - startY;
            
            // 3D physics drag angles
            const rotateDeg = deltaX * 0.08 + (deltaY * 0.03);
            topPhoto.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${rotateDeg}deg) scale(1.05)`;
            topPhoto.style.boxShadow = `0 25px 50px rgba(74, 46, 53, 0.25)`;
        }

        function handleDragEnd() {
            if (!isDragging || !topPhoto) return;
            isDragging = false;
            
            const deltaX = currentX - startX;
            const deltaY = currentY - startY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            if (distance < dragThreshold) {
                // Open visual lightbox
                zoomPhoto(topPhoto);
            } else if (Math.abs(deltaX) > 120) {
                // Tinder swipe away
                const direction = deltaX > 0 ? 1 : -1;
                topPhoto.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease';
                topPhoto.style.transform = `translate(${direction * 450}px, ${deltaY}px) rotate(${direction * 45}deg) scale(0.9)`;
                topPhoto.style.opacity = '0';
                
                const currentPhoto = topPhoto;
                setTimeout(() => {
                    currentPhoto.style.opacity = '1';
                    currentPhoto.style.transform = 'none';
                    polaroidDeck.insertBefore(currentPhoto, polaroidDeck.firstChild);
                    resetDeckOffsets();
                }, 600);
            } else {
                // Smooth bounce back
                topPhoto.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.25)';
                resetDeckOffsets();
            }
            
            topPhoto = null;
        }

        function zoomPhoto(photo) {
            photo.classList.add("zoomed");
            if (photoZoomBackdrop) {
                photoZoomBackdrop.classList.add("active");
            }
        }

        function closeZoom() {
            const zoomedPhoto = document.querySelector(".polaroid-photo.zoomed");
            if (zoomedPhoto) {
                zoomedPhoto.classList.remove("zoomed");
            }
            if (photoZoomBackdrop) {
                photoZoomBackdrop.classList.remove("active");
            }
            resetDeckOffsets();
        }

        if (photoZoomBackdrop) {
            photoZoomBackdrop.addEventListener("click", closeZoom);
        }
        
        polaroidDeck.addEventListener("click", (e) => {
            const zoomed = e.target.closest(".polaroid-photo.zoomed");
            if (zoomed) {
                closeZoom();
            }
        });

        function resetDeckOffsets() {
            const photos = Array.from(polaroidDeck.querySelectorAll(".polaroid-photo"));
            photos.forEach((photo, idx) => {
                if (photo.classList.contains("zoomed")) return;

                photo.style.transition = 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.2)';
                if (idx === photos.length - 1) {
                    photo.style.transform = `rotate(-1deg) translate(0px, 0px)`;
                    photo.style.zIndex = 3;
                } else if (idx === photos.length - 2) {
                    photo.style.transform = `rotate(-4deg) translate(-5px, 5px)`;
                    photo.style.zIndex = 2;
                } else {
                    photo.style.transform = `rotate(6deg) translate(5px, 10px)`;
                    photo.style.zIndex = 1;
                }
            });
        }

        polaroidDeck.addEventListener('mousedown', handleDragStart);
        window.addEventListener('mousemove', handleDragMove);
        window.addEventListener('mouseup', handleDragEnd);

        polaroidDeck.addEventListener('touchstart', handleDragStart);
        window.addEventListener('touchmove', handleDragMove);
        window.addEventListener('touchend', handleDragEnd);
        
        polaroidDeck.querySelectorAll('img').forEach(img => {
            img.addEventListener('dragstart', (e) => e.preventDefault());
        });

        resetDeckOffsets();
    }


    // --- 14. INTERACTIVE WISH JAR & FLYING WISHE TRANSITIONS ---
    const wishInput = document.getElementById("wishInput");
    const btnSendWish = document.getElementById("btnSendWish");
    const foldedWishesGroup = document.getElementById("foldedWishes");
    const jarWishesBoard = document.getElementById("jarWishesBoard");
    const emptyBoardMsg = document.getElementById("emptyBoardMsg");
    
    let savedWishes = JSON.parse(localStorage.getItem("thao_birthday_wishes")) || [];

    function renderSavedWishes() {
        if (!foldedWishesGroup || !jarWishesBoard) return;
        foldedWishesGroup.innerHTML = "";
        const notes = jarWishesBoard.querySelectorAll(".board-note");
        notes.forEach(note => note.remove());

        if (savedWishes.length > 0) {
            if (emptyBoardMsg) emptyBoardMsg.style.display = "none";
            savedWishes.forEach((w, index) => {
                addVisualWishToJar(index);
                addWishToBoard(w, index);
            });
        } else {
            if (emptyBoardMsg) emptyBoardMsg.style.display = "block";
        }
    }

    function addWishToBoard(text, index) {
        if (!jarWishesBoard) return;
        if (emptyBoardMsg) emptyBoardMsg.style.display = "none";
        
        const note = document.createElement("div");
        note.classList.add("board-note");
        note.classList.add("item-stagger");
        note.style.opacity = 1;
        note.style.transform = "translateX(0)";
        
        note.innerText = text;
        note.title = "Click để đọc trọn vẹn lời chúc";
        
        note.addEventListener("click", () => {
            letterText.innerHTML = `<p>${text}</p>`;
            letterSign.innerText = `- Điều ước #${index + 1}`;
            letterModal.classList.add("active");
        });
        
        jarWishesBoard.appendChild(note);
    }

    function addVisualWishToJar(index) {
        if (!foldedWishesGroup) return;
        const minX = 28, maxX = 72, minY = 65, maxY = 105;
        const rx = minX + Math.random() * (maxX - minX);
        const ry = minY + Math.random() * (maxY - minY);
        const rotation = Math.random() * 360;
        
        const paperColors = ["#FFB6E9", "#FFF0F2", "#FF7597", "#7CDFFF", "#FFD700", "#FFE3E8"];
        const color = paperColors[index % paperColors.length];
        
        const note = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        note.setAttribute("x", rx - 6);
        note.setAttribute("y", ry - 4);
        note.setAttribute("width", "12");
        note.setAttribute("height", "8");
        note.setAttribute("rx", "2");
        note.setAttribute("fill", color);
        note.setAttribute("stroke", "#4A2E35");
        note.setAttribute("stroke-width", "1");
        note.setAttribute("transform", `rotate(${rotation} ${rx} ${ry})`);
        
        note.classList.add("jar-folded-note");
        foldedWishesGroup.appendChild(note);
    }

    function animateWishFly(text) {
        const inputRect = wishInput.getBoundingClientRect();
        const jarSvg = document.getElementById("jarSvg");
        const jarRect = jarSvg.getBoundingClientRect();
        
        const flyer = document.createElement("div");
        flyer.classList.add("flying-wish-particle");
        flyer.style.left = `${inputRect.left + window.scrollX}px`;
        flyer.style.top = `${inputRect.top + window.scrollY}px`;
        
        flyer.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path></svg>`;
        document.body.appendChild(flyer);
        
        const targetX = jarRect.left + jarRect.width / 2 + window.scrollX - 15;
        const targetY = jarRect.top + jarRect.height / 2 + window.scrollY - 15;
        
        setTimeout(() => {
            flyer.style.transform = `translate(${targetX - (inputRect.left + window.scrollX)}px, ${targetY - (inputRect.top + window.scrollY)}px) rotate(360deg) scale(0.6)`;
            flyer.style.opacity = '0.8';
            
            const sparkleInterval = setInterval(() => {
                const flyerRect = flyer.getBoundingClientRect();
                const sp = document.createElement("div");
                sp.classList.add("trail-sparkle");
                sp.style.left = `${flyerRect.left + window.scrollX}px`;
                sp.style.top = `${flyerRect.top + window.scrollY}px`;
                document.body.appendChild(sp);
                setTimeout(() => sp.remove(), 800);
            }, 50);

            setTimeout(() => {
                clearInterval(sparkleInterval);
                flyer.remove();
                
                savedWishes.push(text);
                localStorage.setItem("thao_birthday_wishes", JSON.stringify(savedWishes));
                
                addVisualWishToJar(savedWishes.length - 1);
                addWishToBoard(text, savedWishes.length - 1);
                
                triggerJarSplash(jarRect);
                showToast("Lời chúc đã hạ cánh an toàn vào lọ! 🍯✨");
            }, 800);

        }, 50);
    }

    function triggerJarSplash(rect) {
        for(let i=0; i<15; i++) {
            const sp = document.createElement("div");
            sp.classList.add("trail-sparkle");
            sp.style.left = `${rect.left + rect.width / 2 + window.scrollX}px`;
            sp.style.top = `${rect.top + rect.height / 2 + window.scrollY}px`;
            
            const dx = (Math.random() - 0.5) * 120;
            const dy = (Math.random() - 0.5) * 120;
            sp.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';
            
            document.body.appendChild(sp);
            
            setTimeout(() => {
                sp.style.transform = `translate(${dx}px, ${dy}px) scale(0.5)`;
                sp.style.opacity = '0';
            }, 20);
            
            setTimeout(() => sp.remove(), 700);
        }
    }

    if (btnSendWish) {
        btnSendWish.addEventListener("click", function () {
            const text = wishInput.value.trim();
            if (!text) {
                showToast("Hãy viết gì đó trước khi thả vào lọ nhé! 🌸");
                return;
            }
            animateWishFly(text);
            wishInput.value = "";
        });
    }

    renderSavedWishes();
});