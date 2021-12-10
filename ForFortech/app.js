const countriesEl = document.getElementById("countries");

const filterBtn = document.getElementById("filter-region");
const regionFilters = filterBtn.querySelectorAll("li");

const searchEl = document.getElementById("search");
const modal = document.getElementById("modal");
const closeBtn = document.getElementById("close");
let allCountries = [];
const filterLanguages = document.getElementById("filter-languages");
const filterTimeZone = document.getElementById("filter-timeZone");
const filterCurrency = document.getElementById("filter-currencies");

getCountries();

function initFilters() {
  if (allCountries.length === 0) return;
  else {
    //filter by language
    const languages = new Set();
    const all = {
      name: "All",
    };
    languages.add(all);

    allCountries.forEach((country) => {
      country.languages.forEach((language) => languages.add(language));
    });
    console.log(languages);

    const languageUl = document.createElement("ul");
    languageUl.id = "language-ul";
    filterLanguages.appendChild(languageUl);

    languages.forEach((language) => {
      const languageElement = document.createElement("li");
      languageElement.innerHTML = `${language.name}`;

      languageElement.addEventListener("click", () => {
        const countriesByLanguage = allCountries.filter(
          (country) =>
            language.name === "All" ||
            country.languages.map((l) => l.name).indexOf(language.name) !== -1
        );
        console.log(countriesByLanguage);

        displayCountries(countriesByLanguage);
      });

      languageUl.appendChild(languageElement);
    });

    //filter by Timezone

    const timezones = new Set();
    allzone = "All";
    timezones.add(allzone);
    allCountries.forEach((country) => {
      country.timezones.forEach((timezone) => timezones.add(timezone));
    });

    const timezoneUl = document.createElement("ul");
    timezoneUl.id = "timezone-ul";
    filterTimeZone.appendChild(timezoneUl);

    timezones.forEach((timezone) => {
      const timezoneElement = document.createElement("li");
      timezoneElement.innerHTML = `${timezone}`;

      timezoneElement.addEventListener("click", () => {
        const countriesByTimezone = allCountries.filter(
          (country) =>
            timezone === "All" || country.timezones.indexOf(timezone) !== -1
        );

        displayCountries(countriesByTimezone);
      });

      timezoneUl.appendChild(timezoneElement);
    });

    //filter by currencies
    let currencies = new Set();

    currencies.add(all);

    let filteredCountriesx = allCountries.filter((country) => {
      return country.currencies != null;
    });

    filteredCountriesx.forEach((country) => {
      country.currencies.forEach((currency) => currencies.add(currency));
    });

    const currencyUl = document.createElement("ul");
    currencyUl.id = "currency-ul";
    filterCurrency.appendChild(currencyUl);

    currencies.forEach((currency) => {
      const currenciesElement = document.createElement("li");
      currenciesElement.innerHTML = `${currency.name}`;

      currenciesElement.addEventListener("click", () => {
        const countriesByCurrencies = filteredCountriesx.filter(
          (country) =>
            currency.name === "All" ||
            country.currencies.map((l) => l.name).indexOf(currency.name) !== -1
        );

        displayCountries(countriesByCurrencies);
      });

      currencyUl.appendChild(currenciesElement);
    });
  }
}

async function getCountries() {
  const res = await fetch("https://restcountries.com/v2/all");
  const countries = await res.json();

  allCountries = countries;
  initFilters();

  displayCountries(countries);
}

function displayNeighbors(neighbors, code) {
  const neighborsSection = document.getElementById(`neighborsSection-${code}`);
  neighborsSection.innerHTML = `<strong>Neighbors:</strong>`;

  neighbors.forEach((neighbor) => {
    const neighborElemnt = document.createElement("div");
    neighborElemnt.innerHTML = `
              <p>${neighbor.name}</p>
    `;
    neighborElemnt.className = "neighbor";

    neighborElemnt.addEventListener("click", () => {
      modal.style.display = "flex";
      showCountryDetails(neighbor);
    });

    neighborsSection.appendChild(neighborElemnt);
  });
}

