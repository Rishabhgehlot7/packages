import { PackageDoc } from '../../types';

export const logisticsPackages: PackageDoc[] = [
  {
    id: 'boost-shipping',
    name: '@boostengine/shipping',
    categoryId: 'logistics',
    version: '1.1.0',
    description: 'Multi-carrier logistics aggregator integrating Shiprocket, Delhivery, and Shadowfax with live rate comparison, cheapest courier auto-selector, and live tracking.',
    badge: 'Logistics Aggregator',
    npmInstall: 'npm i @boostengine/shipping',
    bundleSize: '7.8 KB',
    useCase: 'Automatically picks the cheapest or fastest courier for each customer pincode and dispatches shipments programmatically.',
    features: [
      'Multi-carrier live rate quote fetching in parallel',
      'Auto-select cheapest or fastest courier algorithm',
      'Pincode serviceability & Cash on Delivery (COD) availability check',
      'Unified webhook handler for live shipment tracking status updates'
    ],
    apiMethods: [
      {
        name: 'compareCourierRates',
        signature: 'compareCourierRates(shipment: ShipmentDetails): Promise<CourierQuote[]>',
        description: 'Queries Shiprocket, Delhivery, and Shadowfax for rate and delivery ETA comparison.',
        params: [
          { name: 'shipment', type: 'ShipmentDetails', description: 'Origin & destination pincode, weight (kg), dimensions, COD value', required: true }
        ],
        returns: 'Promise<CourierQuote[]> sorted by price or transit time'
      },
      {
        name: 'createShipmentAWB',
        signature: 'createShipmentAWB(carrier: string, payload: AWBRequest): Promise<AWBResponse>',
        description: 'Manifests order and returns Air Waybill (AWB) number and tracking URL.',
        params: [
          { name: 'carrier', type: 'string', description: 'shiprocket | delhivery | shadowfax', required: true },
          { name: 'payload', type: 'AWBRequest', description: 'Order details and package specs', required: true }
        ],
        returns: 'Promise with awbCode, courierName, and trackingUrl'
      }
    ],
    examples: [
      {
        title: 'Multi-Entry Imports: Root Engine + ./react',
        language: 'typescript',
        code: `import { compareCourierRates, createShipmentAWB } from '@boostengine/shipping';
import { usePincodeCheck, useShipmentTracker, useFreeShippingProgress } from '@boostengine/shipping/react';

// Server: multi-carrier rate comparison
const quotes = await compareCourierRates({ pickupPincode: '400069', deliveryPincode: '560001', weightKg: 0.75 });

// Client: pincode serviceability + live tracking
const { result, loading, check } = usePincodeCheck();
const { shipment, eta } = useShipmentTracker('AWB-78654321');`
      },
      {
        title: 'Auto-Select Cheapest Courier Partner',
        language: 'typescript',
        code: `import { compareCourierRates, getCheapestCourier } from '@boostengine/shipping';

const quotes = await compareCourierRates({
  pickupPincode: '400069',
  deliveryPincode: '560001',
  weightKg: 0.75,
  dimensions: { length: 15, breadth: 10, height: 5 },
  isCod: true,
  codAmount: 1299
});

// Automatically selects best quote (e.g. Delhivery Surface @ ₹52 vs BlueDart @ ₹88)
const bestCarrier = getCheapestCourier(quotes);
console.log(\`Dispatching via \${bestCarrier.courierName} (Rate: ₹\${bestCarrier.rate})\`);`
      }
    ]
  },
  {
    id: 'boost-returns',
    name: '@boostengine/returns',
    categoryId: 'logistics',
    version: '1.1.0',
    description: 'Reverse logistics & doorstep return/exchange engine with automated Shiprocket reverse pickup manifests, QC inspection checklist, and instant refunds.',
    badge: 'Reverse Logistics',
    npmInstall: 'npm i @boostengine/returns',
    bundleSize: '7.1 KB',
    useCase: 'Delights customers with friction-free self-serve returns while shielding brands from reverse-RTO fraud.',
    features: [
      'Self-serve customer return/exchange request portal API',
      'Doorstep QC verification checklist for delivery agent',
      'Automated Shiprocket reverse pickup AWB dispatch',
      'Instant Razorpay/Cashfree source refund trigger on delivery QC pass'
    ],
    apiMethods: [
      {
        name: 'requestReturn',
        signature: 'requestReturn(orderId: string, items: ReturnItemRequest[]): Promise<ReturnRequestResult>',
        description: 'Creates a return/exchange ticket and validates policy window (e.g. 7 days from delivery).',
        params: [
          { name: 'orderId', type: 'string', description: 'Original order reference', required: true },
          { name: 'items', type: 'ReturnItemRequest[]', description: 'Item IDs, reason code, images', required: true }
        ],
        returns: 'Promise with returnTicketId, reversePickupStatus, and eligibility'
      }
    ],
    examples: [
      {
        title: 'Multi-Entry Imports: Root Engine + ./react',
        language: 'typescript',
        code: `import { requestReturn, generateReverseManifest } from '@boostengine/returns';

// ./react hooks for the self-serve return portal
import { BoostReturnsProvider, useReturns, useReturnStatus } from '@boostengine/returns/react';

const ticket = await requestReturn('ORD-55410', [{ itemId: 'item-88', reason: 'SIZE_TOO_SMALL' }]);
const { status } = useReturnStatus(ticket.id);`
      },
      {
        title: 'Initiate Doorstep Reverse Pickup',
        language: 'typescript',
        code: `import { requestReturn, generateReverseManifest } from '@boostengine/returns';

const returnTicket = await requestReturn('ORD-55410', [
  { itemId: 'item-88', reason: 'SIZE_TOO_SMALL', exchangeVariantId: 'size-xl' }
]);

if (returnTicket.eligible) {
  const reverseAWB = await generateReverseManifest({
    returnTicketId: returnTicket.id,
    courier: 'shiprocket_reverse'
  });
  console.log('Reverse Pickup Scheduled! AWB:', reverseAWB.code);
}`
      }
    ]
  },
  {
    id: 'boost-inventory',
    name: '@boostengine/inventory',
    categoryId: 'logistics',
    version: '1.1.0',
    description: 'Multi-warehouse stock reservation lock engine with 15-minute checkout reservation hold, low-stock urgency alerts, and backorder routing.',
    badge: 'Stock Lock',
    npmInstall: 'npm i @boostengine/inventory',
    bundleSize: '5.9 KB',
    useCase: 'Prevents overselling during flash sales with a 15-minute temporary inventory hold while customer is on payment gateway.',
    features: [
      'Temporary stock reservation lock with automatic TTL expiration',
      'Urgency badge triggers ("Only 3 items remaining in stock!")',
      'Multi-warehouse allocation based on buyer pincode proximity',
      'Backorder queue management for high-demand product drops'
    ],
    apiMethods: [
      {
        name: 'reserveStock',
        signature: 'reserveStock(items: StockHoldItem[], ttlMinutes?: number): Promise<StockHoldResult>',
        description: 'Holds stock for a pending checkout session. Releases automatically if payment times out.',
        params: [
          { name: 'items', type: 'StockHoldItem[]', description: 'Array of sku and quantity', required: true },
          { name: 'ttlMinutes', type: 'number', description: 'Hold duration (default: 15 minutes)', required: false }
        ],
        returns: 'Promise with holdId, success: boolean, reservedUntil: Date'
      }
    ],
    examples: [
      {
        title: 'Multi-Entry Imports: Root Engine + ./react',
        language: 'typescript',
        code: `import { reserveStock, releaseStock, commitStock } from '@boostengine/inventory';
import { InventoryProvider, useStockUrgency, useStockReservation } from '@boostengine/inventory/react';

// Server: hold stock during checkout
const hold = await reserveStock([{ sku: 'SNEAKER-WHT-10', quantity: 1 }], 15);

// Client: urgency badge + reservation UI
const { level, urgencyLabel } = useStockUrgency('SNEAKER-WHT-10');
const { reserve, status } = useStockReservation([{ sku: 'SNEAKER-WHT-10', quantity: 1 }]);`
      },
      {
        title: '15-Minute Checkout Stock Hold',
        language: 'typescript',
        code: `import { reserveStock, releaseStock, commitStock } from '@boostengine/inventory';

// 1. User enters payment screen -> Hold stock
const hold = await reserveStock([{ sku: 'SNEAKER-WHT-10', quantity: 1 }], 15);

// 2. On payment success -> Commit permanently
if (paymentSuccess) {
  await commitStock(hold.holdId);
} else {
  // On cancel or timeout -> Release back to inventory
  await releaseStock(hold.holdId);
}`
      }
    ]
  }
];
