import { Link } from "react-router-dom";
import { useAppSelector } from "../hooks/redux";

const Home = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Profesyonel Kuaför Salonu</h1>
            <p className="hero-subtitle">
              Modern ve şık tasarımımızla sizlere en kaliteli hizmeti sunuyoruz.
              Online randevu sistemi ile kolayca randevu alabilirsiniz.
            </p>
            <div className="hero-buttons">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/user/appointment/new"
                    className="btn btn-primary btn-large"
                  >
                    📅 Randevu Oluştur
                  </Link>
                  <Link
                    to="/user/dashboard"
                    className="btn btn-outline btn-large"
                  >
                    👤 Dashboard'ım
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-large">
                    Hemen Kayıt Ol
                  </Link>
                  <Link to="/login" className="btn btn-outline btn-large">
                    Giriş Yap
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <h2 className="section-title">Hizmetlerimiz</h2>
          <div className="grid grid-3">
            <div className="service-card">
              <div className="service-icon">
                <span>💇‍♀️</span>
              </div>
              <h3 className="service-title">Saç Kesimi</h3>
              <p className="service-description">
                Profesyonel saç kesimi ve şekillendirme hizmetleri
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <span>🎨</span>
              </div>
              <h3 className="service-title">Saç Boyama</h3>
              <p className="service-description">
                Modern boyama teknikleri ve renk uygulamaları
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <span>✨</span>
              </div>
              <h3 className="service-title">Saç Bakımı</h3>
              <p className="service-description">
                Kapsamlı saç bakımı ve tedavi uygulamaları
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <span>💅</span>
              </div>
              <h3 className="service-title">Manikür</h3>
              <p className="service-description">
                Profesyonel manikür ve oje uygulamaları
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <span>🦶</span>
              </div>
              <h3 className="service-title">Pedikür</h3>
              <p className="service-description">
                Rahatlatıcı pedikür ve ayak bakımı hizmetleri
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <span>🧴</span>
              </div>
              <h3 className="service-title">Epilasyon</h3>
              <p className="service-description">
                Kalıcı epilasyon ve istenmeyen tüylerden kurtulma
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Neden Bizi Seçmelisiniz?</h2>
          <div className="grid grid-4">
            <div className="feature-item">
              <div className="feature-icon success">
                <span>✓</span>
              </div>
              <h3 className="feature-title">Online Randevu</h3>
              <p className="feature-description">
                7/24 online randevu alma imkanı
              </p>
            </div>
            <div className="feature-item">
              <div className="feature-icon info">
                <span>👨‍🎨</span>
              </div>
              <h3 className="feature-title">Uzman Kadro</h3>
              <p className="feature-description">
                Deneyimli ve profesyonel kuaförler
              </p>
            </div>
            <div className="feature-item">
              <div className="feature-icon warning">
                <span>⭐</span>
              </div>
              <h3 className="feature-title">Kaliteli Hizmet</h3>
              <p className="feature-description">
                En yüksek kalitede hizmet garantisi
              </p>
            </div>
            <div className="feature-item">
              <div className="feature-icon danger">
                <span>💎</span>
              </div>
              <h3 className="feature-title">Premium Ürünler</h3>
              <p className="feature-description">
                Kaliteli ve güvenli ürün kullanımı
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            {isAuthenticated ? (
              <>
                <h2 className="cta-title">Hoş Geldiniz, {user?.name}! 👋</h2>
                <p className="cta-subtitle">
                  Hemen yeni bir randevu oluşturun ve profesyonel hizmetimizden
                  yararlanın
                </p>
                <div className="cta-buttons">
                  <Link
                    to="/user/appointment/new"
                    className="btn btn-primary btn-large"
                  >
                    📅 Yeni Randevu Oluştur
                  </Link>
                  <Link
                    to="/user/dashboard"
                    className="btn btn-secondary btn-large"
                  >
                    👤 Randevularımı Görüntüle
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h2 className="cta-title">Hemen Randevu Alın</h2>
                <p className="cta-subtitle">
                  Profesyonel hizmetimizden yararlanmak için hemen kayıt olun
                </p>
                <div className="cta-buttons">
                  <Link to="/register" className="btn btn-primary btn-large">
                    Ücretsiz Kayıt Ol
                  </Link>
                  <Link to="/login" className="btn btn-outline btn-large">
                    Zaten Üyeyim
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
