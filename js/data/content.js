/* ============================================================
   MİZAN — İçerik kütüphanesi
   Dualar · Hadisler · Dini bilgiler · Hac & Umre · Günlük içerik
   Her içerikte kaynak gösterilir. Kaynaksız dini bilgi yer almaz.
   ============================================================ */

/* ============================================================
   DUALAR
   ============================================================ */
export const DUA_CATEGORIES = [
  { id: 'sabah', name: 'Sabah Duaları', desc: 'Güne başlarken' },
  { id: 'aksam', name: 'Akşam Duaları', desc: 'Gün batımından sonra' },
  { id: 'uyku', name: 'Uyumadan Önce', desc: 'Yatağa girerken' },
  { id: 'uyanma', name: 'Uyanınca', desc: 'Uykudan kalkarken' },
  { id: 'yemek', name: 'Yemek', desc: 'Sofrada' },
  { id: 'yolculuk', name: 'Yolculuk', desc: 'Yola çıkarken' },
  { id: 'sikinti', name: 'Sıkıntı ve Keder', desc: 'Zorlandığında' },
  { id: 'hastalik', name: 'Hastalık ve Şifa', desc: 'Kendin ve sevdiklerin için' },
  { id: 'aile', name: 'Aile ve Çocuk', desc: 'Ev halkı için' },
  { id: 'anne-baba', name: 'Anne Baba', desc: 'Onlar için' },
  { id: 'bereket', name: 'Rızık ve Bereket', desc: 'Geçim ve emek' },
  { id: 'bagislanma', name: 'Bağışlanma', desc: 'Tövbe ve istiğfar' },
  { id: 'namaz-sonrasi', name: 'Namaz Sonrası', desc: 'Selamdan sonra' },
  { id: 'ramazan', name: 'Ramazan', desc: 'Oruç ve iftar' },
  { id: 'hac', name: 'Hac ve Umre', desc: 'Kutsal yolculuk' },
  { id: 'korunma', name: 'Korunma', desc: 'Sığınma duaları' }
];

/** d(id, kategori, başlık, arapça, okunuş, anlam, kaynak, [sûre, âyet]?)
 *  Son parametre yalnızca Kur'an kaynaklı dualarda bulunur; sesli dinleme
 *  bu referanstan gerçek tilaveti çalar. Hadis kaynaklı dualarda ses yoktur. */
const d = (id, cat, title, ar, tl, tr, src, ayah = null, derece = null) =>
  ({ id, cat, title, ar, tl, tr, src, ayah, derece });

