"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function Login() {
    const router = useRouter();
    const handleLogin = (e: any) => {
        e.preventDefault();
        // Simulate login
        router.push("/");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-secondary/30 relative">
            <Link href="/" className="absolute top-8 left-8 text-muted-foreground hover:text-foreground flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
            </Link>
            <div className="bg-white p-10 rounded-xl shadow-xl w-full max-w-md border border-white/50">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-serif text-foreground mb-2">Welcome Back</h1>
                    <p className="text-muted-foreground">Sign in to your Eternity account</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input placeholder="name@example.com" type="email" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Password</label>
                        <Input placeholder="••••••••" type="password" />
                    </div>
                    <Button className="w-full text-lg h-12">Sign In</Button>
                </form>
                <div className="mt-6 text-center text-sm text-muted-foreground">
                    Don't have an account? <Link href="/auth/signup" className="text-primary font-medium hover:underline">Create Account</Link>
                </div>
            </div>
        </div>
    );
}
