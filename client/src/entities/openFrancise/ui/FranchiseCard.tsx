import React, { useRef, useState } from 'react';
import { MapPin, Play, Image as ImageIcon } from 'lucide-react';
import type { FranchiseT } from '../model/types';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/hooks';
import { deleteFranchise } from '../model/thunks';

export default function FranchiseCard({
  franchise,
  setIsOpen,
}: {
  franchise: FranchiseT;
  setIsOpen: () => void;
}): React.JSX.Element {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [, setIsPlaying] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const dispatch = useAppDispatch();
  const admin = useAppSelector((store) => store.user.user?.user.admin);

  const handlePlayVideo = async (): Promise<void> => {
    setIsVideoVisible(true);
    setIsPlaying(true);
    if (videoRef.current) {
     await videoRef.current.play();
    }
  };

  const handleCloseVideo = (): void => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setIsVideoVisible(false);
  };

  return (
    <div
      key={franchise.id}
      className="card group animate-slide-up relative"
      style={{ animationDelay: `${(franchise.id * 0.1).toString()}s` }}
    >
      <div className="relative">
        <img
          src={franchise.image ? `/api/uploads/${franchise.image}` : '/placeholder.png'}
          alt={`${franchise.city ?? ''} - ${franchise.address}`}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {franchise.video && (
          <>
            <button
              onClick={handlePlayVideo}
              className="absolute top-3 left-3 z-20 p-3 glass-effect rounded-full cursor-pointer"
              aria-label="Play video"
              type="button"
            >
              <Play className="h-8 w-8 text-white" />
            </button>

            {isVideoVisible && (
              <div
                className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[1000]"
                onClick={handleCloseVideo}
              >
                <video
                  ref={videoRef}
                  className="max-w-full max-h-full rounded-lg shadow-lg"
                  controls
                  autoPlay
                  onPause={() => setIsPlaying(false)}
                  onPlay={() => setIsPlaying(true)}
                  onClick={(e) => e.stopPropagation()} // предотвратить закрытие при клике на видео
                  src={`/api/uploads/${franchise.video}`}
                />
                <button
                  onClick={handleCloseVideo}
                  className="absolute top-5 right-5 text-white text-3xl font-bold"
                  aria-label="Close video"
                  type="button"
                >
                  ×
                </button>
              </div>
            )}
          </>
        )}
        <div className="absolute top-3 right-3">
          <div className="glass-effect rounded-full px-3 py-1 text-xs font-medium text-white">
            {franchise.video ? (
              <>
                <Play className="h-3 w-3 mr-1 inline" />
                Видео
              </>
            ) : (
              <>
                <ImageIcon className="h-3 w-3 mr-1 inline" />
                Фото
              </>
            )}
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <div className="flex items-center space-x-2 mb-2">
            <MapPin className="h-4 w-4" />
            <span className="font-semibold">{franchise.city ?? ''}</span>
          </div>
          <p className="text-sm opacity-90">{franchise.address}</p>
        </div>
      </div>
      <div className={`p-4 ${admin ? 'pb-2' : ''}`}>
        <p className="text-sm text-muted-foreground">{franchise.description}</p>
      </div>
      {admin && (
        <div className="flex space-x-2 px-4 pb-4">
          <button
            onClick={setIsOpen}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium text-sm shadow-md hover:shadow-lg flex items-center justify-center space-x-1"
          >
            <span>✏️</span>
            <span>Редактировать</span>
          </button>
          <button
            onClick={() => dispatch(deleteFranchise(franchise.id))}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 font-medium text-sm shadow-md hover:shadow-lg flex items-center justify-center space-x-1"
          >
            <span>🗑️</span>
            <span>Удалить</span>
          </button>
        </div>
      )}
    </div>
  );
}
