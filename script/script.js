const suggestionList = ['torvalds', 'gaearon', 'sindresorhus', 'octocat', 'mojombo'];

function searchSuggestions() {
  const input = document.getElementById('username').value.trim().toLowerCase();
  const suggestions = document.getElementById('suggestions');
  suggestions.innerHTML = '';

  if (!input) return;

  suggestionList.forEach(name => {
    if (name.includes(input)) {
      const li = document.createElement('li');
      li.textContent = name;

      li.addEventListener('click', () => {
        if (confirm(`Search for ${name}?`)) {
          document.getElementById('username').value = name;
          suggestions.innerHTML = '';
          fetchProfile();
        }
      });

      suggestions.appendChild(li);
    }
  });
}

async function fetchProfile() {
  const username = document.getElementById('username').value.trim();
  const profileDiv = document.getElementById('profile');
  document.getElementById('suggestions').innerHTML = '';

  if (!username) {
    profileDiv.innerHTML = `<p class="error-message">Please enter a GitHub username.</p>`;
    return;
  }

  const url = `https://api.github.com/users/${username}`;

  try {
    profileDiv.innerHTML = `<p>Loading...</p>`;
    const response = await fetch(url);

    if (response.ok) {
      const data = await response.json();
      renderProfile(data);
    } else {
      throw new Error({
        404: 'User not found. Please check the username.',
        403: 'Rate limit exceeded. Try again later.'
      }[response.status] || 'An unknown error occurred.');
    }
  } catch (error) {
    profileDiv.innerHTML = `<p class="error-message">${error.message}</p>`;
  }
}

function renderProfile(data) {
  const profileDiv = document.getElementById('profile');

  const displayName = data.name || data.login;
  const displayBio = data.bio || 'No bio available';

  profileDiv.innerHTML = `
    <div class="profile-card">
      <img src="${data.avatar_url}" alt="${data.login}" />
      <h2>${displayName}</h2>
      <p>${displayBio}</p>
      <p>Followers: ${data.followers} | Following: ${data.following}</p>
      <p>Public Repos: ${data.public_repos}</p>
      <a href="${data.html_url}" target="_blank">Visit GitHub Profile</a>
    </div>
  `;
}
