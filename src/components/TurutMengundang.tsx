import { motion } from "motion/react";
import { Users2, HeartHandshake, Sparkles } from "lucide-react";
import { turutMengundang } from "../data";

export default function TurutMengundang() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
        delayChildren: 0.1 
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" } 
    }
  };

  return (
    <section 
      id="turut-mengundang" 
      className="relative py-20 px-4 sm:px-6 bg-stone-100 text-stone-800 overflow-hidden flex flex-col items-center justify-center border-t border-b border-stone-200/55"
    >
      {/* Decorative ambient elements */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[radial-gradient(circle_at_top_right,rgba(180,142,85,0.06),transparent)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-[radial-gradient(circle_at_bottom_left,rgba(180,142,85,0.06),transparent)] pointer-events-none" />

      <div className="max-w-4xl w-full relative z-10 text-center space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <p className="tracking-[0.25em] text-xs font-semibold text-amber-700 uppercase font-display flex items-center justify-center gap-2">
            <HeartHandshake className="w-4 h-4 text-amber-600 animate-pulse" />
            <span>Turut Mengundang</span>
          </p>
          <h2 className="text-3xl font-handwritten text-amber-950">Segenap Keluarga Besar &amp; Rekan</h2>
          <p className="text-stone-500 font-sans max-w-sm mx-auto text-xs sm:text-sm">
            Rasa hormat dan kebahagiaan kami didampingi oleh segenap keluarga dan sahabat yang turut mendoakan restu pernikahan kami.
          </p>
          <div className="h-[1px] w-16 bg-amber-655/40 mx-auto mt-4" />
        </div>

        {/* Responsive Grid list of Groups */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch pt-2"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {turutMengundang.map((group, groupIndex) => (
            <motion.div
              key={group.category}
              variants={itemVariants}
              className="bg-white rounded-2xl p-6 border border-stone-200/60 shadow-sm hover:shadow-md transition-shadow flex flex-col space-y-4 relative overflow-hidden group"
            >
              {/* Top gold bar decor */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-amber-600/40 group-hover:bg-amber-600/70 transition-colors" />
              
              <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                <div className="p-1.5 bg-amber-50 rounded-lg text-amber-800 shrink-0">
                  <Users2 className="w-4 h-4" />
                </div>
                <h3 className="font-serif font-bold text-stone-800 text-sm tracking-wide text-left uppercase">
                  {group.category}
                </h3>
              </div>

              <ul className="space-y-2.5 text-left flex-1 flex flex-col justify-center">
                {group.names.map((name, nameIndex) => (
                  <li 
                    key={nameIndex} 
                    className="flex items-start gap-2 text-stone-600 text-xs sm:text-sm font-sans tracking-wide leading-relaxed hover:text-amber-900 transition-colors"
                  >
                    <span className="text-amber-500 text-xs mt-1 shrink-0">•</span>
                    <span>{name}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Decorative Quote */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 1 }}
          className="text-[10px] sm:text-xs tracking-[0.2em] font-sans font-semibold text-stone-400 uppercase pt-4 flex items-center justify-center gap-1.5"
        >
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>Kehormatan Terbesar Atas Kehadiran &amp; Doa Restu Anda</span>
          <Sparkles className="w-3 h-3 text-amber-500" />
        </motion.p>
      </div>
    </section>
  );
}
