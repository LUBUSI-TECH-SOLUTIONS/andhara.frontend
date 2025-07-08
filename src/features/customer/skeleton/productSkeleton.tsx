import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const ProductSkeleton = () => (
  <div className="bg-muted p-3 rounded-md animate-pulse">
    <div className="flex justify-between items-center">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
    <div className="grid grid-cols-2 gap-2 mt-2">
      <div>
        <Skeleton className="h-4 w-20 mb-1" />
        <Skeleton className="h-5 w-16" />
      </div>
      <div>
        <Skeleton className="h-4 w-20 mb-1" />
        <Skeleton className="h-5 w-16" />
      </div>
    </div>
  </div>
)

const PurchaseSkeleton = () => (
  <Card className="border-l-4 border-l-primary/30">
    <CardHeader className="pb-2">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-6 w-20" />
      </div>
      <div className="flex justify-between mt-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-32" />
      </div>
    </CardHeader>
    <CardContent>
      <Skeleton className="h-5 w-24 mb-3" />
      <div className="space-y-3">
        <ProductSkeleton />
        <ProductSkeleton />
      </div>
    </CardContent>
  </Card>
)


export { PurchaseSkeleton, ProductSkeleton }