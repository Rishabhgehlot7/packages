export const returnsAgentTools = [
  { name: 'create_return_request', description: 'Create a new return/exchange/refund request (RMA) for an order.', parameters: { type: 'object', properties: { orderId: { type: 'string' }, customerId: { type: 'string' }, items: { type: 'array' }, type: { type: 'string', enum: ['return','exchange','partial_return'] }, refundMethod: { type: 'string' } }, required: ['orderId','customerId','items'] } },
  { name: 'get_return_status', description: 'Get the current status and full timeline of a return request by RMA ID.', parameters: { type: 'object', properties: { returnId: { type: 'string' } }, required: ['returnId'] } },
  { name: 'get_returns_by_customer', description: 'Get all return requests for a specific customer.', parameters: { type: 'object', properties: { customerId: { type: 'string' } }, required: ['customerId'] } },
  { name: 'approve_return', description: 'Approve a pending return request and initiate the refund process.', parameters: { type: 'object', properties: { returnId: { type: 'string' }, adminNote: { type: 'string' } }, required: ['returnId'] } },
  { name: 'get_returns_stats', description: 'Get aggregated returns statistics: total, by status, refunded amount, avg processing time, top reasons.', parameters: { type: 'object', properties: {} } },
];
export type ReturnsAgentToolName = typeof returnsAgentTools[number]['name'];
