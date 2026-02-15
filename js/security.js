document.addEventListener("DOMContentLoaded", () => {

    const API_URL = "http://de1.the-ae.ovh:25697";
    const token = localStorage.getItem("token");
    if (!token) return;

    const openBtn = document.getElementById("openSecurityModal");
    const modal = document.getElementById("securityModal");

    // если НЕТ модалки — ВЫХОДИМ СРАЗУ (ключевой фикс)
    if (!modal) return;

    const closeBtn = document.getElementById("closeSecurityModal");
    const changePasswordBtn = document.getElementById("changePasswordBtn");
    const oldPasswordInput = document.getElementById("oldPassword");
    const newPasswordInput = document.getElementById("newPassword");

    // ===== ОТКРЫТИЕ =====
    if (openBtn) {
        openBtn.addEventListener("click", e => {
            e.preventDefault();
            modal.classList.add("active");
        });
    }

    // ===== ЗАКРЫТИЕ ПО КРЕСТИКУ =====
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            modal.classList.remove("active");
        });
    }

    // ===== ЗАКРЫТИЕ ПО ФОНУ =====
    modal.addEventListener("click", e => {
        if (e.target === modal) {
            modal.classList.remove("active");
        }
    });

    // ===== СМЕНА ПАРОЛЯ =====
    if (changePasswordBtn && oldPasswordInput && newPasswordInput) {
        changePasswordBtn.addEventListener("click", () => {
            const oldPassword = oldPasswordInput.value.trim();
            const newPassword = newPasswordInput.value.trim();

            if (!oldPassword || !newPassword) return;

            fetch(`${API_URL}/api/security/password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({ oldPassword, newPassword })
            })
            .then(r => r.json())
            .then(() => {
                oldPasswordInput.value = "";
                newPasswordInput.value = "";
            })
            .catch(() => {});
        });
    }

});
