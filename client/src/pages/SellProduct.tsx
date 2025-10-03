import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Header from "@/components/Header";
import { Package } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { insertProductSchema } from "@shared/schema";

interface Category {
  id: string;
  name: string;
  icon: string;
}

const sellProductFormSchema = insertProductSchema.omit({
  sellerId: true,
  status: true,
  approvalStatus: true,
  rejectionReason: true,
}).extend({
  imageUrl: z.string().url().optional().or(z.literal("")),
});

type SellProductFormValues = z.infer<typeof sellProductFormSchema>;

export default function SellProduct() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const form = useForm<SellProductFormValues>({
    resolver: zodResolver(sellProductFormSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      game: "",
      categoryId: "",
      imageUrl: "",
    },
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: SellProductFormValues) => {
      const response = await apiRequest("POST", "/api/products", {
        ...data,
        sellerId: user?.id,
        status: "active",
        approvalStatus: "pending",
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Produto criado com sucesso!",
        description: "Seu produto está aguardando aprovação do administrador.",
      });
      form.reset();
      setTimeout(() => setLocation("/meus-produtos"), 1500);
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar produto",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: SellProductFormValues) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Você precisa estar logado",
        description: "Faça login para vender produtos.",
        variant: "destructive",
      });
      setLocation("/login");
      return;
    }

    createProductMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex flex-col dark">
      <Header />

      <main className="flex-1 container px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Package className="w-8 h-8 text-primary" />
            <h1 className="font-heading font-bold text-3xl" data-testid="text-page-title">
              Anunciar Produto
            </h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle data-testid="text-form-title">Informações do Produto</CardTitle>
              <CardDescription data-testid="text-form-description">
                Preencha os dados do seu produto. Ele será avaliado antes de ser publicado.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel data-testid="label-title">Título do Produto</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Conta Valorant Imortal"
                            data-testid="input-title"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel data-testid="label-description">Descrição</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descreva seu produto em detalhes..."
                            rows={4}
                            data-testid="input-description"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel data-testid="label-price">Preço (R$)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              data-testid="input-price"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="game"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel data-testid="label-game">Jogo</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: Valorant"
                              data-testid="input-game"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel data-testid="label-category">Categoria</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-category">
                              <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories?.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel data-testid="label-image">URL da Imagem (opcional)</FormLabel>
                        <FormControl>
                          <Input
                            type="url"
                            placeholder="https://exemplo.com/imagem.jpg"
                            data-testid="input-image"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={createProductMutation.isPending}
                    data-testid="button-submit"
                  >
                    {createProductMutation.isPending ? "Criando..." : "Criar Produto"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
