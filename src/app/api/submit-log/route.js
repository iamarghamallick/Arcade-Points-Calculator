import { NextResponse } from "next/server";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxb1wEUiHYWg15sMfFLJ_k7gOLOIx6h54PN9Wtjvm_NqpEe9fbqE6EQreQuLP7-1Gok/exec";

export async function POST(req) {
    const logData = await req.json();

    const formData = new FormData();
    formData.append('public_profile_url', logData.public_profile_url);
    formData.append('arcade_points', logData.arcade_points);
    formData.append('response_time', logData.response_time);

    try {
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            console.log('Log successfully submitted');
            return NextResponse.json({
                "message": "Log successfully submitted",
            },
                { status: 200 }
            );
        } else {
            console.error('Log submission error');
            return NextResponse.json({
                "message": "Log submission error",
            },
                { status: 404 }
            );
        }
    } catch (error) {
        console.error('Log submission error:', error);
        return NextResponse.json({
            "message": "Log submission error",
            "error": error
        },
            { status: 501 }
        );
    }
};