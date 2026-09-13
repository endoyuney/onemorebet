# v0.3 doğrulama — 13 Eylül 2026

29/29 otomatik test geçti. JavaScript modüllerinin sözdizimi kontrolleri geçti. Beş RNG seed için gerçek oyun motorunda normal satın alma eylemleri kullanıldı; para, kedi veya beceri eklenmedi. Her adımda altın defteri dengesi ve negatif olmayan nakit; finalde kaydın yüklenebilmesi doğrulandı.

| Seed | Final (sn) | İlk dönüşüm | Futbol | Basketbol | Olta | Yan oda | Bakım gideri | Final altını |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 11 | 1219 | 32 | 138 | 259 | 367 | 776 | 157 | 54 |
| 22 | 1234 | 35 | 151 | 274 | 371 | 793 | 155 | 20 |
| 33 | 1190 | 35 | 149 | 268 | 373 | 756 | 151 | 5 |
| 44 | 1218 | 29 | 144 | 272 | 378 | 774 | 158 | 37 |
| 55 | 1205 | 36 | 152 | 276 | 376 | 776 | 153 | 12 |

Bütün zamanlar simülasyon saniyesidir. Hedefleri bilen bot 1,2 saniyede bir satın alma kararı verir; yeni oyuncunun düşünme/menü süresi dahil değildir. Bot finale 19,8–20,6 dakikada ulaştı; ilk kalıcı dönüşüm 29–36 saniyede açıldı. Beş koşuda bütün odaların aynı anda oyuncaksız kaldığı süre yuvarlamayla 0 saniyedir. Tam sonuçlar progression-v03.json içinde.

Bu beş koşu tek satın alma stratejisidir; optimal strateji kanıtı, insan eğlencesi veya nihai oyun süresi değildir. Önceki v0.2 botu farklı karar sıklığı kullandığından eski/yeni süre oranı kontrollü bir kıyas sayılmaz. Ana giderler oyuncak, keşif ve kedi alımlarıdır. Mama/su bu koşularda brüt gelirin yaklaşık %1,1'ini götürdü; ekonomiyi tek başına dengelemesi beklenmez.

Yeni kontroller: para ile aşama atlayamama; kedi kapasitesi; mevcut evin kat maliyeti, kurulumu ve kayıt devamlılığı; tünelde kesintisiz konum, çıkış sayacı, kayıt determinismi ve kaybolan hedefin ödülsüz iptali; bakımın artışı, korunan son dört altın ve borç birikmemesi; dokuz saniyelik otomasyonun kaydı; v0.2 açılımlarının korunması. Önceki fizik, yatak, kamera, dönüşüm ve v0.1 kayıt testleri de geçti.

Bu sürümde tarayıcı görsel/etkileşim playtesti yapılmadı. Tünelde kedi gövdesinin görünmesi/kaybolması, üç katın okunurluğu ve bakımın oyuncuda yarattığı his kullanıcı playtestiyle değerlendirilmeli. Yeni ırk sprite'ları ve oda perspektifi henüz değiştirilmedi.
