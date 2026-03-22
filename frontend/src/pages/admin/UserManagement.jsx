import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, MoreVertical, AlertCircle, Ban, CheckCircle } from "lucide-react";
import { adminService } from "@/services/adminService";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getUsers({
        page: currentPage,
        limit: 10,
        search: searchTerm
      });
      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId) => {
    if (!confirm("Are you sure you want to block this user?")) return;
    try {
      await adminService.blockUser(userId);
      fetchUsers();
    } catch (err) {
      alert("Error blocking user: " + err.message);
    }
  };

  const handleUnblockUser = async (userId) => {
    try {
      await adminService.unblockUser(userId);
      fetchUsers();
    } catch (err) {
      alert("Error unblocking user: " + err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      await adminService.deleteUser(userId);
      fetchUsers();
    } catch (err) {
      alert("Error deleting user: " + err.message);
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">User Management</h1>
          <p className="text-muted-foreground mt-1">Manage and monitor all users</p>
        </div>
        <Button className="gap-2">
          <UserPlus className="w-4 h-4" />
          Add User
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-destructive mb-4 p-3 bg-destructive/10 rounded">
            <AlertCircle className="w-5 h-5" />
            <span>Error: {error}</span>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-sm">User</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Role</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Joined</th>
                <th className="text-right py-3 px-4 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                        <span className="font-medium">{user.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className="text-xs px-2 py-1 rounded bg-accent/10 text-accent">
                        {user.role || 'user'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {user.isBlocked ? (
                        <span className="text-xs px-2 py-1 rounded bg-destructive/10 text-destructive flex items-center gap-1 w-fit">
                          <Ban className="w-3 h-3" />
                          Blocked
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-1 rounded bg-success/10 text-success flex items-center gap-1 w-fit">
                          <CheckCircle className="w-3 h-3" />
                          Active
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {user.isBlocked ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUnblockUser(user.id)}
                          >
                            Unblock
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleBlockUser(user.id)}
                          >
                            Block
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-muted-foreground">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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

export default UserManagement;
