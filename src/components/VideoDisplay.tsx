import React from "react";

type VideoDisplayProps = {
  url: string; // Explicitly define the type as a string
};

const VideoDisplay: React.FC<VideoDisplayProps> = ({ url }) => {
  const getYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const isYouTubeUrl = (url: string): boolean => {
    if (!url) return false;
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  if (!url) return null;

  if (isYouTubeUrl(url)) {
    const videoId = getYouTubeVideoId(url);
    if (!videoId) return null;

    return (
      <div className="backdrop-blur-lg bg-white/10 p-6 rounded-2xl border border-white/20 transition-all duration-300 hover:bg-gradient-to-r from-red-700 to-purple-700 hover:shadow-2xl">
        <div className="relative w-full pt-[56.25%] rounded-xl overflow-hidden">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
        >
          Open in YouTube
        </a>
      </div>
    );
  }

  // Handle other video types (generic video embed)
  return (
    <div className="backdrop-blur-lg bg-white/10 p-6 rounded-2xl border border-white/20 transition-all duration-300 hover:bg-gradient-to-r from-red-700 to-purple-700 hover:shadow-2xl">
      <div className="relative w-full pt-[56.25%] rounded-xl overflow-hidden">
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={url}
          title="Video Player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default VideoDisplay;
