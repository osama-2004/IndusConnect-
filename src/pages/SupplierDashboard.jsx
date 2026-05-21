import React, { useState } from 'react';
import { 
  LayoutDashboard, Box, Bell, ClipboardList, 
  ReceiptText, Users, CheckCircle2, Clock, 
  XCircle, Search, ArrowRight, Plus, SlidersHorizontal 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as BarTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip as PieTooltip
} from 'recharts';
import './SupplierDashboard.css';
import logo from '../assets/logo.svg';
import Footer from '../components/Footer'; // 🛠️ استيراد الفوتر

// ==========================================
// MOCK DATA
// ==========================================
const PRODUCTS_DATA = [
  { id: 1, name: 'Solid Shelf Table', category: 'Furniture', price: 1000, quantity: 12, status: 'Approved', img: '/cat_furniture_shelf.png' },
  { id: 2, name: 'Tinted Glass Lights', category: 'Furniture', price: 700, quantity: 20, status: 'Pending', img: '/product_amber_pendant.png' },
  { id: 3, name: 'Cardboard Boxes', category: 'Package', price: 10, quantity: 500, status: 'Pending', img: '/product_agri_equipment.png' },
  { id: 4, name: 'Hoodies', category: 'Textile', price: 250, quantity: 50, status: 'Approved', img: '/cat_textile_hoodies.png' },
  { id: 5, name: 'Modern pendant light', category: 'Furniture', price: 600, quantity: 50, status: 'Approved', img: '/product_amber_pendant.png' },
  { id: 6, name: 'Precision Cutter', category: 'Industrial supplies', price: 10000, quantity: 5, status: 'Rejected', img: '/product_amber_pendant.png' }
];

const RFQ_ORDERS_DATA = [
  { id: '#1052', name: 'Laila Hassan', date: 'Mar 22, 2026', price: 1000, qty: 12, status: 'Confirm', img: 'https://i.pravatar.cc/150?u=5122' },
  { id: '#1051', name: 'Omar Ahmed', date: 'Mar 22, 2026', price: 700, qty: 20, status: 'Pending', img: 'https://i.pravatar.cc/150?u=5123' },
  { id: '#1050', name: 'Hla Osama', date: 'Mar 22, 2026', price: 100, qty: 500, status: 'Pending', img: 'https://i.pravatar.cc/150?u=5124' },
  { id: '#1049', name: 'Nahla Abdallah', date: 'Mar 22, 2026', price: 250, qty: 50, status: 'Confirm', img: 'https://i.pravatar.cc/150?u=5125' },
  { id: '#1048', name: 'Nesreen Osman', date: 'Mar 22, 2026', price: 600, qty: 50, status: 'Rejected', img: 'https://i.pravatar.cc/150?u=5126' },
  { id: '#1047', name: 'Anas Ibrahim', date: 'Mar 22, 2026', price: 50, qty: 5, status: 'Rejected', img: 'https://i.pravatar.cc/150?u=5127' }
];

const ORDERS_DATA = [
  { id: '#2052', name: 'Laila Hassan', date: 'Mar 22, 2026', price: 1000, qty: 12, status: 'Delivered', img: 'https://i.pravatar.cc/150?u=5122' },
  { id: '#2051', name: 'Omar Ahmed', date: 'Mar 22, 2026', price: 700, qty: 20, status: 'On Way', img: 'https://i.pravatar.cc/150?u=5123' },
  { id: '#2050', name: 'Hla Osama', date: 'Mar 22, 2026', price: 100, qty: 500, status: 'On Way', img: 'https://i.pravatar.cc/150?u=5124' },
  { id: '#2049', name: 'Nahla Abdallah', date: 'Mar 22, 2026', price: 250, qty: 50, status: 'Delivered', img: 'https://i.pravatar.cc/150?u=5125' },
  { id: '#2048', name: 'Nesreen Osman', date: 'Mar 22, 2026', price: 600, qty: 50, status: 'On Way', img: 'https://i.pravatar.cc/150?u=5126' },
  { id: '#2047', name: 'Anas Ibrahim', date: 'Mar 22, 2026', price: 50, qty: 5, status: 'Delivered', img: 'https://i.pravatar.cc/150?u=5127' }
];

const SALES_DATA = [
  { name: 'JAN', sales: 1800 }, { name: 'FEB', sales: 2900 },
  { name: 'MAR', sales: 3000 }, { name: 'APR', sales: 3600 },
  { name: 'MAY', sales: 2200 }, { name: 'JUN', sales: 2800 },
  { name: 'JUL', sales: 3300 }, { name: 'AUG', sales: 2800 },
  { name: 'SEP', sales: 2400 }, { name: 'OCT', sales: 3000 },
  { name: 'NOV', sales: 3800 }, { name: 'DEC', sales: 2500 }
];

const ORDER_STATUS_DATA = [
  { name: 'Confirmed', value: 40, color: '#10B981' },
  { name: 'Pending', value: 25, color: '#3B82F6' },
  { name: 'Arrived', value: 15, color: '#F59E0B' },
  { name: 'Cancelled', value: 10, color: '#EF4444' },
  { name: 'Walk in', value: 5, color: '#8B5CF6' },
  { name: 'No shows', value: 5, color: '#D1D5DB' }
];

