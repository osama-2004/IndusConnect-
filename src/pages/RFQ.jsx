import { useState, useRef } from 'react'
import './RFQ.css'

export default function RFQ() {
  
  const [form, setForm] = useState({
    product: '', date: '', quantity: '', budget: '', notes: '', file: null
  });

  const [supplierResponses, setSupplierResponses] = useState([
    { id: 1, name: 'Mobica', location: 'Cairo', rating: '4.8 (120)', price: '100 EGP', qty: '5,000 pcs', total: '41,000 EGP', delivery: '10 Days', status: 'confirmed' },
    { id: 2, name: 'Alex Industrial Co.', location: 'Alexandria', rating: '4.6 (95)', price: '88 EGP', qty: '5,000 pcs', total: '48,000 EGP', delivery: '12 Days', status: 'pending' },
    { id: 3, name: 'Aswan Nile Supplies', location: 'Aswan', rating: '4.4 (62)', price: '95 EGP', qty: '5,000 pcs', total: '55,000 EGP', delivery: '10 Days', status: 'pending' },
    { id: 4, name: 'Delta Pack Industries', location: 'Menoufia', rating: '4.3 (75)', price: '105 EGP', qty: '5,000 pcs', total: '60,000 EGP', delivery: '10 Days', status: 'pending' },
  ]);

  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("✅ RFQ Submitted Successfully!");
  };

  const handleSaveDraft = () => {
    alert("💾 Draft saved!");
  };

  const handleConfirm = (id) => {
    setSupplierResponses(prevResponses => 
      prevResponses.map(res => 
        res.id === id ? { ...res, status: 'confirmed' } : res
      )
    );
  };

  const handleFileChange = (file) => {
    if (file) {
      setForm(prev => ({ ...prev, file: file }));
    }
  };

  return (
    // الحاوية الرئيسية تم تبسيطها لتتوافق مع تخطيط App.jsx
    <div className="rfq-page-wrapper">
      
      <div className="rfq-container" style={{ paddingBottom: '40px' }}>
        <div className="rfq-page-header">
          <span className="rfq-icon-box">📋</span>
          <h1 className="rfq-main-title">RFQ List</h1>
        </div>

        <form className="rfq-form-card" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label>Product / Service</label>
              <input name="product" value={form.product} onChange={handleChange} type="text" placeholder="Enter product" required />
            </div>
            
            <div className="form-field">
              <label>Date Needed By</label>
              <div className="input-with-icon" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input 
                  name="date" 
                  value={form.date} 
                  onChange={handleChange} 
                  type="text" 
                  placeholder="mm/dd/yyyy" 
                  style={{ width: '100%', paddingRight: '35px' }}
                />
                <span className="calendar-icon" style={{ position: 'absolute', right: '12px', pointerEvents: 'none', fontSize: '14px' }}>📅</span>
              </div>
            </div>
            
            <div className="form-field">
              <label>Quantity</label>
              <input name="quantity" value={form.quantity} onChange={handleChange} type="text" placeholder="Enter quantity" />
            </div>
            
            <div className="form-field">
              <label>Budget</label>
              <div className="input-with-unit" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input 
                  name="budget" 
                  value={form.budget} 
                  onChange={handleChange} 
                  type="text" 
                  placeholder="Enter budget"
                  style={{ width: '100%', paddingRight: '45px' }}
                />
                <span className="unit-label" style={{ position: 'absolute', right: '12px', color: '#888', pointerEvents: 'none', fontSize: '12px', fontWeight: 'bold' }}>EGP</span>
              </div>
            </div>
          </div>

          <div className="form-field full-width">
            <label>Additional Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Notes..." rows="4"></textarea>
          </div>

          {/* Attachments */}
          <div className="form-field full-width">
            <label>Attachments</label>
            <div 
              className="file-drop-area"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFileChange(e.dataTransfer.files[0]);
              }}
              onClick={() => fileInputRef.current.click()}
            >
              <input type="file" hidden ref={fileInputRef} onChange={(e) => handleFileChange(e.target.files[0])} />
              <div className="drop-zone-content">
                <span className="file-icon">{form.file ? '✅' : '📄'}</span>
                <p>{form.file ? form.file.name : "Drag & Drop here Or Browse"}</p>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit-rfq">Submit RFQ</button>
            <button type="button" className="btn-save-draft" onClick={handleSaveDraft}>Save as draft</button>
          </div>
        </form>

        {/* Responses List */}
        <div className="responses-section">
          <h2 className="responses-title">Supplier Responses ({supplierResponses.length})</h2>
          <div className="responses-list">
            {supplierResponses.map((res) => (
              <div key={res.id} className={`response-card ${res.status === 'confirmed' ? 'active-border' : ''}`}>
                <div className="res-company-info">
                  <div className="company-logo-placeholder">🏢</div>
                  <div>
                    <h3>{res.name}</h3>
                    <p className="location-text">{res.location}</p>
                    <span className="rating-text">⭐ {res.rating}</span>
                  </div>
                </div>
                
                <div className="res-details-grid">
                  <div className="res-data">
                     <label>Unit price</label>
                     <span>{res.price}</span>
                  </div>
                  <div className="res-data">
                     <label>Total Price</label>
                     <span>{res.total}</span>
                  </div>
                  <div className="res-data">
                     <label>Delivery</label>
                     <span>{res.delivery}</span>
                  </div>
                </div>

                <button 
                  type="button"
                  className={`btn-confirm ${res.status === 'confirmed' ? 'confirmed' : ''}`}
                  onClick={() => handleConfirm(res.id)}
                >
                  {res.status === 'confirmed' ? 'Confirmed' : 'Confirm'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  )
}