// Selecionar elementos
const goalForm = document.getElementById('goal-form');
const goalInput = document.getElementById('goal-input');
const goalList = document.getElementById('goal-list');

// Adicionar evento ao formulário
goalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const goalText = goalInput.value;

    if (goalText.trim()) {
        addGoal(goalText);
        goalInput.value = '';
    }
});

// Adicionar meta à lista
function addGoal(text) {
    const li = document.createElement('li');
    li.innerHTML = `
        <span>${text}</span>
        <button class="complete-btn">Concluir</button>
    `;
    goalList.appendChild(li);

    // Adicionar evento ao botão de concluir
    li.querySelector('.complete-btn').addEventListener('click', () => {
        li.querySelector('span').classList.toggle('completed');
    });
}
