import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Button, TextField, Grid,
  IconButton, CircularProgress, LinearProgress, Chip, Avatar, Switch, FormControlLabel,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Trash2, Upload, Video, Plus, CheckCircle, Eye, EyeOff, Edit2, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { uploadVideoViaBackend, deleteAssetViaBackend } from '../../utils/cloudinaryUtils';
import { API_URL, API_BASE_URL } from '../../config/apiConfig';

const BRAND = '#3c7399';

const SparkleVideoManager = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [form, setForm] = useState({ title: '', minPrice: '', maxPrice: '', oldPrice: '', discount: '', displayOrder: 0 });
  const [pendingVideo, setPendingVideo] = useState(null); // { secure_url, public_id }
  const [saving, setSaving] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', minPrice: '', maxPrice: '', oldPrice: '', discount: '', displayOrder: 0 });
  const [updating, setUpdating] = useState(false);
  const jwt = localStorage.getItem('jwt');

  const fetchVideos = async () => {
    try {
      const res = await fetch(`${API_URL}/api/sparkle-videos/admin`, {
        headers: { Authorization: `Bearer ${jwt}` }
      });
      const data = await res.json();
      setVideos(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchVideos(); }, []);

  const handleVideoFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadProgress(0);
    try {
      const result = await uploadVideoViaBackend(file, 'loupe-jewels/videos', (pct) => setUploadProgress(pct));
      setPendingVideo({ secure_url: result.secure_url, public_id: result.public_id });
    } catch (err) {
      alert('Video upload failed: ' + err.message);
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1500);
    }
  };

  const handleSave = async () => {
    const min = Number(form.minPrice);
    const max = Number(form.maxPrice);
    if (!pendingVideo || !form.title.trim() || !form.minPrice || !form.maxPrice) {
      return alert('Please fill in title, minimum approx price, maximum approx price, and upload a video.');
    }
    if (min <= 0 || max <= 0) {
      return alert('Approximate prices must be greater than 0.');
    }
    if (min > max) {
      return alert('Minimum price cannot be greater than maximum price.');
    }
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/sparkle-videos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
        body: JSON.stringify({
          ...form,
          minPrice: min,
          maxPrice: max,
          price: `${min} - ${max}`,
          videoUrl: pendingVideo.secure_url,
          videoPublicId: pendingVideo.public_id
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setForm({ title: '', minPrice: '', maxPrice: '', oldPrice: '', discount: '', displayOrder: 0 });
      setPendingVideo(null);
      fetchVideos();
    } catch (err) {
      alert('Save failed: ' + err.message);
    } finally { setSaving(false); }
  };

  const handleOpenEdit = (video) => {
    setEditingVideo(video);
    setEditForm({
      title: video.title || '',
      minPrice: video.minPrice || '',
      maxPrice: video.maxPrice || '',
      oldPrice: video.oldPrice || '',
      discount: video.discount || '',
      displayOrder: video.displayOrder || 0
    });
  };

  const handleEditSave = async () => {
    if (!editingVideo) return;
    const min = Number(editForm.minPrice);
    const max = Number(editForm.maxPrice);
    if (!editForm.title.trim()) {
      return alert('Please enter a product title.');
    }
    if (min > 0 && max > 0 && min > max) {
      return alert('Minimum price cannot be greater than maximum price.');
    }
    setUpdating(true);
    try {
      const res = await fetch(`${API_URL}/api/sparkle-videos/${editingVideo._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
        body: JSON.stringify({
          ...editForm,
          minPrice: min || 0,
          maxPrice: max || 0,
          price: min && max ? `${min} - ${max}` : editingVideo.price
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setEditingVideo(null);
      fetchVideos();
    } catch (err) {
      alert('Update failed: ' + err.message);
    } finally { setUpdating(false); }
  };

  const handleDelete = async (video) => {
    if (!window.confirm(`Delete "${video.title}"?`)) return;
    try {
      await fetch(`${API_URL}/api/sparkle-videos/${video._id}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${jwt}` }
      });
      fetchVideos();
    } catch (e) { alert('Delete failed'); }
  };

  const handleToggle = async (video) => {
    try {
      await fetch(`${API_URL}/api/sparkle-videos/${video._id}/toggle`, {
        method: 'PATCH', headers: { Authorization: `Bearer ${jwt}` }
      });
      fetchVideos();
    } catch (e) { alert('Toggle failed'); }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 0 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#111827', letterSpacing: '-1px' }}>
            Sparkle Videos
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mt: 0.5 }}>
            Manage videos shown in the "Find Your Perfect Sparkle" section on the homepage.
          </Typography>
        </Box>
      </motion.div>

      {/* Upload Form */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
        <Card sx={{ borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', mb: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Avatar sx={{ bgcolor: '#f0f9ff', color: BRAND, width: 44, height: 44, borderRadius: '12px' }}>
                <Plus size={20} />
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#111827' }}>Add New Sparkle Video</Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>Upload a video and fill in the product details</Typography>
              </Box>
            </Box>

            {/* Video Upload Zone */}
            <Box
              component="label"
              sx={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                p: 4, border: `2px dashed ${uploading ? '#94a3b8' : BRAND}`, borderRadius: '16px',
                bgcolor: pendingVideo ? '#f0fff4' : uploading ? '#f8fafc' : '#f0f9ff',
                cursor: uploading ? 'not-allowed' : 'pointer', transition: 'all 0.3s', mb: 3,
                '&:hover': { bgcolor: uploading ? '#f8fafc' : '#e0f2fe' }
              }}
            >
              <Avatar sx={{ bgcolor: '#fff', color: pendingVideo ? '#22c55e' : uploading ? '#94a3b8' : BRAND, width: 56, height: 56, mb: 2, boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
                {uploading ? <CircularProgress size={24} sx={{ color: '#94a3b8' }} /> : pendingVideo ? <CheckCircle size={24} /> : <Video size={24} />}
              </Avatar>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: pendingVideo ? '#16a34a' : uploading ? '#94a3b8' : '#1e293b' }}>
                {uploading ? 'Uploading video to Cloudinary...' : pendingVideo ? '✓ Video uploaded successfully!' : 'Click to upload a video (MP4, WEBM, MOV)'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, mt: 0.5 }}>
                Max 100MB · Stored at best quality
              </Typography>
              <input type="file" accept="video/*" hidden disabled={uploading} onChange={handleVideoFile} />
            </Box>

            {uploading && (
              <Box sx={{ mb: 3 }}>
                <LinearProgress
                  variant={uploadProgress > 0 ? 'determinate' : 'indeterminate'}
                  value={uploadProgress}
                  sx={{ borderRadius: 4, height: 6, bgcolor: '#e2e8f0', '& .MuiLinearProgress-bar': { bgcolor: BRAND } }}
                />
                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, mt: 0.5, display: 'block', textAlign: 'center' }}>
                  {uploadProgress > 0 ? `${uploadProgress}% — Saving at best quality on Cloudinary...` : 'Preparing...'}
                </Typography>
              </Box>
            )}

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Product Title *" 
                  value={form.title} 
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  fullWidth 
                  size="small" 
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} 
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField 
                  label="Min Approx Price (₹) *" 
                  type="number"
                  inputProps={{ min: 0 }}
                  value={form.minPrice} 
                  onChange={e => setForm(p => ({ ...p, minPrice: e.target.value }))}
                  fullWidth 
                  size="small" 
                  helperText="Lower range"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} 
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField 
                  label="Max Approx Price (₹) *" 
                  type="number"
                  inputProps={{ min: 0 }}
                  value={form.maxPrice} 
                  onChange={e => setForm(p => ({ ...p, maxPrice: e.target.value }))}
                  fullWidth 
                  size="small" 
                  helperText="Upper range"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} 
                />
              </Grid>
              <Grid item xs={6} sm={4}>
                <TextField 
                  label="Old Ref Price (₹)" 
                  value={form.oldPrice} 
                  onChange={e => setForm(p => ({ ...p, oldPrice: e.target.value }))}
                  fullWidth 
                  size="small" 
                  helperText="Optional strike-through"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} 
                />
              </Grid>
              <Grid item xs={6} sm={4}>
                <TextField 
                  label="Discount Tag (e.g. 10% Off)" 
                  value={form.discount} 
                  onChange={e => setForm(p => ({ ...p, discount: e.target.value }))}
                  fullWidth 
                  size="small" 
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} 
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField 
                  label="Display Order" 
                  type="number" 
                  value={form.displayOrder} 
                  onChange={e => setForm(p => ({ ...p, displayOrder: Number(e.target.value) }))}
                  fullWidth 
                  size="small" 
                  helperText="Lower numbers show first"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} 
                />
              </Grid>

              {/* Live Preview Box */}
              <Grid item xs={12}>
                <Box sx={{ p: 2, bgcolor: '#f0f9ff', borderRadius: '12px', border: '1px solid #bae6fd', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Info size={20} color="#0284c7" />
                  <Typography variant="body2" sx={{ color: '#0369a1', fontWeight: 600 }}>
                    Customer sees: <strong>Approx. ₹{Number(form.minPrice || 0).toLocaleString('en-IN')} – ₹{Number(form.maxPrice || 0).toLocaleString('en-IN')}</strong>. Exact price is shared over WhatsApp.
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Button
                  onClick={handleSave}
                  disabled={!pendingVideo || !form.title || !form.minPrice || !form.maxPrice || saving}
                  variant="contained"
                  startIcon={saving ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <Plus size={18} />}
                  sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 800, bgcolor: BRAND, '&:hover': { bgcolor: '#5fa0b8' }, px: 4 }}
                >
                  {saving ? 'Saving...' : 'Add Sparkle Video'}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

      {/* Video List */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress sx={{ color: BRAND }} />
        </Box>
      ) : videos.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Video size={48} color="#cbd5e1" />
          <Typography sx={{ color: '#94a3b8', fontWeight: 600, mt: 2 }}>No sparkle videos yet. Upload one above.</Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {videos.map((video, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={video._id}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}>
                <Card sx={{ borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                  <Box sx={{ position: 'relative', aspectRatio: '4/5', bgcolor: '#0f172a' }}>
                    <video
                      src={video.videoUrl}
                      muted autoPlay loop playsInline
                      style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: video.isActive ? 1 : 0.4 }}
                    />
                    <Chip
                      label={video.isActive ? 'Active' : 'Hidden'}
                      size="small"
                      sx={{ position: 'absolute', top: 10, left: 10, bgcolor: video.isActive ? '#22c55e' : '#94a3b8', color: '#fff', fontWeight: 700, fontSize: '0.65rem' }}
                    />
                    <Chip
                      label={`Order #${video.displayOrder}`}
                      size="small"
                      sx={{ position: 'absolute', top: 10, right: 10, bgcolor: 'rgba(0,0,0,0.5)', color: '#fff', fontWeight: 700, fontSize: '0.65rem' }}
                    />
                  </Box>
                  <CardContent sx={{ p: 2 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#111827', mb: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {video.title}
                    </Typography>
                    
                    {/* Price Range Display */}
                    <Box sx={{ mb: 2 }}>
                      <Typography sx={{ color: '#64748b', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Approx. Price Range
                      </Typography>
                      {video.minPrice && video.maxPrice ? (
                        <Typography sx={{ color: BRAND, fontWeight: 800, fontSize: '0.95rem' }}>
                          ₹{Number(video.minPrice).toLocaleString('en-IN')} – ₹{Number(video.maxPrice).toLocaleString('en-IN')}
                        </Typography>
                      ) : (
                        <Typography sx={{ color: BRAND, fontWeight: 800, fontSize: '0.95rem' }}>
                          ₹{video.price || 'Price on request'}
                        </Typography>
                      )}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        {video.oldPrice && (
                          <Typography sx={{ color: '#94a3b8', fontSize: '0.75rem', textDecoration: 'line-through' }}>
                            ₹{video.oldPrice}
                          </Typography>
                        )}
                        {video.discount && (
                          <Chip label={video.discount} size="small" sx={{ bgcolor: '#fef3c7', color: '#92400e', fontWeight: 700, fontSize: '0.6rem', height: 18 }} />
                        )}
                      </Box>
                    </Box>

                    {/* Actions: Edit, Toggle Active, Delete */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1, borderTop: '1px solid #f1f5f9' }}>
                      <Button
                        size="small"
                        onClick={() => handleOpenEdit(video)}
                        startIcon={<Edit2 size={14} />}
                        sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.75rem', color: BRAND, bgcolor: '#f0f9ff', borderRadius: '8px', px: 1.5, '&:hover': { bgcolor: '#e0f2fe' } }}
                      >
                        Edit
                      </Button>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton
                          onClick={() => handleToggle(video)}
                          size="small"
                          sx={{ bgcolor: video.isActive ? '#f0fff4' : '#f8fafc', color: video.isActive ? '#22c55e' : '#94a3b8', borderRadius: '8px' }}
                          title={video.isActive ? "Hide video" : "Show video"}
                        >
                          {video.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(video)}
                          size="small"
                          sx={{ bgcolor: '#fff1f2', color: '#f43f5e', borderRadius: '8px', '&:hover': { bgcolor: '#ffe4e6' } }}
                          title="Delete video"
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Edit Video Modal */}
      <Dialog 
        open={Boolean(editingVideo)} 
        onClose={() => setEditingVideo(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#111827', pb: 1 }}>
          Edit Sparkle Video Details
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 2.5 }}>
            Update the title, approximate price range, or display order without re-uploading the video.
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Product Title *"
                value={editForm.title}
                onChange={e => setEditForm(p => ({ ...p, title: e.target.value }))}
                fullWidth
                size="small"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Min Approx Price (₹) *"
                type="number"
                inputProps={{ min: 0 }}
                value={editForm.minPrice}
                onChange={e => setEditForm(p => ({ ...p, minPrice: e.target.value }))}
                fullWidth
                size="small"
                helperText="Lower range"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Max Approx Price (₹) *"
                type="number"
                inputProps={{ min: 0 }}
                value={editForm.maxPrice}
                onChange={e => setEditForm(p => ({ ...p, maxPrice: e.target.value }))}
                fullWidth
                size="small"
                helperText="Upper range"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Old Ref Price (₹)"
                value={editForm.oldPrice}
                onChange={e => setEditForm(p => ({ ...p, oldPrice: e.target.value }))}
                fullWidth
                size="small"
                helperText="Optional strike-through"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Discount Tag"
                value={editForm.discount}
                onChange={e => setEditForm(p => ({ ...p, discount: e.target.value }))}
                fullWidth
                size="small"
                placeholder="e.g. 10% Off"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Display Order"
                type="number"
                value={editForm.displayOrder}
                onChange={e => setEditForm(p => ({ ...p, displayOrder: Number(e.target.value) }))}
                fullWidth
                size="small"
                helperText="Lower numbers show first"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ p: 2, bgcolor: '#f0f9ff', borderRadius: '12px', border: '1px solid #bae6fd' }}>
                <Typography variant="body2" sx={{ color: '#0369a1', fontWeight: 600 }}>
                  Customer will see: <strong>Approx. ₹{Number(editForm.minPrice || 0).toLocaleString('en-IN')} – ₹{Number(editForm.maxPrice || 0).toLocaleString('en-IN')}</strong>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1 }}>
          <Button 
            onClick={() => setEditingVideo(null)} 
            sx={{ textTransform: 'none', fontWeight: 700, color: '#64748b' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleEditSave} 
            variant="contained" 
            disabled={updating || !editForm.title.trim()}
            sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 800, bgcolor: BRAND, '&:hover': { bgcolor: '#5fa0b8' }, px: 3 }}
          >
            {updating ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SparkleVideoManager;
