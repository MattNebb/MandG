/**
 * Edit these values before sharing the link.
 * ADVENT_START: first calendar day for window 1 (YYYY-MM-DD in your local timezone).
 */
window.ADVENT_CONFIG = {
  title: "M&G Advent Calendar",
  subtitle: "hola mundo",
  /** Day 1 = first window unlocks on this date at local midnight */
  adventStart: "2026-03-30",
  totalWindows: 15,
  /** Folder (relative to this site) containing prize images */
  prizesFolder: "prizes",
  /**
   * File names for each day, in order (index 0 = day 1).
   * Put matching files inside the prizes folder.
   */
  prizeFiles: [
    "01.jpg", "02.jpg", "03.jpg", "04.jpg", "05.jpg",
    "06.jpg", "07.jpg", "08.jpg", "09.jpg", "10.jpg",
    "11.jpg", "12.jpg", "13.jpg", "14.jpg", "15.jpg",
  ],
  /** Set true only while testing — all windows unlock regardless of date */
  devUnlockAll: false,
};
