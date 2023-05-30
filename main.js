const APIURL =  'https://api.github.com/users/';

const main = document.getElementById('main')
const form = document.getElementById('form')
const search = document.getElementById('search')

// get users 

async function getUser(username){
    try{
        const response = await fetch(APIURL + username);
        if(response.status === 404){
throw new Error('No Profile with this username');
        }
        const data = await response.json();
        createUserCard(data);
        await getRepos(username);
    }
    catch(err){
        createErrorCard(err.message);
        showToast(err.message)
    }
}
//  get repos 

async function getRepos(username){
    try{
        const response  = await fetch(APIURL + username  + '/repos?sort=created');
        if (response.status === 404) {
            throw new Error('User repositories not found');
          }
        const data = await response.json();
        addReposToCard(data);
    }catch(err){
        createErrorCard('problem fetching repos')
        showToast('Problem Fetching Repositories')
    }
}

// create user card 

function createUserCard(user){

    const userID = user.name ||user.login;
    const userBio = user.bio ? `<p>${user.bio}</p>` :'';
    const cardHtml = `
    <div class="card">
    <div>
    <a href="${user.html_url}" target="_blank">
      <img src="${user.avatar_url}" alt="${user.name}" class="avatar">
    </div>
    <div class="user-info">
      <h2>${userID}</h2>
      ${userBio}
      <ul>
        <li>${user.followers} <strong>Followers</strong></li>
        <li>${user.following} <strong>Following</strong></li>
        <li>${user.public_repos} <strong>Repos</strong></li>
      </ul>

      <div id="repos"></div>
    </div>
  </div>
    `
    main.innerHTML   = cardHtml;

}

// create error 
function createErrorCard(err){
    const cardHTML = `
    <div class="card">
        <h1>${err}</h1>
    </div>
`
main.innerHTML = cardHTML
}

// add repo

function addReposToCard(repos){
    const reposEl = document.getElementById('repos')

    repos
    .slice(0,6)
    .forEach(repo =>{
        const repoEl = document.createElement('a');
        repoEl.classList.add('repo')
        repoEl.href = repo.html_url
        repoEl.target = '_blank'
        repoEl.innerText  = repo.name

        reposEl.appendChild(repoEl)
    })

}


// event listenter 
form.addEventListener('submit',(e) =>{
    e.preventDefault();
    const user = search.value;

    if(user){
        getUser(user)
        search.value = ''
    }
})