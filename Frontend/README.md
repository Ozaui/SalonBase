# SalonBase - Kuaför Salonu Yönetim Sistemi

Modern ve kullanıcı dostu bir kuaför salonu yönetim sistemi. React, TypeScript, Redux Toolkit ve React Router kullanılarak geliştirilmiştir.

## 🚀 Özellikler

### Müşteri Özellikleri

- 📅 Online randevu alma
- 👤 Kişisel dashboard
- 📋 Randevu geçmişi görüntüleme
- ✏️ Randevu düzenleme ve iptal etme

### Admin Özellikleri

- 👨‍💼 Kapsamlı admin paneli
- 📊 Randevu istatistikleri
- 📋 Tüm randevuları yönetme
- 💇‍♀️ Hizmet yönetimi
- 👥 Kullanıcı yönetimi
- ✅ Randevu durumu güncelleme

## 🛠️ Teknolojiler

- **Frontend Framework:** React 18
- **Language:** TypeScript
- **State Management:** Redux Toolkit
- **Routing:** React Router DOM
- **Styling:** Tailwind CSS
- **Build Tool:** Vite
- **Package Manager:** npm

## 📁 Proje Yapısı

```
src/
├── components/          # Yeniden kullanılabilir bileşenler
│   ├── common/         # Ortak bileşenler (ProtectedRoute, vb.)
│   ├── layout/         # Layout bileşenleri (Header, Footer, Layout)
│   ├── forms/          # Form bileşenleri
│   └── ui/             # UI bileşenleri
├── pages/              # Sayfa bileşenleri
│   ├── auth/           # Kimlik doğrulama sayfaları
│   ├── user/           # Kullanıcı sayfaları
│   └── admin/          # Admin sayfaları
├── store/              # Redux store
│   └── slices/         # Redux slices
├── hooks/              # Custom hooks
├── types/              # TypeScript tip tanımları
├── utils/              # Yardımcı fonksiyonlar
└── services/           # API servisleri
```

## 🚀 Kurulum

1. **Projeyi klonlayın:**

```bash
git clone <repository-url>
cd Frontend
```

2. **Bağımlılıkları yükleyin:**

```bash
npm install
```

3. **Geliştirme sunucusunu başlatın:**

```bash
npm run dev
```

4. **Tarayıcınızda açın:**

```
http://localhost:5173
```

## 📋 Kullanım

### Müşteri Kullanımı

1. Ana sayfadan "Kayıt Ol" butonuna tıklayın
2. Hesabınızı oluşturun
3. Dashboard'dan yeni randevu alın
4. Randevularınızı görüntüleyin ve yönetin

### Admin Kullanımı

1. Admin hesabıyla giriş yapın
2. Admin panelinden tüm işlemleri yönetin
3. Randevuları onaylayın/iptal edin
4. Hizmetleri ve kullanıcıları yönetin

## 🔧 Geliştirme

### Yeni özellik ekleme:

1. İlgili Redux slice'ı oluşturun/güncelleyin
2. Gerekli bileşenleri oluşturun
3. Router'a yeni rotaları ekleyin
4. TypeScript tiplerini güncelleyin

### API Entegrasyonu:

- Tüm API çağrıları Redux Toolkit async thunks kullanır
- API endpoint'leri `src/store/slices/` dosyalarında tanımlanır
- Token tabanlı kimlik doğrulama kullanılır

## 🎨 Tasarım

- **Renk Paleti:** Mor tonları (purple-600, purple-700)
- **UI Framework:** Tailwind CSS
- **Responsive:** Mobil uyumlu tasarım
- **Modern:** Temiz ve kullanıcı dostu arayüz

## 📱 Responsive Tasarım

Proje tamamen responsive olarak tasarlanmıştır:

- 📱 Mobil (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)

## 🔐 Güvenlik

- JWT token tabanlı kimlik doğrulama
- Protected routes ile sayfa koruması
- Role-based access control (Admin/User)
- Form validasyonu

## 🚀 Production Build

```bash
npm run build
```

Build dosyaları `dist/` klasöründe oluşturulur.

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add some amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 İletişim

- **Email:** info@salonbase.com
- **Telefon:** +90 555 123 4567
- **Adres:** İstanbul, Türkiye

---

**SalonBase** - Profesyonel kuaför salonu yönetim sistemi
