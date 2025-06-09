require("dotenv").config();

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Feed = require("../models/feed");

// DB 연결
const DATABASE_URL =
  process.env.DATABASE_URL || "mongodb://localhost:27017/hana";
mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function importFeedsFromFile(filename) {
  const filePath = path.join(__dirname, filename); // data 폴더 기준 경로
  const data = fs.readFileSync(filePath, "utf8");
  const lines = data.trim().split("\n");
  const header = lines[0].split("\t");
  let insertedCount = 0;
  let errorCount = 0;
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split("\t");
    if (row.length < header.length) continue;
    const feed = {};
    for (let j = 0; j < header.length; j++) {
      feed[header[j].trim()] = row[j].trim();
    }
    // date 필드 변환
    if (feed.date) feed.date = new Date(feed.date);
    try {
      await Feed.create(feed);
      insertedCount++;
      console.log(`[${filename}] Inserted: ${feed.title}`);
    } catch (err) {
      errorCount++;
      console.error(
        `[${filename}] Error inserting: ${feed.title}`,
        err.message
      );
    }
  }
  return { insertedCount, errorCount };
}

async function importFeeds() {
  const files = [
    "cau-notice.tsv",
    "sw-notice.tsv",
    "korean-department-notice.tsv",
    "mechanical-notice.tsv",
    "psyche-notice.tsv",
  ]; // 추가할 파일 목록
  let totalInserted = 0;
  let totalError = 0;
  for (const file of files) {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      const { insertedCount, errorCount } = await importFeedsFromFile(file);
      totalInserted += insertedCount;
      totalError += errorCount;
    } else {
      console.warn(`File not found: ${file}`);
    }
  }
  console.log(`\n=== 전체 결과 ===`);
  console.log(`Inserted: ${totalInserted}, Error: ${totalError}`);
  mongoose.disconnect();
}

importFeeds();