gsap.registerPlugin(ScrollTrigger);

// Lenis
const lenis = new Lenis()

lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time)=>{
  lenis.raf(time * 500)
})

gsap.ticker.lagSmoothing(0)


// Cursor
$(document).mousemove(function(e){
    gsap.to(".cursor", {opacity:1, duration: 0.5, left: e.pageX -18, top: e.pageY -18}); //e.clientX
    gsap.to(".cursor-more", {duration: 1, left: e.pageX +15, top: e.pageY +15});

    $("a:not(.more-view)").hover(function() {
        e.preventDefault();
        $(".cursor").addClass("active");
    },function() {
        $(".cursor").removeClass("active");
    });

    $("[class*=project__item-link]").hover(function() {
        e.preventDefault();
        $(".cursor").addClass("active");
        $(".cursor-more").addClass("active");
    },function() {
        $(".cursor").removeClass("active");
        $(".cursor-more").removeClass("active");
    });
});

// Header
$(".gnb__item > a, .gnb-mobile__item > a").click(function(){
    $("html, body").animate({scrollTop : $(this.hash).offset().top}, 800);
    return false;
});

$(".header__btn > a, .gnb-mobile__item:last-child > a").click(function(){
    $("html, body").animate({scrollTop : document.body.scrollHeight}, 800);
    return false;
});

// Header - Moblie Menu
$(".gnb-mobile-trigger").click(function() {
    $(this).toggleClass("active");

    if($(this).hasClass("active")){
        const gnbMo = gsap.timeline({});
        gnbMo.fromTo(".gnb-mobile__inner",{autoAlpha:0},{autoAlpha:1, duration: 0.2, ease:'power1.inOut'}, 0)
        gnbMo.fromTo(".gnb-mobile__item", {y:10, autoAlpha: 0}, {y:0, autoAlpha: 1, stagger:0.1})
    }else{
        const gnbMo = gsap.timeline({});
        gnbMo.to(".gnb-mobile__inner",{autoAlpha:0, duration: 0.2, ease:'power1.inOut'}, 0)
    }
});


// Section BG/MENU
// Enter
gsap.utils.toArray(".sec").forEach((sec) => {
    ScrollTrigger.create({
        trigger: sec,
        start: "top center",
        end: "bottom center",
        scrub: true,
        toggleClass: {"targets": sec, className: "active"},
        ease: "power2",
        refreshPriority: 0,
        // markers: true,
        // id: `x_${sec.getAttribute('data-bgcolor')}`,
        onEnter: () => {
            document.body.setAttribute('data-bgcolor', sec.getAttribute('data-bgcolor'));
        },
        onEnterBack: () => {
            // console.log('enter back');
            document.body.setAttribute('data-bgcolor', sec.getAttribute('data-bgcolor'));
        },
    });
});


// Text
const skewUpElements = document.querySelectorAll(".skew-up");

skewUpElements.forEach((element) => {
    const text = new SplitType(element, {
        types: "lines, words, chars",
        lineClass: "split-line",
        tagName: "span",
    });

    let tl = gsap.timeline({ paused: true });
    tl.set(element, { opacity: 1 })
    .from(text.chars, { filter: "blur(10px)", opacity: 0, duration: 0.8, stagger: 0.1, ease: "power2.inOut" }
    
    );

    ScrollTrigger.create({
        trigger: element,
        start: "top 80%",
        // markers: true,
        // id: "skewUp",
        onEnter: () => {
            tl.play();
        },
        onLeaveBack: () => {
            tl.reverse();
        }
    });
});


// First
const first = gsap.timeline({ defaults: {duration: 1}});
first.to(".hero__text", {opacity: 1, duration: 1}, '+=1.2')
first.to(".header", {y:0})
.to(".progress", {opacity: 1}, '<')
.to(".hero__copyright", {opacity: 1}, '<')



// About
gsap.fromTo('.mask-text .mask-text__inner', {
  'background-size':'0% 100%'
},{
  'background-size':'100% 100%',
  scrollTrigger: {
    trigger:'.about__copy',
    pinnedContainer:'.about__copy',
    start:'0% 60%',
    end:'100% 70%',
    //markers:true,
    scrub:1
  }
})


