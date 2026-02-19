import React from 'react';
import { ShoppingCart, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-auto">
      {/* Back to Top Button */}
      <div 
        className="bg-secondary text-center py-3 cursor-pointer hover-bg-opacity"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{ cursor: 'pointer' }}
      >
        <span className="small fw-semibold">Back to top</span>
      </div>

      {/* Main Footer Content */}
      <div className="container-fluid py-5" style={{ backgroundColor: '#232F3E' }}>
        <div className="container">
          <div className="row g-4">
            {/* About Section */}
            <div className="col-12 col-lg-6">
              <div className="d-flex align-items-center gap-2 mb-3">
                <ShoppingCart size={28} className="text-warning" />
                <span className="fw-bold fs-4">BuyByBest</span>
              </div>
              <p className="text-white-50 mb-0" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                The Buy by Best – Social Community Platform is a modern ecommerce system that combines online buying and selling with social community interaction to improve trust, transparency, and user engagement.
              </p>
            </div>

            {/* Social Media Links */}
            <div className="col-12 col-sm-6 col-lg-3">
              <h6 className="fw-bold mb-3" style={{ fontSize: '16px' }}>Connect with Us</h6>
              <div className="d-flex flex-column gap-2">
                <a href="#" className="text-white-50 text-decoration-none hover-white d-flex align-items-center gap-2" style={{ fontSize: '14px' }}>
                  <Facebook size={18} />
                  Facebook
                </a>
                <a href="#" className="text-white-50 text-decoration-none hover-white d-flex align-items-center gap-2" style={{ fontSize: '14px' }}>
                  <Twitter size={18} />
                  Twitter
                </a>
                <a href="#" className="text-white-50 text-decoration-none hover-white d-flex align-items-center gap-2" style={{ fontSize: '14px' }}>
                  <Instagram size={18} />
                  Instagram
                </a>
                <a href="#" className="text-white-50 text-decoration-none hover-white d-flex align-items-center gap-2" style={{ fontSize: '14px' }}>
                  <Youtube size={18} />
                  YouTube
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-12 col-sm-6 col-lg-3">
              <h6 className="fw-bold mb-3" style={{ fontSize: '16px' }}>Quick Links</h6>
              <div className="d-flex flex-column gap-2">
                <a href="#" className="text-white-50 text-decoration-none hover-white" style={{ fontSize: '14px' }}>
                  About Us
                </a>
                <a href="#" className="text-white-50 text-decoration-none hover-white" style={{ fontSize: '14px' }}>
                  Help & Support
                </a>
                <a href="#" className="text-white-50 text-decoration-none hover-white" style={{ fontSize: '14px' }}>
                  Privacy Policy
                </a>
                <a href="#" className="text-white-50 text-decoration-none hover-white" style={{ fontSize: '14px' }}>
                  Terms of Service
                </a>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="row mt-5 pt-4 border-top border-secondary g-3">
            <div className="col-12 mb-3">
              <h6 className="fw-bold" style={{ fontSize: '16px' }}>Contact Us</h6>
            </div>
            
            <div className="col-12 col-md-4">
              <div className="d-flex align-items-start gap-3">
                <div className="bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '40px', height: '40px' }}>
                  <Phone size={20} />
                </div>
                <div>
                  <p className="mb-1 fw-semibold" style={{ fontSize: '14px' }}>Phone</p>
                  <p className="mb-0 text-white-50" style={{ fontSize: '13px' }}>
                    1800-123-4567<br />
                    <span style={{ fontSize: '11px' }}>(Toll Free)</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="d-flex align-items-start gap-3">
                <div className="bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '40px', height: '40px' }}>
                  <Mail size={20} />
                </div>
                <div>
                  <p className="mb-1 fw-semibold" style={{ fontSize: '14px' }}>Email</p>
                  <p className="mb-0 text-white-50" style={{ fontSize: '13px', wordBreak: 'break-all' }}>
                    support@buybybest.in
                  </p>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="d-flex align-items-start gap-3">
                <div className="bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '40px', height: '40px' }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="mb-1 fw-semibold" style={{ fontSize: '14px' }}>Address</p>
                  <p className="mb-0 text-white-50" style={{ fontSize: '13px', lineHeight: '1.5' }}>
                    123 Shopping Street,<br />
                    Mumbai, India
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-top border-secondary" style={{ backgroundColor: '#131A22' }}>
        <div className="container py-4">
          {/* Payment Methods */}
          <div className="text-center mb-3">
            <p className="text-white-50 mb-2" style={{ fontSize: '12px' }}>We Accept</p>
            <div className="d-flex justify-content-center gap-2 flex-wrap">
              <span className="badge bg-light text-dark px-3 py-2" style={{ fontSize: '11px', fontWeight: '500' }}>VISA</span>
              <span className="badge bg-light text-dark px-3 py-2" style={{ fontSize: '11px', fontWeight: '500' }}>MasterCard</span>
              <span className="badge bg-light text-dark px-3 py-2" style={{ fontSize: '11px', fontWeight: '500' }}>RuPay</span>
              <span className="badge bg-light text-dark px-3 py-2" style={{ fontSize: '11px', fontWeight: '500' }}>UPI</span>
              <span className="badge bg-light text-dark px-3 py-2" style={{ fontSize: '11px', fontWeight: '500' }}>Net Banking</span>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center pt-3 border-top border-secondary">
            <p className="text-white-50 mb-0" style={{ fontSize: '12px' }}>
              © 2024, BuyByBest.in, Inc. or its affiliates. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .hover-white:hover {
          color: #fff !important;
          text-decoration: underline !important;
        }
        
        .hover-bg-opacity:hover {
          opacity: 0.8;
        }
        
        @media (max-width: 768px) {
          footer .container {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;