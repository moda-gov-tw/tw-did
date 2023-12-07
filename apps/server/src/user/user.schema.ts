import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Identity } from './identity.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  hashedNationalId: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Identity' })
  currentIdentity: Identity;
}

export const UserSchema = SchemaFactory.createForClass(User);
