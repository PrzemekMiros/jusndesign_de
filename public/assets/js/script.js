function appMain() {
  
	if (document.body && document.body.dataset.megaNavLock === "true") {
		delete document.body.dataset.megaNavLock;
	}

	// Pobieramy aktualny adres URL
	var currentUrl = window.location.pathname;
	var menuLinks = document.querySelectorAll('.menu a');
	menuLinks.forEach(function(link) {
		link.classList.remove('link-active');
	});
	menuLinks.forEach(function(link) {
		if (link.getAttribute('href') === currentUrl) {
			link.classList.add('link-active');
		}
	});

	// Greeting
	if (document.querySelector("#greeting")) {
		const greeting = document.getElementById("greeting");
		const hour = new Date().getHours();
    const welcomeTypes = ["Dzien dobry", "Dobry wieczor"];
		let welcomeText = "";
		if (hour < 20) welcomeText = welcomeTypes[0];
		else welcomeText = welcomeTypes[1];
		greeting.innerHTML = welcomeText;
	}

	const loadVideoSources = (video) => {
		if (!video || video.dataset.videoLoaded === "true") {
			return;
		}
		const sources = video.querySelectorAll("source[data-src]");
		if (!sources.length) {
			return;
		}
		sources.forEach((source) => {
			source.src = source.dataset.src;
			source.removeAttribute("data-src");
		});
		video.load();
		video.dataset.videoLoaded = "true";
	};

	const navigateWithTransition = (href) => {
		if (!href) {
			return;
		}

		let swupInstance = null;
		if (typeof window !== "undefined" && window.swup) {
			swupInstance = window.swup;
		} else {
			try {
				if (typeof swup !== "undefined") {
					swupInstance = swup;
				}
			} catch (e) {}
		}

		if (swupInstance && typeof swupInstance.navigate === "function") {
			swupInstance.navigate(href);
			return;
		}

		window.location.href = href;
	};

	// Ensure hero video plays; show controls if autoplay is blocked.
	const heroVideo = document.querySelector("[data-hero-video]");
	if (heroVideo) {
		heroVideo.muted = true;
		heroVideo.playsInline = true;
		const startHeroVideo = () => {
			loadVideoSources(heroVideo);
			const playPromise = heroVideo.play();
			if (playPromise && typeof playPromise.catch === "function") {
				playPromise.catch(() => {
					heroVideo.setAttribute("controls", "controls");
				});
			}
		};
		if ("IntersectionObserver" in window) {
			const observer = new IntersectionObserver((entries) => {
				entries.forEach((entry) => {
					if (!entry.isIntersecting) {
						return;
					}
					observer.disconnect();
					if ("requestIdleCallback" in window) {
						requestIdleCallback(startHeroVideo, { timeout: 2000 });
					} else {
						setTimeout(startHeroVideo, 500);
					}
				});
			}, { rootMargin: "0px 0px 200px 0px" });
			observer.observe(heroVideo);
		} else {
			setTimeout(startHeroVideo, 500);
		}
	}

	// Play mega menu videos only on hover/focus.
	const megaDropdowns = document.querySelectorAll(".has-dropdown");
	if (megaDropdowns.length) {
		megaDropdowns.forEach((dropdown) => {
			dropdown.classList.remove("is-closing");
			if (dropdown.dataset.megaCloseResetBound !== "true") {
				dropdown.dataset.megaCloseResetBound = "true";
				const resetMegaClosing = () => {
					dropdown.classList.remove("is-closing");
				};
				dropdown.addEventListener("mouseenter", resetMegaClosing);
				dropdown.addEventListener("focusin", resetMegaClosing);
			}
		});
	}

	const megaCards = document.querySelectorAll(".mega-card");
	if (megaCards.length) {
		megaCards.forEach((card) => {
			const video = card.querySelector("video");
			if (!video || video.dataset.megaVideoBound === "true") {
				return;
			}
			video.dataset.megaVideoBound = "true";
			video.muted = true;
			video.playsInline = true;
			video.removeAttribute("autoplay");
			if (!video.paused) {
				video.pause();
			}
			try {
				video.currentTime = 0;
			} catch (e) {}

			const playVideo = () => {
				loadVideoSources(video);
				const playPromise = video.play();
				if (playPromise && typeof playPromise.catch === "function") {
					playPromise.catch(() => {});
				}
			};
			const stopVideo = () => {
				video.pause();
				try {
					video.currentTime = 0;
				} catch (e) {}
			};

			card.addEventListener("mouseenter", playVideo);
			card.addEventListener("mouseleave", stopVideo);
			card.addEventListener("focus", playVideo);
			card.addEventListener("blur", stopVideo);

			if (card.dataset.megaFadeBound !== "true") {
				card.dataset.megaFadeBound = "true";
				card.addEventListener("click", (event) => {
					if (
						event.defaultPrevented ||
						event.button !== 0 ||
						event.metaKey ||
						event.ctrlKey ||
						event.shiftKey ||
						event.altKey ||
						card.getAttribute("target") === "_blank"
					) {
						return;
					}

					const href = card.getAttribute("href");
					if (!href) {
						return;
					}

					if (document.body && document.body.dataset.megaNavLock === "true") {
						event.preventDefault();
						event.stopPropagation();
						return;
					}

					event.preventDefault();
					event.stopPropagation();
					if (typeof event.stopImmediatePropagation === "function") {
						event.stopImmediatePropagation();
					}
					if (document.body) {
						document.body.dataset.megaNavLock = "true";
					}

					const dropdown = card.closest(".has-dropdown");
					if (dropdown) {
						dropdown.classList.add("is-closing");
					}

					window.setTimeout(() => {
						navigateWithTransition(href);
					}, 520);
					window.setTimeout(() => {
						if (document.body && document.body.dataset.megaNavLock === "true") {
							delete document.body.dataset.megaNavLock;
						}
					}, 1800);
				}, true);
			}
		});
	}

	// Submit contact form via AJAX and redirect on success.
	if (!window.__contactFormBound) {
		window.__contactFormBound = true;
		document.addEventListener("submit", function (event) {
			const form = event.target;
			if (!form || form.id !== "contactForm") return;
			event.preventDefault();

			const statusEl = form.querySelector("#send_contact_form_status");
			if (statusEl) statusEl.innerHTML = "";

			const formData = new FormData(form);
			const successRedirect = "/formular-gesendet/";

			fetch(form.action, {
				method: "POST",
				body: formData,
				headers: {
					"X-Requested-With": "XMLHttpRequest"
				}
			})
				.then((response) => response.json())
				.then((data) => {
					if (data && data.status === 1) {
						window.location.href = successRedirect;
						return;
					}
					if (statusEl && data && data.msg) {
						statusEl.innerHTML = data.msg;
					}
				})
				.catch(() => {
					if (statusEl) {
						statusEl.innerHTML = "<p class='status_err'>Wystapil problem z wyslaniem formularza.</p>";
					}
				});
		}, true);
	}
  // Header scrolled
	(function() {
		var doc = document.documentElement;
		var w = window;
		var curScroll;
		var prevScroll = w.scrollY || doc.scrollTop;
		var curDirection = 0;
		var prevDirection = 0;
		var body = document.querySelector('body');
		var header = document.querySelector('.site-header');
		var toggled;
		var threshold = 20;

		var checkScroll = function() {
			curScroll = w.scrollY || doc.scrollTop;
			if (curScroll > prevScroll) {
				// scrolled down
				curDirection = 2;
			} else {
				// scrolled up
				curDirection = 1;
			}

			if (curDirection !== prevDirection) {
				toggled = toggleHeader();
			}

			// Add or remove 'scrolled' class based on scroll position
			if (curScroll > 150) {
				header.classList.add('scrolled');
			} else {
				header.classList.remove('scrolled');
			}

			prevScroll = curScroll;
			if (toggled) {
				prevDirection = curDirection;
			}
		};

		var toggleHeader = function() {
			toggled = true;
			if (curDirection === 2 && curScroll > threshold) {
				header.classList.add('hide');
				body.classList.add('sticky-up');
        body.classList.remove('sticky-down');
			} else if (curDirection === 1) {
				header.classList.remove('hide');
				body.classList.remove('sticky-up');
        body.classList.add('sticky-down');
			} else {
				toggled = false;
			}
			return toggled;
		};

		window.addEventListener('scroll', checkScroll);

	})();


	// Swiper

	if (document.querySelector('.swiper-works')) {
	var swiper = new Swiper(".swiper-works", {
		grabCursor: true,
		slidesPerView: 3,
		spaceBetween: 15,
		centeredSlides: false,
		loop: true,
		lazy: {
			loadPrevNext: true,
			loadPrevNextAmount: 2
		},
		pagination: {
			el: ".swiper-pagination",
			clickable: true
		},
		scrollbar: {
			el: '.swiper-scrollbar',
		},
		navigation: {
			nextEl: '.swiper-gal',
			prevEl: '.swiper-gal',
		},
		autoplay: {
			delay: 4000,
		},
		keyboard: {
			enabled: true
		},
		mousewheel: false,


		breakpoints: {
			0: {        
				slidesPerView: 1,
				centeredSlides: true
			},
			768: {        
				slidesPerView: 3,
				centeredSlides: false
			}
		}
	});
};


// Swiper categories

	if (document.querySelector('.swiper-category')) {
	var swiper = new Swiper(".swiper-category", {
		grabCursor: true,
		slidesPerView: 1,
		spaceBetween: 15,
		centeredSlides: false,
		loop: true,
		lazy: {
			loadPrevNext: true,
			loadPrevNextAmount: 2
		},
		pagination: {
			el: ".swiper-pagination",
			clickable: true
		},
		scrollbar: {
			el: '.swiper-scrollbar',
		},
		navigation: {
			nextEl: '.swiper-gal',
			prevEl: '.swiper-gal',
		},
		autoplay: {
			delay: 4000,
		},
		keyboard: {
			enabled: true
		},
		mousewheel: false,

	});
};


	if (document.querySelector('.swiper-reviews')) {
	var swiper = new Swiper(".swiper-reviews", {
		grabCursor: true,
		slidesPerView: 1,
		spaceBetween: 15,
		centeredSlides: false,
		loop: true,
		lazy: {
			loadPrevNext: true,
			loadPrevNextAmount: 2
		},
		pagination: {
			el: ".swiper-pagination",
			clickable: true
		},
		navigation: {
			nextEl: '.swiper-rev',
			prevEl: '.swiper-rev',
		},
		autoplay: {
			delay: 4000,
		},
		keyboard: {
			enabled: true
		},
		mousewheel: false,


	});
};


	// Acordion
	if (document.querySelector(".accordion")) {
		let t = document.getElementsByClassName("accordion");
		for (let e = 0; e < t.length; e++)
			t[e].addEventListener("click", function() {
				let e = this.nextElementSibling;
				if (e.style.maxHeight)
					(e.style.maxHeight = null), this.classList.remove("open");
				else {
					for (let a = 0; a < t.length; a++)
						t[a].classList.remove("open"),
						(t[a].nextElementSibling.style.maxHeight = null);
					(e.style.maxHeight = e.scrollHeight + "px"),
					this.classList.toggle("open");
				}
			});
	};

	if (document.querySelector('.form-outer')) {
		initMultiStepForm();

		function initMultiStepForm() {
			const progressNumber = document.querySelectorAll(".step").length;
			const slidePage = document.querySelector(".slide-page");
			const progressCheck = document.querySelectorAll(".step .check");
			const bullet = document.querySelectorAll(".step .bullet");
			const pages = document.querySelectorAll(".page");
			const nextButtons = document.querySelectorAll(".next");
			const prevButtons = document.querySelectorAll(".prev");
			const stepsNumber = pages.length;

			if (progressNumber !== stepsNumber) {
				console.warn(
					"Error, number of steps in progress bar do not match number of pages"
				);
			}

			document.documentElement.style.setProperty("--stepNumber", stepsNumber);

			let current = 1;

			for (let i = 0; i < nextButtons.length; i++) {
				nextButtons[i].addEventListener("click", function(event) {
					event.preventDefault();

					inputsValid = validateInputs(this);
					// inputsValid = true;

					if (inputsValid) {
						slidePage.style.marginLeft = `-${
                      (100 / stepsNumber) * current
                  }%`;
						bullet[current - 1].classList.add("active");
						progressCheck[current - 1].classList.add("active");
						current += 1;
					}
				});
			}

			for (let i = 0; i < prevButtons.length; i++) {
				prevButtons[i].addEventListener("click", function(event) {
					event.preventDefault();
					slidePage.style.marginLeft = `-${
                  (100 / stepsNumber) * (current - 2)
              }%`;
					bullet[current - 2].classList.remove("active");
					progressCheck[current - 2].classList.remove("active");
					current -= 1;
				});
			}

			function validateInputs(ths) {
				let inputsValid = true;

				const inputs =
					ths.parentElement.parentElement.querySelectorAll("input");
				for (let i = 0; i < inputs.length; i++) {
					const valid = inputs[i].checkValidity();
					if (!valid) {
						inputsValid = false;
						inputs[i].classList.add("invalid-input");
					} else {
						inputs[i].classList.remove("invalid-input");
					}
				}
				return inputsValid;
			}
		}

	}

	initProductGallery();
	initProductLightbox();

// End
};



