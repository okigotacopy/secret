const API_URL = "http://de1.the-ae.ovh:25697";

// Проверка авторизации при загрузке
if (localStorage.getItem("token")) {
    location.href = "profile.html";
}

document.querySelector("form").addEventListener("submit", e => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
        if (!data.token) {
            alert(data.message || "Ошибка входа");
            return;
        }

        // 🔑 ВОТ ГЛАВНОЕ
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", username);

        // переход в профиль
        location.href = "profile.html";
    })
    .catch(err => {
        console.error(err);
        alert("Ошибка соединения с сервером");
    });
});
