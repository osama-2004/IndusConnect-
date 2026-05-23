import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Box, Bell, Users, 
  CheckCircle2, Clock, XCircle, Search,
  ArrowRight, Plus, Image as ImageIcon,
  Pencil, Trash2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DEFAULT_PRODUCTS } from './Services'; 
import './AdminDashboard.css';
import logo from '../assets/logo.svg';
import Footer from '../components/Footer'; 

const DEFAULT_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect width='300' height='300' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='18' fill='%2364748b'%3ENo Image%3C/text%3E%3C/svg%3E";

const USERS_DATA = [
  { id: '5122', name: 'Laila Hassan', email: 'lailahassan6@gmail.com', date: 'Mar 22, 2026', status: 'Buyer', img: 'https://i.pravatar.cc/150?u=5122' },
  { id: '5123', name: 'Omar Ahmed', email: 'omarahmed00@gmail.com', date: 'Mar 25, 2026', status: 'Buyer', img: 'https://i.pravatar.cc/150?u=5123' },
  { id: '5124', name: 'Hla Osama', email: 'hlaosama41@gmail.com', date: 'Mar 28, 2026', status: 'Supplier', img: 'https://i.pravatar.cc/150?u=5124' },
  { id: '5125', name: 'Nahla Abdallah', email: 'nahalabdallah60@gmail.com', date: 'Mar 30, 2026', status: 'Supplier', img: 'https://i.pravatar.cc/150?u=5125' },
  { id: '5126', name: 'Nesreen Osman', email: 'nesreenosman23@gmail.com', date: 'Apr 1, 2026', status: 'Buyer', img: 'https://i.pravatar.cc/150?u=5126' },
  { id: '5127', name: 'Anas Ibrahim', email: 'anasibrahim56@gmail.com', date: 'Apr 3, 2026', status: 'Supplier', img: 'https://i.pravatar.cc/150?u=5127' },
];

