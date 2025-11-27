import gsap from "gsap";
import { Draggable } from "gsap/Draggable";

import { Navbar, Welcome, Dock, Home } from "#components";
import { Finder, Resume, Safari, Terminal, Text, Image, Contact, Photos } from "#windows/index";

gsap.registerPlugin(Draggable);

const App = () => {

  return (
    <main>
      <Navbar />
      <Welcome />
      <Dock />

      <Finder />
      <Safari />
      <Terminal />
      <Resume />
      <Text />
      <Image />
      <Contact />
      <Home />
      <Photos />
    </main>
  );
};

export default App; 