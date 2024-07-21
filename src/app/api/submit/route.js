import { NextResponse } from "next/server";
import axios from "axios";
import cheerio from "cheerio";

const validateDate = (dateStr) => {
    const regex = /Earned (\w+)\s+(\d{1,2}),\s+(\d{4})/;
    const match = dateStr.match(regex);

    const monthMap = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };

    if (match) {
        const month = monthMap[match[1]];
        const date = parseInt(match[2], 10);
        const year = parseInt(match[3], 10);

        return (month == 7 && date >= 22 && year == 2024) || (month > 7 && year == 2024);
    }
    return false;
}

const milestoneReached = (points) => {
    // if (points >= 70) return "Champions";
    // if (points >= 60) return "Premium Plus";
    // if (points >= 40) return "Premium";
    // if (points >= 25) return "Advanced";
    // if (points >= 10) return "Standard";
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
        const imageURL = $(element).find('img').attr('src');
        const badgeURL = $(element).find('.badge-image').attr('href');
        badges.push({ title, dateEarned, imageURL, badgeURL });
    });

    // console.log(badges);

    return badges;
};

const arcadePointsCalculator = (data) => {
    // todo
    let totalBadges = 0;
    let arcadePoints = 0;
    let badgeCounted = 0;
    let allBadgesData = [], gameBadgesData = [], triviaBadgesData = [], specialBadgesData = [], skillBadgesData = [];
    data.forEach(badge => {
        if (validateDate(badge.dateEarned) && (
            badge.title.includes("Level") ||
            badge.title.includes("The Arcade Certification Zone")
        )) {
            totalBadges++;
            arcadePoints++;
            badgeCounted++;
            badge.points = 1;
            allBadgesData.push(badge);
            gameBadgesData.push(badge);
        } else if (validateDate(badge.dateEarned) && (
            badge.title.includes("The Arcade Trivia")
        )) {
            totalBadges++;
            arcadePoints++;
            badgeCounted++;
            badge.points = 1;
            allBadgesData.push(badge);
            triviaBadgesData.push(badge);
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
            allBadgesData.push(badge);
            specialBadgesData.push(badge);
        } else if (validateDate(badge.dateEarned)) {
            totalBadges++;
            badge.points = 0.5;
            allBadgesData.push(badge);
            skillBadgesData.push(badge);
        }
    });

    let skillBadges = totalBadges - badgeCounted;
    let totalPoints = arcadePoints + (skillBadges / 2);
    arcadePoints += Math.floor(skillBadges / 2);

    return { allBadgesData, gameBadgesData, triviaBadgesData, specialBadgesData, skillBadgesData, arcadePoints, totalPoints };
}

export async function POST(req) {
    const userData = await req.json();
    const data = await scrapWebPage(userData.url);
    const { allBadgesData, gameBadgesData, triviaBadgesData, specialBadgesData, skillBadgesData, arcadePoints, totalPoints } = arcadePointsCalculator(data);
    // console.log(allBadgesData);
    console.log({
        "puclic_profile": userData.url,
        "Arcade Points": arcadePoints
    });
    return NextResponse.json({
        badges: allBadgesData,
        game: gameBadgesData,
        trivia: triviaBadgesData,
        special: specialBadgesData,
        skill: skillBadgesData,
        points: arcadePoints,
        totalPoints: totalPoints,
        milestone: milestoneReached(arcadePoints)
    },
        { status: 200 }
    )
}