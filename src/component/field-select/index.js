class FieldSelect {
   static toggle = (target) => {
      const options = target.nextElementSibling

      options.toggleAttribute('active')

      // обгортаємо в setTimeout без указання часу, це для того щоб ф-я спрацювала трішечки пізніше (розриваємо стек визовів). Щоб ця подія записалася після того як ми клікнули на відкривання селекта
      setTimeout(() => {
         window.addEventListener('click', (e) => {
            // parentElement - це наш field__container
            // в target нам приходить посилання на елемент на якому відбулася подія
            // за допомогою contains ми дивимося чи елемент знахлдиться в середині нашого field__container. Чи я клікнув у середині field__container чи ні?
            if (!options.parentElement.contains(e.target))
            // якщо я ззовні клікнув то атрибут active забирається і поле закривається
            options.removeAttribute('active')
         },
         // цю подію визвати лише один раз
         { once: true },
         )
      })
   }

   static change = (target) => {
      const active =
      // parentElement - піднімаємося на один елемент в гору. З li в ul.
      // querySelector('*[active]') - шукаєм атрибут якщо є
      target.parentElement.querySelector('*[active]')
      // Метод toggleAttribute() використовується для додавання або видалення атрибуту з елемента HTML. В даному випадку, він перевіряє, чи існує атрибут з ім'ям "active" для елемента, представленого змінною active. Якщо атрибут існує, він буде видалений, і навпаки, якщо атрибут не існує, він буде доданий.
      if (active) active.toggleAttribute('active')

      target.toggleAttribute('active')

         // підіймаємось до field__container
      const parent = target.parentElement.parentElement

      const fieldValue = parent.querySelector('.field__value')

      if (fieldValue) {
         // кладу такий же самий текст як в option
         fieldValue.innerText = target.innerText
         fieldValue.classList.remove('field__value--placeholder')
      }

      const list = target.parentElement

      list.toggleAttribute('active')
   }
}

window.fieldSelect = FieldSelect