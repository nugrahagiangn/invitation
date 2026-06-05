// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "motion/react";
// import { 
//   Lock, Unlock, Sliders, Trash2, Copy, Check, Share2, Search, Users, 
//   CheckCircle, HelpCircle, XCircle, Music, Volume2, Save, FileText, 
//   ExternalLink, Key, RefreshCw, X, Download 
// } from "lucide-react";
// import { GuestbookEntry } from "../types";
// import { copyToClipboard, getApiUrl } from "../utils";

// interface AdminPanelProps {
//   onClose: () => void;
//   onMusicChanged: (newUrl: string, newTitle: string) => void;
//   currentSongUrl: string;
//   currentSongTitle: string;
//   onRefreshData?: () => void;
// }

// export default function AdminPanel({ 
//   onClose, 
//   onMusicChanged, 
//   currentSongUrl, 
//   currentSongTitle,
//   onRefreshData 
// }: AdminPanelProps) {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [passcode, setPasscode] = useState("");
//   const [errorMsg, setErrorMsg] = useState("");
  
//   // Data State
//   const [entries, setEntries] = useState<GuestbookEntry[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filterRsvp, setFilterRsvp] = useState<string>("all"); // all, hadir, ragu, absen
  
//   // Music config state
//   const [songUrl, setSongUrl] = useState(currentSongUrl);
//   const [songTitle, setSongTitle] = useState(currentSongTitle);
//   const [musicSaving, setMusicSaving] = useState(false);
//   const [musicSuccess, setMusicSuccess] = useState(false);
//   const [testPlaying, setTestPlaying] = useState(false);
//   const [testAudio, setTestAudio] = useState<HTMLAudioElement | null>(null);

//   // Invitation Link Generator state
//   const [guestName, setGuestName] = useState("");
//   const [relation, setRelation] = useState("Teman");
//   const [templateIndex, setTemplateIndex] = useState(0);
//   const [copiedLink, setCopiedLink] = useState(false);
//   const [copiedWA, setCopiedWA] = useState(false);

//   // Preset background songs list
//   const musicPresets = [
//     {
//       title: "Lagu Utama Undangan (music.mp3)",
//       url: "/music.mp3"
//     },
//     {
//       title: "Bruno Mars - Just The Way You Are",
//       url: "https://archive.org/download/bruno-mars-all-songs/01%20-%20Just%20The%20Way%20You%20Are.mp3"
//     },
//     {
//       title: "Bruno Mars - Marry You",
//       url: "https://archive.org/download/bruno-mars-all-songs/03%20-%20Marry%20You.mp3"
//     },
//     {
//       title: "Beautiful Wedding Piano (Royalty Free Preset)",
//       url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
//     },
//     {
//       title: "Soft Acoustic Guitar Romance (Royalty Free Preset)",
//       url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
//     }
//   ];

//   // Templates for WhatsApp invite messages in Indonesia
//   const messageTemplates = [
//     {
//       name: "Formal Muslim (Akad & Resepsi)",
//       text: (name: string, url: string) => 
// `Assalamu'alaikum Wr. Wb.

// Yth. *${name}*,

// Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri dan memberikan doa restu pada hari bahagia pernikahan kami, Gian & Cucu.

// Berikut adalah detail undangan digital kami:
// 🔗 ${url}

// Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir di hari istimewa kami.

// Terima kasih atas perhatiannya.
// Wassalamu'alaikum Wr. Wb.
// — Gian & Cucu`
//     },
//     {
//       name: "Formal Umum (Nasional/Internasional)",
//       text: (name: string, url: string) => 
// `Kepada Yth. Bapak/Ibu/Saudara/i *${name}*,

// Dengan penuh rasa hormat dan kebahagiaan, kami mengundang Anda untuk menghadiri perayaan pernikahan kami, Gian Nugraha & Cucu Rohimas.

// Detail informasi acara serta konfirmasi RSVP dapat Anda klik melalui tautan undangan digital di bawah ini:
// 🔗 ${url}

// Kehadiran serta doa restu Anda di hari bahagia kami akan sangat melengkapi momen sakral ini.

// Salam hangat penuh kasih,
// — Gian & Cucu`
//     },
//     {
//       name: "Krabat Dekat / Sahabat (Casual)",
//       text: (name: string, url: string) => 
// `Halo *${name}*!

// Semoga kabar sehat selalu ya. Nggak terasa hari pernikahan aku & pasangan udah dekat. Tanpa mengurangi rasa hormat, melalui pesan ini kami mengundang kamu untuk hadir dan merayakan hari bahagia kami.

// Yuk check tautan undangan digital resmi kami di bawah ini untuk melihat jadwal & lokasi pesta:
// 🔗 ${url}

// Oya, kamu juga bisa tulis doa/ucapan serta isi konfirmasi kedatangan di bagian Buku Tamu / RSVP websitenya ya!

// Sampai ketemu di pesta nanti!
// — Gian & Cucu`
//     }
//   ];

//   // Fetch guestbook list
//   const fetchGuestbook = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(getApiUrl("/api/guestbook"));
//       if (res.ok) {
//         const data = await res.json();
//         setEntries(data);
//       } else {
//         throw new Error("Backend non-OK status");
//       }
//     } catch (err) {
//       console.error("Gagal memuat daftar tamu dari backend:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (isAuthenticated) {
//       fetchGuestbook();
//     }
//     return () => {
//       if (testAudio) {
//         testAudio.pause();
//       }
//     };
//   }, [isAuthenticated]);

//   const handleLogin = (e: React.FormEvent) => {
//     e.preventDefault();
//     // Simple secure password: May 14, 2026 is Gian-Cucu wedding -> 140526, or "admin"
//     if (passcode.trim() === "140526" || passcode.toLowerCase() === "admin") {
//       setIsAuthenticated(true);
//       setErrorMsg("");
//     } else {
//       setErrorMsg("Kode PIN salah. Tips: Gunakan tanggal nikah pengantin (140526) atau kata sandi 'admin'.");
//     }
//   };

//   const handleDeleteEntry = async (id: string, name: string) => {
//     if (!window.confirm(`Apakah Anda yakin ingin menghapus ucapan dari "${name}"?`)) {
//       return;
//     }

//     try {
//       const res = await fetch(getApiUrl(`/api/guestbook/${id}`), {
//         method: "DELETE"
//       });
//       if (res.ok) {
//         // Remove locally
//         setEntries(prev => prev.filter(entry => entry.id !== id));
//         if (onRefreshData) onRefreshData();
//       } else {
//         throw new Error("Gagal menghapus.");
//       }
//     } catch (err) {
//       console.error("Gagal menghapus via server:", err);
//       alert("Gagal menghapus ucapan dari database. Silakakan periksa jaringan Anda.");
//     }
//   };

