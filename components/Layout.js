import Navigation from "./navigation";

export default function Layout({children}) {
    return (
        <>
            <Navigation />
            <main className="sm:mx-auto w-full max-w-5xl sm:w-5/6 md:w-3/4 lg:w-2/3 xl:2/3">
                {children}
            </main>
        </>
    )
}