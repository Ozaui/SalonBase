const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">✂️ SalonBase</h3>
            <p className="footer-description">
              Profesyonel kuaför salonu yönetim sistemi ile modern ve kaliteli
              hizmet deneyimi
            </p>
          </div>
          <div className="footer-section">
            <h4 className="footer-subtitle">Hızlı Linkler</h4>
            <ul className="footer-links">
              <li>
                <a href="/" className="footer-link">
                  Ana Sayfa
                </a>
              </li>
              <li>
                <a href="/login" className="footer-link">
                  Giriş
                </a>
              </li>
              <li>
                <a href="/register" className="footer-link">
                  Kayıt Ol
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4 className="footer-subtitle">İletişim</h4>
            <div className="contact-info">
              <p className="contact-item">📧 info@salonbase.com</p>
              <p className="contact-item">📞 +90 555 123 4567</p>
              <p className="contact-item">📍 İstanbul, Türkiye</p>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="copyright">© 2024 SalonBase. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
