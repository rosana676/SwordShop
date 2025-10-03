
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageSquare, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  message: string;
  status: string;
  priority: string;
  createdAt: string;
}

interface SupportMessage {
  id: string;
  ticketId: string;
  userId: string;
  message: string;
  isAdmin: boolean;
  createdAt: string;
  userName: string;
}

export default function UserSupport() {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState("");

  const { data: tickets } = useQuery<SupportTicket[]>({
    queryKey: ["/api/support/my-tickets"],
    enabled: isAuthenticated,
  });

  const { data: messages } = useQuery<SupportMessage[]>({
    queryKey: [`/api/support/${selectedTicket}/messages`],
    enabled: !!selectedTicket,
    refetchInterval: 3000,
  });

  const createTicket = useMutation({
    mutationFn: async (data: { subject: string; message: string; priority: string }) => {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao criar ticket");
      }
      return response.json();
    },
    onSuccess: (newTicket) => {
      queryClient.invalidateQueries({ queryKey: ["/api/support/my-tickets"] });
      setSubject("");
      setMessage("");
      setSelectedTicket(newTicket.id);
    },
  });

  const sendMessage = useMutation({
    mutationFn: async (data: { ticketId: string; message: string }) => {
      const response = await fetch(`/api/support/${data.ticketId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: data.message }),
      });
      if (!response.ok) throw new Error("Erro ao enviar mensagem");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/support/${selectedTicket}/messages`] });
      setChatMessage("");
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Acesso Negado</CardTitle>
            <CardDescription>Você precisa estar logado para acessar o suporte.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const activeTickets = tickets?.filter(t => t.status !== "closed") || [];
  const currentTicket = tickets?.find(t => t.id === selectedTicket);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-heading font-bold mb-6">Central de Suporte</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Novo Ticket</CardTitle>
              <CardDescription>Descreva seu problema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Assunto"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
              <Textarea
                placeholder="Descreva seu problema..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              />
              <Button
                onClick={() => createTicket.mutate({ subject, message, priority: "medium" })}
                disabled={!subject || !message}
                className="w-full"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Abrir Ticket
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Meus Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {activeTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedTicket === ticket.id ? "bg-primary/20" : "bg-muted/50 hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{ticket.subject}</span>
                        <Badge variant={ticket.status === "open" ? "default" : "secondary"}>
                          {ticket.status === "open" ? "Aberto" : "Em Andamento"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true, locale: ptBR })}
                      </p>
                    </div>
                  ))}
                  {activeTickets.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">Nenhum ticket ativo</p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {currentTicket ? (
            <Card className="h-[700px] flex flex-col">
              <CardHeader>
                <CardTitle>{currentTicket.subject}</CardTitle>
                <CardDescription>
                  Ticket #{currentTicket.id.slice(0, 8)} - {currentTicket.status}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <ScrollArea className="flex-1 pr-4 mb-4">
                  <div className="space-y-4">
                    {messages?.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.userId === user?.id ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            msg.userId === user?.id
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-xs font-medium mb-1">
                            {msg.isAdmin ? "Suporte" : msg.userName}
                          </p>
                          <p className="text-sm">{msg.message}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true, locale: ptBR })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                {currentTicket.status !== "closed" && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Digite sua mensagem..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && chatMessage.trim()) {
                          sendMessage.mutate({ ticketId: currentTicket.id, message: chatMessage });
                        }
                      }}
                    />
                    <Button
                      onClick={() => sendMessage.mutate({ ticketId: currentTicket.id, message: chatMessage })}
                      disabled={!chatMessage.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="h-[700px] flex items-center justify-center">
              <p className="text-muted-foreground">Selecione um ticket para ver a conversa</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
