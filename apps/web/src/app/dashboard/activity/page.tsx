'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { 
  Activity, CheckCircle, AlertTriangle, Info,
  ChevronLeft, ChevronRight, Filter
} from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const EVENT_TYPES = [
  { value: '', label: 'All Events' },
  { value: 'LOGIN_SUCCESS', label: 'Successful Logins' },
  { value: 'LOGIN_FAILURE', label: 'Failed Logins' },
  { value: 'LOGOUT', label: 'Logouts' },
  { value: 'AUTHENTICATOR_ADDED', label: 'Authenticator Added' },
  { value: 'AUTHENTICATOR_REMOVED', label: 'Authenticator Removed' },
  { value: 'RECOVERY_CODE_GENERATED', label: 'Recovery Codes Generated' },
  { value: 'DEVICE_REVOKED', label: 'Device Revoked' },
];

export default function ActivityPage() {
  const [eventType, setEventType] = useState('');
  const [page, setPage] = useState(0);
  const limit = 20;

  const { data, error, isLoading } = useSWR(
    `/api/security-events?limit=${limit}&offset=${page * limit}${eventType ? `&type=${eventType}` : ''}`,
    fetcher
  );

  const events = data?.data?.events || [];
  const pagination = data?.data?.pagination || { total: 0, hasMore: false };

  const getStatusIcon = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'SUCCESS': return <CheckCircle className="h-4 w-4 text-security-low" />;
      case 'FAILURE': return <AlertTriangle className="h-4 w-4 text-security-high" />;
      case 'WARNING': return <AlertTriangle className="h-4 w-4 text-security-medium" />;
      default: return <Info className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getEventBadgeColor = (type: string) => {
    if (type.includes('FAILURE') || type.includes('LOCKED')) return 'bg-security-high/10 text-security-high';
    if (type.includes('SUCCESS') || type.includes('ADDED')) return 'bg-security-low/10 text-security-low';
    if (type.includes('WARNING') || type.includes('SUSPICIOUS')) return 'bg-security-medium/10 text-security-medium';
    return 'bg-muted text-muted-foreground';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  const formatEventType = (type: string) => {
    return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Security Activity</h1>
          <p className="text-muted-foreground">Review your account security events</p>
        </div>
        
        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={eventType}
            onChange={(e) => {
              setEventType(e.target.value);
              setPage(0);
            }}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {EVENT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-security-low" />
            <span className="text-sm font-medium">Total Events</span>
          </div>
          <p className="text-2xl font-bold">{pagination.total}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">This Page</span>
          </div>
          <p className="text-2xl font-bold">{events.length}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Current Page</span>
          </div>
          <p className="text-2xl font-bold">{page + 1} of {Math.ceil(pagination.total / limit) || 1}</p>
        </div>
      </div>

      {/* Events List */}
      {events.length === 0 ? (
        <div className="rounded-lg border bg-card p-12 text-center">
          <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">No security events found</h3>
          <p className="text-sm text-muted-foreground">
            {eventType ? 'Try selecting a different event type filter.' : 'Security events will appear here as you use your account.'}
          </p>
        </div>
      ) : (
        <div className="rounded-lg border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Event</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Description</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">IP Address</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Time</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event: any) => (
                  <tr key={event.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(event.status)}
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getEventBadgeColor(event.eventType)}`}>
                          {event.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-sm">{event.eventName}</p>
                      <p className="text-xs text-muted-foreground md:hidden">{event.description}</p>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <p className="text-sm font-mono text-muted-foreground">{event.ipAddress || 'Unknown'}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-muted-foreground whitespace-nowrap">{formatDate(event.createdAt)}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination.total > limit && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {page * limit + 1} to {Math.min((page + 1) * limit, pagination.total)} of {pagination.total} events
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="flex items-center gap-1 px-3 py-2 rounded-lg border text-sm font-medium hover:bg-accent disabled:opacity-50 disabled:pointer-events-none"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={!pagination.hasMore}
              className="flex items-center gap-1 px-3 py-2 rounded-lg border text-sm font-medium hover:bg-accent disabled:opacity-50 disabled:pointer-events-none"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
