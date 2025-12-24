"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";

interface Message {
    id: string;
    text: string;
    sender: "bot" | "user";
    options?: string[];
}

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            text: "မင်္ဂလာပါ 🙏 MGY OFFSET Website အသုံးပြုနည်းကို ကူညီပေးဖို့ ကျွန်တော်အဆင်သင့်ရှိပါတယ်။ ဘာသိလိုပါသလဲ?",
            sender: "bot",
            options: ["အော်ဒါမှာနည်း", "ငွေပေးချေနည်း", "အော်ဒါကြည့်နည်း", "ဆက်သွယ်ရန်"]
        }
    ]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleOptionClick = (option: string) => {
        // Add user message
        const userMsg: Message = {
            id: Date.now().toString(),
            text: option,
            sender: "user"
        };
        setMessages(prev => [...prev, userMsg]);

        // Simulate bot response delay
        setTimeout(() => {
            let botText = "";
            let nextOptions: string[] | undefined = ["ပင်မစာမျက်နှာသို့", "အခြားမေးမြန်းရန်"];

            switch (option) {
                case "အော်ဒါမှာနည်း":
                    botText = "ကုန်ပစ္စည်းများကို ကြည့်ရှုပြီး 'Order Now' ကိုနှိပ်ပါ။\n\nထို့နောက် အရေအတွက်ရွေးချယ်၊ အချက်အလက်များဖြည့်သွင်းပြီး 'Place Order' ကိုနှိပ်ကာ အော်ဒါတင်နိုင်ပါတယ်။";
                    break;
                case "ငွေပေးချေနည်း":
                    botText = "အော်ဒါတင်ပြီးပါက KPay သို့မဟုတ် ဘဏ်အကောင့်များသို့ ငွေလွှဲပေးချေနိုင်ပါတယ်။\n\nငွေလွှဲပြေစာ (Slip) ကို 'Track Order' စာမျက်နှာတွင် အော်ဒါနံပါတ်ဖြင့်ရှာပြီး တင်ပေးရပါမယ်။";
                    break;
                case "အော်ဒါကြည့်နည်း":
                    botText = "'Track Order' စာမျက်နှာသို့သွားပြီး အော်ဒါနံပါတ် (Order ID) ရိုက်ထည့်ကာ မိမိအော်ဒါအခြေအနေကို ကြည့်ရှုနိုင်ပါတယ်။";
                    break;
                case "ဆက်သွယ်ရန်":
                    botText = "အသေးစိတ်သိရှိလိုပါက ဖုန်းနံပါတ် 09 797 436 123 ၊ 09 797 436 124 သို့ ဆက်သွယ်မေးမြန်းနိုင်ပါတယ်။";
                    break;
                case "ပင်မစာမျက်နှာသို့":
                case "အခြားမေးမြန်းရန်":
                    botText = "ဟုတ်ကဲ့၊ နောက်ထပ် ဘာကူညီပေးရမလဲ?";
                    nextOptions = ["အော်ဒါမှာနည်း", "ငွေပေးချေနည်း", "အော်ဒါကြည့်နည်း", "ဆက်သွယ်ရန်"];
                    break;
                default:
                    botText = "ဖြည့်စွက်ပြောကြားစရာရှိပါက ဖုန်းဆက်သွယ်မေးမြန်းနိုင်ပါတယ်။";
                    nextOptions = ["ဆက်သွယ်ရန်"];
            }

            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: botText,
                sender: "bot",
                options: nextOptions
            };
            setMessages(prev => [...prev, botMsg]);
        }, 600);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="mb-4 w-[350px] bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-primary to-secondary p-4 flex justify-between items-center text-white">
                            <div className="flex items-center gap-2">
                                <Bot className="w-6 h-6" />
                                <div>
                                    <h3 className="font-bold text-sm">MGY Assistant</h3>
                                    <span className="text-xs opacity-90">● Online</span>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div
                            ref={scrollRef}
                            className="h-[400px] overflow-y-auto p-4 bg-stone-50 space-y-4"
                        >
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[85%] rounded-2xl p-3 text-sm whitespace-pre-wrap leading-relaxed ${msg.sender === "user"
                                            ? "bg-primary text-white rounded-tr-none"
                                            : "bg-white text-stone-800 shadow-sm border border-stone-100 rounded-tl-none"
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}

                            {/* Options for last message */}
                            {messages[messages.length - 1].sender === "bot" && messages[messages.length - 1].options && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {messages[messages.length - 1].options?.map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => handleOptionClick(option)}
                                            className="text-xs bg-white border border-secondary text-stone-700 px-3 py-2 rounded-full hover:bg-secondary hover:text-white transition-colors shadow-sm"
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <Button
                onClick={() => setIsOpen(!isOpen)}
                className="h-14 w-14 rounded-full bg-gradient-to-r from-primary to-secondary shadow-lg hover:shadow-xl hover:scale-105 transition-all p-0 flex items-center justify-center animate-bounce-subtle"
            >
                {isOpen ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-7 h-7 text-white" />}
            </Button>
        </div>
    );
}
