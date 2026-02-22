# DevTV Admin Panel – DevFest 2026 Bursa

DevTV Admin Panel, Google Developer Groups (GDG) tarafından düzenlenen **DevFest 2026 Bursa** etkinliğinde kullanılan yönetim paneli arayüzüdür.

Bu sistem; etkinlik kapsamındaki sponsor, workshop ve facilitator (konuşmacı/eğitmen) verilerinin merkezi olarak yönetilmesini sağlamak amacıyla geliştirilmiştir.

---

## Proje Amacı

Büyük ölçekli teknoloji etkinliklerinde içerik yönetimi, konuşmacı takibi ve sponsor organizasyonu operasyonel karmaşıklık oluşturur.

DevTV Admin Panel;

- Etkinlik içeriklerini tek merkezden yönetmeyi
- Sponsor ve workshop bilgilerini düzenlemeyi
- Facilitator verilerini kontrol etmeyi
- Sistem sağlığını izlemeyi

amaçlayan bir yönetim arayüzü olarak tasarlanmıştır.

---

## Kullanım Alanı

Bu sistem, **Google Developer Groups DevFest 2026 Bursa** etkinliğinde aktif olarak kullanılmıştır.

Etkinlik kapsamında:

- Workshop içerikleri panel üzerinden yönetildi
- Sponsor bilgileri güncellendi
- Facilitator listeleri kontrol edildi
- Sistem bağlantı durumu Health ekranı üzerinden takip edildi

---

## Özellikler

- Güvenli giriş (Login ekranı)
- Sponsor yönetim paneli
- Workshop yönetimi
- Facilitator listeleme ve düzenleme
- Health kontrol ekranı
- Axios tabanlı REST API entegrasyon altyapısı
- Modüler ve ölçeklenebilir klasör yapısı

---

## Teknik Altyapı

- React (Create React App)
- JavaScript (ES6+)
- Axios (API iletişimi)
- CSS
- RESTful backend entegrasyon yapısı

---

## Mimari Yapı

Proje modüler bir klasör yapısına sahiptir:

- `src/pages` → Uygulama sayfaları
- `src/layouts` → Admin layout yapısı
- `src/api` → Axios konfigürasyonu
- `src/config.js` → Ortam yapılandırmaları

Bu yapı, sistemin büyütülmesini ve yeni modüllerin eklenmesini kolaylaştırır.

---

## Kurulum

```bash
npm install
npm start

