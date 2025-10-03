
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function createAdmin() {
  console.log('=== Criar Usuário Administrador ===\n');

  const name = await question('Nome: ');
  const email = await question('E-mail: ');
  const password = await question('Senha: ');

  try {
    const response = await fetch('http://localhost:5000/api/auth/create-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('\n✅ Sucesso!');
      console.log('Administrador criado:');
      console.log('  Nome:', data.user.name);
      console.log('  E-mail:', data.user.email);
      console.log('\nVocê já pode fazer login em /admin');
    } else {
      console.log('\n❌ Erro:', data.error);
    }
  } catch (error) {
    console.log('\n❌ Erro ao criar administrador. Certifique-se de que o servidor está rodando.');
    console.log('Execute: npm run dev');
  }

  rl.close();
}

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

createAdmin();
