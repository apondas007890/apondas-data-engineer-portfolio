export const Footer = () => {
  return (
    <footer className="py-4 sm:pl-[142px] sm:pr-[40px]">
      <div className="mx-auto flex max-w-[1240px] items-center justify-center px-6 text-center">
        <div id="resume" className="relative -top-24 h-0 w-0" aria-hidden="true" />
        <p className="text-[14px] font-semibold tracking-[0.04em] text-text-muted">
          © {new Date().getFullYear()} AP. All rights reserved
        </p>
      </div>
    </footer>
  );
};
