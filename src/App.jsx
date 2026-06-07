import gsap from "gsap";
import { Draggable } from "gsap/Draggable";

import { Navbar, Welcome, Dock, Home, IOSMobile, Widgets } from "#components";
import { Finder, Resume, Safari, Terminal, Text, Image, Contact, Photos, Mail, Chess } from "#windows/index";

gsap.registerPlugin(Draggable);

const App = () => {

  return (
    <>
      <main className="mac-shell">
        <Navbar />
        <Welcome />
        <Dock />

        <Widgets />
        <Finder />
        <Safari />
        <Terminal />
        <Resume />
        <Text />
        <Image />
        <Contact />
        <Mail />
        <Chess />
        <Home />
        <Photos />
      </main>

      <IOSMobile />
    </>
  );
};

export default App;
