/* ============================================================
   MİZAN — Ayet metinleri
   ------------------------------------------------------------
   Arapça metin: Osmanî resm-i hat esas alınmıştır.
   Meal: Diyanet İşleri Meali esaslı Türkçe karşılık.

   NOT (üretim): Bu dosya mushafın TAMAMINI içermez. Uygulama
   sürümünde 6236 ayetin tamamı, çevrimdışı kullanım için
   sıkıştırılmış bir veri paketi olarak (sure başına ayrı dosya,
   talep üzerine yüklenir) dağıtılmalıdır. Buradaki set, okuma
   deneyiminin tüm davranışlarını (okuyucu, ses, yer imi, arama,
   kelime kelime, tefsir) uçtan uca çalıştıracak kapsamdadır.
   Kapsam dışı sureler okuyucuda dürüst bir durum mesajı gösterir.
   ============================================================ */

/** v(numara, arapça, meal, okunuş?) */
const v = (n, ar, tr, tl) => ({ n, ar, tr, tl });

export const VERSES = {

  /* ---------------- 1 · Fâtiha (tam) ---------------- */
  1: { complete: true, list: [
    v(1, 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      'Rahmân ve Rahîm olan Allah’ın adıyla.',
      'Bismillâhi’r-rahmâni’r-rahîm'),
    v(2, 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
      'Hamd, âlemlerin Rabbi Allah’a mahsustur.',
      'El-hamdü lillâhi rabbi’l-âlemîn'),
    v(3, 'الرَّحْمَٰنِ الرَّحِيمِ',
      'O, Rahmân’dır, Rahîm’dir.',
      'Er-rahmâni’r-rahîm'),
    v(4, 'مَالِكِ يَوْمِ الدِّينِ',
      'Hesap gününün sahibidir.',
      'Mâliki yevmi’d-dîn'),
    v(5, 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
      'Yalnız sana kulluk ederiz ve yalnız senden yardım dileriz.',
      'İyyâke na’büdü ve iyyâke nesta’în'),
    v(6, 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
      'Bizi doğru yola ilet.',
      'İhdina’s-sırâta’l-müstakîm'),
    v(7, 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
      'Kendilerine nimet verdiklerinin yoluna; gazaba uğrayanların ve sapmışların yoluna değil.',
      'Sırâta’llezîne en’amte aleyhim ğayri’l-mağdûbi aleyhim ve le’d-dâllîn')
  ]},

  /* ---------------- 2 · Bakara (seçili bölümler) ---------------- */
  2: { complete: false, blocks: [[1, 5], [30, 39], [152, 157], [186, 186], [255, 257], [285, 286]], list: [
    v(1, 'الم', 'Elif Lâm Mîm.', 'Elif Lâm Mîm'),
    v(2, 'ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِلْمُتَّقِينَ',
      'Bu, kendisinde şüphe olmayan kitaptır. Allah’a karşı sorumluluk bilinci taşıyanlar için bir yol göstericidir.'),
    v(3, 'الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنْفِقُونَ',
      'Onlar gayba inanırlar, namazı dosdoğru kılarlar ve kendilerine rızık olarak verdiğimizden başkalarına verirler.'),
    v(4, 'وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنْزِلَ إِلَيْكَ وَمَا أُنْزِلَ مِنْ قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ',
      'Onlar sana indirilene de senden önce indirilenlere de inanırlar; âhirete de kesin olarak inanırlar.'),
    v(5, 'أُولَٰئِكَ عَلَىٰ هُدًى مِنْ رَبِّهِمْ ۖ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ',
      'İşte onlar Rablerinden gelen bir doğru yol üzeredirler ve kurtuluşa erenler de onlardır.'),

    v(30, 'وَإِذْ قَالَ رَبُّكَ لِلْمَلَائِكَةِ إِنِّي جَاعِلٌ فِي الْأَرْضِ خَلِيفَةً ۖ قَالُوا أَتَجْعَلُ فِيهَا مَنْ يُفْسِدُ فِيهَا وَيَسْفِكُ الدِّمَاءَ وَنَحْنُ نُسَبِّحُ بِحَمْدِكَ وَنُقَدِّسُ لَكَ ۖ قَالَ إِنِّي أَعْلَمُ مَا لَا تَعْلَمُونَ',
      'Hani Rabbin meleklere, "Ben yeryüzünde bir halife yaratacağım" demişti. Onlar, "Orada bozgunculuk yapacak, kan dökecek birini mi yaratacaksın? Oysa biz seni hamd ile tesbih ediyor ve seni takdis ediyoruz" dediler. Allah, "Şüphesiz ben sizin bilmediklerinizi bilirim" dedi.'),
    v(31, 'وَعَلَّمَ آدَمَ الْأَسْمَاءَ كُلَّهَا ثُمَّ عَرَضَهُمْ عَلَى الْمَلَائِكَةِ فَقَالَ أَنْبِئُونِي بِأَسْمَاءِ هَٰؤُلَاءِ إِنْ كُنْتُمْ صَادِقِينَ',
      'Allah, Âdem’e bütün isimleri öğretti. Sonra onları meleklere sunup, "Doğru söyleyenler iseniz haydi bana bunların isimlerini bildirin" dedi.'),
    v(32, 'قَالُوا سُبْحَانَكَ لَا عِلْمَ لَنَا إِلَّا مَا عَلَّمْتَنَا ۖ إِنَّكَ أَنْتَ الْعَلِيمُ الْحَكِيمُ',
      'Melekler, "Seni bütün eksikliklerden uzak tutarız. Senin bize öğrettiklerinden başka bizim hiçbir bilgimiz yoktur. Şüphesiz her şeyi hakkıyla bilen, her şeyi hikmetle yapan sensin" dediler.'),
    v(33, 'قَالَ يَا آدَمُ أَنْبِئْهُمْ بِأَسْمَائِهِمْ ۖ فَلَمَّا أَنْبَأَهُمْ بِأَسْمَائِهِمْ قَالَ أَلَمْ أَقُلْ لَكُمْ إِنِّي أَعْلَمُ غَيْبَ السَّمَاوَاتِ وَالْأَرْضِ وَأَعْلَمُ مَا تُبْدُونَ وَمَا كُنْتُمْ تَكْتُمُونَ',
      'Allah şöyle dedi: "Ey Âdem! Onlara bunların isimlerini söyle." Âdem, meleklere onların isimlerini bildirince Allah, "Size, göklerin ve yerin gaybını şüphesiz ben bilirim, yine açığa vurduklarınızı da gizli tuttuklarınızı da ben bilirim demedim mi?" dedi.'),
    v(34, 'وَإِذْ قُلْنَا لِلْمَلَائِكَةِ اسْجُدُوا لِآدَمَ فَسَجَدُوا إِلَّا إِبْلِيسَ أَبَىٰ وَاسْتَكْبَرَ وَكَانَ مِنَ الْكَافِرِينَ',
      'Hani meleklere, "Âdem için saygı ile eğilin" demiştik de İblis hariç bütün melekler hemen saygı ile eğilmişler, İblis ise kaçınmış, büyüklük taslamış ve kâfirlerden olmuştu.'),
    v(35, 'وَقُلْنَا يَا آدَمُ اسْكُنْ أَنْتَ وَزَوْجُكَ الْجَنَّةَ وَكُلَا مِنْهَا رَغَدًا حَيْثُ شِئْتُمَا وَلَا تَقْرَبَا هَٰذِهِ الشَّجَرَةَ فَتَكُونَا مِنَ الظَّالِمِينَ',
      'Dedik ki: "Ey Âdem! Sen ve eşin cennete yerleşin. Orada dilediğiniz gibi bol bol yiyin, ama şu ağaca yaklaşmayın, yoksa zalimlerden olursunuz."'),
    v(36, 'فَأَزَلَّهُمَا الشَّيْطَانُ عَنْهَا فَأَخْرَجَهُمَا مِمَّا كَانَا فِيهِ ۖ وَقُلْنَا اهْبِطُوا بَعْضُكُمْ لِبَعْضٍ عَدُوٌّ ۖ وَلَكُمْ فِي الْأَرْضِ مُسْتَقَرٌّ وَمَتَاعٌ إِلَىٰ حِينٍ',
      'Derken şeytan ayaklarını oradan kaydırdı ve onları içinde bulundukları durumdan çıkardı. Bunun üzerine biz de, "Birbirinize düşman olarak inin. Sizin için yeryüzünde belli bir süre kalış ve yararlanma vardır" dedik.'),
    v(37, 'فَتَلَقَّىٰ آدَمُ مِنْ رَبِّهِ كَلِمَاتٍ فَتَابَ عَلَيْهِ ۚ إِنَّهُ هُوَ التَّوَّابُ الرَّحِيمُ',
      'Derken Âdem Rabbinden birtakım kelimeler aldı, onlarla amel edip Rabbine yalvardı. O da tövbesini kabul etti. Şüphesiz O, tövbeleri çok kabul edendir, çok merhametlidir.'),
    v(38, 'قُلْنَا اهْبِطُوا مِنْهَا جَمِيعًا ۖ فَإِمَّا يَأْتِيَنَّكُمْ مِنِّي هُدًى فَمَنْ تَبِعَ هُدَايَ فَلَا خَوْفٌ عَلَيْهِمْ وَلَا هُمْ يَحْزَنُونَ',
      '"İnin oradan hepiniz. Tarafımdan size bir yol gösterici gelir de kim ona uyarsa onlar için herhangi bir korku yoktur, onlar üzülmeyeceklerdir" dedik.'),
    v(39, 'وَالَّذِينَ كَفَرُوا وَكَذَّبُوا بِآيَاتِنَا أُولَٰئِكَ أَصْحَابُ النَّارِ ۖ هُمْ فِيهَا خَالِدُونَ',
      'İnkâr edenler ve âyetlerimizi yalanlayanlara gelince, işte onlar ateş halkıdır; onlar orada sürekli kalacaklardır.'),

    v(152, 'فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ',
      'Öyleyse beni anın ki ben de sizi anayım. Bana şükredin, sakın nankörlük etmeyin.',
      'Fe’zkürûnî ezkürküm ve’şkürû lî ve lâ tekfürûn'),
    v(153, 'يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ',
      'Ey iman edenler! Sabrederek ve namaz kılarak yardım dileyin. Şüphe yok ki Allah sabredenlerle beraberdir.'),
    v(154, 'وَلَا تَقُولُوا لِمَنْ يُقْتَلُ فِي سَبِيلِ اللَّهِ أَمْوَاتٌ ۚ بَلْ أَحْيَاءٌ وَلَٰكِنْ لَا تَشْعُرُونَ',
      'Allah yolunda öldürülenlere "ölüler" demeyin. Hayır, onlar diridirler ama siz bunu bilemezsiniz.'),
    v(155, 'وَلَنَبْلُوَنَّكُمْ بِشَيْءٍ مِنَ الْخَوْفِ وَالْجُوعِ وَنَقْصٍ مِنَ الْأَمْوَالِ وَالْأَنْفُسِ وَالثَّمَرَاتِ ۗ وَبَشِّرِ الصَّابِرِينَ',
      'Andolsun ki sizi biraz korku ve açlıkla; mallardan, canlardan ve ürünlerden eksiltmekle sınayacağız. Sabredenleri müjdele.'),
    v(156, 'الَّذِينَ إِذَا أَصَابَتْهُمْ مُصِيبَةٌ قَالُوا إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ',
      'Onlar, başlarına bir musibet gelince, "Biz şüphesiz Allah’a aidiz ve şüphesiz O’na döneceğiz" derler.',
      'Ellezîne izâ esâbethüm musîbetün kâlû innâ lillâhi ve innâ ileyhi râciûn'),
    v(157, 'أُولَٰئِكَ عَلَيْهِمْ صَلَوَاتٌ مِنْ رَبِّهِمْ وَرَحْمَةٌ ۖ وَأُولَٰئِكَ هُمُ الْمُهْتَدُونَ',
      'İşte Rablerinden bağışlamalar ve rahmet onlaradır. İşte doğru yola ulaştırılmış olanlar da onlardır.'),

    v(186, 'وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ ۖ فَلْيَسْتَجِيبُوا لِي وَلْيُؤْمِنُوا بِي لَعَلَّهُمْ يَرْشُدُونَ',
      'Kullarım sana beni sorduğunda bilsinler ki ben çok yakınım. Bana dua edince duacının duasına karşılık veririm. O hâlde kullarım da benim davetime uysunlar ve bana iman etsinler ki doğru yolu bulsunlar.'),

    v(255, 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
      'Allah, kendisinden başka hiçbir ilâh olmayandır. Diridir, her şeyin varlığı O’na bağlı ve dayalıdır. O’nu ne bir uyuklama tutabilir ne de bir uyku. Göklerdeki her şey, yerdeki her şey O’nundur. İzni olmaksızın O’nun katında şefaatte bulunacak kimdir? O, kulların önlerindekileri ve arkalarındakileri bilir. Onlar O’nun ilminden, kendisinin dilediği kadarından başka bir şey kavrayamazlar. O’nun kürsüsü bütün gökleri ve yeri kaplayıp kuşatmıştır. Onları koruyup gözetmek O’na güç gelmez. O, yücedir, büyüktür.',
      'Allâhü lâ ilâhe illâ hüve’l-hayyü’l-kayyûm…'),
    v(256, 'لَا إِكْرَاهَ فِي الدِّينِ ۖ قَدْ تَبَيَّنَ الرُّشْدُ مِنَ الْغَيِّ ۚ فَمَنْ يَكْفُرْ بِالطَّاغُوتِ وَيُؤْمِنْ بِاللَّهِ فَقَدِ اسْتَمْسَكَ بِالْعُرْوَةِ الْوُثْقَىٰ لَا انْفِصَامَ لَهَا ۗ وَاللَّهُ سَمِيعٌ عَلِيمٌ',
      'Dinde zorlama yoktur. Çünkü doğruluk sapıklıktan iyice ayrılmıştır. O hâlde kim tâğûtu tanımayıp Allah’a inanırsa kopmak bilmeyen sapasağlam bir kulpa yapışmıştır. Allah hakkıyla işitendir, hakkıyla bilendir.'),
    v(257, 'اللَّهُ وَلِيُّ الَّذِينَ آمَنُوا يُخْرِجُهُمْ مِنَ الظُّلُمَاتِ إِلَى النُّورِ ۖ وَالَّذِينَ كَفَرُوا أَوْلِيَاؤُهُمُ الطَّاغُوتُ يُخْرِجُونَهُمْ مِنَ النُّورِ إِلَى الظُّلُمَاتِ ۗ أُولَٰئِكَ أَصْحَابُ النَّارِ ۖ هُمْ فِيهَا خَالِدُونَ',
      'Allah iman edenlerin dostudur; onları karanlıklardan aydınlığa çıkarır. İnkâr edenlerin dostları ise tâğûttur; onları aydınlıktan karanlıklara götürürler. İşte onlar ateş halkıdır; orada sürekli kalacaklardır.'),

    v(285, 'آمَنَ الرَّسُولُ بِمَا أُنْزِلَ إِلَيْهِ مِنْ رَبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِنْ رُسُلِهِ ۚ وَقَالُوا سَمِعْنَا وَأَطَعْنَا ۖ غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيرُ',
      'Peygamber, Rabbinden kendisine indirilene iman etti, mü’minler de. Hepsi Allah’a, meleklerine, kitaplarına ve peygamberlerine iman ettiler ve şöyle dediler: "Onun peygamberlerinden hiçbirini diğerinden ayırt etmeyiz." Yine şöyle dediler: "İşittik ve itaat ettik. Ey Rabbimiz! Senden bağışlama dileriz. Sonunda dönüş yalnız sanadır."'),
    v(286, 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ ۗ رَبَّنَا لَا تُؤَاخِذْنَا إِنْ نَسِينَا أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِنْ قَبْلِنَا ۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ ۖ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا ۚ أَنْتَ مَوْلَانَا فَانْصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ',
      'Allah bir kimseyi ancak gücünün yettiği şeyle yükümlü kılar. Onun kazandığı iyilik kendi yararına, kötülük de kendi zararınadır. "Ey Rabbimiz! Unutur veya hataya düşersek bizi sorumlu tutma. Ey Rabbimiz! Bize, bizden öncekilere yüklediğin gibi ağır yük yükleme. Ey Rabbimiz! Bize gücümüzün yetmediği şeyleri yükleme. Bizi affet, bizi bağışla, bize acı. Sen bizim Mevlâmızsın. İnkârcı topluluğa karşı bize yardım et."')
  ]},

  /* ---------------- 3 · Âl-i İmrân (seçili) ---------------- */
  3: { complete: false, blocks: [[8, 9], [190, 191]], list: [
    v(8, 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً ۚ إِنَّكَ أَنْتَ الْوَهَّابُ',
      'Rabbimiz! Bizi hidayete erdirdikten sonra kalplerimizi eğriltme. Bize katından bir rahmet bağışla. Şüphesiz sen çok bağışlayansın.',
      'Rabbenâ lâ tüziğ kulûbenâ ba’de iz hedeytenâ…'),
    v(9, 'رَبَّنَا إِنَّكَ جَامِعُ النَّاسِ لِيَوْمٍ لَا رَيْبَ فِيهِ ۚ إِنَّ اللَّهَ لَا يُخْلِفُ الْمِيعَادَ',
      'Rabbimiz! Şüphesiz sen, hakkında şüphe olmayan bir günde insanları toplayacaksın. Şüphesiz Allah sözünden dönmez.'),
    v(190, 'إِنَّ فِي خَلْقِ السَّمَاوَاتِ وَالْأَرْضِ وَاخْتِلَافِ اللَّيْلِ وَالنَّهَارِ لَآيَاتٍ لِأُولِي الْأَلْبَابِ',
      'Şüphesiz göklerin ve yerin yaratılışında, gece ile gündüzün birbiri ardınca gelişinde akıl sahipleri için deliller vardır.'),
    v(191, 'الَّذِينَ يَذْكُرُونَ اللَّهَ قِيَامًا وَقُعُودًا وَعَلَىٰ جُنُوبِهِمْ وَيَتَفَكَّرُونَ فِي خَلْقِ السَّمَاوَاتِ وَالْأَرْضِ رَبَّنَا مَا خَلَقْتَ هَٰذَا بَاطِلًا سُبْحَانَكَ فَقِنَا عَذَابَ النَّارِ',
      'Onlar ayaktayken, otururken ve yanları üzerine yatarken Allah’ı anarlar; göklerin ve yerin yaratılışı üzerinde düşünürler: "Rabbimiz! Bunu boşuna yaratmadın, seni eksikliklerden uzak tutarız. Bizi ateş azabından koru."')
  ]},

  /* ---------------- 36 · Yâsîn (1–12) ---------------- */
  36: { complete: false, blocks: [[1, 12]], list: [
    v(1, 'يس', 'Yâ Sîn.', 'Yâ-Sîn'),
    v(2, 'وَالْقُرْآنِ الْحَكِيمِ', 'Hikmet dolu Kur’an’a andolsun.'),
    v(3, 'إِنَّكَ لَمِنَ الْمُرْسَلِينَ', 'Sen elbette gönderilen peygamberlerdensin.'),
    v(4, 'عَلَىٰ صِرَاطٍ مُسْتَقِيمٍ', 'Dosdoğru bir yol üzeresin.'),
    v(5, 'تَنْزِيلَ الْعَزِيزِ الرَّحِيمِ', 'Kur’an, mutlak güç sahibi, çok merhametli Allah tarafından indirilmiştir.'),
    v(6, 'لِتُنْذِرَ قَوْمًا مَا أُنْذِرَ آبَاؤُهُمْ فَهُمْ غَافِلُونَ',
      'Ataları uyarılmamış, bu yüzden de gaflet içinde olan bir kavmi uyarman için indirilmiştir.'),
    v(7, 'لَقَدْ حَقَّ الْقَوْلُ عَلَىٰ أَكْثَرِهِمْ فَهُمْ لَا يُؤْمِنُونَ',
      'Andolsun, onların çoğu hakkında o söz gerçekleşmiştir; artık onlar iman etmezler.'),
    v(8, 'إِنَّا جَعَلْنَا فِي أَعْنَاقِهِمْ أَغْلَالًا فَهِيَ إِلَى الْأَذْقَانِ فَهُمْ مُقْمَحُونَ',
      'Onların boyunlarına demir halkalar geçirdik, o halkalar çenelerine dayanmıştır. Bu sebeple kafaları yukarıya kalkık durumdadır.'),
    v(9, 'وَجَعَلْنَا مِنْ بَيْنِ أَيْدِيهِمْ سَدًّا وَمِنْ خَلْفِهِمْ سَدًّا فَأَغْشَيْنَاهُمْ فَهُمْ لَا يُبْصِرُونَ',
      'Biz onların önlerine bir set, arkalarına da bir set çekip gözlerini perdeledik. Artık görmezler.'),
    v(10, 'وَسَوَاءٌ عَلَيْهِمْ أَأَنْذَرْتَهُمْ أَمْ لَمْ تُنْذِرْهُمْ لَا يُؤْمِنُونَ',
      'Onları uyarsan da uyarmasan da onlar için birdir, inanmazlar.'),
    v(11, 'إِنَّمَا تُنْذِرُ مَنِ اتَّبَعَ الذِّكْرَ وَخَشِيَ الرَّحْمَٰنَ بِالْغَيْبِ ۖ فَبَشِّرْهُ بِمَغْفِرَةٍ وَأَجْرٍ كَرِيمٍ',
      'Sen ancak Zikr’e uyanı ve görmediği hâlde Rahmân’dan korkan kimseyi uyarırsın. İşte onu bir bağışlama ve güzel bir mükâfatla müjdele.'),
    v(12, 'إِنَّا نَحْنُ نُحْيِي الْمَوْتَىٰ وَنَكْتُبُ مَا قَدَّمُوا وَآثَارَهُمْ ۚ وَكُلَّ شَيْءٍ أَحْصَيْنَاهُ فِي إِمَامٍ مُبِينٍ',
      'Şüphesiz ölüleri biz diriltiriz. Onların yaptıklarını ve bıraktıkları eserleri yazarız. Biz her şeyi apaçık bir kitapta sayıp yazmışızdır.')
  ]},

  /* ---------------- 55 · Rahmân (1–13) ---------------- */
  55: { complete: false, blocks: [[1, 13]], list: [
    v(1, 'الرَّحْمَٰنُ', 'Rahmân.', 'Er-rahmân'),
    v(2, 'عَلَّمَ الْقُرْآنَ', 'Kur’an’ı öğretti.', 'Alleme’l-Kur’ân'),
    v(3, 'خَلَقَ الْإِنْسَانَ', 'İnsanı yarattı.', 'Halaka’l-insân'),
    v(4, 'عَلَّمَهُ الْبَيَانَ', 'Ona beyanı öğretti.', 'Allemehü’l-beyân'),
    v(5, 'الشَّمْسُ وَالْقَمَرُ بِحُسْبَانٍ', 'Güneş ve ay bir hesaba göre hareket etmektedir.'),
    v(6, 'وَالنَّجْمُ وَالشَّجَرُ يَسْجُدَانِ', 'Otlar ve ağaçlar Allah’a boyun eğerler.'),
    v(7, 'وَالسَّمَاءَ رَفَعَهَا وَوَضَعَ الْمِيزَانَ',
      'Göğü yükseltti ve ölçüyü koydu.',
      'Ve’s-semâe rafeahâ ve vada’a’l-mîzân'),
    v(8, 'أَلَّا تَطْغَوْا فِي الْمِيزَانِ',
      'Ölçüde haddi aşmayasınız diye.',
      'Ellâ tatğav fi’l-mîzân'),
    v(9, 'وَأَقِيمُوا الْوَزْنَ بِالْقِسْطِ وَلَا تُخْسِرُوا الْمِيزَانَ',
      'Tartıyı adaletle yapın, teraziyi eksik tutmayın.',
      'Ve ekîmü’l-vezne bi’l-kıstı ve lâ tuhsirü’l-mîzân'),
    v(10, 'وَالْأَرْضَ وَضَعَهَا لِلْأَنَامِ', 'Allah yeryüzünü canlılar için var etti.'),
    v(11, 'فِيهَا فَاكِهَةٌ وَالنَّخْلُ ذَاتُ الْأَكْمَامِ', 'Orada meyveler ve salkımlı hurma ağaçları vardır.'),
    v(12, 'وَالْحَبُّ ذُو الْعَصْفِ وَالرَّيْحَانُ', 'Yapraklı taneler ve güzel kokulu bitkiler vardır.'),
    v(13, 'فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ',
      'O hâlde Rabbinizin hangi nimetlerini yalanlıyorsunuz?',
      'Fe bi eyyi âlâi rabbikümâ tükezzibân')
  ]},

  /* ---------------- 59 · Haşr (22–24) ---------------- */
  59: { complete: false, blocks: [[22, 24]], list: [
    v(22, 'هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ ۖ عَالِمُ الْغَيْبِ وَالشَّهَادَةِ ۖ هُوَ الرَّحْمَٰنُ الرَّحِيمُ',
      'O, kendisinden başka hiçbir ilâh olmayan Allah’tır. Gaybı da görünen âlemi de bilendir. O, Rahmân’dır, Rahîm’dir.'),
    v(23, 'هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْمَلِكُ الْقُدُّوسُ السَّلَامُ الْمُؤْمِنُ الْمُهَيْمِنُ الْعَزِيزُ الْجَبَّارُ الْمُتَكَبِّرُ ۚ سُبْحَانَ اللَّهِ عَمَّا يُشْرِكُونَ',
      'O, kendisinden başka hiçbir ilâh bulunmayan Allah’tır. O, mülkün gerçek sahibi, kutsal, esenlik veren, güvenlik veren, gözetip koruyan, mutlak güç sahibi, düzeltip ıslah eden ve dilediğini yaptıran ve büyüklükte eşsiz olan Allah’tır. Allah onların ortak koştuklarından uzaktır.'),
    v(24, 'هُوَ اللَّهُ الْخَالِقُ الْبَارِئُ الْمُصَوِّرُ ۖ لَهُ الْأَسْمَاءُ الْحُسْنَىٰ ۚ يُسَبِّحُ لَهُ مَا فِي السَّمَاوَاتِ وَالْأَرْضِ ۖ وَهُوَ الْعَزِيزُ الْحَكِيمُ',
      'O, yaratan, yoktan var eden, şekil veren Allah’tır. En güzel isimler O’nundur. Göklerdeki ve yerdeki her şey O’nu tesbih eder. O, mutlak güç sahibidir, hüküm ve hikmet sahibidir.')
  ]},

  /* ---------------- 67 · Mülk (1–5) ---------------- */
  67: { complete: false, blocks: [[1, 5]], list: [
    v(1, 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
      'Hükümranlık elinde olan Allah, yüceler yücesidir. O, her şeye hakkıyla gücü yetendir.'),
    v(2, 'الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ',
      'O, hanginizin daha güzel amel yapacağını sınamak için ölümü ve hayatı yaratandır. O, mutlak güç sahibidir, çok bağışlayandır.'),
    v(3, 'الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا ۖ مَا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِنْ تَفَاوُتٍ ۖ فَارْجِعِ الْبَصَرَ هَلْ تَرَىٰ مِنْ فُطُورٍ',
      'O, yedi göğü tabaka tabaka yaratandır. Rahmân’ın yaratışında hiçbir uyumsuzluk göremezsin. Bir kere daha bak, hiçbir çatlak görüyor musun?'),
    v(4, 'ثُمَّ ارْجِعِ الْبَصَرَ كَرَّتَيْنِ يَنْقَلِبْ إِلَيْكَ الْبَصَرُ خَاسِئًا وَهُوَ حَسِيرٌ',
      'Sonra tekrar tekrar bak; bakışların aciz ve bitkin hâlde sana dönecektir.'),
    v(5, 'وَلَقَدْ زَيَّنَّا السَّمَاءَ الدُّنْيَا بِمَصَابِيحَ وَجَعَلْنَاهَا رُجُومًا لِلشَّيَاطِينِ ۖ وَأَعْتَدْنَا لَهُمْ عَذَابَ السَّعِيرِ',
      'Andolsun, biz en yakın göğü kandillerle donattık ve onları şeytanlara atılan taşlar yaptık. Onlar için alevli ateş azabı hazırladık.')
  ]},

  /* ---------------- 93 · Duhâ (tam) ---------------- */
  93: { complete: true, list: [
    v(1, 'وَالضُّحَىٰ', 'Kuşluk vaktine andolsun.', 'Ve’d-duhâ'),
    v(2, 'وَاللَّيْلِ إِذَا سَجَىٰ', 'Karanlığı çöktüğü vakit geceye andolsun.', 'Ve’l-leyli izâ secâ'),
    v(3, 'مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ', 'Rabbin seni terk etmedi, sana darılmadı da.', 'Mâ vedde’ake rabbüke ve mâ kalâ'),
    v(4, 'وَلَلْآخِرَةُ خَيْرٌ لَكَ مِنَ الْأُولَىٰ', 'Muhakkak ki âhiret senin için dünyadan daha hayırlıdır.'),
    v(5, 'وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ', 'Şüphesiz Rabbin sana verecek ve sen hoşnut olacaksın.'),
    v(6, 'أَلَمْ يَجِدْكَ يَتِيمًا فَآوَىٰ', 'Seni yetim bulup barındırmadı mı?'),
    v(7, 'وَوَجَدَكَ ضَالًّا فَهَدَىٰ', 'Seni yolunu kaybetmiş bulup da yola iletmedi mi?'),
    v(8, 'وَوَجَدَكَ عَائِلًا فَأَغْنَىٰ', 'Seni ihtiyaç içinde bulup zengin etmedi mi?'),
    v(9, 'فَأَمَّا الْيَتِيمَ فَلَا تَقْهَرْ', 'Öyleyse sakın yetimi ezme.'),
    v(10, 'وَأَمَّا السَّائِلَ فَلَا تَنْهَرْ', 'İsteyeni de sakın azarlama.'),
    v(11, 'وَأَمَّا بِنِعْمَةِ رَبِّكَ فَحَدِّثْ', 'Rabbinin nimetini ise anlat.')
  ]},

  /* ---------------- 94 · İnşirâh (tam) ---------------- */
  94: { complete: true, list: [
    v(1, 'أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ', 'Senin göğsünü açıp genişletmedik mi?', 'Elem neşrah leke sadrak'),
    v(2, 'وَوَضَعْنَا عَنْكَ وِزْرَكَ', 'Belini büken yükünü üzerinden kaldırmadık mı?', 'Ve vada’nâ anke vizrak'),
    v(3, 'الَّذِي أَنْقَضَ ظَهْرَكَ', 'O yük ki sırtını çatırdatmıştı.', 'Ellezî enkada zahrak'),
    v(4, 'وَرَفَعْنَا لَكَ ذِكْرَكَ', 'Senin şânını yüceltmedik mi?', 'Ve rafa’nâ leke zikrak'),
    v(5, 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا', 'Şüphesiz güçlükle beraber bir kolaylık vardır.', 'Fe inne me’al-usri yüsrâ'),
    v(6, 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', 'Gerçekten güçlükle beraber bir kolaylık vardır.', 'İnne me’al-usri yüsrâ'),
    v(7, 'فَإِذَا فَرَغْتَ فَانْصَبْ', 'Öyleyse bir işi bitirince diğerine koyul.', 'Fe izâ ferağte fensab'),
    v(8, 'وَإِلَىٰ رَبِّكَ فَارْغَبْ', 'Ancak Rabbine yönel ve yalvar.', 'Ve ilâ rabbike fergab')
  ]},

  /* ---------------- 95 · Tîn (tam) ---------------- */
  95: { complete: true, list: [
    v(1, 'وَالتِّينِ وَالزَّيْتُونِ', 'İncire ve zeytine andolsun.', 'Ve’t-tîni ve’z-zeytûn'),
    v(2, 'وَطُورِ سِينِينَ', 'Sînâ dağına andolsun.', 'Ve tûri sînîn'),
    v(3, 'وَهَٰذَا الْبَلَدِ الْأَمِينِ', 'Bu güvenli şehre andolsun.', 'Ve hâze’l-beledi’l-emîn'),
    v(4, 'لَقَدْ خَلَقْنَا الْإِنْسَانَ فِي أَحْسَنِ تَقْوِيمٍ', 'Biz insanı en güzel biçimde yarattık.'),
    v(5, 'ثُمَّ رَدَدْنَاهُ أَسْفَلَ سَافِلِينَ', 'Sonra onu aşağıların aşağısına indirdik.'),
    v(6, 'إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ فَلَهُمْ أَجْرٌ غَيْرُ مَمْنُونٍ',
      'Ancak iman edip salih ameller işleyenler başka. Onlar için kesintisiz bir mükâfat vardır.'),
    v(7, 'فَمَا يُكَذِّبُكَ بَعْدُ بِالدِّينِ', 'Böyle iken hesap gününü sana ne yalanlatıyor?'),
    v(8, 'أَلَيْسَ اللَّهُ بِأَحْكَمِ الْحَاكِمِينَ', 'Allah hükmedenlerin en iyi hükmedeni değil midir?')
  ]},

  /* ---------------- 97 · Kadr (tam) ---------------- */
  97: { complete: true, list: [
    v(1, 'إِنَّا أَنْزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ', 'Şüphesiz biz onu Kadir gecesinde indirdik.', 'İnnâ enzelnâhü fî leyleti’l-kadr'),
    v(2, 'وَمَا أَدْرَاكَ مَا لَيْلَةُ الْقَدْرِ', 'Kadir gecesinin ne olduğunu sen ne bileceksin?', 'Ve mâ edrâke mâ leyletü’l-kadr'),
    v(3, 'لَيْلَةُ الْقَدْرِ خَيْرٌ مِنْ أَلْفِ شَهْرٍ', 'Kadir gecesi bin aydan daha hayırlıdır.', 'Leyletü’l-kadri hayrun min elfi şehr'),
    v(4, 'تَنَزَّلُ الْمَلَائِكَةُ وَالرُّوحُ فِيهَا بِإِذْنِ رَبِّهِمْ مِنْ كُلِّ أَمْرٍ',
      'Melekler ve Ruh o gecede Rablerinin izniyle her türlü iş için iner dururlar.'),
    v(5, 'سَلَامٌ هِيَ حَتَّىٰ مَطْلَعِ الْفَجْرِ', 'O gece, tan yerinin ağarmasına kadar bir esenliktir.', 'Selâmün hiye hattâ matla’il-fecr')
  ]},

  /* ---------------- 99 · Zilzâl (tam) ---------------- */
  99: { complete: true, list: [
    v(1, 'إِذَا زُلْزِلَتِ الْأَرْضُ زِلْزَالَهَا', 'Yer o müthiş sarsıntıyla sarsıldığı zaman.'),
    v(2, 'وَأَخْرَجَتِ الْأَرْضُ أَثْقَالَهَا', 'Yeryüzü ağırlıklarını dışarı çıkardığı zaman.'),
    v(3, 'وَقَالَ الْإِنْسَانُ مَا لَهَا', 'İnsan, "Ona ne oluyor?" dediği zaman.'),
    v(4, 'يَوْمَئِذٍ تُحَدِّثُ أَخْبَارَهَا', 'İşte o gün yer, kendi haberlerini anlatır.'),
    v(5, 'بِأَنَّ رَبَّكَ أَوْحَىٰ لَهَا', 'Çünkü Rabbin ona böyle vahyetmiştir.'),
    v(6, 'يَوْمَئِذٍ يَصْدُرُ النَّاسُ أَشْتَاتًا لِيُرَوْا أَعْمَالَهُمْ',
      'O gün insanlar amellerinin kendilerine gösterilmesi için bölük bölük çıkacaklardır.'),
    v(7, 'فَمَنْ يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ',
      'Artık kim zerre ağırlığınca bir hayır işlerse onun mükâfatını görecektir.',
      'Fe men ya’mel miskâle zerratin hayran yerah'),
    v(8, 'وَمَنْ يَعْمَلْ مِثْقَالَ ذَرَّةٍ شَرًّا يَرَهُ',
      'Kim de zerre ağırlığınca bir kötülük işlerse onun cezasını görecektir.',
      'Ve men ya’mel miskâle zerratin şerran yerah')
  ]},

  /* ---------------- 103 · Asr (tam) ---------------- */
  103: { complete: true, list: [
    v(1, 'وَالْعَصْرِ', 'Zamana andolsun.', 'Ve’l-asr'),
    v(2, 'إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ', 'İnsan gerçekten ziyan içindedir.', 'İnne’l-insâne lefî husr'),
    v(3, 'إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ',
      'Ancak iman edip salih ameller işleyen, birbirlerine hakkı tavsiye eden ve sabrı tavsiye edenler başka.',
      'İlle’llezîne âmenû ve amilü’s-sâlihâti ve tevâsav bi’l-hakkı ve tevâsav bi’s-sabr')
  ]},

  /* ---------------- 105 · Fîl (tam) ---------------- */
  105: { complete: true, list: [
    v(1, 'أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ',
      'Rabbinin fil sahiplerine ne yaptığını görmedin mi?', 'Elem tera keyfe fe’ale rabbüke bi ashâbi’l-fîl'),
    v(2, 'أَلَمْ يَجْعَلْ كَيْدَهُمْ فِي تَضْلِيلٍ', 'Onların tuzaklarını boşa çıkarmadı mı?'),
    v(3, 'وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ', 'Üzerlerine sürü sürü kuşlar gönderdi.'),
    v(4, 'تَرْمِيهِمْ بِحِجَارَةٍ مِنْ سِجِّيلٍ', 'Onlara balçıktan pişirilmiş taşlar atıyorlardı.'),
    v(5, 'فَجَعَلَهُمْ كَعَصْفٍ مَأْكُولٍ', 'Nihayet onları yenilmiş ekin yaprakları hâline getirdi.')
  ]},

  /* ---------------- 106 · Kureyş (tam) ---------------- */
  106: { complete: true, list: [
    v(1, 'لِإِيلَافِ قُرَيْشٍ', 'Kureyş’i ısındırıp alıştırdığı için.', 'Li îlâfi Kureyş'),
    v(2, 'إِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ', 'Kış ve yaz yolculuklarına ısındırıp alıştırdığı için.'),
    v(3, 'فَلْيَعْبُدُوا رَبَّ هَٰذَا الْبَيْتِ', 'Öyleyse onlar bu evin Rabbine kulluk etsinler.'),
    v(4, 'الَّذِي أَطْعَمَهُمْ مِنْ جُوعٍ وَآمَنَهُمْ مِنْ خَوْفٍ',
      'O ki onları açlıktan doyurmuş ve her türlü korkudan emin kılmıştır.')
  ]},

  /* ---------------- 107 · Mâûn (tam) ---------------- */
  107: { complete: true, list: [
    v(1, 'أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ', 'Gördün mü, hesap gününü yalanlayanı?'),
    v(2, 'فَذَٰلِكَ الَّذِي يَدُعُّ الْيَتِيمَ', 'İşte o, yetimi itip kakan kimsedir.'),
    v(3, 'وَلَا يَحُضُّ عَلَىٰ طَعَامِ الْمِسْكِينِ', 'Yoksulu doyurmayı teşvik etmez.'),
    v(4, 'فَوَيْلٌ لِلْمُصَلِّينَ', 'Yazıklar olsun o namaz kılanlara ki.'),
    v(5, 'الَّذِينَ هُمْ عَنْ صَلَاتِهِمْ سَاهُونَ', 'Onlar namazlarını ciddiye almazlar.'),
    v(6, 'الَّذِينَ هُمْ يُرَاءُونَ', 'Onlar gösteriş yaparlar.'),
    v(7, 'وَيَمْنَعُونَ الْمَاعُونَ', 'Ufacık bir yardımı bile esirgerler.')
  ]},

  /* ---------------- 108 · Kevser (tam) ---------------- */
  108: { complete: true, list: [
    v(1, 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ', 'Şüphesiz biz sana Kevser’i verdik.', 'İnnâ a’taynâke’l-kevser'),
    v(2, 'فَصَلِّ لِرَبِّكَ وَانْحَرْ', 'O hâlde Rabbin için namaz kıl ve kurban kes.', 'Fe salli li rabbike venhar'),
    v(3, 'إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ', 'Doğrusu sana buğzeden, soyu kesik olanın ta kendisidir.', 'İnne şânieke hüve’l-ebter')
  ]},

  /* ---------------- 109 · Kâfirûn (tam) ---------------- */
  109: { complete: true, list: [
    v(1, 'قُلْ يَا أَيُّهَا الْكَافِرُونَ', 'De ki: "Ey inkârcılar!"', 'Kul yâ eyyühe’l-kâfirûn'),
    v(2, 'لَا أَعْبُدُ مَا تَعْبُدُونَ', 'Ben sizin taptıklarınıza tapmam.', 'Lâ a’büdü mâ ta’büdûn'),
    v(3, 'وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ', 'Siz de benim taptığıma tapıcı değilsiniz.'),
    v(4, 'وَلَا أَنَا عَابِدٌ مَا عَبَدْتُمْ', 'Ben sizin taptıklarınıza tapacak değilim.'),
    v(5, 'وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ', 'Siz de benim taptığıma tapacak değilsiniz.'),
    v(6, 'لَكُمْ دِينُكُمْ وَلِيَ دِينِ', 'Sizin dininiz size, benim dinim banadır.', 'Leküm dînüküm ve liye dîn')
  ]},

  /* ---------------- 110 · Nasr (tam) ---------------- */
  110: { complete: true, list: [
    v(1, 'إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ', 'Allah’ın yardımı ve fetih geldiğinde.', 'İzâ câe nasrullâhi ve’l-feth'),
    v(2, 'وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا',
      'İnsanların bölük bölük Allah’ın dinine girdiğini gördüğünde.'),
    v(3, 'فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ ۚ إِنَّهُ كَانَ تَوَّابًا',
      'Rabbine hamd ederek tesbihte bulun ve O’ndan bağışlanma dile. Çünkü O, tövbeleri çok kabul edendir.')
  ]},

  /* ---------------- 111 · Tebbet (tam) ---------------- */
  111: { complete: true, list: [
    v(1, 'تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ', 'Ebû Leheb’in elleri kurusun, kurudu da.', 'Tebbet yedâ ebî lehebin ve tebb'),
    v(2, 'مَا أَغْنَىٰ عَنْهُ مَالُهُ وَمَا كَسَبَ', 'Ona ne malı fayda verdi ne de kazandığı.'),
    v(3, 'سَيَصْلَىٰ نَارًا ذَاتَ لَهَبٍ', 'O, alevli bir ateşe girecektir.'),
    v(4, 'وَامْرَأَتُهُ حَمَّالَةَ الْحَطَبِ', 'Odun taşıyıcısı olan karısı da.'),
    v(5, 'فِي جِيدِهَا حَبْلٌ مِنْ مَسَدٍ', 'Boynunda bükülmüş bir ip vardır.')
  ]},

  /* ---------------- 112 · İhlâs (tam) ---------------- */
  112: { complete: true, list: [
    v(1, 'قُلْ هُوَ اللَّهُ أَحَدٌ', 'De ki: "O, Allah’tır, bir tektir."', 'Kul hüvallâhü ehad'),
    v(2, 'اللَّهُ الصَّمَدُ', 'Allah Samed’dir; her şey O’na muhtaçtır, O hiçbir şeye muhtaç değildir.', 'Allâhü’s-samed'),
    v(3, 'لَمْ يَلِدْ وَلَمْ يُولَدْ', 'O, doğurmamış ve doğmamıştır.', 'Lem yelid ve lem yûled'),
    v(4, 'وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ', 'Hiçbir şey O’na denk değildir.', 'Ve lem yekün lehû küfüven ehad')
  ]},

  /* ---------------- 113 · Felak (tam) ---------------- */
  113: { complete: true, list: [
    v(1, 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ', 'De ki: "Sığınırım ben ağaran sabahın Rabbine."', 'Kul e’ûzü bi rabbi’l-felak'),
    v(2, 'مِنْ شَرِّ مَا خَلَقَ', 'Yarattığı şeylerin kötülüğünden.', 'Min şerri mâ halak'),
    v(3, 'وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ', 'Karanlığı çöktüğü zaman gecenin kötülüğünden.', 'Ve min şerri ğâsikın izâ vekab'),
    v(4, 'وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ', 'Düğümlere üfleyenlerin kötülüğünden.', 'Ve min şerri’n-neffâsâti fi’l-ukad'),
    v(5, 'وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ', 'Haset ettiğinde hasetçinin kötülüğünden.', 'Ve min şerri hâsidin izâ hased')
  ]},

  /* ---------------- 114 · Nâs (tam) ---------------- */
  114: { complete: true, list: [
    v(1, 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ', 'De ki: "Sığınırım ben insanların Rabbine."', 'Kul e’ûzü bi rabbi’n-nâs'),
    v(2, 'مَلِكِ النَّاسِ', 'İnsanların malikine.', 'Meliki’n-nâs'),
    v(3, 'إِلَٰهِ النَّاسِ', 'İnsanların ilâhına.', 'İlâhi’n-nâs'),
    v(4, 'مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ', 'Sinsi vesvesecinin kötülüğünden.', 'Min şerri’l-vesvâsi’l-hannâs'),
    v(5, 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ', 'O ki insanların göğüslerine vesvese verir.', 'Ellezî yüvesvisü fî sudûri’n-nâs'),
    v(6, 'مِنَ الْجِنَّةِ وَالنَّاسِ', 'Gerek cinlerden gerek insanlardan.', 'Mine’l-cinneti ve’n-nâs')
  ]}
};

/** Bir surenin ayet listesi (yoksa null) */
export const versesOf = (surahNo) => VERSES[surahNo]?.list ?? null;

/** Belirli bir ayet */
export function verseAt(surahNo, ayahNo) {
  return VERSES[surahNo]?.list.find((x) => x.n === ayahNo) ?? null;
}

/** Metinde ara — hem meal hem okunuş */
export function searchVerses(query, limit = 30) {
  const q = query.trim().toLocaleLowerCase('tr');
  if (q.length < 2) return [];
  const out = [];
  for (const [s, data] of Object.entries(VERSES)) {
    for (const item of data.list) {
      const hay = `${item.tr} ${item.tl ?? ''}`.toLocaleLowerCase('tr');
      if (hay.includes(q)) {
        out.push({ surah: Number(s), ayah: item.n, ...item });
        if (out.length >= limit) return out;
      }
    }
  }
  return out;
}

/* ------------------------------------------------------------
   Kelime kelime meal — örnek kapsam (Fâtiha ve kısa sureler)
   Üretimde tüm mushaf için ayrı bir veri paketinden beslenir.
   ------------------------------------------------------------ */
export const WORD_BY_WORD = {
  '1:1': [['بِسْمِ', 'adıyla'], ['اللَّهِ', 'Allah’ın'], ['الرَّحْمَٰنِ', 'Rahmân olan'], ['الرَّحِيمِ', 'Rahîm olan']],
  '1:2': [['الْحَمْدُ', 'hamd'], ['لِلَّهِ', 'Allah’a mahsustur'], ['رَبِّ', 'Rabbi'], ['الْعَالَمِينَ', 'âlemlerin']],
  '1:5': [['إِيَّاكَ', 'yalnız sana'], ['نَعْبُدُ', 'kulluk ederiz'], ['وَإِيَّاكَ', 've yalnız senden'], ['نَسْتَعِينُ', 'yardım dileriz']],
  '55:7': [['وَالسَّمَاءَ', 've göğü'], ['رَفَعَهَا', 'yükseltti'], ['وَوَضَعَ', 've koydu'], ['الْمِيزَانَ', 'ölçüyü']],
  '55:8': [['أَلَّا', 'diye'], ['تَطْغَوْا', 'haddi aşmayasınız'], ['فِي', 'içinde'], ['الْمِيزَانِ', 'ölçü']],
  '94:5': [['فَإِنَّ', 'şüphesiz'], ['مَعَ', 'beraber'], ['الْعُسْرِ', 'güçlükle'], ['يُسْرًا', 'bir kolaylık vardır']],
  '112:1': [['قُلْ', 'de ki'], ['هُوَ', 'O'], ['اللَّهُ', 'Allah’tır'], ['أَحَدٌ', 'bir tektir']],
  '103:1': [['وَالْعَصْرِ', 'zamana andolsun']],
  '103:2': [['إِنَّ', 'şüphesiz'], ['الْإِنْسَانَ', 'insan'], ['لَفِي', 'içindedir'], ['خُسْرٍ', 'ziyan']]
};

/* ------------------------------------------------------------
   Tefsir özetleri — seçili ayetler için kısa açıklama
   ------------------------------------------------------------ */
export const TAFSIR = {
  '55:7': {
    title: 'Mîzan — ölçü ve denge',
    body: 'Âyette geçen “mîzan” hem terazi hem de kâinata konulan genel denge anlamında yorumlanmıştır. ' +
      'Müfessirler, göğün yükseltilmesi ile ölçünün konulmasının aynı cümlede zikredilmesini, ' +
      'evrendeki fizikî düzen ile insanın toplumsal hayattaki adaleti arasında bir bağ kurulması ' +
      'şeklinde açıklar. Sonraki iki âyette bu ölçünün insana yüklediği sorumluluk — alışverişte ' +
      've genel olarak hakların paylaşımında dengeyi bozmama — açıkça belirtilir.',
    sources: ['Taberî, Câmiu’l-beyân, XXVII/117', 'Kurtubî, el-Câmi‘, XVII/152', 'Diyanet, Kur’an Yolu, V/232']
  },
  '2:255': {
    title: 'Âyetü’l-Kürsî',
    body: 'Kur’an’ın en kapsamlı tevhid âyeti kabul edilir. Allah’ın varlığı, birliği, ilmi, kudreti ve ' +
      'kayyûmiyeti bir arada dile getirilir. Hz. Peygamber’in bu âyetin faziletine dair sözleri ' +
      'hadis kaynaklarında yer alır; her farz namazın ardından okunması yaygın bir uygulamadır.',
    sources: ['Buhârî, Vekâlet 10', 'Nesâî, Sehiv 100', 'Diyanet, Kur’an Yolu, I/399']
  },
  '94:5': {
    title: 'Güçlükle beraber kolaylık',
    body: 'Âyet iki kez, birbirine çok yakın ifadelerle tekrarlanır. Klasik tefsirlerde bu tekrarın ' +
      'pekiştirme amacı taşıdığı belirtilir. “Usr” (güçlük) belirlilik takısıyla, “yüsr” (kolaylık) ' +
      'belirsiz olarak geldiği için, bir güçlüğe karşılık birden fazla kolaylığın umulabileceği ' +
      'şeklinde yorumlanmıştır.',
    sources: ['Râzî, Mefâtîhu’l-gayb, XXXII/6', 'Diyanet, Kur’an Yolu, V/599']
  },
  '2:186': {
    title: 'Duaya icabet',
    body: 'Âyet, oruçla ilgili hükümlerin ortasında yer alır. Müfessirler bunu, orucun asıl amacının ' +
      'Allah ile kul arasındaki yakınlık olduğuna bir işaret sayar. “Ben çok yakınım” ifadesi ' +
      'mekân yakınlığı değil, ilim ve icabet yakınlığı olarak açıklanmıştır.',
    sources: ['Kurtubî, el-Câmi‘, II/308', 'Diyanet, Kur’an Yolu, I/288']
  },
  '2:37': {
    title: 'Tövbenin kabulü',
    body: 'Âyette Hz. Âdem’in Rabbinden “kelimeler” aldığı bildirilir. Bu kelimelerin A‘râf sûresi 23. ' +
      'âyette geçen dua olduğu görüşü yaygındır. Bölümün, hatanın ardından ümitsizliğe değil ' +
      'tövbeye yönlendiren bir çerçeve kurduğu belirtilir.',
    sources: ['Taberî, Câmiu’l-beyân, I/545', 'Diyanet, Kur’an Yolu, I/104']
  }
};
