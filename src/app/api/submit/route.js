import { NextResponse } from "next/server";
import axios from "axios";
import cheerio from "cheerio";

const skillBadgeList = [
    "Manage Kubernetes in Google Cloud",
    "Classify Images with TensorFlow on Google Cloud",
    "Derive Insights from BigQuery Data",
    "Share Data Using Google Data Cloud",
    "Get Started with Google Workspace Tools",
    "Migrate MySQL data to Cloud SQL using Database Migration Service",
    "Use Machine Learning APIs on Google Cloud",
    "Mitigate Threats and Vulnerabilities with Security Command Center",
    "Monitor Environments with Google Cloud Managed Service for Prometheus",
    "Get Started with Dataplex",
    "Deploy Kubernetes Applications on Google Cloud",
    "Prepare Data for ML APIs on Google Cloud",
    "Set Up an App Dev Environment on Google Cloud",
    "Develop your Google Cloud Network",
    "Implement Load Balancing on Compute Engine",
    "Set Up a Google Cloud Network",
    "Build a Website on Google Cloud",
    "Cloud Architecture: Design, Implement, and Manage",
    "Build a Secure Google Cloud Network",
    "Engineer Data for Predictive Modeling with BigQuery ML",
    "Implement DevOps Workflows in Google Cloud",
    "Monitor and Log with Google Cloud Observability",
    "Create ML Models with BigQuery ML",
    "Build a Data Warehouse with BigQuery",
    "Implement Cloud Security Fundamentals on Google Cloud",
    "Develop Serverless Applications on Cloud Run",
    "Develop Serverless Apps with Firebase",
    "Optimize Costs for Google Kubernetes Engine",
    "Prepare Data for Looker Dashboards and Reports",
    "Deploy and Manage Apigee X",
    "Build and Deploy Machine Learning Solutions on Vertex AI",
    "Create and Manage Cloud SQL for PostgreSQL Instances",
    "Build LookML Objects in Looker",
    "Develop and Secure APIs with Apigee X",
    "Manage Data Models in Looker",
    "Detect Manufacturing Defects using Visual Inspection AI",
    "Automate Data Capture at Scale with Document AI",
    "Perform Predictive Data Analysis in BigQuery",
    "Protect Cloud Traffic with BeyondCorp Enterprise (BCE) Security",
    "Build Infrastructure with Terraform on Google Cloud",
    "Create and Manage Cloud Spanner Instances",
    "Use Functions, Formulas, and Charts in Google Sheets",
    "Create and Manage AlloyDB Instances",
    "Implement CI/CD Pipelines on Google Cloud",
    "Create and Manage Bigtable Instances",
    "Build Google Cloud Infrastructure for AWS Professionals",
    "Build Google Cloud Infrastructure for Azure Professionals",
    "Store, Process, and Manage Data on Google Cloud - Command Line",
    "Monitor and Manage Google Cloud Resources",
    "Analyze BigQuery Data in Connected Sheets",
    "Store, Process, and Manage Data on Google Cloud - Console",
    "Get Started with Looker",
    "App Building with AppSheet",
    "Get Started with API Gateway",
    "Streaming Analytics into BigQuery",
    "Cloud Functions: 3 Ways",
    "Create a Streaming Data Lake on Cloud Storage",
    "Get Started with Cloud Storage",
    "App Engine: 3 Ways",
    "Get Started with Eventarc",
    "Get Started with Pub/Sub",
    "Monitoring in Google Cloud",
    "Analyze Speech and Language with Google APIs",
    "Create a Secure Data Lake on Cloud Storage",
    "Tag and Discover BigLake Data",
    "Secure BigLake Data",
    "Analyze Images with the Cloud Vision API",
    "Protect Sensitive Data with Data Loss Prevention",
    "Networking Fundamentals on Google Cloud",
    "The Basics of Google Cloud Compute",
    "Use APIs to Work with Cloud Storage",
    "Using the Google Cloud Speech API",
    "Develop with Apps Script and AppSheet",
    "Analyze Sentiment with Natural Language API",
    "Build a Data Mesh with Dataplex",
    "Cloud Speech API: 3 Ways",
    "Integrate BigQuery Data and Google Workspace using Apps Script",
    "Configure Service Accounts and IAM Roles for Google Cloud",
    "Build Custom Processors with Document AI",
    "Explore Generative AI with the Vertex AI Gemini API",
    "Build LangChain Applications using Vertex AI",
    "Develop GenAI Apps with Gemini and Streamlit",
    "Inspect Rich Documents with Gemini Multimodality and Multimodal RAG",
    "Build Real World AI Applications with Gemini and Imagen",
    "Prompt Design in Vertex AI",
];

const specialBadgeList = [
    // need changes
    "",
];

const digitalLeaderBadgeList = [
    "Digital Transformation with Google Cloud",
    "Exploring Data Transformation with Google Cloud",
    "Innovating with Google Cloud Artificial Intelligence",
    "Modernize Infrastructure and Applications with Google Cloud",
    "Trust and Security with Google Cloud",
    "Scaling with Google Cloud Operations",
]

const skillBadgeSet = new Set(skillBadgeList);
const specialBadgeSet = new Set(specialBadgeList);
const digitalLeaderBadgeSet = new Set(digitalLeaderBadgeList);

