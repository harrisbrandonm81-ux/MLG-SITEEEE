// Config: force-excluded IDs
const FORCE_EXCLUDE_IDS = new Set([6, 7]);

// Helper: is annoying?
function isAnnoying(meme) {
  return Array.isArray(meme.tags) && meme.tags.map(t => t.toLowerCase()).includes('annoying');
}

// Filter: returns true if meme should be included
function includeMeme(meme) {
  if (FORCE_EXCLUDE_IDS.has(meme.id)) return false;
  if (isAnnoying(meme)) return false;
  return true;
}

// Render a single card
function renderCard(meme) {
  const tags = (meme.tags || []).map(t => `<span class="tag">${t}</span>`).join('');
  return `
    <div class="card" data-id="${meme.id}">
      <img src="${meme.image}" alt="${meme.title}" loading="lazy" />
      <div class="meta">
        <div class="title">${meme.title}</div>
        <div class="tags">${tags}</div>
      </div>
    </div>
  `;
}

// Apply search and tag filters
function applyFilters(allMemes) {
  const q = document.getElementById('search').value.trim().toLowerCase();
  const tag = document.getElementById('tagFilter').value.trim().toLowerCase();

  let list = allMemes.filter(includeMeme);

  if (q) {
    list = list.filter(m => (m.title || '').toLowerCase().includes(q));
  }
  if (tag) {
    list = list.filter(m => (m.tags || []).map(t => t.toLowerCase()).includes(tag));
  }
  return list;
}

// Load data and initialize
async function init() {
  try {
    const res = await fetch('memes.json', { cache: 'no-store' });
    const data = await res.json();

    const grid = document.getElementById('grid');
    const empty = document.getElementById('empty');

    function render() {
      const list = applyFilters(data);
      grid.innerHTML = list.map(renderCard).join('');
      empty.classList.toggle('hidden', list.length > 0);
    }

    // Initial render
    render();

    // Wire controls
    document.getElementById('search').addEventListener('input', render);
    document.getElementById('tagFilter').addEventListener('change', render);
  } catch (e) {
    console.error('Failed to load memes.json', e);
    document.getElementById('empty').textContent = 'Failed to load data.';
    document.getElementById('empty').classList.remove('hidden');
  }
}

init();
