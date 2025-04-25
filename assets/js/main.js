/*------------------------------------
    Common
------------------------------------*/
gsap.registerPlugin(ScrollTrigger);

gsap.utils.toArray(".sec h2[class$='__title']").forEach((title) => {
  const titleEl = title.querySelectorAll("span");

  gsap.from(titleEl, {
    scrollTrigger: {
      trigger: title,
      start: "top 80%",
      end: "bottom top",
      toggleActions: "play none none reverse",
      id: "Title",
    },
    opacity: 0,
    y: 100,
    duration: 0.5,
    stagger: 0.2
  })
});

function slideUp(target) {
  gsap.from(target, {scrollTrigger: {
    trigger: target,
    start: "top-=100% 80%",
    end: "bottom top",
    toggleActions: "play none none reverse"
  },
  opacity: 0, yPercent: 100, duration: 0.8, ease: "power2.out", delay: 0.5})
}

/*------------------------------------
    Hero
------------------------------------*/
const heroTl = gsap.timeline();

heroTl
.to(".hero__row--top", {opacity: 1})
.from(".hero__bg", {"filter": "blur(100px)", duration: 0.8})
.from(".hero__title span", {opacity: 0, yPercent: 100, skewY: 2, duration: 1, stagger: 0.2, ease:"power4.out"}, "<")
.from(".hero__row--top .hero__text", {opacity: 0, yPercent: 100, duration: 1, ease: "power2.out"}, "-=50%")
.from(".hero__img-wrap img", {clipPath: "inset(0 100% 0 0)", duration: 0.8, ease: "power2.out"}, "-=50%")

gsap.from(".hero__row--btm .hero__text", {opacity: 0, yPercent: 100, duration: 0.8, ease: "power2.out",
  scrollTrigger: {
    trigger: ".hero",
    start: "10% top",
  }
})

// Parallax
gsap.to(".hero__content", {
  scrollTrigger: {
    trigger: ".hero",
    start: "10% top",
    end: "bottom top",
    scrub: 1,
  }, yPercent: -20
})

/*------------------------------------
    Projects
------------------------------------*/
function projectList(setStart, setY) {
  gsap.to(".project__list", {
    scrollTrigger: {
      trigger: ".project__title",
      start: setStart,
      end: "bottom top",
      scrub: 1,
    }, y: setY, ease: "none",
  })
}

function projectImg(img, setStart){
  gsap.from(img, {
    scrollTrigger: {
      trigger: img,
      start: setStart,
      end: "bottom center",
      refreshPriority: 0,
      toggleActions: "play none none reverse"
    }, scale: 1.2, filter: "blur(20px)"
  });

  gsap.to(img, {
    yPercent: 0,
    scrollTrigger: {
      trigger: img,
      start: "top bottom",
      end: "bottom top",
      refreshPriority: 0,
      scrub: 1,
    }
  });
}

const mm = gsap.matchMedia();

// pc
mm.add("(min-width: 1025px)", () => {
  projectList("top 70%", "-210px");

  gsap.utils.toArray(".project__item-img-box img").forEach((img) => {
    gsap.set(img, { yPercent: -20 });
    projectImg(img, "top 70%");
  })
})

// tablet + mobile
mm.add("(max-width: 1024px)", () => {
  gsap.utils.toArray(".project__item-img-box img").forEach((img) => {
    gsap.set(img, { yPercent: -20 });
    projectImg(img, "top 80%");
  })
})

// tablet
mm.add("(min-width: 768px) and (max-width: 1024px)", () => {
  projectList("top 60%", "-110px");
})

// mobile
mm.add("(max-width: 767px)", () => {
  projectList("top 60%", "-70px");
})


// Img Parallax
gsap.utils.toArray(".sub-project__item-img-box img").forEach((img) => {
  gsap.fromTo(img, {yPercent:-15}, {
    scrollTrigger: {
      trigger: img,
      start: "-=50% center",
      end: "bottom+=50% center",
      scrub: true,
    }, yPercent: 0
  });
});


const subOpenBtns = document.querySelectorAll(".sub-project__item-modal-open");

