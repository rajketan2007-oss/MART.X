import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, TrendingUp, Award, ShieldCheck, Truck, RefreshCw, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductCard from '../components/product/ProductCard';
import { fetchCategoriesApi, fetchProductsApi } from '../services/api';

// Four-pointed star SVG component matching the high-fashion editorial aesthetic
const FashionStar = ({ className = "w-8 h-8", fill = "currentColor" }) => (
  <svg viewBox="0 0 24 24" fill={fill} className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
  </svg>
);

// High quality curated fallback template categories
const defaultCategories = [
  {
    _id: 'cat_dresses',
    name: "Women's Dresses",
    slug: 'womens-dresses',
    discountTag: '40-80% OFF',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
    description: 'Chic silhouettes, floral midis & evening gowns'
  },
  {
    _id: 'cat_tshirts',
    name: "Men's T-Shirts",
    slug: 'mens-tshirts',
    discountTag: '30-70% OFF',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    description: 'Oversized tees, polo shirts & luxury basics'
  },
  {
    _id: 'cat_denim',
    name: 'Denim & Jeans',
    slug: 'jeans-trousers',
    discountTag: 'UP TO 60% OFF',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
    description: 'Slim, straight-fit & wide-leg vintage washes'
  },
  {
    _id: 'cat_jackets',
    name: 'Jackets & Coats',
    slug: 'jackets-coats',
    discountTag: 'FLAT 50% OFF',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
    description: 'Leather bikers, bomber jackets & trench coats'
  },
  {
    _id: 'cat_ethnic',
    name: 'Ethnic & Festive',
    slug: 'ethnic-wear',
    discountTag: 'MIN 40% OFF',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    description: 'Silk sarees, kurtas, lehengas & sherwanis'
  },
  {
    _id: 'cat_kids',
    name: "Kids' Collection",
    slug: 'kids-clothing',
    discountTag: '30-60% OFF',
    image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80',
    description: 'Vibrant, soft & comfortable daily wear'
  },
  {
    _id: 'cat_footwear',
    name: 'Footwear & Sneakers',
    slug: 'footwear',
    discountTag: 'UP TO 60% OFF',
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
    description: 'Retro street sneakers, heels & leather loafers'
  },
  {
    _id: 'cat_handbags',
    name: 'Luxury Handbags',
    slug: 'handbags',
    discountTag: 'FLAT 40% OFF',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    description: 'Tote bags, crossbody slings & designer clutches'
  },
  {
    _id: 'cat_accessories',
    name: 'Watches & Jewelry',
    slug: 'jewellery',
    discountTag: 'MIN 30% OFF',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
    description: 'Minimal timepieces, eyewear & statement jewelry'
  },
  {
    _id: 'cat_sleepwear',
    name: 'Loungewear & Sleep',
    slug: 'sleepwear',
    discountTag: '30-65% OFF',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    description: 'Silk lounge sets & breathable cotton pyjamas'
  }
];

const dressStyles = [
  {
    title: 'Casual',
    link: '/shop?category=mens-tshirts',
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=800&q=80',
    span: 'col-span-1 md:col-span-1'
  },
  {
    title: 'Formal',
    link: '/shop?category=workwear',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
    span: 'col-span-1 md:col-span-2'
  },
  {
    title: 'Party',
    link: '/shop?category=womens-dresses',
    image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1200&q=80',
    span: 'col-span-1 md:col-span-2'
  },
  {
    title: 'Gym',
    link: '/shop?category=activewear',
    image: 'https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=800&q=80',
    span: 'col-span-1 md:col-span-1'
  }
];

const perks = [
  { icon: ShieldCheck, title: '100% Authentic', subtitle: 'Verified luxury brands' },
  { icon: Truck, title: 'Express Delivery', subtitle: 'Delivered in 2-3 days' },
  { icon: RefreshCw, title: 'Easy Returns', subtitle: '14-day hassle-free' },
  { icon: Headphones, title: '24/7 Premium Support', subtitle: 'Always here to assist' },
];

