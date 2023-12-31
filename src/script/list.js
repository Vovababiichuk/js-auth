//! АЛГОРИТМ завантаження списку

//? 1) Завантаження даний -> Відобразити статус завантаження
//? 2) Відображення даних які ми завантажили (конвертація даних)
//? 3) Якщо є помилка - виводимо статус помилки

export class List {
   STATE = {
      LOADING: 'loading',
      SUCCESS: 'success',
      ERROR: 'error',
   }

   // окрема властивість яка буде мати одне із трьох значень STATE
   status = null;
   // дані які ми завантажили
   data = null;
   // елемент в якому ми будемо відображати наші дані
   element = null;

   updateStatus = (status, data) => {
      // змінюємо статус
      this.status = status;

      // якщо є дані змінюємо дані
      if (data) this.data = data;

      // updateView - ф-я яка буде відображати зовнішній вигляд нашого модуля. Дана ф-я буде відповідати за те щоб взяти елемент та змінити його innerHTML. Також тут потрібно врахувати статуси, при різних статусах будем відображати різну верстку...
      this.updateView();
   }

   //! зробимо тут абстрактні ф-ї щоб коли ми будемо унаслідувати клас List ми їх перезаписали

   updateView = () => {}

   loadData = () => {}

   // ф-я яка буде конвертувати дані в фронтенд вигляд. Тому що з сервера нам можуть прийти дані в одній структурі а нам на фронтенд частині буде зручно мати іншу структуру даних...
   convertData = () => {}
}