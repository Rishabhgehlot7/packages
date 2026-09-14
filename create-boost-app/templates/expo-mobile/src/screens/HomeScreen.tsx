import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
  TextInput,
} from 'react-native';

const storeName = '{{BRAND_TITLE}}';

interface Product {
  id: string;
  title: string;
  price: number;
  compareAtPrice: number;
  category: string;
  image: string;
  rating: number;
}

const PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    title: 'Cyberpunk 450 GSM Oversized Hoodie',
    price: 2499,
    compareAtPrice: 3999,
    category: 'Hoodies',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
  },
  {
    id: 'prod_2',
    title: 'Acid Wash Vintage Boxy Tee',
    price: 1199,
    compareAtPrice: 1799,
    category: 'T-Shirts',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
  },
  {
    id: 'prod_3',
    title: 'Tactical Multi-Pocket Cargo Pants',
    price: 2899,
    compareAtPrice: 4299,
    category: 'Bottoms',
    image: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
  },
  {
    id: 'prod_4',
    title: 'Amber Solid Perfume (50ml)',
    price: 1499,
    compareAtPrice: 2199,
    category: 'Fragrances',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80',
    rating: 5.0,
  },
];

export default function HomeScreen() {
  const [selectedCat, setSelectedCat] = useState('All');
  const [cartCount, setCartCount] = useState(0);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  const categories = ['All', 'Hoodies', 'T-Shirts', 'Bottoms', 'Fragrances'];

  const filtered = PRODUCTS.filter((p) => {
    const matchCat = selectedCat === 'All' || p.category === selectedCat;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const toggleWish = (id: string) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleAddToCart = (product: Product) => {
    setCartCount((c) => c + 1);
    Alert.alert(
      '🛒 Added to Cart',
      `${product.title} added!\n\n⚡ Total Items: ${cartCount + 1}`,
      [
        { text: 'Keep Shopping', style: 'cancel' },
        {
          text: 'Checkout (Mock)',
          onPress: () => {
            Alert.alert(
              '🎉 Payment Successful (Mock Test)',
              `Order #BST-${Math.floor(100000 + Math.random() * 900000)} confirmed!\nEstimated Delivery: 2-3 Days via Shiprocket.`
            );
            setCartCount(0);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── Top App Bar ── */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.brandTitle}>⚡ {storeName}</Text>
          <Text style={styles.brandSub}>Powered by BoostEngine</Text>
        </View>
        <TouchableOpacity style={styles.cartBadgeBtn}>
          <Text style={styles.cartBadgeText}>🛒 {cartCount}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* ── Search Bar ── */}
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            placeholder="Search products..."
            placeholderTextColor="#94a3b8"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>

        {/* ── Hero Banner ── */}
        <View style={styles.heroCard}>
          <Text style={styles.heroTag}>NEW DROP 2026</Text>
          <Text style={styles.heroTitle}>Heavyweight Streetwear</Text>
          <Text style={styles.heroSub}>Flat 20% OFF with code BOOST20</Text>
        </View>

        {/* ── Categories ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelectedCat(cat)}
              style={[styles.catPill, selectedCat === cat && styles.catPillActive]}
            >
              <Text style={[styles.catText, selectedCat === cat && styles.catTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Products List ── */}
        <View style={styles.productsGrid}>
          {filtered.map((p) => {
            const isFav = wishlist.includes(p.id);
            const offPct = Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100);

            return (
              <View key={p.id} style={styles.productCard}>
                <View style={styles.imgWrap}>
                  <Image source={{ uri: p.image }} style={styles.prodImg} />
                  <View style={styles.offBadge}>
                    <Text style={styles.offText}>-{offPct}%</Text>
                  </View>
                  <TouchableOpacity onPress={() => toggleWish(p.id)} style={styles.favBtn}>
                    <Text style={{ fontSize: 16 }}>{isFav ? '❤️' : '🤍'}</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.cardBody}>
                  <Text style={styles.prodRating}>★ {p.rating}</Text>
                  <Text numberOfLines={1} style={styles.prodTitle}>{p.title}</Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.price}>₹{p.price}</Text>
                    <Text style={styles.comparePrice}>₹{p.compareAtPrice}</Text>
                  </View>

                  <TouchableOpacity onPress={() => handleAddToCart(p)} style={styles.addBtn}>
                    <Text style={styles.addBtnText}>Add to Cart +</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8fafc' },
  topBar: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandTitle: { fontSize: 20, fontWeight: '900', color: '#0f172a' },
  brandSub: { fontSize: 11, color: '#64748b' },
  cartBadgeBtn: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  cartBadgeText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  scroll: { flex: 1 },
  searchBox: {
    margin: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 12,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, height: 42, fontSize: 14, color: '#0f172a' },
  heroCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#1e1b4b',
    borderRadius: 16,
    padding: 24,
  },
  heroTag: { color: '#a5b4fc', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  heroTitle: { color: '#fff', fontSize: 22, fontWeight: '900', marginTop: 4 },
  heroSub: { color: '#c7d2fe', fontSize: 13, marginTop: 4 },
  catScroll: { paddingHorizontal: 16, marginBottom: 16 },
  catPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginRight: 8,
  },
  catPillActive: { backgroundColor: '#0f172a', borderColor: '#0f172a' },
  catText: { fontSize: 13, color: '#64748b', fontWeight: '600' },
  catTextActive: { color: '#fff' },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  productCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  imgWrap: { position: 'relative', width: '100%', height: 160 },
  prodImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  offBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#dc2626',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  offText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  favBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: { padding: 12 },
  prodRating: { color: '#eab308', fontSize: 11, fontWeight: '700', marginBottom: 2 },
  prodTitle: { fontSize: 13, fontWeight: '700', color: '#0f172a', marginBottom: 6 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6, marginBottom: 10 },
  price: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  comparePrice: { fontSize: 12, color: '#94a3b8', textDecorationLine: 'line-through' },
  addBtn: {
    backgroundColor: '#0f172a',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  addBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
});
