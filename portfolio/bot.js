(() => {
  "use strict";

  const PROFILE = {
    name: "Dr. Shashank Singh",
    role: "Assistant Professor, Department of Education (Chemistry Stream), NIT Calicut",
    email: "shashank@nitc.ac.in",
    phone: "+91 73793 71078",
    address: "673 601, Kozhikode, India",
    status: "Open to collaborations, PhD students and internships"
  };

  const PUBS = [
    {
      year: "2026",
      tag: "Highlighted by the American Peptide Society",
      title: "Visible light mediated enantioselective alkylation using a deaminative approach — access to unnatural amino acids and peptides",
      src: "Org. Lett. 2026, 28(30), 9621–9627.",
      doi: "10.1021/acs.orglett.6c02280"
    },
    {
      year: "2025",
      title: "A radical approach towards polarity-reversed para-substitution of electron-deficient arenes",
      src: "Chem. Commun. 2025, 61, 3888–3891.",
      doi: "10.1039/d4cc04914d"
    },
    {
      year: "2025",
      title: "Photoinduced stereoselective reactions using pyridinium salts as radical precursors",
      src: "Chem. Commun. 2025, 61, 3436–3446.",
      doi: "10.1039/d4cc06026a"
    },
    {
      year: "2025",
      title: "Photoinduced stereoselective Giese addition on coumarins",
      src: "Synthesis 2025, 57, 481–487.",
      doi: "10.1055/a-2413-7058"
    },
    {
      year: "2024",
      title: "Polar-effect-directed control in site-selectivity of radical substitution enables C–H perfluoroalkylation of coumarins",
      src: "J. Org. Chem. 2024, 89, 14785–14801.",
      doi: "10.1021/acs.joc.4c01469"
    },
    {
      year: "2024",
      title: "Photoinduced metal-free trifluoro/perfluoroalkylation of heteroarenes",
      src: "Org. Biomol. Chem. 2024, 22, 4072-4076.",
      doi: "10.1039/d4ob00511b"
    },
    {
      year: "2023",
      title: "Visible-light induced metal-free selenation of tryptamines / 3-substituted indoles",
      src: "Synthesis 2023, 55(21), 3685–3692.",
      doi: "10.1055/a-2112-2353"
    },
    {
      year: "2022",
      title: "Visible light induced alkylation of 2-iminochromene",
      src: "Org. Biomol. Chem. 2022, 20, 7891–7895.",
      doi: "10.1039/d2ob01584f"
    },
    {
      year: "2022",
      title: "Visible-light-driven site-selective alkylation of the benzo core of coumarins",
      src: "Chem. Commun. 2022, 58, 9674–9677.",
      doi: "10.1039/d2cc03073j"
    },
    {
      year: "2022",
      title: "Redox activated amines in organophotoinduced alkylation of coumarins",
      src: "Org. Biomol. Chem. 2022, 20, 5716–5720.",
      doi: "10.1039/d2ob00943a"
    },
    {
      year: "2020",
      title: "Stereoselective synthesis of spiro-α-methylene-γ-lactams via chiral quaternary 3-aminooxindole adducts accessed by Zn-mediated allylation of sulfinyl ketimines",
      src: "Synthesis 2020, 52(17), 2551–2562.",
      doi: "10.1055/s-0040-1707907"
    }
  ];

  const PATENTS = [
    { no: "IOPA No. 202211041300", title: "Coumarin compound and method of preparation thereof" },
    { no: "IOPA No. 202311048076", title: "Trifluoro/perfluoroalkylated aryl/alkylidene malononitriles and visible light mediated process for synthesis" }
  ];

  const listPubs = (year) =>
    PUBS.filter((p) => p.year === year)
      .map(
        (p) =>
          `<li><em>${p.title}</em><br><span class="msg__src">${p.src}</span> <a href="https://doi.org/${p.doi}" target="_blank" rel="noopener">${p.doi}</a>${p.tag ? `<br><strong>${p.tag}.</strong>` : ""}</li>`
      )
      .join("");

  const INTENTS = [
    {
      id: "greeting",
      keywords: ["hi", "hey", "hello", "yo", "morning", "evening", "afternoon", "howdy", "sup"],
      exact: ["hi", "hey", "hello", "yo", "howdy", "sup", "hiya"],
      answer: () => `Hello. I'm the assistant for ${PROFILE.name}'s laboratory page at NIT Calicut. Ask me about the research, his background, or how to get in touch.`,
      chips: ["What is his research about?", "Where does he work?", "How do I contact him?"]
    },
    {
      id: "thanks",
      keywords: ["thanks", "thank", "cheers", "appreciate", "helpful", "great", "awesome", "perfect", "nice", "cool"],
      answer: () => "Glad to help. Ask about a specific research area or the postdoctoral work if you want more depth.",
      chips: ["Tell me about the Iowa State postdoc", "What is glycochemistry?"]
    },
    {
      id: "bye",
      keywords: ["bye", "goodbye", "later", "see you", "cya", "gotta go"],
      answer: () => "Goodbye. Feel free to email if you'd like to discuss research.",
      chips: []
    },
    {
      id: "who",
      keywords: ["who is", "who are", "about him", "about shashank", "introduce", "tell me about", "who", "bio", "background", "story", "about the professor", "about you"],
      answer: () =>
        `${PROFILE.name} is an organic chemist and ${PROFILE.role}. His expertise spans <strong>synthetic organic chemistry, glycochemistry, biocatalysis, nanotechnology and chemical biology</strong>.<br><br>The central aim of his research is to design and synthesise functional molecules and catalytic systems that address challenges at the interface of chemistry and biology — bridging fundamental chemistry with real-world applications in catalysis, biotechnology and medicine.`,
      chips: ["What are his research interests?", "Where did he do his PhD?", "How do I contact him?"]
    },
    {
      id: "interests",
      keywords: ["research interest", "interests", "what does he research", "what is the research", "research", "field", "fields", "topic", "topics", "work on", "studies", "focus", "areas", "discipline"],
      answer: () =>
        "Five core areas:<ul><li><strong>Synthetic organic chemistry</strong> — methodology, molecular design, reaction mechanisms</li><li><strong>Glycochemistry</strong> — oligosaccharides, glycosynthase engineering, glycoacylation</li><li><strong>Biocatalysis</strong> — engineered enzymes and hybrid catalysts</li><li><strong>Nanotechnology</strong> — nanomaterials as catalytic platforms</li><li><strong>Chemical biology</strong> — chemical tools to probe and manipulate biology</li></ul>All of it points at one goal: molecular systems that bridge fundamental chemistry with real-world application.",
      chips: ["Tell me about the Iowa State work", "What is the Bonn project?", "How do I contact him?"]
    },
    {
      id: "role",
      keywords: ["job title", "role", "position", "work at", "company", "employer", "where does he work", "nit calicut", "nitc", "calicut", "kozhikode", "professor", "faculty", "teaches", "teaching", "department", "institute", "current role", "present"],
      answer: () =>
        `He is an <strong>Assistant Professor</strong> in the <strong>Department of Education (Chemistry Stream)</strong> at the <strong>National Institute of Technology Calicut</strong>, Kozhikode, India — 673 601.<br><br>Alongside teaching, he is building an independent research programme spanning synthetic organic chemistry, glycochemistry, biocatalysis, nanotechnology and chemical biology.`,
      chips: ["What are his research interests?", "Is he taking PhD students?", "How do I contact him?"]
    },
    {
      id: "location",
      keywords: ["where is", "location", "based", "city", "country", "address", "postal", "pin", "673", "india", "kerala"],
      answer: () => `He's based at NIT Calicut, Kozhikode, India — postal code 673 601. The full address is:<br><br>Department of Education (Chemistry Stream)<br>National Institute of Technology Calicut<br>673 601, Kozhikode, India`,
      chips: ["How do I contact him?"]
    },
    {
      id: "phd",
      keywords: ["phd", "ph.d", "doctorate", "doctoral", "iit delhi", "iit", "ravi p singh", "ravi singh", "singh", "thesis", "dissertation", "2019", "2024", "education", "degree", "university", "where did he study", "study", "studied", "training", "hetero", "heterocycle", "oligosaccharide"],
      answer: () =>
        "His Ph.D. is in <strong>Organic Chemistry from IIT Delhi (2019–2024)</strong>, supervised by <strong>Prof. Ravi P. Singh</strong>.<br><br>His doctoral research centred on the <strong>synthesis of heterocycles and oligosaccharides</strong>, which gave him a strong grounding in synthetic methodology, molecular design, reaction mechanisms and advanced structural characterisation using modern analytical techniques.",
      chips: ["What did he do in Iowa State?", "What are his research interests?"]
    },
    {
      id: "iowa",
      keywords: ["iowa", "iowa state", "ames", "yan zhao", "postdoc", "post-doc", "postdoctoral", "first postdoc", "2024", "2025", "glycosynthase", "glycoacylation", "biocatalyst", "nanoparticle conjugate", "conjugate", "enzymology", "catalytic platform"],
      answer: () =>
        "At <strong>Iowa State University, Ames (2024–2025)</strong> he was a Postdoctoral Research Associate in the laboratory of <strong>Prof. Yan Zhao</strong>.<br><br>There he expanded into <strong>glycosynthase engineering and glycoacylation</strong>, and developed <strong>libraries of biocatalyst–nanoparticle conjugates</strong>, demonstrating their catalytic applications. The work deliberately combined organic synthesis, enzymology and nanotechnology to build genuinely interdisciplinary catalytic platforms.",
      chips: ["What did he do in Bonn?", "What is glycochemistry?", "What are his research interests?"]
    },
    {
      id: "bonn",
      keywords: ["bonn", "germany", "kohn", "maja", "köhn", "cell biology", "university of bonn", "2026", "second postdoc", "chemical biology", "manipulate biological"],
      answer: () =>
        "He is a <strong>Post-Doctoral Fellow in the Department of Cell Biology at the University of Bonn (2025–2026)</strong>, in the laboratory of <strong>Prof. Maja Köhn</strong>.<br><br>There he broadened his expertise into <strong>chemical biology</strong>, exploring the application of chemical tools to understand and manipulate biological processes.",
      chips: ["What did he do in Iowa State?", "What is chemical biology?"]
    },
    {
      id: "chemicalbiology",
      keywords: ["chemical biology", "chemical tool", "chem bio", "biolog", "cell", "probe", "manipulate", "medicine", "biotech"],
      answer: () =>
        "Chemical biology is where his postdoctoral work in Bonn sits: using designed molecules as <strong>tools to understand and manipulate biological processes</strong> rather than simply as end products. It extends the chemistry side of his work toward real questions in cell biology — one of the clearest examples of the chemistry–biology interface that defines his research.",
      chips: ["What are his research interests?", "Where does he work now?"]
    },
    {
      id: "glyco",
      keywords: ["glycochemistry", "glyco", "sugar", "sugars", "carbohydrate", "oligosaccharide", "oligosaccharides", "glycoside", "glycan", "glycans", "glycosidase", "glycosynthase", "glycoacylation"],
      answer: () =>
        "Glycochemistry runs through his whole career. His Ph.D. at IIT Delhi involved the <strong>synthesis of heterocycles and oligosaccharides</strong>; at Iowa State he moved into <strong>glycosynthase engineering and glycoacylation</strong>.<br><br>In short: making sugars and sugar-containing molecules, then using enzymes to build and modify them with the precision that pure chemical synthesis alone can't reach.",
      chips: ["Tell me about the Iowa State work", "What is biocatalysis?"]
    },
    {
      id: "biocatalysis",
      keywords: ["biocatalysis", "enzyme", "enzymes", "enzymology", "catalysis", "catalytic", "catalyst", "hybrid", "immobilis", "immobiliz", "conjugate"],
      answer: () =>
        "Biocatalysis in his work means <strong>engineered enzymes used as selective, mild catalysts</strong> — and combining them with materials. The Iowa State work built <strong>libraries of biocatalyst–nanoparticle conjugates</strong> and demonstrated their catalytic applications, which is a distinctly hybrid approach: organic synthesis makes the molecule, enzymology makes it selective, nanotechnology makes it reusable.",
      chips: ["What is nanotechnology in his research?", "Tell me about the Iowa State work"]
    },
    {
      id: "nano",
      keywords: ["nanotechnology", "nanomaterial", "nanomaterials", "nano", "particle", "particles", "material", "materials", "platform", "platforms"],
      answer: () =>
        "Nanotechnology appears in his work mainly as <strong>nanomaterials used as catalytic platforms</strong> — pairing inorganic materials with organic synthesis and enzymes. The biocatalyst–nanoparticle conjugate libraries from Iowa State are the clearest example: the nanoparticle is the scaffold, the enzyme or organic moiety does the chemistry.",
      chips: ["Tell me about the Iowa State work", "What are his research interests?"]
    },
    {
      id: "synthesis",
      keywords: ["synthetic", "synthesis", "methodology", "reaction", "mechanism", "mechanisms", "molecular design", "heterocycle", "heterocycles", "characterisation", "characterization", "analytical", "nmr", "spectroscopy", "technique", "techniques"],
      answer: () =>
        "Synthetic methodology and molecular design are the foundation of his training. The Ph.D. work on <strong>heterocycle and oligosaccharide synthesis</strong> gave him both the reaction-mechanism understanding and the hands-on <strong>advanced structural characterisation</strong> skills that the later biocatalysis and chemical-biology work depends on.",
      chips: ["What did he do in Iowa State?", "What are his research interests?"]
    },
    {
      id: "experience",
      keywords: ["experience", "career", "history", "cv", "resume", "résumé", "where has he worked", "worked", "positions", "timeline", "posts"],
      answer: () =>
        "A short trajectory:<ul><li><strong>2019–2024</strong> — Ph.D. Organic Chemistry, IIT Delhi (Prof. Ravi P. Singh)</li><li><strong>2024–2025</strong> — Postdoctoral Research Associate, Iowa State University (Prof. Yan Zhao)</li><li><strong>2025–2026</strong> — Post-Doctoral Fellow, University of Bonn (Prof. Maja Köhn)</li><li><strong>Present</strong> — Assistant Professor, NIT Calicut</li></ul>",
      chips: ["Where does he work now?", "How do I contact him?"]
    },
    {
      id: "students",
      keywords: ["phd student", "phd students", "students", "student", "internship", "intern", "internships", "msc", "mtech", "btech", "joining", "recruit", "recruiting", "opportunity", "opportunities", "position", "opening", "available", "collaboration", "collaborate", "collaborating"],
      answer: () => `He is <strong>${PROFILE.status}</strong>.<br><br>Whether you're a prospective PhD student, an intern, or a potential collaborator, email is the fastest way to reach him:<br><a href="mailto:${PROFILE.email}">${PROFILE.email}</a>`,
      chips: ["How do I contact him?", "What are his research interests?"]
    },
    {
      id: "contact",
      keywords: ["contact", "email", "e-mail", "reach", "get in touch", "touch", "message", "talk", "phone", "call", "mobile", "whatsapp", "write", "social"],
      answer: () =>
        `Three ways:<ul><li>Email — <a href="mailto:${PROFILE.email}">${PROFILE.email}</a></li><li>Phone — <a href="tel:+917379371078">${PROFILE.phone}</a></li><li>Post — Department of Education (Chemistry Stream), NIT Calicut, 673 601, Kozhikode, India</li></ul>There's also a contact form in the <a href="#contact" data-bot-jump="#contact">Contact</a> section.`,
      chips: ["What are his research interests?", "Is he taking PhD students?"]
    },
    {
      id: "why",
      keywords: ["why work", "why study", "why hire", "why him", "why should", "worth", "different", "special", "unique", "strength", "strengths", "good at", "passion", "passionate", "why this lab"],
      answer: () =>
        "The research is unusually well connected. Most people work in one of synthetic chemistry, glycobiology or nanomaterials; his background spans all three, plus two postdoctoral labs on two different continents. The <strong>biocatalyst–nanoparticle conjugates</strong> from Iowa State are the clearest proof — organic synthesis, enzymology and nanomaterials in one platform. Add a chemical-biology postdoc on top, and you get a group that can take a molecule from design all the way to biological application.",
      chips: ["What are his research interests?", "Is he taking PhD students?"]
    },
    {
      id: "publications",
      keywords: ["publication", "publications", "paper", "papers", "journal", "journals", "cite", "citation", "google scholar", "orcid", "cv", "resume", "résumé", "bibliography", "published", "publish", "how many papers", "list of papers"],
      answer: () =>
        `He has <strong>${PUBS.length} papers</strong> and <strong>${PATENTS.length} granted patents</strong>, largely in visible-light-mediated and radical chemistry.<br><br>Most recent:<ul>${listPubs("2026")}${listPubs("2025")}</ul>The full list, with all years from 2020 onward, is in the <a href="#publications" data-bot-jump="#publications">Publications</a> section.`,
      chips: ["Tell me about the 2026 paper", "What are the patents?", "Show me all publications"]
    },
    {
      id: "pub2026",      keywords: ["2026", "unnatural amino acid", "amino acid", "amino acids", "peptide", "peptides", "enantioselective", "enantioselectivity", "deaminative", "organolett", "org lett", "american peptide"],
      answer: () =>
        "The 2026 paper is <em>Visible light mediated enantioselective alkylation using a deaminative approach — access to unnatural amino acids and peptides</em> (<i>Org. Lett.</i> 2026, 28(30), 9621–9627), with Altaf Ansari, Shreya Tewari, Diksha Gambhir and Prof. Ravi P. Singh.<br><br>It was <strong>highlighted by the American Peptide Society</strong> — the deaminative strategy makes non-canonical amino acids and peptides accessible under visible light, which is the clearest link between his synthetic-organic background and the peptide/biological side of the group's interests.",
      chips: ["Show me all publications", "What else does he work on?", "How do I contact him?"]
    },
    {
      id: "patents",
      keywords: ["patent", "patents", "iopa", "invention", "granted"],
      answer: () =>
        `He has <strong>${PATENTS.length} granted patents</strong>:<ul>${PATENTS.map((p) => `<li>${p.title}<br><span class="msg__src">${p.no}</span></li>`).join("")}</ul>Both come out of the visible-light and coumarin chemistry — one on coumarin compounds and their preparation, one on trifluoro/perfluoroalkylated malononitriles and the visible-light process for making them.`,
      chips: ["Show me all publications", "What is his photoredox work?"]
    },
    {
      id: "photoredox",
      keywords: ["photoredox", "photochemistry", "photochemical", "visible light", "visible-light", "organophoto", "radical", "radicals", "radical chemistry", "perfluoroalkylation", "trifluoroalkylation", "fluoroalkylation", "giese", "pyridinium", "selenation", "coumarin", "coumarins", "chromene", "spiro", "aminooxindole", "sulfinyl ketimine", "dearomative", "site-selective", "regioselective", "stereoselective", "enantio"],
      answer: () =>
        "This is the core of his publication record. The through-line is <strong>visible-light-mediated radical chemistry</strong>, done metal-free and with tight control over where and with what stereochemistry the reaction happens:<ul><li><strong>Coumarins</strong> — site-selective and stereoselective C–H functionalisation, Giese additions, alkylation of 2-iminochromenes</li><li><strong>Perfluoroalkylation</strong> — metal-free trifluoro/perfluoroalkylation of heteroarenes, and polarity effects dictating site-selectivity</li><li><strong>Radical precursors</strong> — pyridinium salts as radical sources; redox-activated amines</li><li><strong>Stereoselectivity</strong> — enantioselective deaminative alkylation, spiro-α-methylene-γ-lactams via chiral 3-aminooxindoles</li><li><strong>Selenation</strong> — visible-light metal-free selenation of tryptamines and 3-alkyl indoles</li></ul>Two of these have been patented.",
      chips: ["Show me all publications", "What are the patents?", "What are his research interests?"]
    },
    {
      id: "help",
      keywords: ["help", "what can you", "how does this work", "who are you", "what are you", "commands", "options", "menu", "how do i use", "examples", "questions"],
      answer: () =>
        "I'm a small offline assistant built into this page — I match your question against what this laboratory has shared. I can tell you about:<ul>research interests · publications and patents · the PhD at IIT Delhi · the postdocs at Iowa State and Bonn · the current role at NIT Calicut · PhD students and collaborations · contact details</ul>Try \"what is his photoredox work?\" or \"tell me about the 2026 paper\".",
      chips: ["What are his research interests?", "Show me all publications", "How do I contact him?"]
    }
  ];

  const FALLBACK =
    "I don't have anything on that. I can help with the research interests, publications and patents, the PhD at IIT Delhi, the postdoctoral work at Iowa State and Bonn, the current role at NIT Calicut, PhD students and collaborations, or contact details.";

  /* ---------- dom ---------- */

  const fab = document.getElementById("botFab");
  const panel = document.getElementById("botPanel");
  const closeBtn = document.getElementById("botClose");
  const log = document.getElementById("botLog");
  const chipsRow = document.getElementById("botChips");
  const form = document.getElementById("botForm");
  const input = document.getElementById("botInput");
  const sendBtn = form.querySelector(".bot__send");
  const badge = document.getElementById("botBadge");

  if (!fab || !panel || !form) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let busy = false;

  const normalize = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}\s?.]/gu, " ").replace(/\s+/g, " ").trim();

  function match(raw) {
    const text = normalize(raw);
    if (!text) return null;

    const exactHit = INTENTS.find((i) => i.exact?.includes(text));
    if (exactHit) return exactHit;

    const words = text.split(" ");
    let best = null;
    let bestScore = 0;

    for (const intent of INTENTS) {
      let score = 0;
      for (const kw of intent.keywords) {
        if (text.includes(kw)) score += kw.includes(" ") ? 3 : 2;
        else if (words.includes(kw)) score += 1;
      }
      if (score > bestScore) {
        bestScore = score;
        best = intent;
      }
    }
    return bestScore >= 2 ? best : null;
  }

  function addMessage(text, who, html = false) {
    const el = document.createElement("div");
    el.className = `msg msg--${who}`;
    if (html) el.innerHTML = text;
    else el.textContent = text;
    log.append(el);
    log.scrollTop = log.scrollHeight;
    return el;
  }

  function showTyping() {
    const el = document.createElement("div");
    el.className = "typing";
    el.setAttribute("aria-label", "Assistant is typing");
    el.innerHTML = "<span></span><span></span><span></span>";
    log.append(el);
    log.scrollTop = log.scrollHeight;
    return el;
  }

  function setChips(items = []) {
    chipsRow.replaceChildren();
    items.forEach((label) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "chip";
      b.textContent = label;
      b.addEventListener("click", () => ask(label));
      chipsRow.append(b);
    });
  }

  function reply(raw) {
    busy = true;
    sendBtn.disabled = true;
    setChips([]);

    const typing = showTyping();
    const intent = match(raw);
    const delay = reduced ? 0 : 420 + Math.random() * 380;

    setTimeout(() => {
      typing.remove();
      addMessage(intent ? intent.answer() : FALLBACK, "bot", true);
      setChips(intent ? intent.chips : ["What are his research interests?", "Where does he work now?", "How do I contact him?"]);
      busy = false;
      sendBtn.disabled = false;
      input.focus();
    }, delay);
  }

  function ask(text) {
    if (busy) return;
    const value = text.trim();
    if (!value) return;
    addMessage(value, "user");
    reply(value);
  }

  function setOpen(open) {
    panel.hidden = !open;
    fab.setAttribute("aria-expanded", String(open));
    if (open) {
      badge.classList.add("is-hidden");
      if (!log.children.length) greet();
      window.setTimeout(() => input.focus(), 60);
    }
  }

  function greet() {
    addMessage(
      `Hello 👋 I'm the assistant for ${PROFILE.name}'s laboratory at NIT Calicut. Ask me about the research areas, the publications and patents, or how to reach him.`,
      "bot"
    );
    setChips(["What are his research interests?", "Show me all publications", "Where did he do his PhD?", "How do I contact him?"]);
  }

  /* ---------- events ---------- */

  fab.addEventListener("click", () => setOpen(true));
  closeBtn.addEventListener("click", () => {
    setOpen(false);
    fab.focus();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    ask(input.value);
    input.value = "";
  });

  log.addEventListener("click", (e) => {
    const jump = e.target.closest("[data-bot-jump]");
    if (!jump) return;
    setOpen(false);
    document.querySelector(jump.dataset.botJump)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape" || panel.hidden) return;
    setOpen(false);
    fab.focus();
  });

  document.addEventListener("click", (e) => {
    if (panel.hidden) return;
    if (!panel.contains(e.target) && !fab.contains(e.target)) setOpen(false);
  });

  window.setTimeout(() => {
    if (panel.hidden) badge.classList.remove("is-hidden");
  }, 4000);
})();
