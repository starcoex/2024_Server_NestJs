import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { Order } from '../entities/order.entity';
import { CoreOutput } from 'src/common/dto/output.dto';

@InputType()
export class AllOrdersInput extends PickType(Order, ['status'], InputType) {}

@ObjectType()
export class AllOrdersOutput extends CoreOutput {
  @Field(() => [Order], { nullable: true })
  orders?: Order[];
}
