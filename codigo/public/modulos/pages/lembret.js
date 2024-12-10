const daysContainer = document.getElementById('daysContainer');
const currentMonthElement = document.getElementById('currentMonth');
const prevMonthButton = document.getElementById('prevMonth');
const nextMonthButton = document.getElementById('nextMonth');
const reminderModal = document.getElementById('reminderModal');
const reminderText = document.getElementById('reminderText');
const saveReminder = document.getElementById('saveReminder');
const closeModal = document.getElementById('closeModal');

let currentDate = new Date();
let selectedDate = null;


 
// Função para renderizar o calendário
function renderCalendar() {
  daysContainer.innerHTML = '';
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();

  currentMonthElement.textContent = currentDate.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });
   // Carregar lembretes do servidor
   fetch('http://localhost:3000/api/reminders')
   .then(response => {
     if (!response.ok) {
       throw new Error(`Erro ao conectar ao servidor: ${response.status}`);
     }
     return response.json();
   })
   .then(data => {
     // Preencher o objeto de lembretes com os dados recebidos
     reminders = data.reduce((acc, reminder) => {
       acc[reminder.date] = reminder.reminder;
       return acc;
     }, {});
     console.log('Lembretes carregados:', reminders);
      // Dias do mês atual
      for (let i = 1; i <= daysInMonth; i++) {
        const day = document.createElement('div');
        day.textContent = i;
        day.classList.add('day');
        const dateKey = `${year}-${month + 1}-${i}`;
        if (reminders[dateKey]) {
          const reminder = document.createElement('div');
          reminder.classList.add('reminder');
          reminder.textContent = reminders[dateKey];
          day.appendChild(reminder);
      };
        // Adiciona evento de clique para editar o lembrete
        day.addEventListener('click', () => {
          selectedDate = dateKey;
          reminderText.value = ''; // Preenche o campo de texto vazio
          reminderModal.classList.add('active');
        });

        daysContainer.appendChild(day);
      }
     //renderCalendar();  // Renderizar o calendário novamente após carregar os lembretes
   })
   .catch(error => {
     console.error('Erro ao conectar ao servidor:', error);
   });
  // Dias do mês anterior (inativos)
  for (let i = firstDay; i > 0; i--) {
    const day = document.createElement('div');
    day.textContent = prevDays - i + 1;
    day.classList.add('day', 'inactive');
    daysContainer.appendChild(day);
  }

 

  // Dias seguintes (inativos)
  const totalCells = firstDay + daysInMonth;
  const nextDays = 42 - totalCells;
  for (let i = 1; i <= nextDays; i++) {
    const day = document.createElement('div');
    day.textContent = i;
    day.classList.add('day', 'inactive');
    daysContainer.appendChild(day);
  }
}

// Função para salvar o lembrete via requisição POST
function saveReminderHandler() {
  if (selectedDate && reminderText.value.trim() !== '') {
    const reminderData = {
      date: selectedDate,
      reminder: reminderText.value.trim(),
    };

    // Requisição POST para enviar o lembrete ao servidor
    fetch('http://localhost:3000/api/reminders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reminderData), // Envia o lembrete como JSON
    })
    .then(response => response.json())
    .then(data => {
      console.log('Lembrete salvo com sucesso:', data);
      reminderText.value = '';
      reminderModal.classList.remove('active');
      renderCalendar();
    })
    .catch(error => {
      console.error('Erro ao salvar lembrete:', error);
      alert('Houve um erro ao salvar seu lembrete. Tente novamente mais tarde.');
    });
  } else {
    alert('Por favor, digite um lembrete válido!');
  }
}

// Função para fechar o modal
function closeModalHandler() {
  reminderModal.classList.remove('active');
}

// Navegação entre meses
prevMonthButton.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

nextMonthButton.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

// Eventos para salvar e fechar o modal
saveReminder.addEventListener('click', saveReminderHandler);
closeModal.addEventListener('click', closeModalHandler);

// Inicializa o calendário
renderCalendar();