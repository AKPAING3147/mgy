import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Contact() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto py-32 px-4 max-w-xl">
                <h1 className="text-4xl font-serif text-center mb-4">Contact Us</h1>
                <p className="text-center text-muted-foreground mb-8">We'd love to hear from you. Please fill out this form.</p>
                <form className="space-y-6 bg-white p-8 rounded-lg shadow-lg border border-border/50">
                    <div className="grid grid-cols-2 gap-4">
                        <Input placeholder="Your Name" />
                        <Input placeholder="Email Address" type="email" />
                    </div>
                    <Input placeholder="Subject" />
                    <Textarea placeholder="Your Message" className="min-h-[150px]" />
                    <Button className="w-full text-lg h-12" size="lg">Send Message</Button>
                </form>
            </div>
        </div>
    )
}
