import { List } from '../../script/list'
import { USER_ROLE } from '../../script/user'

class UserList extends List {
  constructor() {
    super()

    this.element = document.querySelector('#user-list')
    if (!this.element) throw new Error('Element is null')

    this.loadData()
  }

  loadData = async () => {
    this.updateStatus(this.STATE.LOADING)

    // return null викор. для тесту шоб бачити як відбувається загрузка та skeleton
    // return null

    try {
      const res = await fetch('/user-list-data', {
        method: 'GET',
        // body немає, headers немає тому що ми дані не передаємо
      })

      const data = await res.json()

      console.log(data)
      if (res.ok) {
        this.updateStatus(
          // передаємо оновлений статус і дані
          this.STATE.SUCCESS,
          this.convertData(data),
        )
      } else {
        // тут дата без еонвертації там у нас message
        this.updateStatus(this.STATE.ERROR, data)
      }
    } catch (error) {
      console.log(error)
      this.updateStatus(this.STATE.ERROR, {
        // це data з message
        message: error.message,
      })
    }
  }

  // convertData - має бути завжди в будь-яких модулях які взаємодіють з сервером
  convertData = (data) => {
    return {
      // я залишаю всі мої дані але...
      ...data,
      // але кажу що я хочу оновити дані які знаходяться в list (в ендпоїнті user-list-data)
      list: data.list.map((user) => ({
        ...user,
        // змінюємо роль (з ідентифікатора на рядок текста)
        role: USER_ROLE[user.role],
      })),
    }
  }

  updateView = () => {
    this.element.innerHTML = ''

    console.log(this.status, this.data)

    switch (this.status) {
      case this.STATE.LOADING:
        this.element.innerHTML = `
          <div class="user">
            <span class="user__title skeleton"></span>
            <span class="user__sub skeleton"></span>
          </div>
          <div class="user">
            <span class="user__title skeleton"></span>
            <span class="user__sub skeleton"></span>
          </div>
          <div class="user">
            <span class="user__title skeleton"></span>
            <span class="user__sub skeleton"></span>
          </div>
          <div class="user">
            <span class="user__title skeleton"></span>
            <span class="user__sub skeleton"></span>
          </div>
        `
        break

      case this.STATE.SUCCESS:
        // тут нам потрібно пройтися по масиву list та додати верстку кожного юзера в нашому списку
        this.data.list.forEach((item) => {
          // не запишемо а додамо в кінець рядка ще один рядок...
          this.element.innerHTML += `
            <a href="/user-item?id=${item.id}" class="user user--click">
              <span class="user__title">${item.email}</span>
              <span class="user__sub">${item.role}</span>
            </a>
            `
        })
        break

      case this.STATE.ERROR:
        this.element.innerHTML = `
          <span class="alert alert--error">${this.data.message}</span>
        `
        break
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // будем перевіряти чи є у користувача обьект session

  try {
    if (!window.session || !window.session.user.isConfirm) {
      location.assign('/')
    }
  } catch (err) {}

  new UserList()
})
