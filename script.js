(() => {
	"use strict";

	// Google Apps Script Web App URL - You'll get this after deployment
	const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz8qSMto2wcabs9q8RVqtxjWVHVg-mxp7cHmcy-UexKAJlRtwbOFEFd3vGCU9RRlMTT/exec";

	const routes = Array.from(document.querySelectorAll("[data-route]"));
	const navLinks = Array.from(document.querySelectorAll("[data-nav]"));
	const navToggle = document.querySelector(".nav-toggle");
	const navList = document.getElementById("site-nav");
	const yearEl = document.getElementById("year");
	const form = document.getElementById("contact-form");
	const formStatus = document.getElementById("form-status");
	let submitting = false;

	// Dynamic year
	if (yearEl) {
		yearEl.textContent = new Date().getFullYear().toString();
	}

	// Mobile nav toggle
	if (navToggle && navList) {
		navToggle.addEventListener("click", () => {
			const isOpen = navList.getAttribute("data-open") === "true";
			navList.setAttribute("data-open", (!isOpen).toString());
			navToggle.setAttribute("aria-expanded", (!isOpen).toString());
		});
	}

	// SPA router (hash-based)
	function setActiveRoute(routeId) {
		let targetId = routeId || "home";
		const target = document.getElementById(targetId);
		if (!target) {
			targetId = "home";
		}
		routes.forEach(section => {
			const isTarget = section.id === targetId;
			section.toggleAttribute("hidden", !isTarget);
		});
		// Update nav active state
		navLinks.forEach(link => {
			const hrefId = (link.getAttribute("href") || "").replace("#", "");
			const isActive = hrefId === targetId;
			if (isActive) link.setAttribute("aria-current", "page");
			else link.removeAttribute("aria-current");
		});
		// Close mobile menu after navigation
		if (navList) {
			navList.setAttribute("data-open", "false");
		}
		if (navToggle) {
			navToggle.setAttribute("aria-expanded", "false");
		}
		// Update document title for basic SEO
		const sectionTitle = targetId.charAt(0).toUpperCase() + targetId.slice(1);
		document.title = `Nutri360 | ${sectionTitle}`;
	}

	function handleHashChange() {
		const id = (location.hash || "#home").replace("#", "");
		setActiveRoute(id);
	}

	// Intercept nav anchors for smoother UX
	navLinks.forEach(link => {
		link.addEventListener("click", (e) => {
			const href = link.getAttribute("href");
			if (!href || !href.startsWith("#")) return;
			e.preventDefault();
			const id = href.replace("#", "");
			if (location.hash.replace("#", "") !== id) {
				location.hash = id;
			} else {
				// force update if the same
				setActiveRoute(id);
			}
		});
	});

	window.addEventListener("hashchange", handleHashChange);
	// Initialize route
	handleHashChange();

	// Form submission to Google Sheets
	if (form) {
		form.addEventListener("submit", async (e) => {
			e.preventDefault();
			
			// Prevent double submission
			if (submitting) return;
			submitting = true;
			
			// Get all form values
			const name = document.getElementById("name").value.trim();
			const email = document.getElementById("email").value.trim();
			const phone = document.getElementById("phone").value.trim();
			const goal = document.getElementById("goal").value;
			const message = document.getElementById("message").value.trim();
			
			// Show loading state
			const submitButton = form.querySelector('button[type="submit"]');
			const originalButtonText = submitButton ? submitButton.textContent : '';
			if (submitButton) {
				submitButton.textContent = 'Sending...';
				submitButton.disabled = true;
			}
			
			// Create FormData object for Google Apps Script
			const formData = new FormData();
			formData.append("name", name);
			formData.append("email", email);
			formData.append("phone", phone);
			formData.append("goal", goal);
			formData.append("message", message);
			
			try {
				const res = await fetch(GOOGLE_SCRIPT_URL, {
					method: "POST",
					body: formData
				});
				
				const data = await res.json();
				
				if (data.success) {
					alert("Thank you! Your message has been submitted successfully.");
					form.reset();
				} else {
					alert("Something went wrong. Please try again or contact us directly at microdegreecode2@gmail.com");
				}
			} catch (error) {
				console.error("Error:", error);
				alert("Failed to submit form. Please try again or email us at microdegreecode2@gmail.com");
			} finally {
				submitting = false;
				if (submitButton) {
					submitButton.textContent = originalButtonText;
					submitButton.disabled = false;
				}
			}
		});
	}
})();