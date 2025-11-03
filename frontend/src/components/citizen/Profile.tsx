import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import api from "@/api/api";
import Loader from "@/components/Loader";
import { toast } from "sonner";

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [rewards, setRewards] = useState<any>(null);

  const username = localStorage.getItem("username") || "";

  const fetchProfile = async () => {
    if (!username) return;
    setLoading(true);
    try {
      const [pRes, rRes, rewRes] = await Promise.all([
        api.get(`/citizen_profile?username=${encodeURIComponent(username)}`),
        api.get(`/my_reports?username=${encodeURIComponent(username)}`),
        api.get(`/my_rewards?username=${encodeURIComponent(username)}`),
      ]);
      setProfile(pRes.data);
      setReports(rRes.data.reports || []);
      setRewards(rewRes.data);
      toast.success("Profile loaded");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to load profile");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  if (loading) return <Loader message="Loading profile..." />;

  return (
    <div className="space-y-6">
      <Card className="dashboard-section">
        <div className="flex items-center gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Profile</h2>
            <p className="text-sm text-muted-foreground">Personal details and contributions</p>
          </div>
        </div>

        {profile ? (
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Username</div>
              <div className="text-lg font-bold">{profile.username}</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Location</div>
              <div className="text-lg font-bold">{profile.city}, {profile.colony}</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">WaterCoins</div>
              <div className="text-2xl font-bold">{profile.coins}</div>
              <div className="text-sm text-muted-foreground">Photos reported: {profile.reports}</div>
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground">Profile not found</div>
        )}
      </Card>

      <Card className="dashboard-section">
        <h3 className="text-lg font-semibold mb-3">My Reports</h3>
        {reports.length === 0 ? (
          <div className="text-muted-foreground">No reports yet</div>
        ) : (
          <div className="space-y-3">
            {reports.map((r, idx) => (
              <div key={idx} className="p-3 bg-background rounded border border-border">
                <div className="text-sm">{r.filename || r.filename}</div>
                <div className="text-xs text-muted-foreground">{r.timestamp}</div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Profile;
