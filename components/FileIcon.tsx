import React from 'react';
import { File, FileText, FileImage, FileAudio, FileVideo, FileCode, FileArchive, FileSpreadsheet, FileSliders, FileJson } from 'lucide-react';

interface FileIconProps {
  extension: string;
}

const FileIcon: React.FC<FileIconProps> = ({ extension }) => {
  const size = 20;
  const className = "text-gray-600 dark:text-gray-400";

  switch (extension.toLowerCase()) {
    case 'pdf':
    case 'doc':
    case 'docx':
    case 'txt':
      return <FileText size={size} className={className} />;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'bmp':
    case 'svg':
      return <FileImage size={size} className={className} />;
    case 'mp3':
    case 'wav':
    case 'm4a':
    case 'flac':
      return <FileAudio size={size} className={className} />;
    case 'mp4':
    case 'mov':
    case 'avi':
    case 'mkv':
      return <FileVideo size={size} className={className} />;
    case 'xls':
    case 'xlsx':
    case 'csv':
        return <FileSpreadsheet size={size} className={className} />;
    case 'html':
    case 'css':
    case 'js':
    case 'ts':
    case 'tsx':
      return <FileCode size={size} className={className} />;
    case 'json':
        return <FileJson size={size} className={className} />;
    case 'zip':
    case 'rar':
    case '7z':
      return <FileArchive size={size} className={className} />;
    case 'exe':
    case 'dll':
        return <FileSliders size={size} className={className}/>
    default:
      return <File size={size} className={className} />;
  }
};

export default FileIcon;
