import { db, pool } from "../server/db";
import { categories } from "@shared/schema";

async function seedCategories() {
  try {
    console.log("Criando categorias...");

    const categoriesData = [
      { name: "Contas", icon: "Gamepad2" },
      { name: "Armas & Skins", icon: "Sword" },
      { name: "Boosting", icon: "Trophy" },
      { name: "Itens Raros", icon: "Gem" },
      { name: "Escudos", icon: "Shield" },
      { name: "Moedas", icon: "Coins" },
    ];

    for (const category of categoriesData) {
      await db.insert(categories).values(category).onConflictDoNothing();
    }

    console.log("Categorias criadas com sucesso!");
  } catch (error) {
    console.error("Erro ao criar categorias:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

seedCategories();
