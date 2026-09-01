import React, { useState, useEffect } from "react";
import { Link, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingBag,
  PlusSquare,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Search,
  Bell,
  Calendar,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Menu as MenuIcon
} from "lucide-react";
import {
  useMediaQuery,
  useTheme,
  Avatar,
  Box,
  CssBaseline,
  Tooltip,
  IconButton,
  Typography,
  Badge,
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon,
  Drawer
} from "@mui/material";

import ProductsTable from "./components/ProductsTable";
import CustomersTable from "./components/CustomersTable";
import OrdersTable from "./components/OrdersTable";
import CreateProductForm from "./components/CreateProductForm";
import EditProductForm from "./components/EditProductForm";
import AdminDashboard from "./components/AdminDashboard";
import SparkleVideoManager from "./components/SparkleVideoManager";
import GoldPriceBadge from "./components/GoldPriceBadge";
import { getOrders } from "../state/admin/order/Action";

const menu = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { name: "Orders", path: "/admin/orders", icon: ShoppingBag },
  { name: "Products", path: "/admin/products", icon: Package },
  { name: "Customers", path: "/admin/customers", icon: Users },
  { name: "Add Product", path: "/admin/product/create", icon: PlusSquare },
  { name: "Sparkle Videos", path: "/admin/sparkle-videos", icon: MessageCircle },
];

