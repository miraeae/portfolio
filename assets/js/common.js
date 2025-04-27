/*------------------------------------
    Header, Footer Load
------------------------------------*/
async function loadHeader() {
  let path = "";
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    path = "/includes/header.html";
  } else {
    path = "/portfolio/includes/header.html";  // GitHub Pages
  }

  const res = await fetch(path);
  const html = await res.text();
  document.querySelector("header").innerHTML = html;
}

async function loadFooter() {
  let path = "";

  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    path = "/includes/footer.html";
  } else {
    path = "/portfolio/includes/footer.html";  // GitHub Pages
  }

  const res = await fetch(path);
  const html = await res.text();
  document.querySelector("footer").innerHTML = html;

  lenis.resize();  // Lenis 스크롤 height 값 반영 못하는 이슈로 새로운 높이 반영
  ScrollTrigger.refresh();  // ScrollTrigger 높이 및 레이아웃 새로 고침
}

/*------------------------------------
    Theme change
------------------------------------*/
function themeChange() {
  const toggleBtn = document.querySelector(".theme-toggle");
  const body = document.body;
  const sunIcon = 
  `<svg class="theme-toggle__icon" width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g>
      <path d="M15 21.25C18.4518 21.25 21.25 18.4518 21.25 15C21.25 11.5482 18.4518 8.75 15 8.75C11.5482 8.75 8.75 11.5482 8.75 15C8.75 18.4518 11.5482 21.25 15 21.25Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M15 1.25V3.75" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M15 26.25V28.75" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M5.27502 5.275L7.05002 7.05" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M22.95 22.95L24.725 24.725" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M1.25 15H3.75" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M26.25 15H28.75" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M5.27502 24.725L7.05002 22.95" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M22.95 7.05L24.725 5.275" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
  </svg>`;
  const moonIcon = 
  `<svg class="theme-toggle__icon" width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M26.25 15.9875C26.0534 18.1153 25.2548 20.143 23.9478 21.8335C22.6408 23.524 20.8794 24.8072 18.8696 25.5332C16.8599 26.2591 14.685 26.3977 12.5994 25.9326C10.5138 25.4676 8.60374 24.4182 7.09278 22.9072C5.58182 21.3963 4.53242 19.4862 4.06738 17.4006C3.60234 15.315 3.74089 13.1401 4.46682 11.1304C5.19275 9.12064 6.47604 7.35921 8.16651 6.05219C9.85699 4.74517 11.8847 3.94663 14.0125 3.75C12.7668 5.43533 12.1673 7.51181 12.3232 9.60177C12.479 11.6917 13.3798 13.6563 14.8618 15.1382C16.3437 16.6202 18.3083 17.521 20.3982 17.6768C22.4882 17.8327 24.5647 17.2332 26.25 15.9875Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  // 테마별 아이콘 세팅
  const updateIcon = (theme) => {
    toggleBtn.innerHTML = theme === "dark" ? moonIcon : sunIcon;
    toggleBtn.setAttribute(
      "aria-label",
      theme === "dark" ? "라이트모드로 테마 전환" : "다크모드로 테마 전환"
    );
  };

  // 테마별 보여주는 요소 제어
  function updateVisibility(theme) {
    const lightShow = document.querySelectorAll(".light-show");
    const darkShow = document.querySelectorAll(".dark-show");

    lightShow.forEach((el) => {
      if(theme === "light") {
        el.style.display = "block";
      } else {
        el.style.display = "none";
      }
    })

    darkShow.forEach((el) => {
      if(theme === "dark") {
        el.style.display = "block";
      } else {
        el.style.display = "none";
      }
    })
  
  }

  // 테마 저장
  const savedTheme = localStorage.getItem("theme") || "dark";
  body.setAttribute("data-theme", savedTheme);
  updateIcon(savedTheme);
  updateVisibility(savedTheme);

  // 클릭 시 테마 전환
  toggleBtn.addEventListener("click", () => {
    const currentTheme = body.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    body.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateIcon(newTheme);
    updateVisibility(newTheme);
  });
}

/*------------------------------------
    Cursor Event
------------------------------------*/
function cursorEvent() {
  const cursor = document.querySelector(".cursor");
  const follow = document.querySelector(".cursor-follow");

  let mouseX = 0;
  let mouseY = 0;
  let followX = 0;
  let followY = 0;
  
  document.addEventListener('mousemove', (e) => {
    document.querySelector(".cursor-wrap").style.opacity = "1";

    mouseX = e.clientX;
    mouseY = e.clientY;
  
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  });
  
  function animateFollow() {
    followX += (mouseX - followX) * 0.1;
    followY += (mouseY - followY) * 0.1;
  
    follow.style.left = `${followX}px`;
    follow.style.top = `${followY}px`;
  
    requestAnimationFrame(animateFollow);
  }
  
  animateFollow();

  const link = document.querySelectorAll(
    "a:not([class$='project__item-link']), button:not([class$='project__item-modal-open']), [class*=btn], [class*=trigger], [class*=toggle]"
  );

  link.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.classList.add("active");
      follow.classList.add("active");
    });

    el.addEventListener("mouseleave", () => {
      cursor.classList.remove("active");
      follow.classList.remove("active");
    });
  });

  // 프로젝트 커서
  const projectLinkAll = document.querySelectorAll("[class$='project__item-link'], [class$='project__item-modal-open']");
  const projectVisit = document.querySelectorAll("[class$='project__item-link']");
  const projectMore = document.querySelectorAll("[class$='project__item-modal-open']");

  projectLinkAll.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.classList.add("active-focus");
      follow.classList.add("active");
    });

    el.addEventListener("mouseleave", () => {
      cursor.classList.remove("active-focus");
      follow.classList.remove("active");
    });
  });

  // Visit Site
  projectVisit.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      if (!cursor.classList.contains("visit")) {
        for (let i = 0; i < 4; i++) {
          const span = document.createElement("span");
          span.textContent = "Visit Site";
          cursor.appendChild(span);
        }
      }

      cursor.classList.add("visit");
    });

    el.addEventListener("mouseleave", () => {
      // 추가된 span 요소들 제거
      const spans = cursor.querySelectorAll("span");
      spans.forEach(span => span.remove());

      cursor.classList.remove("visit");
    });
  });

  // More Details
  projectMore.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      if (!cursor.classList.contains("more")) {
        const span = document.createElement("span");
        span.textContent = 'More Details';
        cursor.appendChild(span);
      }

      cursor.classList.add("more");
    });

    el.addEventListener("mouseleave", () => {
      const span = cursor.querySelector("span");
      span.remove();

      cursor.classList.remove("more");
    });
  });
}


/*------------------------------------
    layout Event
------------------------------------*/
function layoutEvent() {
  // Header
  gsap.to(".header__inner", {y:0, duration: 1});
  
  // Gnb moblie
  const gnbToggle = document.querySelector(".gnb-toggle");
  const gnbMobile = document.querySelector(".gnb-mobile");
  const gnbTl = gsap.timeline({ paused: true });

  gnbTl
  .fromTo(".header__inner", { mixBlendMode: "difference" }, { mixBlendMode: "unset" })
  .fromTo(".gnb-mobile", { display: "none" }, { display: "block" }, "<")
  .to(".gnb-mobile", { height: "auto" })
  .from(".gnb-mobile__list li a", { yPercent: 120, duration: 0.5, stagger: 0.2 })
  .from(".gnb-mobile__contact-list li", { opacity: 0, duration: 0.5 });

  function toggleGnb() {
    const isActive = gnbToggle.classList.toggle("active");
    gnbToggle.setAttribute("aria-label", isActive ? "메뉴 닫기" : "메뉴 열기");
    gnbToggle.setAttribute("aria-expanded", isActive.toString());
    isActive ? gnbTl.play() : gnbTl.reverse();
  }

  function handleResize() {
    if (window.innerWidth >= 1024) {
      gnbMobile.style.display = "none";
      gnbToggle.classList.remove("active");
      gnbToggle.setAttribute("aria-label", "메뉴 열기");
      gnbToggle.setAttribute("aria-expanded", "false");
      gnbTl.progress(0).pause(); // 타임라인 초기화
    }
  }
  
  gnbToggle.addEventListener("click", toggleGnb);
  window.addEventListener("resize", handleResize);

  // Footer
  const footerTitle = document.querySelector(".footer__title");

  gsap.from(footerTitle.querySelectorAll("span"), {
    scrollTrigger: {
      trigger: footerTitle,
      start: "top 80%",
      toggleActions: "play none none reverse",
    }, opacity: 0, yPercent: 100, duration: 0.5, stagger: 0.2
  })

  
  // Rotate
  const rotateEl = document.querySelectorAll(".rotate");
  let rotationSpeed = 1; // 기본 회전 속도
  let boost = 0;

  gsap.ticker.add(() => {
    rotationSpeed += (1 - rotationSpeed) * 0.02; // 부드럽게 원래 속도로 복귀
    boost *= 0.9; // 스크롤 boost 점점 줄이기
    gsap.set(rotateEl, {
      rotate: `+=${rotationSpeed + boost}`
    });
  });

  // 스크롤 이벤트로 속도 boost
  window.addEventListener("scroll", () => {
    boost += 0.5;
  });

  
  // Click Event
  $(".gnb__item > a, .gnb-mobile__item > a").click(function () {
    $("html, body").animate({ scrollTop: $(this.hash).offset().top }, 800);
    return false;
  });

  $(".top-btn").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 800);
    return false;
  });
}


document.addEventListener("DOMContentLoaded", async () => {
  await loadHeader();
  await loadFooter();

  //loadHeader()와 loadFooter()가 끝난 후에 실행하기
  themeChange();
  cursorEvent();
  layoutEvent();
});
