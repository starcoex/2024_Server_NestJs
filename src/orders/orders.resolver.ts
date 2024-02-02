import {
  Args,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { OrdersService } from '../orders/orders.service';
import { Order } from './entities/order.entity';
import { CreateOrderInput, CreateOrderOutput } from './dto/create-order.dto';
import { Role } from 'src/auth/auth-role.decorator';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { AllOrdersInput, AllOrdersOutput } from './dto/all-order.dto';
import { OneOrderInput, OneOrderOutput } from './dto/one-order.dto';
import { EditOrderInput, EditOrderOutput } from './dto/edit-order.dto';
import { Inject } from '@nestjs/common';
import {
  NEW_COOKED_ORDER,
  NEW_ORDER_UPDATE,
  NEW_PENDING_ORDER,
  PUB_SUB,
} from 'src/common/common.constants';
import { PubSub } from 'graphql-subscriptions';
import { OrderItem } from './entities/order-item.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { Dish } from 'src/dish/entities/dish.entity';
import { SubscriptionOrderUpdatesInput } from './dto/subscription-updates-order.dto';
import { TakeOrderInput, TakeOrderOutput } from './dto/take-order.dto';

@Resolver(() => Order)
export class OrdersResolver {
  constructor(
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
    private readonly ordersService: OrdersService,
    private readonly prisma: PrismaService,
  ) {}

  @Mutation(() => TakeOrderOutput)
  @Role(['Delivery'])
  takeOrder(
    @AuthUser() user: User,
    @Args('input') takeOrderInput: TakeOrderInput,
  ): Promise<TakeOrderOutput> {
    return this.ordersService.takeOrder(user, takeOrderInput);
  }

  @Mutation(() => CreateOrderOutput)
  @Role(['Client'])
  createOrder(
    @AuthUser() user: User,
    @Args('input') createOrderInput: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    return this.ordersService.createOrder(user.id, createOrderInput);
  }

  @Mutation(() => EditOrderOutput)
  @Role(['Any'])
  editOrder(
    @AuthUser() user: User,
    @Args('input') editOrderInput: EditOrderInput,
  ): Promise<EditOrderOutput> {
    return this.ordersService.editOrder(user, editOrderInput);
  }

  @Query(() => AllOrdersOutput)
  @Role(['Any'])
  allOrders(
    @AuthUser() user: User,
    @Args('input') allOrdersInput: AllOrdersInput,
  ): Promise<AllOrdersOutput> {
    return this.ordersService.allOrders(user, allOrdersInput);
  }

  @Query(() => OneOrderOutput)
  @Role(['Any'])
  oneOrder(
    @AuthUser() user: User,
    @Args('input') oneOrderInput: OneOrderInput,
  ): Promise<OneOrderOutput> {
    return this.ordersService.oneOrder(user, oneOrderInput);
  }

  @ResolveField('items', () => [OrderItem])
  async items() {
    const orderItems = await this.prisma.orderItem.findMany();
    return orderItems;
  }

  @ResolveField('dish', () => [Dish])
  async dish() {
    const dishes = await this.prisma.dish.findMany();
    return dishes;
  }

  @Subscription(() => Order, {
    filter: ({ pendingOrders: { ownerId } }, _, { user: { id } }) => {
      return ownerId === id;
    },
    resolve: ({ pendingOrders }) => pendingOrders,
  })
  @Role(['Owner'])
  pendingOrders() {
    return this.pubSub.asyncIterator(NEW_PENDING_ORDER);
  }

  @Subscription(() => Order)
  @Role(['Delivery'])
  cookedOrders() {
    return this.pubSub.asyncIterator(NEW_COOKED_ORDER);
  }

  @Subscription(() => Order, {
    filter: (
      { orderUpdates }: { orderUpdates: Order },
      { input }: { input: SubscriptionOrderUpdatesInput },
      { user }: { user: User },
    ) => {
      if (
        orderUpdates.driverId !== user.id &&
        orderUpdates.customerId !== user.id &&
        orderUpdates.restaurant.userId !== user.id
      ) {
        return false;
      }
      return orderUpdates.id === input.id;
    },
  })
  @Role(['Any'])
  orderUpdates(
    @Args('input') subscriptionOrderUpdatesInput: SubscriptionOrderUpdatesInput,
  ) {
    return this.pubSub.asyncIterator(NEW_ORDER_UPDATE);
  }
}
