import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  StyleSheet,
  StatusBar,
  Alert,
  Dimensions,
} from 'react-native';
import { DEMO_PRODUCTS, MobileProduct } from './src/data/products';

const { width } = Dimensions.get('window');
const storeName = '{{BRAND_TITLE}}';

interface CartItem {
  product: MobileProduct;
  quantity: number;
  size: string;
}

export default function App() {
  // Navigation & UI States
  const [activeTab, setActiveTab] = useState<'shop' | 'search' | 'cart' | 'warranty' | 'support'>('shop');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});

  // E-Commerce States
  const [cart, setCart] = useState<CartItem[]>([
    { product: DEMO_PRODUCTS[0], quantity: 1, size: 'M' },
  ]);
  const [wishlist, setWishlist] = useState<string[]>(['prod_1']);
  const [couponCode, setCouponCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [pincode, setPincode] = useState<string>('110001');

  // Modals
  const [detailProduct, setDetailProduct] = useState<MobileProduct | null>(null);
  const [isCartVisible, setIsCartVisible] = useState<boolean>(false);
  const [isCheckoutVisible, setIsCheckoutVisible] = useState<boolean>(false);
  const [isSupportVisible, setIsSupportVisible] = useState<boolean>(false);
  const [supportTab, setSupportTab] = useState<'warranty' | 'claim' | 'contact' | 'policies'>('warranty');

  // Checkout Form State
  const [custName, setCustName] = useState<string>('');
  const [custPhone, setCustPhone] = useState<string>('');
  const [custAddress, setCustAddress] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');
  const [orderPlacedId, setOrderPlacedId] = useState<string | null>(null);

  // Filtered Products
  const filteredProducts = DEMO_PRODUCTS.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Cart Calculations
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = Math.round((cartSubtotal * discountPercent) / 100);
  const shippingFee = cartSubtotal >= 999 ? 0 : 79;
  const grandTotal = cartSubtotal - discountAmount + shippingFee;
  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const addToCart = (product: MobileProduct, size?: string) => {
    const chosenSize = size || selectedSizes[product.id] || product.sizes[0];
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id && item.size === chosenSize);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.size === chosenSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, size: chosenSize }];
    });
    Alert.alert('Added to Bag', `${product.title} (Size: ${chosenSize}) added!`);
  };

  const updateQuantity = (productId: string, size: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId && item.size === size) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'BOOST20') {
      setDiscountPercent(20);
      Alert.alert('Coupon Applied!', '20% discount unlocked with BOOST20!');
    } else if (couponCode.toUpperCase() === 'WELCOME10') {
      setDiscountPercent(10);
      Alert.alert('Coupon Applied!', '10% discount applied!');
    } else {
      Alert.alert('Invalid Coupon', 'Try using BOOST20 or WELCOME10.');
    }
  };

  const handlePlaceOrder = () => {
    if (!custName || !custPhone || !custAddress) {
      Alert.alert('Incomplete Details', 'Please fill in Name, Phone, and Address.');
      return;
    }
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    setOrderPlacedId(orderId);
    setCart([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#090d16" />

      {/* Top Brand Bar */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brandTitle}>{storeName}</Text>
          <Text style={styles.brandSubtitle}>STREETWEAR & ESSENTIALS</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => Alert.alert('Wishlist', `${wishlist.length} items in wishlist.`)}
          >
            <Text style={styles.headerIconText}>♥ {wishlist.length}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cartBadgeBtn} onPress={() => setIsCartVisible(true)}>
            <Text style={styles.cartBadgeText}>Bag ({totalCartCount})</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search oversized hoodies, boxy tees..."
          placeholderTextColor="#64748b"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
        {/* Category Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
          {['All', 'Hoodies', 'T-Shirts', 'Bottoms', 'Fragrances'].map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.catPill, selectedCategory === cat && styles.catPillActive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.catText, selectedCategory === cat && styles.catTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Hero Drop Banner */}
        <View style={styles.heroBanner}>
          <Text style={styles.heroTag}>⚡ DROP 04 • AUTUMN / WINTER 2026</Text>
          <Text style={styles.heroHeading}>High-Performance Streetwear Essentials</Text>
          <Text style={styles.heroSub}>Crafted with 450 GSM pure French Terry cotton.</Text>
          <View style={styles.heroOfferPill}>
            <Text style={styles.heroOfferText}>Use code BOOST20 for flat 20% OFF</Text>
          </View>
        </View>

        {/* Product Grid */}
        <Text style={styles.sectionHeading}>Curated Drops ({filteredProducts.length})</Text>
        <View style={styles.grid}>
          {filteredProducts.map((p) => {
            const currentSize = selectedSizes[p.id] || p.sizes[0];
            return (
              <View key={p.id} style={styles.card}>
                <TouchableOpacity onPress={() => setDetailProduct(p)} activeOpacity={0.85}>
                  <Image source={{ uri: p.image }} style={styles.cardImage} />
                  <View style={styles.badgeDiscount}>
                    <Text style={styles.badgeDiscountText}>35% OFF</Text>
                  </View>
                </TouchableOpacity>

                <View style={styles.cardInfo}>
                  <Text style={styles.cardCategory}>{p.category.toUpperCase()}</Text>
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {p.title}
                  </Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.price}>₹{p.price}</Text>
                    <Text style={styles.comparePrice}>₹{p.compareAtPrice}</Text>
                  </View>

                  {/* Size Selector */}
                  <View style={styles.sizeRow}>
                    {p.sizes.map((sz) => (
                      <TouchableOpacity
                        key={sz}
                        style={[styles.sizeBtn, currentSize === sz && styles.sizeBtnActive]}
                        onPress={() => setSelectedSizes({ ...selectedSizes, [p.id]: sz })}
                      >
                        <Text style={[styles.sizeText, currentSize === sz && styles.sizeTextActive]}>
                          {sz}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <TouchableOpacity style={styles.addBtn} onPress={() => addToCart(p, currentSize)}>
                    <Text style={styles.addBtnText}>+ Add to Bag</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        {/* Trust Badges */}
        <View style={styles.trustStrip}>
          <View style={styles.trustItem}>
            <Text style={styles.trustIcon}>🚚</Text>
            <Text style={styles.trustTitle}>Free Pan-India Delivery</Text>
            <Text style={styles.trustSub}>On all prepaid orders</Text>
          </View>
          <View style={styles.trustItem}>
            <Text style={styles.trustIcon}>🛡️</Text>
            <Text style={styles.trustTitle}>6-Month Warranty</Text>
            <Text style={styles.trustSub}>Fabric & Stitching cover</Text>
          </View>
          <View style={styles.trustItem}>
            <Text style={styles.trustIcon}>🔄</Text>
            <Text style={styles.trustTitle}>7-Day Doorstep Exchange</Text>
            <Text style={styles.trustSub}>Hassle-free pickup</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('shop')}>
          <Text style={[styles.tabText, activeTab === 'shop' && styles.tabTextActive]}>🛍️ Store</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => setIsCartVisible(true)}>
          <Text style={[styles.tabText, activeTab === 'cart' && styles.tabTextActive]}>
            🛒 Bag ({totalCartCount})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => {
            setSupportTab('warranty');
            setIsSupportVisible(true);
          }}
        >
          <Text style={styles.tabText}>🛡️ Warranty</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => {
            setSupportTab('contact');
            setIsSupportVisible(true);
          }}
        >
          <Text style={styles.tabText}>💬 Support</Text>
        </TouchableOpacity>
      </View>

      {/* ── Product Detail Modal ── */}
      {detailProduct && (
        <Modal visible={true} animationType="slide" transparent>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setDetailProduct(null)}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
              <Image source={{ uri: detailProduct.image }} style={styles.detailImage} />
              <Text style={styles.detailCategory}>{detailProduct.category.toUpperCase()}</Text>
              <Text style={styles.detailTitle}>{detailProduct.title}</Text>
              <Text style={styles.detailDesc}>{detailProduct.description}</Text>
              <View style={styles.priceRow}>
                <Text style={styles.priceLg}>₹{detailProduct.price}</Text>
                <Text style={styles.comparePriceLg}>₹{detailProduct.compareAtPrice}</Text>
                <Text style={styles.taxInclusive}>Inclusive of 18% GST</Text>
              </View>
              <TouchableOpacity
                style={styles.fullAddBtn}
                onPress={() => {
                  addToCart(detailProduct);
                  setDetailProduct(null);
                }}
              >
                <Text style={styles.fullAddBtnText}>Add to Shopping Bag • ₹{detailProduct.price}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* ── Cart Modal ── */}
      <Modal visible={isCartVisible} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeading}>Your Shopping Bag ({totalCartCount})</Text>
              <TouchableOpacity onPress={() => setIsCartVisible(false)}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            {cart.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>Your shopping bag is empty.</Text>
              </View>
            ) : (
              <ScrollView style={{ maxHeight: 320 }}>
                {cart.map((item) => (
                  <View key={`${item.product.id}-${item.size}`} style={styles.cartItemRow}>
                    <Image source={{ uri: item.product.image }} style={styles.cartItemThumb} />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.cartItemTitle} numberOfLines={1}>
                        {item.product.title}
                      </Text>
                      <Text style={styles.cartItemSize}>Size: {item.size}</Text>
                      <Text style={styles.cartItemPrice}>₹{item.product.price * item.quantity}</Text>
                    </View>
                    <View style={styles.stepper}>
                      <TouchableOpacity
                        style={styles.stepBtn}
                        onPress={() => updateQuantity(item.product.id, item.size, -1)}
                      >
                        <Text style={styles.stepBtnText}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.stepCount}>{item.quantity}</Text>
                      <TouchableOpacity
                        style={styles.stepBtn}
                        onPress={() => updateQuantity(item.product.id, item.size, 1)}
                      >
                        <Text style={styles.stepBtnText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}

                {/* Promo Code Input */}
                <View style={styles.couponRow}>
                  <TextInput
                    style={styles.couponInput}
                    placeholder="Enter Coupon (e.g. BOOST20)"
                    placeholderTextColor="#64748b"
                    value={couponCode}
                    onChangeText={setCouponCode}
                    autoCapitalize="characters"
                  />
                  <TouchableOpacity style={styles.couponApplyBtn} onPress={applyCoupon}>
                    <Text style={styles.couponApplyText}>Apply</Text>
                  </TouchableOpacity>
                </View>

                {/* Delivery Pincode */}
                <View style={styles.pincodeRow}>
                  <Text style={styles.pincodeLabel}>Deliver to {pincode}:</Text>
                  <Text style={styles.pincodeEta}>Tomorrow, by 2 PM (Free)</Text>
                </View>
              </ScrollView>
            )}

            {/* Cart Summary Footer */}
            {cart.length > 0 && (
              <View style={styles.cartFooter}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Subtotal</Text>
                  <Text style={styles.summaryVal}>₹{cartSubtotal}</Text>
                </View>
                {discountAmount > 0 && (
                  <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, { color: '#38bdf8' }]}>Discount ({discountPercent}%)</Text>
                    <Text style={[styles.summaryVal, { color: '#38bdf8' }]}>-₹{discountAmount}</Text>
                  </View>
                )}
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Shipping</Text>
                  <Text style={styles.summaryVal}>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</Text>
                </View>
                <View style={[styles.summaryRow, { borderTopWidth: 1, borderTopColor: '#334155', paddingTop: 8 }]}>
                  <Text style={styles.totalLabel}>Grand Total</Text>
                  <Text style={styles.totalVal}>₹{grandTotal}</Text>
                </View>

                <TouchableOpacity
                  style={styles.checkoutBtn}
                  onPress={() => {
                    setIsCartVisible(false);
                    setIsCheckoutVisible(true);
                  }}
                >
                  <Text style={styles.checkoutBtnText}>Proceed to Checkout • ₹{grandTotal}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* ── Checkout Modal ── */}
      <Modal visible={isCheckoutVisible} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeading}>Checkout & Delivery</Text>
              <TouchableOpacity onPress={() => setIsCheckoutVisible(false)}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            {orderPlacedId ? (
              <View style={styles.successBox}>
                <Text style={styles.successTitle}>🎉 Order Placed Successfully!</Text>
                <Text style={styles.orderIdText}>Order ID: {orderPlacedId}</Text>
                <Text style={styles.successSub}>
                  Confirmation dispatched via SMS/WhatsApp. Estimated delivery: 2-3 days.
                </Text>
                <TouchableOpacity
                  style={styles.continueBtn}
                  onPress={() => {
                    setOrderPlacedId(null);
                    setIsCheckoutVisible(false);
                  }}
                >
                  <Text style={styles.continueBtnText}>Continue Shopping</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <ScrollView style={{ maxHeight: 400 }}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Rahul Sharma"
                  placeholderTextColor="#64748b"
                  value={custName}
                  onChangeText={setCustName}
                />
                <Text style={styles.inputLabel}>Mobile Phone</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="9876543210"
                  placeholderTextColor="#64748b"
                  keyboardType="phone-pad"
                  value={custPhone}
                  onChangeText={setCustPhone}
                />
                <Text style={styles.inputLabel}>Shipping Address</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Flat / House No, Street, Area"
                  placeholderTextColor="#64748b"
                  value={custAddress}
                  onChangeText={setCustAddress}
                />

                <Text style={styles.inputLabel}>Payment Method</Text>
                <View style={styles.paymentToggle}>
                  <TouchableOpacity
                    style={[styles.payOption, paymentMethod === 'online' && styles.payOptionActive]}
                    onPress={() => setPaymentMethod('online')}
                  >
                    <Text style={[styles.payText, paymentMethod === 'online' && styles.payTextActive]}>
                      UPI / Cards
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.payOption, paymentMethod === 'cod' && styles.payOptionActive]}
                    onPress={() => setPaymentMethod('cod')}
                  >
                    <Text style={[styles.payText, paymentMethod === 'cod' && styles.payTextActive]}>
                      Cash on Delivery
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.placeOrderBtn} onPress={handlePlaceOrder}>
                  <Text style={styles.placeOrderText}>Confirm & Pay ₹{grandTotal}</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* ── Support & Warranty Modal ── */}
      <Modal visible={isSupportVisible} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeading}>Help & Brand Warranty</Text>
              <TouchableOpacity onPress={() => setIsSupportVisible(false)}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.supportTabs}>
              {(['warranty', 'claim', 'contact', 'policies'] as const).map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={[styles.supportTabBtn, supportTab === tab && styles.supportTabBtnActive]}
                  onPress={() => setSupportTab(tab)}
                >
                  <Text style={[styles.supportTabText, supportTab === tab && styles.supportTabTextActive]}>
                    {tab.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <ScrollView style={{ maxHeight: 350 }}>
              {supportTab === 'warranty' && (
                <View style={styles.supportBody}>
                  <Text style={styles.supportTitle}>Register 6-Month Warranty</Text>
                  <Text style={styles.supportDesc}>
                    Protect your streetwear essentials against seam tearing, zipper failure, and fabric degradation.
                  </Text>
                  <TextInput style={styles.modalInput} placeholder="Your Full Name" placeholderTextColor="#64748b" />
                  <TextInput style={styles.modalInput} placeholder="Order # / Invoice ID" placeholderTextColor="#64748b" />
                  <TextInput style={styles.modalInput} placeholder="Product Purchased" placeholderTextColor="#64748b" />
                  <TouchableOpacity
                    style={styles.submitSupportBtn}
                    onPress={() => Alert.alert('Success', 'Warranty registered successfully!')}
                  >
                    <Text style={styles.submitSupportText}>Submit Registration</Text>
                  </TouchableOpacity>
                </View>
              )}

              {supportTab === 'claim' && (
                <View style={styles.supportBody}>
                  <Text style={styles.supportTitle}>File a Warranty Claim</Text>
                  <Text style={styles.supportDesc}>Doorstep inspection & free replacement within 48 hours.</Text>
                  <TextInput style={styles.modalInput} placeholder="Order ID" placeholderTextColor="#64748b" />
                  <TextInput
                    style={[styles.modalInput, { height: 70 }]}
                    placeholder="Describe the defect..."
                    placeholderTextColor="#64748b"
                    multiline
                  />
                  <TouchableOpacity
                    style={styles.submitSupportBtn}
                    onPress={() => Alert.alert('Claim Submitted', 'Our inspection team will contact you.')}
                  >
                    <Text style={styles.submitSupportText}>Submit Claim</Text>
                  </TouchableOpacity>
                </View>
              )}

              {supportTab === 'contact' && (
                <View style={styles.supportBody}>
                  <Text style={styles.supportTitle}>Customer Care</Text>
                  <Text style={styles.supportDesc}>Email: support@booststore.in • Mon-Sat 10am-7pm</Text>
                  <TextInput style={styles.modalInput} placeholder="Your Email" placeholderTextColor="#64748b" />
                  <TextInput
                    style={[styles.modalInput, { height: 70 }]}
                    placeholder="How can we assist you?"
                    placeholderTextColor="#64748b"
                    multiline
                  />
                  <TouchableOpacity
                    style={styles.submitSupportBtn}
                    onPress={() => Alert.alert('Message Sent', 'We will respond within 24 hours.')}
                  >
                    <Text style={styles.submitSupportText}>Send Message</Text>
                  </TouchableOpacity>
                </View>
              )}

              {supportTab === 'policies' && (
                <View style={styles.supportBody}>
                  <Text style={styles.supportTitle}>D2C Policies & Consumer Trust</Text>
                  <Text style={styles.policyHeader}>• Pan-India Free Shipping</Text>
                  <Text style={styles.policyText}>Prepaid orders dispatched within 24h via Delhivery/BlueDart.</Text>
                  <Text style={styles.policyHeader}>• 7-Day Easy Replacement</Text>
                  <Text style={styles.policyText}>Hassle-free doorstep exchanges for incorrect sizing.</Text>
                  <Text style={styles.policyHeader}>• 100% Encrypted Payments</Text>
                  <Text style={styles.policyText}>PCI-DSS compliant payments handled securely through Razorpay.</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090d16' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  brandTitle: { color: '#ffffff', fontSize: 20, fontWeight: '800', letterSpacing: 0.5 },
  brandSubtitle: { color: '#38bdf8', fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  headerIcons: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerIconBtn: { backgroundColor: '#1e293b', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  headerIconText: { color: '#f8fafc', fontSize: 12, fontWeight: '600' },
  cartBadgeBtn: { backgroundColor: '#0284c7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  cartBadgeText: { color: '#ffffff', fontSize: 12, fontWeight: '700' },
  searchContainer: { paddingHorizontal: 16, paddingVertical: 10 },
  searchInput: {
    backgroundColor: '#1e293b',
    color: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    borderWidth: 1,
    borderColor: '#334155',
  },
  scrollBody: { flex: 1 },
  catScroll: { paddingHorizontal: 16, marginBottom: 12 },
  catPill: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    marginRight: 8,
  },
  catPillActive: { backgroundColor: '#38bdf8' },
  catText: { color: '#94a3b8', fontSize: 13, fontWeight: '600' },
  catTextActive: { color: '#090d16', fontWeight: '700' },
  heroBanner: {
    marginHorizontal: 16,
    padding: 18,
    borderRadius: 16,
    backgroundColor: '#131b2e',
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 18,
  },
  heroTag: { color: '#fbbf24', fontSize: 11, fontWeight: '700', marginBottom: 4 },
  heroHeading: { color: '#ffffff', fontSize: 18, fontWeight: '800', lineHeight: 24 },
  heroSub: { color: '#94a3b8', fontSize: 12, marginTop: 4 },
  heroOfferPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#0369a1',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 10,
  },
  heroOfferText: { color: '#ffffff', fontSize: 11, fontWeight: '700' },
  sectionHeading: { color: '#ffffff', fontSize: 16, fontWeight: '700', paddingHorizontal: 16, marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, justifyContent: 'space-between' },
  card: {
    width: (width - 36) / 2,
    backgroundColor: '#131b2e',
    borderRadius: 14,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  cardImage: { width: '100%', height: 170, resizeMode: 'cover' },
  badgeDiscount: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#ef4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeDiscountText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  cardInfo: { padding: 10 },
  cardCategory: { color: '#38bdf8', fontSize: 10, fontWeight: '700' },
  cardTitle: { color: '#ffffff', fontSize: 13, fontWeight: '600', marginTop: 2, height: 34 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  price: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
  comparePrice: { color: '#64748b', fontSize: 12, textDecorationLine: 'line-through' },
  sizeRow: { flexDirection: 'row', gap: 4, marginTop: 8 },
  sizeBtn: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  sizeBtnActive: { borderColor: '#38bdf8', backgroundColor: '#0c4a6e' },
  sizeText: { color: '#94a3b8', fontSize: 10, fontWeight: '600' },
  sizeTextActive: { color: '#38bdf8', fontWeight: '700' },
  addBtn: {
    backgroundColor: '#0284c7',
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  addBtnText: { color: '#ffffff', fontSize: 12, fontWeight: '700' },
  trustStrip: {
    margin: 16,
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
    gap: 14,
  },
  trustItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  trustIcon: { fontSize: 20 },
  trustTitle: { color: '#ffffff', fontSize: 13, fontWeight: '700' },
  trustSub: { color: '#94a3b8', fontSize: 11 },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    backgroundColor: '#090d16',
  },
  tabItem: { alignItems: 'center' },
  tabText: { color: '#64748b', fontSize: 11, fontWeight: '600' },
  tabTextActive: { color: '#38bdf8', fontWeight: '700' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: '#0f172a',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 20,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  modalHeading: { color: '#ffffff', fontSize: 17, fontWeight: '700' },
  closeBtn: { position: 'absolute', top: 12, right: 12, zIndex: 10, backgroundColor: '#1e293b', borderRadius: 15, width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  closeBtnText: { color: '#cbd5e1', fontSize: 16, fontWeight: '700' },
  detailImage: { width: '100%', height: 220, borderRadius: 12, marginBottom: 12 },
  detailCategory: { color: '#38bdf8', fontSize: 11, fontWeight: '700' },
  detailTitle: { color: '#ffffff', fontSize: 18, fontWeight: '700', marginVertical: 4 },
  detailDesc: { color: '#94a3b8', fontSize: 13, lineHeight: 18, marginBottom: 10 },
  priceLg: { color: '#ffffff', fontSize: 20, fontWeight: '800' },
  comparePriceLg: { color: '#64748b', fontSize: 15, textDecorationLine: 'line-through' },
  taxInclusive: { color: '#10b981', fontSize: 11, fontWeight: '600' },
  fullAddBtn: { backgroundColor: '#0284c7', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 16 },
  fullAddBtnText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  emptyBox: { paddingVertical: 30, alignItems: 'center' },
  emptyText: { color: '#94a3b8', fontSize: 14 },
  cartItemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  cartItemThumb: { width: 55, height: 55, borderRadius: 8 },
  cartItemTitle: { color: '#ffffff', fontSize: 13, fontWeight: '600' },
  cartItemSize: { color: '#94a3b8', fontSize: 11 },
  cartItemPrice: { color: '#38bdf8', fontSize: 13, fontWeight: '700', marginTop: 2 },
  stepper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', borderRadius: 6 },
  stepBtn: { paddingHorizontal: 8, paddingVertical: 4 },
  stepBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  stepCount: { color: '#fff', fontSize: 12, paddingHorizontal: 6, fontWeight: '700' },
  couponRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  couponInput: { flex: 1, backgroundColor: '#1e293b', color: '#fff', borderRadius: 8, paddingHorizontal: 12, fontSize: 12, borderWidth: 1, borderColor: '#334155' },
  couponApplyBtn: { backgroundColor: '#0284c7', paddingHorizontal: 14, borderRadius: 8, justifyContent: 'center' },
  couponApplyText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  pincodeRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  pincodeLabel: { color: '#94a3b8', fontSize: 12 },
  pincodeEta: { color: '#10b981', fontSize: 12, fontWeight: '600' },
  cartFooter: { borderTopWidth: 1, borderTopColor: '#1e293b', paddingTop: 12, marginTop: 8 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  summaryLabel: { color: '#94a3b8', fontSize: 13 },
  summaryVal: { color: '#ffffff', fontSize: 13, fontWeight: '600' },
  totalLabel: { color: '#ffffff', fontSize: 16, fontWeight: '800' },
  totalVal: { color: '#ffffff', fontSize: 18, fontWeight: '800' },
  checkoutBtn: { backgroundColor: '#10b981', paddingVertical: 13, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  checkoutBtnText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  inputLabel: { color: '#94a3b8', fontSize: 12, fontWeight: '600', marginTop: 8, marginBottom: 4 },
  modalInput: { backgroundColor: '#1e293b', color: '#fff', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13, borderWidth: 1, borderColor: '#334155', marginBottom: 6 },
  paymentToggle: { flexDirection: 'row', gap: 8, marginVertical: 8 },
  payOption: { flex: 1, paddingVertical: 10, borderRadius: 8, backgroundColor: '#1e293b', alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  payOptionActive: { borderColor: '#38bdf8', backgroundColor: '#0c4a6e' },
  payText: { color: '#94a3b8', fontSize: 12, fontWeight: '600' },
  payTextActive: { color: '#38bdf8', fontWeight: '700' },
  placeOrderBtn: { backgroundColor: '#0284c7', paddingVertical: 13, borderRadius: 10, alignItems: 'center', marginTop: 14 },
  placeOrderText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  successBox: { paddingVertical: 30, alignItems: 'center' },
  successTitle: { color: '#38bdf8', fontSize: 18, fontWeight: '800', marginBottom: 8 },
  orderIdText: { color: '#ffffff', fontSize: 15, fontWeight: '700', marginBottom: 8 },
  successSub: { color: '#94a3b8', fontSize: 13, textAlign: 'center', paddingHorizontal: 20, marginBottom: 16 },
  continueBtn: { backgroundColor: '#0284c7', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 8 },
  continueBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  supportTabs: { flexDirection: 'row', backgroundColor: '#131b2e', borderRadius: 8, padding: 4, marginBottom: 12 },
  supportTabBtn: { flex: 1, paddingVertical: 6, alignItems: 'center', borderRadius: 6 },
  supportTabBtnActive: { backgroundColor: '#0284c7' },
  supportTabText: { color: '#64748b', fontSize: 11, fontWeight: '700' },
  supportTabTextActive: { color: '#ffffff' },
  supportBody: { paddingVertical: 8 },
  supportTitle: { color: '#ffffff', fontSize: 15, fontWeight: '700', marginBottom: 4 },
  supportDesc: { color: '#94a3b8', fontSize: 12, lineHeight: 16, marginBottom: 12 },
  submitSupportBtn: { backgroundColor: '#0284c7', paddingVertical: 10, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  submitSupportText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  policyHeader: { color: '#38bdf8', fontSize: 13, fontWeight: '700', marginTop: 8 },
  policyText: { color: '#cbd5e1', fontSize: 12, marginTop: 2 },
});
