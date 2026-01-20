import React from 'react';

const FooterPage = () => {
  return (
    <footer style={{
      backgroundColor: 'white',
      borderTop: '1px solid #e5e7eb',
      marginTop: '40px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '16px'
        
      }}
      className="footer-container">
        
        {/* Top Section: Logo & Links */}
        <div className="footer-top">
            
            {/* Logo Section */}
            <a href="/" style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '16px',
              gap: '12px',
              textDecoration: 'none',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => {
              const img = e.currentTarget.querySelector('img');
              if (img) img.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              const img = e.currentTarget.querySelector('img');
              if (img) img.style.transform = 'scale(1)';
            }}>
                <img 
                    src="/logo.jpeg" 
                    alt="Al-Memni Logo"
                    style={{
                      height: '50px',
                      width: 'auto',
                      objectFit: 'contain',
                      transition: 'transform 0.2s'
                    }}
                />
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  lineHeight: '1.2'
                }}>
                    <span style={{
                      color: '#0066CC',
                      fontWeight: '800',
                      fontSize: '20px',
                      fontFamily: 'Arial, sans-serif'
                    }}>
                      Al-Memni
                    </span>
                    <span style={{
                      backgroundColor: '#0066CC',
                      color: '#FFD700',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      padding: '2px 6px',
                      borderRadius: '2px',
                      width: 'fit-content',
                      letterSpacing: '1px',
                      fontFamily: 'Arial, sans-serif'
                    }}>
                        GROCERY STORE
                    </span>
                </div>
            </a>

            {/* Footer Links */}
            <ul style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              marginBottom: '24px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#6b7280',
              listStyle: 'none',
              padding: 0,
              gap: '8px'
            }}>
                <li>
                    <a href="#" style={{
                      color: '#6b7280',
                      textDecoration: 'none',
                      marginRight: '16px',
                      fontFamily: 'Arial, sans-serif',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#0066CC';
                      e.target.style.textDecoration = 'underline';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = '#6b7280';
                      e.target.style.textDecoration = 'none';
                    }}>
                      About Us
                    </a>
                </li>
                <li>
                    <a href="#" style={{
                      color: '#6b7280',
                      textDecoration: 'none',
                      marginRight: '16px',
                      fontFamily: 'Arial, sans-serif',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#0066CC';
                      e.target.style.textDecoration = 'underline';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = '#6b7280';
                      e.target.style.textDecoration = 'none';
                    }}>
                      Privacy Policy
                    </a>
                </li>
                <li>
                    <a href="#" style={{
                      color: '#6b7280',
                      textDecoration: 'none',
                      marginRight: '16px',
                      fontFamily: 'Arial, sans-serif',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#0066CC';
                      e.target.style.textDecoration = 'underline';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = '#6b7280';
                      e.target.style.textDecoration = 'none';
                    }}>
                      Licensing
                    </a>
                </li>
            </ul>
        </div>

        {/* Divider Line */}
        <hr style={{
          margin: '24px auto',
          borderTop: '1px solid #e5e7eb',
          borderBottom: 'none',
          borderLeft: 'none',
          borderRight: 'none'
        }} />

        {/* Copyright Section */}
        <span style={{
          display: 'block',
          fontSize: '14px',
          color: '#6b7280',
          textAlign: 'center',
          fontFamily: 'Arial, sans-serif'
        }}>
            © 2026{' '}
            <a href="/" style={{
              color: '#0066CC',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'text-decoration 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>
              Al-Memni Grocery Store™
            </a>
            . All Rights Reserved.
        </span>
      </div>

      <style jsx>{`
        .footer-top {
          display: flex;
          flex-direction: column;
        }

        @media (min-width: 640px) {
          .footer-container {
            padding: 32px 16px;
          }

          .footer-top {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }

          .footer-top > a {
            margin-bottom: 0;
          }

          .footer-top > ul {
            margin-bottom: 0;
          }
        }

        @media (min-width: 1024px) {
          hr {
            margin: 32px auto;
          }
        }
      `}</style>
    </footer>
  );
}

export default FooterPage;