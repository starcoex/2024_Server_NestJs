import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Address } from '../entitles/address.entity';
import { PaginationPageInput } from 'src/common/dto/pagination-page.dot';

@ArgsType()
export class AllAddressInput extends PaginationPageInput {}

@ObjectType()
export class AllAddressOutput extends CoreOutput {
  @Field(() => [Address], { nullable: true })
  address?: Address[];
}
