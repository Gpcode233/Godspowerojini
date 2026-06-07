import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { Document, Page, pdfjs } from "react-pdf";

import { locations, blogPosts, techStack, gallery, socials } from "#constants";
import {
  BatteryFull,
  ChevronLeft,
  Monitor,
  Signal,
  Wifi,
  X,
} from "lucide-react";
const ChessApp = lazy(() => import("./apps/chess/ChessApp"));

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const STATUS_TEXT = ["Completed", "In Review", "Prototype"];

const homeIcons = [
  { id: "work", label: "Work", icon: "/images/ios/ios-files.png", screen: "work" },
  { id: "photos", label: "Photos", icon: "/images/ios/ios-photos.png", screen: "photos" },
  { id: "blog", label: "Safari", icon: "/images/ios/ios-safari.png", screen: "blog" },
  { id: "resume", label: "Resume", icon: "/images/ios/ios-resumeicon.png", screen: "resume" },
  { id: "contact", label: "Contact", icon: "/images/ios/ios-contact.png", screen: "contact" },
  { id: "notes", label: "Tech Stack", icon: "/images/ios/iosnotes.png", screen: "notes" },
  { id: "about", label: "About", icon: "/images/ios/ios-aboutmeicon.png", screen: "about" },
  { id: "chess", label: "Chess", icon: "/images/chess-app.svg", screen: "chess" },
];

const dockIcons = [
  { id: "contact", label: "Contact", icon: "/images/ios/ios-contact.png", screen: "contact" },
  { id: "message", label: "Message", icon: "/images/ios/ios-message.png", href: "mailto:godspowerojini8@gmail.com" },
  { id: "music", label: "Music", icon: "/images/ios/ios-music.png" },
  { id: "safari", label: "Safari", icon: "/images/ios/ios-safari.png", screen: "blog" },
];

const IOSStatusBar = ({ dark = false }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className={clsx("ios-status", { "is-dark": dark })} aria-label="System status">
      <time>{now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</time>
      <span className="ios-dynamic-island" aria-hidden="true" />
      <div className="ios-status-signals" aria-hidden="true">
        <Signal size={15} strokeWidth={2.5} />
        <Wifi size={15} strokeWidth={2.5} />
        <BatteryFull size={20} strokeWidth={2.2} />
      </div>
    </div>
  );
};

const SectionHeader = ({ title, onBack }) => (
  <>
    <IOSStatusBar dark />
    <header className="ios-screen-header">
      <button type="button" onClick={onBack} aria-label="Back to Home Screen">
        <ChevronLeft />
        <span>Back</span>
      </button>
      <h2>{title}</h2>
    </header>
  </>
);

