import React, { useState } from 'react';

const SellProduct: React.FC = () => {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productImage, setProductImage] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productImage) {
      setErrorMessage('Você precisa selecionar uma imagem.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', productName);
      formData.append('price', productPrice.replace(',', '.'));
      formData.append('image', productImage);

      // Chame aqui a função que cria o produto
      await createProduct(formData);

      // Limpa os campos após sucesso
      setProductName('');
      setProductPrice('');
      setProductImage(null);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Erro ao criar produto. Verifique as informações e tente novamente.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center' }}>Adicionar Produto</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Nome do Produto"
            required        
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            placeholder="Preço (ex: 10,00)"
            required        
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files) {
                setProductImage(e.target.files[0]);
              }
            }}
            required        
            style={{ width: '100%', padding: '10px' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}>
          Criar Produto
        </button>
      </form>
      {errorMessage && <p style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</p>}
    </div>
  );
};

export default SellProduct;