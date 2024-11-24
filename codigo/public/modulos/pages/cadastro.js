document.getElementById('articleForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Impede o envio padrão do formulário
  
    // Coleta os dados do formulário, incluindo a URL
    const newArticle = {
      id: Date.now(), // ID único gerado pela data/hora atual
      nome: document.getElementById('title').value,
      data_de_publicacao: document.getElementById('date').value,
      autor: document.getElementById('author').value,
      resumo: document.getElementById('summary').value,
      referencia: document.getElementById('reference').value,
      url: document.getElementById('url').value,  // Coleta a URL do artigo
    };
  
    try {
      // Envia os dados para o JSON Server via POST
      const response = await fetch('http://localhost:3000/artigos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newArticle),
      });
  
      if (response.ok) {
        alert('Artigo cadastrado com sucesso!');
        document.getElementById('articleForm').reset(); // Limpa o formulário
      } else {
        throw new Error('Erro ao cadastrar o artigo.');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Não foi possível cadastrar o artigo.');
    }
  });
  