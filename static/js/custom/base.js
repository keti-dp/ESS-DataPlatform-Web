
let token = Cookies.get('access_token');
let decoded = jwt_decode(token);

if (decoded['name']) {
    let headerElement = document.querySelector('header');
    let userNameElement = headerElement.querySelector('.user-name');
    userNameElement.textContent = decoded['name'];
}