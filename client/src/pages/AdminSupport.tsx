
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Send, XCircle } from "lucide-react";

interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  message: string;
  status: string;
  priority: string;
  createdAt: string;
  userName?: string;
  userEmail?: string;
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

export default function AdminSupport() {
  const queryClient = useQueryClient();
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState("");

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  const { data: tickets } = useQuery<SupportTicket[]>({
    queryKey: ["/api/admin/support/all"],
  });

  const { data: messages } = useQuery<SupportMessage[]>({
    queryKey: [`/api/support/${selectedTicket}/messages`],
    enabled: !!selectedTicket,
    refetchInterval: 3000,
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

  const closeTicket = useMutation({
    mutationFn: async (ticketId: string) => {
      const response = await fetch(`/api/support/${ticketId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "closed" }),
      });
      if (!response.ok) throw new Error("Erro ao fechar ticket");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/support/all"] });
      setSelectedTicket(null);
    },
  });

  const activeTickets = tickets?.filter(t => t.status !== "closed") || [];
  const closedTickets = tickets?.filter(t => t.status === "closed") || [];
  const currentTicket = tickets?.find(t => t.id === selectedTicket);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="default">Aberto</Badge>;
      case "in_progress":
        return <Badge variant="secondary">Em Andamento</Badge>;
      case "closed":
        return <Badge variant="outline">Fechado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <ProtectedRoute requireAdmin={true}>
      <SidebarProvider style={style as React.CSSProperties}>
        <div className="flex h-screen w-full dark">
          <AdminSidebar />
        
          <div className="flex flex-col flex-1 overflow-hidden">
            <header className="flex items-center justify-between p-4 border-b bg-card/50">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <h1 className="text-2xl font-heading font-bold">Gerenciar Suporte</h1>
              </div>
            </header>
            
            <main className="flex-1 overflow-auto p-6">
              <Tabs defaultValue="active" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="active">Tickets Ativos ({activeTickets.length})</TabsTrigger>
                  <TabsTrigger value="history">Histórico ({closedTickets.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="active" className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Tickets Abertos</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[600px]">
                          <div className="space-y-2">
                            {activeTickets.map((ticket) => (
                              <div
                                key={ticket.id}
                                onClick={() => setSelectedTicket(ticket.id)}
                                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                                  selectedTicket === ticket.id ? "bg-primary/20" : "bg-muted/50 hover:bg-muted"
                                }`}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium text-sm">{ticket.subject}</span>
                                  {getStatusBadge(ticket.status)}
                                </div>
                                <p className="text-xs text-muted-foreground mb-1">
                                  {ticket.userName} ({ticket.userEmail})
                                </p>
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

                    <div className="lg:col-span-2">
                      {currentTicket && currentTicket.status !== "closed" ? (
                        <Card className="h-[700px] flex flex-col">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div>
                                <CardTitle>{currentTicket.subject}</CardTitle>
                                <CardDescription>
                                  {currentTicket.userName} ({currentTicket.userEmail})
                                </CardDescription>
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => closeTicket.mutate(currentTicket.id)}
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Encerrar Ticket
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="flex-1 flex flex-col">
                            <ScrollArea className="flex-1 pr-4 mb-4">
                              <div className="space-y-4">
                                {messages?.map((msg) => (
                                  <div
                                    key={msg.id}
                                    className={`flex ${msg.isAdmin ? "justify-end" : "justify-start"}`}
                                  >
                                    <div
                                      className={`max-w-[80%] rounded-lg p-3 ${
                                        msg.isAdmin
                                          ? "bg-primary text-primary-foreground"
                                          : "bg-muted"
                                      }`}
                                    >
                                      <p className="text-xs font-medium mb-1">
                                        {msg.isAdmin ? "Você (Suporte)" : msg.userName}
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
                            
                            <div className="flex gap-2">
                              <Input
                                placeholder="Digite sua resposta..."
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
                          </CardContent>
                        </Card>
                      ) : (
                        <Card className="h-[700px] flex items-center justify-center">
                          <p className="text-muted-foreground">Selecione um ticket para ver a conversa</p>
                        </Card>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="history">
                  <Card>
                    <CardHeader>
                      <CardTitle>Histórico de Tickets</CardTitle>
                      <CardDescription>Tickets encerrados</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Assunto</TableHead>
                            <TableHead>Usuário</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Data</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {closedTickets.map((ticket) => (
                            <TableRow key={ticket.id}>
                              <TableCell>{ticket.subject}</TableCell>
                              <TableCell>{ticket.userName}</TableCell>
                              <TableCell>{ticket.userEmail}</TableCell>
                              <TableCell>
                                {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true, locale: ptBR })}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      {closedTickets.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">Nenhum ticket no histórico</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
