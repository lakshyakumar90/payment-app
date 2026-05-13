export default function AppGroupLayout({children}: {children: React.ReactNode}) {
    return (
        <main className="min-h-screen w-full flex items-center justify-center">
            <header>
                <h1 className="text-2xl font-bold">Header</h1>
            </header>
            <main className="flex-1">
                {children}
            </main>
            <footer>
                <h1 className="text-2xl font-bold">Footer</h1>
            </footer>
        </main>
    )
}