// === НАСТРОЙКА ===
const API_URL = "http://de1.the-ae.ovh:25697";

// Проверка авторизации при загрузке
if (localStorage.getItem("token")) {
    location.href = "profile.html";
}

const form = document.getElementById("registerForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (username.length < 3) {
        alert("Логин должен быть минимум 3 символа");
        return;
    }

    // Проверка: логин не должен состоять только из цифр
    if (/^\d+$/.test(username)) {
        alert("Логин не может состоять только из цифр");
        return;
    }

    // Проверка: логин не должен содержать символы (только буквы и цифры)
    if (/[^a-zA-Z0-9]/.test(username)) {
        alert("Логин может содержать только буквы и цифры");
        return;
    }

    if (password.length < 8) {
        alert("Пароль должен быть минимум 8 символов");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Ошибка регистрации");
            return;
        }

        alert("Регистрация успешна! Теперь войдите.");
        window.location.href = "login.html";

    } catch (err) {
        console.error(err);
        alert("Ошибка соединения с сервером");
    }
});
