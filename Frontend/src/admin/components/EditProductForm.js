import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProduct, findProductById } from '../../state/product/Action';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box, Grid, TextField, Button, Typography, FormControl,
  InputLabel, Select, MenuItem, Card, CardContent, Avatar,
  Divider, Chip, IconButton, CircularProgress, LinearProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Upload, Plus, Trash2, Package, Tag, Image, Layers, DollarSign, BarChart3, ChevronRight, Gem, Ruler, Award, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { uploadMultipleImagesViaBackend, deleteAssetViaBackend, getOptimizedCloudinaryUrl } from '../../utils/cloudinaryUtils';

const BRAND = '#3c7399';
const BRAND_LIGHT = '#f0f9ff';
const BRAND_DARK = '#5fa0b8';

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

const SectionHeader = ({ icon, title, description }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
    <Avatar sx={{ bgcolor: BRAND_LIGHT, color: BRAND, width: 44, height: 44, borderRadius: '12px' }}>
      {icon}
    </Avatar>
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#111827', letterSpacing: '-0.3px' }}>{title}</Typography>
      <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>{description}</Typography>
    </Box>
  </Box>
);

const initialSizes = [{ weight: 'g', size: 'MM', stock: 0 }];

const EditProductForm = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [productData, setProductData] = useState({
    imageUrls: [],
    title: '',
    brand: 'Loupe Jeweler',
    color: [],
    discountedPrice: 0,
    price: 0,
    discountPercent: 0.0,
    minPrice: 0,
    maxPrice: 0,
    description: '',
    details: '',
    occasion: '',
    quantity: 1,
    collectionName: '',
    type: '',
    sizes: initialSizes,
    topLevelCategory: '',
    secondLevelCategory: '',
    thirdLevelCategory: '',
    metalType: '',
    metalPurity: '',
    metalWeight: '',
    hallmarkCertification: '',
    metalColor: '',
    primaryStoneType: '',
    stoneShape: '',
    stoneWeight: '',
    ringSize: '',
    chainLength: '',
    pendantSize: '',
    dimensions: '',
    totalWeight: '',
  });

  const [imageUploading, setImageUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const dispatch = useDispatch();
  const { products } = useSelector((store) => store);

  useEffect(() => {
    if (productId) {
      dispatch(findProductById({ productId }));
    }
  }, [productId, dispatch]);

  useEffect(() => {
    if (products?.product && products.product._id === productId) {
      const p = products.product;
      setProductData({
        imageUrls: Array.isArray(p.imageUrls) ? p.imageUrls : [],
        title: p.title || '',
        brand: p.brand || 'Loupe Jeweler',
        color: Array.isArray(p.color) ? p.color : (p.color ? [p.color] : []),
        discountedPrice: p.discountedPrice || 0,
        price: p.price || 0,
        discountPercent: p.discountPercent || 0,
        minPrice: p.minPrice || 0,
        maxPrice: p.maxPrice || 0,
        description: p.description || '',
        details: p.details || '',
        occasion: p.occasion || '',
        quantity: p.quantity || 1,
        collectionName: p.collectionName || '',
        type: p.type || '',
        sizes: Array.isArray(p.sizes) && p.sizes.length > 0 ? p.sizes : initialSizes,
        topLevelCategory: p.category?.parentCategory?.parentCategory?.name || p.topLevelCategory || '',
        secondLevelCategory: p.category?.parentCategory?.name || p.secondLevelCategory || '',
        thirdLevelCategory: p.category?.name || p.thirdLevelCategory || '',
        metalType: p.metalType || '',
        metalPurity: p.metalPurity || '',
        metalWeight: p.metalWeight || '',
        hallmarkCertification: p.hallmarkCertification || '',
        metalColor: p.metalColor || '',
        primaryStoneType: p.primaryStoneType || '',
        stoneShape: p.stoneShape || '',
        stoneWeight: p.stoneWeight || '',
        ringSize: p.ringSize || '',
        chainLength: p.chainLength || '',
        pendantSize: p.pendantSize || '',
        dimensions: p.dimensions || '',
        totalWeight: p.totalWeight || '',
      });
    }
  }, [products?.product, productId]);

  const handleChange = async (e, index, type) => {
    const { name, value, files } = e.target;

    if (type === 'imageUrls' && files && files.length > 0) {
      const selectedFiles = Array.from(files).filter((f) => f.type?.startsWith('image/')).slice(0, 4);
      if (selectedFiles.length === 0) return;

      setImageUploading(true);
      setUploadProgress(0);
      try {
        // Upload via backend → stored at quality:100 on Cloudinary
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
      return;
    }

    if (type === 'sizes') {
      const updatedSizes = [...productData.sizes];
      updatedSizes[index] = { ...updatedSizes[index], [name]: value };
      setProductData({ ...productData, sizes: updatedSizes });
    } else {
      setProductData({ ...productData, [name]: value });
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

  const handleAddSize = () => {
    setProductData((prev) => ({ ...prev, sizes: [...prev.sizes, { weight: 'g', size: 'MM', stock: 0 }] }));
  };

  const handleRemoveSize = (idx) => {
    setProductData((prev) => ({ ...prev, sizes: prev.sizes.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const computedDiscount = productData.price > 0 ? Math.floor(((productData.price - productData.discountedPrice) / productData.price) * 100) : 0;
    const finalData = { ...productData, discountPercent: computedDiscount };

    await dispatch(updateProduct({ productId, updates: finalData }));

    setTimeout(() => {
      navigate('/admin/products');
    }, 1500);
  };

  const isFormValid = productData.title !== '' && productData.price > 0 && productData.quantity > 0 && productData.description !== '' && productData.topLevelCategory !== '';

  const prodType = productData.secondLevelCategory;
  const specStyle = productData.thirdLevelCategory;
  const hasCategorySelected = prodType !== '' || specStyle !== '' || productData.topLevelCategory !== '';

  const isRing = prodType === 'rings' || prodType === 'wedding' || ['ring', 'engagement-ring', 'pearl-ring', 'bridal-ring', 'couple-ring'].includes(specStyle);
  const isNecklace = prodType === 'nacklaces' || ['chain', 'mangal-sutra', 'necklace', 'pendant', 'locket'].includes(specStyle);

  const showRingSize = isRing || (prodType === 'other' || prodType === 'best-sellers') && !isNecklace;
  const showNecklaceFields = isNecklace || (prodType === 'other' || prodType === 'best-sellers') && !isRing;

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
    <Box sx={{ p: { xs: 2, md: 0 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box sx={{ mb: 5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Admin Panel
            </Typography>
            <ChevronRight size={14} color="#94a3b8" />
            <Typography variant="caption" sx={{ color: BRAND, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Edit Product Details
            </Typography>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#111827', letterSpacing: '-1px' }}>
            Update Product
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mt: 0.5 }}>
            Modify the fields below to update this jewellery product in the inventory.
          </Typography>
        </Box>
      </motion.div>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>

          {/* LEFT COLUMN */}
          <Grid item xs={12} lg={7}>

            {/* Image Upload Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
              <Card sx={{ borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', mb: 3 }}>
                <CardContent sx={{ p: 4 }}>
                  <SectionHeader icon={<Image size={20} />} title="Product Images" description="Upload up to 4 high-quality images — stored lossless on Cloudinary" />
                  <Box
                    component="label"
                    sx={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      p: 4, border: `2px dashed ${imageUploading ? '#94a3b8' : BRAND}`, borderRadius: '16px',
                      bgcolor: imageUploading ? '#f8fafc' : BRAND_LIGHT,
                      cursor: imageUploading ? 'not-allowed' : 'pointer', transition: 'all 0.3s',
                      '&:hover': { bgcolor: imageUploading ? '#f8fafc' : '#e0f2fe', borderColor: imageUploading ? '#94a3b8' : BRAND_DARK }
                    }}
                  >
                    <Avatar sx={{ bgcolor: '#fff', color: imageUploading ? '#94a3b8' : BRAND, width: 56, height: 56, mb: 2, boxShadow: `0 8px 20px ${BRAND}40` }}>
                      {imageUploading ? <CircularProgress size={24} sx={{ color: '#94a3b8' }} /> : <Upload size={24} />}
                    </Avatar>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: imageUploading ? '#94a3b8' : '#1e293b' }}>
                      {imageUploading ? 'Uploading to Cloudinary...' : 'Drag & Drop or Click to Upload'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, mt: 0.5 }}>PNG, JPG, WEBP up to 10MB (max 4 images) · Stored at 100% quality</Typography>
                    <input
                      type="file"
                      name="imageUrl"
                      accept="image/*"
                      multiple
                      hidden
                      disabled={imageUploading}
                      onChange={(e) => handleChange(e, null, 'imageUrls')}
                    />
                  </Box>

                  {/* Upload Progress Bar */}
                  {imageUploading && (
                    <Box sx={{ mt: 2 }}>
                      <LinearProgress
                        variant={uploadProgress > 0 ? 'determinate' : 'indeterminate'}
                        value={uploadProgress}
                        sx={{ borderRadius: 4, height: 6, bgcolor: '#e2e8f0', '& .MuiLinearProgress-bar': { bgcolor: BRAND } }}
                      />
                      <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, mt: 0.5, display: 'block', textAlign: 'center' }}>
                        {uploadProgress > 0 ? `${uploadProgress}% — Saving at maximum quality...` : 'Preparing upload...'}
                      </Typography>
                    </Box>
                  )}

                  {productData.imageUrls.length > 0 && (
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                      {productData.imageUrls.map((image, index) => (
                        <Grid item xs={6} sm={3} key={index}>
                          <Box sx={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', border: `2px solid ${BRAND}40` }}>
                            <img
                              src={getOptimizedCloudinaryUrl(image.imageUrl, 'image')}
                              alt={`Product ${index + 1}`}
                              style={{ width: '100%', height: 100, objectFit: 'cover', display: 'block' }}
                            />
                            <Chip label={`#${index + 1}`} size="small" sx={{ position: 'absolute', top: 6, left: 6, bgcolor: BRAND, color: '#fff', fontWeight: 800, fontSize: '0.65rem', height: 20 }} />
                            <IconButton
                              size="small"
                              onClick={() => handleRemoveImage(index)}
                              sx={{
                                position: 'absolute', top: 4, right: 4,
                                bgcolor: 'rgba(244,63,94,0.85)', color: '#fff', width: 22, height: 22,
                                '&:hover': { bgcolor: '#f43f5e' }
                              }}
                            >
                              <Trash2 size={12} />
                            </IconButton>
                            {image.publicId && (
                              <Box sx={{ position: 'absolute', bottom: 4, right: 4 }}>
                                <CheckCircle size={14} color="#22c55e" />
                              </Box>
                            )}
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Basic Info Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
              <Card sx={{ borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', mb: 3 }}>
                <CardContent sx={{ p: 4 }}>
                  <SectionHeader icon={<Package size={20} />} title="Basic Information" description="Core product identity and details" />
                  <Grid container spacing={2.5}>
                    <Grid item xs={12} sm={8}>
                      <StyledTextField label="Product Title" name="title" value={productData.title} onChange={handleChange} fullWidth required />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <StyledTextField label="Brand Name" name="brand" value={productData.brand} disabled fullWidth required sx={{ '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: '#1e293b', fontWeight: 700 } }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel sx={{ fontWeight: 600 }}>Color</InputLabel>
                        <StyledSelect
                          multiple
                          label="Color"
                          name="color"
                          value={productData.color}
                          onChange={handleChange}
                          renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {selected.map((value) => (
                                <Chip key={value} label={value} size="small" />
                              ))}
                            </Box>
                          )}
                        >
                          <MenuItem value="rose">Rose</MenuItem>
                          <MenuItem value="rose-white">Rose & White</MenuItem>
                          <MenuItem value="white">White</MenuItem>
                          <MenuItem value="yellow">Yellow</MenuItem>
                          <MenuItem value="yellow-rose">Yellow & Rose</MenuItem>
                          <MenuItem value="yellow-white-rose">Yellow White & Rose</MenuItem>
                        </StyledSelect>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField label="Quantity" name="quantity" type="number" value={productData.quantity} onChange={handleChange} fullWidth required />
                    </Grid>
                    <Grid item xs={12}>
                      <StyledTextField label="Description" name="description" value={productData.description} onChange={handleChange} fullWidth multiline rows={3} required />
                    </Grid>
                    <Grid item xs={12}>
                      <StyledTextField label="Details / Specifications" name="details" value={productData.details} onChange={handleChange} fullWidth multiline rows={3} required />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>

            {/* Sizes Section */}
            {hasCategorySelected && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
                <Card sx={{ borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', mb: 3 }}>
                  <CardContent sx={{ p: 4 }}>
                    <SectionHeader icon={<Layers size={20} />} title="Sizes & Stock" description="Define weight, size, and available stock" />
                    {productData.sizes.map((size, index) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} sm={4}>
                            <StyledTextField label={`Weight ${index + 1}`} name="weight" value={size.weight} onChange={(e) => handleChange(e, index, 'sizes')} fullWidth required />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <StyledTextField label={`Size ${index + 1}`} name="size" value={size.size} onChange={(e) => handleChange(e, index, 'sizes')} fullWidth />
                          </Grid>
                          <Grid item xs={9} sm={3}>
                            <StyledTextField label={`Stock ${index + 1}`} name="stock" type="number" value={size.stock} onChange={(e) => handleChange(e, index, 'sizes')} fullWidth />
                          </Grid>
                          <Grid item xs={3} sm={1}>
                            <IconButton onClick={() => handleRemoveSize(index)} disabled={productData.sizes.length === 1} sx={{ color: '#f43f5e', '&:hover': { bgcolor: '#fff1f2' } }}>
                              <Trash2 size={18} />
                            </IconButton>
                          </Grid>
                        </Grid>
                        {index < productData.sizes.length - 1 && <Divider sx={{ mt: 2, borderColor: '#f8fafc' }} />}
                      </Box>
                    ))}
                    <Button
                      onClick={handleAddSize}
                      startIcon={<Plus size={18} />}
                      variant="outlined"
                      sx={{
                        mt: 1, borderRadius: '12px', textTransform: 'none', fontWeight: 800,
                        borderColor: BRAND, color: BRAND, px: 3,
                        '&:hover': { bgcolor: BRAND_LIGHT, borderColor: BRAND_DARK }
                      }}
                    >
                      Add Size Variant
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Dimensions Section */}
            {hasCategorySelected && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.6 }}>
                <Card sx={{ borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', mb: 3 }}>
                  <CardContent sx={{ p: 4 }}>
                    <SectionHeader icon={<Ruler size={20} />} title="Dimensions" description="Product measurements" />
                    <Grid container spacing={2.5}>
                      {showRingSize && (
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth>
                            <InputLabel sx={{ fontWeight: 600 }}>Ring Size</InputLabel>
                            <StyledSelect label="Ring Size" name="ringSize" value={productData.ringSize} onChange={handleChange}>
                              <MenuItem value="Select All">Select All</MenuItem>
                              {[...Array(17).keys()].map(i => (
                                <MenuItem key={i} value={(i + 6).toString()}>{(i + 6).toString()}</MenuItem>
                              ))}
                            </StyledSelect>
                          </FormControl>
                        </Grid>
                      )}
                      <Grid item xs={12} sm={showRingSize ? 6 : 12}>
                        <StyledTextField label="Total Weight (g)" name="totalWeight" type="number" value={productData.totalWeight} onChange={handleChange} fullWidth />
                      </Grid>
                      {showNecklaceFields && (
                        <>
                          <Grid item xs={12} sm={showRingSize ? 4 : 6}>
                            <StyledTextField label="Chain Length" name="chainLength" value={productData.chainLength} onChange={handleChange} fullWidth />
                          </Grid>
                          <Grid item xs={12} sm={showRingSize ? 4 : 6}>
                            <StyledTextField label="Pendant Size" name="pendantSize" value={productData.pendantSize} onChange={handleChange} fullWidth />
                          </Grid>
                        </>
                      )}
                      <Grid item xs={12} sm={showNecklaceFields && showRingSize ? 4 : 12}>
                        <StyledTextField label="Dimensions (W/H/T)" name="dimensions" value={productData.dimensions} onChange={handleChange} fullWidth />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </Grid>

          {/* RIGHT COLUMN */}
          <Grid item xs={12} lg={5}>

            {/* Category Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>
              <Card sx={{ borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', mb: 3 }}>
                <CardContent sx={{ p: 4 }}>
                  <SectionHeader icon={<BarChart3 size={20} />} title="Category Hierarchy" description="Map product into the correct category" />
                  <Grid container spacing={2.5}>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel sx={{ fontWeight: 600 }}>Main Category (Material)</InputLabel>
                        <StyledSelect label="Main Category (Material)" name="topLevelCategory" value={productData.topLevelCategory} onChange={handleChange}>
                          <MenuItem value="diamond">Diamond Jewelry</MenuItem>
                        </StyledSelect>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel sx={{ fontWeight: 600 }}>Product Type (e.g., Rings, Earrings)</InputLabel>
                        <StyledSelect label="Product Type (e.g., Rings, Earrings)" name="secondLevelCategory" value={productData.secondLevelCategory} onChange={handleChange}>
                          <MenuItem value="earrings">Earring</MenuItem>
                          <MenuItem value="rings">Ring</MenuItem>
                          <MenuItem value="nacklaces">Necklace</MenuItem>
                          <MenuItem value="best-sellers">Best Sellers</MenuItem>
                          <MenuItem value="wedding">Wedding</MenuItem>
                          <MenuItem value="other">Others</MenuItem>
                        </StyledSelect>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel sx={{ fontWeight: 600 }}>Specific Style</InputLabel>
                        <StyledSelect label="Specific Style" name="thirdLevelCategory" value={productData.thirdLevelCategory} onChange={handleChange} disabled={!prodType}>
                          {filteredStyles.map((s) => (
                            <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                          ))}
                        </StyledSelect>
                      </FormControl>
                      {!prodType && (
                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, mt: 0.5, display: 'block' }}>
                          Select a Product Type first
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>

            {/* Metal Details Section */}
            {hasCategorySelected && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>
                <Card sx={{ borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', mb: 3 }}>
                  <CardContent sx={{ p: 4 }}>
                    <SectionHeader icon={<Award size={20} />} title="Metal Details" description="Define metal properties" />
                    <Grid container spacing={2.5}>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel sx={{ fontWeight: 600 }}>Metal Type</InputLabel>
                          <StyledSelect label="Metal Type" name="metalType" value={productData.metalType} onChange={handleChange}>
                            <MenuItem value="Gold">Gold</MenuItem>
                            <MenuItem value="Silver">Silver</MenuItem>
                            <MenuItem value="Platinum">Platinum</MenuItem>
                            <MenuItem value="Rose Gold">Rose Gold</MenuItem>
                            <MenuItem value="White Gold">White Gold</MenuItem>
                          </StyledSelect>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <StyledTextField label="Metal Purity (e.g. 18K, 22K)" name="metalPurity" value={productData.metalPurity} onChange={handleChange} fullWidth />
                      </Grid>

                      <Grid item xs={12}>
                        <StyledTextField label="Hallmark / Certification" name="hallmarkCertification" value={productData.hallmarkCertification} onChange={handleChange} fullWidth />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Gemstone Details Section */}
            {hasCategorySelected && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }}>
                <Card sx={{ borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', mb: 3 }}>
                  <CardContent sx={{ p: 4 }}>
                    <SectionHeader icon={<Gem size={20} />} title="Gemstone Details" description="Information about primary stones" />
                    <Grid container spacing={2.5}>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel sx={{ fontWeight: 600 }}>Stone Type</InputLabel>
                          <StyledSelect label="Stone Type" name="primaryStoneType" value={productData.primaryStoneType} onChange={handleChange}>
                            <MenuItem value="Diamond">Diamond</MenuItem>
                            <MenuItem value="Ruby">Ruby</MenuItem>
                            <MenuItem value="Emerald">Emerald</MenuItem>
                            <MenuItem value="Moissanite">Moissanite</MenuItem>
                            <MenuItem value="Sapphire">Sapphire</MenuItem>
                            <MenuItem value="None">None</MenuItem>
                          </StyledSelect>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel sx={{ fontWeight: 600 }}>Stone Shape</InputLabel>
                          <StyledSelect label="Stone Shape" name="stoneShape" value={productData.stoneShape} onChange={handleChange}>
                            <MenuItem value="Round">Round</MenuItem>
                            <MenuItem value="Princess">Princess</MenuItem>
                            <MenuItem value="Oval">Oval</MenuItem>
                            <MenuItem value="Pear">Pear</MenuItem>
                            <MenuItem value="Cushion">Cushion</MenuItem>
                            <MenuItem value="None">None</MenuItem>
                          </StyledSelect>
                        </FormControl>
                      </Grid>

                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Classification Section */}
            {hasCategorySelected && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
                <Card sx={{ borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', mb: 3 }}>
                  <CardContent sx={{ p: 4 }}>
                    <SectionHeader icon={<Tag size={20} />} title="Classification" description="Occasion, collection and metal type" />
                    <Grid container spacing={2.5}>
                      <Grid item xs={12}>
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
                      <Grid item xs={12}>
                        <FormControl fullWidth>
                          <InputLabel sx={{ fontWeight: 600 }}>Collection</InputLabel>
                          <StyledSelect label="Collection" name="collectionName" value={productData.collectionName} onChange={handleChange}>
                            <MenuItem value="best-sellers">Best Sellers</MenuItem>
                            <MenuItem value="reccomanded">Recommended</MenuItem>
                            <MenuItem value="new-arrival">New Arrivals</MenuItem>
                            <MenuItem value="dharohar">Dharohar</MenuItem>
                            <MenuItem value="aksharam">Aksharam</MenuItem>
                            <MenuItem value="loupe">Loupe</MenuItem>
                          </StyledSelect>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Pricing Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
              <Card sx={{ borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', mb: 3 }}>
                <CardContent sx={{ p: 4 }}>
                  <SectionHeader icon={<DollarSign size={20} />} title="Approximate Price Range" description="Set the approx. price range visible to customers (gold-rate based)" />
                  <Grid container spacing={2.5}>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField label="Min Approx. Price (₹)" name="minPrice" type="number" value={productData.minPrice} onChange={handleChange} fullWidth required helperText="Shown to customers" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField label="Max Approx. Price (₹)" name="maxPrice" type="number" value={productData.maxPrice} onChange={handleChange} fullWidth required helperText="Shown to customers" />
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ p: 2, bgcolor: '#f0f9ff', borderRadius: '10px', border: '1px solid #bae6fd' }}>
                        <Typography variant="caption" sx={{ color: '#0369a1', fontWeight: 600 }}>
                          💡 This range is displayed to customers as "Approx. ₹{Number(productData.minPrice || 0).toLocaleString('en-IN')} – ₹{Number(productData.maxPrice || 0).toLocaleString('en-IN')}". The actual final price is agreed over WhatsApp.
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Internal Reference (not shown to customers)</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField label="Internal Reference Price" name="price" type="number" value={productData.price} onChange={handleChange} fullWidth />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField label="Internal Sale Price" name="discountedPrice" type="number" value={productData.discountedPrice} onChange={handleChange} fullWidth />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>

          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            {/* Submit Button */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                size="medium"
                disabled={!isFormValid || products?.loading}
                sx={{ width: '100%', py: 1.5, borderRadius: '12px', bgcolor: BRAND, color: '#fff', fontWeight: 800, fontSize: '1rem', textTransform: 'uppercase', '&:hover': { bgcolor: BRAND_DARK }, opacity: products?.loading ? 0.7 : 1 }}
              >
                {products?.loading ? 'Saving Changes...' : 'Save Changes'}
              </Button>
              <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 1.5, color: '#94a3b8', fontWeight: 600 }}>
                All required fields must be filled before submitting.
              </Typography>
            </motion.div>
          </Grid>
        </Grid>
      </form>
    </Box >
  );
};

export default EditProductForm;
