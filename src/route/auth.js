// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// імпортували класс User
const { User} = require('../class/user')
const { Confirm } = require('../class/confirm')
const { Session } = require('../class/session')

User.create({
  email: 'user@mail.com',
  password: '123',
  role: 1,
})

User.create({
  email: 'admin@mail.com',
  password: '123',
  role: 2,
})

User.create({
  email: 'developer@mail.com',
  password: '123',
  role: 3,
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/signup', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('signup', {
    // вказуємо назву контейнера
    name: 'signup',
    // вказуємо назву компонентів
    component: ['back-button', 'heading','field', 'field-password', 'field-checkbox', 'field-select'],

    // вказуємо назву сторінки
    title: 'Signup page',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {
      // це для випадаючого списку опцій....Роль
      role: [
        { value: User.USER_ROLE.USER,
          text: 'Користувач' },
        {
          value: User.USER_ROLE.ADMIN,
          text: 'Адміністратор',
        },
        {
          value: User.USER_ROLE.DEVELOPER,
          text: 'Розробник',
        }
      ]
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

// ЕНДПОЇНТ відправки даних ДЛЯ СТВОРЕННЯ КОРИСТУВАЧА....(POST)
router.post('/signup', function (req, res) {
  // витягнемо наші дані через деструктуризацію
  const { email, password, role } = req.body

  console.log(req.body);

  // зробимо перевірку щоб всі поля у нас були
  if (!email || !password || !role) {
    return res.status(400).json({
      message: 'Помилка. Обовязкові поля відсутні',
    })
  }

  try {
    // шукаємо користувача по email, щоб перевірити, що такого користувача з таким email не існує
    const user = User.getByEmail(email)

      // якщо такий користувач існує то повертаємо помилку
    if (user) {
      return res.status(400).json({
        message: 'Користувач з таким email вже існує',
      })
    }

    const newUser = User.create({ email, password, role })

    const session = Session.create(newUser)

    Confirm.create(newUser.email)

    return res.status(200).json({
      message: 'Користувач успішно зареєстрований',
      // передамо сесію на фронтенд частину
      session,
    })
  } catch (err) {
    return res.status(400).json({
      message: 'Помилка створення користувача',
    })
  }

})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/recovery', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('recovery', {
    // вказуємо назву контейнера
    name: 'recovery',
    // вказуємо назву компонентів
    component: ['back-button', 'field', 'heading'],

    // вказуємо назву сторінки
    title: 'Recovery page',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

// router.get Створює нам один ентпоїнт

//? Тут ми будтмо відправляти запит на відновлення паролю...

// ↙️ тут вводимо шлях (PATH) до сторінки
router.post('/recovery', function (req, res) {
  // res.render генерує нам HTML сторінку
  const { email } = req.body

  console.log(email);

  // перевіряємо чи є в нас email
  if (!email) {
    return res.status(400).json({
      message: 'Помилка. Обовязкові поля відсутні',
    })
  }

  // далі нам потрібно знайти користувача за цим email
  try {
    const user = User.getByEmail(email)

    // далі потрібно перевірити чи є такий user
    if (!user) {
      return res.status(400).json({
        message: 'Користувач з таким email не знайдений',
      })
    }

    // тут потрібно написати логіку коду.....який в майбутньому буде зберігатися на Redis...
    Confirm.create(email)

    return res.status(200).json({
      message: 'Код для відправдення паролю відправлено',
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('recovery', {
    // вказуємо назву контейнера
    name: 'recovery',
    // вказуємо назву компонентів
    component: ['back-button', 'field', 'heading'],

    // вказуємо назву сторінки
    title: 'Recovery page',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/recovery-confirm', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('recovery-confirm', {
    // вказуємо назву контейнера
    name: 'recovery-confirm',
    // вказуємо назву компонентів
    component: ['back-button', 'field', 'heading', 'field-password'],

    // вказуємо назву сторінки
    title: 'Recovery confirm page',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.post('/recovery-confirm', function (req, res) {
  const { password, code } = req.body

  console.log(password, code);

  // перевіримо чи є у нас всі двні
  if (!code || !password) {
    return res.status(400).json({
      message: 'Помилка. Обовязкові поля відсутні',
    })
  }

  try {
    // перевірка кода і пароля

    // отримаємо email
    // email це наш обьект data
    const email = Confirm.getData(Number(code))

    if (!email) {
      return res.status(400).json({
        message: 'Невірний код',
      })
    }

    // шукаєм користувача по email
    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        // таких випадків буде дуже рідко адже якщо ми могли створити код (перейти на цю сторінку) значить користувач існує. Але може різне трапитися і на бекенді потрібно всі нюанси подумати та ризики щоб не було проблем....
        message: 'Користувача з таким email не знайдено',
      })
    }

    // змінюємо пароль
    // але пароль в чистому виді не зберігається на бекенді, він проходить конвертацію щоб не було зрозуміло який пароль користувача....(але поки залишаємо так)...
    user.password = password

    console.log(user);

    const session = Session.create(user)

    return res.status(200).json({
      message: 'Пароль успішно змінено',
      session,
    })

  } catch (e) {
    return res.status(400).json({
      message: e.message,
    })
  }
})

//===================================

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/signup-confirm', function (req, res) {
  // res.render генерує нам HTML сторінку
  const { renew, email } = req.query

  if (renew) {
    Confirm.create(email)
  }


  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('signup-confirm', {
    // вказуємо назву контейнера
    name: 'signup-confirm',
    // вказуємо назву компонентів
    component: ['back-button', 'field', 'heading'],

    // вказуємо назву сторінки
    title: 'Signup confirm page',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})

// ====================

router.post('/signup-confirm', function (req, res) {
  // дістанемо потрібні дані та перевіримо їх на наявність

  const { code, token } = req.body

  if (!code || !token) {
    return res.status(400).json({
      message: 'Помилка. Обовязкові поля відсутні',
    })
  }

  try {
    // логіка підтвердження

    // отримуємо обьекст session
    const session = Session.get(token)

    if (!session) {
      return res.status(400).json({
        message: 'Помилка. Ви не увійшли в акаунт',
      })
    }

    // передаємо наш код який потрібно ввести на сторінці /signup-confirm (він генерується на етапі пеєстрації)
    const email = Confirm.getData(code)

    if (!email) {
      return res.status(400).json({
        message: 'Код не існує',
      })
    }

    if (email !== session.user.email) {
      return res.status(400).json({
        message: 'Код не дійсний',
      })
    }

    session.user.isConfirm = true

      // і повертаємо щоб зберегти дані на фронтенд частині
    return res.status(200).json({
      message: 'Ви підтвердили свою пошту',
      session,
    })

  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }

  console.log(code, token);
})

//===================================

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/login', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('login', {
    // вказуємо назву контейнера
    name: 'login',
    // вказуємо назву компонентів
    component: ['back-button', 'field', 'field-password', 'heading'],

    // вказуємо назву сторінки
    title: 'Login page',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})

// ==========================

// ↙️ тут вводимо шлях (PATH) до сторінки
router.post('/login', function (req, res) {
  // res.render генерує нам HTML сторінку
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      message: 'Помилка. Обовязкові поля відсутні',
    })
  }

  try {
    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message: 'Користувача з таким email не знайдено',
      })
    }

    if (user.password !== password) {
      return res.status(400).json({
        message: 'Невірний пароль',
      })
    }

    const session = Session.create(user)

    return res.status(200).json({
      message: 'Ви увійшли в акаунт',
      session,
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

// Підключаємо роутер до бек-енду
module.exports = router
