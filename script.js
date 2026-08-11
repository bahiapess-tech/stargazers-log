const listElement = document.querySelector('#starred-list');

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getSafeText(value, fallback = '') {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }

  return String(value);
}

function formatUpdatedAt(value) {
  if (!value || Number.isNaN(Date.parse(value))) {
    return 'Data não disponível';
  }

  return new Date(value).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

function renderRepositories(repositories) {
  if (!listElement) {
    return;
  }

  if (!Array.isArray(repositories) || repositories.length === 0) {
    listElement.innerHTML = '<li class="empty-state" role="status">Nenhum repositório encontrado.</li>';
    return;
  }

  listElement.innerHTML = repositories
    .filter(Boolean)
    .map((repo) => {
      const name = escapeHtml(getSafeText(repo?.name, 'Repositório sem nome'));
      const description = escapeHtml(getSafeText(repo?.description, 'Sem descrição disponível.'));
      const language = escapeHtml(getSafeText(repo?.language, 'Sem linguagem definida'));
      const stars = Number.isFinite(Number(repo?.stargazers_count))
        ? Number(repo.stargazers_count).toLocaleString('pt-BR')
        : '0';
      const repoUrl = getSafeText(repo?.url, '#');
      const updated = formatUpdatedAt(repo?.updated_at);

      return `
        <li class="repo-item">
          <div class="repo-header">
            <h2 class="repo-name">
              <a href="${escapeHtml(repoUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Abrir repositório ${name} no GitHub">${name}</a>
            </h2>
            <span class="star-badge" aria-label="${stars} estrelas">★ ${stars}</span>
          </div>
          <p class="repo-description">${description}</p>
          <div class="repo-meta">
            <span class="repo-language">${language}</span>
            <span>Atualizado em ${updated}</span>
          </div>
        </li>
      `;
    })
    .join('');
}

async function loadStarredRepositories() {
  if (!listElement) {
    return;
  }

  listElement.setAttribute('aria-busy', 'true');

  try {
    const response = await fetch('events.json');

    if (!response.ok) {
      throw new Error(`Falha ao carregar os dados: ${response.status}`);
    }

    const repositories = await response.json();
    renderRepositories(repositories);
  } catch (error) {
    console.error(error);
    listElement.innerHTML = '<li class="empty-state" role="status">Não foi possível carregar os repositórios marcados com estrela.</li>';
  } finally {
    listElement.setAttribute('aria-busy', 'false');
  }
}

document.addEventListener('DOMContentLoaded', loadStarredRepositories);
