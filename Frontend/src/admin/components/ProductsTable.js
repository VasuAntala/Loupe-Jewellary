import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Button,
  Card,
  CardHeader,
  Divider,
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
  TextField,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  InputLabel
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Edit2, Trash2, Eye, Search, Filter, X } from "lucide-react";
import { motion } from "framer-motion";
import { store } from "../../state/store";
import { deleteProduct, findProducts } from "../../state/product/Action";

// Helper function to safely render N/A for missing data
const renderVal = (val) => {
  if (val === undefined || val === null || val === "" || val === "None" || val === "none") {
    return "N/A";
  }
  return val;
};

const ProductsTable = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [metalFilter, setMetalFilter] = useState("all");

  const dispatch = useDispatch();
  const { products } = useSelector((store) => store);
  const navigate = useNavigate();

  const handleProductDelete = () => {
    if (productToDelete) {
      dispatch(deleteProduct(productToDelete));
      setProductToDelete(null);
    }
  };

  useEffect(() => {
    const data = {
      category: "jewellery",
      color: [],
      minPrice: 0,
      maxPrice: 1000000,
      minDiscount: 0,
      maxDiscount: 100,
      sort: "low_to_high",
      pageNumber: 1,
      pageSize: 100,
      occasion: [],
      type: [],
      collectionName: "",
    };
    dispatch(findProducts(data));
  }, [products?.deletedProduct, products?.updatedProduct]);

  const rawProducts = Array.isArray(products.products?.content)
    ? products.products.content
    : (Array.isArray(products.products) ? products.products : []);

  // Filter products by Search Term, Category, and Metal Type
  const filteredProducts = rawProducts.filter((item) => {
    const searchLower = searchTerm.trim().toLowerCase();
    const titleMatch = !searchLower || item.title?.toLowerCase().includes(searchLower);
    const brandMatch = !searchLower || item.brand?.toLowerCase().includes(searchLower);
    const catName = item.category?.name || item.secondLevelCategory || "";
    const categoryMatch = categoryFilter === "all" || catName.toLowerCase() === categoryFilter.toLowerCase();
    const metalMatch = metalFilter === "all" || item.metalType?.toLowerCase() === metalFilter.toLowerCase();

    return (titleMatch || brandMatch) && categoryMatch && metalMatch;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <Box sx={{ p: 3, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', md: 'center' }, gap: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a' }}>Product Inventory</Typography>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
              Showing {filteredProducts.length} of {rawProducts.length} total products
            </Typography>
          </Box>

          {/* SEARCH & FILTER CONTROLS */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
            <TextField
              placeholder="Search product or brand..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={16} color="#94a3b8" />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm("")}>
                      <X size={14} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{ minWidth: 220, bgcolor: '#f8fafc', '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />

            <FormControl size="small" sx={{ minWidth: 140, bgcolor: '#f8fafc', borderRadius: '12px' }}>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                displayEmpty
                sx={{ borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600 }}
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="earrings">Earrings</MenuItem>
                <MenuItem value="rings">Rings</MenuItem>
                <MenuItem value="nacklaces">Necklaces</MenuItem>
                <MenuItem value="best-sellers">Best Sellers</MenuItem>
                <MenuItem value="wedding">Wedding</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 130, bgcolor: '#f8fafc', borderRadius: '12px' }}>
              <Select
                value={metalFilter}
                onChange={(e) => setMetalFilter(e.target.value)}
                displayEmpty
                sx={{ borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600 }}
              >
                <MenuItem value="all">All Metals</MenuItem>
                <MenuItem value="gold">Gold</MenuItem>
                <MenuItem value="silver">Silver</MenuItem>
                <MenuItem value="platinum">Platinum</MenuItem>
                <MenuItem value="rose gold">Rose Gold</MenuItem>
                <MenuItem value="white gold">White Gold</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
        <Divider />
        <TableContainer component={Box} sx={{ overflowX: 'auto', width: '100%' }}>
          <Table sx={{ minWidth: 900 }}>
            <TableHead sx={{ bgcolor: 'var(--bg-premium)' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Product & Brand</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Category & Occasion</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Metal & Gemstone</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Dimensions & Variants</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Approx Price Range & Stock</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.map((item, index) => (
                <TableRow
                  key={item._id}
                  hover
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  {/* Product Title, Image, Brand, Colors */}
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        variant="rounded"
                        sx={{ width: 52, height: 52, mr: 2, borderRadius: '12px', border: '1px solid #e2e8f0' }}
                        src={item.imageUrls?.[0]?.imageUrl}
                      />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 800, textTransform: 'capitalize', color: '#0f172a' }}>
                          {renderVal(item.title)}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block' }}>
                          Brand: {renderVal(item.brand)}
                        </Typography>
                        {Array.isArray(item.color) && item.color.length > 0 ? (
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                            {item.color.map(c => (
                              <Chip key={c} label={c} size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 18, textTransform: 'capitalize' }} />
                            ))}
                          </Box>
                        ) : (
                          <Typography variant="caption" sx={{ color: '#94a3b8' }}>Color: N/A</Typography>
                        )}
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Category, Occasion, Collection */}
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'flex-start' }}>
                      <Chip
                        label={item.category?.name || item.secondLevelCategory || "General"}
                        size="small"
                        sx={{ textTransform: 'capitalize', fontWeight: 700, bgcolor: '#e0f2fe', color: '#0369a1' }}
                      />
                      {item.topLevelCategory && (
                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                          Material: {item.topLevelCategory}
                        </Typography>
                      )}
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.3 }}>
                        {item.occasion && (
                          Array.isArray(item.occasion) ? (
                            item.occasion.map((occ) => (
                              <Chip key={occ} label={occ} size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 18, textTransform: 'capitalize', color: '#7c3aed', borderColor: '#ddd6fe' }} />
                            ))
                          ) : (
                            <Chip label={item.occasion} size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 18, textTransform: 'capitalize', color: '#7c3aed', borderColor: '#ddd6fe' }} />
                          )
                        )}
                        {item.collectionName && (
                          <Chip label={item.collectionName} size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 18, textTransform: 'capitalize', color: '#059669', borderColor: '#a7f3d0' }} />
                        )}
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Metal Details & Gemstone Details */}
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      {(item.metalType || item.metalPurity || item.metalColor) ? (
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#1e293b' }}>
                          {item.metalPurity ? `${item.metalPurity} ` : ''}{item.metalColor || item.metalType}
                          {item.metalWeight ? ` (${item.metalWeight}g)` : ''}
                        </Typography>
                      ) : (
                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>Metal: N/A</Typography>
                      )}
                      {item.hallmarkCertification && (
                        <Typography variant="caption" sx={{ color: '#0369a1', fontWeight: 600 }}>
                          Hallmark: {item.hallmarkCertification}
                        </Typography>
                      )}
                      {item.primaryStoneType && item.primaryStoneType !== "None" ? (
                        <Typography variant="caption" sx={{ color: '#d97706', fontWeight: 700 }}>
                          Stone: {item.primaryStoneType} {item.stoneShape ? `(${item.stoneShape})` : ''} {item.stoneWeight ? `${item.stoneWeight}ct` : ''}
                        </Typography>
                      ) : (
                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>Stone: None</Typography>
                      )}
                    </Box>
                  </TableCell>

                  {/* Dimensions, Weight, Sizes Count */}
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      {item.ringSize && (
                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#475569' }}>Ring Size: {item.ringSize}</Typography>
                      )}
                      {item.chainLength && (
                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#475569' }}>Chain: {item.chainLength}</Typography>
                      )}
                      {item.pendantSize && (
                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#475569' }}>Pendant: {item.pendantSize}</Typography>
                      )}
                      {item.dimensions && (
                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#475569' }}>Dim: {item.dimensions}</Typography>
                      )}
                      {item.totalWeight && (
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#0f172a' }}>Total Wt: {item.totalWeight}g</Typography>
                      )}
                      {Array.isArray(item.sizes) && item.sizes.length > 0 && (
                        <Typography variant="caption" sx={{ color: '#2563eb', fontWeight: 600 }}>
                          {item.sizes.length} Variant(s)
                        </Typography>
                      )}
                    </Box>
                  </TableCell>

                  {/* Pricing Range & Stock Qty */}
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: '90px', gap: 0.5 }}>
                      {item.minPrice && item.maxPrice ? (
                        <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                          ₹{item.minPrice?.toLocaleString()} - ₹{item.maxPrice?.toLocaleString()}
                        </Typography>
                      ) : (
                        <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                          ₹{(item.discountedPrice || item.price || 0)?.toLocaleString()}
                        </Typography>
                      )}
                      <Chip
                        size="small"
                        label={`Stock Qty: ${item.quantity || 0}`}
                        sx={{
                          bgcolor: (item.quantity > 5) ? '#ecfdf5' : '#fef2f2',
                          color: (item.quantity > 5) ? '#047857' : '#be123c',
                          fontWeight: 700,
                          height: 20,
                          fontSize: '0.7rem'
                        }}
                      />
                    </Box>
                  </TableCell>

                  {/* Actions */}
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <Tooltip title="View All Details">
                        <IconButton
                          size="small"
                          sx={{ color: '#0284c7', bgcolor: '#f0f9ff', '&:hover': { bgcolor: '#e0f2fe' } }}
                          onClick={() => setSelectedProduct(item)}
                        >
                          <Eye size={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Product">
                        <IconButton
                          size="small"
                          sx={{ color: '#2563eb', bgcolor: '#eff6ff', '&:hover': { bgcolor: '#dbeafe' } }}
                          onClick={() => navigate(`/admin/product/edit/${item._id}`)}
                        >
                          <Edit2 size={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Product">
                        <IconButton
                          size="small"
                          sx={{ color: '#dc2626', bgcolor: '#fef2f2', '&:hover': { bgcolor: '#fee2e2' } }}
                          onClick={() => setProductToDelete(item._id)}
                        >
                          <Trash2 size={18} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* FULL PRODUCT DETAILS DIALOG (CONTAINING ALL FIELDS) */}
      <Dialog
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: { borderRadius: '24px', overflow: 'hidden' } }}
      >
        {selectedProduct && (
          <>
            <DialogTitle sx={{ bgcolor: '#f8fafc', borderBottom: '1px solid #f1f5f9', p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: '#0f172a' }}>{selectedProduct.title}</Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>Brand: {selectedProduct.brand || 'Loupe Jeweler'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip label={selectedProduct.category?.name || selectedProduct.secondLevelCategory || 'General'} sx={{ bgcolor: '#e0f2fe', color: '#0369a1', fontWeight: 800 }} />
                  {selectedProduct.topLevelCategory && (
                    <Chip label={`Material: ${selectedProduct.topLevelCategory}`} sx={{ bgcolor: '#f3e8ff', color: '#6b21a8', fontWeight: 800 }} />
                  )}
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ p: 4 }}>
              <Grid container spacing={4}>
                {/* Images View */}
                <Grid item xs={12} md={5}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, mb: 1.5 }}>
                    Product Images ({selectedProduct.imageUrls?.length || 0})
                  </Typography>
                  <Box sx={{ width: '100%', height: 300, borderRadius: '16px', overflow: 'hidden', bgcolor: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {selectedProduct.imageUrls?.[0]?.imageUrl ? (
                      <img src={selectedProduct.imageUrls[0].imageUrl} alt={selectedProduct.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Typography sx={{ color: '#94a3b8' }}>No Image Available</Typography>
                    )}
                  </Box>
                  {selectedProduct.imageUrls?.length > 1 && (
                    <Box sx={{ display: 'flex', gap: 1, mt: 2, overflowX: 'auto', pb: 1 }}>
                      {selectedProduct.imageUrls.map((img, i) => (
                        <Box key={i} sx={{ width: 64, height: 64, borderRadius: '10px', overflow: 'hidden', border: '1px solid #e2e8f0', flexShrink: 0 }}>
                          <img src={img.imageUrl} alt={`view-${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </Box>
                      ))}
                    </Box>
                  )}
                </Grid>

                {/* Details Breakdown */}
                <Grid item xs={12} md={7}>
                  {/* Pricing & Stock */}
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, mb: 1 }}>
                    Pricing & Inventory
                  </Typography>
                  <Box sx={{ p: 2.5, bgcolor: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9', mb: 3 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={7}>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Approx. Price Range (Visible to Customers)</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 900, color: '#0f172a' }}>
                          ₹{Number(selectedProduct.minPrice || 0).toLocaleString('en-IN')} – ₹{Number(selectedProduct.maxPrice || 0).toLocaleString('en-IN')}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={5}>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block' }}>Stock Available</Typography>
                        <Chip
                          label={`${selectedProduct.quantity || 0} Units in Stock`}
                          sx={{
                            bgcolor: (selectedProduct.quantity > 5) ? '#ecfdf5' : '#fef2f2',
                            color: (selectedProduct.quantity > 5) ? '#047857' : '#be123c',
                            fontWeight: 800,
                            mt: 0.5
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Specifications & Details */}
                  {selectedProduct.details ? (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, mb: 1 }}>
                        Specifications & Details
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.6 }}>
                        {selectedProduct.details}
                      </Typography>
                    </Box>
                  ) : null}

                  {/* Metal, Gemstone, Classification Grid */}
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    {/* Metal Details */}
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9', height: '100%' }}>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Metal Details</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: '#1e293b', mt: 0.5 }}>
                          Metal Type: {renderVal(selectedProduct.metalType)}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#475569', display: 'block' }}>
                          Purity: {renderVal(selectedProduct.metalPurity)} | Color: {renderVal(selectedProduct.metalColor)}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#475569', display: 'block' }}>
                          Metal Weight: {selectedProduct.metalWeight ? `${selectedProduct.metalWeight}g` : 'N/A'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#0369a1', fontWeight: 700, display: 'block', mt: 0.5 }}>
                          Hallmark / Cert: {renderVal(selectedProduct.hallmarkCertification)}
                        </Typography>
                      </Box>
                    </Grid>

                    {/* Gemstone Details */}
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9', height: '100%' }}>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Gemstone Details</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: '#1e293b', mt: 0.5 }}>
                          Stone Type: {renderVal(selectedProduct.primaryStoneType)}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#475569', display: 'block' }}>
                          Shape: {renderVal(selectedProduct.stoneShape)}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#475569', display: 'block' }}>
                          Stone Weight: {selectedProduct.stoneWeight ? `${selectedProduct.stoneWeight}ct` : 'N/A'}
                        </Typography>
                      </Box>
                    </Grid>

                    {/* Dimensions & Measurements */}
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9', height: '100%' }}>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Dimensions & Sizes</Typography>
                        <Typography variant="caption" sx={{ color: '#475569', display: 'block', mt: 0.5 }}>
                          Ring Size: {renderVal(selectedProduct.ringSize)}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#475569', display: 'block' }}>
                          Chain Length: {renderVal(selectedProduct.chainLength)}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#475569', display: 'block' }}>
                          Pendant Size: {renderVal(selectedProduct.pendantSize)}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#475569', display: 'block' }}>
                          Dimensions: {renderVal(selectedProduct.dimensions)}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#0f172a', fontWeight: 800, display: 'block', mt: 0.5 }}>
                          Total Weight: {selectedProduct.totalWeight ? `${selectedProduct.totalWeight}g` : 'N/A'}
                        </Typography>
                      </Box>
                    </Grid>

                    {/* Classifications & Colors */}
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9', height: '100%' }}>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Classification & Theme</Typography>
                        <Typography variant="caption" sx={{ color: '#475569', display: 'block', mt: 0.5 }}>
                          Occasion: {Array.isArray(selectedProduct.occasion) ? (selectedProduct.occasion.length > 0 ? selectedProduct.occasion.join(', ') : 'N/A') : renderVal(selectedProduct.occasion)}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#475569', display: 'block' }}>
                          Collection: {renderVal(selectedProduct.collectionName)}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, display: 'block', mt: 1, mb: 0.5 }}>
                          Color Variants:
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {Array.isArray(selectedProduct.color) && selectedProduct.color.length > 0 ? (
                            selectedProduct.color.map(c => <Chip key={c} label={c} size="small" />)
                          ) : (
                            <Typography variant="caption" sx={{ color: '#94a3b8' }}>N/A</Typography>
                          )}
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Size Variants Table */}
                  {Array.isArray(selectedProduct.sizes) && selectedProduct.sizes.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, mb: 1 }}>
                        Size & Stock Variants ({selectedProduct.sizes.length})
                      </Typography>
                      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: '12px' }}>
                        <Table size="small">
                          <TableHead sx={{ bgcolor: '#f8fafc' }}>
                            <TableRow>
                              <TableCell sx={{ fontWeight: 700 }}>Weight</TableCell>
                              <TableCell sx={{ fontWeight: 700 }}>Size</TableCell>
                              <TableCell sx={{ fontWeight: 700 }}>Stock Qty</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {selectedProduct.sizes.map((s, idx) => (
                              <TableRow key={idx}>
                                <TableCell sx={{ fontWeight: 600 }}>{s.weight || 'N/A'}</TableCell>
                                <TableCell>{s.size || 'Standard'}</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: s.stock > 0 ? '#047857' : '#be123c' }}>{s.stock || 0}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3, bgcolor: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
              <Button onClick={() => setSelectedProduct(null)} sx={{ color: '#64748b', fontWeight: 700 }}>
                Close
              </Button>
              <Button
                variant="contained"
                startIcon={<Edit2 size={16} />}
                onClick={() => {
                  navigate(`/admin/product/edit/${selectedProduct._id}`);
                  setSelectedProduct(null);
                }}
                sx={{ bgcolor: '#3c7399', color: '#fff', fontWeight: 800, px: 3, borderRadius: '10px', '&:hover': { bgcolor: '#2c5673' } }}
              >
                Edit Product Details
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Dialog open={!!productToDelete} onClose={() => setProductToDelete(null)} PaperProps={{ sx: { borderRadius: '16px' } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontWeight: 600, color: '#475569', mt: 1 }}>
            Are you sure you want to delete this product? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setProductToDelete(null)} sx={{ color: '#64748b', fontWeight: 700 }}>
            Cancel
          </Button>
          <Button onClick={handleProductDelete} color="error" variant="contained" sx={{ fontWeight: 700, borderRadius: '8px' }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default ProductsTable;
