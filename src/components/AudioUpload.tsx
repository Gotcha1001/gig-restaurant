import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AudioUploadProps {
  onUploadComplete: (urls: string[]) => void;
  existingTracks?: string[];
}

export default function AudioUpload({
  onUploadComplete,
  existingTracks = [],
}: AudioUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setError(null);

      const files = e.target.files;
      if (!files) return;

      // Check file count
      if (files.length + existingTracks.length > 4) {
        throw new Error("Maximum 4 audio tracks allowed");
      }

      // Check file types and sizes
      for (const file of files) {
        if (!file.type.startsWith("audio/")) {
          throw new Error("Only audio files are allowed");
        }
        if (file.size > 10 * 1024 * 1024) {
          // 10MB limit
          throw new Error("Files must be under 10MB");
        }
      }

      const uploadPromises = Array.from(files).map(async (file) => {
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
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
          disabled={uploading || existingTracks.length >= 4}
          className="w-full"
        >
          {uploading ? "Uploading..." : "Upload Audio Tracks"}
        </Button>
        <p className="text-sm text-gray-500 mt-2">
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
