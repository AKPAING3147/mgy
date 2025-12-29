"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

interface Message {
    id: string;
    text: string;
    sender: "user" | "bot";
    timestamp: Date;
}

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { t } = useLanguage();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    useEffect(() => {
        if (messages.length === 0 && isOpen) {
            setMessages([
                {
                    id: "welcome",
                    text: t("chat_welcome"),
                    sender: "bot",
                    timestamp: new Date(),
                },
            ]);
        }
    }, [isOpen, t]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: input,
            sender: "user",
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput("");

        // Simple auto-reply logic
        setTimeout(() => {
            let replyText = t("chat_reply_human");
            const lowerInput = input.toLowerCase();

            if (lowerInput.includes("product") || lowerInput.includes("collection") || lowerInput.includes("card")) {
                replyText = t("chat_reply_prods");
            } else if (lowerInput.includes("track") || lowerInput.includes("order") || lowerInput.includes("status")) {
                replyText = t("chat_reply_order");
            }

            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: replyText,
                sender: "bot",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botMsg]);
        }, 1000);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSend();
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="mb-4 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col"
                        style={{ height: "500px", maxHeight: "80vh" }}
                    >
                        {/* Header */}
                        <div className="bg-stone-900 p-4 flex items-center justify-between text-white">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                <h3 className="font-medium">{t("chat_title")}</h3>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-white/10 rounded transition-colors"
                            >
                                <Minus className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === "user"
                                                ? "bg-stone-800 text-white rounded-br-none"
                                                : "bg-white border border-stone-200 text-stone-800 rounded-bl-none shadow-sm"
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-white border-t border-stone-100">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    placeholder={t("chat_placeholder")}
                                    className="w-full pl-4 pr-12 py-3 rounded-xl bg-stone-100 border-none focus:ring-2 focus:ring-stone-400 outline-none text-stone-800 placeholder:text-stone-400"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim()}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`p-4 rounded-full shadow-lg transition-colors duration-300 ${isOpen ? "bg-stone-800 text-white" : "bg-primary text-white"
                    }`}
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
            </motion.button>
        </div>
    );
}
