import { Card, CardContent, CardHeader } from "@components/ui/card";
import { Skeleton } from "@components/ui/skeleton";

export function TermFormSkeleton() {
  return (
    <div className="w-full">
      <div className="mb-6">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-2/3 mt-2" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Content Card Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-20" />
              </div>
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-5 w-1/4 mt-4" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:sticky lg:top-24">
          {/* Sidebar Card 1 Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-5 w-1/4 mt-4" />
              <Skeleton className="h-9 w-full" />
            </CardContent>
          </Card>

          {/* Sidebar Card 2 Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-9 w-full" />
              <div className="flex items-center justify-between rounded-lg border p-3 mt-4">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-6 w-10" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="flex justify-between items-center mt-8 pt-6 border-t">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}
