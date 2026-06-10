document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // 1. Dynamic visitor clock & passenger name sync
    const timeDisplayEl = document.getElementById('timeDisplay');
    const dateDisplayEl = document.getElementById('dateDisplay');
    const paxBadge = document.getElementById('paxBadge');

    function updateLiveClock() {
        const now = new Date();
        
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const timeStr = `${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
        
        const day = String(now.getDate()).padStart(2, '0');
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const monthName = months[now.getMonth()];
        const year = now.getFullYear();
        const dateStr = `${day} ${monthName} ${year}`;
        
        if (timeDisplayEl) timeDisplayEl.textContent = timeStr;
        if (dateDisplayEl) dateDisplayEl.textContent = dateStr;
    }

    updateLiveClock();
    setInterval(updateLiveClock, 1000);

    if (paxBadge) {
        const savedName = localStorage.getItem('paxName');
        if (savedName) {
            paxBadge.textContent = `Passenger: ${savedName}`;
        }
        
        paxBadge.addEventListener('click', () => {
            const newName = prompt('Welcome Aboard! Please enter passenger name or email:', savedName || '');
            if (newName !== null) {
                const trimmed = newName.trim();
                if (trimmed) {
                    localStorage.setItem('paxName', trimmed);
                    paxBadge.textContent = `Passenger: ${trimmed}`;
                } else {
                    localStorage.removeItem('paxName');
                    paxBadge.textContent = 'Passenger: Guest';
                }
            }
        });
    }

    // 2. Mobile drawer menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
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
    }

    // 3. Operational Aircraft Registry Data (38 Boeing 737 MAX planes)
    const fleetRegistry = [];
    const suffixes = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    
    // Generate 38 registrations matching Akasa Air format (VT-YA* and VT-YB*)
    for (let i = 0; i < 38; i++) {
        let reg = '';
        let type = 'Boeing 737 MAX 8';
        if (i < 22) {
            reg = `VT-YA${suffixes[i]}`;
        } else {
            reg = `VT-YB${suffixes[i - 22]}`;
            type = 'Boeing 737 MAX 8-200'; // high density variant
        }
        fleetRegistry.push({ reg, type, status: 'Active / Operational' });
    }

    // Populate Registry List HTML
    const registryListEl = document.getElementById('registryList');
    if (registryListEl) {
        registryListEl.innerHTML = fleetRegistry.map(plane => `
            <div class="registry-item-row">
                <div class="reg-code">
                    <i data-lucide="shield-check" class="reg-icon"></i>
                    <span>${plane.reg}</span>
                </div>
                <div class="reg-details">
                    <span class="reg-type">${plane.type}</span>
                    <span class="reg-status">ACTIVE</span>
                </div>
            </div>
        `).join('');
    }

    // 4. Flight Routes Data
    const flightsData = [
        { no: 'QP 1101', origin: 'Kochi (COK)', dest: 'Bengaluru (BLR)', type: 'Domestic', status: 'ACTIVE' },
        { no: 'QP 1102', origin: 'Bengaluru (BLR)', dest: 'Kochi (COK)', type: 'Domestic', status: 'ACTIVE' },
        { no: 'QP 1351', origin: 'Mumbai (BOM)', dest: 'Bengaluru (BLR)', type: 'Domestic', status: 'ACTIVE' },
        { no: 'QP 1352', origin: 'Bengaluru (BLR)', dest: 'Mumbai (BOM)', type: 'Domestic', status: 'ACTIVE' },
        { no: 'QP 1506', origin: 'Bengaluru (BLR)', dest: 'Delhi (DEL)', type: 'Domestic', status: 'ACTIVE' },
        { no: 'QP 1242', origin: 'Pune (PNQ)', dest: 'Bengaluru (BLR)', type: 'Domestic', status: 'ACTIVE' },
        { no: 'QP 1435', origin: 'Ahmedabad (AMD)', dest: 'Bengaluru (BLR)', type: 'Domestic', status: 'ACTIVE' },
        { no: 'QP 1734', origin: 'Bengaluru (BLR)', dest: 'Hyderabad (HYD)', type: 'Domestic', status: 'ACTIVE' },
        { no: 'QP 1801', origin: 'Mumbai (BOM)', dest: 'Doha (DOH)', type: 'International', status: 'ACTIVE' },
        { no: 'QP 1802', origin: 'Doha (DOH)', dest: 'Mumbai (BOM)', type: 'International', status: 'ACTIVE' },
        { no: 'QP 1805', origin: 'Bengaluru (BLR)', dest: 'Abu Dhabi (AUH)', type: 'International', status: 'ACTIVE' },
        { no: 'QP 1806', origin: 'Abu Dhabi (AUH)', dest: 'Bengaluru (BLR)', type: 'International', status: 'ACTIVE' },
        { no: 'QP 1811', origin: 'Mumbai (BOM)', dest: 'Jeddah (JED)', type: 'International', status: 'ACTIVE' },
        { no: 'QP 1812', origin: 'Jeddah (JED)', dest: 'Mumbai (BOM)', type: 'International', status: 'ACTIVE' },
        { no: 'QP 1815', origin: 'Mumbai (BOM)', dest: 'Riyadh (RUH)', type: 'International', status: 'ACTIVE' },
        { no: 'QP 1816', origin: 'Riyadh (RUH)', dest: 'Mumbai (BOM)', type: 'International', status: 'ACTIVE' },
        { no: 'QP 1821', origin: 'Mumbai (BOM)', dest: 'Hanoi (HAN)', type: 'International', status: 'SCHED SEP 26' },
        { no: 'QP 1822', origin: 'Hanoi (HAN)', dest: 'Mumbai (BOM)', type: 'International', status: 'SCHED SEP 26' }
    ];

    const flightsTableBody = document.getElementById('flightsTableBody');
    const searchInput = document.getElementById('flightSearchInput');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    let activeFilter = 'all';
    let searchQuery = '';

    function renderFlights() {
        if (!flightsTableBody) return;

        // Filter flights data based on search and category filter button
        const filtered = flightsData.filter(flight => {
            const matchesSearch = flight.no.toLowerCase().includes(searchQuery) ||
                                  flight.origin.toLowerCase().includes(searchQuery) ||
                                  flight.dest.toLowerCase().includes(searchQuery);
            
            let matchesFilter = true;
            if (activeFilter === 'domestic') {
                matchesFilter = flight.type === 'Domestic';
            } else if (activeFilter === 'international') {
                matchesFilter = flight.type === 'International';
            } else if (activeFilter === 'blr') {
                matchesFilter = flight.origin.includes('(BLR)') || flight.dest.includes('(BLR)');
            }

            return matchesSearch && matchesFilter;
        });

        if (filtered.length === 0) {
            flightsTableBody.innerHTML = `
                <div style="padding: 40px; text-align: center; color: #80808a; width: 100%; grid-column: 1 / -1;">
                    <i data-lucide="help-circle" style="width: 32px; height: 32px; margin-bottom: 10px;"></i>
                    <p>No operational flights found matching your criteria.</p>
                </div>
            `;
            lucide.createIcons();
            return;
        }

        // Generate rows
        flightsTableBody.innerHTML = filtered.map(f => {
            let statusBadgeClass = 'green';
            if (f.status.includes('SCHED')) statusBadgeClass = 'boarding'; // orange accent
            
            return `
                <div class="fids-row" style="background: rgba(255, 255, 255, 0.01); border-bottom: 1px solid rgba(255, 255, 255, 0.03);">
                    <span class="flight-no" style="font-weight: 800; color: #fff;">${f.no}</span>
                    <span class="station" style="color: var(--color-orange);">${f.origin}</span>
                    <span class="station" style="color: #fff; font-weight: 600;">${f.dest}</span>
                    <span class="gate" style="color: #a0a0ab;">${f.type}</span>
                    <span class="status ${statusBadgeClass}" style="font-size: 0.7rem; font-weight: 800; padding: 4px 10px; border-radius: 6px;">${f.status}</span>
                </div>
            `;
        }).join('');
    }

    // Event listeners for search input
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase().trim();
            renderFlights();
        });
    }

    // Event listeners for filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.getAttribute('data-filter');
            renderFlights();
        });
    });

    // Initial render
    renderFlights();
    lucide.createIcons();
});
