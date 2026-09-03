import React, { useEffect, useState } from "react";
import HomeSectionCard from "../Section_card/HomeSectionCard";
import Slider from "react-slick";
import "./style1.css";
import { useDispatch, useSelector } from "react-redux";
import { store } from "../../../state/store";
import { findProducts } from "../../../state/product/Action";

const HomeSectionCarousel = ({
    sectionName,
    sectionDisc,
    sectionLabel,
    sectionCategory,
    _id,
}) => {
    const dispatch = useDispatch();
    const [localProducts, setLocalProducts] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const collection = _id === 'best-of-loupe' ? 'best-sellers' :
                    _id === 'new-arrivals' ? 'new-arrival' :
                        _id === 'reccomanded' ? 'reccomanded' : null;

                // For "similar" carousels use broad jewellery fetch so real product
                // IDs are returned and card navigation works correctly
                const category = sectionLabel === 'similar' ? 'jewellery' : (sectionCategory || 'jewellery');

                const params = new URLSearchParams({
                    category,
                    color: "",
                    minPrice: "10",
                    maxPrice: "1000000",
                    minDiscount: "0",
                    maxDiscount: "100",
                    sort: "low_to_high",
                    pageNumber: "1",
                    pageSize: "8",
                    occasion: "",
                    type: "",
                    collectionName: collection || ""
                });

                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5455'}/api/products?${params.toString()}`);
                const data = await response.json();
                setLocalProducts(data);
            } catch (error) {
                console.error("Error in HomeSectionCarousel fetch:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [sectionCategory, sectionLabel, _id]);

    const settings = {
        dots: true,
        infinite: false,
        speed: 1000,
        slidesToShow: 4,
        slidesToScroll: 4,
        fade: false,
        arrows: true,
        autoplay: false,
        initialSlide: 0,
        swipeToSlide: true,
        className: "center",
        leftPadding: "60px",
        // focusOnSelect: true,
        responsive: [
            {
                breakpoint: 1150,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    dots: false,
                    className: "center",
                    centerPadding: "60px",
                    swipeToSlide: true,
                },
            },
            {
                breakpoint: 968,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    // centerMode: true,
                    dots: false,
                    speed: 500,
                    className: "center",
                    infinite: true,
                    centerPadding: "60px",
                    swipeToSlide: true,
                },
            },
            {
                breakpoint: 700,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: false,
                    speed: 500,
                    initialSlide: 2,
                    className: "center",
                    infinite: true,
                    centerPadding: "60px",
                    swipeToSlide: true,
                    // className: "center",
                    // centerMode: true,
                    // centerPadding: "40px",
                },
            },
        ],
    };

    // High-quality Dummy Products precisely matching the screenshot's data
    const dummyProducts = [
        { _id: 'd1', title: '0.30 Pointer Diamond Ring', discountedPrice: 31150, price: 36000, discountPercent: 13, imageUrls: [{ imageUrl: 'https://images.pexels.com/photos/10983783/pexels-photo-10983783.jpeg?auto=compress&cs=tinysrgb&w=600' }] },
        { _id: 'd2', title: 'Labgrown Diamond Round Ring', discountedPrice: 35901, price: 41000, discountPercent: 12, imageUrls: [{ imageUrl: 'https://images.pexels.com/photos/5370706/pexels-photo-5370706.jpeg?auto=compress&cs=tinysrgb&w=600' }] },
        { _id: 'd3', title: 'Diamond Engagement Ring', discountedPrice: 49888, price: 58000, discountPercent: 14, imageUrls: [{ imageUrl: 'https://images.pexels.com/photos/5370692/pexels-photo-5370692.jpeg?auto=compress&cs=tinysrgb&w=600' }] },
        { _id: 'd4', title: 'Classic Lab Grown Diamond Gift', discountedPrice: 34011, price: 39500, discountPercent: 14, imageUrls: [{ imageUrl: 'https://images.pexels.com/photos/11745093/pexels-photo-11745093.jpeg?auto=compress&cs=tinysrgb&w=600' }] },
        { _id: 'd5', title: 'Gold Bangles Set', discountedPrice: 28500, price: 33000, discountPercent: 14, imageUrls: [{ imageUrl: 'https://images.pexels.com/photos/10918478/pexels-photo-10918478.jpeg?auto=compress&cs=tinysrgb&w=600' }] },
        { _id: 'd6', title: 'Diamond Necklace Pendant', discountedPrice: 52000, price: 61000, discountPercent: 15, imageUrls: [{ imageUrl: 'https://images.pexels.com/photos/9428281/pexels-photo-9428281.jpeg?auto=compress&cs=tinysrgb&w=600' }] },
    ];

    const displayProducts = (localProducts?.content?.length > 0)
        ? localProducts.content
        : dummyProducts;

    const items = loading
        ? [1, 2, 3, 4].map(n => <div key={n} className="p-4 h-[20rem] animate-pulse bg-gray-200 rounded-lg"></div>)
        : displayProducts.map((item, index) => (
            <HomeSectionCard
                product={item}
                index={index}
                key={item._id}
                productLabel={sectionLabel}
            />
        ));

    return (
        <div className="my-5" id={_id}>
            {sectionName && (
                <div>
                    <h2
                        style={{ letterSpacing: "1px" }}
                        className="text-4xl font-semibold text-[#3c7399] text-center px-10"
                    >
                        {sectionName}
                    </h2>
                    <p className="text-lg font-normal text-center pt-2">{sectionDisc}</p>
                    <img
                        src="https://res.cloudinary.com/deq0hxr3t/image/upload/v1711727694/Line-Design_fhgakp.svg"
                        className="w-full h-20 object-cover"
                        alt=""
                    />
                </div>
            )}

            <div className="slider-container">
                <Slider {...settings}>{items}</Slider>
            </div>
        </div>
    );
};

export default HomeSectionCarousel;
