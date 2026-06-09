import { MempelaDetail, AgendaEvent, LoveStory, GuestInviterGroup } from "./types";

export const mempelaiPria: MempelaDetail = {
  role: "pria",
  fullName: "Gian Nugraha",
  nickName: "Gian",
  photoUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800",
  fatherName: "Bapak Endang Sudrajat",
  motherName: "Ibu Siti Mariyam",
  instagram: "https://instagram.com/nugrahagiangn",
};

export const mempelaiWanita: MempelaDetail = {
  role: "wanita",
  fullName: "Cucu Rohimas",
  nickName: "Cucu",
  photoUrl: "url('/wedding/images/female.jpeg')?auto=format&fit=crop&q=80&w=800",
  fatherName: "Bapak - Pudin",
  motherName: "Ibu - Oyoh",
  instagram: "https://instagram.com/cucu_rohimas",
};

export const targetWeddingDate = "2026-05-14T08:00:00+07:00"; // Thursday, 14 May 2026 08:00 WIB

export const bcaAccount = {
  bankName: "Bank Central Asia (BCA)",
  name: "Gian Nugraha",
  number: "67-555-62860",
};

export const mandiriAccount = {
  bankName: "Bank Rakyat Indonesia (BRI)",
  name: "Cucu Rohimas",
  number: "002-5011-4135750-8",
};

export const giftAddress = {
  name: "Kediaman Mempelai Wanita",
  address: "Kp. Manguneng, Ds. Cihikeu, Kec. Bungbulang, Kab. Garut, Jawa Barat, 10310",
  receiver: "Bu Nelis / Cucu",
};

export const agendaAkad: AgendaEvent = {
  title: "Akad Nikah",
  dateStr: "Sabtu, 12 September 2026",
  timeStr: "08:00 - 10:00 WIB",
  locationName: "Masjid Agung Sunda Kelapa",
  address: "Kp. Manguneng, Ds. Cihikeu, Kec. Bungbulang, Kab. Garut, Jawa Barat, 10310",
  // mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m12!1m3!1d3966.4526019599554!2d106.83155797587844!3d-6.203871993783935!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f41764eb8cf3%3A0xc3f8e5b66d5b03bc!2sMasjid%20Agung%20Sunda%20Kelapa!5e0!3m2!1sid!2sid!4v1716380000000!5m2!1sid!2sid",
  // mapNavigationUrl: "https://maps.apple.com/?address=Masjid%20Agung%20Sunda%20Kelapa&ll=-6.203872,106.831558&q=Arah%20Lokasi",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.518608882937!2d107.6961136!3d-7.4646549!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e680df8374d898d%3A0x6e9f16e788bc11e6!2sBungbulang%2C%20Kabupaten%20Garut%2C%20Jawa%20Barat!5e0!3m2!1sid!2sid!4v1716380000000!5m2!1sid!2sid",
  mapNavigationUrl: "https://maps.google.com/?q=Bungbulang+Garut",
};

export const agendaResepsi: AgendaEvent = {
  title: "Resepsi Pernikahan",
  dateStr: "Kamis, 14 Mei 2026",
  timeStr: "08:00 - selesai WIB",
  locationName: "Rumah Kediaman Mempelai Wanita",
  address: "Kp. Manguneng, Ds. Cihikeu, Kec. Bungbulang, Kab. Garut, Jawa Barat, 10310",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.518608882937!2d107.6961136!3d-7.4646549!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e680df8374d898d%3A0x6e9f16e788bc11e6!2sBungbulang%2C%20Kabupaten%20Garut%2C%20Jawa%20Barat!5e0!3m2!1sid!2sid!4v1716380000000!5m2!1sid!2sid",
  mapNavigationUrl: "https://maps.google.com/?q=Bungbulang+Garut",
};

export const galleryImages = [
  {
    id: "g1",
    url: "url('/wedding/images/male.jpeg')?auto=format&fit=crop&q=80&w=800",
    caption: "Momen Kebersamaan",
  },
  {
    id: "g2",
    url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800",
    caption: "Buket Bunga Impian",
  },
  {
    id: "g3",
    url: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800",
    caption: "Simbol Ikatan Suci",
  },
  {
    id: "g4",
    url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800",
    caption: "Langkah Bersama",
  },
  {
    id: "g5",
    url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800",
    caption: "Pesta Keakraban",
  },
  {
    id: "g6",
    url: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=800",
    caption: "Kue Pernikahan Cantik",
  },
];

export const loveStories: LoveStory[] = [
  {
    id: "story-1",
    title: "Awal Pertemuan",
    dateStr: "Oktober 2020",
    description: "Tuhan menakdirkan pertemuan pertama kami secara tak sengaja. Bermula dari sebuah obrolan sederhana yang penuh canda tawa, ada secercah keyakinan kecil di lubuk hati bahwa kebersamaan ini tidak akan berlalu begitu saja.",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "story-2",
    title: "Menjalin Hubungan",
    dateStr: "Maret 2021",
    description: "Seiring berjalannya waktu, kami memutuskan untuk berkomitmen melangkah bersama. Melalui suka dan duka kehidupan, saling memahami segala kekurangan, dan menguatkan satu sama lain untuk menjadi pribadi yang lebih baik setiap harinya.",
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "story-3",
    title: "Momen Lamaran (Proposals)",
    dateStr: "Desember 2025",
    description: "Di hadapan kedua keluarga besar, kami mengikrarkan janji suci pertunangan. Langkah penuh keberanian untuk menyatukan visi, restu tulus orang tua menuntun kami menuju pintu gerbang yang mulia ini.",
    // imageUrl: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800"
    imageUrl: "url('/wedding/images/lm.jpeg')?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "story-4",
    title: "Pernikahan Suci",
    dateStr: "Mei 2026",
    description: "Hari bersejarah yang dinanti pun tiba. Dengan tulus ikhlas serta restu semesta, kami dipersatukan dalam ikatan pernikahan yang sah dan abadi. Lembaran baru petualangan cinta kami pun dimulai hari ini.",
    imageUrl: "https://images.unsplash.com/photo-1519225495810-7512c696505a?auto=format&fit=crop&q=80&w=800"
  }
];

export const turutMengundang: GuestInviterGroup[] = [
  {
    category: "Keluarga Besar Mempelai Pria",
    names: [
      "Bpk. H. Rahmat & Ibu Hj. Aminah (Kakek / Nenek)",
      "Bpk. Agus Sudrajat & Ibu Lilis (Uwak)",
      "Bpk. Tisna & Ibu Rina (Paman / Bibi)",
      "Sdr. Dedi, Dina & Dani (Kakak / Adik / Sepupu)",
    ]
  },
  {
    category: "Keluarga Besar Mempelai Wanita",
    names: [
      "Bpk. Abah Oyo & Ibu Mak Kokom (Kakek / Nenek)",
      "Bpk. H. Jajang & Ibu Hj. Imas (Paman / Bibi)",
      "Bpk. H. Mamat & Ibu Ceu Yuyun (Uwak)",
      "Sdr. Asep, Neng & Cecep (Kakak / Adik / Sepupu)",
    ]
  },
  {
    category: "Sahabat & Rekan Kerja",
    names: [
      "Teman-teman Alumni SMAN 1 Garut",
      "Keluarga Besar Komunitas IT & Programmer Garut",
      "Rekan Kerja dan Sahabat Dekat Kedua Mempelai"
    ]
  }
];


