"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "../../../components/Navbar";
import ProductCard, { ProductDetailModal } from "../../../components/ProductCard"; // Modal import kiya
import FooterPage from "../../../components/Footer";
import { Package } from "lucide-react";

export default function CategoryPage() {
  const params = useParams();
  
  // Data States
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("Category");
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("default");

  // --- MODAL STATES (NEW) ---
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetch(`https://grocery-store-backend-wxpw.onrender.com/products/category/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));

    fetch("https://grocery-store-backend-wxpw.onrender.com/categories")
      .then((res) => res.json())
      .then((cats) => {
        const currentCat = cats.find((c) => c.id == params.id);
        if (currentCat) setCategoryName(currentCat.name);
      });
  }, [params.id]);

  useEffect(() => {
    let sorted = [...products];
    
    switch(sortBy) {
      case "price-low":
        sorted.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price-high":
        sorted.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "name-az":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-za":
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }
    
    setFilteredProducts(sorted);
  }, [sortBy, products]);

  const handleAddToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const updatedCart = [...cart, product];
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));

    // Optional: Notification logic (Agar aapne Home page wala notification system yahan lagana ho to)
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="position: fixed; top: 80px; right: 20px; background-color: #10b981; color: white; padding: 16px 24px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); z-index: 9999; font-family: Arial; font-weight: 600; animation: slideIn 0.3s ease-out; display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 18px;">✓</span><span>Added to cart!</span>
      </div>
      <style>@keyframes slideIn { from { transform: translateX(400px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }</style>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      const notifElement = notification.firstElementChild;
      if (notifElement) notifElement.style.opacity = '0';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };

  // --- CHANGED: AB YE MODAL KHOLEGA ---
  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setShowDetailModal(true);
  };

  // --- NEW: CLOSE MODAL HANDLER ---
  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedProduct(null);
  };

  return (
    <div style={styles.pageWrapper}>
      <Navbar />
      
      <div style={styles.mainContainer}>
        
        {/* Breadcrumb */}
        <div style={styles.breadcrumb}>
          <a href="/" style={styles.breadcrumbLink}>Home</a>
          <span style={styles.separator}>/</span>
          <span style={styles.breadcrumbActive}>{categoryName}</span>
        </div>

        {/* Header */}
        <div style={styles.headerCard}>
          <div style={styles.headerTop}>
            <div style={styles.titleSection}>
              <Package color="#0066CC" size={28} />
              <h1 style={styles.pageTitle}>{categoryName}</h1>
            </div>
            <p style={styles.productCount}>
              {loading ? "Loading..." : `${filteredProducts.length} Products`}
            </p>
          </div>
        </div>

        {/* Products */}
        {loading ? (
          <div style={styles.loadingBox}>
            <div style={styles.spinner}></div>
            <p style={styles.loadingText}>Loading Products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={styles.emptyBox}>
            <div style={styles.emptyIconCircle}>
              <Package size={48} color="#9ca3af" />
            </div>
            <h2 style={styles.emptyTitle}>No Products Found</h2>
            <p style={styles.emptySubtitle}>Try browsing other categories</p>
            <a href="/" style={styles.browseButton}>Browse Categories</a>
          </div>
        ) : (
          <div style={styles.productsGrid}>
            {filteredProducts.map((prod) => (
              <div key={prod.id}>
                <ProductCard 
                  product={prod} 
                  onAddToCart={handleAddToCart}
                  onViewDetails={handleViewDetails}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- PRODUCT DETAIL MODAL --- */}
      {showDetailModal && selectedProduct && (
        <ProductDetailModal 
            product={selectedProduct} 
            onClose={handleCloseModal} 
            onAddToCart={handleAddToCart} 
        />
      )}
      
      <FooterPage />

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Responsive Grid */
        @media (min-width: 640px) {
          .products-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (min-width: 768px) {
          .products-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
        @media (min-width: 1024px) {
          .products-grid {
            grid-template-columns: repeat(5, 1fr) !important;
          }
        }
        @media (min-width: 1280px) {
          .products-grid {
            grid-template-columns: repeat(6, 1fr) !important;
          }
        }

        /* Hover Effects */
        a:hover {
          color: #0066CC !important;
        }
        .browse-button:hover {
          background: #0052a3 !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0, 102, 204, 0.3) !important;
        }
      `}</style>
    </div>
  );
}

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    background: '#f9fafb',
    width: '100%',
    overflowX: 'hidden',
  },
  mainContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px 16px',
    width: '100%',
    boxSizing: 'border-box',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  breadcrumbLink: {
    color: '#6b7280',
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
  separator: {
    color: '#d1d5db',
  },
  breadcrumbActive: {
    color: '#111827',
    fontWeight: '600',
  },
  headerCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    border: '1px solid #e5e7eb',
  },
  headerTop: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '16px',
  },
  titleSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  pageTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
    textTransform: 'capitalize',
  },
  productCount: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },
  loadingBox: {
    background: 'white',
    borderRadius: '12px',
    padding: '80px 20px',
    textAlign: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #e5e7eb',
    borderTopColor: '#0066CC',
    borderRadius: '50%',
    margin: '0 auto 16px',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    fontSize: '16px',
    color: '#6b7280',
    fontWeight: '500',
  },
  emptyBox: {
    background: 'white',
    borderRadius: '12px',
    padding: '60px 20px',
    textAlign: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  emptyIconCircle: {
    width: '80px',
    height: '80px',
    background: '#f3f4f6',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '8px',
  },
  emptySubtitle: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '24px',
  },
  browseButton: {
    display: 'inline-block',
    padding: '12px 28px',
    background: '#0066CC',
    color: 'white',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.2s',
    boxShadow: '0 4px 12px rgba(0, 102, 204, 0.25)',
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
    width: '100%',
  },
};