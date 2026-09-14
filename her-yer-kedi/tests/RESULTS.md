# v0.4 doğrulama — 14 Eylül 2026

36/36 test geçti. JavaScript sözdizimi ve dosya yolları kontrol edildi. Gerçek Canvas çizim fonksiyonları kullanılarak kutu/salıncak/yatak/arka kedi içeren sahne karesi incelendi; bu bir tarayıcı veya insan playtesti değildir.

| Seed | Eşyasız final (sn) | Eşyalı final (sn) | Eşyalı bonus altın | Kutu / salıncak / uyku ziyaretleri |
|---|---:|---:|---:|---|
| 11 | 1622 | 1466 | 12521 | 36 / 7 / 22 |
| 22 | 1462 | 1344 | 12202 | 35 / 9 / 15 |
| 33 | 1501 | 1483 | 12304 | 35 / 14 / 16 |
| 44 | 1546 | 1446 | 12402 | 46 / 3 / 15 |
| 55 | 1693 | 1446 | 12001 | 41 / 7 / 14 |

Aynı bot, aynı karar sıklığı (1,2 sn) ve beş seed ile iki strateji kullanıldı. Para, kedi veya beceri eklenmedi. Eşyalı bot, ilerleme aşamasına ve kalan oyuncak bütçesine göre her odaya bir kutu, salıncak ve yatak alır. Her adımda altın muhasebesi ve negatif olmayan bakiye; finalde kaydın yüklenmesi kontrol edildi. Eşyalı 22,4–24,7 dakika; eşyasız 24,4–28,2 dakika. Bu süreler gerçek oyuncu süresi, bütün stratejilerin taraması veya nihai birkaç saatlik kampanya değildir.

Sabit eşyalı bir odanın tek başına altın üretmediği, kopyaların bonusu artırmadığı, bonusun aynı odadaki ilk ödüle bir kez eklendiği, kesirlerin korunması, eşya taşımanın ödeme yapmadığı, kullanım sırasında kayıt/yükleme ve eski konumların tek seferlik aktarımı test edildi. Önceki ekonomi, tünel, kat, top fiziği ve kamera kontrolleri de geçti.

Yeni RGB atlaslarda üretilmiş dama zemin gerçek alpha değildi. Kaynak WebP dokuları korunur; sprite-import.mjs yükleme sırasında yalnızca dıştaki nötr matı saydamlaştırır. İncelenen sahnede kare zemin görünmedi. Tam yön seti/animasyon polish'i ve farklı ekranlarda kenar kontrolü sonraki görsel üretim işidir.
