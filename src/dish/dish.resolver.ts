import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Dish } from './entities/dish.entity';
import { DishService } from './dish.service';
import { CreaetDishOutput, CreateDishInput } from './dto/creaet-dish.dto';
import { Role } from 'src/auth/auth-role.decorator';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { AllDishOutput } from './dto/all-dish.dto';
import { EditDishInput, EditDishOutput } from './dto/edit-dish.dto';
import { DeleteDishInput, DeleteDishOutput } from './dto/delete-dish.dto';

@Resolver(() => Dish)
export class DishResolver {
  constructor(
    private readonly dishService: DishService,
    private readonly prisma: PrismaService,
  ) {}

  @Mutation(() => CreaetDishOutput)
  @Role(['Owner'])
  createDish(
    @Args('input') createDishInput: CreateDishInput,
    @AuthUser() user: User,
  ): Promise<CreaetDishOutput> {
    return this.dishService.createDish(createDishInput, user.id);
  }

  @Mutation(() => EditDishOutput)
  @Role(['Owner'])
  editDish(
    @AuthUser() user: User,
    @Args('input') editDishInput: EditDishInput,
  ): Promise<EditDishOutput> {
    return this.dishService.editDish(editDishInput, user.id);
  }

  @Mutation(() => DeleteDishOutput)
  @Role(['Owner'])
  deleteDish(
    @AuthUser() user: User,
    @Args('input') deleteDishInput: DeleteDishInput,
  ): Promise<DeleteDishOutput> {
    return this.dishService.deleteDish(deleteDishInput, user.id);
  }

  @Query(() => AllDishOutput)
  @Role(['Any'])
  allDish() {
    return this.dishService.allDish();
  }
}