export const DUAS = [
  /* --- Sabah --- */
  d('sabah-1', 'sabah', 'Sabaha Çıkarken',
    'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
    'Asbahnâ ve asbaha’l-mülkü lillâh, ve’l-hamdü lillâh, lâ ilâhe illallâhü vahdehû lâ şerîke leh.',
    'Biz de mülk de Allah’ın olarak sabahladık. Hamd Allah’a mahsustur. Allah’tan başka ilâh yoktur; O tektir, ortağı yoktur.',
    'Müslim, Zikir 75'),
  d('sabah-2', 'sabah', 'Sabah Sığınması',
    'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ',
    'Allâhümme bike asbahnâ ve bike emseynâ ve bike nahyâ ve bike nemûtü ve ileyke’n-nüşûr.',
    'Allah’ım! Seninle sabahladık, seninle akşamladık, seninle yaşar, seninle ölürüz. Dönüş de sanadır.',
    'Tirmizî, Daavât 13'),
  d('sabah-3', 'sabah', 'Seyyidü’l-İstiğfar',
    'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ',
    'Allâhümme ente rabbî lâ ilâhe illâ ente, halaktenî ve ene abdüke ve ene alâ ahdike ve va’dike me’steta’tü.',
    'Allah’ım! Sen benim Rabbimsin, senden başka ilâh yoktur. Beni sen yarattın, ben senin kulunum. Gücüm yettiğince sana verdiğim sözde durmaya çalışıyorum.',
    'Buhârî, Daavât 2'),

  /* --- Akşam --- */
  d('aksam-1', 'aksam', 'Akşama Girerken',
    'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
    'Emseynâ ve emse’l-mülkü lillâh, ve’l-hamdü lillâh, lâ ilâhe illallâhü vahdehû lâ şerîke leh.',
    'Biz de mülk de Allah’ın olarak akşamladık. Hamd Allah’a mahsustur. Allah’tan başka ilâh yoktur; O tektir, ortağı yoktur.',
    'Müslim, Zikir 75'),
  d('aksam-2', 'aksam', 'Akşam Koruması',
    'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    'E’ûzü bi kelimâtillâhi’t-tâmmâti min şerri mâ halak.',
    'Yarattığı şeylerin kötülüğünden Allah’ın eksiksiz kelimelerine sığınırım.',
    'Müslim, Zikir 54'),

  /* --- Uyku --- */
  d('uyku-1', 'uyku', 'Yatağa Girerken',
    'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    'Bismike’llâhümme emûtü ve ahyâ.',
    'Allah’ım! Senin adınla ölür, senin adınla dirilirim.',
    'Buhârî, Daavât 7'),
  d('uyku-2', 'uyku', 'Uykudan Önce Teslimiyet',
    'اللَّهُمَّ أَسْلَمْتُ نَفْسِي إِلَيْكَ وَوَجَّهْتُ وَجْهِي إِلَيْكَ وَفَوَّضْتُ أَمْرِي إِلَيْكَ',
    'Allâhümme eslemtü nefsî ileyke ve veccehtü vechî ileyke ve fevvadtü emrî ileyke.',
    'Allah’ım! Kendimi sana teslim ettim, yüzümü sana çevirdim, işimi sana havale ettim.',
    'Buhârî, Vudû 75'),

  /* --- Uyanma --- */
  d('uyanma-1', 'uyanma', 'Uyanınca',
    'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    'El-hamdü lillâhillezî ahyânâ ba’de mâ emâtenâ ve ileyhi’n-nüşûr.',
    'Bizi öldürdükten sonra dirilten Allah’a hamd olsun. Dönüş de O’nadır.',
    'Buhârî, Daavât 8'),

  /* --- Yemek --- */
  d('yemek-1', 'yemek', 'Yemeğe Başlarken',
    'بِسْمِ اللَّهِ',
    'Bismillâh.',
    'Allah’ın adıyla.',
    'Buhârî, Et’ime 2; Müslim, Eşribe 108', null,
    'Yaygın olarak eklenen “ve alâ bereketillâh” ilavesinin senedi zayıf kabul edilir; ' +
    'sahih rivayetlerde yemeğe besmele ile başlanır. Başlarken unutulursa ' +
    '“bismillâhi evvelehû ve âhirehû” denir.'),
  d('yemek-2', 'yemek', 'Yemekten Sonra',
    'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مِنَ الْمُسْلِمِينَ',
    'El-hamdü lillâhillezî at’amenâ ve sekânâ ve ce’alenâ mine’l-müslimîn.',
    'Bizi yediren, içiren ve müslümanlardan kılan Allah’a hamd olsun.',
    'Ebû Dâvûd, Et’ime 52'),

  /* --- Yolculuk --- */
  d('yolculuk-1', 'yolculuk', 'Yola Çıkarken',
    'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَىٰ رَبِّنَا لَمُنْقَلِبُونَ',
    'Sübhânellezî sehhara lenâ hâzâ ve mâ künnâ lehû mukrinîn ve innâ ilâ rabbinâ le münkalibûn.',
    'Bunu bizim hizmetimize veren Allah’ı tesbih ederiz. Yoksa buna bizim gücümüz yetmezdi. Şüphesiz biz Rabbimize döneceğiz.',
    'Zuhruf 13–14; Müslim, Hac 425', [43, 13]),
  d('yolculuk-2', 'yolculuk', 'Yolculuk Sığınması',
    'اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَٰذَا الْبِرَّ وَالتَّقْوَىٰ وَمِنَ الْعَمَلِ مَا تَرْضَىٰ',
    'Allâhümme innâ nes’elüke fî seferinâ hâze’l-birre ve’t-takvâ ve mine’l-ameli mâ terdâ.',
    'Allah’ım! Bu yolculuğumuzda senden iyilik, takva ve razı olacağın ameller dileriz.',
    'Müslim, Hac 425'),

  /* --- Sıkıntı --- */
  d('sikinti-1', 'sikinti', 'Sıkıntı Anında',
    'لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
    'Lâ ilâhe illâ ente sübhâneke innî küntü mine’z-zâlimîn.',
    'Senden başka ilâh yoktur. Seni tenzih ederim. Gerçekten ben zalimlerden oldum.',
    'Enbiyâ 87; Tirmizî, Daavât 85', [21, 87]),
  d('sikinti-2', 'sikinti', 'Keder ve Üzüntüde',
    'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ',
    'Allâhümme innî e’ûzü bike mine’l-hemmi ve’l-hazeni ve’l-aczi ve’l-kesel.',
    'Allah’ım! Kaygıdan, üzüntüden, acizlikten ve tembellikten sana sığınırım.',
    'Buhârî, Daavât 36'),
  d('sikinti-3', 'sikinti', 'Yeterlilik Duası',
    'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    'Hasbünallâhü ve ni’me’l-vekîl.',
    'Allah bize yeter. O ne güzel vekildir.',
    'Âl-i İmrân 173', [3, 173]),

  /* --- Hastalık --- */
  d('hastalik-1', 'hastalik', 'Hasta Ziyaretinde',
    'أَسْأَلُ اللَّهَ الْعَظِيمَ رَبَّ الْعَرْشِ الْعَظِيمِ أَنْ يَشْفِيَكَ',
    'Es’elüllâhe’l-azîme rabbe’l-arşi’l-azîmi en yeşfiyek.',
    'Yüce Arş’ın Rabbi olan Allah’tan sana şifa vermesini dilerim.',
    'Ebû Dâvûd, Cenâiz 8'),
  d('hastalik-2', 'hastalik', 'Ağrı Duyulduğunda',
    'أَعُوذُ بِعِزَّةِ اللَّهِ وَقُدْرَتِهِ مِنْ شَرِّ مَا أَجِدُ وَأُحَاذِرُ',
    'E’ûzü bi izzetillâhi ve kudratihî min şerri mâ ecidü ve ühâzir.',
    'Hissettiğim ve endişe ettiğim şeyin kötülüğünden Allah’ın izzet ve kudretine sığınırım.',
    'Müslim, Selâm 67'),

  /* --- Aile --- */
  d('aile-1', 'aile', 'Aile İçin',
    'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا',
    'Rabbenâ heb lenâ min ezvâcinâ ve zürriyyâtinâ kurrate a’yünin vec’alnâ li’l-müttakîne imâmâ.',
    'Rabbimiz! Eşlerimizi ve çocuklarımızı bize göz aydınlığı kıl ve bizi Allah’a karşı gelmekten sakınanlara önder eyle.',
    'Furkân 74', [25, 74]),
  d('aile-2', 'aile', 'Hayırlı Nesil',
    'رَبِّ هَبْ لِي مِنْ لَدُنْكَ ذُرِّيَّةً طَيِّبَةً إِنَّكَ سَمِيعُ الدُّعَاءِ',
    'Rabbi heb lî min ledünke zürriyyeten tayyibeh, inneke semîu’d-duâ.',
    'Rabbim! Bana katından temiz bir nesil bağışla. Şüphesiz sen duayı hakkıyla işitensin.',
    'Âl-i İmrân 38', [3, 38]),

  /* --- Anne baba --- */
  d('anne-baba-1', 'anne-baba', 'Anne Baba İçin',
    'رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
    'Rabbirhamhümâ kemâ rabbeyânî sağîrâ.',
    'Rabbim! Onlar beni küçükken nasıl büyüttülerse sen de onlara öylece merhamet et.',
    'İsrâ 24', [17, 24]),
  d('anne-baba-2', 'anne-baba', 'Anne Baba ve Mü’minler İçin',
    'رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ',
    'Rabbenağfir lî ve li vâlideyye ve li’l-mü’minîne yevme yekûmü’l-hisâb.',
    'Rabbimiz! Hesabın görüleceği gün beni, anne babamı ve mü’minleri bağışla.',
    'İbrâhîm 41', [14, 41]),

  /* --- Bereket --- */
  d('bereket-1', 'bereket', 'Helal Rızık',
    'اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ',
    'Allâhümme’kfinî bi halâlike an harâmike ve ağninî bi fadlike ammen sivâk.',
    'Allah’ım! Bana helâlinden vererek haramdan koru ve lütfunla beni senden başkasına muhtaç etme.',
    'Tirmizî, Daavât 111'),
  d('bereket-2', 'bereket', 'Faydalı İlim ve Rızık',
    'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلًا مُتَقَبَّلًا',
    'Allâhümme innî es’elüke ilmen nâfian ve rızkan tayyiben ve amelen mütekabbelâ.',
    'Allah’ım! Senden faydalı ilim, temiz rızık ve kabul edilmiş amel dilerim.',
    'İbn Mâce, İkâmet 32'),

  /* --- Bağışlanma --- */
  d('bagislanma-1', 'bagislanma', 'İstiğfar',
    'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ',
    'Estağfirullâhe’l-azîm ellezî lâ ilâhe illâ hüve’l-hayyü’l-kayyûmü ve etûbü ileyh.',
    'Kendisinden başka ilâh olmayan, diri ve her şeyi ayakta tutan yüce Allah’tan bağışlanma diler ve O’na tövbe ederim.',
    'Ebû Dâvûd, Vitir 26'),
  d('bagislanma-2', 'bagislanma', 'Kadir Gecesi Duası',
    'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
    'Allâhümme inneke afüvvün tühibbü’l-afve fa’fü annî.',
    'Allah’ım! Sen çok affedicisin, affetmeyi seversin. Beni de affet.',
    'Tirmizî, Daavât 84; İbn Mâce, Duâ 5'),

  /* --- Namaz sonrası --- */
  d('namaz-1', 'namaz-sonrasi', 'Selamdan Sonra',
    'اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',
    'Allâhümme ente’s-selâm ve minke’s-selâm, tebârekte yâ ze’l-celâli ve’l-ikrâm.',
    'Allah’ım! Selâm sensin, esenlik sendendir. Ey celâl ve ikram sahibi! Sen yücesin.',
    'Müslim, Mesâcid 135'),
  d('namaz-2', 'namaz-sonrasi', 'Zikre Yardım',
    'اللَّهُمَّ أَعِنِّي عَلَىٰ ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
    'Allâhümme e’innî alâ zikrike ve şükrike ve husni ibâdetik.',
    'Allah’ım! Seni anmak, sana şükretmek ve sana güzelce kulluk etmek konusunda bana yardım et.',
    'Ebû Dâvûd, Vitir 26'),

  /* --- Ramazan --- */
  d('ramazan-1', 'ramazan', 'İftar Duası',
    'اللَّهُمَّ لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَيْكَ تَوَكَّلْتُ وَعَلَىٰ رِزْقِكَ أَفْطَرْتُ',
    'Allâhümme leke sumtü ve bike âmentü ve aleyke tevekkeltü ve alâ rızkıke eftartü.',
    'Allah’ım! Senin için oruç tuttum, sana iman ettim, sana tevekkül ettim ve senin rızkınla orucumu açtım.',
    'Ebû Dâvûd, Savm 22', null,
    'Ülkemizde en çok bilinen iftar duasıdır; senedi zayıf sayılır. Hadis tekniği bakımından ' +
    'daha sağlam olan iftar duası, hemen aşağıdaki “Zehebe’z-zamaü…” rivayetidir.'),
  d('ramazan-2', 'ramazan', 'Oruç Açıldığında',
    'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ',
    'Zehebe’z-zamaü vebtelleti’l-urûku ve sebete’l-ecru inşâallâh.',
    'Susuzluk gitti, damarlar ıslandı ve Allah dilerse ecir sabit oldu.',
    'Ebû Dâvûd, Savm 22'),
  d('ramazan-3', 'ramazan', 'Sahurda Niyet',
    'نَوَيْتُ أَنْ أَصُومَ غَدًا مِنْ شَهْرِ رَمَضَانَ',
    'Neveytü en esûme ğaden min şehri ramazân.',
    'Ramazan ayından yarınki orucu tutmaya niyet ettim.',
    'Fıkıh kaynaklarında yer alan niyet ifadesi'),

  /* --- Hac --- */
  d('hac-1', 'hac', 'Telbiye',
    'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ لَا شَرِيكَ لَكَ',
    'Lebbeyk Allâhümme lebbeyk, lebbeyke lâ şerîke leke lebbeyk. İnne’l-hamde ve’n-ni’mete leke ve’l-mülk, lâ şerîke lek.',
    'Buyur Allah’ım buyur! Buyur, senin ortağın yoktur, buyur! Şüphesiz hamd de nimet de mülk de senindir. Senin ortağın yoktur.',
    'Buhârî, Hac 26; Müslim, Hac 19'),
  d('hac-2', 'hac', 'Safâ ve Merve Arasında',
    'رَبِّ اغْفِرْ وَارْحَمْ إِنَّكَ أَنْتَ الْأَعَزُّ الْأَكْرَمُ',
    'Rabbiğfir verham inneke ente’l-e’azzü’l-ekrem.',
    'Rabbim! Bağışla ve merhamet et. Şüphesiz sen en üstün ve en cömert olansın.',
    'İbn Ebî Şeybe, Musannef, IV/68', null,
    'Hz. Peygamber’e değil, sahâbeye (İbn Mes’ûd ve İbn Ömer) dayandırılan bir duadır. ' +
    'Sa’y sırasında belirli bir dua okumak şart değildir; kişi dilediği duayı edebilir.'),

  /* --- Korunma --- */
  d('korunma-1', 'korunma', 'Her Türlü Kötülükten',
    'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    'Bismillâhillezî lâ yedurru mea’smihî şey’ün fi’l-ardı ve lâ fi’s-semâi ve hüve’s-semîu’l-alîm.',
    'Adı anıldığında yerde ve gökte hiçbir şeyin zarar veremeyeceği Allah’ın adıyla. O hakkıyla işiten, hakkıyla bilendir.',
    'Ebû Dâvûd, Edeb 101; Tirmizî, Daavât 13'),
  d('korunma-2', 'korunma', 'Eve Girerken',
    'بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا وَعَلَىٰ رَبِّنَا تَوَكَّلْنَا',
    'Bismillâhi velecnâ ve bismillâhi harecnâ ve alâ rabbinâ tevekkelnâ.',
    'Allah’ın adıyla girdik, Allah’ın adıyla çıktık ve Rabbimize tevekkül ettik.',
    'Ebû Dâvûd, Edeb 102')
];

