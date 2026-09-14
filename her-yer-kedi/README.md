# Her Yer Kedi — v0.4

Yunus'un ilk ticari oyun fikri için kısa, oynanabilir kedi/oyuncak prototipi. Ana konsept 10 Eylül 2026'da v0.1 playtestinden sonra onaylandı. Bu sürüm kullanılan kalıcı eşyaları, oda bonuslarını ve daha ayrıntılı kedi hareketlerini deniyor.

Canlı prototip: https://her-yer-kedi-yunus.hkh69nt4fv.chatgpt.site

GitHub: `endoyuney/onemorebet`, `feature/her-yer-kedi-v0.2`, `her-yer-kedi/` klasörü. Eski ONE MORE BET dosyaları korunur.

## Oyna

- Oyuncak seç → zemine dokun. Topa dokunarak yeniden zıplat; topu sürükleyip bırakarak fırlat.
- Tekerlek veya iki parmak → yakınlaştır. Zemini sürükle → kamerayı kaydır. Sabit eşyayı sürükle → aynı odada taşı.
- **Ev / H** bütün evi gösterir. Boşluk seçili oyuncağı bırakır. 1–7 önceki oyuncak kısayolları; 8 kutu, 9 salıncak.
- Oda 1100×700 birime genişletildi (önceki 900×600). Kamera ve kapılar yeni boyuta uyar; eski kayıtlar bir kez ölçeklenir.

| Oyuncak | Alış | İlk ödül | Dönüşüm ödülü |
|---|---:|---:|---:|
| Tenis | 2 | 3 | İki fare toplam 2 |
| Futbol | 50 | 58 | İki fare toplam 16 |
| Basketbol | 150 | 175 | İki fare toplam 30 |
| Olta | 400 | 470 | Tüy 90 |
| Tırmalama | 1000 | 1120 | Üç sörf turu toplam 210 |

Fare dönüşümü ilgili keşfi gerektirir. Sürpriz paket farklı dönüşümler açar. Oyuncak kedi evi hâlâ tüketilen dönüşüm oyuncağıdır: 1/2/3 kat 80/180/420 altın; devrilme 100/220/490 ve tünel 30/65/150 verir.

### Kalıcı eşyalar

| Eşya | Alış | Oda bonusu | Kullanım |
|---|---:|---|---|
| Kutu | 30 | +1 altın | İçine sıçra, otur, dışarı çık |
| Salıncak | 280 | +%10 | Koltuğa çık, birlikte sallan, in |
| Yatak | 100 | +%5 | Gönüllü uyku |

**Kalıcı eşyalar doğrudan altın üretmez.** Bonus yalnızca o odada tamamlanan top, oyuncak ev, olta ve tahtanın ilk para ödülüne eklenir. Fare/tüy/sörf/tünel gibi zincir sonuçlarında yeniden uygulanmaz. Aynı eşyanın kopyaları bonusu artırmaz; oda toplamı en çok +1 ve +%15'tir. Kesirli bonus oda başına birikir. Bonus eşya odadayken geçerlidir; sürekli kullanma zorunluluğu yoktur.

Oda başına 2 kutu, 2 yatak ve 1 salıncak yerleştirilebilir. Kullanım sırasında taşımak ziyareti güvenle iptal eder; para veya tamamlanma ödülü vermez. Kediler yoğun oyun sırasında bitirdikleri oyuncaklara göre mola verir; molalar arasında en az 60 sn vardır. Oda sakinken bu genel bekleme uygulanmaz.

Kedi kapasitesi ev geliştirmeleriyle 2 → 3 → 4 → 6 → 8 olur. Yeni kedi ücretleri 45 → 450 → 1600 → 4800 → 10000 → 18000 → 30000 altındır. Mama/su N kedi için N×(N+1)/2 altın/dakika; son 4 altın korunur, borç veya çevrimdışı gider yoktur.

