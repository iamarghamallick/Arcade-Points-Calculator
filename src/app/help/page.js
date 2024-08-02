import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HelpForm from "@/components/HelpForm";

export default function Help() {
    return (
        <>
            <Header />
            <main className="flex min-h-screen flex-col items-center">
                <h1 className="text-xl text-blue-950 dark:text-gray-200 mt-4">User Query Form</h1>
                <HelpForm />
            </main>
            <Footer />
        </>
    );
}
