import Link from 'next/link';
import React from 'react'
import { FaFacebook, FaGithub, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gray-300 dark:bg-gray-700 text-white py-1">
            <div className="container mx-auto text-center relative overflow-hidden">
                <div className="scrolling-text text-gray-300 text-sm">
                    <span className="underline">Disclaimer</span>: This <Link href={'/'}>Arcade Points Calculator</Link> system is an unofficial release and is not supported by Google. While every effort has been made to ensure the accuracy and functionality of this system, it is provided on an "as-is" basis without any guarantees. The developer of this system is not responsible for any inaccuracies in the Arcade Points once the Prize Counter opens. For official information and support, please refer to the <Link href={'https://www.cloudskillsboost.google/'} target='_blank'>GCSB chat support</Link>.
                </div>
            </div>
            <hr className='my-1' />
            <div className="container mx-auto px-4 flex flex-col lg:flex-row-reverse items-center justify-center lg:justify-between">
                <div className="my-2 flex justify-center items-center">
                    <Link href='https://github.com/iamarghamallick' target='_blank'><FaGithub size={30} className='mx-2 text-gray-900 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white' /></Link>
                    <Link href='https://in.linkedin.com/in/iamarghamallick' target='_blank'><FaLinkedin size={30} className='mx-2 text-gray-900 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white' /></Link>
                    <Link href='https://twitter.com/iamarghamallick' target='_blank'><FaTwitter size={30} className='mx-2 text-gray-900 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white' /></Link>
                    <Link href='https://facebook.com/iam_arghamallick' target='_blank'><FaFacebook size={30} className='mx-2 text-gray-900 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white' /></Link>
                    <Link href='https://instagram.com/iamarghamallick' target='_blank'><FaInstagram size={30} className='mx-2 text-gray-900 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white' /></Link>
                </div>
                <p className="text-[1rem] lg:text-xl my-2 text-gray-300 text-center">&copy; Developed for <strong><Link href="https://go.cloudskillsboost.google/arcade">Arcade 2024 (Phase 2)</Link></strong> by <Link href="https://iamarghamallick.github.io/portfolio/" target='_blank'><strong>Argha Mallick</strong></Link></p>
            </div>
        </footer>
    )
}

export default Footer