subOpenBtns.forEach((openBtn) => {
    // + 아이콘 삽입
    openBtn.innerHTML = `
    <svg width="32" height="100%" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 1V31" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M1 16H31" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
})



/*------------------------------------
    Projects - modal
------------------------------------*/
// 각 모달 내부에 닫기 버튼 삽입
document.querySelectorAll(".project-modal").forEach((modal) => {
  const modalCloseBtn = document.createElement("button");
  modalCloseBtn.classList.add("project-modal-close");
  modalCloseBtn.setAttribute("aria-label", "상세 설명 닫기");
  modalCloseBtn.innerHTML = `
    <svg width="25" height="25" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 1L31 31" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M31 1L1 31" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
  modal.prepend(modalCloseBtn);
});


// 모달 열고 닫기
const modalOpenBtns = document.querySelectorAll("[class$='project__item-modal-open']");

modalOpenBtns.forEach((openBtn) => {
  const modalContainer = document.querySelector(".project-modal-container");
  const modalId = openBtn.dataset.modal;
  const modal = document.getElementById(modalId);
  const modalContent = modal.querySelector(".project-modal__content");
  const modalCloseBtn = modal.querySelector(".project-modal-close");
  const modalLinks = modal.querySelectorAll("a, button");

  // 터치 유저 확인
  let usingTouch = false;
  window.addEventListener("touchstart", () => {
    usingTouch = true;
  });

  // 모달 모션
  let modalTl = null; // 전역에서 접근 가능

  function getCurrentHeight() {
    return window.innerWidth <= 1024 ? "65%" : "80%";
  }

  // 해상도에 따라 동적으로 값을 반영하기 위해 함수로 처리
  function openModalTl() {
    modalTl = gsap.timeline({ paused: true });

    modalTl
    .to(modalContainer, { "display": "block", duration: 0.8 })
    .to(modal, {"display": "flex", height: getCurrentHeight(), duration: 0.5, ease: "none",
      onComplete: () => { 
        checkOverflow();

        if(!usingTouch){
          modalLinks[0].focus(); // 첫 포커스 요소로 이동
        }
    }}, '<')
    .fromTo(modalCloseBtn, { opacity: 0 }, { opacity: 1, duration: 0.5 });

    modalTl.play();
  }

  // 모달 열기
  function openModal() {
    lenis.stop();
    document.body.classList.add("scroll-lock");
    openBtn.setAttribute("aria-expanded", "true");
    openModalTl();
    document.addEventListener("keydown", trapFocus);
  }
  
  openBtn.addEventListener("click", openModal)

  // 모달 닫기
  function closeModal(){
    lenis.start();
    document.body.classList.remove("scroll-lock");
    openBtn.setAttribute("aria-expanded", "false");
    modalTl.reverse();
    document.removeEventListener("keydown", trapFocus);

    if(!usingTouch){
      openBtn.focus();
    }
  }

  modalCloseBtn.addEventListener("click", closeModal);
  modalContainer.addEventListener("click", closeModal);

  document.addEventListener("keydown", (event) => {
    if(event.key === "Escape") {
      closeModal();
    }
  });

  // 트랩 포커스
  function trapFocus(event) {
    const firstElement = modalLinks[0];
    const lastElement = modalLinks[modalLinks.length - 1];

    if (event.key === "Tab") {
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  }

  // 모달 height 값 체크
  function checkOverflow() {
    if (modalContent.scrollHeight > modalContent.clientHeight) {
      modalContent.style.overflowY = "auto";
    } else {
      modalContent.style.overflowY = "hidden";
    }
  }

  window.addEventListener("resize", () => {
    checkOverflow();
  });
});

/*------------------------------------
    Side Projects
------------------------------------*/
const sideItems = document.querySelectorAll(".side-project__item");
const sideCursor = document.querySelector(".side-project__cursor");
const sideCursorImgs = sideCursor.querySelectorAll(".side-project__cursor-img");

document.addEventListener("mousemove", (e) => {
  sideCursor.style.top = `${e.clientY}px`
  sideCursor.style.left = `${e.clientX}px`
  sideCursor.animate({
    top: `${e.clientY}px`, left:`${e.clientX}px`
  }, 2000)
})

sideItems.forEach((item, idx) => {
  const sideCursorImg = sideCursorImgs[idx];

  item.addEventListener("mouseenter", () => {
    sideCursorImg.classList.add("active");
  })

  item.addEventListener("mouseleave", () => {
    sideCursorImg.classList.remove("active");
  })
})



/*------------------------------------
    About
------------------------------------*/
slideUp(".about__text");
slideUp(".about__skill");