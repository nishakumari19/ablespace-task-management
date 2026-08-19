import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task, TaskSchema } from '../schemas/task.schema';
import { Label, LabelSchema } from '../schemas/label.schema';
import { Comment, CommentSchema } from '../schemas/comment.schema';
import { ActivityLog, ActivityLogSchema } from '../schemas/activity-log.schema';
import { Workspace, WorkspaceSchema } from '../schemas/workspace.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
      { name: Label.name, schema: LabelSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: ActivityLog.name, schema: ActivityLogSchema },
      { name: Workspace.name, schema: WorkspaceSchema },
    ]),
  ],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
