
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

export function SectionCards() {
  return (
   <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            $37,543.21
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUp />
              +18.7%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Exceeding quarterly goals <TrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Best performance in last 8 quarters
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Client Projects</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            32
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUp />
              +4
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Four new projects this month <TrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Enterprise clients growing steadily
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Project Completion</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            92.5%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUp />
              +3.2%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Ahead of delivery schedule <TrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Client satisfaction at 97%</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Growth Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            8.3%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUp />
              +2.1%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Outperforming market average <TrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Projected to reach 10% EOY</div>
        </CardFooter>
      </Card>
    </div>
  )
}
