(() => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const timelines = {};

  gsap.registerPlugin(ScrollTrigger);

  const svg = (id) => document.querySelector(id);

  function kill(name) {
    if (timelines[name]) {
      timelines[name].kill();
      timelines[name] = null;
    }
  }

  function make(name, builder) {
    kill(name);
    const tl = builder();
    timelines[name] = tl;
    if (reduced) tl.progress(1);
    return tl;
  }

  const plays = {
    repo() {
      const root = svg("#viz-repo");
      return make("repo", () => {
        const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
        gsap.set(root.querySelectorAll(".file"), { opacity: 0, y: 12 });
        gsap.set(root.querySelector(".git-badge"), { scale: 0, transformOrigin: "50% 50%" });
        gsap.set(root.querySelector(".link"), { strokeDashoffset: 80 });
        gsap.set(root.querySelector(".remote"), { scale: 0.4, opacity: 0, transformOrigin: "50% 50%" });
        gsap.set(root.querySelectorAll(".remote + .label, .on-dark.small"), { opacity: 0 });
        tl.to(root.querySelectorAll(".file"), { opacity: 1, y: 0, stagger: 0.15, duration: 0.4 })
          .to(root.querySelector(".git-badge"), { scale: 1, duration: 0.35, ease: "back.out(1.6)" })
          .to(root.querySelector(".link"), { strokeDashoffset: 0, duration: 0.5 })
          .to(root.querySelector(".remote"), { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.4)" }, "-=0.2")
          .to(root.querySelectorAll(".on-dark"), { opacity: 1, duration: 0.3 }, "-=0.15");
        return tl;
      });
    },

    clone() {
      const root = svg("#viz-clone");
      return make("clone", () => {
        const packet = root.querySelector(".packet");
        const tl = gsap.timeline();
        gsap.set(packet, { y: 0, opacity: 1, scale: 1, transformOrigin: "50% 50%" });
        tl.from(root.querySelector(".cloud"), { scale: 0.7, opacity: 0, duration: 0.4, transformOrigin: "50% 50%" })
          .from(packet, { scale: 0.6, opacity: 0, duration: 0.25 })
          .to(packet, { y: 128, duration: 0.9, ease: "power2.inOut" })
          .to(packet, { scale: 0.85, duration: 0.2 }, "-=0.15")
          .from(root.querySelector(".laptop"), { y: 16, opacity: 0, duration: 0.35 }, 0.2);
        return tl;
      });
    },

    branch() {
      const root = svg("#viz-branch");
      return make("branch", () => {
        const path = root.querySelector(".feature-path");
        const length = path.getTotalLength();
        const tl = gsap.timeline();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        gsap.set(root.querySelectorAll(".feature-n1, .feature-n2, .rust"), { opacity: 0, scale: 0.4, transformOrigin: "50% 50%" });
        tl.from(root.querySelectorAll(".n1, .n2, .n3, .n4"), {
          scale: 0,
          stagger: 0.12,
          duration: 0.3,
          transformOrigin: "50% 50%",
          ease: "back.out(1.7)",
        })
          .to(path, { strokeDashoffset: 0, duration: 0.8, ease: "power2.inOut" })
          .to(root.querySelector(".feature-n1"), { opacity: 1, scale: 1, duration: 0.25 }, "-=0.45")
          .to(root.querySelector(".feature-n2"), { opacity: 1, scale: 1, duration: 0.25 }, "-=0.2")
          .to(root.querySelector(".rust"), { opacity: 1, scale: 1, duration: 0.25 }, "-=0.1");
        return tl;
      });
    },

    commit() {
      const root = svg("#viz-commit");
      return make("commit", () => {
        const tl = gsap.timeline();
        gsap.set(root.querySelectorAll(".snap"), { opacity: 0, y: 18 });
        tl.to(root.querySelector(".shutter"), { scale: 1.08, duration: 0.12, yoyo: true, repeat: 1, transformOrigin: "50% 50%" })
          .to(root.querySelector(".s1"), { opacity: 1, y: 0, duration: 0.35 })
          .to(root.querySelector(".shutter"), { x: 140, duration: 0.4, ease: "power2.inOut" })
          .to(root.querySelector(".shutter"), { scale: 1.08, duration: 0.12, yoyo: true, repeat: 1, transformOrigin: "50% 50%" })
          .to(root.querySelector(".s2"), { opacity: 1, y: 0, duration: 0.35 })
          .to(root.querySelector(".shutter"), { x: 280, duration: 0.4, ease: "power2.inOut" })
          .to(root.querySelector(".shutter"), { scale: 1.08, duration: 0.12, yoyo: true, repeat: 1, transformOrigin: "50% 50%" })
          .to(root.querySelector(".s3"), { opacity: 1, y: 0, duration: 0.35 });
        return tl;
      });
    },

    pushPull() {
      const root = svg("#viz-push-pull");
      return make("pushPull", () => {
        const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
        gsap.set(root.querySelector(".push-dot"), { x: 0, opacity: 1 });
        gsap.set(root.querySelector(".pull-dot"), { x: 0, opacity: 1 });
        tl.from(root.querySelector(".local"), { x: -20, opacity: 0, duration: 0.35 })
          .from(root.querySelector(".remote"), { x: 20, opacity: 0, duration: 0.35 }, "<")
          .to(root.querySelector(".push-dot"), { x: 120, duration: 0.7 })
          .to(root.querySelector(".push-dot"), { opacity: 0, duration: 0.15 })
          .to(root.querySelector(".pull-dot"), { x: -120, duration: 0.7 })
          .to(root.querySelector(".pull-dot"), { opacity: 0, duration: 0.15 });
        return tl;
      });
    },

    diff() {
      const root = svg("#viz-diff");
      return make("diff", () => {
        const tl = gsap.timeline();
        gsap.set(root.querySelectorAll(".removed, .minus"), { opacity: 0 });
        gsap.set(root.querySelectorAll(".added, .plus"), { opacity: 0, x: -8 });
        tl.from(root.querySelectorAll(".pane"), { y: 16, opacity: 0, stagger: 0.12, duration: 0.4 })
          .to(root.querySelectorAll(".removed, .minus"), { opacity: 1, duration: 0.35 })
          .to(root.querySelectorAll(".added, .plus"), { opacity: 1, x: 0, duration: 0.4 }, "-=0.1");
        return tl;
      });
    },

    merge() {
      const root = svg("#viz-merge");
      return make("merge", () => {
        const feat = root.querySelector(".feature-path");
        const len = feat.getTotalLength();
        const tl = gsap.timeline();
        gsap.set(feat, { strokeDasharray: len, strokeDashoffset: len });
        gsap.set(root.querySelectorAll(".feature-n, .feature-n2, .merge-n"), { scale: 0, transformOrigin: "50% 50%" });
        tl.to(feat, { strokeDashoffset: 0, duration: 1, ease: "power2.inOut" })
          .to(root.querySelector(".feature-n"), { scale: 1, duration: 0.25, ease: "back.out(1.6)" }, 0.35)
          .to(root.querySelector(".feature-n2"), { scale: 1, duration: 0.25, ease: "back.out(1.6)" }, 0.6)
          .to(root.querySelector(".merge-n"), { scale: 1, duration: 0.4, ease: "back.out(1.8)" }, 0.9);
        return tl;
      });
    },

    rebase() {
      const root = svg("#viz-rebase");
      return make("rebase", () => {
        const a = root.querySelector(".feat-a");
        const b = root.querySelector(".feat-b");
        const tl = gsap.timeline();
        gsap.set([a, b], { x: 0, y: 0 });
        gsap.set(root.querySelector(".old-path"), { opacity: 1 });
        gsap.set(root.querySelector(".main-new"), { scale: 0, transformOrigin: "50% 50%" });
        tl.to(root.querySelector(".main-new"), { scale: 1, duration: 0.3, ease: "back.out(1.7)" })
          .to(root.querySelector(".old-path"), { opacity: 0.15, duration: 0.25 })
          .to(a, { y: 120, x: 60, duration: 0.7, ease: "power2.inOut" })
          .to(b, { y: 120, x: 70, duration: 0.7, ease: "power2.inOut" }, "<0.12")
          .to(root.querySelector(".feat-label"), { x: 70, y: 120, duration: 0.7, ease: "power2.inOut" }, "<");
        return tl;
      });
    },

    conflict() {
      const root = svg("#viz-conflict");
      return make("conflict", () => {
        const markers = root.querySelectorAll(".marker, .ours, .theirs");
        const resolved = root.querySelector(".resolved");
        const tl = gsap.timeline();
        gsap.set(markers, { opacity: 1 });
        gsap.set(resolved, { opacity: 0, scale: 0.96, transformOrigin: "0% 50%" });
        tl.from(markers, { y: 8, opacity: 0, stagger: 0.08, duration: 0.3 })
          .to(root.querySelector(".file-card"), { stroke: "#9b2c2c", duration: 0.2, yoyo: true, repeat: 3 }, 0.2)
          .to(markers, { opacity: 0, duration: 0.35 })
          .to(resolved, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.4)" });
        return tl;
      });
    },

    pr() {
      const root = svg("#viz-pr");
      return make("pr", () => {
        const tl = gsap.timeline();
        gsap.set(root.querySelectorAll(".tick"), { strokeDasharray: 20, strokeDashoffset: 20 });
        gsap.set(root.querySelector(".merge-btn"), { scale: 0.8, opacity: 0, transformOrigin: "50% 50%" });
        gsap.set(root.querySelector(".merge-btn + text"), { opacity: 0 });
        tl.from(root.querySelector(".pr-card"), { y: 24, opacity: 0, duration: 0.4 })
          .to(root.querySelector(".c1 .tick"), { strokeDashoffset: 0, duration: 0.3 })
          .to(root.querySelector(".c1 circle"), { fill: "#d5ead8", duration: 0.2 }, "-=0.1")
          .to(root.querySelector(".c2 .tick"), { strokeDashoffset: 0, duration: 0.3 })
          .to(root.querySelector(".c2 circle"), { fill: "#d5ead8", duration: 0.2 }, "-=0.1")
          .to(root.querySelector(".merge-btn"), { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(1.6)" })
          .to(root.querySelector(".merge-btn + text"), { opacity: 1, duration: 0.2 }, "-=0.2");
        return tl;
      });
    },

    issue() {
      const root = svg("#viz-issue");
      return make("issue", () => {
        const tl = gsap.timeline();
        gsap.set(root.querySelectorAll(".label-pill"), { scale: 0, transformOrigin: "50% 50%" });
        gsap.set(root.querySelector(".status"), { scale: 0, transformOrigin: "50% 50%" });
        tl.from(root.querySelector(".ticket"), { rotate: -4, y: 30, opacity: 0, duration: 0.5, ease: "power3.out" })
          .to(root.querySelectorAll(".label-pill"), { scale: 1, stagger: 0.12, duration: 0.3, ease: "back.out(1.7)" })
          .to(root.querySelector(".status"), { scale: 1, duration: 0.3, ease: "back.out(1.8)" });
        return tl;
      });
    },
  };

  const triggerMap = {
    repo: "#repo",
    clone: "#clone",
    branch: "#branch",
    commit: "#commit",
    pushPull: "#push-pull",
    diff: "#diff",
    merge: "#merge",
    rebase: "#rebase",
    conflict: "#conflict",
    pr: "#pr",
    issue: "#issue",
  };

  Object.entries(triggerMap).forEach(([name, selector]) => {
    ScrollTrigger.create({
      trigger: selector,
      start: "top 70%",
      onEnter: () => plays[name](),
      onEnterBack: () => plays[name](),
    });
  });

  document.querySelectorAll(".replay").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.play;
      if (plays[name]) plays[name]();
    });
  });

  const links = [...document.querySelectorAll(".toc a")];
  const sections = links.map((link) => document.querySelector(link.getAttribute("href")));

  const setActive = () => {
    const y = window.scrollY + 120;
    let current = sections[0];
    sections.forEach((section) => {
      if (section && section.offsetTop <= y) current = section;
    });
    links.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${current.id}`);
    });
  };

  window.addEventListener("scroll", setActive, { passive: true });
  setActive();
})();
