import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Play, Pause, Volume2, Download } from "lucide-react";

interface MediaPreviewProps {
  url: string;
  type: 'image' | 'video' | 'audio';
  className?: string;
}

export const MediaPreview = ({ url, type, className = "" }: MediaPreviewProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = (element: HTMLVideoElement | HTMLAudioElement) => {
    if (isPlaying) {
      element.pause();
    } else {
      element.play();
    }
    setIsPlaying(!isPlaying);
  };

  const getFileType = (url: string): 'image' | 'video' | 'audio' => {
    if (type !== 'image') return type;
    
    const extension = url.split('.').pop()?.toLowerCase();
    if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(extension || '')) {
      return 'video';
    }
    if (['mp3', 'wav', 'm4a', 'ogg', 'flac'].includes(extension || '')) {
      return 'audio';
    }
    return 'image';
  };

  const fileType = getFileType(url);

  if (fileType === 'image') {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <div className={`cursor-pointer hover:opacity-80 transition-opacity ${className}`}>
            <img 
              src={url} 
              alt="Report attachment" 
              className="w-full h-32 object-cover rounded-lg border"
            />
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-4xl">
          <img 
            src={url} 
            alt="Report attachment" 
            className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
          />
          <div className="flex justify-end mt-4">
            <Button asChild variant="outline" size="sm">
              <a href={url} download target="_blank" rel="noopener noreferrer">
                <Download className="w-4 h-4 mr-2" />
                Download
              </a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (fileType === 'video') {
    return (
      <div className={`relative ${className}`}>
        <video 
          className="w-full h-32 object-cover rounded-lg border"
          controls
          preload="metadata"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          <source src={url} />
          Your browser does not support the video tag.
        </video>
        <div className="absolute top-2 right-2">
          <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          </Button>
        </div>
      </div>
    );
  }

  if (fileType === 'audio') {
    return (
      <div className={`border rounded-lg p-4 bg-muted/30 ${className}`}>
        <div className="flex items-center gap-3">
          <Volume2 className="w-5 h-5 text-muted-foreground" />
          <div className="flex-1">
            <audio 
              className="w-full"
              controls
              preload="metadata"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            >
              <source src={url} />
              Your browser does not support the audio tag.
            </audio>
          </div>
          <Button asChild variant="outline" size="sm">
            <a href={url} download target="_blank" rel="noopener noreferrer">
              <Download className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>
    );
  }

  return null;
};