const IOSMobile = () => {
  const [activeScreen, setActiveScreen] = useState("home");
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDesktopPrompt, setShowDesktopPrompt] = useState(true);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const workProjects = locations.work?.children ?? [];
  const aboutFile = useMemo(
    () => locations.about?.children?.find((item) => item.fileType === "txt"),
    [],
  );

  const openScreen = (screen) => {
    setActiveScreen(screen);
    if (screen !== "project") {
      setSelectedProject(null);
    }
  };

  const openProject = (project) => {
    setSelectedProject(project);
    setActiveScreen("project");
  };

  const goBack = () => {
    if (activeScreen === "project") {
      setActiveScreen("work");
      setSelectedProject(null);
      return;
    }
    setActiveScreen("home");
  };

  const renderHome = () => (
    <div className="ios-home">
      <IOSStatusBar />

      <div className="ios-widget-grid">
        <section className="ios-date-widget" aria-label="Today">
          <span>{now.toLocaleDateString("en-US", { weekday: "long" })}</span>
          <strong>{now.getDate()}</strong>
          <p>{now.toLocaleDateString("en-US", { month: "long" })}</p>
        </section>

        <section className="ios-profile-widget" aria-label="Portfolio owner">
          <img src="/images/godspower.jpg" alt="" />
          <div>
            <span>Frontend Engineer</span>
            <strong>Godspower Ojini</strong>
            <p>Available for ambitious products</p>
          </div>
        </section>
      </div>

      <div className="ios-home-icons">
        {homeIcons.map(({ id, label, icon, screen }) => (
          <button
            key={id}
            type="button"
            className="ios-app-icon"
            onClick={() => openScreen(screen)}
          >
            <img src={icon} alt={label} loading="lazy" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="ios-page-dots" aria-hidden="true">
        <i className="is-active" />
        <i />
      </div>

      <div className="ios-dock">
        {dockIcons.map(({ id, label, icon, screen, href }) => (
          href ? (
            <a key={id} href={href} aria-label={label}>
              <img src={icon} alt="" />
            </a>
          ) : (
            <button
              key={id}
              type="button"
              aria-label={label}
              onClick={() => screen && openScreen(screen)}
            >
              <img src={icon} alt="" />
            </button>
          )
        ))}
      </div>

      <span className="ios-home-indicator" aria-hidden="true" />
    </div>
  );

  const renderWork = () => (
    <div className="ios-screen">
      <SectionHeader title="Work" onBack={goBack} />
      <div className="ios-screen-body">
        <ul className="ios-list">
          {workProjects.map((project, idx) => (
            <li key={project.id} onClick={() => openProject(project)}>
              <div className="ios-list-icon">
                <img src="/images/ios/ios-files.png" alt={project.name} />
              </div>

              <div>
                <p>{project.name}</p>
                <span>{STATUS_TEXT[idx % STATUS_TEXT.length]}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderProjectDetail = () => {
    if (!selectedProject) return null;

    return (
      <div className="ios-screen">
        <SectionHeader title={selectedProject.name} onBack={goBack} />
        <div className="ios-screen-body">
          <ul className="ios-list stacked">
            {selectedProject.children?.map((item) => (
              <li key={item.id}>
                <div className="ios-list-icon">
                  <img src={item.icon} alt={item.name} />
                </div>

                <div>
                  <p>{item.name}</p>

                  {item.fileType === "txt" && Array.isArray(item.description) ? (
                    <span>{item.description[0]}</span>
                  ) : null}

                  {item.fileType === "url" ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer">
                      Open link
                    </a>
                  ) : null}

                  {item.fileType === "img" ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="ios-inline-image"
                    />
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const renderPhotos = () => (
    <div className="ios-screen">
      <SectionHeader title="All Photos" onBack={goBack} />
      <div className="ios-screen-body">
        <div className="ios-grid">
          {gallery.map(({ id, img }) => (
            <img key={id} src={img} alt={`Gallery ${id}`} />
          ))}
        </div>
      </div>
    </div>
  );

  const renderBlog = () => (
    <div className="ios-screen">
      <SectionHeader title="Safari" onBack={goBack} />
      <div className="ios-screen-body">
        <div className="ios-blog-search">
          <input type="text" placeholder="Search or enter website name" />
        </div>

        <ul className="ios-card-stack">
          {blogPosts.map(({ id, title, date, image, link }) => (
            <li key={id}>
              <img src={image} alt={title} />
              <div>
                <p>{date}</p>
                <h3>{title}</h3>
                <a href={link} target="_blank" rel="noopener noreferrer">
                  Read more
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderContact = () => (
    <div className="ios-screen">
      <SectionHeader title="Contact Me" onBack={goBack} />
      <div className="ios-screen-body">
        <div className="ios-profile">
          <img src="/images/godspower.jpg" alt="profile" />
          <h3>Let&apos;s Connect</h3>
          <p>Got an idea? Or just want to talk tech? I&apos;m in.</p>
          <span>godspowerojini8@gmail.com</span>
        </div>

        <div className="ios-contact-actions">
          <button type="button" className="primary">
            Schedule a call
          </button>
          <a href="mailto:godspowerojini8@gmail.com">Email me</a>
          <a href="https://x.com/Godspowerojini" target="_blank" rel="noopener noreferrer">
            Twitter/X
          </a>
          <a
            href="https://www.linkedin.com/company/javascriptmastery/posts/?feedView=all"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </div>

        <ul className="ios-pill-grid">
          {socials.map(({ id, text, link }) => (
            <li key={id}>
              <a href={link} target="_blank" rel="noopener noreferrer">
                {text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderNotes = () => (
    <div className="ios-screen">
      <SectionHeader title="Tech Stack" onBack={goBack} />
      <div className="ios-screen-body">
        <div className="ios-notes">
          {techStack.map(({ category, items }) => (
            <article key={category}>
              <p>{category}</p>
              <span>{items.join(", ")}</span>
            </article>
          ))}
        </div>
      </div>
    </div>
  );

  const renderResume = () => (
    <div className="ios-screen">
      <SectionHeader title="Resume" onBack={goBack} />
      <div className="ios-screen-body">
        <div className="ios-resume">
          <Document file="files/resume.pdf">
            <Page pageNumber={1} renderTextLayer={false} renderAnnotationLayer={false} />
          </Document>
          <a href="files/resume.pdf" download>
            Download Resume
          </a>
        </div>
      </div>
    </div>
  );

  const renderAbout = () => (
    <div className="ios-screen">
      <SectionHeader title="About Me" onBack={goBack} />
      <div className="ios-screen-body">
        <div className="ios-about">
          <img src="/images/godspower.jpg" alt="Godspower" />
          <h3>{aboutFile?.subtitle ?? "Meet the Developer Behind the Code"}</h3>

          {Array.isArray(aboutFile?.description) ? (
            <ul>
              {aboutFile.description.map((line, idx) => (
                <li key={idx}>{line}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );

  const renderChess = () => (
    <div className="ios-screen ios-chess-screen">
      <Suspense fallback={<div className="chess-loading" aria-label="Loading Chess"><span>♞</span></div>}>
        <ChessApp variant="mobile" onCancel={goBack} />
      </Suspense>
    </div>
  );

  const screenContent = {
    home: renderHome,
    work: renderWork,
    project: renderProjectDetail,
    photos: renderPhotos,
    blog: renderBlog,
    contact: renderContact,
    notes: renderNotes,
    resume: renderResume,
    about: renderAbout,
    chess: renderChess,
  };

  return (
    <section className={clsx("ios-shell", { "ios-shell--active": activeScreen })}>
      <div className="ios-device">
        {(screenContent[activeScreen] ?? renderHome)()}

        {showDesktopPrompt ? (
          <div className="ios-desktop-prompt" role="dialog" aria-modal="true" aria-labelledby="desktop-prompt-title">
            <div className="ios-desktop-prompt-card">
              <button
                type="button"
                className="ios-prompt-close"
                aria-label="Dismiss"
                onClick={() => setShowDesktopPrompt(false)}
              >
                <X size={17} />
              </button>
              <span className="ios-prompt-icon" aria-hidden="true">
                <Monitor size={28} />
              </span>
              <h2 id="desktop-prompt-title">Best experienced on a computer</h2>
              <p>
                This mobile version is streamlined for iPhone. Open the portfolio on a desktop or
                laptop to explore the full interactive macOS experience.
              </p>
              <button type="button" className="ios-prompt-action" onClick={() => setShowDesktopPrompt(false)}>
                Continue on mobile
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default IOSMobile;

