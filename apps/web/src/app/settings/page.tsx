'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Sun,
  Square,
  ArrowLeft,
  Search,
  Pencil,
  Check,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useTheme, Accent } from '@/lib/theme-context';
import { Avatar, DexterAvatarSVG } from '@/components/ui/Avatar';

export default function SettingsPage() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  const { theme, setTheme, accent, setAccent } = useTheme();

  const [activeTab, setActiveTab] = useState<'profile' | 'theme' | 'color'>('profile');
  const [searchQuery, setSearchQuery] = useState('');

  // Editable Profile Form State
  const [name, setName] = useState(user?.name || 'Dexter');
  const [email, setEmail] = useState(user?.email || 'dexter@gmail.com');
  const [title, setTitle] = useState(user?.title || 'Designer');
  const [username, setUsername] = useState(user?.username || 'Dexuser');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [saveStatus, setSaveStatus] = useState(false);

  const handleSaveProfile = async () => {
    try {
      await updateProfile({ name, email, username, title });
      setSaveStatus(true);
      setTimeout(() => setSaveStatus(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const accents: { key: Accent; label: string; bg: string }[] = [
    { key: 'amber', label: 'Amber', bg: 'bg-[#d97706]' },
    { key: 'blue', label: 'Blue', bg: 'bg-[#6366f1]' },
    { key: 'pink', label: 'Pink', bg: 'bg-[#db2777]' },
    { key: 'rose', label: 'Rose', bg: 'bg-[#e11d48]' },
    { key: 'emerald', label: 'Emerald', bg: 'bg-[#059669]' },
    { key: 'black', label: 'Black', bg: 'bg-[#09090b]' },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0c0c0e] text-neutral-900 dark:text-neutral-100 font-sans flex">
      {/* Left Settings Sidebar (matching Figma page 13 / Blocks / Sidebar-02) */}
      <aside className="w-56 border-r border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 space-y-3.5 flex-shrink-0 min-h-screen">
        {/* Back to App Link */}
        <button
          onClick={() => router.push('/tasks')}
          className="flex items-center gap-2 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to app</span>
        </button>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 focus:outline-hidden"
          />
        </div>

        {/* Navigation Items */}
        <div className="space-y-0.5 pt-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
            }`}
          >
            <User className="w-3.5 h-3.5 text-neutral-500" />
            <span>Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('theme')}
            className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'theme'
                ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-neutral-500" />
            <span>Theme</span>
          </button>

          <button
            onClick={() => setActiveTab('color')}
            className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'color'
                ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
            }`}
          >
            <Square className="w-3.5 h-3.5 fill-current text-neutral-900 dark:text-white" />
            <span>Color</span>
          </button>
        </div>
      </aside>

      {/* Main Settings Content Area - Horizontally Centered with balanced whitespace (ISSUE 2 fix) */}
      <main className="flex-1 p-8 sm:p-12 overflow-y-auto flex flex-col items-center">
        <div className="w-full max-w-xl space-y-8">
          {/* Profile Tab (matching Figma page 13) */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">
                  Profile
                </h1>
                {saveStatus && (
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Saved
                  </span>
                )}
              </div>

              {/* Profile Card matching Figma Screenshot */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xs divide-y divide-neutral-100 dark:divide-neutral-800">
                {/* Row 1: Profile picture */}
                <div className="p-4 flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                    Profile picture
                  </span>
                  <DexterAvatarSVG className="w-8 h-8" />
                </div>

                {/* Row 2: Email */}
                <div className="p-4 flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                    Email
                  </span>
                  <div className="flex items-center gap-2">
                    {isEditingEmail ? (
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => {
                          setIsEditingEmail(false);
                          handleSaveProfile();
                        }}
                        autoFocus
                        className="px-2 py-1 text-xs rounded-md border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                      />
                    ) : (
                      <>
                        <span className="text-xs text-neutral-800 dark:text-neutral-200 font-medium">
                          {email}
                        </span>
                        <button
                          onClick={() => setIsEditingEmail(true)}
                          className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md text-neutral-500 cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Row 3: Full name */}
                <div className="p-4 flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                    Full name
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={handleSaveProfile}
                    placeholder="Dexter"
                    className="w-48 px-3 py-1.5 text-xs rounded-lg bg-neutral-100 dark:bg-neutral-800 border-none text-neutral-800 dark:text-neutral-200 focus:outline-hidden font-medium"
                  />
                </div>

                {/* Row 4: Title */}
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-neutral-900 dark:text-white">
                      Title
                    </div>
                    <div className="text-[11px] text-neutral-400">Your job title or role</div>
                  </div>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={handleSaveProfile}
                    placeholder="Designer"
                    className="w-48 px-3 py-1.5 text-xs rounded-lg bg-neutral-100 dark:bg-neutral-800 border-none text-neutral-800 dark:text-neutral-200 focus:outline-hidden font-medium"
                  />
                </div>

                {/* Row 5: Username */}
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-neutral-900 dark:text-white">
                      Username
                    </div>
                    <div className="text-[11px] text-neutral-400">
                      One word, like a nickname or first name
                    </div>
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onBlur={handleSaveProfile}
                    placeholder="Dexuser"
                    className="w-48 px-3 py-1.5 text-xs rounded-lg bg-neutral-100 dark:bg-neutral-800 border-none text-neutral-800 dark:text-neutral-200 focus:outline-hidden font-medium"
                  />
                </div>
              </div>

              {/* Workspace access Section */}
              <div className="space-y-2.5 pt-2">
                <h2 className="text-xs font-bold text-neutral-900 dark:text-white">
                  Workspace access
                </h2>

                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
                  <span className="text-xs text-neutral-400 font-normal">
                    Remove yourself from the workspace
                  </span>

                  <button
                    onClick={() => alert('Leaving workspace...')}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-50 dark:bg-red-950/40 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/60 transition-colors cursor-pointer"
                  >
                    Leave Workspace
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Theme Tab */}
          {activeTab === 'theme' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <h1 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">
                Theme
              </h1>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setTheme('light')}
                  className={`p-4 rounded-2xl border text-left space-y-3 transition-all cursor-pointer ${
                    theme === 'light'
                      ? 'border-neutral-900 dark:border-white ring-2 ring-neutral-900 dark:ring-white bg-white dark:bg-neutral-900'
                      : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300'
                  }`}
                >
                  <div className="w-full h-16 bg-neutral-50 border border-neutral-200 rounded-xl p-2 flex flex-col justify-between">
                    <div className="w-1/2 h-2 bg-neutral-300 rounded-full" />
                    <div className="w-full h-6 bg-white border border-neutral-200 rounded-lg" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900 dark:text-white">
                      Light Mode
                    </span>
                    {theme === 'light' && (
                      <Check className="w-4 h-4 text-neutral-900 dark:text-white" />
                    )}
                  </div>
                </button>

                <button
                  onClick={() => setTheme('dark')}
                  className={`p-4 rounded-2xl border text-left space-y-3 transition-all cursor-pointer ${
                    theme === 'dark'
                      ? 'border-neutral-900 dark:border-white ring-2 ring-neutral-900 dark:ring-white bg-neutral-900'
                      : 'border-neutral-200 dark:border-neutral-800 bg-neutral-900 hover:border-neutral-700'
                  }`}
                >
                  <div className="w-full h-16 bg-neutral-950 border border-neutral-800 rounded-xl p-2 flex flex-col justify-between">
                    <div className="w-1/2 h-2 bg-neutral-700 rounded-full" />
                    <div className="w-full h-6 bg-neutral-900 border border-neutral-800 rounded-lg" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900 dark:text-white">
                      Dark Mode
                    </span>
                    {theme === 'dark' && (
                      <Check className="w-4 h-4 text-neutral-900 dark:text-white" />
                    )}
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Color Tab */}
          {activeTab === 'color' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <h1 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">
                Color Mode
              </h1>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {accents.map((a) => (
                  <button
                    key={a.key}
                    onClick={() => setAccent(a.key)}
                    className={`p-3.5 rounded-2xl border flex flex-col items-center gap-2 transition-all bg-white dark:bg-neutral-900 cursor-pointer ${
                      accent === a.key
                        ? 'border-neutral-900 dark:border-white ring-2 ring-neutral-900 dark:ring-white shadow-xs'
                        : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-md ${a.bg} flex items-center justify-center text-white shadow-2xs`}
                    >
                      {accent === a.key && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </span>
                    <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                      {a.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
