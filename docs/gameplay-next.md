# Oynanış yönü — tartışma önerisi, uygulanmış karar değil

## Yeni playtest bulgusu

Coin satın almak kalıcı ve görünür bir büyüme sağlıyor. Kazı kazan ve slot
ise aynı parayı ve oyuncunun dikkatini tüketirken bu büyümeyi yeterince
desteklemiyor. Otomasyon öncesinde yeni oyuncağa geçmek eski yatırımı atıl
bırakıyor. Slotta daha çok deneme istemek bu sorunu çözmüyor.

Bu geri bildirim önceki tasarım önceliğini değiştiriyor: üç oyuncağı final
için zorunlu kılmadan önce birlikte oynamanın neden zevkli olduğunu bulmalıyız.

## Önerilen yön: birbirini çalıştıran masa

- Coin: sürekli gelir ve fiziksel masa büyümesi.
- Kazı kazan: sınırlı sayıdaki masa kurallarını/modifier'larını keşfetme ve
  seçme. Her kartın kalıcı güç vermesi gerekmiyor; ilk deneyde bir run boyunca
  çalışan iki alternatif etki yeterli.
- Slot: masa hareketleriyle dolan bir enerji göstergesi; oyuncunun doğru anda
  tetiklediği ve bütün masada sonucu görülen büyük olay. Sonuç yalnızca nakit
  olmayabilir. Birkaç sonuç ve açık bir güç göstergesiyle başlanabilir.

Yeni oyuncak açıldığında önceki iş için yavaş bir temel otomasyon verilebilir.
Otomasyon yetenekleri hız, hedef seçimi ve kombinasyonları geliştirir. Bu,
v0.5.1'e uygulanmış bir ekonomi değişikliği değildir.

Örnek: kazınan kart iki seçenek sunsun: yazı gelen coinler slotu daha hızlı
doldursun veya tura gelenler küçük seri bonusları oluştursun. Slot hazırken
oyuncu hemen tetiklemekle Loaded Toss anını beklemek arasında karar versin.
Bonusların kendi kendini sonsuz tetiklememesi için yalnızca normal coin
olayları enerji üretmeli; bonus olayların kapsamı açıkça tanımlanmalı.

## Alternatifler

1. Mevcut üç aşamayı koruyup otomasyonu geçiş anında vermek: en ucuz deney,
   boş duran masa sorununu azaltır; yeni oyuncakların karar eksikliği sürebilir.
2. Birbirini etkileyen masa: önerilen küçük prototip. Ayırt edici karar,
   hangi düğmeye sırayla basıldığı değil hangi etkilerin birlikte kurulduğu.
3. Tek oyuncağa inmek: kapsam küçülür; coin seçilirse Gambler's Table ile
   benzerlik daha belirgin kalır. Kazı kazanı merkez yapmak da olası bir pivot,
   fakat şu an en güçlü olumlu playtest verisi coin biriktirmeden geliyor.

Gambler's Table'ın resmi açıklaması daha çok/iyi coin satın almayı,
yardımcıları, yetenekleri, serveti feda ederek ilerlemeyi ve kozmetik
kapsülleri zaten içeriyor. Bu, benzerliği gösterir; tek başına ticari sonuç
veya rakibin tüm mekanikleri hakkında hüküm vermez.
Kaynak: https://store.steampowered.com/app/3618390/Gamblers_Table/

## Sıradaki deney

10–15 dakikalık bir kesit, iki karşılaştırma:

- A: mevcut oyun, yeni aşamada temel otomasyon.
- B: aynı temel otomasyon, bir kazı kazan seçimi ve tek bir masa slot olayı.

Yeni para birimleri, büyük skill tree, yeni oyuncaklar veya final içerikleri
eklemeden soralım: oyuncu kartın ne çıkacağını merak ediyor mu; slotu bilinçli
bir anda kullanıyor mu; coin satın almak hâlâ heyecan veriyor mu; bir run daha
başlatmak için açık bir fikri var mı?

İki kesit de istenen hissi vermiyorsa üçlü yapıyı korumak zorunda değiliz.
Final ancak bu çekirdek doğrulandığında tasarlanmalı. Olası final, kurulan
masayla birkaç açık hedefi başarmak olabilir; tek bir nadir rastgele sonuca
veya salt nakit eşiğine bağımlı olmamalı.
