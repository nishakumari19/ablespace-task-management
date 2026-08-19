import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LabelDocument = Label & Document;

@Schema({ timestamps: true })
export class Label {
  @Prop({ required: true })
  name: string;

  @Prop({ default: 'bg-gray-100 text-gray-700' })
  color?: string;

  @Prop({ type: Types.ObjectId, ref: 'Workspace', required: true })
  workspaceId: Types.ObjectId;
}

export const LabelSchema = SchemaFactory.createForClass(Label);
