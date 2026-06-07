import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight, ZoomIn, Heart, Calendar, Sparkles, Camera } from "lucide-react";
import { galleryImages, loveStories } from "../data";
import { resolvePhotoUrl, getApiUrl } from "../utils";

interface Photo {
  id: string;
  url: string;
  caption: string;
}

export default function Galeri() {
  const [activeTab, setActiveTab] = useState<"galeri" | "kisah">("galeri");
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [photosList, setPhotosList] = useState<Photo[]>(galleryImages);

  const fetchPhotos = async () => {
    try {
      const res = await fetch(getApiUrl("/api/photos"));
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data) && data.length > 0) {
          setPhotosList(data);
        } else {
          setPhotosList(galleryImages);
        }
      }
    } catch (err) {
      console.error("Gagal mendapatkan galeri foto dari backend:", err);
      setPhotosList(galleryImages);
    }
  };

  useEffect(() => {
    fetchPhotos();
    const interval = setInterval(fetchPhotos, 10000); // 10s auto sync
    return () => clearInterval(interval);
  }, []);

  const openLightbox = (index: number) => {
    setActivePhotoIndex(index);
  };

  const closeLightbox = () => {
    setActivePhotoIndex(null);
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIndex !== null) {
      setActivePhotoIndex(
        activePhotoIndex === 0 ? photosList.length - 1 : activePhotoIndex - 1
      );
    }
  };

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIndex !== null) {
      setActivePhotoIndex(
        activePhotoIndex === photosList.length - 1 ? 0 : activePhotoIndex + 1
      );
    }
  };

  return (
    <section 
      id="galeri" 
      className="relative py-24 px-4 sm:px-6 bg-stone-50 text-stone-800 flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="max-w-6xl w-full relative z-10 flex flex-col items-center space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <p className="tracking-[0.25em] text-xs font-semibold text-amber-700 font-display">GALERI & PERJALANAN</p>
          <h2 className="text-4xl font-handwritten text-amber-900">Momen Indah & Seri Kisah</h2>
          <div className="h-[1px] w-16 bg-amber-600/35 mx-auto mt-4" />
        </div>

        {/* Custom Premium Tab Controls */}
        <div className="flex items-center gap-1.5 bg-stone-150 p-1.5 rounded-full border border-stone-200 shadow-inner max-w-sm w-full mx-auto">
          <button
            onClick={() => setActiveTab("galeri")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-full text-xs font-medium uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              activeTab === "galeri"
                ? "bg-amber-800 text-white shadow-md"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Galeri Foto</span>
          </button>
          <button
            onClick={() => setActiveTab("kisah")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-full text-xs font-medium uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              activeTab === "kisah"
                ? "bg-amber-800 text-white shadow-md"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Kisah Cinta</span>
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "galeri" ? (
            <motion.div
              key="photo-grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 w-full"
            >
              {photosList.map((img, index) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                  onClick={() => openLightbox(index)}
                  className="group aspect-[4/3] relative overflow-hidden rounded-2xl bg-stone-200 border border-stone-100 shadow-sm cursor-pointer"
                >
                  {/* Image with zoom on hover */}
                  <img
                    src={resolvePhotoUrl(img.url)}
                    alt={img.caption}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Luxury gold hover vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400 flex flex-col justify-end p-4 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-white text-xs sm:text-sm font-serif truncate tracking-wide font-medium mr-2">
                        {img.caption}
                      </span>
                      <div className="p-1.5 bg-amber-500 rounded-lg text-stone-950 shrink-0">
                        <ZoomIn className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="love-story"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-5xl mx-auto py-4 relative"
            >
              {/* Connecting Vertical Axis line on desktop */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 top-12 bottom-12 w-[1px] bg-gradient-to-b from-amber-400/10 via-amber-700/35 to-amber-400/10" />

              <div className="space-y-16 md:space-y-28 relative">
                {loveStories.map((story, index) => {
                  const isEven = index % 2 === 0;
                  return (
                    <div
                      key={story.id}
                      className={`flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16 w-full ${
                        isEven ? "" : "md:flex-row-reverse"
                      }`}
                    >
                      {/* Image block */}
                      <div className="w-full md:w-[46%] flex justify-center">
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95, x: isEven ? -25 : 25 }}
                          whileInView={{ opacity: 1, scale: 1, x: 0 }}
                          viewport={{ once: true, margin: "-60px" }}
                          transition={{ duration: 0.7 }}
                          className="relative group overflow-hidden rounded-3xl border border-stone-200/60 shadow-md hover:shadow-xl transition-all duration-500 bg-white max-w-sm md:max-w-md aspect-[4/3] w-full"
                        >
                          <img
                            src={resolvePhotoUrl(story.imageUrl)}
                            alt={story.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute top-4 left-4 bg-white/95 px-3.5 py-1.5 rounded-full border border-amber-100 text-[10px] md:text-xs font-semibold uppercase tracking-widest text-amber-900 shadow-sm flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-amber-700" />
                            {story.dateStr}
                          </div>
                        </motion.div>
                      </div>

                      {/* Timeline Central Badge Nodes (Only Desktop) */}
                      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-stone-50 border-2 border-amber-700/60 shadow-md items-center justify-center z-10">
                        <div className="w-3 h-3 rounded-full bg-amber-800 animate-pulse" />
                      </div>

                      {/* Story Context Block */}
                      <motion.div 
                        initial={{ opacity: 0, x: isEven ? 25 : -25 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.7 }}
                        className="w-full md:w-[46%] text-left space-y-4 px-2 md:px-0"
                      >
                        {/* Mobile and tablet visual category date badge */}
                        <div className="inline-flex md:hidden items-center gap-1.5 bg-amber-100/65 text-amber-800 text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full border border-amber-200/50">
                          <Calendar className="w-3 h-3 text-amber-700" />
                          <span>{story.dateStr}</span>
                        </div>

                        <div className="space-y-1.5">
                          <p className="text-amber-700 font-handwritten text-lg sm:text-xl font-medium tracking-wide">
                            Kisah Bagian 0{index + 1}
                          </p>
                          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight leading-tight">
                            {story.title}
                          </h3>
                        </div>

                        <div className="h-[1px] w-12 bg-amber-600/35" />

                        <p className="text-stone-600 text-sm sm:text-base leading-relaxed tracking-normal font-sans pt-1">
                          {story.description}
                        </p>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* LIGHTBOX MODAL OVERLAY */}
      <AnimatePresence>
        {activePhotoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 bg-stone-950/98 z-50 flex flex-col items-center justify-center p-4 backdrop-blur-md"
          >
            {/* Top Close Bar */}
            <div className="absolute top-4 right-4 z-51 flex items-center justify-end w-full max-w-5xl px-4">
              <button
                onClick={closeLightbox}
                className="p-2 bg-stone-900/80 text-white rounded-full border border-stone-800 hover:bg-stone-800 transition-all cursor-pointer shadow-lg active:scale-90"
                title="Tutup Galeri"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Lightbox Content */}
            <div 
              className="relative max-w-4xl w-full flex items-center justify-center h-[70vh] md:h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Back button */}
              <button
                onClick={prevPhoto}
                className="absolute left-2 md:-left-16 z-51 p-3 bg-stone-900/60 hover:bg-stone-900/90 text-white rounded-full border border-stone-800 hover:border-stone-700 transition-all cursor-pointer shadow-xl active:scale-90"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Slider image */}
              <motion.img
                key={activePhotoIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                src={resolvePhotoUrl(photosList[activePhotoIndex].url)}
                alt={photosList[activePhotoIndex].caption}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-full object-contain rounded-xl shadow-2xl border border-stone-900"
              />

              {/* Next button */}
              <button
                onClick={nextPhoto}
                className="absolute right-2 md:-right-16 z-51 p-3 bg-stone-900/60 hover:bg-stone-900/90 text-white rounded-full border border-stone-800 hover:border-stone-700 transition-all cursor-pointer shadow-xl active:scale-90"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Bottom Caption Bar */}
            <div 
              className="mt-6 text-center max-w-xl px-4 flex flex-col items-center gap-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              <h4 className="text-amber-400 font-serif font-semibold text-base tracking-wide">
                {photosList[activePhotoIndex].caption}
              </h4>
              <p className="text-stone-400 text-xs uppercase tracking-[0.2em] font-sans">
                Foto {activePhotoIndex + 1} dari {photosList.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

