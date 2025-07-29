
// export default Planner;
import React, { useState, useEffect } from "react";
import axios from "axios";

// --- SVG Icon Components for a professional look ---
const IconPlus = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>;
const IconIdea = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.333a2 2 0 002 2V10a2 2 0 00-2 2v1.333a1 1 0 11-2 0V12a2 2 0 00-2-2V6.333a2 2 0 002-2V3a1 1 0 011-1zm-5 4.333a2 2 0 012-2h.333a1 1 0 110 2H7a2 2 0 01-2-2zm10.333-2a1 1 0 10-2 0v.333a2 2 0 01-2 2h-1.333a1 1 0 100 2h1.333a2 2 0 012-2V6.333z" clipRule="evenodd" /></svg>;
const IconScript = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>;
const IconCamera = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2H4zm12 12H4l4-8h4l4 8z" clipRule="evenodd" /></svg>;
const IconEdit = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>;
const IconCheck = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;


// --- Main Planner Component ---
const Planner = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    idea: "",
    scriptDone: false,
    filmed: false,
    edited: false,
    posted: false,
    views: 0,
    notes: "",
    scheduledDate: "",
    videoFile: null
  });

  const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/planner`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setNewTask((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value
    }));
  };

  const addTask = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    // Append all key-value pairs from the newTask state to formData
    Object.entries(newTask).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
        const token = localStorage.getItem('token');
        await axios.post(`${API_URL}/api/planner/add`, formData, {
            headers: { 
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}` 
            }
        });
        // Reset form and close modal on success
        setNewTask({ title: "", idea: "", scriptDone: false, filmed: false, edited: false, posted: false, views: 0, notes: "", scheduledDate: "", videoFile: null });
        setIsModalOpen(false);
        fetchTasks();
    } catch (error) {
        console.error("Failed to add task:", error);
    }
  };

  // This function determines the overall status for the card's tag
  const getStatus = (task) => {
    if (task.uploaded) return { label: 'Uploaded', color: 'bg-green-500/20 text-green-300' };
    if (task.scheduledDate) return { label: 'Scheduled', color: 'bg-blue-500/20 text-blue-300' };
    return { label: 'Draft', color: 'bg-gray-500/20 text-gray-300' };
  };

  return (
    <div className="min-h-screen w-full bg-[#0D0D0D] text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Content Planner</h1>
          <p className="text-gray-400 mt-1">Plan, schedule, and track your content pipeline.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-transform transform hover:scale-105">
          <IconPlus /> Schedule Video
        </button>
      </header>

      {/* Task Table */}
      <div className="bg-[#1A1A1A] rounded-xl p-2">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-gray-700">
              <tr>
                <th className="p-4 text-sm font-semibold text-gray-400">Title & Idea</th>
                <th className="p-4 text-sm font-semibold text-gray-400">Progress</th>
                <th className="p-4 text-sm font-semibold text-gray-400">Scheduled For</th>
                <th className="p-4 text-sm font-semibold text-gray-400">Status</th>
                <th className="p-4 text-sm font-semibold text-gray-400">Views</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task._id} className="border-b border-gray-800 hover:bg-[#252525]">
                  <td className="p-4">
                    <p className="font-bold text-white">{task.title}</p>
                    <p className="text-sm text-gray-400">{task.idea}</p>
                  </td>
                  <td className="p-4"><ProgressChecklist task={task} /></td>
                  <td className="p-4 text-gray-300">{task.scheduledDate ? new Date(task.scheduledDate).toLocaleString() : "Not set"}</td>
                  <td className="p-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatus(task).color}`}>
                      {getStatus(task).label}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-white">{task.views.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#1E1E1E] p-8 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">Schedule a New Video</h2>
            <form onSubmit={addTask} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="title" placeholder="Video Title" value={newTask.title} onChange={handleChange} className="w-full p-3 bg-[#222222] border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                <input name="idea" placeholder="Core Idea" value={newTask.idea} onChange={handleChange} className="w-full p-3 bg-[#222222] border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <textarea name="notes" placeholder="Notes, description, hashtags..." value={newTask.notes} onChange={handleChange} className="w-full p-3 bg-[#222222] border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" rows="4" />
              
              {/* Progress Checkboxes */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                <label className="flex items-center gap-2 text-gray-300"><input type="checkbox" name="scriptDone" checked={newTask.scriptDone} onChange={handleChange} className="h-4 w-4 bg-gray-700 border-gray-600 rounded text-indigo-500 focus:ring-indigo-500" /> Script Done</label>
                <label className="flex items-center gap-2 text-gray-300"><input type="checkbox" name="filmed" checked={newTask.filmed} onChange={handleChange} className="h-4 w-4 bg-gray-700 border-gray-600 rounded text-indigo-500 focus:ring-indigo-500" /> Filmed</label>
                <label className="flex items-center gap-2 text-gray-300"><input type="checkbox" name="edited" checked={newTask.edited} onChange={handleChange} className="h-4 w-4 bg-gray-700 border-gray-600 rounded text-indigo-500 focus:ring-indigo-500" /> Edited</label>
                <label className="flex items-center gap-2 text-gray-300"><input type="checkbox" name="posted" checked={newTask.posted} onChange={handleChange} className="h-4 w-4 bg-gray-700 border-gray-600 rounded text-indigo-500 focus:ring-indigo-500" /> Posted</label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="scheduledDate" type="datetime-local" value={newTask.scheduledDate} onChange={handleChange} className="w-full p-3 bg-[#222222] border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <input name="views" type="number" placeholder="Initial Views (optional)" value={newTask.views} onChange={handleChange} className="w-full p-3 bg-[#222222] border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Video File</label>
                <input name="videoFile" type="file" accept="video/*" onChange={handleChange} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700" />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-600 text-white py-2 px-5 rounded-lg hover:bg-gray-700">Cancel</button>
                <button type="submit" className="bg-indigo-600 text-white py-2 px-5 rounded-lg hover:bg-indigo-700">Schedule Upload</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Progress Checklist Component for the table ---
const ProgressChecklist = ({ task }) => (
    <div className="flex items-center gap-3">
        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${task.scriptDone ? 'bg-green-500' : 'bg-gray-600'}`} title="Script Done">
            <IconScript className="w-3 h-3 text-white" />
        </div>
        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${task.filmed ? 'bg-green-500' : 'bg-gray-600'}`} title="Filmed">
             <IconCamera className="w-3 h-3 text-white" />
        </div>
        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${task.edited ? 'bg-green-500' : 'bg-gray-600'}`} title="Edited">
             <IconEdit className="w-3 h-3 text-white" />
        </div>
        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${task.posted ? 'bg-green-500' : 'bg-gray-600'}`} title="Posted">
             <IconCheck className="w-3 h-3 text-white" />
        </div>
    </div>
);

export default Planner;
