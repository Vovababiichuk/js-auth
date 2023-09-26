import '../../script/test'
import '../../script/form'

document.addEventListener('DOMContentLoaded', () => {
  if (window.session) {
    // витягуємо юзера якщо є дані у window.session
    const { user } = window.session

    // далі буде код який буде виявляти на яку сторінку потрібно перейти користувачу
    // якщо у нього вже є акаунт то будемо вирішувати куди йому перейти
    // якщо нема акауна, тобто немає session то будемо робити перехід на /signup
    if (user.isConfirm) {
      // сторінка для користування додатком
      location.assign('/home')
    } else {
      // сторінка підтвердження реєстрації
      location.assign('/signup-confirm')
    }
  } else {
    location.assign('/signup')
  }
})

