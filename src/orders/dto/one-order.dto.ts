import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { Order } from '../entities/order.entity';
import { CoreOutput } from 'src/common/dto/output.dto';

@InputType()
export class OneOrderInput extends PickType(Order, ['id'], InputType) {}

@ObjectType()
export class OneOrderOutput extends CoreOutput {
  @Field(() => Order, { nullable: true })
  order?: Order;
}
