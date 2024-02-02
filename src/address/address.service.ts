import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AllAddressInput, AllAddressOutput } from './dto/address-all.dto';
import { EditAddressInput, EditAddressOutput } from './dto/address-edit.dto';
import {
  CreateAddressInput,
  CreateAddressOutput,
} from './dto/address-create.dto';
import { Address } from './entitles/address.entity';

@Injectable()
export class AddressService {
  constructor(private readonly prisma: PrismaService) {}

  async createUserAddress(
    createUserAddress: CreateAddressInput,
    userId: number,
  ): Promise<CreateAddressOutput> {
    try {
      const address = await this.prisma.address.create({
        data: {
          ...createUserAddress,
          user: { connect: { id: userId } },
        },
        include: { user: true },
      });
      return {
        ok: true,
        id: address.id,
        address: address as Address,
      };
    } catch (error) {
      return {
        ok: false,
      };
    }
  }

  async editAddress(
    editAddressInput: EditAddressInput,
    userId: number,
  ): Promise<EditAddressOutput> {
    try {
      const userAddress = await this.prisma.address.findUnique({
        where: { id: editAddressInput.id },
      });
      if (!userAddress) {
        return {
          ok: false,
          error: 'User Address not found.',
        };
      }
      if (userAddress.userId !== userId) {
        return {
          ok: false,
          error: "You can't edit a address that you don't own",
        };
      }
      const addressUpdate = await this.prisma.address.update({
        where: {
          id: userAddress.id,
          user: { id: userAddress.userId },
        },
        data: {
          ...editAddressInput,
        },
      });
      return {
        ok: true,
        address: addressUpdate,
      };
    } catch (error) {}
  }

  async allAddress(
    { page }: AllAddressInput,
    userId: number,
  ): Promise<AllAddressOutput> {
    try {
      const address = await this.prisma.address.findMany({
        take: 5,
        skip: (page - 1) * 5,
        include: { user: true },
      });
      return {
        ok: true,
        address: address as [],
      };
    } catch (error) {
      return {
        ok: false,
      };
    }
  }
}