//   const handleSaveMusic = async () => {
//     if (!songUrl.trim() || !songTitle.trim()) {
//       alert("Harap lengkapi URL dan judul lagu.");
//       return;
//     }

//     setMusicSaving(true);
//     setMusicSuccess(false);
//     try {
//       const res = await fetch(getApiUrl("/api/settings"), {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           activeSongUrl: songUrl.trim(),
//           activeSongTitle: songTitle.trim()
//         })
//       });
//       if (res.ok) {
//         onMusicChanged(songUrl.trim(), songTitle.trim());
//         setMusicSuccess(true);
//         setTimeout(() => setMusicSuccess(false), 4500);
//       } else {
//         throw new Error("Gagal menyimpan lagu.");
//       }
//     } catch (err: any) {
//       console.error("Gagal menyimpan musik ke database:", err);
//       alert(`Gagal menyimpan konfigurasi musik ke database: ${err.message}`);
//     } finally {
//       setMusicSaving(false);
//     }
//   };

//   const triggerTestPlay = () => {
//     if (testPlaying) {
//       if (testAudio) {
//         testAudio.pause();
//       }
//       setTestPlaying(false);
//     } else {
//       let resolvedUrl = songUrl;
//       const isStaticHost = 
//         window.location.hostname.endsWith(".github.io") || 
//         window.location.hostname.includes("github.io") || 
//         (!window.location.port && window.location.hostname !== "localhost");

//       if (isStaticHost) {
//         if (songUrl.startsWith("/api/music.mp3") || songUrl.includes("/api/music.mp3")) {
//           resolvedUrl = "https://archive.org/download/bruno-mars-all-songs/01%20-%20Just%20The%20Way%20You%20Are.mp3";
//         }
//       }

//       const newAudio = new Audio(resolvedUrl);
//       newAudio.volume = 0.5;
//       newAudio.play()
//         .then(() => {
//           setTestAudio(newAudio);
//           setTestPlaying(true);
//           newAudio.onended = () => setTestPlaying(false);
//         })
//         .catch(err => {
//           alert("Gagal memutar audio preset ini. Mohon pastikan link berkas audio .mp3 valid dan mendukung CORS.");
//         });
//     }
//   };

//   // Dynamically constructed invite URL
//   const getInviteUrl = () => {
//     const origin = window.location.origin;
//     if (!guestName.trim()) return origin;
//     const cleanName = encodeURIComponent(guestName.trim());
//     return `${origin}/?to=${cleanName}`;
//   };

//   const getWaText = () => {
//     const inviteUrl = getInviteUrl();
//     const formattedName = guestName.trim() || "[Nama Tamu]";
//     return messageTemplates[templateIndex].text(formattedName, inviteUrl);
//   };

//   const handleCopyLink = () => {
//     copyToClipboard(getInviteUrl(), () => {
//       setCopiedLink(true);
//       setTimeout(() => setCopiedLink(false), 2000);
//     });
//   };

//   const handleCopyWAText = () => {
//     copyToClipboard(getWaText(), () => {
//       setCopiedWA(true);
//       setTimeout(() => setCopiedWA(false), 2000);
//     });
//   };

//   const handleShareWa = () => {
//     const text = encodeURIComponent(getWaText());
//     const waUrl = `https://api.whatsapp.com/send?text=${text}`;
//     window.open(waUrl, "_blank");
//   };

//   // Calculate RSVPs stats
//   const totalRsvpResponses = entries.length;
//   const attendingGuests = entries.filter(e => e.rsvpHadir === "hadir").reduce((sum, current) => sum + current.countGuests, 0);
//   const attendingCount = entries.filter(e => e.rsvpHadir === "hadir").length;
//   const unsureCount = entries.filter(e => e.rsvpHadir === "ragu").length;
//   const absentCount = entries.filter(e => e.rsvpHadir === "absen").length;

//   const filteredEntries = entries.filter(entry => {
//     const matchesSearch = entry.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
//                           entry.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                           entry.relationship.toLowerCase().includes(searchQuery.toLowerCase());
    
//     if (filterRsvp === "all") return matchesSearch;
//     return matchesSearch && entry.rsvpHadir === filterRsvp;
//   });

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/98 text-stone-100 flex items-center justify-center p-4 backdrop-blur-md">
//       <div className="bg-stone-950 border border-stone-800 w-full max-w-5xl rounded-3xl shadow-2xl relative overflow-hidden my-8" id="admin-panel">
        
//         {/* HEADER BRANDING */}
//         <div className="border-b border-stone-850 px-6 py-4 flex items-center justify-between bg-stone-900/40">
//           <div className="flex items-center gap-2">
//             <Sliders className="w-5 h-5 text-amber-400" />
//             <h2 className="font-serif font-bold text-lg tracking-wide text-amber-200">Panel Pengantin &amp; Administrator</h2>
//           </div>
//           <button 
//             onClick={() => {
//               if (testAudio) testAudio.pause();
//               onClose();
//             }}
//             className="p-1 px-3 border border-stone-800 rounded-lg text-xs hover:bg-stone-900 transition-all text-stone-400 hover:text-stone-100 cursor-pointer"
//           >
//             <X className="w-4 h-4 inline-block mr-1" /> Tutup Panel
//           </button>
//         </div>

//         {/* LOG IN / PASSCODE REQUIREMENT */}
//         {!isAuthenticated ? (
//           <div className="py-24 px-6 max-w-md mx-auto text-center space-y-6">
//             <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto animate-pulse">
//               <Key className="w-8 h-8" />
//             </div>
            
//             <div className="space-y-2">
//               <h3 className="text-xl font-serif font-medium text-amber-200">Autentikasi Pengantin</h3>
//               <p className="text-xs text-stone-400 leading-relaxed font-sans">
//                 Akses panel ini hanya dibatasi untuk Gian &amp; Cucu sebagai penyelenggara. Sila masukkan kode PIN verifikasi panitia.
//               </p>
//             </div>

//             <form onSubmit={handleLogin} className="space-y-4 text-left">
//               <div>
//                 <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-1.5 font-sans">Kode PIN Sandi</label>
//                 <input 
//                   type="password"
//                   placeholder="Masukkan 6 Digit PIN Khusus (cth: 140526)"
//                   value={passcode}
//                   onChange={(e) => setPasscode(e.target.value)}
//                   className="w-full bg-stone-900 border border-stone-800 focus:border-amber-400 focus:outline-none rounded-xl px-4 py-3 text-center tracking-widest text-stone-100 font-bold font-mono text-lg transition-all"
//                   autoFocus
//                 />
//               </div>

