import { InputType, ObjectType, PartialType, PickType } from '@nestjs/graphql';
import { Order } from '../entities/order.entity';
import { CoreOutput } from 'src/common/dto/output.dto';

@InputType()
export class EditOrderInput extends PartialType(
  PickType(Order, ['id', 'status'], InputType),
) {}

@ObjectType()
export class EditOrderOutput extends CoreOutput {}
