;(function () {

	"use strict";


	// render svg
	function renderSvg(selector, xmlString) {
		const doc = new DOMParser().parseFromString(xmlString, 'application/xml');
		const elem = document.querySelector(selector);
		elem.appendChild(
			elem.ownerDocument.importNode(doc.documentElement, true)
		)
	}

	const svgSprites = `<svg style="display: none;" class="sr-only" version="1.1" height="0" xmlns="http://www.w3.org/2000/svg"
	xmlns:xlink="http://www.w3.org/1999/xlink">
		<symbol id="i-arrow-right" fill="none" viewBox="0 0 24 24">
			<path d="M5 12H19" stroke="#171B1C" stroke-linecap="round" stroke-linejoin="round"/>
			<path d="M12 5L19 12L12 19" stroke="#171B1C" stroke-linecap="round" stroke-linejoin="round"/>
		</symbol>
		<symbol id="i-heart" fill="none" viewBox="0 0 24 24">
			<path d="M15.2071 5.58444C14.5505 5.59466 13.9082 5.77794 13.3451 6.1158C12.782 6.45366 12.318 6.93412 12 7.50866C11.682 6.93412 11.2181 6.45366 10.655 6.1158C10.0919 5.77794 9.44961 5.59466 8.79301 5.58444C7.74632 5.62992 6.76017 6.0878 6.05 6.85806C5.33983 7.62832 4.96338 8.64834 5.00288 9.69527C5.00288 13.6458 11.3913 18.2085 11.663 18.4021L12 18.6406L12.3371 18.4021C12.6088 18.2096 18.9972 13.6458 18.9972 9.69527C19.0367 8.64834 18.6603 7.62832 17.9501 6.85806C17.2399 6.0878 16.2538 5.62992 15.2071 5.58444Z" fill="white"/>
		</symbol>
	</svg>`;


	// scroll anchor
	function scrollAnchor() {
		const links = document.querySelectorAll('.js-scroll');
		for (let link of links) {
			link.addEventListener('click', (e) => {
				e.preventDefault();
				let hash = link.getAttribute('href');
				let target = document.querySelector(hash);

				target.scrollIntoView({
					behavior: 'smooth',
					block: 'start'
				});

				history.pushState(null, null, hash);
			});
		}
	}


	// navbar
	function initNavbar () {
		const navbar = document?.querySelector('.navbar')
		const navbarBurger = navbar?.querySelector('.navbar__hamburger')
		const navbarMenu = navbar?.querySelector('.navbar__menu')
		let scrollY;

		function stickyNavbar() {
			scrollY =
				window.scrollY ||
				window.pageYOffset ||
				document.documentElement.scrollTop;

			if (scrollY > 1) {
				navbar.classList.add("navbar--fixed");
			} else {
				navbar.classList.remove("navbar--fixed");
			}
		}

		window.addEventListener("scroll", stickyNavbar);

		function toggleMobileNav() {
			navbarMenu.classList.toggle('navbar__menu--open')
			navbarBurger.classList.toggle('navbar__hamburger--open')
		}

		navbarBurger?.addEventListener('click', toggleMobileNav)
	}

	initNavbar ();


	function countProjects() {
		const countEl = document?.querySelector('.projects__count')
		const tableTr = document?.querySelectorAll('.projects__table tbody tr').length
		countEl.textContent = `+${tableTr}`
	}
	countProjects();


	function openUrlProject(){
		const links = document?.querySelectorAll('.projects__table tbody tr')
		links.forEach(link => {
			link.addEventListener('click', ()=> {
				window.open(link.dataset.url, "_blank")
			})
		})
	}

	openUrlProject();


	function getPriceValue() {
		const formControlAbout = document?.querySelector('.form__control--about')
		const priceItems = document?.querySelectorAll('.price__item-layer')
		priceItems.forEach(item => {
			const circle = item.closest('.price__item').querySelector('.price__item-circle')
			circle.addEventListener('click', ()=> {
				formControlAbout.value = item.dataset.about
			})
			item.addEventListener('click', ()=> {
				formControlAbout.value = item.dataset.about
			})
		})
	}

	getPriceValue();


	function initCursor() {
		const doingGetTouch = document?.querySelector('#triggerDoingGetTouch')
		const doingCursor = document?.querySelector('.doing__cursor');

		function cursorMouseMove(e) {
			doingCursor.classList.add('active')
			doingCursor.style.left = e.clientX + 'px';
			doingCursor.style.top = e.clientY + 'px';
		}

		function cursorMouseOut() {
			doingCursor.classList.remove('active')
		}

		doingGetTouch.addEventListener('mousemove', cursorMouseMove)
		doingGetTouch.addEventListener('mouseout', cursorMouseOut)
	}

	initCursor();


	/*if (window.matchMedia("(max-width: 576px)").matches) {
		const ball = document.querySelector('.ball__img');
		if (!ball) return
		let index = 0;
		let sources = [
			'images/balls/logos/01.svg',
			'images/balls/logos/02.svg',
			'images/balls/logos/03.svg',
			'images/balls/logos/04.svg',
			'images/balls/logos/05.svg'
		]

		ball.addEventListener("click", function() {
			ball.src = sources[index];
			index = (index === sources.length - 1) ? 0 : index + 1;
		});
	}*/

	function initMarquee() {
		const digitalBlock = document.querySelector('.digital__block');
		if (!digitalBlock) return

		let gap;

		if (window.matchMedia("(min-width: 768px)").matches) {
			gap = 64;
		}
		else {
			gap = 24;
		}

		$('.digital__block').marquee({
			duration: 10000,
			gap: gap,
			delayBeforeStart: 0,
			direction: 'left',
			duplicated: true,
			pauseOnHover: true
		});
	}

	initMarquee();



	window.addEventListener('DOMContentLoaded', () => {
		countProjects();
		renderSvg('body', svgSprites);
		scrollAnchor();


		function sendData() {
			const XHR = new XMLHttpRequest();

			// Bind the FormData object and the form element
			const FD = new FormData(form);

			// Define what happens on successful data submission
			XHR.addEventListener("load", function (event) {
				//alert(event.target.responseText);
				window.location.href = 'thanks.html'
			});

			// Define what happens in case of error
			XHR.addEventListener("error", function (event) {
				alert('Oops! Something went wrong.');
			});

			// Set up our request
			XHR.open("POST", "php/form.php");

			// The data sent is what the user provided in the form
			XHR.send(FD);
		}

		// Access the form element...
		const form = document.querySelector('.form__inner')

		// ...and take over its submit event.
		form?.addEventListener("submit", function (event) {
			event.preventDefault();
			sendData();
		});
	});

})();