//               {errorMsg && (
//                 <p className="text-xs text-red-400 bg-red-950/40 border border-red-900/30 px-3 py-2.5 rounded-lg font-sans font-medium text-center">
//                   {errorMsg}
//                 </p>
//               )}

//               <button 
//                 type="submit"
//                 className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-stone-950 py-3 rounded-xl font-serif font-bold text-xs uppercase tracking-wider hover:from-amber-400 hover:to-yellow-500 transition-all cursor-pointer shadow-lg shadow-amber-550/10"
//               >
//                 <Unlock className="w-3.5 h-3.5 inline mr-1.5" /> Masuk Panel Admin
//               </button>
//             </form>
            
//             <div className="pt-4 text-[10px] text-stone-500 italic">
//               Petunjuk: PIN adalah tanggal pernikahan (<b>120926</b>) atau cukup ketik kata sandi &quot;<b>admin</b>&quot;.
//             </div>
//           </div>
//         ) : (
          
//           <div className="p-6 md:p-8 space-y-8 max-h-[80vh] overflow-y-auto">
            
//             {/* STATS OVERVIEW CARDS */}
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//               <div className="p-4 bg-stone-900 border border-stone-850 rounded-2xl flex flex-col justify-between">
//                 <div className="flex items-center gap-1.5 text-stone-400 text-xs font-semibold uppercase tracking-wider font-sans">
//                   <Users className="w-3.5 h-3.5 text-amber-400" />
//                   <span>Total RSVP</span>
//                 </div>
//                 <div className="mt-2 flex items-baseline gap-1">
//                   <span className="text-3xl font-serif font-bold text-amber-200">{totalRsvpResponses}</span>
//                   <span className="text-[10px] text-stone-400 font-mono">Tanggapan</span>
//                 </div>
//               </div>

//               <div className="p-4 bg-stone-900 border border-stone-850 rounded-2xl flex flex-col justify-between">
//                 <div className="flex items-center gap-1.5 text-stone-400 text-xs font-semibold uppercase tracking-wider font-sans">
//                   <CheckCircle className="w-3.5 h-3.5 text-green-400" />
//                   <span>Hadir (Pax)</span>
//                 </div>
//                 <div className="mt-2 flex items-baseline gap-1">
//                   <span className="text-3xl font-serif font-bold text-green-400">{attendingGuests}</span>
//                   <span className="text-[9.5px] text-stone-400 font-sans">Pax dari {attendingCount} Tamu</span>
//                 </div>
//               </div>

//               <div className="p-4 bg-stone-900 border border-stone-850 rounded-2xl flex flex-col justify-between">
//                 <div className="flex items-center gap-1.5 text-stone-400 text-xs font-semibold uppercase tracking-wider font-sans">
//                   <HelpCircle className="w-3.5 h-3.5 text-yellow-500" />
//                   <span>Ragu-Ragu</span>
//                 </div>
//                 <div className="mt-2 flex items-baseline gap-1">
//                   <span className="text-3xl font-serif font-bold text-yellow-400">{unsureCount}</span>
//                   <span className="text-[10px] text-stone-400 font-mono">Orang</span>
//                 </div>
//               </div>

//               <div className="p-4 bg-stone-900 border border-stone-850 rounded-2xl flex flex-col justify-between">
//                 <div className="flex items-center gap-1.5 text-stone-400 text-xs font-semibold uppercase tracking-wider font-sans">
//                   <XCircle className="w-3.5 h-3.5 text-red-400" />
//                   <span>Berhalangan</span>
//                 </div>
//                 <div className="mt-2 flex items-baseline gap-1">
//                   <span className="text-3xl font-serif font-bold text-red-400">{absentCount}</span>
//                   <span className="text-[10px] text-stone-500 font-mono">Orang</span>
//                 </div>
//               </div>
//             </div>

//             {/* TWO COLUMN WORKSPACE */}
//             <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
//               {/* LEFT COLUMN: GUEST MESSAGES DIRECTORY */}
//               <div className="lg:col-span-7 space-y-6">
//                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
//                   <div className="flex items-center gap-2">
//                     <FileText className="w-5 h-5 text-amber-400" />
//                     <h3 className="font-serif font-bold text-base">Manajemen Buku Tamu &amp; RSVP</h3>
//                   </div>
                  
//                   <button 
//                     onClick={fetchGuestbook} 
//                     className="self-end sm:self-auto text-[10px] uppercase font-mono tracking-wider flex items-center gap-1 text-stone-400 hover:text-amber-400 cursor-pointer py-1 px-2.5 bg-stone-900 rounded border border-stone-800 shadow-sm"
//                   >
//                     <RefreshCw className={`w-2.5 h-2.5 ${loading ? "animate-spin" : ""}`} />
//                     <span>Muat Ulang</span>
//                   </button>
//                 </div>

//                 {/* SEARCH AND RSVP FILTERS */}
//                 <div className="flex flex-col sm:flex-row gap-2.5">
//                   <div className="relative flex-1">
//                     <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
//                     <input 
//                       type="text" 
//                       placeholder="Cari tamu, relasi, komentar..."
//                       value={searchQuery}
//                       onChange={(e) => setSearchQuery(e.target.value)}
//                       className="w-full bg-stone-900/60 border border-stone-800 focus:border-amber-400/40 focus:outline-none rounded-xl pr-4 pl-10 py-2.5 text-xs font-sans text-stone-200"
//                     />
//                   </div>

