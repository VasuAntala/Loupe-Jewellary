import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProduct, findProductById } from '../../state/product/Action';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box, Grid, TextField, Button, Typography, FormControl,
  InputLabel, Select, MenuItem, Card, CardContent, Avatar,
  Chip, IconButton, CircularProgress, LinearProgress, Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Upload, Plus, Trash2, Package, DollarSign,
  ChevronRight, Gem, Ruler, Award, Link as LinkIcon, Info
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

const EditProductForm = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products } = useSelector((store) => store);

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
    occasion: '',
    collectionName: '',
    color: [],
    sizes: initialSizes,

    minPrice: 0,
    maxPrice: 0,
    priceNote: 'Price varies according to daily gold rate and diamond specifications.',
    price: 0,
    discountedPrice: 0,

    dimensionsList: [initialDimension],
    diamondDetails: [initialDiamond],
    metalDetails: [initialMetal],

    includesChain: 'No',
    chainLength: '',
    chainWeight: '',
    chakiWeight: '',
  });

  useEffect(() => {
    if (productId) {
      dispatch(findProductById({ productId }));
    }
  }, [productId, dispatch]);

  useEffect(() => {
    if (products?.product && products.product._id === productId) {
      const p = products.product;
      setProductData({
        title: p.title || '',
        productCode: p.productCode || '',
        topLevelCategory: p.category?.parentCategory?.parentCategory?.name || p.topLevelCategory || 'diamond',
        secondLevelCategory: p.category?.parentCategory?.name || p.secondLevelCategory || '',
        thirdLevelCategory: p.category?.name || p.thirdLevelCategory || '',
        description: p.description || '',
        details: p.details || '',
        imageUrls: Array.isArray(p.imageUrls) ? p.imageUrls : [],
        status: p.status || 'active',
        brand: p.brand || 'Loupe Jeweler',
        quantity: p.quantity || 1,
        occasion: p.occasion || '',
        collectionName: p.collectionName || '',
        color: Array.isArray(p.color) ? p.color : [],
        sizes: Array.isArray(p.sizes) && p.sizes.length > 0 ? p.sizes : initialSizes,

        minPrice: p.minPrice || 0,
        maxPrice: p.maxPrice || 0,
        priceNote: p.priceNote || 'Price varies according to daily gold rate and diamond specifications.',
        price: p.price || 0,
        discountedPrice: p.discountedPrice || 0,

        dimensionsList: Array.isArray(p.dimensionsList) && p.dimensionsList.length > 0 ? p.dimensionsList : [initialDimension],
        diamondDetails: Array.isArray(p.diamondDetails) && p.diamondDetails.length > 0 ? p.diamondDetails : [initialDiamond],
        metalDetails: Array.isArray(p.metalDetails) && p.metalDetails.length > 0 ? p.metalDetails : [initialMetal],

        includesChain: p.includesChain || 'No',
        chainLength: p.chainLength || '',
        chainWeight: p.chainWeight || '',
        chakiWeight: p.chakiWeight || '',
      });
    }
  }, [products?.product, productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

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
  const handleAddDimension = () => {
    setProductData((prev) => ({ ...prev, dimensionsList: [...prev.dimensionsList, { label: '', value: '', unit: 'mm' }] }));
  };
  const handleRemoveDimension = (index) => {
    setProductData((prev) => ({ ...prev, dimensionsList: prev.dimensionsList.filter((_, i) => i !== index) }));
  };

  // Diamonds
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

  // Metals
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

  const handleSubmit = async (e) => {
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

    await dispatch(updateProduct({ productId, updates: finalData }));
    setTimeout(() => {
      navigate('/admin/products');
    }, 1200);
  };

  const isFormValid = productData.title !== '' && productData.minPrice > 0;
  const prodType = productData.secondLevelCategory;

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
      { value: 'earring', label: 'Earring' },
      { value: 'stud', label: 'Studs' },
      { value: 'drop', label: 'Drop & Dangle' },
      { value: 'hoop', label: 'Hoops & Huggies' },
      { value: 'jhumka', label: 'Jhumkas' },
      { value: 'chandelier', label: 'Chandeliers' },
      { value: 'ear-cuff', label: 'Ear Cuffs' },
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
      { value: 'tennis-bracelet', label: 'Tennis Bracelet' },
      { value: 'chain-bracelet', label: 'Chain Bracelet' },
      { value: 'cuff-bracelet', label: 'Cuff Bracelet' },
      { value: 'charm-bracelet', label: 'Charm Bracelet' },
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
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Box sx={{ mb: 4, pb: 3, borderBottom: '1px solid #e2e8f0' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Admin Panel
            </Typography>
            <ChevronRight size={14} color="#64748b" />
            <Typography variant="caption" sx={{ color: BRAND, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Edit Product
            </Typography>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a', letterSpacing: '-1px' }}>
            EDIT PRODUCT DETAILS
          </Typography>
        </Box>
      </motion.div>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3.5}>

          {/* 1. BASIC INFORMATION */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
                <SectionHeader step="1" icon={<Package size={20} color={BRAND} />} title="BASIC INFORMATION" description="Product title, SKU code, category & images" />
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={8}>
                    <StyledTextField label="Product Name" name="title" value={productData.title} onChange={handleChange} fullWidth required />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <StyledTextField label="Product Code / SKU" name="productCode" value={productData.productCode} onChange={handleChange} fullWidth />
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
                    <StyledTextField label="Description" name="description" value={productData.description} onChange={handleChange} fullWidth multiline rows={3} />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#334155', mb: 1.5 }}>Product Images</Typography>
                    <Box component="label" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3, border: `2px dashed ${BRAND}`, borderRadius: '16px', bgcolor: BRAND_LIGHT, cursor: 'pointer' }}>
                      <Upload size={22} color={BRAND} />
                      <Typography variant="body2" sx={{ fontWeight: 800, mt: 1 }}>Upload / Change Images</Typography>
                      <input type="file" accept="image/*" multiple hidden onChange={handleImageUpload} />
                    </Box>
                    {productData.imageUrls.length > 0 && (
                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        {productData.imageUrls.map((image, index) => (
                          <Grid item xs={6} sm={3} key={index}>
                            <Box sx={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', border: `2px solid ${BRAND}40` }}>
                              <img src={getOptimizedCloudinaryUrl(image.imageUrl, 'image')} alt="" style={{ width: '100%', height: 110, objectFit: 'cover' }} />
                              <IconButton size="small" onClick={() => handleRemoveImage(index)} sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(244,63,94,0.9)', color: '#fff' }}>
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
          </Grid>

          {/* 2. APPROXIMATE PRICING */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
                <SectionHeader step="2" icon={<DollarSign size={20} color={BRAND} />} title="APPROXIMATE PRICING" description="Estimated price range shown to customers" />
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField label="Minimum Approx. Price (₹)" name="minPrice" type="number" value={productData.minPrice} onChange={handleChange} fullWidth required />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField label="Maximum Approx. Price (₹)" name="maxPrice" type="number" value={productData.maxPrice} onChange={handleChange} fullWidth required />
                  </Grid>
                  <Grid item xs={12}>
                    <StyledTextField label="Price Note" name="priceNote" value={productData.priceNote} onChange={handleChange} fullWidth multiline rows={2} />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* 3. PRODUCT DIMENSIONS */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <SectionHeader step="3" icon={<Ruler size={20} color={BRAND} />} title="PRODUCT DIMENSIONS" description="Measurements (Label | Value | Unit)" />
                  <Button onClick={handleAddDimension} startIcon={<Plus size={16} />} variant="outlined" sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 800, borderColor: BRAND, color: BRAND }}>Add Dimension</Button>
                </Box>
                {productData.dimensionsList.map((dim, idx) => (
                  <Grid container spacing={2} key={idx} alignItems="center" sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={5}>
                      <StyledTextField label="Label" value={dim.label} onChange={(e) => handleDimensionChange(idx, 'label', e.target.value)} fullWidth />
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
                      <IconButton onClick={() => handleRemoveDimension(idx)} disabled={productData.dimensionsList.length === 1} sx={{ color: '#f43f5e' }}><Trash2 size={18} /></IconButton>
                    </Grid>
                  </Grid>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* 4. DIAMOND DETAILS */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <SectionHeader step="4" icon={<Gem size={20} color={BRAND} />} title="DIAMOND DETAILS" description="Diamond specifications & stone count" />
                  <Button onClick={handleAddDiamond} startIcon={<Plus size={16} />} variant="outlined" sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 800, borderColor: BRAND, color: BRAND }}>Add Diamond</Button>
                </Box>
                {productData.diamondDetails.map((dia, idx) => (
                  <Paper key={idx} variant="outlined" sx={{ p: 2.5, mb: 2.5, borderRadius: '14px', bgcolor: '#fafafa' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Chip label={`Diamond Component #${idx + 1}`} size="small" sx={{ bgcolor: BRAND, color: '#fff', fontWeight: 800 }} />
                      <IconButton onClick={() => handleRemoveDiamond(idx)} disabled={productData.diamondDetails.length === 1} sx={{ color: '#f43f5e' }}><Trash2 size={16} /></IconButton>
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <StyledTextField label="Diamond Type" value={dia.diamondType} onChange={(e) => handleDiamondChange(idx, 'diamondType', e.target.value)} fullWidth />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <StyledTextField label="Diamond Size" value={dia.diamondSize} onChange={(e) => handleDiamondChange(idx, 'diamondSize', e.target.value)} fullWidth />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <StyledTextField label="Diamond Diameter" value={dia.diamondDiameter} onChange={(e) => handleDiamondChange(idx, 'diamondDiameter', e.target.value)} fullWidth />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <StyledTextField label="Diamond Weight / Piece" value={dia.weightPerPiece} onChange={(e) => handleDiamondChange(idx, 'weightPerPiece', e.target.value)} fullWidth />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <StyledTextField label="Diamond Pieces" type="number" value={dia.pieces} onChange={(e) => handleDiamondChange(idx, 'pieces', e.target.value)} fullWidth />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <StyledTextField label="Total Diamond Weight" value={dia.totalWeight} onChange={(e) => handleDiamondChange(idx, 'totalWeight', e.target.value)} fullWidth />
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* 5. METAL DETAILS */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <SectionHeader step="5" icon={<Award size={20} color={BRAND} />} title="METAL DETAILS" description="Metal composition & final weight" />
                  <Button onClick={handleAddMetal} startIcon={<Plus size={16} />} variant="outlined" sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 800, borderColor: BRAND, color: BRAND }}>Add Metal</Button>
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
                      <StyledTextField label="Purity" value={met.purity} onChange={(e) => handleMetalChange(idx, 'purity', e.target.value)} fullWidth />
                    </Grid>
                    <Grid item xs={8} sm={3}>
                      <StyledTextField label="Final Weight" value={met.finalWeight} onChange={(e) => handleMetalChange(idx, 'finalWeight', e.target.value)} fullWidth />
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
                      <IconButton onClick={() => handleRemoveMetal(idx)} disabled={productData.metalDetails.length === 1} sx={{ color: '#f43f5e' }}><Trash2 size={18} /></IconButton>
                    </Grid>
                  </Grid>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* 6. CHAIN / COMPONENT DETAILS */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
                <SectionHeader step="6" icon={<LinkIcon size={20} color={BRAND} />} title="CHAIN / COMPONENT DETAILS" description="Chain length, weight & chaki weight" />
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
                    <StyledTextField label="Chain Length" name="chainLength" value={productData.chainLength} onChange={handleChange} fullWidth />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <StyledTextField label="Chain Weight" name="chainWeight" value={productData.chainWeight} onChange={handleChange} fullWidth />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <StyledTextField label="Chaki Weight" name="chakiWeight" value={productData.chakiWeight} onChange={handleChange} fullWidth />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* SAVE CHANGES BUTTON */}
          <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2, mb: 6 }}>
            <Box sx={{ width: '100%', maxWidth: 450 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={!isFormValid || products?.loading}
                sx={{
                  width: '100%', py: 1.8, borderRadius: '14px', bgcolor: BRAND, color: '#fff',
                  fontWeight: 900, fontSize: '1.1rem', letterSpacing: '0.5px',
                  boxShadow: `0 10px 30px ${BRAND}50`,
                  '&:hover': { bgcolor: BRAND_DARK, transform: 'translateY(-2px)' },
                  transition: 'all 0.25s ease'
                }}
              >
                {products?.loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'SAVE CHANGES'}
              </Button>
            </Box>
          </Grid>

        </Grid>
      </form>
    </Box>
  );
};

export default EditProductForm;
