'use strict';

const starWars = [];

$(document).ready(function() {

    let cards = $('.card');
    cards.each(function() {
        const card = $(this);
        const personNames = card.children().first().text();
        card.on('click', async function() {
            const { results } = await getPerson(personNames);
            infoPerson(results[0]);
        });
    });

});

const getPerson = async (nombre) => {
    const URL = `https://swapi.dev/api/people/?search=${nombre}&format=json`;
    try {
        let response = await fetch(URL);
        if(response.ok) {
            const data = await response.json();
            return { results: data.results };
        } else {
            throw new Error('Fallo en la consulta de la api ' + response.statusText);
        }
    } catch(error) {
        throw new Error('Error: Fallo al parsear la respuesta del JSON');
    }
}

const infoPerson = async (character) => {
    
    const sectionPerson = $('.character').first();
    contentPersonDel();
    
    let h2character = $('<h2></h2>').text(character.name);
    sectionPerson.append(h2character);
    
    let h3Fisic = $('<h3></h3>').text('Caracteristicas del personaje');
    sectionPerson.append(h3Fisic);

    let articleInfo = await caracteristicasPersonaje(character);
    sectionPerson.append(articleInfo);

    let peliculas = await filmsPerson(character);
    sectionPerson.append(peliculas);

    if(character.species.length > 0) {
        let especie = await especiePerson(character);
        sectionPerson.append(especie);
    }

    if(character.vehicles.length > 0) {
        let vehiculos = await createVehiculos(character);
        sectionPerson.append(vehiculos);
    }
        
}

const contentPersonDel = () => {
    const sectionPerson = $('.character').first();
    sectionPerson.empty();
}

const feAPI = async (url) => {
    try {
        let response = await fetch(url);
        if(response.ok) {
            return await response.json();
        } else {
            throw new Error('Fallo en la consulta de la api ' + response.statusText);
        }
    } catch(error) {
        throw new Error('Error: Fallo al parsear la respuesta del JSON');
    }
}

const caracteristicasPersonaje = async (character) => {
    let articleInfo = $('<article></article>');

    let cNacimiento = $('<p></p>').text(`Año de nacimiento: ${character.birth_year}`);
    articleInfo.append(cNacimiento);

    let chNacimiento = $('<p></p>');
    let homeworldNac = await feAPI(character.homeworld);
    chNacimiento.text(`Lugar de Nacimiento: ${homeworldNac.name}`);
    articleInfo.append(chNacimiento);

    let cAltura = $('<p></p>').text(`Altura: ${character.height} cm`);
    articleInfo.append(cAltura);

    let cOjos = $('<p></p>').text(`Color de los ojos: ${character.eye_color}`);
    articleInfo.append(cOjos);

    let cPiel = $('<p></p>').text(`Color de la piel: ${character.skin_color}`);
    articleInfo.append(cPiel);

    let cMass = $('<p></p>').text(`Peso: ${character.mass} kgs`);
    articleInfo.append(cMass);

    return articleInfo;
}

const filmsPerson = async ({films}) => {
    let sectionPerson = $('<section></section>');

    let h3Film = $('<h3></h3>').text('Películas');
    sectionPerson.append(h3Film);

    for (let film of films) {
        const articleFilm = $('<article></article>');
        const { director, title, release_date } = await feAPI(film);
        articleFilm.text(title).addClass('pelicula');

        const fDirector = $('<p></p>').text(`Director de la película: ${director}`);
        articleFilm.append(fDirector);

        const fLanzamiento = $('<p></p>').text(`Lanzamiento de la pelicula ${release_date}`);
        articleFilm.append(fLanzamiento);
        sectionPerson.append(articleFilm);
    }

    return sectionPerson;
}

const createVehiculos = async ({vehicles}) => {
    let sectionVehic = $('<section></section>');

    let h3vehic = $('<h3></h3>').text('Vehiculos');
    sectionVehic.append(h3vehic);

    for (let vehiculos_url of vehicles) {
        const articleVehic = $('<article></article>');
        const { name } = await feAPI(vehiculos_url);
        articleVehic.text(name);
        sectionVehic.append(articleVehic);
    }

    return sectionVehic;
}

const especiePerson = async ({species}) => {
    let sectionEspec = $('<section></section>');

    let h3Species = $('<h3></h3>').text('Caracteristicas de la especie');
    sectionEspec.append(h3Species);

    for (let specie_url of species) {
        const { name, language, average_lifespan, classification } = await feAPI(specie_url);

        let articleName = $('<article></article>').text(`Nombre especie: ${name}`);
        let articleLanguage = $('<article></article>').text(`Idioma: ${language}`);
        let articleLifespan = $('<article></article>').text(`Vida media: ${average_lifespan}`);
        let articleCladdification = $('<article></article>').text(`Classification: ${classification}`);

        sectionEspec.append(articleName);
        sectionEspec.append(articleLanguage);
        sectionEspec.append(articleLifespan);
        sectionEspec.append(articleCladdification);
    }

    return sectionEspec;
}
