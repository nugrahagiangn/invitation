import { motion } from "motion/react";
import { MapPin, Navigation, Map } from "lucide-react";
import { agendaResepsi } from "../data";

export default function PetaLokasi() {
  return (
    <section 
      id="peta" 
      className="relative py-24 px-6 bg-stone-100 text-stone-800 flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="max-w-4xl w-full relative z-10 flex flex-col items-center space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <p className="tracking-[0.25em] text-xs font-semibold text-amber-700 font-display">PETUNJUK JALAN</p>
          <h2 className="text-4xl font-handwritten text-amber-900">Peta Lokasi Pernikahan</h2>
          <div className="h-[1px] w-16 bg-amber-600/35 mx-auto mt-4" />
        </div>

        {/* Content Box */}
        <div className="w-full flex flex-col md:flex-row gap-8 bg-white p-6 rounded-3xl border border-stone-200 shadow-md">
          
          {/* Left Description Column */}
          <div className="md:w-1/3 flex flex-col justify-between py-2 space-y-6 text-left">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-amber-800">
                <Map className="w-5 h-5" />
                <h3 className="font-serif font-bold text-lg">Detail Lokasi</h3>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed font-sans">
                Acara Akad Nikah dan Resepsi diselenggarakan di rumah kediaman mempelai wanita di <strong>Kp. Manguneng RT/RW 04/09, Ds. Cihikeu, Kec. Bungbulang, Kab. Garut</strong>. Lokasi berada di selatan Kab. Garut, sekitar 1 Jam dari Area Pantai Selatan 
              </p>
              
              <div className="space-y-2 border-t border-stone-100 pt-4">
                <div className="flex gap-2">
                  <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span className="text-xs text-stone-500 font-sans font-medium">
                    Jalan Raya Bungbulang, Cihikeu, Kec. Bungbulang, Garut
                  </span>
                </div>
              </div>
            </div>

            {/* Premium CTA Button */}
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={agendaResepsi.mapNavigationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white text-xs font-serif font-bold rounded-xl tracking-wider uppercase shadow-md hover:shadow-lg hover:from-amber-700 hover:to-amber-800 transition-all cursor-pointer group"
            >
              <Navigation className="w-4 h-4 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              <span>Buka Google Maps</span>
            </motion.a>
          </div>

          {/* Right Map Canvas Column (Using responsive design boundaries) */}
          <div className="md:w-2/3 w-full h-[320px] md:h-[400px] rounded-2xl overflow-hidden border border-stone-200 bg-stone-50 relative group shadow-sm">
            <iframe
              src={agendaResepsi.mapEmbedUrl}
              className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-700"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer"
              title="Google Map Sunda Kelapa"
            />
            {/* Visual aesthetic corner frame on map */}
            <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-amber-600/50 pointer-events-none group-hover:scale-110 transition-transform" />
            <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-amber-600/50 pointer-events-none group-hover:scale-110 transition-transform" />
          </div>

        </div>

      </div>
    </section>
  );
}
