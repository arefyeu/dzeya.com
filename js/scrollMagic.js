(function () {

    function initDoingScrollAnimation() {

        // initiate ScrollMagic Controller
        const controller = new ScrollMagic.Controller({
            reverse: true,
            refreshInterval: 0
        });

        const target = document.querySelector('.doing');
        const texts = document.querySelectorAll('.doing__text')

        const options = {
            threshold: .2
        }

        function handleIntersection(entries) {
            entries.map((entry) => {
                if (entry.isIntersecting) {
                    target.classList.add('active')
                } else {
                    target.classList.remove('active')
                }
            });
        }

        const observer = new IntersectionObserver(handleIntersection, options);
        observer.observe(target);


        let tween = TweenMax.to(".doing__square", .5, {
            scale: 1.7,
            ease: Linear.easeNone
        });


        // create a scene
        const sceneDoing = new ScrollMagic.Scene({
                triggerHook: .5,
                triggerElement: '#services',
                duration: 200
            })
            //.setClassToggle('.doing', "active")
            .setTween(tween)
            .setPin('#services') // pins the element for the the scene's duration
            .addTo(controller); // assign the scene to the controller


        const sceneDoingMenu = new ScrollMagic.Scene({
                triggerHook: .1,
                duration: 600,
                triggerElement: "#triggerDoing",
            })
            //.addIndicators()
            .setPin("#triggerDoingMenu")
            .addTo(controller)

        let sceneDoingMenuLink
        let sceneDoingText

        texts.forEach((el, idx) => {
                sceneDoingMenuLink = new ScrollMagic.Scene({
                    offset: 50,
                    triggerElement: `.doing__text--${idx+1}`
                })
                .setClassToggle(`.doing__link--${idx+1}`, "active")
                .addTo(controller);

                sceneDoingText = new ScrollMagic.Scene({
                    offset: 50,
                    duration: 175,
                    triggerElement: `.doing__text--${idx+1}`
                })
                .setClassToggle(`.doing__text--${idx+1}`, "active")
                .addTo(controller);
        })

        const sceneDoingGetTouch = new ScrollMagic.Scene({
                offset: 0,
                triggerElement: "#triggerDoingGet1",
                duration: 500
            })
            .setPin("#triggerDoingGetTouch")
            .addTo(controller)
    }

    if (window.matchMedia("(min-width: 1200px)").matches) {
        initDoingScrollAnimation();
    }


})()