import { Field, ObjectType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
export class Address extends CoreEntity {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  city?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  lat?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  long?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  street?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  pincode?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  state?: string;

  @Field(() => User, { nullable: true })
  user?: User;
}
