// app/ai/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import SimpleHeader from "@/components/SimpleHeader";
import TextareaAutosize from 'react-textarea-autosize'; // Impor textarea baru
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { sendAiPrompt } from "@/lib/api/ai";
import { 
  AlertDialog, 
  AlertDialogContent, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface Message {
  role: 'user' | 'ai';
  content: string;
}

export default function AiPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight);
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await sendAiPrompt(inputValue);
      
      if (response.code !== 200) {
        throw new Error(response.message || "Terjadi kesalahan pada server.");
      }

      const aiMessage: Message = { role: 'ai', content: response.data };
      setMessages(prev => [...prev, aiMessage]);

    } catch (err: any) {
      console.error("Error mengirim prompt AI:", err);
      setError("Maaf, fitur tidak tersedia untuk beberapa saat.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <SimpleHeader title="Motorinci AI" />
      
      <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={cn("flex", msg.role === 'user' ? 'justify-end' : 'justify-start')}>
            <div className={cn(
              "max-w-[80%] p-3 rounded-lg",
              msg.role === 'user' 
                ? 'bg-red-600 text-white rounded-br-none' 
                : 'bg-zinc-800 text-white rounded-bl-none'
            )}>
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-lg bg-zinc-800 text-white rounded-bl-none">
                    <Loader2 className="animate-spin text-white" />
                </div>
            </div>
        )}
      </div>

      <div className="p-4 bg-zinc-900/50 border-t border-white/10 pb-25">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <TextareaAutosize
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Ketik pesan Anda..."
            className="w-full bg-zinc-800 border-zinc-700 rounded-lg p-3 text-sm text-white resize-none focus:ring-red-500 focus:border-red-500"
            maxRows={5}
          />
          <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()} className="bg-red-600 hover:bg-red-700 flex-shrink-0">
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>

      <AlertDialog open={!!error} onOpenChange={() => setError(null)}>
        <AlertDialogContent className="bg-zinc-900 border-white/20 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Terjadi Kesalahan</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              {error}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setError(null)} className="bg-red-600 hover:bg-red-700">
              Mengerti
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}