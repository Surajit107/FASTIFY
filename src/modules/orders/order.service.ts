import type { OrderRepository } from './order.repository.js';
import type { Order, OrderItem } from './order.repository.js';
import { NotFoundError } from '../../errors/app.error.js';

export interface OrderService {
  create(userId: string, items: OrderItem[]): Promise<Order>;
  getById(id: string): Promise<Order>;
  getByUserId(userId: string, limit?: number): Promise<Order[]>;
}

export function createOrderService(repository: OrderRepository): OrderService {
  return {
    async create(userId, items) {
      const totalCents = items.reduce((sum, i) => sum + i.quantity * i.unitPriceCents, 0);
      return repository.create({ userId, items, totalCents });
    },

    async getById(id) {
      const order = await repository.findById(id);
      if (!order) throw new NotFoundError('Order', id);
      return order;
    },

    async getByUserId(userId, limit) {
      return repository.findByUserId(userId, limit);
    },
  };
}
