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
    var wing;
    var i;
    var fileButton = document.getElementById('fileButton');
    var uploader = document.getElementById('uploader');
    fileButton.addEventListener('change', e => {
        if (e.target.files.length > 3) {
            alert('Maximum 3 files allowed');
        } else {
            for (i = 0; i < e.target.files.length; i++) {
                var file = e.target.files[i];
                if (file.size > 5242880) {
                    console.log('Size of ' + file.name + ' is greater than 5 MB, it won\'t be uploaded.');
                    fileButton.value = null;
                } else {
                    var storageRef = firebase.storage().ref(wing + '/' + document.getElementById('name').value + '/image' + i);
                    var task = storageRef.put(file);

                }
            }
            task.on('state_changed',
                function progress(snapshot) {
                    var percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    uploader.value = percent;
                },

                function error(err) {
                    console.log(err);
                },

                function complete() {
                    console.log('Images Uploaded');
                    fileButton.value = null;
                }

            );
        }

    });

    function showNavBar() {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                // User is signed in.
                var displayName = user.displayName;
                var email = user.email;
                var uid = user.uid;
                if (email == "ashish10677@gmail.com") {
                    displayName = "Ashish";
                    document.getElementById('managerName').innerHTML = displayName;
                    wing = "tech";
                } else if (email == "harshkhetrapal@gmail.com") {
                    displayName = "Harsh";
                    document.getElementById('managerName').innerHTML = displayName;
                    wing = "sports";
                }
                firebase.database().ref().child('events/' + wing).once('value', function (snapshot) {
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
        btnDelete.setAttribute('onclick', 'deleteData(' + dataKey + ')');
        firebase.database().ref('/events/' + wing + '/' + dataKey).once('value').then(function (snapshot) {
            document.getElementById('modalEvent').innerHTML = snapshot.val().name;
            document.getElementById('modalDate').innerHTML = snapshot.val().date;
            document.getElementById('modalDesc').innerHTML = snapshot.val().desc;
            firebase.storage().ref(wing).child(snapshot.val().name + '/image0').getDownloadURL().then(function (url) {
                console.log(url);
                document.getElementById('carImage0').src = url;
            });
            firebase.storage().ref(wing).child(snapshot.val().name + '/image1').getDownloadURL().then(function (url) {
                console.log(url);
                document.getElementById('carImage1').src = url;
            });
            firebase.storage().ref(wing).child(snapshot.val().name + '/image2').getDownloadURL().then(function (url) {
                console.log(url);
                document.getElementById('carImage2').src = url;
            });
        });
    }

    function logout() {
        firebase.auth().signOut();
        window.location = 'index.html';
    }

    function readIndex() {
        var database = firebase.database();
        database.ref('events').child(wing).once('value', snap => {
            if (snap.val() == null) {
                writeUserData(1);
            } else {
                database.ref('events/' + wing).limitToLast(1).once('value', function (snapshot) {
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
        firebase.database().ref('events/' + wing + '/' + key).set({
            date: dt,
            desc: desc,
            name: nm
        });
        alert("Event added successfully");
        document.getElementById('name').value = null;
        document.getElementById('fileButton').value = null;
        document.getElementById('date').value = null;
        document.getElementById('desc').value = null;
        location.reload();
    }

    function deleteData(key) {
        var database = firebase.database();
        database.ref('events/' + wing + '/').child(key).remove();
        location.reload();
    }
    window.onload = showNavBar();