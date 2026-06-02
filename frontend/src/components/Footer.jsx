const defaultLinks = ["COLLECTIONS", "ABOUT", "JOURNAL", "CONTACT", "PRIVACY"];

function Footer({ links = defaultLinks }) {
  return (
    <footer className="bg-primary text-on-primary py-12 flex flex-col items-center gap-6 px-8 mt-auto">
      <span className="font-display text-[22px] tracking-[0.2em] uppercase cursor-pointer">
        LUMIÈRE
      </span>
      <nav className="flex flex-wrap justify-center gap-6">
        {links.map((item) => (
          <a
            key={item}
            href="#"
            className="font-body text-[11px] tracking-[0.12em] uppercase text-on-primary/60 hover:text-secondary-container transition-colors cursor-pointer"
          >
            {item}
          </a>
        ))}
      </nav>
      <span className="font-body text-[11px] tracking-[0.1em] uppercase text-on-primary/40">
        © 2024 LUMIÈRE. ALL RIGHTS RESERVED.
      </span>
    </footer>
  );
}

export default Footer;
