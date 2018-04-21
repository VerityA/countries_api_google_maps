
let allCountries =[];
let selectedRegion;
let selectedSubRegion;

document.addEventListener('DOMContentLoaded', () => {
  const url = 'https://restcountries.eu/rest/v2/all';
  makeRequest(url, requestComplete)

  const selectRegion = document.querySelector('#regions-dropdown');
  selectRegion.addEventListener('change', handleRegionsChange);

  const selectSubRegion = document.querySelector('#sub-regions-dropdown');
  selectSubRegion.addEventListener('change', handleSubRegionsChange);

  const selectCountries = document.querySelector('#countries-dropdown');
  selectCountries.addEventListener('change', handleCountriesChange);
});

const makeRequest = function (url, callback) {
  const request = new XMLHttpRequest();
  request.open('GET', url);
  request.send();
  request.addEventListener('load', callback);
};

const requestComplete = function () {
  if (this.status !== 200) return;
  const jsonString = this.responseText;
  allCountries = JSON.parse(jsonString);
  const regions = filterCountriesForProperty(allCountries, "region");
  const subRegions = filterCountriesForProperty(allCountries, "subregion");


  const regionsSelect = document.querySelector('#regions-dropdown');



  createRegionsDropDown(regions, regionsSelect);


};

const filterCountriesForProperty = function(countries, property) {
  const array = countries.map((country) => {
    return country[property];
  });
  const uniqueArray = array.filter((country,index) => array.indexOf(country) == index);
  return uniqueArray;
};

const handleCountriesChange = function (event) {
  const countryDiv = document.querySelector('#info');
  countryDiv.innerHTML = '';

  getStats(countryDiv, allCountries[this.value]);

  const borderDiv = document.querySelector('#border-info');
  borderDiv.innerHTML = '';

  const neighbours = findNeighbours(allCountries[this.value], allCountries);
  for (country of neighbours) {
    getStats(borderDiv, country)
  };

  const mapContainer = document.querySelector('#main-map');
  // console.log(allCountries[this.value].latlng[0]);
  const coOrds = {lat: allCountries[this.value].latlng[0], lng: allCountries[this.value].latlng[1]};
  console.log(coOrds);
  const mainMap = new MapWrapper(mapContainer, coOrds, 12);
console.log(mainMap);
  mainMap.addMarker(coOrds);
};

const handleRegionsChange = function (event) {
  selectedRegion = this.value;
  const subRegionsSelect = document.querySelector('#sub-regions-dropdown');
  subRegionsSelect.innerHTML = '';
  createSubRegionsDropDown(allCountries, selectedRegion, subRegionsSelect);
};

const handleSubRegionsChange = function (event) {
  selectedSubRegion = this.value;
  const countriesSelect = document.querySelector('#countries-dropdown');
  countriesSelect.innerHTML ='';
  createCountriesDropDown(allCountries, selectedSubRegion, countriesSelect);

};

const getStats = function(div, country) {

  const name = document.createElement('li');
  name.textContent = country["name"]

  const population = document.createElement('li');
  population.textContent = country["population"]

  const capital = document.createElement('li');
  capital.textContent = country["capital"]

  const lineBreak = document.createElement('br');

  div.appendChild(name);
  div.appendChild(population);
  div.appendChild(capital);
  div.appendChild(lineBreak);
};



const findNeighbours = function(selectedCountry, countries){
  const borders = selectedCountry["borders"];
  const borderCountries = [];
  for (border of borders) {
    for (country of countries) {
      if(country["alpha3Code"] === border) {
        borderCountries.push(country);
      };
    };
  };
  return borderCountries;
};

const createRegionsDropDown = function (regions, div) {
  regions.forEach((region) => {
    if (region != ""){
    const option = document.createElement('option');
    option.textContent = region;
    div.appendChild(option);}
  });
};

const createSubRegionsDropDown = function (countries, region, div) {
  const countriesWithRegion = [];
  countries.forEach((country) => {
    if (country.region === region) {
      countriesWithRegion.push(country);
    };
  });

  const subRegionsOfRegion = filterCountriesForProperty(countriesWithRegion, "subregion");
  subRegionsOfRegion.forEach((subRegion) => {
    const option = document.createElement('option');
      option.textContent = subRegion;
      div.appendChild(option);
  });
};

const createCountriesDropDown = function (countries, subRegion, div) {
  const countriesWithSubRegion = [];
  countries.forEach((country, index) => {
    if(country.subregion === selectedSubRegion) {
      countriesWithSubRegion.push({"country" : country, "index" : index});
    };
  });
  countriesWithSubRegion.forEach((country) => {
    const option = document.createElement('option');
    option.textContent = country["country"].name;
    option.value = country["index"];
    div.appendChild(option);
  });
};

const populateList = function (countries) {
  const ul = document.querySelector('#country-list')
  countries.forEach((country) => {
    const li = document.createElement('li');
    li.textContent = country.name;
    ul.appendChild(li);
  });
};