const validateSkillBadge = (title) => skillBadgeSet.has(title);
const validateSpecialBadge = (title) => specialBadgeSet.has(title);
const validateDigitalLeaderBadge = (title) => digitalLeaderBadgeSet.has(title);

const validateDate = (dateStr) => {
    const regex = /Earned (\w+)\s+(\d{1,2}),\s+(\d{4})/;
    const match = dateStr.match(regex);

    const monthMap = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };

    let isMonsoon = false;
    let isValid = false;
    let isFaci = false;
    let isDigi = false;

    if (match) {
        const month = monthMap[match[1]];
        const date = parseInt(match[2], 10);
        const year = parseInt(match[3], 10);

        if ((month == 7 && date >= 22 && year == 2024) || (month > 7 && year == 2024))
            isValid = true;
        if ((year == 2024 && month == 7 && (date >= 22 || date <= 31)))
            isMonsoon = true;
        if (isMonsoon || month == 8 || (month == 9 && date <= 22))
            isFaci = true;
        if (year == 2024 && month == 8 && (date >= 1 || date <= 5))
            isDigi = true;
    }
    return { "valid": isValid, "monsoon": isMonsoon, "faci": isFaci, "digi": isDigi };
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

    let allBadgesData = [], levelBadgesData = [], triviaBadgesData = [], specialBadgesData = [], monsoonBadgesData = [], skillBadgesData = [], digitalLeaderBadgesData = [];

    let faciGame = 0;
    let faciTrivia = 0;
    let faciSkill = 0;

    data.forEach(badge => {
        const { valid, monsoon, faci, digi } = validateDate(badge.dateEarned);
        // Check for digital leader badges
        if (digi && validateDigitalLeaderBadge(badge.title)) {
            badge.points = '-';
            allBadgesData.push(badge);
            digitalLeaderBadgesData.push(badge);
        }
        // Check for Special Badge
        else if (valid &&
            validateSpecialBadge(badge.title)
        ) {
            totalBadges++;
            arcadePoints++;
            badgeCounted++;
            badge.points = 1;
            faciGame += faci ? 1 : 0;
            allBadgesData.push(badge);
            specialBadgesData.push(badge);
        }
        // Check for Level Badge
        else if (valid && (
            badge.title.includes("Level")
        )) {
            totalBadges++;
            arcadePoints++;
            badgeCounted++;
            badge.points = 1;
            faciGame += faci ? 1 : 0;
            allBadgesData.push(badge);
            levelBadgesData.push(badge);
        }
        // Check for Trivia Badge
        else if (valid && (
            badge.title.includes("The Arcade Trivia")
        )) {
            totalBadges++;
            arcadePoints++;
            badgeCounted++;
            badge.points = 1;
            faciTrivia += faci ? 1 : 0;
            allBadgesData.push(badge);
            triviaBadgesData.push(badge);
        }
        // Check for Any Other Badge (Skill Badge)
        else if (valid && validateSkillBadge(badge.title)) {
            // Check if it has earned during monsoon
            if (monsoon) {
                totalBadges++;
                badgeCounted++;
                arcadePoints++;
                badge.points = 1;
                allBadgesData.push(badge);
                monsoonBadgesData.push(badge);
            }
            // Else
            else {
                totalBadges++;
                badge.points = 0.5;
                allBadgesData.push(badge);
                skillBadgesData.push(badge);
            }
            faciSkill += faci ? 1 : 0;
        }
    });

    let skillBadges = totalBadges - badgeCounted;
    let totalPoints = arcadePoints + (skillBadges / 2);
    arcadePoints += Math.floor(skillBadges / 2);

    // checking if the digital leader path is completed
    if (digitalLeaderBadgesData.length === 6) {
        arcadePoints += 5;
        totalPoints += 5;
    }

    return { allBadgesData, levelBadgesData, triviaBadgesData, specialBadgesData, monsoonBadgesData, skillBadgesData, digitalLeaderBadgesData, arcadePoints, totalPoints, faciCounts: { faciGame, faciTrivia, faciSkill } };
};

export async function POST(req) {
    const startTime = process.hrtime();
    const userData = await req.json();
    const data = await scrapWebPage(userData.url);
    const { allBadgesData, levelBadgesData, triviaBadgesData, specialBadgesData, monsoonBadgesData, skillBadgesData, digitalLeaderBadgesData, arcadePoints, totalPoints, faciCounts } = arcadePointsCalculator(data);
    // console.log(allBadgesData);

    const endTime = process.hrtime(startTime);
    const timeTaken = endTime[0] * 1000 + endTime[1] / 1000000;

    console.log({
        "puclic_profile": userData.url,
        "Arcade Points": arcadePoints,
        "Server Response Time": timeTaken + " ms",
    });

    return NextResponse.json({
        badges: allBadgesData,
        level: levelBadgesData,
        trivia: triviaBadgesData,
        special: specialBadgesData,
        monsoon: monsoonBadgesData,
        skill: skillBadgesData,
        digital: digitalLeaderBadgesData,
        points: arcadePoints,
        totalPoints: totalPoints,
        milestone: milestoneReached(arcadePoints),
        faciCounts,
        resTime: timeTaken,
    },
        { status: 200 }
    )
};