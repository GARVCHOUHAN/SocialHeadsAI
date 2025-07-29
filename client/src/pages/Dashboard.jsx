



import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import ScriptAssistant from '../components/ScriptAssistant';


// --- Reusable UI Components ---
const KpiCard = ({ title, value, change, icon, loading }) => (
    <div className="bg-[#1A1A1A] p-5 rounded-2xl">
        <div className="flex items-center gap-2 text-gray-400 text-sm">{icon} {title}</div>
        {loading ? <div className="h-9 mt-2 bg-gray-700 rounded w-3/4 animate-pulse"></div> : <p className="text-3xl font-bold mt-2 text-white">{value}</p>}
        {change && !loading && <p className="text-sm text-green-400 mt-1">{change}</p>}
    </div>
);
const ContentBreakdown = ({ data }) => (
    <ul className="space-y-4 text-gray-300">
        <li className="flex justify-between items-center"><span><IconYouTube className="inline mr-3"/>{data.videos} Videos</span></li>
        <li className="flex justify-between items-center"><span><IconShorts className="inline mr-3"/>{data.shortForm} Short Form</span></li>
        <li className="flex justify-between items-center"><span><IconPosts className="inline mr-3"/>{data.posts} Posts</span></li>
        <li className="flex justify-between items-center"><span><IconTwitch className="inline mr-3"/>{data.streamHours} Stream Hours</span></li>
    </ul>
);
const RevenueChart = ({ data }) => (
    <div className="space-y-4">
        {data.map(item => (
            <div key={item.source} className="flex items-center gap-4">
                <div className="w-8 h-8 bg-gray-700 rounded-md flex items-center justify-center"><IconYouTube /></div>
                <div className="flex-1">
                    <div className="flex justify-between text-sm text-gray-300">
                        <span>{item.source}</span>
                        <span className="font-semibold text-white">{item.percent}%</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-1.5 mt-1">
                        <div className="bg-green-500 h-1.5 rounded-full" style={{width: `${item.percent}%`}}></div>
                    </div>
                </div>
            </div>
        ))}
    </div>
);
const ReachChart = ({ data, error }) => {
    if (error) return <div className="flex items-center justify-center h-full text-yellow-400 bg-yellow-500/10 p-4 rounded-lg">{error}</div>;
    if (!data || data.length < 2) return <div className="flex items-center justify-center h-full text-gray-500">Not enough data to display chart</div>;
    const maxViews = Math.max(...data.map(p => p.views), 1);
    const points = data.map((p, i) => `${(i / (data.length - 1)) * 100},${100 - (p.views / maxViews) * 100}`).join(' ');
    return (
        <div className="w-full h-64 relative">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{stopColor: 'rgba(74, 144, 226, 0.3)'}} />
                        <stop offset="100%" style={{stopColor: 'rgba(74, 144, 226, 0)'}} />
                    </linearGradient>
                </defs>
                <polyline fill="url(#gradient)" stroke="#4A90E2" strokeWidth="1.5" points={`0,100 ${points} 100,100`} />
            </svg>
        </div>
    );
};

