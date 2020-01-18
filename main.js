var app = new Vue({
    el: "#app",
    data: {
      problems: [1, 2, 3, 4],
      currentProblem: 2,
      directions: {
        1: "Use the 😂 emoji in place of the word crying.",
        2: "Use the 😭 emoji in place of the word sad.",
        3: "Use the 😍 emoji in place of the word love.",
        4: "Use the 🙏 emoji to replace the word hopefully."
      },
      givens: {
        1: "I am crying laughing.",
        2: "I am so sad.",
        3: "I love cookies.",
        4: "Hopefully"
      },
      solutions: {
        1: "I am 😂 laughing.",
        2: "I am so 😭.",
        3: "I 😍 cookies.",
        4: "🙏"
      }
    },
    methods: {
      isComplete: function(problem) {
        return this.givens[problem] === this.solutions[problem];
      }
    }
  });

  function formSubmit() {
    let feedbackForm = document.getElementById('feedbackForm')
    saveFormFirebase(feedbackForm);
    feedbackForm.reset();
  }

  function saveFormFirebase(feedbackForm) {
    let feedbackRefs = firebase.database().ref('feedbacks');
    let feedbackRef = feedbackRefs.push();
    feedbackRef.update({
      name: feedbackForm.name.value,
      email: feedbackForm.email.value,
      time: new Date().toUTCString()
    });
    return feedbackRef
  }

  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyDkg-3xdq5hR_mR-dxE1Rglez2lyMdEg3k",
    authDomain: "hacknroll-resume.firebaseapp.com",
    databaseURL: "https://hacknroll-resume.firebaseio.com",
    projectId: "hacknroll-resume",
    storageBucket: "hacknroll-resume.appspot.com",
    messagingSenderId: "683649340894",
    appId: "1:683649340894:web:e2ad6d4c2e5b733970794f"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  