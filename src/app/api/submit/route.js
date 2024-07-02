import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import axios from "axios";
import cheerio from "cheerio";

const fetchData = async (url) => {
    const res = await fetch(url);
    const data = await res.text();
    console.log(data);
    return data;
}

const countProfileBadges = (str, phrase) => {
    const regex = new RegExp(`${phrase}`, 'gi');
    const matches = str.match(regex);
    const count = matches ? matches.length : 0;
    return parseInt(count);
}

const calculateArcadePoints = (data) => {
    // total number of badges in the profile
    const countBadges = countProfileBadges(data, "<div class='profile-badge'>"); // 87

    // count of arcade levels + trivias + specials badges + certifications zone badges
    const countTrivia = countProfileBadges(data, "Badge for The Arcade Trivia"); // 21
    const countLevel = countProfileBadges(data, "Badge for Level"); // 16
    const countCertZones = countProfileBadges(data, "Badge for The Arcade Certification Zone"); // 5

    // count of special badges separately (which include 2 arcade points)
    const specialBadgeFeb = countProfileBadges(data, "Badge for Arcade Carnival");
    const specialBadgeMer = countProfileBadges(data, "Badge for The Arcade Skills Splash");
    const specialBadgeApr = countProfileBadges(data, "Badge for The Arcade Skills League");
    const specialBadgeMay = countProfileBadges(data, "Badge for The Arcade Health Tech");
    const specialBadgeJun = countProfileBadges(data, "Badge for The Arcade June Speedrun");
    const totalSpecialBadges = specialBadgeFeb + specialBadgeMer + specialBadgeApr + specialBadgeMay + specialBadgeJun;

    const totalSkillBadges = countBadges - (countTrivia + countLevel + totalSpecialBadges + countCertZones);

    const arcadePoints = countTrivia + countLevel + countCertZones + (totalSpecialBadges * 2) + (totalSkillBadges / 2);

    return arcadePoints;
}

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

const scraping = async (url) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, {
        waitUntil: "domcontentloaded",
    });

    const badges = await page.evaluate(() => {
        const badgeList = document.querySelectorAll(".profile-badge");

        return Array.from(badgeList).map((badge) => {
            const title = badge.querySelector(".ql-title-medium").innerText;
            const dateEarned = badge.querySelector(".ql-body-medium").innerText;
            return { title, dateEarned };
        })
    });

    // console.log(badges);

    await browser.close();

    return badges;
};

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
    data.forEach(badge => {
        if (validateDate(badge.dateEarned) && (
            badge.title.includes("Level") ||
            badge.title.includes("The Arcade Trivia") ||
            badge.title.includes("The Arcade Certification Zone")
        )) {
            totalBadges++;
            arcadePoints++;
            badgeCounted++;
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
        } else if (validateDate(badge.dateEarned)) totalBadges++;
    });

    let skillBadges = totalBadges - badgeCounted;
    arcadePoints += Math.floor(skillBadges / 2);

    return arcadePoints;
}

export async function GET() {
    return NextResponse.json(
        { developerName: "Argha Mallick" },
        { status: 200 }
    )
}

export async function POST(req) {
    const userData = await req.json();
    const data = await scrapWebPage(userData.url);
    const arcadePoints = arcadePointsCalculator(data);
    console.log({
        "puclic_profile": userData.url,
        "Arcade Points": arcadePoints
    });
    return NextResponse.json({
        badges: data,
        points: arcadePoints,
        milestone: milestoneReached(arcadePoints)
    },
        { status: 200 }
    )
}