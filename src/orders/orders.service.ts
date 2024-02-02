import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderInput, CreateOrderOutput } from './dto/create-order.dto';
import { OrderItem } from './entities/order-item.entity';
import { AllOrdersInput, AllOrdersOutput } from './dto/all-order.dto';
import { User, UserRole } from 'src/user/entities/user.entity';
import { Prisma } from '@prisma/client';
import { Order, OrderStatus } from './entities/order.entity';
import { OneOrderInput, OneOrderOutput } from './dto/one-order.dto';
import { EditOrderInput, EditOrderOutput } from './dto/edit-order.dto';
import {
  NEW_COOKED_ORDER,
  NEW_ORDER_UPDATE,
  NEW_PENDING_ORDER,
  PUB_SUB,
} from 'src/common/common.constants';
import { PubSub } from 'graphql-subscriptions';
import { TakeOrderInput, TakeOrderOutput } from './dto/take-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  canSeeOrder(user, order): boolean {
    let canSee = true;
    if (user.role === UserRole.Client && order.customerId !== user.id) {
      canSee = false;
    }
    if (user.role === UserRole.Delivery && order.driverId !== user.id) {
      canSee = false;
    }
    if (user.role === UserRole.Owner && order.restaurant.userId !== user.id) {
      canSee = false;
    }
    return canSee;
  }

  async oneOrder(
    user: User,
    oneOrderInput: OneOrderInput,
  ): Promise<OneOrderOutput> {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id: oneOrderInput.id },
        include: { restaurant: true },
      });
      if (!order) {
        return {
          ok: false,
          error: 'Order not found.',
        };
      }
      // let canSee = true;
      // if (user.role === UserRole.Client && order.customerId !== user.id) {
      //   canSee = false;
      // }
      // if (user.role === UserRole.Delivery && order.driverId !== user.id) {
      //   canSee = false;
      // }
      // if (user.role === UserRole.Owner && order.restaurant.userId !== user.id) {
      //   canSee = false;
      // }
      if (!this.canSeeOrder(user, order)) {
        return {
          ok: false,
          error: "You can't see that.",
        };
      }

      // if (
      //   order.customerId !== user.id &&
      //   order.driverId !== user.id &&
      //   order.restaurant.userId !== user.id
      // ) {
      //   console.log('hello');
      //   return {
      //     ok: false,
      //     error: "You can't see that.",
      //   };
      // }
      return {
        ok: true,
        id: order.id,
        order: order as Order,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not get order',
      };
    }
  }

  async allOrders(
    user: User,
    { status }: AllOrdersInput,
  ): Promise<AllOrdersOutput> {
    try {
      let orders: any[];
      if (user.role === UserRole.Client) {
        orders = await this.prisma.order.findMany({
          where: {
            customer: { id: user.id },
            ...(status && { status }),
          },
        });
      } else if (user.role === UserRole.Delivery) {
        orders = await this.prisma.order.findMany({
          where: {
            dirver: { id: user.id },
            ...(status && { status }),
          },
        });
      } else if (user.role === UserRole.Owner) {
        const restaurants = await this.prisma.restaurant.findMany({
          where: {
            userId: user.id,
          },
          include: { orders: true },
        });
        orders = restaurants.map((restaurant) => restaurant.orders).flat();
        if (status) {
          orders = orders.filter((order) => order.status === status);
        }
      }
      return {
        ok: true,
        orders: orders as [],
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not get orders',
      };
    }
  }

  async createOrder(
    userId: number,
    createOrderInput: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    try {
      const restaurant = await this.prisma.restaurant.findUnique({
        where: { id: createOrderInput.retaurantId },
      });
      if (!restaurant) {
        return {
          ok: false,
          error: 'Restaurant not found.',
        };
      }
      let orderItems: OrderItem = null;
      let orderFinalPrice = 0;
      for (const item of createOrderInput.items) {
        const dish = await this.prisma.dish.findUnique({
          where: { id: item.dishId },
        });
        if (!dish) {
          return {
            ok: false,
            error: 'Dish not found.',
          };
        }
        let dishFinalPrice = dish.price;
        const dishOptionsArray = dish.dishOptions as Prisma.JsonArray;
        for (const itemOption of item.options) {
          for (const dish in dishOptionsArray) {
            if (dishOptionsArray[dish]['name'] === itemOption.name) {
              for (const i in dishOptionsArray) {
                if (dishOptionsArray[i]['extra'] !== undefined) {
                  console.log(`$USD + ${dishOptionsArray[i]['extra']}`);
                  dishFinalPrice =
                    dishFinalPrice + dishOptionsArray[i]['extra'];
                }
              }
            } else {
              for (const i in dishOptionsArray[dish]['choices']) {
                if (
                  dishOptionsArray[dish]['choices'][i]['name'] ===
                  itemOption.choice
                ) {
                  for (const i in dishOptionsArray[dish]['choices']) {
                    if (
                      dishOptionsArray[dish]['choices'][i]['extra'] !==
                      undefined
                    ) {
                      console.log(
                        `$USD + ${dishOptionsArray[dish]['choices'][i]['extra']}`,
                      );
                      dishFinalPrice =
                        dishFinalPrice +
                        dishOptionsArray[dish]['choices'][i]['extra'];
                    }
                  }
                }
              }
            }
          }
        }
        orderFinalPrice = orderFinalPrice + dishFinalPrice;
        orderItems = await this.prisma.orderItem.create({
          data: {
            dish: { connect: { id: dish.id } },
            dishOptions: item.options as unknown as Prisma.JsonArray[],
          },
        });
      }
      const order = await this.prisma.order.create({
        data: {
          total: orderFinalPrice,
          items: { connect: { id: orderItems.id } },
          customer: { connect: { id: userId } },
          restaurant: { connect: { id: restaurant.id } },
        },
        include: { items: true },
      });
      await this.pubSub.publish(NEW_PENDING_ORDER, {
        pendingOrders: { ...order, ownerId: restaurant.userId },
      });
      return {
        ok: true,
        id: order.id,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not create order.',
      };
    }
  }

  async editOrder(
    user: User,
    { id, status }: EditOrderInput,
  ): Promise<EditOrderOutput> {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id },
        include: { restaurant: true },
      });
      if (!order) {
        return {
          ok: false,
          error: 'Order not found.',
        };
      }
      if (!this.canSeeOrder(user, order)) {
        return {
          ok: false,
          error: 'You cant edit that',
        };
      }
      let canEdit = true;
      if (user.role === UserRole.Client) {
        canEdit = false;
      }
      if (user.role === UserRole.Owner) {
        if (status !== OrderStatus.Cooking && status !== OrderStatus.Cooked) {
          canEdit = false;
        }
      }
      if (user.role === UserRole.Delivery) {
        if (
          status !== OrderStatus.Delivered &&
          status !== OrderStatus.PickedUp
        ) {
          canEdit = false;
        }
      }

      // if (!canEdit) {
      //   return {
      //     ok: false,
      //     error: "You can't do that.",
      //   };
      // }

      const editOrder = await this.prisma.order.update({
        where: { id },
        data: {
          status,
        },
      });
      if (user.role === UserRole.Owner) {
        if (status === OrderStatus.Cooked) {
          await this.pubSub.publish(NEW_COOKED_ORDER, {
            cookedOrders: { ...order, status },
          });
        }
      }
      await this.pubSub.publish(NEW_ORDER_UPDATE, {
        orderUpdates: { ...order, status },
      });

      return {
        ok: true,
        id: editOrder.id,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not edit order.',
      };
    }
  }

  async takeOrder(
    user: User,
    takeOrderInput: TakeOrderInput,
  ): Promise<TakeOrderOutput> {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id: takeOrderInput.id },
      });
      if (!order) {
        return {
          ok: false,
          error: 'Order not found.',
        };
      }
      if (order.driverId) {
        return {
          ok: false,
          error: 'This order already has a driver',
        };
      }
      await this.prisma.order.update({
        where: { id: order.id },
        data: {
          driverId: user.id,
        },
      });

      await this.pubSub.publish(NEW_ORDER_UPDATE, {
        orderUpdates: { ...order, user },
      });
      return {
        ok: true,
        id: order.driverId,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not upate order.',
      };
    }
  }
}