//                   <div className="flex bg-stone-900 rounded-xl p-1 border border-stone-800">
//                     {[
//                       { val: "all", lab: "Semua" },
//                       { val: "hadir", lab: "Hadir" },
//                       { val: "ragu", lab: "Ragu" },
//                       { val: "absen", lab: "Absen" },
//                     ].map((btn) => (
//                       <button
//                         key={btn.val}
//                         onClick={() => setFilterRsvp(btn.val)}
//                         className={`px-3 py-1.5 rounded-lg text-xs font-medium font-sans cursor-pointer transition-all ${
//                           filterRsvp === btn.val 
//                             ? "bg-amber-500/15 text-amber-300 font-bold border border-amber-500/10" 
//                             : "text-stone-400 hover:text-stone-200"
//                         }`}
//                       >
//                         {btn.lab}
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* GUESTBOOK DATATABLE/LIST */}
//                 <div className="max-h-[460px] overflow-y-auto pr-2 space-y-3 shadow-inner custom-scrollbar-pane border border-stone-850 p-3 bg-stone-950/40 rounded-2xl">
//                   {loading && entries.length === 0 ? (
//                     <div className="flex flex-col items-center justify-center py-16 space-y-2">
//                       <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
//                       <p className="text-stone-550 text-xs font-mono">Sinkronisasi data tamu...</p>
//                     </div>
//                   ) : filteredEntries.length === 0 ? (
//                     <div className="text-center py-12 text-stone-500 text-xs font-sans">
//                       Tidak ada data tamu yang cocok dengan pencarian Anda.
//                     </div>
//                   ) : (
//                     filteredEntries.map((item, idx) => (
//                       <div 
//                         key={item.id}
//                         className="p-4 bg-stone-900/50 border border-stone-850 rounded-xl relative group flex flex-col justify-between space-y-2.5 hover:bg-stone-900/80 hover:border-stone-800 transition-all"
//                       >
//                         <div className="flex items-start justify-between gap-2">
//                           <div className="flex items-start gap-2.5">
//                             <span className="w-7 h-7 rounded-full bg-amber-500/10 text-amber-300 border border-amber-550/15 flex items-center justify-center font-bold text-xs font-serif uppercase">
//                               {item.name.charAt(0)}
//                             </span>
//                             <div>
//                               <h4 className="text-xs font-bold font-serif text-stone-200">{item.name}</h4>
//                               <p className="text-[10px] text-stone-400 font-sans">{item.relationship}</p>
//                             </div>
//                           </div>

//                           <div className="flex items-center gap-1.5">
//                             {item.rsvpHadir === "hadir" && (
//                               <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-green-500/10 text-green-400 border border-green-500/10">
//                                 Hadir ({item.countGuests} Pax)
//                               </span>
//                             )}
//                             {item.rsvpHadir === "ragu" && (
//                               <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/10">
//                                 Ragu-Ragu
//                               </span>
//                             )}
//                             {item.rsvpHadir === "absen" && (
//                               <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-red-500/10 text-red-400 border border-red-500/10">
//                                 Absen
//                               </span>
//                             )}
                            
//                             {/* DELETE BUTTON */}
//                             <button
//                               onClick={() => handleDeleteEntry(item.id, item.name)}
//                               className="p-1.5 rounded-md bg-stone-950/80 text-stone-400 hover:text-red-400 border border-stone-850 hover:bg-red-500/10 transition-colors cursor-pointer"
//                               title="Hapus Pesan"
//                             >
//                               <Trash2 className="w-3.5 h-3.5" />
//                             </button>
//                           </div>
//                         </div>

//                         <p className="text-stone-300 text-xs italic font-light font-sans pl-1 border-l-2 border-stone-800 leading-relaxed">
//                           &ldquo;{item.comment}&rdquo;
//                         </p>
//                       </div>
//                     ))
//                   )}
//                 </div>
//               </div>

//               {/* RIGHT COLUMN: CONFIGURATORS */}
//               <div className="lg:col-span-5 space-y-8">
                
//                 {/* 1. DINAMIS NAME LINK GENERATOR */}
//                 <div className="p-5 bg-stone-900 border border-stone-850 rounded-2xl text-left space-y-4">
//                   <div className="flex items-center gap-2 border-b border-stone-800 pb-2">
//                     <Share2 className="w-4 h-4 text-amber-400" />
//                     <h4 className="font-serif font-bold text-sm text-amber-200">Generator Link Nama Dinamis</h4>
//                   </div>
                  
//                   <p className="text-[11px] text-stone-400 leading-relaxed font-sans">
//                     Ketikkan nama tamu undangan Anda untuk membangkitkan (generate) link website personal yang unik serta draf chat WhatsApp instan.
//                   </p>

//                   <div className="space-y-3">
//                     <div>
//                       <label className="block text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-1 font-sans">Nama Tamu Undangan</label>
//                       <input 
//                         type="text"
//                         placeholder="cth: Bapak Budi Santoso & Istri"
//                         value={guestName}
//                         onChange={(e) => setGuestName(e.target.value)}
//                         className="w-full bg-stone-950 border border-stone-800 focus:border-amber-400/50 focus:outline-none rounded-lg px-3 py-2 text-xs font-sans text-stone-100"
//                       />
//                     </div>

//                     <div className="grid grid-cols-2 gap-2">
//                       <div>
//                         <label className="block text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-1 font-sans">Kategori Relasi</label>
//                         <select 
//                           value={relation}
//                           onChange={(e) => setRelation(e.target.value)}
//                           className="w-full bg-stone-950 border border-stone-800 focus:border-amber-400/50 focus:outline-none rounded-lg px-3 py-2 text-xs font-sans text-stone-300"
//                         >
//                           <option value="Teman">Teman</option>
//                           <option value="Sahabat">Sahabat</option>
//                           <option value="Keluarga">Keluarga</option>
//                           <option value="Tetangga">Tetangga</option>
//                           <option value="Kerabat Pengantin">Kerabat Pengantin</option>
//                         </select>
//                       </div>

//                       <div>
//                         <label className="block text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-1 font-sans">Gaya Greeting WA</label>
//                         <select
//                           value={templateIndex}
//                           onChange={(e) => setTemplateIndex(Number(e.target.value))}
//                           className="w-full bg-stone-950 border border-stone-800 focus:border-amber-400/50 focus:outline-none rounded-lg px-3 py-2 text-xs font-sans text-stone-300"
//                         >
//                           {messageTemplates.map((t, idx) => (
//                             <option key={idx} value={idx}>{t.name}</option>
//                           ))}
//                         </select>
//                       </div>
//                     </div>

//                     {/* LIVE URL PREVIEW */}
//                     <div className="bg-stone-950 p-3 rounded-lg border border-stone-850 space-y-1.5 text-xs font-mono">
//                       <div className="flex items-center justify-between">
//                         <span className="text-[9px] text-stone-500 font-bold uppercase tracking-wider font-sans">Live URL Unik:</span>
//                         <button 
//                           onClick={handleCopyLink}
//                           className="text-[10px] text-amber-500 hover:text-amber-400 flex items-center gap-1 font-sans font-bold cursor-pointer"
//                         >
//                           {copiedLink ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
//                           <span>{copiedLink ? "Tersalin" : "Salin Link"}</span>
//                         </button>
//                       </div>
//                       <p className="text-[10px] truncate leading-normal text-stone-300 font-medium">
//                         {getInviteUrl()}
//                       </p>
//                     </div>

