# v0.4 — Kutu, salıncak ve oda bonusları

Kalıcı eşyalar kediler tarafından kullanılır ve o odadaki oyuncak ödüllerini destekler. Kutu +1, salıncak %10, yatak %5 bonus sağlar. Kopyalar bonusu katlamaz; zincir ödüllerine tekrar bonus uygulanmaz. Yatak artık doğrudan altın vermez. Kutuya giriş/oturma/çıkış, salıncağa çıkış/sallanma/iniş ve aynı odada eşya taşıma eklendi.

Üç mevcut kedi görünümüne dokuz yeni poz eklendi: oturma ve iki arka çapraz yürüyüş. Yeni görseller özgün üretimdir; referans oyunun varlıkları kullanılmadı. Oda 1100×700 oldu. Eski kayıt konumları bir kez ölçeklenir; birikimler korunur.

Futbol 50, basketbol 150, olta 400, tahta 1000 altın. Ödüller, keşif ve kedi fiyatları bu basamaklarla birlikte düzenlendi. Yoğun oyunda molalar tek tek pati vuruşuna göre değil, biten oyuncaklara göre seçilir. Bu düzeltme, kalıcı eşyalara aşırı sık gitmenin ilerlemeyi yavaşlatmasını azaltır.

36 test geçti. Beş seed'in her biri iki satın alma stratejisiyle finale ulaştı. Sabit eşyalı koşular 1344–1483, eşyasız koşular 1462–1693 simülasyon saniyesi sürdü. Gerçek oyuncu temposu ve eğlencesi bu ölçümden çıkarılamaz.

# v0.3 — Oyuncak aşamaları ve evin giderleri

Altın birikimi ve kolay kedi çoğalması, oyuncakların aşamalarını çok hızlı geçmeye yol açıyordu. Toplar 2/5/10 altınla sırayla açılır; ardından 25 altınlık olta ve 60 altınlık tahta gelir. Dönüşüm ödülleri, beceri fiyatları ve artan kedi maliyetleri yeniden düzenlendi. Kedi sayısını ev gelişimi de sınırlar.

Kedi evinin kat becerileri mevcut evlere animasyonla kat ekler. Tünel geçişi anlık konum değişikliği yerine giriş, içeride ilerleme ve çıkış kullanır; ödül yalnızca tamamlanan geçişler içindir. Geçiş ve kat kurulumu kayıt/yüklemede devam eder.

Salonda kedi sayısıyla büyüyen otomatik mama/su istasyonu ve görülebilir bakım gideri vardır. Son 4 altın korunur; borç veya çevrimdışı gider yoktur. Eski kayıtların birikimi ve açılımları korunur.

29 otomatik test geçti. Beş farklı seed ile normal satın almalar kullanılarak küçük finale 1190–1234 simülasyon saniyesinde ulaşıldı. Bu yaklaşık 20 dakikalık otomatik oyuncu ölçümüdür; insan playtesti veya birkaç saatlik nihai kampanya değildir. Ayrıntılar tests/RESULTS.md içinde.

# v0.2 — Büyüyen ev

Önceki sürümde odalar ayrı ekranlardı, kediler tek poz kullanıyordu ve toplar yükseklik/yer çekimi olmadan hareket ediyordu.

Bu sürüm salon arka planı ve ayrıntılı piksel kedi pozları ekler. Toplar fırlatılır, sekiyor ve yuvarlanır; kullanıcı topa tekrar dokunabilir veya sürükleyerek yön verebilir. İki oda ortak kapı üzerinden bağlanır, kedi ve top geçişleri simüle edilir. Kamera kaydırılabilir, yakınlaştırılabilir ve bütün eve odaklanabilir.

Tenis/futbol/basketbol çeşitleri ile kalıcı kedi yatağı ve gönüllü uyku davranışı eklendi. Eski kayıt biçimi aynı kayıt anahtarı üzerinden taşınır. Temel oyuncak dönüşümleri ve küçük final korunur.

21 otomatik test geçti; beş seed normal eylemlerle küçük finale ulaştı. İnsan playtesti ve tarayıcı görsel kontrolü bu ölçümlere dahil değildir.
