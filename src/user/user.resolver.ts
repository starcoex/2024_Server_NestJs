import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput, CreateUserOutput } from './dto/create-user.dto';
import { Profile } from 'src/profile/entitles/profile.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { Address } from 'src/address/entitles/address.entity';
import { LoginInput, LoginOutput } from './dto/login-user.dto';
import { ProfileUserInput, ProfileUserOutput } from './dto/profile-user.dto';
import { AuthUser } from 'src/auth/auth-user.decorator';
import {
  EditProfileUserInput,
  EditProfileUserOutput,
} from './dto/edit-profile-user.dto';
import {
  VerifyEmailInput,
  VerifyEmailOutput,
} from '../verification/dto/verity-email.dto';
import { Role } from 'src/auth/auth-role.decorator';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { SearchUserOutput, SerachUserInput } from './dto/search-user.dto';
import {
  PasswordResetUserInput,
  PasswordResetUserOutput,
} from './dto/password-reset-user.dto';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
  ) {}

  @Query(() => User)
  @Role(['Any'])
  me(@AuthUser() user: User) {
    return user;
  }

  @Query(() => ProfileUserOutput)
  @Role(['Any'])
  profileUser(
    @Args('input') profileUserInput: ProfileUserInput,
  ): Promise<ProfileUserOutput> {
    return this.userService.profileUser(profileUserInput);
  }

  @Mutation(() => EditProfileUserOutput)
  @Role(['Any'])
  editProfileUser(
    @Args('input') editProfileUserInput: EditProfileUserInput,
    @AuthUser() user: User,
  ): Promise<EditProfileUserOutput> {
    return this.userService.editProfileUser(editProfileUserInput, user.id);
  }

  @Mutation(() => CreateUserOutput)
  createUser(
    @Args('input') createUserInput: CreateUserInput,
  ): Promise<CreateUserOutput> {
    return this.userService.createUser(createUserInput);
  }

  @Mutation(() => LoginOutput)
  login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this.userService.login(loginInput);
  }

  @Mutation(() => VerifyEmailOutput)
  verifyEmail(
    @Args('input') verifyEmailInput: VerifyEmailInput,
  ): Promise<VerifyEmailOutput> {
    return this.userService.verityEmail(verifyEmailInput);
  }

  @Mutation(() => PasswordResetUserOutput)
  passwordResetUser(
    @Args('input') passwordResetUserInput: PasswordResetUserInput,
  ): Promise<PasswordResetUserOutput> {
    return this.userService.passwordResetUser(passwordResetUserInput);
  }

  @Query(() => SearchUserOutput)
  searchUser(
    @Args('input') serachUserInput: SerachUserInput,
  ): Promise<SearchUserOutput> {
    return this.userService.searchUser(serachUserInput);
  }

  @ResolveField('profile', () => Profile)
  profile(@Parent() user: User) {
    return this.prisma.user.findUnique({ where: { id: user.id } }).profile();
  }

  @ResolveField('address', () => Address)
  address(@Parent() user: User) {
    return this.prisma.user.findUnique({ where: { id: user.id } }).address();
  }

  @ResolveField('restaurants', () => [Restaurant])
  async restaurants() {
    const restaurants = await this.prisma.restaurant.findMany({});
    return restaurants as [];
  }
}