const Admin = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [collapsed, setCollapsed] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState({});
  const [anchorElNotify, setAnchorElNotify] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { auth, adminOrder } = useSelector(store => store);

  useEffect(() => {
    dispatch(getOrders());
    const interval = setInterval(() => dispatch(getOrders()), 300000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const handleOpenNotify = (event) => setAnchorElNotify(event.currentTarget);
  const handleCloseNotify = () => setAnchorElNotify(null);

  const toggleSubMenu = (name) => {
    setOpenSubMenus(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleMenuClick = (item) => {
    if (item.hasSub) {
      toggleSubMenu(item.name);
    } else {
      navigate(item.path);
      if (isMobile) setCollapsed(true);
    }
  };

  const activeCollapsed = isMobile ? collapsed : (collapsed && !isHovered);
  const drawerWidth = isMobile ? (collapsed ? 0 : 280) : (activeCollapsed ? 80 : 280);
  const contentMargin = isMobile ? 0 : (collapsed ? 80 : 280);
  const recentOrders = adminOrder?.orders?.slice(0, 5) || [];
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <CssBaseline />

      {/* Sidebar - Hover to Expand Rail */}
      <Drawer
        variant="permanent"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: activeCollapsed ? 80 : 280,
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            overflowX: 'hidden',
            bgcolor: 'white',
            color: '#1e293b',
            borderRight: '1px solid rgba(0,0,0,0.05)',
            boxShadow: '4px 0 20px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column'
          },
        }}
      >
        {/* Logo Section */}
        <Box sx={{
          p: 2,
          height: '120px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: activeCollapsed ? 'center' : 'flex-start',
          px: activeCollapsed ? 0 : 3,
          transition: 'all 0.3s',
          position: 'relative'
        }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: activeCollapsed ? 'center' : 'flex-start', width: '100%', overflow: 'hidden' }}>
              <img 
                src="/Loupe-logo.png" 
                alt="Loupe Logo" 
                style={{ 
                  height: activeCollapsed ? '50px' : '85px', 
                  width: 'auto',
                  maxWidth: activeCollapsed ? '70px' : '240px',
                  objectFit: 'contain',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  filter: 'brightness(0) saturate(100%) invert(20%) sepia(10%) saturate(1500%) hue-rotate(245deg) brightness(95%) contrast(90%)'
                }} 
              />
            </Box>
          </Link>

          {/* Perfected Toggle Button - Re-added for Hybrid Control */}
          {!isMobile && (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                setCollapsed(!collapsed);
              }}
              sx={{
                position: 'absolute',
                right: 0,
                bgcolor: '#3c7399',
                color: 'white',
                width: 28,
                height: 28,
                boxShadow: '0 4px 10px rgba(151, 194, 213, 0.3)',
                '&:hover': {
                  bgcolor: '#7ea9bd',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: 10,
                border: '2px solid white',
                display: activeCollapsed ? 'none' : 'flex'
              }}
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </IconButton>
          )}
        </Box>

        {/* Menu Items */}
        <Box sx={{ flexGrow: 1, px: 2, mt: 2, overflowY: 'auto' }}>
          {menu.map((item) => {
            const isActive = location.pathname === item.path;
            const isSubOpen = openSubMenus[item.name];
            const Icon = item.icon;

            return (
              <Box key={item.name} sx={{ mb: 1 }}>
                <Tooltip title={activeCollapsed ? item.name : ""} placement="right">
                  <Box
                    onClick={() => handleMenuClick(item)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 1.8,
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      bgcolor: isActive ? '#e0f2f1' : 'transparent',
                      color: isActive ? '#3c7399' : '#64748b',
                      '&:hover': {
                        bgcolor: isActive ? '#e0f2f1' : '#f8f9fa',
                        color: isActive ? '#3c7399' : '#111827',
                        transform: 'translateX(4px)'
                      }
                    }}
                  >
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                    {!activeCollapsed && (
                      <>
                        <Typography sx={{ ml: 2, fontWeight: isActive ? 700 : 500, fontSize: '0.9rem', flexGrow: 1 }}>
                          {item.name}
                        </Typography>
                        {item.hasSub && (isSubOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                      </>
                    )}
                  </Box>
                </Tooltip>

                {!activeCollapsed && item.hasSub && isSubOpen && (
                  <Box sx={{ mt: 1, ml: 4, borderLeft: '2px solid #f1f5f9' }}>
                    {item.subItems.map((sub) => (
                      <Box
                        key={sub.name}
                        onClick={() => navigate(sub.path)}
                        sx={{
                          p: 1.5,
                          pl: 3,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          color: '#94a3b8',
                          fontSize: '0.85rem',
                          fontWeight: 500,
                          transition: 'all 0.2s',
                          '&:hover': { color: '#3c7399', bgcolor: '#f0f9ff' }
                        }}
                      >
                        {sub.name}
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      </Drawer>

      {/* Main Content Area */}
      <Box sx={{
        flexGrow: 1,
        ml: { xs: '80px', md: `${contentMargin}px` },
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        minWidth: 0,
        pt: '100px'
      }}>
        <Box sx={{
          height: '100px',
          bgcolor: 'white',
          px: { xs: 2, md: 6 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #f1f5f9',
          position: 'fixed',
          top: 0,
          right: 0,
          left: { xs: '80px', md: `${contentMargin}px` },
          zIndex: 1100,
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          <Box />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#64748b' }}>
              <Calendar size={18} />
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>{currentDate}</Typography>
            </Box>

            {/* Live Gold Price compact pill */}
            <GoldPriceBadge />

            <IconButton onClick={handleOpenNotify} sx={{ bgcolor: '#f8fafc', p: 1.5 }}>
              <Badge badgeContent={recentOrders.length} color="primary" overlap="circular" sx={{ '& .MuiBadge-badge': { bgcolor: '#3c7399' } }}>
                <Bell size={20} />
              </Badge>
            </IconButton>

            <Menu
              anchorEl={anchorElNotify}
              open={Boolean(anchorElNotify)}
              onClose={handleCloseNotify}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  borderRadius: '16px',
                  width: 340,
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                  border: '1px solid #f1f5f9'
                }
              }}
            >
              <Box sx={{ p: 2, borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                  Notifications
                </Typography>
                {recentOrders.length > 0 && (
                  <Typography variant="caption" sx={{ bgcolor: '#e0f2fe', color: '#0369a1', fontWeight: 800, px: 1.2, py: 0.3, borderRadius: '10px' }}>
                    {recentOrders.length} New
                  </Typography>
                )}
              </Box>
              {recentOrders.map((order) => (
                <MenuItem key={order._id} onClick={() => { navigate('/admin/orders'); handleCloseNotify(); }} sx={{ py: 1.8, px: 2 }}>
                  <ListItemIcon sx={{ minWidth: 44 }}>
                    <Avatar sx={{ width: 36, height: 36, bgcolor: '#f0f9ff', color: '#3c7399', border: '1px solid #e0f2fe' }}>
                      <ShoppingBag size={18} />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                        Order #{order._id?.slice(-6).toUpperCase()}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.3, fontWeight: 600 }}>
                        ₹{Number(order.totalPrice || 0).toLocaleString('en-IN')} • {order.user?.firstName || 'Customer'} {order.user?.lastName || ''}
                      </Typography>
                    }
                  />
                </MenuItem>
              ))}
              {recentOrders.length === 0 && (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 600 }}>No new notifications</Typography>
                </Box>
              )}
            </Menu>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ textAlign: 'right' }}>
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 800, color: '#111827' }}>{auth.user?.firstName} {auth.user?.lastName}</Typography>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Administrator</Typography>
              </Box>
              <Avatar sx={{ width: 45, height: 45, borderRadius: '12px', bgcolor: '#3c7399' }}>
                {auth.user?.firstName?.charAt(0)}
              </Avatar>
            </Box>
          </Box>
        </Box>

        <Box sx={{ p: { xs: 2, md: 6 }, overflowX: 'hidden' }}>
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/products" element={<ProductsTable />} />
            <Route path="/customers" element={<CustomersTable />} />
            <Route path="/orders" element={<OrdersTable />} />
            <Route path="/product/create" element={<CreateProductForm />} />
            <Route path="/product/edit/:productId" element={<EditProductForm />} />
            <Route path="/sparkle-videos" element={<SparkleVideoManager />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default Admin;
