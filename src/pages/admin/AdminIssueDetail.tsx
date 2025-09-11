import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { mockReports, departments } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  FileText,
  Save,
  MessageSquare,
  Building
} from "lucide-react";

const AdminIssueDetail = () => {
  const { id } = useParams();
  const report = mockReports.find(r => r.id === id);
  const { toast } = useToast();

  const [status, setStatus] = useState<string>(report?.status || "submitted");
  const [priority, setPriority] = useState<string>(report?.priority || "medium");
  const [assignedDepartment, setAssignedDepartment] = useState<string>(report?.assignedDepartment || "");
  const [publicNote, setPublicNote] = useState("");
  const [internalNote, setInternalNote] = useState("");

  if (!report) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Issue Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The issue you're looking for doesn't exist or may have been removed.
          </p>
          <Button asChild variant="civic">
            <Link to="/admin/issues">Back to Issues</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleSaveChanges = () => {
    toast({
      title: "Changes Saved",
      description: "Issue status and assignment have been updated.",
    });
  };

  const handleAddNote = (isPublic: boolean) => {
    const note = isPublic ? publicNote : internalNote;
    if (!note.trim()) return;

    toast({
      title: `${isPublic ? 'Public' : 'Internal'} Note Added`,
      description: "The note has been saved and will be visible to relevant parties.",
    });

    if (isPublic) {
      setPublicNote("");
    } else {
      setInternalNote("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="sm">
          <Link to="/admin/issues">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Issues
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{report.title}</h1>
          <p className="text-muted-foreground">Issue ID: {report.id}</p>
        </div>
        <Button onClick={handleSaveChanges} variant="civic">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Issue Details */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Issue Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <StatusBadge status={report.status} />
                <PriorityBadge priority={report.priority} />
                <Badge variant="outline">{report.category}</Badge>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{report.description}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Submitted:</strong> {new Date(report.dateSubmitted).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Location:</strong> {report.location.address}
                  </span>
                </div>
              </div>

              {/* Photos */}
              {report.photos.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Attached Photos</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {report.photos.map((photo, index) => (
                      <div key={index} className="aspect-square bg-muted rounded-lg border overflow-hidden">
                        <img
                          src={photo}
                          alt={`Issue photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Public Notes */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Public Updates</CardTitle>
              <p className="text-sm text-muted-foreground">
                These updates are visible to the citizen who reported the issue.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {report.publicNotes.map((note, index) => (
                <div key={index} className="border-l-4 border-civic-blue pl-4 py-2">
                  <p className="text-sm">{note}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date().toLocaleDateString()} - Municipal Staff
                  </p>
                </div>
              ))}

              <div className="pt-4 border-t">
                <Textarea
                  placeholder="Add a public update for the citizen..."
                  value={publicNote}
                  onChange={(e) => setPublicNote(e.target.value)}
                  rows={3}
                />
                <Button 
                  onClick={() => handleAddNote(true)} 
                  className="mt-2" 
                  size="sm"
                  disabled={!publicNote.trim()}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Add Public Update
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Internal Notes */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Internal Notes</CardTitle>
              <p className="text-sm text-muted-foreground">
                These notes are only visible to municipal staff.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {report.internalNotes.map((note, index) => (
                <div key={index} className="border-l-4 border-civic-amber pl-4 py-2">
                  <p className="text-sm">{note}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date().toLocaleDateString()} - Staff Member
                  </p>
                </div>
              ))}

              <div className="pt-4 border-t">
                <Textarea
                  placeholder="Add an internal note for staff..."
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  rows={3}
                />
                <Button 
                  onClick={() => handleAddNote(false)} 
                  className="mt-2" 
                  size="sm" 
                  variant="outline"
                  disabled={!internalNote.trim()}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Add Internal Note
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Management */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Issue Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="acknowledged">Acknowledged</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Priority</label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Assigned Department</label>
                <Select value={assignedDepartment} onValueChange={setAssignedDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Citizen Information */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Citizen Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{report.citizenName}</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{report.citizenEmail}</span>
              </div>
              {report.citizenPhone && (
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{report.citizenPhone}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full" disabled>
                <Mail className="w-4 h-4 mr-2" />
                Email Citizen
              </Button>
              <Button variant="outline" className="w-full" disabled>
                <FileText className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
              <Button variant="outline" className="w-full" disabled>
                <MapPin className="w-4 h-4 mr-2" />
                View on Map
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminIssueDetail;