# Feel Goods: details to confirm before this goes live

These are NOT on the site unless a line says so. The site keeps the current data from `src/data/business.ts` until Arman (or the owner) confirms.

1. **Address.** An owner flyer (fg-105) says **"1379 Buchanan Road · $5 OFF EVERYDAY BEFORE 11AM"**. The site uses **2 Buena Vista, Pittsburg, CA 94565**.
   - The shop's live Booksy page (checked 2026-11-09) also lists **2 Buena Vista, Pittsburg 94565**, so the flyer is probably an old location. Confirm with the owner anyway; if the shop moved, the map link, the footer and the metadata need to change.
2. **The $5 off before 11 AM deal** (same flyer). Is it still running? If so, it would be a strong line on the price board, but it isn't published now. (Booksy hours now start at 11 AM on weekdays and noon on Saturday, which also makes a "before 11" deal look out of date.)
3. **Instagram handle.** The same flyer says **@feelgoods_barbershop**. The site links **@feelgoods_pittsburg** (instagram.com/feelgoods_pittsburg), and other owner photos (fg-092) also show @FEELGOODS_PITTSBURG. Which one is active?
4. **Booking link.** A "NOW HIRING" post (fg-107) and several photos show **feelgoods.booksy.com**, and the live Booksy page itself lists **FeelGoods.booksy.com**, so the short link is theirs. The site still uses the full Booksy URL (`booksy.com/en-us/627951_feel-goods-barbershop_...`), which works; switch only if the owner prefers the short one.
5. **Hiring.** The "NOW HIRING" post suggests they're looking for a barber. A hiring strip could go above the footer if it's still open.
6. **The barber photo** (fg-025, in the oval mirror at the bottom).
   - Confirm the man smiling behind the chair is **Johnny Blendz** and that he's OK being on the site.
   - The original photo shows a sweatshirt with a profanity, so the site uses a head-and-shoulders crop above the print. Never use the full frame.
7. **Other barbers.** fg-036 shows a different man cutting a kid's hair. If more barbers work there, the copy "Book with Johnny" should become a barber picker.
8. **Hours. CHANGED 2026-11-09.** The first site had a Mon-Thu split (11:00 AM-12:00 PM, then 1:30-7:30 PM), Fri 10:00 AM-7:00 PM, Sat 1:00-7:00 PM. The shop's live Booksy page says **Mon-Fri 11:00 AM-8:00 PM, Sat 12:00-5:00 PM, Sun closed**, so the site now uses Booksy's hours (the footer credits Booksy for them). The live "open / closed" signs run off these hours.
   - Ask the owner which is right, especially whether there's still a lunch break.
   - Booksy also posts one-off closures (Nov 20, Nov 21 and Nov 26, 2026). The site can't know those, so the hours on the door link to Booksy for holiday closures.
9. **Established 2021.** It comes from the first site and appears in the page description. Confirm it.
10. **Review count. CHANGED 2026-11-09.** The first site said 125 reviews; Booksy now says **4.6 from 134 reviews**, and the site uses 134. It will keep growing: refresh `reviewCount` in `src/data/business.ts` before launch (or switch the copy to "130+").
