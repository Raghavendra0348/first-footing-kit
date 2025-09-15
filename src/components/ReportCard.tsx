import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, MessageSquare, Eye } from 'lucide-react';
import { PriorityBadge } from '@/components/PriorityBadge';
import { StatusBadge } from '@/components/StatusBadge';
import { LocationDisplay } from '@/components/LocationDisplay';
import { URLMediaPreview } from '@/components/URLMediaPreview';

interface ReportCardProps {
  report: any;
  showVoting?: boolean;
  onUpvote?: (reportId: string) => void;
  onDownvote?: (reportId: string) => void;
  userVote?: 'upvote' | 'downvote' | null;
  className?: string;
}

export const ReportCard = ({ 
  report, 
  showVoting = false, 
  onUpvote, 
  onDownvote, 
  userVote,
  className = ''
}: ReportCardProps) => {
  const upvotes = report.upvotes || 0;
  const downvotes = report.downvotes || 0;
  const mediaUrl = report.photo_urls?.[0] || report.media?.[0];

  return (
    <Card className={`bg-card hover:shadow-elevated transition-all duration-200 hover:-translate-y-1 ${className}`}>
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Media Preview */}
          {mediaUrl && (
            <div className="w-32 h-24 flex-shrink-0">
              <URLMediaPreview 
                urls={[mediaUrl]} 
                className="w-full h-full object-cover rounded-lg bg-muted"
              />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2 mb-2">
                <PriorityBadge priority={report.priority} />
                <span className="text-xs text-muted-foreground">
                  ID: {report.id?.slice(-6) || 'N/A'}
                </span>
              </div>
            </div>

            <h3 className="font-semibold text-card-foreground mb-2 text-lg leading-tight">
              {report.title}
            </h3>

            <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
              <Badge variant="secondary" className="text-xs">
                {report.category}
              </Badge>
              <StatusBadge status={report.status} />
              <span>
                {new Date(report.created_at || report.date_submitted).toLocaleDateString()}
              </span>
            </div>

            <LocationDisplay 
              report={report} 
              className="text-sm text-muted-foreground mb-3"
            />

            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {report.description}
            </p>

            {/* Voting Section */}
            {showVoting && (
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant={userVote === 'upvote' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onUpvote?.(report.id)}
                    className="flex items-center gap-1"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{upvotes}</span>
                  </Button>
                  <Button
                    variant={userVote === 'downvote' ? 'destructive' : 'outline'}
                    size="sm"
                    onClick={() => onDownvote?.(report.id)}
                    className="flex items-center gap-1"
                  >
                    <ThumbsDown className="w-4 h-4" />
                    <span>{downvotes}</span>
                  </Button>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MessageSquare className="w-4 h-4" />
                  <span>{report.public_notes?.length || 0} comments</span>
                </div>
              </div>
            )}

            {/* View Details Button */}
            <Button asChild variant="ghost" size="sm" className="w-full mt-2">
              <Link to={`/report/${report.id}`} className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                View Details
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};