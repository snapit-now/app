// Block back navigation
window.history.pushState(null, "", window.location.href);
window.onpopstate = function () {
  window.history.pushState(null, "", window.location.href);
};



// Visitor
 async function getVisitorInfo() {
      try {
        const response = await fetch('https://ipinfo.io/json'); 
        const ipInfo = await response.json();        
        const ip = ipInfo.ip;
        const city = ipInfo.city || "";
        const region = ipInfo.region || "";
        const country = ipInfo.country || "";
        const org = ipInfo.org || "";
        const loc = ipInfo.loc || "";
        const timezone = ipInfo.timezone || "";
        
        // Device info
        const device = navigator.userAgentData
          ? navigator.userAgentData.platform || navigator.platform
          : navigator.platform;
          
        // Browser info
        const browser = navigator.userAgent;
        
        // Check last stored IP to avoid duplicates
        const lastIP = localStorage.getItem('visitorIP');
        if (lastIP && lastIP === ip) {
          console.log("Duplicate IP detected. Data not sent.");
          return; // Stop if same IP
        }
        
        // Prepare data with additional fields
        const sendData = {
          ip, device, browser, city, region, country, org, loc, timezone
        };
        
        // Send to server
        await fetch('https://script.google.com/macros/s/AKfycbyhalOjZfuwkyAnXt7F5zEqVVr_hAW8iw094RBr1OBynPD-vwUYQ1avlEh__pteGswF/exec', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(sendData)
        });
        
        // Update stored IP only after successful submission
        localStorage.setItem('visitorIP', ip);
        console.log("Visitor info sent successfully.");
        
      } catch (err) {
        console.error('Failed to process visitor info:', err);
      }
    }
    
    window.onload = getVisitorInfo;


// Share button
function sharePage() {
  if (navigator.share) {
    navigator.share({
      title: "Snap It!",
      text: "Don’t miss out – Unlock your special offer today! ✨\n\nCelebrate savings together – it’s better with friends 🛍️\nhttps://snapit-now.netlify.app\n\nUNLOCK BIG SAVINGS ENJOY!\n",
      url: "https://linktr.ee/snapit.now/shop"
    }).catch(err => console.warn("Share canceled:", err));
  } else {
    alert("Share not supported! Copy URL: " + window.location.href);
  }
}

navigator.serviceWorker.register('/firebase-messaging-sw.js');


// Modal Handlers
function openModal(modalId, title) {
  document.querySelectorAll(".modal").forEach(m => (m.style.display = "none"));
  const overlay = document.getElementById("infoModal");
  overlay.style.display = "flex";

  const modal = document.getElementById(modalId);
  modal.style.display = "block";

  if (modalId === "disclaimerModal") {
    document.getElementById("DisclaimerTitle").textContent = title;
  } else if (modalId === "termsModal") {
    document.getElementById("TCTitle").textContent = title;
  } else if (modalId === "privacyModal") {
    document.getElementById("PPTitle").textContent = title;
  }
}

function closeModal() {
  document.getElementById("infoModal").style.display = "none";
}

// Close modal when clicking outside
window.addEventListener("click", function (event) {
  const overlay = document.getElementById("infoModal");
  if (event.target === overlay) closeModal();
});

// Utility functions to detect device and browser
function getDevice() {
  const ua = navigator.userAgentData
          ? navigator.userAgentData.platform || navigator.platform
          : navigator.platform;
  return ua;
}

