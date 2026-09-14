import React, { useState, useRef } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, TextField, MenuItem, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { Sparkles, MessageCircle, X, CheckCircle, ArrowRight, Sliders, ShieldCheck, PenTool, Gem } from 'lucide-react';
import { openWhatsApp } from '../../../../utils/whatsapp';

const metalOptions = [
  '18K Yellow Gold',
  '18K Rose Gold',
  '18K Silver',
  '950 Platinum',
  '22K Yellow Gold (BIS Hallmarked)',
];

const diamondTypes = [
  'Natural Diamond (GIA/IGI Certified)',
  'Lab Grown Diamond (IGI Certified)',
  'Moissanite',
  'Precious Gemstones (Ruby, Sapphire, Emerald)',
  'No Diamond (Plain Metal)',
  'Other / Custom Choice',
];

const jewelTypes = [
  'Custom Ring',
  // 'Bespoke Wedding Band',
  'Custom Pendant & Necklace',
  'Custom Earrings',
  'Custom Bracelet / Bangle',
  'Other',
];

const CustomJewellerySection = () => {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const sliderRef = useRef(null);

  // Modal Form State
  const [formData, setFormData] = useState({
    jewelleryType: 'Custom Ring',
    metalChoice: '18K Silver',
    diamondType: 'Lab Grown Diamond (IGI Certified)',
    notes: '',
  });

  const handleSliderMove = (clientX) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 10) percentage = 10;
    if (percentage > 90) percentage = 90;
    setSliderPos(percentage);
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging || e.buttons === 1) {
      handleSliderMove(e.clientX);
    }
  };

  const handleDirectWhatsApp = () => {
    const bespokeProduct = {
      title: `Bespoke Custom Jewellery (${formData.jewelleryType})`,
      productCode: 'BESPOKE-CUSTOM',
    };
    openWhatsApp(bespokeProduct, {
      metalColor: `${formData.metalChoice} | Diamond Type: ${formData.diamondType}${formData.notes ? ` | Notes: ${formData.notes}` : ''}`,
    });
  };

  return (
    <Box
      sx={{
        py: { xs: 8, md: 14 },
        bgcolor: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid #f1f5f9',
        borderBottom: '1px solid #f1f5f9',
      }}
    >
      {/* Background Subtle Ambient Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-100/30 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-slate-100/60 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

          {/* Left Column: Text & CTA matching requested design */}
          <div className="lg:col-span-5 flex flex-col justify-center items-start text-left space-y-6">
            
            {/* Top Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1e3545]/5 border border-[#1e3545]/15 text-[#1e3545]">
              <Sparkles size={14} className="text-[#D4AF37]" />
              <span className="text-xs font-bold uppercase tracking-[0.18em]">
                Loupe Atelier & Bespoke Studio
              </span>
            </div>

            {/* Main Headline */}
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2.25rem', sm: '3rem', md: '3.6rem' },
                fontWeight: 500,
                fontFamily: '"Playfair Display", "Cormorant Garamond", Georgia, serif',
                color: '#111827',
                lineHeight: 1.18,
                letterSpacing: '-0.01em',
              }}
            >
              Have a Design in Mind?
            </Typography>

            {/* Description Subtext */}
            <Typography
              sx={{
                fontSize: { xs: '0.98rem', sm: '1.1rem' },
                color: '#475569',
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 300,
                lineHeight: 1.7,
                maxWidth: '520px',
              }}
            >
              Craft your unique story with our &apos;Customize Your Jewellery&apos; feature.
              From stones to design, personalize your elegance with us.
            </Typography>

            {/* Action Link / Button Area */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              {/* Primary Underlined Interactive Link */}
              <button
                onClick={() => setOpenModal(true)}
                className="group relative inline-flex items-center justify-start gap-2 text-base font-semibold text-[#111827] hover:text-[#3c7399] transition-colors py-2 cursor-pointer w-fit"
              >
                <span className="font-serif text-lg tracking-wide border-b-2 border-[#111827] group-hover:border-[#3c7399] transition-all pb-0.5">
                  Customize Now
                </span>
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1.5 text-[#3c7399]" />
              </button>

              {/* Secondary Direct WhatsApp Consultation Button */}
              <Button
                onClick={handleDirectWhatsApp}
                variant="outlined"
                startIcon={<MessageCircle size={17} className="text-[#25D366]" />}
                sx={{
                  borderColor: '#cbd5e1',
                  color: '#1e293b',
                  borderRadius: '9999px',
                  px: 3,
                  py: 1.2,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  fontFamily: "'Poppins', sans-serif",
                  backgroundColor: '#ffffff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  '&:hover': {
                    borderColor: '#3c7399',
                    backgroundColor: '#f8fafc',
                    color: '#3c7399',
                    boxShadow: '0 4px 12px rgba(60,115,153,0.12)',
                  },
                }}
              >
                Chat with Master Designer
              </Button>
            </div>

            {/* Feature Highlights Badges */}
            <div className="pt-6 border-t border-slate-100 grid grid-cols-3 gap-4 w-full max-w-lg">
              <div className="flex items-center gap-2 text-slate-600">
                <PenTool size={16} className="text-[#3c7399] shrink-0" />
                <span className="text-xs font-medium">3D CAD Renders</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Gem size={16} className="text-[#D4AF37] shrink-0" />
                <span className="text-xs font-medium">GIA/IGI Diamonds</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <ShieldCheck size={16} className="text-[#3c7399] shrink-0" />
                <span className="text-xs font-medium">BIS Hallmarked</span>
              </div>
            </div>

          </div>

          {/* Right Column: Split Ring Visual Display (CAD Sketch -> Realistic Render) */}
          <div className="lg:col-span-7 flex justify-center items-center">
            
            <div className="relative w-full max-w-[680px] bg-white rounded-3xl p-4 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-slate-100">
              
              {/* Annotations matching requested screenshot */}
              <div className="flex justify-between items-start mb-2 px-2 sm:px-6 relative z-20 pointer-events-none">
                
                {/* Left Annotation */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-left"
                >
                  <p className="font-serif italic text-xs sm:text-sm text-slate-500 font-normal">from</p>
                  <p className="font-serif italic text-sm sm:text-base md:text-lg text-slate-800 font-semibold tracking-wide">
                    your imagination
                  </p>
                </motion.div>

                {/* Right Annotation */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-right"
                >
                  <p className="font-serif italic text-xs sm:text-sm text-slate-500 font-normal">to</p>
                  <p className="font-serif italic text-sm sm:text-base md:text-lg text-slate-800 font-semibold tracking-wide">
                    your dream ring
                  </p>
                </motion.div>

              </div>

              {/* Interactive Split Ring Image Showcase Container */}
              <div
                ref={sliderRef}
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
                className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden cursor-ew-resize select-none border border-slate-100 bg-[#ffffff] shadow-inner"
              >

                {/* Full Base Image (Split Blueprint CAD + Rendered Ring) */}
                <img
                  src="/assets/images/custom_ring_split.jpg"
                  alt="Custom Ring Design Blueprint Sketch to Realistic Render"
                  className="w-full h-full object-contain pointer-events-none"
                />

                {/* Interactive Dynamic Split Reveal Overlay */}
                <div
                  className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none transition-all duration-75"
                  style={{ width: `${sliderPos}%` }}
                >
                  <img
                    src="/assets/images/custom_ring_sketch.jpg"
                    alt="CAD Blueprint Pencil Sketch"
                    className="absolute top-0 left-0 h-full max-w-none object-contain"
                    style={{ width: sliderRef.current ? `${sliderRef.current.clientWidth}px` : '100%' }}
                  />
                </div>

                {/* Vertical Split Line & Interactive Handle */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-slate-900/60 shadow-[0_0_10px_rgba(0,0,0,0.3)] z-30 pointer-events-none"
                  style={{ left: `${sliderPos}%` }}
                >
                  {/* Axis Marker Line (Dashed Technical Blueprint Line) */}
                  <div className="absolute inset-y-0 -left-px w-[1px] border-r border-dashed border-slate-400 opacity-60" />
                  
                  {/* Interactive Slider Knob */}
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border border-slate-300 shadow-lg flex items-center justify-center text-slate-700 hover:scale-110 transition-transform">
                    <Sliders size={14} className="rotate-90" />
                  </div>
                </div>

                {/* Technical Blueprint Corner Grid Decorators */}
                <div className="absolute top-3 left-3 text-[10px] font-mono text-slate-400 pointer-events-none bg-white/80 px-2 py-0.5 rounded border border-slate-200">
                  CAD V3.2 • 2.50ct OVAL
                </div>
                <div className="absolute bottom-3 right-3 text-[10px] font-mono text-slate-500 pointer-events-none bg-white/80 px-2 py-0.5 rounded border border-slate-200">
                  PLATINUM 950 • HANDCRAFTED
                </div>

              </div>

              {/* Slider Hint Subtext */}
              <div className="mt-3 text-center">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
                  <Sliders size={12} className="text-[#3c7399]" /> Slide or hover to reveal CAD blueprint & photorealistic transformation
                </span>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Bespoke Customization Request Dialog */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '24px',
            p: 1,
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 3, pb: 1, display: 'flex', alignItems: 'center', justifyBetween: 'space-between' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1e3545]/10 flex items-center justify-center text-[#1e3545]">
              <Sparkles size={20} className="text-[#D4AF37]" />
            </div>
            <div>
              <Typography variant="h6" sx={{ fontFamily: 'serif', fontWeight: 600, color: '#1e293b' }}>
                Create Your Bespoke Piece
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                Collaborate 1-on-1 with Loupe master artisans
              </Typography>
            </div>
          </div>
          <IconButton onClick={() => setOpenModal(false)} sx={{ ml: 'auto', color: '#94a3b8' }}>
            <X size={20} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3, pt: 2 }}>
          <div className="space-y-4 pt-2">
            <TextField
              select
              fullWidth
              label="Jewellery Type"
              value={formData.jewelleryType}
              onChange={(e) => setFormData({ ...formData, jewelleryType: e.target.value })}
              variant="outlined"
              size="medium"
            >
              {jewelTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              fullWidth
              label="Preferred Metal"
              value={formData.metalChoice}
              onChange={(e) => setFormData({ ...formData, metalChoice: e.target.value })}
              variant="outlined"
              size="medium"
            >
              {metalOptions.map((metal) => (
                <MenuItem key={metal} value={metal}>
                  {metal}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              fullWidth
              label="Diamond / Gemstone Type"
              value={formData.diamondType}
              onChange={(e) => setFormData({ ...formData, diamondType: e.target.value })}
              variant="outlined"
              size="medium"
            >
              {diamondTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Design Ideas & Notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Describe your vision, setting style (e.g. Solitaire with hidden halo), or ring size..."
              variant="outlined"
            />

            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-amber-900 text-xs flex items-start gap-2.5">
              <CheckCircle size={16} className="text-[#D4AF37] shrink-0 mt-0.5" />
              <span>
                Our jewellery designer will review your choices and send high-resolution 3D CAD previews & transparent pricing on WhatsApp.
              </span>
            </div>

            <Button
              fullWidth
              onClick={() => {
                handleDirectWhatsApp();
                setOpenModal(false);
              }}
              variant="contained"
              startIcon={<MessageCircle size={18} />}
              sx={{
                py: 1.6,
                borderRadius: '14px',
                bgcolor: '#1e3545',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.95rem',
                textTransform: 'none',
                boxShadow: '0 10px 20px rgba(30,53,69,0.25)',
                '&:hover': {
                  bgcolor: '#11222f',
                  boxShadow: '0 14px 24px rgba(30,53,69,0.35)',
                },
              }}
            >
              Submit & Consult Master Designer on WhatsApp
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CustomJewellerySection;
