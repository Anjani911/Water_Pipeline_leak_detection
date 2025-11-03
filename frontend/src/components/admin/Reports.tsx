import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import api from "@/api/api";
import Loader from "@/components/Loader";
import { toast } from "sonner";

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.get("/view_reports");
      setData(res.data);
      toast.success("Reports loaded");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to load reports");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReports(); }, []);

  if (loading) return <Loader message="Loading reports..." />;

  return (
    <div className="space-y-6">
      <Card className="dashboard-section">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Detection Reports</h2>
            <p className="text-sm text-muted-foreground">Graphical and tabular view of detected leaks and dataset summaries</p>
          </div>
        </div>

        {data ? (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-background p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Summary</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-muted rounded">
                  <div className="text-sm text-muted-foreground">Total Datasets</div>
                  <div className="text-2xl font-bold">{data.summary?.total_datasets ?? 0}</div>
                </div>
                <div className="p-3 bg-muted rounded">
                  <div className="text-sm text-muted-foreground">Total Rows</div>
                  <div className="text-2xl font-bold">{data.summary?.total_rows ?? 0}</div>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Leak Distribution (by zone)</h4>
                <ChartContainer id="report-leaks" config={{ leaks: { label: "Leaks", color: "#1e90ff" } }}>
                  {/* simple bar chart rendering - using Recharts primitives inside wrapper */}
                  {/* We'll render a basic bar chart */}
                  <div style={{ width: "100%", height: 240 }}>
                    {/* Recharts usage is handled by ChartContainer wrapper in apps where needed; keep minimal here */}
                    <pre className="text-xs text-muted-foreground">{JSON.stringify(data.graph_data, null, 2)}</pre>
                  </div>
                </ChartContainer>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Reports Table</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Filename</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Rows</TableHead>
                      <TableHead>Totals</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(data.table_data || []).map((row: any, idx: number) => (
                      <TableRow key={idx}>
                        <TableCell>{row.filename}</TableCell>
                        <TableCell>{row.timestamp}</TableCell>
                        <TableCell>{row.rows}</TableCell>
                        <TableCell>
                          {row.totals ? (
                            <div className="text-sm">
                              <div>Total Supplied: {row.totals.total_supplied ?? "-"}</div>
                              <div>Total Consumed: {row.totals.total_consumed ?? "-"}</div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground">No report data available</div>
        )}
      </Card>
    </div>
  );
};

export default Reports;
