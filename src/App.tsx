// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "motion/react";
// import { Heart, Sparkles, Volume2, Calendar, MapPin, Image as ImageIcon, MessageSquare, Users } from "lucide-react";

// // Import Components
// import Cover from "./components/Cover";
// import AudioPlayer from "./components/AudioPlayer";
// import Mempelai from "./components/Mempelai";
// import Acara from "./components/Acara";
// import PetaLokasi from "./components/PetaLokasi";
// import Galeri from "./components/Galeri";
// import BukuTamu from "./components/BukuTamu";
// import AmplopDigital from "./components/AmplopDigital";
// import AdminPanel from "./components/AdminPanel";
// // import coverImage from "./images/cover.jpeg";

// export default function App() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [guestName, setGuestName] = useState("");

//   // Custom states for active sound stream and pengantin settings
//   const [musicUrl, setMusicUrl] = useState("brunomars.mp3");
//   const [musicTitle, setMusicTitle] = useState("Bruno Mars - Risk It All");
//   const [isAdminOpen, setIsAdminOpen] = useState(false);
//   const [guestbookRefreshKey, setGuestbookRefreshKey] = useState(0);

//   const [activeSection, setActiveSection] = useState("");

//   // Scroll spy to highlight active section in bottom navigation
//   useEffect(() => {
//     if (!isOpen) return;

//     const sections = ["mempelai", "acara", "peta", "galeri", "bukutamu"];
    
//     const observerOptions = {
//       root: null,
//       rootMargin: "-20% 0px -40% 0px",
//       threshold: 0.15,
//     };

//     const observerCallback = (entries: IntersectionObserverEntry[]) => {
//       entries.forEach((entry) => {
//         if (entry.isIntersecting) {
//           setActiveSection(entry.target.id);
//         }
//       });
//     };

//     const observer = new IntersectionObserver(observerCallback, observerOptions);

//     const timer = setTimeout(() => {
//       sections.forEach((id) => {
//         const element = document.getElementById(id);
//         if (element) observer.observe(element);
//       });
//     }, 150);

//     return () => {
//       clearTimeout(timer);
//       observer.disconnect();
//     };
//   }, [isOpen]);

//   // Gather guest name from query parameters e.g., ?to=Siti+Aisyah
//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const toParam = params.get("to");
//     if (toParam) {
//       setGuestName(toParam);
//     }
//   }, []);

//   // Fetch customizable audio settings on mount
//   useEffect(() => {
//     fetch("/api/settings")
//       .then((res) => {
//         if (res.ok) return res.json();
//         throw new Error("HTTP non-OK status");
//       })
//       .then((data) => {
//         if (data && data.activeSongUrl) {
//           setMusicUrl(data.activeSongUrl);
//           setMusicTitle(data.activeSongTitle);
//         }
//       })
//       .catch((err) => {
//         console.warn("Gagal memuat konfigurasi musik dari server, menggunakan local storage / preset fallback:", err);
//         const stored = localStorage.getItem("invitation_settings");
//         if (stored) {
//           try {
//             const parsed = JSON.parse(stored);
//             setMusicUrl(parsed.activeSongUrl || "brunomars.mp3");
//             setMusicTitle(parsed.activeSongTitle || "Bruno Mars - Risk It All");
//             return;
//           } catch (e) {}
//         }
//         setMusicUrl("brunomars.mp3");
//         setMusicTitle("Bruno Mars - Risk It All");
//       });
//   }, []);

//   const handleOpenInvitation = () => {
//     setIsOpen(true);
//     setIsPlaying(true); // play ambient music on open (highly standard of premium invitations)
//   };

//   const toggleMusic = () => {
//     setIsPlaying(!isPlaying);
//   };

//   const handleMusicChanged = (newUrl: string, newTitle: string) => {
//     setMusicUrl(newUrl);
//     setMusicTitle(newTitle);
//   };

