import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { Address } from 'src/address/entitles/address.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Profile } from 'src/profile/entitles/profile.entity';

export enum UserRole {
  Client = 'Client',
  Owner = 'Owner',
  Delivery = 'Delivery',
}

registerEnumType(UserRole, {
  name: 'UserRole',
});

@ObjectType()
export class User extends CoreEntity {
  @Field(() => String)
  userName?: string;

  @Field(() => String)
  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @Field(() => String)
  @IsNotEmpty({ message: 'Password is required.' })
  password: string;

  @Field(() => UserRole)
  @IsEnum(UserRole)
  role: UserRole;

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  emailVerified?: boolean;

  // @Field(() => String, { nullable: true })
  // socialAccessToken?: string;

  @Field(() => [Address], { nullable: true })
  address?: Address[];

  @Field(() => Profile, { nullable: true })
  profile?: Profile;

  @Field(() => [Order], { nullable: true })
  customerUser?: Order[];

  @Field(() => [Order], { nullable: true })
  driverUser?: Order[];
}
