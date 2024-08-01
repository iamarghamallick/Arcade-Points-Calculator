import Footer from "@/components/Footer";
import Form from "@/components/Form";
import Header from "@/components/Header";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center">
        <h1 className="text-center text-xl md:text-2xl font-bold mt-4">Arcade Points Calculator</h1>
        <Form />
      </main>
      <Footer />
    </>
  );
}
