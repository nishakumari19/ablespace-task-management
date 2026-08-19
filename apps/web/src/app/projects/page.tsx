'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { Search, Plus, MoreHorizontal, FolderKanban } from 'lucide-react';
import { PriorityBadge } from '@/components/ui/PriorityIcon';
import { Avatar } from '@/components/ui/Avatar';
import { NestedProjectsFieldsDropdown } from '@/components/ui/NestedProjectsFieldsDropdown';
import { FilterDropdown, FilterState } from '@/components/ui/FilterDropdown';
import { ProjectModal } from '@/components/ui/ProjectModal';
import { api } from '@/lib/api';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [filters, setFilters] = useState<FilterState>({});

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    status: true,
    priority: true,
    members: true,
    dueDate: true,
    teams: true,
    labels: true,
    reporter: true,
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (data: any) => {
    try {
      await api.post('/projects', data);
      fetchProjects();
    } catch (e) {
      console.error(e);
    }
  };

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Filter projects by search query and filters
  const filteredProjects = projects.filter((p) => {
    if (search) {
      const query = search.toLowerCase();
      const matchesName = p.name?.toLowerCase().includes(query);
      const matchesDesc = p.description?.toLowerCase().includes(query);
      if (!matchesName && !matchesDesc) return false;
    }
    if (filters.priority) {
      const projPriority = (p.priority || 'NO_PRIORITY').toUpperCase();
      if (projPriority !== filters.priority.toUpperCase()) return false;
    }
    if (filters.member && p.lead) {
      const matchesLead = p.lead.name?.toLowerCase().includes(filters.member.toLowerCase());
      if (!matchesLead) return false;
    }
    return true;
  });

  return (
    <AppLayout>
      <div className="space-y-5 max-w-7xl mx-auto w-full">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-[17px] font-bold text-neutral-900 dark:text-white tracking-tight">
            Projects
          </h1>

          <div className="flex items-center flex-wrap gap-2">
            {/* Collapsible Search (ISSUE 1 fix) */}
            <div
              className={`relative flex items-center transition-all duration-200 ${
                isSearchOpen || search ? 'w-48 sm:w-56' : 'w-8 h-8 sm:w-9 sm:h-9 cursor-pointer'
              }`}
              onClick={() => {
                if (!isSearchOpen) {
                  setIsSearchOpen(true);
                  setTimeout(() => searchInputRef.current?.focus(), 50);
                }
              }}
            >
              <Search className="w-3.5 h-3.5 absolute left-2.5 text-neutral-400 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setIsSearchOpen(true)}
                onBlur={() => {
                  if (!search) setIsSearchOpen(false);
                }}
                placeholder={isSearchOpen || search ? 'Search...' : ''}
                className={`w-full h-8 sm:h-9 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-hidden transition-all ${
                  isSearchOpen || search
                    ? 'pl-8 pr-3 opacity-100'
                    : 'pl-8 pr-0 opacity-0 cursor-pointer'
                }`}
              />
            </div>

            {/* Fields Dropdown with Nested Submenus */}
            <NestedProjectsFieldsDropdown
              visibleColumns={visibleColumns}
              onToggleColumn={toggleColumn}
            />

            {/* Filter Dropdown (ISSUE 3 fix) */}
            <FilterDropdown filters={filters} onFilterChange={setFilters} />

            {/* + Add Project */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 h-8 sm:h-9 px-3.5 text-xs font-semibold rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 shadow-xs transition-opacity cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Project</span>
            </button>
          </div>
        </div>

        {/* Table View */}
        {loading ? (
          <div className="py-16 flex justify-center">
            <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-neutral-900 dark:border-white" />
          </div>
        ) : (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-500 font-medium border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="py-2.5 px-4">Project Name</th>
                  {visibleColumns.priority && <th className="py-2.5 px-4">Priority</th>}
                  {visibleColumns.members && <th className="py-2.5 px-4">Lead</th>}
                  {visibleColumns.dueDate && <th className="py-2.5 px-4">Due Date</th>}
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">
                        <Link
                          href={`/projects/${p.id}`}
                          className="flex items-center gap-2.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        >
                          <div className="w-6 h-6 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                            <FolderKanban className="w-3 h-3" />
                          </div>
                          <div>
                            <div>{p.name}</div>
                            {p.description && (
                              <div className="text-[11px] font-normal text-neutral-400 line-clamp-1">
                                {p.description}
                              </div>
                            )}
                          </div>
                        </Link>
                      </td>

                      {visibleColumns.priority && (
                        <td className="py-3 px-4">
                          <PriorityBadge priority={p.priority} />
                        </td>
                      )}

                      {visibleColumns.members && (
                        <td className="py-3 px-4">
                          {p.lead ? (
                            <div className="flex items-center gap-2">
                              <Avatar src={p.lead.avatar} name={p.lead.name} size="xs" />
                              <span className="text-neutral-700 dark:text-neutral-300">
                                {p.lead.name}
                              </span>
                            </div>
                          ) : (
                            <span className="text-neutral-400">-</span>
                          )}
                        </td>
                      )}

                      {visibleColumns.dueDate && (
                        <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">
                          {p.dueDate || '12 Sep 2026'}
                        </td>
                      )}

                      <td className="py-3 px-4 text-right">
                        <button className="p-1 rounded text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-neutral-400">
                      No projects found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <ProjectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateProject}
        />
      </div>
    </AppLayout>
  );
}
