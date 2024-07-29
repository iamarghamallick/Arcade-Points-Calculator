import { NextResponse } from "next/server";
import axios from "axios";
import cheerio from "cheerio";

const savelog = async (logData) => {
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw16nRRvf_7TcgvZYTbQuBHYaoQQHhSUC6Uzy7O5czLJOJOkU75Jj0tmGzwg4KZe8P8/exec";

    const formData = new FormData();
    formData.append('public_profile_url', logData.public_profile_url);
    formData.append('arcade_points', logData.arcade_points);

    try {
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            console.log('Log successfully submitted');
        } else {
            console.error('Log submission error');
        }
    } catch (error) {
        console.error('Log submission error:', error);
    }
};

const validateDate = (dateStr) => {
    const regex = /Earned (\w+)\s+(\d{1,2}),\s+(\d{4})/;
    const match = dateStr.match(regex);

    const monthMap = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };

    let isMonsoon = false;
    let isValid = false;

    if (match) {
        const month = monthMap[match[1]];
        const date = parseInt(match[2], 10);
        const year = parseInt(match[3], 10);

        if ((month == 7 && date >= 22 && year == 2024) || (month > 7 && year == 2024))
            isValid = true;
        if ((year == 2024 && month == 7 && (date >= 22 || date <= 31)))
            isMonsoon = true;
    }
    return { "valid": isValid, "monsoon": isMonsoon };
};

const milestoneReached = (points) => {
    // if (points >= 70) return "Champions";
    // if (points >= 60) return "Premium Plus";
    // if (points >= 40) return "Premium";
    // if (points >= 25) return "Advanced";
    // if (points >= 10) return "Standard";
    return null;
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
        const imageURL = $(element).find('img').attr('src');
        const badgeURL = $(element).find('.badge-image').attr('href');
        badges.push({ title, dateEarned, imageURL, badgeURL });
    });

    // console.log(badges);

    return badges;
};

const arcadePointsCalculator = (data) => {
    let totalBadges = 0;
    let arcadePoints = 0;
    let badgeCounted = 0;
    let allBadgesData = [], levelBadgesData = [], triviaBadgesData = [], specialBadgesData = [], monsoonBadgesData = [], skillBadgesData = [];
    data.forEach(badge => {
        if (validateDate(badge.dateEarned).valid && (
            badge.title === ""
        )) {
            totalBadges++;
            arcadePoints++;
            badgeCounted++;
            badge.points = 1;
            allBadgesData.push(badge);
            specialBadgesData.push(badge);
        } else if (validateDate(badge.dateEarned).valid && (
            badge.title.includes("Level")
        )) {
            totalBadges++;
            arcadePoints++;
            badgeCounted++;
            badge.points = 1;
            allBadgesData.push(badge);
            levelBadgesData.push(badge);
        } else if (validateDate(badge.dateEarned).valid && (
            badge.title.includes("The Arcade Trivia")
        )) {
            totalBadges++;
            arcadePoints++;
            badgeCounted++;
            badge.points = 1;
            allBadgesData.push(badge);
            triviaBadgesData.push(badge);
        } else if (validateDate(badge.dateEarned).valid) {
            if (validateDate(badge.dateEarned).monsoon) {
                totalBadges++;
                badgeCounted++;
                arcadePoints++;
                badge.points = 1;
                allBadgesData.push(badge);
                monsoonBadgesData.push(badge);
            } else {
                totalBadges++;
                badge.points = 0.5;
                allBadgesData.push(badge);
                skillBadgesData.push(badge);
            }
        }
    });

    let skillBadges = totalBadges - badgeCounted;
    let totalPoints = arcadePoints + (skillBadges / 2);
    arcadePoints += Math.floor(skillBadges / 2);

    return { allBadgesData, levelBadgesData, triviaBadgesData, specialBadgesData, monsoonBadgesData, skillBadgesData, arcadePoints, totalPoints };
};

export async function POST(req) {
    const userData = await req.json();
    const data = await scrapWebPage(userData.url);
    const { allBadgesData, levelBadgesData, triviaBadgesData, specialBadgesData, monsoonBadgesData, skillBadgesData, arcadePoints, totalPoints } = arcadePointsCalculator(data);
    // console.log(allBadgesData);
    console.log({
        "puclic_profile": userData.url,
        "Arcade Points": arcadePoints
    });

    await savelog({
        "public_profile_url": userData.url,
        "arcade_points": arcadePoints
    });

    return NextResponse.json({
        badges: allBadgesData,
        level: levelBadgesData,
        trivia: triviaBadgesData,
        special: specialBadgesData,
        monsoon: monsoonBadgesData,
        skill: skillBadgesData,
        points: arcadePoints,
        totalPoints: totalPoints,
        milestone: milestoneReached(arcadePoints)
    },
        { status: 200 }
    )
};