import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HelpForm from "@/components/HelpForm";

export default function Help() {
    return (
        <>
            <Header />
            <main className="flex min-h-screen flex-col items-center">
                <HelpForm />
            </main>
            <Footer />
        </>
    );
}
