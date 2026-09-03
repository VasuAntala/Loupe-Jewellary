import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProduct, findProductById } from '../../state/product/Action';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box, Grid, TextField, Button, Typography, FormControl,
  InputLabel, Select, MenuItem, Card, CardContent, Avatar,
  Chip, IconButton, CircularProgress, LinearProgress, Paper,
  Switch, FormControlLabel,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Upload, Plus, Trash2, Package, DollarSign,
  ChevronRight, Gem, Ruler, Award, Link as LinkIcon,
  Info, Tag, Eye,
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

const EditProductForm = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products } = useSelector((store) => store);

  const [imageUploading, setImageUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const [productData, setProductData] = useState({
    title: '',
    productCode: '',
    topLevelCategory: 'diamond',
    secondLevelCategory: '',
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
<<<<<<< HEAD
    tags: [],

=======
    sizes: initialSizes,
>>>>>>> 0178b7ceea5eb3e2c41a240d67a038c55e1ad52f
    minPrice: 0,
    maxPrice: 0,
    priceNote: 'Price varies according to daily gold rate and diamond specifications.',
    price: 0,
    discountedPrice: 0,
<<<<<<< HEAD

    dimensionsList: [{ ...initialDimension }],
    diamondDetails: [{ ...initialDiamond }],
    metalDetails: [{ ...initialMetal }],

=======
    dimensionsList: [initialDimension],
    diamondDetails: [initialDiamond],
    metalDetails: [initialMetal],
>>>>>>> 0178b7ceea5eb3e2c41a240d67a038c55e1ad52f
    includesChain: 'No',
    chainLength: '',
    chainWeight: '',
    chakiWeight: '',
<<<<<<< HEAD

    additionalSpecifications: [],

    showDiamondDetails: false,
    showMetalDetails: false,
    showWeightDetails: false,
=======
    ringSize: '',
    pendantSize: '',
>>>>>>> 0178b7ceea5eb3e2c41a240d67a038c55e1ad52f
  });

  // Load product when component mounts
  useEffect(() => {
    if (productId) {
      dispatch(findProductById({ productId }));
    }
  }, [productId, dispatch]);

  // Populate form when product data arrives
  useEffect(() => {
    if (products?.product && products.product._id === productId && !loaded) {
      const p = products.product;
      setProductData({
        title: p.title || '',
        productCode: p.productCode || '',
<<<<<<< HEAD
        topLevelCategory: p.category?.parentCategory?.parentCategory?.name || p.topLevelCategory || 'diamond',
        secondLevelCategory: p.category?.parentCategory?.name || p.secondLevelCategory || '',
=======
        // Prioritize flat stored fields; fall back to category hierarchy
        topLevelCategory: p.topLevelCategory || p.category?.parentCategory?.parentCategory?.name || 'diamond',
        secondLevelCategory: p.secondLevelCategory || p.category?.parentCategory?.name || '',
        thirdLevelCategory: p.thirdLevelCategory || p.category?.name || '',
>>>>>>> 0178b7ceea5eb3e2c41a240d67a038c55e1ad52f
        description: p.description || '',
        details: p.details || '',
        imageUrls: Array.isArray(p.imageUrls) ? p.imageUrls : [],
        status: p.status || 'active',
        brand: p.brand || 'Loupe Jeweler',
        quantity: p.quantity || 1,
        occasion: Array.isArray(p.occasion) ? p.occasion : (p.occasion ? [p.occasion] : []),
        collectionName: p.collectionName || '',
        tags: Array.isArray(p.tags) ? p.tags : [],
        color: Array.isArray(p.color) ? p.color : [],
<<<<<<< HEAD
        tags: Array.isArray(p.tags) ? p.tags : [],

=======
        sizes: Array.isArray(p.sizes) && p.sizes.length > 0 ? p.sizes : initialSizes,
>>>>>>> 0178b7ceea5eb3e2c41a240d67a038c55e1ad52f
        minPrice: p.minPrice || 0,
        maxPrice: p.maxPrice || 0,
        priceNote: p.priceNote || 'Price varies according to daily gold rate and diamond specifications.',
        price: p.price || 0,
        discountedPrice: p.discountedPrice || 0,
<<<<<<< HEAD

        dimensionsList: Array.isArray(p.dimensionsList) && p.dimensionsList.length > 0 ? p.dimensionsList : [{ ...initialDimension }],
        diamondDetails: Array.isArray(p.diamondDetails) && p.diamondDetails.length > 0 ? p.diamondDetails : [{ ...initialDiamond }],
        metalDetails: Array.isArray(p.metalDetails) && p.metalDetails.length > 0 ? p.metalDetails : [{ ...initialMetal }],

=======
        dimensionsList: Array.isArray(p.dimensionsList) && p.dimensionsList.length > 0 ? p.dimensionsList : [initialDimension],
        diamondDetails: Array.isArray(p.diamondDetails) && p.diamondDetails.length > 0 ? p.diamondDetails : [initialDiamond],
        metalDetails: Array.isArray(p.metalDetails) && p.metalDetails.length > 0 ? p.metalDetails : [initialMetal],
>>>>>>> 0178b7ceea5eb3e2c41a240d67a038c55e1ad52f
        includesChain: p.includesChain || 'No',
        chainLength: p.chainLength || '',
        chainWeight: p.chainWeight || '',
        chakiWeight: p.chakiWeight || '',
<<<<<<< HEAD

        additionalSpecifications: Array.isArray(p.additionalSpecifications) ? p.additionalSpecifications : [],

        showDiamondDetails: p.showDiamondDetails || false,
        showMetalDetails: p.showMetalDetails || false,
        showWeightDetails: p.showWeightDetails || false,
=======
        ringSize: p.ringSize || '',
        pendantSize: p.pendantSize || '',
>>>>>>> 0178b7ceea5eb3e2c41a240d67a038c55e1ad52f
      });
      setLoaded(true);
    }
  }, [products?.product, productId, loaded]);

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

  // Additional Specs
  const handleSpecChange = (index, field, value) => {
    const updated = [...productData.additionalSpecifications];
    updated[index] = { ...updated[index], [field]: value };
    setProductData((prev) => ({ ...prev, additionalSpecifications: updated }));
  };
  const handleAddSpec = () => setProductData((prev) => ({ ...prev, additionalSpecifications: [...prev.additionalSpecifications, { ...initialSpec }] }));
  const handleRemoveSpec = (index) => setProductData((prev) => ({ ...prev, additionalSpecifications: prev.additionalSpecifications.filter((_, i) => i !== index) }));

  const handleSubmit = async (e) => {
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

    await dispatch(updateProduct({ productId, updates: finalData }));
    setTimeout(() => navigate('/admin/products'), 1200);
  };

<<<<<<< HEAD
  const isFormValid = productData.title.trim() !== '' && productData.topLevelCategory !== '';
=======
  const isFormValid = productData.title !== '' && productData.minPrice > 0;
  const prodType = productData.secondLevelCategory;

  // Conditional field visibility based on sub-category
  const isRing = ['rings', 'bangles'].includes(prodType);
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

  const filteredStyles = stylesByType[prodType] || [];
>>>>>>> 0178b7ceea5eb3e2c41a240d67a038c55e1ad52f

  // Show loader while product is being fetched
  if (!loaded && products?.loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress sx={{ color: BRAND }} />
      </Box>
    );
  }

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
              Edit Product
            </Typography>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a', letterSpacing: '-1px' }}>
            EDIT PRODUCT DETAILS
          </Typography>
          {productData.productCode && (
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mt: 0.5 }}>
              Product Code: <strong style={{ color: BRAND }}>{productData.productCode}</strong>
            </Typography>
          )}
        </Box>
      </motion.div>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3.5}>

          {/* ===== 1. BASIC INFORMATION ===== */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
                <SectionHeader step="1" icon={<Package size={20} color={BRAND} />} title="BASIC INFORMATION" description="Product name, code, category, description, images and status" />
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={8}>
                    <StyledTextField label="Product Name *" name="title" value={productData.title} onChange={handleChange} fullWidth required />
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
                    <StyledTextField label="Product Description" name="description" value={productData.description} onChange={handleChange} fullWidth multiline rows={3} />
                  </Grid>

                  {/* Images */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#334155', mb: 1.5 }}>Product Images</Typography>
                    <Box
                      component="label"
                      sx={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        p: 3, border: `2px dashed ${BRAND}`, borderRadius: '16px', bgcolor: BRAND_LIGHT, cursor: 'pointer',
                        '&:hover': { bgcolor: '#e0f2fe' },
                      }}
                    >
                      <Upload size={22} color={BRAND} />
                      <Typography variant="body2" sx={{ fontWeight: 800, mt: 1 }}>Upload / Replace Images</Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>PNG, JPG, WEBP (up to 4 images)</Typography>
                      <input type="file" accept="image/*" multiple hidden onChange={handleImageUpload} />
                    </Box>
                    {imageUploading && (
                      <Box sx={{ mt: 1.5 }}>
                        <LinearProgress variant="indeterminate" sx={{ borderRadius: 4, height: 6, bgcolor: '#e2e8f0', '& .MuiLinearProgress-bar': { bgcolor: BRAND } }} />
                      </Box>
                    )}
                    {productData.imageUrls.length > 0 && (
                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        {productData.imageUrls.map((image, index) => (
                          <Grid item xs={6} sm={3} key={index}>
                            <Box sx={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', border: `2px solid ${BRAND}40` }}>
                              <img src={getOptimizedCloudinaryUrl(image.imageUrl, 'image')} alt="" style={{ width: '100%', height: 110, objectFit: 'cover', display: 'block' }} />
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
          </Grid>

<<<<<<< HEAD
          {/* ===== 2. APPROXIMATE PRICING ===== */}
=======
          {/* 2. APPROXIMATE PRICING */}
>>>>>>> 0178b7ceea5eb3e2c41a240d67a038c55e1ad52f
          <Grid item xs={12}>
            <Card sx={{ borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
                <SectionHeader step="2" icon={<DollarSign size={20} color={BRAND} />} title="APPROXIMATE PRICING" description="Price range shown to customers — never an exact selling price" />
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField label="Minimum Approx. Price (₹)" name="minPrice" type="number" inputProps={{ min: 0 }} value={productData.minPrice} onChange={handleChange} fullWidth helperText="Displayed as lower range" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
<<<<<<< HEAD
                    <StyledTextField label="Maximum Approx. Price (₹)" name="maxPrice" type="number" inputProps={{ min: 0 }} value={productData.maxPrice} onChange={handleChange} fullWidth helperText="Displayed as upper range" />
=======
                    <StyledTextField label="Maximum Approx. Price (₹)" name="maxPrice" type="number" value={productData.maxPrice} onChange={handleChange} fullWidth required />
>>>>>>> 0178b7ceea5eb3e2c41a240d67a038c55e1ad52f
                  </Grid>
                  <Grid item xs={12}>
                    <StyledTextField label="Price Note" name="priceNote" value={productData.priceNote} onChange={handleChange} fullWidth multiline rows={2} />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ p: 2, bgcolor: '#f0f9ff', borderRadius: '12px', border: '1px solid #bae6fd', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Info size={20} color="#0284c7" />
                      <Typography variant="body2" sx={{ color: '#0369a1', fontWeight: 600 }}>
                        Customer sees: <strong>Approx. ₹{Number(productData.minPrice || 0).toLocaleString('en-IN')} – ₹{Number(productData.maxPrice || 0).toLocaleString('en-IN')}</strong>
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* ===== 3. PRODUCT DIMENSIONS ===== */}
          <Grid item xs={12}>
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
                      <StyledTextField label="Label" value={dim.label} onChange={(e) => handleDimensionChange(idx, 'label', e.target.value)} fullWidth />
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
          </Grid>

          {/* ===== 4. DIAMOND SPECIFICATIONS ===== */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <SectionHeader step="4" icon={<Gem size={20} color={BRAND} />} title="DIAMOND SPECIFICATIONS" description="Center solitaire, halo stones, baguettes, accent diamonds" />
                  <Button onClick={handleAddDiamond} startIcon={<Plus size={16} />} variant="outlined" sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 800, borderColor: BRAND, color: BRAND, '&:hover': { bgcolor: BRAND_LIGHT }, flexShrink: 0 }}>
                    Add Diamond
                  </Button>
                </Box>
                {productData.diamondDetails.map((dia, idx) => (
                  <Paper key={idx} variant="outlined" sx={{ p: 2.5, mb: 2.5, borderRadius: '14px', bgcolor: '#fafafa' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Chip label={`Diamond #${idx + 1}`} size="small" sx={{ bgcolor: BRAND, color: '#fff', fontWeight: 800 }} />
                      <IconButton onClick={() => handleRemoveDiamond(idx)} disabled={productData.diamondDetails.length === 1} sx={{ color: '#f43f5e' }}>
                        <Trash2 size={16} />
                      </IconButton>
                    </Box>
                    <Grid container spacing={2}>
<<<<<<< HEAD
                      <Grid item xs={12} sm={4}><StyledTextField label="Diamond Type" value={dia.diamondType} onChange={(e) => handleDiamondChange(idx, 'diamondType', e.target.value)} fullWidth /></Grid>
                      <Grid item xs={12} sm={4}><StyledTextField label="Diamond Size" value={dia.diamondSize} onChange={(e) => handleDiamondChange(idx, 'diamondSize', e.target.value)} fullWidth /></Grid>
                      <Grid item xs={12} sm={4}><StyledTextField label="Diamond Diameter" value={dia.diamondDiameter} onChange={(e) => handleDiamondChange(idx, 'diamondDiameter', e.target.value)} fullWidth /></Grid>
                      <Grid item xs={12} sm={4}><StyledTextField label="Weight / Piece (Carat)" value={dia.weightPerPiece} onChange={(e) => handleDiamondChange(idx, 'weightPerPiece', e.target.value)} fullWidth /></Grid>
                      <Grid item xs={12} sm={4}><StyledTextField label="Number of Pieces" type="number" inputProps={{ min: 1 }} value={dia.pieces} onChange={(e) => handleDiamondChange(idx, 'pieces', e.target.value)} fullWidth /></Grid>
                      <Grid item xs={12} sm={4}><StyledTextField label="Total Diamond Weight (Carat)" value={dia.totalWeight} onChange={(e) => handleDiamondChange(idx, 'totalWeight', e.target.value)} fullWidth /></Grid>
=======
                      <Grid item xs={12} sm={4}>
                        <StyledTextField label="Diamond Type" value={dia.diamondType} onChange={(e) => handleDiamondChange(idx, 'diamondType', e.target.value)} fullWidth />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <StyledTextField label="Diamond Name" value={dia.diamondName || dia.diamondSize || ''} onChange={(e) => handleDiamondChange(idx, 'diamondName', e.target.value)} fullWidth placeholder="e.g. Marquise, Round Brilliant, Solitaire" />
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
>>>>>>> 0178b7ceea5eb3e2c41a240d67a038c55e1ad52f
                    </Grid>
                  </Paper>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* ===== 5. METAL SPECIFICATIONS ===== */}
          <Grid item xs={12}>
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
                    <Grid item xs={12} sm={3}><StyledTextField label="Purity (e.g. 18KT)" value={met.purity} onChange={(e) => handleMetalChange(idx, 'purity', e.target.value)} fullWidth /></Grid>
                    <Grid item xs={8} sm={3}><StyledTextField label="Final Weight" value={met.finalWeight} onChange={(e) => handleMetalChange(idx, 'finalWeight', e.target.value)} fullWidth placeholder="e.g. 3.68" /></Grid>
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
          </Grid>

<<<<<<< HEAD
          {/* ===== 6. CHAIN / CHAKI INFORMATION ===== */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
                <SectionHeader step="6" icon={<LinkIcon size={20} color={BRAND} />} title="CHAIN / CHAKI INFORMATION" description="Chain inclusions, lengths and component weights" />
=======
          {/* 6. SIZE & COMPONENT DETAILS */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
                <SectionHeader step="6" icon={<LinkIcon size={20} color={BRAND} />} title="SIZE & COMPONENT DETAILS" description="Ring/Bangle size, chain details, pendant size — shown based on product type" />
>>>>>>> 0178b7ceea5eb3e2c41a240d67a038c55e1ad52f
                <Grid container spacing={2.5}>

                  {/* Ring / Bangle Size — only for rings and bangles */}
                  {isRing && (
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        label={prodType === 'bangles' ? 'Bangle Size / Diameter' : 'Ring Size (e.g. 16, 17, 18)'}
                        name="ringSize"
                        value={productData.ringSize || ''}
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

                  <Grid item xs={12} sm={hasChain ? 3 : 4}>
                    <FormControl fullWidth>
                      <InputLabel sx={{ fontWeight: 600 }}>Includes Chain</InputLabel>
                      <StyledSelect label="Includes Chain" name="includesChain" value={productData.includesChain} onChange={handleChange}>
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                        <MenuItem value="Optional">Optional</MenuItem>
                      </StyledSelect>
                    </FormControl>
                  </Grid>
<<<<<<< HEAD
                  <Grid item xs={12} sm={3}><StyledTextField label="Chain Length" name="chainLength" value={productData.chainLength} onChange={handleChange} fullWidth placeholder="e.g. 18 Inches" /></Grid>
                  <Grid item xs={12} sm={3}><StyledTextField label="Chain Weight" name="chainWeight" value={productData.chainWeight} onChange={handleChange} fullWidth placeholder="e.g. 1.80 g" /></Grid>
                  <Grid item xs={12} sm={3}><StyledTextField label="Chaki Weight" name="chakiWeight" value={productData.chakiWeight} onChange={handleChange} fullWidth placeholder="e.g. 0.40 g" /></Grid>
=======

                  {hasChain && (
                    <Grid item xs={12} sm={3}>
                      <StyledTextField label="Chain / Piece Length" name="chainLength" value={productData.chainLength} onChange={handleChange} fullWidth placeholder="e.g. 18 Inches / 45 cm" />
                    </Grid>
                  )}

                  <Grid item xs={12} sm={hasChain ? 3 : 4}>
                    <StyledTextField label="Chain Weight" name="chainWeight" value={productData.chainWeight} onChange={handleChange} fullWidth />
                  </Grid>
                  <Grid item xs={12} sm={hasChain ? 3 : 4}>
                    <StyledTextField label="Chaki Weight" name="chakiWeight" value={productData.chakiWeight} onChange={handleChange} fullWidth />
                  </Grid>

>>>>>>> 0178b7ceea5eb3e2c41a240d67a038c55e1ad52f
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* ===== 7. ADDITIONAL SPECIFICATIONS ===== */}
          <Grid item xs={12}>
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
                    No additional specifications added.
                  </Typography>
                )}
                {productData.additionalSpecifications.map((spec, idx) => (
                  <Grid container spacing={2} key={idx} alignItems="center" sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={5}>
                      <StyledTextField label="Specification Name" value={spec.label} onChange={(e) => handleSpecChange(idx, 'label', e.target.value)} fullWidth placeholder="e.g. Setting Type" />
                    </Grid>
                    <Grid item xs={11} sm={6}>
                      <StyledTextField label="Specification Value" value={spec.value} onChange={(e) => handleSpecChange(idx, 'value', e.target.value)} fullWidth placeholder="e.g. Prong Set" />
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
          </Grid>

          {/* ===== 8. CUSTOMER VISIBILITY ===== */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
                <SectionHeader step="8" icon={<Eye size={20} color={BRAND} />} title="CUSTOMER VISIBILITY" description="Control which technical details appear on the customer product page" />
                <Box sx={{ p: 2, bgcolor: '#fffbeb', borderRadius: '12px', border: '1px solid #fde68a', mb: 3, display: 'flex', gap: 1.5 }}>
                  <Info size={18} color="#d97706" style={{ flexShrink: 0, marginTop: 2 }} />
                  <Typography variant="body2" sx={{ color: '#92400e', fontWeight: 600 }}>
                    By default, diamond weight and metal weight are hidden from customers. Enable below to show these on the product details page.
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  {[
                    { key: 'showDiamondDetails', label: 'Show Diamond Details', desc: 'Diamond type, size, pieces visible to customers' },
                    { key: 'showMetalDetails', label: 'Show Metal Details', desc: 'Metal type and purity visible to customers' },
                    { key: 'showWeightDetails', label: 'Show Weight Details', desc: 'Final weights (gold/diamond) visible to customers' },
                  ].map(({ key, label, desc }) => (
                    <Grid item xs={12} sm={4} key={key}>
                      <Box sx={{ p: 2.5, border: '1px solid #e2e8f0', borderRadius: '14px', bgcolor: productData[key] ? '#f0f9ff' : '#fafafa' }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={productData[key]}
                              onChange={handleSwitchChange(key)}
                              sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: BRAND }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: BRAND } }}
                            />
                          }
                          label={<Typography sx={{ fontWeight: 700, color: '#334155', fontSize: '0.9rem' }}>{label}</Typography>}
                        />
                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.5 }}>{desc}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* ===== SAVE BUTTON ===== */}
          <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2, mb: 6 }}>
            <Box sx={{ width: '100%', maxWidth: 450 }}>
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
                  '&:hover': { bgcolor: BRAND_DARK, transform: 'translateY(-2px)' },
                  transition: 'all 0.25s ease',
                }}
              >
                {products?.loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : '✅ SAVE CHANGES'}
              </Button>
              <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 1.5, color: '#64748b', fontWeight: 600 }}>
                All changes will be saved and reflected on the customer product page immediately.
              </Typography>
            </Box>
          </Grid>

        </Grid>
      </form>
    </Box>
  );
};

export default EditProductForm;
