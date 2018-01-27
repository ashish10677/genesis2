    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyB2SNc-dwmQZ5awdTzDgtK71VPwMAclDzk",
      authDomain: "ashish10677-ce652.firebaseapp.com",
      databaseURL: "https://ashish10677-ce652.firebaseio.com",
      projectId: "ashish10677-ce652",
      storageBucket: "ashish10677-ce652.appspot.com",
      messagingSenderId: "1059927379248"
    };
    firebase.initializeApp(config);

    function signIn() {
      var email = document.getElementById('eid').value;
      var password = document.getElementById('pwd').value;
      if (email.length < 4) {
        alert('Please enter an email address.');
        return;
      }
      if (password.length < 4) {
        alert('Please enter a password.');
        return;
      }
      // Sign in with email and pass.
      // [START authwithemail]
      firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode === 'auth/wrong-password') {
          alert('Wrong password.');
        } else {
          alert(errorMessage);
        }
        console.log(error);
      });
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          // User is signed in.
          var displayName = user.displayName;
          var email = user.email;
          var emailVerified = user.emailVerified;
          var photoURL = user.photoURL;
          var isAnonymous = user.isAnonymous;
          var uid = user.uid;
          var providerData = user.providerData;
          window.location = 'admin.html';
        } else {
          console.log('Not Signed In');
        }
      });
    }

    function showData() {
      var i = 1;
      firebase.database().ref().child('events/soc').limitToLast(3).once('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          var eventName = document.createElement('h1');
          var eventDate = document.createElement('h3');
          var eventDesc = document.createElement('p');
          var childData = childSnapshot.val();
          eventName.setAttribute('class', 'eventname');
          eventDate.innerHTML = childData.date;
          eventName.innerHTML = childData.name;
          eventDesc.innerHTML = childData.desc;

          var contentElement = document.getElementById('content' + i);
          contentElement.appendChild(eventName);
          contentElement.appendChild(eventDate);
          contentElement.appendChild(eventDesc);
          i++;

        });
      });
      showNavBar();
    }

    function showNavBar() {
      var i = 1;
      firebase.database().ref().child('events/soc').once('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {

          var eventName = document.createElement('li');
          var eventLink = document.createElement('a');
          var childData = childSnapshot.val();
          var childKey = childSnapshot.key;
          var unOrderedList = document.getElementById('sideNavBar');
          eventName.setAttribute('class', 'sidebarli');
          eventLink.setAttribute('href', "");
          eventLink.setAttribute('class', 'nav-link');
          eventLink.setAttribute('onclick', 'data(' + childKey + ')');
          eventLink.setAttribute('data-toggle', 'modal');
          eventLink.setAttribute('data-target', '#eventModal');
          eventLink.innerHTML = childData.name;
          eventName.appendChild(eventLink);
          unOrderedList.appendChild(eventName);

        });
      });
    }

    function data(dataKey) {
      console.log(dataKey);
      firebase.database().ref('/events/soc/' + dataKey).once('value').then(function (snapshot) {
        document.getElementById('event').innerHTML = snapshot.val().name;
        document.getElementById('date').innerHTML = snapshot.val().date;
        document.getElementById('desc').innerHTML = snapshot.val().desc;
      })
    }
    window.onload = showData();