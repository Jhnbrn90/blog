import Navigation from "./navigation";

export default function Layout({children}) {
    return (
        <>
            <Navigation />
            <main className="sm:mx-auto w-full xl:w-5/6">
                {children}
            </main>
        </>
    )
}