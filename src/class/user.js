class User {
  static USER_ROLE = {
    // число - це ідентифікатор ролі. Далі на фронтенді в формі мені потрібно буде відправляти лише число ролі.
    USER: 1,
    ADMIN: 2,
    DEVELOPER: 3,
  }

  // список створених користувачів
  static #list = []

  constructor({ email, password, role }) {
    this.email = String(email).toLowerCase()
    this.password = password
    // але ось так записувати роль НЕБЕЗПЕЧНО, тому що в роль так може прийти будь що. Нам потрібна перевірка. Зробимо - convertRole...
    this.role = User.#convertRole(role)
  }

  static #convertRole = (role) => {
    //конвертуємо роль в число
    role = Number(role)

    // перевіряємо чи є в нас число, якщо числа немає то за замовчуванням ставим USER роль
    if (isNaN(role)) {
      role = this.USER_ROLE.USER
    }

    // далі через Object.values отримуємо список наших значень і дивимося чи є наша конкретна роль в нашому списку, якщо є то ми її записуємо якщо ні то ставим USER за замовчуванням
    role = Object.values(this.USER_ROLE).includes(role)
      ? role
      : this.USER_ROLE.USER

    // ТАКИМ ЧИНОМ якщо роль не є числом то буде USER за замовчуванням і якщо нам приходить якесь число яке не збігається з тими числами які у нас є то ми теж будемо отримувати значення за замовчуванням...

    return role
  }

  static create(data) {
    const user = new User(data)

    this.#list.push(user)

    console.log(this.#list)
  }

  // ф-я яка знаходить користувача за email
  static getByEmail(email) {
    return (
      this.#list.find((user) => user.email === String(email).toLowerCase()) ||
      null
    )
  }
}

module.exports = {
  User,
}
