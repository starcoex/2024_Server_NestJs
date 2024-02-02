import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { Mailer } from '../entities/mailer.entity';
import { CoreOutput } from 'src/common/dto/output.dto';

@InputType()
export class SendMailerInput extends PartialType(
  PickType(Mailer, ['to', 'subject'], InputType),
) {}

@ObjectType()
export class SendMailerOutput extends CoreOutput {
  @Field(() => Mailer, { nullable: true })
  mailer?: Mailer;
}