function initProductLightbox() {
	const lightbox = document.getElementById("lightbox");
	if (!lightbox || lightbox.dataset.lightboxBound === "true") {
		return;
	}

	const imageEl = lightbox.querySelector("#lightbox-image");
	const triggers = document.querySelectorAll(".lightbox-trigger");
	const closeEls = lightbox.querySelectorAll("[data-lightbox-close]");
	const prevBtn = lightbox.querySelector("[data-lightbox-prev]");
	const nextBtn = lightbox.querySelector("[data-lightbox-next]");
	const contentEl = lightbox.querySelector(".lightbox-content");
	let lightboxItems = [];
	let currentIndex = 0;
	let closeAnimationTimer = null;

	if (!triggers.length || !imageEl) {
		return;
	}

	const normalizeUrl = (url) => {
		if (!url) {
			return "";
		}
		try {
			return new URL(url, window.location.origin).href;
		} catch (error) {
			return url;
		}
	};

	const updateNavState = () => {
		const hasNavigation = lightboxItems.length > 1;
		if (prevBtn) {
			prevBtn.disabled = !hasNavigation;
		}
		if (nextBtn) {
			nextBtn.disabled = !hasNavigation;
		}
	};

	const showImageByIndex = (nextIndex) => {
		if (!lightboxItems.length) {
			return;
		}
		const total = lightboxItems.length;
		currentIndex = ((nextIndex % total) + total) % total;
		const item = lightboxItems[currentIndex];
		imageEl.src = item.src;
		imageEl.alt = item.alt || "";
	};

	const collectItems = (trigger) => {
		const gallery = trigger.closest("[data-product-gallery]");
		if (gallery) {
			const thumbs = gallery.querySelectorAll("[data-product-thumb]");
			if (thumbs.length) {
				return Array.from(thumbs)
					.map((thumb) => ({
						src: thumb.getAttribute("data-image-src"),
						alt: thumb.getAttribute("data-image-alt") || "",
					}))
					.filter((item) => item.src);
			}
		}

		const src =
			trigger.getAttribute("data-lightbox-src") || trigger.getAttribute("href");
		if (!src) {
			return [];
		}
		const img = trigger.querySelector("img");
		return [
			{
				src,
				alt: img ? img.getAttribute("alt") : "",
			},
		];
	};

	const openLightbox = (trigger, src, alt) => {
		if (closeAnimationTimer) {
			window.clearTimeout(closeAnimationTimer);
			closeAnimationTimer = null;
		}
		lightbox.classList.remove("is-closing");

		lightboxItems = collectItems(trigger);
		const normalizedTarget = normalizeUrl(src);
		const foundIndex = lightboxItems.findIndex(
			(item) => normalizeUrl(item.src) === normalizedTarget
		);
		currentIndex = foundIndex >= 0 ? foundIndex : 0;
		showImageByIndex(currentIndex);
		if (!lightboxItems.length) {
			imageEl.src = src;
			imageEl.alt = alt || "";
		}
		updateNavState();
		lightbox.setAttribute("aria-hidden", "false");
		window.requestAnimationFrame(() => {
			lightbox.classList.add("is-open");
		});
		document.body.style.overflow = "hidden";
	};

	const finalizeClose = () => {
		if (closeAnimationTimer) {
			window.clearTimeout(closeAnimationTimer);
			closeAnimationTimer = null;
		}
		lightbox.classList.remove("is-closing");
		lightbox.setAttribute("aria-hidden", "true");
		imageEl.src = "";
		lightboxItems = [];
		currentIndex = 0;
		document.body.style.overflow = "";
	};

	const closeLightbox = () => {
		if (lightbox.classList.contains("is-closing") || !lightbox.classList.contains("is-open")) {
			return;
		}

		lightbox.classList.remove("is-open");
		lightbox.classList.add("is-closing");

		const onTransitionEnd = (event) => {
			if (contentEl && event.target !== contentEl) {
				return;
			}
			finalizeClose();
		};

		if (contentEl) {
			contentEl.addEventListener("transitionend", onTransitionEnd, { once: true });
		}

		closeAnimationTimer = window.setTimeout(() => {
			finalizeClose();
		}, 320);
	};

	const showPrev = () => {
		showImageByIndex(currentIndex - 1);
	};

	const showNext = () => {
		showImageByIndex(currentIndex + 1);
	};

	triggers.forEach((trigger) => {
		if (trigger.dataset.lightboxBound === "true") {
			return;
		}
		trigger.dataset.lightboxBound = "true";
		trigger.addEventListener("click", (event) => {
			event.preventDefault();
			const src =
				trigger.getAttribute("data-lightbox-src") || trigger.getAttribute("href");
			if (!src) {
				return;
			}
			const img = trigger.querySelector("img");
			openLightbox(trigger, src, img ? img.getAttribute("alt") : "");
		});
	});

	closeEls.forEach((el) => {
		if (el.dataset.lightboxCloseBound === "true") {
			return;
		}
		el.dataset.lightboxCloseBound = "true";
		el.addEventListener("click", closeLightbox);
	});

	if (prevBtn && prevBtn.dataset.lightboxNavBound !== "true") {
		prevBtn.dataset.lightboxNavBound = "true";
		prevBtn.addEventListener("click", showPrev);
	}

	if (nextBtn && nextBtn.dataset.lightboxNavBound !== "true") {
		nextBtn.dataset.lightboxNavBound = "true";
		nextBtn.addEventListener("click", showNext);
	}

	if (!window.__productLightboxKeyBound) {
		window.__productLightboxKeyBound = true;
		document.addEventListener("keydown", (event) => {
			const active = document.querySelector(".lightbox.is-open");
			if (!active) {
				return;
			}

			if (event.key === "Escape") {
				closeLightbox();
				return;
			}

			if (event.key === "ArrowLeft") {
				event.preventDefault();
				const prev = active.querySelector("[data-lightbox-prev]");
				if (prev) {
					prev.click();
				}
				return;
			}

			if (event.key === "ArrowRight") {
				event.preventDefault();
				const next = active.querySelector("[data-lightbox-next]");
				if (next) {
					next.click();
				}
			}
		});
	}

	lightbox.dataset.lightboxBound = "true";
}

