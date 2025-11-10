import bottleImg from '../assets/img/botol stainsless.jpg'
import toothbrushImg from '../assets/img/sikat gigi bambu premium.jpg'
import toteImg from '../assets/img/tas belanja katun organik.avif'
import lampImg from '../assets/img/lampu taman tenaga surya.jpg'
import tablewareImg from '../assets/img/peralatan makan.jpg'
import sleeveImg from '../assets/img/sleeve laptop.avif'
import matImg from '../assets/img/matras yoga.jpg'
import cleanerImg from '../assets/img/citrus enzyme.jpg'

const products = [
  {
    id: 1,
    price: 85000,
    category: 'Lifestyle',
    imageURL: bottleImg,
    stock: 40,
    translations: {
      en: {
        name: 'Eco Stainless Drink Bottle',
        category: 'Lifestyle',
        description:
          'Durable stainless-steel drink bottle that keeps beverages at the ideal temperature and cuts single-use plastic.',
      },
      id: {
        name: 'Botol Minum Stainless Eco',
        category: 'Gaya Hidup',
        description:
          'Botol minum ramah lingkungan berbahan stainless steel, menjaga suhu minuman tetap ideal dan mengurangi limbah plastik sekali pakai.',
      },
    },
  },
  {
    id: 2,
    price: 15000,
    category: 'Personal Care',
    imageURL: toothbrushImg,
    stock: 60,
    translations: {
      en: {
        name: 'Premium Bamboo Toothbrush',
        category: 'Personal Care',
        description:
          'Soft-bristled bamboo toothbrush that is naturally antimicrobial and gentle on the gums.',
      },
      id: {
        name: 'Sikat Gigi Bambu Premium',
        category: 'Perawatan Diri',
        description:
          'Sikat gigi bambu dengan bulu lembut alami, higienis, dan ramah lingkungan untuk perawatan gigi harian.',
      },
    },
  },
  {
    id: 3,
    price: 42000,
    category: 'Fashion',
    imageURL: toteImg,
    stock: 45,
    translations: {
      en: {
        name: 'Organic Cotton Shopping Tote',
        category: 'Fashion',
        description:
          'Spacious tote bag made from pure organic cotton, perfect for grocer trips and daily carry.',
      },
      id: {
        name: 'Tas Belanja Katun Organik',
        category: 'Mode',
        description:
          'Tas tote lapang dari 100% katun organik, kuat untuk belanja harian sekaligus gaya yang sederhana.',
      },
    },
  },
  {
    id: 4,
    price: 120000,
    category: 'Home',
    imageURL: lampImg,
    stock: 18,
    translations: {
      en: {
        name: 'Aurora Solar Garden Lamp',
        category: 'Home',
        description:
          'Weather-resistant solar lamp that illuminates outdoor spaces automatically with stored sunlight.',
      },
      id: {
        name: 'Lampu Taman Tenaga Surya Aurora',
        category: 'Rumah',
        description:
          'Lampu taman tahan cuaca dengan panel surya yang menyala otomatis di malam hari, hemat energi dan bebas listrik.',
      },
    },
  },
  {
    id: 5,
    price: 65000,
    category: 'Kitchen',
    imageURL: tablewareImg,
    stock: 32,
    translations: {
      en: {
        name: 'Lestari Wooden Tableware Set',
        category: 'Kitchen',
        description:
          'Smooth teak tableware set finished with food-safe oil for sustainable dining.',
      },
      id: {
        name: 'Peralatan Makan Kayu Lestari',
        category: 'Dapur',
        description:
          'Set peralatan makan kayu jati dengan finishing food grade, menambah hangatnya meja makan ramah lingkungan.',
      },
    },
  },
  {
    id: 6,
    price: 180000,
    category: 'Tech Accessories',
    imageURL: sleeveImg,
    stock: 26,
    translations: {
      en: {
        name: 'Natural Fiber Laptop Sleeve',
        category: 'Tech Accessories',
        description:
          'Laptop sleeve crafted from woven natural fibers with recycled felt padding for daily commutes.',
      },
      id: {
        name: 'Sleeve Laptop Serat Alam',
        category: 'Aksesori Teknologi',
        description:
          'Sleeve laptop dari serat alam tenun dengan lapisan felt daur ulang, ringan dibawa dan melindungi perangkat.',
      },
    },
  },
  {
    id: 7,
    price: 175000,
    category: 'Fitness',
    imageURL: matImg,
    stock: 22,
    translations: {
      en: {
        name: 'Natural Rubber Harmony Mat',
        category: 'Fitness',
        description:
          'Grip-focused yoga mat made from natural rubber and jute for mindful flows.',
      },
      id: {
        name: 'Matras Yoga Karet Alam',
        category: 'Kebugaran',
        description:
          'Matras yoga anti-slip dari karet alam dan serat goni yang menopang pose dengan stabil dan nyaman.',
      },
    },
  },
  {
    id: 8,
    price: 55000,
    category: 'Home Care',
    imageURL: cleanerImg,
    stock: 38,
    translations: {
      en: {
        name: 'Citrus Plant-Based Cleaning Kit',
        category: 'Home Care',
        description:
          'Plant-based cleaning kit with citrus enzymes that refresh surfaces without harsh chemicals.',
      },
      id: {
        name: 'Kit Pembersih Nabati Citrus',
        category: 'Perawatan Rumah',
        description:
          'Perlengkapan pembersih berbahan nabati dengan enzim citrus, efektif menghilangkan noda tanpa residu kimia keras.',
      },
    },
  },
]

const productsMap = new Map(products.map((product) => [product.id, product]))

export function getProductById(id) {
  return productsMap.get(Number(id))
}

export function localizeProduct(product, language = 'en') {
  if (!product) return null
  const translation = product.translations?.[language] || product.translations?.en
  if (!translation) {
    return product
  }
  return {
    ...product,
    name: translation.name,
    description: translation.description,
    categoryLabel: translation.category,
  }
}

export function getLocalizedProducts(language = 'en') {
  return products.map((product) => localizeProduct(product, language))
}

export default products
