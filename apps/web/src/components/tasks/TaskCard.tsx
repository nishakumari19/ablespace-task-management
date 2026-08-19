'use client';

import React, { useState } from 'react';
import { MoreHorizontal, Calendar, Tag, GripVertical } from 'lucide-react';
import { PriorityIcon, PriorityType } from '../ui/PriorityIcon';
import { Avatar } from '../ui/Avatar';
import { FieldVisibility } from '../ui/FieldsDropdown';

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: string;
  assignees?: { user: { id: string; name: string; avatar?: string } }[];
  labels?: { label: { id: string; name: string; color?: string } }[];
  reporter?: { id: string; name: string; avatar?: string };
}

interface TaskCardProps {
  task: TaskItem;
  fields: FieldVisibility;
  onTaskClick: (task: TaskItem) => void;
  onUpdatePriority: (taskId: string, priority: string) => void;
}

export function TaskCard({ task, fields, onTaskClick, onUpdatePriority }: TaskCardProps) {
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);

  const priorities: { key: PriorityType; label: string }[] = [
    { key: 'URGENT', label: 'Urgent' },
    { key: 'HIGH', label: 'High' },
    { key: 'MEDIUM', label: 'Medium' },
    { key: 'LOW', label: 'Low' },
    { key: 'NO_PRIORITY', label: 'No Priority' },
  ];

  const assigneeName = task.assignees && task.assignees.length > 0 ? task.assignees[0].user.name : 'Admin';
  const assigneeAvatar = task.assignees && task.assignees.length > 0 ? task.assignees[0].user.avatar : undefined;

  return (
    <div
      onClick={() => onTaskClick(task)}
      className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 shadow-2xs hover:shadow-sm transition-all cursor-pointer relative space-y-2.5"
    >
      {/* Title & Options */}
      <div className="flex items-start justify-between gap-1.5">
        <h4 className="text-[13px] font-semibold text-neutral-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {task.title}
        </h4>

        <div className="relative flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
            className="p-0.5 rounded text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>

          {showPriorityDropdown && (
            <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl rounded-xl p-1 z-30">
              {priorities.map((p) => (
                <button
                  key={p.key}
                  onClick={() => {
                    onUpdatePriority(task.id, p.key);
                    setShowPriorityDropdown(false);
                  }}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg text-left"
                >
                  <PriorityIcon priority={p.key} />
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Assignee & Due Date Row (matching Figma page 2) */}
      <div className="flex items-center justify-between gap-2 text-xs pt-0.5">
        {fields.members && (
          <div className="flex items-center gap-1.5 min-w-0">
            <Avatar src={assigneeAvatar} name={assigneeName} size="xs" />
            <span className="text-[12px] font-normal text-neutral-800 dark:text-neutral-200 truncate">
              {assigneeName}
            </span>
          </div>
        )}

        {fields.dueDate && (
          <div className="flex items-center gap-1 text-[#ef4444] text-[11px] font-medium ml-auto flex-shrink-0">
            <Calendar className="w-3 h-3 stroke-[2]" />
            <span>{task.dueDate || '29 Jul'}</span>
          </div>
        )}
      </div>

      {fields.labels && (
        <div className="flex items-center flex-wrap gap-1 pt-0.5">
          {task.labels && task.labels.length > 0 ? (
            task.labels.map((l) => (
              <span
                key={l.label.id}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-normal bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
              >
                <Tag className="w-2.5 h-2.5 text-neutral-500 flex-shrink-0" />
                <span className="truncate">{l.label.name || 'Label'}</span>
              </span>
            ))
          ) : (
            <>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-normal bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                <Tag className="w-2.5 h-2.5 text-neutral-500 flex-shrink-0" />
                <span>Deployment</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-normal bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                <Tag className="w-2.5 h-2.5 text-neutral-500 flex-shrink-0" />
                <span>Deployment</span>
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
