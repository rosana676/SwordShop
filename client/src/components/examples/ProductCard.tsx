import ProductCard from '../ProductCard';

export default function ProductCardExample() {
  return (
    <div className="p-8 bg-background">
      <div className="max-w-sm">
        <ProductCard
          id="1"
          title="Conta Level 120 - Todos os Personagens"
          game="Valorant"
          price={450.00}
          image="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=225&fit=crop"
          seller={{
            name: "GamerPro",
            verified: true
          }}
          status="available"
        />
      </div>
    </div>
  );
}
