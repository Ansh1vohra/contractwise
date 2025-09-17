import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, CheckCircle, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadedFile {
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  id: string;
}

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    
    files.forEach((file) => {
      if (!validTypes.includes(file.type)) {
        // Show error for invalid file type
        return;
      }

      const fileUpload: UploadedFile = {
        file,
        progress: 0,
        status: 'uploading',
        id: Math.random().toString(36).substr(2, 9)
      };

      setUploadedFiles(prev => [...prev, fileUpload]);

      // Simulate upload progress
      simulateUpload(fileUpload.id);
    });
  };

  const simulateUpload = (fileId: string) => {
    const interval = setInterval(() => {
      setUploadedFiles(prev => prev.map(file => {
        if (file.id === fileId) {
          const newProgress = Math.min(file.progress + 10, 100);
          const newStatus = newProgress === 100 ? 'success' : 'uploading';
          return { ...file, progress: newProgress, status: newStatus };
        }
        return file;
      }));
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setUploadedFiles(prev => prev.map(file => 
        file.id === fileId ? { ...file, progress: 100, status: 'success' } : file
      ));
    }, 2000);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.toLowerCase().endsWith('.pdf')) return '📄';
    if (fileName.toLowerCase().endsWith('.docx')) return '📝';
    if (fileName.toLowerCase().endsWith('.txt')) return '📃';
    return '📄';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Upload Contract</h1>
            <p className="text-muted-foreground">
              Upload PDF, DOCX, or TXT files for AI analysis
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate("/dashboard/contracts")}
          >
            Back to Contracts
          </Button>
        </div>

        {/* Upload Area */}
        <Card className="shadow-elegant border-card-border">
          <CardContent className="p-6">
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-12 text-center transition-colors",
                dragActive 
                  ? "border-primary bg-primary/5" 
                  : "border-muted-foreground/25 hover:border-muted-foreground/50"
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Drag and drop files here
              </h3>
              <p className="text-muted-foreground mb-4">
                Supports PDF, DOCX, and TXT files up to 10MB
              </p>
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="mb-2"
              >
                Choose Files
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.docx,.txt"
                onChange={handleFileSelect}
                className="hidden"
              />
              <p className="text-sm text-muted-foreground">
                Maximum file size: 10MB per file
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Upload Status */}
        {uploadedFiles.length > 0 && (
          <Card className="shadow-elegant border-card-border">
            <CardHeader>
              <CardTitle>Upload Progress</CardTitle>
              <CardDescription>
                Track your file uploads and processing status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {uploadedFiles.map((fileUpload) => (
                <div key={fileUpload.id} className="flex items-center space-x-4 p-4 border border-card-border rounded-lg">
                  <div className="text-2xl">
                    {getFileIcon(fileUpload.file.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{fileUpload.file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(fileUpload.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <div className="w-32">
                    {fileUpload.status === 'uploading' && (
                      <Progress value={fileUpload.progress} className="w-full" />
                    )}
                    {fileUpload.status === 'success' && (
                      <div className="flex items-center text-risk-low">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        <span className="text-sm">Complete</span>
                      </div>
                    )}
                    {fileUpload.status === 'error' && (
                      <div className="flex items-center text-risk-high">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        <span className="text-sm">Error</span>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(fileUpload.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Success Message */}
        {uploadedFiles.length > 0 && uploadedFiles.every(f => f.status === 'success') && (
          <Card className="shadow-elegant border-card-border bg-risk-low/5 border-risk-low/20">
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-risk-low mr-3" />
                <div>
                  <h3 className="font-medium text-foreground">Upload Successful!</h3>
                  <p className="text-sm text-muted-foreground">
                    Your contracts have been uploaded and are being processed. 
                    You can view them in the contracts dashboard.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex space-x-3">
                <Button onClick={() => navigate("/dashboard/contracts")}>
                  View Contracts
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setUploadedFiles([])}
                >
                  Upload More
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}