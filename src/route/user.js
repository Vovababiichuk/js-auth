// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// імпортували класс User
const { User } = require('../class/user')

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/user-list', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('user-list', {
    // вказуємо назву контейнера
    name: 'user-list',
    // вказуємо назву компонентів
    component: ['back-button', 'heading'],

    // вказуємо назву сторінки
    title: 'User list page',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

// даний ендпоїнт буде повертати нам дані які ми будемо завантажувати в контейнері user-list
// по цьому ендпоїнту ми будемо отримувати список наших користувачів
router.get('/user-list-data', function (req, res) {
  const list = User.getList()

  // якщо у нас пустий масив то повертаємо помилку
  if (list.length === 0) {
    return res.status(400).json({
      message: 'Список користувачів пустий',
    })
  }

  return res.status(200).json({
    list: list.map(({ id, email, role }) => ({
      id,
      email,
      role,
    })),
  })
})

// ================================================================

// =========================ендпоїнт який повертає контейнер=========================================

router.get('/user-item', function (req, res) {
  return res.render('user-item', {
    name: 'user-item',
    component: ['back-button', 'heading'],
    title: 'User item page',
    data: {},
  })
})

// ==========================ендпоїнт який повертає дані======================================

router.get('/user-item-data', function (req, res) {
  const { id } = req.query

  if (!id) {
    return res.status(400).json({
      message: 'Потрібно передати ID користувача',
    })
  }

  const user = User.getById(Number(id))

  if (!user) {
    return res.status(400).json({
      message: 'Користувача з таким ID не знайдено',
    })
  }

  return res.status(200).json({
    // передаємо ті дані які нам потрібно
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      isConfirm: user.isConfirm,
    }
  })
})

// Підключаємо роутер до бек-енду
module.exports = router
