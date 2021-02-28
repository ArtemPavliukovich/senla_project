'use strict';
import css0 from '../css/main/reset.css';
import css1 from '../css/main/font.css';
import css2 from '../css/main/general.css';
import css3 from '../css/main/header.css';
import css4 from '../css/main/life.css';
import css5 from '../css/main/promo.css';
import css6 from '../css/main/help.css';
import css7 from '../css/main/pets.css';
import css8 from '../css/main/finance.css';
import css9 from '../css/main/action.css';
import css10 from '../css/main/news.css';
import css11 from '../css/main/about.css';
import css12 from '../css/main/thanks.css';
import css13 from '../css/main/footer.css';
import css14 from '../css/main/img.css';
import css15 from '../css/main/form.css';
import css16 from '../css/main/datepicker.css';
import css17 from '../css/main/datepicker_custom.css';
import css18 from '../css/main/animation.css';
import css19 from '../css/main/pet-info.css';


document.addEventListener('DOMContentLoaded', () => {
  const database = [];
  let pet_object = '';
  let i_left = 0, i_right = 2;
  let swipe_start_x = 0, swipe_start_y = 0, swipe_move_x = [], swipe_move_y = [];


  /* Узнаем или устройство пользователя имеет тачскрин и разрешаем/запрещаем hover установкой class. 
  Если нам нужны браузеры IE 10 и выше надо в проверку добавить (msMaxTouchPoints > 0) */
  function checkTouch() {
    let body = document.body;
    if (body.classList.contains('can-hover')) body.classList.remove('can-hover');
    if (!(navigator.maxTouchPoints > 0)) body.classList.add('can-hover');
  }
  checkTouch();


  /* Функция получения базы данных всех животных  */
  function getDatabase() {
    fetch('https://raw.githubusercontent.com/ArtemPavliukovich/senla_project_database/main/database.json')
        .then((response) => response.json())
        .then((data) => {
          data.forEach(elem => database.push(elem));
          getNumberAllPets();
          sortPets();
          for (let i = 0; i < 3; i++) addCard(database[i]);
          setOpacityCard();
        });
  }
  getDatabase();


  /* Переход к соответствующему пункту если переходим с другой страницы */
  window.addEventListener('load', () => {
    let id = localStorage.getItem('id');
    
    if (id) {
      localStorage.removeItem('id');
      setTimeout(function () {
        window.scrollTo(0, document.getElementById(id).getBoundingClientRect().y);
      }, 1);
    }
  });


  /* Анимации */
  window.addEventListener('scroll', () => {
    if (window.pageYOffset - document.querySelector('.help__title').offsetTop > -350) {
      document.querySelectorAll('.help__button').forEach((elem, i) => {
        if (!elem.classList.contains('help__button-animation')) {
          elem.style.transition = `all ${i / 4 + 0.25}s ease`;
          elem.classList.add('help__button-animation');
          elem.addEventListener('transitionend', () => elem.style.transition = '');
        }
      });
    }
  });


  /* Перестраиваем меню/формы/модалки при rezise и перепроверяем touch */
  window.addEventListener('resize', () => {
    const nav_list = document.querySelector('.header__nav-list');
    
    if (nav_list.classList.contains('header__nav-list-active')) {
      if (window.innerWidth < 1023) {
        resetSizeMenu(nav_list);
        setSizeMenu(nav_list);
      } else {
        burger.classList.toggle('header__nav-burger-active'); 
        nav_list.classList.toggle('header__nav-list-active');
        resetSizeMenu(nav_list);
        disableFon();
        deleteScrollMargin();
        hidden();
      }
    }

    checkTouch();
    
    if (document.querySelector('.active')) positionForm(document.querySelector('.active'));

    if (!document.querySelector('.pet-info').classList.contains('display-none')) {
      positionForm(document.querySelector('.pet-info'));
    }
    
    if (document.querySelector('.map-active')) positionForm(document.getElementById('map'));
  });


  /* Каждый клик по крестику, кнопке отмена или клик по темному фону закрывает форму и очищает её,
  если кликают по кнопке отправить то форма обрабатывается если правильно введен телефон иначе ошибка */
  document.body.addEventListener('click', (e) => {
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


    /* изменение цвета фона датапикера при выборе промежутка дат и изменение bg инпута */
    if (e.target.classList.contains('datepicker--cell-day')) {
      let id;

      if (document.querySelector('.view-active.active')) {
        document.querySelector('.view-active.active').classList.forEach((elem) => {
          if (/datepicker\d/.test(elem)) id = elem;
        });
      }
      
      const from_select = document.querySelector('.view-active .-range-from-.-selected-'),
            to_select = document.querySelector('.view-active .-range-to-.-selected-');
    
      if (from_select && to_select && checkDatepicker(id)) {
        document.querySelector(`.${id}`).style.setProperty('--bg-color-select', 'rgba(255, 196, 30, 0.2)');
      } else if (id) {
        document.querySelector(`.${id}`).style.setProperty('--bg-color-select', 'rgba(214, 214, 214, 0.3)');
      }

      if (document.querySelector('.view-active.active .-selected-')) {
        document.getElementById(id).classList.add('auto-help__datepicker-bg-true-up');
      } else {
        resetBgInputDatepicker(id);
      }
    }


    /* удаление дат созданных в режиме одиночного выбора */
    if (e.target.classList.contains('date-close')) {
      let id;
      e.target.closest('.datepicker').classList.forEach((elem) => {
        if (/datepicker\d/.test(elem)) id = elem;
      });

      const date = e.target.closest('.date');
      $(`#${id}`).datepicker().data('datepicker').removeDate(new Date(date.dataset.date_value));
      date.remove();
    }


    /* закрытие датапикера при клике на инпут */
    if (e.target.classList.contains('auto-help__datepicker')) {
      let id = e.target.getAttribute('id');
      const datepicker = document.querySelector(`.${id}`);

      if (datepicker.classList.contains('view-active')) {
        datepicker.classList.remove('view-active');
        $(`#${id}`).datepicker().data('datepicker').hide();
      } else {
        datepicker.classList.add('view-active');
      }
    }


    /* плавный скролинг к якорям и отмена стандартного поведения ссылок с пустым значенмем href */
    const attribute = e.target.closest('a[href]');
    
    if (attribute && attribute.getAttribute('href').includes('#')) {
      e.preventDefault();
      document.getElementById(attribute.getAttribute('href').replace('#', '')).scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }

    if (attribute && attribute.getAttribute('href') == '') e.preventDefault();

    if (e.target.classList.contains('help__button-link-description')) {
      let id = e.target.dataset.href;
      document.getElementById(id).scrollIntoView({behavior: 'smooth', block: 'start'});
    }

    /* информация о питомцах */
    if (e.target.closest('.get-pet-info')) getPetInfo(e);

    if (!document.querySelector('.pet-info').classList.contains('display-none')) {
      if (e.target.closest('.close-pet-info') || e.target.classList.contains('disable-fon')) {
        closePetInfo();
      }
    }

    /* открытие и закрытие карты */
    if (e.target.closest('.show-map')) {
      if (!document.querySelector('.ymaps-2-1-78-map')) showMap();
      let map = document.getElementById('map');
      disableFon();
      deleteScrollMargin();
      hidden();
      positionForm(map);
      map.classList.add('map-active');
      map.focus();
    }

    if (e.target.closest('.close-map') || (e.target.classList.contains('disable-fon') &&
    document.getElementById('map').classList.contains('map-active'))) {
      disableFon();
      deleteScrollMargin();
      hidden();
      document.getElementById('map').classList.remove('map-active');
    }
  });


  /* Обработчики событий для слайдера и свайпера */
  document.querySelector('.pet__slider-item').addEventListener('click', nextCard);
  document.querySelector('.pet__slider').addEventListener('mouseover', mouseOverCard);
  document.querySelector('.pet__slider').addEventListener('mouseout', mouseOutCard);
  document.querySelector('.pet__slider').addEventListener('touchstart', swipeCardStart);
  document.querySelector('.pet__slider').addEventListener('touchmove', swipeCardMove);
  document.querySelector('.pet__slider').addEventListener('touchend', swipeCardEnd);
  document.querySelector('.pet__slider').addEventListener('click', miniSliderActive);

  document.querySelector('.pet__slider-item').addEventListener('keydown', (e) => {
    if (e.target.closest('.pet__slider-item-arrow-fon') && e.code == 'Enter') {
      e.target.click();
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


    /* изменения режима работы датапикера */
    if (e.target.classList.contains('switch-input')) {
      let id = e.target.getAttribute('id').replace('switch-', '');
      
      if (e.target.checked) {
        $(`#${id}`).datepicker({
          range: false,
          multipleDatesSeparator: ', ',
          multipleDates: 8
        });
        $(`#${id}`).datepicker().data('datepicker').clear();
        resetBgInputDatepicker(id);
        document.querySelector(`.${id}`).classList.add('view-active');
        document.querySelector(`.${id}`).style.setProperty('--bg-color-select', 'rgba(214, 214, 214, 0.3)');
      } else {
        $(`#${id}`).datepicker({
          range: true,
          multipleDatesSeparator: ' - ',
          multipleDates: false
        });
        $(`#${id}`).datepicker().data('datepicker').clear();
        resetBgInputDatepicker(id);
        document.querySelector(`.${id}`).classList.add('view-active');
      }
    }
  });


  /* Сохраняем фокус только в модальном или форме окне если оно открыто */
  document.body.addEventListener('keydown', (e) => {
    if (e.code == 'Tab' && document.querySelector('.active')) {
      if (e.target.getAttribute('tabindex') == 6 && (document.querySelector('.active.take-home') ||
      document.querySelector('.active.take-on-time'))) {
        document.querySelector('.active').focus();
      }

      if (e.target.getAttribute('tabindex') == 2 && document.querySelector('.active.transfer')) {
        document.querySelector('.active').focus();
      }

      if (e.target.getAttribute('tabindex') == 8 && document.querySelector('.active.volunteer')) {
        document.querySelector('.active').focus();
      }

      if (e.target.getAttribute('tabindex') == 3 && document.querySelector('.active.auto-help')) {
        if (!e.shiftKey) document.querySelector('.auto-help__datepicker').click();
      }

      if (e.target.getAttribute('tabindex') == 13 && document.querySelector('.active.auto-help')) {
        document.querySelector('.active').focus();
      }
    }

    if (e.code == 'Tab' && document.querySelector('.map-active')) {
      if (e.target.getAttribute('tabindex') == 2) {
        document.querySelector('.map').focus();
      }
    }

    if (e.code == 'Tab' && !document.querySelector('.pet-info').classList.contains('display-none')) {
      if (e.target.getAttribute('tabindex') == 4) {
        document.querySelector('.pet-info').focus();
      }
    }

    /* при нажатии enter на крестике закрываем модалку или форму */
    if (e.code == 'Enter' && (e.target.classList.contains('close-pet-info') || 
    e.target.classList.contains('close-form') || e.target.classList.contains('close-map'))) {
      document.getElementById('disable-fon').click();
    }
    
    /* для чекбоксов и радиобаттонов */
    if (e.code == 'Enter') {
      if (e.target.classList.contains('volunteer__help-always')) {
        document.getElementById('always-help').checked = true;
      }

      if (e.target.classList.contains('volunteer__help-sometimes')) {
        document.getElementById('sometimes-help').checked = true;
      }

      if (e.target.classList.contains('auto-help__type')) {
        if (e.target.querySelector('.auto-help__input').checked) {
          e.target.querySelector('.auto-help__input').checked = false;
        } else {
          e.target.querySelector('.auto-help__input').checked = true;
        } 
      }
    }
  });


  /* Установка маски поля и лэйбла для мобильного телефона при получении фокуса */
  document.body.addEventListener('focusin', (e) => {
    
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


    /* изменение фона input датапикера */
    if (e.target.classList.contains('auto-help__datepicker')) {
      if (e.target.value == '') {
        e.target.classList.add('auto-help__datepicker-bg-false-up');
      } else {
        e.target.classList.remove('auto-help__datepicker-bg-true-down')
        e.target.classList.add('auto-help__datepicker-bg-true-up');
      }
    }

    /* изменяем прозрачность карточки при tab */
    if (e.target.classList.contains('get-pet-info')) {
      mouseOverCard(e);
    }
    
    /* убираем scroll формы при фокусе на её элементы на мобильных устройствах */
    if (!document.body.classList.contains('can-hover') && e.target.closest('.active')) {
      window.scrollTo(0, window.scrollY);
      if (e.target.classList.contains('form-input-text') || e.target.classList.contains('form-textarea')) {
        if (!e.target.classList.contains('auto-help__datepicker')) setTimeout(getFocus, 200, e);
      }
    }
  });

 
  /* Выставляем в нормальное положение input форм при получении фокуса на мобильных */
  function getFocus(e) {
    const fon = document.getElementById('disable-fon');
    fon.scrollTo(0, fon.scrollTop + e.target.getBoundingClientRect().y - 100);
  }
  
  
  /* Проверка значения мобильного телефона при потере фокуса */
  document.body.addEventListener('focusout', (e) => {
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


  /* Сортируем наших животных, тип сортировки по умолчанию: по алфавиту */
  function sortPets(type = 'alphabet') {
    if (type == 'alphabet') {
      database.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
    }
  }


  /* Отображаем на странице общее кол-во животных */
  function getNumberAllPets() {
    document.getElementById('numberAllPets').textContent = `(${database.length})`;
  }


                                        /* МЕНЮ НА МОБИЛЬНЫХ */

  const burger = document.querySelector('.header__nav-burger');
  burger.addEventListener('click', clickBurger);


  /* Отслеживаем клик по бургеру для открытия меню */
  function clickBurger(e) {
    if (!burger.classList.contains('header__nav-burger-active')) {
      document.body.addEventListener('click', checkMenuOff);
      menuOnOff();
    } else {
      document.body.removeEventListener('click', checkMenuOff);
      menuOnOff();
    }
  }


  /* Вкл/откл меню */
  function menuOnOff() {
    const nav_list =  document.querySelector('.header__nav-list');
    burger.classList.toggle('header__nav-burger-active'); 
    nav_list.classList.toggle('header__nav-list-active');
    if (nav_list.classList.contains('header__nav-list-active')) {
      setSizeMenu(nav_list);
      deleteScrollMargin();
      disableFon();
      hidden();
    } else {
      burger.removeEventListener('click', clickBurger);
      nav_list.addEventListener('transitionend', transitionOffMenu);
      disableFon();
    }
  }


  /* Рассчитываем размеры меню в зависимости от наличия скролла */
  function setSizeMenu(nav) {
    if (window.innerWidth - document.body.clientWidth > 0) {
      let width_body = window.getComputedStyle(document.body).width.replace('px', '');
      nav.style.width = Math.floor(+width_body + window.innerWidth - document.body.clientWidth) + 'px';
    } else {
      nav.style.width = window.getComputedStyle(document.body).width;
    }
    
    if (window.getComputedStyle(document.querySelector('.position-relative-off')).position !== 'static') {
      let w = window.getComputedStyle(document.querySelector('.wrapper')).width.replace('px', '');
      nav.style.left = ((w - window.innerWidth) / 2 + (window.innerWidth - document.body.clientWidth) / 2) + 'px';
    } else {
      nav.style.left = 0;
    }
  }


  /* Сброс размеров меню */
  function resetSizeMenu(nav) {
    nav.style.width = '';
    nav.style.left = 0;
  }


  /* Отслеживаем клик не по бургеру а по другим элементам от которых меню должно быть закрыто */
  function checkMenuOff(e) {
    if (e.target.classList.contains('disable-fon') ||
        e.target.classList.contains('header__link')) {
      menuOnOff();
      document.body.removeEventListener('click', checkMenuOff);
    }
  }


  /* При закрытии меню делаем все в нужной последовательности для правильной работы функционала */
  function transitionOffMenu(e) {
    resetSizeMenu(e.target);
    e.target.removeEventListener('transitionend', transitionOffMenu);
    burger.addEventListener('click', clickBurger);
    deleteScrollMargin();
    hidden();
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

  /* Модальное окно кому и куда передать */
  document.getElementById('transfer').addEventListener('click', () => {
    getForm(document.querySelector('.transfer'));
  });


  /* Форма волонтерство */
  document.getElementById('volunteer-button').addEventListener('click', () => {
    getForm(document.querySelector('.volunteer'));
  });


  /* Форма забрать домой */
  document.getElementById('take-home').addEventListener('click', () => {
    getForm(document.querySelector('.take-home'));
  });
  document.getElementById('take-home_two').addEventListener('click', () => {
    let pet = Object.assign({}, pet_object);
    closePetInfo();
    getForm(document.querySelector('.take-home'), pet);
  });


  /* Форма забрать на передержку */
  document.getElementById('take-on-time').addEventListener('click', () => {
    getForm(document.querySelector('.take-on-time'));
  });
  document.getElementById('take-on-time_two').addEventListener('click', () => {
    let pet = Object.assign({}, pet_object);
    closePetInfo();
    getForm(document.querySelector('.take-on-time'), pet);
  });


  /* Форма автопомощь и подключение datepicker */
  document.getElementById('auto-help').addEventListener('click', () => {
    getForm(document.querySelector('.auto-help'));

    if (!document.querySelector('script[src="src/datepicker.min.js"')) {
      let datepicker = document.createElement('script'),
          jquery = document.createElement('script');
      jquery.async = false;
      datepicker.async = false;
      jquery.setAttribute('src', 'src/jquery-1.12.4.min.js');
      datepicker.setAttribute('src', 'src/datepicker.min.js');
      document.body.appendChild(jquery);
      document.body.appendChild(datepicker);
      datepicker.addEventListener('load', createDatePicker);
    } 
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
    
    document.querySelector('.active').focus();
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

    if (form.classList.contains('volunteer')) document.getElementById('always-help').checked = true;

    if (form.classList.contains('auto-help')) {
      document.querySelectorAll('.datapicker-container').forEach((elem, i) => {
        if (i !== 0) {
          $(`#datepicker${i}`).datepicker().data('datepicker').destroy();
          elem.remove();
        }
      });

      $('#datepicker0').datepicker().data('datepicker').clear();
      $('#datepicker0').datepicker({
        range: true,
        multipleDatesSeparator: ' - ',
        multipleDates: false
      });

      document.getElementById('time0').value = '';
      document.querySelectorAll('.auto-help__input').forEach((elem) => elem.checked = false);
      document.getElementById('switch-datepicker0').checked = false;

      if (document.querySelector('.auto-help__add-date-circle')) {
        disableAddDatapicker(document.querySelector('.auto-help__add-date-circle'));
      }

      const fon_input = document.getElementById('datepicker0');
      fon_input.classList.remove('auto-help__datepicker-bg-false-up');
      fon_input.classList.remove('auto-help__datepicker-bg-true-up');
      fon_input.classList.remove('auto-help__datepicker-bg-true-down');
    }
  }


  /* Раставление id элементам формы, потомучто у форм одинаковые блоки с одинаковым функционалом,
  для этого мы будем динамически назначать id что бы не было на странице одинаковых id */
  function addIdElemsForm() {
    const id = [{class:'mobile', id:'mobile'}, 
                {class:'name', id:'user-name'}, 
                {class:'form-textarea', id:'comment'}];

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


                                            /* КАЛЕНДАРЬ */

  /* Проверка режима работы календаря: false - выбор отдельных дат, true - промежуток дат */
  function checkDatepicker(id) {
    if (document.getElementById(`switch-${id}`).checked) {
      return false;
    } else {
      return true;
    }
  }


  /* Создание свича для переключения режима работы и бокса для дат в режиме отдельного выбора дат */
  function createSwitch(id) {
    const switch_datepicker = document.createElement('div'),
          date_box = document.createElement('div');
    switch_datepicker.innerHTML = `<input type="checkbox" class="display-none switch-input" 
                                  id="switch-${id}">
                                  <label for="switch-${id}" class="switch"></label>
                                  <label for="switch-${id}" class="switch-info">
                                    Выбрать только отдельные дни
                                  </label>`;
    switch_datepicker.classList.add('switch_datepicker');
    date_box.classList.add('date-box');
    document.querySelector(`.${id}`).appendChild(date_box);                       
    document.querySelector(`.${id}`).appendChild(switch_datepicker);
  }


  /* Установка правильного фона инпуту датапикера при закрытии календаря */
  function closeDatepicker(inst) {
    let id = inst.el.getAttribute('id');
    const datepicker = document.getElementById(id),
          datepickers_value = document.querySelectorAll('.auto-help__datepicker');
    document.querySelector(`.${id}`).classList.remove('view-active');
    
    if (datepicker.classList.contains('auto-help__datepicker-bg-true-up')) {
      datepicker.classList.remove('auto-help__datepicker-bg-true-up');
      datepicker.classList.add('auto-help__datepicker-bg-true-down');
    } else {
      datepicker.classList.remove('auto-help__datepicker-bg-false-up');
    }
    
    if ([...datepickers_value].every((elem) => elem.value !== '')) {
      const add_picker = document.querySelector('.auto-help__add-date-circle-disable');
      if(!add_picker) return;
      add_picker.classList.remove('auto-help__add-date-circle-disable');
      add_picker.classList.add('auto-help__add-date-circle');
      add_picker.addEventListener('click', createDatePicker);
    } else {
      const add_picker = document.querySelector('.auto-help__add-date-circle');
      if(!add_picker) return;
      disableAddDatapicker(add_picker);
    }
  }


  /* Сбрасываем bg inputa datapicker при switch */
  function resetBgInputDatepicker(id) {
    if (id) {
      document.getElementById(id).classList.add('auto-help__datepicker-bg-false-up');
      document.getElementById(id).classList.remove('auto-help__datepicker-bg-true-up');
    }
  }


  /* Отключаем кнопку добавления новых датапикеров */
  function disableAddDatapicker(elem) {
    elem.classList.add('auto-help__add-date-circle-disable');
    elem.classList.remove('auto-help__add-date-circle');
    elem.removeEventListener('click', createDatePicker);
  }


  /* Даты которые пользователь выбирает в календаре */
  function changeBoxDate(formattedDate, date, inst) {
    const datepicker = document.querySelector(`.${inst.el.getAttribute('id')}`);
    const date_box = datepicker.querySelector('.date-box');
    if (date_box.children.length > 0) [...date_box.children].forEach((elem) => elem.remove());

    if (!checkDatepicker( inst.el.getAttribute('id') )) {
      let dates = formattedDate.split(',');
      if(dates[0] == '') resetBgInputDatepicker( inst.el.getAttribute('id') );
      
      if (dates.length > 0 && dates[0] !== '') {
        for (let i = 0; i < dates.length; i++) {
          let date_elem = document.createElement('div'),
              close = document.createElement('div');
          date_elem.classList.add('date');
          date_elem.textContent = dates[i];
          date_elem.setAttribute('data-date_value', date[i]);
          close.classList.add('date-close');
          date_box.appendChild(date_elem);
          date_elem.appendChild(close);
        }
      }

      datepicker.classList.add('view-active');
    }

    const label = document.querySelector(`.form-label[for="${inst.el.getAttribute('id')}"]`);
    if (label.classList.contains('display-none')) label.classList.toggle('display-none');
    if (document.getElementById(inst.el.getAttribute('id')).value == '') label.classList.toggle('display-none');
  }


  /* Создание датапикеров */
  function createDatePicker(e) {
    const datepicker_num = document.querySelector('.auto-help__datepick-box').children.length;
    if (datepicker_num < 14) {
      let container = document.createElement('div');
      container.setAttribute('data-num_picker', datepicker_num);
      container.innerHTML = `<div class="form-input-box">
                              <input type="text" class="form-input-text auto-help__datepicker" tabindex="4"
                              id="datepicker${datepicker_num}" placeholder="Дата / период" readonly>
                              <label for="datepicker${datepicker_num}" class="form-label display-none">
                                Дата / период
                              </label>
                            </div>
                            <div class="form-input-box">
                              <input type="tel" class="form-input-text auto-help__time" maxlength="18"
                              placeholder="Время" id="time${datepicker_num}" autocomplete="off" tabindex="4">
                              <label for="time${datepicker_num}" class="form-label display-none">Время</label>
                            </div>`;
      container.classList.add('datapicker-container');
      document.querySelector('.auto-help__datepick-box').appendChild(container);

      $(`#datepicker${datepicker_num}`).datepicker({
        range: true,
        dateFormat: 'dd M yyyy',
        multipleDatesSeparator: ' - ',
        showOtherMonths: false,
        offset: 0,
        minDate: new Date(),
        prevHtml: '<div class="datepicker-left"></div>',
        nextHtml: '<div class="datepicker-right"></div>',
        navTitles: {days: 'MM <i>yyyy</i>'},
        disableNavWhenOutOfRange: false,
        onHide: closeDatepicker,
        onSelect: changeBoxDate,
        classes: `datepicker${datepicker_num}`,
        showEvent: 'click'
      });

      createSwitch(`datepicker${datepicker_num}`);
    }

    disableAddDatapicker(e.target);
  }


                                        /* СЛАЙДЕР БОЛЬШОЙ */

  /* Добавление карточки на страницу (3)*/
  function addCard(pet, direction = 'left') {
    let pet_card = document.createElement('div');
    pet_card.innerHTML = createCard(pet);
    pet_card.classList.add('pet__card');
    pet_card.setAttribute('data-id', pet.id);
    pet_card.setAttribute('data-img_num_active', 0);
    const slider = document.querySelector('.pet__slider');

    if (direction == 'left') {
      slider.appendChild(pet_card);
    } else {
      pet_card.classList.add('pet__card-right');
      slider.prepend(pet_card);
    }
    
    let img_pet = database.filter((elem) => elem.id == pet_card.dataset.id)[0].img;

    for (let i = 0; i < img_pet.length; i++) {
      let circle_img = document.createElement('div');
      circle_img.classList.add('pet__img-circle');
      if (i == 0) circle_img.classList.add('pet__img-circle-active');
      pet_card.querySelector('.pet__photo-num').appendChild(circle_img);
    }
  }


  /* Слайдер, цифры в конце описания функций = последовательность вызова их при итерации слайдера (1) */
  function nextCard(e) {
    let direction;

    /* нажимаем левую кнопку но направление движение слайдера = вправо */
    if (e.target.closest('.left')) {
      direction = "right";
      i_left = i_left - 1;
      i_right = i_right - 1;
    }

    if (e.target.closest('.right')) {
      direction = "left";
      i_left = i_left + 1;
      i_right = i_right + 1;
    }

    if (direction) {
      document.querySelector('.pet__slider-item').removeEventListener('click', nextCard);
      resetOpacityCard();
      if (i_left == -1) i_left = database.length - 1;
      if (i_right == -1) i_right = database.length - 1;
      if (i_right == database.length) i_right = 0;
      if (i_left == database.length) i_left = 0;
      
      if (direction == 'right') {
        addCard(database[i_left], 'right');
      } else {
        addCard(database[i_right]);
      }

      setTimeout(moveCard, 10, direction, 'start');
    }
  }


  /* Удаляем видимость у всех карточек (2)*/
  function resetOpacityCard() {
    [...document.querySelector('.pet__slider').children].forEach((elem) => {
      if (elem.classList.contains('pet__card-opacity')) {
        elem.classList.remove('pet__card-opacity');
      }
    });
  }


  /* Меняем прозрачность карточек*/
  function mouseOverCard(e) {
    const pet_card = e.target.closest('.pet__card');

    if (pet_card) {
      resetOpacityCard();
      setOpacityCard(pet_card);
    }
  }


  /* Ставим полную видимость карточке */
  function setOpacityCard(card) {
    if (card) {
      card.classList.add('pet__card-opacity');
    } else {
      [...document.querySelector('.pet__slider').children][1].classList.add('pet__card-opacity');
    }
  }


  /* Создание разметки карточки и ограничение кол-ва символов описания питомца (4)*/
  function createCard(pet) {
    let pet_info = pet.info[0];
    
    if (pet_info.length > 85) pet_info = pet_info.replace(/(.{85}).*/i, '$1...');

    return `<div class="pet__main-foto">
              <img src="${pet.img[0]}" alt="photo pet" class="pet__photo">
              <div class="pet__control">
                <div class="pet__control-elem go-left">
                  <svg class="pet__control-arrow">
                    <use xlink:href="#control-elem"></use>
                  </svg>
                </div>
                <div class="pet__control-elem go-right">
                  <svg class="pet__control-arrow">
                    <use xlink:href="#control-elem"></use>
                  </svg>
                </div>
              </div>
              <div class="pet__photo-num"></div>
            </div>
            <p class="pet__name">${pet.name}</p>
            <div class="pet__card-border"></div>
            <p class="pet__gender">${pet.gender}, ${pet.age}</p>
            <p class="pet__info">${pet_info}</p>
            <a href="" class="button-underline get-pet-info">
              <span>Подробнее</span>
            </a>`;
  }


  /* Даем команду карточкам на движение (5)*/
  function moveCard(direction, phase) {
    let cards_active = [...document.querySelector('.pet__slider').children];
    
    if (phase == 'start') {
      let width_card = +window.getComputedStyle(document.querySelector('.pet__card')).width.replace('px', ''),
          card_margin = +window.getComputedStyle(document.querySelector('.pet__card')).marginRight.replace('px', '');
      
      if (direction == 'right') {
        setOpacityCard(cards_active[1]);
        cards_active.forEach((elem) => elem.style.transform = `translateX(${width_card + card_margin}px)`);
        cards_active[3].addEventListener('transitionend', () => cardTransitionEnd(direction, cards_active));
      } else {
        setOpacityCard(cards_active[2]);
        cards_active.forEach((elem) => elem.style.transform = `translateX(-${width_card + card_margin}px)`);
        cards_active[0].addEventListener('transitionend', () => cardTransitionEnd(direction, cards_active));
      } 
      
    } else {
      cards_active.forEach((elem) => elem.style.transform = '');
      setTimeout(moveCardEnd, 10, cards_active);
    }
  }


  /* Удаления из потока уехавшей карточки и нормализация стилей других (6)*/
  function cardTransitionEnd(direction, cards_active) {
    removeCard(direction, cards_active);
    cards_active.forEach((elem) => elem.classList.add('pet__card-transition'));
    moveCard();
    if (direction == 'right') cards_active[0].classList.remove('pet__card-right');
  }


  /* Удаление карточки животного со страницы (7)*/
  function removeCard(direction, cards_active) {
    if (direction == 'left') {
      cards_active[0].remove();
    } else {
      cards_active[3].remove();
    }
  }


  /* Готовность к следующей итерации слайдера (8)*/
  function moveCardEnd(cards_active) {
    cards_active.forEach((elem) => elem.classList.remove('pet__card-transition'));
    document.querySelector('.pet__slider-item').addEventListener('click', nextCard);

    let swipe_direction = document.querySelector('.pet__slider').classList.value.replace(/.*(left|right)/, '$1');
    if (swipe_direction == 'left' || swipe_direction == 'right') {
      document.querySelector('.pet__slider').classList.remove(swipe_direction);
      document.querySelector('.pet__slider').addEventListener('touchstart', swipeCardStart);
      document.querySelector('.pet__slider').addEventListener('touchmove', swipeCardMove);
      document.querySelector('.pet__slider').addEventListener('touchend', swipeCardEnd);
    }
  }


  /* Уходим со слайдера возвращаем прозрачность центральной карточке */
  function mouseOutCard() {
    resetOpacityCard();
    setOpacityCard();
  }


                                              /* СВАЙПЕР */

  /* Свайпер, получаем начальные координаты свайпа */
  function swipeCardStart(e) {
    swipe_start_x = e.touches[0].clientX;
    swipe_start_y = e.touches[0].clientY;
  }


  /* Записываем координаты перемещения, чтобы дальше понять какой был свайп */
  function swipeCardMove(e) {
    swipe_move_x.push(e.touches[0].clientX);
    swipe_move_y.push(e.touches[0].clientY);
  }


  /* Проверяем правильность формы свайпа и определяем его направление */
  function checkTypeSwipe() {
    let left = swipe_move_x.every((elem, i) => {
      if (i == swipe_move_x.length - 1) return true;
      if (elem >= swipe_move_x[i + 1]) return true;
      return false;
    });

    let right = swipe_move_x.every((elem, i) => {
      if (i == swipe_move_x.length - 1) return true;
      if (elem <= swipe_move_x[i + 1]) return true;
      return false;
    });

    if (swipe_move_y.every((elem) => elem - swipe_start_y > -7) || 
        swipe_move_y.every((elem) => swipe_start_y - elem > -7)) {
      if (left) return 'right';
      if (right) return 'left'; 
    }
  }


  /* Получаем конечные координаты, определяем направление и решаем стоит
  ли запускать итерацию слайдера, сброс начальных координат */
  function swipeCardEnd(e) {
    let swipe_end_x = e.changedTouches[0].clientX, 
        swipe_end_y = e.changedTouches[0].clientY;
    
    if (Math.abs(swipe_end_x - swipe_start_x) > 40 && Math.abs(swipe_end_y - swipe_start_y) < 50) {
      let direction = checkTypeSwipe();
      
      if (direction == 'left' || direction == 'right') {
        document.querySelector('.pet__slider').classList.add(direction);
        document.querySelector('.pet__slider').removeEventListener('touchstart', swipeCardStart);
        document.querySelector('.pet__slider').removeEventListener('touchmove', swipeCardMove);
        document.querySelector('.pet__slider').removeEventListener('touchend', swipeCardEnd);
        nextCard(e);
      }
    }

    swipe_start_x = 0; 
    swipe_start_y = 0;
    swipe_move_x = []; 
    swipe_move_y = [];
  }


                                            /* МИНИ-СЛАЙДЕР */
  function miniSliderActive(e) {
    const pet_card = e.target.closest('.pet__card');
    let images;

    if (e.target.closest('.go-left')) pet_card.dataset.img_num_active -= 1;
    if (e.target.closest('.go-right')) {
      pet_card.dataset.img_num_active = +pet_card.dataset.img_num_active + 1;
    }
    
    if (pet_card) {
      images = database.filter((elem) => elem.id == pet_card.dataset.id)[0].img;
      if (pet_card.dataset.img_num_active == -1) pet_card.dataset.img_num_active = images.length - 1;
      if (pet_card.dataset.img_num_active == images.length) pet_card.dataset.img_num_active = 0; 
    }
    
    if (e.target.closest('.go-left') || e.target.closest('.go-right')) {
      let number = pet_card.dataset.img_num_active;
      [...pet_card.querySelector('.pet__photo-num').children].forEach((elem, i) => {
        elem.classList.remove('pet__img-circle-active');
        if (i == number) elem.classList.add('pet__img-circle-active');
      });
      pet_card.querySelector('.pet__photo').setAttribute('src', images[number]);
    }
  }


                                              /* КАРТА API YANDEX */
  function showMap() {
    ymaps.ready(() => {
      const address = [ {'src':'Беларусь, Гродно, ул. Комарова, 26а', 'name':'Зоомаркет «Зообазар»'}, 
                        {'src':'Беларусь, Гродно, ул. Волковича, 1', 'name':'Учебный корпус ГГАУ'},
                        {'src':'Беларусь, Гродно, ул. Гоголя, 11', 'name':'Парикмахерская «ПРИМАДОННА»'},
                        {'src':'Беларусь, Гродно, ул. Пушкина, 31а', 'name':'Зоомаркет «Зообазар»'},
                        {'src':'Беларусь, Гродно, ул. Тимирязева, 8', 'name':'Гипермаркет «Евроопт»'},
                        {'src':'Беларусь, Гродно, ул. Янки Купалы, 82А', 'name':'Гипермаркет «Евроопт»'},
                        {'src':'Беларусь, Гродно, ул. Подольная, д.37', 'name':'Фитнес-центр «АДРЕНАЛИН»'} ]
  
      const map = new ymaps.Map('map', {center: [53.682, 23.835], 
                                        zoom: 13,
                                        controls: ['searchControl', 'zoomControl']});
  
      document.querySelector('.ymaps-2-1-78-map-copyrights-promo').remove();
      document.querySelector('.ymaps-2-1-78-copyright_logo_no').remove();
  
      address.forEach((elem, i) => {
        let geocoder = ymaps.geocode(elem.src);
  
        geocoder.then((res) => {
          let coordinates = res.geoObjects.get(0).geometry.getCoordinates();
  
          let placemark = new ymaps.Placemark(coordinates, {
            iconContent: `<div class="place">
                            <div class="place-number">${i + 1}</div>
                            <div class="place-info" data-number=${i + 1}>
                              ${elem.name}, ${elem.src.replace(/.+(ул.+)/i, '$1')}
                            </div>
                          </div>`
          }, {
            iconLayout: 'default#imageWithContent',
            iconImageHref: '../img/icon/icon_map.svg',
            iconImageSize: [40, 48],
            iconImageOffset: [-20, -24],
            iconContentOffset: [5, 5],
            iconContentSize: [30, 30],
            number: i + 1
          });
  
          let number = placemark.options.get('number');
  
          placemark.events.add('mouseenter', () => {
            placemark.options.set({iconImageHref: '../img/icon/icon_map-active.svg'});
            document.querySelector(`.place-info[data-number="${number}"]`).classList.add('place-info-active');
          });
  
          placemark.events.add('mouseleave', () => {
            placemark.options.set({iconImageHref: '../img/icon/icon_map.svg'});
            document.querySelector(`.place-info[data-number="${number}"]`).classList.remove('place-info-active');
          });
  
          /* placemark.events.add('click', (e) => {
            const hint = document.querySelector(`.place-info[data-number="${number}"]`);
  
            if (!document.body.classList.contains('can-hover')) {
  
              if (hint.classList.contains('place-info-active')) {
                closeHint(placemark, hint);
              } else {
                placemark.options.set({iconImageHref: '../img/icon/icon_map-active.svg'});
                hint.classList.add('place-info-active');
                closeHint = closeHint.bind(null, placemark, hint, map);
                document.body.addEventListener('click', closeHint);
                map.events.add('click', closeHint);
              }
              
            }
          }); */
  
          map.geoObjects.add(placemark);
        });
      });
    });
  }
  
     
  /* Закрытие hint карты */
  /* function closeHint(placemark, hint, map) {
    if (hint.classList.contains('place-info-active')) {
      placemark.options.set({iconImageHref: '../img/icon/icon_map.svg'});
      hint.classList.remove('place-info-active');
      document.body.removeEventListener('click', closeHint);
      map.events.remove('click', closeHint);
    }
  } */
});