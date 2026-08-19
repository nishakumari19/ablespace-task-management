'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutGrid,
  FolderKanban,
  ChevronsUpDown,
  ChevronDown,
  ChevronRight,
  Settings as SettingsIcon,
  Sun,
  Moon,
  Check,
  LogOut
} from 'lucide-react';
import { Avatar, DexterAvatarSVG } from '../ui/Avatar';
import { useAuth } from '@/lib/auth-context';
import { useTheme, Theme, Accent } from '@/lib/theme-context';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, setTheme, accent, setAccent } = useTheme();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeSubflyout, setActiveSubflyout] = useState<'theme' | 'color' | null>(null);
  const [isWorkspaceExpanded, setIsWorkspaceExpanded] = useState(true);

  const menuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
        setActiveSubflyout(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { name: 'Tasks', href: '/tasks', icon: LayoutGrid },
    { name: 'Projects', href: '/projects', icon: FolderKanban },
  ];

  const colorModes: { key: Accent; name: string; hex: string; bgClass: string }[] = [
    { key: 'amber', name: 'Amber', hex: '#d97706', bgClass: 'bg-[#d97706]' },
    { key: 'blue', name: 'Blue', hex: '#6366f1', bgClass: 'bg-[#6366f1]' },
    { key: 'pink', name: 'Pink', hex: '#db2777', bgClass: 'bg-[#db2777]' },
    { key: 'rose', name: 'Rose', hex: '#e11d48', bgClass: 'bg-[#e11d48]' },
    { key: 'emerald', name: 'Emerald', hex: '#059669', bgClass: 'bg-[#059669]' },
    { key: 'black', name: 'Black', hex: '#09090b', bgClass: 'bg-[#09090b]' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onToggle}
          className="fixed inset-0 bg-black/40 z-30 md:hidden backdrop-blur-xs"
        />
      )}

      <aside
        className={`fixed md:static top-0 left-0 bottom-0 z-40 w-56 bg-[#fafafa] dark:bg-[#0c0c0e] border-r border-neutral-200/80 dark:border-neutral-800 flex flex-col transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-56'
        }`}
      >
        {/* User Account Bar */}
        <div className="p-3 relative" ref={menuRef}>
          <button
            onClick={() => {
              setIsUserMenuOpen(!isUserMenuOpen);
              setActiveSubflyout(null);
            }}
            className="w-full flex items-center justify-between p-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors text-left"
          >
            <div className="flex items-center gap-2 min-w-0">
              <DexterAvatarSVG className="w-7 h-7" />
              <span className="text-[13px] font-semibold text-neutral-900 dark:text-white truncate">
                {user?.name || 'Dexter'}
              </span>
            </div>
            <ChevronsUpDown className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
          </button>

          {/* Floating Profile Popover (matching Figma page 9.png & page 10.png) */}
          {isUserMenuOpen && (
            <div className="absolute left-3 top-14 w-52 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl rounded-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              {/* Header profile info */}
              <div className="p-2 flex flex-col items-center text-center">
                <DexterAvatarSVG className="w-10 h-10 mb-1.5" />
                <div className="text-[13px] font-bold text-neutral-900 dark:text-white">
                  {user?.name || 'Dexter'}
                </div>
                <div className="text-[11px] text-neutral-400 truncate max-w-[180px]">
                  {user?.email || 'dexter@gmail.com'}
                </div>
              </div>

              <div className="h-[1px] bg-neutral-100 dark:bg-neutral-800 my-1" />

              {/* Menu items */}
              <div className="space-y-0.5 text-xs font-normal">
                {/* Change Theme */}
                <div className="relative">
                  <button
                    onMouseEnter={() => setActiveSubflyout('theme')}
                    onClick={() => setActiveSubflyout(activeSubflyout === 'theme' ? null : 'theme')}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors ${
                      activeSubflyout === 'theme'
                        ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Sun className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Change Theme</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                  </button>

                  {/* Theme Subflyout (page 9.png) */}
                  {activeSubflyout === 'theme' && (
                    <div className="absolute left-full top-0 ml-1.5 w-40 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl rounded-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                      <div className="text-[10px] font-semibold text-neutral-400 px-2 py-1">Theme</div>
                      <button
                        onClick={() => {
                          setTheme('light');
                          setIsUserMenuOpen(false);
                          setActiveSubflyout(null);
                        }}
                        className="w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
                      >
                        <div className="flex items-center gap-2">
                          <Sun className="w-3.5 h-3.5 text-neutral-500" />
                          <span>Light</span>
                        </div>
                        {theme === 'light' && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                      </button>
                      <button
                        onClick={() => {
                          setTheme('dark');
                          setIsUserMenuOpen(false);
                          setActiveSubflyout(null);
                        }}
                        className="w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
                      >
                        <div className="flex items-center gap-2">
                          <Moon className="w-3.5 h-3.5 text-neutral-500" />
                          <span>Dark</span>
                        </div>
                        {theme === 'dark' && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                      </button>
                    </div>
                  )}
                </div>

                {/* Color Mode */}
                <div className="relative">
                  <button
                    onMouseEnter={() => setActiveSubflyout('color')}
                    onClick={() => setActiveSubflyout(activeSubflyout === 'color' ? null : 'color')}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors ${
                      activeSubflyout === 'color'
                        ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-xs bg-neutral-900 dark:bg-white" />
                      <span>Color Mode</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                  </button>

                  {/* Color Mode Subflyout (page 10.png) */}
                  {activeSubflyout === 'color' && (
                    <div className="absolute left-full top-0 ml-1.5 w-40 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl rounded-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                      <div className="text-[10px] font-semibold text-neutral-400 px-2 py-1">Color Mode</div>
                      {colorModes.map((c) => (
                        <button
                          key={c.key}
                          onClick={() => {
                            setAccent(c.key);
                            setIsUserMenuOpen(false);
                            setActiveSubflyout(null);
                          }}
                          className="w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
                        >
                          <div className="flex items-center gap-2">
                            <span className={`w-3 h-3 rounded-xs ${c.bgClass}`} />
                            <span>{c.name}</span>
                          </div>
                          {accent === c.key && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Settings */}
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    router.push('/settings');
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60"
                >
                  <SettingsIcon className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Settings</span>
                </button>
              </div>

              <div className="h-[1px] bg-neutral-100 dark:bg-neutral-800 my-1" />

              <button
                onClick={() => {
                  logout();
                  router.push('/login');
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto px-2 py-1 space-y-3">
          <div>
            <button
              onClick={() => setIsWorkspaceExpanded(!isWorkspaceExpanded)}
              className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            >
              <span>Workspace</span>
              <ChevronDown
                className={`w-3 h-3 transition-transform duration-200 ${
                  isWorkspaceExpanded ? '' : '-rotate-90'
                }`}
              />
            </button>

            {isWorkspaceExpanded && (
              <div className="mt-1 space-y-0.5">
                {navItems.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                        isActive
                          ? 'bg-neutral-200/70 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold'
                          : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/40 hover:text-neutral-900 dark:hover:text-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-neutral-900 dark:text-white' : 'text-neutral-400'}`} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
