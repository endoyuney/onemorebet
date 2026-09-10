# v0.2 doğrulama — 10 Eylül 2026

- `node --test tests/*.test.mjs`: 21/21 geçti.
- JavaScript modüllerinin sözdizimi kontrolleri geçti.
- Gerçek simülasyon üzerinden beş farklı RNG seed ile, para/beceri eklemeden, normal oyun eylemleri kullanılarak küçük finale ulaşıldı.

| Seed | Simülasyon süresi (sn) | İlk dönüşüm (sn) | İkinci oda (sn) |
|---|---:|---:|---:|
| 11 | 202 | 16 | 86 |
| 22 | 199 | 14 | 86 |
| 33 | 204 | 16 | 90 |
| 44 | 209 | 17 | 91 |
| 55 | 204 | 17 | 91 |

Bu bot çok hızlı, hedefleri bilen bir satın alma stratejisi kullanır. Sonuçlar insan oynanış süresi veya eğlence ölçümü değildir. Birkaç saatlik final kampanya henüz tasarlanmadı.

Yeni özellikler için ayrı kontroller: üç topun yükseklik/ödül farkları, havada ödül vermeme, bedelsiz yeniden fırlatma, açık/kapalı/dolu kapılar, topun peşinden odalar arası kedi geçişi, mobilya çarpışması, kalıcı yatak, tek uyku ödülü, uyku sırasında save/load determinismi, yatak kapasitesi, v0.1 kaydının taşınması ve zoom/pan koordinatları.

Görsel varlıklar ayrı dosyalar olarak incelendi. Bu sürümde tarayıcıda render veya kullanıcı etkileşimi testi yapılmadı. Özellikle gerçek telefonda iki parmak hareketi, küçük ekranda sahne okunurluğu ve fırlatma hissi kullanıcı playtestiyle değerlendirilmeli.
