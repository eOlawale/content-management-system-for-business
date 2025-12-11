import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  LayoutDashboard, Users, Package, CreditCard, Settings as SettingsIcon, Globe, MessageSquare, Send, Sparkles, Search, Bell, ArrowUpRight, TrendingUp, MapPin, RefreshCw, MoreHorizontal, Palette, Megaphone, UploadCloud, Image as ImageIcon, Plus, X, CheckCircle2, Truck, Building2, Calculator, AlertCircle, FileText, PenTool, Wrench, ChevronDown, ChevronRight, LayoutTemplate, Code, Image, UserPlus, User, Download, Upload, Activity, Trash2, Eye, Lock, Globe2, MessageCircle, Link, Move, Smartphone, BarChart3, Server, ShieldCheck, Wifi, Bitcoin, Banknote, Percent, Box, Layers, ShoppingBag, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Share2, Hash, Zap
} from 'lucide-react';

import { Customer, Product, BankConnection, View, ChatMessage, Theme, Campaign, CountryConfig, LogisticsProvider, Post, Page, User as UserType, MediaItem } from './types';
import { mockCustomers, mockProducts, mockBanks, mockThemes, mockCampaigns, mockCountries, mockLogistics, mockPosts, mockPages, mockUsers, mockMedia } from './services/mockData';
import { sendMessageToWinn, generateProductDescription, analyzeCustomerSegment, generateMarketingContent, generateSEOData, generateViralPost } from './services/geminiService';

// --- Components ---

const RichTextEditor = ({ initialValue = '', onChange, placeholder = 'Start writing...' }: { initialValue?: string, onChange: (html: string) => void, placeholder?: string }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isEmpty, setIsEmpty] = useState(!initialValue);

  useEffect(() => {
    if (editorRef.current && initialValue && editorRef.current.innerHTML !== initialValue) {
        editorRef.current.innerHTML = initialValue;
        setIsEmpty(false);
    }
  }, [initialValue]);

  const exec = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
        setIsEmpty(editorRef.current.innerHTML.trim() === '' || editorRef.current.innerHTML === '<br>');
    }
    editorRef.current?.focus();
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
      const html = e.currentTarget.innerHTML;
      onChange(html);
      setIsEmpty(html.trim() === '' || html === '<br>');
  };

  const ToolButton = ({ icon, onClick }: { icon: React.ReactNode, onClick: () => void }) => (
    <button onMouseDown={(e) => { e.preventDefault(); onClick(); }} className="p-1.5 rounded text-slate-500 hover:bg-slate-200">{icon}</button>
  );

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white flex flex-col h-full shadow-sm focus-within:ring-2 focus-within:ring-blue-100 transition-shadow">
      <div className="flex items-center gap-1 p-2 border-b border-slate-100 bg-slate-50 flex-wrap">
        <ToolButton icon={<Bold className="w-4 h-4"/>} onClick={() => exec('bold')} />
        <ToolButton icon={<Italic className="w-4 h-4"/>} onClick={() => exec('italic')} />
        <ToolButton icon={<Underline className="w-4 h-4"/>} onClick={() => exec('underline')} />
        <div className="w-px h-4 bg-slate-300 mx-1" />
        <ToolButton icon={<AlignLeft className="w-4 h-4"/>} onClick={() => exec('justifyLeft')} />
        <ToolButton icon={<AlignCenter className="w-4 h-4"/>} onClick={() => exec('justifyCenter')} />
        <ToolButton icon={<AlignRight className="w-4 h-4"/>} onClick={() => exec('justifyRight')} />
        <div className="w-px h-4 bg-slate-300 mx-1" />
        <ToolButton icon={<List className="w-4 h-4"/>} onClick={() => exec('insertUnorderedList')} />
        <ToolButton icon={<ListOrdered className="w-4 h-4"/>} onClick={() => exec('insertOrderedList')} />
      </div>
      <div className="flex-1 relative cursor-text bg-white" onClick={() => editorRef.current?.focus()}>
         {isEmpty && <div className="absolute top-4 left-4 text-slate-300 pointer-events-none select-none">{placeholder}</div>}
        <div ref={editorRef} className="w-full h-full p-4 outline-none overflow-y-auto prose prose-sm max-w-none text-slate-700" contentEditable onInput={handleInput} role="textbox" />
      </div>
    </div>
  );
};

