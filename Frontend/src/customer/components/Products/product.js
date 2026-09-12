import React, { useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Fragment, useState } from "react";
import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import GridViewIcon from '@mui/icons-material/GridView';
import ProductCard from "./productCard";
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import { useDispatch, useSelector } from 'react-redux';
import { findProducts } from '../../../state/product/Action';
import { store } from '../../../state/store';
import {
  Pagination,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Typography,
  Box,
  Divider,
  IconButton,
  Button,
  Chip
} from '@mui/material';
import Loading from '../../../Loading';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import { formatPriceINR } from '../../../utils/price';
import './productStyle.css'


const sortOptions = [
  { name: "Price: Low to High", value: "low_to_high", current: false },
  { name: "Price: High to Low", value: "high_to_low", current: false },
];

const rangeFilters = [
  {
    id: "price",
    name: "Price",
  },
];

const filters = [
  {
    id: "color",
    name: "Color",
    options: [
      { value: "yellow", label: "Gold", checked: false, hex: "#F3DC74" },
      { value: "white", label: "Silver", checked: false, hex: "#E5E7EB" },
      { value: "rose", label: "Rose Gold", checked: false, hex: "#E0BFB8" },
    ],
  },
  {
    id: "occasion",
    name: "Occasion",
    options: [
      { value: "bridal", label: "Bridal wear", checked: false },
      { value: "casual", label: "Casual wear", checked: false },
      { value: "engagement", label: "Engagement", checked: false },
      { value: "modern", label: "Modern wear", checked: false },
      { value: "office", label: "Office wear", checked: false },
      {
        value: "traditional-ethenic",
        label: "Traditional and ethenic wear",
        checked: false,
      },
    ],
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Product() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [priceVal, setPriceVal] = useState([1000, 60000]);
  const [discountVal, setDiscountVal] = useState([10, 50]);
  const location = useLocation();
  const param = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products } = useSelector(store => store);

  const decodedQueryString = decodeURIComponent(location.search);
  const searchParams = new URLSearchParams(decodedQueryString);
  const colorValue = searchParams.get("color");
  const priceValue = searchParams.get("price");
  const discountValue = searchParams.get("discount");
  const sortValue = searchParams.get("sort");
  const pageNumberValue = searchParams.get("page");
  const typeValue = searchParams.get("type");
  const occasionValue = searchParams.get("occasion");
  const searchValue = searchParams.get("search");

  useEffect(() => {
    const [minPrice, maxPrice] = priceValue === null ? [100, 1000000] : priceValue.split(",").map(Number);
    const [minDiscount, maxDiscount] = discountValue === null ? [0, 100] : discountValue.split(",").map(Number);

    try {
      const jewelryCollections = ['best-sellers', 'reccomanded', 'new-arrival', 'dharohar', 'aksharam', 'loupe', 'wedding'];
      const collectionParam = jewelryCollections.includes(param.levelOne) ? param.levelOne : null;

      const jewelryType = ['gold', 'diamond', 'silver', 'gemstone', 'platinum'];
      const occasionTypes = ['bridal', 'casual', 'engagement', 'modern', 'office', 'traditional-ethenic'];

      let resolvedType = typeValue || "";
      if (!resolvedType) {
        if (jewelryType.includes(param.levelThree)) {
          resolvedType = param.levelThree;
        } else if (jewelryType.includes(param.levelOne)) {
          resolvedType = param.levelOne;
        }
      }

      let resolvedOccasion = occasionValue || "";
      if (!resolvedOccasion && occasionTypes.includes(param.levelThree)) {
        resolvedOccasion = param.levelThree;
      }

      let resolvedCategory = param.levelThree || "jewellery";
      if (jewelryType.includes(resolvedCategory) || occasionTypes.includes(resolvedCategory)) {
        resolvedCategory = "jewellery";
      }

      const data = {
        category: resolvedCategory,
        color: colorValue || [],
        minPrice,
        maxPrice,
        minDiscount,
        maxDiscount,
        sort: sortValue || "low_to_high",
        pageNumber: parseInt(pageNumberValue) || 1,
        pageSize: 12,
        occasion: resolvedOccasion || [],
        type: resolvedType || [],
        collectionName: collectionParam || "",
        search: searchValue || "",
      }
      dispatch(findProducts(data));

    } catch (error) {
      console.error('Error in useEffect:', error);
    }

  }, [
    param.levelThree,
    colorValue,
    priceValue,
    discountValue,
    sortValue,
    pageNumberValue,
    occasionValue,
    typeValue,
    searchValue,
  ])

  // Handle multiple filters on cards
  const handleFilters = (value, sectionId) => {
    const searchParams = new URLSearchParams(location.search);

    let filterValue = searchParams.getAll(sectionId);

    if (filterValue.length > 0 && filterValue[0].split(',').includes(value)) {
      filterValue = filterValue[0].split(',').filter((item) => item !== value);

      if (filterValue.length === 0) {
        searchParams.delete(sectionId)
      }
    }
    else {
      filterValue.push(value)
    }

    if (filterValue.length > 0) {
      searchParams.set(sectionId, filterValue.join(','));
    }

    const query = searchParams.toString();
    navigate({ search: `?${query}` });
  }


  // Handle PRICE range filters on cards
  const handlePriceRangeFilter = (sectionId) => {
    const searchParams = new URLSearchParams(location.search);

    searchParams.set(sectionId, priceVal);
    const query = searchParams.toString();
    navigate({ search: `?${query}` });
  }

  // Handle DISCOUNT range filters on cards
  const handleDiscountRangeFilter = (sectionId) => {
    const searchParams = new URLSearchParams(location.search);

    searchParams.set(sectionId, discountVal);
    const query = searchParams.toString();
    navigate({ search: `?${query}` });
  }

  // Handle SORT selection filters on cards
  const handleSortFilter = (sortVal) => {
    const searchParams = new URLSearchParams(location.search);
    console.log('filter method', sortVal)
    searchParams.set('sort', sortVal);
    const query = searchParams.toString();
    navigate({ search: `?${query}` });
  }

  // Handle pagination
  const handlePaginationChange = (event, value) => {
    const searchParams = new URLSearchParams(location.search)
    searchParams.set("page", value)
    const query = searchParams.toString()
    navigate({ search: `?${query}` })
  }

  return (
    <div className="bg-[#fafafa] min-h-screen">
      <main className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">

        {/* Editorial Header Section */}
        <div className="pt-8 sm:pt-16 pb-4 sm:pb-8 text-center">
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3.5rem' },
              fontWeight: 400,
              fontFamily: "'Playfair Display', serif",
              color: '#3c7399',
              mb: 1.5,
              textTransform: 'capitalize'
            }}
          >
            {searchValue ? `Search: ${searchValue}` :
              location.pathname === '/product-catalogue' ? "Product Catalogue" :
                param.levelThree || param.levelOne || "All Jewellery"}
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: '0.65rem', sm: '0.75rem' },
              fontWeight: 800,
              color: '#94a3b8',
              letterSpacing: { xs: 1.5, sm: 3 },
              textTransform: 'uppercase'
            }}
          >
            {products.products?.totalElements ? `${products.products.totalElements} Masterpieces Found` : "Timeless Designs, Exceptional Craftsmanship"}
          </Typography>
        </div>

        <Divider sx={{ mb: { xs: 3, md: 6 }, opacity: 0.1 }} />

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">

          {/* Premium Filter Sidebar - Hidden on mobile, drawer used instead */}
          <aside className="hidden lg:block lg:w-[280px] flex-shrink-0">
            <div className="sticky top-32">
              <div className="flex items-center justify-between mb-8">
                <Typography sx={{ fontSize: '1.2rem', fontWeight: 300, fontFamily: "'Playfair Display', serif", color: '#3c7399' }}>Filters</Typography>
              </div>

              {/* Price Range Filter */}
              <Accordion disableGutters elevation={0} defaultExpanded sx={{ bgcolor: 'transparent', '&:before': { display: 'none' }, mb: 3 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: 18 }} />} sx={{ p: 0, minHeight: 0, '& .MuiAccordionSummary-content': { my: 1.5 } }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.5, color: '#3c7399' }}>Price Range</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0, pb: 2 }}>
                  <div className="space-y-6 pt-4">
                    <RangeSlider
                      onThumbDragEnd={(e) => handlePriceRangeFilter('price')}
                      value={priceVal}
                      onInput={setPriceVal}
                      min={100}
                      max={1000000}
                      step={100}
                      id="range-slider-price"
                    />
                    <div className="flex justify-between items-center text-[0.75rem] font-bold text-[#64748b]">
                      <span>₹{formatPriceINR(priceVal[0])}</span>
                      <span>₹{formatPriceINR(priceVal[1])}</span>
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>

              {/* Category Checkbox Filters */}
              {filters.map((section) => (
                <Accordion key={section.id} disableGutters elevation={0} defaultExpanded sx={{ bgcolor: 'transparent', '&:before': { display: 'none' }, mb: 3 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: 18 }} />} sx={{ p: 0, minHeight: 0, '& .MuiAccordionSummary-content': { my: 1.5 } }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.5, color: '#3c7399' }}>{section.name}</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 0, pb: 2 }}>
                    {section.id === 'color' ? (
                      <div className="flex flex-wrap gap-3 pt-3">
                        {section.options.map((option) => (
                          <div
                            key={option.value}
                            onClick={() => handleFilters(option.value, section.id)}
                            className={`w-9 h-9 rounded-full cursor-pointer border-2 transition-all flex items-center justify-center ${colorValue?.split(',').includes(option.value) ? 'border-[#3c7399] scale-110' : 'border-transparent'}`}
                            title={option.label}
                          >
                            <div
                              style={{ background: option.hex, border: option.value === 'white' ? '1px solid #eee' : 'none' }}
                              className="w-7 h-7 rounded-full shadow-inner"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2 pt-2">
                        {section.options.map((option) => (
                          <FormControlLabel
                            key={option.value}
                            control={
                              <Checkbox
                                size="small"
                                checked={searchParams.get(section.id)?.split(',').includes(option.value) || false}
                                onChange={() => handleFilters(option.value, section.id)}
                                sx={{ color: '#dadada', '&.Mui-checked': { color: '#3c7399' } }}
                              />
                            }
                            label={<Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>{option.label}</Typography>}
                          />
                        ))}
                      </div>
                    )}
                  </AccordionDetails>
                </Accordion>
              ))}

              {/* Sorting Section */}
              <div className="pt-6 border-t border-slate-100">
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.5, color: '#3c7399', mb: 3 }}>Sort By</Typography>
                <RadioGroup value={sortValue || "low_to_high"} onChange={(e) => handleSortFilter(e.target.value)}>
                  {sortOptions.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      value={option.value}
                      control={<Radio size="small" sx={{ color: '#dadada', '&.Mui-checked': { color: '#3c7399' } }} />}
                      label={<Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>{option.name}</Typography>}
                    />
                  ))}
                </RadioGroup>
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="flex-1">
            {/* Mobile Filter & Sort Toolbar */}
            <div className="lg:hidden flex items-center justify-between gap-3 bg-white p-2.5 rounded-2xl shadow-sm border border-slate-100 mb-5">
              <Button
                onClick={() => setMobileFiltersOpen(true)}
                variant="outlined"
                startIcon={<FilterAltIcon sx={{ fontSize: 18 }} />}
                sx={{
                  flex: 1,
                  borderColor: '#3c7399',
                  color: '#3c7399',
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  borderRadius: '10px',
                  py: 0.8
                }}
              >
                Filters
              </Button>
              <div className="flex-1">
                <select
                  value={sortValue || "low_to_high"}
                  onChange={(e) => handleSortFilter(e.target.value)}
                  className="w-full bg-[#f8fafc] border border-slate-200 text-[#3c7399] font-bold text-xs py-2 px-3 rounded-xl focus:outline-none focus:border-[#3c7399]"
                >
                  <option value="low_to_high">Price: Low to High</option>
                  <option value="high_to_low">Price: High to Low</option>
                </select>
              </div>
            </div>

            {products.products?.content ? (
              products.products.content.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-40 bg-white rounded-3xl border border-dashed border-slate-200">
                  <div className="w-32 h-32 opacity-10 mb-6">
                    <img src="https://res.cloudinary.com/deq0hxr3t/image/upload/v1709462235/no-found_mnvvpf.svg" alt="No results" className="w-full h-full object-contain" />
                  </div>
                  <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", color: '#3c7399', mb: 1 }}>No Masterpieces Found</Typography>
                  <Box sx={{ w: 40, h: 2, bgcolor: '#3c7399', my: 2 }} />
                  <Typography sx={{ color: '#94a3b8', fontSize: '0.9rem' }}>Try refining your filters or search keywords.</Typography>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-2.5 sm:gap-4 md:gap-6 justify-items-center">
                  {products.products.content.map((product, idx) => (
                    <ProductCard product={product} key={product._id} index={idx} />
                  ))}
                </div>
              )
            ) : (
              <div className="flex items-center justify-center h-[60vh]">
                <Loading />
              </div>
            )}

            {/* Pagination Segment */}
            {products.products?.totalPages > 1 && (
              <Box sx={{ mt: 12, mb: 12, display: 'flex', justifyContent: 'center' }}>
                <Pagination
                  count={products.products.totalPages}
                  page={parseInt(pageNumberValue) || 1}
                  onChange={handlePaginationChange}
                  sx={{
                    '& .MuiPaginationItem-root': {
                      fontFamily: 'serif',
                      fontWeight: 700,
                      color: '#3c7399',
                      '&.Mui-selected': {
                        bgcolor: '#3c7399',
                        color: 'white',
                        '&:hover': { bgcolor: '#334155' }
                      }
                    }
                  }}
                />
              </Box>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Filter Sheet */}
      <Transition.Root show={mobileFiltersOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[100] lg:hidden" onClose={setMobileFiltersOpen}>
          <Transition.Child as={Fragment} enter="transition-opacity duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity duration-300" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          </Transition.Child>
          <div className="fixed inset-0 z-40 flex">
            <Transition.Child as={Fragment} enter="transition duration-400" enterFrom="translate-x-full" enterTo="translate-x-0" leave="transition duration-400" leaveFrom="translate-x-0" leaveTo="translate-x-full">
              <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col bg-white p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <Typography variant="h6" sx={{ fontFamily: "'Playfair Display', serif" }}>Filters</Typography>
                  <IconButton onClick={() => setMobileFiltersOpen(false)}><CloseIcon /></IconButton>
                </div>
                {/* Mobile Filters Content (Simplified version of desktop) */}
                <Box sx={{ overflowY: 'auto', flexGrow: 1 }}>
                  {/* Reuse Accordion components here if space permits, or simpler list */}
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 900, mb: 2 }}>Tap options to apply</Typography>
                  <Box sx={{ py: 2 }}>
                    {filters.map((section) => (
                      <Box key={section.id} sx={{ mb: 4 }}>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.5, color: '#3c7399', mb: 2 }}>
                          {section.name}
                        </Typography>
                        <div className="flex flex-wrap gap-2">
                          {section.options.map((option) => (
                            <Chip
                              key={option.value}
                              label={option.label}
                              onClick={() => handleFilters(option.value, section.id)}
                              variant={searchParams.get(section.id)?.split(',').includes(option.value) ? "filled" : "outlined"}
                              sx={{
                                borderRadius: '8px',
                                bgcolor: searchParams.get(section.id)?.split(',').includes(option.value) ? '#3c7399' : 'transparent',
                                color: searchParams.get(section.id)?.split(',').includes(option.value) ? 'white' : '#64748b',
                                '&:hover': { bgcolor: searchParams.get(section.id)?.split(',').includes(option.value) ? '#2b526d' : '#f1f5f9' }
                              }}
                            />
                          ))}
                        </div>
                      </Box>
                    ))}
                  </Box>
                </Box>
                <Button fullWidth variant="contained" onClick={() => setMobileFiltersOpen(false)} sx={{ bgcolor: '#3c7399', mt: 4, py: 1.5 }}>Apply Filters</Button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
