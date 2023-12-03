
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
                    "email": email
                }
            }).then(() => {
                window.location.reload(true)
            });
            new_detail = { detail: [] };

        });
    
