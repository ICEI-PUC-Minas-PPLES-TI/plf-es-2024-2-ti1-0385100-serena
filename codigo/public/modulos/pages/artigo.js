document.addEventListener('DOMContentLoaded', () => {
    const articlesContainer = document.getElementById('articlesContainer');
    const searchBar = document.getElementById('searchBar');
    const filterSelect = document.getElementById('filterSelect');
    
    // Carregar artigos do db.json
    fetch('/api/artigos')
        .then(response => response.json())
        .then(articles => {
           // const articles = data.artigos; 
            displayArticles(articles); // Chama a função para exibir os artigos
            initializeFilters(articles); // Inicializa filtros
        })
        .catch(error => {
            console.error('Erro ao carregar os artigos:', error);
            articlesContainer.innerHTML = '<p>Erro ao carregar artigos.</p>';
        });

    // Função para exibir artigos na interface
    function displayArticles(articles) {
        articlesContainer.innerHTML = ''; // Limpa o container antes de adicionar novos artigos

        articles.forEach(article => {
            const articleBox = document.createElement('div');
            articleBox.className = 'article-box';

            articleBox.innerHTML = `
                <h2 class="article-title">${article.nome}</h2>
                <p class="article-date">${article.data_publicacao}</p>
                <p class="article-summary">${article.resumo}</p>
                <p class="article-author">${article.autor}</p>
                <a href="${article.url}" target="_blank">
                    <button class="read-button">Ler artigo</button>
                </a>
            `;

            articlesContainer.appendChild(articleBox);
        });
    }

    function initializeFilters(articles) {
        // Popula o filtro de autores
        const authors = [...new Set(articles.map(article => article.autor))];
        authors.forEach(author => {
            const option = document.createElement('option');
            option.value = author;
            option.textContent = author;
            filterSelect.appendChild(option);
        });

        // Adiciona eventos de entrada para filtros
        searchBar.addEventListener('input', () => filterArticles(articles));
        filterSelect.addEventListener('change', () => filterArticles(articles));
    }

    function filterArticles(articles) {
        const searchTerm = searchBar.value.toLowerCase();
        const selectedAuthor = filterSelect.value;
    
        const articleBoxes = articlesContainer.querySelectorAll('.article-box');
    
        articleBoxes.forEach((box, index) => {
            const title = box.querySelector('.article-title').textContent.toLowerCase();
            const summary = box.querySelector('.article-summary').textContent.toLowerCase();
            const author = articles[index].autor.toLowerCase(); 
    
            const matchesSearch = title.includes(searchTerm) || summary.includes(searchTerm);
            const matchesAuthor = selectedAuthor ? author === selectedAuthor.toLowerCase() : true;
    
            // Exibe ou esconde o box com base nos filtros
            box.style.display = matchesSearch && matchesAuthor ? '' : 'none';
        });
    }
});
