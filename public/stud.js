const url = new URL(window.location.href);
const ls = JSON.parse(localStorage.getItem("role"))
const email = url.searchParams.get("email")
const localImageURL = localStorage.getItem("localImageURL")
const detail = document.getElementById("details")
const image = document.getElementById('user_img');
let imageState = false;

if (url.searchParams.get("email") !== ls.email || ls.role !== "Student") {
    document.body.innerHTML = `<p>Not authorized</p>`
}

if (localImageURL) {
    image.src = localImageURL;
    imageState = true;
}

if (url.pathname !== '/details') {

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
    detail.addEventListener("click", () => {
        const url = new URL("http://localhost:4500/details");
        url.searchParams.set("email", ls.email);
        window.location.href = url.href;
    })
}

if(window.location.pathname=='/details'){
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