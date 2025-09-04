
const showMenu = (toggleId, navId) => {
    const toggle = document.getElementById(toggleId),
        nav = document.getElementById(navId)

    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('show')
        })
    }
}
showMenu('nav-toggle', 'nav-menu')


const navLink = document.querySelectorAll('.nav__link')

function linkAction() {
    const navMenu = document.getElementById('nav-menu')

    navMenu.classList.remove('show')
}
navLink.forEach(n => n.addEventListener('click', linkAction))


const sections = document.querySelectorAll('section[id]')

const scrollActive = () => {
    const scrollDown = window.scrollY

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight,
            sectionTop = current.offsetTop - 58,
            sectionId = current.getAttribute('id'),
            sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']')

        if (scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight) {
            sectionsClass.classList.add('active-link')
        } else {
            sectionsClass.classList.remove('active-link')
        }
    })
}
window.addEventListener('scroll', scrollActive)


const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2000,
    delay: 200,

});

sr.reveal('.home__data, .about__img, .skills__subtitle, .skills__text', {});
sr.reveal('.home__img, .about__subtitle, .about__text, .skills__img', { delay: 400 });
sr.reveal('.home__social-icon', { interval: 200 });
sr.reveal('.skills__data, .work__img, .contact__input', { interval: 200 });

const langBtn = document.getElementById("lang-btn");
const langOptions = document.getElementById("lang-options");

langBtn.addEventListener("click", (e) => {
    e.preventDefault();
    langOptions.style.display =
        langOptions.style.display === "block" ? "none" : "block";
});

document.addEventListener("click", (e) => {
    if (!langBtn.contains(e.target) && !langOptions.contains(e.target)) {
        langOptions.style.display = "none";
    }
});

let gameProjects = [];
let webApps = [];
let erpApps = [];
let currentLang = localStorage.getItem("lang") || "es";
let translations = {};

async function loadTranslations() {
    try {
        const res = await fetch("./assets/data/translations.json");
        translations = await res.json();
        const savedLang = localStorage.getItem("lang") || "es";
        currentLang = savedLang;
        setLanguage(currentLang);
    } catch (error) {
        console.error("Error cargando traducciones:", error);
    }
}

fetch('./assets/data/data.json')
    .then(response => {
        if (!response.ok) throw new Error('Error al cargar el archivo JSON');
        return response.json();
    })
    .then(projects => {
        const gameContainer = document.getElementById('gamesContainer');
        const webAppContainer = document.getElementById('webAppContainer');
        const erpContainer = document.getElementById('erpContainer');
        
        gameProjects = projects.filter(p => p.type === 'game');
        webApps = projects.filter(p => p.type === 'web-app');
        erpApps = projects.filter(p => p.type === 'erp');
        
        renderProjects(gameProjects, gameContainer, 'game');
        renderProjects(webApps, webAppContainer, 'web-app');
        renderProjects(erpApps, erpContainer, 'erp');
    })
    .catch(error => console.error('Hubo un problema al cargar los proyectos:', error));

const renderProjects = (projectList, container, type) => {
    container.innerHTML = '';

    projectList.forEach((project, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        
        let titleText = project.title;
        let descText = project.description;

        if (translations[currentLang]) {
            switch (type) {
                case 'game':
                    titleText = translations[currentLang][`work-game-title-${index + 1}`] || project.title;
                    descText = translations[currentLang][`work-game-description-${index + 1}`] || project.description;
                    break;
                case 'web-app':
                    titleText = translations[currentLang][`work-webapp-title-${index + 1}`] || project.title;
                    descText = translations[currentLang][`work-webapp-description-${index + 1}`] || project.description;
                    break;
                case 'erp':
                    titleText = translations[currentLang][`work-erp-title-${index + 1}`] || project.title;
                    descText = translations[currentLang][`work-erp-description-${index + 1}`] || project.description;
                    break;
            }
        }

        card.innerHTML = `
          <img src="${project.image}" alt="${titleText}">
          <div class="card-content">
            <div class="card-header">
              <h4 class="card-title">${titleText}</h4>
              ${project.github ? `
                <a href="${project.github}" target="_blank" class="github-button" title="Ver en GitHub">
                  <i class="bi bi-github"></i>
                </a>` : ''}
            </div>
            <p class="card-description">${descText}</p>
            <div class="card-tech">
              ${project.technologies.map(tech => `<span>${tech}</span>`).join('')}
            </div>
          </div>
        `;

        container.appendChild(card);
    });
};

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("lang", lang);
    
    document.querySelectorAll("[data-key]").forEach(el => {
        const key = el.getAttribute("data-key");
        if (translations[lang] && translations[lang][key]) {
            el.innerHTML = translations[lang][key];
        }
    });
    
    renderProjects(gameProjects, document.getElementById('gamesContainer'), 'game');
    renderProjects(webApps, document.getElementById('webAppContainer'), 'web-app');
    renderProjects(erpApps, document.getElementById('erpContainer'), 'erp');
}

document.addEventListener("DOMContentLoaded", () => {
    loadTranslations();

    document.querySelectorAll("#lang-options a").forEach(option => {
        option.addEventListener("click", (e) => {
            e.preventDefault();
            const lang = option.getAttribute("data-lang");
            setLanguage(lang);
            document.getElementById("lang-options").style.display = "none";
        });
    });
});
