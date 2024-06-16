import classNames from 'classnames'

function NavBar({ className }: { className?: string }) {
  return (
    <nav className={classNames('flex justify-center gap-2 text-xl', className)}>
      <button
        className="icon-btn i-carbon-sun dark:i-carbon-moon"
        title="切换深色模式"
        onClick={toggleDark}
      ></button>

      <a
        className="icon-btn i-carbon-logo-github"
        href="https://github.com/tlyboy/react-chat"
        target="_blank"
        rel="noopener noreferrer"
        title="GitHub"
      ></a>
    </nav>
  )
}

export default NavBar
