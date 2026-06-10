document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // Set dynamic boarding time based on visitor's current local time
    const boardingTimeEl = document.getElementById('boardingTime');
    if (boardingTimeEl) {
        const now = new Date();
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const timeStr = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
        boardingTimeEl.textContent = timeStr;
    }

    // Live Terminal Clock in Header
    const timeDisplayEl = document.getElementById('timeDisplay');
    const dateDisplayEl = document.getElementById('dateDisplay');

    function updateLiveClock() {
        const now = new Date();
        
        // Format Time: HH:MM:SS AM/PM
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const timeStr = `${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
        
        // Format Date: DD MMM YYYY (e.g. 10 JUN 2026)
        const day = String(now.getDate()).padStart(2, '0');
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const monthName = months[now.getMonth()];
        const year = now.getFullYear();
        const dateStr = `${day} ${monthName} ${year}`;
        
        if (timeDisplayEl) timeDisplayEl.textContent = timeStr;
        if (dateDisplayEl) dateDisplayEl.textContent = dateStr;
    }

    // Run clock immediately and then every second
    updateLiveClock();
    setInterval(updateLiveClock, 1000);

    // 1. Boarding Pass Terminal Scanner Logic
    const scanBtn = document.getElementById('scanBtn');
    const laserLine = document.getElementById('laserLine');
    const grantedOverlay = document.getElementById('grantedOverlay');
    const gateScreen = document.getElementById('gateScreen');
    const portfolioMain = document.getElementById('portfolioMain');
    const boardingPass = document.getElementById('boardingPass');

    if (scanBtn) {
        scanBtn.addEventListener('click', () => {
            // Trigger laser scanning animation
            laserLine.classList.add('scanning');
            scanBtn.disabled = true;
            scanBtn.querySelector('.scan-btn-text').textContent = 'SCANNING IN PROGRESS...';
            boardingPass.style.transform = 'scale(0.98)';
            
            // Create scan sound effect using Web Audio API (no external asset needed!)
            playScanSound();

            setTimeout(() => {
                // Success sound
                playGrantedSound();
                
                // Show approved screen
                laserLine.classList.remove('scanning');
                grantedOverlay.classList.add('active');
                
                setTimeout(() => {
                    // Reveal main website
                    gateScreen.classList.add('slide-away');
                    portfolioMain.classList.remove('hidden');
                    
                    // Trigger scroll reveals on load
                    triggerScrollReveal();
                }, 1600);
            }, 2200);
        });
    }

    // Web Audio API Sound synthesizers
    function playScanSound() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 1.8);
            
            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.8);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 1.8);
        } catch (e) {
            console.log('Audio Context blocked or not supported');
        }
    }

    function playGrantedSound() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            
            // Beep 1
            let osc1 = ctx.createOscillator();
            let gain1 = ctx.createGain();
            osc1.frequency.setValueAtTime(1046.50, ctx.currentTime); // C6
            gain1.gain.setValueAtTime(0.06, ctx.currentTime);
            gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
            osc1.connect(gain1);
            gain1.connect(ctx.destination);
            osc1.start();
            osc1.stop(ctx.currentTime + 0.15);
            
            // Beep 2 (Chime upward)
            setTimeout(() => {
                let osc2 = ctx.createOscillator();
                let gain2 = ctx.createGain();
                osc2.frequency.setValueAtTime(1318.51, ctx.currentTime); // E6
                gain2.gain.setValueAtTime(0.06, ctx.currentTime);
                gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
                osc2.connect(gain2);
                gain2.connect(ctx.destination);
                osc2.start();
                osc2.stop(ctx.currentTime + 0.3);
            }, 80);
        } catch (e) {
            console.log('Audio Context blocked or not supported');
        }
    }


    // 2. Navigation Drawer Toggle (Mobile)
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (mobileNav.classList.contains('active')) {
                icon.setAttribute('data-lucide', 'x');
            } else {
                icon.setAttribute('data-lucide', 'menu');
            }
            lucide.createIcons();
        });

        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.setAttribute('data-lucide', 'menu');
                lucide.createIcons();
            });
        });
    }


    // 3. Scroll Reveal Handler
    const revealElements = document.querySelectorAll('.scroll-reveal');

    function triggerScrollReveal() {
        const triggerBottom = window.innerHeight * 0.85;

        revealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            if (elTop < triggerBottom) {
                el.classList.add('reveal-visible');
            }
        });
    }

    window.addEventListener('scroll', triggerScrollReveal);


    // 4. Highlight Active Navigation Links on Scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links .nav-link');

    window.addEventListener('scroll', () => {
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 150)) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === currentSection) {
                link.classList.add('active');
            }
        });
    });


    // 5. Roles Section Tab Switcher
    const tabBtns = document.querySelectorAll('.role-tab-btn');
    const tabPanels = document.querySelectorAll('.role-tab-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target');

            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const activePanel = document.getElementById(target);
            if (activePanel) {
                activePanel.classList.add('active');
            }
        });
    });


    // 6. SVG Flight Path Animation on Scroll
    const flightPath = document.getElementById('flightPath');
    const movingPlane = document.getElementById('movingPlane');

    if (flightPath && movingPlane) {
        const pathLength = flightPath.getTotalLength();
        
        // Initial setup for path
        flightPath.style.strokeDasharray = pathLength + ' ' + pathLength;
        flightPath.style.strokeDashoffset = pathLength;

        function animatePlaneOnScroll() {
            const brandSection = document.getElementById('brand');
            if (!brandSection) return;

            const rect = brandSection.getBoundingClientRect();
            const viewHeight = window.innerHeight;
            
            // Calculate scroll percentage specifically through the brand section
            let scrollFraction = (viewHeight - rect.top) / (rect.height + viewHeight);
            scrollFraction = Math.max(0, Math.min(1, scrollFraction)); // clamp 0 to 1

            // Animate route path drawing
            const strokeOffset = pathLength * (1 - scrollFraction);
            flightPath.style.strokeDashoffset = strokeOffset;

            // Animate moving plane coordinates
            const point = flightPath.getPointAtLength(pathLength * scrollFraction);
            
            // Calculate angle for rotating the plane icon
            // Get point slightly ahead to compute slope
            const anglePointIndex = Math.min(pathLength, pathLength * scrollFraction + 1);
            const aheadPoint = flightPath.getPointAtLength(anglePointIndex);
            const angleRad = Math.atan2(aheadPoint.y - point.y, aheadPoint.x - point.x);
            const angleDeg = angleRad * (180 / Math.PI);

            movingPlane.setAttribute('transform', `translate(${point.x}, ${point.y}) rotate(${angleDeg})`);
        }

        window.addEventListener('scroll', animatePlaneOnScroll);
    }


    // 7. Contact Support Ticket Form Submission
    const contactForm = document.getElementById('contactForm');
    const ticketSuccess = document.getElementById('ticketSuccess');
    const resetTicketBtn = document.getElementById('resetTicketBtn');

    if (contactForm && ticketSuccess) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            // Animate submit button
            const submitBtn = document.getElementById('submitBtn');
            submitBtn.disabled = true;
            submitBtn.querySelector('span').textContent = 'DISPATCHING TICKET...';
            
            setTimeout(() => {
                // Populate success card details
                document.getElementById('successName').textContent = name.toUpperCase();
                
                const now = new Date();
                const dateTimeStr = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
                document.getElementById('successTime').textContent = dateTimeStr;

                // Hide form, show ticket
                contactForm.classList.add('hidden');
                ticketSuccess.classList.remove('hidden');
            }, 1500);
        });

        if (resetTicketBtn) {
            resetTicketBtn.addEventListener('click', () => {
                contactForm.reset();
                contactForm.classList.remove('hidden');
                ticketSuccess.classList.add('hidden');
                
                const submitBtn = document.getElementById('submitBtn');
                submitBtn.disabled = false;
                submitBtn.querySelector('span').textContent = 'CONFIRM FLIGHT TICKET REQUEST';
            });
        }
    }

    // 8. Dynamic Passenger Badge
    const paxBadge = document.getElementById('paxBadge');
    if (paxBadge) {
        // Load stored name or set to Guest
        const savedName = localStorage.getItem('paxName');
        if (savedName) {
            paxBadge.textContent = `Passenger: ${savedName}`;
            // Also update the starting boarding pass passenger name if it is present!
            const boardingPassName = document.querySelector('.passenger-details .value.uppercase');
            if (boardingPassName) {
                boardingPassName.textContent = savedName.toUpperCase();
            }
        }

        // On click, prompt user to enter their name/email
        paxBadge.addEventListener('click', () => {
            const newName = prompt('Welcome Aboard! Please enter passenger name or email to customize your boarding pass:', savedName || '');
            if (newName !== null) {
                const trimmed = newName.trim();
                if (trimmed) {
                    localStorage.setItem('paxName', trimmed);
                    paxBadge.textContent = `Passenger: ${trimmed}`;
                    const boardingPassName = document.querySelector('.passenger-details .value.uppercase');
                    if (boardingPassName) {
                        boardingPassName.textContent = trimmed.toUpperCase();
                    }
                } else {
                    localStorage.removeItem('paxName');
                    paxBadge.textContent = 'Passenger: Guest';
                    const boardingPassName = document.querySelector('.passenger-details .value.uppercase');
                    if (boardingPassName) {
                        boardingPassName.textContent = 'ABHISHEK M';
                    }
                }
            }
        });
    }

    // 9. FIDS Live Flight Board Tab Switcher
    const fidsTabBtns = document.querySelectorAll('.fids-tab-btn');
    const fidsPanels = document.querySelectorAll('.fids-panel');

    fidsTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target');

            fidsTabBtns.forEach(b => b.classList.remove('active'));
            fidsPanels.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const activePanel = document.getElementById(target);
            if (activePanel) {
                activePanel.classList.add('active');
            }
        });
    });

    // 10. FIDS Dynamic Live Board
    const destinations = [
        { city: "MUMBAI", code: "BOM" },
        { city: "DELHI", code: "DEL" },
        { city: "KOCHI", code: "COK" },
        { city: "HYDERABAD", code: "HYD" },
        { city: "PUNE", code: "PNQ" },
        { city: "AHMEDABAD", code: "AMD" },
        { city: "GOA", code: "GOI" },
        { city: "KOLKATA", code: "CCU" }
    ];

    let departuresList = [];
    let arrivalsList = [];

    function formatFIDSTime(date) {
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
    }

    function createRandomFlight(isDeparture, baseTime) {
        const dest = destinations[Math.floor(Math.random() * destinations.length)];
        const flightNum = 1000 + Math.floor(Math.random() * 900);
        
        let status = "SCHEDULED";
        let statusClass = "green";
        
        if (isDeparture) {
            const timeDiff = (baseTime.getTime() - new Date().getTime()) / 60000;
            if (timeDiff <= 0) {
                status = "DEPARTED";
                statusClass = "landed";
            } else if (timeDiff < 20) {
                status = "BOARDING";
                statusClass = "boarding";
            } else if (Math.random() > 0.85) {
                status = "DELAYED";
                statusClass = "delayed";
                baseTime.setMinutes(baseTime.getMinutes() + 25); // delay it
            }
        } else {
            const timeDiff = (baseTime.getTime() - new Date().getTime()) / 60000;
            if (timeDiff <= -5) {
                status = "LANDED";
                statusClass = "landed";
            } else if (timeDiff <= 5 && timeDiff > -5) {
                status = "ON TIME";
                statusClass = "green";
            } else if (Math.random() > 0.85) {
                status = "DELAYED";
                statusClass = "delayed";
                baseTime.setMinutes(baseTime.getMinutes() + 20); // delay it
            } else {
                status = "ON TIME";
                statusClass = "green";
            }
        }

        return {
            flightNo: `QP ${flightNum}`,
            station: `${dest.city} (${dest.code})`,
            time: baseTime,
            gateBelt: isDeparture ? `Gate ${String(Math.floor(Math.random() * 18) + 1).padStart(2, '0')}` : `Belt ${String(Math.floor(Math.random() * 8) + 1).padStart(2, '0')}`,
            status: status,
            statusClass: statusClass
        };
    }

    function initFIDSLists() {
        const now = new Date();
        departuresList = [];
        arrivalsList = [];
        
        // Departures (next 2-3 hours)
        for (let i = 0; i < 4; i++) {
            const flightTime = new Date(now.getTime() + (20 + i * 40) * 60000);
            departuresList.push(createRandomFlight(true, flightTime));
        }

        // Arrivals (recent and next 2 hours)
        for (let i = 0; i < 4; i++) {
            const flightTime = new Date(now.getTime() + (-10 + i * 40) * 60000);
            arrivalsList.push(createRandomFlight(false, flightTime));
        }

        renderFIDS();
    }

    function renderFIDS() {
        const depPanel = document.getElementById('fidsDepartures');
        const arrPanel = document.getElementById('fidsArrivals');

        if (depPanel) {
            depPanel.innerHTML = departuresList.map(f => `
                <div class="fids-row">
                    <span class="flight-no">${f.flightNo}</span>
                    <span class="station">${f.station}</span>
                    <span class="time">${formatFIDSTime(f.time)}</span>
                    <span class="gate">${f.gateBelt}</span>
                    <span class="status ${f.statusClass}">${f.status}</span>
                </div>
            `).join('');
        }

        if (arrPanel) {
            arrPanel.innerHTML = arrivalsList.map(f => `
                <div class="fids-row">
                    <span class="flight-no">${f.flightNo}</span>
                    <span class="station">${f.station}</span>
                    <span class="time">${formatFIDSTime(f.time)}</span>
                    <span class="gate">${f.gateBelt}</span>
                    <span class="status ${f.statusClass}">${f.status}</span>
                </div>
            `).join('');
        }
    }

    function updateFIDSBoard() {
        const now = new Date();
        let changed = false;
        
        // Update Departures
        departuresList.forEach((f, idx) => {
            const timeDiff = (f.time.getTime() - now.getTime()) / 60000;
            
            if (f.status === "SCHEDULED" && timeDiff < 20 && timeDiff > 0) {
                f.status = "BOARDING";
                f.statusClass = "boarding";
                changed = true;
                triggerRowFlash('fidsDepartures', idx);
            } else if (f.status === "BOARDING" && timeDiff <= 0) {
                f.status = "DEPARTED";
                f.statusClass = "landed";
                changed = true;
                triggerRowFlash('fidsDepartures', idx);
            }
        });

        // Check if the top departure has been DEPARTED for more than 2 minutes, replace it
        if (departuresList.length > 0 && departuresList[0].status === "DEPARTED") {
            const timeDiff = (now.getTime() - departuresList[0].time.getTime()) / 60000;
            if (timeDiff > 2) {
                departuresList.shift();
                const lastTime = departuresList[departuresList.length - 1].time;
                const nextTime = new Date(lastTime.getTime() + 40 * 60000);
                departuresList.push(createRandomFlight(true, nextTime));
                changed = true;
            }
        }

        // Update Arrivals
        arrivalsList.forEach((f, idx) => {
            const timeDiff = (f.time.getTime() - now.getTime()) / 60000;
            
            if (f.status === "ON TIME" && timeDiff <= 0) {
                f.status = "LANDED";
                f.statusClass = "landed";
                changed = true;
                triggerRowFlash('fidsArrivals', idx);
            }
        });

        // Check if the top arrival has been LANDED for more than 2 minutes, replace it
        if (arrivalsList.length > 0 && arrivalsList[0].status === "LANDED") {
            const timeDiff = (now.getTime() - arrivalsList[0].time.getTime()) / 60000;
            if (timeDiff > 2) {
                arrivalsList.shift();
                const lastTime = arrivalsList[arrivalsList.length - 1].time;
                const nextTime = new Date(lastTime.getTime() + 40 * 60000);
                arrivalsList.push(createRandomFlight(false, nextTime));
                changed = true;
            }
        }

        if (changed) {
            renderFIDS();
        }
    }

    function triggerRowFlash(panelId, rowIdx) {
        const panel = document.getElementById(panelId);
        if (!panel) return;
        const rows = panel.querySelectorAll('.fids-row');
        if (rows[rowIdx]) {
            rows[rowIdx].style.backgroundColor = 'rgba(255, 109, 0, 0.12)';
            setTimeout(() => {
                rows[rowIdx].style.backgroundColor = 'transparent';
            }, 1200);
        }
    }

    // 11. Operations Gallery Slideshow Logic
    const slides = Array.from(document.querySelectorAll('.slideshow-container .slide'));
    let activeSlides = [];
    let currentSlideIndex = 0;
    let slideshowInterval = null;

    function initSlideshow() {
        // Filter slides to only keep those whose image is loaded and parent slide is not hidden by error handler
        activeSlides = slides.filter(slide => {
            const img = slide.querySelector('img');
            if (!img) return false;
            // Check if the onerror handler or load check has hidden the slide or image
            if (slide.style.display === 'none' || img.style.display === 'none') {
                return false;
            }
            return true;
        });

        if (activeSlides.length === 0) return;

        // Reset active state for all slides
        slides.forEach(slide => slide.classList.remove('active'));

        // Reset index if out of bounds
        if (currentSlideIndex >= activeSlides.length) {
            currentSlideIndex = 0;
        }

        // Make the current slide active
        activeSlides[currentSlideIndex].classList.add('active');

        // Setup manual buttons
        const prevBtn = document.getElementById('prevSlide');
        const nextBtn = document.getElementById('nextSlide');

        if (prevBtn) {
            prevBtn.onclick = () => {
                showSlide(currentSlideIndex - 1);
                resetInterval();
            };
        }
        if (nextBtn) {
            nextBtn.onclick = () => {
                showSlide(currentSlideIndex + 1);
                resetInterval();
            };
        }

        startInterval();
    }

    function showSlide(index) {
        if (activeSlides.length === 0) return;

        // Deactivate current slide
        activeSlides[currentSlideIndex].classList.remove('active');

        // Calculate next slide index (wrap-around)
        currentSlideIndex = (index + activeSlides.length) % activeSlides.length;

        // Activate new slide
        activeSlides[currentSlideIndex].classList.add('active');
    }

    function startInterval() {
        if (slideshowInterval) clearInterval(slideshowInterval);
        slideshowInterval = setInterval(() => {
            showSlide(currentSlideIndex + 1);
        }, 4000);
    }

    function resetInterval() {
        startInterval();
    }

    // Hook into image load and error events to dynamically re-initialize the slideshow
    slides.forEach(slide => {
        const img = slide.querySelector('img');
        if (img) {
            img.addEventListener('load', initSlideshow);
            img.addEventListener('error', () => {
                img.style.display = 'none';
                slide.style.display = 'none';
                initSlideshow();
            });
            // If the image is already loaded/cached or failed
            if (img.complete) {
                if (img.naturalWidth === 0) {
                    img.style.display = 'none';
                    slide.style.display = 'none';
                }
            }
        }
    });

    // Initialize slideshow
    initSlideshow();
    window.addEventListener('load', initSlideshow);
    setTimeout(initSlideshow, 1000);

    // Initialize FIDS dynamic data
    initFIDSLists();
    // Run status updates simulation every 10 seconds
    setInterval(updateFIDSBoard, 10000);
});
