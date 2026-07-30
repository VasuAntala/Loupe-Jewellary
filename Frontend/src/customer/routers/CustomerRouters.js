import React, { useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage";
import Product from "../components/Products/product";
import ProductDetails from "../components/ProductDetails/ProductDetails";
import Cart from "../components/Cart/Cart";
import Checkout from "../components/Checkout/Checkout";
import OrderHistory from "../components/MyOrders/OrderHistory";
import OrderDetails from "../components/MyOrders/OrderDetails";
import Navigation from "../components/navigation/Navigation";
import ModalState from "../../context/modal/modalState";
import RRState from "../../context/rrBox/rrState";
import PageNotFound from "../components/NotFound/PageNotFound";
import { useDispatch, useSelector } from "react-redux";
import UserDetails from "../components/User_Details/UserDetails";
import Footer from "../components/Footer/Footer";
import { getUser } from "../../state/auth/Action";
import PrivacyPolicy from "../pages/Policies/PrivacyPolicy";
import RefundPolicy from "../pages/Policies/RefundPolicy";
import ShippingPolicy from "../pages/Policies/ShippingPolicy";
import TermsOfService from "../pages/Policies/TermsOfService";
import ContactInfo from "../pages/Policies/ContactInfo";

import { motion, AnimatePresence } from "framer-motion";

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};

// Define a higher-order component to conditionally render Navigation and Footer
const WithLayout = ({ children, showLayout }) => {

  return showLayout ? (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <motion.main
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={pageTransition}
        className="flex-grow"
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  ) : (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
};

const CustomerRouters = () => {
  const dispatch = useDispatch();
  const { jwt: reduxJwt } = useSelector((store) => store.auth);
  const localJwt = localStorage.getItem("jwt");
  const authenticated = !!(reduxJwt || localJwt);

  useEffect(() => {
    if (localJwt) {
      dispatch(getUser(localJwt));
    }
  }, [localJwt]);


  return (
    <ModalState>
      <Routes>
        <Route path="/" element={<Navigate to="/home1" replace />} />
        <Route
          path="/home1"
          element={
            <WithLayout showLayout={true}>
              <HomePage />
            </WithLayout>
          }
        />
        <Route
          path="/login"
          element={
            <WithLayout showLayout={true}>
              <HomePage />
            </WithLayout>
          }
        />
        <Route
          path="/register"
          element={
            <WithLayout showLayout={true}>
              <HomePage />
            </WithLayout>
          }
        />

        <Route
          path="/product/:productId"
          element={
            <WithLayout showLayout={true}>
              <RRState>
                <ProductDetails />
              </RRState>
            </WithLayout>
          }
        />
        <Route
          path="/product/:productId/ratrev"
          element={
            authenticated ? (
              <WithLayout showLayout={true}>
                <RRState>
                  <ProductDetails />
                </RRState>
              </WithLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/:levelOne/:levelTwo/:levelThree"
          element={
            <WithLayout showLayout={true}>
              <Product />
            </WithLayout>
          }
        />

        <Route
          path="/product-catalogue"
          element={
            <WithLayout showLayout={true}>
              <Product />
            </WithLayout>
          }
        />
        <Route
          path="/cart"
          element={
            <WithLayout showLayout={true}>
              <Cart />
            </WithLayout>
          }
        />

        <Route
          path="/user-details"
          element={
            authenticated ? (
              <WithLayout showLayout={true}>
                <UserDetails />
              </WithLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/checkout"
          element={
            <WithLayout showLayout={true}>
              <Checkout />
            </WithLayout>
          }
        />
        <Route
          path="/account/orders/:orderId/:index"
          element={
            authenticated ? (
              <WithLayout showLayout={true}>
                <RRState>
                  <OrderDetails />
                </RRState>
              </WithLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/payment/:orderId"
          element={<WithLayout showLayout={true}><OrderHistory /></WithLayout>}
        />

        <Route path="/privacy" element={<WithLayout showLayout={true}><PrivacyPolicy /></WithLayout>} />
        <Route path="/refund" element={<WithLayout showLayout={true}><RefundPolicy /></WithLayout>} />
        <Route path="/shipping" element={<WithLayout showLayout={true}><ShippingPolicy /></WithLayout>} />
        <Route path="/terms" element={<WithLayout showLayout={true}><TermsOfService /></WithLayout>} />
        <Route path="/contact-info" element={<WithLayout showLayout={true}><ContactInfo /></WithLayout>} />

        {/* 404 Page */}
        <Route
          path="*"
          element={
            <WithLayout showLayout={true}>
              <PageNotFound />
            </WithLayout>
          }
        />
      </Routes>
    </ModalState>
  );
};

export default CustomerRouters;
