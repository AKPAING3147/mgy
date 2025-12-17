"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { CheckCircle, Upload } from "lucide-react";
import React from "react";

export default function PaymentPage({ params }: { params: Promise<{ orderId: string }> }) {
    const router = useRouter();
    // Unwrap params using React.use() or just useEffect if not using `use` hook yet.
    // For simplicity with async params in client component, we use React.use() if available or await in server component. 
    // Since this is "use client", we can't await params in the component body directly unless valid hook.
    // The standard way in Next 15 Client Component is `use(params)`.

    // Fallback if use() is not available:
    const [orderId, setOrderId] = useState<string>("");

    React.useEffect(() => {
        params.then(p => setOrderId(p.orderId));
    }, [params]);

    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("PENDING");

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !orderId) return;
        setLoading(true);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("orderId", orderId);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                setStatus("UPLOADED");
            } else {
                alert("Upload failed");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!orderId) return null;

    return (
        <div className="min-h-screen bg-background pb-20">
            <Navbar />
            <div className="container mx-auto pt-32 px-4 max-w-2xl">
                <div className="bg-white p-8 rounded-lg shadow-lg border text-center">
                    <div className="flex justify-center mb-6">
                        <CheckCircle className="w-16 h-16 text-green-500" />
                    </div>
                    <h1 className="text-3xl font-serif mb-2">Order Confirmed!</h1>
                    <p className="text-muted-foreground mb-8">Order ID: <span className="font-mono text-black select-all">{orderId}</span></p>

                    <div className="bg-secondary/20 p-6 rounded-md mb-8 text-left">
                        <h3 className="font-bold mb-4 border-b border-primary/20 pb-2">Bank Transfer Details</h3>
                        <p className="mb-2"><span className="font-medium">Bank Name:</span> Royal Wedding Bank</p>
                        <p className="mb-2"><span className="font-medium">Account Name:</span> Eternity Invites Ltd.</p>
                        <p className="mb-2"><span className="font-medium">Account Number:</span> 123-456-7890</p>
                        <p className="text-xs text-muted-foreground mt-4">Please transfer the total amount and upload the slip below.</p>
                    </div>

                    {status === "UPLOADED" ? (
                        <div className="bg-green-50 text-green-800 p-6 rounded-md animate-in fade-in zoom-in duration-500">
                            <h3 className="font-bold text-lg mb-2">Payment Slip Received</h3>
                            <p>We are verifying your payment.</p>
                            <Button className="mt-4" onClick={() => router.push('/')}>Return Home</Button>
                        </div>
                    ) : (
                        <form onSubmit={handleUpload} className="space-y-6">
                            <div className="border-2 border-dashed border-stone-300 rounded-lg p-8 flex flex-col items-center justify-center bg-stone-50 cursor-pointer hover:bg-stone-100 transition-colors relative group">
                                <Upload className="w-8 h-8 text-stone-400 mb-2 group-hover:text-primary transition-colors" />
                                <span className="text-sm text-stone-500 mb-2">Click to choose image (JPG/PNG)</span>
                                <input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    accept="image/*"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                />
                                {file ? (
                                    <div className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                                        {file.name}
                                    </div>
                                ) : (
                                    <div className="text-xs text-muted-foreground">Max 5MB</div>
                                )}
                            </div>

                            <Button className="w-full h-12 text-lg" disabled={!file || loading}>
                                {loading ? "Uploading..." : "Confirm Payment"}
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
