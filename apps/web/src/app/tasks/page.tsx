'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Search, Plus, ChevronDown, ChevronRight, MoreHorizontal } from 'lucide-react';
import { TaskCard, TaskItem } from '@/components/tasks/TaskCard';
import { TaskRow } from '@/components/tasks/TaskRow';
import { FieldsDropdown, FieldVisibility } from '@/components/ui/FieldsDropdown';
import { FilterDropdown, FilterState } from '@/components/ui/FilterDropdown';
import { TaskModal } from '@/components/ui/TaskModal';
import { TaskDetailDrawer } from '@/components/tasks/TaskDetailDrawer';
import { api } from '@/lib/api';

export default function TasksPage() {
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [search, setSearch] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [filters, setFilters] = useState<FilterState>({});
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalDefaultStatus, setCreateModalDefaultStatus] = useState('TO_DO');

  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const [fields, setFields] = useState<FieldVisibility>({
    priority: true,
    members: true,
    dueDate: true,
    labels: true,
    status: true,
    reporter: true,
  });

  useEffect(() => {
    const savedFields = localStorage.getItem('task_fields');
    if (savedFields) {
      try {
        setFields(JSON.parse(savedFields));
      } catch (e) {}
    }
    fetchTasks();
    fetchProjects();
  }, []);

  const fetchTasks = async (querySearch = search) => {
    setLoading(true);
    try {
      const res = await api.get('/tasks', {
        params: { search: querySearch || undefined },
      });
      setTasks(res.data);
    } catch (e) {
      console.error('Failed to fetch tasks', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    fetchTasks(val);
  };

  const handleCreateTask = async (data: any) => {
    try {
      await api.post('/tasks', data);
      fetchTasks();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdatePriority = async (taskId: string, priority: string) => {
    try {
      await api.patch(`/tasks/${taskId}`, { priority });
      fetchTasks();
    } catch (e) {
      console.error(e);
    }
  };

  const toggleGroup = (groupKey: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  // Filter tasks locally by status, priority, member, label if filter set
  const filteredTasks = tasks.filter((t) => {
    if (filters.status) {
      const taskStatus = (t.status || 'TO_DO').toUpperCase();
      if (taskStatus !== filters.status.toUpperCase()) return false;
    }
    if (filters.priority) {
      const taskPriority = (t.priority || 'NO_PRIORITY').toUpperCase();
      if (taskPriority !== filters.priority.toUpperCase()) return false;
    }
    if (filters.member) {
      const hasMember = t.assignees?.some((a) =>
        a.user.name.toLowerCase().includes(filters.member!.toLowerCase())
      );
      if (!hasMember) return false;
    }
    if (filters.label) {
      const hasLabel = t.labels?.some((l) =>
        l.label.name.toLowerCase().includes(filters.label!.toLowerCase())
      );
      if (!hasLabel) return false;
    }
    return true;
  });

  const statuses = [
    { key: 'TO_DO', title: 'To Do' },
    { key: 'DOING', title: 'Doing' },
    { key: 'COMPLETED', title: 'Completed' },
    { key: 'ON_HOLD', title: 'On Hold' },
  ];

  return (
    <AppLayout>
      <div className="space-y-5 max-w-7xl mx-auto w-full">
        {/* If a task is selected, show full-width in-page task detail */}
        {selectedTask ? (
          <TaskDetailDrawer
            taskId={selectedTask.id}
            onClose={() => setSelectedTask(null)}
            onTaskUpdated={fetchTasks}
          />
        ) : (
          <>
            {/* Top Control Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-[17px] font-bold text-neutral-900 dark:text-white tracking-tight">
                Tasks
              </h1>

              <div className="flex items-center flex-wrap gap-2">
                {/* Collapsible Live Search (ISSUE 1 fix) */}
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
                    onChange={handleSearchChange}
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

                {/* Fields Dropdown */}
                <FieldsDropdown
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  fields={fields}
                  onFieldsChange={setFields}
                />

                {/* Working Filter Dropdown (ISSUE 3 fix) */}
                <FilterDropdown filters={filters} onFilterChange={setFilters} />

                {/* + Add Task */}
                <button
                  onClick={() => {
                    setCreateModalDefaultStatus('TO_DO');
                    setIsCreateModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 h-8 sm:h-9 px-3.5 text-xs font-semibold rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 transition-opacity shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Task</span>
                </button>
              </div>
            </div>

            {/* Views Rendering */}
            {loading ? (
              <div className="py-16 flex justify-center">
                <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-neutral-900 dark:border-white" />
              </div>
            ) : viewMode === 'board' ? (
              /* Kanban Board View */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 items-start overflow-x-auto pb-6">
                {statuses.map((s) => {
                  const columnTasks = filteredTasks.filter(
                    (t) => (t.status || 'TO_DO').toUpperCase() === s.key
                  );
                  return (
                    <div
                      key={s.key}
                      className="bg-neutral-100/70 dark:bg-neutral-900/40 rounded-xl p-2.5 border border-neutral-200/60 dark:border-neutral-800 space-y-2.5 min-w-[250px]"
                    >
                      {/* Column Header */}
                      <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                            {s.title}
                          </span>
                          <span className="text-[11px] font-medium text-neutral-400 bg-white dark:bg-neutral-800 px-1.5 py-0.2 rounded-md">
                            {columnTasks.length}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-neutral-400">
                          <button
                            onClick={() => {
                              setCreateModalDefaultStatus(s.key);
                              setIsCreateModalOpen(true);
                            }}
                            className="p-0.5 hover:text-neutral-700 dark:hover:text-neutral-200"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-0.5 hover:text-neutral-700 dark:hover:text-neutral-200">
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Cards list */}
                      <div className="space-y-2">
                        {columnTasks.map((t) => (
                          <TaskCard
                            key={t.id}
                            task={t}
                            fields={fields}
                            onTaskClick={setSelectedTask}
                            onUpdatePriority={handleUpdatePriority}
                          />
                        ))}

                        <button
                          onClick={() => {
                            setCreateModalDefaultStatus(s.key);
                            setIsCreateModalOpen(true);
                          }}
                          className="w-full py-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white border border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-white dark:hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Task</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Grouped List View (Matching Figma page 4 & 7) */
              <div className="space-y-5">
                {statuses.map((s) => {
                  const groupTasks = filteredTasks.filter(
                    (t) => (t.status || 'TO_DO').toUpperCase() === s.key
                  );
                  const isCollapsed = collapsedGroups[s.key];

                  return (
                    <div key={s.key} className="space-y-2">
                      <button
                        onClick={() => toggleGroup(s.key)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-neutral-900 dark:text-white hover:opacity-80 cursor-pointer"
                      >
                        {isCollapsed ? (
                          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                        )}
                        <span>{s.title}</span>
                      </button>

                      {!isCollapsed && (
                        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-2xs">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-500 font-medium border-b border-neutral-200 dark:border-neutral-800">
                              <tr>
                                <th className="py-2.5 px-4">Task</th>
                                {fields.priority && <th className="py-2.5 px-4">Priority</th>}
                                {fields.members && <th className="py-2.5 px-4">Members</th>}
                                {fields.dueDate && <th className="py-2.5 px-4">Due Date</th>}
                                <th className="py-2.5 px-4 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {groupTasks.length > 0 ? (
                                groupTasks.map((t, idx) => (
                                  <TaskRow
                                    key={t.id}
                                    task={t}
                                    fields={fields}
                                    onTaskClick={setSelectedTask}
                                    onUpdatePriority={handleUpdatePriority}
                                    memberStyle={
                                      idx % 3 === 0 ? 'avatar' : idx % 3 === 1 ? 'initials' : 'plus'
                                    }
                                  />
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={5} className="py-4 text-center text-neutral-400">
                                    No tasks in {s.title}
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>

                          <div className="p-2 border-t border-neutral-100 dark:border-neutral-800">
                            <button
                              onClick={() => {
                                setCreateModalDefaultStatus(s.key);
                                setIsCreateModalOpen(true);
                              }}
                              className="flex items-center gap-1.5 px-2 py-1 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white font-medium cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add Task</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Task Modal for creation */}
        <TaskModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateTask}
          defaultStatus={createModalDefaultStatus}
          projects={projects}
        />
      </div>
    </AppLayout>
  );
}
