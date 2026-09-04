/* ============================================================
   MİZAN — Esmâ-i Hüsnâ
   ------------------------------------------------------------
   Kur'an, Allah'ın "en güzel isimleri" olduğunu bildirir
   (A'râf 180, İsrâ 110, Tâhâ 8, Haşr 22–24) ama isimleri tek tek
   SAYMAZ. Aşağıdaki doksan dokuzluk liste Tirmizî ve İbn Mâce
   rivayetinde yer alan sıralamadır.

   İki nokta uygulamada da açıkça söylenir:

   1. "Allah" lafzı bu doksan dokuzun İÇİNDE değildir; isimlerin
      sahibi olan zâtın özel adıdır (ism-i zât). Bu yüzden ayrı
      durur, numaralandırılmaz.
   2. Âlimlerin çoğunluğuna göre "doksan dokuz" sayısı isimleri
      bu sayıyla SINIRLAMAZ; listedeki sıralama da râvilerin
      derlemesidir. Farklı rivayetlerde birkaç isim değişir.
   ============================================================ */

export const ESMA_KAYNAK =
  'Tirmizî, Daavât 82; İbn Mâce, Duâ 10 — sıralama râvi derlemesidir';

export const ESMA_AYETLER = ['A’râf 180', 'İsrâ 110', 'Tâhâ 8', 'Haşr 22–24'];

/** İsimlerin sahibi — doksan dokuzun içinde sayılmaz */
export const ISM_I_ZAT = {
  ar: 'اَللّٰهُ',
  tr: 'Allah',
  mean: 'Varlığı zorunlu olan, bütün övgülere lâyık bulunan zâtın özel adı',
  not: 'Bu isim diğerlerinin sıfat olduğu zâtı gösterir; doksan dokuzun içinde sayılmaz.'
};

/** e(no, arapça, okunuş, anlam) */
const e = (no, ar, tr, mean) => ({ no, ar, tr, mean });

