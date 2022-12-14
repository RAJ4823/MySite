const detailsPage = select('#portfolio-details');
const description = select('#description');
const menuPage = select('#portfolio-menu');
const category = select('#category');
const image = select('#image');
const title = select('#title');
const date = select('#date');
const url = select('#url');

//Object of portfolio details
const data = {
    'supernotes': {
        title: 'SuperNotes',
        category: 'Web',
        date: 'August 2022',
        url: 'https://raj4823.github.io/SuperNotes/',
        description: 'SuperNotes allows you to manage your notes. You can add, delete, edit or can search the notes. It has incredible 5 themes with light mode and dark mode.',
    },
    'super-calculator': {
        title: 'Super Calculator',
        category: 'Web',
        date: 'Jan 2022',
        url: 'https://raj4823.github.io/SuperCalculator/',
        description: 'Simple calculator made with HTML, CSS & JS. It has color-changing background which looks awsome.',
    },
    'nmhp': {
        title: 'NMHP',
        category: 'UI',
        date: 'Mar 2022',
        url: 'https://www.figma.com/file/HOvm8hBwc6MAUnzIxJSOsK/SIH?node-id=0:1',
        description: 'NMHP means National Mental Health Programme. It is a SIH 2022 project. Our main aim was to reduce exploitations happening in the hospitals with the help of website. This UI describes the working of our website.',
    },
    'student-portfolio': {
        title: 'Student Portfolio',
        category: 'UI',
        date: 'Jun 2022',
        url: 'https://www.figma.com/file/ws2Hms5tuk4PgdJ5giPTdF/Student-Portfolio?node-id=0%3A1',
        description: 'Student Portfolio UI made on FIGMA. It contains both desktop view and mobile view.',
    },
    'weather-site': {
        title: 'Weather Site',
        category: 'Web + API',
        date: 'May 2022',
        url: 'https://github.com/RAJ4823/weather-site',
        description: 'A site that gives weather info of any city that you search. It uses OpenWeather API to display weather info of searched city. (Currently Not Hosted)',
    },
    'raj-wordpress': {
        title: 'My Site',
        category: 'WordPress',
        date: 'Dec 2020',
        url: 'https://rajhalpani.wordpress.com/',
        description: 'A wordpress based blog site of mine with over 7000+ site views.',

    },
    'email-phone-extractor': {
        title: 'Email & Phone Extractor',
        category: 'Chrome Extenstion',
        date: 'Sep 2022',
        url: 'https://github.com/RAJ4823/Email-and-Phone-Number-Extractor',
        description: 'It is a chrome Extension for extracting all Emails and Phone Numbers from a web page. You can download it as .txt or .csv file.',
    },
    'my-site': {
        title: 'My Site',
        category: 'Bootstrap + Design',
        date: 'Oct 2022',
        url: 'https://github.com/RAJ4823/MySite',
        description: 'You can see how good it is, but for details it is a bootstrap based portfolio website of mine. It consists a great UI and design. It is a fully responsive website. Current version is 1.0\n\nThis is an easter egg and you found it. ????',
    }
}

//Display selected portfolio details
function displayDetails(key) {
    detailsPage.style.display = 'block';
    menuPage.style.display = 'none';

    let project = data[key];
    title.innerText = project.title;
    category.innerText = project.category;
    date.innerText = project.date;
    url.href = project.url;
    image.src = `assets/img/portfolio/${key}.jpg`
    description.innerText = project.description;
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Closes the portfolio details and open main portfolio section page
function closeDetails() {
    detailsPage.style.display = 'none';
    menuPage.style.display = 'block';
}

// Activate listener on window load
window.addEventListener('load', () => {
    let portfolioFilters = select('#portfolio-flters li', true);
    let selectedFilter = '*';
    filterPortfolios(selectedFilter);

    on('click', '#portfolio-flters li', function (e) {
        e.preventDefault();
        portfolioFilters.forEach((ele) => ele.classList.remove('filter-active'));
        this.classList.add('filter-active');

        filterPortfolios(this.getAttribute('data-filter'));
    }, true);
});

//Filter selected portfolios
function filterPortfolios(selectedFilter) {
    let portfolios = select('.portfolio-item', true);
    portfolios.forEach((ele) => {
        ele.style.transition = '1s';
        if (ele.classList.contains(selectedFilter) || selectedFilter == '*') {
            ele.classList.add('filter-show');
        }
        else {
            ele.classList.remove('filter-show');
        }
    });
}

// Initiate portfolio lightbox 
const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
});
