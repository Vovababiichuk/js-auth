import { Form, REG_EXP_EMAIL, REG_EXP_PASSWORD } from '../../script/form'
import { saveSession } from '../../script/session'
class RecoveryConfirmForm extends Form {
   // перезаписуємо поля з батьківського класу Form в наш клас

   FIELD_NAME = {
      CODE: 'code',
      PASSWORD: 'password',
      PASSWORD_AGAIN: 'passwordAgain',
   }

   FIELD_ERROR = {
      IS_EMPTY: 'Введіть значення в поле',
      IS_BIG: 'Дуже довге значення, приберіть зайве',
      //! ВАЛІДАЦІЮ ДО КОДУ НЕ РОБИМО ЩОБ НЕ ПІДКАЗУВАТИ ТИМ ХТО ХОЧЕ ЗЛАМАТИ КОРИСТУВАЧА. На полі є базовий тип - число...цього достатньо!!!
      PASSWORD: 'Пароль повинен складатися з не менше ніж 8 символів, включаючи цифри',
      PASSWORD_AGAIN: 'Паролі не співпадають',
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
            const res = await fetch('/recovery-confirm', {
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
               // так само як при реєстрації в нас буде генеруватися токен
               saveSession(data.session)
               location.assign('/')
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
         // код робимо Number щоб точно відправлялося число
         [this.FIELD_NAME.CODE]: Number(this.value[this.FIELD_NAME.CODE]),

         [this.FIELD_NAME.PASSWORD]: this.value[this.FIELD_NAME.PASSWORD],
      })
   }
}

//! ВАЖЛИВО створювати новий екземпляр ....щоб відбулося підтягування полей які є в Form...
window.recoveryConfirmForm = new RecoveryConfirmForm()