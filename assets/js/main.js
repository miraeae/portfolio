/*------------------------------------
    Common
------------------------------------*/
gsap.registerPlugin(ScrollTrigger);

// lenis
let lenis = new Lenis({ smooth: true });
let lenisRunning = true;

function lenisUpdate(time) {
  if (lenisRunning) {
    lenis.raf(time * 1000);
  }
}

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(lenisUpdate);
gsap.ticker.lagSmoothing(0);


// Text
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
const modal = document.getElementsByClassName("project-modal")[0];
const modalContent = modal.querySelector(".project-modal__content");
const modalOpenBtns = document.querySelectorAll("[data-modal]");
const modalCloseBtn = document.querySelector(".project-modal__close");

// 모달 캐시 저장소
const modalCache = new Map();

modalOpenBtns.forEach(btn => {
  btn.addEventListener("click", async () => {
    const modalUrl = btn.getAttribute("data-modal");

    // 캐시에 이미 있으면 바로 사용
    if (modalCache.has(modalUrl)) {
      loadModalContent(modalCache.get(modalUrl));
    } else {
      // 없으면 fetch 후 저장
      try {
        const response = await fetch(`./project-details/${modalUrl}.html`);
        const html = await response.text();
        modalCache.set(modalUrl, html); // 저장
        loadModalContent(html);
      } catch (error) {
        console.error('모달 불러오기 실패:', error);
      }
    }
  });
});

// 모달 컨텐츠 삽입하고 애니메이션
function loadModalContent(html) {
  modalContent.innerHTML = html;

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  // Lenis 제거
  lenis.destroy();
  lenisRunning = false;
  
  gsap.fromTo(
    [modalContent, modalCloseBtn],
    { opacity: 0, y: -30 },
    { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out'}
  );
}

// 닫기
function closeModal() {
  gsap.to(modalContent, {
    opacity: 0,
    y: -30,
    duration: 0.3,
    ease: 'power2.in',
    onComplete: () => {
      modal.style.display = 'none';
      modalContent.innerHTML = '';
      document.body.style.overflow = '';

      // Lenis 다시 생성
      lenis = new Lenis({ smooth: true });
      lenisRunning = true;

      // 다시 이벤트 연결
      lenis.on('scroll', ScrollTrigger.update);
    }
  });

  gsap.to(modalCloseBtn, { opacity: 0, y: -30, ease: 'power2.in'});
}

// 닫기 버튼 클릭 시
modalCloseBtn.addEventListener("click", closeModal);

// 배경 클릭 시 닫기
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

// ESC 키로 닫기
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("active")) {
    closeModal();
  }
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