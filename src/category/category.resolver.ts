import {
  Args,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { AllCategoryOutput } from './dto/all-category.dto';
import { User } from 'src/user/entities/user.entity';
import { OneCategoryOutput, OneCategoryInput } from './dto/one-category.dto';

import { ConfigService } from '@nestjs/config';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { PaginationPageInput } from 'src/common/dto/pagination-page.dot';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  @Query(() => AllCategoryOutput)
  allCategories(): Promise<AllCategoryOutput> {
    return this.categoryService.allCategories();
  }

  @Query(() => OneCategoryOutput)
  findCategoryBySlug(
    @Args('input') oneCategoryInput: OneCategoryInput,
  ): Promise<OneCategoryOutput> {
    return this.categoryService.findCategoryBySlug(oneCategoryInput);
  }

  @ResolveField('user', () => [User])
  async user() {
    const user = await this.prisma.user.findMany({});
    return user as [];
  }

  // @ResolveField('restaurants', () => [Restaurant])
  // async restaurants(@Args('input') paginationPageInput: PaginationPageInput) {
  //   const restaurants = await this.prisma.restaurant.findMany({
  //     take: Number(this.configService.get('PAGINATION_NUMBER')),
  //     skip:
  //       (paginationPageInput.page - 1) *
  //       Number(this.configService.get('PAGINATION_NUMBER')),
  //   });
  //   return restaurants as [];
  // }

  @ResolveField('restaurants', () => [Restaurant])
  async restaurants() {
    const restaurants = await this.prisma.restaurant.findMany({});
    return restaurants as [];
  }

  @ResolveField('restaurantCount', () => Int)
  async restaurantCount(@Parent() category: Category): Promise<number> {
    return await this.prisma.restaurant.count({
      where: { category: { id: category.id } },
    });
  }

  @ResolveField('totalPages', () => Int)
  async totalPages(@Parent() category: Category): Promise<number> {
    const totalResults = await this.prisma.restaurant.count({
      where: { category: { id: category.id } },
    });
    return Math.ceil(
      totalResults / Number(this.configService.get('PAGINATION_NUMBER')),
    );
  }
}