//                     {/* LIVE TEXT STATEMENT PREVIEW */}
//                     <div className="bg-stone-950 p-3 rounded-lg border border-stone-850 space-y-1.5 text-xs">
//                       <div className="flex items-center justify-between">
//                         <span className="text-[9px] text-stone-500 font-bold uppercase tracking-wider font-sans">Pratinjau Draf Pesan WA:</span>
//                         <div className="flex items-center gap-3">
//                           <button 
//                             onClick={handleCopyWAText}
//                             className="text-[10px] text-amber-500 hover:text-amber-400 font-bold flex items-center gap-1 cursor-pointer"
//                           >
//                             {copiedWA ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
//                             <span>{copiedWA ? "Tersalin" : "Salin Chat"}</span>
//                           </button>
//                         </div>
//                       </div>
//                       <textarea 
//                         readOnly
//                         value={getWaText()}
//                         className="w-full bg-stone-950 border-0 outline-none text-[10px] font-sans h-24 text-stone-400 p-0 text-left resize-none focus:ring-0 leading-relaxed font-light custom-scrollbar-pane"
//                       />
//                     </div>

//                     <button 
//                       onClick={handleShareWa}
//                       className="w-full py-2 bg-green-600 hover:bg-green-500 text-stone-950 text-xs font-serif font-bold tracking-wider uppercase rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow transition-all active:scale-98"
//                     >
//                       <Share2 className="w-3.5 h-3.5" />
//                       <span>Kirim Undangan via WhatsApp</span>
//                     </button>
//                   </div>
//                 </div>

//                 {/* 2. BACKGROUND SOUND SETTINGS */}
//                 <div className="p-5 bg-stone-900 border border-stone-850 rounded-2xl text-left space-y-4">
//                   <div className="flex items-center gap-2 border-b border-stone-800 pb-2">
//                     <Music className="w-4 h-4 text-amber-400" />
//                     <h4 className="font-serif font-bold text-sm text-amber-200">Konfigurasi Musik Latar</h4>
//                   </div>
                  
//                   <p className="text-[11px] text-stone-400 leading-relaxed font-sans">
//                     Atur lagu romantis yang otomatis berputar saat undangan dibuka oleh tamu istimewa Anda. Preset Bruno Mars dan Zayn-Usher telah siap dipakai.
//                   </p>

//                   <div className="space-y-4 font-sans text-xs">
                    
//                     {/* MUSIC PRESETS ROW */}
//                     <div>
//                       <label className="block text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-2">Pilih dari Lagu Romantis Pilihan</label>
//                       <div className="space-y-1.5">
//                         {musicPresets.map((preset, index) => {
//                           const isSelected = songUrl === preset.url;
//                           return (
//                             <button
//                               key={index}
//                               onClick={() => {
//                                 setSongUrl(preset.url);
//                                 setSongTitle(preset.title);
//                                 if (testPlaying && testAudio) {
//                                   testAudio.pause();
//                                   setTestPlaying(false);
//                                 }
//                               }}
//                               className={`w-full text-left p-2.5 rounded-lg border text-xs leading-snug flex items-center justify-between cursor-pointer transition-all ${
//                                 isSelected
//                                   ? "bg-amber-500/10 border-amber-500 text-amber-300"
//                                   : "bg-stone-950/60 border-stone-855 text-stone-400 hover:text-stone-300 hover:border-stone-800"
//                               }`}
//                             >
//                               <div>
//                                 <p className="font-semibold text-[11px] truncate">{preset.title}</p>
//                                 <p className="text-[9px] text-stone-500 font-mono truncate">{preset.url}</p>
//                               </div>
//                               {isSelected && <Music className="w-3.5 h-3.5 text-amber-400 shrink-0 ml-2 animate-bounce" />}
//                             </button>
//                           );
//                         })}
//                       </div>
//                     </div>

//                     <div className="h-px bg-stone-850 my-1.5" />

//                     {/* CUSTOM MUSIC URL INPUT */}
//                     <div className="space-y-2">
//                       <div>
//                         <label className="block text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-1">Judul Musik Kustom</label>
//                         <input 
//                           type="text"
//                           placeholder="cth: Bruno Mars - Rest of My Life"
//                           value={songTitle}
//                           onChange={(e) => setSongTitle(e.target.value)}
//                           className="w-full bg-stone-950 border border-stone-800 focus:border-amber-400/50 focus:outline-none rounded-lg px-3 py-2 text-xs"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-1">Tautan URL Berkas MP3 (.mp3)</label>
//                         <input 
//                           type="text"
//                           placeholder="Masukkan tautan http/https file mp3 langsung"
//                           value={songUrl}
//                           onChange={(e) => setSongUrl(e.target.value)}
//                           className="w-full bg-stone-950 border border-stone-800 focus:border-amber-400/50 focus:outline-none rounded-lg px-3 py-2 font-mono text-[10px]"
//                         />
//                       </div>
//                     </div>

//                     {/* LIVE PLAYER CONTROLS & SAVE */}
//                     <div className="flex flex-col gap-2 pt-2">
//                       <div className="flex gap-2">
//                         <button 
//                           onClick={triggerTestPlay}
//                           className={`px-4 py-2.5 border rounded-xl text-xs flex items-center gap-1.5 font-bold cursor-pointer transition-all shrink-0 ${
//                             testPlaying 
//                               ? "bg-stone-800 text-amber-400 border-amber-500/20" 
//                               : "bg-stone-950 border-stone-800 text-stone-300 hover:text-amber-400 hover:border-stone-700"
//                           }`}
//                         >
//                           {testPlaying ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <Music className="w-3.5 h-3.5" />}
//                           <span>{testPlaying ? "Hentikan" : "Tes Putar"}</span>
//                         </button>

//                         <button 
//                           onClick={handleSaveMusic}
//                           disabled={musicSaving}
//                           className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 font-serif font-extrabold text-stone-950 hover:from-amber-400 hover:to-yellow-500 rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
//                         >
//                           {musicSaving ? (
//                             <div className="w-3.5 h-3.5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
//                           ) : (
//                             <Save className="w-3.5 h-3.5 shrink-0" />
//                           )}
//                           <span>Terapkan Musik</span>
//                         </button>
//                       </div>
//                     </div>

//                     {musicSuccess && (
//                       <p className="text-[10px] text-green-400 bg-green-950/40 border border-green-900/40 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
//                         <CheckCircle className="w-3.5 h-3.5 text-green-400 shrink-0" />
//                         <span>Musik berhasil dikonfigurasi &amp; disimpan di perangkat (Local Storage)!</span>
//                       </p>
//                     )}