const Sidebar = ({ currentView, setView }: { currentView: View, setView: (v: View) => void }) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ 'Content': true, 'Commerce': true, 'System': false });
  const toggleGroup = (group: string) => setExpanded(prev => ({...prev, [group]: !prev[group]}));

  const menuGroups = [
    { title: 'Main', items: [{ id: View.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard }, { id: View.ANALYTICS, label: 'Analytics', icon: BarChart3 }] },
    { title: 'Content', items: [{ id: View.POSTS, label: 'Posts', icon: PenTool }, { id: View.PAGES, label: 'Pages', icon: FileText }] },
    { title: 'Commerce', items: [{ id: View.PRODUCTS, label: 'Products', icon: Package }, { id: View.POS, label: 'Point of Sale', icon: Smartphone }, { id: View.CRM, label: 'CRM', icon: Users }, { id: View.PAYMENTS, label: 'Payments', icon: CreditCard }, { id: View.LOGISTICS, label: 'Logistics', icon: Truck }, { id: View.MARKETING, label: 'Marketing', icon: Megaphone }] },
    { title: 'System', items: [{ id: View.APPEARANCE, label: 'Appearance', icon: Palette }, { id: View.USERS, label: 'Users', icon: User }, { id: View.TOOLS, label: 'Tools', icon: Wrench }, { id: View.SETTINGS, label: 'Settings', icon: SettingsIcon }] }
  ];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-full shadow-xl z-20 overflow-y-auto scrollbar-hide">
      <div className="p-6 flex items-center space-x-2 sticky top-0 bg-slate-900 z-10">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center"><Globe className="w-5 h-5 text-white" /></div>
        <span className="text-xl font-bold tracking-tight">NexusCore</span>
      </div>
      <nav className="flex-1 px-4 pb-4 space-y-6">
        {menuGroups.map((group) => (
          <div key={group.title}>
            {group.title !== 'Main' && (
              <button onClick={() => toggleGroup(group.title)} className="flex items-center justify-between w-full text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 hover:text-slate-300">
                {group.title}
                {expanded[group.title] ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </button>
            )}
            {(group.title === 'Main' || expanded[group.title]) && (
              <div className="space-y-1">
                {group.items.map((item) => (
                  <button key={item.id} onClick={() => setView(item.id)} className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${currentView === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                    <item.icon className="w-4 h-4" /><span className="font-medium text-sm">{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800 sticky bottom-0 bg-slate-900">
        <div className="flex items-center space-x-3 bg-slate-800 p-3 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold">JD</div>
          <div className="flex-1 overflow-hidden"><p className="text-sm font-medium truncate">John Doe</p><p className="text-xs text-slate-400 truncate">Admin</p></div>
        </div>
      </div>
    </div>
  );
};

const DashboardView = ({ customers, banks, country }: { customers: Customer[], banks: BankConnection[], country: CountryConfig }) => {
  const [geoLoc, setGeoLoc] = useState<string>("Locating...");
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => { setGeoLoc(`${position.coords.latitude.toFixed(2)}, ${position.coords.longitude.toFixed(2)}`); }, () => setGeoLoc("Location Unavailable"));
    }
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn">
      <header className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-slate-800">Global Overview</h1><p className="text-slate-500 flex items-center gap-1 text-sm mt-1"><MapPin className="w-3 h-3" /> HQ: {country.name} • Access Point: {geoLoc}</p></div>
        <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2"><ArrowUpRight className="w-4 h-4" /> Visit Site</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium shadow-md hover:bg-blue-700">Sync Banks</button>
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[{ label: 'Total Revenue', value: `${country.currencySymbol}2.4M`, change: '+12.5%', icon: TrendingUp, color: 'text-green-600' }, { label: 'Active Customers', value: customers.length.toString(), change: '+4', icon: Users, color: 'text-blue-600' }, { label: 'Cross-Border Vol', value: `${country.currencySymbol}850K`, change: '+22%', icon: Globe, color: 'text-purple-600' }, { label: 'Bank Connections', value: banks.filter(b => b.status === 'Connected').length.toString(), change: 'Stable', icon: CreditCard, color: 'text-slate-600' }].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4"><div className={`p-2 rounded-lg bg-opacity-10 ${stat.color.replace('text', 'bg')}`}><stat.icon className={`w-6 h-6 ${stat.color}`} /></div><span className="text-xs font-medium px-2 py-1 rounded-full bg-green-50 text-green-700">{stat.change}</span></div>
            <div><p className="text-sm text-slate-500 font-medium">{stat.label}</p><h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3></div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CRMView = ({ customers }: { customers: Customer[] }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const handleAnalyze = async () => {
    setLoading(true);
    const dataSummary = customers.map(c => `${c.name} (${c.location}), LTV: ${c.ltv} ${c.currency}`).join('; ');
    const result = await analyzeCustomerSegment(dataSummary);
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Customer Relationship Management</h1>
        <button onClick={handleAnalyze} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">{loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} Ask Winn to Analyze</button>
      </header>
      {analysis && (<div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl text-sm text-indigo-900"><h4 className="font-bold flex items-center gap-2 mb-2"><Sparkles className="w-4 h-4"/> Winn Analysis</h4><p className="whitespace-pre-wrap leading-relaxed">{analysis}</p></div>)}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200"><tr><th className="px-6 py-4">Customer</th><th className="px-6 py-4">Location</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">LTV</th><th className="px-6 py-4"></th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {customers.map(c => (
              <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4"><div><p className="font-medium text-slate-900">{c.name}</p><p className="text-xs text-slate-500">{c.company}</p></div></td>
                <td className="px-6 py-4 text-slate-600 flex items-center gap-2"><span className="text-lg">{c.location.includes('Italy') ? '🇮🇹' : c.location.includes('Japan') ? '🇯🇵' : c.location.includes('Germany') ? '🇩🇪' : c.location.includes('China') ? '🇨🇳' : '🇺🇸'}</span>{c.location}</td>
                <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${c.status === 'Active' ? 'bg-green-100 text-green-700' : c.status === 'Lead' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>{c.status}</span></td>
                <td className="px-6 py-4 text-right font-mono text-slate-700">{c.ltv.toLocaleString()} <span className="text-xs text-slate-400">{c.currency}</span></td>
                <td className="px-6 py-4 text-right"><button className="text-slate-400 hover:text-blue-600"><MoreHorizontal className="w-5 h-5" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ProductsView = ({ products, country, media }: { products: Product[], country: CountryConfig, media: MediaItem[] }) => {
  const [activeTab, setActiveTab] = useState<'products' | 'media' | 'collections'>('products');
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);
  const [descriptions, setDescriptions] = useState<Record<string, string>>({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [basePrice, setBasePrice] = useState<number | ''>('');
  const [newProductDesc, setNewProductDesc] = useState('');

  const handleGenerateDesc = async (id: string, name: string, category: string) => {
    setGeneratingFor(id);
    const desc = await generateProductDescription(name, category);
    setDescriptions(prev => ({ ...prev, [id]: desc }));
    setGeneratingFor(null);
  };
  const pricing = { platformFee: (Number(basePrice) || 0) * 0.05, taxAmount: (Number(basePrice) || 0) * country.taxRate, customerPrice: (Number(basePrice) || 0) * (1 + country.taxRate), payout: (Number(basePrice) || 0) * 0.95 };

  return (
    <div className="space-y-6 relative">
       <header className="flex justify-between items-center">
        <div className="flex items-center gap-4"><h1 className="text-2xl font-bold text-slate-800">Product Management</h1><div className="flex bg-white rounded-lg p-1 border border-slate-200"><button onClick={() => setActiveTab('products')} className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${activeTab === 'products' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}>Products</button><button onClick={() => setActiveTab('media')} className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${activeTab === 'media' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}>Media Library</button></div></div>
        <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2"><Plus className="w-4 h-4" /> Add Product</button>
      </header>
      {activeTab === 'products' && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(p => (
          <div key={p.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col group">
            <div className="h-40 bg-slate-100 flex items-center justify-center relative"><Package className="w-12 h-12 text-slate-300" /><div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-[10px] font-bold text-slate-600 shadow-sm">Stock: {p.stock}</div></div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2"><h3 className="font-bold text-slate-900">{p.name}</h3><span className="text-green-600 font-bold">{country.currencySymbol}{p.price}</span></div>
              <p className="text-xs text-slate-500 mb-4 uppercase tracking-wider">{p.category} • SKU: {p.sku}</p>
              <div className="flex-1"><p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3">{descriptions[p.id] || p.description}</p></div>
              <button onClick={() => handleGenerateDesc(p.id, p.name, p.category)} disabled={generatingFor === p.id} className="w-full mt-4 py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors flex items-center justify-center gap-2">{generatingFor === p.id ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />} {descriptions[p.id] ? 'Regenerate Description' : 'Enhance with Winn AI'}</button>
            </div>
          </div>
        ))}
      </div>
      )}
      {activeTab === 'media' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {media.map(item => (<div key={item.id} className="group relative border border-slate-200 rounded-lg p-2 hover:border-blue-300 transition-colors cursor-pointer"><div className="aspect-square bg-slate-100 rounded mb-2 flex items-center justify-center overflow-hidden"><ImageIcon className="w-8 h-8 text-slate-400" /></div><p className="text-xs font-medium text-slate-700 truncate">{item.name}</p></div>))}
                  <div className="border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center aspect-square hover:bg-slate-50 cursor-pointer text-slate-400 hover:text-blue-500 transition-colors"><UploadCloud className="w-8 h-8 mb-2" /><span className="text-xs font-bold">Upload</span></div>
              </div>
          </div>
      )}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
             <div className="p-4 border-b border-slate-100 flex justify-between items-center"><h2 className="text-lg font-bold text-slate-800">Add New Product</h2><button onClick={() => setIsAddModalOpen(false)}><X className="w-5 h-5 text-slate-400"/></button></div>
             <div className="p-6 space-y-6 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Product Name</label><input className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="e.g. Leather Bag"/></div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200"><h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2"><Calculator className="w-4 h-4"/> Pricing Engine</h4><input type="number" value={basePrice} onChange={(e) => setBasePrice(Number(e.target.value))} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm mb-2" placeholder="Base Price" /><div className="flex justify-between text-sm pt-2 border-t border-slate-200 font-bold"><span className="text-slate-700">Customer Price</span><span className="text-slate-900 font-mono">{country.currencySymbol}{pricing.customerPrice.toFixed(2)}</span></div></div>
                    </div>
                    <div className="space-y-4"><div className="h-48 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-center bg-slate-50"><UploadCloud className="w-6 h-6 text-blue-500 mb-2" /><p className="text-sm font-bold text-slate-700">Upload Images</p></div><div className="flex-1 min-h-[192px]"><RichTextEditor initialValue={newProductDesc} onChange={setNewProductDesc} placeholder="Product description..." /></div></div>
                </div>
             </div>
             <div className="p-4 bg-slate-50 flex justify-end gap-2 border-t border-slate-100"><button onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-slate-600 text-sm font-medium hover:bg-slate-200 rounded-lg">Cancel</button><button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 shadow-sm">Save Product</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

const PostsView = ({ posts }: { posts: Post[] }) => {
    const [subView, setSubView] = useState<'all' | 'add' | 'cats' | 'tags'>('all');
    const [newPostContent, setNewPostContent] = useState('');
    const [seoData, setSeoData] = useState({ title: '', description: '', keywords: '' });
    const [isGeneratingSEO, setIsGeneratingSEO] = useState(false);

    const handleGenerateSEO = async () => {
        setIsGeneratingSEO(true);
        const result = await generateSEOData(newPostContent);
        setSeoData({ title: result.title, description: result.description, keywords: result.keywords.join(', ') });
        setIsGeneratingSEO(false);
    };

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center"><h1 className="text-2xl font-bold text-slate-800">Posts</h1><div className="flex gap-2"><button onClick={() => setSubView('all')} className={`px-3 py-1 text-sm rounded-lg ${subView === 'all' ? 'bg-slate-200 font-bold' : 'text-slate-500'}`}>All Posts</button><button onClick={() => setSubView('add')} className={`px-3 py-1 text-sm rounded-lg ${subView === 'add' ? 'bg-slate-200 font-bold' : 'text-slate-500'}`}>Add New</button></div></header>
            {subView === 'all' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-left text-sm"><thead className="bg-slate-50 border-b border-slate-200"><tr><th className="px-6 py-3 font-medium text-slate-500">Title</th><th className="px-6 py-3 font-medium text-slate-500">Author</th><th className="px-6 py-3 font-medium text-slate-500">Status</th><th className="px-6 py-3 font-medium text-slate-500 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{posts.map(post => (<tr key={post.id} className="hover:bg-slate-50"><td className="px-6 py-4 font-bold text-slate-800">{post.title}</td><td className="px-6 py-4 text-slate-600">{post.author}</td><td className="px-6 py-4"><span className="px-2 py-1 rounded text-xs font-bold bg-green-100 text-green-700">{post.status}</span></td><td className="px-6 py-4 text-right"><Eye className="w-4 h-4 text-slate-400 inline" /></td></tr>))}</tbody></table>
                </div>
            )}
            {subView === 'add' && (
                 <div className="flex gap-6 h-[calc(100vh-200px)]">
                     <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                         <input className="text-3xl font-bold placeholder-slate-300 w-full border-none outline-none mb-6" placeholder="Add title" />
                         <div className="flex-1"><RichTextEditor initialValue={newPostContent} onChange={setNewPostContent} placeholder="Start writing your story..." /></div>
                     </div>
                     <div className="w-80 bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col gap-6 overflow-y-auto">
                        <div><h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Globe className="w-4 h-4"/> SEO Intelligence</h3>
                        <div className="space-y-4">
                            <div><label className="text-xs font-bold text-slate-500 uppercase">Meta Title</label><input value={seoData.title} onChange={e=>setSeoData({...seoData, title:e.target.value})} className="w-full border border-slate-200 rounded px-2 py-1 text-sm mt-1" /></div>
                            <div><label className="text-xs font-bold text-slate-500 uppercase">Meta Description</label><textarea value={seoData.description} onChange={e=>setSeoData({...seoData, description:e.target.value})} className="w-full border border-slate-200 rounded px-2 py-1 text-sm mt-1 h-20 resize-none" /></div>
                            <div><label className="text-xs font-bold text-slate-500 uppercase">Keywords</label><input value={seoData.keywords} onChange={e=>setSeoData({...seoData, keywords:e.target.value})} className="w-full border border-slate-200 rounded px-2 py-1 text-sm mt-1" /></div>
                            <button onClick={handleGenerateSEO} disabled={!newPostContent || isGeneratingSEO} className="w-full py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-bold hover:bg-indigo-100 flex items-center justify-center gap-2">{isGeneratingSEO ? <RefreshCw className="w-4 h-4 animate-spin"/> : <Sparkles className="w-4 h-4"/>} Generate SEO Tags</button>
                        </div></div>
                        <div className="border-t border-slate-100 pt-6"><button className="w-full py-2 bg-blue-600 text-white rounded-lg font-bold shadow-md hover:bg-blue-700">Publish Post</button></div>
                     </div>
                 </div>
            )}
            {(subView === 'cats' || subView === 'tags') && (<div className="p-12 text-center text-slate-400"><AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50"/><p>Management interface coming soon.</p></div>)}
        </div>
    );
};

const PagesView = ({ pages }: { pages: Page[] }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newPageContent, setNewPageContent] = useState('');
    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center"><h1 className="text-2xl font-bold text-slate-800">Pages</h1><button onClick={() => setIsAdding(!isAdding)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isAdding ? 'bg-slate-200 text-slate-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>{isAdding ? 'Back to List' : 'Add Page'}</button></header>
            {!isAdding ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-left text-sm"><thead className="bg-slate-50 border-b border-slate-200"><tr><th className="px-6 py-3 font-medium text-slate-500">Title</th><th className="px-6 py-3 font-medium text-slate-500">Author</th><th className="px-6 py-3 font-medium text-slate-500">Status</th></tr></thead><tbody className="divide-y divide-slate-100">{pages.map(page => (<tr key={page.id} className="hover:bg-slate-50"><td className="px-6 py-4 font-bold text-slate-800">{page.title}</td><td className="px-6 py-4 text-slate-600">{page.author}</td><td className="px-6 py-4"><span className="px-2 py-1 rounded text-xs font-bold bg-green-100 text-green-700">{page.status}</span></td></tr>))}</tbody></table>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 h-[calc(100vh-200px)] flex flex-col"><input className="text-3xl font-bold placeholder-slate-300 w-full border-none outline-none mb-6" placeholder="Page Title" /><div className="flex-1"><RichTextEditor initialValue={newPageContent} onChange={setNewPageContent} placeholder="Design your page content..." /></div></div>
            )}
        </div>
    );
};

const MarketingView = ({ campaigns }: { campaigns: Campaign[] }) => {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'automations' | 'viral'>('campaigns');
  const [localCampaigns, setLocalCampaigns] = useState<Campaign[]>(campaigns);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viralTopic, setViralTopic] = useState('');
  const [viralPlatform, setViralPlatform] = useState<'Twitter'|'LinkedIn'|'TikTok'>('Twitter');
  const [generatedViralPost, setGeneratedViralPost] = useState('');
  const [isGeneratingViral, setIsGeneratingViral] = useState(false);

  const handleGenerateViral = async () => {
      setIsGeneratingViral(true);
      const post = await generateViralPost(viralTopic, viralPlatform);
      setGeneratedViralPost(post);
      setIsGeneratingViral(false);
  };

  return (
    <div className="space-y-6">
       <header className="flex justify-between items-center"><div><h1 className="text-2xl font-bold text-slate-800">Marketing & Automations</h1><p className="text-slate-500 text-sm">Manage campaigns, viral growth, and recovery.</p></div><div className="flex bg-white rounded-lg p-1 border border-slate-200"><button onClick={() => setActiveTab('campaigns')} className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'campaigns' ? 'bg-blue-50 text-blue-700' : 'text-slate-500'}`}>Campaigns</button><button onClick={() => setActiveTab('automations')} className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'automations' ? 'bg-blue-50 text-blue-700' : 'text-slate-500'}`}>Automations</button><button onClick={() => setActiveTab('viral')} className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'viral' ? 'bg-blue-50 text-blue-700' : 'text-slate-500'}`}>Viral & Social</button></div></header>

       {activeTab === 'campaigns' && (
           <div className="space-y-6">
               <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"><table className="w-full text-left text-sm"><thead className="bg-slate-50 border-b border-slate-200"><tr><th className="px-6 py-4 font-medium text-slate-500">Campaign</th><th className="px-6 py-4 font-medium text-slate-500">Status</th><th className="px-6 py-4 font-medium text-slate-500 text-right">Revenue</th></tr></thead><tbody className="divide-y divide-slate-100">{localCampaigns.map(camp => (<tr key={camp.id}><td className="px-6 py-4"><p className="font-bold text-slate-800">{camp.name}</p></td><td className="px-6 py-4"><span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">{camp.status}</span></td><td className="px-6 py-4 text-right font-mono font-bold text-slate-700">${camp.metrics.revenue}</td></tr>))}</tbody></table></div>
           </div>
       )}
       {activeTab === 'automations' && (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"><h3 className="font-bold text-lg text-slate-900 mb-1">Abandoned Cart Recovery</h3><p className="text-sm text-slate-500 mb-6">Automatically email customers who leave items in their cart.</p><button className="w-full py-2 bg-slate-900 text-white rounded-lg text-sm font-medium">Manage Logic</button></div>
           </div>
       )}
       {activeTab === 'viral' && (
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                   <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-500"/> Social Blitz Generator</h3>
                   <div className="space-y-4">
                       <div><label className="text-sm font-bold text-slate-700">Topic or Product</label><input value={viralTopic} onChange={e=>setViralTopic(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 mt-1" placeholder="e.g. Summer Sale 50% Off"/></div>
                       <div><label className="text-sm font-bold text-slate-700">Platform</label><select value={viralPlatform} onChange={e=>setViralPlatform(e.target.value as any)} className="w-full border border-slate-200 rounded-lg px-3 py-2 mt-1"><option>Twitter</option><option>LinkedIn</option><option>TikTok</option></select></div>
                       <button onClick={handleGenerateViral} disabled={!viralTopic || isGeneratingViral} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold shadow hover:bg-blue-700 disabled:opacity-50">{isGeneratingViral ? 'Igniting...' : 'Generate Viral Post'}</button>
                   </div>
                   {generatedViralPost && (
                       <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                           <p className="whitespace-pre-wrap text-slate-800">{generatedViralPost}</p>
                           <div className="mt-4 flex gap-2"><button className="text-xs font-bold text-blue-600 flex items-center gap-1"><Share2 className="w-3 h-3"/> Post Now</button></div>
                       </div>
                   )}
               </div>
               <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
                   <h3 className="font-bold text-lg mb-2">Referral Program</h3>
                   <p className="text-sm opacity-90 mb-6">"Give $10, Get $10". Viral growth engine.</p>
                   <div className="bg-white/20 rounded-lg p-4 mb-4"><p className="text-xs uppercase font-bold opacity-75">Total Referrals</p><p className="text-3xl font-bold">1,240</p></div>
                   <button className="w-full py-2 bg-white text-indigo-600 font-bold rounded-lg shadow-sm">Configure Rewards</button>
               </div>
           </div>
       )}
    </div>
  );
};

const UsersView = ({ users }: { users: UserType[] }) => (
    <div className="space-y-6"><h1 className="text-2xl font-bold text-slate-800">Users</h1><div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"><table className="w-full text-left text-sm"><thead className="bg-slate-50 border-b border-slate-200"><tr><th className="px-6 py-3 font-medium text-slate-500">User</th><th className="px-6 py-3 font-medium text-slate-500">Role</th><th className="px-6 py-3 font-medium text-slate-500">Email</th></tr></thead><tbody className="divide-y divide-slate-100">{users.map(u => (<tr key={u.id} className="hover:bg-slate-50"><td className="px-6 py-4 font-bold text-slate-800">{u.username}</td><td className="px-6 py-4 text-slate-600">{u.role}</td><td className="px-6 py-4 text-slate-600">{u.email}</td></tr>))}</tbody></table></div></div>
);

const ToolsView = () => (
    <div className="space-y-6"><h1 className="text-2xl font-bold text-slate-800">Tools</h1><div className="grid grid-cols-1 md:grid-cols-3 gap-6"><div className="bg-white p-6 rounded-xl border border-slate-200 text-center"><Upload className="w-10 h-10 mx-auto mb-4 text-slate-400"/><h3 className="font-bold">Import</h3></div><div className="bg-white p-6 rounded-xl border border-slate-200 text-center"><Download className="w-10 h-10 mx-auto mb-4 text-slate-400"/><h3 className="font-bold">Export</h3></div><div className="bg-white p-6 rounded-xl border border-slate-200 text-center"><Activity className="w-10 h-10 mx-auto mb-4 text-slate-400"/><h3 className="font-bold">Site Health</h3></div></div></div>
);

const SettingsView = ({ countries, selectedCountry, setCountry }: { countries: CountryConfig[], selectedCountry: CountryConfig, setCountry: (c: CountryConfig) => void }) => (
    <div className="space-y-6"><h1 className="text-2xl font-bold text-slate-800">Settings</h1><div className="bg-white p-6 rounded-xl border border-slate-200"><h3 className="font-bold text-slate-900 mb-4">Regional</h3><div className="grid grid-cols-2 gap-4">{countries.map(c => (<button key={c.code} onClick={() => setCountry(c)} className={`p-3 rounded border text-left ${selectedCountry.code === c.code ? 'border-blue-500 bg-blue-50' : 'border-slate-200'}`}><div className="font-bold">{c.name}</div><div className="text-xs text-slate-500">{c.currency}</div></button>))}</div></div></div>
);

const POSView = ({ products, country }: { products: Product[], country: CountryConfig }) => (
    <div className="flex h-full gap-6"><div className="flex-1 bg-white rounded-xl border border-slate-200 p-6">POS System Placeholder</div><div className="w-96 bg-white border-l border-slate-200 p-6">Cart Placeholder</div></div>
);

const AnalyticsView = () => (
    <div className="space-y-6"><h1 className="text-2xl font-bold text-slate-800">Analytics</h1><div className="grid grid-cols-3 gap-6"><div className="bg-white p-6 rounded-xl border border-slate-200">Total Sales</div><div className="bg-white p-6 rounded-xl border border-slate-200">Sessions</div><div className="bg-white p-6 rounded-xl border border-slate-200">Conversion</div></div></div>
);

const LogisticsView = ({ providers }: { providers: LogisticsProvider[] }) => (
    <div className="space-y-6"><h1 className="text-2xl font-bold text-slate-800">Logistics</h1><div className="bg-white rounded-xl border border-slate-200 p-6">{providers.map(p=><div key={p.id} className="mb-2">{p.name}</div>)}</div></div>
);

const PaymentsView = ({ banks, country }: { banks: BankConnection[], country: CountryConfig }) => (
    <div className="space-y-6"><h1 className="text-2xl font-bold text-slate-800">Payments</h1><div className="bg-white rounded-xl border border-slate-200 p-6">Balance: {country.currencySymbol}1,240,000</div></div>
);

const AppearanceView = ({ themes }: { themes: Theme[] }) => (
    <div className="space-y-6"><h1 className="text-2xl font-bold text-slate-800">Appearance</h1><div className="grid grid-cols-3 gap-6">{themes.map(t=><div key={t.id} className="bg-white p-4 rounded-xl border border-slate-200">{t.name}</div>)}</div></div>
);

const App = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [customers] = useState<Customer[]>(mockCustomers);
  const [products] = useState<Product[]>(mockProducts);
  const [banks] = useState<BankConnection[]>(mockBanks);
  const [themes] = useState<Theme[]>(mockThemes);
  const [campaigns] = useState<Campaign[]>(mockCampaigns);
  const [countries] = useState<CountryConfig[]>(mockCountries);
  const [logistics] = useState<LogisticsProvider[]>(mockLogistics);
  const [posts] = useState<Post[]>(mockPosts);
  const [pages] = useState<Page[]>(mockPages);
  const [users] = useState<UserType[]>(mockUsers);
  const [media] = useState<MediaItem[]>(mockMedia);
  const [selectedCountry, setSelectedCountry] = useState<CountryConfig>(mockCountries[0]);

  const renderView = () => {
    switch(currentView) {
      case View.DASHBOARD: return <DashboardView customers={customers} banks={banks} country={selectedCountry} />;
      case View.CRM: return <CRMView customers={customers} />;
      case View.PRODUCTS: return <ProductsView products={products} country={selectedCountry} media={media} />;
      case View.POSTS: return <PostsView posts={posts} />;
      case View.PAGES: return <PagesView pages={pages} />;
      case View.USERS: return <UsersView users={users} />;
      case View.TOOLS: return <ToolsView />;
      case View.PAYMENTS: return <PaymentsView banks={banks} country={selectedCountry} />;
      case View.APPEARANCE: return <AppearanceView themes={themes} />;
      case View.MARKETING: return <MarketingView campaigns={campaigns} />;
      case View.LOGISTICS: return <LogisticsView providers={logistics} />;
      case View.SETTINGS: return <SettingsView countries={countries} selectedCountry={selectedCountry} setCountry={setSelectedCountry} />;
      case View.POS: return <POSView products={products} country={selectedCountry} />;
      case View.ANALYTICS: return <AnalyticsView />;
      default: return <div className="p-8 text-center text-slate-500">View under construction</div>;
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50">
      <Sidebar currentView={currentView} setView={setCurrentView} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 flex-shrink-0">
          <div className="flex items-center text-slate-400 bg-slate-50 px-3 py-1.5 rounded-md w-96 border border-slate-100"><Search className="w-4 h-4 mr-2" /><input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-sm w-full text-slate-800" /></div>
          <div className="flex items-center space-x-4"><button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full"><Bell className="w-5 h-5" /></button><div className="flex items-center gap-2"><div className="text-right"><p className="text-xs font-bold text-slate-900">{selectedCountry.code} Store</p><p className="text-[10px] text-slate-500">{selectedCountry.currency}</p></div><div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs border border-slate-200">{selectedCountry.code}</div></div></div>
        </header>
        <main className="flex-1 overflow-y-auto p-8 relative">{renderView()}</main>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
if (container) { const root = createRoot(container); root.render(<App />); }
