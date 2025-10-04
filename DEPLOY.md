# Guia de Deploy no Render.com

## Preparação

1. **Criar conta no Render.com**
   - Acesse https://render.com
   - Crie uma conta gratuita ou faça login

2. **Preparar o repositório Git**
   - Certifique-se de que seu código está em um repositório Git (GitHub, GitLab, ou Bitbucket)
   - Faça commit de todas as alterações

## Deploy Automático

### Método 1: Usando render.yaml (Recomendado)

1. **Conectar repositório**
   - No dashboard do Render, clique em "New +"
   - Selecione "Blueprint"
   - Conecte seu repositório Git
   - O Render detectará automaticamente o arquivo `render.yaml`

2. **Configurar variáveis de ambiente**
   - O Render criará automaticamente:
     - Banco de dados PostgreSQL
     - Variável `DATABASE_URL`
     - Variável `SESSION_SECRET`

3. **Deploy**
   - Clique em "Apply"
   - O Render fará o build e deploy automaticamente

### Método 2: Deploy Manual

1. **Criar Banco de Dados PostgreSQL**
   - No dashboard, clique em "New +"
   - Selecione "PostgreSQL"
   - Escolha um nome (ex: sword-shop-db)
   - Selecione o plano (Free tier disponível)
   - Clique em "Create Database"
   - Copie a "External Database URL"

2. **Criar Web Service**
   - No dashboard, clique em "New +"
   - Selecione "Web Service"
   - Conecte seu repositório
   - Configure:
     - **Name:** sword-shop
     - **Runtime:** Node
     - **Build Command:** `npm install && npm run build`
     - **Start Command:** `npm start`
     - **Plan:** Free (ou outro de sua escolha)

3. **Adicionar Variáveis de Ambiente**
   - Na seção "Environment Variables", adicione:
     ```
     NODE_ENV=production
     PORT=5000
     DATABASE_URL=<cole a URL do banco de dados>
     SESSION_SECRET=<gere uma string aleatória segura>
     ```

4. **Deploy**
   - Clique em "Create Web Service"
   - O Render fará o build e deploy automaticamente

## Após o Deploy

### Executar Migrations do Banco de Dados

O Render não executa migrations automaticamente. Você precisa fazer isso manualmente:

1. **Via Render Shell**
   - Acesse seu Web Service no dashboard
   - Clique em "Shell" no menu lateral
   - Execute: `npm run db:push`

2. **Localmente** (conectando ao banco de produção)
   - Configure DATABASE_URL localmente com a URL do Render
   - Execute: `npm run db:push`
   - ⚠️ **ATENÇÃO:** Só faça isso se souber o que está fazendo!

### Verificar o Deploy

1. Acesse a URL fornecida pelo Render (ex: https://sword-shop.onrender.com)
2. Teste as principais funcionalidades:
   - Cadastro de usuário
   - Login
   - Criação de produtos
   - Busca de produtos

## Configurações Importantes

### Build Command
```bash
npm install && npm run build
```
Este comando:
- Instala todas as dependências
- Compila o frontend com Vite
- Compila o backend com esbuild

### Start Command
```bash
npm start
```
Este comando:
- Inicia o servidor Express em modo produção
- Serve os arquivos estáticos do frontend

### Portas
- O Render fornece a variável `PORT` automaticamente
- O código já está configurado para usar `process.env.PORT`

## Troubleshooting

### Erro: "Module not found"
- Certifique-se de que todas as dependências estão em `dependencies` (não `devDependencies`)
- Execute `npm install` localmente para verificar

### Erro: "Database connection failed"
- Verifique se a variável `DATABASE_URL` está configurada corretamente
- Certifique-se de que o banco de dados está ativo

### Erro: "Build failed"
- Verifique os logs de build no Render
- Teste o build localmente: `npm run build`

### Aplicação lenta no Free Tier
- O Render "hiberna" aplicações gratuitas após 15 minutos de inatividade
- O primeiro acesso pode levar 30-60 segundos
- Considere fazer upgrade para um plano pago se necessário

## Atualizações

O Render faz deploy automático quando você:
1. Faz push para o branch principal do seu repositório
2. Ou clica em "Manual Deploy" no dashboard

## Custo

- **Free Tier:**
  - 750 horas/mês de runtime (suficiente para 1 serviço 24/7)
  - 100GB de bandwidth
  - PostgreSQL: 90 dias de retenção de dados, 1GB de armazenamento

- **Starter ($7/mês):**
  - Sem hibernação
  - Mais recursos de CPU e memória
  - Melhor performance

## Suporte

- Documentação oficial: https://render.com/docs
- Status: https://status.render.com
- Community: https://community.render.com
