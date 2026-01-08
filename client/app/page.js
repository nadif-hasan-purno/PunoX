export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="flex flex-col items-center justify-center gap-8 px-8 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
            PunoXdev
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Portfolio & Content Management System
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl">
            A modern portfolio platform for posting blogs, documentation, and showcasing projects.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <a
            href="/blogs"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            View Blogs
          </a>
          <a
            href="/projects"
            className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors dark:bg-gray-800 dark:text-white dark:border-white dark:hover:bg-gray-700"
          >
            View Projects
          </a>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Blogs</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Share your thoughts and insights through engaging blog posts.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Documentation</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Create and maintain comprehensive documentation for your work.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Projects</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Showcase your portfolio projects with detailed information.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
