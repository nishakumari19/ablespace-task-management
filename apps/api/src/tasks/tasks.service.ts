import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument } from '../schemas/task.schema';
import { Label, LabelDocument } from '../schemas/label.schema';
import { Comment, CommentDocument } from '../schemas/comment.schema';
import { ActivityLog, ActivityLogDocument } from '../schemas/activity-log.schema';
import { Workspace, WorkspaceDocument } from '../schemas/workspace.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @InjectModel(Label.name) private labelModel: Model<LabelDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(ActivityLog.name) private activityLogModel: Model<ActivityLogDocument>,
    @InjectModel(Workspace.name) private workspaceModel: Model<WorkspaceDocument>,
  ) {}

  async findAll(query: { search?: string; projectId?: string; status?: string; priority?: string }) {
    const filter: any = { parentTaskId: null };

    if (query.projectId && Types.ObjectId.isValid(query.projectId)) {
      filter.projectId = new Types.ObjectId(query.projectId);
    }

    if (query.status) {
      filter.status = query.status;
    }

    if (query.priority) {
      filter.priority = query.priority;
    }

    if (query.search) {
      filter.title = { $regex: query.search, $options: 'i' };
    }

    const tasks = await this.taskModel
      .find(filter)
      .populate('projectId', 'name')
      .populate('reporterId', 'name email avatar')
      .populate('assignees', 'name email avatar')
      .populate('labels', 'name color')
      .sort({ position: 1, createdAt: -1 });

    // Fetch subtasks for each task
    const result = [];
    for (const t of tasks) {
      const subtasks = await this.taskModel
        .find({ parentTaskId: t._id })
        .populate('assignees', 'name email avatar');

      result.push({
        id: t._id.toString(),
        title: t.title,
        description: t.description,
        status: t.status,
        priority: t.priority,
        dueDate: t.dueDate,
        project: t.projectId ? { id: (t.projectId as any)._id?.toString(), name: (t.projectId as any).name } : null,
        reporter: t.reporterId
          ? { id: (t.reporterId as any)._id?.toString(), name: (t.reporterId as any).name, avatar: (t.reporterId as any).avatar }
          : null,
        assignees: (t.assignees || []).map((u: any) => ({
          user: { id: u._id?.toString(), name: u.name, avatar: u.avatar },
        })),
        labels: (t.labels || []).map((l: any) => ({
          label: { id: l._id?.toString(), name: l.name, color: l.color },
        })),
        subtasks: subtasks.map((st) => ({
          id: st._id.toString(),
          title: st.title,
          status: st.status,
          priority: st.priority,
          dueDate: st.dueDate,
          assignees: (st.assignees || []).map((u: any) => ({
            user: { id: u._id?.toString(), name: u.name, avatar: u.avatar },
          })),
        })),
      });
    }

    return result;
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid Task ID');

    const t = await this.taskModel
      .findById(id)
      .populate('projectId', 'name')
      .populate('reporterId', 'name email avatar')
      .populate('assignees', 'name email avatar')
      .populate('labels', 'name color');

    if (!t) throw new NotFoundException('Task not found');

    const subtasks = await this.taskModel
      .find({ parentTaskId: t._id })
      .populate('assignees', 'name email avatar')
      .sort({ createdAt: 1 });

    const comments = await this.commentModel
      .find({ taskId: t._id })
      .populate('authorId', 'name avatar')
      .sort({ createdAt: -1 });

    const activityLogs = await this.activityLogModel
      .find({ taskId: t._id })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 });

    return {
      id: t._id.toString(),
      title: t.title,
      description: t.description,
      status: t.status,
      priority: t.priority,
      dueDate: t.dueDate,
      project: t.projectId ? { id: (t.projectId as any)._id?.toString(), name: (t.projectId as any).name } : null,
      reporter: t.reporterId
        ? { id: (t.reporterId as any)._id?.toString(), name: (t.reporterId as any).name, avatar: (t.reporterId as any).avatar }
        : null,
      assignees: (t.assignees || []).map((u: any) => ({
        user: { id: u._id?.toString(), name: u.name, avatar: u.avatar },
      })),
      labels: (t.labels || []).map((l: any) => ({
        label: { id: l._id?.toString(), name: l.name, color: l.color },
      })),
      subtasks: subtasks.map((st) => ({
        id: st._id.toString(),
        title: st.title,
        status: st.status,
        priority: st.priority,
        dueDate: st.dueDate,
        assignees: (st.assignees || []).map((u: any) => ({
          user: { id: u._id?.toString(), name: u.name, avatar: u.avatar },
        })),
      })),
      comments: comments.map((c) => ({
        id: c._id.toString(),
        content: c.content,
        author: c.authorId ? { name: (c.authorId as any).name, avatar: (c.authorId as any).avatar } : null,
        createdAt: (c as any).createdAt,
      })),
      activityLogs: activityLogs.map((log) => ({
        id: log._id.toString(),
        action: log.action,
        details: log.details,
        user: log.userId ? { name: (log.userId as any).name } : null,
        createdAt: (log as any).createdAt,
      })),
    };
  }

  async create(userId: string, dto: CreateTaskDto) {
    const workspace = await this.workspaceModel.findOne();
    if (!workspace) throw new NotFoundException('Workspace not found');

    const labelIds: Types.ObjectId[] = [];
    if (dto.labelNames && dto.labelNames.length > 0) {
      for (const name of dto.labelNames) {
        let label = await this.labelModel.findOne({ name, workspaceId: workspace._id });
        if (!label) {
          label = await this.labelModel.create({ name, workspaceId: workspace._id });
        }
        labelIds.push(label._id);
      }
    }

    const assigneeIds = dto.assigneeIds && dto.assigneeIds.length > 0
      ? dto.assigneeIds.filter(id => Types.ObjectId.isValid(id)).map(id => new Types.ObjectId(id))
      : [new Types.ObjectId(userId)];

    const task = await this.taskModel.create({
      title: dto.title,
      description: dto.description,
      status: dto.status || 'TO_DO',
      priority: dto.priority || 'MEDIUM',
      dueDate: dto.dueDate,
      projectId: dto.projectId && Types.ObjectId.isValid(dto.projectId) ? new Types.ObjectId(dto.projectId) : undefined,
      parentTaskId: dto.parentTaskId && Types.ObjectId.isValid(dto.parentTaskId) ? new Types.ObjectId(dto.parentTaskId) : undefined,
      reporterId: new Types.ObjectId(userId),
      workspaceId: workspace._id,
      assignees: assigneeIds,
      labels: labelIds,
    });

    await this.activityLogModel.create({
      taskId: task._id,
      userId: new Types.ObjectId(userId),
      action: 'Created Task',
      details: `Task "${task.title}" created.`,
    });

    return this.findOne(task._id.toString());
  }

  async update(id: string, userId: string, dto: UpdateTaskDto) {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid Task ID');

    const existingTask = await this.taskModel.findById(id);
    if (!existingTask) throw new NotFoundException('Task not found');

    const updateData: any = {};
    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.status !== undefined) updateData.status = dto.status;
    if (dto.priority !== undefined) updateData.priority = dto.priority;
    if (dto.dueDate !== undefined) updateData.dueDate = dto.dueDate;

    if (dto.projectId !== undefined) {
      updateData.projectId = dto.projectId && Types.ObjectId.isValid(dto.projectId) ? new Types.ObjectId(dto.projectId) : null;
    }

    if (dto.assigneeIds !== undefined) {
      updateData.assignees = dto.assigneeIds.filter(aId => Types.ObjectId.isValid(aId)).map(aId => new Types.ObjectId(aId));
    }

    await this.taskModel.findByIdAndUpdate(id, updateData);

    if (dto.priority && dto.priority !== existingTask.priority) {
      await this.activityLogModel.create({
        taskId: new Types.ObjectId(id),
        userId: new Types.ObjectId(userId),
        action: 'Priority Changed',
        details: `You changed priority from ${existingTask.priority} to ${dto.priority}`,
      });
    }

    if (dto.status && dto.status !== existingTask.status) {
      await this.activityLogModel.create({
        taskId: new Types.ObjectId(id),
        userId: new Types.ObjectId(userId),
        action: 'Status Changed',
        details: `You changed status to ${dto.status}`,
      });
    }

    return this.findOne(id);
  }

  async addComment(taskId: string, userId: string, content: string) {
    if (!Types.ObjectId.isValid(taskId)) throw new NotFoundException('Invalid Task ID');

    const comment = await this.commentModel.create({
      content,
      taskId: new Types.ObjectId(taskId),
      authorId: new Types.ObjectId(userId),
    });

    await this.activityLogModel.create({
      taskId: new Types.ObjectId(taskId),
      userId: new Types.ObjectId(userId),
      action: 'Comment Added',
      details: 'You posted an update',
    });

    const populated = await this.commentModel.findById(comment._id).populate('authorId', 'name avatar');
    return {
      id: populated._id.toString(),
      content: populated.content,
      author: populated.authorId ? { name: (populated.authorId as any).name, avatar: (populated.authorId as any).avatar } : null,
      createdAt: (populated as any).createdAt,
    };
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid Task ID');
    return this.taskModel.findByIdAndDelete(id);
  }
}
