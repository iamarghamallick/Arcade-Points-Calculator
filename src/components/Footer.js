import Link from 'next/link';
import React from 'react'
import { FaFacebook, FaGithub, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gray-300 dark:bg-gray-700 text-white py-4">
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