export const duasOf = (cat) => DUAS.filter((x) => x.cat === cat);
export const duaById = (id) => DUAS.find((x) => x.id === id);

/* ============================================================
   HADİSLER
   ============================================================ */
export const HADITH_CATEGORIES = [
  { id: 'niyet', name: 'Niyet ve İhlâs' },
  { id: 'ahlak', name: 'Ahlâk ve Edep' },
  { id: 'namaz', name: 'Namaz' },
  { id: 'ilim', name: 'İlim' },
  { id: 'komsu', name: 'Komşuluk ve Aile' },
  { id: 'sabir', name: 'Sabır ve Şükür' },
  { id: 'temizlik', name: 'Temizlik' },
  { id: 'infak', name: 'İnfak ve Yardımlaşma' }
];

/** h(id, kategori, metin, kaynak, açıklama, derece?)
 *
 *  `derece` yalnızca DİKKAT GEREKTİREN rivayetlerde doldurulur:
 *  yaygın olarak bilinen ama senedi zayıf sayılan sözler. Boş bırakılması
 *  "sahih" iddiası değildir; kartta yalnızca kaynak gösterilir. Kütüb-i
 *  Sitte'nin sahihlerinden (Buhârî, Müslim) gelenlerde ayrıca not düşülmez. */
const h = (id, cat, text, src, note, derece = null) => ({ id, cat, text, src, note, derece });

