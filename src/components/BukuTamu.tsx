import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Users, CheckCircle, HelpCircle, XCircle, Send, Clock, Sparkles } from "lucide-react";
import { GuestbookEntry } from "../types";
import { getApiUrl } from "../utils";


interface BukuTamuProps {
  initialGuestName?: string;
  key?: React.Key;
}

export default function BukuTamu({ initialGuestName = "" }: BukuTamuProps) {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [name, setName] = useState(initialGuestName);
  const [relationship, setRelationship] = useState("");
  const [rsvpHadir, setRsvpHadir] = useState("hadir"); // hadir, ragu, absen
  const [countGuests, setCountGuests] = useState(1);
  const [comment, setComment] = useState("");
  
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchEntries = async () => {
    try {
      const res = await fetch(getApiUrl("/api/guestbook"));
      if (res.ok) {
        const data = await res.json();
        setEntries(data);
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || errData.details || "Gagal menghubungi backend");
      }
    } catch (err: any) {
      console.error("Failed to fetch guestbook comments from backend:", err);
      setErrorMsg("Koneksi gagal: Gagal mengambil daftar ucapan dari database PostgreSQL.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      setErrorMsg("Mohon isi Nama Lengkap dan Ucapan & Doa Anda.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch(getApiUrl("/api/guestbook"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          relationship: relationship.trim() || "Teman",
          rsvpHadir,
          countGuests: rsvpHadir === "absen" ? 0 : countGuests,
          comment: comment.trim(),
        }),
      });

      if (res.ok) {
        const newEntry = await res.json();
        setEntries((prev) => [newEntry, ...prev]);
        setComment("");
        setSuccessMsg(true);
        setTimeout(() => setSuccessMsg(false), 5000);
      } else {
        const errData = await res.json().catch(() => ({}));
        const detailedError = errData.details ? `${errData.error} (Detail: ${errData.details})` : (errData.error || errData.details || "Gagal menghubungi backend");
        throw new Error(detailedError);
      }
    } catch (err: any) {
      console.error("Terjadi masalah saat mengirim ucapan ke backend:", err);
      setErrorMsg(`Gagal mengirim ke database: ${err.message || "Pastikan koneksi internet & database aktif."}`);
    } finally {
      setSubmitting(false);
    }
  };

  const getRsvpBadge = (status: string) => {
    switch (status) {
      case "hadir":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-green-500/10 text-green-600 border border-green-500/20">
            <CheckCircle className="w-3 h-3" />
            <span>Akan Hadir</span>
          </span>
        );
      case "ragu":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-yellow-500/10 text-yellow-600 border border-yellow-500/20">
            <HelpCircle className="w-3 h-3" />
            <span>Masih Ragu-ragu</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-red-500/10 text-red-600 border border-red-500/20">
            <XCircle className="w-3 h-3" />
            <span>Tidak Bisa Hadir</span>
          </span>
        );
    }
  };

  const formatTimeAgo = (isoDateStr: string) => {
    try {
      const timestamp = new Date(isoDateStr).getTime();
      const now = Date.now();
      const diffMs = now - timestamp;
      
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return "Baru saja";
      if (diffMins < 60) return `${diffMins} menit lalu`;
      
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours} jam lalu`;
      
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} hari lalu`;
    } catch (e) {
      return "Baru saja";
    }
  };

  return (
    <section 
      id="bukutamu" 
      className="relative py-24 px-6 bg-stone-900 text-stone-100 flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
      
      <div className="max-w-4xl w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* LEFT COLUMN: RSVP FORM */}
        <div className="lg:col-span-5 space-y-8 text-left">
          <div className="space-y-3">
            <p className="tracking-[0.25em] text-xs font-semibold text-amber-400 font-display">KONFIRMASI KEHADIRAN</p>
            <h2 className="text-4xl font-handwritten text-amber-305">Buku Tamu &amp; RSVP</h2>
            <p className="text-xs text-stone-400 font-sans leading-relaxed">
              Silakan konfirmasikan kehadiran Anda terlebih dahulu untuk memudahkan penyusunan hidangan & sarana pesta. Tuliskan ucapan selamat serta doa terbaik bagi kedua mempelai.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-stone-950/70 backdrop-blur-sm border border-stone-850 p-6 rounded-3xl space-y-5">
            {/* Nama Input */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1.5 font-serif">Nama Lengkap</label>
              <input
                type="text"
                placeholder="cth. Budi Prasetyo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 focus:border-amber-400 focus:outline-none rounded-xl px-4 py-2.5 text-stone-200 text-base md:text-sm font-sans transition-all"
                required
              />
            </div>

            {/* Hubungan Input */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1.5 font-serif">Hubungan / Kerabat</label>
              <input
                type="text"
                placeholder="cth. Teman Kuliah, Sepupu Shinta, Tetangga"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 focus:border-amber-400 focus:outline-none rounded-xl px-4 py-2.5 text-stone-200 text-base md:text-sm font-sans transition-all"
              />
            </div>

            {/* RSVP Radio Buttons */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2 font-serif">Konfirmasi Kehadiran</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "hadir", label: "Hadir" },
                  { value: "ragu", label: "Ragu-ragu" },
                  { value: "absen", label: "Absen" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer select-none transition-all ${
                      rsvpHadir === option.value
                        ? "bg-amber-500/10 border-amber-500 text-amber-300 shadow-md"
                        : "bg-stone-900/60 border-stone-850 text-stone-400 hover:border-stone-800 hover:text-stone-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="rsvpHadir"
                      value={option.value}
                      checked={rsvpHadir === option.value}
                      onChange={(e) => setRsvpHadir(e.target.value)}
                      className="sr-only"
                    />
                    <span className="text-xs font-medium font-sans">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Count guests attendance */}
            {rsvpHadir !== "absen" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="overflow-hidden"
              >
                <label className="block text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1.5 font-serif">Jumlah Kehadiran (Orang)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={countGuests}
                    onChange={(e) => setCountGuests(Number(e.target.value))}
                    className="w-full accent-amber-500 h-1.5 bg-stone-900 rounded-lg cursor-pointer"
                  />
                  <span className="px-3 py-1 bg-stone-900 text-stone-200 rounded-md border border-stone-850 text-xs font-serif font-bold min-w-[3rem] text-center">
                    {countGuests} Pax
                  </span>
                </div>
              </motion.div>
            )}

            {/* Congratulations / Prayers Comment */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1.5 font-serif">Ucapan / Doa untuk Pengantin</label>
              <textarea
                rows={3}
                placeholder="Tuliskan ucapan selamat dan doa tulus bagi Gian & Cucu..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 focus:border-amber-400 focus:outline-none rounded-xl px-4 py-2.5 text-stone-200 text-base md:text-sm font-sans transition-all resize-none"
                required
              />
            </div>

            {/* Status alerts */}
            {errorMsg && (
              <div className="text-red-400 text-xs bg-red-500/10 px-3 py-2 border border-red-500/15 rounded-xl font-medium">
                {errorMsg}
              </div>
            )}
            
            {successMsg && (
              <div className="text-green-400 text-xs bg-green-500/10 px-3 py-2 border border-green-500/15 rounded-xl font-medium flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-green-300" />
                <span>Terima kasih! RSVP & doa Anda berhasil dikirim.</span>
              </div>
            )}

            {/* Confirm Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-stone-950 text-xs font-serif font-extrabold tracking-wider uppercase rounded-xl shadow-md hover:from-amber-400 hover:to-yellow-500 transition-all cursor-pointer disabled:opacity-50"
              id="btn-rsvp-submit"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              <span>{submitting ? "Mengirim rsvp..." : "Kirim RSVP & Ucapan"}</span>
            </motion.button>
          </form>
        </div>

        {/* RIGHT COLUMN: GUEST MESSAGES TIMELINE */}
        <div className="lg:col-span-7 space-y-6 text-left w-full">
          <div className="flex items-center justify-between border-b border-stone-800 pb-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-400" />
              <h3 className="font-serif font-bold text-lg">Ucapan Kebahagiaan</h3>
            </div>
            <div className="text-[11px] text-stone-400 font-sans font-medium flex items-center gap-1.5 bg-stone-950 px-3 py-1 rounded-full border border-stone-850">
              <Users className="w-3 h-3 text-amber-500" />
              <span>{entries.length} Ucapan Terkirim</span>
            </div>
          </div>

          <div className="max-h-[500px] overflow-y-auto pr-2 space-y-4 shadow-inner custom-scrollbar-pane">
            <AnimatePresence initial={false}>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-2">
                  <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  <p className="text-stone-500 text-xs font-sans tracking-wide">Memuat ucapan doa...</p>
                </div>
              ) : entries.length === 0 ? (
                <div className="text-center py-16 bg-stone-950/20 rounded-2xl border border-dashed border-stone-800">
                  <MessageSquare className="w-10 h-10 text-stone-600 mx-auto mb-2" />
                  <p className="text-stone-400 text-sm font-sans font-medium">Belum ada ucapan</p>
                  <p className="text-stone-500 text-xs mt-1">Jadilah yang pertama untuk mendoakan mempelai!</p>
                </div>
              ) : (
                entries.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: -20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="p-5 bg-stone-950/45 border border-stone-850 rounded-2xl space-y-3 relative overflow-hidden group hover:bg-stone-950/65 hover:border-amber-400/10 transition-all"
                  >
                    {/* Decorative initial bubble avatar */}
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-700/30 to-amber-900/30 border border-amber-600/20 text-amber-300 rounded-full flex items-center justify-center font-serif font-bold shrink-0 shadow-sm uppercase">
                        {item.name.charAt(0)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        {/* Name and relationship tag */}
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h4 className="font-serif font-bold text-sm text-stone-200 tracking-wide truncate">
                            {item.name}
                          </h4>
                          <span className="text-[10px] bg-stone-900 text-stone-400 px-2 py-0.5 rounded border border-stone-800 truncate font-sans">
                            {item.relationship}
                          </span>
                        </div>
                        
                        {/* Time or RSVP tag */}
                        <div className="flex flex-wrap items-center gap-3">
                          {getRsvpBadge(item.rsvpHadir)}
                          {item.countGuests > 0 && (
                            <span className="text-[10px] text-stone-400 font-sans flex items-center gap-1 border-l border-stone-800 pl-3">
                              <Users className="w-3 h-3 text-amber-500" />
                              <span>{item.countGuests} Orang</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-stone-300 text-xs md:text-sm font-sans whitespace-pre-wrap leading-relaxed border-t border-stone-900/40 pt-2 pl-1 italic font-light">
                      &quot;{item.comment}&quot;
                    </p>

                    <div className="flex items-center justify-end gap-1 text-[9px] text-stone-500 font-sans font-medium">
                      <Clock className="w-2.5 h-2.5" />
                      <span>{formatTimeAgo(item.createdAt)}</span>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
}
