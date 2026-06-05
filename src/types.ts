export interface GuestbookEntry {
  id: string;
  name: string;
  relationship: string;
  rsvpHadir: string; // "hadir", "ragu", "absen"
  countGuests: number;
  comment: string;
  createdAt: string;
}

export interface MempelaDetail {
  role: "pria" | "wanita";
  fullName: string;
  nickName: string;
  photoUrl: string;
  fatherName: string;
  motherName: string;
  instagram: string;
}

export interface AgendaEvent {
  title: string;
  dateStr: string; // e.g., "Sabtu, 12 September 2026"
  timeStr: string; // e.g., "09:00 - 11:00 WIB"
  locationName: string;
  address: string;
  mapEmbedUrl: string;
  mapNavigationUrl: string;
}

export interface LoveStory {
  id: string;
  title: string;
  dateStr: string;
  description: string;
  imageUrl: string;
}

export interface GuestInviterGroup {
  category: string;
  names: string[];
}
