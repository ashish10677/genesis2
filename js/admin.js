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

    function showNavBar() {
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
                firebase.database().ref().child('events/tech').once('value', function (snapshot) {
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
            } else {
                console.log('Not Signed In');
                window.location = 'index.html';
            }
        });
    }

    function data(dataKey) {
        console.log(dataKey);
        firebase.database().ref('/events/tech/' + dataKey).once('value').then(function (snapshot) {
            document.getElementById('modalEvent').innerHTML = snapshot.val().name;
            document.getElementById('modalDate').innerHTML = snapshot.val().date;
            console.log(document.getElementById('date'));
            document.getElementById('modalDesc').innerHTML = snapshot.val().desc;
        });
    }

    function logout() {
        firebase.auth().signOut();
        window.location = 'index.html';
    }

    function readIndex() {
        var database = firebase.database();
        database.ref('events').child('tech').once('value', snap => {
            if (snap.val() == null) {
                writeUserData(1);
            } else {
                database.ref('events/tech').limitToLast(1).once('value', function (snapshot) {
                    snapshot.forEach(function (childSnapshot) {
                        var childKey = childSnapshot.key;
                        writeUserData(parseInt(childKey) + 1);
                    });
                });
            }
        });
    }

    function writeUserData(key) {
        nm = document.getElementById('name').value;
        dt = document.getElementById('date').value;
        desc = document.getElementById('desc').value;
        firebase.database().ref('events/tech/' + key).set({
            date: dt,
            desc: desc,
            name: nm
        });
        alert("Event added successfully");
        console.log(document.getElementById('name'));
        document.getElementById('name').value = null;
        document.getElementById('date').value = null;
        document.getElementById('desc').value = null;
    }
    window.onload = showNavBar();