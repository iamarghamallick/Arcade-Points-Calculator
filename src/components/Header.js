"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

const Header = () => {
    return (
        <div className="border-b bg-blue-200 dark:bg-gray-700 sticky top-0 z-10 w-full">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className='flex gap-4 text-left text-xl md:text-2xl font-bold'>
                    <Link href="/">Home</Link>
                    <Link href="/about">About</Link>
                </div>
                <div className="ml-2 flex items-center space-x-4">
                    <Link href='https://www.cloudskillsboost.google/' target='_blank'><Image src='/google-cloud-logo.webp' alt='GCP' width={60} height={60}></Image></Link>
                </div>
            </div>
        </div>
    )
}

export default Header