(() => {
	"use strict";

	// Configure this to route emails through a backend or email API.
	// Example: Formspree endpoint like "https://formspree.io/f/xxxxxx"
	// If left empty, a mailto: fallback will be used.
	// Default: use FormSubmit to send emails without a backend or DB.
	// Learn more: https://formsubmit.co/
	const EMAIL_ENDPOINT = "";
	const DOCTOR_EMAIL = "microdegreecode2@gmail.com";

	const routes = Array.from(document.querySelectorAll("[data-route]"));
	const navLinks = Array.from(document.querySelectorAll("[data-nav]"));
	const navToggle = document.querySelector(".nav-toggle");
	const navList = document.getElementById("site-nav");
	const yearEl = document.getElementById("year");
	const form = document.getElementById("contact-form");
	const formStatus = document.getElementById("form-status");
	let submitting = false;
	// const FORM_SUBMIT_AJAX = "https://formsubmit.co/ajax/microdegreecode2@gmail.com";

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

	form.addEventListener("submit", async (e) => {
		e.preventDefault();
		
		// Get all form values and store as variables
		const name = document.getElementById("name").value;
		const email = document.getElementById("email").value;
		const phone = document.getElementById("phone").value;
		const goal = document.getElementById("goal").value;
		const message = document.getElementById("message").value;
		
		// Create payload with the stored values
		const payload = new FormData();
		payload.set("name", name);
		payload.set("email", email);
		payload.set("phone", phone);
		payload.set("goal", goal);
		payload.set("message", message);
		payload.set("_subject", `New inquiry from ${name}`);
		
		// Send email via FormSubmit
		const res = await fetch("https://formsubmit.co/ajax/microdegreecode2@gmail.com", {
			method: "POST",
			headers: { "Accept": "application/json" },
			body: payload
		});
		
		if (res.ok) {
			alert("Email sent successfully!");
			form.reset();
		} else {
			alert("Failed to send email.");
		}
	});
	
})();


