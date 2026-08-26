const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const User = require('./src/models/User');
const Category = require('./src/models/Category');
const Product = require('./src/models/Product');
const Coupon = require('./src/models/Coupon');
const Review = require('./src/models/Review');

dotenv.config();

const sampleCategories = [
  {
    name: "Women's Dresses",
    slug: 'womens-dresses',
    discountTag: '40-80% OFF',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
    description: 'Flowy maxi dresses, floral midi dresses & chic bodycon styles'
  },
  {
    name: "Men's T-Shirts",
    slug: 'mens-tshirts',
    discountTag: '30-70% OFF',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    description: 'Graphic tees, polo shirts, plain essentials & oversized fits'
  },
  {
    name: 'Jeans & Trousers',
    slug: 'jeans-trousers',
    discountTag: 'UP TO 60% OFF',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
    description: 'Slim, wide-leg, straight-fit denim & relaxed chino trousers'
  },
  {
    name: 'Ethnic Wear',
    slug: 'ethnic-wear',
    discountTag: 'FLAT 50% OFF',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    description: 'Kurtas, sarees, lehengas, sherwanis & festive occasion wear'
  },
  {
    name: "Kids' Clothing",
    slug: 'kids-clothing',
    discountTag: '30-60% OFF',
    image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80',
    description: 'Bright, comfortable & durable clothing for boys & girls'
  },
  {
    name: 'Jackets & Coats',
    slug: 'jackets-coats',
    discountTag: 'UP TO 75% OFF',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
    description: 'Denim jackets, bomber coats, windbreakers & quilted puffers'
  },
  {
    name: 'Sleepwear & Loungewear',
    slug: 'sleepwear',
    discountTag: '30-65% OFF',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    description: 'Silk lounge sets, breathable cotton PJ combos & nightwear'
  },
  {
    name: 'Formal & Workwear',
    slug: 'workwear',
    discountTag: 'MIN 40% OFF',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    description: 'Tailored blazers, formal trousers, crisp shirts & office sets'
  },
  {
    name: 'Activewear & Sportswear',
    slug: 'activewear',
    discountTag: 'BUY 2 GET 1',
    image: 'https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=800&q=80',
    description: 'Running shorts, yoga pants, sports bras & gym joggers'
  },
  {
    name: 'Footwear & Sneakers',
    slug: 'footwear',
    discountTag: 'UP TO 60% OFF',
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
    description: 'Retro street sneakers, heels & leather loafers'
  },
  {
    name: 'Luxury Handbags',
    slug: 'handbags',
    discountTag: 'FLAT 40% OFF',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    description: 'Tote bags, crossbody slings & designer clutches'
  }
];

