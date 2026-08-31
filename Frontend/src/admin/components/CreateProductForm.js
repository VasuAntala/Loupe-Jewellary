import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct } from '../../state/product/Action';
import {
  Box, Grid, TextField, Button, Typography, FormControl,
  InputLabel, Select, MenuItem, Card, CardContent, Avatar,
  Divider, Chip, IconButton, CircularProgress, LinearProgress,
  Table, TableHead, TableRow, TableCell, TableBody, Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Upload, Plus, Trash2, Package, Tag, Image, Layers,
  DollarSign, BarChart3, ChevronRight, Gem, Ruler, Award,
  CheckCircle, Link as LinkIcon, Info
} from 'lucide-react';
import { motion } from 'framer-motion';
import { uploadMultipleImagesViaBackend, deleteAssetViaBackend, getOptimizedCloudinaryUrl } from '../../utils/cloudinaryUtils';

const BRAND = '#3c7399';
const BRAND_LIGHT = '#f0f9ff';
const BRAND_DARK = '#2b526d';

const StyledTextField = styled(TextField)({
  '& label.Mui-focused': { color: BRAND },
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    '& fieldset': { borderColor: '#e2e8f0' },
    '&:hover fieldset': { borderColor: BRAND },
    '&.Mui-focused fieldset': { borderColor: BRAND, borderWidth: 2 },
  },
  '& .MuiInputLabel-root': { fontWeight: 600 },
});

const StyledSelect = styled(Select)({
  borderRadius: '12px',
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: BRAND, borderWidth: 2 },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: BRAND },
});

const SectionHeader = ({ step, icon, title, description }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
    <Avatar sx={{ bgcolor: BRAND, color: '#fff', width: 44, height: 44, borderRadius: '12px', fontWeight: 800, fontSize: '1rem' }}>
      {step}
    </Avatar>
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#111827', letterSpacing: '-0.3px' }}>
          {title}
        </Typography>
        {icon}
      </Box>
      <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
        {description}
      </Typography>
    </Box>
  </Box>
);

const initialSizes = [{ weight: 'g', size: 'MM', stock: 0 }];
const initialDimension = { label: '', value: '', unit: 'mm' };
const initialDiamond = { diamondType: '', diamondSize: '', diamondDiameter: '', weightPerPiece: '', pieces: 1, totalWeight: '' };
const initialMetal = { metalType: 'Gold', purity: '18K', finalWeight: '', unit: 'g' };

