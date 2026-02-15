// Глобальные переменные для работы со скином
window.skinSettings = {
    head: true,
    body: true,
    leftArm: true,
    rightArm: true,
    leftLeg: true,
    rightLeg: true,
    outerLayer: true
};

window.currentSkinImage = null;

// Функция отрисовки 2D скина
window.drawSkin2D = function(img) {
    const canvas = document.getElementById("skinCanvas");
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    canvas.width = 256;
    canvas.height = 512;
    ctx.imageSmoothingEnabled = false;
    
    const SCALE = 8;
    const CENTER_X = canvas.width / 2;
    const settings = window.skinSettings;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const yHead = 0;
    const yBody = 8 * SCALE;
    const yLegs = (8 + 12) * SCALE;

    function drawPart(sx, sy, sw, sh, dx, dy, visible) {
        if (!visible) return;
        ctx.drawImage(img, sx, sy, sw, sh, dx, dy, sw * SCALE, sh * SCALE);
    }

    // ===== ГОЛОВА =====
    drawPart(8, 8, 8, 8, CENTER_X - 4 * SCALE, yHead, settings.head);

    // ===== ТЕЛО =====
    drawPart(20, 20, 8, 12, CENTER_X - 4 * SCALE, yBody, settings.body);

    // ===== ЛЕВАЯ РУКА =====
    drawPart(44, 20, 4, 12, CENTER_X - 8 * SCALE, yBody, settings.leftArm);

    // ===== ПРАВАЯ РУКА =====
    drawPart(36, 52, 4, 12, CENTER_X + 4 * SCALE, yBody, settings.rightArm);

    // ===== ЛЕВАЯ НОГА =====
    drawPart(4, 20, 4, 12, CENTER_X - 4 * SCALE, yLegs, settings.leftLeg);

    // ===== ПРАВАЯ НОГА =====
    drawPart(20, 52, 4, 12, CENTER_X, yLegs, settings.rightLeg);

    // ===== ВНЕШНИЙ СЛОЙ =====

    // голова (шлем/волосы)
    drawPart(40, 8, 8, 8, CENTER_X - 4 * SCALE, yHead, settings.head && settings.outerLayer);

    // тело (куртка)
    drawPart(20, 36, 8, 12, CENTER_X - 4 * SCALE, yBody, settings.body && settings.outerLayer);

    // левая рука (рукав)
    drawPart(48, 52, 4, 12, CENTER_X - 8 * SCALE, yBody, settings.leftArm && settings.outerLayer);

    // правая рука (рукав)
    drawPart(40, 52, 4, 12, CENTER_X + 4 * SCALE, yBody, settings.rightArm && settings.outerLayer);

    // левая нога (штанина)
    drawPart(4, 36, 4, 12, CENTER_X - 4 * SCALE, yLegs, settings.leftLeg && settings.outerLayer);

    // правая нога (штанина)
    drawPart(4, 52, 4, 12, CENTER_X, yLegs, settings.rightLeg && settings.outerLayer);
};

// Функция переключения видимости части
window.togglePart = function(part) {
    window.skinSettings[part] = !window.skinSettings[part];
    const img = window.currentSkinImage;
    if (img) window.drawSkin2D(img);
    window.updateButtons();
};

// Функция показать/скрыть всё
window.setAllParts = function(visible) {
    Object.keys(window.skinSettings).forEach(key => {
        window.skinSettings[key] = visible;
    });
    const img = window.currentSkinImage;
    if (img) window.drawSkin2D(img);
    window.updateButtons();
};

// Обновление состояния кнопок
window.updateButtons = function() {
    document.querySelectorAll('.skin-toggle-btn').forEach(btn => {
        const part = btn.dataset.part;
        btn.classList.toggle('active', window.skinSettings[part]);
    });
};

// Инициализация при загрузке DOM
document.addEventListener("DOMContentLoaded", function() {
    const input = document.getElementById("skinInput");
    if (!input) return;

    input.addEventListener("change", function() {
        const file = input.files[0];
        if (!file) return;

        // Проверка формата файла
        if (file.type !== "image/png") {
            showSkinError("Файл должен быть в формате PNG. Minecraft скины поддерживают только формат PNG.");
            return;
        }

        const reader = new FileReader();
        reader.onload = function() {
            const img = new Image();
            img.onload = function() {
                const width = img.width;
                const height = img.height;

                // Проверка допустимых размеров
                // Допустимые размеры: 64x64 ( classique / slim), 256x512, 128x256
                const validSizes = [
                    { w: 64, h: 64 },
                    { w: 256, h: 512 },
                    { w: 128, h: 256 }
                ];

                const isValidSize = validSizes.some(s => s.w === width && s.h === height);

                if (!isValidSize) {
                    showSkinError(
                        `Недопустимые размеры изображения: ${width}x${height} пикселей.\n\n` +
                        `Допустимые размеры скинов:\n` +
                        `- 64x64 пикселей (с классическая/ slim модель)\n` +
                        `- 128x256 пикселей (стандартный скин)\n` +
                        `- 256x512 пикселей (HD скин)\n\n` +
                        `Пожалуйста, загрузите скин в одном из этих форматов.`
                    );
                    return;
                }

                // Если изображение 64x64 - используем как есть
                // Если 128x256 или 256x512 - масштабируем до 64x64 для отображения
                if (width === 128 || width === 256) {
                    const tempCanvas = document.createElement('canvas');
                    tempCanvas.width = 64;
                    tempCanvas.height = 64;
                    const tempCtx = tempCanvas.getContext('2d');
                    tempCtx.imageSmoothingEnabled = false;
                    tempCtx.drawImage(img, 0, 0, 64, 64);

                    const scaledImg = new Image();
                    scaledImg.onload = function() {
                        window.currentSkinImage = scaledImg;
                        window.drawSkin2D(scaledImg);
                        window.updateButtons();
                    };
                    scaledImg.src = tempCanvas.toDataURL('image/png');
                } else {
                    window.currentSkinImage = img;
                    window.drawSkin2D(img);
                    window.updateButtons();
                }
            };
            img.onerror = function() {
                showSkinError("Не удалось загрузить изображение. Файл может быть повреждён или иметь неподдерживаемый формат.");
            };
            img.src = reader.result;
        };
        reader.onerror = function() {
            showSkinError("Не удалось прочитать файл. Попробуйте загрузить скин снова.");
        };
        reader.readAsDataURL(file);
    });
});

// Функция показа понятного сообщения об ошибке
function showSkinError(message) {
    const modal = document.getElementById('skinErrorModal') || createErrorModal();
    const messageEl = modal.querySelector('.error-message');
    if (messageEl) {
        messageEl.innerHTML = message.replace(/\n/g, '<br>');
    }
    modal.style.display = 'flex';
}

// Создание модального окна ошибки, если его нет
function createErrorModal() {
    const modal = document.createElement('div');
    modal.id = 'skinErrorModal';
    modal.className = 'modal';
    modal.style.display = 'none';
    modal.innerHTML = `
        <div class="modal-content error-modal-content">
            <button class="modal-close" onclick="this.parentElement.parentElement.style.display='none'">&times;</button>
            <h2 class="modal-title">Ошибка загрузки скина</h2>
            <p class="error-message"></p>
            <button class="security-btn" onclick="document.getElementById('skinErrorModal').style.display='none'">Понятно</button>
        </div>
    `;
    document.body.appendChild(modal);

    // Закрытие по клику вне модального окна
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    return modal;
}
