const url = new URL(window.location.href);
const ls = JSON.parse(localStorage.getItem("role"))
const email = url.searchParams.get("email")
const localImageURL = localStorage.getItem("localImageURL")
const detail = document.querySelector(".details")
const noDisplayImageTemplate = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
const image = document.getElementById('user_img');

let imageState = false;




if (window.location.pathname == '/student') {
    const notification_btn = document.querySelector('.ri-mail-line');
    notification_btn.addEventListener('click', () => {
        window.location.href = "/notifications"
    })
}

if (url.searchParams.get("email") !== ls.email || ls.role !== "Student") {
    document.body.innerHTML = `<p>Not authorized</p>`
}


if (url.pathname !== '/details') {

    detail.addEventListener("click", () => {
        const url = new URL(window.location.protocol + window.location.host + "/details");
        url.searchParams.set("email", ls.email);
        window.location.href = url.href;
    })
    if (localImageURL) {
        image.src = localImageURL;
        imageState = true;
    }
    else {
        image.src = noDisplayImageTemplate
    }
}

if (window.location.pathname == '/details') {
    const localImageURL = localStorage.getItem("localImageURL");
    image.src = localImageURL;
    document.getElementById('upload-form').addEventListener('submit', async function uploadForm(e) {
        e.preventDefault();
        const fileInput = document.getElementById('file-input');
        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append('files', file);
        const res = await fetch('/student', {
            method: 'POST',
            body: formData,
            headers: {
                "email": email,
                "hasLocalImage": imageState
            }

        })
        const imageURL = await res.json();
        localStorage.setItem("localImageURL", imageURL.imageURL);
        image.src = imageURL.imageURL;

    });
    const detail_btn = document.getElementById("edit_details_btn");
    const cancel_btn = document.getElementById("cancel_details_btn");
    const save_btn = document.getElementById("save_details_btn");
    const detail_input = document.querySelectorAll(".detail_input");
    let new_detail = { detail: [] };

    detail_btn.addEventListener("click", async () => {
        detail_input.forEach(input => {
            input.disabled = false;
        })
    })

    cancel_btn.addEventListener("click", async () => {
        detail_input.forEach(input => {
            input.disabled = true;
        })
    })

    save_btn.addEventListener("click", async () => {
        detail_input.forEach(input => {
            new_detail.detail.push(input.value);
        })

        const res = await fetch('/details', {
            method: 'POST',
            body: JSON.stringify(new_detail),
            headers: {
                "Content-Type": "application/json",
                "email": email
            }
        }).then(() => {
            window.location.reload(true)
        });
        new_detail = { detail: [] };

    });
}