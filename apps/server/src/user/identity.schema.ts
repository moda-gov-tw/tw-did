import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, SchemaTypes } from 'mongoose';

export type IdentityDocument = HydratedDocument<Identity>;

@Schema()
export class Identity {
  @Prop()
  ethereumAccount: string;

  @Prop()
  semaphoreCommitment: string;

  @Prop({ required: true, default: false })
  revoked: boolean;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  user: ObjectId;
}

export const IdentitySchema = SchemaFactory.createForClass(Identity);
