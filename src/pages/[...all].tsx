function All() {
  const navigate = useNavigate()

  return (
    <main className="px-4 py-10 text-center text-[#3498db] dark:text-gray-200">
      <div className="text-4xl">
        <div className="i-carbon-warning inline-block"></div>
      </div>
      <div>未找到页面</div>
      <div>
        <button className="btn m-3 mt-8 text-sm" onClick={() => navigate(-1)}>
          返回
        </button>
      </div>
    </main>
  )
}

export default All
