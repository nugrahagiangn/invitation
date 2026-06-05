import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Calendar, Clock, MapPin, Copy, Check, Share2 } from "lucide-react";
import { agendaAkad, agendaResepsi, targetWeddingDate } from "../data";

export default function Acara() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [copiedAkad, setCopiedAkad] = useState(false);
  const [copiedResepsi, setCopiedResepsi] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetWeddingDate) - +new Date();
      let newTimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

      if (difference > 0) {
        newTimeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return newTimeLeft;
    };

    // Calculate immediately
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const copyToClipboard = (text: string, isAkad: boolean) => {
    navigator.clipboard.writeText(text);
    if (isAkad) {
      setCopiedAkad(true);
      setTimeout(() => setCopiedAkad(false), 2000);
    } else {
      setCopiedResepsi(true);
      setTimeout(() => setCopiedResepsi(false), 2000);
    }
  };

  // Google Calendar URL creator
  const getGoogleCalendarUrl = (event: typeof agendaAkad) => {
    const title = `Wedding of Gian & Cucu - ${event.title}`;
    const details = `Menghadiri Acara ${event.title} pernikahan Gian dan Cucu di ${event.locationName}. Alamat: ${event.address}`;
    const location = event.locationName;
    const dates = "20260514T010000Z/20260514T070000Z"; // approximate UTC for May 14 2026
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${dates}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
  };

  return (
    <section 
      id="acara" 
      className="relative py-24 px-6 bg-stone-900 text-stone-100 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Absolute image background overlay with dark vignette */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-[0.12] pointer-events-none scale-105"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200')` 
        }}
      />
      
      {/* Decorative borders */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

      <div className="max-w-5xl w-full relative z-10 flex flex-col items-center space-y-16">
        
        {/* Title */}
        <div className="text-center space-y-3">
          <p className="tracking-[0.25em] text-xs font-semibold text-amber-400 font-display">TANGGAL YANG DINANTI</p>
          <h2 className="text-4xl md:text-5xl font-handwritten text-amber-300">Waktu & Tempat Acara</h2>
          <div className="h-[1px] w-20 bg-amber-405/60 mx-auto mt-4" />
        </div>

        {/* Dynamic Countdown Screen */}
        <div className="grid grid-cols-4 gap-3 sm:gap-6 max-w-xl w-full mx-auto pb-6">
          {[
            { label: "Hari", value: timeLeft.days },
            { label: "Jam", value: timeLeft.hours },
            { label: "Menit", value: timeLeft.minutes },
            { label: "Detik", value: timeLeft.seconds }
          ].map((block, i) => (
            <motion.div
              key={block.label}
              initial={{ opacity: 0, scale: 0.8, y: 15 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-stone-950/80 backdrop-blur-sm border border-amber-400/10 rounded-2xl p-4 sm:p-6 text-center shadow-lg relative overflow-hidden group hover:border-amber-400/30 transition-all"
            >
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
              <div className="text-2xl sm:text-4xl font-serif font-black text-amber-300 tracking-tight">
                {String(block.value).padStart(2, "0")}
              </div>
              <div className="text-[10px] sm:text-xs text-stone-400 tracking-widest uppercase font-medium mt-1 font-sans">
                {block.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Grid of Akad and Resepsi Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch w-full">
          
          {/* AKAD NIKAH CARD */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-stone-950/65 backdrop-blur-md rounded-3xl border border-stone-850 p-8 flex flex-col justify-between space-y-8 hover:border-amber-400/15 transition-all text-left relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Calendar className="w-40 h-40 text-amber-300" />
            </div>

            <div className="space-y-6 relative z-10">
              <div className="inline-flex px-4 py-1.5 bg-amber-500/10 text-amber-400 text-xs font-semibold tracking-wider uppercase font-serif rounded-full border border-amber-500/20">
                {agendaAkad.title}
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-stone-200">Hari & Tanggal</h4>
                    <p className="text-stone-300 text-sm mt-1">{agendaAkad.dateStr}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-stone-200">Waktu Pelaksanaan</h4>
                    <p className="text-stone-300 text-sm mt-1">{agendaAkad.timeStr}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-stone-200">Tempat & Lokasi</h4>
                    <p className="text-amber-400 text-sm font-medium mt-1">{agendaAkad.locationName}</p>
                    <p className="text-stone-400 text-xs mt-1.5 leading-relaxed">{agendaAkad.address}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-4 relative z-10">
              <a
                href={getGoogleCalendarUrl(agendaAkad)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-850 text-amber-400 border border-amber-400/20 hover:border-amber-400/40 text-xs font-medium rounded-xl transition-all shadow-md cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Simpan di Google Calendar</span>
              </a>

              <button
                onClick={() => copyToClipboard(agendaAkad.address, true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900/40 hover:bg-stone-850/60 text-stone-300 border border-stone-800 hover:border-stone-700 text-xs font-medium rounded-xl transition-all cursor-pointer active:scale-95"
              >
                {copiedAkad ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAkad ? "Tersalin" : "Salin Alamat"}</span>
              </button>
            </div>
          </motion.div>

          {/* RESEPSI PERNIKAHAN CARD */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="bg-stone-950/65 backdrop-blur-md rounded-3xl border border-stone-850 p-8 flex flex-col justify-between space-y-8 hover:border-amber-400/15 transition-all text-left relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Clock className="w-40 h-40 text-amber-300" />
            </div>

            <div className="space-y-6 relative z-10">
              <div className="inline-flex px-4 py-1.5 bg-amber-500/10 text-amber-400 text-xs font-semibold tracking-wider uppercase font-serif rounded-full border border-amber-500/20">
                {agendaResepsi.title}
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-stone-200">Hari & Tanggal</h4>
                    <p className="text-stone-300 text-sm mt-1">{agendaResepsi.dateStr}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-stone-200">Waktu Pelaksanaan</h4>
                    <p className="text-stone-300 text-sm mt-1">{agendaResepsi.timeStr}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-stone-200">Tempat & Lokasi</h4>
                    <p className="text-amber-400 text-sm font-medium mt-1">{agendaResepsi.locationName}</p>
                    <p className="text-stone-400 text-xs mt-1.5 leading-relaxed">{agendaResepsi.address}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-4 relative z-10">
              <a
                href={getGoogleCalendarUrl(agendaResepsi)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-850 text-amber-400 border border-amber-400/20 hover:border-amber-400/40 text-xs font-medium rounded-xl transition-all shadow-md cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Simpan di Google Calendar</span>
              </a>

              <button
                onClick={() => copyToClipboard(agendaResepsi.address, false)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900/40 hover:bg-stone-850/60 text-stone-300 border border-stone-800 hover:border-stone-700 text-xs font-medium rounded-xl transition-all cursor-pointer active:scale-95"
              >
                {copiedResepsi ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedResepsi ? "Tersalin" : "Salin Alamat"}</span>
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
