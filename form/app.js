// Initialize Firebase(2)
var config = {
  apiKey: ' AIzaSyDkg-3xdq5hR_mR-dxE1Rglez2lyMdEg3k',
  authDomain: 'YOUR-hacknroll-resume.firebaseapp.com',
  databaseURL: 'https://hacknroll-resume.firebaseio.com',
  projectId: 'hacknroll-resume',
  storageBucket: 'hacknroll-resume.appspot.com',
  messagingSenderId: '683649340894'
};
firebase.initializeApp(config);

//Reference for form collection(3)
let formMessage = firebase.database().ref('register');

//listen for submit event//(1)
document
  .getElementById('registrationform')
  .addEventListener('submit', formSubmit);

//Submit form(1.2)
function formSubmit(e) {
  e.preventDefault();
  // Get Values from the DOM
  let name = document.querySelector('#name').value;
  let contact = document.querySelector('#contact').value;
  let email = document.querySelector('#email').value;
  let linkedin = document.querySelector('#linkedin').value;
  let bio = document.querySelector('#bio').value;
  let school = document.querySelector('#school').value;
  let period = document.querySelector('#period').value;
  let pg_name = document.querySelector('#pg_name').value;
  let company_name = document.querySelector('#company_name').value;
  let exp_period = document.querySelector('#exp_period').value;
  let exp_Description = document.querySelector('#exp_Description').value;
  let cca_Description = document.querySelector('#cca_Description').value;
  let skills_Description = document.querySelector('#skills_Description').value;

  //send message values
  sendMessage(name, contact, email, linkedin, bio, school, period, pg_name, company_name, exp_period, exp_Description, cca_Description, skills_Description);

  //Show Alert Message(5)
  document.querySelector('.alert').style.display = 'block';

  //Hide Alert Message After Seven Seconds(6)
  setTimeout(function() {
    document.querySelector('.alert').style.display = 'none';
  }, 7000);

  //Form Reset After Submission(7)
  document.getElementById('registrationform').reset();
}

//Redirecting to another page
function redirect() {
  location.href = "./template.html"
}

//Send Message to Firebase(4)

function sendMessage(name, contact, email, linkedin, bio, school, period, pg_name, company_name, exp_period, exp_Description, cca_Description, skills_Description) {
  
  let newFormMessage = formMessage.push();
  newFormMessage.set({
    name: name,
    contact: contact,
    email: email,
    linkedin: linkedin,
    bio: bio,
    school: school,
    period: period,
    pg_name: pg_name,
    company_name: company_name,
    exp_period: exp_period,
    exp_Description: exp_Description,
    cca_Description: cca_Description,
    skills_Description: skills_Description
  });
  redirect();
  console.log(name);
}