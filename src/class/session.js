class Session {

  static #list = []

  constructor(user) {
    this.token = Session.generateCod()
    this.user = {
      email: user.email,
      isConfirm: user.isConfirm,
      role: user.role,
      id: user.id,
    }
  }

  // генеруєм код з 6 чисел
  // даний код буде відправлятися користувачу і буде підтверджувати що даний користувач має доступ до акаунту
  static generateCod = () => {
    // генеруєм токін із шести чисел

    // вказуєм довжтину
    const length = 6;

    // символи які ми будемо використовувати (великі і малі літери та цифри)
    const char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    let result = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * char.length);
      result += char[randomIndex];
    }

    return result
  }


  static create = (user) => {
    const session = new Session(user)

    this.#list.push(session)

    return session
  }

  static get = (token) => {
    return this.#list.find((item) => item.token === token) || null
  }
}

module.exports = {
  Session,
}

console.log(Session.generateCod());
