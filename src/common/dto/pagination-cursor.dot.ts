import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from './output.dto';
import { Pagination } from '../entities/pagination.entity';

@InputType()
export class PaginationCursorInput extends PickType(
  Pagination,
  ['cursor'],
  InputType,
) {}

@ObjectType()
export class PaginationCursorOutput extends CoreOutput {}
