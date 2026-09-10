# v0.2 kullanıcı playtesti ve ekonomi incelemesi

## Kullanıcının gözlemi

Oyunu ve görsel yönü çok beğendi. Animasyonların ve kedi çeşitliliğinin ilk prototip için sınırlı olduğunu, ileride geliştirilmesini istedi. Altın dengesi üzerinde çalışılmalı. İran, Sfenks, British, Scottish ve farklı renklerde kediler istedi. Evin tepeden, kedilerin daha karşıdan/çapraz görünmesi dikkatini çekti; ortak çapraz perspektifi tercih etti.

## Koddan doğrulanabilen ekonomi

Aşağıdaki değerler bütün etkileşimlerin tamamlandığı, dönüşüm için kapasite olduğu ve zincirde üretilen oyuncakların kaybolmadığı durumdaki toplam net altındır. Beceri satın alma maliyeti dahil değildir. Bunlar saniye başına kazanç değildir.

| Zincir | Alım | Toplam ödül | Net |
|---|---:|---:|---:|
| Tenis topu, dönüşümsüz | 1 | 3 | 2 |
| Tenis topu → iki fare | 1 | 7 | 6 |
| Futbol topu → iki fare | 2 | 9 | 7 |
| Basketbol → iki fare | 3 | 11 | 8 |
| Tek kat ev → tünel | 6 | 14 | 8 |
| İki kat ev → tünel | 6 | 28 | 22 |
| Üç kat ev → tünel | 6 | 42 | 36 |
| Olta → tüy | 7 | 14 | 7 |
| Tırmalama → üç sörf turu | 10 | 23 | 13 |

Yatak 12 altındır; tamamlanan uyku +2 verir. Satın alma maliyeti altıncı tamamlanan uykuda geri kazanılır. Kedinin yatağa gelme süresi ve oyun tercihleri nedeniyle sabit bir geri ödeme süresi yoktur.

İlk fare becerisi aynı tenis topunun netini 2'den 6'ya çıkarır. Ev katları yeni evin alım maliyetini değiştirmeden net kazancı 8 → 22 → 36 artırır; toplam gerekli etkileşimler 14 → 15 → 16'dır. Bu iki güçlü gelir sıçraması fiyat/tempo dengesinin ilk inceleme noktalarıdır. Tek başına net kazanç, bir oyuncağın üstün olduğunu kanıtlamaz: tamamlama süresi, meşgul ettiği kedi sayısı, alan ve oyuncunun tıklama yükü birlikte ölçülmelidir.

Mevcut beş-seed satın alma botu küçük finale 199–209 simülasyon saniyesinde ulaşmıştı. Bu veri insan oynanış süresi değildir. Mevcut içerik birkaç saatlik kampanya olarak değerlendirilmemeli.

## Önerilen sonraki adımlar — henüz canlı oyuna uygulanmadı

1. Oyuncunun altın sıkıntısı/birikimi yaşadığı aşamayı öğren. Denge için ilk ve geç oyun akışını ayrı ölç; tek katsayıyla bütün fiyatları artırma.
2. Ortak çapraz perspektifte bir oda ve kediyle çizim kuralını kesinleştir. Yerleştirme, kapı geçişi, çarpışma ve gölgeler de bu görünüme uysun.
3. Yeni kedi görünümlerini bu kuralla üret. İlk küçük paket İran, Sfenks, British ve Scottish olabilir; renk/desen varyantları ve koleksiyon bundan sonra genişler.
4. Yürüyüş ve dönüşü, ardından pati atma/yakalama ve uykuya geçişi iyileştir. Yeni ırkların her birine pahalı bir özel animasyon seti üretmeden ortak hareket altyapısını kur.

Görünüm/ırk ve oyun kişiliği ayrı tutulabilir: meraklı, oyuncu, uykucu gibi küçük davranış farklılıkları koleksiyonun bir ırkı zorunlu ekonomik tercih haline getirmeden çeşitlenmesini sağlar. Bu bir tasarım önerisidir.
