import React from 'react';
import { IconButton, Box, Typography, Divider } from '@mui/material';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { removeCartItem, updateCartItem } from '../../../state/cart/Action';
import { formatPriceINR } from '../../../utils/price';

const CartItem = ({ item }) => {
    const dispatch = useDispatch();
    const MAX_QUANTITY = 10;

    const handleUpdateCartItem = (num) => {
        const data = { data: { quantity: item.quantity + num }, cartItemId: item?._id }
        dispatch(updateCartItem(data))
    }

    const handleRemoveCartItem = () => {
        dispatch(removeCartItem(item._id));
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className='p-3 sm:p-6 mb-4 sm:mb-6 bg-white rounded-2xl sm:rounded-3xl border border-[#f1f5f9] hover:shadow-xl transition-all duration-300'
        >
            <Box sx={{ display: 'flex', gap: { xs: 1.5, sm: 3 } }}>
                <Box sx={{ width: { xs: 85, sm: 140 }, height: { xs: 85, sm: 140 }, flexShrink: 0, borderRadius: { xs: '12px', sm: '20px' }, overflow: 'hidden', bgcolor: '#f8fafc' }}>
                    <img src={item.product?.imageUrls?.[0]?.imageUrl} className='w-full h-full object-cover' alt={item.product?.title} />
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box sx={{ pr: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--text-dark)', fontSize: { xs: '0.9rem', sm: '1.15rem' }, lineHeight: 1.3 }}>
                                {item.product?.title}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.65rem' }}>
                                {item.product?.brand}
                            </Typography>
                        </Box>

                        <IconButton onClick={handleRemoveCartItem} size="small" sx={{ color: '#ef4444', p: 0.5 }}>
                            <Trash2 size={16} />
                        </IconButton>
                    </Box>

                    <Typography variant="body2" sx={{ my: 0.5, color: 'text.secondary', fontWeight: 500, fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>
                        Weight: {item.weight ? `${item.weight} G` : 'N/A'} | Size: {item.size ? `${item.size} MM` : 'N/A'}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, mt: { xs: 1, sm: 2 }, flexWrap: 'wrap' }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: 'var(--primary-blue)', fontSize: { xs: '0.95rem', sm: '1.25rem' } }}>
                            ₹{formatPriceINR(item.discountedPrice)}
                        </Typography>
                        <Typography variant="body2" sx={{ textDecoration: 'line-through', opacity: 0.5, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                            ₹{formatPriceINR(item.price)}
                        </Typography>
                        <Typography variant="caption" sx={{ bgcolor: '#dcfce7', color: '#166534', px: 1, py: 0.2, borderRadius: '4px', fontWeight: 700, fontSize: '0.65rem' }}>
                            {item.product?.discountPercent}% OFF
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#f8fafc', borderRadius: '12px', p: 0.5 }}>
                            <IconButton
                                size="small"
                                disabled={item.quantity <= 1}
                                onClick={() => handleUpdateCartItem(-1)}
                                sx={{ color: 'var(--primary-blue)' }}
                            >
                                <Minus size={16} />
                            </IconButton>
                            <Typography sx={{ px: 2, fontWeight: 700, minWidth: 40, textAlign: 'center' }}>
                                {item.quantity}
                            </Typography>
                            <IconButton
                                size="small"
                                disabled={item.quantity >= MAX_QUANTITY}
                                onClick={() => handleUpdateCartItem(1)}
                                sx={{
                                    color: item.quantity >= MAX_QUANTITY ? '#94a3b8' : 'var(--primary-blue)',
                                    '&.Mui-disabled': { color: '#cbd5e1' }
                                }}
                            >
                                <Plus size={16} />
                            </IconButton>
                        </Box>
                        {item.quantity >= MAX_QUANTITY && (
                            <Typography
                                variant="caption"
                                sx={{
                                    bgcolor: '#fef3c7',
                                    color: '#92400e',
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: '8px',
                                    fontWeight: 700,
                                    fontSize: '0.7rem',
                                    letterSpacing: 0.5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5
                                }}
                            >
                                ⚠️ Max 10 per item
                            </Typography>
                        )}
                    </Box>
                </Box>
            </Box>
        </motion.div>
    )
}

export default CartItem;
