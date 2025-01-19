import { useState } from "react";
<<<<<<< HEAD
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AudioUploadProps {
  onUploadComplete: (urls: string[]) => void;
  existingTracks?: string[];
=======
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
>>>>>>> 0ab92bd7a3fc458774f0936e030608437230ab59
}

export default function AudioUpload({
  onUploadComplete,
  existingTracks = [],
}: AudioUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
<<<<<<< HEAD
  const supabase = createClientComponentClient();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
=======
  const [trackName, setTrackName] = useState("");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!trackName.trim()) {
        throw new Error("Please enter a track name");
      }

>>>>>>> 0ab92bd7a3fc458774f0936e030608437230ab59
      setUploading(true);
      setError(null);

      const files = e.target.files;
      if (!files) return;

<<<<<<< HEAD
      // Check file count
=======
>>>>>>> 0ab92bd7a3fc458774f0936e030608437230ab59
      if (files.length + existingTracks.length > 4) {
        throw new Error("Maximum 4 audio tracks allowed");
      }

<<<<<<< HEAD
      // Check file types and sizes
=======
      // Validate files
>>>>>>> 0ab92bd7a3fc458774f0936e030608437230ab59
      for (const file of files) {
        if (!file.type.startsWith("audio/")) {
          throw new Error("Only audio files are allowed");
        }
        if (file.size > 10 * 1024 * 1024) {
<<<<<<< HEAD
          // 10MB limit
=======
>>>>>>> 0ab92bd7a3fc458774f0936e030608437230ab59
          throw new Error("Files must be under 10MB");
        }
      }

      const uploadPromises = Array.from(files).map(async (file) => {
<<<<<<< HEAD
        const fileName = `${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("audio-tracks")
          .upload(`public/${fileName}`, file);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage
          .from("audio-tracks")
          .getPublicUrl(`public/${fileName}`);

        return publicUrl;
      });

      const urls = await Promise.all(uploadPromises);
      onUploadComplete([...existingTracks, ...urls]);
=======
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
>>>>>>> 0ab92bd7a3fc458774f0936e030608437230ab59
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

<<<<<<< HEAD
  return (
    <div className="space-y-4">
      <div>
=======
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
>>>>>>> 0ab92bd7a3fc458774f0936e030608437230ab59
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
<<<<<<< HEAD
          disabled={uploading || existingTracks.length >= 4}
          className="w-full"
        >
          {uploading ? "Uploading..." : "Upload Audio Tracks"}
        </Button>
        <p className="text-sm text-gray-500 mt-2">
=======
          disabled={
            uploading || existingTracks.length >= 4 || !trackName.trim()
          }
          className="w-full"
        >
          {uploading ? "Uploading..." : "Upload Audio Track"}
        </Button>
        <p className="text-sm text-gray-500">
>>>>>>> 0ab92bd7a3fc458774f0936e030608437230ab59
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
<<<<<<< HEAD
          {existingTracks.map((track, index) => (
            <div
              key={track}
              className="flex items-center justify-between p-2 bg-gray-100 rounded"
            >
              <span>Track {index + 1}</span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  const newTracks = existingTracks.filter((t) => t !== track);
                  onUploadComplete(newTracks);
                }}
=======
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
>>>>>>> 0ab92bd7a3fc458774f0936e030608437230ab59
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
