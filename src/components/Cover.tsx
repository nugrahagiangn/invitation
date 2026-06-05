import { motion } from "motion/react";
import { MailOpen, Heart, Music, Play } from "lucide-react";
import { resolvePhotoUrl } from "../utils";

interface CoverProps {
  onOpen: () => void;
  guestName: string;
}

export default function Cover({ onOpen, guestName }: CoverProps) {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-stone-900 text-stone-100 font-sans">
      {/* Background image overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center brightness-[0.25] scale-105"
        style={{ 
          backgroundImage: `url('${resolvePhotoUrl("/wedding/images/bg.jpeg")}')` 
        }}
      />
      
      {/* Classic decorative gold-like frame/borders */}
      <div className="absolute inset-4 md:inset-8 border border-amber-400/20 rounded-lg pointer-events-none" />
      <div className="absolute inset-6 md:inset-10 border border-amber-400/10 rounded-lg pointer-events-none" />

      {/* Aesthetic corner designs */}
      <div className="absolute top-10 left-10 w-8 h-8 border-t border-l border-amber-400/30 rounded-tl-md pointer-events-none" />
      <div className="absolute top-10 right-10 w-8 h-8 border-t border-r border-amber-400/30 rounded-tr-md pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-8 h-8 border-b border-l border-amber-400/30 rounded-bl-md pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-8 h-8 border-b border-r border-amber-400/30 rounded-br-md pointer-events-none" />

      <div className="relative text-center max-w-lg px-6 flex flex-col items-center justify-center py-12 z-10 space-y-8">
        {/* Wedding emblem */}
        {/* <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative inline-flex items-center justify-center p-4 bg-amber-400/5 rounded-full border border-amber-400/20 animate-float"
        >
          <div className="absolute inset-0 bg-amber-400/5 rounded-full animate-pulse-ring" />
          <Heart className="w-8 h-8 text-amber-500 fill-amber-500/20" />
        </motion.div> */}

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative inline-flex items-center justify-center p-2.5 bg-amber-400/5 rounded-full border border-amber-400/20 animate-float"
        >
          <div className="absolute inset-0 bg-amber-400/5 rounded-full animate-pulse-ring" />
          <img 
            src={resolvePhotoUrl("/wedding/images/lm.jpeg")} 
            alt="Gian & Cucu" 
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border border-amber-400/35 shadow-lg" 
            referrerPolicy="no-referrer"
          />
        </motion.div>

        <div className="space-y-3">
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="tracking-[0.2em] text-xs font-semibold text-amber-400 font-display"
          >
            THE WEDDING INVITATION
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="flex flex-col items-center"
          >
            <h1 className="text-4xl sm:text-5xl font-accent text-amber-300 tracking-wider">
              Gian & Cucu
            </h1>
            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent my-3" />
            <p className="text-xs tracking-[0.15em] text-stone-300 font-sans font-medium">
              AHAD, 28 JUNI 2026
            </p>
          </motion.div>
        </div>

        {/* Invited guest details */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="bg-stone-900/80 backdrop-blur-md px-8 py-5 rounded-xl border border-amber-400/10 shadow-2xl max-w-sm w-full space-y-3"
        >
          <p className="text-stone-400 text-xs tracking-wider">Kepada Yth. Bapak/Ibu/Saudara/i:</p>
          <h2 className="text-lg md:text-xl font-medium font-serif text-stone-100 truncate tracking-wide border-b border-stone-800 pb-2">
            {guestName || "Tamu Undangan Sahabat"}
          </h2>
          <p className="text-[10px] text-amber-400/70 italic leading-relaxed">
            *Mohon maaf jika ada kesalahan penulisan nama atau gelar
          </p>
        </motion.div>

        {/* Call to action button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          onClick={onOpen}
          className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-600 text-stone-950 font-serif font-semibold rounded-full shadow-lg hover:shadow-amber-500/20 hover:from-amber-400 hover:to-yellow-500 cursor-pointer group transition-all"
        >
          <MailOpen className="w-4 h-4 text-stone-950 group-hover:translate-x-0.5 transition-transform" />
          <span>Buka Undangan</span>
        </motion.button>
      </div>
    </div>
  );
}
