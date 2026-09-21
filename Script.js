// Простой загрузчик данных с рендерингом
async function loadData(file) {
    try {
        const response = await fetch(`../data/${file}.json`);
        return await response.json();
    } catch (err) {
        console.error('Ошибка загрузки:', err);
        return null;
    }
}

// Рендер простых карточек
function renderEntityCards(container, items, config = {}) {
    if (!items || !items.length) {
        container.innerHTML = '<p class="loading">Записей не найдено.</p>';
        return;
    }
    container.innerHTML = items.map(item => {
        const title = item.name || item.title || 'Без названия';
        const meta = item.type || item.role || item.location || '';
        const description = item.description || item.text || '';
        const quote = item.quote || '';
        return `
            <div class="entity-card">
                <h4>${title}</h4>
                ${meta ? `<div class="meta">${meta}</div>` : ''}
                ${description ? `<p>${description}</p>` : ''}
                ${quote ? `<div class="quote">${quote}</div>` : ''}
            </div>
        `;
    }).join('');
}

// Поиск
function setupSearch(inputId, containerId, dataKey) {
    const input = document.getElementById(inputId);
    const container = document.getElementById(containerId);
    if (!input || !container) return;

    let items = [];
    loadData(dataKey).then(data => {
        items = Array.isArray(data) ? data : (data.items || []);
        renderEntityCards(container, items);

        input.addEventListener('input', () => {
            const q = input.value.toLowerCase();
            const filtered = items.filter(it =>
                JSON.stringify(it).toLowerCase().includes(q)
            );
            renderEntityCards(container, filtered);
        });
    });
}

// Уведомление, если страница открыта локально без сервера
if (location.protocol === 'file:') {
    console.warn('Для загрузки JSON-данных запустите локальный сервер: python -m http.server');
}

// Автоматически инициализируем страницы по data-page
document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.dataset.page;
    if (page === 'npcs') setupSearch('searchInput', 'entityContainer', 'npcs');
    if (page === 'bestiary') setupSearch('searchInput', 'entityContainer', 'bestiary');
    if (page === 'quests') setupSearch('searchInput', 'entityContainer', 'quests');
    if (page === 'factions') setupSearch('searchInput', 'entityContainer', 'factions');
    if (page === 'city') setupSearch('searchInput', 'entityContainer', 'city');
});
