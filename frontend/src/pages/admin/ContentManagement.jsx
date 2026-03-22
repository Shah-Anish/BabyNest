import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Eye, Check, X, Trash2, AlertCircle } from "lucide-react";
import { adminService } from "@/services/adminService";

const ContentManagement = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchContent();
  }, [currentPage, searchTerm, statusFilter]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const data = await adminService.getContent({
        page: currentPage,
        limit: 10,
        search: searchTerm,
        status: statusFilter !== "all" ? statusFilter : undefined
      });
      setContent(data.content || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (contentId) => {
    try {
      await adminService.approveContent(contentId);
      fetchContent();
    } catch (err) {
      alert("Error approving content: " + err.message);
    }
  };

  const handleReject = async (contentId) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;
    try {
      await adminService.rejectContent(contentId, reason);
      fetchContent();
    } catch (err) {
      alert("Error rejecting content: " + err.message);
    }
  };

  const handleDelete = async (contentId) => {
    if (!confirm("Are you sure you want to delete this content?")) return;
    try {
      await adminService.deleteContent(contentId);
      fetchContent();
    } catch (err) {
      alert("Error deleting content: " + err.message);
    }
  };

  if (loading && content.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading content...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Content Management</h1>
        <p className="text-muted-foreground mt-1">Review and manage all content</p>
      </div>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-md border border-input bg-background text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-destructive mb-4 p-3 bg-destructive/10 rounded">
            <AlertCircle className="w-5 h-5" />
            <span>Error: {error}</span>
          </div>
        )}

        <div className="space-y-4">
          {content.length > 0 ? (
            content.map((item) => (
              <div key={item.id} className="border border-border rounded-lg p-4 hover:bg-muted/50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{item.title || 'Untitled'}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${
                        item.status === 'approved'
                          ? 'bg-success/10 text-success'
                          : item.status === 'rejected'
                          ? 'bg-destructive/10 text-destructive'
                          : 'bg-warning/10 text-yellow-700'
                      }`}>
                        {item.status || 'pending'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {item.description || item.content || 'No description'}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>By: {item.author || 'Unknown'}</span>
                      <span>•</span>
                      <span>Type: {item.type || 'article'}</span>
                      <span>•</span>
                      <span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost">
                      <Eye className="w-4 h-4" />
                    </Button>
                    {item.status !== 'approved' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-success border-success/20 hover:bg-success/10"
                        onClick={() => handleApprove(item.id)}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    )}
                    {item.status !== 'rejected' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive border-destructive/20 hover:bg-destructive/10"
                        onClick={() => handleReject(item.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              No content found
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ContentManagement;
