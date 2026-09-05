import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct } from '../../state/product/Action';
import {
  Box, Grid, TextField, Button, Typography, FormControl,
  InputLabel, Select, MenuItem, Card, CardContent, Avatar,
  Chip, IconButton, CircularProgress, LinearProgress,
  Paper, Switch, FormControlLabel,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Upload, Plus, Trash2, Package, Tag,
  DollarSign, ChevronRight, Gem, Ruler, Award,
  Link as LinkIcon, Info, Eye,
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

const initialDimension = { label: '', value: '', unit: 'mm' };
const initialDiamond = { diamondType: '', diamondName: '', diamondDiameter: '', weightPerPiece: '', pieces: 1, totalWeight: '' };
const initialMetal = { metalType: 'Gold', purity: '18K', finalWeight: '', unit: 'g' };
const initialSpec = { label: '', value: '' };

const CreateProductForm = () => {
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [productData, setProductData] = useState({
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
    occasion: [],
    collectionName: '',
    tags: [],
    color: [],
    minPrice: 0,
    maxPrice: 0,
    priceNote: 'Price varies according to daily gold rate and diamond specifications.',
    price: 0,
    discountedPrice: 0,
    dimensionsList: [{ ...initialDimension }],
    diamondDetails: [{ ...initialDiamond }],
    metalDetails: [{ ...initialMetal }],
    includesChain: 'No',
    chainLength: '',
    chainWeight: '',
    chakiWeight: '',
    additionalSpecifications: [],
    showDiamondDetails: false,
    showMetalDetails: false,
    showWeightDetails: false,
    ringSize: '',
    pendantSize: '',
    braceletLength: '',
  });

  const dispatch = useDispatch();
  const { products } = useSelector((store) => store);

  // Generic field change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSwitchChange = (name) => (e) => {
    setProductData((prev) => ({ ...prev, [name]: e.target.checked }));
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

  // Dimensions
  const handleDimensionChange = (index, field, value) => {
    const updated = [...productData.dimensionsList];
    updated[index] = { ...updated[index], [field]: value };
    setProductData((prev) => ({ ...prev, dimensionsList: updated }));
  };
  const handleAddDimension = () => setProductData((prev) => ({ ...prev, dimensionsList: [...prev.dimensionsList, { ...initialDimension }] }));
  const handleRemoveDimension = (index) => setProductData((prev) => ({ ...prev, dimensionsList: prev.dimensionsList.filter((_, i) => i !== index) }));

  // Diamonds
  const handleDiamondChange = (index, field, value) => {
    const updated = [...productData.diamondDetails];
    updated[index] = { ...updated[index], [field]: value };
    setProductData((prev) => ({ ...prev, diamondDetails: updated }));
  };
  const handleAddDiamond = () => setProductData((prev) => ({ ...prev, diamondDetails: [...prev.diamondDetails, { ...initialDiamond }] }));
  const handleRemoveDiamond = (index) => setProductData((prev) => ({ ...prev, diamondDetails: prev.diamondDetails.filter((_, i) => i !== index) }));

  // Metals
  const handleMetalChange = (index, field, value) => {
    const updated = [...productData.metalDetails];
    updated[index] = { ...updated[index], [field]: value };
    setProductData((prev) => ({ ...prev, metalDetails: updated }));
  };
  const handleAddMetal = () => setProductData((prev) => ({ ...prev, metalDetails: [...prev.metalDetails, { ...initialMetal }] }));
  const handleRemoveMetal = (index) => setProductData((prev) => ({ ...prev, metalDetails: prev.metalDetails.filter((_, i) => i !== index) }));

  // Additional Specifications
  const handleSpecChange = (index, field, value) => {
    const updated = [...productData.additionalSpecifications];
    updated[index] = { ...updated[index], [field]: value };
    setProductData((prev) => ({ ...prev, additionalSpecifications: updated }));
  };
  const handleAddSpec = () => setProductData((prev) => ({ ...prev, additionalSpecifications: [...prev.additionalSpecifications, { ...initialSpec }] }));
  const handleRemoveSpec = (index) => setProductData((prev) => ({ ...prev, additionalSpecifications: prev.additionalSpecifications.filter((_, i) => i !== index) }));

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const min = Number(productData.minPrice);
    const max = Number(productData.maxPrice);
    if (min > 0 && max > 0 && min > max) {
      alert('Minimum price cannot be greater than maximum price.');
      return;
    }

    const finalData = {
      ...productData,
      price: min || productData.price,
      discountedPrice: min || productData.discountedPrice,
      metalType: productData.metalDetails[0]?.metalType || 'Gold',
      metalPurity: productData.metalDetails[0]?.purity || '18K',
      metalWeight: parseFloat(productData.metalDetails[0]?.finalWeight || 0),
      primaryStoneType: productData.diamondDetails[0]?.diamondType || 'Diamond',
    };

    dispatch(createProduct(finalData));
    setProductData({
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
      occasion: [],
      collectionName: '',
      tags: [],
      color: [],
      minPrice: 0,
      maxPrice: 0,
      priceNote: 'Price varies according to daily gold rate and diamond specifications.',
      price: 0,
      discountedPrice: 0,
      dimensionsList: [{ ...initialDimension }],
      diamondDetails: [{ ...initialDiamond }],
      metalDetails: [{ ...initialMetal }],
      includesChain: 'No',
      chainLength: '',
      chainWeight: '',
      chakiWeight: '',
      additionalSpecifications: [],
      showDiamondDetails: false,
      showMetalDetails: false,
      showWeightDetails: false,
      ringSize: '',
      pendantSize: '',
      braceletLength: '',
    });
  };

  const isFormValid =
    productData.title.trim() !== '' &&
    productData.topLevelCategory !== '' &&
    Number(productData.minPrice) >= 0;
  const prodType = productData.secondLevelCategory;

  // Conditional field visibility based on sub-category
  const isRing = ['rings', 'bangles'].includes(prodType);
  const isBracelet = prodType === 'bracelets';
  const hasChain = ['necklaces', 'pendants', 'mangalsutra', 'chains', 'lockets', 'anklets'].includes(prodType);
  const hasPendantSize = ['pendants', 'mangalsutra', 'lockets'].includes(prodType);

  const stylesByType = {
    rings: [
      { value: 'ring', label: 'Ring' },
      { value: 'engagement-ring', label: 'Engagement Ring' },
      { value: 'solitaire-ring', label: 'Solitaire Ring' },
      { value: 'eternity-ring', label: 'Eternity Ring' },
      { value: 'cocktail-ring', label: 'Cocktail Ring' },
      { value: 'pearl-ring', label: 'Pearl Ring' },
      { value: 'couple-ring', label: 'Couple Rings' },
    ],
    earrings: [
      { value: 'earring', label: 'Earring (General)' },
      { value: 'diamond-studs', label: 'Diamond Studs / Studs' },
      { value: 'hoops-huggies', label: 'Hoops & Huggies' },
      { value: 'dangle-drops', label: 'Dangle & Drops' },
      { value: 'chandeliers', label: 'Chandeliers' },
      { value: 'cuffs', label: 'Ear Cuffs' },
      { value: 'climbers', label: 'Ear Climbers' },
      { value: 'jhumka', label: 'Jhumkas' },
    ],
    necklaces: [
      { value: 'necklace', label: 'Necklace' },
      { value: 'choker', label: 'Choker' },
      { value: 'statement-necklace', label: 'Statement Necklace' },
      { value: 'layered-necklace', label: 'Layered Necklace' },
      { value: 'lariat', label: 'Lariat' },
    ],
    pendants: [
      { value: 'pendant', label: 'Pendant' },
      { value: 'solitaire-pendant', label: 'Solitaire Pendant' },
      { value: 'gemstone-pendant', label: 'Gemstone Pendant' },
      { value: 'initial-pendant', label: 'Initial & Alphabet Pendant' },
    ],
    mangalsutra: [
      { value: 'mangal-sutra', label: 'Mangal Sutra' },
      { value: 'solitaire-mangalsutra', label: 'Solitaire Mangalsutra' },
      { value: 'modern-mangalsutra', label: 'Modern Bracelet Mangalsutra' },
    ],
    bracelets: [
      { value: 'bracelet', label: 'Bracelet' },
      { value: 'tennis-bracelets', label: 'Tennis Bracelets' },
      { value: 'chain-bracelets', label: 'Chain Bracelets' },
      { value: 'cuff-bracelets', label: 'Cuff Bracelets' },
      { value: 'charm-bracelets', label: 'Charm Bracelets' },
    ],
    bangles: [
      { value: 'bangle', label: 'Bangle' },
      { value: 'kada', label: 'Kada' },
      { value: 'stackable-bangle', label: 'Stackable Bangle' },
    ],
    chains: [
      { value: 'chain', label: 'Chain' },
      { value: 'gold-chain', label: 'Gold Chain' },
      { value: 'rope-chain', label: 'Rope Chain' },
    ],
    lockets: [
      { value: 'locket', label: 'Locket' },
      { value: 'photo-locket', label: 'Photo Locket' },
    ],
    anklets: [
      { value: 'anklet', label: 'Anklet' },
    ],
    'nose-pins': [
      { value: 'nose-pin', label: 'Nose Pin' },
    ],
    other: [
      { value: 'brooch', label: 'Brooch' },
      { value: 'coin', label: 'Gold / Silver Coin' },
      { value: 'accessory', label: 'Other Accessory' },
    ],
  };

  const filteredStyles = stylesByType[prodType] || [];

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Box sx={{ mb: 4, pb: 3, borderBottom: '1px solid #e2e8f0' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Admin Panel
            </Typography>
            <ChevronRight size={14} color="#64748b" />
            <Typography variant="caption" sx={{ color: BRAND, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Add New Product
            </Typography>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a', letterSpacing: '-1px' }}>
            ADD NEW PRODUCT
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mt: 0.5 }}>
            Structured product catalog entry for Loupe Jewellery
          </Typography>
        </Box>
      </motion.div>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3.5}>

          {/* ===== 1. BASIC INFORMATION ===== */}
          <Grid item xs={12}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
              <Card sx={{ borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
                  <SectionHeader step="1" icon={<Package size={20} color={BRAND} />} title="BASIC INFORMATION" description="Product name, code, category, description, images and status" />
                  <Grid container spacing={2.5}>
                    <Grid item xs={12} sm={8}>
                      <StyledTextField label="Product Name *" name="title" value={productData.title} onChange={handleChange} fullWidth required placeholder="e.g. Diamond Bracelet — Baguette Cut 18KT" />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <StyledTextField label="Product Code / SKU" name="productCode" value={productData.productCode} onChange={handleChange} fullWidth placeholder="e.g. MJB2605028" />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth>
                        <InputLabel sx={{ fontWeight: 600 }}>Category (Material) *</InputLabel>
                        <StyledSelect label="Category (Material) *" name="topLevelCategory" value={productData.topLevelCategory} onChange={handleChange} required>
                          <MenuItem value="diamond">Diamond Jewelry</MenuItem>
                          <MenuItem value="gold">Gold Jewelry</MenuItem>
                          <MenuItem value="platinum">Platinum Jewelry</MenuItem>
                          <MenuItem value="gemstone">Gemstone Jewelry</MenuItem>
                          <MenuItem value="silver">Silver Jewelry</MenuItem>
                        </StyledSelect>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth>
                        <InputLabel sx={{ fontWeight: 600 }}>Sub Category (Item Type)</InputLabel>
                        <StyledSelect label="Sub Category (Item Type)" name="secondLevelCategory" value={productData.secondLevelCategory} onChange={handleChange}>
                          <MenuItem value="rings">Rings</MenuItem>
                          <MenuItem value="earrings">Earrings</MenuItem>
                          <MenuItem value="necklaces">Necklaces</MenuItem>
                          <MenuItem value="pendants">Pendants</MenuItem>
                          <MenuItem value="mangalsutra">Mangalsutra</MenuItem>
                          <MenuItem value="bracelets">Bracelets</MenuItem>
                          <MenuItem value="bangles">Bangles</MenuItem>
                          <MenuItem value="chains">Chains</MenuItem>
                          <MenuItem value="lockets">Lockets</MenuItem>
                          <MenuItem value="anklets">Anklets</MenuItem>
                          <MenuItem value="nose-pins">Nose Pins</MenuItem>
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
                        <InputLabel sx={{ fontWeight: 600 }}>Product Status</InputLabel>
                        <StyledSelect label="Product Status" name="status" value={productData.status} onChange={handleChange}>
                          <MenuItem value="active">Active (Visible in Store)</MenuItem>
                          <MenuItem value="draft">Draft (Hidden)</MenuItem>
                          <MenuItem value="inactive">Inactive</MenuItem>
                          <MenuItem value="out_of_stock">Out of Stock</MenuItem>
                        </StyledSelect>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel sx={{ fontWeight: 600 }}>Occasion</InputLabel>
                        <StyledSelect
                          multiple
                          label="Occasion"
                          name="occasion"
                          value={Array.isArray(productData.occasion) ? productData.occasion : (productData.occasion ? [productData.occasion] : [])}
                          onChange={(e) => {
                            const { value } = e.target;
                            setProductData((prev) => ({
                              ...prev,
                              occasion: typeof value === 'string' ? value.split(',') : value,
                            }));
                          }}
                          renderValue={(selected) => {
                            const labelsMap = {
                              'bridal': 'Bridal Wear',
                              'casual': 'Casual Wear',
                              'engagement': 'Engagement',
                              'modern': 'Modern Wear',
                              'office': 'Office Wear',
                              'traditional-ethenic': 'Traditional & Ethnic Wear'
                            };
                            const selectedArr = Array.isArray(selected) ? selected : [selected];
                            return (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selectedArr.map((val) => (
                                  <Chip key={val} label={labelsMap[val] || val} size="small" sx={{ bgcolor: BRAND_LIGHT, color: BRAND, fontWeight: 700 }} />
                                ))}
                              </Box>
                            );
                          }}
                        >
                          <MenuItem value="bridal">Bridal Wear</MenuItem>
                          <MenuItem value="casual">Casual Wear</MenuItem>
                          <MenuItem value="engagement">Engagement</MenuItem>
                          <MenuItem value="modern">Modern Wear</MenuItem>
                          <MenuItem value="office">Office Wear</MenuItem>
                          <MenuItem value="traditional-ethenic">Traditional &amp; Ethnic Wear</MenuItem>
                        </StyledSelect>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel sx={{ fontWeight: 600 }}>Tags &amp; Featured Collections</InputLabel>
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
                              collectionName: selected.includes('best-sellers') ? 'best-sellers' : (selected[0] || ''),
                            }));
                          }}
                          renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {selected.map((val) => (
                                <Chip key={val} label={val} size="small" sx={{ bgcolor: BRAND_LIGHT, color: BRAND, fontWeight: 700 }} />
                              ))}
                            </Box>
                          )}
                        >
                          <MenuItem value="best-sellers">🔥 Best Seller</MenuItem>
                          <MenuItem value="wedding">💍 Wedding Collection</MenuItem>
                          <MenuItem value="recommended">⭐ Recommended</MenuItem>
                          <MenuItem value="new-arrival">✨ New Arrival</MenuItem>
                          <MenuItem value="dharohar">Dharohar</MenuItem>
                          <MenuItem value="aksharam">Aksharam</MenuItem>
                        </StyledSelect>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <StyledTextField label="Product Description" name="description" value={productData.description} onChange={handleChange} fullWidth multiline rows={3} placeholder="Detailed product description for customers…" />
                    </Grid>

                    {/* Product Images */}
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
                          '&:hover': { bgcolor: imageUploading ? '#f8fafc' : '#e0f2fe', borderColor: BRAND_DARK },
                        }}
                      >
                        <Avatar sx={{ bgcolor: '#fff', color: imageUploading ? '#94a3b8' : BRAND, width: 48, height: 48, mb: 1, boxShadow: `0 4px 14px ${BRAND}30` }}>
                          {imageUploading ? <CircularProgress size={22} sx={{ color: '#94a3b8' }} /> : <Upload size={22} />}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: imageUploading ? '#94a3b8' : '#1e293b' }}>
                          {imageUploading ? 'Uploading Images…' : 'Click or Drag & Drop Images Here'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>PNG, JPG, WEBP — stored on Cloudinary</Typography>
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

          {/* ===== 2. APPROXIMATE PRICING ===== */}
          <Grid item xs={12}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
              <Card sx={{ borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
                  <SectionHeader step="2" icon={<DollarSign size={20} color={BRAND} />} title="APPROXIMATE PRICING" description="Price range shown to customers — never an exact selling price" />
                  <Grid container spacing={2.5}>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        label="Minimum Approx. Price (₹)"
                        name="minPrice"
                        type="number"
                        inputProps={{ min: 0 }}
                        value={productData.minPrice}
                        onChange={handleChange}
                        fullWidth
                        helperText="Displayed as lower range"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        label="Maximum Approx. Price (₹)"
                        name="maxPrice"
                        type="number"
                        inputProps={{ min: 0 }}
                        value={productData.maxPrice}
                        onChange={handleChange}
                        fullWidth
                        helperText="Displayed as upper range"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <StyledTextField label="Price Note" name="priceNote" value={productData.priceNote} onChange={handleChange} fullWidth multiline rows={2} helperText="Displayed below price on customer page" />
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ p: 2, bgcolor: '#f0f9ff', borderRadius: '12px', border: '1px solid #bae6fd', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Info size={20} color="#0284c7" />
                        <Typography variant="body2" sx={{ color: '#0369a1', fontWeight: 600 }}>
                          Customer sees: <strong>Approx. ₹{Number(productData.minPrice || 0).toLocaleString('en-IN')} – ₹{Number(productData.maxPrice || 0).toLocaleString('en-IN')}</strong>. Exact price is shared over WhatsApp.
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* ===== 3. PRODUCT DIMENSIONS ===== */}
          <Grid item xs={12}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
              <Card sx={{ borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <SectionHeader step="3" icon={<Ruler size={20} color={BRAND} />} title="PRODUCT DIMENSIONS" description="Height, Width, Inner Diameter, Thickness, etc." />
                    <Button onClick={handleAddDimension} startIcon={<Plus size={16} />} variant="outlined" sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 800, borderColor: BRAND, color: BRAND, '&:hover': { bgcolor: BRAND_LIGHT }, flexShrink: 0 }}>
                      Add Dimension
                    </Button>
                  </Box>
                  {productData.dimensionsList.map((dim, idx) => (
                    <Grid container spacing={2} key={idx} alignItems="center" sx={{ mb: 2 }}>
                      <Grid item xs={12} sm={5}>
                        <StyledTextField label="Label (e.g. Length, Width)" value={dim.label} onChange={(e) => handleDimensionChange(idx, 'label', e.target.value)} fullWidth />
                      </Grid>
                      <Grid item xs={8} sm={4}>
                        <StyledTextField label="Value" value={dim.value} onChange={(e) => handleDimensionChange(idx, 'value', e.target.value)} fullWidth />
                      </Grid>
                      <Grid item xs={3} sm={2}>
                        <FormControl fullWidth>
                          <InputLabel sx={{ fontWeight: 600 }}>Unit</InputLabel>
                          <StyledSelect label="Unit" value={dim.unit} onChange={(e) => handleDimensionChange(idx, 'unit', e.target.value)}>
                            <MenuItem value="mm">MM</MenuItem>
                            <MenuItem value="cm">cm</MenuItem>
                            <MenuItem value="inch">inch</MenuItem>
                            <MenuItem value="g">g</MenuItem>
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

          {/* ===== 4. DIAMOND SPECIFICATIONS ===== */}
          <Grid item xs={12}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
              <Card sx={{ borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <SectionHeader step="4" icon={<Gem size={20} color={BRAND} />} title="DIAMOND SPECIFICATIONS" description="Center solitaire, halo stones, baguettes, accent diamonds" />
                    <Button onClick={handleAddDiamond} startIcon={<Plus size={16} />} variant="outlined" sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 800, borderColor: BRAND, color: BRAND, '&:hover': { bgcolor: BRAND_LIGHT }, flexShrink: 0 }}>
                      Add Diamond
                    </Button>
                  </Box>
                  {productData.diamondDetails.map((dia, idx) => (
                    <Paper key={idx} variant="outlined" sx={{ p: 2.5, mb: 2.5, borderRadius: '14px', bgcolor: '#fafafa', border: '1px solid #f1f5f9' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Chip label={`Diamond #${idx + 1}`} size="small" sx={{ bgcolor: BRAND, color: '#fff', fontWeight: 800 }} />
                        <IconButton onClick={() => handleRemoveDiamond(idx)} disabled={productData.diamondDetails.length === 1} sx={{ color: '#f43f5e', py: 0 }}>
                          <Trash2 size={16} />
                        </IconButton>
                      </Box>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <StyledTextField label="Diamond Type" value={dia.diamondType} onChange={(e) => handleDiamondChange(idx, 'diamondType', e.target.value)} fullWidth placeholder="e.g. Baguette, Round, Solitaire" />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <StyledTextField label="Diamond Name / Size" value={dia.diamondName || dia.diamondSize || ''} onChange={(e) => handleDiamondChange(idx, 'diamondName', e.target.value)} fullWidth placeholder="e.g. Marquise, Round Brilliant, Solitaire" />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <StyledTextField label="Diamond Diameter" value={dia.diamondDiameter} onChange={(e) => handleDiamondChange(idx, 'diamondDiameter', e.target.value)} fullWidth placeholder="e.g. 4.2 mm" />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <StyledTextField label="Weight / Piece (Carat)" value={dia.weightPerPiece} onChange={(e) => handleDiamondChange(idx, 'weightPerPiece', e.target.value)} fullWidth placeholder="e.g. 0.047" />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <StyledTextField label="Number of Pieces" type="number" inputProps={{ min: 1 }} value={dia.pieces} onChange={(e) => handleDiamondChange(idx, 'pieces', e.target.value)} fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <StyledTextField label="Total Diamond Weight (Carat)" value={dia.totalWeight} onChange={(e) => handleDiamondChange(idx, 'totalWeight', e.target.value)} fullWidth placeholder="e.g. 0.28 CTW" />
                        </Grid>
                      </Grid>
                    </Paper>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* ===== 5. METAL SPECIFICATIONS ===== */}
          <Grid item xs={12}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.25 }}>
              <Card sx={{ borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <SectionHeader step="5" icon={<Award size={20} color={BRAND} />} title="METAL SPECIFICATIONS" description="Metal composition, purity and final crafted weight" />
                    <Button onClick={handleAddMetal} startIcon={<Plus size={16} />} variant="outlined" sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 800, borderColor: BRAND, color: BRAND, '&:hover': { bgcolor: BRAND_LIGHT }, flexShrink: 0 }}>
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
                        <StyledTextField label="Purity (e.g. 18KT, 22K)" value={met.purity} onChange={(e) => handleMetalChange(idx, 'purity', e.target.value)} fullWidth />
                      </Grid>
                      <Grid item xs={8} sm={3}>
                        <StyledTextField label="Final Weight" value={met.finalWeight} onChange={(e) => handleMetalChange(idx, 'finalWeight', e.target.value)} fullWidth placeholder="e.g. 3.68" />
                      </Grid>
                      <Grid item xs={3} sm={2}>
                        <FormControl fullWidth>
                          <InputLabel sx={{ fontWeight: 600 }}>Unit</InputLabel>
                          <StyledSelect label="Unit" value={met.unit} onChange={(e) => handleMetalChange(idx, 'unit', e.target.value)}>
                            <MenuItem value="g">GM</MenuItem>
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

          {/* ===== 6. SIZE & COMPONENT DETAILS ===== */}
          <Grid item xs={12}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
              <Card sx={{ borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
                  <SectionHeader step="6" icon={<LinkIcon size={20} color={BRAND} />} title="SIZE & COMPONENT DETAILS" description="Ring/Bangle size, chain details, pendant size — shown based on product type" />
                  <Grid container spacing={2.5}>

                    {/* Ring / Bangle Size — only for rings and bangles */}
                    {isRing && (
                      <Grid item xs={12} sm={6}>
                        <StyledTextField
                          label={prodType === 'bangles' ? 'Bangle Size / Diameter' : 'Ring Size (e.g. 16, 17, 18)'}
                          name="ringSize"
                          value={productData.ringSize}
                          onChange={handleChange}
                          fullWidth
                          placeholder={prodType === 'bangles' ? 'e.g. 2.6 inches / 58 mm' : 'e.g. 16 or 17 or Free Size'}
                          helperText={prodType === 'bangles' ? 'Inner diameter of bangle' : 'Standard ring size number'}
                        />
                      </Grid>
                    )}

                    {/* Pendant / Locket Size — only for pendants, mangalsutra, lockets */}
                    {hasPendantSize && (
                      <Grid item xs={12} sm={6}>
                        <StyledTextField
                          label="Pendant / Piece Size"
                          name="pendantSize"
                          value={productData.pendantSize || ''}
                          onChange={handleChange}
                          fullWidth
                          placeholder="e.g. 15mm x 10mm"
                          helperText="Height × Width of the pendant/piece"
                        />
                      </Grid>
                    )}

                    {/* Bracelet Length — only for bracelets */}
                    {isBracelet && (
                      <Grid item xs={12} sm={6}>
                        <StyledTextField
                          label="Bracelet Length"
                          name="braceletLength"
                          value={productData.braceletLength || ''}
                          onChange={handleChange}
                          fullWidth
                          placeholder="e.g. 7 Inches / 18 cm"
                          helperText="Total length of the bracelet"
                        />
                      </Grid>
                    )}

                    {/* Chain details — only for items that typically have chains */}
                    {hasChain && (
                      <>
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
                          <StyledTextField label="Chain / Piece Length" name="chainLength" value={productData.chainLength} onChange={handleChange} fullWidth placeholder="e.g. 18 Inches / 45 cm" />
                        </Grid>
                      </>
                    )}

                    <Grid item xs={12} sm={hasChain ? 3 : 6}>
                      <StyledTextField label="Chain Weight" name="chainWeight" value={productData.chainWeight} onChange={handleChange} fullWidth placeholder="e.g. 1.80 g" />
                    </Grid>
                    <Grid item xs={12} sm={hasChain ? 3 : 6}>
                      <StyledTextField label="Chaki Weight" name="chakiWeight" value={productData.chakiWeight} onChange={handleChange} fullWidth placeholder="e.g. 0.40 g" />
                    </Grid>

                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* ===== 7. ADDITIONAL SPECIFICATIONS ===== */}
          <Grid item xs={12}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.35 }}>
              <Card sx={{ borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <SectionHeader step="7" icon={<Tag size={20} color={BRAND} />} title="ADDITIONAL SPECIFICATIONS" description="Flexible key-value pairs for any extra product information" />
                    <Button onClick={handleAddSpec} startIcon={<Plus size={16} />} variant="outlined" sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 800, borderColor: BRAND, color: BRAND, '&:hover': { bgcolor: BRAND_LIGHT }, flexShrink: 0 }}>
                      Add Specification
                    </Button>
                  </Box>
                  {productData.additionalSpecifications.length === 0 && (
                    <Typography variant="body2" sx={{ color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', py: 2 }}>
                      No additional specifications. Click "Add Specification" to add custom fields.
                    </Typography>
                  )}
                  {productData.additionalSpecifications.map((spec, idx) => (
                    <Grid container spacing={2} key={idx} alignItems="center" sx={{ mb: 2 }}>
                      <Grid item xs={12} sm={5}>
                        <StyledTextField label="Specification Name" value={spec.label} onChange={(e) => handleSpecChange(idx, 'label', e.target.value)} fullWidth placeholder="e.g. Setting Type, Certification" />
                      </Grid>
                      <Grid item xs={11} sm={6}>
                        <StyledTextField label="Specification Value" value={spec.value} onChange={(e) => handleSpecChange(idx, 'value', e.target.value)} fullWidth placeholder="e.g. Prong Set, SGL Certified" />
                      </Grid>
                      <Grid item xs={1} sm={1}>
                        <IconButton onClick={() => handleRemoveSpec(idx)} sx={{ color: '#f43f5e' }}>
                          <Trash2 size={18} />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* ===== 8. CUSTOMER VISIBILITY ===== */}
          <Grid item xs={12}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>
              <Card sx={{ borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
                  <SectionHeader step="8" icon={<Eye size={20} color={BRAND} />} title="CUSTOMER VISIBILITY" description="Control which technical details are shown to customers on the product page" />
                  <Box sx={{ p: 2, bgcolor: '#fffbeb', borderRadius: '12px', border: '1px solid #fde68a', mb: 3, display: 'flex', gap: 1.5 }}>
                    <Info size={18} color="#d97706" style={{ flexShrink: 0, marginTop: 2 }} />
                    <Typography variant="body2" sx={{ color: '#92400e', fontWeight: 600 }}>
                      By default, diamond weight and metal weight are hidden from customers. Enable below to show these on the product details page.
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ p: 2.5, border: '1px solid #e2e8f0', borderRadius: '14px', bgcolor: productData.showDiamondDetails ? '#f0f9ff' : '#fafafa' }}>
                        <FormControlLabel
                          control={<Switch checked={productData.showDiamondDetails} onChange={handleSwitchChange('showDiamondDetails')} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: BRAND }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: BRAND } }} />}
                          label={<Typography sx={{ fontWeight: 700, color: '#334155', fontSize: '0.9rem' }}>Show Diamond Details</Typography>}
                        />
                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.5 }}>
                          Diamond type, size, pieces visible to customers
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ p: 2.5, border: '1px solid #e2e8f0', borderRadius: '14px', bgcolor: productData.showMetalDetails ? '#f0f9ff' : '#fafafa' }}>
                        <FormControlLabel
                          control={<Switch checked={productData.showMetalDetails} onChange={handleSwitchChange('showMetalDetails')} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: BRAND }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: BRAND } }} />}
                          label={<Typography sx={{ fontWeight: 700, color: '#334155', fontSize: '0.9rem' }}>Show Metal Details</Typography>}
                        />
                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.5 }}>
                          Metal type and purity visible to customers
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ p: 2.5, border: '1px solid #e2e8f0', borderRadius: '14px', bgcolor: productData.showWeightDetails ? '#f0f9ff' : '#fafafa' }}>
                        <FormControlLabel
                          control={<Switch checked={productData.showWeightDetails} onChange={handleSwitchChange('showWeightDetails')} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: BRAND }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: BRAND } }} />}
                          label={<Typography sx={{ fontWeight: 700, color: '#334155', fontSize: '0.9rem' }}>Show Weight Details</Typography>}
                        />
                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.5 }}>
                          Final weights (gold/diamond) visible to customers
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* ===== SAVE PRODUCT BUTTON ===== */}
          <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2, mb: 6 }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.45 }} style={{ width: '100%', maxWidth: 450 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={!isFormValid || products?.loading}
                sx={{
                  width: '100%', py: 1.8, borderRadius: '14px',
                  bgcolor: BRAND, color: '#fff', fontWeight: 900,
                  fontSize: '1.1rem', letterSpacing: '0.5px',
                  boxShadow: `0 10px 30px ${BRAND}50`,
                  '&:hover': { bgcolor: BRAND_DARK, boxShadow: `0 14px 35px ${BRAND}70`, transform: 'translateY(-2px)' },
                  transition: 'all 0.25s ease',
                }}
              >
                {products?.loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : '💎 SAVE PRODUCT'}
              </Button>
              <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 1.5, color: '#64748b', fontWeight: 600 }}>
                All 8 sections will be saved to the database.
              </Typography>
            </motion.div>
          </Grid>

        </Grid>
      </form>
    </Box>
  );
};

export default CreateProductForm;
