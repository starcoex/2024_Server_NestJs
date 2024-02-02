import { Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Payment } from '../entities/payment.entity';

@ObjectType()
export class GetPaddlesOutPut extends CoreOutput {
  @Field(() => [Payment], { nullable: true })
  payments?: Payment[];
}
