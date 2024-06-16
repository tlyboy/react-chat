function Component() {
  return (
    <main className="px-4 py-10 text-center text-gray-700 dark:text-gray-200">
      <Outlet />
      <NavBar className="mt-6" />
    </main>
  )
}

export default Component
