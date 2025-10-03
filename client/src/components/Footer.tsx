import { Sword } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t bg-card/50" data-testid="footer-main">
      <div className="container px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sword className="w-6 h-6 text-primary" />
              <span className="font-heading font-bold text-xl" data-testid="text-footer-logo">Sword Shop</span>
            </div>
            <p className="text-sm text-muted-foreground" data-testid="text-footer-description">
              Marketplace de itens de jogos com proteção total via escrow.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3" data-testid="text-footer-heading-marketplace">Marketplace</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover-elevate inline-block px-2 py-1 rounded-md" data-testid="link-footer-browse">Explorar Itens</a></li>
              <li><a href="#" className="hover-elevate inline-block px-2 py-1 rounded-md" data-testid="link-footer-categories">Categorias</a></li>
              <li><a href="#" className="hover-elevate inline-block px-2 py-1 rounded-md" data-testid="link-footer-sellers">Vendedores</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3" data-testid="text-footer-heading-support">Suporte</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover-elevate inline-block px-2 py-1 rounded-md" data-testid="link-footer-help">Central de Ajuda</a></li>
              <li><a href="#" className="hover-elevate inline-block px-2 py-1 rounded-md" data-testid="link-footer-how-it-works">Como Funciona</a></li>
              <li><a href="#" className="hover-elevate inline-block px-2 py-1 rounded-md" data-testid="link-footer-safety">Segurança</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3" data-testid="text-footer-heading-company">Empresa</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover-elevate inline-block px-2 py-1 rounded-md" data-testid="link-footer-about">Sobre</a></li>
              <li><a href="#" className="hover-elevate inline-block px-2 py-1 rounded-md" data-testid="link-footer-terms">Termos de Uso</a></li>
              <li><a href="#" className="hover-elevate inline-block px-2 py-1 rounded-md" data-testid="link-footer-privacy">Privacidade</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t text-center text-sm text-muted-foreground" data-testid="text-copyright">
          <p>© {currentYear} Sword Shop. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
