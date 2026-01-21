"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "../../../components/Navbar";
import ProductCard from "../../../components/ProductCard";
import FooterPage from "../../../components/Footer";
import { Grid, List, ChevronDown, Package, X } from "lucide-react";

export default function CategoryPage() {
  const params = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("Category");
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("default");

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
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleViewDetails = (product) => {
    window.location.href = `/product/${product.id}`;
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
          .header-top {
            flex-direction: row !important;
            align-items: center !important;
            justify-content: space-between !important;
          }
          .sort-section {
            flex-direction: row !important;
            align-items: center !important;
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
        .select-box:hover {
          border-color: #0066CC !important;
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
  sortSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    alignItems: 'flex-start',
  },
  sortLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
  },
  selectWrapper: {
    position: 'relative',
    width: '100%',
    maxWidth: '280px',
  },
  selectBox: {
    width: '100%',
    padding: '10px 36px 10px 14px',
    fontSize: '14px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    background: 'white',
    color: '#374151',
    fontWeight: '500',
    cursor: 'pointer',
    outline: 'none',
    appearance: 'none',
    transition: 'border-color 0.2s',
  },
  selectIcon: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
    color: '#9ca3af',
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