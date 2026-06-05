import { motion } from "motion/react";
import { Instagram, Heart } from "lucide-react";
import { mempelaiPria, mempelaiWanita } from "../data";

function resolvePhotoUrl(url: string) {
  if (url && url.startsWith("url(")) {
    const match = url.match(/^url\(['"]?([^'"]+)['"]?\)(.*)$/);
    if (match) {
      return match[1] + match[2];
    }
  }
  return url;
}
export default function Mempelai() {
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <section 
      id="mempelai" 
      className="relative py-24 px-6 bg-stone-50 text-stone-800 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Decorative floral backgrounds */}
      <div className="absolute top-0 left-0 w-32 h-32 md:w-48 md:h-48 bg-[radial-gradient(circle_at_top_left,rgba(180,142,85,0.08),transparent)] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-32 h-32 md:w-48 md:h-48 bg-[radial-gradient(circle_at_bottom_right,rgba(180,142,85,0.08),transparent)] pointer-events-none" />

      <div className="max-w-4xl w-full relative z-10 text-center space-y-16">
        
        {/* Quran / Blessing Quote */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={itemVariants}
          className="max-w-2xl mx-auto space-y-4 px-4 py-8 bg-stone-100/60 rounded-2xl border border-stone-200/50 backdrop-blur-sm"
        >
          <p className="text-stone-400 text-xs tracking-widest uppercase font-serif">KUTIPAN INDAH</p>
          <h3 className="text-xl md:text-2xl font-handwritten text-amber-800">QS. Ar-Rum: 21</h3>
          <p className="text-stone-600 font-sans italic text-sm md:text-base leading-relaxed">
            &quot;Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berpikir.&quot;
          </p>
        </motion.div>

        {/* Introduction text */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={itemVariants}
          className="space-y-3"
        >
          <h2 className="text-4xl font-handwritten text-amber-850">Assalamu&apos;alaikum Wr. Wb.</h2>
          <p className="text-stone-500 font-sans max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri hari bahagia pernikahan kami:
          </p>
        </motion.div>

        {/* The Couple Cards container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 items-stretch pt-6">
          
          {/* MEMPELAI PRIA */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center p-6 md:p-8 bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            {/* Top gold bar decorative */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-600/60" />

            <div className="relative mb-6">
              {/* Image Frame with Double Border */}
              <div className="absolute -inset-1.5 rounded-full border border-amber-600/30 group-hover:scale-105 transition-transform duration-500 pointer-events-none" />
              <img 
                src={resolvePhotoUrl(mempelaiPria.photoUrl)} 
                alt={mempelaiPria.fullName}
                className="w-40 h-40 md:w-48 md:h-48 rounded-full object-cover shadow-inner bg-stone-100"
              />
            </div>

            <div className="space-y-2 text-center flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-3xl font-handwritten text-amber-900 mb-1">
                  {mempelaiPria.nickName}
                </h3>
                <h4 className="text-xl font-serif font-semibold text-stone-800 tracking-wide">
                  {mempelaiPria.fullName}
                </h4>
                <div className="w-12 h-[1px] bg-amber-655/40 mx-auto my-4" />
                <p className="text-stone-500 text-sm leading-relaxed max-w-xs mx-auto">
                  Putra ke-3 dari Pasangan:
                  <br />
                  <span className="font-semibold text-stone-700">{mempelaiPria.fatherName}</span>
                  <br />
                  &
                  <br />
                  <span className="font-semibold text-stone-700">{mempelaiPria.motherName}</span>
                </p>
              </div>

              <div className="pt-6">
                <a 
                  href={mempelaiPria.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-amber-800 bg-amber-200/30 hover:bg-amber-100 rounded-full transition-all border border-amber-500/10 cursor-pointer group"
                >
                  <Instagram className="w-3.5 h-3.5 text-amber-700 group-hover:scale-110 transition-transform" />
                  <span>@{mempelaiPria.instagram.split("/").pop()}</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* MIDDLE JOINING ICON (Only on desktop and large screens) */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 translateY-12 z-20 items-center justify-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-amber-100 animate-float">
              <Heart className="w-5 h-5 text-amber-500 fill-amber-500/10" />
            </div>
          </div>

          {/* MEMPELAI WANITA */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center p-6 md:p-8 bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            {/* Top gold bar decorative */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-600/60" />

            <div className="relative mb-6">
              {/* Image Frame with Double Border */}
              <div className="absolute -inset-1.5 rounded-full border border-amber-600/30 group-hover:scale-105 transition-transform duration-500 pointer-events-none" />
              <img 
                src={resolvePhotoUrl(mempelaiWanita.photoUrl)} 
                alt={mempelaiWanita.fullName}
                className="w-40 h-40 md:w-48 md:h-48 rounded-full object-cover shadow-inner bg-stone-100"
              />
            </div>

            <div className="space-y-2 text-center flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-3xl font-handwritten text-amber-900 mb-1">
                  {mempelaiWanita.nickName}
                </h3>
                <h4 className="text-xl font-serif font-semibold text-stone-800 tracking-wide">
                  {mempelaiWanita.fullName}
                </h4>
                <div className="w-12 h-[1px] bg-amber-655/40 mx-auto my-4" />
                <p className="text-stone-500 text-sm leading-relaxed max-w-xs mx-auto">
                  Putri ke-3 (Bungsu) dari Pasangan:
                  <br />
                  <span className="font-semibold text-stone-700">{mempelaiWanita.fatherName}</span>
                  <br />
                  &
                  <br />
                  <span className="font-semibold text-stone-700">{mempelaiWanita.motherName}</span>
                </p>
              </div>

              <div className="pt-6">
                <a 
                  href={mempelaiWanita.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-amber-800 bg-amber-200/30 hover:bg-amber-100 rounded-full transition-all border border-amber-500/10 cursor-pointer group"
                >
                  <Instagram className="w-3.5 h-3.5 text-amber-700 group-hover:scale-110 transition-transform" />
                  <span>@{mempelaiWanita.instagram.split("/").pop()}</span>
                </a>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