export const ESMA = [
  e(1, 'اَلرَّحْمٰنُ', 'er-Rahmân', 'Dünyada bütün varlıklara ayrım gözetmeden merhamet eden'),
  e(2, 'اَلرَّح۪يمُ', 'er-Rahîm', 'Âhirette mü’minlere özel merhamet eden'),
  e(3, 'اَلْمَلِكُ', 'el-Melik', 'Mülkün gerçek sahibi, mutlak hükümdar'),
  e(4, 'اَلْقُدُّوسُ', 'el-Kuddûs', 'Her türlü eksiklikten uzak, mukaddes'),
  e(5, 'اَلسَّلَامُ', 'es-Selâm', 'Esenlik veren, kullarını selâmete çıkaran'),
  e(6, 'اَلْمُؤْمِنُ', 'el-Mü’min', 'Güven veren, vaadine güvenilen'),
  e(7, 'اَلْمُهَيْمِنُ', 'el-Müheymin', 'Gözetip koruyan, her şeye şahit olan'),
  e(8, 'اَلْعَز۪يزُ', 'el-Azîz', 'Mutlak güç sahibi, yenilmeyen'),
  e(9, 'اَلْجَبَّارُ', 'el-Cebbâr', 'Dilediğini yaptıran, kırılanı onaran'),
  e(10, 'اَلْمُتَكَبِّرُ', 'el-Mütekebbir', 'Büyüklükte eşi olmayan'),
  e(11, 'اَلْخَالِقُ', 'el-Hâlik', 'Yaratan, yoktan var eden'),
  e(12, 'اَلْبَارِئُ', 'el-Bâri’', 'Örneksiz ve kusursuz yaratan'),
  e(13, 'اَلْمُصَوِّرُ', 'el-Musavvir', 'Her varlığa ayrı bir şekil veren'),
  e(14, 'اَلْغَفَّارُ', 'el-Gaffâr', 'Günahları çokça bağışlayan'),
  e(15, 'اَلْقَهَّارُ', 'el-Kahhâr', 'Her şeye üstün gelen'),
  e(16, 'اَلْوَهَّابُ', 'el-Vehhâb', 'Karşılıksız, bolca veren'),
  e(17, 'اَلرَّزَّاقُ', 'er-Rezzâk', 'Bütün canlıların rızkını veren'),
  e(18, 'اَلْفَتَّاحُ', 'el-Fettâh', 'Kapalı olanı açan, zorlukları gideren'),
  e(19, 'اَلْعَل۪يمُ', 'el-Alîm', 'Her şeyi hakkıyla bilen'),
  e(20, 'اَلْقَابِضُ', 'el-Kâbıd', 'Dilediğine darlık veren, tutan'),
  e(21, 'اَلْبَاسِطُ', 'el-Bâsit', 'Dilediğine genişlik veren, açan'),
  e(22, 'اَلْخَافِضُ', 'el-Hâfıd', 'Alçaltan'),
  e(23, 'اَلرَّافِعُ', 'er-Râfi’', 'Yücelten'),
  e(24, 'اَلْمُعِزُّ', 'el-Muizz', 'İzzet ve şeref veren'),
  e(25, 'اَلْمُذِلُّ', 'el-Müzill', 'Zillete düşüren'),
  e(26, 'اَلسَّم۪يعُ', 'es-Semî’', 'Her şeyi işiten'),
  e(27, 'اَلْبَص۪يرُ', 'el-Basîr', 'Her şeyi gören'),
  e(28, 'اَلْحَكَمُ', 'el-Hakem', 'Mutlak hüküm veren'),
  e(29, 'اَلْعَدْلُ', 'el-Adl', 'Mutlak adaletli'),
  e(30, 'اَللَّط۪يفُ', 'el-Latîf', 'En ince işleri bilen, kullarına lütufta bulunan'),
  e(31, 'اَلْخَب۪يرُ', 'el-Habîr', 'Her şeyin içyüzünden haberdar olan'),
  e(32, 'اَلْحَل۪يمُ', 'el-Halîm', 'Cezada acele etmeyen, yumuşak davranan'),
  e(33, 'اَلْعَظ۪يمُ', 'el-Azîm', 'Büyüklükte sınırsız olan'),
  e(34, 'اَلْغَفُورُ', 'el-Gafûr', 'Bağışlaması bol olan'),
  e(35, 'اَلشَّكُورُ', 'eş-Şekûr', 'Az iyiliğe çok karşılık veren'),
  e(36, 'اَلْعَلِيُّ', 'el-Aliyy', 'Yüceler yücesi'),
  e(37, 'اَلْكَب۪يرُ', 'el-Kebîr', 'Büyüklükte benzeri olmayan'),
  e(38, 'اَلْحَف۪يظُ', 'el-Hafîz', 'Koruyup gözeten'),
  e(39, 'اَلْمُق۪يتُ', 'el-Mukît', 'Bedenlerin ve ruhların gıdasını veren'),
  e(40, 'اَلْحَس۪يبُ', 'el-Hasîb', 'Hesaba çeken, kullarına yeten'),
  e(41, 'اَلْجَل۪يلُ', 'el-Celîl', 'Celâl ve azamet sahibi'),
  e(42, 'اَلْكَر۪يمُ', 'el-Kerîm', 'Cömertliği sınırsız olan'),
  e(43, 'اَلرَّق۪يبُ', 'er-Rakîb', 'Her an gözetleyen'),
  e(44, 'اَلْمُج۪يبُ', 'el-Mücîb', 'Dualara karşılık veren'),
  e(45, 'اَلْوَاسِعُ', 'el-Vâsi’', 'İlmi ve rahmeti her şeyi kuşatan'),
  e(46, 'اَلْحَك۪يمُ', 'el-Hakîm', 'Her işi hikmetli olan'),
  e(47, 'اَلْوَدُودُ', 'el-Vedûd', 'Çok seven, çok sevilen'),
  e(48, 'اَلْمَج۪يدُ', 'el-Mecîd', 'Şanı yüce ve şerefli'),
  e(49, 'اَلْبَاعِثُ', 'el-Bâis', 'Ölüleri dirilten'),
  e(50, 'اَلشَّه۪يدُ', 'eş-Şehîd', 'Her şeye şahit olan'),
  e(51, 'اَلْحَقُّ', 'el-Hakk', 'Varlığı gerçek olan, hakikatin kendisi'),
  e(52, 'اَلْوَك۪يلُ', 'el-Vekîl', 'Kendisine güvenilip dayanılan'),
  e(53, 'اَلْقَوِيُّ', 'el-Kaviyy', 'Kudreti sonsuz olan'),
  e(54, 'اَلْمَت۪ينُ', 'el-Metîn', 'Çok sağlam, sarsılmaz'),
  e(55, 'اَلْوَلِيُّ', 'el-Veliyy', 'Dost olan, yardım eden'),
  e(56, 'اَلْحَم۪يدُ', 'el-Hamîd', 'Her türlü övgüye lâyık olan'),
  e(57, 'اَلْمُحْص۪ي', 'el-Muhsî', 'Her şeyi tek tek sayıp bilen'),
  e(58, 'اَلْمُبْدِئُ', 'el-Mübdi’', 'Yaratmayı ilk defa başlatan'),
  e(59, 'اَلْمُع۪يدُ', 'el-Muîd', 'Yaratmayı tekrarlayan'),
  e(60, 'اَلْمُحْي۪ي', 'el-Muhyî', 'Can veren, dirilten'),
  e(61, 'اَلْمُم۪يتُ', 'el-Mümît', 'Ölümü yaratan'),
  e(62, 'اَلْحَيُّ', 'el-Hayy', 'Ezelî ve ebedî diri olan'),
  e(63, 'اَلْقَيُّومُ', 'el-Kayyûm', 'Her şeyin varlığı kendisine bağlı olan'),
  e(64, 'اَلْوَاجِدُ', 'el-Vâcid', 'Dilediğini bulan, hiçbir şeye muhtaç olmayan'),
  e(65, 'اَلْمَاجِدُ', 'el-Mâcid', 'Şanı ve keremi büyük olan'),
  e(66, 'اَلْوَاحِدُ', 'el-Vâhid', 'Zâtında ve sıfatlarında tek olan'),
  e(67, 'اَلْأَحَدُ', 'el-Ehad', 'Bölünmez, eşi benzeri olmayan bir'),
  e(68, 'اَلصَّمَدُ', 'es-Samed', 'Her şey kendisine muhtaç, kendisi hiçbir şeye muhtaç olmayan'),
  e(69, 'اَلْقَادِرُ', 'el-Kâdir', 'Her şeye gücü yeten'),
  e(70, 'اَلْمُقْتَدِرُ', 'el-Muktedir', 'Kudretini dilediği gibi kullanan'),
  e(71, 'اَلْمُقَدِّمُ', 'el-Mukaddim', 'Dilediğini öne geçiren'),
  e(72, 'اَلْمُؤَخِّرُ', 'el-Muahhir', 'Dilediğini geriye bırakan'),
  e(73, 'اَلْأَوَّلُ', 'el-Evvel', 'Başlangıcı olmayan, ilk'),
  e(74, 'اَلْآخِرُ', 'el-Âhir', 'Sonu olmayan, son'),
  e(75, 'اَلظَّاهِرُ', 'ez-Zâhir', 'Varlığı apaçık olan'),
  e(76, 'اَلْبَاطِنُ', 'el-Bâtın', 'Zâtının mahiyeti kavranamayan'),
  e(77, 'اَلْوَال۪ي', 'el-Vâlî', 'Kâinatı yöneten'),
  e(78, 'اَلْمُتَعَال۪ي', 'el-Müteâlî', 'Aklın kavrayamayacağı kadar yüce'),
  e(79, 'اَلْبَرُّ', 'el-Berr', 'İyiliği ve ihsanı bol olan'),
  e(80, 'اَلتَّوَّابُ', 'et-Tevvâb', 'Tövbeleri çokça kabul eden'),
  e(81, 'اَلْمُنْتَقِمُ', 'el-Müntakim', 'Suçluları hak ettikleri şekilde cezalandıran'),
  e(82, 'اَلْعَفُوُّ', 'el-Afüvv', 'Çokça affeden, günahları silen'),
  e(83, 'اَلرَّؤُوفُ', 'er-Raûf', 'Çok şefkatli'),
  e(84, 'مَالِكُ الْمُلْكِ', 'Mâlikü’l-Mülk', 'Mülkün gerçek sahibi'),
  e(85, 'ذُو الْجَلَالِ وَالْإِكْرَامِ', 'Zü’l-Celâli ve’l-İkrâm', 'Celâl ve ikram sahibi'),
  e(86, 'اَلْمُقْسِطُ', 'el-Muksit', 'Adaletle hükmeden'),
  e(87, 'اَلْجَامِعُ', 'el-Câmi’', 'Toplayan, bir araya getiren'),
  e(88, 'اَلْغَنِيُّ', 'el-Ganiyy', 'Hiçbir şeye muhtaç olmayan'),
  e(89, 'اَلْمُغْن۪ي', 'el-Mugnî', 'Dilediğini zengin kılan'),
  e(90, 'اَلْمَانِعُ', 'el-Mâni’', 'Dilemediği şeyin olmasına izin vermeyen'),
  e(91, 'اَلضَّارُّ', 'ed-Dârr', 'Hikmeti gereği zarar verebilen'),
  e(92, 'اَلنَّافِعُ', 'en-Nâfi’', 'Fayda veren'),
  e(93, 'اَلنُّورُ', 'en-Nûr', 'Nur olan, aydınlatan'),
  e(94, 'اَلْهَاد۪ي', 'el-Hâdî', 'Doğru yola ileten'),
  e(95, 'اَلْبَد۪يعُ', 'el-Bedî’', 'Örneksiz, eşsiz yaratan'),
  e(96, 'اَلْبَاق۪ي', 'el-Bâkî', 'Varlığı sonsuz olan'),
  e(97, 'اَلْوَارِثُ', 'el-Vâris', 'Her şeyin gerçek sahibi olarak kalan'),
  e(98, 'اَلرَّش۪يدُ', 'er-Reşîd', 'Doğruya ulaştıran, irşad eden'),
  e(99, 'اَلصَّبُورُ', 'es-Sabûr', 'Çok sabırlı, cezada acele etmeyen')
];

/** Okunuş veya anlam içinde ara */
export function searchEsma(q) {
  const s = q.trim().toLocaleLowerCase('tr');
  if (s.length < 2) return [];
  return ESMA.filter((x) =>
    x.tr.toLocaleLowerCase('tr').includes(s) || x.mean.toLocaleLowerCase('tr').includes(s));
}

export const esmaByNo = (no) => ESMA.find((x) => x.no === no);
