# Her Yer Kedi — ana konsept kararı

## 10 Eylül 2026: Ana konsept kilitlendi

Yunus, v0.1 prototipini oynadıktan sonra oyunu çok beğendiğini, devam etmek istediğini ve ana konsepti kilitlediğini açıkça bildirdi. Bu, proje sahibinin olumlu ilk playtest geri bildirimidir; dış oyuncu veya ticari pazar doğrulaması olarak yorumlanmamalıdır.

### Korunacak çekirdek

- Oyuncu eve oyuncaklar yerleştirir; kediler oyuncakları kendileri fark eder ve etkileşime girer.
- Tamamlanan etkileşimler altın/ödül üretir. Altın yeni oyuncak, kedi ve gelişim için harcanır.
- Oyuncakların kırılması veya tamamlanması yeni oyuncaklara ve etkileşimlere dönüşebilir. Bu dönüşüm zincirleri temel oyun kimliğidir.
- Beceri ağacı dönüşümleri, oyuncak özelliklerini ve evin gelişimini açar.
- Daha fazla kedi, oyuncak ve oda ile sahne görünür biçimde büyür: kontrollü kedi kaosu.
- Kedi koleksiyonu, görülebilir ana oyun sonu ve sonrasında devam eden başarımlar hedef olarak korunur.

Yeni özellikler bu çekirdeği geliştirmeli. Konsepti değiştiren bir yön önerilirse, kilitli karardan ayrıldığı açıkça belirtilmeli ve Yunus'un yeni yön kararı alınmalıdır.

### Açık kalan tasarım alanları

Kesin fiyatlar, ödüller, süreler, dönüşüm olasılıkları, beceri ağacı düzeni, oda sayısı, kedi davranışları ve finalin ayrıntıları henüz kilitli değildir. Mevcut sayılar prototip ayarlarıdır. Yeni içerik fikirleri otomatik olarak üretim kapsamına alınmaz.

### Görsel karar

- Kediler biraz küçültülecek: hazırlanan değişiklik oyun alanındaki çizim boyutunu 94'ten 75 birime indirir (yaklaşık %20).
- Bu değişiklik yalnızca sahnedeki çizim ölçeğidir; kedi davranışı, hız, ekonomi, etkileşim mesafesi ve kayıt biçimi değişmez. Koleksiyon kartlarının büyük görselleri korunur.
- Piksel art ileride denenebilir; şu anda kesinleşmiş görsel yön değildir. Mevcut görseller değiştirilmez.

### Yakın geliştirme sırası

Önce kedi/oyuncak ölçeği ve sahnenin okunurluğu. Sonra hareket geri bildirimi ve dönüşümlerin görünürlüğü. Ardından gerçek oynanış notlarıyla tempo ve beceri ağacı. Bu sıra geliştirme önerisidir; yeni bir kilitli kapsam değildir.

## 10 Eylül 2026: v0.2 için sonraki kullanıcı yönlendirmesi

Yukarıdaki ilk görsel kararı bu yeni yönlendirme günceller: Yunus daha doğal oranlı, ayrıntılı piksel kediler istedi; kaba blok veya büyük gözlü çizgi film görünümü istemiyor. Gönderilen uyuyan kedi görseli bir stil referansıdır, kullanılabilir stok varlık değildir.

Bu sürümün onaylanan kapsamı:

- Salon hissi, daha küçük kediler, yürüyüş ve uyku pozları.
- Topa dokunarak yeniden fırlatma; yükseklik, yer çekimi, sekme ve mobilya/duvar çarpışması.
- Yan yana iki oda, açık kapıdan kedi/top geçişi; tekerlek/iki parmak zoom, kaydırma ve evi gösterme.
- Tenis/futbol/basketbol toplarında farklı hareket ve fiyat/ödül.
- Satın alınabilir, kaybolmayan yatak; kedilerin kendiliğinden uyuması, tamamlanan uyku ödülü.
- GitHub'da ayrı dal ve klasörde sürümlenmiş kaynak. Kullanıcı mevcut prototipi geliştirmeyi ve oynanabilir sürümü güncellemeyi istedi.

Prototip tercihleri (yeni kilitli tasarım kuralı değildir): uyku 6 sn / +2 altın; yatak 12 altın, oda başına en çok iki; henüz özel uyku skill dalı yok. İkinci odada aynı arka plan kullanılır. Merdiven, üçüncü oda, daha fazla kaynak veya bakım cezası bu turda eklenmedi.

## v0.2 sonrası kullanıcı playtesti: görsel yön onaylandı

Yunus oyunu oynadı; oyunu ve mevcut görselliği çok beğendiğini belirtti. Mevcut ayrıntılı piksel görünümü, doğal kedi oranları ve sıcak salon atmosferi korunacak. Bu, proje sahibinin geri bildirimidir; dış oyuncu veya pazar doğrulaması değildir.

Yeni açık geliştirme ihtiyaçları:

- Altın ekonomisini dengelemek. Kullanıcı henüz altının hangi aşamada az/fazla geldiğini belirtmedi; bunu varsayarak genel fiyat artışı yapılmamalı.
- İran, Sfenks, British, Scottish gibi farklı görünümler ve çok sayıda renk/desen. Yeni kediler yalnızca aynı sprite'ın renk değişimi olmamalı; kafa, kulak, tüy ve gövde siluetleri ayrışmalı.
- Mevcut iki pozlu yürüyüş ve kedi etkileşim animasyonlarını geliştirmek.
- Evin neredeyse tepeden görüntüsü ile kedilerin karşıdan/çapraz görünüşünü ortak, hafif yukarıdan çapraz bir perspektife getirmek. Kullanıcının tercihi çapraz bakış. Zemin, mobilya, kediler ve oyuncakların çizim açısı ve temas noktaları tutarlı olmalı.

