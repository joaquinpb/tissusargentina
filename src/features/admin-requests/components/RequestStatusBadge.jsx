import { Badge } from '@/core/components/ui/badge'
import { REQUEST_STATUS } from '@/core/lib/constants'

export function RequestStatusBadge({ status }) {
  const config = REQUEST_STATUS[status] || { label: status, variant: 'outline' }
  return <Badge variant={config.variant}>{config.label}</Badge>
}
