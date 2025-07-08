import { FictionalFolder } from '../types';

/**
 * This file contains the data for the simulated file system.
 * It includes a list of folders, each containing a list of fictional files.
 * These files have various properties (name, extension, size, type) to allow
 * for comprehensive testing of the file upload validation logic.
 *
 * - Valid files for upload are named "act de identitate", "trimitere medicala", or "istoric medical".
 * - Valid extensions are "pdf", "jpg", "png".
 * - Valid size is under 5MB.
 */
export const fileSystemData: FictionalFolder[] = [
  {
    name: "Documents",
    files: [
      { name: "act de identitate", extension: "jpg", size: 1.2 * 1024 * 1024, type: "image/jpeg" }, // VALID
      { name: "trimitere medicala", extension: "pdf", size: 0.5 * 1024 * 1024, type: "application/pdf" }, // VALID
      { name: "istoric medical", extension: "png", size: 4.9 * 1024 * 1024, type: "image/png" }, // VALID
      { name: "Contract inchiriere", extension: "docx", size: 500 * 1024, type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }, // INVALID type
      { name: "Buget 2024", extension: "xlsx", size: 7.8 * 1024 * 1024, type: "application/vnd.ms-excel" }, // INVALID type & size
      { name: "Prezentare", extension: "pptx", size: 12.3 * 1024 * 1024, type: "application/vnd.openxmlformats-officedocument.presentationml.presentation" }, // INVALID type & size
      { name: "factura_curent", extension: "pdf", size: 200 * 1024, type: "application/pdf" }, // INVALID name
      { name: "CV Europass", extension: "pdf", size: 1.1 * 1024 * 1024, type: "application/pdf" }, // INVALID name
      { name: "adeverinta_medic", extension: "jpg", size: 2.5 * 1024 * 1024, type: "image/jpeg" }, // INVALID name
      { name: "Plan de afaceri", extension: "docx", size: 3.2 * 1024 * 1024, type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
      { name: "Poza pasaport", extension: "tiff", size: 6.0 * 1024 * 1024, type: "image/tiff" },
      { name: "Raport anual", extension: "pdf", size: 5.1 * 1024 * 1024, type: "application/pdf" },
      { name: "Proiect cercetare", extension: "pdf", size: 3.4 * 1024 * 1024, type: "application/pdf" },
      { name: "Scrisoare de intentie", extension: "docx", size: 150 * 1024, type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
    ],
  },
  {
    name: "Downloads",
    files: [
      { name: "setup_app", extension: "exe", size: 55 * 1024 * 1024, type: "application/x-msdownload" },
      { name: "driver_video", extension: "zip", size: 250 * 1024 * 1024, type: "application/zip" },
      { name: "film_vacanta", extension: "mov", size: 780 * 1024 * 1024, type: "video/quicktime" },
      { name: "trimitere medicala", extension: "pdf", size: 300 * 1024, type: "application/pdf" }, // VALID
      { name: "subtitrare", extension: "srt", size: 50 * 1024, type: "text/plain" },
      { name: "ebook_carte", extension: "epub", size: 2.5 * 1024 * 1024, type: "application/epub+zip" },
      { name: "font_awesome", extension: "ttf", size: 150 * 1024, type: "font/ttf" },
      { name: "whitepaper_crypto", extension: "pdf", size: 1.8 * 1024 * 1024, type: "application/pdf" },
      { name: "arhiva_proiect", extension: "rar", size: 89 * 1024 * 1024, type: "application/x-rar-compressed" },
      { name: "act de identitate", extension: "png", size: 2.1 * 1024 * 1024, type: "image/png" }, // VALID
      { name: "logo_firma", extension: "svg", size: 25 * 1024, type: "image/svg+xml" },
      { name: "sunet_notificare", extension: "mp3", size: 300 * 1024, type: "audio/mpeg" },
    ],
  },
  {
    name: "Pictures",
    files: [
      { name: "Vacanta_Grecia_001", extension: "jpg", size: 4.5 * 1024 * 1024, type: "image/jpeg" },
      { name: "act de identitate", extension: "jpg", size: 3.1 * 1024 * 1024, type: "image/jpeg" }, // VALID
      { name: "Nunta_Ana_050", extension: "jpg", size: 6.2 * 1024 * 1024, type: "image/jpeg" }, // Invalid size
      { name: "Screenshot_2024-03-11", extension: "png", size: 1.1 * 1024 * 1024, type: "image/png" },
      { name: "Familie_Craciun", extension: "jpg", size: 5.5 * 1024 * 1024, type: "image/jpeg" },
      { name: "selfie_munte", extension: "jpg", size: 3.9 * 1024 * 1024, type: "image/jpeg" },
      { name: "istoric medical", extension: "png", size: 4.8 * 1024 * 1024, type: "image/png" }, // VALID
      { name: "logo_design_raw", extension: "psd", size: 45 * 1024 * 1024, type: "image/vnd.adobe.photoshop" },
      { name: "panorama_oras", extension: "jpg", size: 15.2 * 1024 * 1024, type: "image/jpeg" },
      { name: "flori_gradina", extension: "jpg", size: 4.1 * 1024 * 1024, type: "image/jpeg" },
      { name: "animal_de_companie", extension: "jpg", size: 3.5 * 1024 * 1024, type: "image/jpeg" },
    ],
  },
  {
    name: "Music",
    files: [
      { name: "melodie_preferata", extension: "mp3", size: 5.2 * 1024 * 1024, type: "audio/mpeg" },
      { name: "album_rock", extension: "flac", size: 35 * 1024 * 1024, type: "audio/flac" },
      { name: "podcast_ep_12", extension: "mp3", size: 45 * 1024 * 1024, type: "audio/mpeg" },
      { name: "sunete_natura", extension: "wav", size: 50 * 1024 * 1024, type: "audio/wav" },
      { name: "interviu_radio", extension: "m4a", size: 22 * 1024 * 1024, type: "audio/mp4" },
      { name: "concert_live", extension: "mp3", size: 150 * 1024 * 1024, type: "audio/mpeg" },
      { name: "demo_piesa_noua", extension: "mp3", size: 2.1 * 1024 * 1024, type: "audio/mpeg" },
    ],
  },
  {
    name: "Videos",
    files: [
      { name: "tutorial_programare", extension: "mp4", size: 350 * 1024 * 1024, type: "video/mp4" },
      { name: "clip_amuzant", extension: "mov", size: 50 * 1024 * 1024, type: "video/quicktime" },
      { name: "inregistrare_meeting", extension: "mkv", size: 600 * 1024 * 1024, type: "video/x-matroska" },
      { name: "drona_peisaj", extension: "mp4", size: 1.2 * 1024 * 1024 * 1024, type: "video/mp4" },
      { name: "animatie_scurta", extension: "avi", size: 120 * 1024 * 1024, type: "video/x-msvideo" },
      { name: "vlog_saptamanal", extension: "mp4", size: 850 * 1024 * 1024, type: "video/mp4" },
    ],
  },
  {
    name: "Desktop",
    files: [
      { name: "shortcut_app", extension: "lnk", size: 1 * 1024, type: "application/x-ms-shortcut" },
      { name: "TODO_list", extension: "txt", size: 5 * 1024, type: "text/plain" },
      { name: "trimitere medicala", extension: "pdf", size: 256 * 1024, type: "application/pdf" }, // VALID
      { name: "raport_temporar", extension: "tmp", size: 10 * 1024, type: "application/octet-stream" },
      { name: "istoric medical", extension: "jpg", size: 6.8 * 1024 * 1024, type: "image/jpeg" }, // INVALID size
      { name: "notes", extension: "txt", size: 2 * 1024, type: "text/plain" },
    ],
  },
];