//   const handleRefreshData = () => {
//     // Increment the refresh key to force-reload the BukuTamu component instantly
//     setGuestbookRefreshKey((prev) => prev + 1);
//   };

//   // Lock body scroll when invitation is not opened
//   useEffect(() => {
//     if (!isOpen) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "unset";
//     }
//     return () => {
//       document.body.style.overflow = "unset";
//     };
//   }, [isOpen]);

//   return (
//     <div className="min-h-screen bg-stone-900 font-sans selection:bg-amber-500/35 selection:text-stone-900">
      
//       <AnimatePresence mode="wait">
//         {!isOpen ? (
//           <motion.div 
//             key="cover"
//             initial={{ opacity: 1 }}
//             exit={{ opacity: 0, y: "-100%" }}
//             transition={{ duration: 1.1, ease: [0.77, 0, 0.175, 1] }}
//             className="fixed inset-0 z-50 w-full h-full"
//           >
//             <Cover onOpen={handleOpenInvitation} guestName={guestName} />
//           </motion.div>
//         ) : (
//           <motion.div
//             key="main-invitation"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.8 }}
//             className="w-full relative bg-stone-50"
//           >
//             {/* Floating Bottom Navigation Bar (Elegant Icon Buttons) */}
//             <nav className="fixed bottom-4 inset-x-4 z-40 max-w-md mx-auto flex items-center justify-around py-2 px-3 bg-white/95 backdrop-blur-md rounded-2xl border border-stone-200/60 shadow-xl">
//               <a 
//                 href="#mempelai" 
//                 className="flex flex-col items-center gap-1 text-center flex-1 py-1 text-stone-500 hover:text-amber-800 transition-colors active:scale-95 duration-100"
//               >
//                 <Users className="w-4.5 h-4.5 text-stone-600 hover:text-amber-700 transition-colors" />
//                 <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-stone-500">Mempelai</span>
//               </a>
//               <a 
//                 href="#acara" 
//                 className="flex flex-col items-center gap-1 text-center flex-1 py-1 text-stone-500 hover:text-amber-800 transition-colors active:scale-95 duration-100"
//               >
//                 <Calendar className="w-4.5 h-4.5 text-stone-600 hover:text-amber-700 transition-colors" />
//                 <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-stone-500">Acara</span>
//               </a>
//               <a 
//                 href="#peta" 
//                 className="flex flex-col items-center gap-1 text-center flex-1 py-1 text-stone-500 hover:text-amber-800 transition-colors active:scale-95 duration-100"
//               >
//                 <MapPin className="w-4.5 h-4.5 text-stone-600 hover:text-amber-700 transition-colors" />
//                 <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-stone-500">Peta</span>
//               </a>
//               <a 
//                 href="#galeri" 
//                 className="flex flex-col items-center gap-1 text-center flex-1 py-1 text-stone-500 hover:text-amber-800 transition-colors active:scale-95 duration-100"
//               >
//                 <ImageIcon className="w-4.5 h-4.5 text-stone-600 hover:text-amber-700 transition-colors" />
//                 <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-stone-500">Galeri</span>
//               </a>
//               <a 
//                 href="#bukutamu" 
//                 className="flex flex-col items-center gap-1 text-center flex-1 py-1 text-amber-700 hover:text-amber-900 transition-colors active:scale-95 duration-100"
//               >
//                 <MessageSquare className="w-4.5 h-4.5 text-amber-700 hover:text-amber-850 transition-colors" />
//                 <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-amber-700">RSVP</span>
//               </a>
//             </nav>

//             {/* floating Music actions */}
//             <AudioPlayer isPlaying={isPlaying} onToggle={toggleMusic} audioUrl={musicUrl || undefined} />

//             {/* SECTION 1: MAIN ENTRANCE LUXURY HEADER */}
//             <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-stone-900 text-stone-100">
//               <div 
//                 className="absolute inset-0 bg-cover bg-center opacity-25 scale-100"
//                 style={{ 
//                   backgroundImage: `url('/wedding/images/bg.jpeg')` 
//                 }}
//               />
//               {/* Subtle visual gradient edge on bottom */}
//               <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/30 to-stone-900/40 pointer-events-none" />

