import axios from 'axios';

const getElement = document.querySelector.bind(document);

const sunlight = getElement('#sunlight');
const water = getElement('#water');
const pets = getElement('#pets');

sunlight.addEventListener('change', handleChangeSelect);
water.addEventListener('change', handleChangeSelect);
pets.addEventListener('change', handleChangeSelect);

function handleChangeSelect() {
  if (sunlight.value && water.value && pets.value) {
    axios
      .get(
        `https://front-br-challenges.web.app/api/v2/green-thumb/?sun=${sunlight.value}&water=${water.value}&pets=${pets.value}`
      )
      .then((res) => {
        createPlantListInHtml(res.data);
      })
      .catch(() => {
        getElement('#no-results').classList.remove('hidden');
        getElement('#with-results').setAttribute('class', 'hidden');
      });
  }
}

function createPlantListInHtml(data) {
  if (data.length > 0) {
    const withResultElement = getElement('#with-results');

    getElement('#no-results').setAttribute('class', 'hidden');
    withResultElement.classList.remove('hidden');

    document.getElementById('results__list').innerHTML = '';

    const index = data.findIndex((element) => element.staff_favorite);

    let plantList = data;

    if (index >= 0) {
      plantList = [
        data[index],
        ...data.slice(0, index),
        ...data.slice(index + 1),
      ];
    }

    plantList.forEach((plant) => {
      if (plant.staff_favorite) {
        createPlantCardByType(plant, 'spotlight');
      }

      createPlantCardByType(plant, 'normal');
    });
  }
}

function createElementWithClass(element, classes) {
  const node = document.createElement(element);
  node.setAttribute('class', classes);
  return node;
}

function createPlantCardByType(plant, type = 'normal') {
  const plantImage = createElementWithClass('img', `card__${type}--image`);
  plantImage.src = plant.url;

  const plantName = createElementWithClass('h2', `card__${type}--plantname`);
  plantName.innerHTML = plant.name;

  const price = document.createElement('span');

  price.textContent = `$${plant.price}`;

  const attributtes = createElementWithClass(
    'div',
    `card__${type}--attributes`
  );
  const icons = document.createElement('div');

  attributtes.appendChild(price);
  attributtes.appendChild(icons);

  const footer = createElementWithClass('div', `card__${type}--footer`);

  footer.appendChild(plantName);
  footer.appendChild(attributtes);

  const card = createElementWithClass('div', `card__${type}`);

  if (type === 'spotlight') {
    const bar = createElementWithClass('div', `card__${type}--bar`);
    bar.innerHTML = '✨ Staff favorite';
    card.appendChild(bar);
  }

  card.appendChild(plantImage);
  card.appendChild(footer);

  document.getElementById('results__list').appendChild(card);
}