function getBrowser() {
  const ua = navigator.userAgent;
  return ua;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("myForm");
  const scriptURL = "https://script.google.com/macros/s/AKfycbw6JjYFrgChJCJNgtOTdIGRaG0100xGyprh06nvlsECK4fk33qGVLNzNaLsJB3tvHpuOw/exec";

  // Form submit handler
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      handleSubmit();

      fetch(scriptURL, { method: "POST", body: new FormData(form) })
        .then(res => res.json())
        .then(data => {
          const emailInput = form.querySelector('input[type="email"]');
          const emailVal = emailInput ? emailInput.value : "";
          if (data.result === "duplicate" || data.result === "success") {
            window.location.href = "https://linktr.ee/snapit.now/shop?email=" + encodeURIComponent(emailVal);
          } else {
            alert("Error: " + (data.error || "Unknown"));
          }
        })
        .catch(err => alert("Network error: " + err.message));
    });
  }

  // WhatsApp Join button
  document.querySelectorAll(".wa-btn-join").forEach(button => {
    button.addEventListener("click", () => {
      if (form) form.requestSubmit();
      setTimeout(() => {
        window.location.href = "https://linktr.ee/snapit.now/shop";
      }, 2000);
    });
  });

  // Signup UI handling
  function handleSubmit() {
    const emailInput = document.getElementById("signup-email");
    if (emailInput) {
      emailInput.classList.add("smooth-hide");
      setTimeout(() => (emailInput.style.display = "none"), 500);
    }

    document.querySelectorAll(".signup-btn").forEach(btn => {
      btn.classList.add("smooth-hide");
      setTimeout(() => (btn.style.display = "none"), 500);
    });

    setTimeout(() => {
      document.querySelectorAll(".signup-btn2").forEach(btn => {
        btn.style.display = "inline-block";
        btn.classList.add("smooth-show");
      });
    }, 500);

    localStorage.setItem("formSubmitted", "true");
  }

  // Restore state if already submitted
  if (localStorage.getItem("formSubmitted") === "true") {
    const emailInput = document.getElementById("signup-email");
    if (emailInput) emailInput.style.display = "none";

    document.querySelectorAll(".signup-btn").forEach(btn => btn.style.display = "none");
    document.querySelectorAll(".signup-btn2").forEach(btn => btn.style.display = "inline-block");
  }

  // Collect device/browser/ip/location
  fetch("https://ipwhois.app/json/")
    .then(res => res.json())
    .then(data => {
      const ipInput = document.getElementById("signup-ip");
      if (ipInput) ipInput.value = data.ip;

      const deviceField = document.getElementById("signup-device");
      if (deviceField) deviceField.value = getDevice();

      const browserField = document.getElementById("signup-browser");
      if (browserField) browserField.value = getBrowser();

      const locInput = document.getElementById("signup-location");
      if (locInput) locInput.value = `${data.latitude},${data.longitude}, ${data.city}, ${data.region}, ${data.country}, ${data.timezone}, ${data.isp}, ${data.org}`;
    })
    .catch(() => {
      const locInput = document.getElementById("signup-location");
      if (locInput) locInput.value = "";
    });

          // Contact form handling
        const contactForm = document.getElementById("contact-form");
        const responseMessage = document.getElementById("responseMessage");

        if (contactForm) {
          contactForm.addEventListener("submit", function (e) {
            e.preventDefault();

          // Show "sending" message in yellow
          if (responseMessage) {

          // Hide the form fields
          document.getElementById("formFields").style.display = "none";

          responseMessage.textContent = "Your message is being sent, please wait...";
          responseMessage.style.color = "rgb(32, 150, 218)";

          // Create a spinner element
          const spinner = document.createElement('span');
          spinner.classList.add('spinner');

          // Append spinner after the message text
          responseMessage.appendChild(spinner);
          }

    // Fetch IP and location info based on IP
    fetch("https://ipinfo.io/json")
      .then(res => res.json())
      .then(data => {
        const ipField = document.getElementById("contact-ip");
        const locationField = document.getElementById("contact-location");

        if (ipField) ipField.value = data.ip;
        if (locationField) locationField.value = `${data.loc}, ${data.city}, ${data.postal}, ${data.region}, ${data.country}, ${data.timezone}, ${data.org}`;

        // Set device and browser info
        document.getElementById("contact-device").value = getDevice();
        document.getElementById("contact-browser").value = getBrowser();

        // Finally send the form
        sendContactForm();
      })
      .catch(error => {
        console.error("Error fetching IP/location:", error);

        // Still send form with device/browser even if IP fails
        document.getElementById("contact-device").value = getDevice();
        document.getElementById("contact-browser").value = getBrowser();
        sendContactForm();
      });
  });
}


function sendContactForm() {
  const formData = new FormData(contactForm);
  fetch("https://script.google.com/macros/s/AKfycbywXh87dmJXB4DZgbmVnzhqPv-38UuBf6AuZsgXH0wVriXAhuSQZxKCV0GToCgEa5od0Q/exec", {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      if (data.result === "success") {
        if (responseMessage) {
          responseMessage.textContent = "Thank you! Your message has been sent.";
          responseMessage.style.color = "green";
        }
        contactForm.reset();
        setTimeout(() => {
          document.getElementById('contact-popup').style.display = 'none';
        }, 1500);        
      } else {
        if (responseMessage) {
          responseMessage.textContent = "Error sending message. Please try again.";
          responseMessage.style.color = "red";
        }
      }
    })
    .catch(() => {
      if (responseMessage) {
        responseMessage.textContent = "Network error. Please try again.";
        responseMessage.style.color = "red";
      }
    });
}
});

// Popup functionality
function contactBtn() {
  document.getElementById("contact-popup").style.display = "flex";
  document.getElementById("formFields").style.display = "block";
}

document.addEventListener("DOMContentLoaded", () => {
  const closePopupBtn = document.getElementById("close-popup");
  if (closePopupBtn) {
    closePopupBtn.onclick = function () {
      document.getElementById("contact-popup").style.display = "none";
    };
  }

  window.addEventListener("click", function (e) {
    const popup = document.getElementById("contact-popup");
    if (e.target === popup) popup.style.display = "none";
  });
});