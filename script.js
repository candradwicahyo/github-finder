window.onload = () => {
  
  const content = document.querySelector('.content');
  const searchInput = document.querySelector('.search-input');
  const btnSubmit = document.querySelector('.btn-submit');
  btnSubmit.addEventListener('click', searchData);
  
  async function searchData() {
    try {
      const value = searchInput.value.trim();
      if (validate(value) == true) {
        const data = await fetchData(`https://api.github.com/users/` + value);
        updateUI(data);
      }
    } catch (error) {
      const err = showError(error.message);
      content.innerHTML = err;
    }
  }
  
  function validate(value) {
    if (!value) return alerts('error', 'field was empty!');
    if (value.match(/\s/gmi)) return alerts('error', 'please enter valid username and without whitespace!');
    return true;
  }
  
  function alerts(type, text) {
    swal.fire ({
      icon: type,
      title: 'Alert',
      text: text
    });
  }
  
  function fetchData(value) {
    return fetch(value)
      .then(response => response.json())
      .then(response => {
        if (response.message) throw new Error(response.message);
        return response;
      })
      .catch(error => {
        throw new Error(error);
      });
  }
  
  async function updateUI(data) {
    const result = await fetchData(data.repos_url);
    content.innerHTML = '';
    content.insertAdjacentHTML('beforeend', showUI(data, result));
  }
  
  function showUI(data, result) {
    return `
    <div class="bg-white p-4 shadow-sm overflow-hidden">
      <div class="row">
        <div class="col-md-5">
          <img 
            src="${data.avatar_url}" 
            alt="profile image" 
            class="img-fluid rounded mb-4">
        </div>
        <div class="col-md">
          <h3 class="fw-normal m-0">${data.name}</h3>
          <a 
            href="${data.html_url}" 
            target="_blank"
            class="d-block text-decoration-none text-black-50 mb-2">
            ${data.login}
          </a>
          <p class="fw-normal">${data.bio}</p>
          <div class="d-flex align-items-center mb-3">
            <span class="badge text-bg-primary rounded-0 p-2">public repos ${data.public_repos}</span>
            <span class="badge text-bg-secondary rounded-0 p-2 mx-1">followers ${data.followers}</span>
            <span class="badge text-bg-success rounded-0 p-2">following ${data.following}</span>
          </div>
          <div class="d-flex align-items-center flex-wrap my-auto">
            ${updateRepository(result)}
          </div>
        </div>
      </div>
    </div>
    `;
  }
  
  function updateRepository(param) {
    let string = '';
    const result = (param.length > 0) ? param.length / 2 : 0;
    for (let i = 0; i < result; i++) {
      string += showRepository(param[i]);
    }
    return string;
  }
  
  function showRepository({ name, html_url }) {
    return `
    <span class="badge text-bg-secondary p-2 rounded-0 me-1 mb-1">
      <a 
        href="${html_url}" 
        target="_blank"
        class="text-decoration-none text-white">
        ${name}
      </a>
    </span>
    `;
  }
  
  function showError(message) {
    return `
    <div class="col-md-8 my-3 mx-auto">
      <div class="alert alert-danger" role="alert">
        <h3 class="fw-normal mb-2">Alert</h3>
        <p class="fw-light my-auto">${message}</p>
      </div>
    </div>
    `;
  }
  
}