import { NextResponse } from "next/server";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzKwTNzC1Z8gp0N0eaAU0l7Lckmzf8r8c8lPJJncgRTfUkIBTmIsU9lSW_1SHIxxYdfMw/exec";

export async function POST(req) {
    const formData = await req.formData();

    try {
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            console.log('Form successfully submitted');
            return NextResponse.json({
                "message": "Form successfully submitted",
            },
                { status: 200 }
            );
        } else {
            console.error('Form submission error');
            return NextResponse.json({
                "message": "Form submission error",
            },
                { status: 404 }
            );
        }
    } catch (error) {
        console.error('Form submission error:', error);
        return NextResponse.json({
            "message": "Form submission error",
            "error": error
        },
            { status: 501 }
        );
    }
};