import { Avatar, Box, Card, CardContent, Grid, Typography, LinearProgress } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Users, Package, ShoppingBag, ArrowUpRight, ArrowDownRight, Gem } from 'lucide-react'

const MonthlyOverview = () => {
    const { adminDashboard } = useSelector(store => store);
    const stats = adminDashboard?.stats;
    const totalProducts = adminDashboard?.allProducts?.length || 0;

    const salesData = [
        {
            stats: totalProducts.toLocaleString(),
            title: 'Total Products',
            trend: '+5.0%',
            isUp: true,
            icon: <Gem size={20} />,
            color: '#3c7399',
            bg: '#f0f9ff'
        },
        {
            stats: (stats?.totalOrders || 0).toLocaleString(),
            title: 'Total Orders',
            trend: '+8.2%',
            isUp: true,
            icon: <ShoppingBag size={20} />,
            color: '#fbbf24',
            bg: '#fffbeb'
        },
        {
            stats: (stats?.totalCustomers || 0).toLocaleString(),
            title: 'Total Customers',
            trend: '-2.4%',
            isUp: false,
            icon: <Users size={20} />,
            color: '#8b5cf6',
            bg: '#f5f3ff'
        },
        {
            stats: (stats?.totalDeliveredOrders || 0).toLocaleString(),
            title: 'Delivered',
            trend: '+4.3%',
            isUp: true,
            icon: <Package size={20} />,
            color: '#10b981',
            bg: '#f0fdf4'
        },
    ]

    return (
        <Grid container spacing={3}>
            {salesData.map((item, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                        <Card
                            sx={{
                                borderRadius: '24px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                                border: '1px solid #f1f5f9',
                                overflow: 'visible',
                                transition: 'all 0.3s',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: '0 12px 30px rgba(0,0,0,0.04)',
                                    borderColor: item.color
                                }
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                    <Avatar
                                        variant='rounded'
                                        sx={{
                                            width: 48,
                                            height: 48,
                                            bgcolor: item.bg,
                                            color: item.color,
                                            borderRadius: '14px'
                                        }}
                                    >
                                        {item.icon}
                                    </Avatar>
                                    <Box sx={{ textAlign: 'right' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end' }}>
                                            <Typography variant='caption' sx={{ color: item.isUp ? '#10b981' : '#f43f5e', fontWeight: 800 }}>
                                                {item.trend}
                                            </Typography>
                                            {item.isUp ? <ArrowUpRight size={14} color="#10b981" /> : <ArrowDownRight size={14} color="#f43f5e" />}
                                        </Box>
                                        <Typography variant='caption' sx={{ color: '#94a3b8', fontWeight: 600 }}>vs last month</Typography>
                                    </Box>
                                </Box>

                                <Typography variant='caption' sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    {item.title}
                                </Typography>
                                <Typography variant='h4' sx={{ fontWeight: 900, color: '#1e293b', mt: 0.5, letterSpacing: '-1px' }}>
                                    {item.stats}
                                </Typography>

                                <Box sx={{ mt: 2 }}>
                                    <LinearProgress
                                        variant="determinate"
                                        value={70}
                                        sx={{
                                            height: 6,
                                            borderRadius: 5,
                                            bgcolor: '#f1f5f9',
                                            '& .MuiLinearProgress-bar': {
                                                bgcolor: item.color,
                                                borderRadius: 5
                                            }
                                        }}
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </motion.div>
                </Grid>
            ))}
        </Grid>
    )
}

export default MonthlyOverview
