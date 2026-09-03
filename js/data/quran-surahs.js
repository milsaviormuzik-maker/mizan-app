/* ============================================================
   MİZAN — Sure fihristi (114) ve cüz haritası
   [no, Arapça ad, Türkçe ad, anlamı, ayet sayısı, iniş yeri]
   ============================================================ */

const RAW = [
  [1, 'الفاتحة', 'Fâtiha', 'Açılış', 7, 'Mekke'],
  [2, 'البقرة', 'Bakara', 'İnek', 286, 'Medine'],
  [3, 'آل عمران', 'Âl-i İmrân', 'İmrân Ailesi', 200, 'Medine'],
  [4, 'النساء', 'Nisâ', 'Kadınlar', 176, 'Medine'],
  [5, 'المائدة', 'Mâide', 'Sofra', 120, 'Medine'],
  [6, 'الأنعام', 'En’âm', 'Davarlar', 165, 'Mekke'],
  [7, 'الأعراف', 'A’râf', 'Yüksek Yerler', 206, 'Mekke'],
  [8, 'الأنفال', 'Enfâl', 'Ganimetler', 75, 'Medine'],
  [9, 'التوبة', 'Tevbe', 'Tövbe', 129, 'Medine'],
  [10, 'يونس', 'Yûnus', 'Yûnus', 109, 'Mekke'],
  [11, 'هود', 'Hûd', 'Hûd', 123, 'Mekke'],
  [12, 'يوسف', 'Yûsuf', 'Yûsuf', 111, 'Mekke'],
  [13, 'الرعد', 'Ra’d', 'Gök Gürültüsü', 43, 'Medine'],
  [14, 'إبراهيم', 'İbrâhîm', 'İbrâhîm', 52, 'Mekke'],
  [15, 'الحجر', 'Hicr', 'Hicr Vadisi', 99, 'Mekke'],
  [16, 'النحل', 'Nahl', 'Arı', 128, 'Mekke'],
  [17, 'الإسراء', 'İsrâ', 'Gece Yürüyüşü', 111, 'Mekke'],
  [18, 'الكهف', 'Kehf', 'Mağara', 110, 'Mekke'],
  [19, 'مريم', 'Meryem', 'Meryem', 98, 'Mekke'],
  [20, 'طه', 'Tâhâ', 'Tâhâ', 135, 'Mekke'],
  [21, 'الأنبياء', 'Enbiyâ', 'Peygamberler', 112, 'Mekke'],
  [22, 'الحج', 'Hac', 'Hac', 78, 'Medine'],
  [23, 'المؤمنون', 'Mü’minûn', 'İnananlar', 118, 'Mekke'],
  [24, 'النور', 'Nûr', 'Işık', 64, 'Medine'],
  [25, 'الفرقان', 'Furkân', 'Ayırt Edici', 77, 'Mekke'],
  [26, 'الشعراء', 'Şuarâ', 'Şairler', 227, 'Mekke'],
  [27, 'النمل', 'Neml', 'Karınca', 93, 'Mekke'],
  [28, 'القصص', 'Kasas', 'Kıssalar', 88, 'Mekke'],
  [29, 'العنكبوت', 'Ankebût', 'Örümcek', 69, 'Mekke'],
  [30, 'الروم', 'Rûm', 'Romalılar', 60, 'Mekke'],
  [31, 'لقمان', 'Lokmân', 'Lokmân', 34, 'Mekke'],
  [32, 'السجدة', 'Secde', 'Secde', 30, 'Mekke'],
  [33, 'الأحزاب', 'Ahzâb', 'Birleşik Ordular', 73, 'Medine'],
  [34, 'سبأ', 'Sebe’', 'Sebe', 54, 'Mekke'],
  [35, 'فاطر', 'Fâtır', 'Yoktan Yaratan', 45, 'Mekke'],
  [36, 'يس', 'Yâsîn', 'Yâsîn', 83, 'Mekke'],
  [37, 'الصافات', 'Sâffât', 'Saf Tutanlar', 182, 'Mekke'],
  [38, 'ص', 'Sâd', 'Sâd', 88, 'Mekke'],
  [39, 'الزمر', 'Zümer', 'Topluluklar', 75, 'Mekke'],
  [40, 'غافر', 'Mü’min', 'Bağışlayan', 85, 'Mekke'],
  [41, 'فصلت', 'Fussilet', 'Ayrıntılı Kılındı', 54, 'Mekke'],
  [42, 'الشورى', 'Şûrâ', 'Danışma', 53, 'Mekke'],
  [43, 'الزخرف', 'Zuhruf', 'Süs', 89, 'Mekke'],
  [44, 'الدخان', 'Duhân', 'Duman', 59, 'Mekke'],
  [45, 'الجاثية', 'Câsiye', 'Diz Çöken', 37, 'Mekke'],
  [46, 'الأحقاف', 'Ahkâf', 'Kum Tepeleri', 35, 'Mekke'],
  [47, 'محمد', 'Muhammed', 'Muhammed', 38, 'Medine'],
  [48, 'الفتح', 'Fetih', 'Fetih', 29, 'Medine'],
  [49, 'الحجرات', 'Hucurât', 'Odalar', 18, 'Medine'],
  [50, 'ق', 'Kâf', 'Kâf', 45, 'Mekke'],
  [51, 'الذاريات', 'Zâriyât', 'Savuranlar', 60, 'Mekke'],
  [52, 'الطور', 'Tûr', 'Tûr Dağı', 49, 'Mekke'],
  [53, 'النجم', 'Necm', 'Yıldız', 62, 'Mekke'],
  [54, 'القمر', 'Kamer', 'Ay', 55, 'Mekke'],
  [55, 'الرحمن', 'Rahmân', 'Rahmân', 78, 'Medine'],
  [56, 'الواقعة', 'Vâkıa', 'Gerçekleşecek Olan', 96, 'Mekke'],
  [57, 'الحديد', 'Hadîd', 'Demir', 29, 'Medine'],
  [58, 'المجادلة', 'Mücâdele', 'Tartışan Kadın', 22, 'Medine'],
  [59, 'الحشر', 'Haşr', 'Toplanma', 24, 'Medine'],
  [60, 'الممتحنة', 'Mümtehine', 'İmtihan Edilen', 13, 'Medine'],
  [61, 'الصف', 'Saff', 'Saf', 14, 'Medine'],
  [62, 'الجمعة', 'Cum’a', 'Cuma', 11, 'Medine'],
  [63, 'المنافقون', 'Münâfikûn', 'İkiyüzlüler', 11, 'Medine'],
  [64, 'التغابن', 'Tegâbün', 'Aldanış', 18, 'Medine'],
  [65, 'الطلاق', 'Talâk', 'Boşanma', 12, 'Medine'],
  [66, 'التحريم', 'Tahrîm', 'Yasaklama', 12, 'Medine'],
  [67, 'الملك', 'Mülk', 'Egemenlik', 30, 'Mekke'],
  [68, 'القلم', 'Kalem', 'Kalem', 52, 'Mekke'],
  [69, 'الحاقة', 'Hâkka', 'Gerçekleşecek', 52, 'Mekke'],
  [70, 'المعارج', 'Meâric', 'Yükselme Yolları', 44, 'Mekke'],
  [71, 'نوح', 'Nûh', 'Nûh', 28, 'Mekke'],
  [72, 'الجن', 'Cin', 'Cinler', 28, 'Mekke'],
  [73, 'المزمل', 'Müzzemmil', 'Örtünüp Bürünen', 20, 'Mekke'],
  [74, 'المدثر', 'Müddessir', 'Bürünen', 56, 'Mekke'],
  [75, 'القيامة', 'Kıyâme', 'Kıyamet', 40, 'Mekke'],
  [76, 'الإنسان', 'İnsân', 'İnsan', 31, 'Medine'],
  [77, 'المرسلات', 'Mürselât', 'Gönderilenler', 50, 'Mekke'],
  [78, 'النبأ', 'Nebe’', 'Haber', 40, 'Mekke'],
  [79, 'النازعات', 'Nâziât', 'Söküp Çıkaranlar', 46, 'Mekke'],
  [80, 'عبس', 'Abese', 'Yüzünü Ekşitti', 42, 'Mekke'],
  [81, 'التكوير', 'Tekvîr', 'Dürülme', 29, 'Mekke'],
  [82, 'الانفطار', 'İnfitâr', 'Yarılma', 19, 'Mekke'],
  [83, 'المطففين', 'Mutaffifîn', 'Ölçüde Hile Yapanlar', 36, 'Mekke'],
  [84, 'الانشقاق', 'İnşikâk', 'Yarılma', 25, 'Mekke'],
  [85, 'البروج', 'Bürûc', 'Burçlar', 22, 'Mekke'],
  [86, 'الطارق', 'Târık', 'Gece Gelen', 17, 'Mekke'],
  [87, 'الأعلى', 'A’lâ', 'En Yüce', 19, 'Mekke'],
  [88, 'الغاشية', 'Gâşiye', 'Kaplayan', 26, 'Mekke'],
  [89, 'الفجر', 'Fecr', 'Şafak', 30, 'Mekke'],
  [90, 'البلد', 'Beled', 'Şehir', 20, 'Mekke'],
  [91, 'الشمس', 'Şems', 'Güneş', 15, 'Mekke'],
  [92, 'الليل', 'Leyl', 'Gece', 21, 'Mekke'],
  [93, 'الضحى', 'Duhâ', 'Kuşluk Vakti', 11, 'Mekke'],
  [94, 'الشرح', 'İnşirâh', 'Ferahlatma', 8, 'Mekke'],
  [95, 'التين', 'Tîn', 'İncir', 8, 'Mekke'],
  [96, 'العلق', 'Alak', 'Asılıp Tutunan', 19, 'Mekke'],
  [97, 'القدر', 'Kadr', 'Kadir Gecesi', 5, 'Mekke'],
  [98, 'البينة', 'Beyyine', 'Apaçık Delil', 8, 'Medine'],
  [99, 'الزلزلة', 'Zilzâl', 'Sarsıntı', 8, 'Medine'],
  [100, 'العاديات', 'Âdiyât', 'Koşan Atlar', 11, 'Mekke'],
  [101, 'القارعة', 'Kâria', 'Çarpacak Olan', 11, 'Mekke'],
  [102, 'التكاثر', 'Tekâsür', 'Çoklukla Övünme', 8, 'Mekke'],
  [103, 'العصر', 'Asr', 'Zaman', 3, 'Mekke'],
  [104, 'الهمزة', 'Hümeze', 'Çekiştiren', 9, 'Mekke'],
  [105, 'الفيل', 'Fîl', 'Fil', 5, 'Mekke'],
  [106, 'قريش', 'Kureyş', 'Kureyş', 4, 'Mekke'],
  [107, 'الماعون', 'Mâûn', 'Yardımlaşma', 7, 'Mekke'],
  [108, 'الكوثر', 'Kevser', 'Kevser', 3, 'Mekke'],
  [109, 'الكافرون', 'Kâfirûn', 'İnkârcılar', 6, 'Mekke'],
  [110, 'النصر', 'Nasr', 'Yardım', 3, 'Medine'],
  [111, 'المسد', 'Tebbet', 'Bükülmüş İp', 5, 'Mekke'],
  [112, 'الإخلاص', 'İhlâs', 'Saf İnanç', 4, 'Mekke'],
  [113, 'الفلق', 'Felak', 'Ağaran Sabah', 5, 'Mekke'],
  [114, 'الناس', 'Nâs', 'İnsanlar', 6, 'Mekke']
];

