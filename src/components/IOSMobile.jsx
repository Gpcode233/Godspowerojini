import { useMemo, useState } from "react";
import clsx from "clsx";
import { Document, Page, pdfjs } from "react-pdf";

import { locations, blogPosts, techStack, gallery, socials } from "#constants";
import { ChevronLeft } from "lucide-react";

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
];

const dockIcons = [
  { id: "phone", icon: "/images/ios/ios-contact.png" },
  { id: "message", icon: "/images/ios/ios-message.png" },
  { id: "music", icon: "/images/ios/ios-music.png" },
  { id: "safari", icon: "/images/ios/ios-safari.png" },
];

const SectionHeader = ({ title, onBack }) => (
  <header className="ios-header">
    <button type="button" onClick={onBack}>
      <ChevronLeft className="text-blue-500" />
    </button>
    <h2 className="text-blue-500">{title}</h2>
    <img src="/images/ios/ios-statusbar.png" alt="status bar" />
  </header>
);

const IOSMobile = () => {
  const [activeScreen, setActiveScreen] = useState("home");
  const [selectedProject, setSelectedProject] = useState(null);

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
      <div className="ios-status">
        <img src="/images/ios/ios-statusbar.png" alt="status bar" />
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
            <span style={{ color: "#f3f4f6" }}>{label}</span>
          </button>
        ))}
      </div>

      <div className="ios-dock">
        {dockIcons.map(({ id, icon }) => (
          <div key={id}>
            <img src={icon} alt={id} />
          </div>
        ))}
      </div>
    </div>
  );

  const renderWork = () => (
    <div className="ios-screen">
      <SectionHeader title="Work" onBack={goBack} />

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
  );

  const renderProjectDetail = () => {
    if (!selectedProject) return null;

    return (
      <div className="ios-screen">
        <SectionHeader title={selectedProject.name} onBack={goBack} />

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
    );
  };

  const renderPhotos = () => (
    <div className="ios-screen">
      <SectionHeader title="All Photos" onBack={goBack} />

      <div className="ios-grid">
        {gallery.map(({ id, img }) => (
          <img key={id} src={img} alt={`Gallery ${id}`} />
        ))}
      </div>
    </div>
  );

  const renderBlog = () => (
    <div className="ios-screen">
      <SectionHeader title="Safari" onBack={goBack} />

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
  );

  const renderContact = () => (
    <div className="ios-screen">
      <SectionHeader title="Contact Me" onBack={goBack} />

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
  );

  const renderNotes = () => (
    <div className="ios-screen">
      <SectionHeader title="Tech Stack" onBack={goBack} />

      <div className="ios-notes">
        {techStack.map(({ category, items }) => (
          <article key={category}>
            <p>{category}</p>
            <span>{items.join(", ")}</span>
          </article>
        ))}
      </div>
    </div>
  );

  const renderResume = () => (
    <div className="ios-screen">
      <SectionHeader title="Resume" onBack={goBack} />

      <div className="ios-resume">
        <Document file="files/resume.pdf">
          <Page pageNumber={1} renderTextLayer={false} renderAnnotationLayer={false} />
        </Document>
        <a href="files/resume.pdf" download>
          Download Resume
        </a>
      </div>
    </div>
  );

  const renderAbout = () => (
    <div className="ios-screen">
      <SectionHeader title="About Me" onBack={goBack} />

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
  };

  return (
    <section className={clsx("ios-shell", { "ios-shell--active": activeScreen })}>
      <div className="ios-device">
        {(screenContent[activeScreen] ?? renderHome)()}
      </div>
    </section>
  );
};

export default IOSMobile;

