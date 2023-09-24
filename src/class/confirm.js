// даний клас буде відповідати за генерацію кодів підтвердження

class Confirm {
  // списаок приватних кодів тут буде
  static #list = []

  constructor(data) {
    this.code = Confirm.generateCod()
    this.data = data
  }

  // генеруєм код з чотирьох чисел
  static generateCod = () =>
    Math.floor(Math.random() * 9000) + 1000

  // створюєм обьект Confirm, кладемо його в list
  // знаходим код в списку та видаляєм його через 24 години

  static create = (data) => {
    this.#list.push(new Confirm(data))

    setTimeout(() => {
      this.delete(code)
    }, 24 * 60 * 60 * 1000) // 24 години у мілісекундах

    // список кодів які ми згенерували
    // зазвичай вони відправляються через смс або на почту
    console.log(this.#list);
  }

  static delete = (code) => {
    const length = this.#list.length

    this.#list = this.#list.filter(
      (item) => item.code !== code,
    )

      // після фільтрації порівнюємо довжину. Якщо довжина зменшилася то буде true повертатися якщо ні то буде false
    return length < this.#list.length
  }

  // ф-я яка по коду знайде обект Confirm і поверне лище data
  static getData = (code) => {
   const obj = this.#list.find((item) => item.code === code)

   return obj ? obj.data : null
  }
}

module.exports = {
  Confirm,
}