export const HADITHS = [
  h('h1', 'niyet', 'Ameller ancak niyetlere göredir. Herkese niyet ettiği şey vardır.',
    'Buhârî, Bed’ü’l-vahy 1; Müslim, İmâret 155',
    'Hadis külliyatının başında yer alan bu söz, dış görünüşü aynı olan iki işi birbirinden ayıranın kalpteki maksat olduğunu belirtir.'),
  h('h2', 'ahlak', 'Sizin en hayırlınız, ahlâkı en güzel olanınızdır.',
    'Buhârî, Menâkıb 23; Müslim, Fedâil 68; Tirmizî, Birr 47',
    'Üstünlük ölçüsünün ibadetin miktarı değil, insanla ilişkinin niteliği olduğunu vurgular.'),
  h('h3', 'ahlak', 'Müslüman, elinden ve dilinden diğer insanların güvende olduğu kimsedir.',
    'Buhârî, İman 4; Müslim, İman 64',
    'İmanın toplumsal karşılığını tanımlar: çevresine zarar vermemek.'),
  h('h4', 'namaz', 'İşin başı İslâm, direği namaz, zirvesi Allah yolunda cihaddır.',
    'Tirmizî, Îmân 8; İbn Mâce, Fiten 12',
    'Namazın diğer ibadetleri ayakta tutan yapı taşı olduğu benzetmesiyle anlatılır. ' +
    'Halk arasında yaygın olan “Namaz dinin direğidir” kısa şekli Beyhakî’nin Şuabü’l-îmân’ında ' +
    'geçer ve senedi zayıf kabul edilir; aynı mana, yukarıdaki sahih rivayette yer alır.'),
  h('h5', 'namaz', 'Kişi ile küfür arasında namazın terki vardır.',
    'Müslim, İman 134; Tirmizî, İman 9',
    'Âlimler bu hadisi, namazı önemsememe tutumuna yönelik ağır bir uyarı olarak yorumlar.'),
  h('h6', 'ilim', 'İlim öğrenmek her müslümana farzdır.',
    'İbn Mâce, Mukaddime 17',
    'Burada kastedilenin öncelikle kişinin kendi dinî ve dünyevî yükümlülüklerini bilecek kadar bilgi olduğu belirtilir.'),
  h('h7', 'ilim', 'Kim ilim öğrenmek için bir yola girerse, Allah ona cennete giden yolu kolaylaştırır.',
    'Müslim, Zikir 39; Tirmizî, İlim 19',
    'İlim yolculuğunun bizzat kendisinin değerli sayıldığını ifade eder.'),
  h('h8', 'komsu', 'Cebrail bana komşu hakkında o kadar çok tavsiyede bulundu ki, neredeyse komşuyu komşuya mirasçı kılacak sandım.',
    'Buhârî, Edeb 28; Müslim, Birr 140',
    'Komşuluk hukukunun ne kadar geniş tutulduğunu anlatan bir benzetmedir.'),
  h('h9', 'komsu', 'Sizin en hayırlınız, ailesine karşı en hayırlı olanınızdır.',
    'Tirmizî, Menâkıb 63; İbn Mâce, Nikâh 50',
    'İyiliğin ölçüsünün önce ev içinde göründüğünü belirtir.'),
  h('h10', 'sabir', 'Mü’minin durumu ne hoştur! Her hâli kendisi için hayırlıdır. Sevindirici bir şey gelse şükreder, bu onun için hayır olur; bir sıkıntı gelse sabreder, bu da onun için hayır olur.',
    'Müslim, Zühd 64',
    'İyi ve kötü günün aynı iç tutumla karşılanabileceğini anlatır.'),
  h('h11', 'temizlik', 'Temizlik imanın yarısıdır.',
    'Müslim, Tahâret 1; Tirmizî, Daavât 86',
    'Maddî temizlik ile kalbin arınması birlikte düşünülür.'),
  h('h12', 'infak', 'Veren el alan elden üstündür.',
    'Buhârî, Zekât 18; Müslim, Zekât 94',
    'Yardımlaşmada verenin konumunu tanımlar; alanı küçültmek için değil, vermeyi teşvik için söylenmiştir.'),
  h('h13', 'infak', 'Bir hurmanın yarısıyla da olsa kendinizi ateşten koruyun.',
    'Buhârî, Zekât 10; Müslim, Zekât 66',
    'Sadakada miktarın değil, sürekliliğin ve niyetin esas olduğunu gösterir.'),
  h('h14', 'ahlak', 'Kolaylaştırın, zorlaştırmayın; müjdeleyin, nefret ettirmeyin.',
    'Buhârî, İlim 11; Müslim, Cihâd 6',
    'Dini anlatma ve uygulamada tutulacak üslubu belirler.'),
  h('h15', 'sabir', 'Gerçek pehlivan, güreşte rakibini yenen değil, öfkelendiğinde kendine hâkim olabilendir.',
    'Buhârî, Edeb 76; Müslim, Birr 107',
    'Güç kavramını fizikî üstünlükten öz denetime taşır.')
];

export const hadithsOf = (cat) => HADITHS.filter((x) => x.cat === cat);

/* ============================================================
   DİNİ BİLGİLER
   ============================================================ */
export const INFO_CATEGORIES = [
  { id: 'abdest', name: 'Abdest' }, { id: 'namaz', name: 'Namaz' },
  { id: 'oruc', name: 'Oruç' }, { id: 'zekat', name: 'Zekât' },
  { id: 'hac', name: 'Hac' }, { id: 'gunluk', name: 'Günlük Hayat' },
  { id: 'ahlak', name: 'Ahlâk' }, { id: 'kuran', name: 'Kur’an' }
];

/** a(id, kategori, başlık, özet, gövde[], kaynaklar[]) */
const a = (id, cat, title, summary, body, sources) => ({ id, cat, title, summary, body, sources });

