// Elementos varios de la Pokedex
const mainScreen = document.querySelector('.screen-lcd');
const screenCredits = document.querySelector('.screen-credits');
const mainScreenContent = document.querySelector('.screen-container');
const contentPokemon = document.querySelector('.screen-content');
const bottomLcd = document.querySelector('.bottom-lcd');
const contentBottomLcd = bottomLcd.innerHTML;
const btnOpenPokedex = document.getElementById('btnOpen');
const btnClosedPokedex = document.querySelector('.dark-btn');
const btnLoadMore = document.getElementById('loadMore');
const btnCredits = document.querySelector('#loadCredits');
const coverPokedex = document.querySelector('.pokedex-closed');
const rightPokedex = document.querySelector('.pokedex-right');
const btnRotateImg = document.querySelectorAll('.btn-joystick-R, .btn-joystick-L');

// Elementos estéticos
const blueLight = document.querySelector('.blue-circle-content');
const redLight = document.querySelector('.red-circle');
const yellowLight = document.querySelector('.yellow-circle');
const greenLight = document.querySelector('.green-circle');


// Información y configuración de los tipos de Pokémons
const typeInfo = {
    electric: { 
        textColor: '#000',
        background: '#f0db27',
        langType: 'Eléctrico', 
    },
    fire: { 
        textColor: '#FFF',
        background: '#f64221',
        langType: 'Fuego', 
    },
    water: { 
        textColor: '#FFF',
        background: '#3194f7',
        langType: 'Agua', 
    },
    ice: { 
        textColor: '#000',
        background: '#73d6f7',
        langType: 'Hielo', 
    },
    fairy: { 
        textColor: '#000',
        background: '#f7a5f7',
        langType: 'Hada', 
    },
    dark: { 
        textColor: '#FFF',
        background: '#735242',
        langType: 'Siniestro', 
    },
    rock: { 
        textColor: '#000',
        background: '#b5a563',
        langType: 'Roca', 
    },
    steel: { 
        textColor: '#000',
        background: '#a3a3b4',
        langType: 'Acero', 
    },
    flying: { 
        textColor: '#FFF',
        background: '#6699f7',
        langType: 'Volador', 
    },
    ghost: { 
        textColor: '#FFF',
        background: '#4a4a99',
        langType: 'Fantasma', 
    },
    fighting: {
        textColor: '#FFF',
        background: '#bb5545',
        langType: 'Lucha',
    },
    psychic: {
        textColor: '#FFF',
        background: '#f75498',
        langType: 'Psíquico', 
    },
    bug: {
        textColor: '#FFF',
        background: '#a5b521',
        langType: 'Bicho',
    },
    poison: {
        textColor: '#FFF',
        background: '#964286',
        langType: 'Veneno',
    },
    dragon: {
        textColor: '#FFF',
        background: '#7969f1',
        langType: 'Dragon',
    },
    ground: {
        textColor: '#000',
        background: '#d5b452',
        langType: 'Tierra',
    },
    grass: {
        textColor: '#000',
        background: '#74c753',
        langType: 'Planta',
    },
    normal: {
        textColor: '#000',
        background: '#b2afa2',
        langType: 'Normal',
    },
    default: '#FFF',
};

// Botón de abrir Pokedex
btnOpenPokedex.addEventListener('click', () => {
    coverPokedex.style.transform = 'rotate3d(0, -3, 0, -90deg)';
    setTimeout(() => {
        coverPokedex.style.display = 'none'
    }, "100" );
    rightPokedex.classList.toggle('show-right');
});

// Botón de cerrar Pokedex
btnClosedPokedex.addEventListener('click', () => {

    coverPokedex.style.display = 'flex'
    setTimeout(() => {
        coverPokedex.style.transform = 'rotate3d(0, -3, 0, 0deg)'
    }, "30");
    
    rightPokedex.classList.toggle('show-right');
});


// Límite a mostrar y límite de Pokemons en la API.
const limitPokemon = 151;
const maxLimitPokemon = 1010;

// Botón para cargar más Pokémons
const loadMorePk = async () => {
    await getAllPokemons(maxLimitPokemon);
    btnLoadMore.setAttribute('disabled', 'disabled');
}

