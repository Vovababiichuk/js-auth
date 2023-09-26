import {
  Form,
  REG_EXP_EMAIL,
  REG_EXP_PASSWORD,
} from '../../script/form'

import { saveSession } from '../../script/session'

class SignupForm extends Form {
  // перезаписуємо поля з батьківського класу Form в наш клас

  FIELD_NAME = {
    EMAIL: 'email',
    PASSWORD: 'password',
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

    //! тут забрали валідацію на пароль щоб не підказувати злочинцям валідність паролю для входу
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
        // робимо асинхронний  запит fetch();
        // fetch(); повертає відповідь res
        const res = await fetch('/login', {
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
      [this.FIELD_NAME.EMAIL]:
        this.value[this.FIELD_NAME.EMAIL],

      [this.FIELD_NAME.PASSWORD]:
        this.value[this.FIELD_NAME.PASSWORD],
    })
  }
}

//! ВАЖЛИВО створювати новий екземпляр ....щоб відбулося підтягування полей які є в Form...
window.signupForm = new SignupForm()

document.addEventListener('DOMContentLoaded', () => {
  if (window.session) {
    location.assign('/')
}
})