# v0.4.1 — Denge ve kayıt güvenliği incelemesi
14 Eylül 2026. Kaynak tabanı: 9b787cb62a4d03c23a2c8a83dc66e0a104d8fc0f.

## İncelemenin sonucu
- Kutu gelir kaybı kaynak kodunda ve bağımsız kontrollü koşuda doğrulandı. +1 yerine %5; diğer bonuslarla üst sınır %20 (eski %15 tavanını bırakmak kutunun tam takımda etkisini yok ederdi).
- Kalıcı eşyalar doğrudan altın vermez. Odada tüketilebilir oyuncak varsa yeni mola seçilmez; henüz eşyaya yürüyen kedi oyuncağa dönebilir. Başlamış molalar kesilmez. Sadece hedef puanını azaltan öneri bu kuralı garanti etmiyordu.
- Bu tercih yoğun odada mola animasyonlarını azaltır. Kesintisiz oyuncak yerleştiren finale ulaşma botunda mola sayısı sıfırdır. Bu bilinen bir görsel/tempo ödünleşmesidir; sakin oda testinde kutu, salıncak ve yatak kullanılır. Sonraki insan playtestinde özellikle değerlendirilmelidir.
- Fazla oyuncak satın almak nakit akışını yavaşlatır. Sonlanmamış oyuncak envanterini dikkate almayan kısa ölçüm kalıcı zarar/negatif oyuncak EV'si olarak yorumlanamaz. Eski spawn kapasitesi ayrıca ikinci fareyi veya üçüncü böceği düşürebiliyordu.
- Yeni alımlarda odadaki kedi başına iki tüketilebilir oyuncak eşiği var. Boş odaya kedi çekebilmek için en az iki alım alanı bulunur. Mevcut dönüşümler alım sayımında yer alır ama oluşmaları alım sınırından etkilenmez. Kalıcı eşyalar ayrı sayılır. Eski kalabalık kayıtlar silinmez; fiziksel nesne güvenlik sınırı 128, normal alımlar dönüşümlere yer ayırır. Yeni kedi/oda değişimi mevcut nesneleri silmez.
- “Yer açın!” yalnızca sekiz kediye kapasite satar. Panelde doldurulacak kapasite barı yerine oyundaki tüketilebilir oyuncak sayısı gösterilir.
- Kalıcı eşyalar panelin üstüne taşındı. Küçük ekran oyun alanı yüksekliği azaltıldı. Tarayıcı ölçümü bu oturumda yapılamadı; ekran sınırı doğrulanmış değildir.
- Tırmalamanın uzun, az yerleştirme isteyen rolü açıklanır. Fiyatlar/payoutlar tekrar topluca artırılmadı. Bu, geç güç eğrisinin tümüyle düzeldiği anlamına gelmez.
- Sörf binişi ve frizbi pası kesintisiz, kaydedilebilir hareket aldı. Sörf ödülü tur sonunda verilir; kaybolan tahta hayalet ödül üretmez.
- Kalabalıkta bütün sayı etiketlerini zemine basmak yerine imleç/dokunma ile tek nesnenin bilgisi sabit ekran panelinde gösterilir. Küçük ilerleme çubukları korunur. Kediyi kapatan yüksek ev yarı saydamlaşır.

## Kayıtlar
Kayıt şeması 5; v1–v4 göçleri korunur. Reddedilen kayıt önce ayrı kurtarma anahtarına yazılır ve geri okunarak doğrulanır. Yedekleme başarısızsa otomatik kayıt engellenir. Kurtarma JSON indirme düğmesi sunulur. Kullanıcının açık Yeni oyun seçimi otomatik kaydı yeniden açar.
Geçmiş sayaç, değer ve zamanlayıcılar güncel denge sabitlerine göre reddedilmez; sonlu yapısal sınırlar kullanılır. Tünel kendi kayıtlı süresiyle tamamlanır. İç içe bozuk kayıtlar istisna fırlatmak yerine null döndürür. Bu bir bütün sürümler için sınırsız uyumluluk garantisi değildir.

## Doğrulama ve sınırlar
Bu oturumda terminal, Node yürütücüsü ve tarayıcı aracı sunulmadı. Mevcut JS modülleri V8 içinde, sadece import/export bağlaması değiştirilerek çalıştırıldı. Node test dosyalarının gövdeleri test/assert uyarlayıcısıyla yürütüldü: 45/45 geçti (36 mevcut, 9 yeni). Bu sonuç **node --test komutunun çalıştırıldığı** veya tarayıcı/FPS testinin tekrarlandığı anlamına gelmez.
Aynı progression.mjs stratejisi, beş seed × eşyasız/eşyalı: 10/10 finale ulaştı; muhasebe eşitliği ve son kayıt yüklemesi kontrol edildi. Finale ulaşma koşularına para, kedi veya beceri enjekte edilmedi. Eşyasız 1532–1732 sn, eşyalı 1163–1445 sn. Bunlar prototip bot süreleri; insan oyun süresi değil.
Kontrollü olta karşılaştırması başlangıçta test amaçlı para/beceri/kedi verir: 2 kedi, en çok 3 tüketilebilir oyuncak, 1,2 sn yerleştirme aralığı, 60 sn ısınma + 300 sn ölçüm. Seed 11/22/33. Eşyasız 1826,33 altın/dk; eski kutulu 1616,47 (−%11,49), yeni kutulu 2242 (+%22,76). İlk oyuncakların yatırım farkını azaltmak için ısınma kullanılır; kalan envanter ve RNG etkisi tamamen elimine edilmiş değildir. Bu rapordaki tablonun birebir tekrar koşusu değildir.
Ham sonuçlar: tests/progression-v041.json, tests/review-v041-results.json. Tekrar: node --test tests/*.test.mjs; node tests/progression.mjs; node tests/economy-sweep.mjs.

## Bu pakette yapılmayanlar
İkinci odaya özgün arka plan, yeni tırmalama/olta görseli, eski PNG'leri WebP'ye dönüştürme, yeni kedi ırkları ve ortak perspektif. Görsel varlık üretimi/incelemesi ve tarayıcı doğrulaması olmadan tamamlandı diye sunulmadı. Evin yarı saydamlığı ile bilgi paneli, tüm okunurluk problemlerinin çözüldüğü iddiası değildir.
GitHub kaynakları güncellenebilir. Terminal/checkout paketleme ve kaynak push adımları bu oturumda çalıştırılamadığı için canlı Sites sürümü güncellenmemiştir.
