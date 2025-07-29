// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom'; // Assuming you use React Router for navigation

// // --- SVG Icons ---
// const IconSparkles = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 2a1 1 0 00-1 1v1.114A2.003 2.003 0 002 6.114V14a1 1 0 001 1h12a1 1 0 001-1V6.114A2.003 2.003 0 0016 4.114V3a1 1 0 00-1-1H5zm10 4.114a.002.002 0 00-.002.002V14h-3.25a.75.75 0 010-1.5h.5a.75.75 0 000-1.5h-.5a.75.75 0 010-1.5h.5a.75.75 0 000-1.5h-.5a.75.75 0 010-1.5H15v-.884a.002.002 0 00-.002-.002zM5 6.114V14H4V6.114a2.002 2.002 0 011.998-.002z" clipRule="evenodd" /></svg>;
// const IconLoading = () => <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;

// const AnalyticsPage = () => {
//     const [insights, setInsights] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const token = localStorage.getItem('token');

//     // Function to fetch existing insights when the page loads
//     useEffect(() => {
//         const fetchExistingInsights = async () => {
//             try {
//                 const config = { headers: { Authorization: `Bearer ${token}` } };
//                 // We assume the user profile route also returns the insights field
//                 const { data: userData } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/profile`, config);
//                 if (userData.insights) {
//                     setInsights(userData.insights);
//                 }
//             } catch (err) {
//                 console.error("Could not fetch user profile for insights", err);
//             }
//         };
//         fetchExistingInsights();
//     }, [token]);


//     const handleAnalyzeChannel = async () => {
//         setLoading(true);
//         setError('');
//         setInsights(null);
//         try {
//             const config = { headers: { Authorization: `Bearer ${token}` } };
//             const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/analysis/generate-youtube-insights`, {}, config);
//             setInsights(data.insights);
//         } catch (err) {
//             setError(err.response?.data?.message || 'An unexpected error occurred during analysis.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen w-full bg-[#0D0D0D] text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
//             <header className="mb-8">
//                 <h1 className="text-3xl font-bold text-white">Personalized Channel Analytics</h1>
//                 <p className="text-gray-400 mt-1">Unlock your "unfair advantage" by analyzing what makes your content successful.</p>
//             </header>

//             <div className="bg-[#1A1A1A] rounded-2xl p-8 text-center shadow-2xl border border-gray-800">
//                 <div className="max-w-2xl mx-auto">
//                     <IconSparkles className="mx-auto h-12 w-12 text-indigo-400" />
//                     <h2 className="mt-4 text-2xl font-bold text-white">Generate Your Performance Insights</h2>
//                     <p className="mt-2 text-gray-400">
//                         Our AI will analyze your top-performing videos to identify winning patterns in your titles, thumbnails, and content. These insights will then automatically personalize the suggestions from all other AI tools in SocialHead-AI.
//                     </p>
//                     <button 
//                         onClick={handleAnalyzeChannel}
//                         disabled={loading}
//                         className="mt-8 flex items-center justify-center gap-3 w-full max-w-xs mx-auto bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                         {loading ? <><IconLoading /> Analyzing...</> : 'Analyze My Channel'}
//                     </button>
//                 </div>
//             </div>

//             {error && <div className="mt-6 bg-red-800/50 text-red-300 p-4 rounded-lg text-center">{error}</div>}

//             {insights && (
//                 <div className="mt-8 bg-[#1A1A1A] rounded-2xl p-8 border border-gray-800">
//                     <h3 className="text-xl font-bold text-white">Your Personalized Insights</h3>
//                     <p className="text-sm text-gray-500 mb-6">Last updated: {new Date(insights.lastUpdatedAt).toLocaleString()}</p>
                    
//                     {insights.titlePatterns.length > 0 ? (
//                         <div className="space-y-4">
//                             {insights.titlePatterns.map((pattern, index) => (
//                                 <div key={index} className="bg-[#252525] p-4 rounded-lg">
//                                     <p className="font-semibold text-indigo-300">
//                                         <span className="capitalize">{pattern.patternType.replace('_', ' ')} Titles</span> are performing well for you.
//                                     </p>
//                                     <p className="text-sm text-gray-400 mt-1">
//                                         Example from your channel: "{pattern.example}"
//                                     </p>
//                                 </div>
//                             ))}
//                         </div>
//                     ) : (
//                         <p className="text-gray-500">No strong title patterns were found in your top videos yet.</p>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default AnalyticsPage;


