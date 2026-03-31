import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStaffAuth } from '../context/StaffAuthContext';
import { billingStaffAPI, paymentAPI } from '../services/api';
import {
  ShoppingCart, Plus, Minus, Trash2, Search, Star, Send, LogOut,
  Receipt, Clock, User, Mail, Phone, MessageSquare, CheckCircle, Package, ArrowLeft, Download, Printer, Eye, Trash
} from 'lucide-react';

const GOLD = '#c9a84c';
const GOLD_LIGHT = '#e0c873';
const TEXT_SEC = '#a09888';
const TEXT_MUTED = '#605848';

const BillingStaffDashboard = () => {
  const { user, logout } = useStaffAuth();
  const navigate = useNavigate();

  // State
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('billing'); // 'billing' | 'history'
  const [history, setHistory] = useState([]);
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '' });
  const [feedback, setFeedback] = useState({ rating: 0, comment: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [viewingBill, setViewingBill] = useState(null);

  useEffect(() => {
    billingStaffAPI.getProducts().then(setProducts).catch(() => {});
  }, []);

  useEffect(() => {
    if (activeTab === 'history') {
      billingStaffAPI.getHistory().then(setHistory).catch(() => {});
    }
  }, [activeTab]);

  const handleLogout = () => { logout(); navigate('/login'); };

  // Cart operations
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === product.id);
      if (existing) return prev.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { productId: product.id, name: product.name, price: product.price, quantity: 1 }];
    });
  };

  const updateQty = (productId, delta) => {
    setCart(prev => prev.map(i => {
      if (i.productId !== productId) return i;
      const newQty = i.quantity + delta;
      return newQty > 0 ? { ...i, quantity: newQty } : i;
    }).filter(i => i.quantity > 0));
  };

  const removeFromCart = (productId) => setCart(prev => prev.filter(i => i.productId !== productId));

  // Bill action handlers
  const handleViewBill = (bill) => {
    setViewingBill(bill);
  };

  const handleDownloadBill = (bill) => {
    const billContent = `
INVOICE
Bill Number: ${bill.billNumber}
Date: ${new Date(bill.createdAt).toLocaleDateString('en-IN')}
Customer: ${bill.customerName}
Email: ${bill.customerEmail}

ITEMS:
${bill.items.map(item => `${item.productName} x${item.quantity} @ ₹${item.price} = ₹${item.total}`).join('\n')}

Subtotal: ₹${bill.subtotal.toFixed(2)}
Tax (18%): ₹${bill.tax.toFixed(2)}
Total: ₹${bill.total.toFixed(2)}
Status: ${bill.status.toUpperCase()}
    `.trim();
    
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(billContent));
    element.setAttribute('download', `${bill.billNumber}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrintBill = (bill) => {
    const printWindow = window.open('', '', 'height=600,width=800');
    const billHTML = `
      <html><head><title>${bill.billNumber}</title>
      <style>
        body { font-family: Arial; margin: 20px; }
        h1 { text-align: center; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .total { text-align: right; font-weight: bold; }
        .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
      </style>
      </head><body>
      <h1>INVOICE</h1>
      <p><strong>Bill Number:</strong> ${bill.billNumber}</p>
      <p><strong>Date:</strong> ${new Date(bill.createdAt).toLocaleDateString('en-IN')}</p>
      <p><strong>Customer:</strong> ${bill.customerName}</p>
      <p><strong>Email:</strong> ${bill.customerEmail}</p>
      <table>
        <tr><th>Product</th><th>Price</th><th>Qty</th><th>Total</th></tr>
        ${bill.items.map(item => `<tr><td>${item.productName}</td><td>₹${item.price}</td><td>${item.quantity}</td><td>₹${item.total.toFixed(2)}</td></tr>`).join('')}
      </table>
      <div style="text-align: right; margin-right: 20px;">
        <p>Subtotal: ₹${bill.subtotal.toFixed(2)}</p>
        <p>Tax (18%): ₹${bill.tax.toFixed(2)}</p>
        <p style="font-size: 18px; font-weight: bold;">Total: ₹${bill.total.toFixed(2)}</p>
      </div>
      <div class="footer">
        <p>Status: ${bill.status.toUpperCase()}</p>
        <p>Thank you for your business!</p>
      </div>
      </body></html>
    `;
    printWindow.document.write(billHTML);
    printWindow.document.close();
    printWindow.print();
  };

  const handleDeleteBill = async (billId) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      setHistory(prev => prev.filter(b => b._id !== billId));
    }
  };

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tax = Math.round(subtotal * 0.18 * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmitBill = async () => {
    setError('');
    if (!cart.length) { setError('Add at least one product to the bill'); return; }
    if (!customer.name || !customer.email || !customer.phone) { setError('Please fill in all customer details'); return; }
    if (customer.phone.length < 6) { setError('Phone number must be at least 6 digits'); return; }

    setIsSubmitting(true);
    try {
      // Step 1: Create Razorpay order
      const order = await paymentAPI.createOrder(total);

      // Step 2: Open Razorpay Checkout popup
      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'InsightBI',
        description: `Bill Payment — ${cart.length} item(s)`,
        order_id: order.orderId,
        prefill: {
          name: customer.name,
          email: customer.email,
          contact: customer.phone,
        },
        theme: { color: '#c9a84c' },
        handler: async (response) => {
          try {
            // Step 3: Verify payment signature
            const verification = await paymentAPI.verify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verification.verified) {
              // Step 4: Create bill after successful payment
              const result = await billingStaffAPI.createBill({
                items: cart.map(i => ({ productId: i.productId, quantity: i.quantity })),
                customer,
                feedback: feedback.rating > 0 || feedback.comment ? feedback : null,
                paymentId: verification.paymentId,
              });
              setSuccess(result);
              setCart([]);
              setCustomer({ name: '', email: '', phone: '' });
              setFeedback({ rating: 0, comment: '' });
            } else {
              setError('Payment verification failed. Bill was not created.');
            }
          } catch (err) {
            setError(err.message || 'Payment verification failed');
          }
          setIsSubmitting(false);
        },
        modal: {
          ondismiss: () => {
            setError('Payment was cancelled. Bill was not created.');
            setIsSubmitting(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        setError(`Payment failed: ${response.error.description}`);
        setIsSubmitting(false);
      });
      rzp.open();
    } catch (err) {
      setError(err.message || 'Failed to initiate payment');
      setIsSubmitting(false);
    }
  };

  const cardStyle = { background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px' };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Top Bar */}
      <div className="sticky top-0 z-50 px-5 md:px-10 lg:px-[60px] py-4" style={{ background: 'rgba(6,6,6,0.9)', backdropFilter: 'blur(30px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <Link to="/" className="flex flex-col items-start gap-[2px]">
            <span className="text-[1.3rem] font-normal tracking-[0.5em]" style={{ fontFamily: 'var(--font-heading)', color: GOLD }}>INSIGHT</span>
            <span className="text-[0.45rem] tracking-[0.4em] uppercase" style={{ fontFamily: 'var(--font-body)', color: TEXT_MUTED }}>BILLING PORTAL</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm hidden sm:inline" style={{ color: TEXT_SEC }}>{user?.email}</span>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all"
              style={{ color: TEXT_SEC, border: '1px solid var(--border-subtle)', background: 'transparent', cursor: 'pointer' }}>
              <LogOut className="w-4 h-4" /><span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-5 md:px-10 lg:px-[60px] py-8">
        {/* Header + Tabs */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: GOLD }}>
              <Receipt className="w-7 h-7" style={{ color: '#060606' }} />
            </div>
            <div>
              <h1 className="text-3xl" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontWeight: 400 }}>Billing Station</h1>
              <p className="text-sm" style={{ color: TEXT_SEC }}>Create bills, manage products & collect feedback</p>
            </div>
          </div>
          <div className="flex gap-1 p-1 rounded-lg" style={{ background: 'var(--bg-card)' }}>
            {['billing', 'history'].map(tab => (
              <button key={tab} onClick={() => { setActiveTab(tab); setSuccess(null); }}
                className="px-5 py-2 rounded-md text-sm font-medium transition-colors capitalize"
                style={{
                  background: activeTab === tab ? GOLD : 'transparent',
                  color: activeTab === tab ? '#060606' : TEXT_SEC,
                  border: 'none', cursor: 'pointer',
                }}>{tab === 'billing' ? '🧾 New Bill' : '📋 History'}</button>
            ))}
          </div>
        </div>

        {/* Success Banner */}
        {success && (
          <div className="mb-6 p-5 rounded-xl flex flex-col sm:flex-row sm:items-center gap-4" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
            <CheckCircle className="w-6 h-6 flex-shrink-0" style={{ color: '#22c55e' }} />
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: '#4ade80' }}>Bill {success.bill?.id} created successfully!</p>
              {success.userCreated && (
                <p className="text-xs mt-1" style={{ color: TEXT_SEC }}>
                  User account created → <strong style={{ color: GOLD }}>{success.userCredentials?.email}</strong> / Password: <strong style={{ color: GOLD }}>{success.userCredentials?.password}</strong>
                </p>
              )}
            </div>
            <button onClick={() => setSuccess(null)} className="text-sm px-3 py-1 rounded-lg" style={{ color: TEXT_SEC, background: 'transparent', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}>Dismiss</button>
          </div>
        )}

        {activeTab === 'billing' ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left: Product Catalog (3 cols) */}
            <div className="lg:col-span-3 space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: TEXT_MUTED }} />
                <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search products by name or category..."
                  className="input-field pl-12 w-full" />
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredProducts.map(product => {
                  const inCart = cart.find(i => i.productId === product.id);
                  return (
                    <div key={product.id} className="p-5 transition-all duration-300" style={{
                      ...cardStyle,
                      borderColor: inCart ? 'rgba(201,168,76,0.4)' : 'var(--border-subtle)',
                    }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)'}
                      onMouseLeave={e => { if (!inCart) e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{product.name}</h3>
                          <span className="text-[0.65rem] px-2 py-0.5 rounded-full mt-1 inline-block" style={{ background: 'rgba(201,168,76,0.1)', color: GOLD }}>{product.category}</span>
                        </div>
                        <span className="text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)', color: GOLD }}>₹{product.price}</span>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs" style={{ color: TEXT_MUTED }}>SKU: {product.sku}</span>
                        {inCart ? (
                          <div className="flex items-center gap-2">
                            <button onClick={() => updateQty(product.id, -1)} className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: 'var(--surface)', border: '1px solid var(--border-subtle)', color: TEXT_SEC, cursor: 'pointer' }}><Minus className="w-3.5 h-3.5" /></button>
                            <span className="text-sm font-medium w-6 text-center" style={{ color: 'var(--text-primary)' }}>{inCart.quantity}</span>
                            <button onClick={() => updateQty(product.id, 1)} className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: GOLD, border: 'none', color: '#060606', cursor: 'pointer' }}><Plus className="w-3.5 h-3.5" /></button>
                          </div>
                        ) : (
                          <button onClick={() => addToCart(product)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all" style={{ background: 'transparent', border: '1px solid var(--border-subtle)', color: TEXT_SEC, cursor: 'pointer' }}>
                            <Plus className="w-3.5 h-3.5" /> Add
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Cart + Customer + Feedback (2 cols) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cart */}
              <div className="p-6" style={cardStyle}>
                <div className="flex items-center gap-2 mb-5">
                  <ShoppingCart className="w-5 h-5" style={{ color: GOLD }} />
                  <h2 className="text-lg font-medium" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>Cart</h2>
                  <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(201,168,76,0.15)', color: GOLD }}>{cart.length} items</span>
                </div>

                {cart.length === 0 ? (
                  <p className="text-sm text-center py-8" style={{ color: TEXT_MUTED }}>No items in cart. Add products from the catalog.</p>
                ) : (
                  <div className="space-y-3 mb-5">
                    {cart.map(item => (
                      <div key={item.productId} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--surface)' }}>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate" style={{ color: 'var(--text-primary)' }}>{item.name}</p>
                          <p className="text-xs" style={{ color: TEXT_MUTED }}>₹{item.price} × {item.quantity}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium" style={{ color: GOLD }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                          <button onClick={() => removeFromCart(item.productId)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {cart.length > 0 && (
                  <div className="pt-4 space-y-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    <div className="flex justify-between text-sm"><span style={{ color: TEXT_SEC }}>Subtotal</span><span style={{ color: 'var(--text-primary)' }}>₹{subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between text-sm"><span style={{ color: TEXT_SEC }}>GST (18%)</span><span style={{ color: 'var(--text-primary)' }}>₹{tax.toFixed(2)}</span></div>
                    <div className="flex justify-between text-base font-semibold pt-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                      <span style={{ color: 'var(--text-primary)' }}>Total</span>
                      <span style={{ color: GOLD, fontFamily: 'var(--font-heading)' }}>₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Customer Details */}
              <div className="p-6" style={cardStyle}>
                <div className="flex items-center gap-2 mb-5">
                  <User className="w-5 h-5" style={{ color: GOLD }} />
                  <h2 className="text-lg font-medium" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>Customer Details</h2>
                </div>
                <p className="text-xs mb-4" style={{ color: TEXT_MUTED }}>These credentials will be used for customer login</p>
                <div className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: TEXT_MUTED }} />
                    <input type="text" value={customer.name} onChange={e => setCustomer(p => ({ ...p, name: e.target.value }))}
                      placeholder="Customer Name" className="input-field pl-10 w-full text-sm" />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: TEXT_MUTED }} />
                    <input type="email" value={customer.email} onChange={e => setCustomer(p => ({ ...p, email: e.target.value }))}
                      placeholder="Customer Email" className="input-field pl-10 w-full text-sm" />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: TEXT_MUTED }} />
                    <input type="tel" value={customer.phone} onChange={e => setCustomer(p => ({ ...p, phone: e.target.value }))}
                      placeholder="Phone (last 6 digits = password)" className="input-field pl-10 w-full text-sm" />
                  </div>
                </div>
              </div>

              {/* Feedback */}
              <div className="p-6" style={cardStyle}>
                <div className="flex items-center gap-2 mb-5">
                  <MessageSquare className="w-5 h-5" style={{ color: GOLD }} />
                  <h2 className="text-lg font-medium" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>Customer Feedback</h2>
                </div>
                <p className="text-[0.7rem] tracking-[0.1em] uppercase mb-3" style={{ color: TEXT_SEC }}>Rating</p>
                <div className="flex gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} onClick={() => setFeedback(p => ({ ...p, rating: star }))}
                      onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                      <Star className="w-7 h-7 transition-colors" style={{
                        color: (hoverRating || feedback.rating) >= star ? GOLD : TEXT_MUTED,
                        fill: (hoverRating || feedback.rating) >= star ? GOLD : 'transparent',
                      }} />
                    </button>
                  ))}
                  {feedback.rating > 0 && (
                    <span className="text-sm ml-2 self-center" style={{ color: GOLD }}>{feedback.rating}/5</span>
                  )}
                </div>
                <textarea value={feedback.comment} onChange={e => setFeedback(p => ({ ...p, comment: e.target.value }))}
                  placeholder="Customer comments or feedback..."
                  rows={3} className="input-field w-full text-sm resize-none" />
              </div>

              {/* Error */}
              {error && (
                <div className="p-4 rounded-lg flex items-center gap-3" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <span className="text-sm" style={{ color: '#fca5a5' }}>{error}</span>
                </div>
              )}

              {/* Submit */}
              <button onClick={handleSubmitBill} disabled={isSubmitting}
                className="btn-primary w-full flex items-center justify-center gap-2 py-4">
                {isSubmitting ? (
                  <><div className="w-5 h-5 rounded-full animate-spin" style={{ border: '2px solid #060606', borderTopColor: 'transparent' }} /><span>Processing Payment...</span></>
                ) : (
                  <><Send className="w-5 h-5" /><span>Pay & Generate Bill</span></>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* History Tab */
          <div className="space-y-4">
            {history.length === 0 ? (
              <div className="text-center py-16" style={cardStyle}>
                <Receipt className="w-12 h-12 mx-auto mb-4" style={{ color: TEXT_MUTED }} />
                <p className="text-sm" style={{ color: TEXT_MUTED }}>No bills created yet</p>
              </div>
            ) : (
              history.map(bill => (
                <div key={bill._id} className="p-6" style={cardStyle}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-base font-semibold" style={{ fontFamily: 'var(--font-heading)', color: GOLD }}>{bill.billNumber}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: bill.status === 'paid' ? 'rgba(34,197,94,0.15)' : 'rgba(201,168,76,0.15)', color: bill.status === 'paid' ? '#4ade80' : GOLD }}>{bill.status}</span>
                      </div>
                      <p className="text-xs mt-1 flex items-center gap-1" style={{ color: TEXT_MUTED }}>
                        <Clock className="w-3 h-3" /> {new Date(bill.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span className="text-xl font-semibold mt-2 sm:mt-0" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>₹{bill.total.toFixed(2)}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-3 text-sm" style={{ color: TEXT_SEC }}>
                    <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{bill.customerName}</span>
                    <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{bill.customerEmail}</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          {['Product', 'Price', 'Qty', 'Total'].map(h => (
                            <th key={h} className="text-left py-2 text-[0.65rem] font-medium tracking-[0.1em] uppercase" style={{ color: TEXT_MUTED }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {bill.items.map((item, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                            <td className="py-2" style={{ color: 'var(--text-primary)' }}>{item.productName}</td>
                            <td className="py-2" style={{ color: TEXT_SEC }}>₹{item.price}</td>
                            <td className="py-2" style={{ color: TEXT_SEC }}>{item.quantity}</td>
                            <td className="py-2 font-medium" style={{ color: GOLD }}>₹{item.total.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex justify-end gap-8 mt-4 pt-4 text-sm" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    <div><span style={{ color: TEXT_MUTED }}>Subtotal: </span><span style={{ color: 'var(--text-primary)' }}>₹{bill.subtotal.toFixed(2)}</span></div>
                    <div><span style={{ color: TEXT_MUTED }}>Tax: </span><span style={{ color: 'var(--text-primary)' }}>₹{bill.tax.toFixed(2)}</span></div>
                  </div>
                  <div className="flex items-center gap-3 mt-4 pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    <button onClick={() => handleViewBill(bill)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all" style={{ background: 'rgba(201,168,76,0.1)', color: GOLD, border: 'none', cursor: 'pointer' }}>
                      <Eye className="w-4 h-4" /><span>View</span>
                    </button>
                    <button onClick={() => handleDownloadBill(bill)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all" style={{ background: 'rgba(201,168,76,0.1)', color: GOLD, border: 'none', cursor: 'pointer' }}>
                      <Download className="w-4 h-4" /><span>Download</span>
                    </button>
                    <button onClick={() => handlePrintBill(bill)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all" style={{ background: 'rgba(201,168,76,0.1)', color: GOLD, border: 'none', cursor: 'pointer' }}>
                      <Printer className="w-4 h-4" /><span>Print</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* View Bill Modal */}
        {viewingBill && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a1a1a] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: GOLD }}>Invoice</h2>
                <button onClick={() => setViewingBill(null)} className="text-lg" style={{ background: 'none', border: 'none', color: TEXT_SEC, cursor: 'pointer' }}>✕</button>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span style={{ color: TEXT_SEC }}>Bill Number:</span>
                  <span style={{ color: 'var(--text-primary)' }}>{viewingBill.billNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: TEXT_SEC }}>Date:</span>
                  <span style={{ color: 'var(--text-primary)' }}>{new Date(viewingBill.createdAt).toLocaleDateString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: TEXT_SEC }}>Time:</span>
                  <span style={{ color: 'var(--text-primary)' }}>{new Date(viewingBill.createdAt).toLocaleTimeString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: TEXT_SEC }}>Status:</span>
                  <span style={{ color: viewingBill.status === 'paid' ? '#4ade80' : GOLD }}>{viewingBill.status.toUpperCase()}</span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', paddingTop: '16px', paddingBottom: '16px', marginBottom: '16px' }}>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Customer Details</h3>
                <p style={{ color: TEXT_SEC }}>Name: {viewingBill.customerName}</p>
                <p style={{ color: TEXT_SEC }}>Email: {viewingBill.customerEmail}</p>
              </div>

              <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Items</h3>
              <table className="w-full text-sm mb-6">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <th className="text-left py-2" style={{ color: TEXT_MUTED }}>Product</th>
                    <th className="text-left py-2" style={{ color: TEXT_MUTED }}>Price</th>
                    <th className="text-left py-2" style={{ color: TEXT_MUTED }}>Qty</th>
                    <th className="text-right py-2" style={{ color: TEXT_MUTED }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {viewingBill.items.map((item, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td className="py-2" style={{ color: 'var(--text-primary)' }}>{item.productName}</td>
                      <td className="py-2" style={{ color: TEXT_SEC }}>₹{item.price}</td>
                      <td className="py-2" style={{ color: TEXT_SEC }}>{item.quantity}</td>
                      <td className="py-2 text-right font-medium" style={{ color: GOLD }}>₹{item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="space-y-2 mb-6" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                <div className="flex justify-between">
                  <span style={{ color: TEXT_SEC }}>Subtotal:</span>
                  <span style={{ color: 'var(--text-primary)' }}>₹{viewingBill.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: TEXT_SEC }}>Tax (18%):</span>
                  <span style={{ color: 'var(--text-primary)' }}>₹{viewingBill.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold">
                  <span style={{ color: 'var(--text-primary)' }}>Total:</span>
                  <span style={{ color: GOLD, fontFamily: 'var(--font-heading)' }}>₹{viewingBill.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => handlePrintBill(viewingBill)} className="flex-1 btn-primary flex items-center justify-center gap-2">
                  <Printer className="w-4 h-4" /><span>Print</span>
                </button>
                <button onClick={() => handleDownloadBill(viewingBill)} className="flex-1 btn-secondary flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" /><span>Download</span>
                </button>
                <button onClick={() => setViewingBill(null)} className="flex-1 btn-secondary">Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingStaffDashboard;