// Listar todos los Pokémons de forma limitada.
const getAllPokemons = async limit => {
    for(let i = 1; i <= limit; i++){
        await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`)
                .then(res => res.json())
                .then(data => getPokemon(data))
                .catch(error => getNotFound(error));
    }

    btnRotateImg.forEach(btn => btn.style.display = "none");
}

// Buscador de Pokemon por nombre o Nº
const searchPokemon = async event => {

    contentPokemon.innerHTML = '';

    event.preventDefault();
    const { value } = event.target.pokemon;

    if(value){

        await fetch(`https://pokeapi.co/api/v2/pokemon/${value.toLowerCase()}`)
                .then(res => res.json())
                .then(data => {
                    getPokemon(data);
                    getPokemonStats(data.stats);
                })
                .catch(err => getNotFound(err));

        contentPokemon.style.padding = '0 0 0 6px';
        contentPokemon.style.overflowY = 'hidden';
        btnRotateImg.forEach(btn => btn.style.display = "flex");

    }else{
        getAllPokemons(limitPokemon);
        contentPokemon.style.padding = '0 6px 0 6px';
        contentPokemon.style.overflowY = 'scroll';
        bottomLcd.innerHTML = contentBottomLcd;
    }
}

// Obtener la tarjeta Pokémon con su respectiva información.
const getPokemon = async data => {

    let types = await data.types.map(type => `
        <span class="badge-type" style="background-color: ${typeInfo[type.type.name].background}; color: ${typeInfo[type.type.name].textColor};">${typeInfo[type.type.name].langType}</span>
    `).join('');

    let numPokemon = data.id.toString();

    if (numPokemon.length === 1) {
        numPokemon = '000' + numPokemon;
    }else if (numPokemon.length === 2) {
        numPokemon = '00' + numPokemon;
    }else if (numPokemon.length === 3) {
        numPokemon = '0' + numPokemon;
    }else {
        numPokemon;
    }

    const div = document.createElement('div');

    div.innerHTML = `
        <div class="content-pokemon">
            <div class="show-pokemon">

            <img class="img-pokemon" src="${data.sprites.front_default}" alt="">
                <div class="shadow-pokemon"></div>
            </div>

            <div class="info-pokemon">
                <span class="badge-info-pokemon"><span class="num-pokemon">#${numPokemon}</span></span>
                <span class="name-pokemon">${data.name}</span>

                <span class="badge-info-pokemon">Tipo</span>
                ${types}

            </div>
        </div>`;

    contentPokemon.append(div);

    const imgPokemon = document.querySelector('.img-pokemon');

    // Rotar imagen del Pokemon hacia la izquierda
    btnRotateImg.forEach(btn => {
        btn.addEventListener('click', () => { 

            if (imgPokemon.getAttribute('src') === data.sprites.front_default) {

                imgPokemon.setAttribute('src', data.sprites.back_default);
            } else {
                imgPokemon.setAttribute('src', data.sprites.front_default);
            }
        });
    });

}

// Obtenemos y actualizamos todos los valores de estadísticas del Pokémon buscado
const getPokemonStats = stats => {

    // Máximo stat que puede tener un Pokémon
    const maxStat = 200;
    
    bottomLcd.innerHTML =  `
        <div class="bar-stats-container">
            <span class="label-stats">HP&nbsp;</span>
            <div class="bar-stats">
                <div id="valueHpStat" style="width: ${(stats[0].base_stat / maxStat) * 100}%;" class="progress-content"></div>
            </div>
            <span id="hpStat" class="value-stats">${stats[0].base_stat}</span>
        </div>

        <div class="bar-stats-container">
            <span class="label-stats">ATK</span>
            <div class="bar-stats">
                <div id="valueAtkStat" style="width: ${(stats[1].base_stat / maxStat) * 100}%;" class="progress-content"></div>
            </div>
            <span id="atkStat" class="value-stats">${stats[1].base_stat}</span>
        </div>

        <div class="bar-stats-container">
            <span class="label-stats">DEF</span>
            <div class="bar-stats">
                <div id="valueDefStat" style="width: ${(stats[2].base_stat / maxStat) * 100}%;" class="progress-content"></div>
            </div>
            <span id="defStat" class="value-stats">${stats[2].base_stat}</span>
        </div>

        <div class="bar-stats-container">
            <span class="label-stats">SP-ATK</span>
            <div class="bar-stats">
                <div id="valueSpAtkStat" style="width: ${(stats[3].base_stat / maxStat) * 100}%;" class="progress-content"></div>
            </div>
            <span id="spAtkStat" class="value-stats">${stats[3].base_stat}</span>
        </div>

        <div class="bar-stats-container">
            <span class="label-stats">SP-DEF</span>
            <div class="bar-stats">
                <div id="valueSpDefStat" style="width: ${(stats[4].base_stat / maxStat) * 100}%;" class="progress-content"></div>
            </div>
            <span id="spDefStat" class="value-stats">${stats[4].base_stat}</span>
        </div>

        <div class="bar-stats-container">
            <span class="label-stats">VEL</span>
            <div class="bar-stats">
                <div id="valueVelStat" style="width: ${(stats[5].base_stat / maxStat) * 100}%;" class="progress-content"></div>
            </div>
            <span id="velStat" class="value-stats">${stats[5].base_stat}</span>
        </div>`;
}

