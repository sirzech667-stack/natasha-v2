import { Novel, AppSettings } from '../types';

export const INITIAL_SETTINGS: AppSettings = {
  language: 'id',
  dailyGoalWords: 1500,
  todayWordsWritten: 450,
  lastGoalResetDate: new Date().toISOString().split('T')[0],
  activeNovelId: 'novel-lunarica-01',
  activeChapterId: 'chap-01',
  activeTab: 'dashboard',
  themeMode: 'light',
  fontSize: 16,
  lineHeight: 1.7,
  editorFont: 'sans',
};

export const INITIAL_NOVELS: Novel[] = [
  {
    id: 'novel-lunarica-01',
    title: 'Mahkota Bintang & Sang Penjaga Waktu',
    subtitle: 'Takdir Yang Terikat Di Atas Langit Celestia',
    author: 'Lunarica',
    genre: 'Fantasy Romance',
    tags: ['Fantasy', 'Time Travel', 'Magic', 'Royal'],
    status: 'ongoing',
    coverPreset: 'from-amber-500 via-purple-600 to-indigo-900',
    pinned: true,
    createdAt: Date.now() - 86400000 * 14,
    updatedAt: Date.now() - 3600000,
    synopsis: {
      shortSynopsis: 'Seorang gadis pembuat jam kuno menemukan bahwa detak jantungnya mampu memutar balik takdir kerajaan yang runtuh.',
      longSynopsis: 'Aria, seorang pengrajin jam misterius di pinggiran kota Oakhaven, tidak pernah menduga bahwa jam saku peninggalan kakeknya memuat fragmen Inti Celestia. Ketika Pangeran Kaelen terluka parah dalam pengkhianatan istana, Aria secara tidak sengaja memutar gerigi waktu dan menyelamatkannya. Kini, keduanya harus menjelajahi benua yang retak untuk mengumpulkan enam Mahkota Bintang sebelum gerhana abadi melenyapkan dunia.',
      hook: 'Detak jam saku tua itu bukan sekadar dentang mekanis, melainkan hitungan mundur runtuhnya takdir manusia.',
      conflict: 'Pengkhianatan Dewan Pengawal Waktu dan perebutan enam Fragmen Mahkota Bintang oleh Sang Pemakan Bayangan.',
      climax: 'Pilihan mustahil antara mengorbankan ingatan masa lalu Kaelen atau membiarkan Inti Celestia hancur selamanya.',
      resolution: 'Aria dan Kaelen menyatukan pecahan Mahkota Bintang dan membuka era baru kedamaian Celestia.',
    },
    volumes: [
      {
        id: 'vol-01',
        title: 'Volume 1: Gerigi Oakhaven',
        order: 1,
        description: 'Awal mula pertemuan Aria dan Kaelen di kota Oakhaven.',
      },
      {
        id: 'vol-02',
        title: 'Volume 2: Lembah Kabut Celestia',
        order: 2,
        description: 'Perjalanan mencari Fragmen Bintang Kedua di benteng kuno.',
      }
    ],
    chapters: [
      {
        id: 'chap-01',
        volumeId: 'vol-01',
        order: 1,
        title: 'Bab 1: Dentang Jam Saku Tua',
        status: 'final',
        updatedAt: Date.now() - 3600000 * 2,
        wordCount: 420,
        content: `Hujan turun deras menimpa atap seng toko jam tua milik Aria. Bau minyak mesin pelumas dan kayu jati kering memenuhi ruangan sempit itu. Di atas meja kerja bertabur gerigi tembaga, gadis berambut emas itu dengan teliti memasang pegas utama pada sebuah jam saku kuno.

"Satu putaran lagi..." bisik Aria pelan pada dirinya sendiri.

Klek.

Suara dentang halus terdengar dari dalam jam saku peninggalan kakeknya. Namun alih-alih berdetak searah jarum jam, jarum detik jam itu tiba-tiba berputar secara berlawanan arah. Cahaya kebiruan menyembur pelan dari celah angka romawi di permukaannya.

Tiba-tiba, pintu toko terbuka keras! Seorang pria berjubah hitam dengan luka mengucur di dada kirinya jatuh tersungkur di lantai kayu toko Aria. Di tangannya, ia menggenggam sebuah lambang kerajaan bercorak naga bintang.

Pangeran Kaelen telah tiba, dan waktu di Oakhaven tidak akan pernah sama lagi.`,
        history: [
          {
            id: 'v1-01',
            timestamp: Date.now() - 86400000,
            content: `Hujan turun deras menimpa atap seng toko jam tua milik Aria... [Draft Awal]`,
            wordCount: 120,
            note: 'Draft pertama bab 1',
          }
        ]
      },
      {
        id: 'chap-02',
        volumeId: 'vol-01',
        order: 2,
        title: 'Bab 2: Rahasia Inti Celestia',
        status: 'draft',
        updatedAt: Date.now() - 1800000,
        wordCount: 280,
        content: `Aria tersentak. Tangannya gemetar saat mengusap darah di dahi pria asing yang pingsan di hadapannya.

"Siapa kau... dan mengapa kau membawa lambang Istana Utama?" gumam Aria.

Ketika Aria menyentuh dada pria itu, jam saku di mejanya berdentang kencang. Cahaya kebiruan membungkus luka di dada Kaelen, merapatkan kembali daging yang terobek secara ajaib. Waktu di sekitar luka itu diputar mundur sepuluh menit!

Kaelen membuka matanya, manik matanya yang berwarna perak menatap Aria dengan keterkejutan mendalam.

"Kau... Sang Pemegang Gerigi Waktu?" desis Kaelen dengan suara parau.`,
        history: []
      }
    ],
    characters: [
      {
        id: 'char-01',
        name: 'Aria Vance',
        role: 'protagonist',
        age: '19 tahun',
        gender: 'Perempuan',
        personality: 'Cerdas, teliti, berani, sedikit keras kepala namun memiliki kepedulian yang tinggi.',
        backstory: 'Dibesarkan oleh kakeknya yang merupakan ahli mesin rahasia Kerajaan Celestia yang diasingkan.',
        goals: 'Mengungkap misteri kematian kakeknya dan melindungi jam saku ajaib peninggalan keluarga.',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      },
      {
        id: 'char-02',
        name: 'Pangeran Kaelen Celestia',
        role: 'antagonist',
        age: '22 tahun',
        gender: 'Laki-laki',
        personality: 'Waspada, dingin di luar namun memiliki rasa keadilan yang tinggi. Penguasa pedang bayangan.',
        backstory: 'Pangeran mahkota yang dikhianati oleh penasihat utamanya sendiri dan diburu hingga ke batas kota.',
        goals: 'Rebut kembali tahta Celestia dan bersihkan istana dari pengaruh sihir hitam Pemakan Bayangan.',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      }
    ],
    worldItems: [
      {
        id: 'world-01',
        name: 'Kota Oakhaven',
        category: 'location',
        description: 'Kota pinggiran berarsitektur steampunk klasik yang terkenal dengan bengkel kayu dan pengerjaan jam.',
        details: 'Dikelilingi hutan kabut tua yang dipenuhi oleh mahluk ilusi kuno.',
      },
      {
        id: 'world-02',
        name: 'Jam Saku Inti Celestia',
        category: 'item',
        description: 'Jam saku mekanis buatan Kakek Vance yang dapat menghentikan dan memutar balik waktu lokal.',
        details: 'Hanya bereaksi terhadap denyut nadi keturunan darah Vance.',
      }
    ],
    ideas: [
      {
        id: 'idea-01',
        title: 'Plot Twist Bab 10: Pengkhianatan Penasihat',
        content: 'Penasihat istana ternyata bukan dikendalikan sihir hitam, tetapi ia adalah pemilik asli salah satu Fragmen Bintang!',
        category: 'plot_twist',
        pinned: true,
        createdAt: Date.now() - 43200000,
      },
      {
        id: 'idea-02',
        title: 'Dialog Romantis di Atas Menara Oakhaven',
        content: '"Jika waktu bisa kuhentikan, aku ingin menghentikannya saat kau tersenyum di bawah bintang ini, Aria."',
        category: 'dialogue',
        pinned: false,
        createdAt: Date.now() - 20000000,
      }
    ]
  },
  {
    id: 'novel-lunarica-02',
    title: 'Cyberpunk Redefinement 2099',
    subtitle: 'Sinyal Terakhir di Atas Neon Neo-Jakarta',
    author: 'Lunarica',
    genre: 'Sci-Fi / Cyberpunk',
    tags: ['Sci-Fi', 'Hacker', 'Futuristic', 'Action'],
    status: 'draft',
    coverPreset: 'from-cyan-600 via-blue-700 to-slate-900',
    pinned: false,
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 86400000,
    synopsis: {
      shortSynopsis: 'Seorang peretas muda menemukan AI terlarang yang menyimpan ingatan kota yang terhapus.',
      longSynopsis: 'Di bawah kilatan lampu neon Neo-Jakarta tahun 2099, Rayden hidup sebagai peretas data memori. Ketika ia meretas mainframe korporasi AstraCorp, ia tidak sengaja mengunduh file AI independen bernama NATASHA yang mengaku dapat mengembalikan kesadaran manusia.',
      hook: 'Di kota tempat ingatan dijual-belikan, satu-satunya kebenaran adalah kode yang belum terhapus.',
      conflict: 'Membongkar konspirasi AstraCorp sebelum chip ingatan Rayden dihapus secara jarak jauh.',
      climax: 'Penginjeksian virus Natasha ke menara pusat kota.',
      resolution: 'Kesadaran gratis dibagikan ke seluruh penduduk Neo-Jakarta.',
    },
    volumes: [],
    chapters: [
      {
        id: 'chap-c1',
        order: 1,
        title: 'Bab 1: Lampu Neon Dan Hujan Asam',
        status: 'draft',
        updatedAt: Date.now() - 86400000,
        wordCount: 150,
        content: 'Lampu neon berwarna magenta memantul di genangan air hujan asam distrik 4. Rayden membetulkan letak kaca mata sibernetiknya.',
        history: []
      }
    ],
    characters: [],
    worldItems: [],
    ideas: []
  }
];

