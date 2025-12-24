import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";

export default function Loading() {
    return (
        <div className="min-h-screen bg-stone-50 pb-20">
            <Navbar />
            <div className="container mx-auto px-4 pt-32">
                <div className="flex flex-col items-center mb-16 space-y-4">
                    <Skeleton className="h-12 w-64 rounded-lg" />
                    <Skeleton className="h-4 w-48 rounded" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-stone-100 flex flex-col h-full">
                            <Skeleton className="h-[300px] w-full" />
                            <div className="p-5 flex flex-col flex-grow space-y-4">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <div className="mt-auto pt-4 flex justify-between items-center">
                                    <Skeleton className="h-8 w-20" />
                                    <Skeleton className="h-10 w-32 rounded-lg" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
