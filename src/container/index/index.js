import '../../script/test'
class CustomNavigation {
   static goTo(url) {
     window.location.href = url;
   }
 }

 window.customNavigation = CustomNavigation;
