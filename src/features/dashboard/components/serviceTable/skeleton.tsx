import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonServiceTable = () => {
  return(
    <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-8 gap-5 w-full">
      <Skeleton className="col-span-1 lg:col-span-2 xl:col-span-2 h-[250px] " />
      <Skeleton className="hidden lg:block lg:col-span-2 xl:col-span-2 h-[250px]" />
      <Skeleton className="hidden lg:block lg:col-span-4 xl:col-span-4 h-[250px]" />
    </div>
  )
}