Küçük final: iki oda, altı kedi, 20 tünel geçişi, bir tüy, üç sörf turu. Her 30 saniyede ücretsiz top; olta açıldıktan sonra önceki toplar otomatikleştirilebilir. Menüler ve gizli sekme oyunu duraklatır. Eski kayıtların altını, kedileri ve açılımları korunur. Yeni oyun seçmek mevcut kaydı siler.

## Çalıştırma ve kod

Derleme veya paket kurulumu gerekmez. Proje klasöründe `python -m http.server 8000 --directory dist` çalıştırıp `http://localhost:8000` açın. ES modülleri nedeniyle index.html dosyasını doğrudan çift tıklamak yerine yerel sunucu kullanın.

- `dist/economy.mjs`: fiyat, ödül, bakım ve otomasyon ayarları.
- `dist/engine.mjs`: DOM'dan bağımsız, seed'li ve kaydedilebilir oyun simülasyonu.
- `dist/physics.mjs`: zemin + yükseklik fiziği, sekme, mobilya ve kapı çarpışmaları.
- `dist/camera.mjs`: kamera koordinatları, odak, zoom ve kaydırma.
- `dist/app.js`: Canvas çizimi, kontroller, yerel kayıt ve arayüz.
- `dist/fixtures.mjs`: kalıcı eşya kullanımı, hareketi ve oda bonusu.
- `dist/sprite-import.mjs`: yeni atlas bölgeleri ve çalışma anında dış matın saydamlaştırılması.
- `dist/atlas.mjs`: özgün görsellerin sprite bölgeleri.

## Doğrulama

`node --test tests/*.test.mjs` — 36 test: dönüşümler, ödüller, beceri koşulları, yeni top fiziği, kapı geçişi, yatak/uyku, kayıt devamlılığı ve kamera koordinatları; ayrıca aşama/kapasite kilitleri, kat maliyeti, tünelde kayıt ve bakım giderleri.

`node tests/progression.mjs` — sabit eşyalı/eşyasız iki strateji ve beş seed ile normal satın alma eylemleri kullanarak küçük finale ulaşır. Sonuçlar `tests/RESULTS.md` içindedir. Bu simülasyon insan eğlencesini veya gerçek oyuncu tamamlama süresini ölçmez. Gerçek Canvas çizim fonksiyonlarıyla bir sahne karesi kontrol edildi; tarayıcıda etkileşim veya insan playtesti yapılmadı.

## Görseller ve sınırlar

Kedi, salon ve ana oyuncak atlasları bu proje için OpenAI image generation ile üretildi. Kullanıcının filigranlı referansı yalnızca görsel yön içindir; stok resim ve filigran oyuna alınmadı. Tam üretim istemleri ve kaynak boyutları `docs/` içindedir. Üç kedi görünümü korunur; her görünüşe oturma ve iki arka çapraz yürüyüş pozu eklendi. Arka pozlarda kuyruğun altında minik çarpı detayı vardır. Kutu ve salıncak giriş/kullanım/çıkışı zaman içinde canlandırılır; tam sekiz yönlü animasyon seti değildir. Fare, tüy, sörf gibi bazı ikincil oyuncaklar hâlâ platform emojileridir. Son görsel bütünlük çalışması bekler.

Bu kısa prototip, planlanan birkaç saatlik ticari kampanya değildir. Yalnızca iki oda vardır; ikinci oda aynı salon zeminini kullanır. Merdiven/üçüncü oda eklenmedi. Oda kapasitesi dönüşümden doğan ek oyuncakları sınırlayabilir. Tam 3D fizik, Steam bağlantısı veya çevrimdışı ilerleme içermez.

## Unity'ye geçiş

Mevcut çalışma tarayıcı prototipidir. Bu ortamda bağlı Unity Editor/MCP, Unity CLI veya game-dev CLI bulunmadığından Unity derlemesi yapılmadı. Oyun mantığı, ayarlar ve görseller ileride taşınabilir; JavaScript simülasyonunun C#'a aktarılması ve gerçek Unity derleme/PlayMode doğrulaması gerekir. Ücretli 3D üretim, lisans veya paket kurulumu yapılmadı.
