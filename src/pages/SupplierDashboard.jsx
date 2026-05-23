import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, Box, Bell, ClipboardList, 
  ReceiptText, Users, CheckCircle2, Clock, 
  XCircle, Search, ArrowRight, Plus, SlidersHorizontal, X, UploadCloud, Pencil, Trash2, Image as ImageIcon
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as BarTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip as PieTooltip
} from 'recharts';
import './SupplierDashboard.css';
import logo from '../assets/logo.svg';
import Footer from '../components/Footer';
import { DEFAULT_PRODUCTS } from './Services';

// ==========================================
// MOCK DATA 
// ==========================================
const RFQ_ORDERS_DATA = [
  { id: '#1052', name: 'Laila Hassan', date: 'Mar 22, 2026', price: 1000, qty: 12, status: 'Confirm', img: 'https://i.pravatar.cc/150?u=5122' },
  { id: '#1051', name: 'Omar Ahmed', date: 'Mar 22, 2026', price: 700, qty: 20, status: 'Pending', img: 'https://i.pravatar.cc/150?u=5123' },
  { id: '#1050', name: 'Hla Osama', date: 'Mar 22, 2026', price: 100, qty: 500, status: 'Pending', img: 'https://i.pravatar.cc/150?u=5124' }
];

const ORDERS_DATA = [
  { id: '#2052', name: 'Laila Hassan', date: 'Mar 22, 2026', price: 1000, qty: 12, status: 'Delivered', img: 'https://i.pravatar.cc/150?u=5122' },
  { id: '#2051', name: 'Omar Ahmed', date: 'Mar 22, 2026', price: 700, qty: 20, status: 'On Way', img: 'https://i.pravatar.cc/150?u=5123' }
];

const SALES_DATA = [
  { name: 'JAN', sales: 1800 }, { name: 'FEB', sales: 2900 },
  { name: 'MAR', sales: 3000 }, { name: 'APR', sales: 3600 },
  { name: 'MAY', sales: 2200 }, { name: 'JUN', sales: 2800 }
];

const ORDER_STATUS_DATA = [
  { name: 'Confirmed', value: 40, color: '#10B981' },
  { name: 'Pending', value: 25, color: '#3B82F6' },
  { name: 'Arrived', value: 15, color: '#F59E0B' }
];

const DEFAULT_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect width='300' height='300' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='18' fill='%2364748b'%3ENo Image%3C/text%3E%3C/svg%3E";

