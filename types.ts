export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  location: string;
  currency: string;
  ltv: number; // Lifetime Value
  status: 'Active' | 'Lead' | 'Churned';
  lastInteraction: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
  sku: string;
}

export interface BankConnection {
  id: string;
  bankName: string;
  region: string;
  status: 'Connected' | 'Pending' | 'Error';
  currency: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  previewColor: string;
  tags: string[];
}

export interface Campaign {
  id: string;
  name: string;
  type: 'Email' | 'SMS' | 'Social';
  status: 'Scheduled' | 'Active' | 'Completed' | 'Draft';
  automationTrigger?: string;
  metrics: {
    sent: number;
    opened?: number;
    clicked?: number;
    revenue: number;
  };
}

export interface CountryConfig {
  code: string;
  name: string;
  currency: string;
  currencySymbol: string;
  taxRate: number;
  taxName: string; // VAT, GST, Sales Tax
}

export interface LogisticsProvider {
  id: string;
  name: string;
  type: 'Express' | 'Standard' | 'Freight';
  status: 'Active' | 'Inactive';
  baseRate: number;
  deliveryDays: string;
  regions: string[];
}

export interface Post {
  id: string;
  title: string;
  author: string;
  category: string;
  tags: string[];
  date: string;
  status: 'Published' | 'Draft' | 'Scheduled';
}

export interface Page {
  id: string;
  title: string;
  author: string;
  date: string;
  status: 'Published' | 'Draft';
}

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: 'Administrator' | 'Editor' | 'Author' | 'Contributor' | 'Subscriber';
  avatarColor: string;
}

export interface MediaItem {
  id: string;
  name: string;
  type: 'Image' | 'Document' | 'Video';
  url: string; // In a real app this is a URL, here we might simulate or use placeholder
  size: string;
  date: string;
}

export enum View {
  DASHBOARD = 'DASHBOARD',
  POSTS = 'POSTS',
  PAGES = 'PAGES',
  PRODUCTS = 'PRODUCTS', // Includes Media Library
  CRM = 'CRM',
  PAYMENTS = 'PAYMENTS',
  MARKETING = 'MARKETING',
  LOGISTICS = 'LOGISTICS',
  APPEARANCE = 'APPEARANCE', // Replaces Storefront
  USERS = 'USERS',
  TOOLS = 'TOOLS',
  SETTINGS = 'SETTINGS',
  POS = 'POS',
  ANALYTICS = 'ANALYTICS'
}