export const INFO_ARTICLES = [
  a('abdest-nasil', 'abdest', 'Abdest Nasıl Alınır?',
    'Sırasıyla farzları ve sünnetleriyle abdestin uygulanışı.',
    [
      'Abdeste başlarken besmele çekilir ve niyet edilir.',
      'Eller bileklere kadar üç kez yıkanır; parmak araları ovulur.',
      'Ağza üç kez su verilir (mazmaza), buruna üç kez su çekilir (istinşak).',
      'Yüz, saç bitiminden çene altına ve kulak yumuşaklarına kadar üç kez yıkanır. — FARZ',
      'Kollar dirseklerle birlikte üç kez yıkanır; önce sağ, sonra sol. — FARZ',
      'Başın en az dörtte biri bir kez mesh edilir. — FARZ',
      'Kulaklar ve boyun mesh edilir.',
      'Ayaklar topuklarla birlikte üç kez yıkanır; önce sağ, sonra sol. — FARZ',
      'Hanefî mezhebine göre abdestin farzı dörttür: yüzü yıkamak, kolları yıkamak, başı mesh etmek, ayakları yıkamak.',
      'Not: Bu yazı Hanefî mezhebine göredir. Şâfiî mezhebinde niyet ve tertip de farz sayılır.'
    ],
    ['Mâide 6', 'Diyanet İşleri Başkanlığı, İlmihal, I/197–204']),

  a('abdest-bozan', 'abdest', 'Abdesti Bozan Durumlar',
    'Hangi hâllerde abdest yenilenir?',
    [
      'Ön ve arka yoldan çıkan her şey.',
      'Ağız dolusu kusmak.',
      'Bayılma, sarhoşluk veya uyku sebebiyle bilincin kaybolması.',
      'Namazda sesli gülmek.',
      'Vücuttan akan ve akacak kadar olan kan veya irin (Hanefî mezhebine göre).',
      'Not: Mezhepler arasında bazı ayrıntılarda farklılık vardır; örneğin Şâfiî mezhebinde kanama abdesti bozmaz.'
    ],
    ['Diyanet İşleri Başkanlığı, İlmihal, I/205–210']),

  a('namaz-nasil', 'namaz', 'Namaz Nasıl Kılınır?',
    'İki rekâtlık bir namazın adım adım kılınışı.',
    [
      'Kıbleye dönülür, niyet edilir.',
      '"Allahu ekber" diyerek iftitah tekbiri alınır ve eller bağlanır.',
      'Sübhâneke okunur, ardından Eûzü-Besmele çekilir.',
      'Fâtiha sûresi okunur. — KIRAAT FARZ, Fâtiha okumak Hanefî’de VÂCİP',
      'Ardından bir sûre veya en az üç âyet okunur (zamm-ı sûre). — VÂCİP',
      'Tekbir alınarak rükûya varılır. — RÜKÛ FARZ; içinde üç kez "Sübhâne rabbiye’l-azîm" denmesi sünnettir.',
      '"Semiallâhü limen hamideh" diyerek doğrulunur, "Rabbenâ leke’l-hamd" denir.',
      'Tekbirle secdeye gidilir. — SECDE FARZ; içinde üç kez "Sübhâne rabbiye’l-a’lâ" denmesi sünnettir.',
      'Oturulup tekrar secde yapılır, sonra ikinci rekâta kalkılır.',
      'İkinci rekâtta Fâtiha ve sûre okunur, rükû ve secdeler yapılır.',
      'Oturuşta Ettehiyyâtü, Allâhümme salli–bârik ve Rabbenâ duaları okunur. — SON OTURUŞ FARZ',
      'Sağa ve sola selam verilerek namaz tamamlanır.'
    ],
    ['Diyanet İşleri Başkanlığı, İlmihal, I/243–286']),

  a('kaza-namazi', 'namaz', 'Kaza Namazı Nasıl Kılınır?',
    'Vaktinde kılınamayan namazın sonradan kılınması.',
    [
      'Kaza namazı, vaktinde kılınamamış farz namazın sonradan kılınmasıdır.',
      'Kılınışı, vaktinde kılınan namazın farzıyla aynıdır; yalnızca niyet farklıdır.',
      'Niyette hangi namaza ait olduğu belirtilir: "Kılamadığım ilk öğle namazının farzını kılmaya niyet ettim" gibi.',
      'Kaza namazları için belirlenmiş özel bir vakit yoktur; kerahet vakitleri dışında her zaman kılınabilir.',
      'Kerahet vakitleri: güneşin doğuşu, tam tepede olduğu an ve batışı sırasındaki kısa süreler.',
      'Sayı çoksa, günlük rutine küçük bir miktar eklenerek ilerlemek yaygın bir tavsiyedir.',
      'Bu konuda mezhepler arasında tertip (sıra gözetme) ile ilgili farklı görüşler bulunur.'
    ],
    ['Diyanet İşleri Başkanlığı, İlmihal, I/324–330', 'DİB Din İşleri Yüksek Kurulu kararları']),

  a('seferilik', 'namaz', 'Seferîlik Nedir?',
    'Yolculukta namazın kısaltılması.',
    [
      'Seferîlik, kişinin ikamet ettiği yerden 90 km (18 fersah) veya daha uzak bir yere gitmesiyle başlar.',
      'Seferî olan kişi dört rekâtlı farz namazları iki rekât olarak kılar: öğle, ikindi ve yatsı.',
      'Sabah namazı (2 rekât) ve akşam namazı (3 rekât) kısaltılmaz.',
      'Sünnetler seferîlikte kılınabilir de kılınmayabilir de; yolculuk zorluk veriyorsa terk edilebilir.',
      'Gidilen yerde 15 günden az kalınacaksa seferîlik devam eder; 15 gün veya daha fazla kalma niyeti varsa mukim olunur.',
      'Şâfiî mezhebinde bu süre 4 gün olarak kabul edilir.'
    ],
    ['Nisâ 101', 'Diyanet İşleri Başkanlığı, İlmihal, I/331–338']),

  a('oruc-bozan', 'oruc', 'Orucu Bozan ve Bozmayan Durumlar',
    'Nelerin kaza, nelerin kefaret gerektirdiği.',
    [
      'BOZAN — yalnız kaza gerektirir: ağız yoluyla ilaç almak, ağız dolusu kusmayı kendi isteğiyle yapmak, gıda ya da ilaç sayılmayan bir şeyi yutmak.',
      'BOZAN — kaza ve kefaret gerektirir: oruçlu olduğunu bilerek kasten yemek, içmek veya cinsel ilişkide bulunmak.',
      'BOZMAZ: unutarak yiyip içmek, istem dışı kusmak, diş fırçalamak (yutmamak şartıyla), kan aldırmak, gusül abdesti almak, koku sürünmek.',
      'BOZMAZ: göz damlası, iğne (besleyici olmayan) — bu konuda çağdaş kurul kararları vardır.',
      'Hastalık ve yolculuk hâlinde oruç ertelenebilir, sonradan kaza edilir.'
    ],
    ['Bakara 184–185', 'Diyanet İşleri Başkanlığı, İlmihal, I/392–408']),

  a('fitre', 'oruc', 'Fitre (Sadaka-i Fıtır) Nedir?',
    'Ramazan’da verilen ve bayram namazına kadar ödenen sadaka.',
    [
      'Fitre, Ramazan ayının sonunda, temel ihtiyaçlarının dışında nisap miktarı mala sahip olan müslümanların vermesi gereken sadakadır.',
      'Kişi kendisi ve bakmakla yükümlü olduğu kişiler için verir.',
      'Miktarı, bir kişinin bir günlük ortalama yiyecek masrafı esas alınarak belirlenir; Diyanet her yıl alt sınırı ilan eder.',
      'En geç bayram namazından önce verilmesi uygundur; Ramazan içinde de verilebilir.',
      'Zekâttan farkı: zekât belirli malların kırkta biri iken, fitre kişi başına belirlenmiş sabit bir miktardır.'
    ],
    ['Buhârî, Zekât 70–78', 'Diyanet İşleri Başkanlığı, İlmihal, I/440–448']),

  a('zekat-nisap', 'zekat', 'Zekât Nisabı ve Oranı',
    'Kimler, ne kadar ve neyin zekâtını verir?',
    [
      'Zekât, nisap miktarı mala sahip olup üzerinden bir kamerî yıl geçen müslümanlara farzdır.',
      'Nisap: 80,18 gram altın veya 561 gram gümüş değerindeki mal.',
      'Uygulamada, fakirin lehine olduğu için gümüş nisabı esas alınması yaygın bir tercihtir.',
      'Oran: nakit, altın, gümüş, ticaret malı ve alacaklarda kırkta bir (%2,5).',
      'Zekât hesaplanırken vadesi gelmiş borçlar ve temel ihtiyaçlar düşülür.',
      'Zekâtın verileceği sınıflar Tevbe sûresi 60. âyette sayılmıştır.'
    ],
    ['Tevbe 60', 'Diyanet İşleri Başkanlığı, İlmihal, I/430–470']),

  a('zekat-sadaka', 'zekat', 'Sadaka ile Zekât Arasındaki Fark',
    'İkisi de vermek, ama yükümlülük ve ölçü farklı.',
    [
      'ZEKÂT: farzdır. Belirli mallar üzerinden, belirli bir nisaba ulaşınca, belirli bir oranda (%2,5) ve belirli kişilere verilir. Yılda bir kez hesaplanır.',
      'SADAKA: gönüllüdür. Miktarı, zamanı ve kime verileceği serbesttir. Her zaman verilebilir.',
      'Zekât yalnızca Tevbe 60’ta sayılan sınıflara verilebilir; sadaka daha geniş bir alanda kullanılabilir.',
      'Bir gülümseme (Tirmizî, Birr 36) veya yoldan bir engeli kaldırmanın (Buhârî, Cihâd 128; Müslim, Zekât 56) da sadaka sayıldığı hadislerde belirtilmiştir.',
      'Zekât verilmediğinde dinî bir borç doğar; sadaka verilmediğinde böyle bir borç doğmaz.'
    ],
    ['Tevbe 60', 'Tirmizî, Birr 36', 'Buhârî, Cihâd 128', 'Diyanet İşleri Başkanlığı, İlmihal, I/430–433']),

  a('vitir', 'namaz', 'Vitir Namazı Nasıl Kılınır?',
    'Yatsıdan sonra kılınan üç rekâtlık namaz.',
    [
      'Vitir, yatsı namazından sonra kılınan üç rekâtlık namazdır. Hanefî mezhebinde vâciptir.',
      'İlk iki rekât normal kılınır; ikinci rekâtta oturulur ve Ettehiyyâtü okunur.',
      'Üçüncü rekâta kalkılır, Fâtiha ve bir sûre okunur.',
      'Sûre bitince eller kulak hizasına kaldırılıp tekbir alınır, sonra tekrar bağlanır.',
      'Kunut duaları okunur.',
      'Rükû ve secdeler yapılıp oturulur, dualar okunur ve selam verilir.',
      'Vakti yatsıdan sonra imsağa kadardır; gecenin sonunda kılınması faziletli sayılır.'
    ],
    ['Diyanet İşleri Başkanlığı, İlmihal, I/298–302']),

  a('gusul', 'abdest', 'Gusül Abdesti',
    'Boy abdestinin farzları ve alınışı.',
    [
      'Guslün farzı üçtür (Hanefî): ağza su vermek, buruna su vermek, bütün bedeni yıkamak.',
      'Önce eller ve avret mahalli yıkanır, vücuttaki pislik giderilir.',
      'Namaz abdesti alınır.',
      'Ağza ve buruna üçer kez su verilir.',
      'Önce baş, sonra sağ omuz, sonra sol omuz üzerine su dökülür.',
      'Vücutta kuru yer kalmayacak şekilde her taraf yıkanır.',
      'İğne ucu kadar bile kuru yer kalırsa gusül tamamlanmış olmaz.'
    ],
    ['Mâide 6', 'Diyanet İşleri Başkanlığı, İlmihal, I/211–218']),

  a('cuma', 'namaz', 'Cuma Namazı',
    'Şartları, kılınışı ve Kehf sûresi.',
    [
      'Cuma namazı, öğle vaktinde cemaatle kılınan iki rekâtlık farz namazdır.',
      'Yükümlülük şartları: müslüman, akıl sağlığı yerinde, ergen, hür, mukim ve sağlıklı erkek olmak.',
      'Kadınlar, yolcular ve hastalar için farz değildir; ancak kılarlarsa geçerlidir ve öğle namazı yerine geçer.',
      'Hutbe, namazın şartlarındandır.',
      'Cuma günü Kehf sûresini okumak sünnet olarak tavsiye edilmiştir.',
      'Camiye erken gitmek, gusül almak ve güzel koku sürünmek sünnettir.'
    ],
    ['Cum’a 9–10', 'Diyanet İşleri Başkanlığı, İlmihal, I/303–316']),

  a('teravih', 'oruc', 'Teravih Namazı',
    'Ramazan gecelerine mahsus sünnet namaz.',
    [
      'Teravih, Ramazan ayında yatsı namazından sonra kılınan sünnet namazdır.',
      'Yirmi rekât olarak kılınması yaygın uygulamadır; sekiz rekât kılındığına dair rivayetler de vardır.',
      'İki veya dört rekâtta bir selam verilerek kılınır.',
      'Cemaatle kılınması sünnettir, tek başına da kılınabilir.',
      'Vakti yatsıdan sonra başlar, imsağa kadar devam eder.',
      'Vitir namazı teravihten sonra kılınır.'
    ],
    ['Buhârî, Terâvih 1', 'Diyanet İşleri Başkanlığı, İlmihal, I/296–298'])
];

