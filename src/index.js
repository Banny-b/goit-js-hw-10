import './css/styles.css';
import './css/element.css';

import Notiflix from 'notiflix';
var debounce = require('lodash.debounce');
import { fetchCountries } from './js/fetchCountries';
const DEBOUNCE_DELAY = 300;

const constHtml = {
    input: document.getElementById('search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
};

//  Очистка полей (div и ul)
const clearElement = element => (element.innerHTML = '');

const countryName = () => {
    const inputValue = constHtml.input.value.trim();
    if (!inputValue) {
        clearElement(constHtml.countryInfo);
        clearElement(constHtml.countryList);
        return
    }
    //  Обработка и вывод значения промиса
    fetchCountries(inputValue).then(answerThen).catch(answerCatch);
    console.log(fetchCountries(inputValue));
};

//  Ответ если такая страна (страны) существует
const answerThen = (data) => {
    console.log(data);
    if (data.length === 1) {
        //  Вывод подробной информации об одной стране
        clearElement(constHtml.countryInfo);
        clearElement(constHtml.countryList);
        constHtml.countryInfo.insertAdjacentHTML('afterbegin', infoCountry(data));
    } else if (data.length<10) {
        //  Вывод краткой информация о всех странах
        clearElement(constHtml.countryInfo);
        clearElement(constHtml.countryList);
        constHtml.countryList.insertAdjacentHTML('afterbegin', creatCountries(data));
    } else {
        //  Больше десяти стран в ответе - выводим предупреждение!
        clearElement(constHtml.countryInfo);
        clearElement(constHtml.countryList);
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        return;
    }
};
//  Ответ, если такой страны несуществует или неправильно набранно её название
const answerCatch = () => {
    clearElement(constHtml.countryInfo);
    clearElement(constHtml.countryList);
    Notiflix.Notify.failure('Oops, there is no country with that name');
};

//  Функция, краткая информация о всех странах
const creatCountries = data => {
    const lists=data.map(({name, flags}) =>
        `<li><img src="${flags.png}" alt="${name.official}"><h2>${name.official}</h2></li>`
    ).join(" ");
    return lists;
};
//  Функция, подробная информация об одной стране
const infoCountry = data => {
    const info = data.map(({name, capital, population, flags, languages}) =>
        `<img src="${flags.png}" ${name.official}><h1>${name.official}</h1>
        <p> capital: ${capital} </p>
        <p> population: ${population} </p>
        <p> languages: ${Object.values(languages)} </p>`
    );
    return info;
};
//  Слушатель событий input
constHtml.input.addEventListener('input', debounce(countryName, DEBOUNCE_DELAY));