"use client";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { 
  Trash2, Plus, Package, Layers, Image as ImageIcon, 
  Upload, ShoppingBag, Truck, DollarSign, Check, X, Search, FileText, Clock 
} from "lucide-react";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  
  // Data States
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sliders, setSliders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Forms
  const [productData, setProductData] = useState({ 
    title: "", price: "", original_price: "", 
    discount_tag: "Grocery Mania", category_id: "", 
    stock_quantity: "100", description: "" 
  });
  
  const [productImage, setProductImage] = useState(null);
  const [categoryData, setCategoryData] = useState({ name: "", discount_percent: "0" });
  const [categoryImage, setCategoryImage] = useState(null);
  const [sliderImage, setSliderImage] = useState(null);

  // --- NEW: PROMO DATA STATE ---
  const [promoData, setPromoData] = useState({ message: "", end_time: "", is_active: false });

  const ADMIN_USERNAME = "admin";
  const ADMIN_PASSWORD = "metro123";

  // --- AUTH & FETCH ---
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (isLoggedIn === 'true') setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
        const [resProd, resCat, resSlide, resOrder, resPromo] = await Promise.all([
            fetch("https://grocery-store-backend-wxpw.onrender.com/products"),
            fetch("https://grocery-store-backend-wxpw.onrender.com/categories"),
            fetch("https://grocery-store-backend-wxpw.onrender.com/sliders"),
            fetch("https://grocery-store-backend-wxpw.onrender.com/orders"),
            fetch("https://grocery-store-backend-wxpw.onrender.com/promo") // Fetch Promo Settings
        ]);

        const dataCat = await resCat.json();
        setProducts(await resProd.json());
        setCategories(dataCat);
        setSliders(await resSlide.json());
        setOrders(await resOrder.json());
        
        // Set Promo Data
        const pData = await resPromo.json();
        if(pData) setPromoData(pData);

        if(dataCat.length > 0 && !productData.category_id) {
            setProductData(prev => ({...prev, category_id: dataCat[0].id}));
        }
    } catch (error) { console.error("Error fetching data:", error); }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.username === ADMIN_USERNAME && loginData.password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('adminLoggedIn', 'true');
      setLoginError("");
    } else { setLoginError("Invalid credentials!"); }
  };

  // --- HANDLERS ---
  
  // NEW: Handle Promo Update
  const handlePromoUpdate = async (e) => {
    e.preventDefault();
    try {
        await fetch("https://grocery-store-backend-wxpw.onrender.com/promo", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(promoData)
        });
        alert("Promo Bar Updated Successfully!");
    } catch (err) { alert("Error updating promo"); }
  };

  const handleOrderStatus = async (id, newStatus) => {
    try {
        await fetch(`https://grocery-store-backend-wxpw.onrender.com/orders/${id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        fetchData();
    } catch (err) { alert("Error updating status"); }
  };

  const handleDeleteOrder = async (id) => {
    if(confirm("Permanently delete this order?")) {
        await fetch(`https://grocery-store-backend-wxpw.onrender.com/orders/${id}`, { method: "DELETE" });
        fetchData();
    }
  };

  const handleSliderSubmit = async (e) => {
    e.preventDefault();
    if(!sliderImage) return alert("Select image!");
    const formData = new FormData(); formData.append('image', sliderImage);
    await fetch("https://grocery-store-backend-wxpw.onrender.com/sliders", { method: "POST", body: formData });
    setSliderImage(null); fetchData();
  };

  const handleDeleteSlider = async (id) => {
    if(confirm("Delete Slider?")) { await fetch(`https://grocery-store-backend-wxpw.onrender.com/sliders/${id}`, { method: "DELETE" }); fetchData(); }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', categoryData.name);
    formData.append('discount_percent', categoryData.discount_percent);
    if(categoryImage) formData.append('image', categoryImage);
    await fetch("https://grocery-store-backend-wxpw.onrender.com/categories", { method: "POST", body: formData });
    setCategoryData({ name: "", discount_percent: "0" }); setCategoryImage(null); fetchData();
  };

  const handleDeleteCategory = async (id) => {
    if(confirm("Delete Category?")) { await fetch(`https://grocery-store-backend-wxpw.onrender.com/categories/${id}`, { method: "DELETE" }); fetchData(); }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    const formData = new FormData();
    Object.keys(productData).forEach(key => formData.append(key, productData[key]));
    if(productImage) formData.append('image', productImage);
    await fetch("https://grocery-store-backend-wxpw.onrender.com/products", { method: "POST", body: formData });
    // Reset form including description
    setProductData({ ...productData, title: "", price: "", description: "" }); 
    setProductImage(null); 
    fetchData(); 
    setLoading(false);
  };

  const handleDeleteProduct = async (id) => {
    if(confirm("Delete Product?")) { await fetch(`https://grocery-store-backend-wxpw.onrender.com/products/${id}`, { method: "DELETE" }); fetchData(); }
  };

  const formatItems = (itemsJson) => {
    try {
        const items = typeof itemsJson === 'string' ? JSON.parse(itemsJson) : itemsJson;
        return items.map(i => `${i.title} (x1)`).join(", ");
    } catch (e) { return "Error"; }
  };

  // --- LOGIN SCREEN ---
  if (!isAuthenticated) return (
    <div className="login-container">
        <div className="login-card">
            <div className="login-header">
                <img src="/logo.jpeg" alt="Logo" className="login-logo" />
                <h2>Admin Panel</h2>
                <p>Al-Memni Grocery Store</p>
            </div>
            {loginError && <div className="error-msg">{loginError}</div>}
            <div className="form-group">
                <input type="text" placeholder="Username" value={loginData.username} onChange={e=>setLoginData({...loginData, username:e.target.value})} />
                <input type="password" placeholder="Password" value={loginData.password} onChange={e=>setLoginData({...loginData, password:e.target.value})} />
                <button onClick={handleLogin}>Secure Login</button>
            </div>
        </div>
        <style jsx>{`
            .login-container { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f3f4f6; }
            .login-card { background: white; padding: 40px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); width: 100%; max-width: 400px; }
            .login-header { text-align: center; margin-bottom: 30px; }
            .login-logo { height: 60px; object-fit: contain; margin-bottom: 15px; }
            .login-header h2 { font-size: 24px; color: #1f2937; font-weight: bold; margin: 0; }
            .login-header p { color: #6b7280; font-size: 14px; }
            .form-group input { width: 100%; padding: 12px; margin-bottom: 12px; border: 1px solid #e5e7eb; border-radius: 8px; outline: none; transition: border 0.3s; }
            .form-group input:focus { border-color: #0066CC; }
            .form-group button { width: 100%; padding: 12px; background: #0066CC; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; transition: background 0.2s; }
            .form-group button:hover { background: #0052a3; }
            .error-msg { background: #fee2e2; color: #991b1b; padding: 10px; border-radius: 6px; font-size: 14px; text-align: center; margin-bottom: 15px; }
        `}</style>
    </div>
  );

  // --- DASHBOARD UI ---
  return (
    <div className="admin-wrapper">
      <Navbar />
      
      <div className="admin-header">
        <div className="container">
          <h1>Dashboard Overview</h1>
          <p>Welcome back, Admin</p>
        </div>
      </div>

      <div className="container main-content">
        
        {/* 1. STATS CARDS */}
        <div className="stats-grid">
           <div className="stat-card">
               <div className="icon-box purple"><ShoppingBag size={24} /></div>
               <div><p>Total Orders</p><h3>{orders.length}</h3></div>
           </div>
           <div className="stat-card">
               <div className="icon-box blue"><Package size={24} /></div>
               <div><p>Products</p><h3>{products.length}</h3></div>
           </div>
           <div className="stat-card">
               <div className="icon-box green"><Layers size={24} /></div>
               <div><p>Categories</p><h3>{categories.length}</h3></div>
           </div>
           <div className="stat-card">
               <div className="icon-box orange"><DollarSign size={24} /></div>
               <div><p>Inventory Value</p><h3>Rs. {products.reduce((s,p)=>s+p.price*100,0).toLocaleString()}</h3></div>
           </div>
        </div>

        {/* 2. ORDERS MANAGEMENT */}
        <div className="content-card orders-section">
            <div className="card-header">
                <h2><Truck size={20} /> Manage Orders</h2>
                <span className="badge">{orders.length} New</span>
            </div>
            <div className="table-responsive">
                <table className="modern-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer Info</th>
                            <th style={{width: '25%'}}>Shipping Address</th>
                            <th>Order Items</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td className="font-bold">#{order.id}</td>
                                <td>
                                    <div className="customer-name">{order.customer_name}</div>
                                    <div className="customer-phone">{order.phone}</div>
                                </td>
                                <td>
                                    <div className="address-box">
                                        <span className="city-tag">{order.city}</span>
                                        <p>{order.address}</p>
                                    </div>
                                </td>
                                <td className="items-cell">{formatItems(order.items)}</td>
                                <td className="price-cell">Rs. {order.total_amount}</td>
                                <td>
                                    <select 
                                        value={order.status || 'Pending'} 
                                        onChange={(e) => handleOrderStatus(order.id, e.target.value)}
                                        className={`status-select ${order.status === 'Completed' ? 'completed' : 'pending'}`}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </td>
                                <td>
                                    <button onClick={() => handleDeleteOrder(order.id)} className="icon-btn delete" title="Delete Order">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {orders.length === 0 && <tr><td colSpan="7" className="empty-state">No orders found</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>

        <div className="grid-2-1">
          
          <div className="left-column">
            {/* 3. ADD PRODUCT */}
            <div className="content-card">
                <div className="card-header">
                    <h2><Plus size={20} /> Add New Product</h2>
                </div>
                <form onSubmit={handleProductSubmit} className="product-form">
                    <div className="form-row">
                        <input name="title" placeholder="Product Name" value={productData.title} onChange={e=>setProductData({...productData, title:e.target.value})} className="input-field" required />
                        <select name="category_id" value={productData.category_id} onChange={e=>setProductData({...productData, category_id:e.target.value})} className="input-field bg-white">
                            {categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className="form-row">
                        <input type="number" name="price" placeholder="Sale Price" value={productData.price} onChange={e=>setProductData({...productData, price:e.target.value})} className="input-field" required />
                        <input type="number" name="original_price" placeholder="Original Price" value={productData.original_price} onChange={e=>setProductData({...productData, original_price:e.target.value})} className="input-field" />
                    </div>
                    <div className="form-row">
                        <input name="image_url" placeholder="Image URL (http://...)" value={productData.image_url} onChange={e=>setProductData({...productData, image_url:e.target.value})} className="input-field" />
                        <input name="discount_tag" placeholder="Tag (e.g. 20% OFF)" value={productData.discount_tag} onChange={e=>setProductData({...productData, discount_tag:e.target.value})} className="input-field" />
                    </div>

                    <div className="form-row full-width">
                        <textarea 
                            name="description" 
                            placeholder="Product Description (Details about the product...)" 
                            value={productData.description} 
                            onChange={e=>setProductData({...productData, description:e.target.value})} 
                            className="input-field textarea"
                        />
                    </div>
                    
                    <div className="file-upload-wrapper">
                        <label className="file-label">
                            <Upload size={16} /> Upload Image File (Optional)
                            <input type="file" onChange={e=>setProductImage(e.target.files[0])} />
                        </label>
                        {productImage && <span className="file-name">{productImage.name}</span>}
                    </div>

                    <button type="submit" disabled={loading} className="submit-btn full-width">
                        {loading ? "Adding Product..." : "Add Product to Inventory"}
                    </button>
                </form>
            </div>

            {/* 4. PRODUCT LIST */}
            <div className="content-card">
                <div className="card-header">
                    <h2><Package size={20} /> Product Inventory</h2>
                </div>
                <div className="table-responsive" style={{maxHeight: '400px'}}>
                    <table className="modern-table">
                        <thead><tr><th>Img</th><th>Name</th><th>Price</th><th>Action</th></tr></thead>
                        <tbody>
                            {products.map(p => (
                                <tr key={p.id}>
                                    <td><img src={p.image_url} className="product-thumb" /></td>
                                    <td>{p.title}</td>
                                    <td className="price-text">Rs. {p.price}</td>
                                    <td><button onClick={()=>handleDeleteProduct(p.id)} className="icon-btn delete"><Trash2 size={16}/></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
          </div>

          <div className="right-column">
             
             {/* --- NEW: PROMO SETTINGS CARD --- */}
             <div className="content-card" style={{border: '2px solid #FFD700'}}>
                <div className="card-header">
                    <h2><Clock size={20} /> Top Promo Bar</h2>
                </div>
                <div className="mini-form">
                    <label style={{display:'flex', alignItems:'center', gap:'10px', fontSize:'14px', fontWeight:'600'}}>
                        <input type="checkbox" checked={promoData.is_active} onChange={e => setPromoData({ ...promoData, is_active: e.target.checked })} style={{width:'auto'}} />
                        Show Promo Bar
                    </label>
                    
                    <input 
                        placeholder="Sale Message (e.g. 50% OFF)" 
                        value={promoData.message} 
                        onChange={e => setPromoData({ ...promoData, message: e.target.value })} 
                        className="input-field" 
                    />
                    
                    <div style={{fontSize:'12px', color:'#666', marginTop:'5px'}}>End Date & Time:</div>
                    <input 
                        type="datetime-local" 
                        value={promoData.end_time ? new Date(promoData.end_time).toISOString().slice(0, 16) : ""} 
                        onChange={e => setPromoData({ ...promoData, end_time: e.target.value })} 
                        className="input-field" 
                    />
                    
                    <button onClick={handlePromoUpdate} className="submit-btn" style={{background:'#FFD700', color:'black'}}>Update Promo</button>
                </div>
             </div>

             {/* 5. SLIDER MANAGER */}
             <div className="content-card">
                <div className="card-header">
                    <h2><ImageIcon size={20} /> Hero Sliders</h2>
                </div>
                <div className="mini-form">
                    <div className="file-upload-wrapper">
                        <label className="file-label">
                            <Upload size={16} /> Select Banner
                            <input id="slider-file" type="file" onChange={e=>setSliderImage(e.target.files[0])} />
                        </label>
                    </div>
                    <button onClick={handleSliderSubmit} className="submit-btn">Upload Slider</button>
                </div>
                <div className="slider-grid">
                    {sliders.map(s => (
                        <div key={s.id} className="slider-item">
                            <img src={s.image_url} />
                            <button onClick={()=>handleDeleteSlider(s.id)}><X size={14}/></button>
                        </div>
                    ))}
                </div>
             </div>

             {/* 6. CATEGORY MANAGER */}
             <div className="content-card">
                <div className="card-header">
                    <h2><Layers size={20} /> Categories</h2>
                </div>
                <div className="mini-form">
                    <input placeholder="Category Name" value={categoryData.name} onChange={e=>setCategoryData({...categoryData, name:e.target.value})} className="input-field" />
                    <div className="file-upload-wrapper">
                        <label className="file-label">
                            <Upload size={16} /> Icon
                            <input id="cat-file" type="file" onChange={e=>setCategoryImage(e.target.files[0])} />
                        </label>
                    </div>
                    <button onClick={handleCategorySubmit} className="submit-btn">Add Category</button>
                </div>
                <div className="category-list">
                    {categories.map(c => (
                        <div key={c.id} className="category-row">
                            <span>{c.name}</span>
                            <button onClick={()=>handleDeleteCategory(c.id)} className="icon-btn delete small"><Trash2 size={14}/></button>
                        </div>
                    ))}
                </div>
             </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        /* --- LAYOUT --- */
        .admin-wrapper { min-height: 100vh; background-color: #f3f4f6; padding-bottom: 40px; font-family: 'Segoe UI', sans-serif; }
        .admin-header { background: #0066CC; color: white; padding: 30px 0; margin-bottom: 30px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
        .admin-header h1 { font-size: 28px; font-weight: 700; margin: 0; }
        .admin-header p { opacity: 0.8; margin-top: 5px; font-size: 14px; }
        .container { max-width: 1400px; margin: 0 auto; padding: 0 20px; }
        
        /* --- STATS GRID --- */
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: white; padding: 24px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); display: flex; align-items: center; gap: 16px; transition: transform 0.2s; }
        .stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 16px rgba(0,0,0,0.08); }
        .icon-box { width: 50px; height: 50px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; }
        .icon-box.purple { background: #8b5cf6; } .icon-box.blue { background: #3b82f6; } .icon-box.green { background: #10b981; } .icon-box.orange { background: #f59e0b; }
        .stat-card h3 { font-size: 24px; font-weight: 700; margin: 0; color: #1f2937; }
        .stat-card p { margin: 0; color: #6b7280; font-size: 14px; }

        /* --- CARDS & TABLES --- */
        .content-card { background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); padding: 24px; margin-bottom: 24px; border: 1px solid #e5e7eb; }
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #f3f4f6; }
        .card-header h2 { font-size: 18px; font-weight: 700; color: #374151; display: flex; align-items: center; gap: 10px; margin: 0; }
        .badge { background: #0066CC; color: white; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }

        .table-responsive { overflow-x: auto; }
        .modern-table { width: 100%; border-collapse: collapse; min-width: 800px; }
        .modern-table th { text-align: left; padding: 12px 16px; background: #f9fafb; color: #6b7280; font-size: 13px; font-weight: 600; text-transform: uppercase; border-bottom: 2px solid #eee; }
        .modern-table td { padding: 16px; border-bottom: 1px solid #f3f4f6; font-size: 14px; color: #374151; vertical-align: top; }
        .modern-table tr:hover { background: #f9fafb; }
        
        /* Order Specifics */
        .customer-name { font-weight: 600; color: #111; }
        .customer-phone { font-size: 12px; color: #666; margin-top: 2px; }
        .address-box { max-width: 250px; }
        .address-box p { margin: 4px 0 0; font-size: 13px; color: #555; line-height: 1.4; }
        .city-tag { background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
        .items-cell { font-size: 13px; color: #555; max-width: 200px; }
        .price-cell { font-weight: 700; color: #0066CC; font-size: 15px; }
        
        .status-select { padding: 6px 12px; border-radius: 20px; border: none; font-size: 12px; font-weight: 700; cursor: pointer; outline: none; appearance: none; text-align: center; }
        .status-select.pending { background: #fff7ed; color: #c2410c; border: 1px solid #ffedd5; }
        .status-select.completed { background: #f0fdf4; color: #15803d; border: 1px solid #dcfce7; }

        /* --- FORMS & INPUTS --- */
        .grid-2-1 { display: grid; grid-template-columns: 1fr; gap: 24px; }
        @media (min-width: 1024px) { .grid-2-1 { grid-template-columns: 2fr 1fr; } }

        .product-form .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px; }
        .product-form .form-row.full-width { grid-template-columns: 1fr; } /* Full width for description */
        
        .input-field { width: 100%; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 14px; outline: none; transition: all 0.2s; box-sizing: border-box; }
        .input-field:focus { border-color: #0066CC; box-shadow: 0 0 0 3px rgba(0,102,204,0.1); }
        .input-field.textarea { min-height: 80px; resize: vertical; font-family: inherit; }
        
        .file-upload-wrapper { border: 2px dashed #e5e7eb; border-radius: 8px; padding: 15px; text-align: center; margin-bottom: 15px; transition: border-color 0.2s; }
        .file-upload-wrapper:hover { border-color: #0066CC; }
        .file-label { display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; color: #6b7280; font-size: 14px; font-weight: 500; }
        .file-label input { display: none; }
        .file-name { display: block; font-size: 12px; color: #0066CC; margin-top: 5px; }

        .submit-btn { background: #0066CC; color: white; border: none; padding: 12px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
        .submit-btn:hover { background: #0052a3; }
        .submit-btn.full-width { width: 100%; }

        /* --- MINI COMPONENTS --- */
        .mini-form { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
        
        .category-list { max-height: 250px; overflow-y: auto; }
        .category-row { display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #f3f4f6; font-size: 14px; }
        
        .slider-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
        .slider-item { position: relative; border-radius: 8px; overflow: hidden; height: 60px; }
        .slider-item img { width: 100%; height: 100%; object-fit: cover; }
        .slider-item button { position: absolute; top: 2px; right: 2px; background: rgba(239,68,68,0.9); color: white; border: none; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; cursor: pointer; }

        .icon-btn { background: none; border: none; cursor: pointer; padding: 6px; border-radius: 4px; transition: background 0.2s; }
        .icon-btn.delete { color: #ef4444; background: #fee2e2; }
        .icon-btn.delete:hover { background: #fecaca; }
        .product-thumb { width: 40px; height: 40px; object-fit: contain; border-radius: 4px; border: 1px solid #eee; }
        .empty-state { text-align: center; padding: 30px; color: #9ca3af; font-style: italic; }
      `}</style>
    </div>
  );
}