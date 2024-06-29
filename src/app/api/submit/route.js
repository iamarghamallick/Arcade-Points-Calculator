import { NextResponse } from "next/server";

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

export async function GET() {
    return NextResponse.json(
        { developerName: "Argha Mallick" },
        { status: 200 }
    )
}

export async function POST(req) {
    const userData = await req.json();
    const data = await fetchData(userData.url);
    const arcadePoints = calculateArcadePoints(data);
    console.log(`Arcade Points: ${arcadePoints}`);
    return NextResponse.json(
        { points: arcadePoints },
        { status: 200 }
    )
}