// --- Main Dashboard Page Component ---
const DashboardPage = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            if (!token) { navigate('/login'); return; }
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data: userData } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/profile`, config);
                setUser(userData);
                if (userData.connections?.youtube?.accessToken) {
                    const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard/youtube-dashboard-data`, config);
                    setDashboardData(data);
                }
            } catch (err) {
                console.error("Critical error fetching dashboard data:", err);
                setError(err.response?.data?.message || 'Your session may have expired.');
                if (err.response?.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token, navigate]);
    
    const mockContentData = { videos: 3, shortForm: 1, posts: 2, streamHours: 12 };
    const mockRevenueData = [ {source: 'Sponsorship', percent: 60}, {source: "Adsense", percent: 25}, {source: 'Memberships', percent: 15} ];

    const handleConnectYouTube = () => {
        window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/oauth/connect/youtube?token=${token}`;
    };
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen bg-[#0D0D0D] text-gray-400 text-xl">Loading Dashboard...</div>;
    }

    // Main Render
    return (
        <div className="flex min-h-screen bg-[#0D0D0D] text-gray-200 font-sans">
            <aside className="w-20 lg:w-64 bg-[#1A1A1A] p-4 lg:p-6 flex flex-col items-center lg:items-start shrink-0">
                <h1 className="text-2xl font-bold text-white mb-12 hidden lg:block">SocialHead-AI</h1>
                <nav className="space-y-4">
                    <Link to="/dashboard" className="flex items-center w-full gap-4 text-white bg-gray-700/50 py-2 px-3 rounded-lg">
                        <IconHome /> <span className="hidden lg:inline">Home</span>
                    </Link>
                    <Link to="/earn" className="flex items-center w-full gap-4 hover:bg-gray-700/50 py-2 px-3 rounded-lg">
                        <IconEarnings /> <span className="hidden lg:inline">Earnings</span>
                    </Link>
                    <Link to="/logistics" className="flex items-center w-full gap-4 hover:bg-gray-700/50 py-2 px-3 rounded-lg">
                        <IconLogistics /> <span className="hidden lg:inline">Logistics</span>
                    </Link>
                    <Link to="/script-assistant" className="flex items-center w-full gap-4 hover:bg-gray-700/50 py-2 px-3 rounded-lg">
                        <IconLogistics /> <span className="hidden lg:inline">Script Assistant</span>
                    </Link>
                    <Link to="/planner" className="flex items-center w-full gap-4 hover:bg-gray-700/50 py-2 px-3 rounded-lg">
                        <IconLogistics /> <span className="hidden lg:inline">Planner</span>
                    </Link>
                    <Link to="/analytics" className="flex items-center w-full gap-4 hover:bg-gray-700/50 py-2 px-3 rounded-lg">
                        <IconLogistics /> <span className="hidden lg:inline">Analytics</span>
                    </Link>
                </nav>
                <div className="mt-auto space-y-4">
                     <Link to="/profile" className="flex items-center w-full gap-4 hover:bg-gray-700/50 py-2 px-3 rounded-lg">
                         <IconProfile /> <span className="hidden lg:inline">Profile</span>
                     </Link>
                     <Link to="/notifications" className="flex items-center w-full gap-4 hover:bg-gray-700/50 py-2 px-3 rounded-lg">
                         <IconNotifications /> <span className="hidden lg:inline">Notifications</span>
                     </Link>
                     <button onClick={handleLogout} className="flex items-center w-full gap-4 hover:bg-gray-700/50 py-2 px-3 rounded-lg">
                         <IconLogout /> <span className="hidden lg:inline">Log Out</span>
                     </button>
                </div>
            </aside>
            <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold">{user?.name || 'Creator'}</h2>
                    <div className="bg-[#1A1A1A] p-2 rounded-lg text-sm">Last 28 Days</div>
                </header>
                
                {!dashboardData ? (
                    <div className="text-center bg-[#1A1A1A] p-10 rounded-2xl">
                        <h3 className="text-xl font-semibold text-white">Connect Your YouTube Account</h3>
                        <p className="text-gray-400 mt-2 mb-6">Unlock powerful insights into your channel's performance.</p>
                        <button onClick={handleConnectYouTube} className="bg-red-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-red-700">Connect YouTube</button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <KpiCard title="Reach" value={dashboardData.advancedAnalytics?.kpi.reach.toLocaleString() ?? 'N/A'} change="+10%" icon={<IconReach />} loading={!dashboardData.advancedAnalytics} />
                            <KpiCard title="Followers" value={dashboardData.basicInfo.statistics.subscriberCount.toLocaleString()} change={`+${dashboardData.advancedAnalytics?.kpi.followersGained.toLocaleString() ?? '0'}`} icon={<IconFollowers />} />
                            <KpiCard title="Content" value={`${dashboardData.basicInfo.statistics.videoCount} Uploads`} change="+2%" icon={<IconContent />} />
                            <KpiCard title="Revenue" value={`$${dashboardData.advancedAnalytics?.kpi.revenue.toLocaleString('en-US', {minimumFractionDigits: 2}) ?? '0.00'}`} change="+5%" icon={<IconRevenue />} loading={!dashboardData.advancedAnalytics} />
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 bg-[#1A1A1A] p-6 rounded-2xl">
                                <h3 className="text-xl font-semibold mb-4">Reach</h3>
                                <ReachChart data={dashboardData.advancedAnalytics?.reachGraph} error={dashboardData.analyticsError} />
                            </div>
                            <div className="space-y-6">
                                <div className="bg-[#1A1A1A] p-6 rounded-2xl"><h3 className="text-xl font-semibold mb-4">Content</h3><ContentBreakdown data={mockContentData} /></div>
                                <div className="bg-[#1A1A1A] p-6 rounded-2xl"><h3 className="text-xl font-semibold mb-4">Revenue</h3><RevenueChart data={mockRevenueData} /></div>
                            </div>
                        </div>
                        {/* <section className="mt-12">
                            <div className="bg-[#1A1A1A] p-8 rounded-2xl shadow-lg">
                                <h3 className="text-2xl font-bold mb-4 text-white text-center">AI Script Generator</h3>
                                <p className="text-gray-400 mb-6 text-center">
                                    Instantly generate, refine, and optimize your video scripts and ideas for YouTube, Instagram, and TikTok.
                                </p>
                                <ScriptAssistant />
                            </div>
                        </section> */}
                    </>
                )}
            </main>
        </div>
    );
};

// --- SVG Icons (self-contained and unchanged) ---
const IconHome = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>;
const IconEarnings = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg>;
const IconLogistics = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m3 6V7m-9 4h6M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>;
const IconProfile = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>;
const IconNotifications = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>;
const IconLogout = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>;
const IconReach = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>;
const IconFollowers = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M4 7a4 4 0 118 0 4 4 0 01-8 0z"></path></svg>;
const IconContent = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1.586-1.586a2 2 0 00-2.828 0L6 14m6-6l.01.01"></path></svg>;
const IconRevenue = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8C9.79 8 8 9.79 8 12s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 0c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 0v.01"></path></svg>;
const IconYouTube = () => <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.254,4,12,4,12,4S5.746,4,4.186,4.418 c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.746,2,12,2,12s0,4.254,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768 C5.746,20,12,20,12,20s6.254,0,7.814-0.418c0.861-0.23,1.538-0.908,1.768-1.768C22,16.254,22,12,22,12S22,7.746,21.582,6.186z M10,15.464V8.536L16,12L10,15.464z"></path></svg>;
const IconShorts = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.77,10.32l-1.2-.5L18,8.07l-1.6.22-1.2-1.44-1.2,1.44L12.4,8.29,14,9.82l-1.2.5L14,11.77l-1.6-.22,1.2,1.45L12.4,14l1.6-1.44L15.2,14l-1.2-1.45,1.6-.22Zm-4.09-2.2,1.2,.5-1.44,1.75,1.2,.5-1.44,1.75-1.2-.5,1.44-1.75-1.2-.5ZM8.63,14,7.43,12.55,6.23,14,5,12.55l1.2-1.45L5,9.82,6.23,8,7.43,9.45,8.63,8,9.83,9.45,8.63,11.1v.05l1.2,1.2ZM12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Z"></path></svg>;
const IconPosts = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19,3H5A2,2,0,0,0,3,5V19a2,2,0,0,0,2,2H19a2,2,0,0,0,2-2V5A2,2,0,0,0,19,3M11,17H7.5V14H11V17M11,12H7.5V9H11V12M16.5,17H13V14h3.5V17M16.5,12H13V9h3.5V12Z"></path></svg>;
const IconTwitch = () => <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 24 24"><path d="M2.149,0,L.213,3.779V20.6H5.827V24l3.779-3.4H14.1l8.021-8.021V0H2.149Zm18.9,11.319-4.723,4.723H12.2l-3.4,3.4V16.043H4.085V2.149H21.047Z M16.043,5.827V10.55h2.149V5.827Zm-5.827,0V10.55h2.149V5.827Z"></path></svg>;

export default DashboardPage;