const HomePage = () => {
  const [categories, setCategories] = useState(defaultCategories);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchCategoriesApi(), fetchProductsApi({ pageSize: 8 })])
      .then(([catRes, prodRes]) => {
        if (catRes.data && catRes.data.length > 0) {
          setCategories(catRes.data);
        }
        setFeaturedProducts(prodRes.data?.products || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-12 sm:space-y-16 pb-16 overflow-hidden">

      {/* ========================================================================= */}
      {/* 🌟 LUXURY HERO COVER SECTION (SHOP.CO AESTHETIC) */}
      {/* ========================================================================= */}
      <section className="bg-[#F2F0F1] relative rounded-3xl mx-3 sm:mx-6 lg:mx-8 mt-3 sm:mt-5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-8 sm:pt-12 lg:pt-16 pb-0 sm:pb-0 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">

          {/* Left Column: Heading, Subtitle, CTA & Stats */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 z-10 pb-8 lg:pb-16">
            
            <h1 className="text-4xl sm:text-6xl lg:text-[62px] font-black tracking-tight leading-[1.05] text-black font-sans uppercase">
              FIND CLOTHES<br />
              THAT MATCHES<br />
              YOUR STYLE
            </h1>

            <p className="text-sm sm:text-base text-gray-600 font-normal max-w-lg leading-relaxed">
              Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.
            </p>

            <div>
              <Link
                to="/shop"
                className="inline-flex items-center justify-center bg-black hover:bg-neutral-800 text-white font-bold text-sm sm:text-base px-14 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-lg active:scale-95"
              >
                Shop Now
              </Link>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap items-center gap-6 sm:gap-8 lg:gap-10 pt-6 border-t border-black/10">
              <div>
                <span className="block text-2xl sm:text-4xl font-extrabold text-black tracking-tight">200+</span>
                <span className="text-xs text-gray-500 font-medium">International Brands</span>
              </div>
              <div className="hidden sm:block h-10 w-px bg-black/15" />
              <div>
                <span className="block text-2xl sm:text-4xl font-extrabold text-black tracking-tight">2,000+</span>
                <span className="text-xs text-gray-500 font-medium">High Quality Products</span>
              </div>
              <div className="hidden sm:block h-10 w-px bg-black/15" />
              <div>
                <span className="block text-2xl sm:text-4xl font-extrabold text-black tracking-tight">30,000+</span>
                <span className="text-xs text-gray-500 font-medium">Happy Customers</span>
              </div>
            </div>

          </div>

          {/* Right Column: Editorial Fashion Models & Sparkle Stars */}
          <div className="lg:col-span-5 relative flex items-end justify-center h-full min-h-[380px] sm:min-h-[460px] lg:min-h-[560px]">
            
            {/* Top Right Big Star */}
            <div className="absolute top-4 sm:top-8 right-2 sm:right-6 text-black z-20 animate-pulse">
              <FashionStar className="w-14 h-14 sm:w-20 sm:h-20" />
            </div>

            {/* Left Middle Star */}
            <div className="absolute top-1/2 left-0 sm:left-2 -translate-y-1/2 text-black z-20">
              <FashionStar className="w-8 h-8 sm:w-11 sm:h-11" />
            </div>

            {/* Editorial Fashion Photography */}
            <img
              src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85"
              alt="Fashion Editorial Models"
              className="relative z-10 w-full max-w-[420px] lg:max-w-none h-auto object-contain object-bottom drop-shadow-xl select-none pointer-events-none"
              loading="eager"
            />
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🏷️ ICONIC BRAND LOGOS STRIP */}
      {/* ========================================================================= */}
      <section className="bg-black text-white py-8 sm:py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-around gap-6 sm:gap-10 lg:gap-16">
          <span className="font-serif font-black tracking-[0.25em] text-xl sm:text-3xl uppercase hover:text-gray-300 transition-colors cursor-pointer">
            VERSACE
          </span>
          <span className="font-serif font-black tracking-[-0.08em] text-2xl sm:text-4xl uppercase hover:text-gray-300 transition-colors cursor-pointer">
            ZARA
          </span>
          <span className="font-serif tracking-[0.35em] text-lg sm:text-2xl uppercase font-bold hover:text-gray-300 transition-colors cursor-pointer">
            GUCCI
          </span>
          <span className="font-serif font-black tracking-[0.2em] text-xl sm:text-3xl uppercase hover:text-gray-300 transition-colors cursor-pointer">
            PRADA
          </span>
          <span className="font-sans font-medium tracking-tight text-lg sm:text-2xl hover:text-gray-300 transition-colors cursor-pointer">
            Calvin Klein
          </span>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🛡️ PERKS / TRUST STRIP */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {perks.map((perk, i) => (
            <motion.div
              key={perk.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs hover:shadow-card-hover transition-all flex items-center gap-3.5"
            >
              <div className="w-10 h-10 rounded-xl bg-extrad-peach text-extrad-pink flex items-center justify-center shrink-0">
                <perk.icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-extrad-dark uppercase tracking-wider">{perk.title}</h4>
                <p className="text-[11px] text-extrad-muted font-medium">{perk.subtitle}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 👗 CATEGORY SPOTLIGHT (WITH RICH TEMPLATE IMAGES) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-extrad-pink" />
              <h2 className="text-2xl font-black text-extrad-dark uppercase tracking-tight">
                CATEGORY SPOTLIGHT
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-extrad-muted">Curated fashion & lifestyle collections for every mood</p>
          </div>
          <Link
            to="/shop"
            className="text-xs sm:text-sm font-bold text-extrad-pink hover:underline flex items-center gap-1 group"
          >
            <span>VIEW ALL</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat._id || idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.04 }}
              whileHover={{ y: -6 }}
            >
              <Link
                to={`/shop?category=${cat.slug}`}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-card-hover transition-all duration-300 flex flex-col text-center h-full"
              >
                <div className="aspect-[4/5] overflow-hidden bg-gray-100 relative">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <span className="absolute bottom-2 left-2 right-2 bg-black/85 text-white text-[11px] font-black py-1.5 px-2 rounded-xl backdrop-blur-xs tracking-wider shadow-sm group-hover:bg-extrad-pink transition-colors">
                    {cat.discountTag || 'TRENDING'}
                  </span>
                </div>
                <div className="p-3.5 bg-white flex-1 flex flex-col justify-between">
                  <h3 className="text-xs sm:text-sm font-bold text-extrad-dark group-hover:text-extrad-pink transition-colors line-clamp-1">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] font-extrabold text-extrad-pink uppercase mt-1 inline-block">
                    Explore Collection →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🧭 BROWSE BY DRESS STYLE (SHOP.CO SIGNATURE BENTO GRID) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F0F0F0] rounded-3xl p-6 sm:p-10 lg:p-14">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-black uppercase tracking-tight">
              BROWSE BY DRESS STYLE
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-2 font-medium">Explore curated styles handpicked for every occasion</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {dressStyles.map((style) => (
              <Link
                key={style.title}
                to={style.link}
                className={`${style.span} group relative h-[190px] sm:h-[240px] rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300`}
              >
                <img
                  src={style.image}
                  alt={style.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
                <h3 className="absolute top-5 left-6 text-2xl sm:text-3xl font-black text-white drop-shadow-md">
                  {style.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🔥 FEATURED & TRENDING PRODUCTS */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-extrad-peach text-extrad-pink animate-pulse">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-extrad-dark uppercase tracking-tight">
                TRENDING NOW ON MART.X
              </h2>
              <p className="text-xs sm:text-sm text-extrad-muted">Top trending apparel & luxury picks updated in real time</p>
            </div>
          </div>
          <Link
            to="/shop?sort=popularity"
            className="text-xs sm:text-sm font-bold text-extrad-pink hover:underline flex items-center gap-1 group"
          >
            <span>EXPLORE TRENDS</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product, idx) => (
              <ProductCard key={product._id || product.id || idx} product={product} index={idx} />
            ))
          ) : (
            // Placeholder product skeletons if products are loading
            [1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs animate-pulse">
                <div className="aspect-[3/4] bg-gray-200 rounded-xl mb-3" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🎁 DISCOUNT & ASSURANCE BANNER */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-black rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl overflow-hidden border border-white/10"
        >
          <div className="relative z-10 max-w-xl space-y-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-amber-300 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
              <Award className="w-3.5 h-3.5" /> MART.X ASSURED LUXURY
            </span>
            <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tight leading-snug">
              FLAT ₹300 OFF ON YOUR FIRST ORDER
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 font-medium leading-relaxed">
              Join millions of fashion enthusiasts. Explore our curated collections and use promo code <strong className="bg-white/20 px-2 py-0.5 rounded text-amber-200 font-bold">MART300</strong> at checkout.
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/shop"
                className="bg-white text-black font-extrabold text-xs sm:text-sm uppercase tracking-widest px-8 py-4 rounded-full shadow-xl hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
              >
                <span>START SHOPPING NOW</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

    </div>
  );
};

export default HomePage;