//                   </div>
//                 </div>

//               </div>

//             </div>

//           </div>
//         )}

//       </div>
//     </div>
//   );
// }
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import https from "https";
import http from "http";
import { Pool } from "pg";
import dotenv from "dotenv";
import crypto from "crypto";

// Load environment variables from multiple possible paths sequentially
const envPaths = [
  path.join(process.cwd(), "backend", ".env"),
  path.join(process.cwd(), ".env"),
  path.join(__dirname, ".env"),
  path.join(__dirname, "..", ".env"),
  path.join(__dirname, "..", "backend", ".env")
];

let envLoaded = false;
for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log(`[Wed] Environment configuration loaded successfully from: ${envPath}`);
    envLoaded = true;
    break;
  }
}

if (!envLoaded) {
  // Fall back to general dotenv load
  dotenv.config();
  console.log("[Wed] dotenv loaded with default fallback path.");
}

const app = express();
const PORT = process.env.PORT || 3001;

// Define directories
const PUBLIC_DIR = path.join(__dirname, "public");
const LOCAL_SONG_FILE = path.join(PUBLIC_DIR, "music.mp3");

if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

// Function to copy wedding images from frontend development public to backend on boot
function copyWorkspaceImagesToBackend() {
  const destImagesDir = path.join(PUBLIC_DIR, "images");
  if (!fs.existsSync(destImagesDir)) {
    fs.mkdirSync(destImagesDir, { recursive: true });
  }

  const srcImagesDir = path.join(process.cwd(), "public", "images");
  if (fs.existsSync(srcImagesDir)) {
    try {
      const files = fs.readdirSync(srcImagesDir);
      let copiedCount = 0;
      files.forEach((file) => {
        const srcFile = path.join(srcImagesDir, file);
        const destFile = path.join(destImagesDir, file);
        if (fs.statSync(srcFile).isFile()) {
          fs.copyFileSync(srcFile, destFile);
          copiedCount++;
        }
      });
      console.log(`[Wed] Copied ${copiedCount} wedding image assets to backend public/images/ directory.`);
    } catch (err: any) {
      console.error("[Wed] Error copying workspace images to backend public directory:", err.message);
    }
  } else {
    console.log("[Wed] Workspace images directory not found at:", srcImagesDir);
  }
}

// Ensure CORS is set up correctly so the decoupled frontend from "nugrahagiangn.my.id" can communicate
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(",") 
  : ["*"];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Blocked by CORS policy"));
    }
  },
  credentials: true
}));

app.use(express.json());

// Serve public directory (meaning static files like music.mp3 and images can be reached directly)
app.use(express.static(PUBLIC_DIR));
app.use("/wedding", express.static(PUBLIC_DIR));
app.use("/images", express.static(path.join(PUBLIC_DIR, "images")));
app.use("/wedding/images", express.static(path.join(PUBLIC_DIR, "images")));

// Create PostgreSQL connection pool
// Support both unified DATABASE_URL (ElephantSQL, Neon, Railway, Supabase etc) and cPanel discrete parameters
const connectionString = process.env.DATABASE_URL;
let pool: Pool;

// Mask password for safe logging
const maskedPassword = process.env.DB_PASSWORD ? "***" : "not set";
console.log(`[DB Setup] Initializing PostgreSQL connection with parameters:
 - DB_HOST: ${process.env.DB_HOST || "localhost"}
 - DB_PORT: ${process.env.DB_PORT || "5432"}
 - DB_USER: ${process.env.DB_USER || "postgres"}
 - DB_NAME: ${process.env.DB_NAME || "gnwedd"}
 - DB_SSL: ${process.env.DB_SSL || "false"}
 - DATABASE_URL (configured): ${connectionString ? "Yes" : "No"}
`);

if (connectionString) {
  pool = new Pool({
    connectionString,
    ssl: process.env.DB_SSL === "true" || process.env.DB_SSL === undefined ? { rejectUnauthorized: false } : false,
    connectionTimeoutMillis: 5000
  });
} else {
  pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "gnwedd",
    port: parseInt(process.env.DB_PORT || "5432"),
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
    connectionTimeoutMillis: 5000
  });
}

// Keep trace of the last database initialization error
let dbInitError: string | null = null;

// Auto-bootstrap and check database tables on startup
async function initDb() {
  console.log("Connecting and initializing PostgreSQL database...");
  try {
    // Check basic connectivity first
    await pool.query("SELECT NOW()");
    dbInitError = null;
    console.log("[DB Connectivity] Successful connection ping to Postgres.");

    // 1. Create Guestbook Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS guestbook (
        id SERIAL PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        relationship VARCHAR(100) DEFAULT 'Teman',
        rsvp_hadir VARCHAR(20) NOT NULL,
        count_guests INT DEFAULT 1,
        comment TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Create Index on Guestbook created_at
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_guestbook_created_at ON guestbook(created_at DESC);
    `);

    // 3. Create Settings Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS settings (
        key VARCHAR(50) PRIMARY KEY,
        value TEXT NOT NULL
      );
    `);

    // 4. Prepopulate Settings
    await pool.query(`
      INSERT INTO settings (key, value)
      VALUES 
        ('active_song_url', '/music.mp3'),
        ('active_song_title', 'Bruno Mars - Risk It All (Aplikasi Lokal)')
      ON CONFLICT (key) DO NOTHING;
    `);

    // 5. Create admin_users Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(80) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(120) DEFAULT 'Administrator',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 6. Prepopulate admin_users
    // 'admin' -> sha256 of 'admin' -> '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918'
    // 'gian' -> sha256 of '140526' -> 'ff803bc0d268d8ef58abf3ec0839eef8feafdc682e06f50fe794689620edb5de'
    // 'cucu' -> sha256 of '120926' -> '8b36873919e3cdbe330d32bb58212130dfd7f6b4d320953a817684347896ff62'
    await pool.query(`
      INSERT INTO admin_users (username, password, name)
      VALUES 
        ('admin', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'Administrator'),
        ('gian', 'ff803bc0d268d8ef58abf3ec0839eef8feafdc682e06f50fe794689620edb5de', 'Gian Nugraha'),
        ('cucu', '8b36873919e3cdbe330d32bb58212130dfd7f6b4d320953a817684347896ff62', 'Cucu')
      ON CONFLICT (username) DO NOTHING;
    `);

    console.log("PostgreSQL schema validated successfully.");
  } catch (err: any) {
    dbInitError = err.message || String(err);
    console.error("Critical: Failed to initialize PostgreSQL tables:", err);
  }
}

