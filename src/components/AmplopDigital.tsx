import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Gift, CreditCard, Clipboard, Check, MapPin, Sparkles } from "lucide-react";
import { bcaAccount, mandiriAccount, giftAddress } from "../data";

export default function AmplopDigital() {
  const [showGiftOptions, setShowGiftOptions] = useState(false);
  const [copiedBca, setCopiedBca] = useState(false);
  const [copiedMandiri, setCopiedMandiri] = useState(false);

  const copyText = (text: string, type: "bca" | "mandiri") => {
    navigator.clipboard.writeText(text);
    if (type === "bca") {
      setCopiedBca(true);
      setTimeout(() => setCopiedBca(false), 2000);
    } else {
      setCopiedMandiri(true);
      setTimeout(() => setCopiedMandiri(false), 2000);
    }
  };

  return (
    <section 
      id="hadiah" 
      className="relative py-24 px-6 bg-stone-50 text-stone-800 flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-stone-250 to-transparent" />

      <div className="max-w-3xl w-full relative z-10 flex flex-col items-center text-center space-y-12">
        
        {/* Header Section */}
        <div className="space-y-3">
          <p className="tracking-[0.25em] text-xs font-semibold text-amber-700 font-display">KASIH SAYANG &amp; PERHATIAN</p>
          <h2 className="text-4xl font-handwritten text-amber-900">Kirim Amplop Digital</h2>
          <p className="text-stone-500 font-sans max-w-lg mx-auto text-xs leading-relaxed">
            Doa restu Anda merupakan karunia terindah bagi kami. Namun jika Anda bermaksud memberi tanda kasih mata kepada kami, silakan salin rekening bank atau kirim kado fisik di bawah ini:
          </p>
        </div>

        {/* Gift Trigger Button */}
        {!showGiftOptions ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowGiftOptions(true)}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-serif font-bold text-xs rounded-full tracking-wider uppercase shadow-md hover:shadow-lg transition-all cursor-pointer"
            id="btn-show-gift"
          >
            <Gift className="w-4 h-4" />
            <span>Berikan Amplop Digital / Kado</span>
          </motion.button>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl px-2"
          >
            
            {/* BCA CARD */}
            <div className="bg-white border border-stone-200/80 p-6 rounded-2xl shadow-sm text-left flex flex-col justify-between relative overflow-hidden group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-serif tracking-wider font-semibold text-amber-700">TRANSFER BANK</span>
                  <div className="p-1.5 bg-amber-50 rounded-lg text-amber-800">
                    <CreditCard className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-serif font-extrabold text-sm text-stone-800">{bcaAccount.bankName}</h4>
                  <p className="text-xl font-mono text-stone-900 tracking-wider font-semibold">{bcaAccount.number}</p>
                  <p className="text-stone-500 text-xs font-medium uppercase tracking-wide">A.n. {bcaAccount.name}</p>
                </div>
              </div>

              <button
                onClick={() => copyText(bcaAccount.number, "bca")}
                className="mt-6 flex items-center justify-center gap-1.5 w-full py-2.5 bg-stone-900 text-white hover:bg-stone-850 text-xs font-serif font-semibold rounded-xl transition-all cursor-pointer active:scale-95 shadow-sm"
              >
                {copiedBca ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Clipboard className="w-3.5 h-3.5" />}
                <span>{copiedBca ? "Rekening Tersalin" : "Salin No. Rekening"}</span>
              </button>
            </div>

            {/* MANDIRI CARD */}
            <div className="bg-white border border-stone-200/80 p-6 rounded-2xl shadow-sm text-left flex flex-col justify-between relative overflow-hidden group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-serif tracking-wider font-semibold text-amber-700">TRANSFER BANK</span>
                  <div className="p-1.5 bg-amber-50 rounded-lg text-amber-800">
                    <CreditCard className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-serif font-extrabold text-sm text-stone-800">{mandiriAccount.bankName}</h4>
                  <p className="text-xl font-mono text-stone-900 tracking-wider font-semibold">{mandiriAccount.number}</p>
                  <p className="text-stone-500 text-xs font-medium uppercase tracking-wide">A.n. {mandiriAccount.name}</p>
                </div>
              </div>

              <button
                onClick={() => copyText(mandiriAccount.number, "mandiri")}
                className="mt-6 flex items-center justify-center gap-1.5 w-full py-2.5 bg-stone-900 text-white hover:bg-stone-850 text-xs font-serif font-semibold rounded-xl transition-all cursor-pointer active:scale-95 shadow-sm"
              >
                {copiedMandiri ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Clipboard className="w-3.5 h-3.5" />}
                <span>{copiedMandiri ? "Rekening Tersalin" : "Salin No. Rekening"}</span>
              </button>
            </div>

            {/* DIRECT SHIPPING ADDRESS / PHYSICAL GIFT CARD (Centered span) */}
            <div className="md:col-span-2 bg-gradient-to-r from-amber-500/5 to-yellow-600/5 border border-amber-500/10 p-6 rounded-2xl text-left space-y-3 shadow-inner">
              <div className="flex items-center gap-2 text-amber-800">
                <MapPin className="w-4 h-4 shrink-0" />
                <h4 className="font-serif font-bold text-sm tracking-wide">Pengiriman Kado Fisik</h4>
              </div>
              <div className="text-stone-700 font-sans text-xs space-y-1.5 leading-relaxed">
                <p className="font-medium text-stone-800 uppercase tracking-wide">{giftAddress.name}</p>
                <p className="text-stone-600 font-light">{giftAddress.address}</p>
                <p className="text-stone-500 font-medium">Penerima: {giftAddress.receiver}</p>
              </div>
            </div>

          </motion.div>
        )}

      </div>
    </section>
  );
}
