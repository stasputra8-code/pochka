// Инициализация параметров Supabase из вашего запроса
const SUPABASE_URL = 'https://keaxudebwoaktfkelnkb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_aLXRXMaqgQBPWtmRTRWmgw_EkT_biM1';

// Создаем клиент Supabase
const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const statusEl = document.getElementById('connection-status');
const tableBody = document.getElementById('table-body');

async function fetchProducts() {
    try {
        // Делаем запрос к таблице products
        const { data, error } = await _supabase
            .from('products')
            .select('*')
            .order('id', { ascending: true });

        if (error) {
            throw error;
        }

        statusEl.textContent = 'Подключение успешно: таблица "products" загружена';
        statusEl.classList.add('success');

        renderTable(data);
    } catch (err) {
        console.error('Ошибка при загрузке данных:', err.message);
        statusEl.textContent = `Ошибка подключения: ${err.message}`;
        statusEl.classList.add('error');
        tableBody.innerHTML = `<tr><td colspan="5" class="loading" style="color: var(--error-color);">Не удалось загрузить данные из базы.</td></tr>`;
    }
}

function renderTable(rows) {
    if (!rows || rows.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" class="loading">Таблица пуста</td></tr>`;
        return;
    }

    tableBody.innerHTML = '';

    rows.forEach(row => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${row.id}</td>
            <td>${escapeHtml(row.name)}</td>
            <td>${Number(row.price).toFixed(2)} ₽</td>
            <td>${row.quantity}</td>
            <td>${Number(row.total).toFixed(2)} ₽</td>
        `;
        
        tableBody.appendChild(tr);
    });
}

// Защита от XSS
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

// Запуск загрузки при открытии страницы
document.addEventListener('DOMContentLoaded', fetchProducts);
