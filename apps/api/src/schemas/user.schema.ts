import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ unique: true, sparse: true })
  username?: string;

  @Prop()
  title?: string;

  @Prop()
  avatar?: string;

  @Prop({ default: false })
  isGuest: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
