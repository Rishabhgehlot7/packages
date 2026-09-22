import { BoostInventory, inventory as defaultInventory } from './manager';
import { AllocationItem, Warehouse } from './types';

export interface AgentToolCallResult {
  toolName: string;
  success: boolean;
  data?: any;
  error?: string;
}

export class InventoryAgentToolkit {
  /**
   * Universal tool definitions formatted for OpenAI Function Calling
   */
  static getOpenAITools() {
    return [
      {
        type: 'function',
        function: {
          name: 'check_stock_availability',
          description: 'Check available quantity, low stock urgency, and backorder status for one or more product SKUs.',
          parameters: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                description: 'Array of items with SKU and quantity to check',
                items: {
                  type: 'object',
                  properties: {
                    sku: { type: 'string', description: 'Product variant SKU' },
                    quantity: { type: 'number', description: 'Desired purchase quantity (default: 1)' },
                  },
                  required: ['sku'],
                },
              },
              warehouseId: { type: 'string', description: 'Optional warehouse ID filter' },
            },
            required: ['items'],
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'reserve_order_stock',
          description: 'Temporarily lock and reserve inventory for checkout or flash sale with an auto-expiring TTL.',
          parameters: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                description: 'Items to reserve with SKU and quantity',
                items: {
                  type: 'object',
                  properties: {
                    sku: { type: 'string', description: 'SKU identifier' },
                    quantity: { type: 'number', description: 'Quantity to reserve' },
                  },
                  required: ['sku', 'quantity'],
                },
              },
              ttlSeconds: { type: 'number', description: 'Lock duration in seconds (default: 900 / 15 minutes)' },
              cartId: { type: 'string', description: 'Optional associated cart ID' },
            },
            required: ['items'],
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'release_stock_reservation',
          description: 'Release a previously held stock reservation if checkout is abandoned or payment failed.',
          parameters: {
            type: 'object',
            properties: {
              reservationId: { type: 'string', description: 'The unique reservation ID returned by reserve_order_stock' },
              reason: { type: 'string', description: 'Reason for releasing reservation' },
            },
            required: ['reservationId'],
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'confirm_stock_deduction',
          description: 'Permanently deduct reserved stock when payment succeeds and order is confirmed.',
          parameters: {
            type: 'object',
            properties: {
              reservationId: { type: 'string', description: 'The reservation ID to confirm' },
              orderId: { type: 'string', description: 'Confirmed order ID' },
            },
            required: ['reservationId'],
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'find_fulfillment_warehouse',
          description: 'Calculate the optimal warehouse fulfillment routing (or split shipment plan) for order items.',
          parameters: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    sku: { type: 'string' },
                    quantity: { type: 'number' },
                  },
                  required: ['sku', 'quantity'],
                },
              },
              warehouses: {
                type: 'array',
                description: 'List of available warehouses',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    pincode: { type: 'string' },
                    state: { type: 'string' },
                    priority: { type: 'number' },
                    isDefault: { type: 'boolean' },
                  },
                  required: ['id', 'name', 'pincode', 'state'],
                },
              },
              customerPincode: { type: 'string', description: 'Destination customer postal/pincode' },
              allowSplit: { type: 'boolean', description: 'Whether multi-origin split shipments are permitted' },
            },
            required: ['items', 'warehouses'],
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'get_low_stock_reorder_list',
          description: 'Scan inventory to retrieve critical shortages and low stock items needing replenishment.',
          parameters: {
            type: 'object',
            properties: {
              warehouseId: { type: 'string', description: 'Optional specific warehouse ID' },
            },
          },
        },
      },
    ];
  }

  /**
   * Tool definitions formatted for Anthropic Claude
   */
  static getClaudeTools() {
    return this.getOpenAITools().map((tool) => ({
      name: tool.function.name,
      description: tool.function.description,
      input_schema: tool.function.parameters,
    }));
  }

  /**
   * Tool definitions formatted for Google Gemini function calling
   */
  static getGeminiTools() {
    return [
      {
        functionDeclarations: this.getOpenAITools().map((tool) => ({
          name: tool.function.name,
          description: tool.function.description,
          parameters: tool.function.parameters,
        })),
      },
    ];
  }

  /**
   * Tool definitions for Vercel AI SDK (`ai`)
   */
  static getVercelAITools(inventoryInstance?: BoostInventory) {
    const inv = inventoryInstance || defaultInventory;
    return {
      check_stock_availability: {
        description: 'Check available quantity, low stock urgency, and backorder status for product SKUs.',
        execute: async (params: { items: AllocationItem[]; warehouseId?: string }) => {
          return InventoryAgentToolkit.executeTool('check_stock_availability', params, inv);
        },
      },
      reserve_order_stock: {
        description: 'Temporarily lock and reserve inventory for checkout or flash sale.',
        execute: async (params: { items: AllocationItem[]; ttlSeconds?: number; cartId?: string }) => {
          return InventoryAgentToolkit.executeTool('reserve_order_stock', params, inv);
        },
      },
      release_stock_reservation: {
        description: 'Release a previously held stock reservation.',
        execute: async (params: { reservationId: string; reason?: string }) => {
          return InventoryAgentToolkit.executeTool('release_stock_reservation', params, inv);
        },
      },
      confirm_stock_deduction: {
        description: 'Permanently deduct reserved stock upon order confirmation.',
        execute: async (params: { reservationId: string; orderId?: string }) => {
          return InventoryAgentToolkit.executeTool('confirm_stock_deduction', params, inv);
        },
      },
      find_fulfillment_warehouse: {
        description: 'Route items to nearest warehouse or calculate multi-origin split plan.',
        execute: async (params: { items: AllocationItem[]; warehouses: Warehouse[]; customerPincode?: string; allowSplit?: boolean }) => {
          return InventoryAgentToolkit.executeTool('find_fulfillment_warehouse', params, inv);
        },
      },
      get_low_stock_reorder_list: {
        description: 'Scan inventory for low stock reorder alerts.',
        execute: async (params: { warehouseId?: string }) => {
          return InventoryAgentToolkit.executeTool('get_low_stock_reorder_list', params, inv);
        },
      },
    };
  }

  /**
   * Universal Tool Executor for AI Agents
   */
  static async executeTool(
    toolName: string,
    params: any,
    inventoryInstance?: BoostInventory
  ): Promise<AgentToolCallResult> {
    const inv = inventoryInstance || defaultInventory;

    try {
      switch (toolName) {
        case 'check_stock_availability': {
          const items: AllocationItem[] = (params.items || []).map((it: any) => ({
            sku: it.sku,
            quantity: it.quantity || 1,
          }));

          const cartCheck = inv.checkCartAvailability(items);
          const urgencyList = items.map((it) => ({
            sku: it.sku,
            ...inv.getUrgency(it.sku, params.warehouseId),
          }));

          return {
            toolName,
            success: true,
            data: {
              allAvailable: cartCheck.allAvailable,
              hasBackorders: cartCheck.hasBackorders,
              items: cartCheck.items,
              urgencies: urgencyList,
            },
          };
        }

        case 'reserve_order_stock': {
          const items: AllocationItem[] = params.items || [];
          const ttl = params.ttlSeconds ?? 900;
          const result = inv.reserveStock(items, ttl, { cartId: params.cartId });

          return {
            toolName,
            success: result.success,
            data: result,
          };
        }

        case 'release_stock_reservation': {
          const ok = inv.releaseReservation(params.reservationId, params.reason);
          return {
            toolName,
            success: ok,
            data: { released: ok, reservationId: params.reservationId },
          };
        }

        case 'confirm_stock_deduction': {
          const ok = inv.confirmDeduction(params.reservationId, params.orderId);
          return {
            toolName,
            success: ok,
            data: { confirmed: ok, reservationId: params.reservationId, orderId: params.orderId },
          };
        }

        case 'find_fulfillment_warehouse': {
          const items: AllocationItem[] = params.items || [];
          const warehouses: Warehouse[] = params.warehouses || [];
          const customerPincode: string | undefined = params.customerPincode;
          const allowSplit = params.allowSplit !== false; // default true

          if (allowSplit) {
            const splitPlan = inv.allocateSplitShipment(items, warehouses, customerPincode);
            return {
              toolName,
              success: splitPlan.canFulfill,
              data: splitPlan,
            };
          } else {
            const singlePlan = inv.allocateWarehouse(items, warehouses, customerPincode);
            return {
              toolName,
              success: singlePlan.canFulfill,
              data: singlePlan,
            };
          }
        }

        case 'get_low_stock_reorder_list': {
          const alerts = inv.getLowStockAlerts(params.warehouseId);
          return {
            toolName,
            success: true,
            data: {
              totalAlerts: alerts.length,
              alerts,
            },
          };
        }

        default:
          return {
            toolName,
            success: false,
            error: `Unknown tool name: ${toolName}`,
          };
      }
    } catch (err: any) {
      return {
        toolName,
        success: false,
        error: err?.message || String(err),
      };
    }
  }
}
