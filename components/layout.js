import Navigation from "./navigation";

export default function Layout({children}) {
    return (
        <>
            <Navigation />
            <main className="sm:mx-auto w-full max-w-5xl lg:w-5/6 xl:w-2/3">
                {children}
            </main>
        </>
    )
}