// Download stream helper
function downloadUrl(url: string, destPath: string, callback: (err?: Error) => void) {
  const protocol = url.startsWith("https") ? https : http;
  
  protocol.get(url, (response) => {
    if (response.statusCode === 301 || response.statusCode === 302) {
      const redirectUrl = response.headers.location;
      if (redirectUrl) {
        downloadUrl(redirectUrl, destPath, callback);
        return;
      }
    }

    if (response.statusCode !== 200) {
      callback(new Error(`Server returned status code ${response.statusCode}`));
      return;
    }

    const file = fs.createWriteStream(destPath);
    response.pipe(file);

    file.on("finish", () => {
      file.close();
      callback();
    });

    file.on("error", (err) => {
      fs.unlink(destPath, () => {});
      callback(err);
    });
  }).on("error", (err) => {
    fs.unlink(destPath, () => {});
    callback(err);
  });
}

// Download default background song on startup if local file does not exist
function checkAndDownloadLocalSong() {
  if (fs.existsSync(LOCAL_SONG_FILE)) {
    console.log("Local backup music.mp3 already exists.");
    return;
  }
  console.log("Downloading default romantic song to local public storage...");
  const defaultUrl = "https://pub-c5e31b5cdafb419a86617dd1d3e92ef9.r2.dev/ZAYN%20%26%20Usher%20-%20Risk%20It%20All.mp3";
  downloadUrl(defaultUrl, LOCAL_SONG_FILE, (err) => {
    if (err) {
      console.error("Failed to download default background song:", err.message);
    } else {
      console.log("Romantic song downloaded successfully to backend internal static storage!");
    }
  });
}

// -----------------------------------------------------------------
// ENDPOINTS
// -----------------------------------------------------------------

// API Home / Health Monitor
app.get("/", (req, res) => {
  res.json({ 
    status: "online", 
    message: "Wedding Invitation PostgreSQL Decoupled Backend is healthy.",
    domain: "nugrahagiangn.my.id",
    dbInitError: dbInitError,
    diagnosticsRoute: "/api/db-debug"
  });
});

// Live Database Diagnostic Endpoint for user troubleshooting
app.get("/api/db-debug", async (req, res) => {
  const diagnostics: Record<string, any> = {
    envLoadedAt: new Date().toISOString(),
    configuredConnectionString: !!process.env.DATABASE_URL,
    dbHost: process.env.DB_HOST || "localhost (default)",
    dbUser: process.env.DB_USER || "postgres (default)",
    dbName: process.env.DB_NAME || "gnwedd (default)",
    dbPort: process.env.DB_PORT || "5432",
    dbSsl: process.env.DB_SSL || "false",
    nodeEnv: process.env.NODE_ENV || "development",
    lastInitError: dbInitError
  };

  try {
    const testResult = await pool.query("SELECT NOW() as current_time");
    diagnostics.connected = true;
    diagnostics.dbTime = testResult.rows[0].current_time;

    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    diagnostics.tables = tablesResult.rows.map(r => r.table_name);

    if (diagnostics.tables.includes("guestbook")) {
      const countResult = await pool.query("SELECT COUNT(*)::int as count FROM guestbook");
      diagnostics.guestbookCount = countResult.rows[0].count;
      
      const sampleResult = await pool.query("SELECT * FROM guestbook LIMIT 1");
      diagnostics.sampleEntry = sampleResult.rows;
    }
  } catch (err: any) {
    diagnostics.connected = false;
    diagnostics.errorMessage = err.message;
    diagnostics.errorCode = err.code;
    diagnostics.stackTrace = err.stack;
  }

  res.json(diagnostics);
});

// GET Guestbook entries (from Postgres)
app.get("/api/guestbook", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id::text, name, relationship, rsvp_hadir AS \"rsvpHadir\", count_guests AS \"countGuests\", comment, created_at AS \"createdAt\" FROM guestbook ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err: any) {
    console.error("Error retrieving guestbook from Postgres:", err);
    res.status(500).json({ 
      error: "Gagal mengambil daftar ucapan tamu.", 
      details: err.message,
      code: err.code
    });
  }
});

// POST new Guestbook entry
app.post("/api/guestbook", async (req, res) => {
  const { name, relationship, rsvpHadir, comment, countGuests } = req.body;

  if (!name || !rsvpHadir || !comment) {
    return res.status(400).json({ error: "Missing required fields: name, rsvpHadir, comment" });
  }

  try {
    const queryStr = `
      INSERT INTO guestbook (name, relationship, rsvp_hadir, count_guests, comment, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING id::text, name, relationship, rsvp_hadir AS "rsvpHadir", count_guests AS "countGuests", comment, created_at AS "createdAt"
    `;
    const values = [
      String(name).trim(),
      String(relationship || "Teman").trim(),
      String(rsvpHadir),
      Number(countGuests) || 1,
      String(comment).trim()
    ];

    const result = await pool.query(queryStr, values);
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    console.error("Error inserting guestbook into Postgres:", err);
    res.status(500).json({ 
      error: "Gagal menyimpan ucapan tamu ke database.", 
      details: err.message,
      code: err.code
    });
  }
});

// DELETE Guestbook entry by ID
app.delete("/api/guestbook/:id", async (req, res) => {
  const { id } = req.params;
  const parsedId = parseInt(id);

  if (isNaN(parsedId)) {
    return res.status(400).json({ error: "Format ID komentar tidak valid." });
  }

  try {
    const result = await pool.query("DELETE FROM guestbook WHERE id = $1 RETURNING id", [parsedId]);
    
    if (result.rowCount && result.rowCount > 0) {
      res.json({ success: true, message: "Komentar berhasil dihapus dari database." });
    } else {
      res.status(404).json({ error: "Komentar tidak ditemukan." });
    }
  } catch (err) {
    console.error("Error deleting guestbook entry:", err);
    res.status(500).json({ error: "Gagal menghapus ucapan tamu." });
  }
});

// GET App settings (active music etc)
app.get("/api/settings", async (req, res) => {
  try {
    const result = await pool.query("SELECT key, value FROM settings");
    const settingsMap: Record<string, string> = {};
    
    result.rows.forEach(row => {
      settingsMap[row.key] = row.value;
    });

    res.json({
      activeSongUrl: settingsMap["active_song_url"] || "/music.mp3",
      activeSongTitle: settingsMap["active_song_title"] || "Bruno Mars - Risk It All (Aplikasi Lokal)"
    });
  } catch (err) {
    console.error("Error retrieving settings:", err);
    // Fallback to default
    res.json({
      activeSongUrl: "/music.mp3",
      activeSongTitle: "Bruno Mars - Risk It All (Aplikasi Lokal)"
    });
  }
});

