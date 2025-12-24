import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";

export default function Loading() {
    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <Navbar />
            <div className="container mx-auto px-4">
                <Skeleton className="h-6 w-32 mb-6" /> {/* Back link */}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Gallery Skeleton */}
                    <div className="space-y-4">
                        <Skeleton className="w-full aspect-square rounded-xl" />
                        <div className="flex gap-3 justify-center pb-2">
                            {[1, 2, 3, 4].map((i) => (
                                <Skeleton key={i} className="w-20 h-20 rounded-lg" />
                            ))}
                        </div>
                    </div>

                    {/* Product Info Skeleton */}
                    <div className="space-y-8">
                        <Skeleton className="h-8 w-32 rounded-full" /> {/* Category */}
                        <Skeleton className="h-16 w-3/4" /> {/* Title */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>

                        <div className="flex items-baseline gap-2 pb-6 border-b border-border">
                            <Skeleton className="h-12 w-32" />
                            <Skeleton className="h-6 w-24" />
                        </div>

                        {/* Order Form Skeleton */}
                        <div className="bg-card p-6 rounded-2xl border border-border space-y-6">
                            <Skeleton className="h-8 w-48" />
                            <div className="flex items-center gap-6">
                                <Skeleton className="h-6 w-24" />
                                <Skeleton className="h-12 w-32 rounded-md" />
                            </div>
                            <Skeleton className="h-32 w-full rounded-xl" />

                            <div className="p-5 rounded-xl border border-border bg-muted/20">
                                <div className="flex justify-between">
                                    <Skeleton className="h-8 w-24" />
                                    <Skeleton className="h-8 w-32" />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Skeleton className="flex-1 h-14 rounded-md" />
                                <Skeleton className="w-16 h-14 rounded-md" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
