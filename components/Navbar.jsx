"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart, MapPin, X, Menu, ChevronRight, CheckCircle, Truck, CreditCard, Lock, User, Phone, Home as HomeIcon, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Modals States
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  
  const [selectedLocation, setSelectedLocation] = useState("Select Location");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [checkoutForm, setCheckoutForm] = useState({
    name: "", phone: "", address: "", city: "Karachi"
  });

  // --- DATA LOADING ---
  useEffect(() => {
    const loadCart = () => {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try { setCartItems(JSON.parse(savedCart)); } 
        catch (error) { localStorage.setItem('cart', '[]'); }
      }
    };
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/categories");
        const data = await res.json();
        setCategories(data);
      } catch (error) { console.error(error); }
    };
    loadCart();
    fetchCategories();
    window.addEventListener('storage', loadCart);
    window.addEventListener('cartUpdated', loadCart);
    return () => {
      window.removeEventListener('storage', loadCart);
      window.removeEventListener('cartUpdated', loadCart);
    };
  }, []);

  // Search Suggestions Fetch
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length > 1) {
        try {
          const res = await fetch(`https://grocery-store-backend-wxpw.onrender.com/products?search=${searchQuery}`);
          const data = await res.json();
          setSearchSuggestions(data.slice(0, 5));
          setShowSuggestions(true);
        } catch (error) {
          console.error("Search error:", error);
        }
      } else {
        setSearchSuggestions([]);
        setShowSuggestions(false);
      }
    };
    
    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowSuggestions(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const locations = [ 
    "Karachi - Gulshan", 
    "Karachi - Jauhar", 
    "Karachi - North Karachi", 
    "Karachi - Nazimabad", 
    "Karachi - North Nazimabad",
    "Karachi - Surjani" 
  ];

  // --- HANDLERS ---
  
  const handleSearch = () => {
    if (searchQuery.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
        setShowSuggestions(false);
        setShowSidebar(false); 
    }
  };

  const handleSuggestionClick = (productId) => {
    router.push(`/product/${productId}`);
    setShowSuggestions(false);
    setSearchQuery("");
  };

  const handleLocationSelect = (loc) => {
    setSelectedLocation(loc);
    setShowLocationModal(false);
  };

  const removeFromCart = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.setItem('cart', '[]');
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const orderData = {
        ...checkoutForm,
        total_amount: totalPrice,
        items: cartItems
    };

    try {
        const res = await fetch("https://grocery-store-backend-wxpw.onrender.com/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData)
        });

        if (res.ok) {
            setShowCheckoutModal(false);
            setShowSuccessModal(true);
            clearCart();
            setCheckoutForm({ name: "", phone: "", address: "", city: "Karachi" });
        }
    } catch (err) { alert("Error placing order"); }
    setLoading(false);
  };

  return (
    <>
      <nav className="navbar-main">
        <div className="navbar-container">
          
          {/* Left: Menu + Logo */}
          <div className="navbar-left">
            <button onClick={() => setShowSidebar(!showSidebar)} className="menu-button">
              <Menu size={28} color="#374151" />
            </button>
            
            <Link href="/">
              <div className="logo-container">
                <img src="/logo.jpeg" alt="Al-Memni Logo" className="logo-image" />
                <div className="store-text-container">
                  <span className="store-name-main">Al-Memni</span>
                  <span className="store-name-sub">GROCERY STORE</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Center: Search with Suggestions */}
          <div className="search-container" onClick={(e) => e.stopPropagation()}>
            <div className="search-bar">
              <button onClick={handleSearch} style={{background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center'}}>
                <Search size={20} className="search-icon" />
              </button>
              
              <input 
                type="text" 
                placeholder="Search for products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                onFocus={() => searchSuggestions.length > 0 && setShowSuggestions(true)}
                className="search-input"
              />
            </div>

            {/* Search Suggestions Dropdown */}
            {showSuggestions && searchSuggestions.length > 0 && (
              <div className="search-suggestions">
                {searchSuggestions.map((product) => (
                  <div 
                    key={product.id} 
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(product.id)}
                  >
                    <img src={product.image_url} alt={product.title} className="suggestion-image" />
                    <div className="suggestion-info">
                      <p className="suggestion-title">{product.title}</p>
                      <p className="suggestion-price">Rs. {Math.floor(Number(product.price))}</p>
                    </div>
                  </div>
                ))}
                <div className="view-all-results" onClick={handleSearch}>
                  View all results for "{searchQuery}" →
                </div>
              </div>
            )}
          </div>

          {/* Right: Location & Cart */}
          <div className="navbar-right">
            <div onClick={() => setShowLocationModal(true)} className="location-button">
              <MapPin size={22} style={{ color: '#0066CC' }} />
              <div className="location-text">
                <span className="location-label">Deliver to:</span>
                <span className="location-value">{selectedLocation}</span>
              </div>
            </div>
            
            <div onClick={() => setShowCartModal(true)} className="cart-button">
              <ShoppingCart size={32} style={{ color: '#0066CC' }} strokeWidth={1.5} />
              <span className="cart-badge">{cartItems.length}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* --- SIDEBAR --- */}
      {showSidebar && (
        <>
          <div onClick={() => setShowSidebar(false)} className="sidebar-overlay" />
          <div className="sidebar">
            <div className="sidebar-header">
              <h2 className="sidebar-title">All Categories</h2>
              <button onClick={() => setShowSidebar(false)} style={{background:'none', border:'none', cursor:'pointer'}}><X size={24} color="#666" /></button>
            </div>
            <div style={{ padding: '8px 0' }}>
              {categories.map((category) => (
                <div key={category.id} className="category-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={category.image_url || "https://placehold.co/40"} alt="" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                    <span>{category.name}</span>
                  </div>
                  <ChevronRight size={16} color="#ccc" />
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* --- PROFESSIONAL LOCATION MODAL --- */}
      {showLocationModal && (
        <div className="modal-overlay" onClick={() => setShowLocationModal(false)}>
          <div className="modal-content location-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header location-header">
              <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                <div className="location-icon-circle">
                  <MapPin size={22} color="#0066CC" />
                </div>
                <div>
                  <h2 className="modal-title" style={{marginBottom: '4px'}}>Choose your location</h2>
                  <p className="modal-subtitle">Select a delivery location to see product availability</p>
                </div>
              </div>
              <button onClick={() => setShowLocationModal(false)} className="modal-close"><X size={24} /></button>
            </div>
            
            <div className="location-list">
              {locations.map((location) => {
                const [city, area] = location.split(' - ');
                return (
                  <button
                    key={location}
                    onClick={() => handleLocationSelect(location)}
                    className={`location-item ${selectedLocation === location ? 'selected' : ''}`}
                  >
                    <div className="location-item-content">
                      <div className="location-icon-wrapper">
                        <MapPin size={20} color={selectedLocation === location ? '#0066CC' : '#64748b'} />
                      </div>
                      <div className="location-details">
                        <span className="location-name">{area}</span>
                        <span className="location-city">{city}</span>
                      </div>
                    </div>
                    {selectedLocation === location && (
                      <div className="check-icon">
                        <CheckCircle size={20} color="#0066CC" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* --- CART MODAL --- */}
      {showCartModal && (
        <div className="modal-overlay" onClick={() => setShowCartModal(false)}>
          <div className="modal-content cart-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Shopping Cart ({cartItems.length})</h2>
              <button onClick={() => setShowCartModal(false)} className="modal-close"><X size={24} /></button>
            </div>
            
            {cartItems.length === 0 ? (
               <div className="empty-cart-container">
                  <div className="empty-cart-icon">
                    <ShoppingCart size={64} color="#cbd5e1" strokeWidth={1.5} />
                  </div>
                  <h3>Your cart is empty</h3>
                  <p>Looks like you haven't added anything to your cart yet.</p>
                  <button onClick={() => setShowCartModal(false)} className="start-shopping-btn">
                    Start Shopping
                  </button>
               </div>
            ) : (
              <>
                <div className="cart-items">
                  {cartItems.map((item, index) => (
                    <div key={index} className="cart-item">
                      <div className="cart-item-info">
                        <img src={item.image_url} alt="" style={{ width: '50px', height: '50px', objectFit: 'contain', marginRight: '12px', border:'1px solid #eee', borderRadius:'4px' }} />
                        <div>
                            <p className="item-name">{item.title}</p>
                            <p className="item-price">Rs. {Math.floor(Number(item.price))}</p>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(index)} className="remove-button">Remove</button>
                    </div>
                  ))}
                </div>
                <div className="cart-total"><span className="total-label">Total:</span><span className="total-price">Rs. {Math.floor(totalPrice)}</span></div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                  <button onClick={clearCart} className="clear-cart-button">Clear Cart</button>
                  <button onClick={() => { setShowCartModal(false); setShowCheckoutModal(true); }} className="checkout-button">Proceed to Checkout <ArrowRight size={16} /></button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* --- CHECKOUT MODAL --- */}
      {showCheckoutModal && (
        <div className="modal-overlay">
          <div className="modal-content checkout-modal">
            
            <div className="checkout-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={20} color="#0066CC" />
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>Secure Checkout</h2>
              </div>
              <button onClick={() => setShowCheckoutModal(false)} className="modal-close"><X size={24}/></button>
            </div>

            <form onSubmit={handlePlaceOrder} className="checkout-form">
                
                <div className="order-summary-card">
                    <div className="summary-row"><span>Total Items</span><strong>{cartItems.length}</strong></div>
                    <div className="summary-row total"><span>Total Amount</span><span>Rs. {Math.floor(totalPrice)}</span></div>
                </div>

                <div className="form-section">
                    <h3 className="section-label"><Truck size={16} /> Delivery Information</h3>
                    
                    <div className="row-inputs">
                        <div className="input-group">
                            <label>Full Name</label>
                            <div className="input-wrapper">
                                <User size={18} className="input-icon" />
                                <input name="name" placeholder="Name" required value={checkoutForm.name} onChange={e=>setCheckoutForm({...checkoutForm, name:e.target.value})} className="modern-input" />
                            </div>
                        </div>
                        <div className="input-group">
                            <label>Phone Number</label>
                            <div className="input-wrapper">
                                <Phone size={18} className="input-icon" />
                                <input name="phone" placeholder="0300-XXXXXXX" required value={checkoutForm.phone} onChange={e=>setCheckoutForm({...checkoutForm, phone:e.target.value})} className="modern-input" />
                            </div>
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Delivery Address</label>
                        <div className="input-wrapper">
                            <HomeIcon size={18} className="input-icon textarea-icon" />
                            <textarea name="address" placeholder="Complete Address..." required value={checkoutForm.address} onChange={e=>setCheckoutForm({...checkoutForm, address:e.target.value})} className="modern-input textarea" />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>City</label>
                        <div className="input-wrapper">
                            <MapPin size={18} className="input-icon" />
                            <select name="city" value={checkoutForm.city} onChange={e=>setCheckoutForm({...checkoutForm, city:e.target.value})} className="modern-input select">
                                <option value="Karachi">Karachi</option>
                                <option value="Lahore">Lahore</option>
                                <option value="Islamabad">Islamabad</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h3 className="section-label"><CreditCard size={16} /> Payment Method</h3>
                    <div className="payment-option selected">
                        <div className="radio-outer"><div className="radio-inner"></div></div>
                        <span>Cash on Delivery (COD)</span>
                    </div>
                </div>

                <div className="checkout-footer">
                    <button type="submit" disabled={loading} className="checkout-button large">
                        {loading ? 'Processing...' : `Confirm Order - Rs. ${Math.floor(totalPrice)}`}
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}

      {/* --- SUCCESS POPUP --- */}
      {showSuccessModal && (
        <div className="modal-overlay">
            <div className="success-card">
                <div className="success-icon-bg"><CheckCircle size={48} color="#16a34a" /></div>
                <h2>Order Confirmed!</h2>
                <p>Thanks <b>{checkoutForm.name}</b>, your order has been received.</p>
                <button onClick={() => setShowSuccessModal(false)} className="checkout-button">Back to Home</button>
            </div>
        </div>
      )}

      {/* --- CSS STYLES --- */}
      <style jsx>{`
        /* General */
        .logo-container { display: flex; align-items: center; gap: 8px; cursor: pointer; }
        .logo-image { height: 42px; width: auto; object-fit: contain; }
        .store-text-container { display: flex; flex-direction: column; line-height: 1.1; }
        .store-name-main { color: #0066CC; font-weight: 800; font-size: 16px; font-family: Arial; }
        .store-name-sub { color: #FFD700; background-color: #0066CC; font-weight: bold; font-size: 9px; padding: 1px 4px; border-radius: 2px; }
        .navbar-main { width: 100%; background-color: white; border-bottom: 1px solid #e5e7eb; position: sticky; top: 0; z-index: 1000; }
        .navbar-container { max-width: 1400px; margin: 0 auto; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .navbar-left, .navbar-right { display: flex; align-items: center; gap: 12px; }
        .menu-button { background: none; border: none; cursor: pointer; padding: 8px; }
        
        /* Search Container with Suggestions */
        .search-container { flex: 1; max-width: 600px; display: none; position: relative; }
        @media (min-width: 640px) { .search-container { display: block; } }
        .search-bar { display: flex; align-items: center; border: 2px solid #d1d5db; border-radius: 8px; overflow: hidden; background-color: white; transition: border-color 0.2s; }
        .search-bar:focus-within { border-color: #0066CC; box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1); }
        .search-icon { margin-left: 12px; color: #9ca3af; }
        .search-input { flex: 1; padding: 10px 12px; border: none; outline: none; font-size: 14px; }
        
        /* Search Suggestions Dropdown */
        .search-suggestions { position: absolute; top: 100%; left: 0; right: 0; background: white; border: 1px solid #e5e7eb; border-radius: 8px; margin-top: 8px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); z-index: 2000; max-height: 400px; overflow-y: auto; }
        .suggestion-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; cursor: pointer; border-bottom: 1px solid #f3f4f6; transition: background 0.2s; }
        .suggestion-item:hover { background: #f8fafc; }
        .suggestion-item:last-of-type { border-bottom: none; }
        .suggestion-image { width: 50px; height: 50px; object-fit: contain; border: 1px solid #e5e7eb; border-radius: 6px; background: white; }
        .suggestion-info { flex: 1; }
        .suggestion-title { font-size: 14px; font-weight: 500; color: #1f2937; margin: 0 0 4px 0; line-height: 1.3; }
        .suggestion-price { font-size: 13px; font-weight: 600; color: #0066CC; margin: 0; }
        .view-all-results { padding: 12px 16px; text-align: center; color: #0066CC; font-weight: 600; font-size: 13px; cursor: pointer; border-top: 2px solid #f3f4f6; background: #f8fafc; transition: background 0.2s; }
        .view-all-results:hover { background: #f1f5f9; }
        
        .location-button { display: none; align-items: center; gap: 8px; cursor: pointer; padding: 6px 10px; border-radius: 6px; transition: background 0.2s; }
        .location-button:hover { background: #f8fafc; }
        .location-text { display: flex; flex-direction: column; }
        .location-label { font-size: 11px; color: #6b7280; }
        .location-value { font-size: 13px; font-weight: 600; color: #0066CC; }
        @media (min-width: 1024px) { .location-button { display: flex; } }
        .cart-button { position: relative; cursor: pointer; padding: 4px; border-radius: 8px; transition: background 0.2s; }
        .cart-button:hover { background: #f8fafc; }
        .cart-badge { position: absolute; top: -4px; right: -4px; background-color: #FFD700; color: #0066CC; font-size: 12px; font-weight: bold; border-radius: 50%; min-width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; border: 2px solid white; padding: 0 4px; }
        
        /* Modals Common */
        .sidebar-overlay, .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.5); z-index: 1500; display:flex; align-items:center; justify-content:center; backdrop-filter: blur(3px); }
        .sidebar { position: fixed; top: 0; left: 0; bottom: 0; width: 280px; background-color: white; z-index: 2000; overflow-y: auto; box-shadow: 4px 0 12px rgba(0, 0, 0, 0.1); }
        .sidebar-header { padding: 16px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; }
        .sidebar-title { margin: 0; font-size: 18px; font-weight: bold; color: #1f2937; }
        .category-item { padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; border-bottom: 1px solid #f3f4f6; font-size: 14px; color: #374151; transition: background 0.2s; }
        .category-item:hover { background: #f8fafc; }
        
        .modal-content { background: white; padding: 20px; border-radius: 12px; width: 90%; max-height: 85vh; overflow-y: auto; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
        .modal-content.cart-modal { max-width: 550px; }
        .modal-content.location-modal { max-width: 500px; }
        .modal-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
        .modal-header.location-header { align-items: center; }
        .modal-title { font-size: 18px; font-weight: bold; color: #1f2937; margin: 0; }
        .modal-subtitle { font-size: 13px; color: #64748b; margin: 0; }
        .modal-close { background: none; border: none; cursor: pointer; color: #6b7280; transition: color 0.2s; }
        .modal-close:hover { color: #1f2937; }
        
        /* Professional Location Modal */
        .location-icon-circle { width: 44px; height: 44px; background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .location-list { display: flex; flex-direction: column; gap: 10px; }
        .location-item { padding: 16px; border: 2px solid #e2e8f0; border-radius: 12px; background: white; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: all 0.2s; text-align: left; width: 100%; }
        .location-item:hover { border-color: #0066CC; background-color: #f8fafc; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0, 102, 204, 0.1); }
        .location-item.selected { border-color: #0066CC; background-color: #f0f9ff; box-shadow: 0 4px 12px rgba(0, 102, 204, 0.15); }
        .location-item-content { display: flex; align-items: center; gap: 14px; }
        .location-icon-wrapper { width: 40px; height: 40px; background: #f1f5f9; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .location-item.selected .location-icon-wrapper { background: #dbeafe; }
        .location-details { display: flex; flex-direction: column; gap: 2px; }
        .location-name { font-size: 15px; font-weight: 600; color: #1e293b; }
        .location-city { font-size: 12px; color: #64748b; }
        .location-item.selected .location-name { color: #0066CC; }
        .check-icon { flex-shrink: 0; }

        /* Cart Empty State */
        .empty-cart-container { text-align: center; padding: 40px 20px; display: flex; flex-direction: column; align-items: center; }
        .empty-cart-icon { width: 100px; height: 100px; background: #f1f5f9; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
        .empty-cart-container h3 { font-size: 20px; font-weight: bold; color: #334155; margin: 0 0 8px 0; }
        .empty-cart-container p { color: #64748b; font-size: 14px; margin: 0 0 24px 0; }
        .start-shopping-btn { background: #0066CC; color: white; padding: 12px 24px; border-radius: 30px; border: none; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .start-shopping-btn:hover { background: #0052a3; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3); }

        /* Cart Items */
        .cart-items { max-height: 350px; overflow-y: auto; margin-bottom: 16px; }
        .cart-item { display: flex; justify-content: space-between; align-items: center; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 10px; transition: border-color 0.2s; }
        .cart-item:hover { border-color: #0066CC; }
        .cart-item-info { display: flex; align-items: center; }
        .item-name { font-weight: 600; font-size: 14px; margin: 0 0 4px 0; color: #1f2937; }
        .item-price { color: #0066CC; font-weight: bold; font-size: 14px; margin: 0; }
        .remove-button { background: #fee2e2; color: #ef4444; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 500; transition: all 0.2s; }
        .remove-button:hover { background: #fecaca; }
        .cart-total { border-top: 2px solid #e5e7eb; padding-top: 16px; display: flex; justify-content: space-between; align-items: center; font-size: 18px; font-weight: bold; color: #0066CC; }
        .clear-cart-button { flex: 1; background: white; color: #ef4444; border: 1px solid #ef4444; padding: 12px; border-radius: 6px; cursor: pointer; font-weight: bold; transition: all 0.2s; }
        .clear-cart-button:hover { background: #fef2f2; }
        .checkout-button { flex: 2; background: #0066CC; color: white; border: none; padding: 12px; border-radius: 6px; cursor: pointer; font-weight: bold; width: 100%; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .checkout-button:hover { background: #0052a3; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3); }

        /* Checkout Styles */
        .modal-content.checkout-modal { max-width: 550px; padding: 0; border-radius: 16px; overflow: hidden; background: #fff; display: flex; flex-direction: column; max-height: 90vh; }
        .checkout-header { background: #f8fafc; padding: 16px 24px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
        .checkout-form { padding: 24px; display: flex; flex-direction: column; gap: 24px; overflow-y: auto; flex: 1; }
        
        .order-summary-card { background: linear-gradient(135deg, #0066CC 0%, #004a99 100%); color: white; padding: 16px 20px; border-radius: 12px; flex-shrink: 0; }
        .summary-row { display: flex; justify-content: space-between; font-size: 14px; opacity: 0.9; margin-bottom: 6px; }
        .summary-row.total { font-size: 20px; font-weight: bold; opacity: 1; margin-top: 8px; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 8px; margin-bottom: 0; }

        .form-section { display: flex; flex-direction: column; gap: 14px; flex-shrink: 0; }
        .section-label { font-size: 13px; font-weight: 700; color: #374151; display: flex; align-items: center; gap: 8px; margin: 0; text-transform: uppercase; letter-spacing: 0.5px; }
        
        .row-inputs { display: flex; gap: 15px; width: 100%; }
        .input-group { display: flex; flex-direction: column; gap: 6px; flex: 1; min-width: 0; }
        .input-group label { font-size: 12px; font-weight: 600; color: #64748b; margin-left: 2px; }
        
        .input-wrapper { position: relative; width: 100%; }
        .input-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #94a3b8; pointer-events: none; z-index: 10; }
        .input-icon.textarea-icon { top: 16px; transform: none; }
        
        .modern-input { width: 100%; box-sizing: border-box; padding: 10px 12px 10px 40px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; color: #1e293b; outline: none; transition: all 0.2s; background: #f9fafb; font-family: inherit; }
        .modern-input:focus { border-color: #0066CC; background: #fff; box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1); }
        .modern-input.textarea { min-height: 80px; resize: none; line-height: 1.5; padding-top: 12px; }
        .modern-input.select { cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394a3b8' d='M6 9L1 4h10z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; }

        .payment-option { border: 2px solid #e2e8f0; padding: 12px; border-radius: 10px; display: flex; align-items: center; gap: 12px; cursor: pointer; transition: all 0.2s; background: #fff; }
        .payment-option.selected { border-color: #0066CC; background-color: #f0f9ff; }
        .radio-outer { width: 20px; height: 20px; border: 2px solid #0066CC; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .radio-inner { width: 10px; height: 10px; background: #0066CC; border-radius: 50%; }
        
        .checkout-footer { margin-top: 10px; padding-bottom: 10px; flex-shrink: 0; }
        .checkout-button.large { padding: 14px; font-size: 16px; box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3); }
        .checkout-button.large:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0, 102, 204, 0.4); }

        .success-card { background: white; padding: 40px; border-radius: 16px; text-align: center; max-width: 400px; width: 90%; }
        .success-icon-bg { width: 80px; height: 80px; background: #dcfce7; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
        .success-card h2 { font-size: 24px; font-weight: bold; color: #1f2937; margin: 0 0 8px 0; }
        .success-card p { color: #64748b; font-size: 14px; margin: 0 0 24px 0; }
      `}</style>
    </>
  );
}