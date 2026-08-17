export interface Branch {
  name: string;
  address: string;
  phone: string;
  phoneFull: string;
  email: string;
  hours: string;
  mapQ: string;
  mapEmbedUrl: string;
}

export const DEFAULT_BRANCHES: Branch[] = [
  {
    name: "Pondy Bazaar",
    address: "34, Pondy Bazaar, T.Nagar, Chennai-600017.",
    phone: "98400 88324",
    phoneFull: "9840088324",
    email: "",
    hours: "",
    mapQ: "Kerala+Jewellers+Pondy+Bazaar+Chennai",
    mapEmbedUrl: "",
  },
  {
    name: "Purasawalkam",
    address:
      "G-5, Palace Regency, 80/93, Purasawalkam High Rd, Chennai-600010.",
    phone: "93810 11742",
    phoneFull: "9381011742",
    email: "",
    hours: "",
    mapQ: "Kerala+Jewellers+Purasawalkam+Chennai",
    mapEmbedUrl: "",
  },
  {
    name: "Porur",
    address: "23, Mount Poonamallee High Road, Porur, Chennai-600116.",
    phone: "74488 42244",
    phoneFull: "7448842244",
    email: "",
    hours: "",
    mapQ: "Kerala+Jewellers+Porur+Chennai",
    mapEmbedUrl: "",
  },
];
