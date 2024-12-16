document.addEventListener('DOMContentLoaded', () => {
    let currentSearchType = 'user';  // Default to user search
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const userResults = document.getElementById('user-results');
    const repoResults = document.getElementById('repo-results');
    const toggleSearchTypeButton = document.getElementById('toggle-search-type');

    // Event listener for the search form submission
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const searchTerm = searchInput.value.trim();
        
        if (searchTerm === '') return;

        if (currentSearchType === 'user') {
            await searchUsers(searchTerm);
        } else {
            await searchRepos(searchTerm);
        }
    });

    // Toggle search type between user and repo search
    toggleSearchTypeButton.addEventListener('click', () => {
        if (currentSearchType === 'user') {
            currentSearchType = 'repo';
            toggleSearchTypeButton.textContent = 'Search Repos';
            userResults.innerHTML = ''; // Clear user results
        } else {
            currentSearchType = 'user';
            toggleSearchTypeButton.textContent = 'Search Users';
            repoResults.innerHTML = ''; // Clear repo results
        }
    });

    // Function to search for users
    async function searchUsers(query) {
        const url = `https://api.github.com/search/users?q=${query}`;
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
            }
        });
        const data = await response.json();
        displayUserResults(data.items);
    }

    // Function to search for repositories
    async function searchRepos(query) {
        const url = `https://api.github.com/search/repositories?q=${query}`;
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
            }
        });
        const data = await response.json();
        displayRepoResults(data.items);
    }

    // Display user results in the DOM
    function displayUserResults(users) {
        userResults.innerHTML = ''; // Clear previous results
        if (users.length === 0) {
            userResults.innerHTML = '<p>No users found</p>';
            return;
        }
        
        users.forEach(user => {
            const userCard = document.createElement('div');
            userCard.classList.add('user-card');
            userCard.innerHTML = `
                <img src="${user.avatar_url}" alt="${user.login}">
                <a href="${user.html_url}" target="_blank">${user.login}</a>
            `;
            userCard.addEventListener('click', () => fetchUserRepos(user.login));
            userResults.appendChild(userCard);
        });
    }

    // Display repository results in the DOM
    function displayRepoResults(repos) {
        repoResults.innerHTML = ''; // Clear previous results
        if (repos.length === 0) {
            repoResults.innerHTML = '<p>No repositories found</p>';
            return;
        }

        repos.forEach(repo => {
            const repoCard = document.createElement('div');
            repoCard.classList.add('repo-card');
            repoCard.innerHTML = `
                <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                <p>${repo.description || 'No description available'}</p>
            `;
            repoResults.appendChild(repoCard);
        });
    }

    // Function to fetch repositories of a specific user
    async function fetchUserRepos(username) {
        const url = `https://api.github.com/users/${username}/repos`;
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
            }
        });
        const data = await response.json();
        displayRepoResults(data);
    }
});
