// зараз при реєстрації ми отримуєм обьект сесії, нам потрібно його зберегти та при відкритті сторінки його отимувати. Ми будемо використовувати локальне сховище...

// константа по якій ми можемо звертатися до localStorage
export const SESSION_KEY = 'sessionAuth'

export const saveSession = (session) => {
try {
   window.session = session
   localStorage.setItem(SESSION_KEY, JSON.stringify(session))
} catch (err) {
  console.log(err)
  window.session = null
}
}

// підгружаєм сесію в наше оточення в браузері
export const loadSession = () => {
  try {
    const session = JSON.parse(
      localStorage.getItem(SESSION_KEY),
    )

    if (session) {
      window.session = session
    } else {
      window.session = null
    }
  } catch (e) {
    console.log(err)
    window.session = null
  }
}

export const getTokenSession = () => {
   try {
     const session = getSession()

     return session ? session.token : null
    } catch (e) {
      console.log(err)
      return null
    }
}

export const getSession = () => {
  try {
    const session =
    JSON.parse(localStorage.getItem(SESSION_KEY)) || window.session

    return session || null
  } catch (err) {
    console.log(err);
    return null
  }
}
