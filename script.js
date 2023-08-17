
// 'use strict';

const pokeAPIBaseUrl = 'https://pokeapi.co/api/v2/pokemon/';
const game = document.getElementById('game');
let isPaused = false;
let firstPick;
let matches;

const colors = {
    fire: '#FDDFDF',
    grass: '#DEFDE0',
    electric: '#FCF7DE',
    water: '#DEF3FD',
    ground: '#f4e7da',
    rock: '#d5d5d4',
    fairy: '#fceaff',
    poison: '#98d7a5',
    bug: '#f8d5a3',
    dragon: '#97b3e6',
    psychic: '#eaeda1',
    flying: '#F5F5F5',
    fighting: '#E6E0D4',
    normal: '#F5F5F5'
};

const loadPokemon = async () => {
    const randomIds = new Set();

    while (randomIds.size < 8) {
        const randomNumber = Math.ceil(Math.random() * 150);
        randomIds.add(randomNumber);
    }

    const pokePromises = [...randomIds].map(id => fetch(pokeAPIBaseUrl + id)); // => Promise
    const response = await Promise.all(pokePromises); // => Response
    return await Promise.all(response.map(res => res.json()));


    // const randomIdsArr = [...randomIds];
    // for (let i = 0; i < randomIdsArr.length; i++) {
    //     const res = await fetch(pokeAPIBaseUrl + randomIdsArr[i]);
    //     const pokemon = await res.json();
    //     console.log(pokemon);
    // }
};

{/* <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" /> */ }

const displayPokemon = (pokemon) => {
    pokemon.sort(() => Math.random() - 0.5);
    const pokemonHTML = pokemon.map(poke => {

        const type = poke.types[0]?.type?.name || 'normal';
        const color = colors[type];

        return `
            <div onclick="clickCard(event)" class="card" style="background-color: 
            ${color}" data-pokename="${poke.name}">

                <div class="front"></div>

                <div class="back rotated" style="background-color: ${color}">
                    <img src="${poke.sprites.other.dream_world.front_default}" alt = "${poke.name}" />
                </div >

            </div >
    `;
    }).join('');
    game.innerHTML = pokemonHTML;
};

const clickCard = (e) => {
    const pokemonCard = e.currentTarget;

    const [front, back] = getFrontAndBackFromCard(pokemonCard);

    if (front.classList.contains('rotated') || isPaused) return;

    isPaused = true;
    rotateElements([front, back]);

    if (!firstPick) {
        firstPick = pokemonCard;
        isPaused = false;
    } else {
        const secondPokemonName = pokemonCard.dataset.pokename;
        const firstPokemonName = firstPick.dataset.pokename;
        if (firstPokemonName !== secondPokemonName) {
            const [firstFront, firstBack] = getFrontAndBackFromCard(firstPick);

            setTimeout(() => {
                rotateElements([front, back, firstFront, firstBack]);
                firstPick = null;
                isPaused = false;
            }, 800);
        } else {
            matches++;
            if (matches === 8) {
                console.log('Winner');
                alert('Winner');
            }
            firstPick = null;
            isPaused = false;
        }
    }
};

const rotateElements = (elements) => {
    if (typeof elements !== 'object' || !elements.length) return; //check is not Arrey

    elements.forEach(element => element.classList.toggle('rotated'));
};

const getFrontAndBackFromCard = (card) => {
    const front = card.querySelector('.front');
    const back = card.querySelector('.back');
    return [front, back];
};

const resetGame = () => {
    game.innerHTML = '';
    isPaused = true;
    firstPick = null;
    matches = 0;

    setTimeout(async () => {
        const pokemon = await loadPokemon();
        displayPokemon([...pokemon, ...pokemon]);
        isPaused = false;
    }, 200);

};

resetGame();
