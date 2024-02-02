import { Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Category } from '../entities/category.entity';

@ObjectType()
export class AllCategoryOutput extends CoreOutput {
  @Field(() => [Category], { nullable: true })
  categories?: Category[];
}
