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
    const APP_DATA = {
        userProfile: {
            name: "Abby Dong",
            email: "Abby.dong@advantech.com",
            level: "Admin",
            avatar: "https://irp.cdn-website.com/56869327/dms3rep/multi/AVATAR-G.png"
        },
        header: {
            portalTitle: "BEL Portal",
            logo: "https://irp.cdn-website.com/56869327/dms3rep/multi/iotmart-logo.svg",
            notifications: [
                {
                    type: "admin-alert",
                    tagText: "Admin Alert",
                    title: "New Support Ticket - Payment Issue",
                    date: "2025-08-30",
                    details: "User Referral ID: KTWBELF9A submitted a ticket regarding payment delays"
                },
                {
                    type: "admin-alert",
                    tagText: "Admin Alert", 
                    title: "Multiple Login Attempts Detected",
                    date: "2025-08-30",
                    details: "Unusual login activity detected from IP: 192.168.1.100"
                },
                {
                    type: "admin-system",
                    tagText: "System",
                    title: "Database Backup Completed",
                    date: "2025-08-30",
                    details: "Daily backup completed successfully at 02:00 AM"
                },
                {
                    type: "admin-user",
                    tagText: "User Management",
                    title: "5 New BEL Registrations Pending",
                    date: "2025-08-29",
                    details: "Review required for new user applications"
                },
                {
                    type: "admin-revenue",
                    tagText: "Revenue Alert",
                    title: "Commission Threshold Exceeded",
                    date: "2025-08-29",
                    details: "User Maxwell Chen exceeded monthly commission limit"
                },
                {
                    type: "important",
                    tagText: "Important",
                    title: "September Earnings Payout Postponed",
                    date: "2025-08-26"
                },
                {
                    type: "new-product",
                    tagText: "New Campaign",
                    title: "ADAM Remote I/O Series are now available for promotion",
                    date: "2025-08-25"
                }
            ]
        },
        dashboard: {
            summaryStats: {
                belCount: { title: "BEL Count (#)", value: "152", icon: "fas fa-users", trend: "+5.1%", trendText: "MoM", status: "positive" },
                totalClicks: { title: "Total Clicks (#)", value: "13,492", icon: "fas fa-mouse-pointer", trend: "+12.3%", trendText: "MoM", status: "positive" },
                totalOrders: { title: "Total Orders (#)", value: "851", icon: "fas fa-shopping-cart", trend: "+8.2%", trendText: "MoM", status: "positive" },
                revenue: { title: "Revenue ($)", value: "$120k", icon: "fas fa-dollar-sign", trend: "+15.8%", trendText: "MoM", status: "positive" },
                convRate: { title: "Conv Rate (%)", value: "6.31%", icon: "fas fa-bullseye", trend: "-0.5%", trendText: "MoM", status: "negative" },
                aov: { title: "AOV ($)", value: "$141.5", icon: "fas fa-file-invoice-dollar", trend: "+2.1%", trendText: "MoM", status: "positive" }
            },
            performanceByLevel: {
                distribution: {
                    labels: ["Builder", "Enabler", "Explorer", "Leader"],
                    data: [75, 45, 25, 7],
                    colors: ["#006EFF", "#00893a", "#f39800", "#db3a3a"]
                },
                details: [
                    { level: "Builder", clicks: "8,000", revenue: "$65,000", orders: 510, convRate: "6.8%", aov: "$127.45" },
                    { level: "Enabler", clicks: "3,500", revenue: "$35,000", orders: 255, convRate: "6.1%", aov: "$137.25" },
                    { level: "Explorer", clicks: "1,500", revenue: "$15,000", orders: 75, convRate: "5.5%", aov: "$200.00" },
                    { level: "Leader", clicks: "492", revenue: "$5,000", orders: 11, convRate: "5.1%", aov: "$454.55" }
                ]
            },
            leaderboard: [
                { id: "KTWADVANT", name: "Maxwell Walker", email: "maxwell.walker@advantech.com", level: "Explorer", clicks: 1280, orders: 35, revenue: 8500, convRate: "2.73%", aov: 242.86 },
                { id: "KUSOLVACE", name: "Olivia Chen", email: "olivia.chen@tech-solutions.com", level: "Builder", clicks: 1150, orders: 32, revenue: 7800, convRate: "2.78%", aov: 243.75 },
                { id: "KDEIMULER", name: "Liam Müller", email: "liam.muller@industrie4.de", level: "Enabler", clicks: 980, orders: 28, revenue: 7200, convRate: "2.86%", aov: 257.14 },
                { id: "KFRDUBOIS", name: "Sophia Dubois", email: "sophia.dubois@automation-fr.com", level: "Builder", clicks: 950, orders: 25, revenue: 6500, convRate: "2.63%", aov: 260.00 },
                { id: "KJPTANAKA", name: "Kenji Tanaka", email: "kenji.tanaka@iot-japan.co.jp", level: "Leader", clicks: 880, orders: 22, revenue: 6100, convRate: "2.50%", aov: 277.27 },
                { id: "KITROSSIT", name: "Isabella Rossi", email: "isabella.rossi@smart-italy.eu", level: "Enabler", clicks: 820, orders: 21, revenue: 5800, convRate: "2.56%", aov: 276.19 },
                { id: "KKRNOAHIM", name: "Noah Kim", email: "noah.kim@korean-tech.kr", level: "Builder", clicks: 790, orders: 20, revenue: 5500, convRate: "2.53%", aov: 275.00 },
                { id: "KDESCHMIT", name: "Ava Schmidt", email: "ava.schmidt@automation-gmbh.de", level: "Builder", clicks: 750, orders: 18, revenue: 5100, convRate: "2.40%", aov: 283.33 },
                { id: "KMXGARCIA", name: "Lucas Garcia", email: "lucas.garcia@industria-es.com", level: "Explorer", clicks: 710, orders: 17, revenue: 4800, convRate: "2.39%", aov: 282.35 },
                { id: "KCNMIAWAN", name: "Mia Wang", email: "mia.wang@smart-manufacturing.cn", level: "Enabler", clicks: 680, orders: 15, revenue: 4500, convRate: "2.21%", aov: 300.00 },
            ],
            productAnalysis: {
                categoryData: {
                    "Remote IO & Communication": [{ product: "ADAM-6017", units: 20 }, { product: "WISE-4012E", units: 11 }],
                    "Wireless Sensing & Solutions": [{ product: "WISE-2410", units: 8 }, { product: "WISE-2200-M", units: 5 }],
                    "Embedded Computers": [{ product: "UNO-2271G", units: 4 }, { product: "ARK-1220", units: 6 }],
                    "Panel PC, HMI & Displays": [{ product: "TPC-1551T", units: 3 }, { product: "PPC-3150", units: 2 }],
                    "Edge AI Solutions": [{ product: "AIR-101", units: 2 }, { product: "MIC-730AI", units: 1 }]
                },
                topProducts: [
                    { rank: 1, product: "ADAM-6017", price: "$150", units: 20, total: "$3000" },
                    { rank: 2, product: "AIM-68G0", price: "$280", units: 8, total: "$2,240" },
                    { rank: 3, product: "ARK-1220", price: "$410", units: 6, total: "$2,460" },
                    { rank: 4, product: "PCE-5129", price: "$520", units: 5, total: "$2,600" },
                    { rank: 5, product: "UNO-2271G", price: "$350", units: 4, total: "$1,400" },
                    { rank: 6, product: "EKI-2525", price: "$90", units: 15, total: "$1,350" },
                    { rank: 7, product: "WISE-4012E", price: "$120", units: 11, total: "$1,320" },
                    { rank: 8, product: "TPC-1551T", price: "$800", units: 3, total: "$2,400" },
                    { rank: 9, product: "MIC-770", price: "$1,200", units: 2, total: "$2,400" },
                    { rank: 10, product: "ADAM-6250", price: "$210", units: 7, total: "$1,470" }
                ]
            }
        },
        payoutsAndOrders: {
            payouts: {
                payoutDayMessage: "Payout Day: 5th of each month",
                history: [
                    {
                        date: "2025-08-05",
                        total: 15420.50,
                        belCount: 45,
                        details: [
                            {
                                payoutId: "RP-000001",
                                referralId: "KTWADVANT",
                                belName: "Maxwell Walker",
                                gross: 850.25,
                                fees: 17.01,
                                tax: 42.51,
                                net: 790.73,
                                paid: true,
                                status: "Success"
                            },
                            {
                                payoutId: "RP-000002",
                                referralId: "KUSOLVACE",
                                belName: "Olivia Chen",
                                gross: 720.50,
                                fees: 14.41,
                                tax: 36.03,
                                net: 670.06,
                                paid: true,
                                status: "Success"
                            },
                            {
                                payoutId: "RP-000003",
                                referralId: "KDEIMULER",
                                belName: "Liam Müller",
                                gross: 612.80,
                                fees: 12.26,
                                tax: 30.64,
                                net: 569.90,
                                paid: false,
                                status: "Failed"
                            }
                        ]
                    },
                    {
                        date: "2025-07-05",
                        total: 12350.75,
                        belCount: 38,
                        details: [
                            {
                                payoutId: "RP-000004",
                                referralId: "KUSOLVACE",
                                belName: "Olivia Chen",
                                gross: 720.50,
                                fees: 14.41,
                                tax: 36.03,
                                net: 670.06,
                                paid: true,
                                status: "Success"
                            },
                            {
                                payoutId: "RP-000005",
                                referralId: "KFRDUBOIS",
                                belName: "Sophia Dubois",
                                gross: 580.30,
                                fees: 11.61,
                                tax: 29.02,
                                net: 539.67,
                                paid: true,
                                status: "Success"
                            }
                        ]
                    }
                ]
            }
        },
        orders: {
            history: [
                { orderDate: "2025-08-20", orderNumber: "IMTW000234", referralId: "KTWADVANT", belName: "Maxwell Walker", amount: 1250.00, currency: "USD", status: "Completed" },
                { orderDate: "2025-08-19", orderNumber: "IMUS000233", referralId: "KUSOLVACE", belName: "Olivia Chen", amount: 650.50, currency: "EUR", status: "Processing" },
                { orderDate: "2025-08-18", orderNumber: "IMDE000232", referralId: "KDEIMULER", belName: "Liam Müller", amount: 745.75, currency: "GBP", status: "Processing" },
                { orderDate: "2025-08-17", orderNumber: "IMFR000231", referralId: "KFRDUBOIS", belName: "Sophia Dubois", amount: 1680.30, currency: "EUR", status: "Completed" },
                { orderDate: "2025-08-16", orderNumber: "IMJP000230", referralId: "KJPTANAKA", belName: "Kenji Tanaka", amount: 285000, currency: "JPY", status: "Processing" },
                { orderDate: "2025-08-15", orderNumber: "IMAU000229", referralId: "KAUJOISON", belName: "Emma Johnson", amount: 3200.00, currency: "AUD", status: "Completed" },
                { orderDate: "2025-08-14", orderNumber: "IMKR000228", referralId: "KKRALEXIM", belName: "Alex Kim", amount: 1850000, currency: "KRW", status: "Processing" },
                { orderDate: "2025-08-13", orderNumber: "IMMX000227", referralId: "KMXLOPEZZ", belName: "Isabella López", amount: 2750.00, currency: "USD", status: "Completed" },
                { orderDate: "2025-08-12", orderNumber: "IMMX000226", referralId: "KMXGARCIA", belName: "Lucas Garcia", amount: 1640.00, currency: "USD", status: "Canceled" },
                { orderDate: "2025-08-11", orderNumber: "IMCN000225", referralId: "KCNMIAWAN", belName: "Mia Wang", amount: 4580.80, currency: "USD", status: "Completed" },
                { orderDate: "2025-08-10", orderNumber: "IMTW000224", referralId: "KTWADVANT", belName: "Maxwell Walker", amount: 2150.40, currency: "USD", status: "Processing" },
                { orderDate: "2025-08-09", orderNumber: "IMUS000223", referralId: "KUSOLVACE", belName: "Olivia Chen", amount: 870.25, currency: "EUR", status: "Completed" },
                { orderDate: "2025-08-08", orderNumber: "IMDE000222", referralId: "KDEIMULER", belName: "Liam Müller", amount: 1185.60, currency: "GBP", status: "Processing" },
                { orderDate: "2025-08-07", orderNumber: "IMFR000221", referralId: "KFRDUBOIS", belName: "Sophia Dubois", amount: 3720.90, currency: "EUR", status: "Completed" },
                { orderDate: "2025-08-06", orderNumber: "IMJP000220", referralId: "KJPTANAKA", belName: "Kenji Tanaka", amount: 185000, currency: "JPY", status: "Canceled" },
                { orderDate: "2025-08-05", orderNumber: "IMAU000219", referralId: "KAUJOISON", belName: "Emma Johnson", amount: 4200.50, currency: "AUD", status: "Completed" },
                { orderDate: "2025-08-03", orderNumber: "IMMX000217", referralId: "KMXLOPEZZ", belName: "Isabella López", amount: 4180.30, currency: "USD", status: "Completed" },
                { orderDate: "2025-08-02", orderNumber: "IMMX000216", referralId: "KMXGARCIA", belName: "Lucas Garcia", amount: 990.75, currency: "USD", status: "Processing" },
                { orderDate: "2025-08-01", orderNumber: "IMCN000215", referralId: "KCNMIAWAN", belName: "Mia Wang", amount: 3650.40, currency: "USD", status: "Completed" },
                { orderDate: "2025-07-31", orderNumber: "IMTW000214", referralId: "KTWADVANT", belName: "Maxwell Walker", amount: 2280.90, currency: "USD", status: "Canceled" },
                { orderDate: "2025-07-30", orderNumber: "IMUS000213", referralId: "KUSOLVACE", belName: "Olivia Chen", amount: 1270.25, currency: "EUR", status: "Completed" },
                { orderDate: "2025-07-29", orderNumber: "IMDE000212", referralId: "KDEIMULER", belName: "Liam Müller", amount: 2890.60, currency: "GBP", status: "Processing" },
                { orderDate: "2025-07-28", orderNumber: "IMFR000211", referralId: "KFRDUBOIS", belName: "Sophia Dubois", amount: 1820.75, currency: "EUR", status: "Completed" },
                { orderDate: "2025-07-27", orderNumber: "IMJP000210", referralId: "KJPTANAKA", belName: "Kenji Tanaka", amount: 395000, currency: "JPY", status: "Processing" },
                { orderDate: "2025-07-26", orderNumber: "IMAU000209", referralId: "KAUJOISON", belName: "Emma Johnson", amount: 1730.25, currency: "AUD", status: "Completed" },
                { orderDate: "2025-07-25", orderNumber: "IMKR000208", referralId: "KKRALEXIM", belName: "Alex Kim", amount: 3280000, currency: "KRW", status: "Canceled" },
                { orderDate: "2025-07-24", orderNumber: "IMMX000207", referralId: "KMXLOPEZZ", belName: "Isabella López", amount: 1950.40, currency: "USD", status: "Completed" },
                { orderDate: "2025-07-23", orderNumber: "IMMX000206", referralId: "KMXGARCIA", belName: "Lucas Garcia", amount: 3140.90, currency: "USD", status: "Processing" },
                { orderDate: "2025-07-21", orderNumber: "IMTW000204", referralId: "KTWADVANT", belName: "Maxwell Walker", amount: 1690.50, status: "Processing" },
                { orderDate: "2025-07-20", orderNumber: "IMPL000203", referralId: "KPLKAROLN", belName: "Sarah Wilson", amount: 1450.25, currency: "EUR", status: "Completed" },
                { orderDate: "2025-07-19", orderNumber: "IMBR000202", referralId: "KBRSILVAN", belName: "Carlos Silva", amount: 2850.60, currency: "USD", status: "Processing" },
                { orderDate: "2025-07-18", orderNumber: "IMIN000201", referralId: "KINRAJESH", belName: "Rajesh Patel", amount: 125000, currency: "INR", status: "Completed" },
                { orderDate: "2025-07-17", orderNumber: "IMSG000200", referralId: "KSGJOHNSO", belName: "Michael Johnson", amount: 980.50, currency: "SGD", status: "Processing" },
                { orderDate: "2025-07-16", orderNumber: "IMTH000199", referralId: "KTHWONGCH", belName: "David Wong", amount: 68500, currency: "THB", status: "Completed" },
                { orderDate: "2025-07-15", orderNumber: "IMMY000198", referralId: "KMYAHMEDZ", belName: "Ahmad Hassan", amount: 3250, currency: "MYR", status: "Processing" },
                { orderDate: "2025-07-14", orderNumber: "IMZA000197", referralId: "KZAVANWYC", belName: "Daniel van Wyk", amount: 15500, currency: "ZAR", status: "Completed" },
                { orderDate: "2025-07-13", orderNumber: "IMNL000196", referralId: "KNLPIETER", belName: "Pieter van Berg", amount: 1890.75, currency: "EUR", status: "Processing" },
                { orderDate: "2025-07-12", orderNumber: "IMSE000195", referralId: "KSEANDRES", belName: "Anders Larsson", amount: 18500, currency: "SEK", status: "Completed" },
                { orderDate: "2025-07-11", orderNumber: "IMNO000194", referralId: "KNOERICSO", belName: "Erik Andersen", amount: 16800, currency: "NOK", status: "Processing" },
                { orderDate: "2025-07-10", orderNumber: "IMCA000193", referralId: "KCAEMILYR", belName: "Emily Robertson", amount: 2650.30, currency: "CAD", status: "Completed" },
                { orderDate: "2025-07-09", orderNumber: "IMRU000192", referralId: "KRUIVANOV", belName: "Ivan Petrov", amount: 185000, currency: "RUB", status: "Canceled" },
                { orderDate: "2025-07-08", orderNumber: "IMIL000191", referralId: "KILCOHENM", belName: "Michael Cohen", amount: 3750.80, currency: "ILS", status: "Completed" },
                { orderDate: "2025-07-07", orderNumber: "IMIT000190", referralId: "KITROSSIT", belName: "Isabella Rossi", amount: 2180.45, currency: "EUR", status: "Processing" },
                { orderDate: "2025-07-06", orderNumber: "IMKR000189", referralId: "KKRNOAHIM", belName: "Noah Kim", amount: 2450000, currency: "KRW", status: "Completed" },
                { orderDate: "2025-07-05", orderNumber: "IMDE000188", referralId: "KDESCHMIT", belName: "Ava Schmidt", amount: 1685.20, currency: "EUR", status: "Processing" },
                { orderDate: "2025-07-04", orderNumber: "IMNL000187", referralId: "KNLPIETER", belName: "Pieter van Berg", amount: 1450.30, currency: "EUR", status: "Completed" },
                { orderDate: "2025-07-03", orderNumber: "IMSE000186", referralId: "KSEANDRES", belName: "Anders Larsson", amount: 16800, currency: "SEK", status: "Processing" },
                { orderDate: "2025-07-02", orderNumber: "IMNO000185", referralId: "KNOERICSO", belName: "Erik Andersen", amount: 15200, currency: "NOK", status: "Completed" },
                { orderDate: "2025-07-01", orderNumber: "IMCA000184", referralId: "KCAEMILYR", belName: "Emily Robertson", amount: 2350.75, currency: "CAD", status: "Processing" }
            ]
        },
        content: {
            assets: [
                { uploadDate: "2025-08-15", title: "ADAM-6017 Product Guide", subtitle: "Complete setup and configuration guide for ADAM-6017 series industrial modules", category: "IoTMart Campaign", pageLink: "https://example.com/products/adam-6017" },
                { uploadDate: "2025-08-10", title: "IoT Solutions Catalog", subtitle: "2025 Product Catalog with comprehensive IoT solutions and pricing", category: "Advantech Resource Website", pageLink: "https://example.com/catalog/2025" }
            ]
        },
        contactSupport: {
            tickets: [
                { 
                    ticketNumber: "TICK-2025-001", 
                    belName: "Maxwell Walker", 
                    referralId: "KTWADVANT", 
                    subject: "Payment inquiry for August", 
                    status: "Open",
                    message: "I have questions about my August payout calculation. The amount seems lower than expected based on my orders. Could you please review my account?",
                    replies: [
                        {
                            time: "2025-08-28 14:30",
                            text: "Thank you for contacting us. We have received your inquiry and our team is reviewing your August payout calculation. We will get back to you within 24 hours."
                        }
                    ]
                },
                { 
                    ticketNumber: "TICK-2025-002", 
                    belName: "Olivia Chen", 
                    referralId: "KUSOLVACE", 
                    subject: "Technical support for ADAM-6017", 
                    status: "Resolved",
                    message: "I'm having trouble setting up the ADAM-6017 device. The configuration seems to reset after each reboot. Could you provide updated firmware or configuration guide?",
                    replies: [
                        {
                            time: "2025-08-25 09:15",
                            text: "Please try updating to firmware version 2.1.3 available on our support portal. This should resolve the configuration reset issue."
                        },
                        {
                            time: "2025-08-25 16:45",
                            text: "The firmware update worked perfectly! Thank you for the quick resolution."
                        }
                    ]
                },
                { 
                    ticketNumber: "TICK-2025-003", 
                    belName: "Liam Müller", 
                    referralId: "KDEIMULER", 
                    subject: "Unable to access dashboard", 
                    status: "Open",
                    message: "I cannot log into my BEL dashboard. Getting 'Invalid credentials' error even though I'm using the correct password. Tried password reset but haven't received the email.",
                    replies: [
                        {
                            time: "2025-08-27 11:20",
                            text: "We found the issue - your account was temporarily locked due to multiple failed login attempts. We've unlocked it and sent you a password reset email. Please check your spam folder as well."
                        }
                    ]
                },
                { 
                    ticketNumber: "TICK-2025-004", 
                    belName: "Noah Kim", 
                    referralId: "KKRNOAHIM", 
                    subject: "Order status not updating", 
                    status: "Resolved",
                    message: "My recent order (IMKR240815) shows as 'Processing' for over a week. Customer is asking for updates. Can you check the status?",
                    replies: [
                        {
                            time: "2025-08-24 13:40",
                            text: "We checked your order IMKR240815. There was a delay in our warehouse due to inventory restocking. The order has now been shipped and tracking info has been updated."
                        },
                        {
                            time: "2025-08-24 15:20",
                            text: "Perfect, thank you! Customer received the tracking info and is satisfied."
                        }
                    ]
                },
                { 
                    ticketNumber: "TICK-2025-005", 
                    belName: "Sophia Dubois", 
                    referralId: "KFRDUBOIS", 
                    subject: "Commission calculation error", 
                    status: "Resolved",
                    message: "There seems to be an error in my July commission calculation. The amount is significantly lower than expected.",
                    replies: [
                        {
                            time: "2025-08-22 10:30",
                            text: "We've reviewed your July activity and found a calculation error. The correct commission has been added to your next payout."
                        }
                    ]
                },
                { 
                    ticketNumber: "TICK-2025-006", 
                    belName: "Kenji Tanaka", 
                    referralId: "KJPTANAKA", 
                    subject: "Product catalog access issue", 
                    status: "Closed",
                    message: "I cannot access the new product catalog section. Getting a 404 error when clicking the link.",
                    replies: [
                        {
                            time: "2025-08-20 14:15",
                            text: "The catalog link has been updated. Please clear your browser cache and try the new link we've sent via email."
                        }
                    ]
                },
                { 
                    ticketNumber: "TICK-2025-007", 
                    belName: "Isabella Rossi", 
                    referralId: "KITROSSIT", 
                    subject: "Banking information update request", 
                    status: "Resolved",
                    message: "I need to update my banking information for future payouts. What documents are required?",
                    replies: [
                        {
                            time: "2025-08-18 11:45",
                            text: "Please provide a bank statement and voided check. You can upload these in your profile settings under Banking Information."
                        }
                    ]
                },
                { 
                    ticketNumber: "TICK-2025-008", 
                    belName: "Ava Schmidt", 
                    referralId: "KDESCHMIT", 
                    subject: "Referral link not working", 
                    status: "Resolved",
                    message: "My referral link seems to be broken. Customers are getting an error when they try to use it.",
                    replies: [
                        {
                            time: "2025-08-17 16:20",
                            text: "The issue has been fixed. Your referral link is now working properly. We've also credited you for any lost referrals during the downtime."
                        }
                    ]
                },
                { 
                    ticketNumber: "TICK-2025-009", 
                    belName: "Lucas Garcia", 
                    referralId: "KMXGARCIA", 
                    subject: "Training material request", 
                    status: "Closed",
                    message: "Could you provide updated training materials for the new IoT product line?",
                    replies: [
                        {
                            time: "2025-08-15 13:30",
                            text: "Training materials have been uploaded to your resource center. Check the 'Training' section in your dashboard."
                        }
                    ]
                },
                { 
                    ticketNumber: "TICK-2025-010", 
                    belName: "Mia Wang", 
                    referralId: "KCNMIAWAN", 
                    subject: "Performance report discrepancy", 
                    status: "Resolved",
                    message: "The performance report shows different numbers than what I'm seeing in my dashboard analytics.",
                    replies: [
                        {
                            time: "2025-08-14 09:45",
                            text: "There was a sync issue between the dashboard and reporting systems. This has been resolved and your reports are now accurate."
                        }
                    ]
                },
                { 
                    ticketNumber: "TICK-2025-011", 
                    belName: "Emma Johnson", 
                    referralId: "KAUJOISON", 
                    subject: "Email notification settings", 
                    status: "Closed",
                    message: "I'm not receiving email notifications for new orders. How can I enable them?",
                    replies: [
                        {
                            time: "2025-08-12 15:20",
                            text: "Email notifications have been enabled for your account. Please check your notification preferences in settings to customize them."
                        }
                    ]
                },
                { 
                    ticketNumber: "TICK-2025-013", 
                    belName: "Isabella López", 
                    referralId: "KMXLOPEZZ", 
                    subject: "Level upgrade criteria", 
                    status: "Resolved",
                    message: "What are the specific criteria to upgrade from Builder to Enabler level?",
                    replies: [
                        {
                            time: "2025-08-10 14:00",
                            text: "To upgrade to Enabler level, you need 50+ orders and $15,000+ in total revenue. You're currently at 42 orders and $12,800 revenue. Keep up the great work!"
                        }
                    ]
                },
                { 
                    ticketNumber: "TICK-2025-014", 
                    belName: "Sarah Wilson", 
                    referralId: "KPLKAROLN", 
                    subject: "Customer contact information update", 
                    status: "Closed",
                    message: "Need to update customer contact information for order IMPL240810.",
                    replies: [
                        {
                            time: "2025-08-09 16:40",
                            text: "Customer information has been updated. The order has been processed with the new contact details."
                        }
                    ]
                },
                { 
                    ticketNumber: "TICK-2025-015", 
                    belName: "Carlos Silva", 
                    referralId: "KBRSILVAN", 
                    subject: "Pricing update request", 
                    status: "Resolved",
                    message: "The pricing sheet for Brazilian market seems outdated. Could you provide the latest pricing?",
                    replies: [
                        {
                            time: "2025-08-08 11:15",
                            text: "The updated pricing sheet for Brazil has been uploaded to your resource center under 'Regional Pricing'."
                        }
                    ]
                },
                { 
                    ticketNumber: "TICK-2025-016", 
                    belName: "Rajesh Patel", 
                    referralId: "KINRAJESH", 
                    subject: "Marketing material request", 
                    status: "Resolved",
                    message: "I need brochures and presentation materials for an upcoming trade show in Mumbai.",
                    replies: [
                        {
                            time: "2025-08-07 13:15",
                            text: "Marketing materials have been prepared and shipped to your address. Tracking number: TN12345678."
                        }
                    ]
                },
                { 
                    ticketNumber: "TICK-2025-017", 
                    belName: "Michael Johnson", 
                    referralId: "KSGJOHNSO", 
                    subject: "Account verification issue", 
                    status: "Closed",
                    message: "My account verification is pending for over two weeks. What additional documents are needed?",
                    replies: [
                        {
                            time: "2025-08-06 10:30",
                            text: "Your account has been successfully verified. You now have access to all BEL features and benefits."
                        }
                    ]
                },
                { 
                    ticketNumber: "TICK-2025-018", 
                    belName: "David Wong", 
                    referralId: "KTHWONGCH", 
                    subject: "Technical documentation request", 
                    status: "Resolved",
                    message: "Could you provide technical specifications for the new EKI series switches?",
                    replies: [
                        {
                            time: "2025-08-05 15:45",
                            text: "Technical documentation has been added to your resource library under 'Product Specifications'."
                        }
                    ]
                },
                { 
                    ticketNumber: "TICK-2025-019", 
                    belName: "Ahmad Hassan", 
                    referralId: "KMYAHMEDZ", 
                    subject: "Commission tier advancement", 
                    status: "Closed",
                    message: "When will I be eligible for the next commission tier? What are the requirements?",
                    replies: [
                        {
                            time: "2025-08-04 12:20",
                            text: "Based on your current performance, you're eligible for tier advancement next month. Congratulations!"
                        }
                    ]
                },
                { 
                    ticketNumber: "TICK-2025-020", 
                    belName: "Pieter van Berg", 
                    referralId: "KNLPIETER", 
                    subject: "Shipping address update", 
                    status: "Resolved",
                    message: "Need to update my shipping address for sample product deliveries.",
                    replies: [
                        {
                            time: "2025-08-03 14:10",
                            text: "Your shipping address has been updated in our system. Future deliveries will be sent to the new address."
                        }
                    ]
                },
                { 
                    ticketNumber: "TICK-2025-021", 
                    belName: "Anders Larsson", 
                    referralId: "KSEANDRES", 
                    subject: "Partnership opportunity inquiry", 
                    status: "Closed",
                    message: "Interested in exploring strategic partnership opportunities for enterprise clients in Nordic region.",
                    replies: [
                        {
                            time: "2025-08-02 11:55",
                            text: "Thank you for your interest. Our partnership team will contact you within 48 hours to discuss opportunities."
                        }
                    ]
                },
                { 
                    ticketNumber: "TICK-2025-022", 
                    belName: "Erik Andersen", 
                    referralId: "KNOERICSO", 
                    subject: "Event registration assistance", 
                    status: "Resolved",
                    message: "Having trouble registering for the upcoming BEL conference. The registration form keeps timing out.",
                    replies: [
                        {
                            time: "2025-08-01 09:30",
                            text: "We've manually registered you for the conference. You'll receive a confirmation email with all event details."
                        }
                    ]
                },
                { 
                    ticketNumber: "TICK-2025-023", 
                    belName: "Emily Robertson", 
                    referralId: "KCAEMILYR", 
                    subject: "Product sample request", 
                    status: "Closed",
                    message: "Could I get samples of the latest sensor products for customer demonstrations in Canada?",
                    replies: [
                        {
                            time: "2025-07-31 16:25",
                            text: "Sample kit has been prepared and will be shipped tomorrow. You'll receive tracking information via email."
                        }
                    ]
                },
                { 
                    ticketNumber: "TICK-2025-024", 
                    belName: "Daniel van Wyk", 
                    referralId: "KZAVANWYC", 
                    subject: "Customer support escalation", 
                    status: "Resolved",
                    message: "My customer is experiencing issues with their order and needs immediate assistance.",
                    replies: [
                        {
                            time: "2025-07-30 13:40",
                            text: "We've contacted your customer directly and resolved their issue. A replacement unit has been expedited."
                        }
                    ]
                }
            ]
        },
        announcements: {
            announcements: [
                { created: "2025-08-26", category: "Important", title: "Urgent System Alert", body: "Critical security update required", link: "https://example.com/security-update" },
                { created: "2025-08-25", category: "System", title: "Platform Maintenance", body: "Scheduled maintenance on September 1st", link: "https://example.com/maintenance" },
                { created: "2025-08-20", category: "Campaign Launch", title: "New ADAM Series Available", body: "Latest ADAM series now available for promotion", link: "https://example.com/adam-series" },
                { created: "2025-08-15", category: "Payout Reminder", title: "Monthly Payout Schedule", body: "August payout processing completed", link: "https://example.com/payout-info" }
            ]
        }
    };

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
        applyBtn: document.getElementById('apply-filters'),
        resetBtn: document.getElementById('reset-filters'),
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
        rowsPerPage: 20, 
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
        annRowsPerPage: 10
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
                'AUD': { symbol: 'AUD', decimals: 2, position: 'before' }
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
        
        formatPercent: (decimal) => `${(decimal * 100).toFixed(1)}%`,
        
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
                border: 3px solid var(--ds-color-link);
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

        // Create random photo avatar for Account Management (simulate real user photos)
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
            
            // Use Lorem Picsum for random but consistent photos based on seed
            // This service provides random photos that are consistent for the same seed
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

        renderSummaryStats() {
            const statsContainer = document.querySelector('.bel-stats-cards');
            if (!statsContainer) return;
            
            const stats = APP_DATA.dashboard.summaryStats;
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

        renderPerformanceTable() {
            const tableBody = document.querySelector('#performance-table-view tbody');
            if (!tableBody) return;
            
            tableBody.innerHTML = APP_DATA.dashboard.performanceByLevel.details.map(detail => `
                <tr>
                    <td><span class="bel-badge ${detail.level.toLowerCase()}">${detail.level}</span></td>
                    <td>${detail.clicks}</td>
                    <td>${detail.revenue}</td>
                    <td>${detail.orders}</td>
                    <td>${detail.convRate}</td>
                    <td>${detail.aov}</td>
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
                const pieData = APP_DATA.dashboard.performanceByLevel.distribution;
                new Chart(pieCtx, {
                    type: 'doughnut',
                    data: {
                        labels: pieData.labels,
                        datasets: [{
                            label: 'BEL Count (#)',
                            data: pieData.data,
                            backgroundColor: pieData.colors,
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
                const performanceData = APP_DATA.dashboard.performanceByLevel.details;
                
                // Get CSS variables for colors
                const rootStyle = getComputedStyle(document.documentElement);
                const colors = {
                    gray90: rootStyle.getPropertyValue('--ds-color-gray-90').trim() || '#0c0c0c',
                    gray80: rootStyle.getPropertyValue('--ds-color-gray-80').trim() || '#434447',
                    gray70: rootStyle.getPropertyValue('--ds-color-gray-70').trim() || '#737b7d',
                    gray60: rootStyle.getPropertyValue('--ds-color-gray-60').trim() || '#b6bfc1'
                };
                
                // Prepare data for the chart
                const labels = performanceData.map(d => d.level);
                const revenueData = performanceData.map(d => parseFloat(d.revenue.replace(/[$,]/g, '')));
                const clicksData = performanceData.map(d => parseFloat(d.clicks.replace(/[,]/g, '')));
                const ordersData = performanceData.map(d => d.orders);
                const convRateData = performanceData.map(d => parseFloat(d.convRate.replace('%', '')));

                new Chart(performanceCtx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                label: 'Revenue ($000s)',
                                data: revenueData.map(val => val / 1000), // Convert to thousands
                                backgroundColor: colors.gray90,
                                borderColor: colors.gray90,
                                borderWidth: 1,
                                yAxisID: 'y'
                            },
                            {
                                label: 'Clicks (000s)',
                                data: clicksData.map(val => val / 1000), // Convert to thousands
                                backgroundColor: colors.gray80,
                                borderColor: colors.gray80,
                                borderWidth: 1,
                                yAxisID: 'y'
                            },
                            {
                                label: 'Orders',
                                data: ordersData,
                                backgroundColor: colors.gray70,
                                borderColor: colors.gray70,
                                borderWidth: 1,
                                yAxisID: 'y1'
                            },
                            {
                                label: 'C2O CVR (%)',
                                data: convRateData,
                                backgroundColor: colors.gray60,
                                borderColor: colors.gray60,
                                borderWidth: 1,
                                type: 'line',
                                fill: false,
                                tension: 0.1,
                                yAxisID: 'y2'
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
                                    text: 'Revenue ($000s) / Clicks (000s)'
                                },
                                beginAtZero: true
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

            this.belData = APP_DATA.dashboard.leaderboard.map(leader => ({
                id: leader.id,
                name: leader.name,
                email: leader.email || `${leader.name.toLowerCase().replace(' ', '.')}@company.com`,
                code: `${leader.name.split(' ')[0].toUpperCase()}${Math.floor(Math.random() * 100)}`,
                level: leader.level,
                clicks30: leader.clicks,
                orders30: leader.orders,
                revenue30: leader.revenue,
                country: getCountryName(getCountryCode(leader.id)),
                get region() { return utils.getRegionFromCountry(this.country); },
                tags: ['Top Performer']
            }));
        },

        setupEventListeners() {
            ui.applyBtn?.addEventListener('click', () => this.applyFilters());
            ui.resetBtn?.addEventListener('click', () => this.resetFilters());
            ui.rowsPerPage?.addEventListener('change', () => this.changeRowsPerPage());
            ui.prevBtn?.addEventListener('click', () => this.previousPage());
            ui.nextBtn?.addEventListener('click', () => this.nextPage());
            ui.thSelect?.addEventListener('change', (e) => this.toggleSelectAll(e.target.checked));
            ui.selectAllPage?.addEventListener('change', (e) => this.toggleSelectAll(e.target.checked));
            ui.thead?.addEventListener('click', (e) => this.handleSort(e));
            ui.exportBtn?.addEventListener('click', () => this.exportCSV());

            // Search suggestions
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
                        <td style="text-align:right;">${record.orders30 ? utils.formatMoney(aov) : '-'}</td>
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

        resetFilters() {
            document.getElementById('bel-filters')?.reset();
            this.applyFilters();
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
            alert('Export CSV functionality is a placeholder for now.');
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
        individualPerformanceChart: null,
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
            let record = AccountManagement.belData.find(r => r.id === id);
            
            if (!record && linkElement) {
                // Extract data from table row if not found in belData
                const tr = linkElement.closest('tr');
                const cells = tr ? Array.from(tr.children) : [];
                const name = (cells[2]?.textContent || '').trim() || '—';
                const level = (cells[3]?.textContent || '').trim() || 'Explorer';
                const clicks = parseInt((cells[5]?.textContent || '').replace(/[^\d.-]/g,''), 10) || 0;
                const orders = parseInt((cells[6]?.textContent || '').replace(/[^\d.-]/g,''), 10) || 0;
                const revenue = parseFloat((cells[7]?.textContent || '').replace(/[^0-9.-]/g,'')) || 0;
                
                record = {
                    id: id || `DASH-${Date.now()}`,
                    name,
                    code: '—',
                    level,
                    clicks30: clicks,
                    orders30: orders,
                    revenue30: revenue,
                    region: '—',
                    country: '—',
                    city: '—',
                    status: 'Active',
                    tags: []
                };
            }

            if (!record) return;

            appState.currentReferralId = record.id;
            this.fillModal(record);
            
            // Reset to first tab (Performance) when opening modal
            this.resetToFirstTab();
            
            ui.modal?.classList.add('show');
            
            // Scroll modal to top when opened
            setTimeout(() => {
                const modalContent = ui.modal?.querySelector('.modal-content');
                if (modalContent) {
                    modalContent.scrollTop = 0;
                }
                // Also scroll the modal overlay to top
                if (ui.modal) {
                    ui.modal.scrollTop = 0;
                }
            }, 50);
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
                    const record = AccountManagement.belData.find(x => x.id === appState.currentReferralId);
                    if (record) {
                        this.initializeIndividualPerformanceChart(record);
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
            
            if (totalClicksEl) totalClicksEl.textContent = (record.clicks30 || 0).toLocaleString();
            if (totalOrdersEl) totalOrdersEl.textContent = (record.orders30 || 0).toLocaleString();
            if (totalRevenueEl) totalRevenueEl.textContent = utils.formatMoney(record.revenue30 || 0);
            
            // Calculate conversion rate and AOV
            const convRate = record.clicks30 ? (record.orders30 / record.clicks30) * 100 : 0;
            const aov = record.orders30 ? record.revenue30 / record.orders30 : 0;
            
            if (convRateEl) convRateEl.textContent = `${convRate.toFixed(2)}%`;
            if (aovEl) aovEl.textContent = utils.formatMoney(aov, 2);
        },

        updateCustomerInsights(record) {
            if (!record) return;
            
            const salesData = this.getBelSalesData(record.id);
            const insights = this.generateDemoInsights(record);
            
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
                // Create demo data based on BEL level and characteristics
                const record = AccountManagement.belData.find(x => x.id === referralId);
                appState.customerInsights[referralId] = this.generateDemoInsights(record);
            }
            
            return appState.customerInsights[referralId];
        },

        generateDemoInsights(record) {
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
                topCategories: topCategories.length > 0 ? topCategories : ['Remote I/O Modules', 'Network Communications'],
                topProducts: topProducts.length > 0 ? topProducts : ['ADAM-6017-D', 'WISE-4050E']
            };
        },

        getBelSalesData(referralId) {
            // Initialize sales data if not exists
            if (!appState.belSalesData) {
                appState.belSalesData = {};
            }
            
            if (!appState.belSalesData[referralId]) {
                appState.belSalesData[referralId] = this.generateDemoSalesData(referralId);
            }
            
            return appState.belSalesData[referralId];
        },

        generateDemoSalesData(referralId) {
            // Get BEL record to determine sales pattern based on level and performance
            const record = AccountManagement.belData.find(x => x.id === referralId);
            const level = record?.level || 'Explorer';
            const revenue = record?.revenue30 || 5000;
            
            // Real product catalog based on actual Advantech products
            const productCatalog = [
                // IoT Gateway & Edge Intelligence
                { name: 'AIR-030-S30A1', description: 'Edge AI NVIDIA AGX Orin 64G inference system', category: 'IoT Gateway & Edge Intelligence', avgPrice: 4999, levelFactor: { Explorer: 0.8, Leader: 2.0, Enabler: 0.5, Builder: 0.6 } },
                { name: 'UNO-2484G-7731BE', description: 'i7-7600U, 8G RAM w/4xLAN,4xCOM,1xMini', category: 'IoT Gateway & Edge Intelligence', avgPrice: 3299, levelFactor: { Explorer: 1.0, Leader: 1.8, Enabler: 0.4, Builder: 0.7 } },
                { name: 'ECU-150-12A', description: 'A53 1.3GHz,2xLAN,2xcom,1x', category: 'IoT Gateway & Edge Intelligence', avgPrice: 899, levelFactor: { Explorer: 1.2, Leader: 1.5, Enabler: 1.0, Builder: 0.8 } },
                { name: 'EKI-1211-A', description: '1-port modbus gateway', category: 'IoT Gateway & Edge Intelligence', avgPrice: 299, levelFactor: { Explorer: 1.3, Leader: 1.2, Enabler: 1.4, Builder: 1.1 } },
                { name: 'ECU-1251D-R10AA', description: 'Cloud enabled Intelligent Communication Gateway', category: 'IoT Gateway & Edge Intelligence', avgPrice: 1599, levelFactor: { Explorer: 1.1, Leader: 1.6, Enabler: 0.9, Builder: 0.7 } },
                { name: 'AIR-020X-S9A1', description: 'Edge AI NVIDIA Xavier NX inference system', category: 'IoT Gateway & Edge Intelligence', avgPrice: 2999, levelFactor: { Explorer: 0.9, Leader: 1.9, Enabler: 0.4, Builder: 0.5 } },
                { name: 'UNO-127-E22BA', description: 'ATOM X6413E, 1.5GHZ, 4G DDR4, 2LAN, 2USB', category: 'IoT Gateway & Edge Intelligence', avgPrice: 799, levelFactor: { Explorer: 1.4, Leader: 1.3, Enabler: 1.2, Builder: 1.0 } },
                { name: 'UNO-2271G-N231AU', description: 'Pocket-Size Edge IoT Gateway with Intel', category: 'IoT Gateway & Edge Intelligence', avgPrice: 1299, levelFactor: { Explorer: 1.3, Leader: 1.4, Enabler: 1.1, Builder: 0.9 } },

                // Peripherals & Modules  
                { name: 'SQR-UD4S4G3K2HN', description: 'UDIMM DDR4 3200 4GB 512x16 (0-85) Hynix', category: 'Peripherals & Modules', avgPrice: 89, levelFactor: { Explorer: 1.0, Leader: 1.1, Enabler: 1.2, Builder: 1.8 } },
                { name: 'SQR-SD4N32G3K2HN', description: 'SODIMM ECC DDR4 3200 32GB 2Gx8 (0-85) Hynix', category: 'Peripherals & Modules', avgPrice: 599, levelFactor: { Explorer: 0.7, Leader: 1.5, Enabler: 0.6, Builder: 1.4 } },
                { name: 'SQR-UD4N8G3K2HE', description: 'UDIMM ECC DDR4 3200 8GB 1Gx8 (0-85) Hynix', category: 'Peripherals & Modules', avgPrice: 149, levelFactor: { Explorer: 1.1, Leader: 1.2, Enabler: 1.0, Builder: 1.6 } },
                { name: 'SQR-UD4N16G3K2H', description: 'UDIMM ECC DDR4 3200 16GB 1Gx8 (0-85) Hynix', category: 'Peripherals & Modules', avgPrice: 289, levelFactor: { Explorer: 0.9, Leader: 1.3, Enabler: 0.8, Builder: 1.5 } },
                { name: 'SQR-UD4N32G3K2H', description: 'UDIMM ECC DDR4 3200 32GB 2Gx8 (0-85) Hynix', category: 'Peripherals & Modules', avgPrice: 589, levelFactor: { Explorer: 0.6, Leader: 1.4, Enabler: 0.5, Builder: 1.3 } },
                { name: 'SQR-SD4S4G3K2HN', description: 'SODIMM DDR4 3200 4GB 512x16 (0-85) Hynix', category: 'Peripherals & Modules', avgPrice: 79, levelFactor: { Explorer: 1.2, Leader: 1.0, Enabler: 1.3, Builder: 1.9 } },
                { name: 'SQR-SD4N8G3K2HE', description: 'SODIMM ECC DDR4 3200 8GB 1Gx8 (0-85) Hynix', category: 'Peripherals & Modules', avgPrice: 159, levelFactor: { Explorer: 1.0, Leader: 1.1, Enabler: 1.1, Builder: 1.7 } },
                { name: 'SQR-SD4N16G3K2H', description: 'SODIMM ECC DDR4 3200 16GB 1Gx8 (0-85) Hynix', category: 'Peripherals & Modules', avgPrice: 299, levelFactor: { Explorer: 0.8, Leader: 1.2, Enabler: 0.9, Builder: 1.6 } },

                // Embedded Computers
                { name: 'UNO-247-N3N1A', description: 'N97, w/4xLAN, 1xVGA, 1xHDMI, 4xCOM', category: 'Embedded Computers', avgPrice: 1299, levelFactor: { Explorer: 1.3, Leader: 1.4, Enabler: 1.2, Builder: 0.8 } },
                { name: 'UNO-238-C7N1AE', description: 'i7-8665UE 4xUSB 3.2 DP+HDMI,2xCOM,GPIO/C', category: 'Embedded Computers', avgPrice: 2199, levelFactor: { Explorer: 1.0, Leader: 1.7, Enabler: 0.7, Builder: 0.6 } },
                { name: 'UNO-238-C5N1AE', description: 'i5-1245UE 4xUSB 3.2 DP+HDMI,2xCOM,GPIO/C', category: 'Embedded Computers', avgPrice: 1799, levelFactor: { Explorer: 1.1, Leader: 1.5, Enabler: 0.8, Builder: 0.7 } },
                { name: 'UNO-238-C3N1AE', description: 'i3-1215UE 4xUSB 3.2 DP+HDMI,2xCOM,GPIO/C', category: 'Embedded Computers', avgPrice: 1399, levelFactor: { Explorer: 1.2, Leader: 1.3, Enabler: 1.0, Builder: 0.9 } },
                { name: 'ARK-3534B-00A1', description: 'Intel ADL-S H610E PCIeX4+PCIeX16, 9-36V', category: 'Embedded Computers', avgPrice: 2499, levelFactor: { Explorer: 0.8, Leader: 1.8, Enabler: 0.5, Builder: 0.6 } },
                { name: 'UNO-2271G-N231AE', description: 'N41x5 1.2GHz, 8-RAM, 64G, 2xGbE, 2xUSB', category: 'Embedded Computers', avgPrice: 999, levelFactor: { Explorer: 1.4, Leader: 1.2, Enabler: 1.3, Builder: 1.0 } },
                { name: 'ARK-2251-S3A1U', description: 'Intel Raptor Lake i3 1335UE 1.3G 15G&E+6', category: 'Embedded Computers', avgPrice: 1699, levelFactor: { Explorer: 1.0, Leader: 1.4, Enabler: 0.8, Builder: 0.7 } },
                { name: 'ARK-2251-S2A1U', description: 'Intel Raptor Lake i3 1315UE 1.2G 15G&E+6', category: 'Embedded Computers', avgPrice: 1599, levelFactor: { Explorer: 1.1, Leader: 1.3, Enabler: 0.9, Builder: 0.8 } },

                // Mobile Tablets & Devices
                { name: 'AIM-77S-SW01000', description: 'Wifi 6E, 4GB/64GB, NFC, ADP, Std. OS', category: 'Mobile Tablets & Devices', avgPrice: 1299, levelFactor: { Explorer: 1.5, Leader: 1.0, Enabler: 1.6, Builder: 0.9 } },
                { name: 'AIM-77S-SW11000', description: 'Wifi 6E, 6GB/64GB, ADP, Std. OS', category: 'Mobile Tablets & Devices', avgPrice: 1499, levelFactor: { Explorer: 1.4, Leader: 1.1, Enabler: 1.5, Builder: 0.8 } },
                { name: 'LEO-L50-G0', description: 'LEO-L50 Outdoor Asset Management - Core Unit', category: 'Mobile Tablets & Devices', avgPrice: 899, levelFactor: { Explorer: 1.3, Leader: 1.2, Enabler: 1.4, Builder: 1.0 } },
                { name: 'AIM-77S-SW00000', description: 'Wifi 6E, 4GB/64GB, NFC, BCR, ADP, Std. OS', category: 'Mobile Tablets & Devices', avgPrice: 1399, levelFactor: { Explorer: 1.4, Leader: 0.9, Enabler: 1.7, Builder: 0.8 } },
                { name: 'AIM-68S-201B10', description: '10i/N50/8G/128G/Win 11/Wifi 6E/W BCR', category: 'Mobile Tablets & Devices', avgPrice: 1799, levelFactor: { Explorer: 1.2, Leader: 1.3, Enabler: 1.3, Builder: 0.7 } },
                { name: 'AIM-68S-201B00', description: '10i/N200/8G/128G/Win 11/Wifi 6E/W BCR', category: 'Mobile Tablets & Devices', avgPrice: 1699, levelFactor: { Explorer: 1.3, Leader: 1.2, Enabler: 1.4, Builder: 0.8 } },
                { name: 'AIM-68S-201010', description: '10i/N200/8G/128G/Win 11/Wifi 6E', category: 'Mobile Tablets & Devices', avgPrice: 1599, levelFactor: { Explorer: 1.4, Leader: 1.1, Enabler: 1.5, Builder: 0.9 } },
                { name: 'AIM-68S-201000', description: '10i/N200/8G/128G/Win 11/Wifi 6E', category: 'Mobile Tablets & Devices', avgPrice: 1499, levelFactor: { Explorer: 1.5, Leader: 1.0, Enabler: 1.6, Builder: 1.0 } },

                // Industrial Computer Boards
                { name: 'EPC-R7300U-ALA1NN', description: 'EPC-R7300U-ALA1NN w/ Nano-4GB,Ubuntu 12', category: 'Industrial Computer Boards', avgPrice: 899, levelFactor: { Explorer: 0.9, Leader: 1.4, Enabler: 0.8, Builder: 1.8 } },
                { name: 'RSB-4411CD-PNA2E', description: 'NXP A2 LMX8 Dual Core/1GB DDR 0~60', category: 'Industrial Computer Boards', avgPrice: 699, levelFactor: { Explorer: 0.8, Leader: 1.2, Enabler: 0.9, Builder: 1.9 } },
                { name: 'AIMB-788G2-00A1', description: 'LGA1700 ATX Q670E/BMC/DP/HDMI/2', category: 'Industrial Computer Boards', avgPrice: 1299, levelFactor: { Explorer: 0.7, Leader: 1.6, Enabler: 0.6, Builder: 1.6 } },
                { name: 'RSB-3720Q-ACA2E', description: 'A2 2.5 UIO SBC NXP L MX8M Plus Quad, 6G', category: 'Industrial Computer Boards', avgPrice: 999, levelFactor: { Explorer: 0.8, Leader: 1.3, Enabler: 0.7, Builder: 1.7 } },
                { name: 'SKY-MXM-A500-4SHA', description: 'Quadro A500 MXM 4GB MS Hybrid mode Type', category: 'Industrial Computer Boards', avgPrice: 1999, levelFactor: { Explorer: 0.5, Leader: 1.8, Enabler: 0.4, Builder: 1.4 } },
                { name: 'SKY-MXM-A2000-8SDA', description: 'Quadro A2000 MXM 8GB Discrete mode Type', category: 'Industrial Computer Boards', avgPrice: 2999, levelFactor: { Explorer: 0.4, Leader: 2.0, Enabler: 0.3, Builder: 1.3 } },
                { name: 'AIMB-B2000-15ZE', description: 'AIMB-B2000-Mini-ITX MB chassis w/ 150W P', category: 'Industrial Computer Boards', avgPrice: 799, levelFactor: { Explorer: 0.9, Leader: 1.1, Enabler: 0.8, Builder: 1.9 } },
                { name: 'AIMB-586QG2-00A1E', description: 'LGA1151 mATX 2DP/HDMI/eDP/6SATA/5', category: 'Industrial Computer Boards', avgPrice: 1199, levelFactor: { Explorer: 0.7, Leader: 1.4, Enabler: 0.6, Builder: 1.7 } },

                // Edge AI Solutions
                { name: 'MIC743AT7A1-ES', description: 'AI Inference System, NVIDIA Jetson Thor', category: 'Edge AI Solutions', avgPrice: 5999, levelFactor: { Explorer: 0.5, Leader: 2.2, Enabler: 0.3, Builder: 0.4 } },
                { name: 'MIC-711D-ON3A2', description: 'NVIDIA Jetson Orin Nano 8G Developer Kit', category: 'Edge AI Solutions', avgPrice: 1999, levelFactor: { Explorer: 0.9, Leader: 1.8, Enabler: 0.6, Builder: 1.2 } },
                { name: 'MIC-711-ON3A1', description: 'NVIDIA Jetson Orin NX 8G Lite AI System', category: 'Edge AI Solutions', avgPrice: 2499, levelFactor: { Explorer: 0.8, Leader: 1.9, Enabler: 0.5, Builder: 1.0 } },
                { name: 'MIC-711D-OX4A1', description: 'NVIDIA Jetson Orin NX 16G Lite AI System', category: 'Edge AI Solutions', avgPrice: 2999, levelFactor: { Explorer: 0.7, Leader: 2.0, Enabler: 0.4, Builder: 0.9 } },
                { name: 'MIC-711-OX4A1', description: 'NVIDIA Jetson Orin NX 16G Lite AI System', category: 'Edge AI Solutions', avgPrice: 2799, levelFactor: { Explorer: 0.7, Leader: 1.9, Enabler: 0.4, Builder: 1.0 } },
                { name: 'MIC-713S-ON3A1', description: 'NVIDIA Jetson Orin Nano 8GB AI Solution Kit', category: 'Edge AI Solutions', avgPrice: 2199, levelFactor: { Explorer: 0.8, Leader: 1.7, Enabler: 0.5, Builder: 1.1 } },
                { name: 'MIC-713S-ON2A1', description: 'NVIDIA Jetson Orin Nano 4GB AI Solution Kit', category: 'Edge AI Solutions', avgPrice: 1899, levelFactor: { Explorer: 0.9, Leader: 1.6, Enabler: 0.6, Builder: 1.2 } },

                // Network Communications
                { name: 'EKI-7720E-4FI-BE', description: '16FE+4SFP Port Managed Ethernet Switch Wide Temp', category: 'Network Communications', avgPrice: 1599, levelFactor: { Explorer: 1.0, Leader: 1.6, Enabler: 0.8, Builder: 0.7 } },
                { name: 'SFP-GSM3-40K', description: 'IE-SFP/1250-ED, SM1310/LONG-LC', category: 'Network Communications', avgPrice: 299, levelFactor: { Explorer: 1.2, Leader: 1.3, Enabler: 1.1, Builder: 1.0 } },
                { name: 'EKI-2711PSI-A', description: 'Industrial 25W PoE splitter', category: 'Network Communications', avgPrice: 199, levelFactor: { Explorer: 1.3, Leader: 1.2, Enabler: 1.4, Builder: 1.1 } },
                { name: 'EKI-2541S-BE', description: 'Ethernet to Single mode fiber media converter', category: 'Network Communications', avgPrice: 159, levelFactor: { Explorer: 1.2, Leader: 1.1, Enabler: 1.3, Builder: 1.2 } },
                { name: 'EKI-2541M-BE', description: 'Ethernet to Multi mode Fiber Media converter', category: 'Network Communications', avgPrice: 149, levelFactor: { Explorer: 1.3, Leader: 1.0, Enabler: 1.4, Builder: 1.3 } },
                { name: 'SFP-XSS-40KTX-LC', description: 'SFP+-10G, SSLX-SM-LC (1270XMT/1330RCV)', category: 'Network Communications', avgPrice: 399, levelFactor: { Explorer: 0.9, Leader: 1.4, Enabler: 0.8, Builder: 0.9 } },
                { name: 'SFP-XSS-40KRX-LC', description: 'SFP+-10G, SSLX-SM-LC (1330XMT/1270RCV)', category: 'Network Communications', avgPrice: 389, levelFactor: { Explorer: 0.9, Leader: 1.4, Enabler: 0.8, Builder: 0.9 } },

                // Remote I/O Modules
                { name: 'ADAM-6018-D', description: '8-ch Thermocouple Input Modbus/RTU Module', category: 'Remote I/O Modules', avgPrice: 599, levelFactor: { Explorer: 1.1, Leader: 1.4, Enabler: 1.2, Builder: 1.3 } },
                { name: 'ADAM-6015-D', description: '7-ch Isolated RTD Input Modbus/RTU Module', category: 'Remote I/O Modules', avgPrice: 549, levelFactor: { Explorer: 1.2, Leader: 1.3, Enabler: 1.3, Builder: 1.4 } },
                { name: 'WISE-4012E', description: '4-ch DI, 2-ch AI, 2-ch DO, Modbus/TCP, WISE-PaaS', category: 'Remote I/O Modules', avgPrice: 399, levelFactor: { Explorer: 1.3, Leader: 1.2, Enabler: 1.4, Builder: 1.5 } },
                { name: 'WISE-4050E', description: '4-ch DI, 4-ch DO, Modbus/TCP, WISE-PaaS', category: 'Remote I/O Modules', avgPrice: 359, levelFactor: { Explorer: 1.4, Leader: 1.1, Enabler: 1.5, Builder: 1.6 } },
                { name: 'ADAM-6050-D', description: '12-ch Isolated Digital I/O Modbus/RTU Module', category: 'Remote I/O Modules', avgPrice: 459, levelFactor: { Explorer: 1.2, Leader: 1.2, Enabler: 1.3, Builder: 1.5 } },
                { name: 'ADAM-6017-D', description: '8-ch Analog Input Modbus/RTU Module', category: 'Remote I/O Modules', avgPrice: 429, levelFactor: { Explorer: 1.3, Leader: 1.3, Enabler: 1.4, Builder: 1.6 } },
                { name: 'ADAM-6052-D', description: '8-ch Isolated Digital I/O, Modbus/TCP, WISE-PaaS', category: 'Remote I/O Modules', avgPrice: 489, levelFactor: { Explorer: 1.2, Leader: 1.2, Enabler: 1.3, Builder: 1.5 } },
                { name: 'WISE-4051-A', description: '4-ch DI, 4-ch DO, Modbus/TCP, WISE-PaaS', category: 'Remote I/O Modules', avgPrice: 339, levelFactor: { Explorer: 1.4, Leader: 1.0, Enabler: 1.6, Builder: 1.7 } },

                // Wireless Sensing & Solutions
                { name: 'WISE-4250-S214', description: 'WISE-4250 with 4AI+4DI', category: 'Wireless Sensing & Solutions', avgPrice: 599, levelFactor: { Explorer: 1.3, Leader: 1.2, Enabler: 1.4, Builder: 1.5 } },
                { name: 'WISE-4250-S252', description: 'WISE-4250 with 12DI+12DO', category: 'Wireless Sensing & Solutions', avgPrice: 649, levelFactor: { Explorer: 1.2, Leader: 1.3, Enabler: 1.3, Builder: 1.4 } },
                { name: 'WISE-4250-S232', description: 'WISE-4250 with Temperature & Humidity Sensor', category: 'Wireless Sensing & Solutions', avgPrice: 559, levelFactor: { Explorer: 1.4, Leader: 1.1, Enabler: 1.5, Builder: 1.6 } },
                { name: 'OPT1-ANT-5GSSW-30', description: '5G NR MIMO / 4G / 3G / 2G, WiFi 2.4/5.0/6 GHz', category: 'Wireless Sensing & Solutions', avgPrice: 899, levelFactor: { Explorer: 1.0, Leader: 1.4, Enabler: 0.9, Builder: 1.0 } },
                { name: 'ICR-2437-DE', description: 'Cellular Router, Cat4, LTE450, 2x ETH', category: 'Wireless Sensing & Solutions', avgPrice: 799, levelFactor: { Explorer: 1.1, Leader: 1.3, Enabler: 1.0, Builder: 0.9 } },
                { name: 'WISE-4252-A', description: 'WISE-4250 12DI/12DO I/O Module', category: 'Wireless Sensing & Solutions', avgPrice: 459, levelFactor: { Explorer: 1.3, Leader: 1.0, Enabler: 1.4, Builder: 1.7 } },
                { name: '1751000717-01', description: 'Dipole Ant.WiFi 6E SMA/M-R RG178 BLK L18', category: 'Wireless Sensing & Solutions', avgPrice: 49, levelFactor: { Explorer: 1.5, Leader: 0.8, Enabler: 1.6, Builder: 2.0 } },
                { name: 'AIW-169BN-GX1', description: 'Wi-Fi 6E M.2 solution based on Realtek R', category: 'Wireless Sensing & Solutions', avgPrice: 159, levelFactor: { Explorer: 1.2, Leader: 0.9, Enabler: 1.3, Builder: 1.8 } },

                // AIoT Software & Solutions
                { name: 'LEO-S592-AQE0', description: 'LEO-S LoRaWAN 7 in 1 AQI sensor 868', category: 'AIoT Software & Solutions', avgPrice: 399, levelFactor: { Explorer: 1.2, Leader: 1.4, Enabler: 1.3, Builder: 1.1 } },
                { name: 'LEO-S572-TPE0', description: 'LEO-S LoRaWAN Temp Probe sensor 868', category: 'AIoT Software & Solutions', avgPrice: 299, levelFactor: { Explorer: 1.3, Leader: 1.2, Enabler: 1.4, Builder: 1.2 } },
                { name: 'LEO-S592-TPG0', description: 'LEO-S LoRaWAN Insertion Temperature Sensor', category: 'AIoT Software & Solutions', avgPrice: 329, levelFactor: { Explorer: 1.2, Leader: 1.3, Enabler: 1.3, Builder: 1.1 } },
                { name: 'LEO-S573-C2G0', description: 'LEO-S LoRaWAN CO2 sensor 915', category: 'AIoT Software & Solutions', avgPrice: 449, levelFactor: { Explorer: 1.1, Leader: 1.4, Enabler: 1.2, Builder: 1.0 } },
                { name: 'LEO-S550-DAG0', description: 'LEO-S LoRaWAN DAQ Controller 915', category: 'AIoT Software & Solutions', avgPrice: 599, levelFactor: { Explorer: 1.0, Leader: 1.5, Enabler: 1.1, Builder: 0.9 } },
                { name: 'PCIE-1154-BE', description: 'PCI Express x4, 4-Port USB 3.0 Host Adapter', category: 'AIoT Software & Solutions', avgPrice: 199, levelFactor: { Explorer: 1.2, Leader: 1.1, Enabler: 1.3, Builder: 1.6 } },
                { name: 'LEO-S595-MSG0', description: 'LEO-S LoRaWAN Magnetic Switch 915', category: 'AIoT Software & Solutions', avgPrice: 159, levelFactor: { Explorer: 1.4, Leader: 1.0, Enabler: 1.5, Builder: 1.3 } },
                { name: 'PCI-1245L-AE', description: 'Basic 4-Axis SoftMotion Controller', category: 'AIoT Software & Solutions', avgPrice: 799, levelFactor: { Explorer: 0.8, Leader: 1.6, Enabler: 0.9, Builder: 1.1 } },

                // Industrial Servers & IPC
                { name: 'MIC-7330B-C42N', description: 'Xeon w/ C422 6xUSB 3.1 3xLAN 1xHDMI 2xDP', category: 'Industrial Servers & IPC', avgPrice: 4999, levelFactor: { Explorer: 0.4, Leader: 2.1, Enabler: 0.2, Builder: 0.3 } },
                { name: 'ARK-3510P-U2A1E', description: 'Intel i5-12500TE 65W with', category: 'Industrial Servers & IPC', avgPrice: 2799, levelFactor: { Explorer: 0.6, Leader: 1.8, Enabler: 0.4, Builder: 0.5 } },
                { name: 'MIC-7700-11110AE', description: 'i7-12700E 1.5G 64G DDR5 2xLAN 1xCOM', category: 'Industrial Servers & IPC', avgPrice: 3599, levelFactor: { Explorer: 0.5, Leader: 1.9, Enabler: 0.3, Builder: 0.4 } },
                { name: 'MIC-7700-01100AE', description: 'i5-12500E 1.5G 64G DDR5 2xLAN 1xCOM', category: 'Industrial Servers & IPC', avgPrice: 2999, levelFactor: { Explorer: 0.6, Leader: 1.7, Enabler: 0.4, Builder: 0.5 } },

                // Industrial IoT Gateways  
                { name: 'ECU-1251D-R10AA', description: 'Cloud enabled Intelligent Communication Gateway', category: 'Industrial IoT Gateways', avgPrice: 1599, levelFactor: { Explorer: 1.1, Leader: 1.6, Enabler: 0.9, Builder: 0.7 } },
                { name: 'UNO-137-E42BA', description: 'Core i7-1185G7E 4.8GHz, 16G DDR4', category: 'Industrial IoT Gateways', avgPrice: 2299, levelFactor: { Explorer: 0.8, Leader: 1.7, Enabler: 0.6, Builder: 0.5 } },
                { name: 'ECU-1251D-E10AA', description: 'Cloud enabled Intelligent Communication Gateway', category: 'Industrial IoT Gateways', avgPrice: 1399, levelFactor: { Explorer: 1.2, Leader: 1.5, Enabler: 1.0, Builder: 0.8 } },
                { name: 'ECU-1251D-E10AE', description: 'Cloud enabled Intelligent Communication Gateway', category: 'Industrial IoT Gateways', avgPrice: 1499, levelFactor: { Explorer: 1.1, Leader: 1.5, Enabler: 0.9, Builder: 0.7 } },
                { name: 'UNO-137-E42B', description: 'Core i7-1185G7E 4.8GHz, 16G DDR4', category: 'Industrial IoT Gateways', avgPrice: 2199, levelFactor: { Explorer: 0.8, Leader: 1.7, Enabler: 0.6, Builder: 0.5 } }
            ];
            
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
            
            // Sort by quantity and ensure minimum variety
            salesData.sort((a, b) => b.quantity - a.quantity);
            
            if (salesData.length < 10) {
                // Add some default items for BELs with low sales
                const defaultItems = [
                    { productName: 'ADAM-6017-D', productDescription: '8-ch Analog Input Modbus/RTU Module', category: 'Remote I/O Modules', quantity: 2, avgPrice: 429, totalRevenue: 858 },
                    { productName: 'WISE-4050E', productDescription: '4-ch DI, 4-ch DO, Modbus/TCP, WISE-PaaS', category: 'Remote I/O Modules', quantity: 3, avgPrice: 359, totalRevenue: 1077 },
                    { productName: 'EKI-2711PSI-A', productDescription: 'Industrial 25W PoE splitter', category: 'Network Communications', quantity: 1, avgPrice: 199, totalRevenue: 199 }
                ];
                salesData.push(...defaultItems);
            }
            
            return salesData;
        },

        initializeIndividualPerformanceChart(record) {
            const ctx = document.getElementById('bel-individual-performance-chart');
            if (!ctx || !window.Chart || !record) return;
            
            // Destroy existing chart if it exists
            if (this.individualPerformanceChart) {
                this.individualPerformanceChart.destroy();
            }
            
            // Get CSS colors - Blue color palette
            const rootStyle = getComputedStyle(document.documentElement);
            const blueColors = {
                primary: '#006EFF',      // Primary blue
                light: '#025324',        // Light blue  
                medium: '#F7C265',       // Medium blue
                dark: '#1A365D'          // Dark blue
            };
            
            // Prepare data based on the record
            const clicksValue = record.clicks30 || 0;
            const ordersValue = record.orders30 || 0;
            const revenueValue = record.revenue30 || 0;
            const convRate = clicksValue ? ((ordersValue / clicksValue) * 100) : 0;
            
            this.individualPerformanceChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Clicks (000s)', 'Orders', 'Revenue ($000s)', 'C2O CVR (%)'],
                    datasets: [{
                        label: 'Performance Metrics',
                        data: [
                            clicksValue / 1000, // Convert to thousands
                            ordersValue,
                            revenueValue / 1000, // Convert to thousands
                            convRate
                        ],
                        backgroundColor: [
                            blueColors.primary,    // Clicks
                            blueColors.light,      // Orders  
                            blueColors.medium,     // Revenue
                            blueColors.dark        // C2O CVR (%)
                        ],
                        borderColor: [
                            blueColors.primary,
                            blueColors.light,
                            blueColors.medium,
                            blueColors.dark
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                title: (tooltipItems) => tooltipItems[0].label,
                                label: (context) => {
                                    const label = context.label;
                                    let value = context.parsed.y;
                                    
                                    if (label.includes('Clicks')) {
                                        return `Clicks: ${(value * 1000).toLocaleString()}`;
                                    } else if (label.includes('Revenue')) {
                                        return `Revenue: ${utils.formatMoney(value * 1000)}`;
                                    } else if (label.includes('C2O CVR (%)')) {
                                        return `Conversion Rate: ${value.toFixed(2)}%`;
                                    } else {
                                        return `Orders: ${value.toLocaleString()}`;
                                    }
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Value'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Metrics'
                            }
                        }
                    }
                }
            });
        },

        initializePerformanceTrendChart(record) {
            const ctx = document.getElementById('bel-performance-trend-chart');
            if (!ctx || !window.Chart || !record) return;
            
            // Destroy existing chart if it exists
            if (this.performanceTrendChart) {
                this.performanceTrendChart.destroy();
            }
            
            // Generate mock trend data for the last 6 months
            const months = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
            const currentMonth = record.clicks30 || 0;
            const currentOrders = record.orders30 || 0;
            const currentRevenue = record.revenue30 || 0;
            
            // Generate trend data with some variation
            const clicksTrend = months.map((_, index) => {
                const factor = 0.7 + (index * 0.05) + (Math.random() * 0.2);
                return Math.round(currentMonth * factor);
            });
            
            const ordersTrend = months.map((_, index) => {
                const factor = 0.6 + (index * 0.06) + (Math.random() * 0.25);
                return Math.round(currentOrders * factor);
            });
            
            const revenueTrend = months.map((_, index) => {
                const factor = 0.65 + (index * 0.055) + (Math.random() * 0.22);
                return Math.round(currentRevenue * factor);
            });
            
            this.performanceTrendChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: months,
                    datasets: [
                        {
                            label: 'Clicks',
                            data: clicksTrend,
                            borderColor: '#006EFF',      // Primary blue
                            backgroundColor: '#006EFF',
                            tension: 0.1,
                            fill: false
                        },
                        {
                            label: 'Orders',
                            data: ordersTrend,
                            borderColor: '#025324',      // Light blue
                            backgroundColor: '#025324',
                            tension: 0.1,
                            fill: false
                        },
                        {
                            label: 'Revenue',
                            data: revenueTrend,
                            borderColor: '#F7C265',      // Medium blue
                            backgroundColor: '#F7C265',
                            tension: 0.1,
                            fill: false,
                            yAxisID: 'y1'
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
                                padding: 15
                            }
                        },
                        tooltip: {
                            callbacks: {
                                title: (tooltipItems) => `${tooltipItems[0].label} 2025`,
                                label: (context) => {
                                    const label = context.dataset.label;
                                    const value = context.parsed.y;
                                    
                                    if (label === 'Revenue') {
                                        return `${label}: ${utils.formatMoney(value)}`;
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
                                text: 'Month'
                            }
                        },
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            title: {
                                display: true,
                                text: 'Clicks / Orders'
                            },
                            beginAtZero: true
                        },
                        y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            title: {
                                display: true,
                                text: 'Revenue ($)'
                            },
                            beginAtZero: true,
                            grid: {
                                drawOnChartArea: false
                            }
                        }
                    }
                }
            });
        },

        closeModal() {
            ui.modal?.classList.remove('show');
            appState.currentReferralId = null;
            
            // Clean up charts
            if (this.individualPerformanceChart) {
                this.individualPerformanceChart.destroy();
                this.individualPerformanceChart = null;
            }
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
                const dashboardRecord = APP_DATA.dashboard.leaderboard.find(x => x.id === appState.currentReferralId);
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
            alertModal.style.zIndex = '2003';
            
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

            // Initialize demo history if none exists
            if (!appState.bankingHistory[appState.currentReferralId] || appState.bankingHistory[appState.currentReferralId].length === 0) {
                this.createDemoBankingHistory();
            }

            const history = appState.bankingHistory[appState.currentReferralId] || [];
            
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
            historyModal.style.zIndex = '2001';
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

        createDemoBankingHistory() {
            if (!appState.currentReferralId) return;

            // Initialize banking history if not exists
            if (!appState.bankingHistory) {
                appState.bankingHistory = {};
            }

            if (!appState.bankingHistory[appState.currentReferralId]) {
                appState.bankingHistory[appState.currentReferralId] = [];
            }

            // Get current user email for banking history
            const currentRecord = AccountManagement.belData.find(x => x.id === appState.currentReferralId);
            const userEmail = currentRecord?.email || 'maxwell.walker@advantech.com';

            // Create demo history data
            const demoHistory = [
                {
                    bankName: 'Chase Bank',
                    swiftCode: 'CHASUS33',
                    accountHolder: 'Maxwell Walker',
                    phone: '+1-555-0123',
                    address: '123 Main Street, New York, NY 10001, USA',
                    timestamp: new Date('2025-08-25T14:30:00').toISOString(),
                    changedBy: 'admin@belportal.com',
                    changeId: 'demo-003',
                    reason: 'Updated phone number per user request',
                    userEmail: userEmail
                },
                {
                    bankName: 'Chase Bank',
                    swiftCode: 'CHASUS33',
                    accountHolder: 'Maxwell Walker',
                    phone: '+1-555-9999',
                    address: '123 Main Street, New York, NY 10001, USA',
                    timestamp: new Date('2025-08-15T10:15:00').toISOString(),
                    changedBy: 'manager@belportal.com',
                    changeId: 'demo-002',
                    reason: 'Address verification completed',
                    userEmail: userEmail
                },
                {
                    bankName: 'Bank of America',
                    swiftCode: 'BOFAUS3N',
                    accountHolder: 'Maxwell J. Walker',
                    phone: '+1-555-8888',
                    address: '456 Oak Avenue, Boston, MA 02101, USA',
                    timestamp: new Date('2025-07-20T16:45:00').toISOString(),
                    changedBy: 'kyc@belportal.com',
                    changeId: 'demo-001',
                    reason: 'Initial banking information setup',
                    userEmail: userEmail
                }
            ];

            // Add demo data to history
            appState.bankingHistory[appState.currentReferralId] = demoHistory;
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
            if (accountContainer && APP_DATA.dashboard?.leaderboard) {
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
                    this.renderCurrentView();
                });
            }

            if (idInput) {
                idInput.addEventListener('input', () => {
                    this.renderCurrentView();
                });
            }

            if (levelSelect) {
                levelSelect.addEventListener('change', () => {
                    this.renderCurrentView();
                });
            }

            if (regionSelect) {
                regionSelect.addEventListener('change', () => {
                    this.renderCurrentView();
                });
            }

            if (sortSelect) {
                sortSelect.addEventListener('change', () => {
                    this.renderCurrentView();
                });
            }

            // Setup View Switcher
            this.setupViewSwitcher();
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
            if (!container || !APP_DATA.dashboard?.leaderboard) return;

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
            let accountData = APP_DATA.dashboard.leaderboard.map(account => {
                const country = getCountryFromId(account.id);
                return {
                    referralId: account.id,
                    name: account.name,
                    level: account.level,
                    clicks: account.clicks,
                    orders: account.orders,
                    revenue: account.revenue,
                    c20cvr: parseFloat(account.convRate.replace('%', '')),
                    aov: account.aov,
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
                        // Sort by level hierarchy: Leader > Explorer > Enabler > Builder
                        const levelOrder = { 'Leader': 4, 'Explorer': 3, 'Enabler': 2, 'Builder': 1 };
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

            container.innerHTML = '';
            
            // Show message if no results
            if (accountData.length === 0) {
                container.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #666;">No accounts found matching the current filters.</div>';
                return;
            }

            accountData.forEach(account => {
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
                                <span class="bel-acct-mgmt-text-cvr-var">${account.c20cvr}%</span>
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
                    const accountData = APP_DATA.dashboard.leaderboard.find(account => account.id === accountId);
                    if (accountData) {
                        // 使用現有的模態框邏輯
                        BELModal.openModal(accountData.id);
                    }
                });
            });
        },

        renderAccountList() {
            const tableBody = document.querySelector('#account-list-table tbody');
            if (!tableBody || !APP_DATA.dashboard?.leaderboard) return;

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
            let accountData = APP_DATA.dashboard.leaderboard.map(account => {
                const country = getCountryFromId(account.id);
                return {
                    referralId: account.id,
                    name: account.name,
                    level: account.level,
                    clicks: account.clicks,
                    orders: account.orders,
                    revenue: account.revenue,
                    c20cvr: parseFloat(account.convRate.replace('%', '')),
                    aov: account.aov,
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
                        // Sort by level hierarchy: Leader > Explorer > Enabler > Builder
                        const levelOrder = { 'Leader': 4, 'Explorer': 3, 'Enabler': 2, 'Builder': 1 };
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

            tableBody.innerHTML = '';
            
            // Show message if no results
            if (accountData.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="10" style="text-align: center; padding: 2rem; color: #666;">No accounts found matching the current filters.</td></tr>';
                return;
            }

            accountData.forEach(account => {
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
                    <td style="text-align: right;">${account.c20cvr.toFixed(1)}%</td>
                    <td style="text-align: right;">${account.aov}</td>
                    <td>${account.region}</td>
                    <td>${account.country}</td>
                `;

                tableBody.appendChild(row);
            });

            // 添加點擊事件處理
            this.setupAccountListEvents();
        },

        setupAccountListEvents() {
            const accountRows = document.querySelectorAll('#account-list-table tbody tr[data-account-id]');
            accountRows.forEach(row => {
                row.addEventListener('click', (e) => {
                    // 允許點擊連結正常工作，但防止ID連結觸發模態框
                    if (e.target.closest('a.bel-id-link')) return;
                    
                    const accountId = row.getAttribute('data-account-id');
                    // 觸發現有的BEL詳情模態框
                    const accountData = APP_DATA.dashboard.leaderboard.find(account => account.id === accountId);
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
                            <span class="bel-badge approved" style="margin-left:4px;">${APP_DATA.payoutsAndOrders.payouts.payoutDayMessage}</span>
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
                <h1 class="bel-h1">Publish Resource</h1>
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
            
            const payouts = APP_DATA.payoutsAndOrders.payouts.history;
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
            const payout = APP_DATA.payoutsAndOrders.payouts.history.find(p => p.date === payoutDate);
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

            modal.classList.add('show');
        },

        ensureSupportModal() {
            if (this.supportModalEl) return this.supportModalEl;
            
            const wrap = document.createElement('div');
            wrap.className = 'modal-overlay';
            wrap.id = 'support-ticket-modal';
            wrap.innerHTML = `
                <div class="modal-content" style="max-width:600px;">
                    <div class="modal-header">
                        <h3 style="margin:0;">Support Ticket</h3>
                        <button class="close-button" aria-label="Close">&times;</button>
                    </div>
                    <div class="modal-body-grid" style="grid-template-columns: 1fr;">
                        <div>
                            <div class="bel-grid-container grid-cols-2" style="margin-bottom:12px;">
                                <div class="bel-card" style="padding:4px;">
                                    <div class="bel-card-title">Ticket #</div>
                                    <div id="sup-t-id" class="bel-card-value" style="font-size:1.1rem;"></div>
                                </div>
                                <div class="bel-card" style="padding:4px;">
                                    <div class="bel-card-title">Status</div>
                                    <div id="sup-t-status" class="bel-card-value" style="font-size:1.1rem;"></div>
                                </div>
                            </div>

                            <div class="bel-grid-container grid-cols-2" style="margin-bottom:12px;">
                                <div class="bel-card" style="padding:4px;">
                                    <div class="bel-card-title">BEL Name</div>
                                    <div id="sup-bel-name" class="bel-card-value" style="font-size:1.1rem; display: flex; align-items: center; gap: 10px;"></div>
                                </div>
                                <div class="bel-card" style="padding:4px;">
                                    <div class="bel-card-title">Referral ID</div>
                                    <div id="sup-referral-id" class="bel-card-value" style="font-size:1.1rem;"></div>
                                </div>
                            </div>

                            <div class="bel-card" style="padding:4px; margin-bottom:12px;">
                                <div class="bel-card-title">Subject</div>
                                <div id="sup-subject" style="font-weight:400;"></div>
                            </div>

                            <div class="bel-card" style="padding:4px; margin-bottom:12px;">
                                <div class="bel-card-title">Message</div>
                                <div id="sup-message" class="small-text"></div>
                            </div>

                            <div class="bel-card" style="padding:4px; margin-bottom:12px;">
                                <div class="bel-card-title">Replies</div>
                                <div id="sup-replies" class="small-text" style="margin-top:6px; display:flex; flex-direction:column; gap:8px;"></div>
                            </div>

                            <div class="bel-card" id="sup-reply-section" style="padding:4px;">
                                <div class="bel-card-title">Reply</div>
                                <textarea id="sup-reply-input" placeholder="Type your reply..." style="width:100%; min-height:90px; border:1px solid var(--bel-border-color); border-radius:4px; padding:8px; margin-top:6px;"></textarea>
                                <div class="modal-actions" style="margin-top:10px; display:flex; flex-direction:row; justify-content:space-between; gap:8px;">
                                    <button class="bel-btn danger" id="sup-case-close-btn" style="width:100%;background-color: var(--ds-color-success); color: white;"><i class="fas fa-times-circle"></i> Case Close</button>
                                    <button class="bel-btn primary" id="sup-send-btn" style="width:100%;"><i class="fas fa-paper-plane"></i> Send</button>
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

            // Case close functionality
            this.supportModalEl.querySelector('#sup-case-close-btn')?.addEventListener('click', () => {
                const ticketId = this.supportModalEl.dataset.ticketId;
                const ticket = APP_DATA.contactSupport.tickets.find(t => t.ticketNumber === ticketId);
                if (!ticket) return;
                
                // Confirm case close
                if (confirm('Are you sure you want to close this case? This action cannot be undone.')) {
                    ticket.status = 'Closed';
                    // Add a system reply indicating case closure
                    ticket.replies = ticket.replies || [];
                    ticket.replies.push({ 
                        time: new Date().toISOString().slice(0, 16).replace('T', ' '), 
                        text: 'Case closed by admin.' 
                    });
                    
                    this.fillSupportModal(ticket);
                    this.renderContactSupportTickets();
                }
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
                
                if (ticket.status !== 'Closed') ticket.status = 'Replied';
                textarea.value = '';
                this.fillSupportModal(ticket);
                this.renderContactSupportTickets();
            });

            return this.supportModalEl;
        },

        fillSupportModal(ticket) {
            const modal = this.ensureSupportModal();
            modal.dataset.ticketId = ticket.ticketNumber;
            modal.querySelector('#sup-t-id').textContent = ticket.ticketNumber;
            modal.querySelector('#sup-t-status').innerHTML = `<span class="bel-badge ${ticket.status === 'Open' ? 'pending' : ticket.status === 'Resolved' ? 'completed' : ticket.status === 'Closed' ? 'completed' : 'processing'}">${ticket.status}</span>`;
            
            // Create BEL name with avatar
            const belNameContainer = modal.querySelector('#sup-bel-name');
            const avatarHTML = utils.generateAvatarHTML(ticket.belName, ticket.referralId, 30);
            belNameContainer.innerHTML = `<span>${ticket.belName}</span>`;
            
            modal.querySelector('#sup-referral-id').innerHTML = `<a href="#" class="referral-id-link" data-referral-id="${ticket.referralId}">${ticket.referralId}</a>`;
            modal.querySelector('#sup-subject').textContent = ticket.subject;
            modal.querySelector('#sup-message').textContent = ticket.message || 'No message provided.';

            const list = modal.querySelector('#sup-replies');
            list.innerHTML = (ticket.replies && ticket.replies.length)
                ? ticket.replies.map(r => `<div class="note-item"><p>${r.text}</p><span>${r.time}</span></div>`).join('')
                : '<p class="text-muted">No replies yet.</p>';
            
            // Show/hide reply section based on ticket status
            const replySection = modal.querySelector('#sup-reply-section');
            if (ticket.status === 'Closed') {
                replySection.style.display = 'none';
            } else {
                replySection.style.display = 'block';
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
                    link
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
                    this.ensureAnnouncementModal().classList.add('show');
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
                                <div class="picture-upload-area" style="border: 2px dashed var(--bel-border-color); border-radius: 8px; padding: 20px; text-align: center; background-color: #f8f9fa; cursor: pointer; transition: all 0.3s ease;" onclick="document.getElementById('asset-picture').click();">
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
                        
                        let valA = cellA.textContent.trim();
                        let valB = cellB.textContent.trim();
                        
                        if (dataType === 'number') {
                            // Extract numbers from text (handle currency, percentages, etc.)
                            valA = parseFloat(valA.replace(/[^0-9.-]/g, '')) || 0;
                            valB = parseFloat(valB.replace(/[^0-9.-]/g, '')) || 0;
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

    /* ========================================================================
       APPLICATION INITIALIZATION
       ======================================================================== */
    async function initializeApplication() {
        try {
            // For now, skip external data loading and use built-in APP_DATA
            console.log('Using built-in APP_DATA for initialization');
            
            // Initialize all modules
            Navigation.init();
            Dashboard.init();
            AccountManagement.init();
            BELModal.init();
            ContentManager.init();

            // Initialize sorting for all existing tables
            setTimeout(() => {
                TableUtils.initializeAllTables();
                initializeAllAvatars();
            }, 500);

            console.log('BEL Management Portal initialized successfully with built-in data');
        } catch (error) {
            console.error('Failed to initialize application:', error);
        }
    }

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

    // Start the application
    initializeApplication();
});
