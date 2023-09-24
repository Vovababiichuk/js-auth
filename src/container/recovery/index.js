import { Form, REG_EXP_EMAIL } from '../../script/form'

class RecoveryForm extends Form {
   // перезаписуємо поля з батьківського класу Form в наш клас

   FIELD_NAME = {
      EMAIL: 'email',
   }

   FIELD_ERROR = {
      IS_EMPTY: 'Введіть значення в поле',
      IS_BIG: 'Дуже довге значення, приберіть зайве',
      EMAIL: 'Введіть коректне значення e-mail адреси',
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
   }

   // submit - також буде унікальною ф-ю для кожного контейнера де ми будемо відправляти запит на сервер
   // НЕ ВАРТО submit ВИНОСИТИ ОКРЕМО.....в Form
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
            const res = await fetch('/recovery', {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
               },
               body: this.convertData(),
            })

            // те що в ендпоїнті приходить сюди...
            const data = await res.json()

            if (res.ok) {
               this.setAlert('success', data.message)

               // коли все ок то переведемо користувача на іншу сторінку
               this.goTo('/recovery-confirm')

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
      })
   }
}

//! ВАЖЛИВО створювати новий екземпляр ....щоб відбулося підтягування полей які є в Form...
window.recoveryForm = new RecoveryForm()