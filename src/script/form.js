export const REG_EXP_EMAIL = new RegExp(
  /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/,
)

export const REG_EXP_PASSWORD = new RegExp(
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
)

export class Form {
  //! ВАЖЛИВО не робити статичні поля, тому що наслідування не працює зі статичними полями

  // ми тут будемо робити абстрактні методи

  // у константі FIELD_NAME ми будемо тримати назви наших полей які використовуються у верстці. Тут залишаєм його пустим, наповним його у своєму класі....
  FIELD_NAME = {}
  // тут будуть заготовлені текста на помилку при валідації
  FIELD_ERROR = {}

  // буде містити значення наших полей форми
  value = {}
  error = {}
  // кнопка вимкнута
  disabled = true

  change = (name, value) => {
    //  console.log(name, value)
    // якщо в нас валідація проходить то значення буде записуватися
    // if (this.validate(name, value)) this.value[name] = value

    const error = this.validate(name, value)

    this.value[name] = value

    if (error) {
      // якщо в нас є помилка то задаємо верстці
      this.setError(name, error)
      // та в класі додаємо
      this.error[name] = error
    } else {
      // якщо немає то вимикаємо в верстці
      this.setError(name, null)
      // і видаляємо
      delete this.error[name]
    }

      // після змін в формі ми будемо завжди перевіряти на checkDisabled
    this.checkDisabled()
  }

  // ф-я яка приймає name та error (або рядок або null)
  // включає і вимикає нам помилку (якщо error - рядок то включає а якщо null то вимикає)
  setError = (name, error) => {
    const span = document.querySelector(
      `.form__error[name="${name}"]`,
    )

    const field = document.querySelector(
      `.validation[name="${name}"]`,
    )

    if (span) {
      span.classList.toggle(
        'form__error--active',
        // перетворюється в true або false - таким чином я вмикаю або вимикаю
        Boolean(error),
      )
      span.innerText = error || ''
    }

    if (field) {
      field.classList.toggle(
        'validation--active',
        Boolean(error),
      )
    }
  }

  // перевірка чи готова у нас форма до відправки
  checkDisabled = () => {
    // кнопка відправки буде активна
    let disabled = false

   //  // далі ми будемо валідувати кожне поле і якщо якесь поле буде не коректне то disabled буде true і кнопка відпраки буде не активна

   //  // https://www.youtube.com/watch?v=GAVsiUYYLTs&t=41m00s
   //  Object.values(this.FIELD_NAME).forEach((name) => {
   //    const error = this.validate(name, this.value[name])

   //    if (error) {
   //      this.setError(name, error)
   //      disabled = true
   //    }
   //  })

   // змінимо і уже тут не юудемо валідувати дані....
   // валідацію будемо робити окремо при натисканні на sabmit()
    //! https://www.youtube.com/watch?v=GAVsiUYYLTs&t=46m45s
    Object.values(this.FIELD_NAME).forEach((name) => {
       if (
         this.error[name] ||
         this.value[name] === undefined
       ) {
         disabled = true
       }
    })

    const el = document.querySelector('.button')

    if (el) {
      el.classList.toggle(
        'button--disabled',
        Boolean(disabled),
      )
    }

    // будемо додавати або забирати клас щоб було видно кнопка активна чи ні
    this.disabled = disabled
  }

  validateAll = () => {

    Object.values(this.FIELD_NAME).forEach((name) => {
      const error = this.validate(name, this.value[name])

      if (error) {
        this.setError(name, error)
      }
    })
  }

  setAlert = (status, text) => {
    const el = document.querySelector('.alert')

   if (status === 'progress') {
      el.className = 'alert alert--progress'
   }  else if (status === 'success') {
      el.className = 'alert alert--success'
   }  else if (status === 'error') {
      el.className = 'alert alert--error'
   } else {
      el.className = 'alert alert--disabled'
   }

   if (text) el.innerText = text
  }
}
