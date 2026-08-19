'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Search, Filter, Plus, ChevronRight } from 'lucide-react';
import { TaskCard, TaskItem } from '@/components/tasks/TaskCard';
import { TaskRow } from '@/components/tasks/TaskRow';
import { FieldsDropdown, FieldVisibility } from '@/components/ui/FieldsDropdown';
import { TaskModal } from '@/components/ui/TaskModal';
import { TaskDetailDrawer } from '@/components/tasks/TaskDetailDrawer';
import { api } from '@/lib/api';

export default function ScopedProjectTasksPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'board' | 'list'>('list'); // Default to list view as shown in Figma screenshot 2 & 3
  const [search, setSearch] = useState('');
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalDefaultStatus, setCreateModalDefaultStatus] = useState('TO_DO');

  const [fields, setFields] = useState<FieldVisibility>({
    priority: true,
    members: true,
    dueDate: true,
    labels: true,
    status: true,
    reporter: true,
  });

  useEffect(() => {
    if (projectId) {
      fetchProjectDetails();
      fetchScopedTasks();
    }
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      const res = await api.get(`/projects/${projectId}`);
      setProject(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchScopedTasks = async (querySearch = search) => {
    setLoading(true);
    try {
      const res = await api.get('/tasks', {
        params: { projectId, search: querySearch || undefined },
      });
      setTasks(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    fetchScopedTasks(val);
  };

  const handleCreateTask = async (data: any) => {
    try {
      await api.post('/tasks', { ...data, projectId });
      fetchScopedTasks();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdatePriority = async (taskId: string, priority: string) => {
    try {
      await api.patch(`/tasks/${taskId}`, { priority });
      fetchScopedTasks();
    } catch (e) {
      console.error(e);
    }
  };

  const statuses = [
    { key: 'TO_DO', title: 'To Do' },
    { key: 'DOING', title: 'Doing' },
    { key: 'COMPLETED', title: 'Completed' },
    { key: 'ON_HOLD', title: 'On Hold' },
  ];

  return (
    <AppLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Breadcrumb Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Link
              href="/projects"
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Projects
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 dark:text-white">{project?.name || 'Project Tasks'}</span>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {/* Live Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search..."
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-hidden w-44 md:w-56"
              />
            </div>

            {/* Fields Dropdown */}
            <FieldsDropdown
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              fields={fields}
              onFieldsChange={setFields}
            />

            {/* Filter */}
            <button className="p-2 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
              <Filter className="w-3.5 h-3.5" />
            </button>

            {/* + Add Task */}
            <button
              onClick={() => {
                setCreateModalDefaultStatus('TO_DO');
                setIsCreateModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-black text-white dark:bg-white dark:text-black hover:opacity-90 shadow-xs transition-opacity"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </button>
          </div>
        </div>

        {/* View Content */}
        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white" />
          </div>
        ) : viewMode === 'board' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
            {statuses.map((s) => {
              const columnTasks = tasks.filter((t) => (t.status || 'TO_DO').toUpperCase() === s.key);
              return (
                <div
                  key={s.key}
                  className="bg-gray-100/70 dark:bg-gray-800/40 rounded-2xl p-3 border border-gray-200/60 dark:border-gray-800 space-y-3"
                >
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-200">
                      {s.title} ({columnTasks.length})
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {columnTasks.map((t) => (
                      <TaskCard
                        key={t.id}
                        task={t}
                        fields={fields}
                        onTaskClick={setSelectedTask}
                        onUpdatePriority={handleUpdatePriority}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-6">
            {statuses.map((s) => {
              const groupTasks = tasks.filter((t) => (t.status || 'TO_DO').toUpperCase() === s.key);
              return (
                <div key={s.key} className="space-y-2">
                  <div className="text-xs font-bold text-gray-900 dark:text-white">
                    ▾ {s.title}
                  </div>

                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-2xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 dark:bg-gray-800/60 text-gray-500 font-semibold border-b border-gray-200 dark:border-gray-800">
                        <tr>
                          <th className="py-3 px-4">Task</th>
                          {fields.priority && <th className="py-3 px-4">Priority</th>}
                          {fields.members && <th className="py-3 px-4">Members</th>}
                          {fields.dueDate && <th className="py-3 px-4">Due Date</th>}
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groupTasks.length > 0 ? (
                          groupTasks.map((t) => (
                            <TaskRow
                              key={t.id}
                              task={t}
                              fields={fields}
                              onTaskClick={setSelectedTask}
                              onUpdatePriority={handleUpdatePriority}
                            />
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="py-4 text-center text-gray-400">
                              No tasks in {s.title}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>

                    <div className="p-2 border-t border-gray-100 dark:border-gray-800">
                      <button
                        onClick={() => {
                          setCreateModalDefaultStatus(s.key);
                          setIsCreateModalOpen(true);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white font-medium"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Task</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <TaskModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateTask}
          defaultStatus={createModalDefaultStatus}
          projects={project ? [project] : []}
        />

        <TaskDetailDrawer
          taskId={selectedTask?.id || null}
          onClose={() => setSelectedTask(null)}
          onTaskUpdated={fetchScopedTasks}
        />
      </div>
    </AppLayout>
  );
}
