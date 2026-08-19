'use client';

import React, { useState } from 'react';
import { MoreHorizontal, Plus } from 'lucide-react';
import { PriorityBadge, PriorityIcon, PriorityType } from '../ui/PriorityIcon';
import { Avatar } from '../ui/Avatar';
import { TaskItem } from './TaskCard';
import { FieldVisibility } from '../ui/FieldsDropdown';

interface TaskRowProps {
  task: TaskItem;
  fields: FieldVisibility;
  onTaskClick: (task: TaskItem) => void;
  onUpdatePriority: (taskId: string, priority: string) => void;
  memberStyle?: 'avatar' | 'initials' | 'plus';
}

export function TaskRow({
  task,
  fields,
  onTaskClick,
  onUpdatePriority,
  memberStyle,
}: TaskRowProps) {
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);

  const priorities: { key: PriorityType; label: string }[] = [
    { key: 'URGENT', label: 'Urgent' },
    { key: 'HIGH', label: 'High' },
    { key: 'MEDIUM', label: 'Medium' },
    { key: 'LOW', label: 'Low' },
    { key: 'NO_PRIORITY', label: 'No Priority' },
  ];

  return (
    <tr
      onClick={() => onTaskClick(task)}
      className="border-b border-neutral-100 dark:border-neutral-800/80 hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors cursor-pointer text-xs"
    >
      {/* Task Name */}
      <td className="py-2.5 px-4 font-normal text-neutral-900 dark:text-white">
        {task.title}
      </td>

      {/* Priority */}
      {fields.priority && (
        <td className="py-2.5 px-4 relative" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
            className="hover:opacity-80 transition-opacity flex items-center"
          >
            <PriorityBadge priority={task.priority} />
          </button>

          {showPriorityDropdown && (
            <div className="absolute left-0 mt-1 w-36 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl rounded-xl p-1 z-30">
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
        </td>
      )}

      {/* Members (matching Figma page 4) */}
      {fields.members && (
        <td className="py-2.5 px-4">
          {memberStyle === 'plus' || (!task.assignees || task.assignees.length === 0) ? (
            <div className="w-5 h-5 rounded-full border border-dashed border-neutral-300 dark:border-neutral-600 flex items-center justify-center text-neutral-400">
              <Plus className="w-3 h-3" />
            </div>
          ) : memberStyle === 'initials' || task.assignees[0]?.user?.name === 'CN' ? (
            <div className="w-5 h-5 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 text-[10px] font-semibold flex items-center justify-center">
              CN
            </div>
          ) : (
            <Avatar
              src={task.assignees[0]?.user?.avatar}
              name={task.assignees[0]?.user?.name || 'Dexter'}
              size="xs"
            />
          )}
        </td>
      )}

      {/* Due Date */}
      {fields.dueDate && (
        <td className="py-2.5 px-4 text-neutral-600 dark:text-neutral-400 font-normal">
          {task.dueDate || '12 Sep 2026'}
        </td>
      )}

      {/* Actions */}
      <td className="py-2.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
        <button className="p-1 rounded text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800">
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>
      </td>
    </tr>
  );
}
