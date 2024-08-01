import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Link from "next/link";

export default function About() {
    return (
        <>
            <Header />
            <main className="flex min-h-screen flex-col items-center">
                <div className="container flex flex-col items-center">
                    <h1 className="text-center text-xl md:text-2xl font-bold m-4">Importent Links</h1>
                    <ul className="m-8">
                        <li className="text-center underline"><Link href={"https://go.cloudskillsboost.google/arcade"} target="_blank">The Arcade</Link></li>
                        <li className="text-center underline"><Link href={"https://www.cloudskillsboost.google/"} target="_blank">Cloud Skill Boost</Link></li>
                        <li className="text-center underline"><Link href={"https://www.googlecloudcommunity.com/gc/Learning-Forums/bd-p/cloud-learning-certification"} target="_blank">GCloud Community-Learning Forum</Link></li>
                    </ul>
                    <h1 className="text-gray-300 text-sm text-center m-8 mt-24">
                        <span className="underline">Disclaimer</span><br />This <Link href={'/'}>Arcade Points Calculator</Link> system is an unofficial release and is not supported by Google. While every effort has been made to ensure the accuracy and functionality of this system, it is provided on an &quot;as-is&quot; basis without any guarantees. The developer of this system is not responsible for any inaccuracies in the Arcade Points once the Prize Counter opens. For official information and support, please refer to the <Link href={'https://www.cloudskillsboost.google/'} target='_blank'>GCSB chat support</Link>.
                    </h1>
                </div>
            </main>
            <Footer />
        </>
    );
}
