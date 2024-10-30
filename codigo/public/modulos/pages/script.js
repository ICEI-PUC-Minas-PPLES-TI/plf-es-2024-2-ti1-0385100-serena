document.addEventListener('DOMContentLoaded', () => {
    const articlesContainer = document.getElementById('articlesContainer');
    
    // Carregar artigos do db.json
    fetch('../../../db/db.json')
        .then(response => response.json())
        .then(data => {
            const articles = data.artigos; 
            articles.forEach(article => {
                // Criar a caixa do artigo
                const articleBox = document.createElement('div');
                articleBox.className = 'article-box';

                // Adicionar título
                const title = document.createElement('h2');
                title.className = 'article-title';
                title.textContent = article.nome;

                // Adicionar data
                const date = document.createElement('p');
                date.className = 'article-date';
                date.textContent = article.data_publicacao;

                // Adicionar resumo
                const summary = document.createElement('p');
                summary.className = 'article-summary';
                summary.textContent = article.resumo; 

                // Adicionar autor
                const author = document.createElement('p');
                author.className = 'article-author';
                author.textContent = article.autor;

                // Adicionar link
                const link = document.createElement('a');
                link.href = article.url; 
                link.target = '_blank';

                const button = document.createElement('button');
                button.className = 'read-button';
                button.textContent = 'Ler artigo';

                // Anexar elementos
                link.appendChild(button);
                articleBox.appendChild(title);
                articleBox.appendChild(date);
                articleBox.appendChild(summary);
                articleBox.appendChild(author);
                articleBox.appendChild(link);
                articlesContainer.appendChild(articleBox);
            });

            // Inicializa filtros
            initializeFilters(articles);
        })
        .catch(error => {
            console.error('Erro ao carregar os artigos:', error);
            articlesContainer.innerHTML = '<p>Erro ao carregar artigos.</p>';
        });

    function initializeFilters(articles) {
        const searchBar = document.getElementById('searchBar');
        const filterSelect = document.getElementById('filterSelect');

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
        const selectedDate = dateFilter.value; 
    
        const articleBoxes = articlesContainer.querySelectorAll('.article-box');
    
        articleBoxes.forEach((box, index) => {
            const title = box.querySelector('.article-title').textContent.toLowerCase();
            const date = articles[index].data_publicacao.toLowerCase(); // Usar a data de publicação do artigo
            const summary = box.querySelector('.article-summary').textContent.toLowerCase();
            const author = articles[index].autor.toLowerCase(); 
    
            const matchesSearch = title.includes(searchTerm) || summary.includes(searchTerm);
            const matchesAuthor = selectedAuthor ? author === selectedAuthor.toLowerCase() : true;
            const matchesDate = selectedDate ? date === selectedDate : true; 
    
            // Exibe ou esconde o box com base nos filtros
            box.style.display = matchesSearch && matchesAuthor && matchesDate ? '' : 'none';
        });
    }
})    