# Her Yer Kedi — v0.2

Yunus'un ilk ticari oyun fikri için kısa, oynanabilir kedi/oyuncak prototipi. Ana konsept 10 Eylül 2026'da v0.1 playtestinden sonra onaylandı. Bu sürüm salonu, ayrıntılı piksel kedileri, fizik hissini ve bağlı odaları deniyor.

Canlı prototip: https://her-yer-kedi-yunus.hkh69nt4fv.chatgpt.site

GitHub: `endoyuney/onemorebet`, `feature/her-yer-kedi-v0.2`, `her-yer-kedi/` klasörü. Eski ONE MORE BET dosyaları korunur.

## Oyna

- Oyuncak seç → zemine dokun. Kediler oyuncağı kendileri fark edip oynar.
- Topa tekrar dokun → zıplat. Topu sürükle/bırak → o yönde fırlat.
- Tekerlek veya iki parmak → yakınlaştır; boş zemini sürükle → kamerayı kaydır.
- Oda düğmesi → odaklan; **Ev / H** → bütün evi göster. Boşluk → seçili oyuncak. 1–7 → oyuncak seçimi.
- Tenis: 1 altın / +3 ödül, kısa sekme. Futbol: 2 / +5, uzun yuvarlanma. Basketbol: 3 / +7, yüksek sekme. Son iki top keşif ağacından açılır.
- Yatak: 12 altın, kalıcı; oda başına iki adet. Kediler oyun aralarında veya oda sakinken altı saniye uyur, tamamlanan uyku +2 altın verir. Uyku sonrası en az 18 saniye ara vardır. Açlık/bakım cezası yok.
- Toplar → fare/frizbi/böcek; ev → tünel; olta → tüy; tahta → sörf dönüşümleri korunur.
- Yan oda açılınca kediler ve toplar kapıdan geçebilir. Kamera başka yerdeyken iki oda da çalışır.
- Küçük final: iki oda, altı kedi, 20 tünel geçişi, bir tüy, üç sörf turu. Sonrasında dokuz yerel başarım ve keşifler devam eder.
- Her 20 saniyede ücretsiz top. Menüler açıkken veya sekme gizliyken oyun durur. Çevrimdışı kazanç yok.
- Otomatik kayıt aynı tarayıcıda tutulur; v0.1 kayıtları altın/kedi/keşif kaybetmeden v0.2'ye taşınır.

## Çalıştırma ve kod

Derleme veya paket kurulumu gerekmez. Proje klasöründe `python -m http.server 8000 --directory dist` çalıştırıp `http://localhost:8000` açın. ES modülleri nedeniyle index.html dosyasını doğrudan çift tıklamak yerine yerel sunucu kullanın.

- `dist/engine.mjs`: DOM'dan bağımsız, seed'li ve kaydedilebilir oyun simülasyonu.
- `dist/physics.mjs`: zemin + yükseklik fiziği, sekme, mobilya ve kapı çarpışmaları.
- `dist/camera.mjs`: kamera koordinatları, odak, zoom ve kaydırma.
- `dist/app.js`: Canvas çizimi, kontroller, yerel kayıt ve arayüz.
- `dist/atlas.mjs`: özgün görsellerin sprite bölgeleri.

## Doğrulama

`node --test tests/*.test.mjs` — 21 test: dönüşümler, ödüller, beceri koşulları, yeni top fiziği, kapı geçişi, yatak/uyku, kayıt devamlılığı ve kamera koordinatları.

`node tests/progression.mjs` — beş seed ile normal satın alma eylemleri kullanarak küçük finale ulaşır. Sonuçlar `tests/RESULTS.md` içindedir. Bu simülasyon insan eğlencesini veya gerçek oyuncu tamamlama süresini ölçmez. Bu sürümde tarayıcıda görsel/etkileşim playtesti yapılmadı.

## Görseller ve sınırlar

Kedi, salon ve ana oyuncak atlasları bu proje için OpenAI image generation ile üretildi. Kullanıcının filigranlı referansı yalnızca görsel yön içindir; stok resim ve filigran oyuna alınmadı. Tam üretim istemleri ve kaynak boyutları `docs/` içindedir. Üç kedi görünümü, iki hareket pozu ve bir uyku pozu vardır; tam animasyon seti değildir. Fare, tüy, sörf gibi bazı ikincil oyuncaklar hâlâ platform emojileridir. Son görsel bütünlük çalışması bekler.

Bu kısa prototip, planlanan birkaç saatlik ticari kampanya değildir. Yalnızca iki oda vardır; ikinci oda aynı salon zeminini kullanır. Merdiven/üçüncü oda eklenmedi. Oda kapasitesi dönüşümden doğan ek oyuncakları sınırlayabilir. Tam 3D fizik, Steam bağlantısı, bakım sistemi veya çevrimdışı ilerleme içermez.

## Unity'ye geçiş

Mevcut çalışma tarayıcı prototipidir. Bu ortamda bağlı Unity Editor/MCP, Unity CLI veya game-dev CLI bulunmadığından Unity derlemesi yapılmadı. Oyun mantığı, ayarlar ve görseller ileride taşınabilir; JavaScript simülasyonunun C#'a aktarılması ve gerçek Unity derleme/PlayMode doğrulaması gerekir. Ücretli 3D üretim, lisans veya paket kurulumu yapılmadı.
