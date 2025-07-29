export const ProfilePage = () => {
    const [profile, setProfile] = useState(profileData);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({...prev, [name]: value}));
    };
    
    const handleSocialChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({...prev, socials: {...prev.socials, [name]: value}}));
    };

    const handleNotificationToggle = (e) => {
        const { name, checked } = e.target;
        setProfile(prev => ({...prev, notifications: {...prev.notifications, [name]: checked}}));
    };

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold text-white">Profile</h1>
            <p className="text-gray-400">Manage your public information and account settings.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Form */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <h2 className="text-xl font-semibold text-white mb-4">Public Profile</h2>
                        <div className="flex items-center space-x-6 mb-6">
                            <img src={profile.profilePicture} alt="Profile" className="w-24 h-24 rounded-full border-2 border-gray-600"/>
                            <div>
                                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-sm">Upload New Picture</button>
                                <p className="text-gray-400 text-xs mt-2">PNG, JPG, GIF up to 5MB.</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300">Username</label>
                                <input type="text" name="name" value={profile.name} onChange={handleInputChange} className="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300">Bio</label>
                                <textarea name="bio" value={profile.bio} onChange={handleInputChange} rows="3" className="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
                            </div>
                        </div>
                    </Card>
                    <Card>
                         <h2 className="text-xl font-semibold text-white mb-4">Social Links</h2>
                         <div className="space-y-4">
                             <div>
                                <label className="block text-sm font-medium text-gray-300">YouTube</label>
                                <input type="text" name="youtube" value={profile.socials.youtube} onChange={handleSocialChange} className="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-300">Twitter</label>
                                <input type="text" name="twitter" value={profile.socials.twitter} onChange={handleSocialChange} className="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-300">Instagram</label>
                                <input type="text" name="instagram" value={profile.socials.instagram} onChange={handleSocialChange} className="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                            </div>
                         </div>
                    </Card>
                    <div className="flex justify-end">
                        <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg">Save Changes</button>
                    </div>
                </div>

                {/* Settings */}
                <div className="space-y-6">
                    <Card>
                        <h2 className="text-xl font-semibold text-white mb-4">Account Settings</h2>
                        <div className="space-y-4">
                             <div>
                                <label className="block text-sm font-medium text-gray-300">Email Address</label>
                                <input type="email" name="email" value={profile.email} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-400 cursor-not-allowed" readOnly/>
                            </div>
                            <button className="w-full text-center bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg">Change Password</button>
                        </div>
                    </Card>
                     <Card>
                        <h2 className="text-xl font-semibold text-white mb-4">Notification Settings</h2>
                        <div className="space-y-3">
                            {Object.entries(profile.notifications).map(([key, value]) => (
                                <label key={key} className="flex items-center justify-between cursor-pointer">
                                    <span className="text-gray-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                    <div className="relative">
                                        <input type="checkbox" name={key} checked={value} onChange={handleNotificationToggle} className="sr-only peer"/>
                                        <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
