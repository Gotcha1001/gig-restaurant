<<<<<<< HEAD
export default function AudioPlayer({ tracks }: { tracks: string[] }) {
  return (
    <div className="space-y-4">
      {tracks.map((track, index) => (
        <div key={track} className="p-4 bg-gray-100 rounded-lg">
          <p className="mb-2 font-medium">Track {index + 1}</p>
          <audio controls className="w-full">
            <source src={track} type="audio/mpeg" />
=======
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
>>>>>>> 0ab92bd7a3fc458774f0936e030608437230ab59
            Your browser does not support the audio element.
          </audio>
        </div>
      ))}
    </div>
  );
}