export const infoOf = (cat) => INFO_ARTICLES.filter((x) => x.cat === cat);
export const infoById = (id) => INFO_ARTICLES.find((x) => x.id === id);

/* ============================================================
   HAC & UMRE REHBERİ
   ============================================================ */
/* Her adım kaynağıyla birlikte tutulur: rehber, kaynaksız hüküm anlatmaz. */
export const HAJJ_STEPS = [
  { id: 'ihram', no: 1, name: 'İhram', when: 'Mîkat sınırında',
    sources: ['Bakara 197', 'Buhârî, Hac 9 (Mevâkît)', 'Diyanet İşleri Başkanlığı, İlmihal — Hac ve Umre'],
    desc: 'Hac veya umreye niyet ederek ihrama girilir. Erkekler dikişsiz iki parça beyaz kumaş giyer; kadınlar günlük kıyafetlerini korur.',
    points: ['Gusül alınır veya abdest alınır', 'İki rekât ihram namazı kılınır', 'Niyet edilir ve telbiye getirilir',
      'İhram yasakları başlar: tıraş olmak, koku sürünmek, tırnak kesmek, avlanmak, nikâh kıymak'],
    dua: 'hac-1' },
  { id: 'tavaf', no: 2, name: 'Tavaf', when: 'Mescid-i Haram’da',
    sources: ['Bakara 125', 'Hac 29', 'Buhârî, Hac 60', 'Müslim, Hac 147'],
    desc: 'Kâbe’nin etrafında Hacerü’l-Esved hizasından başlayarak yedi kez dönülür.',
    points: ['Hacerü’l-Esved hizasında "Bismillâhi Allâhü ekber" denir', 'Kâbe sol tarafta kalacak şekilde dönülür',
      'İlk üç şavtta erkekler hızlı adımlarla yürür (remel)', 'Tavaf sonunda Makam-ı İbrâhim arkasında iki rekât namaz kılınır'] },
  { id: 'say', no: 3, name: 'Sa’y', when: 'Safâ ve Merve arasında',
    sources: ['Bakara 158', 'Buhârî, Hac 79', 'Müslim, Hac 259'],
    desc: 'Safâ tepesinden başlayıp Merve’de biten dört gidiş üç geliş, toplam yedi şavttır.',
    points: ['Safâ’dan başlanır, Merve’de bitirilir', 'İki yeşil direk arasında erkekler hızlı yürür (hervele)',
      'Her şavtta dua edilir', 'Sa’y bittikten sonra umrede tıraş olunur ve ihramdan çıkılır'],
    dua: 'hac-2' },
  { id: 'arafat', no: 4, name: 'Arafat Vakfesi', when: 'Zilhicce 9 · öğleden gün batımına',
    sources: ['Bakara 198', 'Ebû Dâvûd, Menâsik 68', 'Tirmizî, Hac 57', 'Nesâî, Menâsik 203'],
    desc: 'Haccın en temel rüknüdür. Arafat’ta bulunmadan hac tamamlanmaz.',
    points: ['Öğle ve ikindi namazı birleştirilerek kılınır', 'Gün batımına kadar dua, zikir ve tövbe ile geçirilir',
      'Güneş batmadan Arafat’tan ayrılınmaz', '"Hac Arafat’tır" hadisi bu rüknün önemini belirtir'] },
  { id: 'muzdelife', no: 5, name: 'Müzdelife', when: 'Arafat sonrası gece',
    sources: ['Bakara 198', 'Buhârî, Hac 96', 'Müslim, Hac 266'],
    desc: 'Güneş battıktan sonra Müzdelife’ye geçilir, gece burada geçirilir.',
    points: ['Akşam ve yatsı namazı birleştirilerek yatsı vaktinde kılınır', 'Şeytan taşlamak için taşlar toplanır',
      'Fecirden sonra vakfe yapılır', 'Güneş doğmadan Mina’ya hareket edilir'] },
  { id: 'mina', no: 6, name: 'Mina — Şeytan Taşlama ve Kurban', when: 'Zilhicce 10–13',
    sources: ['Hac 28', 'Kevser 2', 'Buhârî, Hac 132', 'Müslim, Hac 314'],
    desc: 'Büyük cemreye yedi taş atılır, ardından kurban kesilir ve tıraş olunarak ihramdan çıkılır.',
    points: ['Bayramın 1. günü sadece büyük cemre (Akabe) taşlanır', 'Kurban kesilir', 'Saç tıraşı ile ihramdan çıkılır',
      'Ziyaret tavafı yapılır', 'Bayramın 2., 3. ve 4. günleri üç cemre de taşlanır'] },
  { id: 'veda', no: 7, name: 'Veda Tavafı', when: 'Mekke’den ayrılırken',
    sources: ['Buhârî, Hac 144', 'Müslim, Hac 379', 'Diyanet İşleri Başkanlığı, İlmihal — Hac ve Umre'],
    desc: 'Mekke’den ayrılmadan önce yapılan son tavaftır.',
    points: ['Âfâkî (dışarıdan gelen) hacılar için vâciptir', 'Yedi şavt tavaf yapılır',
      'Tavaf namazı kılınır', 'Mültezem’de dua edilir'] }
];

