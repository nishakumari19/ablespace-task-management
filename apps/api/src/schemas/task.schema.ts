import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ default: 'TO_DO' })
  status: string; // TO_DO, DOING, COMPLETED, ON_HOLD

  @Prop({ default: 'MEDIUM' })
  priority: string; // URGENT, HIGH, MEDIUM, LOW, NO_PRIORITY

  @Prop()
  dueDate?: string;

  @Prop({ type: Types.ObjectId, ref: 'Workspace', required: true })
  workspaceId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Project' })
  projectId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  reporterId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Task' })
  parentTaskId?: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  assignees: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Label' }], default: [] })
  labels: Types.ObjectId[];

  @Prop({ default: 0 })
  position: number;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