export const SURAHS = RAW.map(([no, ar, tr, meaning, ayahs, type]) => ({
  no, ar, tr, meaning, ayahs, type
}));

export const surahByNo = (no) => SURAHS[no - 1];
export const surahName = (no) => SURAHS[no - 1]?.tr ?? '';

/* ------------------------------------------------------------
   Cüz haritası — her cüzün başladığı sure:ayet
   ------------------------------------------------------------ */
const JUZ_START = [
  [1, 1], [2, 142], [2, 253], [3, 92], [4, 24], [4, 148], [5, 82], [6, 111],
  [7, 88], [8, 41], [9, 93], [11, 6], [12, 53], [15, 1], [17, 1], [18, 75],
  [21, 1], [23, 1], [25, 21], [27, 56], [29, 46], [33, 31], [36, 28], [39, 32],
  [41, 47], [46, 1], [51, 31], [58, 1], [67, 1], [78, 1]
];

export const JUZ = JUZ_START.map(([s, a], i) => {
  const nextStart = JUZ_START[i + 1];
  const endSurah = nextStart ? nextStart[0] : 114;
  return {
    no: i + 1,
    start: { surah: s, ayah: a },
    startLabel: `${surahName(s)} ${a}`,
    range: nextStart
      ? `${surahName(s)} – ${surahName(nextStart[1] === 1 ? endSurah - 1 : endSurah)}`
      : `${surahName(s)} – ${surahName(114)}`
  };
});