/* ============================================================
   1 DAKİKADA ÖĞREN — günlük kısa bilgi kartları
   ============================================================ */
/* Kısa kartlar da kaynaksız kalmaz: kart tek başına paylaşılabildiği için
   bağlantı verdiği yazının künyesine güvenilemez, kendi künyesi bulunur. */
export const MINUTE_CARDS = [
  { id: 'm1', q: 'Seferîlik nedir?', a: 'İkamet ettiğin yerden 90 km ve daha uzağa gittiğinde seferî olursun. Öğle, ikindi ve yatsının farzları iki rekât kılınır. Sabah ve akşam kısaltılmaz.', link: 'seferilik',
    src: 'Nisâ 101; Diyanet İşleri Başkanlığı, İlmihal — Seferîlik' },
  { id: 'm2', q: 'Vitir namazı nasıl kılınır?', a: 'Yatsıdan sonra üç rekât kılınır. Üçüncü rekâtta zamm-ı sûreden sonra tekbir alınır ve kunut duaları okunur.', link: 'vitir',
    src: 'Ebû Dâvûd, Vitir 1; Diyanet İşleri Başkanlığı, İlmihal — Vitir Namazı' },
  { id: 'm3', q: 'Sadaka ile zekât arasındaki fark nedir?', a: 'Zekât farzdır; nisap, oran ve verilecek kişiler bellidir. Sadaka gönüllüdür; miktarı ve zamanı serbesttir.', link: 'zekat-sadaka',
    src: 'Tevbe 60; Diyanet İşleri Başkanlığı, İlmihal — Zekât' },
  { id: 'm4', q: 'Kaza namazı nasıl kılınır?', a: 'Vaktinde kılınan farzla aynıdır, sadece niyet farklıdır. Kerahet vakitleri dışında her zaman kılınabilir.', link: 'kaza-namazi',
    src: 'Buhârî, Mevâkît 37; Diyanet İşleri Başkanlığı, İlmihal — Kaza Namazı' },
  { id: 'm5', q: 'Kerahet vakti ne demek?', a: 'Güneşin doğuşu, tam tepede olduğu an ve batışı sırasındaki kısa sürelerdir. Bu vakitlerde nafile namaz kılınmaz.', link: 'kaza-namazi',
    src: 'Müslim, Müsâfirîn 293; Diyanet İşleri Başkanlığı, İlmihal — Namaz Vakitleri' },
  { id: 'm6', q: 'Fitre ne zaman verilir?', a: 'Ramazan boyunca verilebilir; en geç bayram namazından önce ödenmesi uygundur.', link: 'fitre',
    src: 'Buhârî, Zekât 76; Ebû Dâvûd, Zekât 17' },
  { id: 'm7', q: 'Teravih kaç rekâttır?', a: 'Yaygın uygulama yirmi rekâttır. Sekiz rekât kılındığına dair rivayetler de vardır. Cemaatle kılınması sünnettir.', link: 'teravih',
    src: 'Buhârî, Terâvih 1; Diyanet İşleri Başkanlığı, İlmihal — Teravih' },
  { id: 'm8', q: 'Zekât nisabı nedir?', a: '80,18 gram altın veya 561 gram gümüş değerinde mala, üzerinden bir kamerî yıl geçmiş olarak sahip olmaktır.', link: 'zekat-nisap',
    src: 'Tevbe 34; Diyanet İşleri Başkanlığı, İlmihal — Zekât Nisabı' },
  { id: 'm9', q: 'Cuma günü ne okunur?', a: 'Kehf sûresini okumak sünnet olarak tavsiye edilmiştir. Ayrıca salavat getirmek de tavsiye edilir.', link: 'cuma',
    src: 'Beyhakî, Şuabü’l-îmân (Kehf); Ebû Dâvûd, Salât 201 (salavat)' },
  { id: 'm10', q: 'Gusül abdestinin farzları nelerdir?', a: 'Hanefî mezhebine göre üçtür: ağza su vermek, buruna su vermek ve bütün bedeni yıkamak.', link: 'gusul',
    src: 'Mâide 6; Diyanet İşleri Başkanlığı, İlmihal — Gusül' },
  { id: 'm11', q: 'Orucu neler bozmaz?', a: 'Unutarak yiyip içmek, istem dışı kusmak, yutmamak şartıyla diş fırçalamak, kan aldırmak ve gusletmek orucu bozmaz.', link: 'oruc-bozan',
    src: 'Buhârî, Savm 26; Ebû Dâvûd, Savm 33; DİB Din İşleri Yüksek Kurulu, Oruç fetvaları' },
  { id: 'm12', q: 'Abdesti ne bozar?', a: 'Ön ve arka yoldan çıkanlar, ağız dolusu kusmak, bilinç kaybı ve namazda sesli gülmek abdesti bozar.', link: 'abdest-bozan',
    src: 'Mâide 6; Diyanet İşleri Başkanlığı, İlmihal — Abdesti Bozan Durumlar' }
];