//               <div className="relative z-10 text-center max-w-xl px-6 space-y-6">
//                 <motion.div
//                   initial={{ opacity: 0, scale: 0.8 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ delay: 0.2, duration: 1 }}
//                   className="flex items-center justify-center gap-1.5 text-amber-400 text-xs tracking-[0.2em] font-medium font-serif uppercase"
//                 >
//                   <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
//                   <span>The Wedding of</span>
//                   <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
//                 </motion.div>

//                 <motion.h1 
//                   initial={{ opacity: 0, y: 15 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.4, duration: 1 }}
//                   className="text-5xl sm:text-7xl font-accent text-amber-300 tracking-wide font-medium"
//                 >
//                   Gian &amp; Cucu
//                 </motion.h1>

//                 <motion.p
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: 0.6, duration: 1 }}
//                   className="text-[11px] sm:text-xs tracking-[0.3em] font-sans font-semibold text-stone-300 uppercase border-y border-white/10 py-3"
//                 >
//                   AHAD, 28 JUNI 2026 • BUNGBULANG, GARUT, JAWA BARAT
//                 </motion.p>
//               </div>

//               {/* Scroll Indicator */}
//               <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-60">
//                 <span className="text-[9px] uppercase tracking-[0.25em] font-mono text-stone-400 animate-pulse">Scroll Down</span>
//                 <span className="h-6 w-[1.5px] bg-amber-400 rounded-full animate-bounce" />
//               </div>
//             </section>

//             {/* SECTIONS WRAPPER */}
//             <div className="relative">
              
//               {/* Mempelai Segment */}
//               <Mempelai />

//               {/* Acara & Schedule Segment */}
//               <Acara />

//               {/* Peta Lokasi Segment */}
//               <PetaLokasi />

//               {/* Galeri Segment */}
//               <Galeri />

//               {/* Buku Tamu Segment */}
//               <BukuTamu key={guestbookRefreshKey} initialGuestName={guestName} />

//               {/* Amplop Digital / Cash Endowment Segment */}
//               <AmplopDigital />

//               {/* FOOTER THANK YOU */}
//               <footer className="relative py-20 px-6 bg-stone-950 text-stone-300 text-center overflow-hidden flex flex-col items-center justify-center">
//                 <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />
//                 <div className="max-w-2xl mx-auto space-y-6 flex flex-col items-center z-10 pb-8">
//                   <div className="inline-flex p-3 bg-amber-450/5 border border-amber-400/10 rounded-full">
//                     <Heart className="w-6 h-6 text-amber-500 fill-amber-500/10" />
//                   </div>
                  
//                   <h3 className="text-3xl font-handwritten text-amber-300">Terima Kasih</h3>
                  
//                   <p className="text-xs md:text-sm text-stone-400 font-sans leading-relaxed max-w-md mx-auto">
//                     Khadirat Bapak, Ibu, Saudara/i sekalian laksana untaian benang kebaikan yang menyempurnakan hari suci kami. Doarestu Anda selalu di sanubari kami.
//                   </p>
                  
//                   <div className="pt-4 flex flex-col items-center">
//                     <p className="text-base font-accent text-amber-400">Gian &amp; Cucu</p>
//                     <button 
//                       onClick={() => setIsAdminOpen(true)}
//                       className="text-[9.5px] uppercase tracking-[0.25em] font-mono text-stone-600 mt-2 hover:text-amber-400 transition-colors cursor-pointer"
//                     >
//                       Panel Pengantin (Admin)
//                     </button>
//                   </div>
//                 </div>
//               </footer>