// ==========================================
// COMPONENT
// ==========================================
export default function SupplierDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentPage, setCurrentPage] = useState(1);
  
  const [supplierProducts, setSupplierProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('supplier_my_products');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  
  const [newProduct, setNewProduct] = useState({ 
    name: '', category: '', price: '', quantity: '', status: 'Approved' 
  });
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  // 🛠️ حماية حفظ الـ Storage
  useEffect(() => {
    try {
      localStorage.setItem('supplier_my_products', JSON.stringify(supplierProducts));
    } catch (error) {
      console.warn("Storage is full", error);
    }
  }, [supplierProducts]);

  const syncToGlobalProducts = (action, productData, id = null) => {
    try {
      let saved = localStorage.getItem('indus_products');
      let globalProducts = saved ? JSON.parse(saved) : null;
      
      if (!globalProducts || !Array.isArray(globalProducts) || globalProducts.length === 0) {
        globalProducts = DEFAULT_PRODUCTS || [];
      }
      
      if (action === 'ADD') {
        globalProducts = [productData, ...globalProducts];
      } else if (action === 'EDIT') {
        globalProducts = globalProducts.map(p => p.id === id ? { ...p, ...productData } : p);
      } else if (action === 'DELETE') {
        globalProducts = globalProducts.filter(p => p.id !== id);
      }
      
      localStorage.setItem('indus_products', JSON.stringify(globalProducts));
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error("Sync error:", error);
    }
  };

  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  // 🛠️ التعديل الأهم: ضغط الصورة (Auto-Compression) لتفادي انهيار الذاكرة تماماً
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIMENSION = 400; // تصغير الأبعاد
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIMENSION) { height *= MAX_DIMENSION / width; width = MAX_DIMENSION; }
        } else {
          if (height > MAX_DIMENSION) { width *= MAX_DIMENSION / height; height = MAX_DIMENSION; }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // ضغط الصورة بجودة 70%
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        setPreviewImage(compressedBase64);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleOpenEditModal = (e, prod) => {
    e.stopPropagation();
    setIsEditMode(true);
    setEditingProductId(prod.id);
    setNewProduct({
      name: prod.name,
      category: prod.category,
      price: prod.price,
      quantity: prod.quantity || String(prod.moq).replace(/\D/g,''),
      status: prod.status || 'Approved'
    });
    setPreviewImage(prod.img || prod.image);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this product?")) {
      setSupplierProducts(prev => prev.filter(p => p.id !== id));
      syncToGlobalProducts('DELETE', null, id);
    }
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    
    // استخدام الصورة المضغوطة أو الـ Placeholder
    const finalImageUrl = previewImage || DEFAULT_IMG;

    if (isEditMode) {
      const updatedData = {
        name: newProduct.name,
        category: newProduct.category,
        price: Number(newProduct.price),
        unitPrice: `${newProduct.price}EGP`,
        quantity: Number(newProduct.quantity),
        moq: `${newProduct.quantity} Unit`,
        status: newProduct.status, 
        img: finalImageUrl,
        image: finalImageUrl,
        description: 'Product updated by Supplier.'
      };

      setSupplierProducts(prev => prev.map(p => p.id === editingProductId ? { ...p, ...updatedData } : p));
      syncToGlobalProducts('EDIT', updatedData, editingProductId);

    } else {
      const productToAdd = {
        id: Number(Date.now().toString().slice(-6)),
        name: newProduct.name,
        category: newProduct.category,
        price: Number(newProduct.price),
        unitPrice: `${newProduct.price}EGP`,
        quantity: Number(newProduct.quantity),
        moq: `${newProduct.quantity} Unit`,
        status: 'Approved', 
        img: finalImageUrl,
        image: finalImageUrl,
        description: 'New product added by Supplier.',
        rating: 5,
        reviews: 0, 
        viewedCount: '0+', 
        supplierId: 'current_user_id', 
      };

      setSupplierProducts([productToAdd, ...supplierProducts]);
      syncToGlobalProducts('ADD', productToAdd);
    }
    
    setIsModalOpen(false);
    setIsEditMode(false);
    setNewProduct({ name: '', category: '', price: '', quantity: '', status: 'Approved' });
    setPreviewImage(null);
  };

  const renderPagination = () => (
    <div className="pagination-wrapper">
      <div className="pagination-controls">
        <span className={`page-step ${currentPage === 1 ? 'active' : ''}`} onClick={() => setCurrentPage(1)}>1</span>
        <span className={`page-step ${currentPage === 2 ? 'active' : ''}`} onClick={() => setCurrentPage(2)}>2</span>
        <span className={`page-step ${currentPage === 3 ? 'active' : ''}`} onClick={() => setCurrentPage(3)}>3</span>
        <button className="page-next"><ArrowRight size={16} /></button>
      </div>
    </div>
  );

  return (
    <div className="supplier-dashboard" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      
      <div style={{ display: 'flex', flex: 1 }}>
        <aside className="sidebar">
          <div className="logo-section">
            <img src={logo} alt="IndusConnect" className="logo-img" style={{ height: '35px', objectFit: 'contain' }} />
          </div>
          
          <nav className="nav-menu">
            <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => { setActiveTab('dashboard'); setCurrentPage(1); }}><LayoutDashboard size={20}/> Dashboard</div>
            <div className={`nav-item ${activeTab === 'products' ? 'active' : ''}`} onClick={() => { setActiveTab('products'); setCurrentPage(1); }}><Box size={20}/> My Products</div>
            <div className={`nav-item ${activeTab === 'rfq' ? 'active' : ''}`} onClick={() => { setActiveTab('rfq'); setCurrentPage(1); }}><ClipboardList size={20}/> RFQ</div>
            <div className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => { setActiveTab('orders'); setCurrentPage(1); }}><ReceiptText size={20}/> Orders</div>
          </nav>
        </aside>

        <main className="main-content">
          <header className="top-header">
            <button className="icon-btn"><Bell size={20}/></button>
            <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150" alt="Supplier" className="profile-img" />
          </header>

          <div className="page-title-section">
            {activeTab === 'dashboard' && <LayoutDashboard size={28} className="title-icon" />}
            {activeTab === 'products' && <Box size={28} className="title-icon" />}
            {activeTab === 'rfq' && <ClipboardList size={28} className="title-icon" />}
            {activeTab === 'orders' && <ReceiptText size={28} className="title-icon" />}
            <h1 className="page-title">{activeTab === 'products' ? 'My Products' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
          </div>

          {activeTab === 'dashboard' && (
             <>
               <div className="stats-grid">
                 <div className="stat-card"><div><p>My Products</p><h2>{supplierProducts.length}</h2></div><div className="stat-icon"><Users size={20} color="#C24133"/></div></div>
                 <div className="stat-card"><div><p>Buyers</p><h2>86</h2></div><div className="stat-icon"><CheckCircle2 size={20} color="#10B981"/></div></div>
                 <div className="stat-card"><div><p>Orders</p><h2>245</h2></div><div className="stat-icon"><Clock size={20} color="#F59E0B"/></div></div>
                 <div className="stat-card"><div><p>Sales</p><h2>48,750</h2></div><div className="stat-icon"><XCircle size={20} color="#EF4444"/></div></div>
               </div>
               <div className="card-panel mt-30">
                 <div className="panel-header"><h3>Sales dynamics</h3><div className="year-selector">2023 <span className="arrow-down">▼</span></div></div>
                 {/* 🛠️ حل تحذير الـ BarChart بإضافة أبعاد دنيا صريحة */}
                 <div className="chart-container" style={{ height: '280px', width: '100%' }}>
                   <ResponsiveContainer width="100%" height="100%" minHeight={280} minWidth={100}>
                     <BarChart data={SALES_DATA} margin={{ top: 20, right: 0, left: -20, bottom: 0 }} barSize={12}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                       <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6B7280', fontWeight: 'bold' }} dy={10} />
                       <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6B7280' }} />
                       <BarTooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}/>
                       <Bar dataKey="sales" fill="#E0E7FF" radius={[10, 10, 10, 10]} />
                       <Bar dataKey="sales" fill="#3B82F6" radius={[10, 10, 10, 10]} style={{ transform: 'scaleY(0.7)', transformOrigin: 'bottom' }}/>
                     </BarChart>
                   </ResponsiveContainer>
                 </div>
               </div>
             </>
          )}

          {activeTab === 'products' && (
            <div className="card-panel p-0">
              <div className="panel-header-actions">
                <div className="search-box"><Search size={16} className="search-icon" /><input type="text" placeholder="Search my products..." /></div>
                <button className="btn-primary" onClick={() => { setIsEditMode(false); setNewProduct({ name: '', category: '', price: '', quantity: '', status: 'Approved' }); setPreviewImage(null); setIsModalOpen(true); }}>
                  <Plus size={16}/> Add New Product
                </button>
              </div>
              <table className="data-table">
                <thead><tr><th>Product Name ↕</th><th>Category</th><th>Price ↕</th><th>Quantity</th><th>Status</th><th style={{ textAlign: 'center' }}>Actions</th></tr></thead>
                <tbody>
                  {supplierProducts.length > 0 ? supplierProducts.map((item) => {
                    const imageSrc = item.img && (item.img.startsWith('data:') || item.img.startsWith('http'))
                      ? item.img
                      : `${import.meta.env.BASE_URL}${(item.img || item.image || '').replace(/^\//, '')}`;

                    return (
                      <tr key={item.id}>
                        <td>
                          <div className="cell-flex">
                            <img 
                              src={imageSrc} 
                              alt="" 
                              className="table-img" 
                              style={{width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #eee'}} 
                              onError={(e)=>{e.target.src=DEFAULT_IMG}}
                            />
                            <span className="fw-bold text-dark">{item.name}</span>
                          </div>
                        </td>
                        <td className="text-red">{item.category}</td>
                        <td className="fw-bold"><span className="text-red">{item.price}</span> <span className="text-muted">EGP</span></td>
                        <td className="fw-bold"><span className="text-red">{item.quantity || String(item.moq).replace(/\D/g,'')}</span> <span className="text-muted">Unit</span></td>
                        <td><span className={`status-badge ${item.status?.toLowerCase() || 'approved'}`}>{item.status} {item.status === 'Approved' && '✓'}</span></td>
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                            <button onClick={(e) => handleOpenEditModal(e, item)} style={{ border: 'none', background: 'none', color: '#4B5563', cursor: 'pointer' }}><Pencil size={18} /></button>
                            <button onClick={(e) => handleDeleteProduct(e, item.id)} style={{ border: 'none', background: 'none', color: '#EF4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  }) : (<tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#6b7280' }}>You haven't added any products yet.</td></tr>)}
                </tbody>
              </table>
              {supplierProducts.length > 0 && renderPagination()}
            </div>
          )}

          {activeTab === 'rfq' && (
            <div className="card-panel p-0">
              <table className="data-table">
                <thead><tr><th>Id ↕</th><th>Buyer ↕</th><th>Date ↕</th><th>Price ↕</th><th>Quantity</th><th>Action</th></tr></thead>
                <tbody>
                  {RFQ_ORDERS_DATA.map((item) => (
                    <tr key={item.id}>
                      <td className="fw-bold text-red">{item.id}</td>
                      <td><div className="cell-flex"><img src={item.img} alt="" className="avatar-img" /><span className="fw-bold text-dark">{item.name}</span></div></td>
                      <td className="text-dark">{item.date}</td>
                      <td className="fw-bold"><span className="text-red">{item.price}</span> <span className="text-muted">EGP</span></td>
                      <td className="fw-bold"><span className="text-red">{item.qty}</span> <span className="text-muted">Unit</span></td>
                      <td><span className={`status-badge ${item.status.toLowerCase()}`}>{item.status} {item.status === 'Confirm' && '✓'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'orders' && (
             <>
               <div className="card-panel">
                 <h3 className="chart-title">Order Status</h3>
                 <div className="donut-chart-wrapper">
                   {/* 🛠️ حل تحذير الـ PieChart بإضافة أبعاد صريحة */}
                   <div className="donut-chart" style={{ width: '220px', height: '220px' }}>
                     <ResponsiveContainer width="100%" height="100%" minHeight={220} minWidth={220}>
                       <PieChart><Pie data={ORDER_STATUS_DATA} innerRadius={65} outerRadius={90} paddingAngle={2} dataKey="value" stroke="none">{ORDER_STATUS_DATA.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}</Pie><PieTooltip /></PieChart>
                     </ResponsiveContainer>
                     <div className="donut-center-text"><h2>2563</h2><p>Reservation</p></div>
                   </div>
                   <div className="donut-legend">{ORDER_STATUS_DATA.map((item, index) => (<div className="legend-item" key={index}><span className="legend-dot" style={{ backgroundColor: item.color }}></span><span className="fw-bold text-dark">201</span> <span className="text-muted">{item.name}</span></div>))}</div>
                 </div>
               </div>
               <div className="card-panel p-0 mt-30">
                 <table className="data-table">
                   <thead><tr><th>Buyer ↕</th><th>Date ↕</th><th>Price ↕</th><th>Quantity</th><th>Status</th></tr></thead>
                   <tbody>
                     {ORDERS_DATA.map((item, index) => (
                       <tr key={index}>
                         <td><div className="cell-flex"><img src={item.img} alt="" className="avatar-img" /><span className="fw-bold text-dark">{item.name}</span></div></td>
                         <td className="text-dark">{item.date}</td>
                         <td className="fw-bold"><span className="text-red">{item.price}</span> <span className="text-muted">EGP</span></td>
                         <td className="fw-bold"><span className="text-red">{item.qty}</span> <span className="text-muted">Unit</span></td>
                         <td><span className={`status-badge ${item.status.toLowerCase().replace(' ', '-')}`}>{item.status} {item.status === 'Delivered' && '✓'}</span></td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             </>
          )}
        </main>
      </div>

      <div style={{ width: '100%' }}><Footer /></div>

      {isModalOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="modal-content" style={{ background: '#fff', padding: '30px', borderRadius: '16px', width: '600px', maxWidth: '95%', position: 'relative', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: '#f3f4f6', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={18} color="#4b5563" /></button>
            <div style={{ marginBottom: '25px', borderBottom: '1px solid #e5e7eb', paddingBottom: '15px' }}>
              <h2 style={{ margin: 0, color: '#111827', fontSize: '22px', display: 'flex', alignItems: 'center', gap: '10px' }}><Box size={24} color="#C24133" /> {isEditMode ? 'Edit Product' : 'Add New Product'}</h2>
            </div>
            
            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Product Image</label>
                <div onClick={() => fileInputRef.current.click()} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '140px', border: '2px dashed #d1d5db', borderRadius: '12px', cursor: 'pointer', position: 'relative', backgroundColor: '#f9fafb', overflow: 'hidden' }}>
                  {previewImage ? <img src={previewImage} alt="Preview" style={{ height: '100%', width: '100%', objectFit: 'contain', backgroundColor: '#fff' }} /> : <div style={{ color: '#9CA3AF', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}><ImageIcon size={32} /><span style={{fontSize:'12px', fontWeight:'500'}}>Click to upload image</span></div>}
                  <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} style={{ display: 'none' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Product Name</label>
                  <input type="text" name="name" value={newProduct.name} onChange={handleProductInputChange} placeholder="e.g. Modern Office Desk" required style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Category</label>
                  <select name="category" value={newProduct.category} onChange={handleProductInputChange} required style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', backgroundColor: '#fff' }}>
                    <option value="">Select Category</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Textile">Textile</option>
                    <option value="Raw Material">Raw Material</option>
                    <option value="Package">Package</option>
                    <option value="Electronic & Spare Parts">Electronic & Spare Parts</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Price (EGP)</label>
                  <input type="number" name="price" value={newProduct.price} onChange={handleProductInputChange} placeholder="0.00" required style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Quantity</label>
                  <input type="number" name="quantity" value={newProduct.quantity} onChange={handleProductInputChange} placeholder="Number of units" required style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px', paddingTop: '15px', borderTop: '1px solid #e5e7eb' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, background: '#fff', color: '#374151', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
                <button type="submit" style={{ flex: 2, background: '#C24133', color: 'white', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><Plus size={18} /> {isEditMode ? 'Save Changes' : 'Submit Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}