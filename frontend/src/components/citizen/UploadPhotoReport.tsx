import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import api from "@/api/api";
import Loader from "@/components/Loader";
import { Camera, CheckCircle2, Upload } from "lucide-react";

const UploadPhotoReport = () => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { user } = useAuth();
  const [username, setUsername] = useState(user?.username || "");
  const [result, setResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a photo to upload");
      return;
    }
    if (!username.trim()) {
      toast.error("Please enter your username");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // Step 1: Upload photo
  const formData = new FormData();
  formData.append("photo", file);
  formData.append("username", username.trim());

      const photoResponse = await api.post("/upload_photo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // After upload, fetch updated rewards and reports
      const rewardsResp = await api.get(`/my_rewards?username=${encodeURIComponent(username.trim())}`);
      const reportsResp = await api.get(`/my_reports?username=${encodeURIComponent(username.trim())}`);

      setResult({
        photo: photoResponse.data,
        rewards: rewardsResp.data,
        reports: reportsResp.data,
      });

      toast.success("Leak reported successfully! Your rewards have been updated. 💧");
      
      // Reset form
      setFile(null);
      setPreview(null);
      setUsername("");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to report leak");
      console.error("Report error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="dashboard-section">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-lg water-gradient flex items-center justify-center">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Upload Photo & Report Leak</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Upload proof of leak and earn 5 WaterCoins reward
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="photo">Select Photo (Proof of Leak)</Label>
            <div className="mt-2">
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
            </div>
          </div>

          {preview && (
            <div className="relative rounded-lg overflow-hidden border-2 border-border">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-2 right-2 bg-background/90 rounded-lg px-3 py-1 text-sm font-medium">
                <Camera className="w-4 h-4 inline mr-1" />
                Preview
              </div>
            </div>
          )}

          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>📸 How it works:</strong> Upload a photo of the water leak, and you'll automatically 
              receive 5 WaterCoins as a reward added to the blockchain ledger!
            </p>
          </div>

          <Button
            type="submit"
            disabled={loading || !file || !username.trim()}
            className="w-full water-gradient gap-2"
          >
            <Upload className="w-4 h-4" />
            {loading ? "Reporting..." : "Upload & Report Leak"}
          </Button>
        </form>
      </Card>

      {loading && <Loader message="Reporting leak and processing reward..." />}

      {result && (
        <Card className="p-6 border-success">
          <div className="flex items-start gap-4">
            <CheckCircle2 className="w-8 h-8 text-success flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">Leak Reported Successfully! 🎉</h3>
              <div className="space-y-2 text-sm">
                {result.photo?.filename && (
                  <p>
                    <span className="font-semibold">Photo:</span> {result.photo.filename}
                  </p>
                )}
                {result.rewards?.coins !== undefined && (
                  <p className="text-lg font-bold text-primary">
                    💰 WaterCoins: {result.rewards.coins}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">Total reports: {result.reports?.reports?.length ?? "-"}</p>
                <p className="text-muted-foreground mt-2">
                  Your contribution has been recorded on the blockchain! 
                  Check the "View Rewards" tab to see your updated balance.
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default UploadPhotoReport;
