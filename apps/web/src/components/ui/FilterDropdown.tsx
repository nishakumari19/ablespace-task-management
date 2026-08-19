'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Filter,
  ChevronRight,
  Check,
  CircleDot,
  Users,
  Calendar,
  Tag,
  User,
  X
} from 'lucide-react';
import { PrioritySignalIcon, PriorityType } from './PriorityIcon';
import { Avatar } from './Avatar';

export interface FilterState {
  status?: string | null;
  priority?: string | null;
  member?: string | null;
  label?: string | null;
}

interface FilterDropdownProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export function FilterDropdown({ filters, onFilterChange }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveMenu(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePrioritySelect = (pKey: string | null) => {
    const updated = { ...filters, priority: filters.priority === pKey ? null : pKey };
    onFilterChange(updated);
  };

  const handleStatusSelect = (sKey: string | null) => {
    const updated = { ...filters, status: filters.status === sKey ? null : sKey };
    onFilterChange(updated);
  };

  const handleMemberSelect = (mKey: string | null) => {
    const updated = { ...filters, member: filters.member === mKey ? null : mKey };
    onFilterChange(updated);
  };

  const handleLabelSelect = (lKey: string | null) => {
    const updated = { ...filters, label: filters.label === lKey ? null : lKey };
    onFilterChange(updated);
  };

  const clearAllFilters = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFilterChange({});
  };

  const hasActiveFilters = Object.values(filters).some((v) => !!v);

  const priorities: { key: PriorityType; label: string }[] = [
    { key: 'NO_PRIORITY', label: 'No Priority' },
    { key: 'URGENT', label: 'Urgent' },
    { key: 'HIGH', label: 'High' },
    { key: 'MEDIUM', label: 'Medium' },
    { key: 'LOW', label: 'Low' },
  ];

  const statuses = [
    { key: 'BACKLOG', label: 'Backlog' },
    { key: 'TO_DO', label: 'To Do' },
    { key: 'DOING', label: 'Doing' },
    { key: 'COMPLETED', label: 'Completed' },
    { key: 'ON_HOLD', label: 'On Hold' },
  ];

  const members = [
    { key: 'Dexter', label: 'Dexter' },
    { key: 'Admin', label: 'Admin' },
    { key: 'Designer', label: 'Designer' },
    { key: 'QA Team', label: 'QA Team' },
    { key: 'Security', label: 'Security' },
    { key: 'CN', label: 'CN' },
  ];

  const labels = [
    { key: 'Deployment', label: 'Deployment' },
    { key: 'Testing', label: 'Testing' },
    { key: 'Passed', label: 'Passed' },
    { key: 'Design', label: 'Design' },
    { key: 'Updated', label: 'Updated' },
    { key: 'Audit', label: 'Audit' },
    { key: 'Scheduled', label: 'Scheduled' },
  ];

  return (
    <div className="relative inline-block text-left" ref={popoverRef}>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setActiveMenu(null);
        }}
        className={`h-8 sm:h-9 px-2.5 rounded-lg border text-xs font-medium inline-flex items-center gap-1.5 transition-colors ${
          hasActiveFilters || isOpen
            ? 'border-neutral-900 dark:border-white bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
            : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
        }`}
        title="Filter"
      >
        <Filter className="w-3.5 h-3.5" />
        {hasActiveFilters && (
          <span
            onClick={clearAllFilters}
            className="p-0.5 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full"
            title="Clear filters"
          >
            <X className="w-3 h-3 text-neutral-500" />
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-44 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl z-50 p-1.5 animate-in fade-in zoom-in-95 duration-100">
          <div className="space-y-0.5 text-xs font-normal">
            {/* Status (matching Figma page 11.png) */}
            <div className="relative">
              <button
                onMouseEnter={() => setActiveMenu('status')}
                onClick={() => setActiveMenu(activeMenu === 'status' ? null : 'status')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors ${
                  activeMenu === 'status' || filters.status
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CircleDot className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Status</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              {activeMenu === 'status' && (
                <div className="absolute right-full top-0 mr-1.5 w-40 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl rounded-xl p-1.5 z-50">
                  <div className="text-[10px] font-semibold text-neutral-400 px-2 py-1">Status</div>
                  {statuses.map((s) => (
                    <button
                      key={s.key}
                      onClick={() => handleStatusSelect(s.key)}
                      className="w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-left"
                    >
                      <span>{s.label}</span>
                      {filters.status === s.key && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Priority (matching Figma page 11.png) */}
            <div className="relative">
              <button
                onMouseEnter={() => setActiveMenu('priority')}
                onClick={() => setActiveMenu(activeMenu === 'priority' ? null : 'priority')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors ${
                  activeMenu === 'priority' || filters.priority
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <PrioritySignalIcon priority="HIGH" className="scale-90" />
                  <span>Priority</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              {activeMenu === 'priority' && (
                <div className="absolute right-full top-0 mr-1.5 w-44 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl rounded-xl p-1.5 z-50">
                  <div className="text-[10px] font-semibold text-neutral-400 px-2 py-1">Priority</div>
                  {priorities.map((p) => (
                    <button
                      key={p.key}
                      onClick={() => handlePrioritySelect(p.key)}
                      className="w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-left"
                    >
                      <div className="flex items-center gap-2">
                        <PrioritySignalIcon priority={p.key} />
                        <span>{p.label}</span>
                      </div>
                      {filters.priority === p.key && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Members */}
            <div className="relative">
              <button
                onMouseEnter={() => setActiveMenu('members')}
                onClick={() => setActiveMenu(activeMenu === 'members' ? null : 'members')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors ${
                  activeMenu === 'members' || filters.member
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Members</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              {activeMenu === 'members' && (
                <div className="absolute right-full top-0 mr-1.5 w-44 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl rounded-xl p-1.5 z-50">
                  <div className="text-[10px] font-semibold text-neutral-400 px-2 py-1">Members</div>
                  {members.map((m) => (
                    <button
                      key={m.key}
                      onClick={() => handleMemberSelect(m.key)}
                      className="w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-left"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar name={m.label} size="xs" />
                        <span>{m.label}</span>
                      </div>
                      {filters.member === m.key && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Labels */}
            <div className="relative">
              <button
                onMouseEnter={() => setActiveMenu('labels')}
                onClick={() => setActiveMenu(activeMenu === 'labels' ? null : 'labels')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors ${
                  activeMenu === 'labels' || filters.label
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Labels</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              {activeMenu === 'labels' && (
                <div className="absolute right-full top-0 mr-1.5 w-44 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl rounded-xl p-1.5 z-50">
                  <div className="text-[10px] font-semibold text-neutral-400 px-2 py-1">Labels</div>
                  {labels.map((l) => (
                    <button
                      key={l.key}
                      onClick={() => handleLabelSelect(l.key)}
                      className="w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-left"
                    >
                      <div className="flex items-center gap-2">
                        <Tag className="w-3 h-3 text-neutral-500" />
                        <span>{l.label}</span>
                      </div>
                      {filters.label === l.key && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Due Date (Disabled / Informational) */}
            <div className="px-2.5 py-1.5 text-xs text-neutral-400 dark:text-neutral-600 flex items-center justify-between cursor-not-allowed">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-neutral-300 dark:text-neutral-700" />
                <span>Due Date</span>
              </div>
            </div>

            {/* Teams (Disabled / Informational) */}
            <div className="px-2.5 py-1.5 text-xs text-neutral-400 dark:text-neutral-600 flex items-center justify-between cursor-not-allowed">
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-neutral-300 dark:text-neutral-700" />
                <span>Teams</span>
              </div>
            </div>

            {/* Reporter (Disabled / Informational) */}
            <div className="px-2.5 py-1.5 text-xs text-neutral-400 dark:text-neutral-600 flex items-center justify-between cursor-not-allowed">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-neutral-300 dark:text-neutral-700" />
                <span>Reporter</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
