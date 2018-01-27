    function showData() {
      var i = 1;
      firebase.database().ref().child('events/tech').limitToLast(3).once('value', function (snapshot) {
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
    }

    function data(dataKey) {
      console.log(dataKey);
      firebase.database().ref('/events/tech/' + dataKey).once('value').then(function (snapshot) {
        document.getElementById('event').innerHTML = snapshot.val().name;
        document.getElementById('date').innerHTML = snapshot.val().date;
        document.getElementById('desc').innerHTML = snapshot.val().desc;
      });
    }
    window.onload = showData();