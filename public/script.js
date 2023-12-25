const url = "/";
document.getElementById("login-toggle").addEventListener("click", function () {
    document.getElementById("login-form").style.display = "flex";
    document.getElementById("signup-form").style.display = "none";
    this.classList.add("active");
    document.getElementById("signup-toggle").classList.remove("active");
});

document.getElementById("signup-toggle").addEventListener("click", function () {
    document.getElementById("signup-form").style.display = "flex";
    document.getElementById("login-form").style.display = "none";
    this.classList.add("active");
    document.getElementById("login-toggle").classList.remove("active");
});


document.getElementById("signup-submit").addEventListener("click", function (e) {
    e.preventDefault()
    const data = {
        role: document.getElementById("user_type").value,
        name: document.getElementById("signup-username").value,
        email: document.getElementById("signup-email").value,
        password: document.getElementById("signup-password").value,
    };
    postData(url, data)

})

document.getElementById("login-submit").addEventListener("click", function (e) {
    e.preventDefault()
    const data = {
        auth: "login",
        role: document.getElementById("user_type_login").value,
        email: document.getElementById("login-email").value,
        password: document.getElementById("login-password").value,
    };
    authData(url, data)

})


async function postData(url, data) {
    // Default options are marked with *
    await fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    }).then((res) => {
        if (res.status === 201) {
            const auth = {
                "role": data.role,
                "email": data.email
            }
            localStorage.setItem("email", JSON.stringify(auth));
            const url = new URL(window.location.protocol + window.location.host + "/student");
            url.searchParams.set("email", decodeURIComponent(data.email));
            window.location.href = url;
        }
        else if (res.status === 203) {
            window.location.href = "/admin";
            localStorage.setItem("role", data.role);

        }

        else if (res.status === 400) {
            document.getElementById('error-signup').innerHTML = 'User already exists'
            setTimeout(() => {
                document.getElementById('error-signup').innerHTML = '';
            }, 4000);
        }
    })

    return  // parses JSON response into native JavaScript objects
}

async function authData(url, data) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    }).then((res) => {
        if (res.status === 201) {
            let ls = {
                "role": data.role,
                "email": data.email

            }
            localStorage.setItem("role", JSON.stringify(ls));
            const url = new URL(window.location.protocol + window.location.host + "/student");
            url.searchParams.set("email", data.email);
            window.location.href = url

        }
        else if (res.status === 202) {
            window.location.href = "/admin";
            localStorage.setItem("role", data.role);

        }

        else if (res.status === 405) {
            document.getElementById('error').innerHTML = 'Wrong email or password'
            document.getElementById('login-password').addEventListener('input', () => {
                document.getElementById('error').innerHTML = '';
            })
        }
    })
    // parses JSON response into native JavaScript objects
}
