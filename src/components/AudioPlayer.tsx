type Track = {
  name: string;
  url: string;
};

interface AudioPlayerProps {
  tracks: Track[];
}

export default function AudioPlayer({ tracks }: AudioPlayerProps) {
  return (
    <div className="space-y-4">
      {tracks.map((track) => (
        <div key={track.url} className="space-y-2">
          <p className="font-medium">{track.name}</p>
          <audio controls className="w-full" src={track.url}>
            Your browser does not support the audio element.
          </audio>
        </div>
      ))}
    </div>
  );
}