// Pantalla de error si un Pokémon no existe.
const getNotFound = () => {

    contentPokemon.innerHTML = '';
    const div = document.createElement('div');

    div.innerHTML = `
        
        <div class="content-pokemon">
            <div class="show-pokemon">

                <img class="img-pokemon" style="width: 120px; height: 120px;" src="./img/poke-shadow.png" alt="">
                <div class="shadow-pokemon"></div>
            </div>

             <div class="info-pokemon">
                 <span class="badge-info-pokemon"><span class="num-pokemon">#???</span></span>
                 <span class="name-pokemon">No encontrado</span>

                 <span class="badge-info-pokemon">Tipo</span>
                 <span class="badge-type" style="background-color: ${typeInfo.default}; color: #000;">???</span>

             </div>
         </div>`;

    contentPokemon.append(div);

    bottomLcd.innerHTML = contentBottomLcd;
    btnLoadMore.setAttribute('disabled', 'disabled');
}

// Apartado de créditos
const loadCredits = () => {

    screenCredits.style.display = 'flex';
    mainScreen.style.display = 'none';

    btnLoadMore.setAttribute('disabled', 'disabled');

    const btnBack = document.querySelector('#backPokedex');

    btnBack.addEventListener('click', () => {
        screenCredits.style.display = 'none';
        mainScreen.style.display = 'flex';
    });
}

// Botón de apagar y encender
const offPokedex = () => {

    const btnOffPokedex = document.querySelector('#offPokedex');

    if(btnOffPokedex.textContent === 'Apagar Pokedex'){

        mainScreenContent.style.opacity = '0';
        mainScreen.classList.toggle('screen-off');
        screenCredits.style.display = 'none';
        mainScreen.style.display = 'flex';

        blueLight.classList.toggle('blue-off');
        redLight.classList.toggle('red-off');
        yellowLight.classList.toggle('yellow-off');
        greenLight.classList.toggle('green-off');
        bottomLcd.classList.toggle('bottom-lcd-off');

        btnOffPokedex.classList.toggle('onBtn');
        btnOffPokedex.textContent = 'Encender Pokedex';
        btnLoadMore.setAttribute('disabled', 'disabled');
        btnCredits.setAttribute('disabled', 'disabled');

    }else if(btnOffPokedex.textContent === 'Encender Pokedex'){
        mainScreenContent.style.opacity = '1';
        mainScreen.classList.toggle('screen-off');
        btnOffPokedex.classList.toggle('onBtn');

        blueLight.classList.toggle('blue-off');
        redLight.classList.toggle('red-off');
        yellowLight.classList.toggle('yellow-off');
        greenLight.classList.toggle('green-off');
        bottomLcd.classList.toggle('bottom-lcd-off');

        btnOffPokedex.textContent = 'Apagar Pokedex';
        btnLoadMore.removeAttribute('disabled');
        btnCredits.removeAttribute('disabled');
    }

}

// Llamamos a la función para listar los Pokémons.
getAllPokemons(limitPokemon);