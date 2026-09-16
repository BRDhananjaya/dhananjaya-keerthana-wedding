(function () {
  "use strict";

  var C = window.CONTENT;
  var lang = localStorage.getItem("invite-lang") || "en";

  /* ---------- Language ---------- */
  function applyLanguage(next) {
    lang = next;
    var dict = C[lang];
    document.documentElement.lang = dict.htmlLang;
    document.title = dict.docTitle;

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var value = dict[el.dataset.i18n];
      if (value !== undefined) el.innerHTML = value;
    });

    // Set separately: the button holds SVG icons that innerHTML would wipe out
    var btn = document.getElementById("musicToggle");
    btn.title = dict.musicToggleTitle;
    btn.setAttribute("aria-label", dict.musicToggleTitle);

    buildWhatsAppLink();
    localStorage.setItem("invite-lang", lang);
  }

  document.getElementById("langToggle").addEventListener("click", function () {
    applyLanguage(lang === "en" ? "kn" : "en");
  });

  /* ---------- Cover ---------- */
  var cover = document.getElementById("cover");

  function openInvite() {
    // First and synchronous: browsers only grant audio the user-gesture stack,
    // so nothing async may come before this call
    if (musicWanted) playMusic();

    cover.classList.add("is-open");
    document.body.classList.remove("is-cover");
    document.getElementById("invite").style.opacity = "1";
    window.scrollTo({ top: 0 });
    setTimeout(startReveal, 80);
  }

  document.getElementById("openBtn").addEventListener("click", openInvite);

  /* ---------- Scroll reveal (armed only once the cover is opened) ---------- */
  var revealItems = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  function revealOnScroll() {
    revealItems.forEach(function (el, i) {
      if (el.classList.contains("is-visible")) return;
      if (el.getBoundingClientRect().top < window.innerHeight - 70) {
        setTimeout(function () {
          el.classList.add("is-visible");
        }, Math.min(i, 4) * 90);
      }
    });
  }

  function startReveal() {
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      revealItems.forEach(function (el) {
        io.observe(el);
      });
    } else {
      window.addEventListener("scroll", revealOnScroll);
      revealOnScroll();
    }
  }

  /* ---------- Countdown ---------- */
  var target = new Date(C.meta.muhurthamStart).getTime();
  var pad = function (n) {
    return String(n).padStart(2, "0");
  };

  function tick() {
    var diff = target - Date.now();

    if (diff <= 0) {
      document.getElementById("countdown").hidden = true;
      document.getElementById("countdownDone").hidden = false;
      clearInterval(timer);
      return;
    }

    var s = Math.floor(diff / 1000);
    document.getElementById("cdDays").textContent = pad(Math.floor(s / 86400));
    document.getElementById("cdHours").textContent = pad(Math.floor((s % 86400) / 3600));
    document.getElementById("cdMins").textContent = pad(Math.floor((s % 3600) / 60));
    document.getElementById("cdSecs").textContent = pad(s % 60);
  }

  var timer = setInterval(tick, 1000);
  tick();

  /* ---------- Maps ---------- */
  document.getElementById("mapsLink").href =
    C.meta.mapsUrl ||
    "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(C.meta.mapsQuery);

  /* ---------- Calendar (.ics with both events) ---------- */
  function icsStamp(iso) {
    return new Date(iso).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  }

  // RFC 5545 reserves comma, semicolon and backslash inside text values
  function icsText(value) {
    return String(value)
      .replace(/([\\,;])/g, "\\$1")
      .replace(/\r?\n/g, "\\n");
  }

  function vevent(uid, title, startIso, endIso, description) {
    var notes = description;
    if (C.meta.mapsUrl) notes += "\nDirections: " + C.meta.mapsUrl;

    return [
      "BEGIN:VEVENT",
      "UID:" + uid,
      "DTSTAMP:" + icsStamp(new Date().toISOString()),
      "DTSTART:" + icsStamp(startIso),
      "DTEND:" + icsStamp(endIso),
      "SUMMARY:" + icsText(title),
      "DESCRIPTION:" + icsText(notes),
      "LOCATION:" + icsText(C.meta.mapsQuery),
      "URL:" + (C.meta.mapsUrl || ""),
      "END:VEVENT"
    ].join("\r\n");
  }

  document.getElementById("calendarBtn").addEventListener("click", function () {
    var ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Dhananjaya Keerthana Wedding//EN",
      "CALSCALE:GREGORIAN",
      vevent(
        "reception-2026@dhananjaya-keerthana",
        "Reception - Dhananjaya & Keerthana",
        C.meta.receptionStart,
        C.meta.receptionEnd,
        "Reception of Dhananjaya B R and Keerthana R"
      ),
      vevent(
        "muhurtham-2026@dhananjaya-keerthana",
        "Muhurtham - Dhananjaya & Keerthana",
        C.meta.muhurthamStart,
        C.meta.muhurthamEnd,
        "Wedding of Dhananjaya B R and Keerthana R - Vrushika Lagna"
      ),
      "END:VCALENDAR"
    ].join("\r\n");

    var url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
    var a = document.createElement("a");
    a.href = url;
    a.download = "dhananjaya-keerthana-wedding.ics";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000);
  });

  /* ---------- Share ---------- */
  function shareMessage() {
    return C[lang].shareText + " " + location.href;
  }

  function buildWhatsAppLink() {
    document.getElementById("waBtn").href =
      "https://wa.me/?text=" + encodeURIComponent(shareMessage());
  }

  function flashCopied() {
    var note = document.getElementById("copied");
    note.hidden = false;
    setTimeout(function () {
      note.hidden = true;
    }, 2400);
  }

  document.getElementById("shareBtn").addEventListener("click", function () {
    var payload = {
      title: C[lang].docTitle,
      text: C[lang].shareText,
      url: location.href
    };

    if (navigator.share) {
      navigator.share(payload).catch(function () {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareMessage()).then(flashCopied, function () {});
    }
  });

  /* ---------- Music ----------
     The toggle is shown optimistically because iOS ignores metadata preloading,
     and is only removed if the file genuinely fails to load.

     The preference key is versioned on purpose. A guest who muted an earlier
     version of this page had "off" written to the old key, which would suppress
     playback forever; bumping the key retires those saved values so everyone
     gets the default-on behaviour again. */
  var MUSIC_PREF_KEY = "invite-music-2";
  var GESTURE_EVENTS = ["pointerdown", "touchstart", "click", "keydown", "scroll"];

  var audio = document.getElementById("music");
  var musicBtn = document.getElementById("musicToggle");
  var musicWanted = localStorage.getItem(MUSIC_PREF_KEY) !== "off";
  var retryArmed = false;

  audio.volume = 0.5;

  audio.addEventListener("error", function () {
    musicBtn.hidden = true;
  });

  audio.addEventListener("playing", function () {
    setMusicState(true);
    disarmRetry();
  });

  audio.addEventListener("pause", function () {
    setMusicState(false);
  });

  function setMusicState(playing) {
    musicBtn.classList.toggle("is-playing", playing);
    musicBtn.setAttribute("aria-pressed", playing ? "true" : "false");
  }

  function retryFromGesture() {
    if (!musicWanted) {
      disarmRetry();
      return;
    }
    playMusic();
  }

  // If the browser refuses the first play(), start at the next thing the guest does
  function armRetry() {
    if (retryArmed) return;
    retryArmed = true;
    GESTURE_EVENTS.forEach(function (name) {
      document.addEventListener(name, retryFromGesture, { passive: true });
    });
  }

  function disarmRetry() {
    if (!retryArmed) return;
    retryArmed = false;
    GESTURE_EVENTS.forEach(function (name) {
      document.removeEventListener(name, retryFromGesture);
    });
  }

  function playMusic() {
    var attempt = audio.play();
    if (attempt && attempt.then) {
      attempt.then(
        function () {
          setMusicState(true);
          disarmRetry();
        },
        function () {
          setMusicState(false);
          armRetry();
        }
      );
    } else {
      setMusicState(true);
    }
  }

  musicBtn.addEventListener("click", function () {
    if (audio.paused) {
      musicWanted = true;
      localStorage.setItem(MUSIC_PREF_KEY, "on");
      playMusic();
    } else {
      audio.pause();
      musicWanted = false;
      localStorage.setItem(MUSIC_PREF_KEY, "off");
      setMusicState(false);
      disarmRetry();
    }
  });

  /* ---------- Petals ---------- */
  var petalHost = document.getElementById("petals");
  var petalCount = window.matchMedia("(max-width: 600px)").matches ? 12 : 20;

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    for (var i = 0; i < petalCount; i++) {
      var p = document.createElement("span");
      var size = 7 + Math.random() * 9;
      p.className = "petal";
      p.style.left = Math.random() * 100 + "vw";
      p.style.width = size + "px";
      p.style.height = size * 0.7 + "px";
      p.style.animationDuration = 9 + Math.random() * 11 + "s";
      p.style.animationDelay = -Math.random() * 14 + "s";
      p.style.setProperty("--drift", (Math.random() * 20 - 10).toFixed(1) + "vw");
      petalHost.appendChild(p);
    }
  }

  applyLanguage(lang);
})();
