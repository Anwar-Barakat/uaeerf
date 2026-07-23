import { Badge } from '@/components/ui/badge';

export function getStatusBadge(status: string) {
    switch (status) {
        case 'completed':
            return <Badge className="bg-emerald-500">Completed</Badge>;
        case 'pending':
        case 'pending_payment':
            return <Badge variant="secondary">Pending Payment</Badge>;
        case 'failed':
            return <Badge variant="destructive">Failed</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
}
