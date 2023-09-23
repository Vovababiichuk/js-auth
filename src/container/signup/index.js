import { Form, REG_EXP_EMAIL, REG_EXP_PASSWORD } from '../../script/form'

class SignupForm extends Form {
   // перезаписуємо поля з батьківського класу Form в наш клас

   FIELD_NAME = {
      EMAIL: 'email',
      PASSWORD: 'password',
      PASSWORD_AGAIN: 'passwordAgain',
      ROLE: 'role',
      IS_CONFIRM: 'isConfirm',
   }

   FIELD_ERROR = {
      IS_EMPTY: 'Введіть значення в поле',
      IS_BIG: 'Дуже довге значення, приберіть зайве',
      EMAIL: 'Введіть коректне значення e-mail адреси',
      PASSWORD: 'Пароль повинен складатися з не менше ніж 8 символів, включаючи цифри',
      PASSWORD_AGAIN: 'Паролі не співпадають',
      NOT_CONFIRM: 'Ви не погоджуєтесь з правилами',
      ROLE: 'Ви не обрали роль',
   }

   // для кожної форми ми будемо мати свою ф-ю для валідації
   // ми через if будемо робити валідаціюі в кінці ф-ї ми нфчого не будемо повертати. Ф-я буде приймати name та value і повертати текст помилки...якщо помилки немає то ми нічого не повертаємо і в коді будемо розуміти що валідація пройшла успішно...
   validate = (name, value) => {
      if (String(value).length < 1) {
         return this.FIELD_ERROR.IS_EMPTY
      }

      if (String(value).length > 20) {
         return this.FIELD_ERROR.IS_BIG
      }

      if (name === this.FIELD_NAME.EMAIL) {
         if (!REG_EXP_EMAIL.test(String(value))) {
            return this.FIELD_ERROR.EMAIL
         }
      }

      if (name === this.FIELD_NAME.PASSWORD) {
         if (!REG_EXP_PASSWORD.test(String(value))) {
            return this.FIELD_ERROR.PASSWORD
         }
      }

      // перевірка чи співпадає другий пароль з першим паролем

      if (name === this.FIELD_NAME.PASSWORD_AGAIN) {
         if (String(value) !== this.value[this.FIELD_NAME.PASSWORD]) {
            return this.FIELD_ERROR.PASSWORD_AGAIN
         }
      }

      if (name === this.FIELD_NAME.ROLE) {
         if (isNaN(value)) {
            return this.FIELD_ERROR.ROLE
         }
      }

      if (name === this.FIELD_NAME.IS_CONFIRM) {
         if (Boolean(value) !== true) {
            return this.FIELD_ERROR.NOT_CONFIRM
         }
      }
   }

   // submit - також буде унікальною ф-ю для кожного контейнера де ми будемо відправляти запит на сервер
   submit = async () => {
      // console.log(this.disabled);
      if (this.disabled === true) {
         this.validateAll()
      } else {
         console.log(this.value)

         this.setAlert('progress', 'Зачекайте...')

         try {
            // робимо асинхронни  запит fetch();
            // fetch(); повертає відповідь res
            const res = await fetch('/signup', {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
               },
               body: this.convertData(),
            })

            // те що в ендпоїнті при ходить сюди...
            const data = await res.json()

            if (res.ok) {
               this.setAlert('success', data.message)
            } else {
               this.setAlert('error', data.message)
            }

         } catch (error) {
            this.setAlert('error', error.message)
         }
      }
   }

   convertData = () => {
      return JSON.stringify({
         [this.FIELD_NAME.EMAIL]: this.value[this.FIELD_NAME.EMAIL],

         [this.FIELD_NAME.PASSWORD]: this.value[this.FIELD_NAME.PASSWORD],

         [this.FIELD_NAME.ROLE]: this.value[this.FIELD_NAME.ROLE],
      })
   }
}

//! ВАЖЛИВО створювати новий екземпляр ....щоб відбулося підтягування полей які є в Form...
window.signupForm = new SignupForm()