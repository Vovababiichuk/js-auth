class SignupForm {
   // буде містити значення наших полей форми
   static value = {}

   static validate = (name, value) => {
      return true
   }

   static submit = () => {
      console.log(this.value)
   }

   static change = (name, value) => {
      console.log(name, value)
      // якщо в нас валідація проходить то значення буде записуватися
      if (this.validate(name, value)) this.value[name] = value
   }
}

window.signupForm = SignupForm