const chartData = [
  { name: '2', supplier: 500, buyer: 480 }, { name: '4', supplier: 900, buyer: 620 },
  { name: '6', supplier: 850, buyer: 780 }, { name: '8', supplier: 650, buyer: 750 },
  { name: '10', supplier: 720, buyer: 630 }, { name: '12', supplier: 880, buyer: 920 },
  { name: '14', supplier: 820, buyer: 750 }, { name: '16', supplier: 780, buyer: 720 },
  { name: '18', supplier: 850, buyer: 680 }, { name: '20', supplier: 820, buyer: 740 },
  { name: '22', supplier: 890, buyer: 820 }, { name: '24', supplier: 830, buyer: 910 },
  { name: '26', supplier: 880, buyer: 820 }, { name: '28', supplier: 800, buyer: 780 }
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentPage, setCurrentPage] = useState(1);
  const [userSearch, setUserSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const itemsPerPage = 6;

  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('indus_products');
      return saved ? JSON.parse(saved) : (DEFAULT_PRODUCTS || []);
    } catch (e) {
      return DEFAULT_PRODUCTS || [];
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [newProdData, setNewProdData] = useState({
    name: '', price: '', moq: '', category: 'Furniture', status: 'Approved', description: '', image: ''
  });

  const [selectedProductIds, setSelectedProductIds] = useState([]);

  useEffect(() => {
    try {
      const productsToSave = products.map(p => ({
        ...p,
        image: p.image && (p.image.startsWith('http') || p.image.startsWith('data:')) ? p.image : DEFAULT_IMG
      }));
      localStorage.setItem('indus_products', JSON.stringify(productsToSave));
      window.dispatchEvent(new Event('storage')); 
    } catch (error) {
      console.error("Local Storage is full!", error);
      // تحذير في حالة نادرة جداً لو الذاكرة اتملت رغم الضغط
      alert("⚠️ مساحة الذاكرة ممتلئة. يرجى مسح الذاكرة باستخدام localStorage.clear()");
    }
  }, [products]);

  const filteredProducts = products.filter(p => {
    const pName = p?.name || '';
    const pCat = p?.category || '';
    return pName.toLowerCase().includes((productSearch || '').toLowerCase()) ||
           pCat.toLowerCase().includes((productSearch || '').toLowerCase());
  });

  const currentProductsList = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalProductPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const filteredUsers = USERS_DATA.filter(u => 
    (u?.name || '').toLowerCase().includes((userSearch || '').toLowerCase()) || 
    (u?.id || '').includes(userSearch)
  );
  const currentUsersList = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalUserPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleSelectAllProducts = (e) => {
    if (e.target.checked) setSelectedProductIds(currentProductsList.map(p => p.id));
    else setSelectedProductIds([]);
  };

  const handleSelectProduct = (e, id) => {
    e.stopPropagation(); 
    setSelectedProductIds(prev => prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]);
  };

  // 🛠️ الحل السحري: ضغط الصورة (Compress) في الخلفية لتقليل حجمها قبل حفظها
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 400; // أقصى عرض
          const MAX_HEIGHT = 400; // أقصى طول
          let width = img.width;
          let height = img.height;

          // تصغير الأبعاد مع الحفاظ على نسبة العرض للطول
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // تحويل الصورة لـ jpeg بجودة 70% لتقليل الحجم بشكل كبير
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          setNewProdData(prev => ({ ...prev, image: compressedBase64 }));
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteProduct = (e, id) => {
    e.stopPropagation();
    if (window.confirm("Delete this product permanently from system?")) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleOpenEditModal = (e, prod) => {
    e.stopPropagation();
    setIsEditMode(true);
    setEditingProductId(prod.id);
    setNewProdData({
      name: prod?.name || '',
      price: prod?.price || '',
      moq: prod?.moq ? String(prod.moq).replace(/\D/g,'') : '', 
      category: prod?.category || 'Furniture',
      status: prod?.status || 'Approved',
      description: prod?.description || '',
      image: prod?.image || ''
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!newProdData.name || !newProdData.price) return;

    const finalImageUrl = newProdData.image || DEFAULT_IMG;

    let updatedProductsList = [];
    if (isEditMode) {
      updatedProductsList = products.map(p => p.id === editingProductId ? {
        ...p,
        name: newProdData.name,
        price: Number(newProdData.price) || 0,
        unitPrice: `${newProdData.price}EGP`,
        category: newProdData.category || 'Furniture',
        status: newProdData.status || 'Approved',
        description: newProdData.description || '',
        image: finalImageUrl,
        moq: newProdData.moq ? (String(newProdData.moq).includes('Unit') ? newProdData.moq : `${newProdData.moq} Unit`) : '10 Unit'
      } : p);
    } else {
      const createdProduct = {
        id: Number(Date.now().toString().slice(-6)), 
        name: newProdData.name,
        price: Number(newProdData.price) || 0,
        unitPrice: `${newProdData.price}EGP`,
        category: newProdData.category || 'Furniture',
        rating: 5,
        reviews: 1,
        viewedCount: '10+',
        image: finalImageUrl,
        description: newProdData.description || 'No description provided.',
        moq: newProdData.moq ? `${newProdData.moq} Unit` : '10 Unit',
        status: newProdData.status || 'Approved'
      };
      updatedProductsList = [createdProduct, ...products];
    }

    setProducts(updatedProductsList);
    setIsModalOpen(false);
    setIsEditMode(false);
    setNewProdData({ name: '', price: '', moq: '', category: 'Furniture', status: 'Approved', description: '', image: '' });
  };

  return (
    <div className="admin-wrapper">
      
      <div className="admin-dashboard-container">
          <div className="admin-logo-section">
            <img src={logo} alt="IndusConnect" className="admin-logo-img" />
          </div>
        {/* Sidebar Component */}
        <aside className="admin-sidebar">
          
          
          <nav className="admin-nav-menu">
            <div 
              className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => { setActiveTab('dashboard'); setCurrentPage(1); }}
            >
              <LayoutDashboard size={20}/> Dashboard
            </div>
            <div 
              className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => { setActiveTab('users'); setCurrentPage(1); }}
            >
              <Users size={20}/> Manage Users
            </div>
            <div 
              className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => { setActiveTab('products'); setCurrentPage(1); }}
            >
              <Box size={20}/> Manage Products
            </div>
          </nav>
        </aside>

        {/* Main Content Dashboard */}
        <main className="admin-main-content">
          
          {/* Top Header */}
          <header className="admin-top-header">
            <button className="admin-icon-btn">
              <Bell size={20}/>
            </button>
            <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150" alt="Admin" className="admin-profile-img" />
          </header>

          <div className="admin-page-title-section">
            <h1 className="admin-page-title">
              {activeTab === 'dashboard' ? 'Dashboard' : activeTab === 'users' ? 'Manage Users' : 'Manage Products'}
            </h1>
          </div>

          {/* ==========================================
              DASHBOARD VIEW
              ========================================== */}
          {activeTab === 'dashboard' && (
            <>
              <div className="admin-stats-grid">
                <StatCard label="Total Users" val="1250" icon={<Users size={20} color="#C24133"/>} />
                <StatCard label="Products Approved" val={products.filter(p=>p?.status==='Approved').length} icon={<CheckCircle2 size={20} color="#10B981"/>} />
                <StatCard label="Products Pending" val={products.filter(p=>p?.status==='Pending').length} icon={<Clock size={20} color="#F59E0B"/>} />
                <StatCard label="Products Rejected" val={products.filter(p=>p?.status==='Rejected').length} icon={<XCircle size={20} color="#EF4444"/>} />
              </div>

              <div className="admin-chart-panel">
                <div className="admin-chart-header">
                  <h3>User Growth</h3>
                  <div className="admin-chart-legend">
                    <span><div className="legend-dot green"></div> Supplier</span>
                    <span><div className="legend-dot red"></div> Buyer</span>
                  </div>
                </div>
                {/* 🛠️ حل تحذير Recharts بضبط الحاويات بشكل دقيق */}
                <div className="admin-chart-container" style={{ width: '100%', height: 300, minHeight: 300 }}>
                  <ResponsiveContainer width="100%" height="100%" minHeight={300} minWidth={100}>
                    <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                      <Area type="monotone" dataKey="supplier" stroke="#10B981" fillOpacity={0.05} fill="#10B981" strokeWidth={2} />
                      <Area type="monotone" dataKey="buyer" stroke="#C24133" fillOpacity={0.05} fill="#C24133" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}

          {/* ==========================================
              MANAGE USERS VIEW
              ========================================== */}
          {activeTab === 'users' && (
            <div className="admin-card-panel">
              <div className="admin-search-wrapper">
                <Search size={18} className="admin-search-icon" />
                <input 
                  type="text" 
                  className="admin-search-input"
                  placeholder="Search" 
                  value={userSearch} 
                  onChange={(e) => { setUserSearch(e.target.value); setCurrentPage(1); }} 
                />
              </div>
              
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>Id</th>
                    <th>Registration date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsersList.map((user) => (
                    <tr key={user.id}>
                      <td className="user-info-cell">
                        <img src={user.img} alt="" className="user-avatar" />
                        <div className="user-details">
                          <span className="user-name">{user.name}</span>
                          <span className="user-email">{user.email}</span>
                        </div>
                      </td>
                      <td className="user-id-cell">{user.id}</td>
                      <td className="user-date-cell">{user.date}</td>
                      <td>
                        <span className={`admin-status-badge ${user.status.toLowerCase()}`}>
                          {user.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination totalPages={totalUserPages} current={currentPage} setPage={setCurrentPage} />
            </div>
          )}

          {/* ==========================================
              MANAGE PRODUCTS VIEW
              ========================================== */}
          {activeTab === 'products' && (
            <div className="admin-card-panel no-padding">
              
              <div className="admin-panel-header-actions">
                <div className="admin-actions-left">
                  <label className="admin-select-all">
                    <input 
                      type="checkbox" 
                      onChange={handleSelectAllProducts}
                      checked={selectedProductIds.length === currentProductsList.length && currentProductsList.length > 0} 
                    />
                    Select All
                  </label>
                  
                  <div className="admin-search-wrapper small">
                    <Search size={16} className="admin-search-icon" />
                    <input 
                      type="text" 
                      className="admin-search-input"
                      placeholder="Search Products..." 
                      value={productSearch} 
                      onChange={(e) => { setProductSearch(e.target.value); setCurrentPage(1); }} 
                    />
                  </div>
                </div>

                <button 
                  className="admin-btn-primary"
                  onClick={() => { setIsEditMode(false); setNewProdData({ name: '', price: '', moq: '', category: 'Furniture', status: 'Approved', description: '', image: '' }); setIsModalOpen(true); }} 
                >
                  <Plus size={16}/> Add Product
                </button>
              </div>

              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th className="checkbox-col"></th>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Status</th>
                    <th className="actions-col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProductsList.length > 0 ? currentProductsList.map((prod) => {
                    const imageSrc = prod?.image && (prod.image.startsWith('data:') || prod.image.startsWith('http'))
                      ? prod.image
                      : `${import.meta.env.BASE_URL}${(prod?.image || '').replace(/^\//, '')}`;

                    return (
                      <tr key={prod.id}>
                        <td className="checkbox-col">
                          <input type="checkbox" checked={selectedProductIds.includes(prod.id)} onChange={(e) => handleSelectProduct(e, prod.id)} />
                        </td>
                        <td className="product-info-cell">
                          <img src={imageSrc} alt="" className="product-img" onError={(e)=>{e.target.src=DEFAULT_IMG}}/>
                          {prod?.name || 'Unnamed Product'}
                        </td>
                        <td className="product-price-cell">
                          <span className="price-val">{Number(prod?.price || 0).toLocaleString()}</span> <span className="currency">EGP</span>
                        </td>
                        <td className="product-qty-cell">
                          <span className="qty-val">{prod?.moq ? String(prod.moq).replace(/\D/g,'') : '10'}</span> <span className="unit">Unit</span>
                        </td>
                        <td>
                          <span className={`admin-prod-status ${prod?.status?.toLowerCase() || 'approved'}`}>
                            {prod?.status || 'Approved'} {prod?.status === 'Approved' && '✓'}
                          </span>
                        </td>
                        <td className="actions-col">
                          <div className="action-buttons">
                            <button onClick={(e) => handleOpenEditModal(e, prod)} title="Edit"><Pencil size={18} /></button>
                            <button onClick={(e) => handleDeleteProduct(e, prod.id)} className="delete-btn" title="Delete"><Trash2 size={18} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan="6" className="no-data">No products found.</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <Pagination totalPages={totalProductPages} current={currentPage} setPage={setCurrentPage} />
            </div>
          )}

        </main>
      </div>

      {/* Footer Area */}
      <div className="admin-footer-wrapper">
        <Footer />
      </div>

      {/* ==========================================
          MODAL (ADD / EDIT PRODUCT)
          ========================================== */}
      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content">
            <h3 className="admin-modal-title">{isEditMode ? 'Edit Product Card' : 'Create New Product Card'}</h3>
            <form onSubmit={handleSaveProduct}>
              <div className="admin-form-group">
                <label>Product Image</label>
                <div className="admin-image-upload-area">
                  {newProdData.image ? 
                    <img src={newProdData.image} alt="" className="uploaded-img" /> : 
                    <div className="upload-placeholder"><ImageIcon size={32} /><span>Click to upload image</span></div>
                  }
                  <input type="file" accept="image/*" onChange={handleImageChange} className="file-input" />
                </div>
              </div>
              <div className="admin-form-group">
                <label>Product Name</label>
                <input type="text" className="admin-input" value={newProdData.name} onChange={e => setNewProdData({...newProdData, name: e.target.value})} required />
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Price (EGP)</label>
                  <input type="number" className="admin-input" value={newProdData.price} onChange={e => setNewProdData({...newProdData, price: e.target.value})} required />
                </div>
                <div className="admin-form-group">
                  <label>Quantity / MOQ</label>
                  <input type="text" className="admin-input" value={newProdData.moq} onChange={e => setNewProdData({...newProdData, moq: e.target.value})} placeholder="e.g. 50" />
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Category</label>
                  <select className="admin-input" value={newProdData.category} onChange={e => setNewProdData({...newProdData, category: e.target.value})}>
                    <option value="Furniture">Furniture</option>
                    <option value="Textile">Textile</option>
                    <option value="Raw Material">Raw Material</option>
                    <option value="Package">Package</option>
                    <option value="Electronic & Spare Parts">Electronic & Spare Parts</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Status</label>
                  <select className="admin-input" value={newProdData.status} onChange={e => setNewProdData({...newProdData, status: e.target.value})}>
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
              <div className="admin-form-group">
                <label>Description</label>
                <textarea className="admin-textarea" value={newProdData.description} onChange={e => setNewProdData({...newProdData, description: e.target.value})}></textarea>
              </div>
              <div className="admin-modal-actions">
                <button type="button" className="admin-btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="admin-btn-save">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// REUSABLE COMPONENTS
// ==========================================
const StatCard = ({ label, val, icon }) => (
  <div className="admin-stat-card">
    <div>
      <p>{label}</p>
      <h2>{val}</h2>
    </div>
    <div className="stat-icon-wrapper">
      {icon}
    </div>
  </div>
);

const Pagination = ({ totalPages, current, setPage }) => (
  <div className="admin-pagination">
    <div className="admin-pagination-controls">
      {[...Array(totalPages)].map((_, i) => (
        <span 
          key={i} 
          onClick={() => setPage(i + 1)} 
          className={`page-num ${current === i + 1 ? 'active' : ''}`}
        >
          {i + 1}
        </span>
      ))}
      <button 
        disabled={current === totalPages || totalPages === 0} 
        onClick={() => setPage(p => p + 1)} 
        className="page-next"
      >
        <ArrowRight size={18} />
      </button>
    </div>
  </div>
);