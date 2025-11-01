/**
 * WhatsApp Contact Form Handler
 * Tajawaz Solutions - Contact Form to WhatsApp Integration
 */

document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  const successMessage = document.getElementById('success-message');
  const errorMessage = document.getElementById('error-message');
  
  // WhatsApp number (format: country code + number without +)
  const whatsappNumber = '6281945967926';
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form values
      const firstName = document.getElementById('first-name').value.trim();
      const lastName = document.getElementById('last-name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();
      
      // Validation
      if (!email || !message) {
        showError('Email dan Pesan harus diisi!');
        return;
      }
      
      // Validate email format
      if (!isValidEmail(email)) {
        showError('Format email tidak valid!');
        return;
      }
      
      // Construct full name
      const fullName = [firstName, lastName].filter(n => n).join(' ') || 'Calon Client';
      
      // Format WhatsApp message with proper line breaks and formatting
      let whatsappMessage = `*PESAN BARU DARI WEBSITE TAJAWAZ SOLUTIONS*\n\n`;
      whatsappMessage += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
      whatsappMessage += `👤 *Nama:*\n${fullName}\n\n`;
      whatsappMessage += `📧 *Email:*\n${email}\n\n`;
      
      if (subject) {
        whatsappMessage += `📌 *Subjek:*\n${subject}\n\n`;
      }
      
      whatsappMessage += `💬 *Pesan:*\n${message}\n\n`;
      whatsappMessage += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
      whatsappMessage += `_Dikirim melalui Form Kontak Website_\n`;
      whatsappMessage += `_${new Date().toLocaleString('id-ID', { 
        dateStyle: 'long', 
        timeStyle: 'short',
        timeZone: 'Asia/Jakarta'
      })}_`;
      
      // Encode message for URL
      const encodedMessage = encodeURIComponent(whatsappMessage);
      
      // Create WhatsApp URL
      const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
      
      // Show success message
      showSuccess();
      
      // Open WhatsApp in new tab after 3 SECOND DELAY
      setTimeout(() => {
        window.open(whatsappURL, '_blank');
        
        // Reset form after sending
        setTimeout(() => {
          contactForm.reset();
          hideMessages();
        }, 1000);
      }, 3000); // DELAY 3 DETIK
    });
  }
  
  /**
   * Validate email format
   */
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  /**
   * Show success message with proper styling
   */
  function showSuccess() {
    hideMessages();
    if (successMessage) {
      successMessage.classList.remove('hidden');
      successMessage.classList.add('success', 'alert');
      successMessage.style.display = 'flex';
      successMessage.innerHTML = `
        <span class="check-icon"><i class="fa-solid fa-circle-check"></i></span>
        <p style="margin: 0; font-size: var(--font-size-lg); font-weight: var(--font-weight-semibold); text-align: center; line-height: 1.6; color: var(--accent-color-2);">
          Berhasil! Pesan Anda sedang disiapkan...<br>
          <span style="font-size: var(--font-size-sm); font-weight: var(--font-weight-normal); opacity: 0.95;">
            Anda akan diarahkan ke WhatsApp dalam 3 detik
          </span>
        </p>
      `;
      
      // Scroll to message
      successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
  
  /**
   * Show error message with proper styling
   */
  function showError(customMessage) {
    hideMessages();
    if (errorMessage) {
      errorMessage.classList.remove('hidden');
      errorMessage.classList.add('error', 'alert');
      errorMessage.style.display = 'flex';
      errorMessage.innerHTML = `
        <span class="cross-icon"><i class="fa-solid fa-circle-xmark"></i></span>
        <p style="margin: 0; font-size: var(--font-size-lg); font-weight: var(--font-weight-semibold); text-align: center; line-height: 1.6; color: var(--accent-color-2);">
          ${customMessage || 'Oops! Terjadi kesalahan. Silakan coba lagi.'}
        </p>
      `;
      
      // Scroll to message
      errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Auto hide after 5 seconds
      setTimeout(hideMessages, 5000);
    }
  }
  
  /**
   * Hide all messages
   */
  function hideMessages() {
    if (successMessage) {
      successMessage.classList.add('hidden');
      successMessage.style.display = 'none';
    }
    if (errorMessage) {
      errorMessage.classList.add('hidden');
      errorMessage.style.display = 'none';
    }
  }
  
  // Add input validation feedback
  const emailInput = document.getElementById('email');
  if (emailInput) {
    emailInput.addEventListener('blur', function() {
      if (this.value && !isValidEmail(this.value)) {
        this.style.borderColor = '#ef4444';
      } else {
        this.style.borderColor = '';
      }
    });
    
    emailInput.addEventListener('input', function() {
      this.style.borderColor = '';
    });
  }
  
  // Add required field indicators
  const messageInput = document.getElementById('message');
  if (messageInput) {
    messageInput.addEventListener('blur', function() {
      if (!this.value.trim()) {
        this.style.borderColor = '#ef4444';
      } else {
        this.style.borderColor = '';
      }
    });
    
    messageInput.addEventListener('input', function() {
      this.style.borderColor = '';
    });
  }
});
