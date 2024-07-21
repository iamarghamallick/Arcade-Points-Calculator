import Footer from "@/components/Footer";
import Form from "@/components/Form";
import Header from "@/components/Header";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-center">
        {/* <Form /> */}
        <h1 className="text-green-400 text-center">We are under maintenance, setting up for the phase 2 of the Arcade Event.</h1>
      </main>
      <Footer />
    </>
  );
}
