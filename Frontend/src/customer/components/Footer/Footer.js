import { Grid } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer className='w-full bg-[#a9cee5] text-[#1e3545] pt-10 pb-5 border-t border-[#1e3545]/10 overflow-hidden'>
            <div className='max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12'>
                <Grid container spacing={{ xs: 4, sm: 6, md: 8, lg: 10 }}>
                    {/* Column 1: Boutique Collections */}
                    <Grid item xs={12} sm={6} md={3}>
                        <div className='mb-8 md:mb-14'>
                            <h3 className='text-xs font-bold uppercase tracking-[0.3em] text-[#1e3545] mb-4 md:mb-10'>
                                Collections
                            </h3>
                            <ul className="space-y-4 md:space-y-6 text-[13px] font-medium text-[#1e3545]/90 tracking-wider">
                                {['Rings', 'Earrings', 'Necklace', 'Bracelets'].map((item) => (
                                    <li key={item}>
                                        <Link
                                            to={`/all-jewellery/category/${item.toLowerCase().replace('bracelets', 'bracelate')}`}
                                            className='hover:text-black transition-all duration-300 transform inline-block hover:translate-x-1'
                                        >
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                                <li>
                                    <Link to="/customize" className='italic font-semibold transition-colors'>
                                        Customize Your Piece
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </Grid>
 
                    {/* Column 2: Legal & Care */}
                    <Grid item xs={12} sm={6} md={3}>
                        <div className='mb-8 md:mb-14'>
                            <h3 className='text-xs font-bold uppercase tracking-[0.3em] text-[#1e3545] mb-4 md:mb-10'>
                                Customer Care
                            </h3>
                            <ul className="space-y-4 md:space-y-6 text-[13px] font-medium text-[#1e3545]/90 tracking-wider">
                                {[
                                    { name: 'Privacy Policy', path: '/privacy' },
                                    { name: 'Refund Policy', path: '/refund' },
                                    { name: 'Shipping Policy', path: '/shipping' },
                                    { name: 'Terms of Service', path: '/terms' },
                                    { name: 'Contact Information', path: '/contact-info' }
                                ].map((policy) => (
                                    <li key={policy.name}>
                                        <Link
                                            to={policy.path}
                                            className='hover:text-black transition-all duration-300 transform inline-block hover:translate-x-1'
                                        >
                                            {policy.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Grid>
 
                    {/* Column 3: The Circle (Newsletter) */}
                    <Grid item xs={12} sm={6} md={3}>
                        <div className='mb-8 md:mb-14 sm:pr-4'>
                            <h3 className='text-xs font-bold uppercase tracking-[0.3em] text-[#1e3545] mb-4 md:mb-10'>
                                The Circle
                            </h3>
                            <p className='text-[13px] text-[#1e3545]/80 leading-relaxed mb-6 md:mb-10'>
                                Join our exclusive list for early access to new collections and boutique events.
                            </p>
                            <div className='relative max-w-sm'>
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className='w-full bg-transparent border-b border-[#1e3545]/40 pb-3 md:pb-4 text-sm focus:outline-none focus:border-black transition-colors placeholder:text-[#1e3545]/40 text-[#1e3545]'
                                />
                                <button className='absolute right-0 bottom-3 md:bottom-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#1e3545] hover:text-black transition-colors'>
                                    Join
                                </button>
                            </div>
                        </div>
                    </Grid>
 
                    {/* Column 4: Contact Clusters */}
                    <Grid item xs={12} sm={6} md={3}>
                        <div className='mb-8 md:mb-14 text-left'>
                            <h3 className='text-xs font-bold uppercase tracking-[0.3em] text-[#1e3545] mb-4 md:mb-10'>
                                Contact
                            </h3>
                            <div className='space-y-4 md:space-y-6 text-[13px] text-[#1e3545]/90 leading-loose tracking-wide'>
                                <p className='max-w-[280px]'>
                                    <strong className="text-[#1e3545]/70 block mb-1">Address:</strong>
                                    12-17 Sardar Owners, Association, Mini Bazar, Varachha, Surat, Gujarat, India - 395006
                                </p>
                                <p>
                                    <strong className="text-[#1e3545]/70 block mb-1">Email:</strong>
                                    <a href="mailto:loupejewelsllp@gmail.com" className='hover:text-black transition-colors break-all'>
                                        loupejewelsllp@gmail.com
                                    </a>
                                </p>
                                <p>
                                    <strong className="text-[#1e3545]/70 block mb-1">Mobile No:</strong>
                                    <a href="tel:+919909109074" className='hover:text-black transition-colors'>
                                        +91 99091 09074, +91 99091 87074 <br /> +91 99091 09974
                                    </a>
                                </p>
                                <div className='flex gap-6 items-center pt-2 md:pt-4'>
                                    {[
                                        { icon: 'fa-facebook', url: 'https://www.facebook.com/loupe_jewellery/' }, // Placeholder/Guess
                                        { icon: 'fa-instagram', url: 'https://www.instagram.com/loupe_jewellery/' },
                                        { icon: 'fa-whatsapp', url: 'https://wa.me/919909109074' }
                                    ].map((social) => (
                                        <Link
                                            key={social.icon}
                                            to={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className='text-lg hover:text-black transition-all hover:-translate-y-1'
                                        >
                                            <i className={`fa-brands ${social.icon}`}></i>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Grid>
                </Grid>
 
                {/* Bottom Row Credits */}
                <div className='pt-5 border-t border-[#1e3545]/20 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left'>
                    <p className='text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.4em] text-[#1e3545]'>
                        &copy; 2025 Loupe Jewellery LLP . All rights reserved.
                    </p>
                    <p className='text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.4em] text-[#1e3545]'>
                        Dev by <a href="#" className='hover:text-black transition-colors'>Codiq Solution</a>
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
