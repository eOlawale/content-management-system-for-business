import { Customer, Product, BankConnection, Theme, Campaign, CountryConfig, LogisticsProvider, Post, Page, User, MediaItem } from "../types";

export const mockCustomers: Customer[] = [
  {
    id: "c1",
    name: "Elena Rossi",
    email: "elena@milandesign.it",
    company: "Milan Design Studio",
    location: "Milan, Italy",
    currency: "EUR",
    ltv: 12500,
    status: "Active",
    lastInteraction: "2023-10-24"
  },
  {
    id: "c2",
    name: "Takeshi Yamamoto",
    email: "t.yamamoto@techkyoto.jp",
    company: "Kyoto Tech Innovations",
    location: "Kyoto, Japan",
    currency: "JPY",
    ltv: 4500000, // ~30k USD
    status: "Active",
    lastInteraction: "2023-10-25"
  },
  {
    id: "c3",
    name: "Sarah Jenkins",
    email: "sarah@austinretail.com",
    company: "Austin Retail Group",
    location: "Austin, USA",
    currency: "USD",
    ltv: 8200,
    status: "Lead",
    lastInteraction: "2023-10-20"
  },
  {
    id: "c4",
    name: "Hans Mueller",
    email: "h.mueller@berlinauto.de",
    company: "Berlin Auto Parts",
    location: "Berlin, Germany",
    currency: "EUR",
    ltv: 18900,
    status: "Active",
    lastInteraction: "2023-10-26"
  },
  {
    id: "c5",
    name: "Chen Wei",
    email: "wei.chen@shanghaitrading.cn",
    company: "Shanghai Trading Co",
    location: "Shanghai, China",
    currency: "CNY",
    ltv: 85000,
    status: "Churned",
    lastInteraction: "2023-09-15"
  }
];

export const mockProducts: Product[] = [
  {
    id: "p1",
    name: "Ergonomic Office Chair X1",
    price: 450,
    stock: 24,
    category: "Furniture",
    description: "High-end ergonomic chair suitable for long working hours.",
    sku: "FUR-CH-001"
  },
  {
    id: "p2",
    name: "Wireless Noise Cancelling Headset",
    price: 299,
    stock: 150,
    category: "Electronics",
    description: "Premium sound quality with active noise cancellation.",
    sku: "ELE-HD-002"
  },
  {
    id: "p3",
    name: "Smart Coffee Maker Pro",
    price: 1200,
    stock: 5,
    category: "Appliances",
    description: "IoT enabled coffee maker for the modern office.",
    sku: "APP-CO-003"
  }
];

export const mockBanks: BankConnection[] = [
  {
    id: "b1",
    bankName: "Chase Manhattan",
    region: "North America",
    status: "Connected",
    currency: "USD"
  },
  {
    id: "b2",
    bankName: "Deutsche Bank",
    region: "Europe",
    status: "Connected",
    currency: "EUR"
  },
  {
    id: "b3",
    bankName: "SMBC (Sumitomo Mitsui)",
    region: "Asia Pacific",
    status: "Pending",
    currency: "JPY"
  },
  {
    id: "b4",
    bankName: "HSBC UK",
    region: "UK",
    status: "Error",
    currency: "GBP"
  }
];

export const mockThemes: Theme[] = [
  { 
    id: 't1', 
    name: 'Nexus Minimal', 
    description: 'Clean, whitespace-heavy design for luxury brands.', 
    previewColor: 'from-slate-100 to-slate-200', 
    tags: ['Minimalist', 'Fashion'] 
  },
  { 
    id: 't2', 
    name: 'Global Bazaar', 
    description: 'Vibrant layout optimized for high-volume catalogs.', 
    previewColor: 'from-orange-100 to-red-100', 
    tags: ['Retail', 'Colorful'] 
  },
  { 
    id: 't3', 
    name: 'Tech Dark', 
    description: 'Sleek dark mode theme for electronics and SaaS.', 
    previewColor: 'from-slate-800 to-slate-900', 
    tags: ['Tech', 'Dark Mode'] 
  },
  { 
    id: 't4', 
    name: 'Artisan Kraft', 
    description: 'Warm tones and serif fonts for handmade goods.', 
    previewColor: 'from-amber-50 to-orange-50', 
    tags: ['Handmade', 'Cozy'] 
  },
];