import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- SVG Icons ---
const IconSparkles = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 2a1 1 0 00-1 1v1.114A2.003 2.003 0 002 6.114V14a1 1 0 001 1h12a1 1 0 001-1V6.114A2.003 2.003 0 0016 4.114V3a1 1 0 00-1-1H5zm10 4.114a.002.002 0 00-.002.002V14h-3.25a.75.75 0 010-1.5h.5a.75.75 0 000-1.5h-.5a.75.75 0 010-1.5h.5a.75.75 0 000-1.5h-.5a.75.75 0 010-1.5H15v-.884a.002.002 0 00-.002-.002zM5 6.114V14H4V6.114a2.002 2.002 0 011.998-.002z" clipRule="evenodd" /></svg>;
const IconLoading = () => <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;

const AnalyticsPage = () => {
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');

    // Function to fetch existing insights when the page loads
    useEffect(() => {
        const fetchExistingInsights = async () => {
            if (!token) return;
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data: userData } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/profile`, config);
                if (userData.insights) {
                    setInsights(userData.insights);
                }
            } catch (err) {
                console.error("Could not fetch user profile for insights", err);
            }
        };
        fetchExistingInsights();
    }, [token]);


    const handleAnalyzeChannel = async () => {
        setLoading(true);
        setError('');
        setInsights(null);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/analysis/generate-youtube-insights`, {}, config);
            setInsights(data.insights);
        } catch (err) {
            setError(err.response?.data?.message || 'An unexpected error occurred during analysis.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#0D0D0D] text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white">Personalized Channel Analytics</h1>
                <p className="text-gray-400 mt-1">Unlock your "unfair advantage" by analyzing what makes your content successful.</p>
            </header>

            <div className="bg-[#1A1A1A] rounded-2xl p-8 text-center shadow-2xl border border-gray-800">
                <div className="max-w-2xl mx-auto">
                    <IconSparkles className="mx-auto h-12 w-12 text-indigo-400" />
                    <h2 className="mt-4 text-2xl font-bold text-white">Generate Your Performance Insights</h2>
                    <p className="mt-2 text-gray-400">
                        Our AI will analyze your top-performing videos to identify winning patterns in your titles, thumbnails, and content. These insights will then automatically personalize the suggestions from all other AI tools.
                    </p>
                    <button
                        onClick={handleAnalyzeChannel}
                        disabled={loading}
                        className="mt-8 flex items-center justify-center gap-3 w-full max-w-xs mx-auto bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <><IconLoading /> Analyzing...</> : 'Analyze My Channel'}
                    </button>
                </div>
            </div>

            {error && <div className="mt-6 bg-red-800/50 text-red-300 p-4 rounded-lg text-center">{error}</div>}

            {insights && (
                <div className="mt-8 bg-[#1A1A1A] rounded-2xl p-8 border border-gray-800">
                    <h3 className="text-xl font-bold text-white">Your Personalized Insights</h3>
                    <p className="text-sm text-gray-500 mb-6">Last updated: {new Date(insights.lastUpdatedAt).toLocaleString()}</p>
                    
                    {/* RENDER TITLE PATTERNS */}
                    {insights.titlePatterns.length > 0 && (
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-white">Title Patterns</h4>
                            {insights.titlePatterns.map((pattern, index) => (
                                <div key={`title-${index}`} className="bg-[#252525] p-4 rounded-lg">
                                    <p className="font-semibold text-indigo-300">
                                        <span className="capitalize">{pattern.patternType.replace(/_/g, ' ')} Titles</span> are performing well for you.
                                    </p>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Example from your channel: "{pattern.example}"
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {/* RENDER THUMBNAIL PATTERNS */}
                    {insights.thumbnailPatterns.length > 0 && (
                        <div className="space-y-4 mt-6">
                            <h4 className="text-lg font-semibold text-white">Thumbnail Patterns</h4>
                            {insights.thumbnailPatterns.map((pattern, index) => (
                                <div key={`thumb-${index}`} className="bg-[#252525] p-4 rounded-lg flex items-center gap-4">
                                    <img src={pattern.example} alt="Thumbnail Example" className="w-28 h-auto rounded-md object-cover" />
                                    <div>
                                        <p className="font-semibold text-teal-300">
                                            <span className="capitalize">{pattern.patternType.replace(/_/g, ' ')}</span> thumbnails are a strong pattern.
                                        </p>
                                        <p className="text-sm text-gray-400 mt-1">
                                            This pattern appears frequently in your top-performing videos.
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* RENDER IF NO PATTERNS ARE FOUND */}
                    {insights.titlePatterns.length === 0 && insights.thumbnailPatterns.length === 0 && (
                        <p className="text-gray-500 mt-4">No strong title or thumbnail patterns were found in your top videos yet. Try analyzing again after posting more content.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default AnalyticsPage;