import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import axios from "axios";
import cheerio from "cheerio";

const validateDate = (dateStr) => {
    return dateStr.includes("2024");
}

const milestoneReached = (points) => {
    if (points >= 70) return "Champions";
    if (points >= 60) return "Premium Plus";
    if (points >= 40) return "Premium";
    if (points >= 25) return "Advanced";
    if (points >= 10) return "Standard";
    return null;
}

const scrapWebPage = async (url) => {
    const axiosResponse = await axios.request({
        method: "GET",
        url: url,
        Headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
        }
    })
    // console.log(axiosResponse.data);

    const $ = cheerio.load(axiosResponse.data);

    const badges = [];

    $('.profile-badges').find($('.profile-badge')).each((index, element) => {
        const title = $(element).find('.ql-title-medium').text().trim();
        const dateEarned = $(element).find('.ql-body-medium').text().trim();

        badges.push({ title, dateEarned });
    });

    // console.log(badges);

    return badges;
};

const arcadePointsCalculator = (data) => {
    let totalBadges = 0;
    let arcadePoints = 0;
    let badgeCounted = 0;
    let newData = [];
    data.forEach(badge => {
        if (validateDate(badge.dateEarned) && (
            badge.title.includes("Level") ||
            badge.title.includes("The Arcade Trivia") ||
            badge.title.includes("The Arcade Certification Zone")
        )) {
            totalBadges++;
            arcadePoints++;
            badgeCounted++;
            badge.points = 1;
            newData.push(badge);
        } else if (validateDate(badge.dateEarned) && (
            badge.title.includes("Arcade Carnival") ||
            badge.title.includes("The Arcade Skills Splash") ||
            badge.title.includes("The Arcade Skills League") ||
            badge.title.includes("The Arcade Health Tech") ||
            badge.title.includes("The Arcade June Speedrun")
        )) {
            totalBadges++;
            arcadePoints += 2;
            badgeCounted++;
            badge.points = 2;
            newData.push(badge);
        } else if (validateDate(badge.dateEarned)) {
            totalBadges++;
            badge.points = 0.5;
            newData.push(badge);
        }
    });

    let skillBadges = totalBadges - badgeCounted;
    let totalPoints = arcadePoints + (skillBadges / 2);
    arcadePoints += Math.floor(skillBadges / 2);

    return { newData, arcadePoints, totalPoints };
}

export async function POST(req) {
    const userData = await req.json();
    const data = await scrapWebPage(userData.url);
    const { newData, arcadePoints, totalPoints } = arcadePointsCalculator(data);
    // console.log(newData);
    console.log({
        "puclic_profile": userData.url,
        "Arcade Points": arcadePoints
    });
    return NextResponse.json({
        badges: newData,
        points: arcadePoints,
        totalPoints: totalPoints,
        milestone: milestoneReached(arcadePoints)
    },
        { status: 200 }
    )
}