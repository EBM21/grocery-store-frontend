"use client";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import HeroSlider from "../components/HeroSlider";
import MetroCard from "../components/MetroCard";
import ProductCard, { ProductDetailModal } from "../components/ProductCard";
import FooterPage from "../components/Footer";
import { Star, Quote, User, MapPin, ShoppingBag, CheckCircle } from "lucide-react";
import TopBar from "../components/TopBar";

export default function Home() {
  
  // Data Types
  type Category = { id: number | string; name: string; image_url?: string };
  type Product = { id: number | string; title?: string; [key: string]: any };

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // --- FAKE SALES POPUP STATE ---
  const [salesPopup, setSalesPopup] = useState<{ name: string; item: string; location: string } | null>(null);

  // --- REVIEWS DATA ---
  const reviews = [
    { id: 1, name: "Sana Ahmed", location: "Jauhar, Karachi", rating: 5, text: "Bohat hi zabardast products hain!" },
    { id: 2, name: "Bilal Khan", location: "Gulshan, Karachi", rating: 4, text: "Prices market se kafi munasib hain." },
    { id: 3, name: "Usman Raza", location: "North Karachi", rating: 5, text: "Best online grocery store. Cash on delivery option bohat convenient hai aur quality A-One hai." },
    { id: 4, name: "Fatima Zehra", location: "Nazimabad, Karachi", rating: 5, text: "Variety bohat achi hai products ki. Achay items bhi mil jatay hain jo aam dukanon par nahi miltay." },
  ];

  useEffect(() => {
    fetch("http://localhost:5000/categories").then((res) => res.json()).then(setCategories).catch(console.log);
    fetch("http://localhost:5000/products").then((res) => res.json()).then(setProducts).catch(console.log);
  }, []);

  // --- FAKE NOTIFICATION LOGIC ---
  useEffect(() => {
    // Updated Names List
    const dummyNames = ["Bilal", "Eman", "Laiba", "Ali", "Zara", "Ahmed", "Sara", "Hina", "Omar", "Fatima"];
    const dummyItems = ["10 jumbo packages ", "2 jumbo packages ", "3 packages ", "8 packages ", "5 medium packages ", "1 small package ", "2 packages "];
    const dummyLocations = ["Karachi", "Karachi", "Karachi", "Karachi", "Karachi"];

    const triggerPopup = () => {
      const randomName = dummyNames[Math.floor(Math.random() * dummyNames.length)];
      const randomItem = dummyItems[Math.floor(Math.random() * dummyItems.length)];
      const randomLoc = dummyLocations[Math.floor(Math.random() * dummyLocations.length)];

      setSalesPopup({ name: randomName, item: randomItem, location: randomLoc });

      setTimeout(() => {
        setSalesPopup(null);
      }, 4000);
    };

    const firstTimeout = setTimeout(() => {
        triggerPopup();
        const interval = setInterval(triggerPopup, 8000); // Har 8 second baad
        return () => clearInterval(interval);
    }, 3000);

    return () => clearTimeout(firstTimeout);
  }, []);

  const handleAddToCart = (product: Product) => {
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const updatedCart = [...existingCart, product];
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartCount(updatedCart.length);
    window.dispatchEvent(new Event('cartUpdated'));
    
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="position: fixed; top: 80px; right: 20px; background-color: #10b981; color: white; padding: 16px 24px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); z-index: 9999; font-family: Arial; font-weight: 600; animation: slideIn 0.3s ease-out; display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 18px;">✓</span><span>${product.title} added to cart!</span>
      </div>
      <style>@keyframes slideIn { from { transform: translateX(400px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }</style>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      const notifElement = notification.firstElementChild as HTMLElement;
      if (notifElement) notifElement.style.opacity = '0';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedProduct(null);
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} size={14} fill={i < rating ? "#FFD700" : "none"} color={i < rating ? "#FFD700" : "#d1d5db"} />
    ));
  };

  return (
    <main className="main-wrapper">
      <TopBar />
      <Navbar />
      <HeroSlider />
   
      {/* --- CATEGORIES SECTION --- */}
      <div className="section-wrapper">
        <div className="horizontal-scroll-container">
          {categories.slice(0, 6).map((cat, index) => (
            <div key={cat.id} className="scroll-item">
              <MetroCard id={cat.id} title={cat.name} image={cat.image_url || "https://placehold.co/200x200"} discount={index === 0 ? 49 : index === 1 ? 25 : null} />
            </div>
          ))}
        </div>
        <div className="horizontal-scroll-container" style={{ marginTop: '15px' }}>
          {categories.slice(6, 12).map((cat, index) => (
            <div key={cat.id} className="scroll-item">
              <MetroCard id={cat.id} title={cat.name} image={cat.image_url || "https://placehold.co/200x200"} discount={index === 0 ? 49 : index === 1 ? 11 : null} />
            </div>
          ))}
        </div>
      </div>

      {/* --- PRODUCTS SECTION --- */}
      <div className="section-wrapper" style={{ marginTop: '50px' }}>
         <div className="products-section">
            <div className="banner-container">
                <div className="banner-sticky">
                    <img src="/logo.jpeg" alt="Grocery Mania" className="banner-image" onError={(e) => { (e.currentTarget as HTMLImageElement).src = "https://placehold.co/280x600/8B5CF6/fff?text=Grocery+Mania"; }} />
                </div>
            </div>
            <div className="products-container">
                <div className="products-header">
                    <h2 className="section-title">Grocery Mania</h2>
                    <a href="#" className="view-all-link">View All</a>
                </div>
                <div className="products-grid">
                    {products.map((prod) => (
                        <div key={prod.id} className="product-card-wrapper">
                            <ProductCard product={prod} onAddToCart={handleAddToCart} onViewDetails={handleViewDetails} />
                        </div>
                    ))}
                </div>
            </div>
         </div>
      </div>

      {/* --- TESTIMONIALS SECTION --- */}
      <div className="section-wrapper" style={{ marginTop: '60px', marginBottom: '20px' }}>
        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '30px' }}>What Our Customers Say</h2>
        
        <div className="testimonials-grid">
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <User size={20} color="#0066CC" />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#1f2937' }}>{review.name}</h4>
                    <span style={{ fontSize: '11px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <MapPin size={10} /> {review.location}
                    </span>
                  </div>
                </div>
                <Quote size={24} color="#e5e7eb" fill="#f3f4f6" />
              </div>
              
              <div style={{ display: 'flex', gap: '2px', marginBottom: '10px' }}>
                {renderStars(review.rating)}
              </div>
              
              <p style={{ margin: 0, fontSize: '13px', color: '#4b5563', lineHeight: '1.5', fontStyle: 'italic' }}>
                "{review.text}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* --- WHATSAPP FLOATING BUTTON --- */}
      <a 
        href="https://wa.me/923001234567" // <-- APNA NUMBER YAHAN DALEIN
        target="_blank" 
        rel="noopener noreferrer"
        className="whatsapp-btn"
        title="Chat on WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="white">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.463 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
      </a>

      {/* --- FAKE SALES POPUP UI (UPDATED) --- */}
      {salesPopup && (
        <div className="sales-popup">
            <div className="popup-icon">
                <CheckCircle size={24} color="white" />
            </div>
            <div className="popup-content">
                {/* Yahan 'Someone' ki jagah Naam ayega */}
                <p className="popup-title"><b>{salesPopup.name}</b> in <b>{salesPopup.location}</b></p>
                <p className="popup-desc">purchased <b>{salesPopup.item}</b></p>
                <span className="popup-time">Just now</span>
            </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedProduct && (
        <ProductDetailModal product={selectedProduct} onClose={handleCloseModal} onAddToCart={handleAddToCart} />
      )}

      <FooterPage/>

      {/* --- CSS STYLING --- */}
      <style jsx global>{`
        * { box-sizing: border-box; }
        html, body {
          max-width: 100%;
          overflow-x: hidden;
          margin: 0;
          padding: 0;
        }
      `}</style>

      <style jsx>{`
        .main-wrapper { min-height: 100vh; padding-bottom: 40px; background-color: #f9f9f9; overflow-x: hidden; width: 100%; }
        
        .section-wrapper { 
          max-width: 1530px; 
          margin: 30px auto 0; 
          padding: 0 20px; 
          width: 100%; 
        }
        
        /* Categories Scroll */
        .horizontal-scroll-container { display: flex; gap: 15px; overflow-x: auto; padding-bottom: 15px; scrollbar-width: thin; -webkit-overflow-scrolling: touch; width: 100%; }
        .horizontal-scroll-container::-webkit-scrollbar { height: 6px; }
        .horizontal-scroll-container::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
        .horizontal-scroll-container::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 4px; }
        .scroll-item { flex: 0 0 auto; }

        /* Products */
        .products-section { display: flex; gap: 24px; position: relative; }
        .banner-container { display: none; width: 280px; flex-shrink: 0; height: 100%; }
        .banner-sticky { position: sticky; top: 110px; height: fit-content; }
        .banner-image { width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .products-container { flex: 1; min-width: 0; }
        .products-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .section-title { font-size: 20px; font-weight: bold; color: #374151; font-family: Arial, sans-serif; }
        .view-all-link { font-size: 14px; font-weight: 600; color: #0066CC; text-decoration: none; font-family: Arial, sans-serif; }
        .view-all-link:hover { text-decoration: underline; }
        
        .products-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
        .product-card-wrapper { border-radius: 16px; background: white; padding: 10px; }

        /* Testimonials */
        .testimonials-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
        .review-card { background: white; padding: 20px; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 2px 4px rgba(0,0,0,0.02); transition: transform 0.2s; }
        .review-card:hover { transform: translateY(-3px); border-color: #0066CC; box-shadow: 0 8px 16px rgba(0,0,0,0.05); }

        /* --- FAKE SALES POPUP CSS --- */
        .sales-popup {
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.12);
            padding: 12px 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 9000;
            animation: slideUp 0.5s ease-out;
            max-width: 300px;
            border-left: 4px solid #10b981;
        }
        .popup-icon {
            background: #10b981;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        .popup-content { display: flex; flex-direction: column; }
        .popup-title { margin: 0; font-size: 13px; color: #333; }
        .popup-desc { margin: 0; font-size: 12px; color: #666; line-height: 1.3; }
        .popup-time { font-size: 10px; color: #999; margin-top: 2px; }

        /* --- WHATSAPP BUTTON CSS --- */
        .whatsapp-btn {
            position: fixed;
            bottom: 25px;
            right: 25px;
            background-color: #25D366;
            color: white;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4);
            z-index: 9999;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            cursor: pointer;
        }
        .whatsapp-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(37, 211, 102, 0.6);
        }

        @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Responsive */
        @media (min-width: 480px) { .products-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; } }
        @media (min-width: 768px) { 
          .section-title { font-size: 24px; }
          .products-grid { grid-template-columns: repeat(3, 1fr); gap: 15px; }
          .banner-container { display: block; }
        }
        @media (min-width: 1024px) { .products-grid { grid-template-columns: repeat(4, 1fr); gap: 16px; } }
        @media (min-width: 1280px) { .products-grid { grid-template-columns: repeat(4, 1fr); gap: 18px; } }
        @media (min-width: 1536px) { .products-grid { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; } }
      `}</style>
    </main>
  );
}