"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Signup() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Registration failed");
            }

            toast.success("Account created successfully! Please sign in.");
            router.push("/auth/login");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50 relative p-4">
            <Link href="/" className="absolute top-8 left-8 text-stone-600 hover:text-primary flex items-center transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
            </Link>
            <div className="bg-white p-6 md:p-10 rounded-xl shadow-xl w-full max-w-md border border-stone-100">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-serif text-stone-900 mb-2">Create Account</h1>
                    <p className="text-stone-500">Join the Eternity Invites family</p>
                </div>
                <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-stone-700">Full Name</label>
                        <Input
                            name="name"
                            placeholder="John Doe"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="bg-stone-50"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-stone-700">Email</label>
                        <Input
                            name="email"
                            placeholder="name@example.com"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="bg-stone-50"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-stone-700">Password</label>
                        <Input
                            name="password"
                            placeholder="••••••••"
                            type="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="bg-stone-50"
                        />
                        <p className="text-xs text-stone-400">Must be at least 8 chars with uppercase, lowercase, number & special char.</p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-stone-700">Confirm Password</label>
                        <Input
                            name="confirmPassword"
                            placeholder="••••••••"
                            type="password"
                            required
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="bg-stone-50"
                        />
                    </div>
                    <Button
                        disabled={loading}
                        className="w-full text-lg h-12 bg-primary hover:bg-primary/90 text-white mt-4"
                    >
                        {loading ? "Creating Account..." : "Sign Up"}
                    </Button>
                </form>
                <div className="mt-6 text-center text-sm text-stone-500">
                    Already have an account? <Link href="/auth/login" className="text-primary font-medium hover:underline">Sign In</Link>
                </div>
            </div>
        </div>
    );
}
