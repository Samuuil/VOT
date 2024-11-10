const API_URL = "http://localhost:3000";

const form = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');

async function fetchExpenses() {
  try {
    const res = await fetch(`${API_URL}/expenses`);
    if (!res.ok) throw new Error('Failed to fetch expenses');

    const expenses = await res.json();
    expenseList.innerHTML = expenses
      .map(expense => {
        const formattedDate = new Date(expense.date).toISOString().split('T')[0];
        return `
          <li>
            <div class="expense-content">
              <span>${expense.amount} - ${expense.category} - ${formattedDate} - ${expense.description}</span>
              <div class="expense-buttons">
                <button onclick="deleteExpense(${expense.id})">Delete</button>
                <button onclick="showEditForm(${expense.id}, ${expense.amount}, '${expense.category}', '${formattedDate}', '${expense.description}')">Edit</button>
              </div>
            </div>
          </li>
        `;
      })
      .join('');
  } catch (error) {
    console.error('Error fetching expenses:', error);
    expenseList.innerHTML = `<li>Error loading expenses.</li>`;
  }
}


async function addExpense(e) {
  e.preventDefault();
  console.log('Form submitted');

  const expense = {
    amount: parseFloat(form.amount.value),
    category: form.category.value,
    date: form.date.value,
    description: form.description.value
  };

  console.log('Expense to be added:', expense);

  try {
    const res = await fetch(`${API_URL}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense)
    });

    if (!res.ok) throw new Error('Failed to add expense');
    fetchExpenses();
    form.reset();
  } catch (error) {
    console.error('Error adding expense:', error);
  }
}


async function deleteExpense(id) {
  try {
    const res = await fetch(`${API_URL}/expenses/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete expense');
    await fetchExpenses();
  } catch (error) {
    console.error('Error deleting expense:', error);
  }
}

function showEditForm(id, amount, category, date, description) {
  form.amount.value = amount;
  form.category.value = category;
  form.date.value = date;
  form.description.value = description;

  form.onsubmit = async function(e) {
    e.preventDefault();
    const updatedExpense = {
      amount: parseFloat(form.amount.value),
      category: form.category.value,
      date: form.date.value,
      description: form.description.value
    };

    try {
      const res = await fetch(`${API_URL}/expenses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedExpense)
      });

      if (!res.ok) throw new Error('Failed to update expense');
      await fetchExpenses();
      form.reset();
      form.onsubmit = addExpense;
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };
}


form.onsubmit = addExpense;
fetchExpenses();