// ==========================================
// COMPONENT
// ==========================================
export default function SupplierDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentPage, setCurrentPage] = useState(1);

  const renderPagination = () => (
    <div className="pagination-wrapper">
      <div className="pagination-controls">
        <span className={`page-step ${currentPage === 1 ? 'active' : ''}`} onClick={() => setCurrentPage(1)}>1</span>
        <span className={`page-step ${currentPage === 2 ? 'active' : ''}`} onClick={() => setCurrentPage(2)}>2</span>
        <span className={`page-step ${currentPage === 3 ? 'active' : ''}`} onClick={() => setCurrentPage(3)}>3</span>
        <span className={`page-step ${currentPage === 4 ? 'active' : ''}`} onClick={() => setCurrentPage(4)}>4</span>
        <button className="page-next"><ArrowRight size={16} /></button>
      </div>
    </div>
  );

  return (
    <div className="supplier-dashboard" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* Container holding Sidebar and Main Content */}
      <div style={{ display: 'flex', flex: 1 }}>
        <aside className="sidebar">
          <div className="logo-section">
            <img src={logo} alt="IndusConnect" className="logo-img" style={{ height: '35px', objectFit: 'contain' }} />
          </div>
          
          <nav className="nav-menu">
            <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => { setActiveTab('dashboard'); setCurrentPage(1); }}>
              <LayoutDashboard size={20}/> Dashboard
            </div>
            <div className={`nav-item ${activeTab === 'products' ? 'active' : ''}`} onClick={() => { setActiveTab('products'); setCurrentPage(1); }}>
              <Box size={20}/> Products
            </div>
            <div className={`nav-item ${activeTab === 'rfq' ? 'active' : ''}`} onClick={() => { setActiveTab('rfq'); setCurrentPage(1); }}>
              <ClipboardList size={20}/> RFQ
            </div>
            <div className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => { setActiveTab('orders'); setCurrentPage(1); }}>
              <ReceiptText size={20}/> Orders
            </div>
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
            <h1 className="page-title">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
          </div>

          {activeTab === 'dashboard' && (
            <>
              <div className="stats-grid">
                <div className="stat-card"><div><p>Total Products</p><h2>128</h2></div><div className="stat-icon"><Users size={20} color="#C24133"/></div></div>
                <div className="stat-card"><div><p>Buyers</p><h2>86</h2></div><div className="stat-icon"><CheckCircle2 size={20} color="#10B981"/></div></div>
                <div className="stat-card"><div><p>Orders</p><h2>245</h2></div><div className="stat-icon"><Clock size={20} color="#F59E0B"/></div></div>
                <div className="stat-card"><div><p>Sales</p><h2>48,750</h2></div><div className="stat-icon"><XCircle size={20} color="#EF4444"/></div></div>
              </div>

              <div className="card-panel mt-30">
                <div className="panel-header"><h3>Sales dynamics</h3><div className="year-selector">2023 <span className="arrow-down">▼</span></div></div>
                <div className="chart-container" style={{ height: '280px' }}>
                  <ResponsiveContainer width="100%" height="100%">
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
                <div className="search-box"><Search size={16} className="search-icon" /><input type="text" placeholder="Search" /></div>
                <button className="btn-primary"><Plus size={16}/> Add New Product</button>
              </div>
              <table className="data-table">
                <thead>
                  <tr><th>Product Name ↕</th><th>Category</th><th>Price ↕</th><th>Quantity</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {PRODUCTS_DATA.map((item) => (
                    <tr key={item.id}>
                      <td><div className="cell-flex"><img src={item.img} alt="" className="table-img" onError={(e)=>{e.target.src='https://via.placeholder.com/40'}}/><span className="fw-bold text-dark">{item.name}</span></div></td>
                      <td className="text-red">{item.category}</td>
                      <td className="fw-bold"><span className="text-red">{item.price}</span> <span className="text-muted">EGP</span></td>
                      <td className="fw-bold"><span className="text-red">{item.quantity}</span> <span className="text-muted">Unit</span></td>
                      <td><span className={`status-badge ${item.status.toLowerCase()}`}>{item.status} {item.status === 'Approved' && '✓'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {renderPagination()}
            </div>
          )}

          {activeTab === 'rfq' && (
            <div className="card-panel p-0">
              <div className="panel-header-actions justify-end"><button className="btn-outline"><SlidersHorizontal size={14}/> Filter</button></div>
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
              {renderPagination()}
            </div>
          )}

          {activeTab === 'orders' && (
            <>
              <div className="card-panel">
                <h3 className="chart-title">Order Status</h3>
                <div className="donut-chart-wrapper">
                  <div className="donut-chart">
                    <ResponsiveContainer width={220} height={220}>
                      <PieChart>
                        <Pie data={ORDER_STATUS_DATA} innerRadius={65} outerRadius={90} paddingAngle={2} dataKey="value" stroke="none">
                          {ORDER_STATUS_DATA.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Pie>
                        <PieTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="donut-center-text"><h2>2563</h2><p>Reservation</p></div>
                  </div>
                  <div className="donut-legend">
                    {ORDER_STATUS_DATA.map((item, index) => (
                      <div className="legend-item" key={index}><span className="legend-dot" style={{ backgroundColor: item.color }}></span><span className="fw-bold text-dark">201</span> <span className="text-muted">{item.name}</span></div>
                    ))}
                  </div>
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

      {/* الفوتر الآن خارج الـ flex container عشان ياخد العرض كامل */}
      <div style={{ width: '100%' }}>
        <Footer />
      </div>
    </div>
  );
}