//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Admin Panel Modal Overlay */}
//       <AnimatePresence>
//         {isAdminOpen && (
//           <AdminPanel 
//             onClose={() => setIsAdminOpen(false)} 
//             onMusicChanged={handleMusicChanged}
//             currentSongUrl={musicUrl}
//             currentSongTitle={musicTitle}
//             onRefreshData={handleRefreshData}
//           />
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }



// new
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Sparkles, Volume2, Calendar, MapPin, Image as ImageIcon, MessageSquare, Users } from "lucide-react";
import { getApiUrl, resolvePhotoUrl } from "./utils";


// Import Components
import Cover from "./components/Cover";
import AudioPlayer from "./components/AudioPlayer";
import Mempelai from "./components/Mempelai";
import TurutMengundang from "./components/TurutMengundang";
import Acara from "./components/Acara";
import PetaLokasi from "./components/PetaLokasi";
import Galeri from "./components/Galeri";
import BukuTamu from "./components/BukuTamu";
import AmplopDigital from "./components/AmplopDigital";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [guestName, setGuestName] = useState("");

  // Custom states for active sound stream and pengantin settings
  const [musicUrl, setMusicUrl] = useState("brunomars.mp3");
  const [musicTitle, setMusicTitle] = useState("Bruno Mars - Risk It All");
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [guestbookRefreshKey, setGuestbookRefreshKey] = useState(0);
  const [activeSection, setActiveSection] = useState("");

  // Scroll spy to highlight active section in bottom navigation using bounding rect calculations
  useEffect(() => {
    if (!isOpen) return;

    const handleScroll = () => {
      const sections = ["mempelai", "acara", "peta", "galeri", "bukutamu"];
      let currentActive = "";
      
      const viewportHeight = window.innerHeight;
      const triggerPoint = viewportHeight * 0.45; // Trigger scroll active state at 45% of viewport height

      for (const id of sections) {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If the trigger point is within the section's top & bottom bounds
          if (rect.top <= triggerPoint && rect.bottom >= triggerPoint) {
            currentActive = id;
            break;
          }
        }
      }

      // Safe fallback: if scrolled almost to the very bottom, always active the last section (bukutamu)
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 120) {
        currentActive = "bukutamu";
      }

      setActiveSection(currentActive);
    };

    // Calculate immediately on mount/open
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run an extra check shortly after to ensure it calculates once the DOM height settles
    const extraCheck = setTimeout(handleScroll, 200);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(extraCheck);
    };
  }, [isOpen]);

  // Gather guest name from query parameters e.g., ?to=Siti+Aisyah
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const toParam = params.get("to");
    if (toParam) {
      setGuestName(toParam);
    }
  }, []);

  // Fetch customizable audio settings on mount
  useEffect(() => {
    fetch(getApiUrl("/api/settings"))
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("HTTP non-OK status");
      })
      .then((data) => {
        if (data && data.activeSongUrl) {
          setMusicUrl(data.activeSongUrl);
          setMusicTitle(data.activeSongTitle || "Bruno Mars - Risk It All");
        }
      })
      .catch((err) => {
        console.warn("Gagal memuat konfigurasi musik dari database Postgres, menggunakan preset fallback:", err);
        setMusicUrl("brunomars.mp3");
        setMusicTitle("Bruno Mars - Risk It All");
      });
  }, []);

  const handleOpenInvitation = () => {
    setIsOpen(true);
    setIsPlaying(true); // play ambient music on open (highly standard of premium invitations)
  };

  const toggleMusic = () => {
    setIsPlaying(!isPlaying);
  };

  const handleMusicChanged = (newUrl: string, newTitle: string) => {
    setMusicUrl(newUrl);
    setMusicTitle(newTitle);
  };

  const handleRefreshData = () => {
    // Increment the refresh key to force-reload the BukuTamu component instantly
    setGuestbookRefreshKey((prev) => prev + 1);
  };

  // Lock body scroll when invitation is not opened
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <div className="min-h-screen bg-stone-900 font-sans selection:bg-amber-500/35 selection:text-stone-900">
      
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div 
            key="cover"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 1.1, ease: [0.77, 0, 0.175, 1] }}
            className="fixed inset-0 z-50 w-full h-full"
          >
            <Cover onOpen={handleOpenInvitation} guestName={guestName} />
          </motion.div>
        ) : (
          <motion.div
            key="main-invitation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full relative bg-stone-50"
          >
            {/* Floating Bottom Navigation Bar (Elegant Icon Buttons with Active State Scroll Spy) */}
            <nav className="fixed bottom-4 inset-x-4 z-40 max-w-md mx-auto flex items-center justify-around py-2 px-3 bg-white/95 backdrop-blur-md rounded-2xl border border-stone-200/60 shadow-xl">
              <a 
                href="#mempelai" 
                className={`flex flex-col items-center gap-1 text-center flex-1 py-1 transition-all active:scale-95 duration-200 ${
                  activeSection === "mempelai" 
                    ? "text-amber-800 scale-105 font-bold animate-pulse-once" 
                    : "text-stone-500 hover:text-amber-800"
                }`}
              >
                <Users className={`w-4.5 h-4.5 transition-colors mx-auto ${
                  activeSection === "mempelai" ? "text-amber-700" : "text-stone-500"
                }`} />
                <span className="text-[9px] font-sans font-bold uppercase tracking-wider">Mempelai</span>
              </a>
              <a 
                href="#acara" 
                className={`flex flex-col items-center gap-1 text-center flex-1 py-1 transition-all active:scale-95 duration-200 ${
                  activeSection === "acara" 
                    ? "text-amber-800 scale-105 font-bold" 
                    : "text-stone-500 hover:text-amber-800"
                }`}
              >
                <Calendar className={`w-4.5 h-4.5 transition-colors mx-auto ${
                  activeSection === "acara" ? "text-amber-700" : "text-stone-500"
                }`} />
                <span className="text-[9px] font-sans font-bold uppercase tracking-wider">Acara</span>
              </a>
              <a 
                href="#peta" 
                className={`flex flex-col items-center gap-1 text-center flex-1 py-1 transition-all active:scale-95 duration-200 ${
                  activeSection === "peta" 
                    ? "text-amber-800 scale-105 font-bold" 
                    : "text-stone-500 hover:text-amber-800"
                }`}
              >
                <MapPin className={`w-4.5 h-4.5 transition-colors mx-auto ${
                  activeSection === "peta" ? "text-amber-700" : "text-stone-500"
                }`} />
                <span className="text-[9px] font-sans font-bold uppercase tracking-wider">Peta</span>
              </a>
              <a 
                href="#galeri" 
                className={`flex flex-col items-center gap-1 text-center flex-1 py-1 transition-all active:scale-95 duration-200 ${
                  activeSection === "galeri" 
                    ? "text-amber-800 scale-105 font-bold" 
                    : "text-stone-500 hover:text-amber-800"
                }`}
              >
                <ImageIcon className={`w-4.5 h-4.5 transition-colors mx-auto ${
                  activeSection === "galeri" ? "text-amber-700" : "text-stone-500"
                }`} />
                <span className="text-[9px] font-sans font-bold uppercase tracking-wider">Galeri</span>
              </a>
              <a 
                href="#bukutamu" 
                className={`flex flex-col items-center gap-1 text-center flex-1 py-1 transition-all active:scale-95 duration-200 ${
                  activeSection === "bukutamu" 
                    ? "text-amber-800 scale-105 font-bold" 
                    : "text-stone-500 hover:text-amber-800"
                }`}
              >
                <MessageSquare className={`w-4.5 h-4.5 transition-colors mx-auto ${
                  activeSection === "bukutamu" ? "text-amber-700" : "text-stone-500"
                }`} />
                <span className="text-[9px] font-sans font-bold uppercase tracking-wider">RSVP</span>
              </a>
            </nav>

            {/* floating Music actions */}
            <AudioPlayer isPlaying={isPlaying} onToggle={toggleMusic} audioUrl={musicUrl || undefined} />

            {/* SECTION 1: MAIN ENTRANCE LUXURY HEADER */}
            <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-stone-900 text-stone-100">
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-25 scale-100"
                style={{ 
                  backgroundImage: `url('${resolvePhotoUrl("/wedding/images/bg.jpeg")}')` 
                }}
              />
              {/* Subtle visual gradient edge on bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/30 to-stone-900/40 pointer-events-none" />

              <div className="relative z-10 text-center max-w-xl px-6 space-y-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 1 }}
                  className="flex items-center justify-center gap-1.5 text-amber-400 text-xs tracking-[0.2em] font-medium font-serif uppercase"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>The Wedding of</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                </motion.div>

                <motion.h1 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 1 }}
                  className="text-5xl sm:text-7xl font-accent text-amber-300 tracking-wide font-medium"
                >
                  Gian &amp; Cucu
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 1 }}
                  className="text-[11px] sm:text-xs tracking-[0.3em] font-sans font-semibold text-stone-300 uppercase border-y border-white/10 py-3"
                >
                  KAMIS, 14 MEI 2026 • GARUT, JAWA BARAT
                </motion.p>
              </div>

              {/* Scroll Indicator */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-60">
                <span className="text-[9px] uppercase tracking-[0.25em] font-mono text-stone-400 animate-pulse">Scroll Down</span>
                <span className="h-6 w-[1.5px] bg-amber-400 rounded-full animate-bounce" />
              </div>
            </section>

            {/* SECTIONS WRAPPER */}
            <div className="relative">
              
              {/* Mempelai Segment */}
              <Mempelai />

              {/* Turut Mengundang Segment */}
              <TurutMengundang />

              {/* Acara & Schedule Segment */}
              <Acara />

              {/* Peta Lokasi Segment */}
              <PetaLokasi />

              {/* Galeri Segment */}
              <Galeri />

              {/* Buku Tamu Segment */}
              <BukuTamu key={guestbookRefreshKey} initialGuestName={guestName} />

              {/* Amplop Digital / Cash Endowment Segment */}
              <AmplopDigital />

              {/* FOOTER THANK YOU */}
              <footer className="relative py-20 px-6 bg-stone-950 text-stone-300 text-center overflow-hidden flex flex-col items-center justify-center">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />
                <div className="max-w-2xl mx-auto space-y-6 flex flex-col items-center z-10 pb-8">
                  <div className="inline-flex p-3 bg-amber-450/5 border border-amber-400/10 rounded-full">
                    <Heart className="w-6 h-6 text-amber-500 fill-amber-500/10" />
                  </div>
                  
                  <h3 className="text-3xl font-handwritten text-amber-300">Terima Kasih</h3>
                  
                  <p className="text-xs md:text-sm text-stone-400 font-sans leading-relaxed max-w-md mx-auto">
                    Khadirat Bapak, Ibu, Saudara/i sekalian laksana untaian benang kebaikan yang menyempurnakan hari suci kami. Doarestu Anda selalu di sanubari kami.
                  </p>
                  
                  <div className="pt-4 flex flex-col items-center">
                    <p className="text-base font-accent text-amber-400">Gian &amp; Cucu</p>
                    <button 
                      onClick={() => setIsAdminOpen(true)}
                      className="text-[9.5px] uppercase tracking-[0.25em] font-mono text-stone-600 mt-2 hover:text-amber-400 transition-colors cursor-pointer"
                    >
                      Panel Pengantin (Admin)
                    </button>
                  </div>
                </div>
              </footer>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Panel Modal Overlay */}
      <AnimatePresence>
        {isAdminOpen && (
          <AdminPanel 
            onClose={() => setIsAdminOpen(false)} 
            onMusicChanged={handleMusicChanged}
            currentSongUrl={musicUrl}
            currentSongTitle={musicTitle}
            onRefreshData={handleRefreshData}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
