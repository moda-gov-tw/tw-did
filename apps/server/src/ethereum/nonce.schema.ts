import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type NonceDocument = HydratedDocument<Nonce>;

@Schema()
export class Nonce {
  @Prop({ required: true, unique: true })
  value: string;
}

export const NonceSchema = SchemaFactory.createForClass(Nonce);
