/**
 * Products Data - Tajawaz Solutions
 * Data produk digital untuk katalog
 * 
 * CARA MENAMBAH PRODUK BARU:
 * 1. Tambahkan object baru ke array productsData
 * 2. Pastikan ID unik
 * 3. Upload image produk ke assets/images/products/
 * 4. Save file ini - produk otomatis muncul!
 */

const productsData = [
  {
    id: 1,
    title: "Blueprint Bisnis Digital Komprehensif",
    category: "E-book",
    description: "Panduan lengkap membangun bisnis digital dari nol hingga profit. Hasil dari 50+ bisnis yang kami jalankan dengan profit terukur.",
    price: "Rp 297.000",
    originalPrice: "Rp 497.000",
    image: "./assets/images/dummy-img-600x400.jpg",
    link: "#",
    tags: ["bisnis-online", "pemula", "blueprint", "strategi"],
    featured: true,
    badge: "Best Seller"
  },
  {
    id: 2,
    title: "Masterclass Instagram Marketing 2025",
    category: "Course",
    description: "Strategi marketing di Instagram yang terbukti menghasilkan konversi. Dari content strategy hingga ads optimization.",
    price: "Rp 497.000",
    originalPrice: "Rp 797.000",
    image: "./assets/images/dummy-img-600x400.jpg",
    link: "#",
    tags: ["marketing", "instagram", "social-media", "ads"],
    featured: true,
    badge: "New"
  },
  {
    id: 3,
    title: "Template Bisnis Plan Profesional",
    category: "Template",
    description: "Template bisnis plan siap pakai untuk pitching ke investor atau partner. Sudah digunakan untuk raih funding miliaran rupiah.",
    price: "Rp 197.000",
    originalPrice: "",
    image: "./assets/images/dummy-img-600x400.jpg",
    link: "#",
    tags: ["template", "bisnis-plan", "pitching", "investor"],
    featured: false,
    badge: ""
  },
  {
    id: 4,
    title: "Sales Funnel Builder Kit",
    category: "Tools",
    description: "Template dan tools untuk membangun sales funnel yang converting. Termasuk email sequences, landing page templates, dan tracking sheet.",
    price: "Rp 397.000",
    originalPrice: "Rp 597.000",
    image: "./assets/images/dummy-img-600x400.jpg",
    link: "#",
    tags: ["sales-funnel", "conversion", "tools", "marketing"],
    featured: true,
    badge: "Popular"
  },
  {
    id: 5,
    title: "E-book: Copywriting yang Menjual",
    category: "E-book",
    description: "Teknik copywriting praktis untuk meningkatkan conversion rate. Framework AIDA, PAS, dan metode lain yang proven work.",
    price: "Rp 147.000",
    originalPrice: "",
    image: "./assets/images/dummy-img-600x400.jpg",
    link: "#",
    tags: ["copywriting", "marketing", "conversion", "writing"],
    featured: false,
    badge: ""
  },
  {
    id: 6,
    title: "Course: Financial Management untuk Entrepreneur",
    category: "Course",
    description: "Kelola keuangan bisnis dengan benar dari hari pertama. Dari cash flow management hingga dasar-dasar investasi untuk scale up.",
    price: "Rp 597.000",
    originalPrice: "Rp 897.000",
    image: "./assets/images/dummy-img-600x400.jpg",
    link: "#",
    tags: ["financial", "management", "investasi", "cash-flow"],
    featured: false,
    badge: ""
  },
  {
    id: 7,
    title: "Content Calendar Template Pro",
    category: "Template",
    description: "Template content calendar untuk 12 bulan dengan analisa performance. Tersedia untuk Instagram, TikTok, dan YouTube.",
    price: "Rp 97.000",
    originalPrice: "",
    image: "./assets/images/dummy-img-600x400.jpg",
    link: "#",
    tags: ["content", "social-media", "planning", "template"],
    featured: false,
    badge: ""
  },
  {
    id: 8,
    title: "Automation Tools Starter Pack",
    category: "Tools",
    description: "Kumpulan tools dan script untuk automasi bisnis online. Termasuk chatbot templates, email automation, dan workflow optimization.",
    price: "Rp 447.000",
    originalPrice: "Rp 647.000",
    image: "./assets/images/dummy-img-600x400.jpg",
    link: "#",
    tags: ["automation", "efficiency", "tools", "productivity"],
    featured: false,
    badge: ""
  },
  {
    id: 9,
    title: "E-book: Strategi Pricing yang Profitable",
    category: "E-book",
    description: "Panduan lengkap pricing strategy untuk maksimalkan profit tanpa mengorbankan value. Termasuk psychological pricing techniques.",
    price: "Rp 177.000",
    originalPrice: "",
    image: "./assets/images/dummy-img-600x400.jpg",
    link: "#",
    tags: ["pricing", "strategy", "profit", "value"],
    featured: false,
    badge: ""
  },
  {
    id: 10,
    title: "Bundle: Complete Entrepreneur Toolkit",
    category: "Bundle",
    description: "Paket lengkap semua tools, templates, dan e-books untuk kickstart bisnis Anda. Hemat 60% dari harga satuan!",
    price: "Rp 1.497.000",
    originalPrice: "Rp 3.747.000",
    image: "./assets/images/dummy-img-600x400.jpg",
    link: "#",
    tags: ["bundle", "complete", "all-in-one", "value"],
    featured: true,
    badge: "Best Value"
  }
];

// Export untuk digunakan di file lain
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { productsData };
}
