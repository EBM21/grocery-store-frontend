import Link from 'next/link'; // 1. Link Import kiya

// 2. 'id' prop receive kiya
export default function MetroCard({ id, title, image, discount }) {
  return (
    // 3. Link wrapper lagaya jo specific ID par le jayega
    <Link href={`/category/${id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        position: 'relative',
        width: '240px',
        height: '140px',
        backgroundColor: 'white',
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        display: 'inline-block',
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'box-shadow 0.3s ease',
        boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.08)';
      }}>
        
        {/* RED DISCOUNT BADGE */}
        {discount && (
          <div style={{
            position: 'absolute', top: '0', left: '0', backgroundColor: '#E60000', color: 'white',
            fontSize: '13px', fontWeight: 'bold', padding: '10px 15px', fontFamily: 'Arial, sans-serif',
            zIndex: 10, borderRadius: '4px 0 4px 0'
          }}>
            {discount}% OFF
          </div>
        )}

        {/* PRODUCT IMAGE */}
        <div style={{
          position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
          width: '110px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <img src={image} alt={title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
        </div>

        {/* TITLE TEXT */}
        <div style={{ position: 'absolute', bottom: '15px', left: '15px', width: '45%', zIndex: 5 }}>
          <h3 style={{
            color: '#006837', fontWeight: 'bold', fontSize: '14px', lineHeight: '1.2',
            textTransform: 'uppercase', fontFamily: 'Arial, Helvetica, sans-serif', margin: 0, letterSpacing: '0.5px'
          }}>
            {title}
          </h3>
        </div>
      </div>
    </Link>
  );
}