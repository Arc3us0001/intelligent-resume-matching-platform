import { useState, useCallback } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Upload as UploadIcon, FileText, X, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useParseResume } from "@/hooks/useCandidates";
import { useRunMatching } from "@/hooks/useMatches";
import { supabase } from "@/integrations/supabase/client";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  status: "uploading" | "parsing" | "completed" | "error";
  progress: number;
  error?: string;
}

export default function Upload() {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const { toast } = useToast();
  const parseResume = useParseResume();
  const runMatching = useRunMatching();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = async (file: File) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newFile: UploadedFile = {
      id,
      name: file.name,
      size: file.size,
      status: "uploading",
      progress: 0,
    };

    setFiles((prev) => [...prev, newFile]);

    try {
      // Upload file to storage
      setFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, progress: 30 } : f))
      );

      const fileName = `${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(fileName, file);

      if (uploadError) {
        throw new Error("Failed to upload file");
      }

      setFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, progress: 60 } : f))
      );

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("resumes")
        .getPublicUrl(fileName);

      // Extract text from file (for demo, we'll read as text - in production use a PDF parser)
      const resumeText = await file.text();

      setFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: "parsing", progress: 100 } : f))
      );

      // Parse resume with AI
      const result = await parseResume.mutateAsync({
        resumeText,
        resumeUrl: urlData.publicUrl,
        fileName: file.name,
      });

      setFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: "completed" } : f))
      );

      toast({
        title: "Resume Parsed Successfully",
        description: `${result.parsedData.full_name} has been added to candidates.`,
      });

      // Run matching for the new candidate
      runMatching.mutate({ candidateId: result.candidate.id });

    } catch (error) {
      console.error("Upload error:", error);
      setFiles((prev) =>
        prev.map((f) =>
          f.id === id
            ? { ...f, status: "error", error: error instanceof Error ? error.message : "Upload failed" }
            : f
        )
      );
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to process resume",
        variant: "destructive",
      });
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (file) =>
        file.type === "application/pdf" ||
        file.type === "application/msword" ||
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.type === "text/plain"
    );

    droppedFiles.forEach(processFile);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    selectedFiles.forEach(processFile);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <AppLayout title="Upload Resumes" subtitle="Parse and extract candidate information">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300",
            isDragging
              ? "border-primary bg-primary/5 scale-[1.02]"
              : "border-border hover:border-primary/50 hover:bg-secondary/30"
          )}
        >
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            multiple
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <div className="flex flex-col items-center gap-4">
            <div
              className={cn(
                "flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300",
                isDragging ? "gradient-primary scale-110" : "bg-secondary"
              )}
            >
              <UploadIcon
                className={cn(
                  "h-8 w-8 transition-colors",
                  isDragging ? "text-primary-foreground" : "text-muted-foreground"
                )}
              />
            </div>

            <div>
              <p className="font-heading text-lg font-semibold text-foreground">
                {isDragging ? "Drop files here" : "Drag & drop resumes"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                or click to browse • PDF, DOC, DOCX, TXT supported
              </p>
            </div>

            <Button variant="gradient" size="lg" className="mt-2">
              Select Files
            </Button>
          </div>
        </div>

        {/* Uploaded Files List */}
        {files.length > 0 && (
          <div className="card-elevated divide-y divide-border animate-slide-up">
            <div className="p-4 flex items-center justify-between">
              <h3 className="font-heading font-semibold text-foreground">
                Uploaded Files ({files.length})
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setFiles([])}>
                Clear All
              </Button>
            </div>

            {files.map((file) => (
              <div key={file.id} className="p-4 flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
                </div>

                <div className="flex items-center gap-3">
                  {file.status === "uploading" && (
                    <div className="w-24">
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-300"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Uploading...</p>
                    </div>
                  )}

                  {file.status === "parsing" && (
                    <div className="flex items-center gap-2 text-accent">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Parsing with AI...</span>
                    </div>
                  )}

                  {file.status === "completed" && (
                    <div className="flex items-center gap-2 text-success">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">Completed</span>
                    </div>
                  )}

                  {file.status === "error" && (
                    <div className="flex items-center gap-2 text-destructive">
                      <X className="h-4 w-4" />
                      <span className="text-sm">{file.error || "Error"}</span>
                    </div>
                  )}

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(file.id)}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tips Section */}
        <div className="card-elevated p-6">
          <h3 className="font-heading font-semibold text-foreground mb-4">Upload Tips</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Upload resumes in PDF or TXT format for best parsing results
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              AI will automatically extract skills, experience, and contact info
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Parsed candidates are instantly matched against active job postings
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              View matches in the Matching tab after upload
            </li>
          </ul>
        </div>
      </div>
    </AppLayout>
  );
}