const CreateProductForm = () => {
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [productData, setProductData] = useState({
    // 1. Basic Info
    title: '',
    productCode: '',
    topLevelCategory: 'diamond',
    secondLevelCategory: '',
    thirdLevelCategory: '',
    description: '',
    details: '',
    imageUrls: [],
    status: 'active',
    brand: 'Loupe Jeweler',
    quantity: 1,
    occasion: '',
    collectionName: '',
    color: [],
    sizes: initialSizes,

    // 2. Approx Pricing
    minPrice: 0,
    maxPrice: 0,
    priceNote: 'Price varies according to daily gold rate and diamond specifications.',
    price: 0,
    discountedPrice: 0,

    // 3. Product Dimensions
    dimensionsList: [initialDimension],

    // 4. Diamond Details
    diamondDetails: [initialDiamond],

    // 5. Metal Details
    metalDetails: [initialMetal],

    // 6. Chain / Component Details
    includesChain: 'No',
    chainLength: '',
    chainWeight: '',
    chakiWeight: '',
  });

  const dispatch = useDispatch();
  const { products } = useSelector((store) => store);

  // Field change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  // Image Upload
  const handleImageUpload = async (e) => {
    const { files } = e.target;
    if (!files || files.length === 0) return;

    const selectedFiles = Array.from(files).filter((f) => f.type?.startsWith('image/')).slice(0, 4);
    if (selectedFiles.length === 0) return;

    setImageUploading(true);
    setUploadProgress(0);
    try {
      const results = await uploadMultipleImagesViaBackend(selectedFiles);
      setUploadProgress(100);
      setProductData((prev) => ({
        ...prev,
        imageUrls: results.slice(0, 4).map((r) => ({
          imageUrl: r.secure_url,
          publicId: r.public_id,
        })),
      }));
    } catch (err) {
      console.error('Image upload error:', err.message);
      alert('Image upload failed. Please try again.');
    } finally {
      setImageUploading(false);
      setTimeout(() => setUploadProgress(0), 1500);
    }
  };

  const handleRemoveImage = async (index) => {
    const img = productData.imageUrls[index];
    if (img?.publicId) {
      try { await deleteAssetViaBackend(img.publicId, 'image'); } catch (e) { /* non-blocking */ }
    }
    setProductData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  // Dynamic Handlers: Dimensions
  const handleDimensionChange = (index, field, value) => {
    const updated = [...productData.dimensionsList];
    updated[index] = { ...updated[index], [field]: value };
    setProductData((prev) => ({ ...prev, dimensionsList: updated }));
  };
  const handleAddDimension = () => {
    setProductData((prev) => ({ ...prev, dimensionsList: [...prev.dimensionsList, { label: '', value: '', unit: 'mm' }] }));
  };
  const handleRemoveDimension = (index) => {
    setProductData((prev) => ({ ...prev, dimensionsList: prev.dimensionsList.filter((_, i) => i !== index) }));
  };

  // Dynamic Handlers: Diamonds
  const handleDiamondChange = (index, field, value) => {
    const updated = [...productData.diamondDetails];
    updated[index] = { ...updated[index], [field]: value };
    setProductData((prev) => ({ ...prev, diamondDetails: updated }));
  };
  const handleAddDiamond = () => {
    setProductData((prev) => ({ ...prev, diamondDetails: [...prev.diamondDetails, { ...initialDiamond }] }));
  };
  const handleRemoveDiamond = (index) => {
    setProductData((prev) => ({ ...prev, diamondDetails: prev.diamondDetails.filter((_, i) => i !== index) }));
  };

  // Dynamic Handlers: Metals
  const handleMetalChange = (index, field, value) => {
    const updated = [...productData.metalDetails];
    updated[index] = { ...updated[index], [field]: value };
    setProductData((prev) => ({ ...prev, metalDetails: updated }));
  };
  const handleAddMetal = () => {
    setProductData((prev) => ({ ...prev, metalDetails: [...prev.metalDetails, { ...initialMetal }] }));
  };
  const handleRemoveMetal = (index) => {
    setProductData((prev) => ({ ...prev, metalDetails: prev.metalDetails.filter((_, i) => i !== index) }));
  };

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = {
      ...productData,
      price: productData.minPrice || productData.price,
      discountedPrice: productData.minPrice || productData.discountedPrice,
      metalType: productData.metalDetails[0]?.metalType || 'Gold',
      metalPurity: productData.metalDetails[0]?.purity || '18K',
      metalWeight: parseFloat(productData.metalDetails[0]?.finalWeight || 0),
      primaryStoneType: productData.diamondDetails[0]?.diamondType || 'Diamond',
    };
    dispatch(createProduct(finalData));
  };

  const isFormValid = productData.title !== '' && productData.minPrice > 0 && productData.topLevelCategory !== '';

  const prodType = productData.secondLevelCategory;

  const stylesByType = {
    earrings: [
      { value: 'earring', label: 'Earring' },
      { value: 'drop', label: 'Drop' },
      { value: 'hoop', label: 'Hoop' },
      { value: 'stud', label: 'Studs' },
      { value: 'jhumka', label: 'Jhumkas' },
    ],
    rings: [
      { value: 'ring', label: 'Ring' },
      { value: 'engagement-ring', label: 'Engagement Ring' },
      { value: 'pearl-ring', label: 'Pearl Ring' },
      { value: 'couple-ring', label: 'Couple Rings' },
    ],
    nacklaces: [
      { value: 'chain', label: 'Chain' },
      { value: 'mangal-sutra', label: 'Mangal Sutra' },
      { value: 'necklace', label: 'Necklace' },
      { value: 'pendant', label: 'Pendant' },
      { value: 'locket', label: 'Locket' },
    ],
    wedding: [
      { value: 'bridal-ring', label: 'Bridal Ring' },
      { value: 'engagement-ring', label: 'Engagement Ring' },
      { value: 'couple-ring', label: 'Couple Rings' },
      { value: 'mangal-sutra', label: 'Mangal Sutra' },
    ],
  };

  const allStyles = [
    { value: 'bangle', label: 'Bangle' },
    { value: 'bracelet', label: 'Bracelet' },
    { value: 'chain', label: 'Chain' },
    { value: 'earring', label: 'Earring' },
    { value: 'mangal-sutra', label: 'Mangal Sutra' },
    { value: 'necklace', label: 'Necklace' },
    { value: 'pendant', label: 'Pendant' },
    { value: 'locket', label: 'Locket' },
    { value: 'ring', label: 'Ring' },
    { value: 'drop', label: 'Drop' },
    { value: 'hoop', label: 'Hoop' },
    { value: 'stud', label: 'Studs' },
    { value: 'jhumka', label: 'Jhumkas' },
    { value: 'engagement-ring', label: 'Engagement Ring' },
    { value: 'pearl-ring', label: 'Pearl Ring' },
    { value: 'bridal-ring', label: 'Bridal Ring' },
    { value: 'couple-ring', label: 'Couple Rings' },
  ];

  const filteredStyles = stylesByType[prodType] || allStyles;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header Banner */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Box sx={{ mb: 4, pb: 3, borderBottom: '1px solid #e2e8f0' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Admin Panel
            </Typography>
            <ChevronRight size={14} color="#64748b" />
            <Typography variant="caption" sx={{ color: BRAND, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Inventory Management
            </Typography>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a', letterSpacing: '-1px' }}>
            ADD NEW PRODUCT
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mt: 0.5 }}>
            Structured ERP Catalog Input for Loupe Jewellery Items
          </Typography>
        </Box>
      </motion.div>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3.5}>

          {/* ==================== 1. BASIC INFORMATION ==================== */}
          <Grid item xs={12}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
              <Card sx={{ borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
                  <SectionHeader step="1" icon={<Package size={20} color={BRAND} />} title="BASIC INFORMATION" description="Core product identity, category hierarchy, status & media" />

                  <Grid container spacing={2.5}>
                    <Grid item xs={12} sm={8}>
                      <StyledTextField label="Product Name" name="title" value={productData.title} onChange={handleChange} fullWidth required placeholder="e.g. 0.30 Pointer Marquise Shape Diamond Ring" />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <StyledTextField label="Product Code / SKU" name="productCode" value={productData.productCode} onChange={handleChange} fullWidth placeholder="e.g. LP-RNG-030" />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth>
                        <InputLabel sx={{ fontWeight: 600 }}>Category (Material)</InputLabel>
                        <StyledSelect label="Category (Material)" name="topLevelCategory" value={productData.topLevelCategory} onChange={handleChange}>
                          <MenuItem value="diamond">Diamond Jewelry</MenuItem>
                          <MenuItem value="gold">Gold Jewelry</MenuItem>
                          <MenuItem value="platinum">Platinum Jewelry</MenuItem>
                          <MenuItem value="gemstone">Gemstone Jewelry</MenuItem>
                        </StyledSelect>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth>
                        <InputLabel sx={{ fontWeight: 600 }}>Sub Category (Item Type)</InputLabel>
                        <StyledSelect label="Sub Category (Item Type)" name="secondLevelCategory" value={productData.secondLevelCategory} onChange={handleChange}>
                          <MenuItem value="rings">Rings</MenuItem>
                          <MenuItem value="earrings">Earrings</MenuItem>
                          <MenuItem value="nacklaces">Necklaces & Pendants</MenuItem>
                          <MenuItem value="bracelets">Bracelets & Bangles</MenuItem>
                          <MenuItem value="other">Other Accessories</MenuItem>
                        </StyledSelect>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth disabled={!prodType}>
                        <InputLabel sx={{ fontWeight: 600 }}>Specific Style</InputLabel>
                        <StyledSelect label="Specific Style" name="thirdLevelCategory" value={productData.thirdLevelCategory} onChange={handleChange}>
                          {filteredStyles.map((s) => (
                            <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                          ))}
                        </StyledSelect>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth>
                        <InputLabel sx={{ fontWeight: 600 }}>Status</InputLabel>
                        <StyledSelect label="Status" name="status" value={productData.status} onChange={handleChange}>
                          <MenuItem value="active">Active (Visible in Store)</MenuItem>
                          <MenuItem value="draft">Draft</MenuItem>
                          <MenuItem value="inactive">Inactive</MenuItem>
                          <MenuItem value="out_of_stock">Out of Stock</MenuItem>
                        </StyledSelect>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel sx={{ fontWeight: 600 }}>Occasion</InputLabel>
                        <StyledSelect label="Occasion" name="occasion" value={productData.occasion} onChange={handleChange}>
                          <MenuItem value="bridal">Bridal Wear</MenuItem>
                          <MenuItem value="casual">Casual Wear</MenuItem>
                          <MenuItem value="engagement">Engagement</MenuItem>
                          <MenuItem value="modern">Modern Wear</MenuItem>
                          <MenuItem value="office">Office Wear</MenuItem>
                          <MenuItem value="traditional-ethenic">Traditional & Ethnic Wear</MenuItem>
                        </StyledSelect>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel sx={{ fontWeight: 600 }}>Tags & Featured Collections</InputLabel>
                        <StyledSelect
                          multiple
                          label="Tags & Featured Collections"
                          name="tags"
                          value={productData.tags || []}
                          onChange={(e) => {
                            const selected = e.target.value;
                            setProductData((prev) => ({
                              ...prev,
                              tags: selected,
                              collectionName: selected.includes('best-sellers') ? 'best-sellers' : (selected[0] || '')
                            }));
                          }}
                          renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {selected.map((val) => (
                                <Chip key={val} label={val === 'best-sellers' ? 'Best Seller' : val === 'wedding' ? 'Wedding Collection' : val} size="small" sx={{ bgcolor: BRAND_LIGHT, color: BRAND, fontWeight: 700 }} />
                              ))}
                            </Box>
                          )}
                        >
                          <MenuItem value="best-sellers">🔥 Best Seller (Appears in Shop + Best Sellers section)</MenuItem>
                          <MenuItem value="wedding">💍 Wedding Collection</MenuItem>
                          <MenuItem value="recommended">⭐ Recommended</MenuItem>
                          <MenuItem value="new-arrival">✨ New Arrival</MenuItem>
                          <MenuItem value="dharohar">Dharohar</MenuItem>
                          <MenuItem value="aksharam">Aksharam</MenuItem>
                        </StyledSelect>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <StyledTextField label="Description" name="description" value={productData.description} onChange={handleChange} fullWidth multiline rows={3} placeholder="Detailed product summary for customers..." />
                    </Grid>

                    {/* Product Images Box */}
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#334155', mb: 1.5 }}>
                        Product Images (Up to 4)
                      </Typography>
                      <Box
                        component="label"
                        sx={{
                          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                          p: 3, border: `2px dashed ${imageUploading ? '#94a3b8' : BRAND}`, borderRadius: '16px',
                          bgcolor: imageUploading ? '#f8fafc' : BRAND_LIGHT,
                          cursor: imageUploading ? 'not-allowed' : 'pointer', transition: 'all 0.3s',
                          '&:hover': { bgcolor: imageUploading ? '#f8fafc' : '#e0f2fe', borderColor: BRAND_DARK }
                        }}
                      >
                        <Avatar sx={{ bgcolor: '#fff', color: imageUploading ? '#94a3b8' : BRAND, width: 48, height: 48, mb: 1, boxShadow: `0 4px 14px ${BRAND}30` }}>
                          {imageUploading ? <CircularProgress size={22} sx={{ color: '#94a3b8' }} /> : <Upload size={22} />}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: imageUploading ? '#94a3b8' : '#1e293b' }}>
                          {imageUploading ? 'Uploading High-Resolution Images...' : 'Click or Drag & Drop Images Here'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>PNG, JPG, WEBP stored at 100% quality on Cloudinary</Typography>
                        <input type="file" accept="image/*" multiple hidden disabled={imageUploading} onChange={handleImageUpload} />
                      </Box>

                      {imageUploading && (
                        <Box sx={{ mt: 1.5 }}>
                          <LinearProgress variant={uploadProgress > 0 ? 'determinate' : 'indeterminate'} value={uploadProgress} sx={{ borderRadius: 4, height: 6, bgcolor: '#e2e8f0', '& .MuiLinearProgress-bar': { bgcolor: BRAND } }} />
                        </Box>
                      )}

                      {productData.imageUrls.length > 0 && (
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                          {productData.imageUrls.map((image, index) => (
                            <Grid item xs={6} sm={3} key={index}>
                              <Box sx={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', border: `2px solid ${BRAND}40` }}>
                                <img src={getOptimizedCloudinaryUrl(image.imageUrl, 'image')} alt={`Product ${index + 1}`} style={{ width: '100%', height: 110, objectFit: 'cover', display: 'block' }} />
                                <Chip label={`Image #${index + 1}`} size="small" sx={{ position: 'absolute', top: 6, left: 6, bgcolor: BRAND, color: '#fff', fontWeight: 800, fontSize: '0.65rem', height: 20 }} />
                                <IconButton size="small" onClick={() => handleRemoveImage(index)} sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(244,63,94,0.9)', color: '#fff', width: 24, height: 24, '&:hover': { bgcolor: '#f43f5e' } }}>
                                  <Trash2 size={13} />
                                </IconButton>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* ==================== 2. APPROXIMATE PRICING ==================== */}
          <Grid item xs={12}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
              <Card sx={{ borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
                  <SectionHeader step="2" icon={<DollarSign size={20} color={BRAND} />} title="APPROXIMATE PRICING" description="Estimate price range shown to customers based on daily gold rates" />

                  <Grid container spacing={2.5}>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField label="Minimum Approx. Price (₹)" name="minPrice" type="number" value={productData.minPrice} onChange={handleChange} fullWidth required helperText="Displayed as lower range" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField label="Maximum Approx. Price (₹)" name="maxPrice" type="number" value={productData.maxPrice} onChange={handleChange} fullWidth required helperText="Displayed as upper range" />
                    </Grid>
                    <Grid item xs={12}>
                      <StyledTextField label="Price Note" name="priceNote" value={productData.priceNote} onChange={handleChange} fullWidth multiline rows={2} helperText="Important note displayed below pricing for customers" />
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ p: 2, bgcolor: '#f0f9ff', borderRadius: '12px', border: '1px solid #bae6fd', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Info size={20} color="#0284c7" />
                        <Typography variant="body2" sx={{ color: '#0369a1', fontWeight: 600 }}>
                          Preview for Customers: <strong>Approx. ₹{Number(productData.minPrice || 0).toLocaleString('en-IN')} – ₹{Number(productData.maxPrice || 0).toLocaleString('en-IN')}</strong>. Final price is confirmed over WhatsApp based on exact metal weight & gold rate.
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* ==================== 3. PRODUCT DIMENSIONS ==================== */}
          <Grid item xs={12}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
              <Card sx={{ borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <SectionHeader step="3" icon={<Ruler size={20} color={BRAND} />} title="PRODUCT DIMENSIONS" description="Measurements like Height, Width, Inner Diameter, Thickness" />
                    <Button onClick={handleAddDimension} startIcon={<Plus size={16} />} variant="outlined" sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 800, borderColor: BRAND, color: BRAND, '&:hover': { bgcolor: BRAND_LIGHT } }}>
                      Add Dimension
                    </Button>
                  </Box>

                  {productData.dimensionsList.map((dim, idx) => (
                    <Grid container spacing={2} key={idx} alignItems="center" sx={{ mb: 2 }}>
                      <Grid item xs={12} sm={5}>
                        <StyledTextField label="Label (e.g. Height, Width, Ring Diameter)" value={dim.label} onChange={(e) => handleDimensionChange(idx, 'label', e.target.value)} fullWidth />
                      </Grid>
                      <Grid item xs={8} sm={4}>
                        <StyledTextField label="Value" value={dim.value} onChange={(e) => handleDimensionChange(idx, 'value', e.target.value)} fullWidth />
                      </Grid>
                      <Grid item xs={3} sm={2}>
                        <FormControl fullWidth>
                          <InputLabel sx={{ fontWeight: 600 }}>Unit</InputLabel>
                          <StyledSelect label="Unit" value={dim.unit} onChange={(e) => handleDimensionChange(idx, 'unit', e.target.value)}>
                            <MenuItem value="mm">mm</MenuItem>
                            <MenuItem value="cm">cm</MenuItem>
                            <MenuItem value="inch">inch</MenuItem>
                          </StyledSelect>
                        </FormControl>
                      </Grid>
                      <Grid item xs={1} sm={1}>
                        <IconButton onClick={() => handleRemoveDimension(idx)} disabled={productData.dimensionsList.length === 1} sx={{ color: '#f43f5e' }}>
                          <Trash2 size={18} />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* ==================== 4. DIAMOND DETAILS ==================== */}
          <Grid item xs={12}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>
              <Card sx={{ borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <SectionHeader step="4" icon={<Gem size={20} color={BRAND} />} title="DIAMOND DETAILS" description="Dynamic breakdown of center solitaire, halo & accent stones" />
                    <Button onClick={handleAddDiamond} startIcon={<Plus size={16} />} variant="outlined" sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 800, borderColor: BRAND, color: BRAND, '&:hover': { bgcolor: BRAND_LIGHT } }}>
                      Add Diamond
                    </Button>
                  </Box>

                  {productData.diamondDetails.map((dia, idx) => (
                    <Paper key={idx} variant="outlined" sx={{ p: 2.5, mb: 2.5, borderRadius: '14px', bgcolor: '#fafafa', border: '1px solid #f1f5f9' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Chip label={`Diamond Component #${idx + 1}`} size="small" sx={{ bgcolor: BRAND, color: '#fff', fontWeight: 800 }} />
                        <IconButton onClick={() => handleRemoveDiamond(idx)} disabled={productData.diamondDetails.length === 1} sx={{ color: '#f43f5e', py: 0 }}>
                          <Trash2 size={16} />
                        </IconButton>
                      </Box>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <StyledTextField label="Diamond Type" value={dia.diamondType} onChange={(e) => handleDiamondChange(idx, 'diamondType', e.target.value)} fullWidth placeholder="e.g. Natural Diamond, Lab-Grown, Solitaire" />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <StyledTextField label="Diamond Size" value={dia.diamondSize} onChange={(e) => handleDiamondChange(idx, 'diamondSize', e.target.value)} fullWidth placeholder="e.g. 0.30 Pointer / Marquise" />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <StyledTextField label="Diamond Diameter" value={dia.diamondDiameter} onChange={(e) => handleDiamondChange(idx, 'diamondDiameter', e.target.value)} fullWidth placeholder="e.g. 4.2 mm" />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <StyledTextField label="Diamond Weight / Piece" value={dia.weightPerPiece} onChange={(e) => handleDiamondChange(idx, 'weightPerPiece', e.target.value)} fullWidth placeholder="e.g. 0.30 Carat" />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <StyledTextField label="Diamond Pieces" type="number" value={dia.pieces} onChange={(e) => handleDiamondChange(idx, 'pieces', e.target.value)} fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <StyledTextField label="Total Diamond Weight" value={dia.totalWeight} onChange={(e) => handleDiamondChange(idx, 'totalWeight', e.target.value)} fullWidth placeholder="e.g. 0.30 CTW" />
                        </Grid>
                      </Grid>
                    </Paper>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* ==================== 5. METAL DETAILS ==================== */}
          <Grid item xs={12}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }}>
              <Card sx={{ borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <SectionHeader step="5" icon={<Award size={20} color={BRAND} />} title="METAL DETAILS" description="Metal composition, purity & final crafted weight" />
                    <Button onClick={handleAddMetal} startIcon={<Plus size={16} />} variant="outlined" sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 800, borderColor: BRAND, color: BRAND, '&:hover': { bgcolor: BRAND_LIGHT } }}>
                      Add Metal
                    </Button>
                  </Box>

                  {productData.metalDetails.map((met, idx) => (
                    <Grid container spacing={2} key={idx} alignItems="center" sx={{ mb: 2 }}>
                      <Grid item xs={12} sm={3}>
                        <FormControl fullWidth>
                          <InputLabel sx={{ fontWeight: 600 }}>Metal Type</InputLabel>
                          <StyledSelect label="Metal Type" value={met.metalType} onChange={(e) => handleMetalChange(idx, 'metalType', e.target.value)}>
                            <MenuItem value="Gold">Yellow Gold</MenuItem>
                            <MenuItem value="Rose Gold">Rose Gold</MenuItem>
                            <MenuItem value="White Gold">White Gold</MenuItem>
                            <MenuItem value="Platinum">Platinum</MenuItem>
                            <MenuItem value="Silver">Sterling Silver</MenuItem>
                          </StyledSelect>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <StyledTextField label="Purity" value={met.purity} onChange={(e) => handleMetalChange(idx, 'purity', e.target.value)} fullWidth placeholder="e.g. 18K, 14K, 22K, 950" />
                      </Grid>
                      <Grid item xs={8} sm={3}>
                        <StyledTextField label="Final Weight" value={met.finalWeight} onChange={(e) => handleMetalChange(idx, 'finalWeight', e.target.value)} fullWidth placeholder="e.g. 2.50" />
                      </Grid>
                      <Grid item xs={3} sm={2}>
                        <FormControl fullWidth>
                          <InputLabel sx={{ fontWeight: 600 }}>Unit</InputLabel>
                          <StyledSelect label="Unit" value={met.unit} onChange={(e) => handleMetalChange(idx, 'unit', e.target.value)}>
                            <MenuItem value="g">g (Grams)</MenuItem>
                            <MenuItem value="mg">mg</MenuItem>
                            <MenuItem value="oz">oz</MenuItem>
                          </StyledSelect>
                        </FormControl>
                      </Grid>
                      <Grid item xs={1} sm={1}>
                        <IconButton onClick={() => handleRemoveMetal(idx)} disabled={productData.metalDetails.length === 1} sx={{ color: '#f43f5e' }}>
                          <Trash2 size={18} />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* ==================== 6. CHAIN / COMPONENT DETAILS ==================== */}
          <Grid item xs={12}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.6 }}>
              <Card sx={{ borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
                  <SectionHeader step="6" icon={<LinkIcon size={20} color={BRAND} />} title="CHAIN / COMPONENT DETAILS" description="Chain inclusions, lengths, chain weight & chaki weight" />

                  <Grid container spacing={2.5}>
                    <Grid item xs={12} sm={3}>
                      <FormControl fullWidth>
                        <InputLabel sx={{ fontWeight: 600 }}>Includes Chain</InputLabel>
                        <StyledSelect label="Includes Chain" name="includesChain" value={productData.includesChain} onChange={handleChange}>
                          <MenuItem value="Yes">Yes</MenuItem>
                          <MenuItem value="No">No</MenuItem>
                          <MenuItem value="Optional">Optional</MenuItem>
                        </StyledSelect>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <StyledTextField label="Chain Length" name="chainLength" value={productData.chainLength} onChange={handleChange} fullWidth placeholder="e.g. 18 Inches / 45 cm" />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <StyledTextField label="Chain Weight" name="chainWeight" value={productData.chainWeight} onChange={handleChange} fullWidth placeholder="e.g. 1.80 g" />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <StyledTextField label="Chaki Weight" name="chakiWeight" value={productData.chakiWeight} onChange={handleChange} fullWidth placeholder="e.g. 0.40 g" />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* ==================== SAVE PRODUCT BUTTON ==================== */}
          <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2, mb: 6 }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.7 }} style={{ width: '100%', maxWidth: 450 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={!isFormValid || products?.loading}
                sx={{
                  width: '100%',
                  py: 1.8,
                  borderRadius: '14px',
                  bgcolor: BRAND,
                  color: '#fff',
                  fontWeight: 900,
                  fontSize: '1.1rem',
                  letterSpacing: '0.5px',
                  boxShadow: `0 10px 30px ${BRAND}50`,
                  '&:hover': {
                    bgcolor: BRAND_DARK,
                    boxShadow: `0 14px 35px ${BRAND}70`,
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.25s ease'
                }}
              >
                {products?.loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'SAVE PRODUCT'}
              </Button>
              <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 1.5, color: '#64748b', fontWeight: 600 }}>
                Clicking "SAVE PRODUCT" records all 6 component sections into the database.
              </Typography>
            </motion.div>
          </Grid>

        </Grid>
      </form>
    </Box>
  );
};

export default CreateProductForm;
