/**
 * BEL Management Portal - Main Application Script
 * Manages dashboard, Account Management, payouts, content, and support functionality
 */

'use strict';

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    /* ========================================================================
       GLOBAL APP STATE & DATA LOADER
       ======================================================================== */
    
    // Centralized data structure (will be loaded from JSON files)
    let APP_DATA = {};

    // Initialize DataLoader
    const dataLoader = new DataLoader();

    // Load all data and initialize application
    async function initializeApp() {
        try {
            // Show loading indicator
            console.log('Loading application data...');
            
            // Load all data from JSON files
            APP_DATA = await dataLoader.loadAllData();
            
            // Make data available globally
            window.appData = APP_DATA;
            window.APP_DATA = APP_DATA; // 確保全域可存取
            
            console.log('Data loaded successfully:', APP_DATA);
            console.log('belProfiles data:', APP_DATA.belProfiles);
            
            // 測試 belProfiles 資料可用性
            if (APP_DATA.belProfiles && APP_DATA.belProfiles.leaderboard) {
                console.log('✅ belProfiles.leaderboard loaded:', APP_DATA.belProfiles.leaderboard.length, 'entries');
            } else {
                console.log('❌ belProfiles.leaderboard not found');
            }
            
            // Initialize all components once data is loaded
            Navigation.init();
            Dashboard.init();
            AccountManagement.init();
            BELModal.init();
            ContentManager.init();
            
            // Initialize additional components that depend on data
            setTimeout(() => {
                TableUtils.initializeAllTables();
                initializeAllAvatars();
            }, 500);
            
            console.log('BEL Management Portal initialized successfully with external data');
            
        } catch (error) {
            console.error('Failed to initialize application:', error);
            // Use fallback data
            APP_DATA = dataLoader.getFallbackAppData();
            
            // Make fallback data available globally
            window.appData = APP_DATA;
            
            // Still initialize components with fallback data
            Navigation.init();
            Dashboard.init();
            AccountManagement.init();
            BELModal.init();
            ContentManager.init();
            
            setTimeout(() => {
                TableUtils.initializeAllTables();
                initializeAllAvatars();
            }, 500);
        }
    }

    // Start the application
    initializeApp();

    /* ========================================================================
       UI ELEMENTS CACHE
       ======================================================================== */
    const ui = {
        // Navigation
        sidebar: document.getElementById('bel-sidebar'),
        hamburgerBtn: document.getElementById('bel-hamburger-btn'),
        contentLinks: document.querySelectorAll('.bel-sidebar-nav-link'),
        contentSections: document.querySelectorAll('.content-section'),
        
        // Header
        notificationBell: document.getElementById('notification-bell'),
        notificationPanel: document.getElementById('notification-panel'),
        userProfile: document.querySelector('.bel-user-profile'),
        userProfilePanel: document.getElementById('user-profile-panel'),
        
        // Account Management
        regionSel: document.getElementById('f-region'),
        countrySel: document.getElementById('f-country'),
        rowsPerPage: document.getElementById('rows-per-page'),
        prevBtn: document.getElementById('prev-page'),
        nextBtn: document.getElementById('next-page'),
        rangeLabel: document.getElementById('range-label'),
        table: document.getElementById('bel-table'),
        thead: document.querySelector('#bel-table thead'),
        tbody: document.querySelector('#bel-table tbody'),
        thSelect: document.getElementById('th-select'),
        selectAllPage: document.getElementById('select-all-page'),
        selectedCount: document.getElementById('selected-count'),
        exportBtn: document.getElementById('export-csv'),
        
        // Modal
        modal: document.getElementById('bel-details-modal'),
        modalClose: document.querySelector('#bel-details-modal .close-button'),
        modalBelName: document.getElementById('modal-bel-name'),
        modalBelInfo: document.getElementById('modal-bel-info'),
        modalLevel: document.getElementById('level-adjustment'),
        notesHistory: document.querySelector('#bel-details-modal .notes-history'),
        modalNote: document.querySelector('#bel-details-modal .add-note-form textarea'),
        saveBtn: document.querySelector('#bel-details-modal .modal-actions .bel-btn.primary'),
        addNoteBtn: document.querySelector('#bel-details-modal .add-note-form .bel-btn.secondary'),
        // Additional note form elements
        addNoteTextarea: document.getElementById('add-note-textarea'),
        addNoteBtnNew: document.getElementById('add-note-btn')
    };

    /* ========================================================================
       APPLICATION STATE
       ======================================================================== */
    const appState = {
        page: 1, 
        rowsPerPage: 10, 
        selected: new Set(),
        filters: { keyword: '', referralId: '', level: '', region: '', country: '', start: '', end: '', activity: '' },
        sortDir: 'desc', 
        currentReferralId: null, 
        notes: {},
        bankingHistory: {},
        customerInsights: {},
        belSalesData: {},
        payoutPage: 1, 
        payoutRowsPerPage: 10,
        assetPage: 1, 
        assetRowsPerPage: 10,
        orderPagePayout: 1, 
        orderRowsPerPagePayout: 10,
        supportPage: 1, 
        supportRowsPerPage: 10,
        historyTicketsPage: 1,
        historyTicketsRowsPerPage: 10,
        annPage: 1, 
        annRowsPerPage: 10,
        // Account Management pagination state
        accountGridPage: 1,
        accountGridRowsPerPage: 12,
        accountListPage: 1,
        accountListRowsPerPage: 10
    };

    /* ========================================================================
       UTILITY FUNCTIONS
       ======================================================================== */
    const utils = {
        formatMoney: (amount, decimals = 0) => {
            return `$${amount.toLocaleString(undefined, { 
                minimumFractionDigits: decimals, 
                maximumFractionDigits: decimals 
            })}`;
        },
        
        formatCurrency: (amount, currency = 'USD') => {
            const currencyConfig = {
                'USD': { symbol: 'USD', decimals: 2, position: 'before' },
                'EUR': { symbol: 'EUR', decimals: 2, position: 'before' },
                'GBP': { symbol: 'GBP', decimals: 2, position: 'before' },
                'JPY': { symbol: 'JPY', decimals: 0, position: 'before' },
                'KRW': { symbol: 'KRW', decimals: 0, position: 'before' },
                'AUD': { symbol: 'AUD', decimals: 2, position: 'before' },
                'TWD': { symbol: 'TWD', decimals: 0, position: 'before' }
            };
            
            const config = currencyConfig[currency] || currencyConfig['USD'];
            const formattedAmount = amount.toLocaleString(undefined, {
                minimumFractionDigits: config.decimals,
                maximumFractionDigits: config.decimals
            });
            
            return config.position === 'before' 
                ? `${config.symbol} ${formattedAmount}`
                : `${formattedAmount} ${config.symbol}`;
        },

        // Region mapping function based on country
        getRegionFromCountry: (country) => {
            const regionMapping = {
                // AAU / NZ - 澳洲和紐西蘭
                'Australia': 'AAU / NZ',
                'New Zealand': 'AAU / NZ',
                
                // ASEAN - 東南亞國家協會
                'Brunei': 'ASEAN',
                'Cambodia': 'ASEAN',
                'Indonesia': 'ASEAN',
                'Malaysia': 'ASEAN',
                'Philippines': 'ASEAN',
                'Singapore': 'ASEAN',
                'Thailand': 'ASEAN',
                'Vietnam': 'ASEAN',
                'Myanmar': 'ASEAN',
                'Laos': 'ASEAN',
                
                // China - 中國
                'China': 'China',
                
                // Europe - 歐洲
                'Austria': 'Europe',
                'Belgium': 'Europe',
                'Bulgaria': 'Europe',
                'Croatia': 'Europe',
                'Cyprus': 'Europe',
                'Czech Republic': 'Europe',
                'Denmark': 'Europe',
                'Estonia': 'Europe',
                'Finland': 'Europe',
                'France': 'Europe',
                'Germany': 'Europe',
                'Greece': 'Europe',
                'Hungary': 'Europe',
                'Ireland': 'Europe',
                'Italy': 'Europe',
                'Latvia': 'Europe',
                'Lithuania': 'Europe',
                'Luxembourg': 'Europe',
                'Malta': 'Europe',
                'Netherlands': 'Europe',
                'Poland': 'Europe',
                'Portugal': 'Europe',
                'Romania': 'Europe',
                'Slovakia': 'Europe',
                'Slovenia': 'Europe',
                'Spain': 'Europe',
                'Sweden': 'Europe',
                'Norway': 'Europe',
                'Switzerland': 'Europe',
                'United Kingdom': 'Europe',
                'Iceland': 'Europe',
                
                // India - 印度
                'India': 'India',
                
                // Japan - 日本
                'Japan': 'Japan',
                
                // Korea - 韓國
                'South Korea': 'Korea',
                'Korea': 'Korea',
                
                // LATAM - 拉丁美洲
                'Argentina': 'LATAM',
                'Bolivia': 'LATAM',
                'Brazil': 'LATAM',
                'Chile': 'LATAM',
                'Colombia': 'LATAM',
                'Costa Rica': 'LATAM',
                'Cuba': 'LATAM',
                'Dominican Republic': 'LATAM',
                'Ecuador': 'LATAM',
                'El Salvador': 'LATAM',
                'Guatemala': 'LATAM',
                'Honduras': 'LATAM',
                'Mexico': 'LATAM',
                'Nicaragua': 'LATAM',
                'Panama': 'LATAM',
                'Paraguay': 'LATAM',
                'Peru': 'LATAM',
                'Uruguay': 'LATAM',
                'Venezuela': 'LATAM',
                
                // ME&A - 中東和非洲
                'Algeria': 'ME&A',
                'Angola': 'ME&A',
                'Egypt': 'ME&A',
                'Ethiopia': 'ME&A',
                'Ghana': 'ME&A',
                'Kenya': 'ME&A',
                'Morocco': 'ME&A',
                'Nigeria': 'ME&A',
                'South Africa': 'ME&A',
                'Tunisia': 'ME&A',
                'Uganda': 'ME&A',
                'Zimbabwe': 'ME&A',
                'Israel': 'ME&A',
                'Jordan': 'ME&A',
                'Lebanon': 'ME&A',
                'Qatar': 'ME&A',
                'Saudi Arabia': 'ME&A',
                'UAE': 'ME&A',
                'Turkey': 'ME&A',
                'Iran': 'ME&A',
                'Iraq': 'ME&A',
                'Kuwait': 'ME&A',
                'Oman': 'ME&A',
                'Bahrain': 'ME&A',
                
                // North America - 北美洲
                'United States': 'North America',
                'Canada': 'North America',
                
                // Taiwan - 台灣
                'Taiwan': 'Taiwan',
                
                // Russia & CIS - 俄羅斯與獨立國協
                'Russia': 'Russia & CIS',
                'Belarus': 'Russia & CIS',
                'Kazakhstan': 'Russia & CIS',
                'Kyrgyzstan': 'Russia & CIS',
                'Tajikistan': 'Russia & CIS',
                'Turkmenistan': 'Russia & CIS',
                'Uzbekistan': 'Russia & CIS',
                'Armenia': 'Russia & CIS',
                'Azerbaijan': 'Russia & CIS',
                'Georgia': 'Russia & CIS',
                'Moldova': 'Russia & CIS',
                'Ukraine': 'Russia & CIS'
            };
            
            return regionMapping[country] || 'Others';
        },
        
        formatPercent: (decimal) => `${(decimal * 100).toFixed(2)}%`,
        
        parseDate: (dateString) => dateString ? new Date(dateString + 'T00:00:00') : null,
        
        debounce: (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        // Avatar generation utility
        generateAvatar: (name, userId = '') => {
            // Limited design system colors for avatars
            const avatarColors = [
                '#F39800', // Primary orange
                '#e57b03', // Primary dark
                '#004280', // Brand blue
                '#003160', // Brand dark
                '#336899', // Brand light 75
                '#e8ecef', // Gray 40
                '#cfd2d5', // Gray 50
                '#b6bfc1', // Gray 60
                '#737b7d'  // Gray 70
            ];

            // Get initials from name
            const getInitials = (fullName) => {
                if (!fullName) return 'U';
                const names = fullName.trim().split(' ');
                if (names.length === 1) {
                    return names[0].substring(0, 2).toUpperCase();
                }
                return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
            };

            // Generate consistent color based on name or ID
            const getColorIndex = (str) => {
                let hash = 0;
                for (let i = 0; i < str.length; i++) {
                    const char = str.charCodeAt(i);
                    hash = ((hash << 5) - hash) + char;
                    hash = hash & hash; // Convert to 32-bit integer
                }
                return Math.abs(hash) % avatarColors.length;
            };

            const initials = getInitials(name);
            const colorIndex = getColorIndex(userId || name);
            const backgroundColor = avatarColors[colorIndex];
            
            // Determine text color based on background (lighter colors get dark text)
            const isLightColor = ['#e8ecef', '#cfd2d5', '#b6bfc1'].includes(backgroundColor);
            const textColor = isLightColor ? '#434447' : 'white'; // Gray 80 for light backgrounds

            // Create avatar element
            const avatar = document.createElement('div');
            avatar.className = 'generated-avatar';
            avatar.textContent = initials;
            avatar.style.cssText = `
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background-color: ${backgroundColor};
                color: ${textColor};
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 600;
                font-size: 14px;
                border: 3px solid var(--ds-color-link);
                box-sizing: border-box;
            `;

            return avatar;
        },

        // Create avatar HTML string
        generateAvatarHTML: (name, userId = '', size = 40) => {
            const avatarColors = [
                '#F39800', '#e57b03', '#004280', '#003160', '#336899',
                '#e8ecef', '#cfd2d5', '#b6bfc1', '#737b7d'
            ];

            const getInitials = (fullName) => {
                if (!fullName) return 'U';
                const names = fullName.trim().split(' ');
                if (names.length === 1) {
                    return names[0].substring(0, 2).toUpperCase();
                }
                return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
            };

            const getColorIndex = (str) => {
                let hash = 0;
                for (let i = 0; i < str.length; i++) {
                    const char = str.charCodeAt(i);
                    hash = ((hash << 5) - hash) + char;
                    hash = hash & hash;
                }
                return Math.abs(hash) % avatarColors.length;
            };

            const initials = getInitials(name);
            const colorIndex = getColorIndex(userId || name);
            const backgroundColor = avatarColors[colorIndex];
            
            // Determine text color based on background
            const isLightColor = ['#e8ecef', '#cfd2d5', '#b6bfc1'].includes(backgroundColor);
            const textColor = isLightColor ? '#434447' : 'white';

            return `<div class="generated-avatar" style="
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background-color: ${backgroundColor};
                color: ${textColor};
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-weight: 600;
                font-size: ${Math.round(size * 0.35)}px;
                border: 1px solid var(--ds-color-link);
                box-sizing: border-box;
            ">${initials}</div>`;
        },

        // Create avatar HTML string without border (for Account Management)
        generateAvatarHTMLNoBorder: (name, userId = '', size = 40) => {
            const avatarColors = [
                '#F39800', '#e57b03', '#004280', '#003160', '#336899',
                '#e8ecef', '#cfd2d5', '#b6bfc1', '#737b7d'
            ];

            const getInitials = (fullName) => {
                if (!fullName) return 'U';
                const names = fullName.trim().split(' ');
                if (names.length === 1) {
                    return names[0].substring(0, 2).toUpperCase();
                }
                return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
            };

            const getColorIndex = (str) => {
                let hash = 0;
                for (let i = 0; i < str.length; i++) {
                    const char = str.charCodeAt(i);
                    hash = ((hash << 5) - hash) + char;
                    hash = hash & hash;
                }
                return Math.abs(hash) % avatarColors.length;
            };

            const initials = getInitials(name);
            const colorIndex = getColorIndex(userId || name);
            const backgroundColor = avatarColors[colorIndex];
            
            // Determine text color based on background
            const isLightColor = ['#e8ecef', '#cfd2d5', '#b6bfc1'].includes(backgroundColor);
            const textColor = isLightColor ? '#434447' : 'white';

            return `<div class="generated-avatar" style="
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background-color: ${backgroundColor};
                color: ${textColor};
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-weight: 600;
                font-size: ${Math.round(size * 0.35)}px;
                box-sizing: border-box;
            ">${initials}</div>`;
        },

        // Create placeholder avatar for Account Management
        generateAvatarHTMLPlaceholder: (userId = '', size = 40) => {
            // Generate consistent random seed based on userId
            const getRandomSeed = (str) => {
                if (!str) str = Math.random().toString();
                let hash = 0;
                for (let i = 0; i < str.length; i++) {
                    const char = str.charCodeAt(i);
                    hash = ((hash << 5) - hash) + char;
                    hash = hash & hash;
                }
                return Math.abs(hash);
            };

            const seed = getRandomSeed(userId);
            
            // Use external image service for consistent placeholder images
            const photoId = (seed % 1000) + 1; // Use IDs 1-1000
            const photoUrl = `https://picsum.photos/seed/${photoId}/${size}/${size}`;
            
            return `<div class="real-photo-avatar" style="
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background-image: url('${photoUrl}');
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                box-sizing: border-box;
                flex-shrink: 0;
                border: 2px solid #f3f4f6;
            "></div>`;
        }
    };

    /* ========================================================================
       NAVIGATION & HEADER MANAGEMENT
       ======================================================================== */
    const Navigation = {
        init() {
            this.initializeHeader();
            this.setupEventListeners();
            this.initializeRouting();
        },

        initializeHeader() {
            const headerLogo = document.querySelector('.bel-sidebar-logo img');
            const headerTitle = document.querySelector('.bel-sidebar-logo span');
            const userAvatarContainer = document.querySelector('.bel-user-profile');
            const notificationList = document.querySelector('.bel-notification-list');
            
            if (headerLogo) headerLogo.src = APP_DATA.header.logo;
            if (headerTitle) headerTitle.textContent = APP_DATA.header.portalTitle;
            
            // Replace user avatar with generated avatar
            if (userAvatarContainer) {
                const existingImg = userAvatarContainer.querySelector('img');
                if (existingImg) {
                    const generatedAvatar = utils.generateAvatar(APP_DATA.userProfile.name, APP_DATA.userProfile.email);
                    existingImg.parentNode.replaceChild(generatedAvatar, existingImg);
                }
            }
            
            if (notificationList) {
                notificationList.innerHTML = APP_DATA.header.notifications.map(n => `
                    <li class="bel-notification-item">
                        <div class="title"><span class="tag ${n.type}">${n.tagText}</span>${n.title}</div>
                        ${n.details ? `<div class="details" style="font-size: 0.85em; color: #666; margin-top: 4px;">${n.details}</div>` : ''}
                        <div class="date">${n.date}</div>
                    </li>
                `).join('');
            }
        },

        setupEventListeners() {
            // Hamburger menu toggle
            ui.hamburgerBtn?.addEventListener('click', () => {
                ui.sidebar?.classList.toggle('open');
            });

            // Navigation links
            ui.contentLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href').substring(1);
                    this.showContent(targetId);
                    ui.contentLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                    if (window.innerWidth <= 768) ui.sidebar?.classList.remove('open');
                });
            });

            // Notification panel
            ui.notificationBell?.addEventListener('click', (e) => {
                e.stopPropagation();
                ui.notificationPanel?.classList.toggle('show');
            });

            // User profile panel
            ui.userProfile?.addEventListener('click', (e) => {
                e.stopPropagation();
                ui.notificationPanel?.classList.remove('show');
                ui.userProfilePanel?.classList.toggle('show');
            });

            // Close panels when clicking outside
            window.addEventListener('click', (e) => {
                if (ui.notificationPanel && !ui.notificationPanel.contains(e.target) && !ui.notificationBell?.contains(e.target)) {
                    ui.notificationPanel.classList.remove('show');
                }
                if (ui.userProfilePanel && !ui.userProfilePanel.contains(e.target) && !ui.userProfile?.contains(e.target)) {
                    ui.userProfilePanel.classList.remove('show');
                }
            });
        },

        showContent(targetId) {
            ui.contentSections.forEach(s => s.classList.remove('active'));
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.classList.add('active');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                
                // 如果切換到Account Management頁面，渲染帳戶卡片和設置過濾器
                if (targetId === 'Account-Management') {
                    ContentManager.renderAccountCards();
                    ContentManager.setupAccountFilters();
                }
            }
        },

        initializeRouting() {
            const initialSectionFromHash = window.location.hash.substring(1);
            const initialActiveInDom = document.querySelector('.content-section.active')?.id;
            const initialSection = initialSectionFromHash || initialActiveInDom || 'dashboard';
            
            ui.contentLinks.forEach(l => l.classList.remove('active'));
            const initialLink = document.querySelector(`.bel-sidebar-nav-link[href="#${initialSection}"]`) ||
                               document.querySelector('.bel-sidebar-nav-link[href="#dashboard"]');
            initialLink?.classList.add('active');
            this.showContent(initialSection);
        }
    };

    /* ========================================================================
       DASHBOARD RENDERING
       ======================================================================== */
    const Dashboard = {
        init() {
            this.renderSummaryStats();
            this.renderPerformanceTable();
            this.renderTopProducts();
            this.initializeCharts();
            this.setupViewSwitcher();
        },

        /**
         * Calculate real-time summary statistics from BEL profiles data
         * @param {string} year - Year to calculate (defaults to 2025)
         * @returns {Object} Calculated summary statistics
         */
        calculateSummaryStats(year = '2025') {
            if (!APP_DATA.belProfiles?.leaderboard) {
                return {
                    belCount: 0,
                    totalClicks: 0,
                    totalOrders: 0,
                    totalRevenue: 0,
                    avgConvRate: 0,
                    avgAov: 0
                };
            }

            const leaderboard = APP_DATA.belProfiles.leaderboard;
            
            // Calculate totals
            let totalClicks = 0;
            let totalOrders = 0;
            let totalRevenue = 0;
            let totalConvRateSum = 0;
            let totalAovSum = 0;
            let validCvrCount = 0;
            let validAovCount = 0;

            leaderboard.forEach(leader => {
                let userClicks = 0;
                let userOrders = 0;
                let userRevenue = 0;
                
                // Process yearly data
                if (leader.monthlyData && leader.monthlyData[year]) {
                    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                    
                    // For 2025, only sum up to August (since it's September 8, 2025)
                    let monthsToSum = monthNames;
                    if (year === '2025') {
                        monthsToSum = monthNames.slice(0, 8); // January to August
                    }
                    
                    monthsToSum.forEach(monthName => {
                        const monthData = leader.monthlyData[year][monthName];
                        if (monthData) {
                            userClicks += monthData.clicks || 0;
                            userOrders += monthData.orders || 0;
                            userRevenue += monthData.revenue || 0;
                        }
                    });
                }
                
                totalClicks += userClicks;
                totalOrders += userOrders;
                totalRevenue += userRevenue;
                
                // Calculate user's CVR dynamically (orders / clicks * 100)
                if (userClicks > 0) {
                    const userCvr = (userOrders / userClicks) * 100;
                    totalConvRateSum += userCvr;
                    validCvrCount += 1;
                }
                
                // Calculate user's AOV
                if (userOrders > 0) {
                    const userAov = userRevenue / userOrders;
                    totalAovSum += userAov;
                    validAovCount += 1;
                }
            });

            // Calculate final metrics
            const avgConvRate = validCvrCount > 0 ? totalConvRateSum / validCvrCount : 0;
            const avgAov = validAovCount > 0 ? totalAovSum / validAovCount : 0;

            return {
                belCount: leaderboard.length,
                totalClicks,
                totalOrders,
                totalRevenue,
                avgConvRate,
                avgAov
            };
        },

        /**
         * Format numbers for display (>99999 shows as K)
         */
        formatDisplayValue(num, prefix = '', suffix = '') {
            if (num >= 100000) {
                return prefix + Math.round(num / 1000) + 'k' + suffix;
            } else if (num >= 10000) {
                return prefix + (num / 1000).toFixed(1) + 'k' + suffix;
            } else {
                return prefix + num.toLocaleString() + suffix;
            }
        },

        renderSummaryStats() {
            const statsContainer = document.querySelector('.bel-stats-cards');
            if (!statsContainer) return;
            
            // Calculate real-time statistics from BEL profiles
            const realTimeStats = this.calculateSummaryStats();
            
            // Format values for display
            const belCountValue = realTimeStats.belCount.toString();
            const totalClicksValue = this.formatDisplayValue(realTimeStats.totalClicks);
            const totalOrdersValue = realTimeStats.totalOrders < 100000 ? realTimeStats.totalOrders.toString() : this.formatDisplayValue(realTimeStats.totalOrders);
            const revenueValue = this.formatDisplayValue(realTimeStats.totalRevenue, '$');
            const convRateValue = realTimeStats.avgConvRate.toFixed(2) + '%';
            const aovValue = realTimeStats.avgAov >= 100000 ? this.formatDisplayValue(realTimeStats.avgAov, '$') : '$' + realTimeStats.avgAov.toFixed(1);
            
            // Use configuration data for static properties (trends, icons, etc.)
            const config = APP_DATA.dashboard.summaryStatsConfig;
            
            const stats = {
                belCount: {
                    title: config.belCount.title,
                    value: belCountValue,
                    icon: config.belCount.icon,
                    trend: config.belCount.trend,
                    trendText: config.belCount.trendText,
                    status: config.belCount.status
                },
                totalClicks: {
                    title: config.totalClicks.title,
                    value: totalClicksValue,
                    icon: config.totalClicks.icon,
                    trend: config.totalClicks.trend,
                    trendText: config.totalClicks.trendText,
                    status: config.totalClicks.status
                },
                totalOrders: {
                    title: config.totalOrders.title,
                    value: totalOrdersValue,
                    icon: config.totalOrders.icon,
                    trend: config.totalOrders.trend,
                    trendText: config.totalOrders.trendText,
                    status: config.totalOrders.status
                },
                revenue: {
                    title: config.revenue.title,
                    value: revenueValue,
                    icon: config.revenue.icon,
                    trend: config.revenue.trend,
                    trendText: config.revenue.trendText,
                    status: config.revenue.status
                },
                convRate: {
                    title: config.convRate.title,
                    value: convRateValue,
                    icon: config.convRate.icon,
                    trend: config.convRate.trend,
                    trendText: config.convRate.trendText,
                    status: config.convRate.status
                },
                aov: {
                    title: config.aov.title,
                    value: aovValue,
                    icon: config.aov.icon,
                    trend: config.aov.trend,
                    trendText: config.aov.trendText,
                    status: config.aov.status
                }
            };
            
            statsContainer.innerHTML = Object.values(stats).map(stat => `
                <div class="bel-card">
                    <div style="width: 100%;display: flex; flex-direction: row; justify-content: space-between;">
                        <div>
                            <div class="bel-card-title">${stat.title}</div>
                            <div class="bel-card-value">${stat.value}</div>
                        </div>
                        <div class="bel-card-icon"><i class="${stat.icon}"></i></div>
                    </div>
                    <div class="trend-indicator ${stat.status}">
                        <i class="fas fa-caret-${stat.status === 'positive' ? 'up' : 'down'}"></i> 
                        ${stat.trend} 
                        <span class="trend-indicator-text">${stat.trendText}</span>
                    </div>
                </div>
            `).join('');
        },

        /**
         * Calculate performance data by level using yearly cumulative data from monthly data
         * @param {string} year - Year to calculate (defaults to 2025)
         * @returns {Array} Performance details by level
         */
        calculatePerformanceByLevel(year = '2025') {
            if (!APP_DATA.belProfiles?.leaderboard) return [];
            
            const levelStats = {
                'Builder': { clicks: 0, orders: 0, revenue: 0, count: 0 },
                'Enabler': { clicks: 0, orders: 0, revenue: 0, count: 0 },
                'Exploder': { clicks: 0, orders: 0, revenue: 0, count: 0 },
                'Leader': { clicks: 0, orders: 0, revenue: 0, count: 0 }
            };
            
            // Aggregate data for each level
            APP_DATA.belProfiles.leaderboard.forEach(leader => {
                const level = leader.level;
                if (!levelStats[level]) return;
                
                // Calculate yearly cumulative data
                const yearlyData = AccountManagement.calculateYearlyData(leader, year);
                
                levelStats[level].clicks += yearlyData.clicks;
                levelStats[level].orders += yearlyData.orders;
                levelStats[level].revenue += yearlyData.revenue;
                levelStats[level].count += 1;
            });
            
            // Convert to performance details format
            return Object.entries(levelStats).map(([level, stats]) => {
                const convRate = stats.clicks > 0 ? (stats.orders / stats.clicks) * 100 : 0;
                const aov = stats.orders > 0 ? stats.revenue / stats.orders : 0;
                
                return {
                    level: level,
                    clicks: stats.clicks,
                    revenue: stats.revenue,
                    orders: stats.orders,
                    convRate: convRate,
                    aov: aov,
                    // Formatted values for display
                    clicksFormatted: stats.clicks.toLocaleString(),
                    revenueFormatted: utils.formatMoney(stats.revenue),
                    ordersFormatted: stats.orders.toLocaleString(),
                    convRateFormatted: `${convRate.toFixed(2)}%`,
                    aovFormatted: utils.formatMoney(aov, 2)
                };
            });
        },

        renderPerformanceTable() {
            const tableBody = document.querySelector('#performance-table-view tbody');
            if (!tableBody) return;
            
            // Use dynamic calculation instead of static data
            const performanceDetails = this.calculatePerformanceByLevel();
            
            tableBody.innerHTML = performanceDetails.map(detail => `
                <tr>
                    <td><span class="bel-badge ${detail.level.toLowerCase()}">${detail.level}</span></td>
                    <td data-sort-value="${detail.clicks}">${detail.clicksFormatted}</td>
                    <td data-sort-value="${detail.revenue}">${detail.revenueFormatted}</td>
                    <td data-sort-value="${detail.orders}">${detail.ordersFormatted}</td>
                    <td data-sort-value="${detail.convRate}">${detail.convRateFormatted}</td>
                    <td data-sort-value="${detail.aov}">${detail.aovFormatted}</td>
                </tr>
            `).join('');

            // Apply sorting to the performance table
            const performanceTable = document.querySelector('#performance-table-view table');
            if (performanceTable) {
                TableUtils.makeTableSortable(performanceTable);
            }
        },

        renderTopProducts() {
            const tableBody = document.querySelector('.product-sales-grid .scrollable-table-container tbody');
            if (!tableBody) return;
            
            tableBody.innerHTML = APP_DATA.dashboard.productAnalysis.topProducts.map(product => `
                <tr>
                    <td>${product.rank}</td>
                    <td>${product.product}</td>
                    <td>${product.price}</td>
                    <td>${product.units}</td>
                    <td>${product.total}</td>
                </tr>
            `).join('');

            // Apply sorting to the top products table
            const topProductsTable = document.querySelector('.product-sales-grid .scrollable-table-container table');
            if (topProductsTable) {
                TableUtils.makeTableSortable(topProductsTable);
            }
        },

        initializeCharts() {
            this.initializePieChart();
            this.initializeProductCategoryChart();
            this.initializePerformanceChart();
        },

        initializePieChart() {
            const pieCtx = document.getElementById('level-pie-chart');
            if (pieCtx && window.Chart) {
                // Calculate real-time level distribution from BEL profiles
                const levelCounts = this.calculateLevelDistribution();
                
                new Chart(pieCtx, {
                    type: 'doughnut',
                    data: {
                        labels: levelCounts.labels,
                        datasets: [{
                            label: 'BEL Count (#)',
                            data: levelCounts.data,
                            backgroundColor: levelCounts.colors,
                            borderColor: '#ffffff',
                            borderWidth: 2
                        }]
                    },
                    options: { 
                        responsive: true, 
                        maintainAspectRatio: false, 
                        plugins: { 
                            legend: { 
                                position: 'bottom', 
                                labels: { 
                                    padding: 20, 
                                    boxWidth: 12 
                                } 
                            } 
                        } 
                    }
                });
            }
        },

        /**
         * Calculate real-time level distribution from BEL profiles data
         * @returns {Object} Level distribution with labels, data, and colors
         */
        calculateLevelDistribution() {
            if (!APP_DATA.belProfiles?.leaderboard) {
                return {
                    labels: ["Builder", "Enabler", "Exploder", "Leader"],
                    data: [0, 0, 0, 0],
                    colors: ["#006EFF", "#00893a", "#f39800", "#db3a3a"]
                };
            }

            const levelCount = {
                'Builder': 0,
                'Enabler': 0,
                'Exploder': 0,
                'Leader': 0
            };

            // Count actual levels from BEL profiles
            APP_DATA.belProfiles.leaderboard.forEach(leader => {
                if (levelCount.hasOwnProperty(leader.level)) {
                    levelCount[leader.level]++;
                }
            });

            return {
                labels: ["Builder", "Enabler", "Exploder", "Leader"],
                data: [
                    levelCount.Builder,
                    levelCount.Enabler,
                    levelCount.Exploder,
                    levelCount.Leader
                ],
                colors: ["#006EFF", "#00893a", "#f39800", "#db3a3a"]
            };
        },

        initializeProductCategoryChart() {
            const productCategoryCanvas = document.getElementById('product-category-chart');
            if (productCategoryCanvas && window.Chart) {
                const categoryData = APP_DATA.dashboard.productAnalysis.categoryData;
                const allProducts = new Set();
                Object.values(categoryData).forEach(products => {
                    products.forEach(p => allProducts.add(p.product));
                });
                const productList = Array.from(allProducts);
                const blueShades = ['#003160', '#004280', '#336899', '#80a0bf', '#dfebf7'];
                
                const datasets = productList.map((product, index) => {
                    const data = Object.keys(categoryData).map(category => {
                        const productInCategory = categoryData[category].find(p => p.product === product);
                        return productInCategory ? productInCategory.units : 0;
                    });
                    return {
                        label: product,
                        data: data,
                        backgroundColor: blueShades[index % blueShades.length],
                        borderColor: blueShades[index % blueShades.length],
                        borderWidth: 1
                    };
                });

                new Chart(productCategoryCanvas, {
                    type: 'bar',
                    data: {
                        labels: Object.keys(categoryData),
                        datasets: datasets
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        indexAxis: 'y',
                        plugins: {
                            legend: {
                                display: true,
                                position: 'bottom',
                                labels: {
                                    boxWidth: 12,
                                    padding: 8,
                                    font: { size: 11 }
                                }
                            },
                            tooltip: {
                                callbacks: {
                                    title: (tooltipItems) => tooltipItems[0].label,
                                    label: (context) => `${context.dataset.label}: ${context.parsed.x} units`,
                                    afterBody: (tooltipItems) => {
                                        const categoryIndex = tooltipItems[0].dataIndex;
                                        const category = Object.keys(categoryData)[categoryIndex];
                                        const products = categoryData[category];
                                        const total = products.reduce((sum, p) => sum + p.units, 0);
                                        return `Total: ${total} units`;
                                    }
                                }
                            }
                        },
                        scales: {
                            x: {
                                stacked: true,
                                beginAtZero: true,
                                title: { display: true, text: 'Units Sold' }
                            },
                            y: {
                                stacked: true,
                                title: { display: true, text: 'Product Categories' }
                            }
                        }
                    }
                });
            }
        },

        initializePerformanceChart() {
            const performanceCtx = document.getElementById('performance-percentage-chart');
            if (performanceCtx && window.Chart) {
                // Use dynamic calculation instead of static data
                const performanceData = this.calculatePerformanceByLevel();
                
                // Get CSS variables for colors
                const rootStyle = getComputedStyle(document.documentElement);
                const colors = {
                    blue100: rootStyle.getPropertyValue('--ds-color-brand-dark').trim() || '#003160',
                    blue75: rootStyle.getPropertyValue('--ds-color-brand-light-75').trim() || '#336899',
                    blue30: rootStyle.getPropertyValue('--ds-color-brand-light-30').trim() || '#DFEBF7',
                    orange100: rootStyle.getPropertyValue('--ds-color-primary').trim() || '#F39800'
                };
                
                // Prepare data for the chart
                const labels = performanceData.map(d => d.level);
                const revenueData = performanceData.map(d => 
                    typeof d.revenue === 'string' ? parseFloat(d.revenue.replace(/[$,]/g, '')) : d.revenue
                );
                const clicksData = performanceData.map(d => 
                    typeof d.clicks === 'string' ? parseFloat(d.clicks.replace(/[,]/g, '')) : d.clicks
                );
                const ordersData = performanceData.map(d => d.orders);
                const convRateData = performanceData.map(d => 
                    typeof d.convRate === 'string' ? parseFloat(d.convRate.replace('%', '')) : d.convRate
                );

                new Chart(performanceCtx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                label: 'Revenue ($000s)',
                                data: revenueData.map(val => val / 1000), // Convert to thousands
                                backgroundColor: colors.blue100,
                                borderColor: colors.blue100,
                                borderWidth: 1,
                                yAxisID: 'y',
                                order: 3
                            },
                            {
                                label: 'Clicks (00s)',
                                data: clicksData.map(val => val / 100), // Convert to thousands
                                backgroundColor: colors.blue75,
                                borderColor: colors.blue75,
                                borderWidth: 1,
                                yAxisID: 'y',
                                order: 2
                            },
                            {
                                label: 'Orders',
                                data: ordersData,
                                backgroundColor: colors.blue30,
                                borderColor: colors.blue30,
                                borderWidth: 1,
                                yAxisID: 'y1',
                                order: 1
                            },
                            {
                                label: 'C2O CVR (%)',
                                data: convRateData,
                                backgroundColor: colors.orange100,
                                borderColor: colors.orange100,
                                borderWidth: 3,
                                type: 'line',
                                fill: false,
                                tension: 0.1,
                                yAxisID: 'y2',
                                order: 0,
                                pointRadius: 4,
                                pointHoverRadius: 6,
                                pointBackgroundColor: colors.orange100,
                                pointBorderColor: '#ffffff',
                                pointBorderWidth: 1
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        interaction: {
                            mode: 'index',
                            intersect: false
                        },
                        plugins: {
                            legend: {
                                position: 'top',
                                labels: {
                                    boxWidth: 12,
                                    padding: 15,
                                    font: { size: 11 }
                                }
                            },
                            tooltip: {
                                callbacks: {
                                    title: (tooltipItems) => `${tooltipItems[0].label} Level`,
                                    label: (context) => {
                                        let label = context.dataset.label || '';
                                        if (label) {
                                            label += ': ';
                                        }
                                        if (label.includes('Revenue')) {
                                            label += `$${(context.parsed.y * 1000).toLocaleString()}`;
                                        } else if (label.includes('Clicks')) {
                                            label += `${(context.parsed.y * 1000).toLocaleString()}`;
                                        } else if (label.includes('C2O CVR (%)')) {
                                            label += `${context.parsed.y}%`;
                                        } else {
                                            label += context.parsed.y;
                                        }
                                        return label;
                                    }
                                }
                            }
                        },
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'BEL Levels'
                                }
                            },
                            y: {
                                type: 'linear',
                                display: true,
                                position: 'left',
                                title: {
                                    display: true,
                                    text: 'Revenue ($000s) / Clicks (00s)'
                                },
                                beginAtZero: true,
                                ticks: {
                                    stepSize: 30,  
                                    callback: function(value) {
                                        return value; 
                                    }
                                },
                                max: 700  
                            },
                            y1: {
                                type: 'linear',
                                display: true,
                                position: 'right',
                                title: {
                                    display: true,
                                    text: 'Orders'
                                },
                                beginAtZero: true,
                                grid: {
                                    drawOnChartArea: false
                                }
                            },
                            y2: {
                                type: 'linear',
                                display: false,
                                position: 'right',
                                beginAtZero: true,
                                max: Math.max(...convRateData) * 1.2
                            }
                        }
                    }
                });
            }
        },

        setupViewSwitcher() {
            const viewSwitcher = document.getElementById('payout-view-switcher');
            if (!viewSwitcher) return;

            const viewButtons = viewSwitcher.querySelectorAll('.view-btn');
            const tableView = document.getElementById('performance-table-view');
            const chartView = document.getElementById('performance-chart-view');

            viewButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const viewType = btn.dataset.view;
                    
                    // Update active button
                    viewButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    // Show/hide content
                    if (viewType === 'table') {
                        tableView?.style.setProperty('display', 'block');
                        chartView?.style.setProperty('display', 'none');
                    } else {
                        tableView?.style.setProperty('display', 'none');
                        chartView?.style.setProperty('display', 'block');
                        
                        // Initialize performance chart if not already done
                        setTimeout(() => {
                            if (chartView?.style.display !== 'none') {
                                this.initializePerformanceChart();
                            }
                        }, 100);
                    }
                });
            });

            // Initialize chart view by default
            setTimeout(() => {
                this.initializePerformanceChart();
            }, 100);
        }
    };

    /* ========================================================================
       Account Management MANAGEMENT
       ======================================================================== */
    const AccountManagement = {
        belData: [],

        init() {
            this.generateBelData();
            this.setupEventListeners();
            this.populateFilters();
            this.renderTable();
        },

        /**
         * Calculate cumulative yearly data from monthly data
         * @param {Object} record - BEL record with monthlyData
         * @param {string} year - Year to calculate (defaults to 2025)
         * @returns {Object} Cumulative data { clicks, orders, revenue }
         */
        calculateYearlyData(record, year = '2025') {
            let cumulativeClicks = 0;
            let cumulativeOrders = 0;
            let cumulativeRevenue = 0;
            
            if (record.monthlyData && record.monthlyData[year]) {
                const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                
                // For 2025, only sum up to August (since it's September 8, 2025)
                // For other years, sum the full year
                let monthsToSum = monthNames;
                if (year === '2025') {
                    monthsToSum = monthNames.slice(0, 8); // January to August
                }
                
                monthsToSum.forEach(monthName => {
                    const monthData = record.monthlyData[year][monthName];
                    if (monthData) {
                        cumulativeClicks += monthData.clicks || 0;
                        cumulativeOrders += monthData.orders || 0;
                        cumulativeRevenue += monthData.revenue || 0;
                    }
                });
            } else {
                // If no monthly data available, return empty values
                cumulativeClicks = 0;
                cumulativeOrders = 0;
                cumulativeRevenue = 0;
            }
            
            return {
                clicks: cumulativeClicks,
                orders: cumulativeOrders,
                revenue: cumulativeRevenue
            };
        },

        generateBelData() {
            // 根據 Referral ID 的前兩碼確定國碼
            const getCountryCode = (id) => {
                const prefix = id.substring(1, 3); // 取 K 後面的兩位
                const countryMap = {
                    'TW': 'TW', 'US': 'US', 'DE': 'DE', 'FR': 'FR', 'JP': 'JP',
                    'AU': 'AU', 'KR': 'KR', 'IT': 'IT', 'MX': 'MX', 'CN': 'CN',
                    'CA': 'CA', 'IN': 'IN', 'NO': 'NO', 'NL': 'NL', 'BR': 'BR',
                    'SE': 'SE', 'CH': 'CH', 'DA': 'DK', 'PL': 'PL', 'BE': 'BE',
                    'SG': 'SG', 'TH': 'TH', 'MY': 'MY', 'ZA': 'ZA'
                };
                return countryMap[prefix] || 'US';
            };

            // 將國碼轉換為國家名稱
            const getCountryName = (countryCode) => {
                const countryNames = {
                    'TW': 'Taiwan', 'US': 'United States', 'DE': 'Germany', 'FR': 'France', 'JP': 'Japan',
                    'AU': 'Australia', 'KR': 'South Korea', 'IT': 'Italy', 'MX': 'Mexico', 'CN': 'China',
                    'CA': 'Canada', 'IN': 'India', 'NO': 'Norway', 'NL': 'Netherlands', 'BR': 'Brazil',
                    'SE': 'Sweden', 'CH': 'Switzerland', 'DK': 'Denmark', 'PL': 'Poland', 'BE': 'Belgium',
                    'SG': 'Singapore', 'TH': 'Thailand', 'MY': 'Malaysia', 'ZA': 'South Africa'
                };
                return countryNames[countryCode] || 'United States';
            };

            this.belData = APP_DATA.belProfiles.leaderboard.map(leader => {
                // Calculate yearly cumulative data (defaults to 2025)
                const yearlyData = this.calculateYearlyData(leader);
                
                return {
                    id: leader.id,
                    name: leader.name,
                    email: leader.email || `${leader.name.toLowerCase().replace(' ', '.')}@company.com`,
                    code: `${leader.name.split(' ')[0].toUpperCase()}${Math.floor(Math.random() * 100)}`,
                    level: leader.level,
                    clicks30: yearlyData.clicks,
                    orders30: yearlyData.orders,
                    revenue30: yearlyData.revenue,
                    monthlyData: leader.monthlyData, // Ensure monthlyData is carried over
                    bankingInfo: leader.bankingInfo, // Include banking information
                    country: getCountryName(getCountryCode(leader.id)),
                    get region() { return utils.getRegionFromCountry(this.country); },
                    tags: ['Top Performer']
                };
            });
        },

        setupEventListeners() {
            // Remove Apply/Reset button event listeners - direct filtering implemented instead
            ui.rowsPerPage?.addEventListener('change', () => this.changeRowsPerPage());
            ui.prevBtn?.addEventListener('click', () => this.previousPage());
            ui.nextBtn?.addEventListener('click', () => this.nextPage());
            ui.thSelect?.addEventListener('change', (e) => this.toggleSelectAll(e.target.checked));
            ui.selectAllPage?.addEventListener('change', (e) => this.toggleSelectAll(e.target.checked));
            ui.thead?.addEventListener('click', (e) => this.handleSort(e));
            ui.exportBtn?.addEventListener('click', () => this.exportCSV());

            // Setup direct filtering for dropdown selects
            this.setupDirectFiltering();

            // Search suggestions with direct filtering
            this.setupSearchSuggestions();

            // Row selection
            document.addEventListener('click', (e) => {
                if (e.target.classList.contains('row-check')) {
                    const id = e.target.dataset.id;
                    if (e.target.checked) {
                        appState.selected.add(id);
                    } else {
                        appState.selected.delete(id);
                    }
                    this.updateSelectionUI();
                }
            });
        },

        populateFilters() {
            // Populate Country filter
            const countries = Array.from(new Set(this.belData.map(r => r.country))).sort();
            countries.forEach(country => {
                if (ui.countrySel) {
                    ui.countrySel.innerHTML += `<option value="${country}">${country}</option>`;
                }
            });

            // Populate Region filter (regions are populated via HTML options, but we can add dynamic ones if needed)
            const regions = Array.from(new Set(this.belData.map(r => r.region))).sort();
            
            // Note: Region options are already defined in HTML, but if we need to add dynamic ones:
            // regions.forEach(region => {
            //     if (ui.regionSel && !ui.regionSel.querySelector(`option[value="${region}"]`)) {
            //         ui.regionSel.innerHTML += `<option value="${region}">${region}</option>`;
            //     }
            // });
        },

        getProcessedData() {
            const { keyword, referralId, level, region, country, start, end, activity } = appState.filters;
            const startDate = utils.parseDate(start);
            const endDate = utils.parseDate(end);

            let filtered = this.belData.filter(record => {
                const kw = keyword.trim().toLowerCase();
                const rid = referralId.trim().toLowerCase();
                
                // Search by name field
                if (kw && !record.name.toLowerCase().includes(kw)) return false;
                // Search by referral ID field
                if (rid && !record.id.toLowerCase().includes(rid)) return false;
                
                if (level && record.level !== level) return false;
                if (region && record.region !== region) return false;
                if (country && record.country !== country) return false;
                if (activity === 'clicks' && !(record.clicks30 > 0 && record.orders30 === 0)) return false;
                if (activity === 'orders' && !(record.orders30 > 0)) return false;
                if (activity === 'none' && !((record.clicks30 + record.orders30) === 0)) return false;
                return true;
            });

            const { sortBy, sortDir } = appState;
            filtered.sort((a, b) => {
                const valA = a[sortBy];
                const valB = b[sortBy];
                let cmp = 0;
                if (typeof valA === 'number') cmp = valA - valB;
                else cmp = String(valA).localeCompare(String(valB));
                return sortDir === 'asc' ? cmp : -cmp;
            });

            return filtered;
        },

        renderTable() {
            const processed = this.getProcessedData();
            const total = processed.length;
            const startIndex = (appState.page - 1) * appState.rowsPerPage;
            const pageItems = processed.slice(startIndex, startIndex + appState.rowsPerPage);
            
            if (!ui.tbody) return;

            const rows = pageItems.map(record => {
                const conv = record.clicks30 ? record.orders30 / record.clicks30 : 0;
                const aov = record.orders30 ? record.revenue30 / record.orders30 : 0;
                return `
                    <tr data-id="${record.id}">
                        <td><input type="checkbox" class="row-check" data-id="${record.id}" ${appState.selected.has(record.id) ? 'checked' : ''} /></td>
                        <td><a href="#" class="referral-id-link" data-referral-id="${record.id}">${record.id}</a></td>
                        <td>${record.name}</td>
                        <td><span class="bel-badge ${record.level.toLowerCase()}">${record.level}</span></td>
                        <td style="text-align:right;">${record.clicks30.toLocaleString()}</td>
                        <td style="text-align:right;">${record.orders30.toLocaleString()}</td>
                        <td style="text-align:right;">${utils.formatMoney(record.revenue30)}</td>
                        <td style="text-align:right;">${utils.formatPercent(conv)}</td>
                        <td style="text-align:right;">${record.orders30 ? utils.formatMoney(aov, 2) : '-'}</td>
                        <td>${record.region}</td>
                        <td>${record.country}</td>
                    </tr>
                `;
            }).join('');
            
            ui.tbody.innerHTML = rows;
            this.updatePaginationUI(total, startIndex, pageItems);
            this.updateSelectionUI();
            this.updateSortUI();
        },

        updatePaginationUI(total, startIndex, pageItems) {
            const allOnPageSelected = pageItems.length > 0 && pageItems.every(r => appState.selected.has(r.id));
            if (ui.thSelect) ui.thSelect.checked = allOnPageSelected;
            if (ui.selectAllPage) ui.selectAllPage.checked = allOnPageSelected;

            const from = total === 0 ? 0 : startIndex + 1;
            const to = Math.min(startIndex + appState.rowsPerPage, total);
            if (ui.rangeLabel) ui.rangeLabel.textContent = `${from}–${to} of ${total}`;
            if (ui.prevBtn) ui.prevBtn.disabled = appState.page === 1;
            if (ui.nextBtn) ui.nextBtn.disabled = to >= total;
        },

        updateSelectionUI() {
            if (ui.selectedCount) {
                ui.selectedCount.textContent = `${appState.selected.size} selected`;
            }
        },

        updateSortUI() {
            ui.thead?.querySelectorAll('th[data-sortable]').forEach(th => {
                const key = th.dataset.sortable;
                th.removeAttribute('data-sort-dir');
                if (key === appState.sortBy) th.setAttribute('data-sort-dir', appState.sortDir);
            });
        },

        applyFilters() {
            appState.page = 1;
            appState.selected.clear();
            appState.filters = {
                keyword: document.getElementById('f-name')?.value || '',
                referralId: document.getElementById('f-referral-id')?.value || '',
                level: document.getElementById('f-level')?.value || '',
                region: ui.regionSel?.value || '',
                country: ui.countrySel?.value || '',
                activity: document.getElementById('f-activity')?.value || ''
            };
            this.renderTable();
        },

        changeRowsPerPage() {
            appState.rowsPerPage = parseInt(ui.rowsPerPage?.value, 10) || 20;
            appState.page = 1;
            this.renderTable();
        },

        previousPage() {
            if (appState.page > 1) {
                appState.page--;
                this.renderTable();
            }
        },

        nextPage() {
            const total = this.getProcessedData().length;
            if (appState.page * appState.rowsPerPage < total) {
                appState.page++;
                this.renderTable();
            }
        },

        toggleSelectAll(checked) {
            const pageItems = this.getProcessedData().slice(
                (appState.page - 1) * appState.rowsPerPage, 
                appState.page * appState.rowsPerPage
            );
            pageItems.forEach(record => {
                if (checked) {
                    appState.selected.add(record.id);
                } else {
                    appState.selected.delete(record.id);
                }
            });
            this.renderTable();
        },

        handleSort(e) {
            const header = e.target.closest('th[data-sortable]');
            if (!header) return;
            
            const key = header.dataset.sortable;
            if (appState.sortBy === key) {
                appState.sortDir = appState.sortDir === 'asc' ? 'desc' : 'asc';
            } else {
                appState.sortBy = key;
                appState.sortDir = 'asc';
            }
            this.renderTable();
        },

        exportCSV() {
            const exportBtn = ui.exportBtn;
            if (exportBtn) {
                exportBtn.disabled = true;
                exportBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Exporting...';
            }

            try {
                // Get the currently filtered and processed data
                const processedData = this.getProcessedData();
                
                if (processedData.length === 0) {
                    alert('No data to export. Please adjust your filters and try again.');
                    return;
                }

                // Define CSV headers
                const headers = [
                    'Referral ID',
                    'Name', 
                    'Level',
                    'Clicks',
                    'Orders',
                    'Revenue',
                    'C2O CVR (%)',
                    'AOV',
                    'Region',
                    'Country'
                ];

                // Create CSV content
                let csvContent = headers.join(',') + '\n';

                // Add data rows
                processedData.forEach(record => {
                    const conv = record.clicks30 ? (record.orders30 / record.clicks30) * 100 : 0;
                    const aov = record.orders30 ? record.revenue30 / record.orders30 : 0;
                    
                    const row = [
                        `"${record.id}"`,
                        `"${record.name}"`,
                        `"${record.level}"`,
                        record.clicks30,
                        record.orders30,
                        record.revenue30.toFixed(2),
                        conv.toFixed(2),
                        aov.toFixed(2),
                        `"${record.region}"`,
                        `"${record.country}"`
                    ];
                    csvContent += row.join(',') + '\n';
                });

                // Create and download the CSV file
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                
                if (link.download !== undefined) {
                    // Create filename with current date and filter info
                    const currentDate = new Date().toISOString().split('T')[0];
                    const filterInfo = this.getFilterSummary();
                    const filename = `BEL_Performance_Leaderboard_${currentDate}${filterInfo}.csv`;
                    
                    const url = URL.createObjectURL(blob);
                    link.setAttribute('href', url);
                    link.setAttribute('download', filename);
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                    
                    // Show success message
                    if (exportBtn) {
                        exportBtn.innerHTML = '<i class="fas fa-check"></i> Downloaded!';
                        setTimeout(() => {
                            exportBtn.innerHTML = '<i class="fas fa-download"></i> Export CSV';
                        }, 2000);
                    }
                } else {
                    throw new Error('Your browser does not support file downloads');
                }
            } catch (error) {
                console.error('CSV Export Error:', error);
                alert('Failed to export CSV. Please try again.');
                
                if (exportBtn) {
                    exportBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Export Failed';
                    setTimeout(() => {
                        exportBtn.innerHTML = '<i class="fas fa-download"></i> Export CSV';
                    }, 2000);
                }
            } finally {
                if (exportBtn) {
                    exportBtn.disabled = false;
                }
            }
        },

        getFilterSummary() {
            const filters = appState.filters;
            let summary = '';
            
            if (filters.keyword) summary += `_name_${filters.keyword}`;
            if (filters.referralId) summary += `_id_${filters.referralId}`;
            if (filters.level) summary += `_level_${filters.level}`;
            if (filters.region) summary += `_region_${filters.region}`;
            if (filters.country) summary += `_country_${filters.country}`;
            if (filters.activity) summary += `_activity_${filters.activity}`;
            
            return summary.replace(/[^a-zA-Z0-9_]/g, '').substring(0, 50); // Clean and limit length
        },

        setupDirectFiltering() {
            // Setup direct filtering for dropdown selects
            const levelSelect = document.getElementById('f-level');
            const regionSelect = ui.regionSel;
            const countrySelect = ui.countrySel;
            const activitySelect = document.getElementById('f-activity');

            // Level filter - apply immediately on change
            levelSelect?.addEventListener('change', () => {
                this.applyFilters();
            });

            // Region filter - apply immediately on change
            regionSelect?.addEventListener('change', () => {
                this.applyFilters();
            });

            // Country filter - apply immediately on change
            countrySelect?.addEventListener('change', () => {
                this.applyFilters();
            });

            // Activity filter - apply immediately on change
            activitySelect?.addEventListener('change', () => {
                this.applyFilters();
            });
        },

        setupSearchSuggestions() {
            // Setup for Name search
            this.setupSearchForField('f-name', 'search-suggestions-name', 'name');
            // Setup for Referral ID search
            this.setupSearchForField('f-referral-id', 'search-suggestions-id', 'id');
        },

        setupSearchForField(inputId, suggestionsId, searchField) {
            const searchInput = document.getElementById(inputId);
            const suggestionsContainer = document.getElementById(suggestionsId);
            
            if (!searchInput || !suggestionsContainer) return;

            let selectedIndex = -1;
            let suggestions = [];

            // Input event for showing suggestions
            searchInput.addEventListener('input', utils.debounce((e) => {
                const query = e.target.value.trim().toLowerCase();
                selectedIndex = -1;
                
                if (query.length === 0) {
                    this.hideSuggestions(suggestionsContainer);
                    return;
                }

                // Find matching records based on search field
                if (searchField === 'name') {
                    suggestions = this.belData
                        .filter(record => record.name.toLowerCase().includes(query))
                        .slice(0, 8) // Limit to 8 suggestions
                        .map(record => ({
                            name: record.name,
                            id: record.id,
                            displayText: record.name,
                            searchField: 'name'
                        }));
                } else if (searchField === 'id') {
                    suggestions = this.belData
                        .filter(record => record.id.toLowerCase().includes(query))
                        .slice(0, 8) // Limit to 8 suggestions
                        .map(record => ({
                            name: record.name,
                            id: record.id,
                            displayText: `${record.id} - ${record.name}`,
                            searchField: 'id'
                        }));
                }

                if (suggestions.length > 0) {
                    this.showSuggestions(suggestions, query, suggestionsContainer, searchInput);
                } else {
                    this.hideSuggestions(suggestionsContainer);
                }
            }, 150));

            // Keyboard navigation
            searchInput.addEventListener('keydown', (e) => {
                const suggestionItems = suggestionsContainer.querySelectorAll('.search-suggestion-item');
                
                switch (e.key) {
                    case 'ArrowDown':
                        e.preventDefault();
                        selectedIndex = Math.min(selectedIndex + 1, suggestionItems.length - 1);
                        this.highlightSuggestion(suggestionItems, selectedIndex);
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        selectedIndex = Math.max(selectedIndex - 1, -1);
                        this.highlightSuggestion(suggestionItems, selectedIndex);
                        break;
                    case 'Enter':
                        e.preventDefault();
                        if (selectedIndex >= 0 && suggestionItems[selectedIndex]) {
                            this.selectSuggestion(suggestions[selectedIndex], searchInput);
                        } else {
                            // Apply filter with current input value
                            this.applyFilters();
                        }
                        break;
                    case 'Escape':
                        this.hideSuggestions(suggestionsContainer);
                        searchInput.blur();
                        break;
                }
            });

            // Click outside to hide suggestions
            document.addEventListener('click', (e) => {
                if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
                    this.hideSuggestions(suggestionsContainer);
                }
            });

            // Focus event to show suggestions if there's a value
            searchInput.addEventListener('focus', () => {
                if (searchInput.value.trim().length > 0) {
                    searchInput.dispatchEvent(new Event('input'));
                }
            });
        },

        showSuggestions(suggestions, query, suggestionsContainer, searchInput) {
            if (!suggestionsContainer) return;

            const html = suggestions.map((suggestion, index) => {
                if (suggestion.searchField === 'id') {
                    // For Referral ID search: Black ID, gray name
                    const highlightedId = this.highlightMatch(suggestion.id, query);
                    return `
                        <div class="search-suggestion-item" data-index="${index}">
                            <div class="suggestion-id-main">${highlightedId}</div>
                            <div class="suggestion-name-sub">${suggestion.name}</div>
                        </div>
                    `;
                } else {
                    // For name search: use original format
                    const highlightedName = this.highlightMatch(suggestion.name, query);
                    return `
                        <div class="search-suggestion-item" data-index="${index}">
                            <div class="suggestion-content">${highlightedName}</div>
                        </div>
                    `;
                }
            }).join('');

            suggestionsContainer.innerHTML = html;
            suggestionsContainer.classList.add('show');

            // Add click listeners to suggestion items
            suggestionsContainer.querySelectorAll('.search-suggestion-item').forEach((item, index) => {
                item.addEventListener('click', () => {
                    this.selectSuggestion(suggestions[index], searchInput);
                });
            });
        },

        hideSuggestions(suggestionsContainer) {
            if (suggestionsContainer) {
                suggestionsContainer.classList.remove('show');
                suggestionsContainer.innerHTML = '';
            }
        },

        highlightSuggestion(items, index) {
            items.forEach((item, i) => {
                item.classList.toggle('highlighted', i === index);
            });
        },

        selectSuggestion(suggestion, searchInput) {
            if (searchInput) {
                if (suggestion.searchField === 'name') {
                    searchInput.value = suggestion.name;
                } else if (suggestion.searchField === 'id') {
                    searchInput.value = suggestion.id;
                }
                const suggestionsContainer = searchInput.nextElementSibling;
                this.hideSuggestions(suggestionsContainer);
                this.applyFilters();
            }
        },

        highlightMatch(text, query) {
            if (!query) return text;
            
            const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
            return text.replace(regex, '<mark style="background-color: var(--ds-color-primary-light-30); font-weight: var(--fw-semibold);">$1</mark>');
        }
    };

    /* ========================================================================
       BEL MODAL MANAGEMENT
       ======================================================================== */
    const BELModal = {
        performanceTrendChart: null,
        
        init() {
            this.setupEventListeners();
            this.setupTabs();
            this.setupBankingEdit();
            this.setupAddNoteTextarea();
        },

        setupEventListeners() {
            ui.modalClose?.addEventListener('click', () => this.closeModal());
            ui.saveBtn?.addEventListener('click', () => this.saveAccountChanges());
            ui.addNoteBtn?.addEventListener('click', () => this.addNote());
            ui.modal?.addEventListener('click', (e) => {
                if (e.target === ui.modal) this.closeModal();
            });

            // Handle Referral ID link clicks
            document.addEventListener('click', (e) => {
                const link = e.target.closest('a.referral-id-link');
                if (!link) return;
                e.preventDefault();
                const idText = (link.dataset.referralId || link.textContent || '').trim();
                this.openModal(idText, link);
            });
        },

        setupTabs() {
            if (!ui.modal) return;
            const tabLinks = ui.modal.querySelectorAll('.tab-link');
            const tabContents = ui.modal.querySelectorAll('.tab-content');
            
            tabLinks.forEach(link => {
                link.addEventListener('click', () => {
                    const tabId = link.dataset.tab;
                    tabLinks.forEach(l => l.classList.remove('active'));
                    tabContents.forEach(c => c.classList.remove('active'));
                    link.classList.add('active');
                    ui.modal.querySelector(`#${tabId}`)?.classList.add('active');
                });
            });
        },

        openModal(id, linkElement = null) {
            // Centralized record fetching
            const record = this.getBelRecordById(id, linkElement);

            if (!record) {
                console.error(`BEL record with ID ${id} not found.`);
                this.showCustomAlert(`Could not find details for BEL with ID ${id}.`, 'error');
                return;
            }

            appState.currentReferralId = record.id;
            this.fillModal(record);
            
            // Reset to first tab (Performance) when opening modal
            this.resetToFirstTab();
            
            ui.modal.style.zIndex = ContentManager.getNextModalZIndex();
            ui.modal?.classList.add('show');
            
            // Scroll modal to top when opened
            setTimeout(() => {
                const modalBody = ui.modal?.querySelector('.modal-body');
                if (modalBody) modalBody.scrollTop = 0;
            }, 50);
        },

        getBelRecordById(id, linkElement = null) {
            // 1. Check AccountManagement's pre-processed data first
            let record = AccountManagement.belData.find(r => r.id === id);
            if (record) {
                console.log(`Record ${id} found in AccountManagement.belData`);
                return record;
            }

            // 2. If not found, check the raw leaderboard data from APP_DATA
            if (APP_DATA.belProfiles && APP_DATA.belProfiles.leaderboard) {
                const leaderboardRecord = APP_DATA.belProfiles.leaderboard.find(r => r.id === id);
                if (leaderboardRecord) {
                    console.log(`Record ${id} found in APP_DATA.belProfiles.leaderboard`);
                    // Normalize the record to the format expected by the modal
                    return {
                        id: leaderboardRecord.id,
                        name: leaderboardRecord.name,
                        email: leaderboardRecord.email,
                        code: leaderboardRecord.id,
                        level: leaderboardRecord.level,
                        clicks30: leaderboardRecord.clicks,
                        orders30: leaderboardRecord.orders,
                        revenue30: leaderboardRecord.revenue,
                        monthlyData: leaderboardRecord.monthlyData,
                        bankingInfo: leaderboardRecord.bankingInfo,
                        region: utils.getRegionFromCountry(leaderboardRecord.email?.split('@')[1]?.includes('.') ? 
                               leaderboardRecord.email.split('@')[1].split('.')[1].toUpperCase() : 'US'),
                        country: leaderboardRecord.email?.split('@')[1]?.includes('.') ? 
                                leaderboardRecord.email.split('@')[1].split('.')[1].toUpperCase() : 'US',
                        city: '—',
                        status: 'Active',
                        tags: []
                    };
                }
            }

            // 3. Fallback for records not in main data sources (e.g., from other tables)
            if (linkElement) {
                console.log(`Record ${id} not found in data, creating from link element`);
                const tr = linkElement.closest('tr');
                if (tr) {
                    const name = tr.querySelector('td:nth-child(2)')?.textContent.trim();
                    const level = tr.querySelector('td:nth-child(3)')?.textContent.trim();
                    const clicks = parseInt(tr.querySelector('td:nth-child(4)')?.textContent.replace(/,/g, '')) || 0;
                    const orders = parseInt(tr.querySelector('td:nth-child(5)')?.textContent.replace(/,/g, '')) || 0;
                    const revenue = utils.parseMoney(tr.querySelector('td:nth-child(6)')?.textContent);
                    
                    return {
                        id: id,
                        name: name,
                        level: level,
                        clicks30: clicks,
                        orders30: orders,
                        revenue30: revenue,
                        email: '—',
                        code: id,
                        region: '—',
                        country: '—',
                        city: '—',
                        status: 'Active',
                        tags: []
                    };
                }
            }
            
            console.log(`Record ${id} could not be found anywhere.`);
            return null;
        },

        resetToFirstTab() {
            if (!ui.modal) return;
            
            const tabLinks = ui.modal.querySelectorAll('.tab-link');
            const tabContents = ui.modal.querySelectorAll('.tab-content');
            
            // Remove active class from all tabs and contents
            tabLinks.forEach(link => link.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to first tab and its content
            if (tabLinks[0]) {
                tabLinks[0].classList.add('active');
            }
            
            // Find and activate the corresponding content for the first tab
            const firstTabId = tabLinks[0]?.dataset.tab;
            if (firstTabId) {
                const firstContent = ui.modal.querySelector(`#${firstTabId}`);
                if (firstContent) {
                    firstContent.classList.add('active');
                }
            }
            
            // Ensure charts are properly rendered for the first tab (Performance)
            if (firstTabId === 'overview') {
                // Trigger chart initialization after a short delay to ensure DOM is ready
                setTimeout(() => {
                    const record = this.getBelRecordById(appState.currentReferralId);
                    if (record) {
                        this.initializePerformanceTrendChart(record);
                    }
                }, 150);
            }
        },

        fillModal(record) {
            if (!record) return;
            
            if (ui.modalBelName) ui.modalBelName.textContent = record.name || '—';
            if (ui.modalBelInfo) {
                const emailText = record.email || 'No email provided';
                ui.modalBelInfo.textContent = `Referral ID: ${record.id || '—'} | Email: ${emailText}`;
            }
            
            // Update level badge
            const levelBadge = document.getElementById('modal-bel-level-badge');
            if (levelBadge && record.level) {
                levelBadge.className = `bel-badge ${record.level.toLowerCase()}`;
                levelBadge.textContent = record.level;
            }
            
            if (ui.modalLevel && record.level) ui.modalLevel.value = record.level;
            
            // Update performance metrics in modal
            this.updatePerformanceMetrics(record);
            
            // Update modal avatar
            const modalAvatar = ui.modal?.querySelector('.modal-avatar-small');
            if (modalAvatar && record.name) {
                const generatedAvatar = utils.generateAvatar(record.name, record.email || record.id);
                generatedAvatar.className = 'modal-avatar-small generated-avatar';
                generatedAvatar.style.width = '60px';
                generatedAvatar.style.height = '60px';
                generatedAvatar.style.fontSize = '20px';
                modalAvatar.parentNode.replaceChild(generatedAvatar, modalAvatar);
            }
            
            const notes = appState.notes[record.id] || [];
            if (ui.notesHistory) {
                ui.notesHistory.innerHTML = notes.length
                    ? notes.map(n => `<div class="note-item"><p>${n.text}</p><span>${n.time}</span></div>`).join('')
                    : '<p class="text-muted" style="padding:10px;">No notes yet.</p>';
            }
            
            // Charts will be initialized by resetToFirstTab() function
            
            // Update Banking Information
            this.updateBankingInformation(record);
            
            // Update Customer Insights
            this.updateCustomerInsights(record);
        },

        updatePerformanceMetrics(record) {
            if (!record) return;
            
            const totalClicksEl = document.getElementById('modal-total-clicks');
            const totalOrdersEl = document.getElementById('modal-total-orders');
            const totalRevenueEl = document.getElementById('modal-total-revenue');
            const convRateEl = document.getElementById('modal-conv-rate');
            const aovEl = document.getElementById('modal-aov');
            
            // Get the currently selected year from year selector, or default to 2025
            const yearSelector = document.getElementById('year-selector');
            const selectedYear = yearSelector && yearSelector.value ? yearSelector.value : '2025';
            
            // Calculate cumulative data from January to current month
            let cumulativeClicks = 0;
            let cumulativeOrders = 0;
            let cumulativeRevenue = 0;
            
            if (record.monthlyData && record.monthlyData[selectedYear]) {
                const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                const currentDate = new Date();
                
                // For 2025, only sum up to August (since it's September 8, 2025)
                // For 2024, sum the full year
                let monthsToSum = monthNames;
                if (selectedYear === '2025') {
                    monthsToSum = monthNames.slice(0, 8); // January to August
                }
                
                monthsToSum.forEach(monthName => {
                    const monthData = record.monthlyData[selectedYear][monthName];
                    if (monthData) {
                        cumulativeClicks += monthData.clicks || 0;
                        cumulativeOrders += monthData.orders || 0;
                        cumulativeRevenue += monthData.revenue || 0;
                    }
                });
            } else {
                // Fallback to record's direct values if no monthly data
                cumulativeClicks = record.clicks30 || record.clicks || 0;
                cumulativeOrders = record.orders30 || record.orders || 0;
                cumulativeRevenue = record.revenue30 || record.revenue || 0;
            }
            
            if (totalClicksEl) totalClicksEl.textContent = cumulativeClicks.toLocaleString();
            if (totalOrdersEl) totalOrdersEl.textContent = cumulativeOrders.toLocaleString();
            if (totalRevenueEl) totalRevenueEl.textContent = utils.formatMoney(cumulativeRevenue);
            
            // Calculate cumulative conversion rate and AOV
            let convRate = 0;
            let aov = 0;
            
            if (cumulativeClicks > 0) {
                convRate = (cumulativeOrders / cumulativeClicks) * 100;
            }
            
            if (cumulativeOrders > 0) {
                aov = cumulativeRevenue / cumulativeOrders;
            }
            
            if (convRateEl) convRateEl.textContent = `${convRate.toFixed(2)}%`;
            if (aovEl) aovEl.textContent = utils.formatMoney(aov, 2);
        },

        updateBankingInformation(record) {
            if (!record) return;
            
            // Get banking information from the record
            const bankingInfo = record.bankingInfo;
            
            // Elements for displaying banking information
            const bankNameDisplay = document.getElementById('bank-name-display');
            const swiftCodeDisplay = document.getElementById('swift-code-display');
            const accountHolderDisplay = document.getElementById('account-holder-display');
            const phoneDisplay = document.getElementById('phone-display');
            const addressDisplay = document.getElementById('address-display');
            
            // Elements for editing banking information
            const bankNameEdit = document.getElementById('bank-name-edit');
            const swiftCodeEdit = document.getElementById('swift-code-edit');
            const accountHolderEdit = document.getElementById('account-holder-edit');
            const phoneEdit = document.getElementById('phone-edit');
            const addressEdit = document.getElementById('address-edit');
            
            if (bankingInfo) {
                // Update display elements
                if (bankNameDisplay) bankNameDisplay.textContent = bankingInfo.bankName || '-';
                if (swiftCodeDisplay) swiftCodeDisplay.textContent = bankingInfo.swiftCode || '-';
                if (accountHolderDisplay) accountHolderDisplay.textContent = bankingInfo.accountHolder || '-';
                if (phoneDisplay) phoneDisplay.textContent = bankingInfo.phone || '-';
                if (addressDisplay) addressDisplay.textContent = bankingInfo.address || '-';
                
                // Update edit elements
                if (bankNameEdit) bankNameEdit.value = bankingInfo.bankName || '';
                if (swiftCodeEdit) swiftCodeEdit.value = bankingInfo.swiftCode || '';
                if (accountHolderEdit) accountHolderEdit.value = bankingInfo.accountHolder || '';
                if (phoneEdit) phoneEdit.value = bankingInfo.phone || '';
                if (addressEdit) addressEdit.value = bankingInfo.address || '';
            } else {
                // No banking info available, show placeholder
                if (bankNameDisplay) bankNameDisplay.textContent = '-';
                if (swiftCodeDisplay) swiftCodeDisplay.textContent = '-';
                if (accountHolderDisplay) accountHolderDisplay.textContent = '-';
                if (phoneDisplay) phoneDisplay.textContent = '-';
                if (addressDisplay) addressDisplay.textContent = '-';
                
                // Clear edit elements
                if (bankNameEdit) bankNameEdit.value = '';
                if (swiftCodeEdit) swiftCodeEdit.value = '';
                if (accountHolderEdit) accountHolderEdit.value = '';
                if (phoneEdit) phoneEdit.value = '';
                if (addressEdit) addressEdit.value = '';
            }
        },

        updateCustomerInsights(record) {
            if (!record) return;
            
            const salesData = this.getBelSalesData(record.id);
            const insights = this.generateInsights(record);
            
            // Calculate total sales statistics
            const totalOrders = salesData.reduce((sum, sale) => sum + sale.quantity, 0);
            const totalRevenue = salesData.reduce((sum, sale) => sum + sale.totalRevenue, 0);
            
            // Update categories section
            const tagsContainer = document.querySelector('.tags-container');
            if (tagsContainer) {
                tagsContainer.innerHTML = insights.topCategories.map(category => {
                    const categoryRevenue = salesData
                        .filter(sale => sale.category === category)
                        .reduce((sum, sale) => sum + sale.totalRevenue, 0);
                    
                    return `
                        <span class="tag hot-selling" title="${category}: $${categoryRevenue.toLocaleString()} revenue">
                            ${category}
                        </span>
                    `;
                }).join('');
            }
            
            // Update products section with actual sales data
            const productList = document.querySelector('.product-list');
            if (productList) {
                productList.innerHTML = insights.topProducts.map(productName => {
                    const productData = salesData.find(sale => sale.productName === productName);
                    const quantity = productData ? productData.quantity : 0;
                    const revenue = productData ? productData.totalRevenue : 0;
                    const description = productData ? productData.productDescription : '';
                    
                    return `
                        <div class="product-item">
                            <div class="product-info">
                                <div class="product-name">${productName}</div>
                                <div class="product-description">${description}</div>
                                <div class="product-stats">
                                    <span class="quantity">Sold: ${quantity} units</span>
                                    <span class="revenue">Revenue: $${revenue.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');
            }
            
            // Add sales summary header
            const insightsTab = document.getElementById('insights-tab');
            if (insightsTab) {
                let summaryDiv = insightsTab.querySelector('.sales-summary');
                if (!summaryDiv) {
                    summaryDiv = document.createElement('div');
                    summaryDiv.className = 'sales-summary';
                    insightsTab.insertBefore(summaryDiv, insightsTab.firstChild);
                }
                
                summaryDiv.innerHTML = `
                    <div class="summary-header">
                        <h4>Sales Performance Overview</h4>
                        <div class="summary-stats">
                            <div class="stat-item">
                                <span class="stat-label">Total Orders:</span>
                                <span class="stat-value">${totalOrders}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Total Revenue:</span>
                                <span class="stat-value">$${totalRevenue.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                `;
            }
        },

        getCustomerInsights(referralId) {
            // Initialize customer insights data if not exists
            if (!appState.customerInsights) {
                appState.customerInsights = {};
            }
            
            if (!appState.customerInsights[referralId]) {
                // Generate insights based on BEL level and characteristics
                const record = AccountManagement.belData.find(x => x.id === referralId);
                appState.customerInsights[referralId] = this.generateInsights(record);
            }
            
            return appState.customerInsights[referralId];
        },

        generateInsights(record) {
            // Generate insights based on actual sales data for this BEL
            const salesData = this.getBelSalesData(record.id);
            
            // Analyze top-selling categories
            const categoryStats = {};
            salesData.forEach(sale => {
                categoryStats[sale.category] = (categoryStats[sale.category] || 0) + sale.quantity;
            });
            
            // Get top 4 categories by sales volume
            const topCategories = Object.entries(categoryStats)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 4)
                .map(([category]) => category);
            
            // Get top 10 products by sales volume (increased from 8 to 10)
            const topProducts = salesData
                .sort((a, b) => b.quantity - a.quantity)
                .slice(0, 10)
                .map(sale => sale.productName);
            
            return {
                topCategories: topCategories.length > 0 ? topCategories : ['—', '—'],
                topProducts: topProducts.length > 0 ? topProducts : ['—', '—']
            };
        },

        getBelSalesData(referralId) {
            // Initialize sales data if not exists
            if (!appState.belSalesData) {
                appState.belSalesData = {};
            }
            
            if (!appState.belSalesData[referralId]) {
                appState.belSalesData[referralId] = this.generateSalesData(referralId);
            }
            
            return appState.belSalesData[referralId];
        },

        generateSalesData(referralId) {
            // Get BEL record to determine sales pattern based on level and performance
            const record = AccountManagement.belData.find(x => x.id === referralId);
            const level = record?.level || 'Exploder';
            const revenue = record?.revenue30 || 0;
            
            // If no revenue, return empty sales data
            if (revenue === 0) {
                return [];
            }
            
            // Get product catalog from loaded data
            let productCatalog = [];
            if (window.appData && window.appData.productCatalog) {
                productCatalog = window.appData.productCatalog.productCatalog || [];
            }
            
            // Fallback to basic products if catalog not loaded
            if (productCatalog.length === 0) {
                return [];
            }
            
            // Generate sales data based on BEL's revenue and level preferences
            const salesData = [];
            const baseOrderCount = Math.floor(revenue / 300); // Adjust based on higher product prices
            
            productCatalog.forEach(product => {
                const levelMultiplier = product.levelFactor[level] || 1.0;
                const randomFactor = 0.3 + Math.random() * 0.7; // Add some randomness
                const baseQuantity = Math.floor(baseOrderCount * levelMultiplier * randomFactor * 0.08);
                
                if (baseQuantity > 0) {
                    salesData.push({
                        productName: product.name,
                        productDescription: product.description,
                        category: product.category,
                        quantity: baseQuantity,
                        avgPrice: product.avgPrice,
                        totalRevenue: baseQuantity * product.avgPrice
                    });
                }
            });
            
            // Sort by quantity
            salesData.sort((a, b) => b.quantity - a.quantity);
            
            return salesData;
        },

        initializePerformanceTrendChart(record) {
            console.log('Initializing performance trend chart for record:', record);
            console.log('Record has monthlyData:', !!record.monthlyData);
            if (record.monthlyData) {
                console.log('Available years in monthlyData:', Object.keys(record.monthlyData));
            }
            
            const ctx = document.getElementById('bel-performance-trend-chart');
            if (!ctx || !window.Chart || !record) return;
            
            // Destroy existing chart if it exists
            if (this.performanceTrendChart) {
                this.performanceTrendChart.destroy();
            }
            
            // Get or populate year selector
            const yearSelector = document.getElementById('year-selector');
            if (yearSelector) {
                // Populate year options from data if not already populated
                if (yearSelector.children.length === 0) {
                    this.populateYearSelector(record, yearSelector);
                }
                
                // Remove existing event listeners and add new one
                const currentValue = yearSelector.value; // 保存當前選中的值
                yearSelector.replaceWith(yearSelector.cloneNode(true));
                const newYearSelector = document.getElementById('year-selector');
                
                // Re-populate after cloning only if needed
                if (newYearSelector.children.length === 0) {
                    this.populateYearSelector(record, newYearSelector);
                }
                
                // 恢復選中的值
                if (currentValue && newYearSelector.querySelector(`option[value="${currentValue}"]`)) {
                    newYearSelector.value = currentValue;
                } else {
                    newYearSelector.value = this.getDefaultYear(record);
                }
                
                newYearSelector.addEventListener('change', () => {
                    this.initializePerformanceTrendChart(record);
                    this.updatePerformanceMetrics(record); // Update performance metrics when year changes
                });
            }
            
            // Get selected year (default to most recent available year)
            const selectedYear = yearSelector && yearSelector.value ? yearSelector.value : this.getDefaultYear(record);
            console.log('Selected year:', selectedYear);
            
            // Generate 12 months labels
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            
            // Get monthly data for the selected year
            let clicksTrend = [];
            let ordersTrend = [];
            let revenueTrend = [];
            let c2oCvrTrend = [];
            
            if (record.monthlyData && record.monthlyData[selectedYear]) {
                console.log('Using monthly data for year:', selectedYear);
                const yearData = record.monthlyData[selectedYear];
                const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                                  'July', 'August', 'September', 'October', 'November', 'December'];
                
                monthNames.forEach(monthName => {
                    const monthData = yearData[monthName];
                    if (monthData) {
                        clicksTrend.push(monthData.clicks || 0);
                        ordersTrend.push(monthData.orders || 0);
                        revenueTrend.push(monthData.revenue || 0);
                        // Calculate C2O CVR dynamically: orders / clicks * 100
                        const clicks = monthData.clicks || 0;
                        const orders = monthData.orders || 0;
                        const c2oCvr = clicks > 0 ? (orders / clicks) * 100 : 0;
                        c2oCvrTrend.push(Number(c2oCvr.toFixed(2)));
                    } else {
                        clicksTrend.push(0);
                        ordersTrend.push(0);
                        revenueTrend.push(0);
                        c2oCvrTrend.push(0);
                    }
                });
            } else {
                console.log('Using fallback data - no monthly data available');
                // Fallback: use current values for last month, zeros for others
                const currentMonth = record.clicks30 || record.clicks || 0;
                const currentOrders = record.orders30 || record.orders || 0;
                const currentRevenue = record.revenue30 || record.revenue || 0;
                const currentCvr = currentMonth > 0 ? (currentOrders / currentMonth) * 100 : 0;
                
                clicksTrend = Array(11).fill(0).concat([currentMonth]);
                ordersTrend = Array(11).fill(0).concat([currentOrders]);
                revenueTrend = Array(11).fill(0).concat([currentRevenue]);
                c2oCvrTrend = Array(11).fill(0).concat([Number(currentCvr.toFixed(2))]);
            }
            
            console.log('Chart data - Clicks:', clicksTrend);
            console.log('Chart data - Orders:', ordersTrend);
            console.log('Chart data - Revenue:', revenueTrend);
            console.log('Chart data - C2O CVR:', c2oCvrTrend);
            
            this.performanceTrendChart = new Chart(ctx, {
                type: 'bar', // Default type for mixed chart
                data: {
                    labels: months,
                    datasets: [
                        {
                            type: 'bar',
                            label: 'Clicks',
                            data: clicksTrend,
                            backgroundColor: '#003160',      // Primary blue with transparency
                            yAxisID: 'y'
                        },
                        {
                            type: 'bar',
                            label: 'Orders',
                            data: ordersTrend,
                            backgroundColor: '#336899',        // Green with transparency
                            yAxisID: 'y1'
                        },
                        {
                            type: 'bar',
                            label: 'Revenue',
                            data: revenueTrend,
                            backgroundColor: '#80A0BF',    // Yellow with transparency
                            yAxisID: 'y2'
                        },
                        {
                            type: 'line',
                            label: 'C2O CVR (%)',
                            data: c2oCvrTrend,
                            borderColor: '#F39800',      
                            backgroundColor: '#F39800',
                            fill: false,
                            tension: 0,   
                            pointBackgroundColor: '#F39800',
                            pointBorderColor: '#FFFFFF',
                            pointBorderWidth: 0.5,
                            pointRadius: 4,
                            pointHoverRadius: 5,
                            yAxisID: 'y3'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        mode: 'index',
                        intersect: false
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                boxWidth: 12,
                                padding: 15,
                                usePointStyle: true,
                                font: {
                                    size: 12
                                }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                title: (tooltipItems) => `${tooltipItems[0].label || 'Unknown'} ${selectedYear}`,
                                label: (context) => {
                                    const label = context.dataset.label;
                                    const value = context.parsed.y;
                                    
                                    if (label === 'Revenue') {
                                        return `${label}: ${utils.formatMoney(value)}`;
                                    } else if (label === 'C2O CVR (%)') {
                                        return `${label}: ${value}%`;
                                    } else if (label === 'Clicks') {
                                        return `${label}: ${value.toLocaleString()}`;
                                    } else if (label === 'Orders') {
                                        return `${label}: ${value.toLocaleString()}`;
                                    } else {
                                        return `${label}: ${value.toLocaleString()}`;
                                    }
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: `Month (${selectedYear})`,
                                font: {
                                    size: 12,
                                    weight: 'bold'
                                }
                            }
                        },
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            title: {
                                display: true,
                                text: 'Clicks',
                                font: {
                                    size: 12,
                                    weight: 'bold'
                                }
                            },
                            beginAtZero: true,
                            max: 1200,  // 調整為縮小後的範圍
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)'
                            }
                        },
                        y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            title: {
                                display: true,
                                text: 'Orders',
                                font: {
                                    size: 12,
                                    weight: 'bold'
                                }
                            },
                            beginAtZero: true,
                            max: 50,  // 調整為縮小後的範圍
                            grid: {
                                drawOnChartArea: false
                            }
                        },
                        y2: {
                            type: 'linear',
                            display: false, // 隱藏Revenue軸但保持功能
                            position: 'right',
                            beginAtZero: true,
                            max: 35000,  // 調整為縮小後的範圍
                            grid: {
                                drawOnChartArea: false
                            }
                        },
                        y3: {
                            type: 'linear',
                            display: false, // 隱藏CVR軸
                            position: 'right',
                            beginAtZero: true,
                            max: 5, // CVR百分比範圍保持不變
                            grid: {
                                drawOnChartArea: false
                            }
                        }
                    }
                }
            });
        },

        populateYearSelector(record, yearSelector) {
            console.log('Populating year selector for record:', record.id);
            // Clear existing options
            yearSelector.innerHTML = '';
            
            let availableYears = [];
            
            // Get available years from monthlyData
            if (record.monthlyData) {
                availableYears = Object.keys(record.monthlyData).sort((a, b) => b - a); // Sort descending (newest first)
                console.log('Available years from monthlyData:', availableYears);
            }
            
            // If no monthly data available, use current year as fallback
            if (availableYears.length === 0) {
                const currentYear = new Date().getFullYear().toString();
                availableYears = [currentYear];
                console.log('Using fallback year:', currentYear);
            }
            
            // Populate options
            availableYears.forEach(year => {
                const option = document.createElement('option');
                option.value = year;
                option.textContent = year;
                yearSelector.appendChild(option);
            });
            
            // Set default selection to most recent year
            if (availableYears.length > 0) {
                yearSelector.value = availableYears[0];
                console.log('Set default year to:', availableYears[0]);
            }
        },

        getDefaultYear(record) {
            if (record.monthlyData) {
                const years = Object.keys(record.monthlyData).sort((a, b) => b - a);
                if (years.length > 0) {
                    return years[0]; // Return most recent year
                }
            }
            return new Date().getFullYear().toString(); // Fallback to current year
        },

        closeModal() {
            ui.modal?.classList.remove('show');
            appState.currentReferralId = null;
            
            // Clean up charts
            if (this.performanceTrendChart) {
                this.performanceTrendChart.destroy();
                this.performanceTrendChart = null;
            }
        },

        saveAccountChanges() {
            if (!appState.currentReferralId) return;
            
            const record = AccountManagement.belData.find(x => x.id === appState.currentReferralId);
            if (!record) {
                this.showCustomAlert('This referral is not editable from Account Management.', 'error');
                this.closeModal();
                return;
            }
            
            if (ui.modalLevel) {
                const newLevel = ui.modalLevel.value;
                record.level = newLevel;
                
                // Sync the change back to the original dashboard data
                const dashboardRecord = APP_DATA.belProfiles.leaderboard.find(x => x.id === appState.currentReferralId);
                if (dashboardRecord) {
                    dashboardRecord.level = newLevel;
                }
            }
            
            this.showCustomAlert(`Saved changes for ${record.name}.`, 'success');
            
            // Update both Account Management and Dashboard
            AccountManagement.renderTable();
            Dashboard.renderPerformanceTable();
            
            // Update Account Management cards if currently on that page
            const currentSection = document.querySelector('.content-section.active')?.id;
            if (currentSection === 'Account-Management') {
                ContentManager.renderAccountCards();
            }
            
            this.closeModal();
        },

        setupBankingEdit() {
            if (!ui.modal) return;

            // Banking edit functionality
            const editBankingBtn = ui.modal.querySelector('#edit-banking-btn');
            const saveBankingBtn = ui.modal.querySelector('#save-banking-btn');
            const cancelBankingBtn = ui.modal.querySelector('#cancel-banking-btn');
            const bankingHistoryBtn = ui.modal.querySelector('#banking-history-btn');
            const bankingGrid = ui.modal.querySelector('.banking-info-grid');
            const editActions = ui.modal.querySelector('.banking-edit-actions');

            if (editBankingBtn) {
                editBankingBtn.addEventListener('click', () => {
                    bankingGrid?.classList.add('banking-edit-mode');
                    editActions?.style.setProperty('display', 'block');
                    editBankingBtn.style.display = 'none';
                });
            }

            if (cancelBankingBtn) {
                cancelBankingBtn.addEventListener('click', () => {
                    this.cancelBankingEdit();
                });
            }

            if (saveBankingBtn) {
                saveBankingBtn.addEventListener('click', () => {
                    this.saveBankingInfo();
                });
            }

            if (bankingHistoryBtn) {
                bankingHistoryBtn.addEventListener('click', () => {
                    this.showBankingHistory();
                });
            }
        },

        cancelBankingEdit() {
            const bankingGrid = ui.modal?.querySelector('.banking-info-grid');
            const editActions = ui.modal?.querySelector('.banking-edit-actions');
            const editBankingBtn = ui.modal?.querySelector('#edit-banking-btn');

            bankingGrid?.classList.remove('banking-edit-mode');
            editActions?.style.setProperty('display', 'none');
            if (editBankingBtn) editBankingBtn.style.display = 'inline-block';

            // Reset form values to original
            const editFields = ui.modal?.querySelectorAll('.banking-edit');
            editFields?.forEach(field => {
                const displayField = field.previousElementSibling;
                if (displayField) {
                    field.value = displayField.textContent;
                }
            });
        },

        saveBankingInfo() {
            // Show custom confirmation dialog
            this.showBankingConfirmDialog();
        },

        showBankingConfirmDialog() {
            // Create custom confirmation modal
            const confirmModal = document.createElement('div');
            confirmModal.className = 'custom-modal-overlay';
            confirmModal.style.zIndex = '2002';
            confirmModal.innerHTML = `
                <div class="custom-modal-content" style="max-width: 500px;">
                    <div class="custom-modal-header">
                        <h3><i class="fas fa-exclamation-triangle" style="color: #f39800;"></i> Banking Information Update</h3>
                    </div>
                    <div class="custom-modal-body">
                        <div style="margin-bottom: 20px;">
                            <label for="change-reason" style="font-weight: bold; display: block; margin-bottom: 8px;">Reason for Change:</label>
                            <textarea id="change-reason" placeholder="Please provide a reason for this banking information change..." 
                                style="width: 100%; min-height: 80px; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-family: inherit; resize: vertical;"></textarea>
                        </div>
                        
                        <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px; padding: 15px; margin-bottom: 20px;">
                            <div style="display: flex; align-items: flex-start; gap: 10px;">
                                <input type="checkbox" id="confirm-accuracy" style="margin-top: 2px;">
                                <label for="confirm-accuracy" style="font-size: 0.9rem; line-height: 1.4;">
                                    I confirm that this change will affect BEL benefits and rights. I ensure that all information provided is accurate and correct.
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="custom-modal-footer">
                        <button class="bel-btn secondary" id="cancel-confirm-btn">Cancel</button>
                        <button class="bel-btn primary" id="proceed-confirm-btn" disabled style="margin-left: 10px;">
                            <i class="fas fa-save"></i> Update Banking Info
                        </button>
                    </div>
                </div>
            `;

            document.body.appendChild(confirmModal);
            confirmModal.style.zIndex = ContentManager.getNextModalZIndex();
            confirmModal.classList.add('show');

            // Get elements
            const reasonTextarea = confirmModal.querySelector('#change-reason');
            const confirmCheckbox = confirmModal.querySelector('#confirm-accuracy');
            const proceedBtn = confirmModal.querySelector('#proceed-confirm-btn');
            const cancelBtn = confirmModal.querySelector('#cancel-confirm-btn');

            // Enable/disable proceed button based on inputs
            const updateProceedButton = () => {
                const hasReason = reasonTextarea.value.trim().length > 0;
                const isConfirmed = confirmCheckbox.checked;
                proceedBtn.disabled = !(hasReason && isConfirmed);
            };

            reasonTextarea.addEventListener('input', updateProceedButton);
            confirmCheckbox.addEventListener('change', updateProceedButton);

            // Handle buttons
            cancelBtn.addEventListener('click', () => {
                confirmModal.remove();
            });

            proceedBtn.addEventListener('click', () => {
                const reason = reasonTextarea.value.trim();
                confirmModal.remove();
                this.proceedWithBankingUpdate(reason);
            });

            // Close on overlay click
            confirmModal.addEventListener('click', (e) => {
                if (e.target === confirmModal) {
                    confirmModal.remove();
                }
            });
        },

        proceedWithBankingUpdate(reason) {
            // Get all the edit fields
            const bankName = ui.modal?.querySelector('#bank-name-edit')?.value;
            const swiftCode = ui.modal?.querySelector('#swift-code-edit')?.value;
            const accountHolder = ui.modal?.querySelector('#account-holder-edit')?.value;
            const phone = ui.modal?.querySelector('#phone-edit')?.value;
            const address = ui.modal?.querySelector('#address-edit')?.value;

            // Validate required fields
            if (!bankName || !swiftCode || !accountHolder || !phone || !address) {
                this.showCustomAlert('All fields are required for banking information.', 'error');
                return;
            }

            // Update display fields
            const displays = {
                '#bank-name-display': bankName,
                '#swift-code-display': swiftCode,
                '#account-holder-display': accountHolder,
                '#phone-display': phone,
                '#address-display': address
            };

            Object.entries(displays).forEach(([selector, value]) => {
                const element = ui.modal?.querySelector(selector);
                if (element) element.textContent = value;
            });

            // Save to edit history with reason
            this.saveBankingEditHistory({
                bankName,
                swiftCode,
                accountHolder,
                phone,
                address,
                reason,
                timestamp: new Date().toISOString(),
                userId: appState.currentReferralId
            });

            // Exit edit mode
            this.cancelBankingEdit();

            this.showCustomAlert('Banking information updated successfully!', 'success');
        },

        showCustomAlert(message, type = 'info') {
            const alertModal = document.createElement('div');
            alertModal.className = 'custom-modal-overlay';
            alertModal.style.zIndex = ContentManager.getNextModalZIndex();
            
            const iconMap = {
                success: 'fas fa-check-circle',
                error: 'fas fa-exclamation-circle',
                info: 'fas fa-info-circle'
            };
            
            const colorMap = {
                success: '#28a745',
                error: '#dc3545',
                info: '#007bff'
            };

            alertModal.innerHTML = `
                <div class="custom-modal-content" style="max-width: 400px;">
                    <div class="custom-modal-body" style="text-align: center; padding: 30px 20px;">
                        <i class="${iconMap[type]}" style="font-size: 3rem; color: ${colorMap[type]}; margin-bottom: 15px;"></i>
                        <p style="font-size: 1.1rem; margin-bottom: 20px; line-height: 1.4;">${message}</p>
                        <button class="bel-btn primary" id="close-alert-btn">OK</button>
                    </div>
                </div>
            `;

            document.body.appendChild(alertModal);
            alertModal.classList.add('show');

            // Handle close
            const closeBtn = alertModal.querySelector('#close-alert-btn');
            closeBtn.addEventListener('click', () => {
                alertModal.remove();
            });

            alertModal.addEventListener('click', (e) => {
                if (e.target === alertModal) {
                    alertModal.remove();
                }
            });

            // Auto close after 3 seconds for success messages
            if (type === 'success') {
                setTimeout(() => {
                    if (document.body.contains(alertModal)) {
                        alertModal.remove();
                    }
                }, 3000);
            }
        },

        saveBankingEditHistory(changeData) {
            if (!appState.currentReferralId) return;

            // Initialize banking history if not exists
            if (!appState.bankingHistory) {
                appState.bankingHistory = {};
            }

            if (!appState.bankingHistory[appState.currentReferralId]) {
                appState.bankingHistory[appState.currentReferralId] = [];
            }

            // Add new change to history
            appState.bankingHistory[appState.currentReferralId].unshift({
                ...changeData,
                changedBy: 'Admin', // In real app, this would be current user
                changeId: Date.now().toString()
            });

            console.log('Banking history updated:', appState.bankingHistory[appState.currentReferralId]);
        },

        showBankingHistory() {
            if (!appState.currentReferralId) return;

            // Check if history exists for this user
            const history = appState.bankingHistory?.[appState.currentReferralId] || [];
            
            if (history.length === 0) {
                alert('No banking edit history found for this user.');
                return;
            }

            // Create history modal content
            let historyContent = '<div style="max-height: 400px; overflow-y: auto;">';
            historyContent += '<h4>Banking Information Edit History</h4>';
            historyContent += '<p style="color: #666; font-size: 0.9rem; margin-bottom: 20px;">All changes to banking information are recorded for security and audit purposes.</p>';
            
            history.forEach((change, index) => {
                const date = new Date(change.timestamp).toLocaleString();
                
                historyContent += `
                    <div style="border: 1px solid #ddd; border-radius: 4px; padding: 15px; margin-bottom: 10px; background: #f9f9f9;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <div style="font-weight: bold; color: #333;">Change #${index + 1}</div>
                            <div style="font-size: 0.85rem; color: #666;">${date}</div>
                        </div>
                        <div style="margin-bottom: 5px;"><strong>Modified by:</strong> ${change.changedBy}</div>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 10px;">
                            <div>
                                <div style="font-size: 0.85rem; color: #666;">Bank Name</div>
                                <div style="font-weight: 500;">${change.bankName}</div>
                            </div>
                            <div>
                                <div style="font-size: 0.85rem; color: #666;">SWIFT Code</div>
                                <div style="font-weight: 500;">${change.swiftCode}</div>
                            </div>
                            <div>
                                <div style="font-size: 0.85rem; color: #666;">Account Holder</div>
                                <div style="font-weight: 500;">${change.accountHolder}</div>
                            </div>
                            <div>
                                <div style="font-size: 0.85rem; color: #666;">Phone</div>
                                <div style="font-weight: 500;">${change.phone}</div>
                            </div>
                            <div style="grid-column: 1 / -1;">
                                <div style="font-size: 0.85rem; color: #666;">Address</div>
                                <div style="font-weight: 500;">${change.address}</div>
                            </div>
                        </div>
                        ${change.reason ? `<div style="margin-top: 10px; padding: 8px; background: #fff3cd; border-radius: 4px; font-size: 0.9rem;"><strong>Reason:</strong> ${change.reason}</div>` : ''}
                    </div>
                `;
            });
            
            historyContent += '</div>';

            // Create a simple modal for history display
            const historyModal = document.createElement('div');
            historyModal.className = 'modal-overlay';
            historyModal.style.zIndex = ContentManager.getNextModalZIndex();
            historyModal.innerHTML = `
                <div class="modal-content" style="max-width: 800px;">
                    <div class="modal-header">
                        <h3><i class="fas fa-history"></i> Banking Edit History</h3>
                        <button class="close-button" onclick="this.closest('.modal-overlay').remove()">&times;</button>
                    </div>
                    <div style="padding-top: 10px;">
                        ${historyContent}
                    </div>
                </div>
            `;

            document.body.appendChild(historyModal);
            historyModal.classList.add('show');
        },

        addNote() {
            if (!appState.currentReferralId) return;
            
            const text = (ui.modalNote?.value || '').trim();
            if (!text) return;
            
            const timestamp = new Date().toLocaleString();
            appState.notes[appState.currentReferralId] = appState.notes[appState.currentReferralId] || [];
            appState.notes[appState.currentReferralId].unshift({ text, time: timestamp });
            
            if (ui.modalNote) ui.modalNote.value = '';
            
            // Find the complete BEL record and refresh modal with full data
            const fullRecord = AccountManagement.belData.find(record => record.id === appState.currentReferralId);
            if (fullRecord) {
                this.fillModal(fullRecord);
            }
        },

        setupAddNoteTextarea() {
            const textarea = ui.addNoteTextarea || ui.modalNote;
            const button = ui.addNoteBtnNew || ui.addNoteBtn;
            
            if (!textarea || !button) return;
            
            const updateButtonState = () => {
                const hasContent = textarea.value.trim().length > 0;
                if (hasContent) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            };
            
            // Listen for input changes
            textarea.addEventListener('input', updateButtonState);
            textarea.addEventListener('keyup', updateButtonState);
            textarea.addEventListener('paste', () => {
                setTimeout(updateButtonState, 10); // Small delay for paste event
            });
            
            // Initial state
            updateButtonState();
        }
    };

    /* ========================================================================
       DYNAMIC CONTENT INJECTION
       ======================================================================== */
    const ContentManager = {
        payoutModalEl: null,
        supportModalEl: null,
        announcementModalEl: null,
        imageModalEl: null,
        confirmModalEl: null,
        formModalEl: null,
        historyTicketsModalEl: null,
        currentModalZIndex: 2000, // Base z-index for modals
        
        getNextModalZIndex() {
            this.currentModalZIndex += 10; // Increment by 10 to allow for intermediate elements
            return this.currentModalZIndex;
        },
        
        init() {
            this.setupEventListeners(); // 先設置事件監聽器
            this.injectAccountManagement();
            this.injectPayoutsAndOrders();
            this.injectContent();
            this.injectContactSupport();
        },

        injectAccountManagement() {
            // Account Management功能會在導航切換時自動初始化
            // 這裡我們確保帳戶卡片在切換到Account Management頁面時正確渲染
            const accountManagementRoot = document.getElementById('Account-Management');
            if (!accountManagementRoot) return;

            // 檢查是否已經有帳戶容器，如果沒有則不需要做任何事
            // HTML中已經包含了帳戶容器的結構
            const accountContainer = accountManagementRoot.querySelector('#account-container');
            const appData = window.APP_DATA || APP_DATA;
            if (accountContainer && appData?.belProfiles?.leaderboard) {
                this.renderAccountCards();
                this.setupAccountFilters();
            }
        },

        setupAccountFilters() {
            const nameInput = document.getElementById('account-f-name');
            const idInput = document.getElementById('account-f-referral-id');
            const levelSelect = document.getElementById('account-f-level');
            const regionSelect = document.getElementById('account-f-region');
            const sortSelect = document.getElementById('account-f-sort');

            // Real-time filtering on input change
            if (nameInput) {
                nameInput.addEventListener('input', () => {
                    this.resetAccountPagination();
                    this.renderCurrentView();
                });
            }

            if (idInput) {
                idInput.addEventListener('input', () => {
                    this.resetAccountPagination();
                    this.renderCurrentView();
                });
            }

            if (levelSelect) {
                levelSelect.addEventListener('change', () => {
                    this.resetAccountPagination();
                    this.renderCurrentView();
                });
            }

            if (regionSelect) {
                regionSelect.addEventListener('change', () => {
                    this.resetAccountPagination();
                    this.renderCurrentView();
                });
            }

            if (sortSelect) {
                sortSelect.addEventListener('change', () => {
                    this.resetAccountPagination();
                    this.renderCurrentView();
                });
            }

            // Setup search suggestions for Account Management
            this.setupAccountSearchSuggestions();

            // Setup View Switcher
            this.setupViewSwitcher();

            // Setup pagination
            this.setupAccountPagination();
        },

        resetAccountPagination() {
            appState.accountGridPage = 1;
            appState.accountListPage = 1;
        },

        setupAccountSearchSuggestions() {
            // Setup for Name search
            this.setupAccountSearchForField('account-f-name', 'account-search-suggestions-name', 'name');
            // Setup for Referral ID search
            this.setupAccountSearchForField('account-f-referral-id', 'account-search-suggestions-id', 'id');
        },

        setupAccountSearchForField(inputId, suggestionsId, searchField) {
            const searchInput = document.getElementById(inputId);
            const suggestionsContainer = document.getElementById(suggestionsId);
            
            if (!searchInput || !suggestionsContainer) return;

            let selectedIndex = -1;
            let suggestions = [];

            // Get BEL data for suggestions
            const getBelData = () => {
                const appData = window.APP_DATA || APP_DATA;
                if (!appData?.belProfiles?.leaderboard) return [];
                
                return appData.belProfiles.leaderboard.map(leader => ({
                    name: leader.name,
                    id: leader.id,
                    level: leader.level
                }));
            };

            // Input event for showing suggestions
            searchInput.addEventListener('input', utils.debounce((e) => {
                const query = e.target.value.trim().toLowerCase();
                selectedIndex = -1;
                
                if (query.length === 0) {
                    this.hideAccountSuggestions(suggestionsContainer);
                    return;
                }

                const belData = getBelData();
                
                // Find matching records based on search field
                if (searchField === 'name') {
                    suggestions = belData
                        .filter(record => record.name.toLowerCase().includes(query))
                        .slice(0, 8) // Limit to 8 suggestions
                        .map(record => ({
                            name: record.name,
                            id: record.id,
                            displayText: record.name,
                            searchField: 'name'
                        }));
                } else if (searchField === 'id') {
                    suggestions = belData
                        .filter(record => record.id.toLowerCase().includes(query))
                        .slice(0, 8) // Limit to 8 suggestions
                        .map(record => ({
                            name: record.name,
                            id: record.id,
                            displayText: `${record.id} - ${record.name}`,
                            searchField: 'id'
                        }));
                }

                if (suggestions.length > 0) {
                    this.showAccountSuggestions(suggestions, query, suggestionsContainer, searchInput);
                } else {
                    this.hideAccountSuggestions(suggestionsContainer);
                }
            }, 150));

            // Keyboard navigation
            searchInput.addEventListener('keydown', (e) => {
                const suggestionItems = suggestionsContainer.querySelectorAll('.search-suggestion-item');
                
                switch (e.key) {
                    case 'ArrowDown':
                        e.preventDefault();
                        selectedIndex = Math.min(selectedIndex + 1, suggestionItems.length - 1);
                        this.highlightAccountSuggestion(suggestionItems, selectedIndex);
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        selectedIndex = Math.max(selectedIndex - 1, -1);
                        this.highlightAccountSuggestion(suggestionItems, selectedIndex);
                        break;
                    case 'Enter':
                        e.preventDefault();
                        if (selectedIndex >= 0 && suggestionItems[selectedIndex]) {
                            this.selectAccountSuggestion(suggestions[selectedIndex], searchInput);
                        } else {
                            // Apply filter with current input value - trigger rendering
                            this.resetAccountPagination();
                            this.renderCurrentView();
                        }
                        break;
                    case 'Escape':
                        this.hideAccountSuggestions(suggestionsContainer);
                        searchInput.blur();
                        break;
                }
            });

            // Click outside to hide suggestions
            document.addEventListener('click', (e) => {
                if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
                    this.hideAccountSuggestions(suggestionsContainer);
                }
            });

            // Focus event to show suggestions if there's a value
            searchInput.addEventListener('focus', () => {
                if (searchInput.value.trim().length > 0) {
                    searchInput.dispatchEvent(new Event('input'));
                }
            });
        },

        showAccountSuggestions(suggestions, query, suggestionsContainer, searchInput) {
            if (!suggestionsContainer) return;

            const html = suggestions.map((suggestion, index) => {
                if (suggestion.searchField === 'id') {
                    // For Referral ID search: Black ID, gray name
                    const highlightedId = this.highlightAccountMatch(suggestion.id, query);
                    return `
                        <div class="search-suggestion-item" data-index="${index}">
                            <div class="suggestion-id-main">${highlightedId}</div>
                            <div class="suggestion-name-sub">${suggestion.name}</div>
                        </div>
                    `;
                } else {
                    // For name search: use original format
                    const highlightedName = this.highlightAccountMatch(suggestion.name, query);
                    return `
                        <div class="search-suggestion-item" data-index="${index}">
                            <div class="suggestion-content">${highlightedName}</div>
                        </div>
                    `;
                }
            }).join('');

            suggestionsContainer.innerHTML = html;
            suggestionsContainer.classList.add('show');

            // Add click listeners to suggestion items
            suggestionsContainer.querySelectorAll('.search-suggestion-item').forEach((item, index) => {
                item.addEventListener('click', () => {
                    this.selectAccountSuggestion(suggestions[index], searchInput);
                });
            });
        },

        hideAccountSuggestions(suggestionsContainer) {
            if (suggestionsContainer) {
                suggestionsContainer.classList.remove('show');
                suggestionsContainer.innerHTML = '';
            }
        },

        highlightAccountSuggestion(items, index) {
            items.forEach((item, i) => {
                item.classList.toggle('highlighted', i === index);
            });
        },

        selectAccountSuggestion(suggestion, searchInput) {
            if (searchInput) {
                if (suggestion.searchField === 'name') {
                    searchInput.value = suggestion.name;
                } else if (suggestion.searchField === 'id') {
                    searchInput.value = suggestion.id;
                }
                const suggestionsContainer = searchInput.nextElementSibling;
                this.hideAccountSuggestions(suggestionsContainer);
                this.resetAccountPagination();
                this.renderCurrentView();
            }
        },

        highlightAccountMatch(text, query) {
            if (!query) return text;
            
            const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
            return text.replace(regex, '<mark style="background-color: var(--ds-color-primary-light-30); font-weight: var(--fw-semibold);">$1</mark>');
        },

        setupViewSwitcher() {
            const viewSwitcher = document.getElementById('account-view-switcher');
            if (!viewSwitcher) return;

            const viewButtons = viewSwitcher.querySelectorAll('.view-btn');
            const gridView = document.getElementById('account-grid-view');
            const listView = document.getElementById('account-list-view');

            viewButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const view = btn.getAttribute('data-view');
                    
                    // Update button states
                    viewButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    // Switch views
                    if (view === 'grid') {
                        gridView.style.display = 'block';
                        listView.style.display = 'none';
                        gridView.classList.add('active');
                        listView.classList.remove('active');
                        this.renderAccountCards(); // Render grid view
                    } else {
                        gridView.style.display = 'none';
                        listView.style.display = 'block';
                        gridView.classList.remove('active');
                        listView.classList.add('active');
                        this.renderAccountList(); // Render list view
                    }
                });
            });
        },

        renderCurrentView() {
            // Check which view is currently active
            const gridView = document.getElementById('account-grid-view');
            const listView = document.getElementById('account-list-view');
            
            if (gridView && gridView.style.display !== 'none') {
                // Grid view is active
                this.renderAccountCards();
            } else if (listView && listView.style.display !== 'none') {
                // List view is active
                this.renderAccountList();
            } else {
                // Default to grid view if no view is explicitly active
                this.renderAccountCards();
            }
        },

        renderAccountCards() {
            const container = document.getElementById('account-container');
            const appData = window.APP_DATA || APP_DATA;
            
            if (!container || !appData?.belProfiles?.leaderboard) {
                console.log('Account Management: Missing container or belProfiles data');
                return;
            }

            // Get filter values
            const nameFilter = document.getElementById('account-f-name')?.value.toLowerCase() || '';
            const idFilter = document.getElementById('account-f-referral-id')?.value.toLowerCase() || '';
            const levelFilter = document.getElementById('account-f-level')?.value || '';
            const regionFilter = document.getElementById('account-f-region')?.value || '';
            const sortBy = document.getElementById('account-f-sort')?.value || 'name';

            // Helper function to get country from referral ID
            const getCountryFromId = (id) => {
                const prefix = id.substring(1, 3);
                const countryNames = {
                    'TW': 'Taiwan', 'US': 'United States', 'DE': 'Germany', 'FR': 'France', 'JP': 'Japan',
                    'AU': 'Australia', 'KR': 'South Korea', 'IT': 'Italy', 'MX': 'Mexico', 'CN': 'China',
                    'CA': 'Canada', 'IN': 'India', 'NO': 'Norway', 'NL': 'Netherlands', 'BR': 'Brazil',
                    'SE': 'Sweden', 'CH': 'Switzerland', 'DK': 'Denmark', 'PL': 'Poland', 'BE': 'Belgium',
                    'SG': 'Singapore', 'TH': 'Thailand', 'MY': 'Malaysia', 'ZA': 'South Africa'
                };
                const countryMap = {
                    'TW': 'TW', 'US': 'US', 'DE': 'DE', 'FR': 'FR', 'JP': 'JP',
                    'AU': 'AU', 'KR': 'KR', 'IT': 'IT', 'MX': 'MX', 'CN': 'CN',
                    'CA': 'CA', 'IN': 'IN', 'NO': 'NO', 'NL': 'NL', 'BR': 'BR',
                    'SE': 'SE', 'CH': 'CH', 'DA': 'DK', 'PL': 'PL', 'BE': 'BE',
                    'SG': 'SG', 'TH': 'TH', 'MY': 'MY', 'ZA': 'ZA'
                };
                const countryCode = countryMap[prefix] || 'US';
                return countryNames[countryCode] || 'United States';
            };

            // 使用現有的 leaderboard 資料來渲染帳戶卡片
            let accountData = appData.belProfiles.leaderboard.map(account => {
                const country = getCountryFromId(account.id);
                
                // Calculate yearly cumulative data (defaults to 2025)
                const yearlyData = AccountManagement.calculateYearlyData(account);
                
                return {
                    referralId: account.id,
                    name: account.name,
                    level: account.level,
                    clicks: yearlyData.clicks,
                    orders: yearlyData.orders,
                    revenue: yearlyData.revenue,
                    c20cvr: yearlyData.clicks > 0 ? parseFloat(((yearlyData.orders / yearlyData.clicks) * 100).toFixed(2)) : 0,
                    aov: yearlyData.orders > 0 ? yearlyData.revenue / yearlyData.orders : 0,
                    email: account.email,
                    country: country,
                    region: utils.getRegionFromCountry(country)
                };
            });

            // Apply filters
            if (nameFilter) {
                accountData = accountData.filter(account => 
                    account.name.toLowerCase().includes(nameFilter)
                );
            }
            if (idFilter) {
                accountData = accountData.filter(account => 
                    account.referralId.toLowerCase().includes(idFilter)
                );
            }
            if (levelFilter) {
                accountData = accountData.filter(account => 
                    account.level === levelFilter
                );
            }
            if (regionFilter) {
                accountData = accountData.filter(account => 
                    account.region === regionFilter
                );
            }

            // Apply sorting
            accountData.sort((a, b) => {
                switch (sortBy) {
                    case 'name':
                        return a.name.localeCompare(b.name);
                    case 'id':
                        return a.referralId.localeCompare(b.referralId);
                    case 'level':
                        // Sort by level hierarchy: Leader > Exploder > Enabler > Builder
                        const levelOrder = { 'Leader': 4, 'Exploder': 3, 'Enabler': 2, 'Builder': 1 };
                        return (levelOrder[b.level] || 0) - (levelOrder[a.level] || 0);
                    case 'orders':
                        return b.orders - a.orders; // Descending order
                    case 'clicks':
                        return b.clicks - a.clicks; // Descending order
                    case 'revenue':
                        return b.revenue - a.revenue; // Descending order
                    default:
                        return a.name.localeCompare(b.name);
                }
            });

            // Apply pagination
            const totalCards = accountData.length;
            const startIndex = (appState.accountGridPage - 1) * appState.accountGridRowsPerPage;
            const endIndex = Math.min(startIndex + appState.accountGridRowsPerPage, totalCards);
            const paginatedData = accountData.slice(startIndex, endIndex);

            container.innerHTML = '';
            
            // Show message if no results
            if (totalCards === 0) {
                container.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #666;">No accounts found matching the current filters.</div>';
                this.updateAccountGridPaginationUI(0, 0, 0);
                return;
            }

            paginatedData.forEach(account => {
                const card = document.createElement('div');
                card.className = 'bel-acct-mgmt-card flex flex-col space-y-4';
                card.style.cursor = 'pointer';
                card.setAttribute('data-account-id', account.referralId);

                card.innerHTML = `
                    <!-- Main user info -->
                    <div class="flex items-center space-x-4">
                        ${utils.generateAvatarHTMLPlaceholder(account.referralId, 48)}
                        <div class="flex-1 min-w-0">
                            <!-- Name and level pill -->
                            <div class="flex items-center space-x-2">
                                <h2 class="bel-acct-mgmt-text-xl-var flex-1 whitespace-nowrap overflow-hidden text-ellipsis">${account.name}</h2>
                                <span class="bel-acct-mgmt-level-${account.level.toLowerCase()}">
                                    ${account.level}
                                </span>
                            </div>
                            <p class="bel-acct-mgmt-text-xs-var">${account.referralId}</p>
                        </div>
                    </div>

                    <!-- Metrics container -->
                    <div class="flex flex-col space-y-2 mt-4 text-sm">
                        <div class="flex items-center justify-between">
                            <span class="flex items-center space-x-1">
                                <span class="bel-acct-mgmt-text-clicks-var">${account.clicks.toLocaleString()}</span>
                                <span class="bel-acct-mgmt-text-xs-var">Clicks</span>
                            </span>
                            <span class="flex items-center space-x-1">
                                <span class="bel-acct-mgmt-text-orders-var">${account.orders.toLocaleString()}</span>
                                <span class="bel-acct-mgmt-text-xs-var">Orders</span>
                            </span>
                            <span class="flex items-center space-x-1">
                                <span class="bel-acct-mgmt-text-cvr-var">${account.c20cvr.toFixed(2)}%</span>
                                <span class="bel-acct-mgmt-text-xs-var">C2O CVR</span>
                            </span>
                        </div>
                    </div>

                    <!-- Email at the bottom -->
                    <div class="flex flex-col mt-4 pt-4" style="border-top: 1px solid var(--ot-color-gray-45);">
                        <div class="flex items-center justify-start mb-2">
                            <i class="fas fa-envelope bel-acct-mgmt-text-gray-40-var mr-2"></i>
                            <a href="mailto:${account.email}" style="font-size: var(--fs-sm); color: var(--ds-color-gray-70); font-weight: var(--fw-normal); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; min-width: 0;" onclick="event.stopPropagation();">${account.email}</a>
                        </div>
                    </div>
                `;
                container.appendChild(card);
            });

            // Update pagination UI
            this.updateAccountGridPaginationUI(totalCards, startIndex, endIndex);

            // 添加點擊事件處理
            this.setupAccountCardEvents();
        },

        setupAccountCardEvents() {
            const accountCards = document.querySelectorAll('.bel-acct-mgmt-card');
            accountCards.forEach(card => {
                card.addEventListener('click', (e) => {
                    // 防止子元素的事件冒泡（如email鏈接）
                    const accountId = card.getAttribute('data-account-id');
                    // 觸發現有的BEL詳情模態框
                    const accountData = APP_DATA.belProfiles.leaderboard.find(account => account.id === accountId);
                    if (accountData) {
                        // 使用現有的模態框邏輯
                        BELModal.openModal(accountData.id);
                    }
                });
            });
        },

        renderAccountList() {
            const tableBody = document.querySelector('#account-list-table tbody');
            const appData = window.APP_DATA || APP_DATA;
            if (!tableBody || !appData?.belProfiles?.leaderboard) return;

            // Get filter values (same logic as grid view)
            const nameFilter = document.getElementById('account-f-name')?.value.toLowerCase() || '';
            const idFilter = document.getElementById('account-f-referral-id')?.value.toLowerCase() || '';
            const levelFilter = document.getElementById('account-f-level')?.value || '';
            const regionFilter = document.getElementById('account-f-region')?.value || '';
            const sortBy = document.getElementById('account-f-sort')?.value || 'name';

            // 將國碼轉換為國家名稱的輔助函數
            const getCountryFromId = (id) => {
                const prefix = id.substring(1, 3);
                const countryNames = {
                    'TW': 'Taiwan', 'US': 'United States', 'DE': 'Germany', 'FR': 'France', 'JP': 'Japan',
                    'AU': 'Australia', 'KR': 'South Korea', 'IT': 'Italy', 'MX': 'Mexico', 'CN': 'China',
                    'CA': 'Canada', 'IN': 'India', 'NO': 'Norway', 'NL': 'Netherlands', 'BR': 'Brazil',
                    'SE': 'Sweden', 'CH': 'Switzerland', 'DK': 'Denmark', 'PL': 'Poland', 'BE': 'Belgium',
                    'SG': 'Singapore', 'TH': 'Thailand', 'MY': 'Malaysia', 'ZA': 'South Africa'
                };
                const countryMap = {
                    'TW': 'TW', 'US': 'US', 'DE': 'DE', 'FR': 'FR', 'JP': 'JP',
                    'AU': 'AU', 'KR': 'KR', 'IT': 'IT', 'MX': 'MX', 'CN': 'CN',
                    'CA': 'CA', 'IN': 'IN', 'NO': 'NO', 'NL': 'NL', 'BR': 'BR',
                    'SE': 'SE', 'CH': 'CH', 'DA': 'DK', 'PL': 'PL', 'BE': 'BE',
                    'SG': 'SG', 'TH': 'TH', 'MY': 'MY', 'ZA': 'ZA'
                };
                const countryCode = countryMap[prefix] || 'US';
                return countryNames[countryCode] || 'United States';
            };

            // 使用現有的 leaderboard 資料來渲染帳戶列表
            let accountData = appData.belProfiles.leaderboard.map(account => {
                const country = getCountryFromId(account.id);
                
                // Calculate yearly cumulative data (defaults to 2025)
                const yearlyData = AccountManagement.calculateYearlyData(account);
                
                return {
                    referralId: account.id,
                    name: account.name,
                    level: account.level,
                    clicks: yearlyData.clicks,
                    orders: yearlyData.orders,
                    revenue: yearlyData.revenue,
                    c20cvr: yearlyData.clicks > 0 ? parseFloat(((yearlyData.orders / yearlyData.clicks) * 100).toFixed(2)) : 0,
                    aov: yearlyData.orders > 0 ? yearlyData.revenue / yearlyData.orders : 0,
                    email: account.email,
                    country: country,
                    region: utils.getRegionFromCountry(country)
                };
            });

            // Apply filters (same logic as grid view)
            if (nameFilter) {
                accountData = accountData.filter(account => 
                    account.name.toLowerCase().includes(nameFilter)
                );
            }
            if (idFilter) {
                accountData = accountData.filter(account => 
                    account.referralId.toLowerCase().includes(idFilter)
                );
            }
            if (levelFilter) {
                accountData = accountData.filter(account => 
                    account.level === levelFilter
                );
            }
            if (regionFilter) {
                accountData = accountData.filter(account => 
                    account.region === regionFilter
                );
            }

            // Apply sorting (same logic as grid view)
            accountData.sort((a, b) => {
                switch (sortBy) {
                    case 'name':
                        return a.name.localeCompare(b.name);
                    case 'id':
                        return a.referralId.localeCompare(b.referralId);
                    case 'level':
                        // Sort by level hierarchy: Leader > Exploder > Enabler > Builder
                        const levelOrder = { 'Leader': 4, 'Exploder': 3, 'Enabler': 2, 'Builder': 1 };
                        return (levelOrder[b.level] || 0) - (levelOrder[a.level] || 0);
                    case 'orders':
                        return b.orders - a.orders; // Descending order
                    case 'clicks':
                        return b.clicks - a.clicks; // Descending order
                    case 'revenue':
                        return b.revenue - a.revenue; // Descending order
                    case 'c20cvr':
                        return b.c20cvr - a.c20cvr; // Descending order
                    case 'aov':
                        return parseFloat(b.aov.replace(/[$,]/g, '')) - parseFloat(a.aov.replace(/[$,]/g, '')); // Descending order
                    case 'region':
                        return a.region.localeCompare(b.region); // Ascending order
                    default:
                        return a.name.localeCompare(b.name);
                }
            });

            // Apply pagination
            const totalRows = accountData.length;
            const startIndex = (appState.accountListPage - 1) * appState.accountListRowsPerPage;
            const endIndex = Math.min(startIndex + appState.accountListRowsPerPage, totalRows);
            const paginatedData = accountData.slice(startIndex, endIndex);

            tableBody.innerHTML = '';
            
            // Show message if no results
            if (totalRows === 0) {
                tableBody.innerHTML = '<tr><td colspan="10" style="text-align: center; padding: 2rem; color: #666;">No accounts found matching the current filters.</td></tr>';
                this.updateAccountListPaginationUI(0, 0, 0);
                return;
            }

            paginatedData.forEach(account => {
                const row = document.createElement('tr');
                row.style.cursor = 'pointer';
                row.setAttribute('data-account-id', account.referralId);
                
                row.innerHTML = `
                    <td><a href="#" class="bel-id-link">${account.referralId}</a></td>
                    <td>${account.name}</td>
                    <td><span class="bel-badge ${account.level.toLowerCase()}">${account.level}</span></td>
                    <td style="text-align: right;">${account.clicks.toLocaleString()}</td>
                    <td style="text-align: right;">${account.orders.toLocaleString()}</td>
                    <td style="text-align: right;">$${account.revenue.toLocaleString()}</td>
                    <td style="text-align: right;">${account.c20cvr.toFixed(2)}%</td>
                    <td style="text-align: right;">${utils.formatMoney(account.aov, 2)}</td>
                    <td>${account.region}</td>
                    <td>${account.country}</td>
                `;

                tableBody.appendChild(row);
            });

            // Update pagination UI
            this.updateAccountListPaginationUI(totalRows, startIndex, endIndex);

            // 添加點擊事件處理
            this.setupAccountListEvents();
        },

        updateAccountGridPaginationUI(total, startIndex, endIndex) {
            const rangeLabel = document.getElementById('account-grid-range-label');
            const prevBtn = document.getElementById('account-grid-prev-page');
            const nextBtn = document.getElementById('account-grid-next-page');
            const rowsSelect = document.getElementById('account-grid-rows-per-page');

            if (rangeLabel) {
                const from = total === 0 ? 0 : startIndex + 1;
                const to = endIndex;
                rangeLabel.textContent = `${from}–${to} of ${total}`;
            }

            if (prevBtn) {
                prevBtn.disabled = appState.accountGridPage === 1;
            }

            if (nextBtn) {
                nextBtn.disabled = endIndex >= total;
            }

            if (rowsSelect) {
                const availableOptions = ['6', '12', '24'];
                const currentValue = appState.accountGridRowsPerPage.toString();
                rowsSelect.value = availableOptions.includes(currentValue) ? currentValue : '12';
            }
        },

        updateAccountListPaginationUI(total, startIndex, endIndex) {
            const rangeLabel = document.getElementById('account-list-range-label');
            const prevBtn = document.getElementById('account-list-prev-page');
            const nextBtn = document.getElementById('account-list-next-page');
            const rowsSelect = document.getElementById('account-list-rows-per-page');

            if (rangeLabel) {
                const from = total === 0 ? 0 : startIndex + 1;
                const to = endIndex;
                rangeLabel.textContent = `${from}–${to} of ${total}`;
            }

            if (prevBtn) {
                prevBtn.disabled = appState.accountListPage === 1;
            }

            if (nextBtn) {
                nextBtn.disabled = endIndex >= total;
            }

            if (rowsSelect) {
                const availableOptions = ['5', '10', '20'];
                const currentValue = appState.accountListRowsPerPage.toString();
                rowsSelect.value = availableOptions.includes(currentValue) ? currentValue : '10';
            }
        },

        setupAccountPagination() {
            // Grid view pagination
            const gridPrevBtn = document.getElementById('account-grid-prev-page');
            const gridNextBtn = document.getElementById('account-grid-next-page');
            const gridRowsSelect = document.getElementById('account-grid-rows-per-page');

            if (gridPrevBtn) {
                gridPrevBtn.addEventListener('click', () => {
                    if (appState.accountGridPage > 1) {
                        appState.accountGridPage--;
                        this.renderAccountCards();
                    }
                });
            }

            if (gridNextBtn) {
                gridNextBtn.addEventListener('click', () => {
                    appState.accountGridPage++;
                    this.renderAccountCards();
                });
            }

            if (gridRowsSelect) {
                gridRowsSelect.addEventListener('change', (e) => {
                    appState.accountGridRowsPerPage = parseInt(e.target.value, 10);
                    appState.accountGridPage = 1; // Reset to first page
                    this.renderAccountCards();
                });
            }

            // List view pagination
            const listPrevBtn = document.getElementById('account-list-prev-page');
            const listNextBtn = document.getElementById('account-list-next-page');
            const listRowsSelect = document.getElementById('account-list-rows-per-page');

            if (listPrevBtn) {
                listPrevBtn.addEventListener('click', () => {
                    if (appState.accountListPage > 1) {
                        appState.accountListPage--;
                        this.renderAccountList();
                    }
                });
            }

            if (listNextBtn) {
                listNextBtn.addEventListener('click', () => {
                    appState.accountListPage++;
                    this.renderAccountList();
                });
            }

            if (listRowsSelect) {
                listRowsSelect.addEventListener('change', (e) => {
                    appState.accountListRowsPerPage = parseInt(e.target.value, 10);
                    appState.accountListPage = 1; // Reset to first page
                    this.renderAccountList();
                });
            }
        },

        setupAccountListEvents() {
            const accountRows = document.querySelectorAll('#account-list-table tbody tr[data-account-id]');
            accountRows.forEach(row => {
                row.addEventListener('click', (e) => {
                    // 允許點擊連結正常工作，但防止ID連結觸發模態框
                    if (e.target.closest('a.bel-id-link')) return;
                    
                    const accountId = row.getAttribute('data-account-id');
                    // 觸發現有的BEL詳情模態框
                    const accountData = APP_DATA.belProfiles.leaderboard.find(account => account.id === accountId);
                    if (accountData) {
                        BELModal.openModal(accountData.id);
                    }
                });
            });
        },

        injectPayoutsAndOrders() {
            const payoutsOrderRoot = document.getElementById('payouts-order');
            if (!payoutsOrderRoot) return;

            payoutsOrderRoot.innerHTML = `
                <h1 class="bel-h1">Payouts & Orders</h1>
                <div class="bel-panel" id="payouts-history-panel">
                    <div class="panel-header">
                        <h3 style="margin:0;">Payout History 
                            <span class="bel-badge approved" style="margin-left:4px;">${APP_DATA.payouts.payoutDayMessage}</span>
                        </h3>
                    </div>
                    <div class="scrollable-table-container">
                        <table class="bel-table" id="payout-history-table">
                            <thead>
                                <tr>
                                    <th data-sortable data-type="string">Payout Date</th>
                                    <th data-sortable data-type="number">Payout Total</th>
                                    <th data-sortable data-type="number">BEL Count</th>
                                    <th>View Detail</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>
                
                <div class="bel-panel" id="order-tracking-panel-payout" style="margin-top: 20px;">
                    <div class="panel-header">
                        <h3 style="margin:0;">Order Tracking</h3>
                    </div>
                    <div class="scrollable-table-container">
                        <table class="bel-table" id="order-tracking-table-payout">
                            <thead>
                                <tr>
                                    <th data-sortable data-type="string">Order Placed</th>
                                    <th data-sortable data-type="string">Order Number</th>
                                    <th data-sortable data-type="string">Referral ID</th>
                                    <th data-sortable data-type="string">BEL Name</th>
                                    <th data-sortable data-type="number">Order Amount</th>
                                    <th data-sortable data-type="string">Status</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                    <div class="pagination-bar">
                        <div class="rows-select">
                            <label for="order-rows-per-page-payout">Rows per page</label>
                            <select id="order-rows-per-page-payout" class="bel-select" style="width: 70px;">
                                <option>5</option>
                                <option selected>10</option>
                                <option>20</option>
                            </select>
                        </div>
                        <div class="pagination-controls">
                            <span id="order-range-label-payout" class="text-muted">0–0 of 0</span>
                            <button class="bel-btn secondary" id="order-prev-page-payout" aria-label="Previous page">
                                <i class="fas fa-chevron-left"></i>
                            </button>
                            <button class="bel-btn secondary" id="order-next-page-payout" aria-label="Next page">
                                <i class="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;

            // Render data after DOM injection
            setTimeout(() => {
                this.renderPayoutHistory();
                this.renderOrdersInPayout();
                this.setupOrdersPaginationForPayout();
            }, 0);
        },

        injectContent() {
            const contentRoot = document.getElementById('content');
            if (!contentRoot) return;

            contentRoot.innerHTML = `
                <h1 class="bel-h1">Publish Resources</h1>
                <div class="bel-panel" id="content-mgmt-panel">
                    <div class="panel-header">
                        <h3 style="margin:0;">Content Management</h3>
                        <button class="bel-btn primary" id="asset-add-btn">
                            <i class="fas fa-plus"></i> Add Asset
                        </button>
                    </div>
                    <div class="scrollable-table-container">
                        <table class="bel-table" id="asset-table">
                            <thead>
                                <tr>
                                    <th data-sortable data-type="string">Upload Date</th>
                                    <th data-sortable data-type="string">Title</th>
                                    <th data-sortable data-type="string">Subtitle</th>
                                    <th data-sortable data-type="string">Category</th>
                                    <th data-sortable data-type="string">Page Link URL</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>
            `;

            setTimeout(() => this.renderAssets(), 0);
        },

        injectContactSupport() {
            const contactSupportRoot = document.getElementById('contact-support');
            if (!contactSupportRoot) return;

            contactSupportRoot.innerHTML = `
                <h1 class="bel-h1">Respond to Leader</h1>
                
                <!-- Open Tickets Table -->
                <div class="bel-panel" id="open-tickets-panel">
                    <div class="panel-header">
                        <h3 style="margin:0;">Open Tickets</h3>
                        <button class="bel-btn secondary" id="view-history-tickets-btn">
                            <i class="fas fa-history"></i> View History Tickets
                        </button>
                    </div>
                    <div class="scrollable-table-container">
                        <table class="bel-table" id="open-tickets-table">
                            <thead>
                                <tr>
                                    <th data-sortable data-type="string">Ticket #</th>
                                    <th data-sortable data-type="string">BEL Name</th>
                                    <th data-sortable data-type="string">Referral ID</th>
                                    <th data-sortable data-type="string">Subject</th>
                                    <th data-sortable data-type="string">Status</th>
                                    <th>View Detail</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>

                <!-- System Announcements Panel -->
                <div class="bel-panel" id="announcements-panel" style="margin-top: 20px;">
                    <div class="panel-header">
                        <h3 style="margin:0;">System Announcements</h3>
                        <button class="bel-btn primary" id="send-announcement-btn-new">
                            <i class="fas fa-bullhorn"></i> Send Announcement
                        </button>
                    </div>
                    <div class="scrollable-table-container">
                        <table class="bel-table" id="announcements-table">
                            <thead>
                                <tr>
                                    <th data-sortable data-type="string">Created</th>
                                    <th data-sortable data-type="string">Category</th>
                                    <th data-sortable data-type="string">Title</th>
                                    <th data-sortable data-type="string">Body</th>
                                    <th data-sortable data-type="string">Link</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>
            `;

            setTimeout(() => {
                this.renderContactSupportTickets();
                this.renderAnnouncementsNew();
            }, 0);
        },

        renderPayoutHistory() {
            const tableBody = document.querySelector('#payout-history-table tbody');
            if (!tableBody) return;
            
            const payouts = APP_DATA.payouts.history;
            tableBody.innerHTML = payouts.map(payout => `
                <tr>
                    <td>${payout.date}</td>
                    <td>${utils.formatMoney(payout.total, 2)}</td>
                    <td>${payout.belCount}</td>
                    <td>
                        <button class="bel-btn-s secondary payout-view-btn" data-payout-date="${payout.date}">
                            <i class="fas fa-eye"></i> View Detail
                        </button>
                    </td>
                </tr>
            `).join('');

            // Apply sorting to payout history table
            const payoutTable = document.getElementById('payout-history-table');
            if (payoutTable) {
                TableUtils.makeTableSortable(payoutTable);
            }
        },

        renderOrdersInPayout() {
            const tableBody = document.querySelector('#order-tracking-table-payout tbody');
            if (!tableBody) return;
            
            const orders = APP_DATA.orders.history;
            const totalOrders = orders.length;
            const startIndex = (appState.orderPagePayout - 1) * appState.orderRowsPerPagePayout;
            const endIndex = Math.min(startIndex + appState.orderRowsPerPagePayout, totalOrders);
            const paginatedOrders = orders.slice(startIndex, endIndex);
            
            tableBody.innerHTML = paginatedOrders.map(order => {
                let statusClass = 'processing';
                if (order.status === 'Completed') statusClass = 'completed';
                else if (order.status === 'Canceled') statusClass = 'danger';
                else if (order.status === 'Processing') statusClass = 'processing';
                
                return `
                    <tr>
                        <td>${order.orderDate}</td>
                        <td>${order.orderNumber}</td>
                        <td><a href="#" class="referral-id-link" data-referral-id="${order.referralId}">${order.referralId}</a></td>
                        <td>${order.belName}</td>
                        <td>${utils.formatCurrency(order.amount, order.currency)}</td>
                        <td><span class="bel-badge ${statusClass}">${order.status}</span></td>
                    </tr>
                `;
            }).join('');

            // Update pagination UI
            this.updateOrdersPaginationUIForPayout(totalOrders, startIndex, endIndex);

            // Apply sorting to order tracking table
            const orderTable = document.getElementById('order-tracking-table-payout');
            if (orderTable) {
                TableUtils.makeTableSortable(orderTable);
            }
        },

        updateOrdersPaginationUIForPayout(totalOrders, startIndex, endIndex) {
            const rangeLabel = document.getElementById('order-range-label-payout');
            const prevBtn = document.getElementById('order-prev-page-payout');
            const nextBtn = document.getElementById('order-next-page-payout');
            const rowsSelect = document.getElementById('order-rows-per-page-payout');

            if (rangeLabel) {
                const from = totalOrders === 0 ? 0 : startIndex + 1;
                const to = endIndex;
                rangeLabel.textContent = `${from}–${to} of ${totalOrders} orders`;
            }

            if (prevBtn) {
                prevBtn.disabled = appState.orderPagePayout === 1;
            }

            if (nextBtn) {
                nextBtn.disabled = endIndex >= totalOrders;
            }

            if (rowsSelect) {
                // Set the selected value based on current appState, default to 10 if not available
                const availableOptions = ['5', '10', '20'];
                const currentValue = appState.orderRowsPerPagePayout.toString();
                rowsSelect.value = availableOptions.includes(currentValue) ? currentValue : '10';
            }
        },

        setupOrdersPaginationForPayout() {
            const prevBtn = document.getElementById('order-prev-page-payout');
            const nextBtn = document.getElementById('order-next-page-payout');
            const rowsSelect = document.getElementById('order-rows-per-page-payout');

            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    if (appState.orderPagePayout > 1) {
                        appState.orderPagePayout--;
                        this.renderOrdersInPayout();
                    }
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    const totalOrders = APP_DATA.orders.history.length;
                    const maxPage = Math.ceil(totalOrders / appState.orderRowsPerPagePayout);
                    if (appState.orderPagePayout < maxPage) {
                        appState.orderPagePayout++;
                        this.renderOrdersInPayout();
                    }
                });
            }

            if (rowsSelect) {
                rowsSelect.addEventListener('change', (e) => {
                    appState.orderRowsPerPagePayout = parseInt(e.target.value, 10);
                    appState.orderPagePayout = 1; // Reset to first page
                    this.renderOrdersInPayout();
                });
            }
        },

        renderAssets() {
            const tableBody = document.querySelector('#asset-table tbody');
            if (!tableBody) return;
            
            const assets = APP_DATA.content.assets;
            tableBody.innerHTML = assets.map((asset, index) => {
                const categoryClass = asset.category === 'IoTMart Campaign' ? 'iotmart' : 'advantech';
                return `
                <tr data-asset-id="asset-${index}">
                    <td>${asset.uploadDate}</td>
                    <td>${asset.title}</td>
                    <td class="subtitle-cell">${asset.subtitle}</td>
                    <td><span class="bel-badge ${categoryClass}">${asset.category || 'Uncategorized'}</span></td>
                    <td class="pagelink-cell"><a href="${asset.pageLink}" target="_blank" class="referral-id-link">${asset.pageLink}</a></td>
                    <td><button class="bel-btn-s secondary asset-edit-btn" data-asset-id="asset-${index}"><i class="fas fa-edit"></i> Edit</button></td>
                    <td><button class="bel-btn-s danger asset-delete-btn" data-asset-id="asset-${index}"><i class="fas fa-trash"></i> Delete</button></td>
                </tr>
                `;
            }).join('');

            // Apply sorting to assets table
            const assetTable = document.getElementById('asset-table');
            if (assetTable) {
                TableUtils.makeTableSortable(assetTable);
            }
        },

        renderContactSupportTickets() {
            const openTableBody = document.querySelector('#open-tickets-table tbody');
            if (!openTableBody) return;
            
            const tickets = APP_DATA.contactSupport.tickets;
            
            // Separate tickets into open and history
            const openTickets = tickets.filter(ticket => ticket.status === 'Open');
            
            // Render open tickets (no pagination)
            openTableBody.innerHTML = openTickets.map(ticket => `
                <tr>
                    <td>${ticket.ticketNumber}</td>
                    <td>${ticket.belName}</td>
                    <td><a href="#" class="referral-id-link" data-referral-id="${ticket.referralId}">${ticket.referralId}</a></td>
                    <td>${ticket.subject}</td>
                    <td><span class="bel-badge pending">${ticket.status}</span></td>
                    <td>
                        <button class="bel-btn-s secondary support-view-btn" data-ticket-id="${ticket.ticketNumber}">
                            <i class="fas fa-eye"></i> View Detail
                        </button>
                    </td>
                </tr>
            `).join('');

            // Apply sorting to open tickets table
            const openTicketsTable = document.getElementById('open-tickets-table');
            if (openTicketsTable) {
                TableUtils.makeTableSortable(openTicketsTable);
            }
        },

        ensureHistoryTicketsModal() {
            if (this.historyTicketsModalEl) return this.historyTicketsModalEl;
            
            const wrap = document.createElement('div');
            wrap.className = 'modal-overlay';
            wrap.id = 'history-tickets-modal';
            wrap.innerHTML = `
                <div class="modal-content" style="max-width:1200px;">
                    <div class="modal-header">
                        <h3 style="margin:0;">History Tickets</h3>
                        <button class="close-button" aria-label="Close">&times;</button>
                    </div>
                    <div class="modal-body-grid" style="grid-template-columns: 1fr;">
                        <div>
                            <div class="scrollable-table-container">
                                <table class="bel-table" id="history-tickets-modal-table">
                                    <thead>
                                        <tr>
                                            <th data-sortable data-type="string">Ticket #</th>
                                            <th data-sortable data-type="string">BEL Name</th>
                                            <th data-sortable data-type="string">Referral ID</th>
                                            <th data-sortable data-type="string">Subject</th>
                                            <th data-sortable data-type="string">Status</th>
                                            <th>View Detail</th>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                            <!-- Pagination for History Tickets Modal -->
                            <div class="pagination-bar" style="margin-top: 16px;">
                                <div class="rows-select">
                                    <label for="history-modal-rows-per-page">Rows per page</label>
                                    <select id="history-modal-rows-per-page" class="bel-select" style="width: 70px;">
                                        <option>5</option>
                                        <option selected>10</option>
                                        <option>20</option>
                                    </select>
                                </div>
                                <div class="pagination-controls">
                                    <span id="history-modal-range-label" class="text-muted">0–0 of 0</span>
                                    <button class="bel-btn secondary" id="history-modal-prev-page" aria-label="Previous page">
                                        <i class="fas fa-chevron-left"></i>
                                    </button>
                                    <button class="bel-btn secondary" id="history-modal-next-page" aria-label="Next page">
                                        <i class="fas fa-chevron-right"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(wrap);
            this.historyTicketsModalEl = wrap;

            const close = () => this.historyTicketsModalEl.classList.remove('show');
            this.historyTicketsModalEl.querySelector('.close-button')?.addEventListener('click', close);
            this.historyTicketsModalEl.addEventListener('click', (e) => { 
                if (e.target === this.historyTicketsModalEl) close(); 
            });

            // Setup pagination for the modal
            this.setupHistoryTicketsModalPagination();

            return this.historyTicketsModalEl;
        },

        setupHistoryTicketsModalPagination() {
            // Setup event listeners for history tickets modal pagination
            const historyRowsPerPageSelect = document.getElementById('history-modal-rows-per-page');
            const historyPrevBtn = document.getElementById('history-modal-prev-page');
            const historyNextBtn = document.getElementById('history-modal-next-page');
            
            if (historyRowsPerPageSelect) {
                historyRowsPerPageSelect.addEventListener('change', () => {
                    appState.historyTicketsRowsPerPage = parseInt(historyRowsPerPageSelect.value, 10) || 10;
                    appState.historyTicketsPage = 1;
                    this.renderHistoryTicketsModal();
                });
            }
            
            if (historyPrevBtn) {
                historyPrevBtn.addEventListener('click', () => {
                    if (appState.historyTicketsPage > 1) {
                        appState.historyTicketsPage--;
                        this.renderHistoryTicketsModal();
                    }
                });
            }
            
            if (historyNextBtn) {
                historyNextBtn.addEventListener('click', () => {
                    const tickets = APP_DATA.contactSupport.tickets;
                    const allHistoryTickets = tickets.filter(ticket => ticket.status === 'Closed');
                    const total = allHistoryTickets.length;
                    if (appState.historyTicketsPage * appState.historyTicketsRowsPerPage < total) {
                        appState.historyTicketsPage++;
                        this.renderHistoryTicketsModal();
                    }
                });
            }
        },

        renderHistoryTicketsModal() {
            const modalTableBody = document.querySelector('#history-tickets-modal-table tbody');
            if (!modalTableBody) return;
            
            const tickets = APP_DATA.contactSupport.tickets;
            const allHistoryTickets = tickets.filter(ticket => ticket.status === 'Closed');
            
            // Implement pagination for history tickets modal
            const historyTotal = allHistoryTickets.length;
            const historyStartIndex = (appState.historyTicketsPage - 1) * appState.historyTicketsRowsPerPage;
            const historyPageItems = allHistoryTickets.slice(historyStartIndex, historyStartIndex + appState.historyTicketsRowsPerPage);
            
            // Render history tickets with pagination
            modalTableBody.innerHTML = historyPageItems.map(ticket => `
                <tr>
                    <td>${ticket.ticketNumber}</td>
                    <td>${ticket.belName}</td>
                    <td><a href="#" class="referral-id-link" data-referral-id="${ticket.referralId}">${ticket.referralId}</a></td>
                    <td>${ticket.subject}</td>
                    <td><span class="bel-badge completed">${ticket.status}</span></td>
                    <td>
                        <button class="bel-btn-s secondary support-view-btn" data-ticket-id="${ticket.ticketNumber}">
                            <i class="fas fa-eye"></i> View Detail
                        </button>
                    </td>
                </tr>
            `).join('');

            // Update pagination UI for history tickets modal
            this.updateHistoryTicketsModalPaginationUI(historyTotal, historyStartIndex, historyPageItems);

            // Apply sorting to modal table
            const historyTicketsModalTable = document.getElementById('history-tickets-modal-table');
            if (historyTicketsModalTable) {
                TableUtils.makeTableSortable(historyTicketsModalTable);
            }
        },

        updateHistoryTicketsModalPaginationUI(total, startIndex, pageItems) {
            const historyRangeLabel = document.getElementById('history-modal-range-label');
            const historyPrevBtn = document.getElementById('history-modal-prev-page');
            const historyNextBtn = document.getElementById('history-modal-next-page');
            
            if (historyRangeLabel) {
                const from = total === 0 ? 0 : startIndex + 1;
                const to = Math.min(startIndex + appState.historyTicketsRowsPerPage, total);
                historyRangeLabel.textContent = `${from}–${to} of ${total}`;
            }
            
            if (historyPrevBtn) {
                historyPrevBtn.disabled = appState.historyTicketsPage === 1;
            }
            
            if (historyNextBtn) {
                const to = Math.min(startIndex + appState.historyTicketsRowsPerPage, total);
                historyNextBtn.disabled = to >= total;
            }
        },

        openHistoryTicketsModal() {
            const modal = this.ensureHistoryTicketsModal();
            this.renderHistoryTicketsModal();
            modal.style.zIndex = this.getNextModalZIndex();
            modal.classList.add('show');
        },

        getCategoryBadgeClass(category) {
            switch(category) {
                case 'System':
                    return 'system-badge';
                case 'Policy Update':
                    return 'policy-update-badge';
                case 'Payout Reminder':
                    return 'payout-reminder-badge';
                case 'Campaign Launch':
                    return 'campaign-launch-badge';
                case 'Important':
                    return 'important-badge';
                default:
                    return 'secondary-color';
            }
        },

        getNotificationTagClass(category) {
            switch(category) {
                case 'System':
                    return 'system';
                case 'Policy Update':
                    return 'policy';
                case 'Payout Reminder':
                    return 'payout';
                case 'Campaign Launch':
                    return 'campaign';
                case 'Important':
                    return 'important';
                default:
                    return '';
            }
        },

        renderAnnouncementsNew() {
            const tableBody = document.querySelector('#announcements-table tbody');
            if (!tableBody) return;
            
            const announcements = APP_DATA.announcements.announcements;
            tableBody.innerHTML = announcements.map(ann => `
                <tr>
                    <td>${ann.created}</td>
                    <td><span class="bel-badge ${this.getCategoryBadgeClass(ann.category)}">${ann.category}</span></td>
                    <td>${ann.title}</td>
                    <td>${ann.body}</td>
                    <td><a href="${ann.link}" target="_blank" class="referral-id-link">${ann.link}</a></td>
                </tr>
            `).join('');

            // Apply sorting to announcements table
            const announcementsTable = document.getElementById('announcements-table');
            if (announcementsTable) {
                TableUtils.makeTableSortable(announcementsTable);
            }
        },

        ensurePayoutModal() {
            if (this.payoutModalEl) return this.payoutModalEl;
            
            const wrap = document.createElement('div');
            wrap.className = 'modal-overlay';
            wrap.id = 'payout-detail-modal';
            wrap.innerHTML = `
                <div class="modal-content" style="max-width:1100px;">
                    <div class="modal-header">
                        <h3 style="margin:0;">Payout Detail</h3>
                        <button class="close-button" aria-label="Close">&times;</button>
                    </div>
                    <div class="modal-body-grid" style="grid-template-columns: 1fr;">
                        <div>
                            <div style="margin-bottom:12px;">
                                <span id="payout-modal-date" class="bel-badge approved">Date: —</span>
                                <span id="payout-modal-total" class="bel-badge processing" style="margin-left:8px;">Total: —</span>
                                <span id="payout-modal-count" class="bel-badge completed" style="margin-left:8px;">BEL: —</span>
                            </div>
                            <div class="scrollable-table-container">
                                <table class="bel-table" id="payout-detail-table">
                                    <thead>
                                        <tr>
                                            <th data-sortable data-type="string">Payout ID</th>
                                            <th data-sortable data-type="string">Referral ID</th>
                                            <th data-sortable data-type="string">Name</th>
                                            <th data-sortable data-type="number">Gross</th>
                                            <th data-sortable data-type="number">Fees</th>
                                            <th data-sortable data-type="number">Tax</th>
                                            <th data-sortable data-type="number">Net</th>
                                            <th data-sortable data-type="string">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                            <div class="modal-actions" style="margin-top:16px; display:flex; justify-content:flex-end;">
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(wrap);
            this.payoutModalEl = wrap;

            const closeBtn = this.payoutModalEl.querySelector('.close-button');
            const closeBtn2 = this.payoutModalEl.querySelector('.payout-close-btn');
            const close = () => this.payoutModalEl.classList.remove('show');
            closeBtn?.addEventListener('click', close);
            closeBtn2?.addEventListener('click', close);
            this.payoutModalEl.addEventListener('click', (e) => { 
                if (e.target === this.payoutModalEl) close(); 
            });

            return this.payoutModalEl;
        },

        openPayoutModal(payoutDate) {
            const payout = APP_DATA.payouts.history.find(p => p.date === payoutDate);
            if (!payout) return;

            const modal = this.ensurePayoutModal();
            modal.querySelector('#payout-modal-date').textContent = `Date: ${payout.date}`;
            modal.querySelector('#payout-modal-total').textContent = `Total: ${utils.formatMoney(payout.total, 2)}`;
            modal.querySelector('#payout-modal-count').textContent = `BEL: ${payout.belCount}`;

            const tbody = modal.querySelector('#payout-detail-table tbody');
            tbody.innerHTML = payout.details.map(d => `
                <tr data-payout-id="${d.payoutId}">
                    <td>${d.payoutId}</td>
                    <td><a href="#" class="referral-id-link" data-referral-id="${d.referralId}">${d.referralId}</a></td>
                    <td>${d.belName}</td>
                    <td>${utils.formatMoney(d.gross, 2)}</td>
                    <td>${utils.formatMoney(d.fees, 2)}</td>
                    <td>${utils.formatMoney(d.tax, 2)}</td>
                    <td><strong>${utils.formatMoney(d.net, 2)}</strong></td>
                    <td>
                        <span class="bel-badge ${d.status === 'Success' ? 'completed' : 'danger'}">${d.status}</span>
                    </td>
                </tr>
            `).join('');

            const table = modal.querySelector('#payout-detail-table');
            if (table) {
                TableUtils.makeTableSortable(table);
            }

            modal.style.zIndex = this.getNextModalZIndex();
            modal.classList.add('show');
        },

        ensureSupportModal() {
            if (this.supportModalEl) return this.supportModalEl;
            
            const wrap = document.createElement('div');
            wrap.className = 'modal-overlay';
            wrap.id = 'support-ticket-modal';
            wrap.innerHTML = `
                <div class="modal-content" style="max-width:700px;">
                    <div class="modal-header" style="border-bottom: none; padding-bottom: 8px;">
                        <div style="flex: 1;">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <h3 id="sup-modal-title" style="margin:0; font-size: 1.4rem; font-weight: 600;">Support Ticket</h3>
                                <span id="sup-modal-status"></span>
                            </div>
                            <div id="sup-modal-ticket-num" style="color: #666; font-size: 0.9rem; margin-top: 4px;">Ticket #</div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <button class="close-button" aria-label="Close">&times;</button>
                        </div>
                    </div>
                    
                    <hr style="margin-bottom: 16px; border: none; border-top: 1px solid #e5e7eb; opacity: 0.6;">
                    
                    <div class="modal-body-grid" style="grid-template-columns: 1fr; padding: 0 0px 0px;">
                        <div>
                            <!-- Question Message Box -->
                            <div class="support-question-box">
                                <div class="support-bel-profile">
                                    <div id="sup-bel-avatar" class="support-bel-avatar"></div>
                                    <div class="support-profile-info">
                                        <div class="support-profile-header">
                                            <strong id="sup-bel-name" class="support-bel-name"></strong>
                                            <span id="sup-referral-id" class="support-referral-id"></span>
                                        </div>
                                        <div id="sup-message" class="support-message"></div>
                                        <div id="sup-message-time" class="support-reply-meta" style="margin-top: 8px;"></div>
                                    </div>
                                </div>
                            </div>

                            <!-- Replies Section (only for Closed tickets) -->
                            <div id="conversation-title" class="support-conversation-section" style="display: none;">
                                <div id="sup-replies" class="support-replies-container"></div>
                            </div>

                            <!-- Reply Section (only for Open tickets) -->
                            <div id="sup-reply-section" class="support-reply-section">
                                <div class="support-reply-form-header">
                                    <i class="fas fa-reply" style="color: #6b7280;"></i>
                                    <span class="support-reply-form-title">Your Reply</span>
                                </div>
                                <textarea id="sup-reply-input" placeholder="Type your reply..." class="support-reply-textarea"></textarea>
                                <div class="support-reply-actions">
                                    <button class="bel-btn primary" id="sup-send-btn" style="flex: 1;"><i class="fas fa-reply"></i> Send Reply</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(wrap);
            this.supportModalEl = wrap;

            const close = () => this.supportModalEl.classList.remove('show');
            this.supportModalEl.querySelector('.close-button')?.addEventListener('click', close);
            this.supportModalEl.addEventListener('click', (e) => { 
                if (e.target === this.supportModalEl) close(); 
            });

            // send reply functionality
            this.supportModalEl.querySelector('#sup-send-btn')?.addEventListener('click', () => {
                const ticketId = this.supportModalEl.dataset.ticketId;
                const ticket = APP_DATA.contactSupport.tickets.find(t => t.ticketNumber === ticketId);
                if (!ticket) return;
                
                const textarea = this.supportModalEl.querySelector('#sup-reply-input');
                const txt = (textarea.value || '').trim();
                if (!txt) { 
                    alert('Reply cannot be empty.'); 
                    return; 
                }
                
                ticket.replies = ticket.replies || [];
                ticket.replies.push({ 
                    time: new Date().toISOString().slice(0, 16).replace('T', ' '), 
                    text: txt 
                });
                
                // 回覆後直接關閉ticket
                ticket.status = 'Closed';
                textarea.value = '';
                this.fillSupportModal(ticket);
                this.renderContactSupportTickets();
            });

            return this.supportModalEl;
        },

        fillSupportModal(ticket) {
            const modal = this.ensureSupportModal();
            modal.dataset.ticketId = ticket.ticketNumber;
            
            // Update modal title and ticket number
            modal.querySelector('#sup-modal-title').textContent = ticket.subject || 'Support Ticket';
            modal.querySelector('#sup-modal-ticket-num').textContent = ticket.ticketNumber;
            
            // Update status badge
            modal.querySelector('#sup-modal-status').innerHTML = `<span class="bel-badge ${ticket.status === 'Open' ? 'pending' : 'completed'}">${ticket.status}</span>`;
            
            // Create BEL profile with avatar
            const avatarContainer = modal.querySelector('#sup-bel-avatar');
            const avatarHTML = utils.generateAvatarHTML(ticket.belName, ticket.referralId, 40);
            avatarContainer.innerHTML = avatarHTML;
            
            modal.querySelector('#sup-bel-name').textContent = ticket.belName;
            modal.querySelector('#sup-referral-id').innerHTML = `<a href="#" class="referral-id-link" data-referral-id="${ticket.referralId}">${ticket.referralId}</a>`;
            modal.querySelector('#sup-message').textContent = ticket.message || 'No message provided.';
            
            // 添加用戶問題的時間戳
            const messageTimeElement = modal.querySelector('#sup-message-time');
            if (messageTimeElement) {
                const questionTime = ticket.questionTime || '—'; // 從ticket中獲取或顯示空值
                // 從BEL profiles leaderboard中獲取BEL的實際email
                const appData = window.APP_DATA || APP_DATA;
                const belProfile = appData?.belProfiles?.leaderboard?.find(bel => bel.id === ticket.referralId);
                const belEmail = belProfile ? belProfile.email : `${ticket.belName.toLowerCase().replace(' ', '.')}@email.com`;
                messageTimeElement.textContent = `${questionTime} • ${belEmail}`;
            }

            // Update replies section - 根據邏輯調整
            const repliesContainer = modal.querySelector('#sup-replies');
            const conversationTitle = modal.querySelector('#conversation-title');
            
            if (ticket.status === 'Closed' && ticket.replies && ticket.replies.length) {
                // Closed tickets show conversation history
                if (conversationTitle) conversationTitle.style.display = 'block';
                repliesContainer.innerHTML = ticket.replies.map(reply => `
                    <div class="support-reply-item">
                        <div class="support-reply-header">
                            <i class="fas fa-user-circle" style="color: #6b7280;"></i>
                            <span style="font-weight: 600; color: #374151;">Admin Reply</span>
                        </div>
                        <div class="support-reply-content">${reply.text}</div>
                        <div class="support-reply-meta">
                            ${reply.time} • admin@advantech.com
                        </div>
                    </div>
                `).join('');
            } else {
                // Open tickets and other statuses don't show conversation history
                if (conversationTitle) conversationTitle.style.display = 'none';
                repliesContainer.innerHTML = '';
            }
            
            // Show/hide reply section - Open tickets always show reply section
            const replySection = modal.querySelector('#sup-reply-section');
            if (ticket.status === 'Open') {
                replySection.style.display = 'block';
            } else {
                replySection.style.display = 'none';
            }
        },

        openSupportModal(ticketId) {
            // Try to find ticket in both data sources
            let ticket = APP_DATA.contactSupport.tickets.find(t => t.ticketNumber === ticketId);
            if (!ticket) {
                ticket = APP_DATA.contactSupport.tickets.find(t => t.ticketNumber === ticketId);
            }
            if (!ticket) return;

            const modal = this.ensureSupportModal();
            this.fillSupportModal(ticket);
            modal.style.zIndex = this.getNextModalZIndex();
            modal.classList.add('show');
        },

        ensureAnnouncementModal() {
            if (this.announcementModalEl) return this.announcementModalEl;
            
            const wrap = document.createElement('div');
            wrap.className = 'modal-overlay';
            wrap.id = 'send-announcement-modal';
            wrap.innerHTML = `
                <div class="modal-content" style="max-width:440px;">
                    <div class="modal-header">
                        <h3 style="margin:0;">Send Announcement</h3>
                        <button class="close-button" aria-label="Close">&times;</button>
                    </div>
                    <div class="modal-body-grid" style="grid-template-columns: 1fr;">
                        <div>
                            <div class="bel-form-group" style="margin-bottom:12px;">
                                <label>Category</label>
                                <select id="ann-category" class="bel-select">
                                    <option>System</option>
                                    <option>Policy Update</option>
                                    <option>Payout Reminder</option>
                                    <option>Campaign Launch</option>
                                    <option>Important</option>
                                </select>
                            </div>
                            <div class="bel-form-group" style="margin-bottom:12px;">
                                <label>Title</label>
                                <input type="text" id="ann-title" class="bel-input" maxlength="20" required placeholder="Enter announcement title" />
                                <small style="color: #666; font-size: 12px;">Character limit: <span id="title-count">0</span>/20</small>
                            </div>
                            <div class="bel-form-group" style="margin-bottom:12px;">
                                <label>Body</label>
                                <input type="text" id="ann-body" class="bel-input" maxlength="40" required placeholder="Enter announcement content" />
                                <small style="color: #666; font-size: 12px;">Character limit: <span id="body-count">0</span>/40</small>
                            </div>
                            <div class="bel-form-group" style="margin-bottom:12px;">
                                <label>Link (optional)</label>
                                <input type="url" id="ann-link" class="bel-input" placeholder="https://example.com/link"/>
                            </div>
                            <div class="modal-actions" style="display:flex; justify-content:flex-end; gap:8px;">
                                <button class="bel-btn primary" id="ann-send"><i class="fas fa-paper-plane"></i> Send</button>
                                <button class="bel-btn secondary" id="ann-cancel">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(wrap);
            this.announcementModalEl = wrap;

            const close = () => {
                this.announcementModalEl.classList.remove('show');
                // Reset form when closing
                setTimeout(() => {
                    this.announcementModalEl.querySelector('#ann-category').selectedIndex = 0;
                    this.announcementModalEl.querySelector('#ann-title').value = '';
                    this.announcementModalEl.querySelector('#ann-body').value = '';
                    this.announcementModalEl.querySelector('#ann-link').value = '';
                    this.announcementModalEl.querySelector('#title-count').textContent = '0';
                    this.announcementModalEl.querySelector('#body-count').textContent = '0';
                }, 200);
            };
            this.announcementModalEl.querySelector('.close-button')?.addEventListener('click', close);
            this.announcementModalEl.querySelector('#ann-cancel')?.addEventListener('click', close);
            this.announcementModalEl.addEventListener('click', (e) => { 
                if (e.target === this.announcementModalEl) close(); 
            });

            // 字數統計功能
            const titleInput = this.announcementModalEl.querySelector('#ann-title');
            const bodyInput = this.announcementModalEl.querySelector('#ann-body');
            const titleCount = this.announcementModalEl.querySelector('#title-count');
            const bodyCount = this.announcementModalEl.querySelector('#body-count');

            titleInput.addEventListener('input', () => {
                titleCount.textContent = titleInput.value.length;
            });

            bodyInput.addEventListener('input', () => {
                bodyCount.textContent = bodyInput.value.length;
            });

            this.announcementModalEl.querySelector('#ann-send')?.addEventListener('click', () => {
                const cat = this.announcementModalEl.querySelector('#ann-category').value.trim();
                const title = this.announcementModalEl.querySelector('#ann-title').value.trim();
                const body = this.announcementModalEl.querySelector('#ann-body').value.trim();
                const link = this.announcementModalEl.querySelector('#ann-link').value.trim();

                if (!title || title.length > 20) { 
                    alert('Title is required and must be ≤ 20 characters.'); 
                    return; 
                }
                if (!body || body.length > 40) { 
                    alert('Body is required and must be ≤ 40 characters.'); 
                    return; 
                }
                if (link && !/^https?:\/\/.+/i.test(link)) { 
                    alert('Link must start with http:// or https://'); 
                    return; 
                }

                const newAnnouncement = {
                    created: new Date().toISOString().slice(0, 10),
                    category: cat,
                    title,
                    body,
                    link: link || '—'
                };

                // Add to announcements data
                APP_DATA.announcements.announcements.unshift(newAnnouncement);
                
                // Re-render the announcements table
                this.renderAnnouncementsNew();

                // Optional: push into top-right notification panel if exists
                try {
                    const list = document.querySelector('.bel-notification-list');
                    if (list) {
                        const li = document.createElement('li');
                        li.className = 'bel-notification-item';
                        const tagClass = this.getNotificationTagClass(cat);
                        li.innerHTML = `
                            <div class="title"><span class="tag ${tagClass}">${cat}</span>${title}</div>
                            <div class="date">${new Date().toISOString().slice(0,10)}</div>
                        `;
                        list.prepend(li);
                    }
                } catch {}

                this.announcementModalEl.classList.remove('show');
                
                // Clear form and reset counters
                this.announcementModalEl.querySelector('#ann-category').selectedIndex = 0;
                this.announcementModalEl.querySelector('#ann-title').value = '';
                this.announcementModalEl.querySelector('#ann-body').value = '';
                this.announcementModalEl.querySelector('#ann-link').value = '';
                this.announcementModalEl.querySelector('#title-count').textContent = '0';
                this.announcementModalEl.querySelector('#body-count').textContent = '0';
                
                // Show success message
                alert('公告發送成功！新公告已添加到列表頂部。');
            });

            return this.announcementModalEl;
        },

        setupEventListeners() {
            // Event delegation for payout view buttons
            document.addEventListener('click', (e) => {
                const payoutBtn = e.target.closest('.payout-view-btn');
                if (payoutBtn) {
                    const payoutDate = payoutBtn.getAttribute('data-payout-date');
                    this.openPayoutModal(payoutDate);
                    return;
                }

                // Event delegation for support view buttons  
                const supportBtn = e.target.closest('.support-view-btn');
                if (supportBtn) {
                    const ticketId = supportBtn.getAttribute('data-ticket-id');
                    this.openSupportModal(ticketId);
                    return;
                }

                // Event delegation for pay buttons in payout modal - REMOVED
                // Pay/retry functionality has been disabled as requested

                // Event delegation for asset edit buttons
                const editBtn = e.target.closest('.asset-edit-btn');
                if (editBtn) {
                    const assetId = editBtn.getAttribute('data-asset-id');
                    this.openFormModal('edit', assetId);
                    return;
                }

                // Event delegation for asset delete buttons
                const deleteBtn = e.target.closest('.asset-delete-btn');
                if (deleteBtn) {
                    const assetId = deleteBtn.getAttribute('data-asset-id');
                    this.openConfirmModal(assetId);
                    return;
                }

                // Event delegation for add asset button
                const addBtn = e.target.closest('#asset-add-btn');
                if (addBtn) {
                    this.openFormModal('add', null);
                    return;
                }

                // Event delegation for send announcement button (new)
                const announcementBtnNew = e.target.closest('#send-announcement-btn-new');
                if (announcementBtnNew) {
                    const modal = this.ensureAnnouncementModal();
                    modal.style.zIndex = this.getNextModalZIndex();
                    modal.classList.add('show');
                    return;
                }

                // Event delegation for view history tickets button
                const historyTicketsBtn = e.target.closest('#view-history-tickets-btn');
                if (historyTicketsBtn) {
                    this.openHistoryTicketsModal();
                    return;
                }
            });
        },

        // handlePayButtonClick function removed - retry functionality disabled as requested
        // handlePayButtonClick(payoutId) { ... }

        // Content Asset Modals
        ensureConfirmModal() {
            if (this.confirmModalEl) return this.confirmModalEl;
            
            const wrap = document.createElement('div');
            wrap.className = 'modal-overlay';
            wrap.id = 'asset-delete-modal';
            wrap.innerHTML = `
                <div class="modal-content" style="max-width:520px;">
                    <div class="modal-header">
                        <h3 style="margin:0;">Confirm Deletion</h3>
                        <button class="close-button" aria-label="Close">&times;</button>
                    </div>
                    <div style="padding-top:16px;">
                        <p style="line-height:1.6; font-size:0.95rem;">
                            This action <strong>cannot be undone</strong>. Are you sure you want to delete this asset?
                        </p>
                        <div class="modal-actions" style="margin-top:16px; display:flex; justify-content:flex-end; gap:8px;">
                            <button class="bel-btn danger confirm-delete-btn">Delete</button>
                            <button class="bel-btn secondary confirm-cancel-btn">Cancel</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(wrap);
            this.confirmModalEl = wrap;

            const close = () => this.confirmModalEl.classList.remove('show');
            this.confirmModalEl.querySelector('.close-button')?.addEventListener('click', close);
            this.confirmModalEl.querySelector('.confirm-cancel-btn')?.addEventListener('click', close);
            this.confirmModalEl.addEventListener('click', (e) => { 
                if (e.target === this.confirmModalEl) close(); 
            });

            // Handle delete confirmation
            this.confirmModalEl.querySelector('.confirm-delete-btn')?.addEventListener('click', () => {
                const assetId = this.confirmModalEl.getAttribute('data-asset-id');
                this.deleteAsset(assetId);
                close();
            });

            return this.confirmModalEl;
        },

        openConfirmModal(assetId) {
            const modal = this.ensureConfirmModal();
            modal.setAttribute('data-asset-id', assetId);
            modal.style.zIndex = this.getNextModalZIndex();
            modal.classList.add('show');
        },

        ensureFormModal() {
            if (this.formModalEl) return this.formModalEl;
            
            const wrap = document.createElement('div');
            wrap.className = 'modal-overlay';
            wrap.id = 'asset-form-modal';
            wrap.innerHTML = `
                <div class="modal-content" style="max-width:560px;">
                    <div class="modal-header">
                        <h3 style="margin:0;" id="asset-form-title">Add Asset</h3>
                        <button class="close-button" aria-label="Close">&times;</button>
                    </div>
                    <div class="modal-body-grid" style="grid-template-columns: 1fr;">
                        <form id="asset-form">
                            <div class="bel-form-group" style="margin-bottom:12px;">
                                <label>Category</label>
                                <select id="asset-category" class="bel-select" required>
                                    <option value="">Select a category</option>
                                    <option value="IoTMart Campaign">IoTMart Campaign</option>
                                    <option value="Advantech Resource Website">Advantech Resource Website</option>
                                </select>
                            </div>
                            <div class="bel-form-group" style="margin-bottom:12px;">
                                <label>Title</label>
                                <input type="text" id="asset-title" class="bel-input" maxlength="25" required />
                            </div>
                            <div class="bel-form-group" style="margin-bottom:12px;">
                                <label>Subtitle</label>
                                <input type="text" id="asset-subtitle" class="bel-input" maxlength="60" required />
                            </div>
                            <div class="bel-form-group" style="margin-bottom:12px;">
                                <label>Page Link URL</label>
                                <input type="url" id="asset-url" class="bel-input" placeholder="https://example.com/..." required />
                            </div>
                            <div class="bel-form-group" style="margin-bottom:12px;">
                                <label>Picture <span style="color: #666; font-size: 0.9em;">(Recommended: 1200 × 740 pixels)</span></label>
                                <div class="picture-upload-area" style="border: 2px dashed var(--bel-border-color); border-radius: 4px; padding: 20px; text-align: center; background-color: #f8f9fa; cursor: pointer; transition: all 0.3s ease;" onclick="document.getElementById('asset-picture').click();">
                                    <div class="upload-icon" style="font-size: 48px; color: #ccc; margin-bottom: 10px;">
                                        <i class="fas fa-cloud-upload-alt"></i>
                                    </div>
                                    <div class="upload-text" style="color: #666; margin-bottom: 8px;">
                                        <strong>Click to upload picture</strong> or drag and drop
                                    </div>
                                    <div class="upload-dimensions" style="color: #999; font-size: 0.9em;">
                                        Recommended dimensions: 1200 × 740 pixels
                                    </div>
                                    <input type="file" id="asset-picture" accept="image/*" style="display: none;" />
                                </div>
                                <div id="picture-preview" style="margin-top: 10px; display: none;">
                                    <div class="preview-image-container" style="position: relative; cursor: pointer;" onclick="document.getElementById('asset-picture').click();">
                                        <img id="preview-image" style="max-width: 100%; height: auto; border-radius: 4px; border: 1px solid var(--bel-border-color);" />
                                        <div class="image-overlay" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); color: white; display: none; flex-direction: column; justify-content: center; align-items: center; border-radius: 4px; opacity: 0; transition: opacity 0.3s ease;">
                                            <i class="fas fa-camera" style="font-size: 24px; margin-bottom: 8px;"></i>
                                            <div>Click to change picture</div>
                                        </div>
                                    </div>
                                    <div id="picture-info" style="margin-top: 8px; color: #666; font-size: 0.9em;"></div>
                                    <div class="picture-actions" style="margin-top: 8px; display: flex; gap: 8px;">
                                        <button type="button" class="bel-btn secondary" style="padding: 4px 8px; font-size: 0.8em;" onclick="document.getElementById('asset-picture').click()">
                                            <i class="fas fa-upload"></i> Change Picture
                                        </button>
                                        <button type="button" class="bel-btn secondary" style="padding: 4px 8px; font-size: 0.8em;" onclick="removePicture()">
                                            <i class="fas fa-trash"></i> Remove Picture
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <div class="modal-actions" style="display:flex; justify-content:flex-end; gap:8px;">
                            <button class="bel-btn primary" id="asset-save-btn">Save</button>
                            <button class="bel-btn secondary" id="asset-cancel-btn">Cancel</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(wrap);
            this.formModalEl = wrap;

            const close = () => this.formModalEl.classList.remove('show');
            this.formModalEl.querySelector('.close-button')?.addEventListener('click', close);
            this.formModalEl.querySelector('#asset-cancel-btn')?.addEventListener('click', close);
            this.formModalEl.addEventListener('click', (e) => { 
                if (e.target === this.formModalEl) close(); 
            });

            // Handle form submission
            this.formModalEl.querySelector('#asset-save-btn')?.addEventListener('click', () => {
                this.saveAsset();
            });

            // Handle picture upload
            const pictureInput = this.formModalEl.querySelector('#asset-picture');
            const uploadArea = this.formModalEl.querySelector('.picture-upload-area');
            const preview = this.formModalEl.querySelector('#picture-preview');
            const previewImage = this.formModalEl.querySelector('#preview-image');
            const pictureInfo = this.formModalEl.querySelector('#picture-info');

            // File input change handler
            pictureInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.handlePictureUpload(file);
                }
            });

            // Drag and drop handlers
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = 'var(--ds-color-primary)';
                uploadArea.style.backgroundColor = '#f0f8ff';
            });

            uploadArea.addEventListener('dragleave', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = 'var(--bel-border-color)';
                uploadArea.style.backgroundColor = '#f8f9fa';
            });

            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = 'var(--bel-border-color)';
                uploadArea.style.backgroundColor = '#f8f9fa';
                
                const files = e.dataTransfer.files;
                if (files.length > 0 && files[0].type.startsWith('image/')) {
                    pictureInput.files = files;
                    this.handlePictureUpload(files[0]);
                }
            });

            // Image preview hover effects
            const previewContainer = this.formModalEl.querySelector('.preview-image-container');
            const imageOverlay = this.formModalEl.querySelector('.image-overlay');
            
            if (previewContainer && imageOverlay) {
                previewContainer.addEventListener('mouseenter', () => {
                    imageOverlay.style.display = 'flex';
                    imageOverlay.style.opacity = '1';
                });
                
                previewContainer.addEventListener('mouseleave', () => {
                    imageOverlay.style.opacity = '0';
                    setTimeout(() => {
                        if (imageOverlay.style.opacity === '0') {
                            imageOverlay.style.display = 'none';
                        }
                    }, 300);
                });
            }

            // Global function for removing picture
            window.removePicture = () => {
                pictureInput.value = '';
                preview.style.display = 'none';
                uploadArea.style.display = 'block';
            };

            return this.formModalEl;
        },

        openFormModal(mode, assetId) {
            const modal = this.ensureFormModal();
            const title = modal.querySelector('#asset-form-title');
            const pictureInput = modal.querySelector('#asset-picture');
            const uploadArea = modal.querySelector('.picture-upload-area');
            const preview = modal.querySelector('#picture-preview');
            const previewImage = modal.querySelector('#preview-image');
            const pictureInfo = modal.querySelector('#picture-info');
            
            // Reset picture upload state
            pictureInput.value = '';
            uploadArea.style.display = 'block';
            preview.style.display = 'none';
            
            if (mode === 'add') {
                title.textContent = 'Add Asset';
                modal.querySelector('#asset-title').value = '';
                modal.querySelector('#asset-subtitle').value = '';
                modal.querySelector('#asset-category').value = '';
                modal.querySelector('#asset-url').value = '';
                modal.setAttribute('data-mode', 'add');
            } else if (mode === 'edit' && assetId) {
                title.textContent = 'Edit Asset';
                const assetIndex = parseInt(assetId.replace('asset-', ''));
                const asset = APP_DATA.content.assets[assetIndex];
                if (asset) {
                    modal.querySelector('#asset-title').value = asset.title;
                    modal.querySelector('#asset-subtitle').value = asset.subtitle;
                    modal.querySelector('#asset-category').value = asset.category || '';
                    modal.querySelector('#asset-url').value = asset.pageLink;
                    modal.setAttribute('data-mode', 'edit');
                    modal.setAttribute('data-asset-id', assetId);
                    
                    // Show existing picture or placeholder if available
                    if (asset.picture && asset.picture.data) {
                        previewImage.src = asset.picture.data;
                        pictureInfo.innerHTML = `
                            <div><strong>File:</strong> ${asset.picture.name}</div>
                            <div><strong>Size:</strong> ${(asset.picture.size / 1024).toFixed(1)} KB</div>
                            <div><strong>Type:</strong> ${asset.picture.type}</div>
                        `;
                        uploadArea.style.display = 'none';
                        preview.style.display = 'block';
                    } else {
                        // Show placeholder image based on asset index
                        const placeholderImages = [
                            'https://irp.cdn-website.com/56869327/dms3rep/multi/BEL-PCs.png',
                            'https://irp.cdn-website.com/56869327/dms3rep/multi/BEL-PoE.png'
                        ];
                        const placeholderSrc = placeholderImages[assetIndex % placeholderImages.length];
                        
                        previewImage.src = placeholderSrc;
                        pictureInfo.innerHTML = `
                            <div style="color: #666; font-style: italic;">
                                <i class="fas fa-image"></i> BEL-PoE.png
                            </div>
                        `;
                        uploadArea.style.display = 'none';
                        preview.style.display = 'block';
                    }
                }
            }

            modal.style.zIndex = this.getNextModalZIndex();
            modal.classList.add('show');
        },

        handlePictureUpload(file) {
            const preview = this.formModalEl.querySelector('#picture-preview');
            const previewImage = this.formModalEl.querySelector('#preview-image');
            const pictureInfo = this.formModalEl.querySelector('#picture-info');
            const uploadArea = this.formModalEl.querySelector('.picture-upload-area');

            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select a valid image file.');
                return;
            }

            // Validate file size (max 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                alert('File size must be less than 5MB.');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                // Create image to check dimensions
                const img = new Image();
                img.onload = () => {
                    const width = img.naturalWidth;
                    const height = img.naturalHeight;
                    
                    // Show dimensions info
                    let dimensionText = `${width} × ${height} pixels`;
                    if (width === 1200 && height === 740) {
                        dimensionText += ' ✓ Perfect size!';
                        pictureInfo.style.color = '#28a745';
                    } else {
                        dimensionText += ' (Recommended: 1200 × 740)';
                        pictureInfo.style.color = '#ffc107';
                    }

                    previewImage.src = e.target.result;
                    pictureInfo.innerHTML = `
                        <div><strong>File:</strong> ${file.name}</div>
                        <div><strong>Size:</strong> ${(file.size / 1024).toFixed(1)} KB</div>
                        <div><strong>Dimensions:</strong> ${dimensionText}</div>
                    `;
                    
                    uploadArea.style.display = 'none';
                    preview.style.display = 'block';
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        },

        saveAsset() {
            const modal = this.formModalEl;
            const mode = modal.getAttribute('data-mode');
            const title = modal.querySelector('#asset-title').value;
            const subtitle = modal.querySelector('#asset-subtitle').value;
            const category = modal.querySelector('#asset-category').value;
            const url = modal.querySelector('#asset-url').value;
            const pictureInput = modal.querySelector('#asset-picture');

            if (!title || !subtitle || !category || !url) {
                alert('Please fill in all required fields.');
                return;
            }

            const assetData = {
                title,
                subtitle,
                category,
                pageLink: url,
                uploadDate: new Date().toISOString().split('T')[0]
            };

            // Handle picture data
            if (pictureInput.files && pictureInput.files[0]) {
                const file = pictureInput.files[0];
                const reader = new FileReader();
                reader.onload = (e) => {
                    assetData.picture = {
                        data: e.target.result,
                        name: file.name,
                        size: file.size,
                        type: file.type
                    };
                    this.saveAssetData(mode, assetData, modal);
                };
                reader.readAsDataURL(file);
            } else {
                // In edit mode, preserve existing picture data if no new file is uploaded
                if (mode === 'edit') {
                    const assetId = modal.getAttribute('data-asset-id');
                    const assetIndex = parseInt(assetId.replace('asset-', ''));
                    const existingAsset = APP_DATA.content.assets[assetIndex];
                    if (existingAsset && existingAsset.picture) {
                        assetData.picture = existingAsset.picture;
                    }
                }
                this.saveAssetData(mode, assetData, modal);
            }
        },

        saveAssetData(mode, assetData, modal) {
            if (mode === 'add') {
                APP_DATA.content.assets.push(assetData);
            } else if (mode === 'edit') {
                const assetId = modal.getAttribute('data-asset-id');
                const assetIndex = parseInt(assetId.replace('asset-', ''));
                if (APP_DATA.content.assets[assetIndex]) {
                    Object.assign(APP_DATA.content.assets[assetIndex], assetData);
                }
            }

            this.renderAssets();
            modal.classList.remove('show');
        },

        deleteAsset(assetId) {
            const assetIndex = parseInt(assetId.replace('asset-', ''));
            if (APP_DATA.content.assets[assetIndex]) {
                APP_DATA.content.assets.splice(assetIndex, 1);
                this.renderAssets();
            }
        }
    };

    /* ========================================================================
       TABLE UTILITIES
       ======================================================================== */
    const TableUtils = {
        makeTableSortable(table) {
            if (!table) return;
            
            const headers = table.querySelectorAll('th[data-sortable]');
            const tbody = table.querySelector('tbody');
            
            if (!tbody || headers.length === 0) return;
            
            // Remove existing event listeners to prevent duplicates
            headers.forEach(header => {
                const newHeader = header.cloneNode(true);
                header.parentNode.replaceChild(newHeader, header);
            });
            
            // Re-query headers after replacement
            const freshHeaders = table.querySelectorAll('th[data-sortable]');
            
            freshHeaders.forEach((header, index) => {
                header.style.cursor = 'pointer';
                header.addEventListener('click', () => {
                    const rows = Array.from(tbody.querySelectorAll('tr'));
                    if (rows.length === 0) return;
                    
                    const sortDir = header.getAttribute('data-sort-dir') === 'asc' ? 'desc' : 'asc';
                    const dataType = header.getAttribute('data-type') || 'string';
                    
                    // Clear all sort indicators
                    freshHeaders.forEach(h => h.removeAttribute('data-sort-dir'));
                    header.setAttribute('data-sort-dir', sortDir);
                    
                    // Sort rows
                    rows.sort((a, b) => {
                        let cellA = a.children[index];
                        let cellB = b.children[index];
                        
                        if (!cellA || !cellB) return 0;
                        
                        // Check for data-sort-value attribute first, then fall back to textContent
                        let valA = cellA.getAttribute('data-sort-value') || cellA.textContent.trim();
                        let valB = cellB.getAttribute('data-sort-value') || cellB.textContent.trim();
                        
                        if (dataType === 'number') {
                            // If we have data-sort-value, use it directly as number, otherwise extract from text
                            if (cellA.getAttribute('data-sort-value')) {
                                valA = parseFloat(valA) || 0;
                                valB = parseFloat(valB) || 0;
                            } else {
                                // Extract numbers from text (handle currency, percentages, etc.)
                                valA = parseFloat(valA.replace(/[^0-9.-]/g, '')) || 0;
                                valB = parseFloat(valB.replace(/[^0-9.-]/g, '')) || 0;
                            }
                        } else if (dataType === 'date') {
                            valA = new Date(valA);
                            valB = new Date(valB);
                        }
                        
                        let comparison = 0;
                        if (valA < valB) comparison = -1;
                        else if (valA > valB) comparison = 1;
                        
                        return sortDir === 'asc' ? comparison : -comparison;
                    });
                    
                    // Re-append sorted rows
                    tbody.innerHTML = '';
                    rows.forEach(row => tbody.appendChild(row));
                });
            });
        },

        // Initialize sorting for all tables with sortable headers
        initializeAllTables() {
            const tables = document.querySelectorAll('table.bel-table');
            tables.forEach(table => {
                this.makeTableSortable(table);
            });
        }
    };

    // Initialize all avatars in the application
    function initializeAllAvatars() {
        // Replace any remaining static avatars with generated ones
        const staticAvatars = document.querySelectorAll('img[alt="User Avatar"]:not([src=""]):not([style*="display: none"])');
        staticAvatars.forEach(img => {
            const name = img.closest('.bel-user-profile')?.nextElementSibling?.textContent || 
                        img.closest('.bel-profile-identifier')?.querySelector('h3')?.textContent || 
                        'User';
            const generatedAvatar = utils.generateAvatar(name);
            img.parentNode.replaceChild(generatedAvatar, img);
        });
    }

});
