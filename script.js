const leadForm = document.querySelector(".lead-form");

if (leadForm) {
  const statusNode = leadForm.querySelector(".form-status");

  leadForm.addEventListener("submit", (event) => {
    event.preventDefault();

    statusNode.textContent = "";
    statusNode.className = "form-status";

    const formData = new FormData(leadForm);
    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const consent = formData.get("consent");

    const phoneRegex = /^\+?[0-9\s\-()]{10,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name.length < 2) {
      statusNode.textContent = "Введите корректное имя (минимум 2 символа).";
      statusNode.classList.add("form-status--error");
      return;
    }

    if (!phoneRegex.test(phone)) {
      statusNode.textContent = "Введите корректный номер телефона.";
      statusNode.classList.add("form-status--error");
      return;
    }

    if (!emailRegex.test(email)) {
      statusNode.textContent = "Введите корректный email.";
      statusNode.classList.add("form-status--error");
      return;
    }

    if (!consent) {
      statusNode.textContent = "Подтвердите согласие на обработку данных.";
      statusNode.classList.add("form-status--error");
      return;
    }

    statusNode.textContent = "Спасибо! Заявка отправлена. Мы свяжемся с вами в ближайшее время.";
    statusNode.classList.add("form-status--success");
    leadForm.reset();
  });
}
