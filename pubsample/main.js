(function () {
  "use strict";

  // 문의 버튼: 이동하지 않고 안내 문구만 펼친다
  var btn = document.getElementById("inquiry-btn");
  var note = document.getElementById("inquiry-note");
  btn.addEventListener("click", function () {
    var open = note.hidden;
    note.hidden = !open;
    btn.setAttribute("aria-expanded", String(open));
    btn.textContent = open ? "안내 닫기" : "문의 방법 보기";
  });

  // 움직임 끄기 설정이면 연출을 시작하지 않는다 (CSS 도 같은 조건으로 최종 상태를 보여준다)
  if (!document.documentElement.classList.contains("anim") || !("IntersectionObserver" in window)) {
    document.documentElement.classList.remove("anim");
    return;
  }

  // 연출 1 — 요소 등장: 화면에 들어오면 한 번만 나타난다
  var rv = document.querySelectorAll(".rv");
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
  rv.forEach(function (el) { io.observe(el); });

  // 연출 2 — 한 구간 고정: 그림은 sticky 로 붙어 있고, 오른쪽 단계가 화면 가운데를 지날 때 그림이 한 단계씩 그려진다
  var stage = document.getElementById("stage-svg");
  var steps = document.querySelectorAll(".step");
  stage.setAttribute("data-step", "1");
  var so = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      steps.forEach(function (s) { s.classList.toggle("cur", s === e.target); });
      stage.setAttribute("data-step", e.target.getAttribute("data-n"));
    });
  }, { rootMargin: "-45% 0px -45% 0px" });
  steps.forEach(function (s) { so.observe(s); });
  steps[0].classList.add("cur");

  // 연출 3 — 구간 전환: 가격 구간이 화면 가운데에 닿으면 종이색에서 먹색으로 바뀐다 (한 번만)
  var dark = document.getElementById("price");
  var dio = new IntersectionObserver(function (es) {
    if (es[0].isIntersecting) { dark.classList.add("on"); dio.disconnect(); }
  }, { rootMargin: "-40% 0px -40% 0px" });
  dio.observe(dark);
})();
