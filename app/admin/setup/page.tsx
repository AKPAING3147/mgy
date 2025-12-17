"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, CheckCircle } from "lucide-react";

export default function SetupAdmin() {
    const router = useRouter();
    const [form, setForm] = useState({ email: "admin@eternity.com", password: "admin123", name: "Admin" });
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSetup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("/api/auth/setup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            const data = await res.json();

            if (data.success) {
                setSuccess(true);
                setTimeout(() => router.push("/admin/login"), 2000);
            } else {
                setError(data.message || "Setup failed");
            }
        } catch (err) {
            setError("An error occurred");
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
                <Card className="max-w-md">
                    <CardContent className="pt-12 pb-12 text-center">
                        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Admin Created!</h2>
                        <p className="text-stone-600">Redirecting to login...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-100 to-amber-50 p-4">
            <Card className="max-w-md w-full shadow-2xl">
                <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mb-4">
                        <UserPlus className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-serif">Create Admin Account</CardTitle>
                    <CardDescription>Set up your administrator credentials</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSetup} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Name</label>
                            <Input
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                placeholder="Admin Name"
                                className="h-11"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input
                                type="email"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                placeholder="admin@example.com"
                                className="h-11"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Password</label>
                            <Input
                                type="password"
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                placeholder="Secure password"
                                className="h-11"
                            />
                        </div>

                        <Button type="submit" className="w-full h-11 bg-amber-600 hover:bg-amber-700">
                            Create Admin Account
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
