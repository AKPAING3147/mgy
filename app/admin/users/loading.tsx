export default function Loading() {
    return (
        <div className="min-h-screen bg-white p-8 pt-24">
            <div className="container mx-auto">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </div>
        </div>
    );
}
