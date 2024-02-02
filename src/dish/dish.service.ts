import { PrismaClient, Prisma } from '@prisma/client';

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreaetDishOutput, CreateDishInput } from './dto/creaet-dish.dto';
import { EditDishInput, EditDishOutput } from './dto/edit-dish.dto';
import { DeleteDishInput } from './dto/delete-dish.dto';

@Injectable()
export class DishService {
  constructor(private readonly prisma: PrismaService) {}

  async createDish(
    createDishInput: CreateDishInput,
    userId: number,
  ): Promise<CreaetDishOutput> {
    const [options] = createDishInput.options;
    const [choice] = options.choice;
    try {
      const restaurant = await this.prisma.restaurant.findUnique({
        where: { id: createDishInput.restaurantId },
      });
      if (!restaurant) {
        return {
          ok: false,
          error: 'Restaurant not found.',
        };
      }
      if (userId !== restaurant.userId) {
        return {
          ok: false,
          error: "You cant't do that.",
        };
      }

      const dish = await this.prisma.dish.create({
        data: {
          name: createDishInput.name,
          price: createDishInput.price,
          description: createDishInput.description,
          restaurant: { connect: { id: restaurant.id } },
          dishOptions: [
            { name: options.name },
            { extra: options.extra },
            { choices: [{ name: choice.name }, { extra: choice.extra }] },
          ],
          // dishOptions: createDishInput.options as unknown as Prisma.JsonArray,
        },
      });

      return {
        ok: true,
        id: dish.id,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not create dish',
      };
    }
  }

  async editDish(
    editDishInput: EditDishInput,
    userId: number,
  ): Promise<EditDishOutput> {
    try {
      const [options] = editDishInput.options;
      const [choice] = options.choice;
      const dish = await this.prisma.dish.findUnique({
        where: { id: editDishInput.id },
        include: { restaurant: true },
      });
      if (!dish) {
        return {
          ok: false,
          error: 'Dish not found.',
        };
      }
      if (userId !== dish.restaurant.userId) {
        return {
          ok: false,
          error: "You can't do that.",
        };
      }
      const editDish = await this.prisma.dish.update({
        where: { id: editDishInput.id },
        data: {
          name: editDishInput.name,
          price: editDishInput.price,
          description: editDishInput.description,
          dishOptions: [
            { name: options.name },
            { extra: options.extra },
            { choices: [{ name: choice.name }, { extra: choice.extra }] },
          ],
        },
      });
      return {
        ok: true,
        id: editDish.id,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not find Dish',
      };
    }
  }

  async deleteDish(
    deleteDishInput: DeleteDishInput,
    userId: number,
  ): Promise<EditDishOutput> {
    try {
      const dish = await this.prisma.dish.findUnique({
        where: { id: deleteDishInput.id },
        include: { restaurant: true },
      });
      if (!dish) {
        return {
          ok: false,
          error: 'Dish not found.',
        };
      }
      if (userId !== dish.restaurant.userId) {
        return {
          ok: false,
          error: "You can't do that.",
        };
      }
      await this.prisma.dish.delete({ where: { id: deleteDishInput.id } });
      return {
        ok: true,
        id: dish.id,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not find Dish',
      };
    }
  }
  async allDish() {
    try {
      const dish = await this.prisma.dish.findMany({});
      return {
        ok: true,
        dish,
      };
    } catch (error) {}
  }
}
