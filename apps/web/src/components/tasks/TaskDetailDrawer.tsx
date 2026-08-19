'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Calendar as CalendarIcon,
  Tag,
  Paperclip,
  Send,
  UserPlus,
  Lock,
  Eye,
  Share2,
  MoreHorizontal,
  ChevronRight,
  ArrowLeft,
  Activity,
  Smile,
  X
} from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { PriorityBadge, PriorityIcon, PrioritySignalIcon, PriorityType } from '../ui/PriorityIcon';
import { DatePickerPopover } from '../ui/DatePickerPopover';
import { api } from '@/lib/api';

interface TaskDetailViewProps {
  taskId: string | null;
  onClose: () => void;
  onTaskUpdated?: () => void;
}

export function TaskDetailDrawer({ taskId, onClose, onTaskUpdated }: TaskDetailViewProps) {
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [showAddSubtask, setShowAddSubtask] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [replyText, setReplyText] = useState('');
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);

  useEffect(() => {
    if (taskId) {
      fetchTaskDetails(taskId);
    } else {
      setTask(null);
    }
  }, [taskId]);

  const fetchTaskDetails = async (id: string) => {
    setLoading(true);
    try {
      const res = await api.get(`/tasks/${id}`);
      setTask(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!taskId) return null;

  const handleUpdateStatus = async (status: string) => {
    try {
      await api.patch(`/tasks/${taskId}`, { status });
      fetchTaskDetails(taskId);
      if (onTaskUpdated) onTaskUpdated();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdatePriority = async (priority: string) => {
    try {
      await api.patch(`/tasks/${taskId}`, { priority });
      setShowPriorityDropdown(false);
      fetchTaskDetails(taskId);
      if (onTaskUpdated) onTaskUpdated();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateDate = async (dueDate: string) => {
    try {
      await api.patch(`/tasks/${taskId}`, { dueDate });
      fetchTaskDetails(taskId);
      if (onTaskUpdated) onTaskUpdated();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddSubtask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    try {
      await api.post('/tasks', {
        title: newSubtaskTitle,
        parentTaskId: taskId,
        status: 'TO_DO',
        priority: 'MEDIUM',
      });
      setNewSubtaskTitle('');
      setShowAddSubtask(false);
      fetchTaskDetails(taskId);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await api.post(`/tasks/${taskId}/comments`, { content: commentText });
      setCommentText('');
      fetchTaskDetails(taskId);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    try {
      await api.post(`/tasks/${taskId}/comments`, { content: replyText });
      setReplyText('');
      fetchTaskDetails(taskId);
    } catch (e) {
      console.error(e);
    }
  };

  const priorities: { key: PriorityType; label: string }[] = [
    { key: 'NO_PRIORITY', label: 'No Priority' },
    { key: 'URGENT', label: 'Urgent' },
    { key: 'HIGH', label: 'High' },
    { key: 'MEDIUM', label: 'Medium' },
    { key: 'LOW', label: 'Low' },
  ];

  return (
    <div className="w-full space-y-4 animate-in fade-in duration-150">
      {/* Top Breadcrumb & Action Toolbar (matching Figma page 6 & 8) */}
      <div className="flex items-center justify-between py-1 border-b border-neutral-200/80 dark:border-neutral-800 pb-3">
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Tasks</span>
          </button>
          <span className="text-neutral-300 dark:text-neutral-700">/</span>
          <span className="font-semibold text-neutral-900 dark:text-white truncate max-w-[200px] sm:max-w-md">
            {task?.title || 'Task Details'}
          </span>
        </div>

        <div className="flex items-center gap-1 text-neutral-500 dark:text-neutral-400">
          <button className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-700">
            <Lock className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
            <Eye className="w-3 h-3" />
            <span>1</span>
          </div>
          <button className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-700">
            <Share2 className="w-3.5 h-3.5" />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-700">
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white ml-1"
            title="Back to Tasks"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900 dark:border-white" />
        </div>
      ) : task ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Left Column (~70% -> 8 of 12 cols on desktop) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Title & Description */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
                {task.title}
              </h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                {task.description ||
                  'Create clear and detailed API documentation to guide developers in using the inventory and sales metrics features effectively.'}
              </p>
            </div>

            {/* Properties row */}
            <div className="flex items-center gap-4 text-xs py-1">
              <span className="text-neutral-400 font-medium w-20">Properties</span>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 font-medium text-neutral-800 dark:text-neutral-200">
                  <span className="w-4 h-4 rounded-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-bold flex items-center justify-center text-[10px]">
                    A
                  </span>
                  <span>Designer</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[#ef4444] font-medium text-[11px]">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <span>31 Jul</span>
                </span>
              </div>
            </div>

            {/* Labels row */}
            <div className="flex items-center gap-4 text-xs py-1">
              <span className="text-neutral-400 font-medium w-20">Labels</span>
              <div className="flex items-center flex-wrap gap-1.5">
                {task.labels && task.labels.length > 0 ? (
                  task.labels.map((l: any) => (
                    <span
                      key={l.label.id}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-normal bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200/60 dark:border-neutral-700/60"
                    >
                      <Tag className="w-2.5 h-2.5 text-neutral-400 flex-shrink-0" />
                      <span>{l.label?.name || l.name || 'Label'}</span>
                    </span>
                  ))
                ) : (
                  <>
                    {['Research', 'Design', 'Development', 'Testing', 'Deployment'].map((name) => (
                      <span
                        key={name}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-normal bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200/60 dark:border-neutral-700/60"
                      >
                        <Tag className="w-2.5 h-2.5 text-neutral-400 flex-shrink-0" />
                        <span>{name}</span>
                      </span>
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* Resources row */}
            <div className="flex items-center gap-4 text-xs py-1">
              <span className="text-neutral-400 font-medium w-20">Resources</span>
              <button className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors">
                <Paperclip className="w-3.5 h-3.5 text-neutral-400" />
                <span>Add document or link...</span>
              </button>
            </div>

            {/* Subtasks Section */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-neutral-900 dark:text-white">
                  ▾ Subtasks
                </h3>
              </div>

              {/* Subtasks Table */}
              <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-2xs bg-white dark:bg-neutral-900">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-500 font-medium border-b border-neutral-200 dark:border-neutral-800">
                    <tr>
                      <th className="py-2.5 px-3.5">Task</th>
                      <th className="py-2.5 px-3.5">Priority</th>
                      <th className="py-2.5 px-3.5">Members</th>
                      <th className="py-2.5 px-3.5">Due Date</th>
                      <th className="py-2.5 px-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                    {task.subtasks && task.subtasks.length > 0 ? (
                      task.subtasks.map((st: any) => (
                        <tr key={st.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40">
                          <td className="py-2.5 px-3.5 font-medium text-neutral-900 dark:text-white">
                            {st.title}
                          </td>
                          <td className="py-2.5 px-3.5">
                            <PriorityBadge priority={st.priority} />
                          </td>
                          <td className="py-2.5 px-3.5">
                            {st.assignees && st.assignees.length > 0 ? (
                              <Avatar
                                src={st.assignees[0].user.avatar}
                                name={st.assignees[0].user.name}
                                size="xs"
                              />
                            ) : (
                              <Avatar name="Dexter" size="xs" />
                            )}
                          </td>
                          <td className="py-2.5 px-3.5 text-neutral-600 dark:text-neutral-400">
                            {st.dueDate || '12 Sep 2026'}
                          </td>
                          <td className="py-2.5 px-3.5 text-right text-neutral-400">
                            <MoreHorizontal className="w-3.5 h-3.5 inline" />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <>
                        <tr className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40">
                          <td className="py-2.5 px-3.5 text-neutral-900 dark:text-white">Subtask 1</td>
                          <td className="py-2.5 px-3.5">
                            <PriorityBadge priority="HIGH" />
                          </td>
                          <td className="py-2.5 px-3.5">
                            <Avatar name="Dexter" size="xs" />
                          </td>
                          <td className="py-2.5 px-3.5 text-neutral-600 dark:text-neutral-400">
                            12 Sep 2026
                          </td>
                          <td className="py-2.5 px-3.5 text-right text-neutral-400">
                            <MoreHorizontal className="w-3.5 h-3.5 inline" />
                          </td>
                        </tr>
                        <tr className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40">
                          <td className="py-2.5 px-3.5 text-neutral-900 dark:text-white">Subtask 2</td>
                          <td className="py-2.5 px-3.5">
                            <PriorityBadge priority="LOW" />
                          </td>
                          <td className="py-2.5 px-3.5">
                            <div className="w-5 h-5 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 text-[10px] font-semibold flex items-center justify-center">
                              CN
                            </div>
                          </td>
                          <td className="py-2.5 px-3.5 text-neutral-600 dark:text-neutral-400">
                            15 Sep 2026
                          </td>
                          <td className="py-2.5 px-3.5 text-right text-neutral-400">
                            <MoreHorizontal className="w-3.5 h-3.5 inline" />
                          </td>
                        </tr>
                        <tr className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40">
                          <td className="py-2.5 px-3.5 text-neutral-900 dark:text-white">Subtask 3</td>
                          <td className="py-2.5 px-3.5">
                            <PriorityBadge priority="MEDIUM" />
                          </td>
                          <td className="py-2.5 px-3.5">
                            <div className="w-5 h-5 rounded-full border border-dashed border-neutral-300 dark:border-neutral-600 flex items-center justify-center text-neutral-400">
                              <Plus className="w-3 h-3" />
                            </div>
                          </td>
                          <td className="py-2.5 px-3.5 text-neutral-600 dark:text-neutral-400">
                            18 Sep 2026
                          </td>
                          <td className="py-2.5 px-3.5 text-right text-neutral-400">
                            <MoreHorizontal className="w-3.5 h-3.5 inline" />
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>

                {/* + Add Subtasks button / form */}
                <div className="p-2 border-t border-neutral-100 dark:border-neutral-800">
                  {showAddSubtask ? (
                    <form onSubmit={handleAddSubtask} className="flex gap-2 p-1">
                      <input
                        type="text"
                        autoFocus
                        value={newSubtaskTitle}
                        onChange={(e) => setNewSubtaskTitle(e.target.value)}
                        placeholder="Subtask title..."
                        className="flex-1 px-3 py-1 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-hidden"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1 text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-lg"
                      >
                        Save
                      </button>
                    </form>
                  ) : (
                    <button
                      onClick={() => setShowAddSubtask(true)}
                      className="flex items-center gap-1.5 px-2 py-1 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-medium"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Subtasks</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Subtasks / Activity & Comments (matching Figma page 6) */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-semibold text-neutral-900 dark:text-white">
                Subtasks
              </h3>

              {/* Existing Comments Card */}
              <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 space-y-3 bg-white dark:bg-neutral-900 shadow-2xs">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar name="Ankit Dutta" size="sm" />
                    <div>
                      <div className="text-xs font-bold text-neutral-900 dark:text-white">
                        Ankit Dutta
                      </div>
                      <div className="text-[10px] text-neutral-400">just now</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-neutral-400">
                    <Smile className="w-3.5 h-3.5" />
                    <MoreHorizontal className="w-3.5 h-3.5" />
                  </div>
                </div>

                <p className="text-xs text-neutral-800 dark:text-neutral-200 pl-8">
                  dsds
                </p>

                {/* Leave a reply input */}
                <form onSubmit={handleAddReply} className="flex items-center gap-2 pt-2 pl-8">
                  <Avatar name="Dexter" size="xs" />
                  <div className="flex-1 relative flex items-center">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Leave a reply..."
                      className="w-full pr-14 pl-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/60 focus:outline-hidden"
                    />
                    <div className="absolute right-2 flex items-center gap-1 text-neutral-400">
                      <Paperclip className="w-3.5 h-3.5 cursor-pointer hover:text-neutral-600" />
                      <button type="submit" className="hover:text-neutral-900 dark:hover:text-white">
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Add a comment bottom bar */}
              <form onSubmit={handleAddComment} className="relative flex items-center">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full pr-14 pl-3.5 py-2.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-hidden shadow-2xs"
                />
                <div className="absolute right-3 flex items-center gap-2 text-neutral-400">
                  <Paperclip className="w-4 h-4 cursor-pointer hover:text-neutral-600" />
                  <button type="submit" className="hover:text-neutral-900 dark:hover:text-white">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Sidebar Column (~30% -> 4 of 12 cols on desktop) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Details Panel */}
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 bg-white dark:bg-neutral-900 shadow-2xs space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-neutral-900 dark:text-white">
                <span>▾ Details</span>
                <div className="flex items-center gap-1.5 text-neutral-400">
                  <Plus className="w-3.5 h-3.5 cursor-pointer hover:text-neutral-600" />
                  <MoreHorizontal className="w-3.5 h-3.5 cursor-pointer hover:text-neutral-600" />
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">Status</span>
                <select
                  value={task.status || 'TO_DO'}
                  onChange={(e) => handleUpdateStatus(e.target.value)}
                  className="px-2 py-1 text-xs rounded-md border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium focus:outline-hidden"
                >
                  <option value="TO_DO">Backlog</option>
                  <option value="DOING">Doing</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="ON_HOLD">On Hold</option>
                </select>
              </div>

              {/* Priority Dropdown (matching Figma page 6) */}
              <div className="flex items-center justify-between text-xs relative">
                <span className="text-neutral-400">Priority</span>
                <button
                  type="button"
                  onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors font-medium text-xs"
                >
                  <PriorityBadge priority={task.priority || 'HIGH'} />
                  <ChevronRight className="w-3 h-3 text-neutral-400 rotate-90" />
                </button>

                {showPriorityDropdown && (
                  <div className="absolute right-0 top-8 w-44 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl rounded-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="text-[10px] font-semibold text-neutral-400 px-2 py-1">Priority</div>
                    {priorities.map((p) => (
                      <button
                        key={p.key}
                        onClick={() => handleUpdatePriority(p.key)}
                        className="w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-left"
                      >
                        <div className="flex items-center gap-2">
                          <PrioritySignalIcon priority={p.key} />
                          <span>{p.label}</span>
                        </div>
                        {(task.priority || 'HIGH').toUpperCase() === p.key && (
                          <span className="font-bold">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Members */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">Members</span>
                <button className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-300 font-medium hover:text-neutral-900">
                  <UserPlus className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Add members</span>
                </button>
              </div>

              {/* Dates with Calendar Popover (matching Figma page 8) */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">Dates</span>
                <DatePickerPopover
                  value={task.dueDate || '12 Sep 2026'}
                  onChange={handleUpdateDate}
                />
              </div>

              {/* Labels */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">Labels</span>
                <span className="text-neutral-600 dark:text-neutral-400">-</span>
              </div>

              {/* Teams */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">Teams</span>
                <span className="text-neutral-600 dark:text-neutral-400">-</span>
              </div>

              {/* Reporter */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">Reporter</span>
                <div className="flex items-center gap-1.5">
                  <Avatar name={task.reporter?.name || 'Dexter'} size="xs" />
                  <span className="font-medium text-neutral-900 dark:text-white">
                    {task.reporter?.name || 'Dexter'}
                  </span>
                </div>
              </div>
            </div>

            {/* Updates Panel (matching Figma page 6) */}
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 bg-white dark:bg-neutral-900 shadow-2xs space-y-3">
              <div className="text-xs font-bold text-neutral-900 dark:text-white">
                ▾ Updates
              </div>

              <div className="space-y-2.5">
                <div className="flex items-start gap-2 text-xs">
                  <PrioritySignalIcon priority="URGENT" className="mt-0.5" />
                  <div>
                    <span className="font-semibold text-neutral-900 dark:text-white">You </span>
                    <span className="text-neutral-500">changed priority from No priority to Urgent</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-xs">
                  <Avatar name="Dexter" size="xs" className="mt-0.5" />
                  <div>
                    <span className="font-semibold text-neutral-900 dark:text-white">You </span>
                    <span className="text-neutral-500">posted an update · Aug 2026</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