/** Bir ayetin hangi cüzde olduğunu bulur */
export function juzOf(surah, ayah) {
  let n = 1;
  for (let i = 0; i < JUZ_START.length; i++) {
    const [s, a] = JUZ_START[i];
    if (surah > s || (surah === s && ayah >= a)) n = i + 1; else break;
  }
  return n;
}

/* ------------------------------------------------------------
   Meal ve hafız seçenekleri
   ------------------------------------------------------------ */
export const MEALS = [
  { id: 'diyanet', name: 'Diyanet İşleri Meali', sub: 'Kurul · 2011', free: true },
  { id: 'diyanet-yeni', name: 'Diyanet Vakfı Meali', sub: 'Kurul', free: true },
  { id: 'elmalili', name: 'Elmalılı Hamdi Yazır', sub: 'Sadeleştirilmiş', free: true },
  { id: 'yazir-orj', name: 'Elmalılı — Orijinal', sub: '1935 metni', free: false },
  { id: 'ozturk', name: 'Yaşar Nuri Öztürk', sub: 'Kur’an-ı Kerim Meali', free: false },
  { id: 'golpinarli', name: 'Abdülbaki Gölpınarlı', sub: 'Kur’an-ı Kerim Meali', free: false }
];

/* ------------------------------------------------------------
   SES KAYNAKLARI
   İki bağımsız arşiv tutulur. Biri erişilemezse (ağ, filtre, kesinti)
   oynatıcı sessizce diğerine geçer — tek kaynağa bağlı kalmak, sesin
   kullanıcıya göre "bazen çalışıp bazen çalışmaması" demekti.

   · Birincil: sûre+âyet numarasıyla adreslenir  →  {folder}/{sss}{aaa}.mp3
   · Yedek:    küresel âyet numarasıyla adreslenir →  {slug}/{n}.mp3
   ------------------------------------------------------------ */
