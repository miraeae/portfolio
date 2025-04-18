/*------------------------------------
    Common
------------------------------------*/
gsap.registerPlugin(ScrollTrigger);
const mm = gsap.matchMedia();

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
.from(".hero__title span", {opacity: 0, yPercent: 100, duration: 0.5, stagger: 0.2}, "<")
.from(".hero__row--top .hero__text", {opacity: 0, yPercent: 100, duration: 0.8, ease: "power2.out"}, "-=50%")
.from(".hero__img-wrap img", {clipPath: "inset(0 100% 0 0)", duration: 0.6, ease: "power2.out"}, "-=50%")

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
gsap.to(".project__list", {
  scrollTrigger: {
    trigger: ".project__title",
    start: "top 70%",
    end: "bottom top",
    scrub: 1,
  }, y: -210, ease: "none",
})

// Img Anim
gsap.utils.toArray(".project__item-img-box img").forEach((img) => {
  gsap.set(img, { yPercent: -20 });

  gsap.from(img, {
    scrollTrigger: {
      trigger: img,
      start: "top 70%",
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
  const mm = gsap.matchMedia();

  mm.add("(min-width: 1025px)", () => {
    createModal("80%");
  });

  mm.add("(max-width: 1024px)", () => {
    createModal("70%");
  });

  function createModal(setHeight) {
    const modalTl = gsap.timeline({ paused: true });

    modalTl
    .to(modalContainer, { "display": "block", duration: 0.8 })
    .to(modal, {"display": "flex", height: setHeight, duration: 0.5, ease: "none",
      onComplete: () => { 
        checkOverflow();

        if(!usingTouch){
          modalLinks[0].focus(); // 첫 포커스인 X버튼으로 이동
        }
    }}, '<')
    .fromTo(modalCloseBtn, { opacity: 0 }, { opacity: 1, duration: 0.5 });

    // 모달 열기
    openBtn.addEventListener("click", () => {
      lenis.stop();
      document.body.classList.add("scroll-lock");
      openBtn.setAttribute("aria-expanded", "true");
      modalTl.play();
      document.addEventListener("keydown", trapFocus); //클릭을 키보드로 대체한 경우에도 여전히 click 이벤트가 트리거
    })

    // 모달 닫기
    modalCloseBtn.addEventListener("click", () => {
      lenis.start();
      document.body.classList.remove("scroll-lock");
      openBtn.setAttribute("aria-expanded", "false");
      modalTl.reverse();
      document.removeEventListener("keydown", trapFocus);

      if(!usingTouch){
        openBtn.focus();
      }
    })
  }

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
      modalContent.style.overflowY = "scroll";
    } else {
      modalContent.style.overflowY = "hidden";
    }
  }

  // + 버튼 아이콘 삽입
  openBtn.innerHTML = `
    <svg width="32" height="100%" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 1V31" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M1 16H31" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
});

// 모달 내부 링크에 → 추가
document.querySelectorAll(".project-modal__link:first-child").forEach((link) => {
  link.insertAdjacentHTML(
    "beforeend", // 컨텐츠 뒤에 추가 beforeend // 앞에 추가하고싶으면 afterbegin
    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 22L22 2M22 2H2M22 2V22" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg>`
  );
});

/*------------------------------------
    About
------------------------------------*/
slideUp(".about__text");
slideUp(".about__skill");