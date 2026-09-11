import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  AvatarGroup,
  Button,
  Card,
  CardHeader,
  Divider,
  Menu,
  MenuItem,
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  TextField
} from "@mui/material";
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from "react-redux";
import {
  ChevronDown,
  CheckCircle2,
  Truck,
  ThumbsUp,
  Trash2,
  Clock,
  Eye,
  User,
  MapPin,
  Package,
  Info
} from "lucide-react";

import { motion } from "framer-motion";
import { store } from "../../state/store";
import { confirmedOrder, deleteOrder, deliveredOrder, getOrders, shippedOrder } from '../../state/admin/order/Action';

const statusConfig = {
  PLACED: { label: 'Placed', color: 'info', icon: Clock },
  CONFIRMED: { label: 'Confirmed', color: 'success', icon: ThumbsUp },
  SHIPPED: { label: 'Shipped', color: 'primary', icon: Truck },
  DELIVERED: { label: 'Delivered', color: 'secondary', icon: CheckCircle2 },
  PENDING: { label: 'Pending', color: 'warning', icon: Clock },
};

const OrdersTable = () => {
  const [anchorEl, setAnchorEl] = React.useState({});
  const [orderToDelete, setOrderToDelete] = React.useState(null);
  const [deleteReason, setDeleteReason] = React.useState("");
  const [selectedOrder, setSelectedOrder] = React.useState(null);
  const handleClick = (event, id) => {
    setAnchorEl({ ...anchorEl, [id]: event.currentTarget });
  };

  const handleClose = (id) => {
    setAnchorEl({ ...anchorEl, [id]: null });
  };

  const handleDeleteOrder = () => {
    if (orderToDelete) {
      dispatch(deleteOrder(orderToDelete, deleteReason))
        .then(() => {
          toast.success("Order deleted successfully!");
          setDeleteReason("");
        })
        .catch(() => toast.error("Failed to delete order."));
      setOrderToDelete(null);
    }
  };

  useEffect(() => {
    dispatch(getOrders());
  }, [adminOrder.confirmed, adminOrder.shipped, adminOrder.delivered, adminOrder.deletedOrder]);

  const handleStatusUpdate = (handler, orderId, id) => {
    dispatch(handler(orderId))
      .then(() => toast.success("Order status updated!"))
      .catch(() => toast.error("Status update failed."));
    handleClose(id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <CardHeader
          title="Customer Orders"
          subheader={`Total ${adminOrder.orders?.length || 0} orders received`}
          titleTypographyProps={{ fontWeight: 800 }}
        />
        <Divider />
        <TableContainer sx={{ overflowX: 'auto', width: '100%' }}>
          <Table sx={{ minWidth: 900 }}>
            <TableHead sx={{ bgcolor: 'var(--bg-premium)' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Items</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Total Price</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">Update Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {adminOrder.orders?.map((item) => {
                const status = statusConfig[item.orderStatus] || { label: item.orderStatus, color: 'default', icon: Clock };
                const StatusIcon = status.icon;

                return (
                  <TableRow key={item._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AvatarGroup max={3} sx={{ mr: 2 }}>
                          {item.orderItems?.map((orderItem, idx) => (
                            <Avatar
                              key={idx}
                              sx={{ width: 40, height: 40 }}
                              src={orderItem.product?.imageUrls?.[0]?.imageUrl}
                            />
                          ))}
                        </AvatarGroup>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {item.orderItems?.length} {item.orderItems?.length === 1 ? 'Item' : 'Items'}
                          </Typography>
                          <Typography variant="caption" color="textSecondary" noWrap sx={{ maxWidth: 200, display: 'block' }}>
                            {item.orderItems?.map(oi => oi.product?.title).join(", ")}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {item.user?.firstName} {item.user?.lastName}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        {item.user?.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: 'var(--primary-blue)' }}>
                        ₹{item.totalPrice}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'green', fontWeight: 600 }}>
                        {item.discount}% Off
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<StatusIcon size={14} />}
                        label={status.label}
                        color={status.color}
                        size="small"
                        sx={{ fontWeight: 600, px: 1 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={(e) => handleClick(e, item._id)}
                        endIcon={<ChevronDown size={16} />}
                        sx={{ borderRadius: '8px', textTransform: 'none' }}
                      >
                        Status
                      </Button>
                      <Menu
                        anchorEl={anchorEl[item._id]}
                        open={Boolean(anchorEl[item._id])}
                        onClose={() => handleClose(item._id)}
                        PaperProps={{
                          sx: {
                            borderRadius: '12px',
                            mt: 1,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            minWidth: 160
                          }
                        }}
                      >
                        <MenuItem
                          onClick={() => handleStatusUpdate(confirmedOrder, item._id, item._id)}
                          sx={{ gap: 1 }}
                          disabled={item.orderStatus === 'DELIVERED' || item.orderStatus === 'SHIPPED' || item.orderStatus === 'CONFIRMED'}
                        >
                          <ThumbsUp size={16} color={item.orderStatus === 'DELIVERED' || item.orderStatus === 'SHIPPED' || item.orderStatus === 'CONFIRMED' ? "#94a3b8" : "#10b981"} /> Confirmed
                        </MenuItem>
                        <MenuItem
                          onClick={() => handleStatusUpdate(shippedOrder, item._id, item._id)}
                          sx={{ gap: 1 }}
                          disabled={item.orderStatus === 'DELIVERED' || item.orderStatus === 'SHIPPED'}
                        >
                          <Truck size={16} color={item.orderStatus === 'DELIVERED' || item.orderStatus === 'SHIPPED' ? "#94a3b8" : "#3b82f6"} /> Shipped
                        </MenuItem>
                        <MenuItem
                          onClick={() => handleStatusUpdate(deliveredOrder, item._id, item._id)}
                          sx={{ gap: 1 }}
                          disabled={item.orderStatus === 'DELIVERED'}
                        >
                          <CheckCircle2 size={16} color={item.orderStatus === 'DELIVERED' ? "#94a3b8" : "#8b5cf6"} /> Delivered
                        </MenuItem>
                      </Menu>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => setSelectedOrder(item)}
                        startIcon={<Eye size={16} />}
                        sx={{
                          borderRadius: '8px',
                          textTransform: 'none',
                          bgcolor: '#3c7399',
                          '&:hover': { bgcolor: '#a9cee5' }
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '24px', p: 1 }
        }}
      >
        {selectedOrder && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 900, color: '#a9cee5' }}>Order Details</Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>ID: {selectedOrder._id}</Typography>
              </Box>
              <Chip
                label={selectedOrder.orderStatus}
                color={statusConfig[selectedOrder.orderStatus]?.color || 'default'}
                sx={{ fontWeight: 800, borderRadius: '8px' }}
              />
            </DialogTitle>
            <Divider />
            <DialogContent>
              <Grid container spacing={4}>
                {/* Customer & Shipping Section */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: '#a9cee5' }}>
                      <User size={18} /> Customer Information
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: '16px', bgcolor: '#f8fafc' }}>
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>{selectedOrder.user?.firstName} {selectedOrder.user?.lastName}</Typography>
                      <Typography variant="body2" color="textSecondary">{selectedOrder.user?.email}</Typography>
                      <Typography variant="body2" color="textSecondary">{selectedOrder.user?.mobile}</Typography>
                    </Paper>
                  </Box>

                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: '#a9cee5' }}>
                      <MapPin size={18} /> Shipping Address
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: '16px', bgcolor: '#f0f9ff' }}>
                      {selectedOrder.shippingAddress ? (
                        <>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{(selectedOrder.shippingAddress.firstName || 'N/A')} {(selectedOrder.shippingAddress.lastName || '')}</Typography>
                          <Typography variant="body2">{selectedOrder.shippingAddress.streetAddress || 'N/A'}</Typography>
                          <Typography variant="body2">{(selectedOrder.shippingAddress.city || 'N/A')}, {(selectedOrder.shippingAddress.state || 'N/A')} - {(selectedOrder.shippingAddress.zipCode || 'N/A')}</Typography>
                          <Typography variant="body2" sx={{ mt: 1, fontWeight: 700, color: '#3c7399' }}>Mobile: {selectedOrder.shippingAddress.mobile || 'N/A'}</Typography>
                        </>
                      ) : (
                        <Typography color="error">Address not provided</Typography>
                      )}
                    </Paper>
                  </Box>
                </Grid>

                {/* Products Section */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: '#a9cee5' }}>
                    <Package size={18} /> Order Items
                  </Typography>
                  <Box sx={{ maxHeight: 300, overflowY: 'auto', pr: 1 }}>
                    {selectedOrder.orderItems?.map((item, index) => (
                      <Paper key={index} variant="outlined" sx={{ p: 1.5, mb: 1.5, borderRadius: '12px', display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Avatar
                          variant="rounded"
                          src={item.product?.imageUrls?.[0]?.imageUrl}
                          sx={{ width: 60, height: 60, borderRadius: '8px' }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>{item.product?.title}</Typography>
                          <Typography variant="caption" color="textSecondary" display="block">
                            Qty: {item.quantity} | Size: {item.size ? `${item.size} MM` : 'N/A'} | Weight: {item.weight ? `${item.weight}g` : 'N/A'}
                          </Typography>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#3c7399' }}>₹{item.price}</Typography>
                        </Box>
                      </Paper>
                    ))}
                  </Box>

                  <Box sx={{ mt: 3, p: 2, bgcolor: '#a9cee5', borderRadius: '16px', color: '#1e3545' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Total Price</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>₹{selectedOrder.totalPrice}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Discount</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#10b981' }}>-{selectedOrder.discount}%</Typography>
                    </Box>
                    <Divider sx={{ my: 1, bgcolor: 'rgba(30, 53, 69, 0.15)' }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Net Amount</Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>₹{selectedOrder.totalDiscountedPrice}</Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button
                onClick={() => setSelectedOrder(null)}
                variant="outlined"
                sx={{ borderRadius: '10px', fontWeight: 700, textTransform: 'none', px: 4 }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

    </motion.div>
  );
};

export default OrdersTable;
