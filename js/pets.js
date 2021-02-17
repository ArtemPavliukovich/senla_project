/* import css0 from '../css/pets/reset.css';
import css1 from '../css/pets/font.css';
import css2 from '../css/pets/general.css';
import css3 from '../css/pets/header.css';
import css7 from '../css/pets/pets.css';
import css13 from '../css/pets/footer.css';
import css19 from '../css/pets/pet-info.css';
import css15 from '../css/pets/form.css';
import css18 from '../css/pets/preloader.css'; */
'use strict'
document.addEventListener('DOMContentLoaded', () => {
  const database = [];
  let sort_database = [];
  let pet_object = '';

  window.addEventListener('load', () => {
    document.querySelector('.preloader').classList.add('display-none');
  });


  function checkTouch() {
    let body = document.body;
    if (body.classList.contains('can-hover')) body.classList.remove('can-hover');
    if (!(navigator.maxTouchPoints > 0)) body.classList.add('can-hover');
  }
  checkTouch();


  window.addEventListener('resize', () => {
    checkTouch();

    if (document.querySelector('.active')) positionForm(document.querySelector('.active'));
    if (!document.querySelector('.pet-info').classList.contains('display-none')) {
      positionForm(document.querySelector('.pet-info'));
    } 
  });


  /* Автоматическая подгрузка контента */
  window.addEventListener('scroll', (e) => {
    if (document.querySelector('.footer').getBoundingClientRect().y < 1000) {
      addNextCard();
    }
  });


  function getDatabase() {
    fetch('https://raw.githubusercontent.com/ArtemPavliukovich/senla_project_database/main/database.json')
        .then((response) => response.json())
        .then((data) => {
          data.forEach(elem => database.push(elem));
          sortPets();
          for (let i = 0; i < 11; i++) addCard(database[i]);
        });
  }
  getDatabase();


  /* Добавление на страницу */
  function addCard(pet) {
    let pet_card = document.createElement('div');
    pet_card.innerHTML = createCard(pet);
    pet_card.classList.add('pet__card');
    pet_card.setAttribute('data-id', pet.id);
    document.querySelector('.all-animals').appendChild(pet_card);
  }


  /* Создание карточек */
  function createCard(pet) {
    let pet_info = pet.info[0];
    
    if (pet_info.length > 85) pet_info = pet_info.replace(/(.{85}).*/i, '$1...');

    return `<img src="${pet.img[0]}" alt="photo pet" class="pet__main-foto">
            <p class="pet__name">${pet.name}</p>
            <p class="pet__gender">${pet.gender}, ${pet.age}</p>
            <p class="pet__info">${pet_info}</p>
            <a href="" class="button-underline get-pet-info">
              <span>Подробнее</span>
            </a>
            <div class="pets__buttons">
              <a href="" class="button-fon button-fon-gold pet__slider-button-fon-home button-take-home">
                <span class="button button-gold pet__slider-button-home">
                  Забрать домой
                </span>
              </a>
              <a href="" class="button-fon button-fon-silver pet__slider-button-fon-overexposure button-take-to-time">
                <span class="button button-silver pet__slider-button-overexposure">
                  Забрать на передержку
                </span>
              </a>
            </div>`;
  }


  /* Удаление карточек при применении фильтра */
  function deletePetCard() {
    document.querySelector('.all-animals').innerHTML = '';
  }


  /* Сортировка карточек */
  function sortPets(type = 'alphabet') {
    if (type == 'Только коты') {
      sort_database = database.filter((elem) => elem.type == 'cat');
    }

    if (type == 'Только собаки') {
      sort_database = database.filter((elem) => elem.type == 'dog');
    }

    if (type == 'Коты и собаки') {
      sort_database = database;
    }

    if (type == 'alphabet') {
      sort_database = database;
      sort_database.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
    } else {
      addAllCard();
    }
  }


  /* Добавление 11 карточек при фильтре */
  function addAllCard() {
    deletePetCard();
    for (let i = 0; i < 11; i++) {
      if (sort_database[i]) addCard(sort_database[i]);
    }
  }


  /* Добавление каждых следующих 11 карточек */
  function addNextCard() {
    let i = document.querySelector('.all-animals').children.length;
    for (let num = i; num < i + 11; num++) {
      if (sort_database[num]) addCard(sort_database[num]);
    }
  }


  document.body.addEventListener('click', (e) => {
    /* скрываем / показываем фильтр */
    if (!e.target.classList.contains('filter-item') && 
      document.querySelector('.filter-value-item').classList.contains('filter-value-item-focus')) {
      showFilterItem();
    }

    if (e.target.classList.contains('filter-value')) {
      showFilterItem();
    }

    if (e.target.classList.contains('filter-item')) {
      setValueFilter(e);
      showFilterItem();
      document.querySelector('.filter-value').blur();
    }

    /* при клике по ссылкам футера возвращаемся на главную страницу к определенному разделу */
    if (e.target.classList.contains('footer__link')) {
      localStorage.setItem('id', e.target.getAttribute('id'));
    }

    const attribute = e.target.closest('a[href]');
    if (attribute && attribute.getAttribute('href') == '') e.preventDefault();

    const active = document.querySelector('.active');
    if (active && (e.target.classList.contains('disable-fon') || 
                   e.target.closest('.close-form') ||
                   e.target.closest('.form-button-fon-silver') ||
                   e.target.closest('.form-button-fon-gold'))) {
      let ok = false;
                          /* обработчик кнопки отправить */
      if (e.target.closest('.form-button-fon-gold')) {
        e.preventDefault();
        if (e.target.classList.contains('form-button-disabled') || 
            e.target.classList.contains('form-button-fon-disabled')) {
          showErrorMessage('Вы не ввели номер телефона');
          setInputError();
          return;
        } else {
          // ТУТ ОБРАБОТКА ДАННЫХ ФОРМЫ
          ok = true;
          clearForm(active);
        }
      }

      if (e.target.closest('.form-button-fon-silver')) e.preventDefault();
      if (!e.target.classList.contains('disable-fon') && !active.classList.contains('transfer')) clearForm(active);
      
      clearIdElemsForm();
      disableFon();
      deleteScrollMargin();
      hidden();
      active.classList.toggle('display-none');
      active.classList.remove('active');
      if (ok) delivery();
    }

    /* информация о питомцах */
    if (e.target.closest('.get-pet-info')) getPetInfo(e);

    if (!document.querySelector('.pet-info').classList.contains('display-none')) {
      if (e.target.closest('.close-pet-info') || e.target.classList.contains('disable-fon')) {
        closePetInfo();
      }
    }

    /* форма забрать домой */
    if (e.target.closest('.button-take-home')) {
      const id = e.target.closest('.pet__card').dataset.id;
      getForm(document.querySelector('.take-home'), database.filter((el) => el.id == id)[0]);
    }

    /* форма забрать на передержку */
    if (e.target.closest('.button-take-to-time')) {
      const id = e.target.closest('.pet__card').dataset.id;
      getForm(document.querySelector('.take-on-time'), database.filter((el) => el.id == id)[0]);
    }
  });


  /* Изменение lable, background, логика для мобильного */
  document.body.addEventListener('input', (e) => {
    
    if (e.target.classList.contains('name') || e.target.classList.contains('form-textarea') ||
        e.target.classList.contains('auto-help__time')) {
      
      let id = e.target.getAttribute('id');
      const label = document.querySelector(`.form-label[for="${id}"]`);

      if (label.classList.contains('display-none')) label.classList.toggle('display-none');
      if (e.target.value == '') label.classList.toggle('display-none');
    }

    if (e.target.classList.contains('mobile')) {
      let mobile_number = e.target.inputmask.unmaskedvalue();
      
      if (mobile_number.length == 2) {

        if (/(29)|(44)|(33)|(25)/.test(mobile_number)) {
          let message = document.querySelector('.active .mobile-status').textContent;
          if (message == 'Неверные цифры в скобках') clearBoxMobileStatus();
          if (message !== 'Вы не ввели номер телефона') resetInputError();
        } else {
          showErrorMessage('Неверные цифры в скобках');
          setInputError();
        }

      }
      
      if (mobile_number.length == 9 && /(29)|(44)|(33)|(25)/.test(mobile_number.slice(0, 2))) {
        clearBoxMobileStatus();
        deleteTultip();
        resetInputError();
        unableButtonGold();
        document.querySelector('.active .form-button-fon-gold').classList.remove('form-button-fon-disabled');
        document.querySelector('.active .form-button-gold').classList.remove('form-button-disabled');
      }

      if (mobile_number.length < 9) {
        document.querySelector('.active .form-button-fon-gold').classList.add('form-button-fon-disabled');
        document.querySelector('.active .form-button-gold').classList.add('form-button-disabled');
        disableButtonGold();
      }
    }
  });


  document.body.addEventListener('focusin', (e) => {
    if (e.target.classList.contains('filter-value')) showFilterItem();

    if (e.target.classList.contains('mobile') && e.target.value == '') {
      let id = e.target.getAttribute('id'),
          label = document.querySelector(`.form-label[for="${id}"]`);
      if (label.classList.contains('display-none')) label.classList.toggle('display-none');
      
      if (document.querySelector('script[src="src/inputmask.min.js"').dataset.load) {
        let mobile = document.getElementById('mobile');
        Inputmask('375 (9{2}) 9{2}-9{3}-9{2}', {placeholder: '_', 
                                                clearMaskOnLostFocus: false,
                                                showMaskOnHover: false}).mask(mobile);
      }
    }

    if (e.target.classList.contains('mobile') && !e.target.value == '') {
      let mask_value = e.target.inputmask.unmaskedvalue();

      if (mask_value.length >= 2 && !/(44)|(25)|(33)|(29)/.test(mask_value.slice(0, 2))) {
        showErrorMessage('Неверные цифры в скобках');
      }
    }
  });


  document.body.addEventListener('focusout', (e) => {
    if (e.target.classList.contains('filter-value')) showFilterItem();

    if (e.target.classList.contains('mobile') && e.target.inputmask) {
      let mobile_number = e.target.inputmask.unmaskedvalue();
      
      if (!(mobile_number.length == 9) || !(/(29)|(44)|(33)|(25)/.test(mobile_number.slice(0, 2)))) {
        showErrorMessage('Вы не ввели номер телефона');
        setInputError();
      }
    }
  });


                                            /* ОБЩИЕ ФУНКЦИИ */
  /* Задаем overflow Body */
  function hidden() {document.body.classList.toggle('hidden');}
  

  /* Отключаем фон */
  function disableFon() {document.getElementById('disable-fon').classList.toggle('disable-fon');}


  /* Добавляем отступ чтоб не дергалось меню при пропадании скролла */
  function deleteScrollMargin() {
    if (window.innerWidth - document.body.clientWidth > 0) {
    
      if (!document.body.style.marginRight && window.innerWidth <= 1920) {
        let width_body = window.getComputedStyle(document.body).width.replace('px', '');
        document.body.style.marginRight = window.innerWidth - width_body + 'px';
      } else {
        document.body.style.marginRight = '';
      }

      if (!document.body.style.marginLeft && window.innerWidth > 1920) {
        document.body.style.marginLeft = window.getComputedStyle(document.body).marginLeft;
      } else {
        document.body.style.marginLeft = '';
      }
    }
  }


  /* Показываем/скрываем фильтр */
  function showFilterItem() {
    document.querySelector('.filter-value-item').classList.toggle('filter-value-item-focus');
    document.querySelector('.filter-value').classList.toggle('filter-value-active');
  }


  /* Изменение значение фильтра */
  function setValueFilter(e) {
    if (document.querySelector('.filter-view-value').value !== e.target.textContent) {
      document.querySelector('.filter-view-value').value = e.target.textContent;
      sortPets(e.target.textContent);
    }
  }


                              /* КАРТОЧКА ЖИВОТНОГО ПРИ КЛИКЕ НА КНОПКУ ПОДРОБНЕЕ */

  /* Вывод на страницу блока с информацией о животном */
  function getPetInfo(e) {
    const pet_elem = e.target.closest('.pet__card'),
          pet = database.filter((elem) => elem.id == pet_elem.dataset.id)[0],
          box_description = document.querySelector('.pet-descriptions'),
          box_img = document.querySelector('.pet-images');
    
    document.querySelector('.pet-name').textContent = pet.name;
    document.querySelector('.pet-age').textContent = pet.gender + ', ' + pet.age;

    if (box_description.children.length > 0) [...box_description.children].forEach((elem) => elem.remove());
    if (box_img.children.length > 0) [...box_img.children].forEach((elem) => elem.remove());
    
    pet.info.forEach((info) => {
      let p_info = document.createElement('p');
      p_info.classList.add('pet-description');
      p_info.textContent = info;
      box_description.appendChild(p_info);
    });

    pet.img.forEach((img_src) => {
      let img = document.createElement('img');
      img.classList.add('pet-img');
      img.setAttribute('src', img_src);
      img.setAttribute('alt', 'pet photo');
      box_img.appendChild(img);
    });

    const box_info = document.querySelector('.pet-info');
    disableFon();
    deleteScrollMargin();
    hidden();
    box_info.classList.remove('display-none');
    positionForm(box_info);
    box_info.focus();
    pet_object = pet;
  }


  /* Закрытие карточки с информацией о животном */
  function closePetInfo() {
    document.querySelector('.pet-info').classList.add('display-none');
    pet_object = '';
    disableFon();
    deleteScrollMargin();
    hidden();
  }


                                    /* МОДАЛЬНОЕ ОКНО ОБ УСПЕШНОЙ ОТПРАВКЕ */

  /* Показывает модальное окно об успешной отправке формы */
  function delivery() {
    let ok = document.querySelector('.ok');
    disableFon();
    deleteScrollMargin();
    hidden();
    ok.classList.add('ok-view');
    document.getElementById('disable-fon').addEventListener('click', deleteDeliveryClick);
    setTimeout(deleteDelivery, 2000);
  }


  /* Удаляет модальное окно об успешной отправке формы */
  function deleteDelivery() {
    let ok = document.querySelector('.ok');
    if (ok.classList.contains('ok-view')) {
      document.getElementById('disable-fon').removeEventListener('click', deleteDelivery);
      ok.classList.remove('ok-view');
      disableFon();
      deleteScrollMargin();
      hidden();
    }
  }
  function deleteDeliveryClick(e) {
    if (e.target.classList.contains('disable-fon')) deleteDelivery();
  }


                                                    /* ФОРМЫ */

  /* Форма забрать домой со страницы где инфо о питомце */
  document.getElementById('take-home_two').addEventListener('click', () => {
    let pet = Object.assign({}, pet_object);
    closePetInfo();
    getForm(document.querySelector('.take-home'), pet);
  });


  /* Форма забрать на передержку со страницы где инфо о питомце */
  document.getElementById('take-on-time_two').addEventListener('click', () => {
    let pet = Object.assign({}, pet_object);
    closePetInfo();
    getForm(document.querySelector('.take-on-time'), pet);
  });


  /* Отображение формы на странице */
  function getForm(form, pet_object = '') {
    disableFon();
    deleteScrollMargin();
    hidden();
    form.classList.toggle('display-none');
    form.classList.add('active');
    positionForm(form);
    addIdElemsForm();

    if (!document.querySelector('script[src="src/inputmask.min.js"')) {
      const inputmask = document.createElement('script');
      inputmask.setAttribute('src', 'src/inputmask.min.js');
      document.body.appendChild(inputmask);
      inputmask.addEventListener('load', () => inputmask.setAttribute('data-load', true));
    }    
    
    if (database && (form.classList.contains('take-home') || form.classList.contains('take-on-time'))) {
      let pet;
      
      if (pet_object !== '') {
        pet = pet_object;
      } else {
        pet = database.filter((elem) => elem.id == document.querySelector('.pet__card-opacity').dataset.id)[0];
      }
      
      document.querySelector('.active .form-pet-photo').setAttribute('src', pet.img[0]);
      document.querySelector('.active .form-pet-name').textContent = pet.name;
      document.querySelector('.active .form-pet-age').textContent = pet.gender + ', ' + pet.age;
    }

    document.querySelector('.active.form-box').focus();
  }


  /* Очистка формы */
  function clearForm(form) {
    let mobile = document.getElementById('mobile');
    mobile.value = '';
    Inputmask.remove(mobile);
    resetInputError();

    document.getElementById('user-name').value = '';
    document.getElementById('comment').value = '';

    document.querySelectorAll('.active .form-label').forEach((elem) => {
      if (!elem.classList.contains('display-none')) elem.classList.add('display-none');
    });

    clearBoxMobileStatus();
    disableButtonGold();

    if (!document.querySelector('.active .form-button-gold').classList.contains('form-button-disabled')) {
      document.querySelector('.active .form-button-gold').classList.add('form-button-disabled');
      document.querySelector('.active .form-button-fon-gold').classList.add('form-button-fon-disabled');
    }
  }
  

  /* Раставление id элементам формы, потомучто у форм одинаковые блоки с одинаковым функционалом,
  для этого мы будем динамически назначать id что бы не было на странице одинаковых id */
  function addIdElemsForm() {
    const id = [{class:'mobile', id:'mobile'}, {class:'name', id:'user-name'}, {class:'form-textarea', id:'comment'}];

    id.forEach((elem) => {
      let html_element = document.querySelector(`.active .${elem.class}`);

      if (html_element) {
        html_element.setAttribute('id', elem.id);
        document.querySelector(`.active .${elem.class} ~ label`).setAttribute('for', elem.id);
      }
    });
  }


  /* Удаление id элементам формы при её закрытии */
  function clearIdElemsForm() {
    const elems_form = document.querySelectorAll('.active *'),
          id_elems = ['mobile', 'user-name', 'comment'];
    
    elems_form.forEach((elem) => {
      if ( id_elems.some((id) => id == elem.id) ) elem.removeAttribute('id');
      if ( id_elems.some((id) => id == elem.getAttribute('for')) ) elem.removeAttribute('for');
    });
  }
  

  /* Функция определение top для форм */
  function positionForm(form) {
    let height_form = +window.getComputedStyle(form).height.replace('px', '');
    
    if (window.innerHeight > height_form) {
      form.style.top = (window.innerHeight / 2 - height_form / 2) + 'px';
    } else {
      form.style.top = '';
    }
  }


  /* Показываем ошибки связанные с вводом мобильного */
  function showErrorMessage(msg = 'Проверьте правильность ввода') {
    let box = document.querySelector('.active .mobile-status');
    box.classList.add('error');
    box.textContent = msg;
  }


  /* Очистка поля под мобильным телефоном в которое могут выводиться ошибки */
  function clearBoxMobileStatus() {
    let box = document.querySelector('.active .mobile-status');
    box.textContent = 'Обязательное поле для заполнения';
    box.classList.remove('error');
  }


  /* Разблокировка кнопки отправить */
  function unableButtonGold() {
    document.querySelector('.active .form-button-fon-gold').classList.add('button-fon', 'button-fon-gold');
    document.querySelector('.active .form-button-gold').classList.add('button', 'button-gold');
  }


  /* Блокировка кнопки отправить */
  function disableButtonGold() {
    document.querySelector('.active .form-button-fon-gold').classList.remove('button-fon', 'button-fon-gold');
    document.querySelector('.active .form-button-gold').classList.remove('button', 'button-gold');
  }


  /* Ошибка ввода, подсвечиваем инпут при ховере и фокусе красным */
  function setInputError() {
    document.getElementById('mobile').classList.add('error-border');
    document.querySelector('.active .form-box-mobile').classList.add('form-mobile-error');
  } 
  
  
  /* Удаляем стили для отображения ошибки в инпуте */
  function resetInputError() {
    document.getElementById('mobile').classList.remove('error-border');
    document.querySelector('.active .form-box-mobile').classList.remove('form-mobile-error');
  }


                                                  /* ТУЛТИП */

  /* ПК устройства без тачскрина */
  document.body.addEventListener('mouseover', (e) => {
    if (e.target.classList.contains('form-button-disabled') && !document.querySelector('.tultip')) {
      createTultip(e);
    }
  });
  document.body.addEventListener('mousemove', (e) => {
    if (document.body.classList.contains('can-hover') && document.querySelector('.tultip')) {
      tultipPosition(document.querySelector('.tultip'), e);
    }
  });
  document.body.addEventListener('mouseout', (e) => {
    if (e.target.classList.contains('form-button-disabled') && document.querySelector('.tultip')) {
      deleteTultip();
    }
  });


  /* Устройства с тачскрином */
  document.body.addEventListener('touchstart', (e) => {
    if (document.querySelector('.tultip')) deleteTultip();

    if (e.target.classList.contains('form-button-disabled') && !document.querySelector('.tultip')) {
      showErrorMessage('Вы не ввели номер телефона');
      setInputError();
      createTultip(e, true);
      setTimeout(deleteTultip, 1500);
    }
  });


  /* Удаление тултипа */
  function deleteTultip() {
    if (document.querySelector('.tultip')) document.querySelector('.tultip').remove(); 
  }


  /* Создать тултип и добавить в ДОМ */
  function createTultip(e, touch) {
    const tultip = document.createElement('div');
    tultip.classList.add('tultip');
    tultip.innerHTML = 'Кнопка недоступна.<br>Заполните обязательные поля формы';
    document.body.appendChild(tultip);
    tultipPosition(tultip, e, touch);
  }


  /* Позиционирование тултипа на странице */
  function tultipPosition(tultip, e, touch) {
    let width_tultip = +window.getComputedStyle(tultip).width.replace('px', '');
    if (touch) {
      tultip.style.left = (window.innerWidth / 2) - (width_tultip / 2) + 'px';
      tultip.style.top = e.touches[0].clientY - 60 + 'px';
    } else {
      tultip.style.left = e.clientX - (width_tultip / 2) + 'px';
      tultip.style.top = e.clientY - 60 + 'px'; 
    }
  }


  /* Сохраняем фокус только в модальном или форме окне если оно открыто */
  document.body.addEventListener('keydown', (e) => {
    if (e.code == 'Tab' && document.querySelector('.active')) {
      if (e.target.getAttribute('tabindex') == 6 && (document.querySelector('.active.take-home') ||
      document.querySelector('.active.take-on-time'))) {
        document.querySelector('.active').focus();
      }
    }

    if (e.code == 'Tab' && !document.querySelector('.pet-info').classList.contains('display-none')) {
      if (e.target.getAttribute('tabindex') == 4) {
        document.querySelector('.pet-info').focus();
      }
    }

    /* при нажатии enter на крестике закрываем модалку или форму */
    if (e.code == 'Enter' && e.target.classList.contains('close-pet-info')) {
      document.getElementById('disable-fon').click();
    }
  });
});