import { useState } from "react";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";

interface AudioTrack {
  url: string;
  name: string;
}

interface AudioUploadProps {
  onUploadComplete: (tracks: AudioTrack[]) => void;
  existingTracks?: AudioTrack[];
}

export default function AudioUpload({
  onUploadComplete,
  existingTracks = [],
}: AudioUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trackName, setTrackName] = useState("");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!trackName.trim()) {
        throw new Error("Please enter a track name");
      }

      setUploading(true);
      setError(null);

      const files = e.target.files;
      if (!files) return;

      if (files.length + existingTracks.length > 4) {
        throw new Error("Maximum 4 audio tracks allowed");
      }

      // Validate files
      for (const file of files) {
        if (!file.type.startsWith("audio/")) {
          throw new Error("Only audio files are allowed");
        }
        if (file.size > 10 * 1024 * 1024) {
          throw new Error("Files must be under 10MB");
        }
      }

      const uploadPromises = Array.from(files).map(async (file) => {
        const fileName = `audio-tracks/${Date.now()}-${file.name}`;
        const storageRef = ref(storage, fileName);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        return {
          url: downloadURL,
          name: trackName,
        };
      });

      const newTracks = await Promise.all(uploadPromises);
      onUploadComplete([...existingTracks, ...newTracks]);
      setTrackName(""); // Reset track name after successful upload
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (track: AudioTrack) => {
    try {
      const fileRef = ref(storage, track.url);
      await deleteObject(fileRef);
      const newTracks = existingTracks.filter((t) => t.url !== track.url);
      onUploadComplete(newTracks);
    } catch {
      setError("Failed to delete track");
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Input
          type="text"
          placeholder="Enter track name"
          value={trackName}
          onChange={(e) => setTrackName(e.target.value)}
          disabled={uploading}
        />
        <input
          type="file"
          accept="audio/*"
          multiple
          onChange={handleUpload}
          disabled={uploading || existingTracks.length >= 4}
          className="hidden"
          id="audio-upload"
        />
        <Button
          onClick={() => document.getElementById("audio-upload")?.click()}
          disabled={
            uploading || existingTracks.length >= 4 || !trackName.trim()
          }
          className="w-full"
        >
          {uploading ? "Uploading..." : "Upload Audio Track"}
        </Button>
        <p className="text-sm text-gray-500">
          {`${
            4 - existingTracks.length
          } slots remaining (max 4 tracks, 10MB per file)`}
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {existingTracks.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Uploaded Tracks:</h4>
          {existingTracks.map((track) => (
            <div
              key={track.url}
              className="flex items-center justify-between p-2 bg-gray-100 rounded"
            >
              <span>{track.name}</span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(track)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
