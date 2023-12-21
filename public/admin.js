if (localStorage.getItem('role') !== "Admin") {
    document.body.innerHTML = `<p>Not authorized</p>`
}

const url = "/admin"

let attendance = []
const checkbox = document.querySelectorAll('.is_present')
const submit_btn = document.getElementById('submit-btn');
const save_btn = document.getElementById('save-btn');
const reset_btn = document.getElementById('reset-btn');

for (let i = 0; i < checkbox.length; i++) {
    attendance.push(checkbox[i].checked);
}
if (!window.location.pathname.includes('/admin/details')) {
    submit_btn.addEventListener('click', postData)
    save_btn.addEventListener('click', () => {
        save_btn.disabled = true;
        submit_btn.disabled = false
        for (let i = 0; i < attendance.length; i++) {
            if (checkbox[i].checked === true) {
                attendance[i] = 1
            }
            else
                attendance[i] = 0;
        }
    })

    reset_btn.addEventListener("click", reset_att)
}
function reset_att() {

    for (let i = 0; i < attendance.length; i++) {
        checkbox[i].checked = false;
        save_btn.disabled = false;
        submit_btn.disabled = true
    }
}

async function postData(e) {
    e.preventDefault();
    submit_btn.disabled = true
    await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "auth": "admin"
        },
        body: JSON.stringify(attendance),
    })
    setTimeout(() => {
        submit_btn.disabled = false
        reset_att()
    }, 3000)
}


const detail_btn = document.getElementById("edit_details_btn");
const cancel_btn = document.getElementById("cancel_details_btn");
const save_btn_det = document.getElementById("save_details_btn");
const detail_input = document.querySelectorAll(".detail_input");
let new_detail = { detail: [] };


if (location.pathname.includes('/admin/details')) {
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

    save_btn_det.addEventListener("click", async () => {
        detail_input.forEach(input => {
            new_detail.detail.push(input.value);
        })

        const res = await fetch('/details', {
            method: 'POST',
            body: JSON.stringify(new_detail),
            headers: {
                "Content-Type": "application/json",
                "id": window.location.pathname.split("/")[3]
            }
        }).then(() => {
            window.location.reload(true)
        });
        new_detail = { detail: [] };

    });
}
if (!(location.pathname.includes('/admin/details'))) {
    const file_status = document.getElementById('status')

    document.getElementById('upload-form').addEventListener('submit', async function uploadForm(e) {
        e.preventDefault();
        const fileInput = document.getElementById('doc_file');
        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append('files', file);
        const res = await fetch('/admin', {
            method: 'POST',
            body: formData,
            headers: {
                "resources": "true"
            }
        })
        if (res.status == 200) {
            file_status.innerHTML = "File uploaded successfully"
            setTimeout(() => {
                file_status.innerHTML = ""
            }, 2000)
        }
    })


    document.getElementById('video_link_btn').addEventListener('click', (e) => {
        e.preventDefault()
        const video_link = document.getElementById('video_link').value;
        fetch('/admin', {
            method: 'POST',
            body: JSON.stringify({ video_link: video_link }),
            headers: {
                "Content-Type": "application/json",
                "resources": "video_link"
            }
        }).then(res => {
            if (res.status == 200) {
                window.location.reload(true)
            }
        })
    })

    document.getElementById('see_resource').addEventListener('click', () => {
        window.location.href = "/resources";
    })
}