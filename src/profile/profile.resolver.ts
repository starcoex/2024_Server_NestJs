import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProfileService } from './profile.service';
import {
  CreateProfileFileInput,
  CreateProfileInput,
  CreateProfileOutput,
} from './dto/profile-create.dto';
import {
  GetIdPorofileInput,
  GetIdProfileOutput,
} from './dto/profile-getId-dto';
import {
  EditProfileFileInput,
  EditProfileInput,
  EditProfileOutput,
} from './dto/profile-edit.dto';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/auth/auth-role.decorator';

@Resolver()
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @Mutation(() => CreateProfileOutput)
  @Role(['Client'])
  createProfile(
    @Args() createProfileFileInput: CreateProfileFileInput,
    @Args('input') input: CreateProfileInput,
    @AuthUser() user: User,
  ): Promise<CreateProfileOutput> {
    return this.profileService.createProfile(
      input,
      createProfileFileInput,
      user.id,
    );
  }

  @Mutation(() => EditProfileOutput)
  @Role(['Client'])
  editProfile(
    @AuthUser() user: User,
    @Args() editProfileFileInput: EditProfileFileInput,
    @Args('input') input: EditProfileInput,
  ): Promise<EditProfileOutput> {
    return this.profileService.editProfile(
      input,
      editProfileFileInput,
      user.id,
    );
  }

  @Query(() => GetIdProfileOutput)
  getProfileById(
    @Args('input') input: GetIdPorofileInput,
  ): Promise<GetIdProfileOutput> {
    return this.profileService.getProfileById(input);
  }
}
