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
      localStorage.setItem('indus_products', JSON.stringify(products));
      window.dispatchEvent(new Event('storage')); 
    } catch (error) {
      console.error("Local Storage is full!", error);
      alert("⚠️ مساحة الذاكرة ممتلئة! لا يمكن حفظ الصورة لأن حجمها كبير جداً.");
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1500000) { 
        alert("❌ حجم الصورة كبير جداً! يرجى اختيار صورة لا تتعدى 1.5 ميجابايت.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setNewProdData(prev => ({ ...prev, image: reader.result }));
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
        image: newProdData.image || p.image,
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
        image: newProdData.image || 'https://via.placeholder.com/300?text=IndusConnect',
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
    // 🛠️ تم التعديل هنا: الحاوية الرئيسية أصبحت Flex Column כדי تقسم الصفحة لجزئين (فوق داشبورد، وتحت فوتر)
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F4F4F5' }}>
      
      {/* 🛠️ الجزء العلوي: الداشبورد نفسه (السايدبار والمحتوى) */}
      <div className="dashboard-container" style={{ display: 'flex', flex: 1 }}>
        
        {/* Sidebar Component */}
        <aside className="sidebar" style={{ backgroundColor: '#202938', width: '389px', minHeight: '1000px', top: '149px', left: '80px', padding: '20px 0', borderTopLeftRadius: '30px', borderBottomLeftRadius: '30px', margin: '50px' }}>
          <div className="logo-section" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 25px', marginBottom: '50px' }}>
            <img src={logo} alt="IndusConnect " style={{ height: '35px', objectFit: 'contain' }} />
          </div>
          
          <nav className="nav-menu" style={{ display: 'flex', flexDirection: 'column' }}>
            <div 
              style={{ padding: '15px 25px', margin: '5px 0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px', color: activeTab === 'dashboard' ? '#fff' : '#9CA3AF', backgroundColor: activeTab === 'dashboard' ? '#4B5563' : 'transparent', borderTopRightRadius: '25px', borderBottomRightRadius: '25px', marginRight: '20px', fontWeight: activeTab === 'dashboard' ? 'bold' : 'normal', transition: 'all 0.3s' }}
              onClick={() => { setActiveTab('dashboard'); setCurrentPage(1); }}
            >
              <LayoutDashboard size={20}/> Dashboard
            </div>
            <div 
              style={{ padding: '15px 25px', margin: '5px 0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px', color: activeTab === 'users' ? '#fff' : '#9CA3AF', backgroundColor: activeTab === 'users' ? '#4B5563' : 'transparent', borderTopRightRadius: '25px', borderBottomRightRadius: '25px', marginRight: '20px', fontWeight: activeTab === 'users' ? 'bold' : 'normal', transition: 'all 0.3s' }}
              onClick={() => { setActiveTab('users'); setCurrentPage(1); }}
            >
              <Users size={20}/> Manage Users
            </div>
            <div 
              style={{ padding: '15px 25px', margin: '5px 0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px', color: activeTab === 'products' ? '#fff' : '#9CA3AF', backgroundColor: activeTab === 'products' ? '#4B5563' : 'transparent', borderTopRightRadius: '25px', borderBottomRightRadius: '25px', marginRight: '20px', fontWeight: activeTab === 'products' ? 'bold' : 'normal', transition: 'all 0.3s' }}
              onClick={() => { setActiveTab('products'); setCurrentPage(1); }}
            >
              <Box size={20}/> Manage Products
            </div>
          </nav>
        </aside>

        {/* Main Content Dashboard */}
        <main className="main-content" style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
          
          {/* Top Header */}
          <header style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
            <button style={{ width: '45px', height: '45px', borderRadius: '50%', border: '1px solid #E5E7EB', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4B5563', cursor: 'pointer' }}>
              <Bell size={20}/>
            </button>
            <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150" alt="Admin" style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover' }} />
          </header>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
            <h1 style={{ color: '#C24133', fontSize: '28px', fontWeight: 'bold', margin: 0 }}>
              {activeTab === 'dashboard' ? 'Dashboard' : activeTab === 'users' ? 'Manage Users' : 'Manage Products'}
            </h1>
          </div>

          {/* ==========================================
              DASHBOARD VIEW
              ========================================== */}
          {activeTab === 'dashboard' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '30px' }}>
                <StatCard label="Total Users" val="1250" icon={<Users size={20} color="#C24133"/>} />
                <StatCard label="Products Approved" val={products.filter(p=>p?.status==='Approved').length} icon={<CheckCircle2 size={20} color="#10B981"/>} />
                <StatCard label="Products Pending" val={products.filter(p=>p?.status==='Pending').length} icon={<Clock size={20} color="#F59E0B"/>} />
                <StatCard label="Products Rejected" val={products.filter(p=>p?.status==='Rejected').length} icon={<XCircle size={20} color="#EF4444"/>} />
              </div>

              <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '30px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1F2937', margin: 0 }}>User Growth</h3>
                  <div style={{ display: 'flex', gap: '15px', fontSize: '12px', fontWeight: '500' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981', opacity: 0.3 }}></div> Supplier</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#C24133', opacity: 0.3 }}></div> Buyer</span>
                  </div>
                </div>
                <div style={{ width: '100%', height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
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
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
              <div style={{ width: '100%', maxWidth: '350px', marginBottom: '20px', position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                <input 
                  type="text" 
                  placeholder="Search" 
                  value={userSearch} 
                  onChange={(e) => { setUserSearch(e.target.value); setCurrentPage(1); }} 
                  style={{ width: '100%', padding: '12px 15px 12px 45px', borderRadius: '8px', border: 'none', backgroundColor: '#F3F4F6', fontSize: '14px', outline: 'none' }} 
                />
              </div>
              
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <th style={{ padding: '15px 10px', color: '#111827', fontWeight: 'bold' }}>Full Name</th>
                    <th style={{ padding: '15px 10px', color: '#111827', fontWeight: 'bold' }}>Id</th>
                    <th style={{ padding: '15px 10px', color: '#111827', fontWeight: 'bold' }}>Registration date</th>
                    <th style={{ padding: '15px 10px', color: '#111827', fontWeight: 'bold' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsersList.map((user) => (
                    <tr key={user.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                      <td style={{ padding: '15px 10px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <img src={user.img} alt="" style={{ width: '35px', height: '35px', borderRadius: '50%', objectFit: 'cover' }} />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 'bold', color: '#111827' }}>{user.name}</span>
                          <span style={{ color: '#6B7280', fontSize: '11px' }}>{user.email}</span>
                        </div>
                      </td>
                      <td style={{ padding: '15px 10px', color: '#C24133', fontWeight: 'bold' }}>{user.id}</td>
                      <td style={{ padding: '15px 10px', color: '#4B5563' }}>{user.date}</td>
                      <td style={{ padding: '15px 10px' }}>
                        <span style={{ 
                          padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold',
                          backgroundColor: user.status === 'Buyer' ? '#EFF6FF' : '#FEFCE8',
                          color: user.status === 'Buyer' ? '#3B82F6' : '#EAB308'
                        }}>
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
            <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', overflow: 'hidden' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #E5E7EB' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      onChange={handleSelectAllProducts}
                      checked={selectedProductIds.length === currentProductsList.length && currentProductsList.length > 0} 
                      style={{ accentColor: '#C24133', width: '16px', height: '16px' }}
                    />
                    Select All
                  </label>
                  
                  <div style={{ position: 'relative', width: '250px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                    <input 
                      type="text" 
                      placeholder="Search Products..." 
                      value={productSearch} 
                      onChange={(e) => { setProductSearch(e.target.value); setCurrentPage(1); }} 
                      style={{ width: '100%', padding: '8px 10px 8px 32px', borderRadius: '6px', border: '1px solid #E5E7EB', fontSize: '13px', outline: 'none' }} 
                    />
                  </div>
                </div>

                <button 
                  onClick={() => { setIsEditMode(false); setNewProdData({ name: '', price: '', moq: '', category: 'Furniture', status: 'Approved', description: '', image: '' }); setIsModalOpen(true); }} 
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#C24133', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '25px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
                >
                  <Plus size={16}/> Add Product
                </button>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <th style={{ width: '50px', padding: '15px 20px' }}></th>
                    <th style={{ padding: '15px 10px', color: '#111827', fontWeight: 'bold' }}>Product Name</th>
                    <th style={{ padding: '15px 10px', color: '#111827', fontWeight: 'bold' }}>Price</th>
                    <th style={{ padding: '15px 10px', color: '#111827', fontWeight: 'bold' }}>Quantity</th>
                    <th style={{ padding: '15px 10px', color: '#111827', fontWeight: 'bold' }}>Status</th>
                    <th style={{ padding: '15px 10px', color: '#111827', fontWeight: 'bold', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProductsList.length > 0 ? currentProductsList.map((prod) => (
                    <tr key={prod.id} style={{ borderBottom: '1px solid #F3F4F6', transition: 'background-color 0.2s' }}>
                      <td style={{ padding: '15px 20px' }}>
                        <input type="checkbox" checked={selectedProductIds.includes(prod.id)} onChange={(e) => handleSelectProduct(e, prod.id)} style={{ accentColor: '#C24133', width: '16px', height: '16px' }} />
                      </td>
                      <td style={{ padding: '15px 10px', display: 'flex', alignItems: 'center', gap: '15px', fontWeight: 'bold', color: '#111827' }}>
                        <img src={prod?.image || 'https://via.placeholder.com/40'} alt="" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} onError={(e)=>{e.target.src='https://via.placeholder.com/40'}}/>
                        {prod?.name || 'Unnamed Product'}
                      </td>
                      <td style={{ padding: '15px 10px', fontWeight: 'bold' }}>
                        <span style={{ color: '#C24133' }}>{Number(prod?.price || 0).toLocaleString()}</span> <span style={{ color: '#6B7280', fontSize: '11px' }}>EGP</span>
                      </td>
                      <td style={{ padding: '15px 10px', fontWeight: 'bold' }}>
                        <span style={{ color: '#C24133' }}>{prod?.moq ? String(prod.moq).replace(/\D/g,'') : '10'}</span> <span style={{ color: '#6B7280', fontSize: '11px' }}>Unit</span>
                      </td>
                      <td style={{ padding: '15px 10px' }}>
                        <span style={{ 
                          padding: '4px 10px', borderRadius: '15px', fontSize: '10px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '4px',
                          color: prod?.status === 'Approved' ? '#10B981' : prod?.status === 'Pending' ? '#F59E0B' : '#EF4444',
                          backgroundColor: prod?.status === 'Approved' ? '#ECFDF5' : prod?.status === 'Pending' ? '#FFFBEB' : '#FEF2F2',
                          border: `1px solid ${prod?.status === 'Approved' ? '#A7F3D0' : prod?.status === 'Pending' ? '#FDE68A' : '#FECACA'}`
                        }}>
                          {prod?.status || 'Approved'} {prod?.status === 'Approved' && '✓'}
                        </span>
                      </td>
                      <td style={{ padding: '15px 10px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                          <button onClick={(e) => handleOpenEditModal(e, prod)} style={{ border: 'none', background: 'none', color: '#4B5563', cursor: 'pointer' }} title="Edit"><Pencil size={18} /></button>
                          <button onClick={(e) => handleDeleteProduct(e, prod.id)} style={{ border: 'none', background: 'none', color: '#EF4444', cursor: 'pointer' }} title="Delete"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#6B7280' }}>No products found.</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <Pagination totalPages={totalProductPages} current={currentPage} setPage={setCurrentPage} />
            </div>
          )}

        </main>
      </div>

      {/* 🛠️ الجزء السفلي: الفوتر بره السايدبار والمحتوى عشان ياخد 100% عرض الشاشة */}
      <div style={{ width: '100%' }}>
        <Footer />
      </div>

      {/* ==========================================
          MODAL (ADD / EDIT PRODUCT)
          ========================================== */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, backdropFilter: 'blur(3px)' }}>
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '16px', width: '450px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ marginBottom: '20px', fontWeight: 'bold', color: '#111827', fontSize: '20px' }}>{isEditMode ? 'Edit Product Card' : 'Create New Product Card'}</h3>
            <form onSubmit={handleSaveProduct}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '13px', color: '#4B5563' }}>Product Image</label>
                <div style={{ width: '100%', height: '140px', border: '2px dashed #D1D5DB', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', backgroundColor: '#F9FAFB', overflow: 'hidden' }}>
                  {newProdData.image ? <img src={newProdData.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ color: '#9CA3AF', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}><ImageIcon size={32} /><span style={{fontSize:'12px', fontWeight:'500'}}>Click to upload image</span></div>}
                  <input type="file" accept="image/*" onChange={handleImageChange} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                </div>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '13px', color: '#4B5563' }}>Product Name</label>
                <input type="text" value={newProdData.name} onChange={e => setNewProdData({...newProdData, name: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB', outline: 'none' }} required />
              </div>
              <div style={{ marginBottom: '15px', display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '13px', color: '#4B5563' }}>Price (EGP)</label>
                  <input type="number" value={newProdData.price} onChange={e => setNewProdData({...newProdData, price: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB', outline: 'none' }} required />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '13px', color: '#4B5563' }}>Quantity / MOQ</label>
                  <input type="text" value={newProdData.moq} onChange={e => setNewProdData({...newProdData, moq: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB', outline: 'none' }} placeholder="e.g. 50" />
                </div>
              </div>
              <div style={{ marginBottom: '15px', display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '13px', color: '#4B5563' }}>Category</label>
                  <select value={newProdData.category} onChange={e => setNewProdData({...newProdData, category: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB', outline: 'none', backgroundColor: '#fff' }}>
                    <option value="Furniture">Furniture</option>
                    <option value="Textile">Textile</option>
                    <option value="Raw Material">Raw Material</option>
                    <option value="Package">Package</option>
                    <option value="Electronic & Spare Parts">Electronic & Spare Parts</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '13px', color: '#4B5563' }}>Status</label>
                  <select value={newProdData.status} onChange={e => setNewProdData({...newProdData, status: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB', outline: 'none', backgroundColor: '#fff' }}>
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '13px', color: '#4B5563' }}>Description</label>
                <textarea value={newProdData.description} onChange={e => setNewProdData({...newProdData, description: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB', outline: 'none', height: '60px', resize: 'none' }}></textarea>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 20px', borderRadius: '25px', border: '1px solid #D1D5DB', backgroundColor: '#fff', fontWeight: 'bold', color: '#4B5563', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 25px', borderRadius: '25px', backgroundColor: '#C24133', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Save Product</button>
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
  <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
    <div>
      <p style={{ color: '#111827', fontSize: '13px', fontWeight: 'bold', margin: '0 0 10px 0' }}>{label}</p>
      <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#111827', margin: 0 }}>{val}</h2>
    </div>
    <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {icon}
    </div>
  </div>
);

const Pagination = ({ totalPages, current, setPage }) => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0', borderTop: '1px solid #E5E7EB' }}>
    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
      {[...Array(totalPages)].map((_, i) => (
        <span 
          key={i} 
          onClick={() => setPage(i + 1)} 
          style={{ 
            width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold',
            backgroundColor: current === i + 1 ? '#6B7280' : 'transparent',
            color: current === i + 1 ? '#fff' : '#6B7280',
            transition: 'all 0.2s'
          }}
        >
          {i + 1}
        </span>
      ))}
      <button 
        disabled={current === totalPages || totalPages === 0} 
        onClick={() => setPage(p => p + 1)} 
        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#6B7280', opacity: (current === totalPages || totalPages === 0) ? 0.3 : 1 }}
      >
        <ArrowRight size={18} />
      </button>
    </div>
  </div>
);