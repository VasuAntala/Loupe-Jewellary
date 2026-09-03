import React, { useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Avatar, Button,
  Card, CardContent, Divider, Box,
  Typography, IconButton, Tooltip, Chip, alpha
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Trash2, Mail, Users, Shield, User, ChevronRight, Phone } from "lucide-react";
import { motion } from "framer-motion";
import Swal from 'sweetalert2';
import { store } from "../../state/store";
import { deleteUserProfile, getAllUsers } from "../../state/auth/Action";
import { styled } from '@mui/material/styles';

const BRAND = '#3c7399';
const BRAND_LIGHT = '#f0f9ff';
const BRAND_DARK = '#5fa0b8';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: '1px solid #f1f5f9',
  padding: '18px 24px',
}));

const CustomersTable = () => {
  const dispatch = useDispatch();
  const { auth } = useSelector(store => store);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [auth.deletedUserId]);

  const handleDeleteUserProfile = async (userId) => {
    const result = await Swal.fire({
      title: "Remove Customer?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: BRAND,
      cancelButtonColor: "#f43f5e",
      confirmButtonText: "Yes, remove!",
      borderRadius: '24px',
    });

    if (result.isConfirmed) {
      dispatch(deleteUserProfile(userId));
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 0 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Admin Panel
            </Typography>
            <ChevronRight size={14} color="#94a3b8" />
            <Typography variant="caption" sx={{ color: BRAND, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Customers Management
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#111827', letterSpacing: '-1px' }}>
                Customer Base
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mt: 0.5 }}>
                Manage all registered users and assign roles efficiently.
              </Typography>
            </Box>
            <Chip
              icon={<Users size={16} />}
              label={`${auth.users?.length || 0} Total Customers`}
              sx={{ bgcolor: BRAND_LIGHT, color: BRAND_DARK, fontWeight: 800, borderRadius: '12px', py: 2.5, px: 1, '& .MuiChip-icon': { color: BRAND_DARK } }}
            />
          </Box>
        </Box>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <Card sx={{ borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
          <TableContainer>
            <Table sx={{ minWidth: 700 }}>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <StyledTableCell sx={{ color: '#64748b', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>ID</StyledTableCell>
                  <StyledTableCell sx={{ color: '#64748b', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Customer Info</StyledTableCell>
                  <StyledTableCell sx={{ color: '#64748b', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Mobile No</StyledTableCell>
                  <StyledTableCell sx={{ color: '#64748b', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Account Role</StyledTableCell>
                  <StyledTableCell align="right" sx={{ color: '#64748b', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {auth.users?.map((user, index) => (
                  <TableRow key={user._id} hover sx={{ '&:hover': { bgcolor: '#fbfcfd' }, transition: 'all 0.2s' }}>
                    <StyledTableCell>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: '#94a3b8', bgcolor: '#f1f5f9', py: 0.5, px: 1.5, borderRadius: '8px' }}>
                        #{index + 1}
                      </Typography>
                    </StyledTableCell>

                    <StyledTableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                        <Avatar
                          sx={{
                            width: 48, height: 48,
                            bgcolor: user.role === 'ADMIN' ? '#fef2f2' : BRAND_LIGHT,
                            color: user.role === 'ADMIN' ? '#ef4444' : BRAND,
                            fontWeight: 800, fontSize: '1.2rem',
                            border: `2px solid ${user.role === 'ADMIN' ? '#fca5a5' : '#bae6fd'}`,
                            boxShadow: `0 4px 10px ${user.role === 'ADMIN' ? 'rgba(239,68,68,0.2)' : 'rgba(151,194,213,0.3)'}`
                          }}
                        >
                          {user.firstName?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b', textTransform: 'capitalize', mb: 0.3 }}>
                            {user.firstName} {user.lastName}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', color: '#64748b', gap: 0.5 }}>
                            <Mail size={14} />
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>{user.email}</Typography>
                          </Box>
                        </Box>
                      </Box>
                    </StyledTableCell>

                    <StyledTableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', color: '#64748b', gap: 1 }}>
                        <Box sx={{ bgcolor: '#f1f5f9', p: 0.5, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Phone size={14} color="#64748b" />
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: user.mobile ? '#1e293b' : '#94a3b8', fontStyle: user.mobile ? 'normal' : 'italic' }}>
                          {user.mobile || 'Not provided'}
                        </Typography>
                      </Box>
                    </StyledTableCell>

                    <StyledTableCell>
                      <Chip
                        icon={user.role === 'ADMIN' ? <Shield size={14} /> : <User size={14} />}
                        label={user.role || 'CUSTOMER'}
                        size="small"
                        sx={{
                          bgcolor: user.role === 'ADMIN' ? '#fef2f2' : '#f0fdf4',
                          color: user.role === 'ADMIN' ? '#ef4444' : '#16a34a',
                          fontWeight: 800,
                          borderRadius: '8px',
                          border: `1px solid ${user.role === 'ADMIN' ? '#fecaca' : '#bbf7d0'}`,
                          px: 0.5,
                          '& .MuiChip-icon': {
                            color: user.role === 'ADMIN' ? '#ef4444' : '#16a34a',
                          }
                        }}
                      />
                    </StyledTableCell>

                    <StyledTableCell align="right">
                      <Tooltip title={user.role === 'ADMIN' ? "Cannot remove Admin" : "Remove User"}>
                        <span>
                          <IconButton
                            onClick={() => handleDeleteUserProfile(user._id)}
                            disabled={user.role === 'ADMIN'}
                            sx={{
                              bgcolor: '#fff1f2', color: '#f43f5e',
                              borderRadius: '12px',
                              border: '1px solid #ffe4e6',
                              p: 1.2,
                              '&:hover': { bgcolor: '#f43f5e', color: '#fff', transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(244,63,94,0.3)' },
                              transition: 'all 0.2s',
                              opacity: user.role === 'ADMIN' ? 0.5 : 1
                            }}
                          >
                            <Trash2 size={18} />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </StyledTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </motion.div>
    </Box>
  );
};

export default CustomersTable;
