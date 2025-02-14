document.addEventListener("DOMContentLoaded", () => {

    // Disable scrolling until the intro ends
    lenis.stop();

    gsap.registerPlugin(ScrollTrigger);

    common();

    intro(); // 0, 1
    about(); // 2
    project(); // 3
    subProject(); // 3-2
    goal(); // 4
    contact(); //5

});


////////// 0-1. 부드럽게 스크롤
const lenis = new Lenis()

lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time)=>{
    lenis.raf(time * 500)
})

gsap.ticker.lagSmoothing(0)


////////// 0-2. Intro
function intro() {
    const introTl = gsap.timeline();
    const intro = document.getElementById('intro');

    introTl
    .to(".intro__text span", {opacity: 1, y: 0, duration: 1, ease: 'none'})
    .to(".intro__text span", {yPercent : -100, duration: 1, ease: 'none'}, '+=1')
    .to(".intro", {yPercent : -100, duration: 0.3, ease: 'none',
        onComplete: () => onComplete()
    }, "+=0.5")

    function onComplete() {
        lenis.start();
        section();
        hero();
    }
}


////////// 1-1. Section Common - BG/COLOR
function section() {
    // Scroll-triggered animation
    gsap.utils.toArray(".sec").forEach((sec) => {
        ScrollTrigger.create({
            trigger: sec,
            start: "top center",
            end: "bottom center",
            scrub: true,
            toggleClass:  {"targets": sec, className: "active"},
            ease: "power2",
            refreshPriority: 0
        });
    });


    // BG Mode
    gsap.utils.toArray(".sec:not(.hero, .about)").forEach((sec) => {
        ScrollTrigger.create({
            trigger: sec,
            start: "top center",
            end: "bottom center",
            scrub: true,
            toggleClass:  {"targets": sec.querySelector(".line-anim"), className: "active"},
            ease: "power2",
            refreshPriority: 0,
            // markers: true,
            // id: `x_${sec.getAttribute('data-bgcolor')}`,
            onEnter: () => {
                document.body.setAttribute('data-mode', sec.getAttribute('data-mode'));
            },
            onEnterBack: () => {
                //console.log('enter back');
                document.body.setAttribute('data-mode', sec.getAttribute('data-mode'));
            },
        });
    });

    
    // Heading
    const headings = document.querySelectorAll(".reveal-text");

    headings.forEach((heading) => {
        const text = new SplitType(heading, {
            types: "lines, words, chars",
            tagName: "span",
        });

        const headingParent = heading.parentNode;
        const headingDesc = headingParent.querySelector("p");

        const headingTl = gsap.timeline({paused: true});

        headingTl
        .set(heading, { opacity: 1 })
        .from(text.chars, {
				filter: "blur(5px)",
				opacity: 0,
				duration: 0.5,
				stagger: 0.1,
				ease: "power2.inOut",
		})
        .from(headingDesc, {opacity: 0, duration: 0.8})

        
        ScrollTrigger.create({
            trigger: heading,
            start: "top center",
            end:"bottom top",
            // markers: true,
            // id: "heading",
            onEnter: () => {
                headingTl.play();
            },
        });
    });
}


