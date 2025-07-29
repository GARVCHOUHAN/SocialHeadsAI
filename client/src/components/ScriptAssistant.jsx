
import React, { useState } from 'react';

const API_URL = 'http://localhost:5000/api/gemini';

// --- SVG Icon Components (Defined at the top) ---
const IconSparkles = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm1 2h8v2H6V5zm0 4h8v2H6V9zm0 4h5v2H6v-2z" /></svg>;
const IconPencil = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>;
const IconFilm = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm1 2h2v2H5V5zm2 4H5v2h2V9zm2-4h2v2H9V5zm2 4H9v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" /></svg>;
const IconTag = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5a.997.997 0 01.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>;
const IconFire = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM10 18a1 1 0 01.707.293l2 2a1 1 0 11-1.414 1.414l-2-2A1 1 0 0110 18zm-6.707-6.707a1 1 0 011.414 0l2 2a1 1 0 11-1.414 1.414l-2-2a1 1 0 010-1.414zM16 10a1 1 0 01-.293.707l-2 2a1 1 0 11-1.414-1.414l2-2A1 1 0 0116 10z" clipRule="evenodd" /></svg>;
const IconTrophy = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 7a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1zm16.594 2.594a.5.5 0 00-.594-.419H2a.5.5 0 00-.419.594l1.36 4.079A2 2 0 004.872 15h10.256a2 2 0 001.928-1.747l1.36-4.079zM12 10a1 1 0 100 2 1 1 0 000-2z" /></svg>;
const IconTarget = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm0-4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>;
const IconChart = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" /><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" /></svg>;
const IconRefresh = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" /></svg>;
const IconLoading = () => <svg className="animate-spin h-10 w-10 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;

const MODES = [
  { key: 'expandIdea', label: 'Expand Idea', icon: <IconSparkles /> },
  { key: 'refineScript', label: 'Refine Script', icon: <IconPencil /> },
  { key: 'generateStoryboard', label: 'Storyboard', icon: <IconFilm /> },
  { key: 'suggestHashtags', label: 'Hashtags', icon: <IconTag /> },
  { key: 'viralNicheIdeas', label: 'Viral Niches', icon: <IconFire /> },
  { key: 'optimizeTitle', label: 'Title', icon: <IconTrophy /> },
  { key: 'analyzeHook', label: 'Hook', icon: <IconTarget /> },
  { key: 'analyzePerformance', label: 'Performance', icon: <IconChart /> },
];

