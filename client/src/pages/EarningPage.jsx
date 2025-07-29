import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// --- MOCK DATA ---
const earningsData = {
    summary: {
        totalRevenue: 7850,
        sponsorships: 4710,
        adsense: 1962.50,
        memberships: 1177.50,
    },
    chartData: [
        { name: 'Jan', Sponsorships: 4000, Adsense: 2400, Memberships: 1200 },
        { name: 'Feb', Sponsorships: 3000, Adsense: 1398, Memberships: 980 },
        { name: 'Mar', Sponsorships: 5200, Adsense: 2800, Memberships: 1500 },
        { name: 'Apr', Sponsorships: 2780, Adsense: 3908, Memberships: 1000 },
        { name: 'May', Sponsorships: 1890, Adsense: 4800, Memberships: 1700 },
        { name: 'Jun', Sponsorships: 2390, Adsense: 3800, Memberships: 1100 },
    ],
    transactions: [
        { id: 'txn_1', date: '2025-07-25', description: 'Adsense Payout', amount: 980.50, type: 'Adsense' },
        { id: 'txn_2', date: '2025-07-22', description: 'BrandCorp Sponsorship - Part 1', amount: 2500, type: 'Sponsorship' },
        { id: 'txn_3', date: '2025-07-20', description: 'Monthly Memberships Payout', amount: 650.00, type: 'Memberships' },
        { id: 'txn_4', date: '2025-07-15', description: 'TechGadgets Video Ad Revenue', amount: 450.75, type: 'Adsense' },
        { id: 'txn_5', date: '2025-07-10', description: 'Merch Sale: T-Shirt', amount: 25.00, type: 'Merch' },
    ]
};

const logisticsData = [
    { id: 'ORD-001', customer: 'Jane Doe', date: '2025-07-24', item: 'Limited Edition Hoodie', status: 'Shipped', tracking: '1Z999AA10123456789' },
    { id: 'ORD-002', customer: 'John Smith', date: '2025-07-23', item: 'SocialHead-AI Mug', status: 'Processing', tracking: null },
    { id: 'ORD-003', customer: 'Emily White', date: '2025-07-22', item: 'Signed Poster', status: 'Delivered', tracking: '1Z999AA10198765432' },
    { id: 'ORD-004', customer: 'Michael Brown', date: '2025-07-21', item: 'Limited Edition Hoodie', status: 'Shipped', tracking: '1Z999AA10123451234' },
];

const profileData = {
    name: 'Shourya',
    email: 'shourya@SocialHead-AI.com',
    profilePicture: 'https://placehold.co/128x128/1a1a1a/ffffff?text=S',
    bio: 'Digital creator focused on tech and gaming. Building a community one video at a time.',
    socials: {
        youtube: 'youtube.com/shouryagaming',
        twitter: '@shouryacreates',
        instagram: 'shouryapics',
    },
    notifications: {
        newFollowers: true,
        comments: true,
        logisticsUpdates: true,
        earningsReports: false,
    }
};

const notificationsData = [
    { id: 1, type: 'comment', text: 'Alex commented: "Great video! Super helpful."', time: '2 hours ago', unread: true },
    { id: 2, type: 'follower', text: 'JaneDoe started following you.', time: '5 hours ago', unread: true },
    { id: 3, type: 'logistics', text: 'Order ORD-001 has been shipped.', time: '1 day ago', unread: false },
    { id: 4, type: 'earnings', text: 'Your weekly earnings report is ready.', time: '2 days ago', unread: false },
    { id: 5, type: 'mention', text: 'CreatorWeekly mentioned you in their new post.', time: '3 days ago', unread: false },
    { id: 6, type: 'comment', text: 'Chris replied to your comment.', time: '4 days ago', unread: false },
];


// --- SVG ICONS ---
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const EarningsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 6v-1m0 1V4m0 2v1m0 0v1m-6 6h12M7 16h10" /></svg>;
const LogisticsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-2h8a1 1 0 001-1zM21 11V5a2 2 0 00-2-2H7a2 2 0 00-2 2v2" /></svg>;
const ProfileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const NotificationsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;


// --- COMPONENTS ---

const Card = ({ children, className = '' }) => (
    <div className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/50 ${className}`}>
        {children}
    </div>
);

export const EarningsPage = () => {
    const { summary, chartData, transactions } = earningsData;
    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold text-white">Earnings</h1>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <h3 className="text-gray-400 text-sm font-medium">Total Revenue (Last 30d)</h3>
                    <p className="text-3xl font-bold text-white mt-2">${summary.totalRevenue.toLocaleString()}</p>
                </Card>
                <Card>
                    <h3 className="text-gray-400 text-sm font-medium">Sponsorships</h3>
                    <p className="text-3xl font-bold text-green-400 mt-2">${summary.sponsorships.toLocaleString()}</p>
                </Card>
                <Card>
                    <h3 className="text-gray-400 text-sm font-medium">Adsense</h3>
                    <p className="text-3xl font-bold text-blue-400 mt-2">${summary.adsense.toLocaleString()}</p>
                </Card>
                <Card>
                    <h3 className="text-gray-400 text-sm font-medium">Memberships</h3>
                    <p className="text-3xl font-bold text-purple-400 mt-2">${summary.memberships.toLocaleString()}</p>
                </Card>
            </div>

            {/* Revenue Breakdown Chart */}
            <Card>
                <h2 className="text-xl font-semibold text-white mb-4">Revenue Breakdown</h2>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                            <XAxis dataKey="name" stroke="#A0AEC0" />
                            <YAxis stroke="#A0AEC0" />
                            <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }} />
                            <Legend />
                            <Bar dataKey="Sponsorships" fill="#48BB78" />
                            <Bar dataKey="Adsense" fill="#4299E1" />
                            <Bar dataKey="Memberships" fill="#9F7AEA" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {/* Recent Transactions */}
            <Card>
                <h2 className="text-xl font-semibold text-white mb-4">Recent Transactions</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-gray-700">
                            <tr>
                                <th className="p-3 text-sm font-semibold text-gray-400">Date</th>
                                <th className="p-3 text-sm font-semibold text-gray-400">Description</th>
                                <th className="p-3 text-sm font-semibold text-gray-400">Type</th>
                                <th className="p-3 text-sm font-semibold text-gray-400 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(t => (
                                <tr key={t.id} className="border-b border-gray-800 hover:bg-gray-700/50">
                                    <td className="p-3 text-gray-300">{t.date}</td>
                                    <td className="p-3 text-white">{t.description}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            t.type === 'Sponsorship' ? 'bg-green-500/20 text-green-300' :
                                            t.type === 'Adsense' ? 'bg-blue-500/20 text-blue-300' :
                                            t.type === 'Memberships' ? 'bg-purple-500/20 text-purple-300' : 'bg-gray-500/20 text-gray-300'
                                        }`}>{t.type}</span>
                                    </td>
                                    <td className="p-3 text-white font-mono text-right">${t.amount.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};