/* ============================================================
   MİZAN SOR — hazır cevap örnekleri
   Yapı: Kısa Cevap → Detay → Farklı Görüşler → Kaynaklar
   ============================================================ */
export const ASK_SUGGESTIONS = [
  'Kaza namazı nasıl kılınır?',
  'Seferîlikte namaz nasıl kılınır?',
  'Zekât nisabı ne kadar?',
  'Orucu bozan durumlar nelerdir?',
  'Vitir namazı vacip midir?'
];

export const ASK_ANSWERS = {
  'kaza namazı nasıl kılınır': {
    short: 'Kaza namazı, vaktinde kılınamayan farz namazın sonradan kılınmasıdır. Kılınışı vaktindeki namazla aynıdır; yalnızca niyette hangi namaz olduğu belirtilir.',
    detail: [
      'Niyet şu şekilde yapılabilir: "Kılamadığım ilk öğle namazının farzını kılmaya niyet ettim."',
      'Kaza namazları için belirlenmiş özel bir vakit yoktur. Kerahet vakitleri (güneşin doğuşu, tam tepede olduğu an ve batışı) dışında her zaman kılınabilir.',
      'Kaza namazlarında sünnetler kılınmaz; yalnızca farzlar kaza edilir. Sabah namazının sünneti bu kuralın dışında tutulmuştur.',
      'Sayı fazlaysa, günlük namazların yanına birer vakit eklenerek ilerlemek yaygın olarak tavsiye edilen bir yöntemdir.'
    ],
    views: [
      { title: 'Tertip (sıra) gözetme', body: 'Hanefî mezhebinde, kaza namazı sayısı altıyı geçmediği sürece kazaları sırasıyla kılmak ve vakit namazından önce kaza etmek gerekli görülür. Sayı altıyı aştığında tertip düşer.' },
      { title: 'Şâfiî mezhebi', body: 'Şâfiî mezhebinde tertip şart değil, müstehap kabul edilir; sıra gözetilmeden de kaza edilebilir.' }
    ],
    sources: ['Diyanet İşleri Başkanlığı, İlmihal, I/324–330', 'DİB Din İşleri Yüksek Kurulu, Namaz fetvaları', 'Kâsânî, Bedâiu’s-sanâi‘, I/131']
  },
  'zekât nisabı ne kadar': {
    short: 'Nisap, 80,18 gram altın veya 561 gram gümüş değerindeki maldır. Bu miktara ulaşan ve üzerinden bir kamerî yıl geçen mala %2,5 oranında zekât düşer.',
    detail: [
      'Nisap hesabında temel ihtiyaçlar ve vadesi gelmiş borçlar düşülür.',
      'Nakit, altın, gümüş, ticaret malı, hisse senedi ve alacaklar zekâta tâbidir.',
      'Oturulan ev, kullanılan araç ve mesleki aletler nisap hesabına katılmaz.'
    ],
    views: [
      { title: 'Altın mı gümüş mü esas alınmalı?', body: 'Günümüzde gümüş nisabı altın nisabından çok daha düşük bir tutara denk gelir. Fakirin lehine olduğu için gümüş nisabının esas alınması yaygın bir tercihtir; altın nisabını esas alan görüşler de vardır.' }
    ],
    sources: ['Tevbe 60', 'Diyanet İşleri Başkanlığı, İlmihal, I/430–470', 'DİB Din İşleri Yüksek Kurulu, Zekât fetvaları']
  }
};

export const ASK_DISCLAIMER =
  'Mizan Sor, güvenilir kaynaklardan derlenen bilgileri aktarır; fetva vermez. ' +
  'Kişisel durumunla ilgili bağlayıcı bir karar gerekiyorsa bir din görevlisine veya uzmanına danışman daha doğru olur.';


/* ============================================================
   ZİKİRLER — dijital tesbih
   ============================================================ */
/* Namaz sonrası 33'er tesbihin dayanağı Ebû Hüreyre rivayetidir; hedef
   sayılar uydurulmuş değil, kaynağıyla birlikte tutulur. */
const TESBIHAT_KAYNAK = 'Müslim, Mesâcid 146; Buhârî, Ezân 155';

export const ZIKIRS = [
  { id: 'subhanallah', ar: 'سُبْحَانَ اللَّهِ', tr: 'Sübhânallah', meaning: 'Allah’ı her türlü eksiklikten tenzih ederim', target: 33, src: TESBIHAT_KAYNAK },
  { id: 'elhamdulillah', ar: 'الْحَمْدُ لِلَّهِ', tr: 'Elhamdülillah', meaning: 'Hamd Allah’a mahsustur', target: 33, src: TESBIHAT_KAYNAK },
  { id: 'allahuekber', ar: 'اللَّهُ أَكْبَرُ', tr: 'Allahu ekber', meaning: 'Allah en büyüktür', target: 33, src: TESBIHAT_KAYNAK },
  { id: 'estagfirullah', ar: 'أَسْتَغْفِرُ اللَّهَ', tr: 'Estağfirullah', meaning: 'Allah’tan bağışlanma dilerim', target: 100,
    src: 'Müslim, Zikir 41 — günde yüz kez istiğfar edildiği rivayet edilir' },
  { id: 'lailahe', ar: 'لَا إِلَٰهَ إِلَّا اللَّهُ', tr: 'Lâ ilâhe illallah', meaning: 'Allah’tan başka ilâh yoktur', target: 100,
    src: 'Buhârî, Daavât 65; Müslim, Zikir 28 — günde yüz kez söylenmesi rivayet edilir' },
  { id: 'salavat', ar: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ', tr: 'Allahümme salli alâ Muhammed', meaning: 'Allah’ım! Muhammed’e salât eyle', target: 100,
    src: 'Ahzâb 56; Müslim, Salât 70 — sayı rivayetle değil, yaygın uygulamayla belirlenmiştir' },
  { id: 'havle', ar: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', tr: 'Lâ havle velâ kuvvete illâ billâh', meaning: 'Güç ve kuvvet ancak Allah’tandır', target: 100,
    src: 'Buhârî, Daavât 50; Müslim, Zikir 44 — sayı rivayetle değil, yaygın uygulamayla belirlenmiştir' }
];