export const AUDIO_PRIMARY = 'https://everyayah.com/data';
export const AUDIO_FALLBACK = 'https://cdn.islamic.network/quran/audio/128';

export const RECITERS = [
  { id: 'alafasy', name: 'Mishary Râşid el-Afâsî', sub: 'Murattal', free: true, folder: 'Alafasy_128kbps', slug: 'ar.alafasy' },
  { id: 'husary', name: 'Mahmûd Halîl el-Husarî', sub: 'Murattal · Muallim', free: true, folder: 'Husary_128kbps', slug: 'ar.husary' },
  { id: 'abdulbasit', name: 'Abdülbâsit Abdüssamed', sub: 'Murattal', free: true, folder: 'Abdul_Basit_Murattal_192kbps', slug: null },
  { id: 'sudais', name: 'Abdurrahman es-Sudeys', sub: 'Mescid-i Haram', free: false, folder: 'Abdurrahmaan_As-Sudais_192kbps', slug: null },
  { id: 'shatri', name: 'Ebû Bekr eş-Şâtirî', sub: 'Murattal', free: false, folder: 'Abu_Bakr_Ash-Shaatree_128kbps', slug: 'ar.shaatree' },
  { id: 'minshawi', name: 'Muhammed Sıddîk el-Minşâvî', sub: 'Mücevved', free: false, folder: 'Minshawy_Mujawwad_192kbps', slug: 'ar.minshawi' },
  { id: 'muaiqly', name: 'Mâhir el-Muaykılî', sub: 'Mescid-i Haram', free: false, folder: null, slug: 'ar.mahermuaiqly' }
];

/** Küresel âyet numarası (1–6236) — yedek arşiv bununla adresler */
const CUMULATIVE = (() => {
  const out = [0];
  for (let i = 0; i < SURAHS.length; i++) out.push(out[i] + SURAHS[i].ayahs);
  return out;
})();

export const globalAyahNo = (surah, ayah) => CUMULATIVE[surah - 1] + ayah;

/** Bir âyet için denenecek ses adresleri, sırayla */
export function ayahAudioSources(surah, ayah, reciterId) {
  const r = RECITERS.find((x) => x.id === reciterId) ?? RECITERS[0];
  const s = String(surah).padStart(3, '0');
  const a = String(ayah).padStart(3, '0');
  const urls = [];
  if (r.folder) urls.push(`${AUDIO_PRIMARY}/${r.folder}/${s}${a}.mp3`);
  if (r.slug) urls.push(`${AUDIO_FALLBACK}/${r.slug}/${globalAyahNo(surah, ayah)}.mp3`);
  return urls;
}

/** İlk (tercih edilen) adres — tek parça çalma için */
export const ayahAudioUrl = (surah, ayah, reciterId) =>
  ayahAudioSources(surah, ayah, reciterId)[0];

export const ARABIC_FONTS = [
  { id: 'uthmani', name: 'Osmanî Hat', sub: 'Medine Mushafı esaslı', stack: '"Amiri Quran", "Amiri", serif' },
  { id: 'naskh', name: 'Nesih', sub: 'Klasik nesih', stack: '"Scheherazade New", "Amiri", serif' },
  { id: 'indopak', name: 'Hint-Pak', sub: 'Güney Asya mushafı', stack: '"Noto Nastaliq Urdu", "Amiri", serif' }
];
