import { Fragment, useContext, useEffect, useState } from "react";
import { Dialog, Popover, Tab, Transition } from "@headlessui/react";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import { Badge, Box, Button, Drawer, Typography, IconButton, Menu, MenuItem, InputBase, Backdrop, Divider, ListItemIcon, ListItemText } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import AuthModel from "../../auth/AuthModel";
import { getUser, logout } from "../../../state/auth/Action";
import { useDispatch, useSelector } from "react-redux";
import { ModalContext } from "../../../context/modal/modalContext";
import { getCart, removeCartItem } from "../../../state/cart/Action";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { formatPriceINR } from "../../../utils/price";

// Per-category featured images — vivid, high-contrast jewellery photos
const categoryFeaturedImages = {
  rings: {
    src: "https://img.magnific.com/premium-photo/elegant-solitaire-diamond-engagement-ring-light-blue-background_1091925-30235.jpg",
    label: "Ring Collections",
    tagline: "Crafted for eternal moments"
  },
  earrings: {
    src: "/lifestyle/lifestyle_earrings.jpg",
    label: "Earring Collections",
    tagline: "Statement pieces, effortlessly elegant"
  },
  bracelets: {
    src: "https://tyaani.com/cdn/shop/files/OB260125PBR-00916_YG-FlatlayMs.jpg?format=webp&v=1779175364&width=500",
    label: "Bracelet Collections",
    tagline: "Adorn every wrist with grace"
  },
  necklaces: {
    src: "/lifestyle/lifestyle_necklace.jpg",
    label: "Necklace Collections",
    tagline: "Drape yourself in timeless beauty"
  },
  "best-seller": {
    src: "/Occasion/Bridal Collection.png",
    label: "Best Sellers",
    tagline: "Loved by thousands worldwide"
  },
};

