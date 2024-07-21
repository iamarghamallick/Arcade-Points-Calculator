import Footer from "@/components/Footer";
import Form from "@/components/Form";
import Header from "@/components/Header";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center">
        <Form />
      </main>
      <Footer />
    </>
  );
}
