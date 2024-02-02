import { Injectable } from '@nestjs/common';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dto/create-restaurant.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AllRestaurantInput,
  AllRestaurantOutput,
} from './dto/all-restaurant.dto';
import {
  EditRestaurantInput,
  EditRestaurantOutput,
} from './dto/edit-restaurant.dto';
import {
  DeleteRestaurantInput,
  DeleteRestaurantOutput,
} from './dto/delete-restaurant.dto';
import { ConfigService } from '@nestjs/config';
import {
  SearchRestaurantOutput,
  SerachRestaurantInput,
} from './dto/search-restaurant.dto';
import {
  OneRestaurantInput,
  OneRestaurantOutput,
} from './dto/one-restaurant.dto';
import { MyRestaurantInput, MyRestaurantOutput } from './dto/my-restaurant.dto';
import { MyRestaurantsOutput } from './dto/my-restaurants.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}
  async createRestaurant(
    createRestaurantInput: CreateRestaurantInput,
    userId: number,
  ): Promise<CreateRestaurantOutput> {
    const categoryName = createRestaurantInput.categoryName
      .trim()
      .toLowerCase();
    const categorySlug = categoryName.replace(/ /g, '-');
    const restaurant = await this.prisma.restaurant.create({
      data: {
        name: createRestaurantInput.name,
        address: createRestaurantInput.address,
        coverImg: createRestaurantInput.coverImg,
        user: { connect: { id: userId } },
        category: {
          connectOrCreate: {
            where: { slug: categorySlug, name: categoryName },
            create: { slug: categorySlug, name: categoryName },
          },
        },
      },
    });
    try {
      return {
        ok: true,
        id: restaurant.id,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not create restaurant',
      };
    }
  }

  async editRestaurant(
    editRestaurantInput: EditRestaurantInput,
    userId: number,
  ): Promise<EditRestaurantOutput> {
    try {
      const restaurant = await this.prisma.restaurant.findUnique({
        where: { id: editRestaurantInput.id, user: { id: userId } },
      });
      if (!restaurant) {
        return {
          ok: false,
          error: 'Restaurant not found',
        };
      }
      if (userId !== restaurant.userId) {
        return {
          ok: false,
          error: "You can't edit a restaurant that you don't own",
        };
      }
      if (editRestaurantInput.categoryName) {
        const categoryName = editRestaurantInput.categoryName
          .trim()
          .toLowerCase();
        const categorySlug = categoryName.replace(/ /g, '-');
        await this.prisma.restaurant.update({
          where: { id: restaurant.id },
          data: {
            name: editRestaurantInput.name,
            address: editRestaurantInput.address,
            coverImg: editRestaurantInput.coverImg,
            category: {
              update: {
                where: { id: restaurant.categoryId },
                data: {
                  name: categoryName,
                  slug: categorySlug,
                },
              },
            },
          },
        });
      }
      return {
        ok: true,
        id: restaurant.id,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not edit Restaurant',
      };
    }
  }

  async deleteRestaurant(
    delteRestaurantInput: DeleteRestaurantInput,
    userId: number,
  ): Promise<DeleteRestaurantOutput> {
    try {
      const restaurant = await this.prisma.restaurant.findUnique({
        where: { id: delteRestaurantInput.id },
      });
      if (restaurant.userId !== userId) {
        return {
          ok: false,
          error: "You can't delete a restaurant that you don't own",
        };
      }
      await this.prisma.restaurant.delete({ where: { id: restaurant.id } });
      return {
        ok: true,
        id: restaurant.id,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'could not delete restaurant',
      };
    }
  }

  async allRestaurnats(
    seeRestaurantInput: AllRestaurantInput,
  ): Promise<AllRestaurantOutput> {
    try {
      const restaurants = await this.prisma.restaurant.findMany({
        take: Number(this.configService.get('PAGINATION_NUMBER')),
        skip:
          (seeRestaurantInput.page - 1) *
          Number(this.configService.get('PAGINATION_NUMBER')),
      });
      const totalPages = await this.prisma.restaurant.count({
        where: { name: seeRestaurantInput.name },
      });
      const totalResults = await this.prisma.restaurant.count({
        where: { name: seeRestaurantInput.name },
      });
      return {
        ok: true,
        totalResults,
        totalPages: Math.ceil(
          totalPages / Number(this.configService.get('PAGINATION_NUMBER')),
        ),
        restaurants: restaurants as [],
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not load restaurants',
      };
    }
  }

  async findRestaurantById(
    oneRestaurantInput: OneRestaurantInput,
  ): Promise<OneRestaurantOutput> {
    try {
      const restaurant = await this.prisma.restaurant.findFirst({
        where: { id: oneRestaurantInput.id },
        include: { menu: true },
      });
      if (!restaurant) {
        return {
          ok: false,
          error: 'restaurant not found.',
        };
      }
      return {
        ok: true,
        id: restaurant.id,
        restaurant,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not find restaurant',
      };
    }
  }

  async searchRestaurant(
    serachRestaurantInput: SerachRestaurantInput,
  ): Promise<SearchRestaurantOutput> {
    try {
      const restaurants = await this.prisma.restaurant.findMany({
        where: {
          name: {
            startsWith: serachRestaurantInput.query.toLocaleLowerCase(),
            // mode: 'insensitive',
          },
        },
        take: Number(this.configService.get('PAGINATION_NUMBER')),
        skip:
          (serachRestaurantInput.page - 1) *
          Number(this.configService.get('PAGINATION_NUMBER')),
        orderBy: {
          name: 'desc',
        },
      });
      const totalPages = await this.prisma.restaurant.count({
        where: { name: serachRestaurantInput.name },
      });
      const totalResults = await this.prisma.restaurant.count({
        where: { name: serachRestaurantInput.name },
      });
      return {
        ok: true,
        restaurants,
        totalResults,
        totalPages: Math.ceil(
          totalPages / Number(this.configService.get('PAGINATION_NUMBER')),
        ),
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Searching no Restaurant',
      };
    }
  }

  async myRestaurant(
    myRestaurantInput: MyRestaurantInput,
  ): Promise<MyRestaurantOutput> {
    try {
      const restaurant = await this.prisma.restaurant.findUnique({
        where: { id: myRestaurantInput.id },
      });
      return {
        ok: true,
        id: restaurant.id,
        restaurant,
      };
    } catch (error) {}
  }

  async myRestaurants(): Promise<MyRestaurantsOutput> {
    try {
      const restaruants = await this.prisma.restaurant.findMany({
        include: { user: true },
      });
      return {
        ok: true,
        restaurants: restaruants as [],
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not find restaurants.',
      };
    }
  }
}