const navigation = {
  categories: [
    {
      id: "rings",
      name: "Rings",
      sections: [
        {
          id: "style",
          name: "Shop by Style",
          items: [
            { name: "Engagement Rings", id: "engagement-ring" },
            { name: "Solitaire Rings", id: "solitaire-ring" },
            { name: "Diamond Rings", id: "diamond-ring" },
            { name: "Eternity Rings", id: "eternity-ring" },
            { name: "Halo Rings", id: "halo-ring" },
            { name: "Daily Wear Rings", id: "daily-wear-ring" },
          ],
        },
        {
          id: "metal",
          name: "Shop by Metal",
          items: [
            { name: "Yellow Gold", id: "yellow-gold" },
            { name: "Rose Gold", id: "rose-gold" },
            { name: "Sterling Silver", id: "silver" },
          ],
        },
        {
          id: "collections",
          name: "Collections",
          items: [
            { name: "Signature Loupe", id: "signature" },
            { name: "Vintage Inspired", id: "vintage" },
            { name: "Modern Minimalist", id: "modern" },
            { name: "Art Deco", id: "art-deco" },
          ],
        },
      ],
    },
    {
      id: "earrings",
      name: "Earrings",
      sections: [
        {
          id: "type",
          name: "Shop by Type",
          items: [
            { name: "Diamond Studs", id: "diamond-studs" },
            { name: "Hoop & Huggies", id: "hoops-huggies" },
            { name: "Dangle & Drops", id: "dangle-drops" },
            { name: "Ear Climbers", id: "climbers" },
            { name: "Ear Cuffs", id: "cuffs" },
            { name: "Chandeliers", id: "chandeliers" },
          ],
        },
        {
          id: "stone",
          name: "Shop by Stone",
          items: [
            { name: "Diamond", id: "stone-diamond" },
            { name: "Pearl", id: "stone-pearl" },
            { name: "Ruby", id: "stone-ruby" },
            { name: "Sapphire", id: "stone-sapphire" },
            { name: "Emerald", id: "stone-emerald" },
          ],
        },
        {
          id: "occasion",
          name: "Occasion",
          items: [
            { name: "Daily Wear", id: "daily-earrings" },
            { name: "Bridal", id: "bridal-earrings" },
            { name: "Party Wear", id: "party-earrings" },
          ],
        },
      ],
    },
    {
      id: "bracelets",
      name: "Bracelets",
      sections: [
        {
          id: "style",
          name: "Shop by Style",
          items: [
            { name: "Tennis Bracelets", id: "tennis-bracelets" },
            { name: "Bangles", id: "bangles" },
            { name: "Chain Bracelets", id: "chain-bracelets" },
            { name: "Cuffs", id: "cuffs" },
            { name: "Charm Bracelets", id: "charms" },
            { name: "Anklets", id: "anklets" },
          ],
        },
        {
          id: "metal",
          name: "Shop by Metal",
          items: [
            { name: "18K Gold", id: "18k-gold" },
            { name: "14K Gold", id: "14k-gold" },
            { name: "Silver", id: "silver-bracelets" },
          ],
        },
        {
          id: "collections",
          name: "Collections",
          items: [
            { name: "Signature Loupe", id: "signature" },
            { name: "Vintage Inspired", id: "vintage" },
          ],
        },
      ],
    },
    {
      id: "necklaces",
      name: "Necklaces",
      sections: [
        {
          id: "style",
          name: "Shop by Style",
          items: [
            { name: "Diamond Necklaces", id: "diamond-necklace" },
            { name: "Pendant Necklaces", id: "pendant-necklace" },
            { name: "Diamond Pendants", id: "diamond-pendant" },
            { name: "Solitaire Pendants", id: "solitaire-pendant" },
            { name: "Tennis Necklaces", id: "tennis-necklace" },
            { name: "Choker Necklaces", id: "choker-necklace" },
          ],
        },
        {
          id: "collection",
          name: "Collections",
          items: [
            { name: "Bridal Suite", id: "bridal-necklaces" },
            { name: "Layered Looks", id: "layered" },
            { name: "Initial & Charms", id: "initial-charms" },
          ],
        },
      ],
    },
    {
      id: "best-seller",
      name: "Best Seller",
      sections: [
        {
          id: "trending",
          name: "Trending Now",
          items: [
            { name: "Top 10 Picks", id: "top-10" },
            { name: "New Arrivals", id: "new-arrivals" },
            { name: "Celebrity Choices", id: "celeb-choices" },
            { name: "Instagram Favorites", id: "insta-favs" },
          ],
        },
        {
          id: "gifts",
          name: "Gift Guide",
          items: [
            { name: "Gifts for Her", id: "gifts-her" },
            { name: "Gifts for Him", id: "gifts-him" },
            { name: "Gifts Under $500", id: "gifts-500" },
            { name: "Anniversary Gifts", id: "anniversary" },
          ],
        },
      ],
    },
  ],
  pages: [],
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const modal = useContext(ModalContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [countryAnchorEl, setCountryAnchorEl] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState({ name: 'INDIA', code: 'IN', currency: 'INR ₹', flag: '🇮🇳' });
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { auth, cart } = useSelector((store) => store);

  useEffect(() => {
    if (jwt) {
      dispatch(getUser(jwt));
      dispatch(getCart());
    }
  }, [jwt, auth.jwt]);

  const handleRemoveCartItem = (cartItemId) => {
    dispatch(removeCartItem(cartItemId));
  };

  useEffect(() => {
    if (cartOpen && jwt) {
      dispatch(getCart());
    }
  }, [cartOpen, jwt]);

  useEffect(() => {
    if (jwt) {
      dispatch(getCart());
    }
  }, [cart.deleteCartItem]);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const handleCategoryClick = (category, section, item, close) => {
    navigate(`/${category.id}/${section.id}/${item.id}`);
    close();
  };

  const handleOpen = (e, authMode) => {
    e.preventDefault();
    navigate(`/${authMode}`);
    modal.openModal();
  };

  const handleClose = () => {
    navigate("/home1");
    modal.closeModal();
  };

  const handleLogout = () => {
    dispatch(logout());
    modal.closeModal();
    window.location.reload();
  };

  const handleCountryOpen = (event) => setCountryAnchorEl(event.currentTarget);
  const handleCountryClose = () => setCountryAnchorEl(null);
  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    handleCountryClose();
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/all-jewellery/all/jewellery?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <div>
      {/* Mobile menu */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-[60] lg:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-500 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-400 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-[85vw] flex-col overflow-y-auto bg-white pb-12 shadow-2xl no-scrollbar">
                {/* 1. Editorial Header Bar */}
                <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-5 bg-white border-b border-gray-100">
                  <Link to="/" onClick={() => setOpen(false)}>
                    <img
                      src="/Loupe_Jeweler-logo.png"
                      alt="Loupe Jeweler"
                      className="h-10 w-auto object-contain"
                      style={{ filter: 'brightness(0)' }}
                    />
                  </Link>
                  <IconButton onClick={() => setOpen(false)} sx={{ color: '#3c7399' }}>
                    <CloseIcon sx={{ fontSize: 22 }} />
                  </IconButton>
                </div>

                {/* 2. Premium User Profile Section */}
                <Box sx={{ p: 4, bgcolor: '#fafafa' }}>
                  {!auth.user ? (
                    <Box>
                      <Typography sx={{ fontSize: '1.4rem', fontWeight: 300, fontFamily: "'Playfair Display', serif", color: '#3c7399', mb: 1 }}>
                        The Boutique
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: '#64748b', mb: 3, letterSpacing: 0.5, lineHeight: 1.6 }}>
                        Log in to access your exclusive jewelry collections and saved designs.
                      </Typography>
                      <Button
                        onClick={(e) => { handleOpen(e, "login"); setOpen(false); }}
                        fullWidth
                        variant="contained"
                        sx={{ bgcolor: '#3c7399', color: 'white', py: 1.5, fontSize: '0.8rem', fontWeight: 800, borderRadius: '8px', textTransform: 'uppercase', letterSpacing: 1 }}
                      >
                        Sign In
                      </Button>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                      <div className="w-16 h-16 rounded-full bg-[#3c7399] flex items-center justify-center text-white text-2xl font-serif">
                        {auth.user.firstName?.[0]}
                      </div>
                      <Box>
                        <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#3c7399', fontFamily: "'Playfair Display', serif" }}>
                          Hello, {auth.user.firstName}
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: '#64748b', mb: 0.8 }}>
                          Loupe Circle Member
                        </Typography>
                        <Typography
                          onClick={() => { navigate("/user-details/?layout=0"); setOpen(false); }}
                          sx={{ fontSize: '0.7rem', color: '#3c7399', cursor: 'pointer', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.5 }}
                        >
                          My Dashboard
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>

                {/* 3. Boutique Category List */}
                <Box sx={{ py: 4 }}>
                  <Typography sx={{ px: 4, mb: 2, fontSize: '0.65rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 2 }}>
                    Collections
                  </Typography>
                  {navigation.categories.map((category) => (
                    <div key={category.id} className="border-b border-gray-50 last:border-0">
                      <div
                        className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50 transition-all"
                        onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                      >
                        <Typography
                          sx={{
                            fontSize: '0.95rem',
                            fontWeight: expandedCategory === category.id ? 700 : 400,
                            fontFamily: "'Playfair Display', serif",
                            color: expandedCategory === category.id ? '#3c7399' : '#3c7399',
                            letterSpacing: 0.5
                          }}
                        >
                          {category.name}
                        </Typography>
                        <KeyboardArrowDownIcon
                          sx={{
                            fontSize: 18,
                            color: expandedCategory === category.id ? '#3c7399' : '#94a3b8',
                            transition: 'transform 0.3s',
                            transform: expandedCategory === category.id ? 'rotate(0deg)' : 'rotate(-90deg)'
                          }}
                        />
                      </div>

                      {/* Dropdown Content */}
                      <Transition
                        show={expandedCategory === category.id}
                        enter="transition-all duration-300 ease-out"
                        enterFrom="max-h-0 opacity-0"
                        enterTo="max-h-[1000px] opacity-100"
                        leave="transition-all duration-200 ease-in"
                        leaveFrom="max-h-[1000px] opacity-100"
                        leaveTo="max-h-0 opacity-0"
                        className="overflow-hidden bg-gray-50/50"
                      >
                        <div className="px-8 pb-4">
                          {category.sections.map((section) => (
                            <div key={section.id} className="py-2">
                              <div
                                className="flex items-center justify-between py-2 cursor-pointer"
                                onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                              >
                                <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: 1 }}>
                                  {section.name}
                                </Typography>
                                <KeyboardArrowDownIcon sx={{ fontSize: 16, color: '#94a3b8', transform: expandedSection === section.id ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                              </div>

                              {expandedSection === section.id && (
                                <ul className="pl-2 mt-1 space-y-2 border-l-2 border-gray-200">
                                  {section.items.map((item) => (
                                    <li
                                      key={item.id}
                                      className="py-1 text-[0.85rem] text-gray-500 hover:text-[#3c7399] cursor-pointer"
                                      onClick={() => {
                                        handleCategoryClick(category, section, item, () => { setOpen(false); setExpandedCategory(null); setExpandedSection(null); });
                                      }}
                                    >
                                      {item.name}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      </Transition>
                    </div>
                  ))}

                  <div className="mt-8 px-6 py-4 mx-4 bg-[#f1f5f9] rounded-xl">
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: '#3c7399', mb: 1 }}>Concierge Service</Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: '#64748b', mb: 2 }}>Need help finding the perfect gift?</Typography>
                    <p className="text-[0.75rem] font-black text-[#3c7399] uppercase tracking-widest cursor-pointer">Chat With Us</p>
                  </div>
                </Box>

                {/* 4. Luxury Utility Bar */}
                <Box sx={{ mt: 'auto', p: 4, bgcolor: '#fff', borderTop: '1px solid #eee' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <div className="flex items-center gap-2" onClick={handleCountryOpen}>
                      <span className="text-xl">{selectedCountry.flag}</span>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#3c7399' }}>{selectedCountry.name} (INR)</Typography>
                    </div>
                    {auth.user && (
                      <Typography
                        onClick={handleLogout}
                        sx={{ fontSize: '0.7rem', fontWeight: 900, color: '#ef4444', textTransform: 'uppercase', letterSpacing: 1 }}
                      >
                        Logout
                      </Typography>
                    )}
                  </Box>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.6rem', letterSpacing: 1 }}>
                    © 2024 LOUPE JEWELER - FLAGSHIP STORE
                  </Typography>
                </Box>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <header className="relative z-50 w-full shadow-md" style={{ backgroundColor: '#a9cee5', color: '#1e3545' }}>
        {/* Premium Top Announcement / Notice Bar */}
        <div
          className="w-full py-1.5 px-4 text-[0.75rem] font-medium tracking-wider border-b border-white/5"
          style={{
            backgroundColor: '#152635',
            color: '#ebd69d'
          }}
        >
          {/* eslint-disable-next-line jsx-a11y/no-distracting-elements */}
          <marquee behavior="scroll" direction="left" scrollamount="4" style={{ verticalAlign: 'middle' }}>
            <span className="inline-flex items-center mx-12">
              <span className="mr-2">✨</span>
              <strong>Notice : </strong> &nbsp; Product delivered in 10-15 Days.
            </span>
            <span className="inline-flex items-center mx-12">
              <span className="mr-2">💎</span>
              <strong>Trust : </strong> 100% Certified Original & Hallmarked Jewellery
            </span>
            <span className="inline-flex items-center mx-12">
              <span className="mr-2">🛡️</span>
              <strong>Assurance : </strong> Secure Insured Shipping Worldwide & Easy Returns
            </span>
          </marquee>
        </div>

        <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-18 lg:h-20 items-center justify-between">

            {/* Left: Logo & Toggle */}
            <div className="flex items-center">
              <IconButton
                onClick={() => setOpen(true)}
                sx={{
                  display: { xs: 'flex', lg: 'none' },
                  color: '#1e3545',
                  ml: -1,
                  '&:hover': { bgcolor: 'rgba(30,53,69,0.08)' }
                }}
              >
                <MenuIcon sx={{ fontSize: 28 }} />
              </IconButton>
              <Link to="/home1" className="flex items-center ml-1 lg:ml-0">
                <img
                  src="/Loupe-logo.png"
                  alt="Loupe Jeweler"
                  className="h-[180px] sm:h-[220px] lg:h-[260px] w-auto object-contain transition-all duration-300"
                  style={{ filter: 'brightness(0)' }}
                />
              </Link>
            </div>

            {/* Center: Nav or Search */}
            <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center px-10">
              {!searchOpen ? (
                <Popover.Group className="flex space-x-8">
                  {navigation.categories.map((category, index) => (
                    <Popover
                      key={`${category.name}-${index}`}
                      className="flex"
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      {({ close }) => (
                        <>
                          <Popover.Button className={classNames(hoveredIndex === index ? "border-[#1e3545] font-bold" : "border-transparent", "z-10 flex items-center text-[0.8rem] tracking-widest uppercase text-[#1e3545] outline-none border-b-2 transition-all pb-1")}>
                            {category.name}
                          </Popover.Button>
                          <Transition
                            show={hoveredIndex === index}
                            as={Fragment}
                            enter="transition ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 scale-95"
                            enterTo="opacity-100 translate-y-0 scale-100"
                            leave="transition ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 scale-100"
                            leaveTo="opacity-0 translate-y-4 scale-95"
                          >
                            <Popover.Panel static className="absolute left-1/2 -translate-x-1/2 top-full z-20 mt-0 w-max min-w-[820px] xl:min-w-[960px] max-w-[96vw] text-sm text-gray-700 shadow-[0_32px_80px_rgba(0,0,0,0.14)] bg-white border border-gray-100 rounded-b-2xl overflow-hidden">
                              <div className="flex">
                                {/* Left Content: Navigation Grid */}
                                <div className="flex-1 bg-white px-10 py-10 border-r border-gray-100">
                                  {/* Category header */}
                                  <div className="flex items-center gap-3 mb-8">
                                    <span className="block w-6 h-[2px] bg-[#3c7399]" />
                                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 2 }}>
                                      {category.name} — Browse by
                                    </Typography>
                                  </div>
                                  <div className="grid grid-cols-3 gap-x-10 gap-y-8">
                                    {category.sections.map((section) => (
                                      <div key={section.id} className="min-w-[140px]">
                                        <Typography sx={{
                                          fontFamily: "'Playfair Display', serif",
                                          fontWeight: 700,
                                          fontSize: '0.88rem',
                                          color: '#1e3545',
                                          mb: 2.5,
                                          pb: 1,
                                          borderBottom: '2px solid #a9cee5'
                                        }}>
                                          {section.name}
                                        </Typography>
                                        <ul className="space-y-2.5">
                                          {section.items.map((item) => (
                                            <li key={item.id}>
                                              <p
                                                onClick={() => handleCategoryClick(category, section, item, () => { close(); setHoveredIndex(null); })}
                                                className="text-gray-500 hover:text-[#3c7399] cursor-pointer group flex items-center gap-1.5 transition-all duration-200 text-[0.79rem] font-medium tracking-wide"
                                              >
                                                <span className="block w-0 group-hover:w-3 h-[1.5px] bg-[#3c7399] transition-all duration-200 flex-shrink-0" />
                                                {item.name}
                                              </p>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    ))}
                                  </div>
                                  {/* Bottom CTA */}
                                  <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                                    <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8', letterSpacing: 0.5 }}>
                                      Explore the full {category.name} collection
                                    </Typography>
                                    <Button
                                      onClick={() => { navigate(`/${category.id}`); close(); setHoveredIndex(null); }}
                                      variant="text"
                                      sx={{
                                        color: '#3c7399', fontSize: '0.7rem', fontWeight: 900, letterSpacing: 1.5,
                                        textTransform: 'uppercase', p: 0, minWidth: 0,
                                        '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                                      }}
                                    >
                                      View All →
                                    </Button>
                                  </div>
                                </div>

                                {/* Right Content: Immersive Hero Image Card */}
                                <div className="w-[270px] xl:w-[300px] relative overflow-hidden flex-shrink-0" style={{ minHeight: '360px' }}>
                                  {/* Background Image — full vivid display */}
                                  <img
                                    src={categoryFeaturedImages[category.id]?.src || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=700&q=90&fit=crop'}
                                    alt={`${category.name} Featured`}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out"
                                    style={{
                                      transform: hoveredIndex === index ? 'scale(1.07)' : 'scale(1)',
                                      filter: 'contrast(1.12) saturate(1.18) brightness(0.96)'
                                    }}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=700&q=90&fit=crop';
                                    }}
                                  />
                                  {/* Gradient Overlay — only bottom vignette, top is fully clear */}
                                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 38%, rgba(21,38,53,0.72) 75%, rgba(21,38,53,0.95) 100%)' }} />
                                  {/* Top tag */}
                                  <div className="absolute top-5 left-5">
                                    <span className="inline-block px-3 py-1 text-[0.6rem] font-black tracking-[0.18em] uppercase rounded-full" style={{ background: 'rgba(169,206,229,0.22)', backdropFilter: 'blur(8px)', border: '1px solid rgba(169,206,229,0.4)', color: '#a9cee5' }}>
                                      ✦ New Season
                                    </span>
                                  </div>
                                  {/* Bottom Content */}
                                  <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.15rem', color: '#ffffff', mb: 0.5, lineHeight: 1.3 }}>
                                      {categoryFeaturedImages[category.id]?.label || `The ${category.name} Edit`}
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.72)', mb: 2.5, letterSpacing: 0.5, lineHeight: 1.5 }}>
                                      {categoryFeaturedImages[category.id]?.tagline || 'Curated masterpieces handcrafted with precision.'}
                                    </Typography>
                                    <button
                                      onClick={() => { navigate(`/${category.id}`); close(); setHoveredIndex(null); }}
                                      className="inline-flex items-center gap-2 text-[0.68rem] font-black tracking-[0.18em] uppercase text-white border border-white/50 px-4 py-2 rounded-full hover:bg-white hover:text-[#1e3545] transition-all duration-300"
                                    >
                                      Discover All
                                      <span className="text-base leading-none">→</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </Popover.Panel>
                          </Transition>
                        </>
                      )}
                    </Popover>
                  ))}
                </Popover.Group>
              ) : (
                <div className="w-full max-w-xl animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="relative flex items-center border-b-2 border-[#1e3545]/70 py-1 group focus-within:border-[#1e3545] transition-all">
                    <InputBase
                      autoFocus
                      placeholder="Search for products..."
                      fullWidth
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleSearch}
                      sx={{
                        color: '#1e3545',
                        fontSize: '1.1rem',
                        fontFamily: 'serif',
                        '& input::placeholder': { color: '#1e3545', opacity: 0.7 }
                      }}
                    />
                    <IconButton onClick={() => setSearchOpen(false)} sx={{ color: '#1e3545', p: 0.5 }}>
                      <CloseIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Tools */}
            <div className="flex items-center space-x-3 sm:space-x-6">

              {/* Premium Country Selector */}
              <div
                className="hidden xl:flex items-center text-[#1e3545] text-[0.7rem] font-black cursor-pointer py-2 px-4 rounded-full hover:bg-[#1e3545]/10 transition-all border border-[#1e3545]/20 group"
                onClick={handleCountryOpen}
              >
                <span className="mr-2.5 text-lg filter drop-shadow-sm">{selectedCountry.flag}</span>
                <div className="flex flex-col items-start leading-tight">
                  <span className="uppercase tracking-[0.15em] opacity-80 text-[0.6rem]">Shipping to</span>
                  <span className="uppercase tracking-[0.1em] font-black">{selectedCountry.name} ({selectedCountry.currency.split(' ')[1] || selectedCountry.currency.split(' ')[0]})</span>
                </div>
                <KeyboardArrowDownIcon sx={{ fontSize: 18, ml: 1, opacity: 0.6, transition: 'transform 0.3s', transform: Boolean(countryAnchorEl) ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </div>

              <Menu
                anchorEl={countryAnchorEl}
                open={Boolean(countryAnchorEl)}
                onClose={handleCountryClose}
                elevation={0}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
                    borderRadius: '16px',
                    minWidth: '240px',
                    border: '1px solid #f1f5f9',
                    p: 1
                  }
                }}
              >
                <Box sx={{ px: 2, py: 1.5, mb: 1 }}>
                  <Typography sx={{ fontSize: '0.65rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1.5 }}>
                    Select Region & Currency
                  </Typography>
                </Box>

                <MenuItem
                  onClick={() => handleCountrySelect({ name: 'INDIA', code: 'IN', currency: 'INR ₹', flag: '🇮🇳' })}
                  sx={{
                    borderRadius: '10px',
                    py: 1.5,
                    mb: 0.5,
                    bgcolor: selectedCountry.code === 'IN' ? '#f8fafc' : 'transparent',
                    border: selectedCountry.code === 'IN' ? '1px solid #e2e8f0' : '1px solid transparent',
                    '&:hover': { bgcolor: '#f1f5f9' }
                  }}
                >
                  <span style={{ fontSize: '1.4rem', marginRight: '16px' }}>🇮🇳</span>
                  <ListItemText
                    primary="India"
                    secondary="Indian Rupee (₹)"
                    primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}
                    secondaryTypographyProps={{ fontSize: '0.75rem', color: '#64748b' }}
                  />
                  {selectedCountry.code === 'IN' && <div className="w-2 h-2 rounded-full bg-[#3c7399] ml-2" />}
                </MenuItem>

                <MenuItem
                  onClick={() => handleCountrySelect({ name: 'USA', code: 'US', currency: 'USD $', flag: '🇺🇸' })}
                  sx={{
                    borderRadius: '10px',
                    py: 1.5,
                    bgcolor: selectedCountry.code === 'US' ? '#f8fafc' : 'transparent',
                    border: selectedCountry.code === 'US' ? '1px solid #e2e8f0' : '1px solid transparent',
                    '&:hover': { bgcolor: '#f1f5f9' }
                  }}
                >
                  <span style={{ fontSize: '1.4rem', marginRight: '16px' }}>🇺🇸</span>
                  <ListItemText
                    primary="United States"
                    secondary="US Dollar ($)"
                    primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}
                    secondaryTypographyProps={{ fontSize: '0.75rem', color: '#64748b' }}
                  />
                  {selectedCountry.code === 'US' && <div className="w-2 h-2 rounded-full bg-[#3c7399] ml-2" />}
                </MenuItem>
              </Menu>

              {/* Profile */}
              <div className="relative cursor-pointer">
                <IconButton
                  onClick={handleProfileClick}
                  sx={{
                    color: '#1e3545',
                    p: 1,
                    '&:hover': { bgcolor: 'rgba(30, 53, 69, 0.08)' },
                    bgcolor: Boolean(anchorEl) ? 'rgba(30, 53, 69, 0.12)' : 'transparent'
                  }}
                >
                  <PermIdentityOutlinedIcon sx={{ width: "24px", height: "24px" }} />
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleProfileClose}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      minWidth: 220,
                      borderRadius: '12px',
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 10px 25px rgba(0,0,0,0.1))',
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  {!auth.user ? (
                    <div className="p-4 px-5">
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5, color: '#333' }}>Account</Typography>
                      <Typography variant="caption" sx={{ color: '#666', display: 'block', mb: 2 }}>Access your account or orders</Typography>
                      <div className="flex flex-col gap-2">
                        <Button
                          onClick={(e) => { handleOpen(e, "login"); handleProfileClose(); }}
                          variant="contained"
                          fullWidth
                          sx={{ bgcolor: '#3c7399', '&:hover': { bgcolor: '#2b526d' }, textTransform: 'none', fontWeight: 600, py: 1 }}
                        >
                          Log In
                        </Button>
                        <Button
                          onClick={(e) => { handleOpen(e, "register"); handleProfileClose(); }}
                          variant="text"
                          fullWidth
                          sx={{ color: '#3c7399', textTransform: 'none', fontWeight: 600 }}
                        >
                          Sign Up
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#3c7399] flex items-center justify-center text-white font-bold text-sm">
                          {auth.user.firstName?.[0]}
                        </div>
                        <div className="flex flex-col">
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#333' }}>{auth.user.firstName} {auth.user.lastName}</Typography>
                          <Typography variant="caption" sx={{ color: '#666' }}>{auth.user.email}</Typography>
                        </div>
                      </div>

                      <div className="py-1">
                        {auth.user.role === "ADMIN" && (
                          <MenuItem onClick={() => { navigate("/admin"); handleProfileClose(); }} sx={{ py: 1.2 }}>
                            <ListItemIcon><DashboardOutlinedIcon fontSize="small" /></ListItemIcon>
                            <ListItemText primary="Admin Dashboard" primaryTypographyProps={{ fontSize: '0.85rem' }} />
                          </MenuItem>
                        )}
                        <MenuItem onClick={() => { navigate("/user-details/?layout=0"); handleProfileClose(); }} sx={{ py: 1.2 }}>
                          <ListItemIcon><AccountCircleOutlinedIcon fontSize="small" /></ListItemIcon>
                          <ListItemText primary="My Account" primaryTypographyProps={{ fontSize: '0.85rem' }} />
                        </MenuItem>
                        <MenuItem onClick={() => { navigate("/user-details/?layout=2"); handleProfileClose(); }} sx={{ py: 1.2 }}>
                          <ListItemIcon><ShoppingBagOutlinedIcon fontSize="small" /></ListItemIcon>
                          <ListItemText primary="My Orders" primaryTypographyProps={{ fontSize: '0.85rem' }} />
                        </MenuItem>
                        <Divider sx={{ my: 1, opacity: 0.6 }} />
                        <MenuItem onClick={() => { handleLogout(); handleProfileClose(); }} sx={{ py: 1.2, color: '#ef4444' }}>
                          <ListItemIcon><LogoutOutlinedIcon fontSize="small" sx={{ color: '#ef4444' }} /></ListItemIcon>
                          <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 600 }} />
                        </MenuItem>
                      </div>
                    </>
                  )}
                </Menu>
              </div>

              {/* Search Toggle */}
              <IconButton onClick={() => setSearchOpen(!searchOpen)} sx={{ color: '#1e3545', p: 1 }}>
                <SearchIcon sx={{ width: "24px", height: "24px" }} />
              </IconButton>

              {/* Cart */}
              <IconButton onClick={() => setCartOpen(true)} sx={{ color: '#1e3545', p: 1 }}>
                <Badge badgeContent={cart.cart?.totalItem} sx={{ '& .MuiBadge-badge': { backgroundColor: '#1e3545', color: 'white', fontWeight: 'bold' } }}>
                  <AddShoppingCartIcon sx={{ width: "23px", height: "23px" }} />
                </Badge>
              </IconButton>

            </div>
          </div>
        </div>
      </header>


      {/* Cart Drawer */}
      <Drawer
        anchor="right"
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 400 },
            p: 0,
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
        <Box sx={{ p: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f8fafc' }}>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5 }}>
            <Typography variant="h5" sx={{ fontWeight: 300, color: '#3c7399', fontFamily: "'Playfair Display', serif", letterSpacing: 1 }}>Your Collection</Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>({cart.cart?.totalItem || 0})</Typography>
          </Box>
          <IconButton onClick={() => setCartOpen(false)} sx={{ color: '#94a3b8', '&:hover': { color: '#3c7399', bgcolor: '#f8fafc' } }}><CloseIcon sx={{ fontSize: 20 }} /></IconButton>
        </Box>

        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 4, bgcolor: '#fcfcfc' }}>
          {cart.cart?.cartItems?.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {cart.cart.cartItems.map((item) => (
                <Box key={item._id} sx={{ display: 'flex', gap: 3, position: 'relative' }}>
                  <Box sx={{ width: 100, height: 130, borderRadius: '16px', overflow: 'hidden', flexShrink: 0, bgcolor: '#fff', border: '1px solid #f1f5f9', boxShadow: '0 10px 20px rgba(0,0,0,0.02)' }}>
                    <img
                      src={item.product?.imageUrls?.[0]?.imageUrl}
                      alt={item.product?.title}
                      className="w-full h-full object-cover"
                    />
                  </Box>
                  <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', pt: 1 }}>
                    <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: '#3c7399', mb: 0.5, lineHeight: 1.4, fontFamily: "'Playfair Display', serif" }}>
                      {item.product?.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8', mb: 2, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                      QUANTITY: {item.quantity} {item.weight ? `| ${item.weight} G` : ''} {item.size ? `| ${item.size} MM` : ''}
                    </Typography>
                    <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <Typography sx={{ fontWeight: 900, color: '#3c7399', fontSize: '1.1rem', fontFamily: "'Outfit', sans-serif" }}>
                        ₹{formatPriceINR(item.discountedPrice)}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveCartItem(item._id)}
                        sx={{ color: '#cbd5e1', '&:hover': { color: '#ef4444' } }}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-20 px-6">
              <Box sx={{ width: 80, height: 80, borderRadius: '50%', bgcolor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
                <ShoppingBagOutlinedIcon sx={{ fontSize: 32, color: '#cbd5e1' }} />
              </Box>
              <Typography sx={{ fontSize: '1.4rem', fontFamily: "'Playfair Display', serif", color: '#3c7399', mb: 1.5 }}>Your bag is empty</Typography>
              <Typography sx={{ fontSize: '0.85rem', color: '#94a3b8', mb: 5, lineHeight: 1.6 }}>Discover our exclusive collections and find the perfect piece to start your collection.</Typography>
              <Button
                variant="contained"
                onClick={() => setCartOpen(false)}
                sx={{
                  px: 6, py: 1.8, borderRadius: '12px', textTransform: 'uppercase',
                  bgcolor: '#3c7399', color: 'white', fontWeight: 800, letterSpacing: 2, fontSize: '0.75rem',
                  '&:hover': { bgcolor: '#543b59', transform: 'translateY(-2px)' },
                  transition: 'all 0.3s'
                }}
              >
                Explore Boutique
              </Button>
            </div>
          )}
        </Box>

        {cart.cart?.cartItems?.length > 0 && (
          <Box sx={{ p: 4, borderTop: '1px solid #f1f5f9', bgcolor: 'white' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 2 }}>Subtotal</Typography>
              <Typography sx={{ fontSize: '1.2rem', fontWeight: 900, color: '#3c7399', fontFamily: "'Outfit', sans-serif" }}>₹{formatPriceINR(cart.cart?.totalPrice)}</Typography>
            </Box>
            <Button
              fullWidth
              variant="contained"
              onClick={() => { navigate('/checkout'); setCartOpen(false); }}
              sx={{
                py: 2.2, borderRadius: '14px', bgcolor: '#3c7399', color: 'white', fontWeight: 900, fontSize: '0.85rem', letterSpacing: 2, textTransform: 'uppercase',
                '&:hover': { bgcolor: '#2b526d' }
              }}
            >
              Proceed to Checkout
            </Button>
            <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 2, color: '#94a3b8' }}>
              Complimentary shipping and premium gift wrap included.
            </Typography>
          </Box>
        )}
      </Drawer>

      <AuthModel handleClose={() => modal.closeModal()} open={modal.state} />
    </div>
  );
}
