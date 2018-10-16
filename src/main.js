import api from './api';
import { __await } from 'tslib';

class App {
    constructor() {
        this.repositories = [];

        this.formElement = document.getElementById('repo-form');
        this.ulElement = document.getElementById('repo-list');
        this.inputEl = document.querySelector('input[name=repository]');
        this.registerHandlers();
    }

    registerHandlers(){
        this.formElement.onsubmit = event => this.addRepository(event);
    }

    setLoading(loading = true){
        if (loading === true){
            let loadingElement = document.createElement('span');
            loadingElement.appendChild(document.createTextNode('Carregando'));
            loadingElement.setAttribute('id', 'loading');
            this.formElement.appendChild(loadingElement);
        } else {
            document.getElementById('loading').remove();
        }
    }

    async addRepository(event){
        event.preventDefault();

        const repoInput = this.inputEl.value;

        if (repoInput.length === 0) {
            return;
        }
       
        this.setLoading();

        try {
            const response = await api.get(`/repos/${repoInput}`);

            const { name, description, html_url, owner: {avatar_url} } = response.data;
    
            this.repositories.push({
                name,
                description,
                avatar_url,
                html_url,
            });
    
            this.inputEl.value = '';
    
            this.render();  
        } catch (err) {
            alert('O repositório não existe :/');
        }
        
        this.setLoading(false);
    }

    render(){
        this.ulElement.innerHTML = '';
        this.repositories.forEach( repo => {

            let imgElement = document.createElement('img');
            imgElement.setAttribute('src', repo.avatar_url);

            let titleElement = document.createElement('strong');
            titleElement.appendChild(document.createTextNode(repo.name));

            let descriptionElement = document.createElement('p');
            descriptionElement.appendChild(document.createTextNode(repo.description));

            let linkElement = document.createElement('a');
            linkElement.setAttribute('target', '_blank');
            linkElement.setAttribute('href', repo.html_url);
            linkElement.appendChild(document.createTextNode('Acessar'));

            let listElement = document.createElement('li');
            
            listElement.appendChild(imgElement);
            listElement.appendChild(titleElement);
            listElement.appendChild(descriptionElement);
            listElement.appendChild(linkElement);

            this.ulElement.appendChild(listElement);
        });
    }
}

new App();