/**
 * Bio Page JavaScript
 * Handles modal interactions and animations
 */

(function() {
  'use strict';

  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', function() {
    
    // Modal Elements
    const membershipModal = document.getElementById('membershipModal');
    const storeModal = document.getElementById('storeModal');
    
    // Modal Triggers
    const openMembershipBtn = document.getElementById('openMembershipModal');
    const openStoreBtn = document.getElementById('openStoreModal');
    
    // Modal Close Buttons
    const closeMembershipBtn = document.getElementById('closeMembershipModal');
    const closeStoreBtn = document.getElementById('closeStoreModal');

    // Open Membership Modal
    if (openMembershipBtn) {
      openMembershipBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (membershipModal) {
          membershipModal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    }

    // Open Store Modal
    if (openStoreBtn) {
      openStoreBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (storeModal) {
          storeModal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    }

    // Close Membership Modal
    if (closeMembershipBtn) {
      closeMembershipBtn.addEventListener('click', function() {
        if (membershipModal) {
          membershipModal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    }

    // Close Store Modal
    if (closeStoreBtn) {
      closeStoreBtn.addEventListener('click', function() {
        if (storeModal) {
          storeModal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    }

    // Close modals when clicking outside
    if (membershipModal) {
      membershipModal.addEventListener('click', function(e) {
        if (e.target === membershipModal) {
          membershipModal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    }

    if (storeModal) {
      storeModal.addEventListener('click', function(e) {
        if (e.target === storeModal) {
          storeModal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    }

    // Close modals with Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        if (membershipModal && membershipModal.classList.contains('active')) {
          membershipModal.classList.remove('active');
          document.body.style.overflow = '';
        }
        if (storeModal && storeModal.classList.contains('active')) {
          storeModal.classList.remove('active');
          document.body.style.overflow = '';
        }
      }
    });

    // Smooth scroll for anchor links
    const bioLinks = document.querySelectorAll('.card-bio-link[href^="#"]');
    bioLinks.forEach(function(link) {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      });
    });

    // Add animation on scroll for bio elements
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated', 'animate__fadeInUp');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe bio link cards
    const bioLinkCards = document.querySelectorAll('.card-bio-link');
    bioLinkCards.forEach(function(card, index) {
      card.style.animationDelay = (index * 0.1) + 's';
      observer.observe(card);
    });

    // Social icon hover effects
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(function(icon) {
      icon.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) rotate(5deg)';
      });
      
      icon.addEventListener('mouseleave', function() {
        this.style.transform = '';
      });
    });

    // Bio profile image parallax effect on mouse move
    const bioProfileImage = document.querySelector('.bio-profile-image');
    if (bioProfileImage) {
      document.addEventListener('mousemove', function(e) {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
        bioProfileImage.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
    }

    // Bio page JavaScript loaded successfully
  });

})();