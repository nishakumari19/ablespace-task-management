import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProjectDocument = Project & Document;

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ default: 'MEDIUM' })
  priority: string; // URGENT, HIGH, MEDIUM, LOW, NO_PRIORITY

  @Prop()
  dueDate?: string;

  @Prop({ type: Types.ObjectId, ref: 'Workspace', required: true })
  workspaceId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  leadId?: Types.ObjectId;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
