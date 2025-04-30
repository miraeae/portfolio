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

let currentOpenBtn = null;
let modalLinks;

// 열기
modalOpenBtns.forEach(btn => {
  btn.addEventListener("click", async () => {
    const modalId = btn.getAttribute("data-modal"); //project-myshop같은 값 저장
    btn.setAttribute("aria-expanded", "true");

    currentOpenBtn = btn; // 모달 열기 전에 버튼 저장 (닫기에 사용)

    // 캐시에 이미 있으면 바로 사용
    if (modalCache.has(modalId)) {
      loadModalContent(modalCache.get(modalId));
    } else {
      // 없으면 fetch 후 저장
      try {
        const res = await fetch("./assets/data/project-details.json");
        const data = await res.json();
        modalCache.set(modalId, data);  // 저장

        const project = data[modalId];
        console.log(`선택된 프로젝트 데이터:`, project); // 데이터 확인

        if (project) {
          modalCache.set(modalId, project);  // 캐시에 프로젝트 데이터 저장
          loadModalContent(project);  // 모달 내용 로드
        } else {
          console.error(`프로젝트 ${modalId}는 데이터에 없습니다.`);
        }
      } catch (error) {
        console.error('데이터 불러오기 실패:', error);
      }
    }
  });
});

// 모달 컨텐츠 삽입하고 애니메이션
function loadModalContent(project) {
  let linksHTML = '';

  // 각 링크 항목이 존재할 경우에만 출력
  if (project.link.site) {
    linksHTML += `<a href="${project.link.site}" class="project-modal__link project-modal__link--site" target="_blank" rel="noopener">Visit Site</a>`;
  }
  if (project.link.github) {
    linksHTML += `<a href="${project.link.github}" class="project-modal__link project-modal__link--github" target="_blank" rel="noopener">GitHub</a>`;
  }
  if (project.link.review) {
    linksHTML += `<a href="${project.link.review.link}" class="project-modal__link project-modal__link--review" target="_blank" rel="noopener">${project.link.review.name}</a>`;
  }

  modalContent.innerHTML = `
  <div class="project-modal__text-box">
    <h3 class="project-modal__title">${project.title}</h3>
    <p class="project-modal__meta">${project.meta}</p>
    <p class="project-modal__stack">${project.stack}</p>
    <p class="project-modal__desc">${project.description}</p>
    <div class="project-modal__links">${linksHTML}</div>
  </div>
  <div class="project-modal__img-box">
      <img class="project-modal__img" src="./assets/images/${project.image}" alt="">
  </div>
  `;

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  // Lenis 제거
  lenis.destroy();
  lenisRunning = false;

  // HTML 불러오고 실행
  modalLinks = modal.querySelectorAll("a, button");
  document.addEventListener("keydown", trapFocus);
  modalLinks[0].focus();
  
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

      if (currentOpenBtn) {
        currentOpenBtn.setAttribute("aria-expanded", "false");
        currentOpenBtn.focus();
        currentOpenBtn = null; // 닫고 나면 초기화
      }

      document.removeEventListener("keydown", trapFocus);
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

/*------------------------------------
    Blog
------------------------------------*/
const blog = document.querySelector(".blog");
const blogItems = document.querySelectorAll(".blog__item");
const blogCursor = document.querySelector(".blog__cursor");
const blogCursorImgs = blogCursor.querySelectorAll(".blog__cursor-img");

document.addEventListener("mousemove", (e) => {
  blogCursor.style.top = `${e.clientY}px`
  blogCursor.style.left = `${e.clientX}px`
  blogCursor.animate({
    top: `${e.clientY}px`, left:`${e.clientX}px`
  }, 2000)
})

blog.addEventListener("mouseenter", () => {
  blogCursor.style.display = "block";
})

blog.addEventListener("mouseleave", () => {
  blogCursor.style.display = "none";
})

blogItems.forEach((item, idx) => {
  const blogCursorImg = blogCursorImgs[idx];

  item.addEventListener("mouseenter", () => {
    blogCursorImg.classList.add("active");
  })

  item.addEventListener("mouseleave", () => {
    blogCursorImg.classList.remove("active");
  })
})



/*------------------------------------
    About
------------------------------------*/
slideUp(".about__text");
slideUp(".about__skill");