function displayCountries(countries) {
  countriesEl.innerHTML = "";

  countries.forEach((country) => {
    const countryEl = document.createElement("div");
    countryEl.classList.add("card");

    countryEl.innerHTML = `
            <div>
                <img src="${country.flag}"  />
            </div>
            <div class="card-body">
                <h3 class="country-name">${country.name}</h3>
                <p>
                    <strong>Population:</strong>
                    ${country.population}
                </p>
                <p class="country-region">
                    <strong>Region:</strong>
                    ${country.region}
                </p>
                <p>
                    <strong>Capital:</strong>
                    ${country.capital} 
                </p>
            </div>
        `;

    countryEl.addEventListener("click", () => {
      modal.style.display = "flex";
      showCountryDetails(country);
    });

    countriesEl.appendChild(countryEl);
  });
}

function showCountryDetails(country) {
  const modalBody = modal.querySelector(".modal-body");
  const modalImg = modal.querySelector("img");

  modalImg.src = country.flag;

  let result = [];
  if (country.borders != undefined) result = getNeighbors(country.borders);

  modalBody.innerHTML = `
        <h2>${country.name}</h2>
        <p>
            <strong>Native Name:</strong>
            ${country.nativeName}
        </p>
        <p>
            <strong>Code:</strong>
            ${country.alpha3Code}
        </p>
        <p>
            <strong>Capital:</strong>
            ${country.capital}
        </p>
        <p>
            <strong>Population:</strong>
            ${country.population}
        </p>
        
        <p>
            <strong>Region:</strong>
            ${country.region}
        </p>

        <p>
            <strong>LatLng:</strong>
            ${country.latlng}
        </p>
       
        <p>
            <strong>Area:</strong>
            ${country.area}
        </p>
        <p>
            <strong>Timezones:</strong>
            ${country.timezones}
            
        </p>
        <div id="neighborsSection-${country.alpha3Code}">

           
            
        </div>
        <p>
            <strong>Currencies:</strong>
            ${country.currencies.map((currency) => currency.code)}
        </p>
        <p>
            <strong>Languages:</strong>
            ${country.languages.map((language) => language.name)}
        </p>
    `;
  displayNeighbors(result, country.alpha3Code);
}

function getNeighbors(neighbors) {
  result = [];
  return allCountries.filter((country) => {
    return neighbors.includes(country.alpha3Code);
  });
}

filterBtn.addEventListener("click", () => {
  filterBtn.classList.toggle("open");
});

filterLanguages.addEventListener("click", () => {
  filterLanguages.classList.toggle("open");
});
filterTimeZone.addEventListener("click", () => {
  filterTimeZone.classList.toggle("open");
});
filterCurrency.addEventListener("click", () => {
  filterCurrency.classList.toggle("open");
});

// close the modal
closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

searchEl.addEventListener("input", (e) => {
  const searchString = e.target.value.toLowerCase();

  const filteredCountries = allCountries.filter((country) => {
    return (
      (country.capital != null
        ? country.capital.toLowerCase().includes(searchString)
        : false) ||
      (country.name != null
        ? country.name.toLowerCase().includes(searchString)
        : false) ||
      (country.alpha3Code != null
        ? country.alpha3Code.toLowerCase().includes(searchString)
        : false)
    );
  });
  console.log(filteredCountries.length);
  if (filteredCountries.length == 0) countriesEl.innerHTML = "No match found";
  else displayCountries(filteredCountries);
});

// add a filter on the li's inside the .dropdown
regionFilters.forEach((filter) => {
  filter.addEventListener("click", () => {
    const value = filter.innerText;
    const countryRegion = document.querySelectorAll(".country-region");

    countryRegion.forEach((region) => {
      if (region.innerText.includes(value) || value === "All") {
        // .card -> .card-body -> .country-region
        region.parentElement.parentElement.style.display = "block";
      } else {
        region.parentElement.parentElement.style.display = "none";
      }
    });
  });
});

//console.log(document.getElementById("language-ul"));
// filterLanguages.firstChild.forEach((filter) => {
//   console.log(filter);
//   filter.addEventListener("click", () => {
//     const countriesByLanguage = allCountries.filter((country) => {
//       return country.languages.indexOf(filter.innerText) !== -1;
//     });
//     console.log(countriesByLanguage);
//   });
// });
