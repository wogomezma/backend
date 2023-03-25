const source = document.getElementById("login-template").innerHTML;
const template = Handlebars.compile(source);

const context = {
	title: "Login",
};

const html = template(context);
document.getElementById("app").innerHTML = html;
