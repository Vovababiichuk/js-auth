import { Form } from '../../script/form'
import {
  saveSession,
  getTokenSession,
  getSession,
} from '../../script/session'

class SignupConfirmForm extends Form {
  // перезаписуємо поля з батьківського класу Form в наш клас

  FIELD_NAME = {
    CODE: 'code',
  }

  FIELD_ERROR = {
    IS_EMPTY: 'Введіть значення в поле',
    IS_BIG: 'Дуже довге значення, приберіть зайве',
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
        const res = await fetch('/signup-confirm', {
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
          // після підтвердження ми будемо отримувати session - обьект оновленної сесії з актуальними даними користувача, їх зберігати і переходити на головну сторінку щоб далі по кругу знов з головної сторінки код вирішик куди нам далі перейти
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
      [this.FIELD_NAME.CODE]: Number(
        this.value[this.FIELD_NAME.CODE],
      ),
      token: getTokenSession(),
    })
  }
}

//! ВАЖЛИВО створювати новий екземпляр ....щоб відбулося підтягування полей які є в Form...
window.signupConfirmForm = new SignupConfirmForm()

document.addEventListener('DOMContentLoaded', () => {
  try {
    if (window.session) {
      if (window.session.user.isConfirm) {
        location.assign('/')
      }
    } else {
      location.assign('/')
    }
  } catch (err) {}

  document.querySelector('.link#renew').addEventListener('click', (e) => {
    e.preventDefault()

    const session = getSession()

    location.assign(`/signup-confirm?renew=true&email=${session.user.email}`)
  })
})