const ScriptAssistant = () => {
  const [idea, setIdea] = useState('');
  const [platform, setPlatform] = useState('YouTube (Shorts & Long-form)');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copyButtonText, setCopyButtonText] = useState('Copy');
  const [lastRequest, setLastRequest] = useState(null);

  const callGeminiAPI = async (mode, isRegenerate = false) => {
    const currentIdea = isRegenerate ? lastRequest.idea : idea;
    const currentPlatform = isRegenerate ? lastRequest.platform : platform;

    if (!currentIdea && mode !== 'viralNicheIdeas') {
      setOutput('<p class="text-yellow-400">Please enter an idea, script, or niche first to get started.</p>');
      return;
    }

    setLoading(true);
    setCopyButtonText('Copy');
    setOutput('');

    if (!isRegenerate) {
      setLastRequest({ idea: currentIdea, platform: currentPlatform, mode });
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea: currentIdea,
          platform: currentPlatform,
          mode,
          isRegenerate
        })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const formattedHtml = (data.result || 'No response from Gemini.')
          .replace(/### (.*)/g, '<h3 class="text-xl font-semibold text-white mb-2 mt-4">$1</h3>')
          .replace(/## (.*)/g, '<h2 class="text-2xl font-bold text-white mb-3 mt-5">$1</h2>')
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\* (.*)/g, '<li>$1</li>')
          .replace(/(\n<li>.*<\/li>)/gs, '<ul>$1</ul>')
          .replace(/\n/g, '<br />');

      setOutput(formattedHtml);
    } catch (err) {
      console.error(err);
      let errorMessage = `
        <div class="text-red-400 text-left">
          <h3 class="font-bold text-lg">Connection Error: Failed to Fetch</h3>
          <p class="mt-2">The app could not connect to the backend server at <strong>${API_URL}</strong>.</p>
          <p class="mt-2 font-semibold">Please check the following:</p>
          <ul class="list-disc list-inside mt-2 space-y-1">
            <li><strong>Is your backend server running?</strong></li>
            <li><strong>Is the server on the correct address (port 5000)?</strong></li>
            <li><strong>Are there any CORS errors in the browser console?</strong></li>
          </ul>
        </div>
      `;
      setOutput(errorMessage);
    }
    setLoading(false);
  };

  const handleCopy = () => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = output.replace(/<br\s*\/?>/gi, '\n');
    const plainText = tempDiv.textContent || tempDiv.innerText || "";

    navigator.clipboard.writeText(plainText).then(() => {
      setCopyButtonText('Copied!');
      setTimeout(() => setCopyButtonText('Copy'), 2000);
    });
  };

  const isSuccessfulResult = output && !loading && !output.includes('Connection Error');

  return (
    <>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #121212; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #4A5568; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #718096; }
      `}</style>
      <section className="h-screen w-full bg-[#121212] flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-7xl mx-auto h-[90vh] flex flex-col lg:flex-row gap-0 shadow-2xl rounded-2xl bg-[#1A1A1A] overflow-hidden border border-gray-800">
          
          <div className="flex-1 flex flex-col justify-start px-8 py-10 lg:px-10 lg:py-12 bg-[#1A1A1A]">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white tracking-tight">AI Script Assistant</h2>
              <p className="text-gray-400 mt-2">Your co-pilot for creating viral content.</p>
            </div>
            
            <label className="block text-gray-400 font-semibold mb-2 text-sm">Your Idea, Script, or Niche</label>
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="e.g., A 30-second reel script on productivity hacks..."
              className="w-full p-3 mb-6 bg-[#222222] border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
              rows={6}
            />

            <label className="block text-gray-400 font-semibold mb-2 text-sm">Target Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full mb-8 p-3 bg-[#222222] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              <option>YouTube (Shorts & Long-form)</option>
              <option>Instagram (Reels & Posts)</option>
              <option>TikTok</option>
            </select>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {MODES.map(({ key, label, icon }) => (
                <button
                  key={key}
                  className="flex flex-col items-center justify-center text-center gap-2 bg-[#252525] border border-gray-700 text-gray-300 font-semibold py-3 px-2 rounded-lg shadow-sm hover:bg-gray-700 hover:text-white hover:border-gray-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => callGeminiAPI(key, false)}
                  disabled={loading}
                >
                  <span className="text-indigo-400">{icon}</span>
                  <span className="text-xs">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col px-8 py-10 lg:px-10 lg:py-12 bg-[#1E1E1E] border-l border-gray-800">
            <div className="flex justify-between items-center mb-4 min-h-[40px]">
              <h3 className="text-2xl font-bold text-white">AI Suggestions</h3>
              {isSuccessfulResult && (
                <div className="flex gap-2">
                  <button
                    onClick={() => callGeminiAPI(lastRequest.mode, true)}
                    className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg shadow transition-all duration-200 flex items-center gap-2"
                    title="Get a different version"
                  >
                    <IconRefresh /> Regenerate
                  </button>
                  <button
                    onClick={handleCopy}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow transition-all duration-200"
                  >
                    {copyButtonText}
                  </button>
                </div>
              )}
            </div>
            <div className="flex-1 overflow-y-auto bg-[#121212] p-6 rounded-lg border border-gray-700 min-h-0 custom-scrollbar">
              {/* --- VISIBILITY FIX --- */}
              <div className="prose prose-invert max-w-none text-gray-300 prose-p:text-gray-300 prose-headings:text-white prose-strong:text-white prose-li:text-gray-300">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <IconLoading />
                    <p className="mt-4 text-lg">Gemini is thinking...</p>
                  </div>
                ) : output ? (
                  <div dangerouslySetInnerHTML={{ __html: output }} />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <p>Your AI-generated content will appear here.</p>
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ScriptAssistant;
