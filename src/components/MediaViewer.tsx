import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Download, ZoomIn, ZoomOut } from "lucide-react";

interface MediaViewerProps {
  urls: string[];
  currentIndex?: number;
}

export const MediaViewer = ({ urls, currentIndex = 0 }: MediaViewerProps) => {
  const [selectedIndex, setSelectedIndex] = useState(currentIndex);
  const [zoom, setZoom] = useState(1);
  const [open, setOpen] = useState(false);

  if (!urls || urls.length === 0) return null;

  const currentUrl = urls[selectedIndex];
  const isVideo = currentUrl?.includes('.mp4') || currentUrl?.includes('.webm') || currentUrl?.includes('.mov');
  const isAudio = currentUrl?.includes('.mp3') || currentUrl?.includes('.wav') || currentUrl?.includes('.m4a');

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % urls.length);
    setZoom(1);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + urls.length) % urls.length);
    setZoom(1);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.5, 5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.5, 0.5));

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {urls.map((url, index) => {
        const isVideoThumb = url.includes('.mp4') || url.includes('.webm') || url.includes('.mov');
        const isAudioThumb = url.includes('.mp3') || url.includes('.wav') || url.includes('.m4a');
        
        return (
          <Dialog key={index} open={open && selectedIndex === index} onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (isOpen) setSelectedIndex(index);
          }}>
            <DialogTrigger asChild>
              <div className="cursor-pointer group relative">
                {isVideoThumb ? (
                  <div className="aspect-video bg-muted rounded-lg border overflow-hidden group-hover:shadow-lg transition-shadow">
                    <video
                      src={url}
                      className="w-full h-full object-cover"
                      muted
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ) : isAudioThumb ? (
                  <div className="aspect-square bg-muted rounded-lg border flex items-center justify-center group-hover:shadow-lg transition-shadow">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-2">
                        <ZoomIn className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-sm text-muted-foreground">Audio File</p>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-square bg-muted rounded-lg border overflow-hidden group-hover:shadow-lg transition-shadow">
                    <img
                      src={url}
                      alt={`Media ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                )}
              </div>
            </DialogTrigger>
            
            <DialogContent className="max-w-4xl max-h-[90vh] p-0">
              <div className="relative bg-black">
                {/* Header */}
                <div className="absolute top-0 left-0 right-0 z-50 bg-black/80 p-4 flex justify-between items-center">
                  <div className="text-white">
                    <span className="text-sm">{selectedIndex + 1} of {urls.length}</span>
                  </div>
                  <div className="flex gap-2">
                    {!isVideo && !isAudio && (
                      <>
                        <Button size="sm" variant="ghost" onClick={handleZoomOut} className="text-white hover:bg-white/20">
                          <ZoomOut className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={handleZoomIn} className="text-white hover:bg-white/20">
                          <ZoomIn className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    <Button size="sm" variant="ghost" asChild className="text-white hover:bg-white/20">
                      <a href={currentUrl} download target="_blank" rel="noopener noreferrer">
                        <Download className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                </div>

                {/* Media Content */}
                <div className="flex items-center justify-center min-h-[60vh] p-16">
                  {isVideo ? (
                    <video
                      src={currentUrl}
                      controls
                      className="max-w-full max-h-full"
                      autoPlay
                    />
                  ) : isAudio ? (
                    <div className="text-center">
                      <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                        <div className="w-8 h-8 bg-white rounded"></div>
                      </div>
                      <audio
                        src={currentUrl}
                        controls
                        className="w-full max-w-md"
                        autoPlay
                      />
                    </div>
                  ) : (
                    <img
                      src={currentUrl}
                      alt={`Media ${selectedIndex + 1}`}
                      className="max-w-full max-h-full object-contain"
                      style={{ transform: `scale(${zoom})` }}
                    />
                  )}
                </div>

                {/* Navigation */}
                {urls.length > 1 && (
                  <>
                    <button
                      onClick={handlePrev}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-colors"
                    >
                      ←
                    </button>
                    <button
                      onClick={handleNext}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-colors"
                    >
                      →
                    </button>
                  </>
                )}

                {/* Thumbnails */}
                {urls.length > 1 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-4">
                    <div className="flex gap-2 justify-center overflow-x-auto">
                      {urls.map((url, idx) => (
                        <button
                          key={idx}
                          onClick={() => { setSelectedIndex(idx); setZoom(1); }}
                          className={`w-16 h-16 rounded overflow-hidden border-2 transition-colors ${
                            idx === selectedIndex ? 'border-white' : 'border-transparent hover:border-white/50'
                          }`}
                        >
                          {url.includes('.mp4') || url.includes('.webm') || url.includes('.mov') ? (
                            <video src={url} className="w-full h-full object-cover" muted />
                          ) : url.includes('.mp3') || url.includes('.wav') || url.includes('.m4a') ? (
                            <div className="w-full h-full bg-primary flex items-center justify-center">
                              <div className="w-4 h-4 bg-white rounded"></div>
                            </div>
                          ) : (
                            <img src={url} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        );
      })}
    </div>
  );
};