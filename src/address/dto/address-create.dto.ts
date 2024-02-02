import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { Address } from '../entitles/address.entity';
import { CoreOutput } from 'src/common/dto/output.dto';

@InputType()
export class CreateAddressInput extends PickType(
  Address,
  ['city', 'lat', 'long', 'name', 'pincode', 'state', 'street'],
  InputType,
) {}

@ObjectType()
export class CreateAddressOutput extends CoreOutput {
  @Field(() => Address, { nullable: true })
  address?: Address;
}