Henüz kararlaştırılmayanlar: yeni ırk sayısı, kesin kamera açısı, animasyon kare sayısı, ırka özel güçler, fiyatlar ve ödüller. Kedi çeşidini artırmak bütün bu seçeneklerin otomatik onayı değildir. Önce ortak perspektifte bir oda ve örnek kedilerle üretim kuralı oturtulması önerilir.

## 13 Eylül 2026: v0.3 ekonomi ve etkileşim düzenlemesi

Yunus altının çok hızlı biriktiğini, kedilerin kolay çoğaldığını ve oyuncaklar arasında belirgin fiyat/açılım katmanları istediğini açıkladı. Evdeki kedi evi kat yükseltmesiyle fiziksel olarak büyümeli; tünel geçişi ışınlanma gibi görünmemeli. Otomatik mama/su kapları kedi sayısıyla büyüyebilir, pasif gider oluşturabilir.

Uygulanan ilk denge: toplar 2 → 5 → 10, olta 25, tahta 60 altın. Sıra yalnızca para biriktirerek atlanamaz; futbol ve basketbol deneyim eşikleri vardır. Olta açıldığında önceki toplar otomatikleştirilebilir. Yeni kedi maliyetlerine ek olarak ev gelişimine bağlı kapasite uygulanır. Kat becerileri mevcut kedi evlerini de yükseltir; biriktirilmiş ucuz evlerden bedelsiz yüksek ödül almamak için malzeme farkı maliyete eklenir.

Bakım ana ekonomik fren değil, küçük sürekli giderdir. Oyuncak, keşif ve yeni kedi yatırımları ana harcamalardır. N kedi için N×(N+1)/2 altın/dakika; borç, açlıktan kayıp veya çevrimdışı ceza yoktur. Bakım son 4 altını tüketmez. Bu değerler ilk playtest ayarıdır.

Kişilik ırkla eşitlenmemeli: kullanıcının aynı ırktaki iki kedisinin karakterleri farklıdır. Mevcut bireysel oyun tercihleri korunur; yeni ırklar, daha kapsamlı kişilik/animasyon ve ortak çapraz perspektif sonraki görsel çalışmada ele alınacaktır. v0.3 yeni ırk eklemez.

## 14 Eylül 2026: Kullanılan kalıcı eşyalar

Kullanıcı Instagram kaydındaki salıncak, içine oturulan kutu ve arkadan kedi pozlarını beğendi; ilk kutu/salıncak/oturma/arka poz paketini onayladı. Minik çarpı detayı yalnızca uygun arka pozlarda kullanılır. Referans görüntülerden sprite alınmaz.

Sonraki yönlendirme önceki kalıcı eşya ödülü önerisini değiştirir: kalıcı eşyalar para üretmez; kullanılabilir olur ve oyuncak ödülüne bonus sağlar. v0.4 yatağın doğrudan uyku ödemesini de kaldırır. Kutu +1, salıncak %10, yatak %5; kopyalar birikmez, toplam +1 ve %15 ile sınırlıdır. Bonus odadadır ve yalnızca ana oyuncağın ilk para ödülüne uygulanır. Tüketilen oyuncak ev → tünel zinciri korunur.

Futbol topu kullanıcının isteğiyle 50 altınlık basamağa taşındı. Diğer fiyat/ödüller birlikte ayarlandı. Oda yaklaşık %43 daha geniş zemin alanına sahip oldu. Kutu, salıncak ve yatak aynı odada sürüklenerek yeniden yerleştirilebilir.

İlk simülasyonda her dört pati vuruşundan sonra mola vermek sabit eşyalı oyunu yavaşlattı. Yoğun oyunda tamamlanan oyuncaklara göre mola ve bütün kalıcı eşyalar için ortak 60 sn mola aralığı uygulanınca, beş seed'de sabit eşyalı strateji eşyasız stratejiden daha erken finale ulaştı. Bu tek strateji ailesinin sonucu, optimal ekonomi veya insan playtesti kanıtı değildir.

Kaydırak ve kedi evine asılı top hâlâ sonraki paketin fikirleridir; bu sürüme eklenmedi. Yeni ırklar ve tamamen ortak çapraz oda perspektifi henüz yapılmadı.

## 14 Eylül 2026: v0.4.1 inceleme düzeltmeleri
Kalıcı eşyanın doğrudan para üretmemesi kararı korunur. Kutu %5, salıncak %10, yatak %5; kopyalar birikmez, toplam %20. Mola, oda tüketilebilir oyuncaklardan boşaldığında seçilir; başlanmış mola tamamlanır. Bu, sürekli doldurulan odada etkileşimleri azaltan bilinçli ve playtest bekleyen bir tercihtir.
Yeni tüketilebilir oyuncak alımı oda kedisi başına iki ile sınırlandırılır; dönüşüm ürünleri oluşmaya devam eder, kalıcı eşyalar ve eski kayıtlar silinmez. Boş odaya oyuncak bırakmak için en az iki alan bulunur. “Yer açın!” artık nesne kapasitesi değil sekiz kediye yer sağlar. Tırmalama, daha az yerleştirme isteyen uzun oyuncak olarak tanımlanır.
Tam bulgular, uygulamalar ve doğrulama sınırları docs/REVIEW_v041.md içindedir.
