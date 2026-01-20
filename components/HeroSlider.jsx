"use client";
import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

export default function HeroSlider() {
  const [banners, setBanners] = useState([]);

  // Fetch Sliders from Backend
  useEffect(() => {
    fetch("http://localhost:5000/sliders")
      .then((res) => res.json())
      .then((data) => {
        // Agar data khali hai to default images use karein
        if (data.length > 0) {
            setBanners(data.map(item => item.image_url));
        } else {
            setBanners([
                "https://placehold.co/1400x450/8B5CF6/ffffff?text=Welcome+to+Al+memni+grocery+store",
                "https://placehold.co/1400x450/F59E0B/ffffff?text=Fresh+Deals"
            ]);
        }
      })
      .catch((err) => console.error("Slider Fetch Error:", err));
  }, []);

  return (
    <div style={{ maxWidth: '1600px', margin: '20px auto 0', padding: '0 10px' }}>
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[Autoplay, Navigation, Pagination]}
        className="mySwiper"
        style={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', position: 'relative' }}
      >
        {banners.map((imgUrl, index) => (
          <SwiperSlide key={index}>
            <div style={{ width: '100%', position: 'relative' }} className="slider-container">
              <img 
                src={imgUrl} 
                alt={`Banner ${index + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </SwiperSlide>
        ))}
        
        {/* Same Styling as before */}
        <style jsx global>{`
          .slider-container { height: 200px; }
          @media (min-width: 480px) { .slider-container { height: 250px; } }
          @media (min-width: 640px) { .slider-container { height: 300px; } }
          @media (min-width: 768px) { .slider-container { height: 350px; } }
          @media (min-width: 1024px) { .slider-container { height: 400px; } }
          @media (min-width: 1280px) { .slider-container { height: 450px; } }

          .swiper-button-next, .swiper-button-prev {
            color: #0066CC !important; 
            background: rgba(255, 255, 255, 0.9);
            border-radius: 50%;
            width: 35px !important; height: 35px !important;
            opacity: 0; transition: opacity 0.3s ease;
          }
          .swiper-button-next:after, .swiper-button-prev:after { font-size: 16px !important; font-weight: bold; }
          
          @media (min-width: 1024px) {
            .mySwiper:hover .swiper-button-next, .mySwiper:hover .swiper-button-prev { opacity: 1; }
          }
          @media (max-width: 1023px) {
            .swiper-button-next, .swiper-button-prev { opacity: 0.7 !important; }
          }
          @media (max-width: 640px) {
            .swiper-button-next, .swiper-button-prev { width: 30px !important; height: 30px !important; }
          }
          .swiper-pagination-bullet { background: rgba(255, 255, 255, 0.7); opacity: 1; }
          .swiper-pagination-bullet-active { background: #0066CC !important; width: 24px; border-radius: 4px; }
          .swiper-pagination { bottom: 10px !important; }
        `}</style>
      </Swiper>
    </div>
  );
}