export const mockCampaigns: Campaign[] = [
  { 
    id: 'cam1', 
    name: 'Black Friday Early Access', 
    type: 'Email', 
    status: 'Completed', 
    automationTrigger: 'Nov 20th',
    metrics: { sent: 15000, opened: 4500, clicked: 1200, revenue: 45000 } 
  },
  { 
    id: 'cam2', 
    name: 'Cart Abandonment Recovery', 
    type: 'SMS', 
    status: 'Active', 
    automationTrigger: 'Abandoned > 1hr',
    metrics: { sent: 340, clicked: 85, revenue: 1200 } 
  },
  { 
    id: 'cam3', 
    name: 'Spring Collection Teaser', 
    type: 'Social', 
    status: 'Draft', 
    automationTrigger: 'Manual',
    metrics: { sent: 0, revenue: 0 } 
  },
];

export const mockCountries: CountryConfig[] = [
  { code: 'US', name: 'United States', currency: 'USD', currencySymbol: '$', taxRate: 0.08, taxName: 'Sales Tax' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP', currencySymbol: '£', taxRate: 0.20, taxName: 'VAT' },
  { code: 'DE', name: 'Germany', currency: 'EUR', currencySymbol: '€', taxRate: 0.19, taxName: 'VAT' },
  { code: 'JP', name: 'Japan', currency: 'JPY', currencySymbol: '¥', taxRate: 0.10, taxName: 'Consumption Tax' },
  { code: 'CA', name: 'Canada', currency: 'CAD', currencySymbol: 'C$', taxRate: 0.13, taxName: 'HST' },
  { code: 'AU', name: 'Australia', currency: 'AUD', currencySymbol: 'A$', taxRate: 0.10, taxName: 'GST' },
];

export const mockLogistics: LogisticsProvider[] = [
  { id: 'l1', name: 'DHL Express', type: 'Express', status: 'Active', baseRate: 25.00, deliveryDays: '1-3 Days', regions: ['Global'] },
  { id: 'l2', name: 'FedEx International', type: 'Standard', status: 'Active', baseRate: 18.50, deliveryDays: '3-5 Days', regions: ['North America', 'Europe'] },
  { id: 'l3', name: 'Maersk Freight', type: 'Freight', status: 'Inactive', baseRate: 150.00, deliveryDays: '14-30 Days', regions: ['Global'] },
  { id: 'l4', name: 'Royal Mail', type: 'Standard', status: 'Active', baseRate: 5.00, deliveryDays: '2-4 Days', regions: ['UK', 'Europe'] },
  { id: 'l5', name: 'Yamato Transport', type: 'Standard', status: 'Active', baseRate: 8.00, deliveryDays: '1-2 Days', regions: ['Asia Pacific'] },
];

export const mockPosts: Post[] = [
  { id: 'po1', title: '10 Trends in Global Commerce', author: 'John Doe', category: 'Business', tags: ['Trends', '2024'], date: '2023-11-01', status: 'Published' },
  { id: 'po2', title: 'Why Design Matters', author: 'Elena Rossi', category: 'Design', tags: ['UX', 'UI'], date: '2023-11-05', status: 'Draft' },
  { id: 'po3', title: 'Our Sustainable Journey', author: 'Sarah Jenkins', category: 'Company', tags: ['Eco', 'Green'], date: '2023-11-10', status: 'Scheduled' },
];

export const mockPages: Page[] = [
  { id: 'pg1', title: 'About Us', author: 'John Doe', date: '2023-01-15', status: 'Published' },
  { id: 'pg2', title: 'Contact', author: 'John Doe', date: '2023-01-15', status: 'Published' },
  { id: 'pg3', title: 'Privacy Policy', author: 'Admin', date: '2023-02-01', status: 'Published' },
  { id: 'pg4', title: 'Terms of Service', author: 'Admin', date: '2023-02-01', status: 'Published' },
];

export const mockUsers: User[] = [
  { id: 'u1', username: 'admin', name: 'John Doe', email: 'john@nexuscore.com', role: 'Administrator', avatarColor: 'bg-purple-500' },
  { id: 'u2', username: 'elena_r', name: 'Elena Rossi', email: 'elena@milandesign.it', role: 'Editor', avatarColor: 'bg-blue-500' },
  { id: 'u3', username: 'writer_sarah', name: 'Sarah Jenkins', email: 'sarah@austinretail.com', role: 'Author', avatarColor: 'bg-green-500' },
];

export const mockMedia: MediaItem[] = [
  { id: 'm1', name: 'hero-banner.jpg', type: 'Image', url: '#', size: '2.4 MB', date: '2023-10-10' },
  { id: 'm2', name: 'product-catalog.pdf', type: 'Document', url: '#', size: '15 MB', date: '2023-10-12' },
  { id: 'm3', name: 'promo-video.mp4', type: 'Video', url: '#', size: '45 MB', date: '2023-11-01' },
  { id: 'm4', name: 'logo-transparent.png', type: 'Image', url: '#', size: '0.5 MB', date: '2023-01-15' },
];
