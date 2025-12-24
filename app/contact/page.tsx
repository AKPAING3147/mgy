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
                <div className="text-center mb-10 space-y-4">
                    <div className="bg-stone-100 p-6 rounded-xl inline-block max-w-2xl mx-auto">
                        <h3 className="font-bold text-lg mb-2">MGY OFFSET Printing Services</h3>
                        <p className="text-stone-700 mb-2">
                            <span className="font-semibold">Address:</span> မြို့.ဂုဏ်ရောင်ပုံနှိပ်တိုက်လမ်း၊မတော်လမ်း၊မီးပွိုင့် အနီး၊ဆုံကုန်းရပ်၊တံတားဦးမြို့။
                        </p>
                        <p className="text-stone-700">
                            <span className="font-semibold">Phone:</span> 09 797 436 123 , 09 797 436 124
                        </p>
                    </div>
                </div>
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
