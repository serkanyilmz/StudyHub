import { Card, CardContent } from "@/components/ui/card"
import type { StatCard } from "@/shared/types/common"

interface StatCardProps {
  stat: StatCard
}

export function StatCardComponent({ stat }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{stat.title}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
          <stat.icon className={`h-8 w-8 ${stat.color}`} />
        </div>
      </CardContent>
    </Card>
  )
}