function initProductGallery() {
	const galleries = document.querySelectorAll("[data-product-gallery]");
	if (!galleries.length) {
		return;
	}

	galleries.forEach((gallery) => {
		if (gallery.dataset.galleryBound === "true") {
			return;
		}

		const mainImage = gallery.querySelector("[data-product-main-image]");
		const mainLink = gallery.querySelector("[data-product-main-link]");
		const thumbs = gallery.querySelectorAll("[data-product-thumb]");

		if (!mainImage || !mainLink || !thumbs.length) {
			gallery.dataset.galleryBound = "true";
			return;
		}

		const setActiveThumb = (activeThumb) => {
			thumbs.forEach((thumb) => {
				thumb.classList.toggle("is-active", thumb === activeThumb);
			});
		};

		thumbs.forEach((thumb) => {
			if (thumb.dataset.galleryThumbBound === "true") {
				return;
			}
			thumb.dataset.galleryThumbBound = "true";
			thumb.addEventListener("click", () => {
				const src = thumb.getAttribute("data-image-src");
				const alt = thumb.getAttribute("data-image-alt") || mainImage.alt;
				if (!src) {
					return;
				}

				mainImage.src = src;
				mainImage.alt = alt;
				mainLink.href = src;
				mainLink.setAttribute("data-lightbox-src", src);
				setActiveThumb(thumb);
			});
		});

		gallery.dataset.galleryBound = "true";
	});
}


