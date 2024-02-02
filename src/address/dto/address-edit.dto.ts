import {
  Field,
  InputType,
  ObjectType,
  OmitType,
  PartialType,
} from '@nestjs/graphql';
import { Address } from '../entitles/address.entity';
import { CoreOutput } from 'src/common/dto/output.dto';

@InputType()
export class EditAddressInput extends PartialType(
  OmitType(Address, ['user'], InputType),
) {}

@ObjectType()
export class EditAddressOutput extends CoreOutput {
  @Field(() => Address, { nullable: true })
  address?: Address;
}
