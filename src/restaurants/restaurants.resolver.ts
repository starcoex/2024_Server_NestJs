import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { RestaurantsService } from './restaurants.service';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dto/create-restaurant.dto';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/auth/auth-role.decorator';
import {
  EditRestaurantInput,
  EditRestaurantOutput,
} from './dto/edit-restaurant.dto';
import {
  DeleteRestaurantInput,
  DeleteRestaurantOutput,
} from './dto/delete-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
import { ConfigService } from '@nestjs/config';
import {
  AllRestaurantOutput,
  AllRestaurantInput,
} from './dto/all-restaurant.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Category } from 'src/category/entities/category.entity';
import {
  OneRestaurantInput,
  OneRestaurantOutput,
} from './dto/one-restaurant.dto';
import {
  SearchRestaurantOutput,
  SerachRestaurantInput,
} from './dto/search-restaurant.dto';
import { MyRestaurantInput, MyRestaurantOutput } from './dto/my-restaurant.dto';
import { MyRestaurantsOutput } from './dto/my-restaurants.dto';
import { Dish } from 'src/dish/entities/dish.entity';
import { PrismaClient, Prisma } from '@prisma/client';

@Resolver(() => Restaurant)
export class RestaurantsResolver {
  constructor(
    private readonly restaurantsService: RestaurantsService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  @Mutation(() => CreateRestaurantOutput)
  @Role(['Owner'])
  createRestaurantt(
    @AuthUser() user: User,
    @Args('input') createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    return this.restaurantsService.createRestaurant(
      createRestaurantInput,
      user.id,
    );
  }

  @Mutation(() => EditRestaurantOutput)
  @Role(['Owner'])
  editRestaurant(
    @Args('input') editRestaurantInput: EditRestaurantInput,
    @AuthUser() user: User,
  ): Promise<EditRestaurantOutput> {
    return this.restaurantsService.editRestaurant(editRestaurantInput, user.id);
  }

  @Mutation(() => DeleteRestaurantOutput)
  @Role(['Owner'])
  deleteRestaurant(
    @Args('input') deleteRestaurantInput: DeleteRestaurantInput,
    @AuthUser() user: User,
  ): Promise<DeleteRestaurantOutput> {
    return this.restaurantsService.deleteRestaurant(
      deleteRestaurantInput,
      user.id,
    );
  }

  @Query(() => AllRestaurantOutput)
  allRestaurnats(
    @Args('input') seeRestaurantInput: AllRestaurantInput,
  ): Promise<AllRestaurantOutput> {
    return this.restaurantsService.allRestaurnats(seeRestaurantInput);
  }

  @Query(() => MyRestaurantOutput)
  @Role(['Owner'])
  myRestaurant(
    @Args('input') myRestaurantInput: MyRestaurantInput,
  ): Promise<MyRestaurantOutput> {
    return this.restaurantsService.myRestaurant(myRestaurantInput);
  }

  @Query(() => MyRestaurantsOutput)
  @Role(['Owner'])
  myRestaurants(): Promise<MyRestaurantOutput> {
    return this.restaurantsService.myRestaurants();
  }

  @ResolveField('totalPages', () => Int)
  async totalPages(@Parent() restaurant: Restaurant) {
    const totalPages = await this.prisma.restaurant.count({
      where: { name: restaurant.name },
    });
    return Math.ceil(
      totalPages / Number(this.configService.get('PAGINATION_NUMBER')),
    );
  }

  @ResolveField('totalResults', () => Int)
  async totalResults(@Parent() restaurant: Restaurant) {
    const totalResults = await this.prisma.restaurant.count({
      where: { name: restaurant.name },
    });
    return totalResults;
  }

  @ResolveField('category', () => [Category])
  async category(@Parent() restaurant: Restaurant) {
    const newRestaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurant.id },
    });
    const categories = await this.prisma.category.findFirst({
      where: { id: newRestaurant.categoryId },
    });
    return categories;
  }

  @ResolveField('user', () => [User])
  async user(@Parent() restaurant: Restaurant) {
    const newRestaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurant.id },
    });
    const users = await this.prisma.user.findFirst({
      where: { id: newRestaurant.userId },
    });
    return users;
  }

  @ResolveField('menu', () => [Dish])
  async dish(@Parent() restaurant: Restaurant) {
    const dish = await this.prisma.dish.findMany({
      where: {
        restaurantId: restaurant.id,
        dishOptions: {
          array_contains: [] as Prisma.JsonArray,
        },
      },
    });
    return dish as [];
  }

  @Query(() => OneRestaurantOutput)
  findRestaurantById(
    @Args('input') oneRestaurantInput: OneRestaurantInput,
  ): Promise<OneRestaurantOutput> {
    return this.restaurantsService.findRestaurantById(oneRestaurantInput);
  }

  @Query(() => SearchRestaurantOutput)
  searchRestaurant(
    @Args('input') serachRestaurantInput: SerachRestaurantInput,
  ): Promise<SearchRestaurantOutput> {
    return this.restaurantsService.searchRestaurant(serachRestaurantInput);
  }
}
