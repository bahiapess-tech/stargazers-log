const listElement = document.querySelector('#starred-list');

async function loadStarredRepositories() {
  try {
    const response = await fetch('events.json');

    if (!response.ok) {
      throw new Error(`Falha ao carregar os dados: ${response.status}`);
    }

    const repositories = await response.json();
    renderRepositories(repositories);
  } catch (error) {
    console.error(error);
    listElement.innerHTML = '<li class="empty-state">Não foi possível carregar os repositórios marcados com estrela.</li>';
  }
}

function renderRepositories(repositories) {
  if (!repositories || repositories.length === 0) {
    listElement.innerHTML = '<li class="empty-state">Nenhum repositório encontrado.</li>';
    return;
  }

  listElement.innerHTML = repositories
    .map((repo) => {
      const updated = new Date(repo.updated_at).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });

      return `
        <li class="repo-item">
          <div class="repo-header">
            <h2 class="repo-name">
              <a href="${repo.url}" target="_blank" rel="noreferrer">${repo.name}</a>
            </h2>
            <span class="star-badge">★ ${repo.stargazers_count.toLocaleString()}</span>
          </div>
          <p class="repo-description">${repo.description}</p>
          <div class="repo-meta">
            <span class="repo-language">${repo.language}</span>
            <span>Atualizado em ${updated}</span>
          </div>
        </li>
      `;
    })
    .join('');
}

document.addEventListener('DOMContentLoaded', loadStarredRepositories);
