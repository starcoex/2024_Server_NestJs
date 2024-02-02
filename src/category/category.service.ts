import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AllCategoryOutput } from './dto/all-category.dto';
import { OneCategoryInput, OneCategoryOutput } from './dto/one-category.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CategoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async allCategories(): Promise<AllCategoryOutput> {
    try {
      const categories = await this.prisma.category.findMany({});
      return {
        ok: true,
        categories: categories as [],
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Catogory not found.',
      };
    }
  }

  async findCategoryBySlug(
    oneCategoryInput: OneCategoryInput,
  ): Promise<OneCategoryOutput> {
    try {
      const category = await this.prisma.category.findFirst({
        where: { slug: oneCategoryInput.slug },
        include: {
          restaurants: {
            take: Number(this.configService.get('PAGINATION_NUMBER')),
            skip:
              (oneCategoryInput.page - 1) *
              Number(this.configService.get('PAGINATION_NUMBER')),
          },
        },
      });

      if (!category) {
        return {
          ok: false,
          error: 'Category not found',
        };
      }
      const totalPages = await this.prisma.category.count({
        where: { slug: oneCategoryInput.slug },
      });
      const totalResults = await this.prisma.category.count({
        where: { slug: oneCategoryInput.slug },
      });
      return {
        ok: true,
        category,
        totalResults,
        totalPages: Math.ceil(
          totalPages / Number(this.configService.get('PAGINATION_NUMBER')),
        ),
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not load category',
      };
    }
  }
}