// POST Update App settings manually
app.post("/api/settings", async (req, res) => {
  const { activeSongUrl, activeSongTitle } = req.body;

  if (!activeSongUrl || !activeSongTitle) {
    return res.status(400).json({ error: "URL dan Judul lagu wajib diisi." });
  }

  try {
    await pool.query(
      "INSERT INTO settings (key, value) VALUES ('active_song_url', $1) ON CONFLICT (key) DO UPDATE SET value = $1",
      [String(activeSongUrl).trim()]
    );
    await pool.query(
      "INSERT INTO settings (key, value) VALUES ('active_song_title', $1) ON CONFLICT (key) DO UPDATE SET value = $1",
      [String(activeSongTitle).trim()]
    );

    res.json({ 
      success: true, 
      settings: { activeSongUrl, activeSongTitle } 
    });
  } catch (err) {
    console.error("Error saving settings:", err);
    res.status(500).json({ error: "Gagal menyimpan konfigurasi musik." });
  }
});

// POST Admin Login (Database-Based)
app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username dan Password/PIN wajib diisi." });
  }

  try {
    const trimmedUser = String(username).trim();
    const trimmedPass = String(password).trim();
    
    // Hash password with sha256 to compare against the database
    const hashedPassword = crypto.createHash("sha256").update(trimmedPass).digest("hex");
    
    const queryStr = `
      SELECT id, username, name, password 
      FROM admin_users 
      WHERE LOWER(username) = LOWER($1)
    `;
    const result = await pool.query(queryStr, [trimmedUser]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Username atau sandi/PIN salah." });
    }

    const user = result.rows[0];
    if (user.password === hashedPassword) {
      return res.json({
        success: true,
        message: "Autentikasi berhasil.",
        user: {
          id: user.id,
          username: user.username,
          name: user.name || user.username
        }
      });
    } else {
      return res.status(401).json({ error: "Username atau sandi/PIN salah." });
    }
  } catch (err: any) {
    console.error("Error during admin login verification:", err);
    res.status(550).json({ 
      error: "Sistem gagal memproses autentikasi ke database.", 
      details: err.message 
    });
  }
});

// GET Music.mp3 endpoint (backward-compatible server stream)
app.get("/api/music.mp3", (req, res) => {
  if (fs.existsSync(LOCAL_SONG_FILE)) {
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Access-Control-Allow-Origin", "*");
    fs.createReadStream(LOCAL_SONG_FILE).pipe(res);
  } else {
    // Redirect to default live audio source if file isn't populated
    res.redirect("https://pub-c5e31b5cdafb419a86617dd1d3e92ef9.r2.dev/ZAYN%20%26%20Usher%20-%20Risk%20It%2520All.mp3");
  }
});

// POST Download kustom audio file to local public storage to resolve CORS issue
app.post("/api/download-song", async (req, res) => {
  const { url, title } = req.body;

  if (!url || !title) {
    return res.status(400).json({ error: "URL dan Judul lagu wajib diisi." });
  }

  console.log(`Downloading custom song on separated server: ${title} (${url})`);
  const tempDest = path.join(PUBLIC_DIR, "song_temp.mp3");

  downloadUrl(url, tempDest, async (err) => {
    if (err) {
      console.error("Failed to download requested song kustom:", err.message);
      return res.status(500).json({ error: `Gagal mengunduh musik dari URL: ${err.message}` });
    }

    try {
      if (fs.existsSync(LOCAL_SONG_FILE)) {
        fs.unlinkSync(LOCAL_SONG_FILE);
      }
      fs.renameSync(tempDest, LOCAL_SONG_FILE);

      // Save configurations back to the database
      await pool.query(
        "INSERT INTO settings (key, value) VALUES ('active_song_url', $1) ON CONFLICT (key) DO UPDATE SET value = $1",
        ["/music.mp3"]
      );
      await pool.query(
        "INSERT INTO settings (key, value) VALUES ('active_song_title', $1) ON CONFLICT (key) DO UPDATE SET value = $1",
        [`${title} (Aplikasi Lokal)`]
      );

      res.json({ 
        success: true, 
        settings: {
          activeSongUrl: "/music.mp3",
          activeSongTitle: `${title} (Aplikasi Lokal)`
        }
      });
    } catch (processErr: any) {
      console.error("Error processing download path details:", processErr);
      res.status(500).json({ error: "Gagal memproses file hasil unduhan kustom musik." });
    }
  });
});

// POST Upload custom local audio file directly to local server storage
app.post("/api/upload-song", (req, res) => {
  const songTitle = req.query.title 
    ? decodeURIComponent(req.query.title as string) 
    : "Lagu Kustom Pengantin";
    
  console.log(`Receiving decoupled stream upload of: "${songTitle}"`);

  const writeStream = fs.createWriteStream(LOCAL_SONG_FILE);
  req.pipe(writeStream);

  writeStream.on("finish", async () => {
    try {
      await pool.query(
        "INSERT INTO settings (key, value) VALUES ('active_song_url', $1) ON CONFLICT (key) DO UPDATE SET value = $1",
        ["/music.mp3"]
      );
      await pool.query(
        "INSERT INTO settings (key, value) VALUES ('active_song_title', $1) ON CONFLICT (key) DO UPDATE SET value = $1",
        [`${songTitle} (Hasil Unggah)`]
      );

      res.json({ 
        success: true, 
        settings: {
          activeSongUrl: "/music.mp3",
          activeSongTitle: `${songTitle} (Hasil Unggah)`
        } 
      });
    } catch (dbErr) {
      console.error("Gagal memperbarui konfigurasi musik database:", dbErr);
      res.status(500).json({ error: "Lagu diunggah tapi db gagal memperbarui settings." });
    }
  });

  writeStream.on("error", (err) => {
    console.error("Error processing request upload streams:", err);
    res.status(500).json({ error: "Gagal memproses streams berkas musik di server." });
  });
});

// -----------------------------------------------------------------
// BOOTSTRAP EXPRESS SERVER
// -----------------------------------------------------------------
async function main() {
  await initDb();
  checkAndDownloadLocalSong();
  copyWorkspaceImagesToBackend();
  
  app.listen(PORT, () => {
    console.log(`[Wed] Separated Express Backend running on PORT: ${PORT}`);
  });
}

main().catch(console.error);