////////// 1-2. Hero
function hero() {
    const hero = document.getElementById("hero");
    const text = new SplitType(".hero__title", {
        types: "lines, words",
        tagName: "span",
    });

    const heroTl = gsap.timeline()

    heroTl
    .to(".hero__bg img", {scale: 1, duration: 3})
    .to(".hero__title", {opacity: 1}, '<')
    .to(".hero__title .word", {y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power2.inOut"}, '<')
    .to(".hero__text-btm", {opacity: 1, duration: 0.5}, '<')
    .to(".hero__text", {opacity: "0.8", duration: 1, ease: "power2.inOut"}, '-=2')
    .to(".header__inner", {y: 0, duration: 1}, '-=1.5')
    .to(".scroll", {opacity: 1, duration: 1}, '<')
    .to(".hero__text-wrap", {yPercent:-20, opacity:0, duration:1,
        scrollTrigger: {
            trigger: hero,
            start: "60% center",
            end: "bottom 40%",
            scrub: 1,
            //markers: true,
        }
    })

    // Img Parallax
    gsap.to(".hero__bg img",{
        scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: true,
            //markers: true,
        },
        yPercent: -25,
        ease:'none'
    });
}


////////// 2. About
function about() {

ScrollTrigger.create({
    trigger: ".about",
        start: "+=50 bottom",
        end: "bottom center",
        scrub: true,
        ease: "power2",
        //markers: true,
        onEnter: () => {
            document.body.setAttribute('data-mode', 'light');
        },
        onEnterBack: () => {
            //console.log('enter back');
            document.body.setAttribute('data-mode', 'light');
        },
        onLeaveBack: () => {
            //console.log('Leave back');
            document.body.setAttribute('data-mode', document.getElementsByClassName("sec")[1].getAttribute('data-mode'));
        },
    })

    let mm = gsap.matchMedia();

    mm.add({
        isDesktop: `(min-width: 1024px)`,
        isMobile: `(max-width: 1023px)`,
    },(context) => {
        // context.conditions has a boolean property for each condition defined above indicating if it's matched or not.
        let { isDesktop, isMobile } = context.conditions;

        if(isDesktop) {
            // Title
            ScrollTrigger.create ({
                trigger: ".about__title-wrap",
                start:"center center",
                endTrigger: ".about__skill",
                end: "bottom 60%",
                pin:true,
                pinSpacing: false,
                toggleActions: "play none none reverse",
                //markers: true,
                //id : "aboutTitleBox",
            });

            // Btm Scroll Text
            const aboutBtmTl = gsap.timeline();
            aboutBtmTl
            .fromTo(".about__scroll-text", {xPercent: 20}, {
                scrollTrigger: {
                    trigger: ".skill__list",
                    start:"90% center",
                    endTrigger: ".about__scroll-text",
                    end: "90% 30%",
                    scrub: 1,
                    //markers: true,
                    //id : "aboutScrollText",
                },
                xPercent: -200,
                ease: "none"
            })
            .to(".about__scroll-text", {
                scrollTrigger: {
                    trigger: ".about__scroll-text",
                    start:"60% center",
                    end: "90% 30%",
                    scrub: 1,
                    //markers: true,
                    //id : "aboutScrollText",
                },
                opacity: 0
            })
        } else {
            ////// isMobile
            // Title
            const aboutTl = gsap.timeline({ 
                scrollTrigger: {
                    trigger: ".about__title-wrap",
                    start:"top top",
                    endTrigger: ".about__keyword",
                    end: "center center",
                    pin:true,
                    pinSpacing: false,
                    toggleActions: "play none none reverse",
                    //markers: true,
                    //id : "aboutTitleBox",
                }
            });
            aboutTl
            .to(".about__title", {opacity:"0.05"}, '+=0.5')

            // Btm Scroll Text
            const aboutBtmTl = gsap.timeline();
            aboutBtmTl
            .fromTo(".about__scroll-text", {xPercent: 20}, {
                scrollTrigger: {
                    trigger: ".skill__list",
                    start:"center center",
                    end: "bottom top",
                    scrub: 1,
                    //markers: true,
                    //id : "aboutScrollText",
                },
                xPercent: -200,
                ease: "none"
            })
            .to(".about__scroll-text", {
                scrollTrigger: {
                    trigger: ".about__scroll-text",
                    start:"80% center",
                    end: "80% top",
                    scrub: 1,
                    //markers: true,
                    //id : "aboutScrollText",
                },
                opacity: 0
            })
        }
    });

    // Particle
    $(document).mousemove(function(e){
        //중심좌표 구하기
        mouseX = e.clientX - window.innerWidth/2;
        mouseY = e.clientY - window.innerHeight/2;

        $('.particle svg, .about__keyword').each(function(){
            gsap.to(this,{
                x:mouseX/50,
                y:mouseY/50
            })
        })
    });
}


////////// 3. Projects
function project() {

    // Title Pin
    gsap.to(".project__title-wrap", {
        scrollTrigger: {
            trigger: ".project__title-wrap",
            start: "top top",
            endTrigger: ".project__list",
            end: "top top",
            pin: true,
            pinSpacing: false,
            scrub:1,
            //markers: true
        },
        opacity:0
    })


    // Project List
    gsap.utils.toArray(".project__item").forEach((item, i) => {

        gsap.to(item, {
            scrollTrigger: {
                trigger: item,
                start:"-50% center",
                end: "top center",
                scrub: 1,
                // markers: true,
                // id : "itemEnter",
            },
            scale: 1,
            "border-radius":0,
            ease: "none",
        });

        if ($(item).hasClass("last")) {
            return;
        }

        ScrollTrigger.create({
            trigger: item,
            start:"top top",
            endTrigger: ".project__item.last",
            end: "top top",
            pin: true,
            pinSpacing: false,
            //id: "itemPin",
            //markers:true,
        });

        gsap.to(item, {
            scrollTrigger: {
                trigger: item,
                start:"top top",
                end: "top -=70%",
                scrub: 2,
                 //markers: true,
                // id: "itemLeave"
            },
            autoAlpha: 0,
            ease: "none",
        }, 1);
    });

    // Bg Parallax
    gsap.utils.toArray(".project__item-bg").forEach((itemBg, i) => {
        const img = itemBg.querySelector('img');

        gsap.fromTo(img,{yPercent:-25},{
            scrollTrigger: {
                trigger: itemBg,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
                //markers: true,
                //id: "imgBg"
            },
            yPercent: 0,
            ease:'none'
        });
    })
}


////////// 3-2. Sub Project
function subProject() {
    // Title
    const titleBox = document.querySelectorAll(".sub-project__title-wrap");

        // Pin
        ScrollTrigger.create({
            trigger: titleBox,
            start: "top top",
            endTrigger: ".sub-project__item:last-child",
            end: "40% center",
            pin: true,
            pinSpacing: false,
            refreshPriority: 0,
            // markers: true,
            // id: "subPPin",
            onEnter: () => {
                gsap.to(titleBox, {opacity: "0.2",
                    scrollTrigger: {
                        trigger: ".sub-project__title",
                        start: "bottom top",
                        // markers: true,
                        // id: "SubPtitleBox1"
                    },
                })
            },
            onLeave: () => {
                gsap.to(titleBox, {opacity: 0})
            },
            onEnterBack : () => {
                //console.log("Enter back")
                gsap.to(titleBox, {opacity: "0.2"})
            },
            onLeaveBack : () => {
                //console.log("Leave Back")
                gsap.to(titleBox, {opacity: 1})
            },
        });
    


        // Image Parallax
        gsap.utils.toArray(".sub-project__item-img-box").forEach((itemImgBox, i) => {
            const img = itemImgBox.querySelector('img');
    
            gsap.fromTo(img,{yPercent:-30, scale: 1},{
                scrollTrigger: {
                    trigger: itemImgBox,
                    start: "-=20% bottom",
                    end: "bottom top",
                    scrub: true,
                    //markers: true,
                    //id: "itemImgBox"
                },
                yPercent: 0,
                scale: 1,
                ease:'none'
            });
        })


    // More Modal
    const toggles = document.querySelectorAll(".modal__toggle")

    toggles.forEach(function (toggle) {
        toggle.addEventListener("click", function() {
            $(this).toggleClass("active");
            const modalTl = gsap.timeline({})

            if($(window).width() > 1024){
                if($(this).hasClass("active")){
                    modalTl
                    .to($(this).parent(".modal"), {"width":"360px", "height": "auto", "border-radius": "25px;"})
                    .to($(this).next(".modal__content"), {opacity: 1}, '<')
                }else{
                    modalTl
                    .to($(this).parent(".modal"), {"width":"50px", "height": "50px", "border-radius": "50px;"})
                    .to($(this).next(".modal__content"), {opacity: 0}, '<')
                }
            } else {
                if($(this).hasClass("active")){
                    modalTl
                    .to($(this).parent(".modal"), {"width":"320px", "height": "auto", "border-radius": "25px;"})
                    .to($(this).next(".modal__content"), {opacity: 1}, '<')
                }else{
                    modalTl
                    .to($(this).parent(".modal"), {"width":"40px", "height": "40px", "border-radius": "50px;"})
                    .to($(this).next(".modal__content"), {opacity: 0}, '<')
                }
            }
        })
    })

    // Counter
    const counters = document.querySelectorAll(".counter");

    counters.forEach((counter) => {
        counter.textContent = "0";
        const targetNum = +counter.getAttribute("data-target");

        // 카운터 업데이트 함수
        const updateCounter = () => {
            const count = +counter.textContent; // 현재 카운터 값 가져오기
            const increment = targetNum / 100; // 카운터 값을 점진적으로 증가시키기
            const nextCount = Math.ceil(count + increment);

            counter.textContent = nextCount > targetNum ? targetNum : nextCount; // 목표 숫자를 초과하지 않도록 설정

            // 애니메이션 실행
            if (count < targetNum) {
                requestAnimationFrame(updateCounter); //requestAnimationFrame
            }
        };

        gsap.to(".sub-project__add",{
            scrollTrigger: {
                trigger:".sub-project__add",
                start: "-=100 center",
                end: "bottom center",
                // markers: true,
                // id: "counter",
                onEnter: () => {
                    updateCounter();
                }
            }
        })
    });
}
    

////////// 4. Goal
function goal() {
    //const container = document.querySelector(".goal__inner")
    const title = document.querySelector(".goal__title-wrap");
    const horizontal = document.querySelector(".goal__list");
    const horizontalItem = gsap.utils.toArray(".goal__item");

    // Tittle Pin
    ScrollTrigger.create({
        trigger: title,
        start:"top top",
        endTrigger: horizontal,
        end: () =>  "+=" + (horizontal.offsetWidth - innerWidth),
        pin: true,
        anticipatePin: 1,
        //id: "goalTitle",
        //markers:true,
    });
    

    // Horizontal
    gsap.to(horizontalItem, {
        xPercent: -100 * (horizontalItem.length - 1),
        ease: "none",
        scrollTrigger: {
            trigger: horizontal,
            start: "top top",
            end: () =>  "+=" + (horizontal.offsetWidth - innerWidth), //너비에서 현재 뷰포트의 너비를 더한 값
            //markers: true,
            //id: "horizontalItem",
            pin: true,
            scrub: 1,
            // snap: {
            //     snapTo: 1 / (horiItem.length - 1), // 각 요소 사이의 스냅 간격 설정
            //     inertia: false, // 관성 효과 비활성화
            //     duration: {min: 0.1, max: 0.1}
            // },
            invalidateOnRefresh: true, // 페이지 새로고침 시 스크롤 트리거 위치 재계산
            anticipatePin: 1 // 스크롤 트리거 요소의 위치를 예측하여 부드럽게 고정
        }
    });
}


////////// 5. Contact (Footer)
function contact() {
    gsap.to(".footer__inner", {
        scrollTrigger: {
            trigger: ".footer",
            start:"-=500 center",
            end: "bottom bottom",
            scrub: 1,
            // markers: true,
        },
        y:0
    });

    ScrollTrigger.create({
        trigger: ".footer",
        start: "top center",
        end: "bottom center",
        // markers: true,
        // id: "footerEnter",
        toggleClass: {"targets": ".footer", className: "active"},
    })
}


////////// Common
function common() {

    // Header
    $(".gnb__item > a, .gnb-mobile__item > a").click(function(){
        $("html, body").animate({scrollTop : $(this.hash).offset().top}, 800);
        return false;
    });
    $(".header__contact > a, .gnb-mobile__item:last-child > a").click(function(){
        $("html, body").animate({scrollTop : document.body.scrollHeight}, 800);
        return false;
    });
    
    
    // Menu
    const gnbTl = gsap.timeline({paused:true});
    
    gnbTl
    .to(".gnb-mobile",.4, {height:"auto", duration: 0.2, ease:'power1.inOut'})
    .from(".gnb-mobile li", {yPercent:100, opacity: 0, stagger:0.1})
    
    $(".gnb-trigger").click(function() {
        $(this).toggleClass("active");
    
        if($(this).hasClass("active")){
            gnbTl.play()
        }else{
            gnbTl.reverse()
        }
    });


    // Cursor
    $(document).mousemove(function(e){

        gsap.to(".cursor", {opacity:1, duration: 0.3, left: e.pageX, top: e.pageY}); //e.clientX
        gsap.to(".cursor-more", {duration: 1, left: e.pageX +15, top: e.pageY +15});

        $("a, [class*=btn], .gnb-trigger, .modal__toggle").hover(function() {
            e.preventDefault();
            $(".cursor").addClass("active");
        },function() {
            $(".cursor").removeClass("active");
        });

        $("[class*=project__item-link]:not(.project__item-link--in)").hover(function() {
            e.preventDefault();
            $(".cursor").removeClass("active");
            $(".cursor-more").addClass("active");
        },function() {
            $(".cursor").removeClass("active");
            $(".cursor-more").removeClass("active");
        });

    });

    // Section Scroll Event
    $(window).scroll(function(e) {
        var wScroll = $(window).scrollTop();
        var dHeight = $(document).height();
        var wHeight = $(window).height();
        var innerHeight = $(window).innerHeight();
        var scrollHeight = $('body').prop('scrollHeight');

        var scrollPercent = (wScroll / (dHeight - wHeight)) * 100;
        var roundScroll = Math.round(scrollPercent);

            $(".scroll-progress__percent").text(roundScroll);
            $(".scroll-bar").css("width", scrollPercent + "%");

            if(wScroll < 50) {
                gsap.to(".scroll__item", {yPercent: 0, duration: 0.5})
            } else if (wScroll + innerHeight + 50 >= scrollHeight ){
                gsap.to(".scroll__item", {yPercent: -200, duration: 0.5 })
            } else {
                gsap.to(".scroll__item", {yPercent: -100, duration: 0.5})
            }
    });

    $(".top-btn").click(function(){
        $("html, body").animate({scrollTop : 0}, 500);
        return false;
    });
    
    $("a[href='#']").click(function(e){
        e.preventDefault();
    });
}