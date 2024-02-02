import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AddressService } from './address.service';
import {
  CreateAddressInput,
  CreateAddressOutput,
} from './dto/address-create.dto';
import { AllAddressInput, AllAddressOutput } from './dto/address-all.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { EditAddressInput, EditAddressOutput } from './dto/address-edit.dto';
import { Role } from 'src/auth/auth-role.decorator';

@Resolver()
export class AddressResolver {
  constructor(
    private readonly addressService: AddressService,
    private readonly prisma: PrismaService,
  ) {}

  @Mutation(() => CreateAddressOutput)
  @Role(['Client'])
  createUserAddress(
    @Args('input') createAddressInput: CreateAddressInput,
    @AuthUser() user: User,
  ): Promise<CreateAddressOutput> {
    return this.addressService.createUserAddress(createAddressInput, user.id);
  }

  @Mutation(() => EditAddressOutput)
  @Role(['Client'])
  editAddress(
    @Args('input') editAddressInput: EditAddressInput,
    @AuthUser() user: User,
  ): Promise<EditAddressOutput> {
    return this.addressService.editAddress(editAddressInput, user.id);
  }

  @Query(() => AllAddressOutput)
  @Role(['Client'])
  allAddress(
    @Args() input: AllAddressInput,
    @AuthUser() user: User,
  ): Promise<AllAddressOutput> {
    return this.addressService.allAddress(input, user.id);
  }
}