const populateInitialData = async () => {
  try {
    console.log('[Seed] Clearing existing collections...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Coupon.deleteMany({});
    await Review.deleteMany({});

    console.log('[Seed] Inserting users...');
    const adminUser = await User.create({
      name: 'Extrad Admin',
      email: 'admin@extrad.com',
      password: 'admin123', // Will be hashed via pre-save
      role: 'admin',
      phone: '9876543210',
      addresses: [
        {
          name: 'Extrad HQ',
          phone: '9876543210',
          pincode: '560001',
          locality: 'MG Road',
          address: 'Building 404, Tech Park',
          city: 'Bengaluru',
          state: 'Karnataka',
          addressType: 'Work',
          isDefault: true
        }
      ]
    });

    const normalUser = await User.create({
      name: 'Rahul Sharma',
      email: 'user@extrad.com',
      password: 'user123',
      role: 'user',
      phone: '9123456789',
      addresses: [
        {
          name: 'Rahul Sharma',
          phone: '9123456789',
          pincode: '400001',
          locality: 'Colaba',
          address: 'Flat 12B, Sunview Apartments',
          city: 'Mumbai',
          state: 'Maharashtra',
          addressType: 'Home',
          isDefault: true
        }
      ]
    });

    console.log('[Seed] Inserting categories...');
    const createdCategories = await Category.insertMany(sampleCategories);
    const catMap = {};
    createdCategories.forEach(c => {
      catMap[c.slug] = c;
    });

    console.log('[Seed] Inserting products...');
    const sampleProducts = [
      // Women's Dresses
      {
        name: 'Floral Wrap Midi Dress',
        brand: 'ZARA INSPIRED',
        category: catMap['womens-dresses']._id,
        categoryName: "Women's Dresses",
        description: 'Elegant floral print wrap midi dress with V-neckline, self-tie belt and flared hem. Crafted from breathable viscose fabric, perfect for brunches and evening outings.',
        price: 1299,
        mrp: 2999,
        images: [
          'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80'
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Floral Blue', 'Rose Garden', 'Olive Green'],
        stock: 28,
        rating: 4.6,
        numReviews: 142,
        gender: 'Women',
        isFeatured: true
      },
      {
        name: 'Satin Slip Bodycon Dress',
        brand: 'H&M STYLE',
        category: catMap['womens-dresses']._id,
        categoryName: "Women's Dresses",
        description: 'Luxurious satin-finish bodycon dress with thin adjustable straps and subtle side slit. A wardrobe essential for date nights and parties.',
        price: 999,
        mrp: 2499,
        images: [
          'https://images.unsplash.com/photo-1566479179817-c0d5b4b3e1c5?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1551163943-3f7a54b9e5cf?auto=format&fit=crop&w=800&q=80'
        ],
        sizes: ['XS', 'S', 'M', 'L'],
        colors: ['Champagne', 'Midnight Black', 'Deep Wine'],
        stock: 20,
        rating: 4.4,
        numReviews: 87,
        gender: 'Women'
      },

      // Men's T-Shirts
      {
        name: 'Oversized Graphic Print Tee',
        brand: 'URBAN STREET',
        category: catMap['mens-tshirts']._id,
        categoryName: "Men's T-Shirts",
        description: '100% heavy-weight combed cotton oversized tee with premium high-density chest graphic print. Drop shoulder cut for that streetwear aesthetic.',
        price: 699,
        mrp: 1599,
        images: [
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80'
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Off White', 'Washed Black', 'Sky Blue'],
        stock: 45,
        rating: 4.7,
        numReviews: 208,
        gender: 'Men',
        isFeatured: true
      },
      {
        name: 'Classic Polo Collar T-Shirt',
        brand: 'LACOSTE STYLE',
        category: catMap['mens-tshirts']._id,
        categoryName: "Men's T-Shirts",
        description: 'Pique cotton polo shirt with ribbed collar and cuffs, embroidered logo detail. A timeless smart-casual essential.',
        price: 849,
        mrp: 1999,
        images: [
          'https://images.unsplash.com/photo-1588361861040-ac9b1018f6d5?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1604695573706-53170668f6a6?auto=format&fit=crop&w=800&q=80'
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Navy Blue', 'Forest Green', 'White'],
        stock: 35,
        rating: 4.5,
        numReviews: 135,
        gender: 'Men'
      },

      // Jeans & Trousers
      {
        name: 'Slim Fit Stretch Denim Jeans',
        brand: 'LEVI\'S STYLE',
        category: catMap['jeans-trousers']._id,
        categoryName: 'Jeans & Trousers',
        description: 'Mid-rise slim fit jeans in super-stretch 98% cotton 2% elastane denim. Four-pocket construction with clean hem finish. Goes from desk to weekend effortlessly.',
        price: 1499,
        mrp: 3499,
        images: [
          'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1475178626620-a4d074967452?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&w=800&q=80'
        ],
        sizes: ['28', '30', '32', '34', '36'],
        colors: ['Classic Blue', 'Dark Indigo', 'Light Wash'],
        stock: 40,
        rating: 4.6,
        numReviews: 322,
        gender: 'Men',
        isFeatured: true
      },
      {
        name: "Women's High-Waist Wide Leg Trousers",
        brand: 'MANGO STYLE',
        category: catMap['jeans-trousers']._id,
        categoryName: 'Jeans & Trousers',
        description: 'Elegant wide-leg high-waist trousers in flowing crepe fabric. Features a concealed zip and hook-and-eye closure. Pairs beautifully with fitted tops and blazers.',
        price: 1199,
        mrp: 2799,
        images: [
          'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80'
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Beige', 'Black', 'Dusty Pink'],
        stock: 25,
        rating: 4.5,
        numReviews: 98,
        gender: 'Women'
      },

      // Ethnic Wear
      {
        name: 'Embroidered Anarkali Kurta Set',
        brand: 'BIBA FESTIVE',
        category: catMap['ethnic-wear']._id,
        categoryName: 'Ethnic Wear',
        description: 'Stunning flared Anarkali kurta with intricate zari embroidery work at the neckline and hem. Comes with matching palazzo and dupatta. Ideal for festivals, pujas & family functions.',
        price: 2499,
        mrp: 5999,
        images: [
          'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1626497764746-6dc36546b388?auto=format&fit=crop&w=800&q=80'
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Mustard Yellow', 'Royal Blue', 'Deep Magenta'],
        stock: 18,
        rating: 4.8,
        numReviews: 175,
        gender: 'Women',
        isFeatured: true
      },
      {
        name: 'Printed Cotton Kurta for Men',
        brand: 'MANYAVAR CASUAL',
        category: catMap['ethnic-wear']._id,
        categoryName: 'Ethnic Wear',
        description: 'Comfortable pure cotton kurta with all-over block print pattern, mandarin collar and side slits. Perfect for everyday festive wear.',
        price: 899,
        mrp: 1999,
        images: [
          'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=800&q=80'
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Sky Blue Print', 'Maroon Block', 'Cream'],
        stock: 30,
        rating: 4.4,
        numReviews: 93,
        gender: 'Men'
      },

      // Kids' Clothing
      {
        name: "Kids' Dino Print Hoodie Set",
        brand: 'MOTHERCARE STYLE',
        category: catMap['kids-clothing']._id,
        categoryName: "Kids' Clothing",
        description: 'Super soft fleece hoodie and jogger set featuring an all-over dinosaur print. Anti-pill fabric, easy pull-on waist, thumb-hole cuffs.',
        price: 799,
        mrp: 1799,
        images: [
          'https://images.unsplash.com/photo-1543702781-12de73a4b40f?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?auto=format&fit=crop&w=800&q=80'
        ],
        sizes: ['2Y', '3Y', '4Y', '5Y', '6Y', '7Y'],
        colors: ['Green Dino', 'Navy Blue', 'Coral Red'],
        stock: 35,
        rating: 4.7,
        numReviews: 119,
        gender: 'Kids',
        isFeatured: true
      },

      // Jackets & Coats
      {
        name: 'Vintage Denim Trucker Jacket',
        brand: 'WRANGLER STYLE',
        category: catMap['jackets-coats']._id,
        categoryName: 'Jackets & Coats',
        description: 'Classic 100% cotton denim trucker jacket with dual chest pockets, adjustable side tabs and custom brass button-down closure. Lightly washed for that lived-in look.',
        price: 2199,
        mrp: 4999,
        images: [
          'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1605908502724-9093a79a6fa8?auto=format&fit=crop&w=800&q=80'
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Light Wash Blue', 'Dark Indigo', 'Black'],
        stock: 22,
        rating: 4.8,
        numReviews: 264,
        gender: 'Unisex',
        isFeatured: true
      },
      {
        name: 'Puffer Quilted Winter Jacket',
        brand: 'COLUMBIA STYLE',
        category: catMap['jackets-coats']._id,
        categoryName: 'Jackets & Coats',
        description: 'Lightweight yet super warm quilted puffer jacket with channel stitching, water-resistant nylon shell and a full-zip front. Ideal for chilly mornings and hill-station trips.',
        price: 2899,
        mrp: 6499,
        images: [
          'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=800&q=80'
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Olive Khaki', 'Russet Orange', 'Classic Black'],
        stock: 16,
        rating: 4.6,
        numReviews: 188,
        gender: 'Men'
      },

      // Sleepwear & Loungewear
      {
        name: 'Satin Printed Pyjama Lounge Set',
        brand: 'SILK & SLUMBER',
        category: catMap['sleepwear']._id,
        categoryName: 'Sleepwear & Loungewear',
        description: 'Ultra soft silk-satin shirt and pyjama lounge set with contrast piping detail and a relaxed fit. The perfect all-day loungewear.',
        price: 1199,
        mrp: 2799,
        images: [
          'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1584736286279-74d6f9a3a730?auto=format&fit=crop&w=800&q=80'
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Dusty Rose', 'Champagne Gold', 'Powder Blue'],
        stock: 24,
        rating: 4.6,
        numReviews: 78,
        gender: 'Women'
      },

      // Formal & Workwear
      {
        name: 'Tailored Single-Breasted Blazer',
        brand: 'U.S. POLO ASSN.',
        category: catMap['workwear']._id,
        categoryName: 'Formal & Workwear',
        description: 'Single-breasted formal blazer crafted from breathable premium wool-blend fabric with double back vents, notch lapels and two-button closure. An office wardrobe classic.',
        price: 3499,
        mrp: 6999,
        images: [
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1519567770579-c2fc5836a95b?auto=format&fit=crop&w=800&q=80'
        ],
        sizes: ['38', '40', '42', '44', '46'],
        colors: ['Charcoal Gray', 'Navy Blue', 'Camel Beige'],
        stock: 14,
        rating: 4.8,
        numReviews: 185,
        gender: 'Men',
        isFeatured: true
      },
      {
        name: "Women's Formal Shirt Dress",
        brand: 'AND STYLE',
        category: catMap['workwear']._id,
        categoryName: 'Formal & Workwear',
        description: 'Sophisticated shirt-collar dress in dobby weave fabric with long sleeves, waist-tie belt and concealed button placket. Ideal for boardroom meetings and corporate events.',
        price: 1799,
        mrp: 3999,
        images: [
          'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=800&q=80'
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Classic White', 'Powder Blue Stripe', 'Charcoal'],
        stock: 19,
        rating: 4.5,
        numReviews: 102,
        gender: 'Women'
      },

      // Activewear & Sportswear
      {
        name: 'High-Waist Yoga Leggings',
        brand: 'NIKE STYLE',
        category: catMap['activewear']._id,
        categoryName: 'Activewear & Sportswear',
        description: '4-way stretch moisture-wicking leggings with ultra-high waistband, hidden waist pocket and flat inner seams for zero-chafe comfort during yoga, running and gym sessions.',
        price: 1299,
        mrp: 2999,
        images: [
          'https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1581009137042-c552e485697a?auto=format&fit=crop&w=800&q=80'
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Jet Black', 'Deep Navy', 'Mauve'],
        stock: 38,
        rating: 4.7,
        numReviews: 296,
        gender: 'Women',
        isFeatured: true
      },
      {
        name: "Men's Dry-Fit Training Shorts",
        brand: 'ADIDAS STYLE',
        category: catMap['activewear']._id,
        categoryName: 'Activewear & Sportswear',
        description: 'Lightweight recycled-polyester shorts with built-in brief liner, 7" inseam and zip side pockets. Designed for running, HIIT training and outdoor sports.',
        price: 799,
        mrp: 1799,
        images: [
          'https://images.unsplash.com/photo-1591195853828-11db59a44f43?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1556906781-9a412961a9a2?auto=format&fit=crop&w=800&q=80'
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Black', 'Royal Blue', 'Charcoal'],
        stock: 42,
        rating: 4.5,
        numReviews: 167,
        gender: 'Men'
      },

      // Casual Everyday
      {
        name: 'Heavyweight Oversized Fleece Hoodie',
        brand: 'URBAN STREET',
        category: catMap['casual-styles']._id,
        categoryName: 'Casual Everyday',
        description: '380 GSM brushed fleece-lined cotton hoodie with kangaroo pouch pocket, ribbed cuffs and boxy relaxed silhouette. Unisex drop-shoulder cut for that perfect casual look.',
        price: 1399,
        mrp: 3199,
        images: [
          'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1509942774463-acf339cf87d5?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?auto=format&fit=crop&w=800&q=80'
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Off White', 'Washed Black', 'Sage Green', 'Dusty Peach'],
        stock: 32,
        rating: 4.7,
        numReviews: 189,
        gender: 'Unisex',
        isFeatured: true
      },
      {
        name: "Women's Floral Co-ord Set",
        brand: 'ONLY STYLE',
        category: catMap['casual-styles']._id,
        categoryName: 'Casual Everyday',
        description: 'Matching two-piece co-ord set featuring a cropped tank top and wide-leg pants in a vibrant floral print. Lightweight viscose fabric keeps you cool and stylish all day.',
        price: 1599,
        mrp: 3499,
        images: [
          'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80'
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Tropical Floral', 'Soft Lavender', 'Terracotta Bloom'],
        stock: 20,
        rating: 4.6,
        numReviews: 113,
        gender: 'Women'
      }
    ];

    const createdProducts = await Product.insertMany(sampleProducts);

    console.log('[Seed] Inserting coupons...');
    await Coupon.insertMany([
      {
        code: 'EXTRAD300',
        discountType: 'flat',
        discountValue: 300,
        minOrderValue: 999,
        expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        isActive: true,
        description: 'Flat ₹300 OFF on orders above ₹999'
      },
      {
        code: 'WELCOME100',
        discountType: 'flat',
        discountValue: 100,
        minOrderValue: 499,
        expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        isActive: true,
        description: 'Flat ₹100 OFF on your first Extrad order'
      },
      {
        code: 'FASHION20',
        discountType: 'percentage',
        discountValue: 20,
        minOrderValue: 1499,
        maxDiscount: 500,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true,
        description: '20% OFF up to ₹500 on fashion orders above ₹1499'
      }
    ]);

    console.log('[Seed] Inserting initial reviews...');
    await Review.create({
      product: createdProducts[0]._id,
      user: normalUser._id,
      userName: 'Rahul Sharma',
      rating: 5,
      comment: 'Absolutely stunning quality bag! Stitching is neat and shipping took only 2 days. Highly recommended!'
    });

    console.log('[Seed] Seed completed successfully!');
    console.log('----------------------------------------------------');
    console.log('Demo Credentials:');
    console.log('Admin User: admin@extrad.com / admin123');
    console.log('Normal User: user@extrad.com / user123');
    console.log('Active Coupons: EXTRAD300, WELCOME100, FASHION20');
    console.log('----------------------------------------------------');
  } catch (error) {
    console.error('[Seed Error]:', error);
    throw error;
  }
};

const seedData = async () => {
  try {
    await connectDB();
    await populateInitialData();
    process.exit(0);
  } catch (err) {
    process.exit(1);
  }
};

if (require.main === module) {
  seedData();
}

module.exports = { populateInitialData, seedData };