// Skill
const skillSec = document.querySelectorAll(".skew-up");

skewUpElements.forEach((element) => {
    
});

// Skill
ScrollTrigger.matchMedia({
    '(min-width: 787px)':function(){
        const skillIn = gsap.timeline({
            scrollTrigger: {
                trigger: ".skill",
                start:"top top",
                end: () => '+=' + window.innerHeight * 1,
                scrub:1,
                ease: "none",
                pin: true,
                pinSpacing: true,
                //refreshPriority: 0,
                // markers: true,
                // id : "skillIn",
            }
        });
        skillIn.to(".skill__title", {xPercent:-90, opacity: 0.2})
        .to(".skill__text", {xPercent:85, opacity: 0.2}, '<')
        .fromTo(".skill__item:nth-child(1)", {y:window.innerHeight}, {y:0}, 0)
        .fromTo(".skill__item:nth-child(2)", {y:window.innerHeight}, {y:0}, 0.3)
        .fromTo(".skill__item:nth-child(3)", {y:window.innerHeight}, {y:0}, 0.8)
    },
    '(max-width: 787px)':function(){
        const skillIn = gsap.timeline({
            scrollTrigger: {
                trigger: ".skill",
                start:"top top",
                end: () => '+=' + window.innerHeight * 1,
                scrub:1,
                ease: "none",
                pin: true,
                pinSpacing: true,
                refreshPriority: 0,
                // markers: true,
                // id : "skillIn",
            }
        });
        skillIn.to(".skill__title", {opacity: 0.2})
        .to(".skill__text", {opacity: 0.2}, '<')
        .fromTo(".skill__item:nth-child(1)", {y:window.innerHeight}, {y:0}, 0)
        .fromTo(".skill__item:nth-child(2)", {y:window.innerHeight}, {y:0}, 0.3)
        .fromTo(".skill__item:nth-child(3)", {y:window.innerHeight}, {y:0}, 0.8)
    }
});

// ScrollTrigger.create({ 
//     trigger: ".skill",
//     start: "bottom center",
//     end:"top center",
//     // markers: true,
//     // id: "skillBG",
//     onEnterBack: () => {
//         //console.log('enter back');
//         document.body.setAttribute('data-bgcolor', 'gray');
//     }
// });


// Projects
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
        delay: 0.5
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
        // id: "itemPin",
        //markers:true,
    });

    gsap.to(item, {
        scrollTrigger: {
            trigger: item,
            start:"top top+=65",
            end: "top -=70%",
            scrub: 1,
            // matker: true,
            // id: "itemLeave"
        },
        //filter: "blur(5px)",
        autoAlpha: 0.3,
        ease: "none",
    });
});


// Sub Project
gsap.utils.toArray(".sub-project__item").forEach((item) => {
    gsap.timeline({
        scrollTrigger: {
            trigger: item,
            start:"-=500 top",
            toggleClass: {"targets": item, className: "active"},
            scrub: 1,
            // markers: true,
            // id: "subProjectItem"
        }
    })

});

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


gsap.to(".footer", {
    scrollTrigger: {
        trigger: ".goal",
        start:"center center",
        end: "bottom bottom",
        // markers: true,
    },
    "display": "block",
});



$(window).scroll(function (e) {
    var wScroll = $(window).scrollTop();
    var dHeight = $(document).height();
    var wHeight = $(window).height();
    var scrollPercent = (wScroll / (dHeight - wHeight)) * 100;
    var roundScroll = Math.round(scrollPercent);

    if($(window).width() < 768) {
        // window 크기가 768보다 작을때
            $(".progress__bar").css("width", scrollPercent + "%");
        } else {
            $(".progress__bar").css("width", scrollPercent + "%");
            $(".progress__percent").text(roundScroll);
        }

});

$(".top-btn").click(function(){
    $("html, body").animate({scrollTop : 0}, 500);
    return false;
});

$("a[href='#']").click(function(e){
    e.preventDefault();
});
