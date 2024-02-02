import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { Order } from '../entities/order.entity';
import { CoreOutput } from 'src/common/dto/output.dto';

@InputType()
export class TakeOrderInput extends PickType(Order, ['id'], InputType) {}

@ObjectType()
export class TakeOrderOutput extends CoreOutput {}
