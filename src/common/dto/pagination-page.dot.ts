import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from './output.dto';
import { Pagination } from '../entities/pagination.entity';

@InputType()
export class PaginationPageInput extends PickType(
  Pagination,
  ['page'],
  InputType,
) {}

@ObjectType()
export class PaginationPageOutput extends CoreOutput {}
