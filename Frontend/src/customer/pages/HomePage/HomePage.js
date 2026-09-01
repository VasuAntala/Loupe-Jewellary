import React, { useContext, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ModalContext } from "../../../context/modal/modalContext";
import { findProducts } from "../../../state/product/Action";

// New Premium Components
import HeroSection from "./components/HeroSection";
import CollectionCircles from "./components/CollectionCircles";
import BestSellerSection from "./components/BestSellerSection";
import StyleStory from "./components/StyleStory";
import LifestyleSplit from "./components/LifestyleSplit";
import TrustBanner from "./components/TrustBanner";
import SocialFeed from "./components/SocialFeed";
import PerfectSparkleSection from "./components/PerfectSparkleSection";
import ChooseYourJewellery from "./components/ChooseYourJewellery";

const HomePage = () => {
  const location = useLocation();
  const modal = useContext(ModalContext);
  const dispatch = useDispatch();

  const { products } = useSelector((store) => store);

  useEffect(() => {
    // Fetch Gold Products dynamically from backend
    const reqData = {
      category: 'jewellery',
      type: 'gold',
      color: '',
      minPrice: 0,
      maxPrice: 1000000,
      minDiscount: 0,
      maxDiscount: 100,
      sort: 'low_to_high',
      pageNumber: 1,
      pageSize: 50,
      occasion: '',
    };
    dispatch(findProducts(reqData));
  }, [dispatch]);

  // Intersection Observer for scroll reveal
  const containerRef = useRef(null);
  useEffect(() => {
    if (!containerRef.current) return;
    const nodes = containerRef.current.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: 0.15 });
    nodes.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const allProductsList = Array.isArray(products?.products?.content)
    ? products.products.content
    : (Array.isArray(products?.products) ? products.products : []);

  // Filter products to ensure they are Gold products (by type or metalType)
  const goldProducts = allProductsList.filter(
    (p) =>
      p.type?.toLowerCase() === 'gold' ||
      p.metalType?.toLowerCase() === 'gold' ||
      !p.metalType // fallback to show products if metalType is unset
  );

  // Group Gold Products by category / product type
  const productsByCategory = goldProducts.reduce((acc, product) => {
    const categoryName = product.category?.name || product.secondLevelCategory || 'Featured Gold';
    const formattedName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
    if (!acc[formattedName]) {
      acc[formattedName] = [];
    }
    acc[formattedName].push(product);
    return acc;
  }, {});

  const categoryEntries = Object.entries(productsByCategory);

  return (
    <div
      ref={containerRef}
      className="page-fade overflow-x-hidden"
      onLoad={() => {
        if (location.pathname === "/login" || location.pathname === "/register") {
          modal.openModal();
        }
      }}
    >
      {/* 1st Position: Hero Section */}
      <section>
        <HeroSection />
      </section>

      {/* 2nd Position: Diamond & Category Collection Circles */}
      <section className="reveal">
        <CollectionCircles />
      </section>

      {/* 3rd Position: Choose Your Jewellery Section */}
      <section className="reveal">
        <ChooseYourJewellery />
      </section>
      
      <section className="reveal">
        <PerfectSparkleSection />
      </section>


      {/* 3. Main Best Sellers Section (Design Preserved with Real Data) */}
      <section className="reveal">
        <BestSellerSection title="Best Sellers" products={goldProducts.length > 0 ? goldProducts : allProductsList} />
      </section>

      {/* Additional Gold Category Sliders (if available) */}
      {categoryEntries.length > 1 &&
        categoryEntries.map(([catTitle, catProducts]) => (
          <section key={catTitle} className="reveal">
            <BestSellerSection title={`Gold ${catTitle}`} products={catProducts} />
          </section>
        ))
      }

      {/* Style Stories - Lifestyle Grid */}
      <section className="reveal">
        <StyleStory />
      </section>

      {/* Crafted for Every Moment */}
      <section className="reveal">
        <LifestyleSplit />
      </section>

      {/* 4. Brand Trust Features */}
      <section className="reveal">
        <TrustBanner />
      </section>

      {/* 5. Social Feed */}
      <section className="reveal">
        <SocialFeed />
      </section>
    </div>
  );
};

export default HomePage;
