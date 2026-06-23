import useLocalStorage from "../hooks/useLocalStorage";

const Settings = () => {
  const [profile, setProfile] = useLocalStorage("dish_dashboard_profile", { name: "", email: "" });
  const [notifications, setNotifications] = useLocalStorage("dish_dashboard_notifications", true);
  const [darkMode, setDarkMode] = useLocalStorage("dish_dashboard_darkmode", false);

  const handleProfileChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-500">Manage your dashboard preferences</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-brand-600 bg-brand-50 px-3 py-1.5 rounded-full">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          Auto-saving
        </div>
      </div>

      <div className="space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              Profile Settings
            </h2>
            
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="shrink-0 flex flex-col items-center gap-3">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-brand-100 to-brand-50 border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
                  <span className="text-3xl font-bold text-brand-600 uppercase">
                    {profile.name ? profile.name.charAt(0) : "?"}
                  </span>
                </div>
                <button className="text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors">
                  Upload Photo
                </button>
              </div>

              <div className="flex-1 space-y-5 w-full">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Display Name</label>
                  <input 
                    type="text" 
                    value={profile.name}
                    onChange={(e) => handleProfileChange('name', e.target.value)}
                    placeholder="Enter your full name" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    value={profile.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    placeholder="you@example.com" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              App Preferences
            </h2>
            
            <div className="space-y-6">
              <div 
                className="flex items-center justify-between cursor-pointer group p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100" 
                onClick={() => setNotifications(!notifications)}
              >
                <div>
                  <p className="font-bold text-gray-900 group-hover:text-brand-600 transition-colors">Push Notifications</p>
                  <p className="text-sm text-gray-500 mt-1">Receive alerts when new dishes are added or modified.</p>
                </div>
                <div className={`w-14 h-7 rounded-full transition-colors relative shrink-0 ${notifications ? "bg-brand-500" : "bg-gray-200"}`}>
                  <div className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full transition-transform shadow-sm ${notifications ? "translate-x-7" : ""}`} />
                </div>
              </div>

              <div 
                className="flex items-center justify-between cursor-pointer group p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100" 
                onClick={() => setDarkMode(!darkMode)}
              >
                <div>
                  <p className="font-bold text-gray-900 group-hover:text-brand-600 transition-colors">Dark Mode</p>
                  <p className="text-sm text-gray-500 mt-1">Toggle dark appearance for the dashboard interface.</p>
                </div>
                <div className={`w-14 h-7 rounded-full transition-colors relative shrink-0 ${darkMode ? "bg-gray-800" : "bg-gray-200"}`}>
                  <div className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full transition-transform shadow-sm ${darkMode ? "translate-x-7" : ""}`} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
