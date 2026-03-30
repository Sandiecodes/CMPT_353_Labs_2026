export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center py-32 px-16 bg-white dark:bg-black text-center">
        <div className="flex flex-col items-center gap-8">
          <h1 className="text-4xl font-bold text-black dark:text-white">
            Welcome to Admin Dashboard
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-md">
            Manage users and system administration tasks from one place.
          </p>
          <div className="flex flex-col gap-4 w-full sm:flex-row sm:justify-center">
            <a
              href="/login"
              className="flex h-12 items-center justify-center rounded-lg bg-blue-600 px-8 text-white font-semibold transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Login
            </a>
            <a
              href="/register"
              className="flex h-12 items-center justify-center rounded-lg border-2 border-blue-600 px-8 text-blue-600 font-semibold transition-colors hover:bg-blue-50 dark:border-blue-500 dark:text-blue-400 dark:hover:bg-slate-900"
            >
              Register
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
