# Project mein kya-kya badla — aasan Hinglish mein

Is file mein website mein kiya gaya **har badlav** simple bhasha mein likha jayega, taaki aapko pata rahe ki kya hua, kyun hua, aur kahan hua.

**Kaise padhein:**
- Sabse naya badlav **sabse upar** hai.
- Har entry mein yeh hota hai: **Kya badla**, **Kyun**, **Kaun si files**, **Kaise check karein**, aur **Dhyan dene wali baat**.
- Website dekhne ke liye: project folder mein `npm run dev` chalaiye, phir browser mein `http://localhost:3000` kholiye.

---

## 21 Nov 2026 — Website ka code GitHub par daala (Vercel par live karne ki taiyari)

**Kya badla:**
- Poora website code ab GitHub par hai: https://github.com/sudhansh-pandey03/bhagwan-warehouse (public — koi bhi code dekh sakta hai).
- `.gitignore` mein `.agents/`, `.claude/`, `.hallmark/` folders daale — yeh design ke tools aur screenshots hain, website ke liye zaroori nahi, isliye GitHub par nahi gaye.

**Kyun:**
- Vercel (website chalane wali free service) GitHub se code leti hai. Ab har baar GitHub par naya code jaane par website apne aap update ho jayegi.

**Kaun si files:**
- `.gitignore`, `docs/BADLAV-HINGLISH.md`, `docs/CHANGELOG.md`

**Kaise check karein:**
- Upar wala GitHub link kholiye — saari files dikhengi.

**Dhyan dene wali baat:**
- Code mein koi password ya secret nahi hai (check kiya). Phone number pehle se website par public hai.
- Vercel par ek setting zaroor daalein: `NEXT_PUBLIC_SITE_URL` = `https://www.bhagwantransport.com` (isse Google ke liye sitemap banta hai).

---

## 21 Nov 2026 — Shuru wali loading screen par atak jaane wali galti theek ki

**Kya badla:**
- Website pehli baar kholne par "Preparing your logistics experience..." wali screen (truck wali) kabhi-kabhi **hamesha ke liye ruk jaati thi** aur main page nahi dikhta tha. Ab yeh lagbhag 2–3 second mein apne aap hat jaati hai.

**Kyun:**
- Code screen ke shuru mein hi yaad kar leta tha ki "intro dikh gaya". Development mode mein React yeh code do baar chalata hai. Pehli baar band hone ke timer cancel ho jaate the, aur doosri baar code sochta tha ki intro pehle hi dikh chuka hai, isliye naye timer lagata hi nahi tha. Ab "intro dikh gaya" tabhi yaad kiya jaata hai jab screen sach mein band ho jaaye.

**Kaun si files:**
- `app/logistics-loader.tsx`

**Kaise check karein:**
- Browser mein naya tab (ya Incognito) kholiye aur `http://localhost:3000` par jaiye. Loading screen ~2–3 second dikhegi, phir main page aa jayega.

**Dhyan dene wali baat:**
- Ek tab mein intro sirf ek baar dikhta hai. Dobara dekhna ho to naya tab ya Incognito window kholiye.

---

## 18 Nov 2026 — "Facilities Handling" pages aur Chat banaya (Service Partner ke liye)

**Kya badla:**
- Naya alag folder **`app/facilities-handling/`** banaya. Isme **2 naye pages** hain:
  1. **Facilities Handling** (`/facilities-handling`) — "Namaste, [naam]" ke saath partner ka apna page. Upar warehouse ki khaas baatein (1500 sq. ft., NH 48, pallet jack/drum trolley, CCTV) aur 6 cards: Short-Term Storage, Transit Cargo, Loading & Unloading, Truck-to-Truck Transfer, Temporary Godown, General Questions. Har card par "Start chat".
  2. **Chat** (`/facilities-handling/chat`) — WhatsApp jaisa chat screen. Left side topics ki list (phone par upar patti), beech mein "Dispatch Desk" se baat-cheet, neeche message likhne ka box (Enter = bhejo, Shift+Enter = nayi line). Shuru mein sujhaye gaye sawaal ke buttons aate hain.
- Design: **thanda (cool) dark theme** — gehra navy rang, halka barfeela neela (ice blue) glow, aur website ka sunehra (gold) rang. Glass jaise cards.
- **Sign in ke baad:** Navbar ke "Service Partner" form mein "Continue" dabane ke ~2 second baad partner apne aap **Facilities Handling page par pahunch jaata hai**. ("Open Facilities Handling" button se turant bhi ja sakte hain.)
- Sign in ke baad navbar ka button **"Hi, [naam]"** ban jaata hai — dabane par seedha Facilities Handling page khulta hai.
- Bina sign in ke yeh pages kholne par "Sign in to open Facilities Handling" card aata hai, jisme sign in ka button hai.
- Hub page par **"Sign out"** button hai.

**Chat kaise kaam karta hai (zaroori):**
- Abhi koi server/database nahi hai, isliye chat ka jawab ek **chhota assistant** deta hai jo sirf website par likhi baatein batata hai (jagah, size, equipment, CCTV, 1–7 din). **Rate aur timing wo khud nahi batata** — call 76888 66933 ka button deta hai.
- Asli team tak message pahunchane ke liye: chat mein upar **"Send to team"** dabaiye. Poori chat WhatsApp mein likhi hui khulti hai; wahan **Send** dabana hota hai.
- Chat usi phone/computer ke browser mein save rehti hai (dusre device par nahi dikhegi). Kooda-daan (🗑) button se chat saaf hoti hai.
- Yeh **asli login nahi hai** — sirf usi browser mein yaad rakha jaata hai ki partner ne form bhara hai.
- Yeh pages Google search mein nahi aayenge (noindex).

**Kaun si files:**
- Naya folder `app/facilities-handling/`:
  - `page.tsx` — Facilities Handling page
  - `chat/page.tsx` — Chat page
  - `_components/` — saare parts: `facilities-hub.tsx` (hub), `facility-chat.tsx` (chat screen), `desk-replies.ts` (assistant ke jawab — yahan text badal sakte hain), `facility-topics.ts` (6 topics aur unke sujhaye sawaal), `partner-session.ts` (sign in yaad rakhna / sign out), `partner-gate.tsx` (bina sign in wala card), `facilities.css` (poora design)
- Badli files: `components/home/partner-sign-in-form.tsx` (sign in ke baad redirect), `components/home/service-partner.tsx` ("Hi, naam" button), `components/home/service-partner.css`

**Kaise check karein:**
1. `npm run dev` chalaiye, `http://localhost:3000` kholiye.
2. Navbar mein "Service Partner" dabaiye, naam + Gmail bhariye, "Continue" dabaiye.
3. 2 second mein Facilities Handling page khulega, navbar mein "Hi, [naam]" dikhega.
4. Koi card dabaiye → chat khulega. "what are the rates" ya "where is the warehouse" likh kar bhejiye.

**Dhyan dene wali baat:** Maine computer (1440px) aur phone (390px) dono par chala kar dekha — sign in → redirect → chat sab chalta hai, koi error nahi, side mein scroll nahi hota.

---

## 17 Nov 2026 — Mobile / tablet par website theek ki (responsive fixes)

**Problem kya thi:** Phone preview mein purana desktop design dikh raha tha.

**Asli wajah:** Website ka code galat nahi tha. Aapka chalta hua `npm run dev` server **nayi CSS uthana band kar chuka tha** aur purani CSS dikhata ja raha tha. Isliye har preview mein purana design aata tha. Maine check kiya: phone ke liye zaroori "viewport" setting sahi hai, aur koi purani copy save (cache) karne wali cheez nahi hai.

**Agar phir se ho:** Terminal mein Ctrl+C dabaiye aur `npm run dev` dobara chalaiye.

**Saath mein jo cheezein theek ki:**
1. **Tablet (iPad jaisi screen) par:**
   - Home page ki services wali patti mein text 4 line mein toot raha tha. Ab heading upar alag line mein hai.
   - Services cards 3 ki jagah **2 column** mein, taaki text aur arrow button aapas mein na takrayein.
   - Neeche wala "Need space for the next handover?" hissa ab ek ke neeche ek. Call button ek hi line mein aata hai.
2. **Services page:** "Have a specific requirement?" wale hisse ki styling hi gayab thi (text bilkul kinare se chipka tha). Ab yeh ek sundar dark patti hai.
3. **Contact page:**
   - Form ka heading "Send an enquiry" safed card par safed rang mein tha, dikhta hi nahi tha. Ab gehra rang hai.
   - "What do you need?" dropdown ka text kat raha tha aur dropdown chhota tha. Ab poora dikhta hai aur poori chaudai leta hai.

**Kaise check kiya:** Har page ko 375, 390, 430, 768, 1024 aur 1440 pixel chaudai par khol kar dekha. Kahin bhi side mein scroll nahi hota. Navbar computer par poora dikhta hai, aur phone/tablet par logo + menu button (☰).

**Kaun si files:** `app/globals.css`

---

## 17 Nov 2026 — "Service Partner" sign-in card banaya

**Kya badla:**
- Navbar mein "Call now" ke paas naya **"Service Partner"** button (gold, user icon). Mouse le jaane par chamakta hai aur thoda bada hota hai. Chhoti screen par sirf icon dikhta hai.
- Button dabane par ek **glass jaisa card** khulta hai: "Welcome, Service Partner!"
  - Full Name (zaroori)
  - Gmail Address (zaroori, sahi email format check hota hai)
  - Mobile Number (optional; bharein to sahi 10-digit Indian number hona chahiye)
- Galat ya khaali bharne par field ke neeche laal message aata hai aur card halka sa hilta hai.
- "Continue" dabane par spinner, phir **sunehra tick** ke saath "You're all set!" message.
- Card band karne ke tareeke: X button, Escape key, ya card ke bahar click. Card khula ho to peeche ka page scroll nahi hota.

**Details kahan jaati hain (zaroori):**
- Abhi website ka koi database nahi hai. Isliye "Continue" dabane par **WhatsApp khulta hai** jisme partner ki details pehle se likhi hoti hain (bilkul Contact page ke form ki tarah). Partner ko WhatsApp mein **Send** dabana hoga. Success screen par yeh baat likhi aati hai.
- Yeh **login nahi hai**. Koi account nahi banta.
- Baad mein apna server/API lagana ho to sirf `NEXT_PUBLIC_PARTNER_API_URL` set kijiye. Details wahan chali jayengi, code badalne ki zaroorat nahi.

**Kaun si files (naya folder `components/home/`):**
- `service-partner.tsx` — navbar ka button
- `glass-dialog.tsx` — glass card ka dhaancha (kholna, band karna, keyboard)
- `partner-sign-in-form.tsx` — form aur success screen
- `floating-field.tsx` — icon aur upar uthne wale label ke saath input box
- `partner-validation.ts` — naam, email, mobile ki jaanch ke niyam
- `partner-api.ts` — details kahan bhejni hain (WhatsApp ya API)
- `service-partner.css` — poora design
- `app/components.tsx` — navbar mein button joda
- `app/base.css` — card khulne par navbar khiske nahi, iske liye ek line

**Kaise check karein:** Kisi bhi page par navbar ka "Service Partner" dabaiye. Khaali "Continue" dabakar errors dekhiye, phir sahi details bharkar success screen dekhiye.

**Dhyan dene wali baat:**
- "Terms & Privacy Policy" abhi sirf text hai, link nahi, kyunki aisa koi page website par nahi hai. Aap log ka naam, email aur phone le rahe hain, isliye ek Privacy Policy page banana accha rahega.
- "Gmail Address" field mein koi bhi sahi email chal jayega, sirf @gmail.com nahi.
- Test karte waqt saari 27 jaanch pass hui, aur browser console mein koi error nahi aaya.

---

## 17 Nov 2026 — Home page ka truck badla (nayi saaf PNG)

**Kya badla:** Home page ke upar jo safed truck drive karke aata hai, uski photo badal di. Pehle wala truck maine aapki chhoti photo se haath se kaata tha, isliye thoda dhundhla tha. Ab aapki di hui **nayi transparent PNG** lagayi hai, jo kaafi **saaf (sharp)** dikhti hai.

**Animation:** Bilkul same. Truck right se aata hai, rukta hai, halka jhatka leta hai, aur headlights jalti hain. Headlights ki roshni nayi truck ki headlights par set kar di.

**Kyun:** Aapne kaha tha ki home page wala truck hatakar yeh naya truck lagao.

**Kaun si files:**
- `public/warehouse-photos/white-truck-cutout.webp` — nayi truck photo (purani wali isi naam se replace hui)
- `app/components.tsx` — photo ka naya size
- `app/globals.css` — headlights ki jagah

**Kaise check karein:** Home page computer par kholiye. Pehle 3 second mein naya truck right se aakar rukega. (`npm run dev` mein na dikhe to Ctrl+C karke dobara chalaiye.)

**Dhyan dene wali baat:** Aapki photo mein truck right ki taraf mooh karke khada tha. Maine use ulta (mirror) kiya, taaki right se aate waqt truck aage ki taraf chalta dikhe, peeche ki taraf nahi.

---

## 17 Nov 2026 — Home page ko "bold premium" banaya + saari photos ek frame mein

**Kya badla:**
1. **Ek hi photo frame:** "The Warehouse" section mein pehle 2 alag-alag photo boxes the. Ab ek **bada sunehri kinare wala frame** hai jisme aapki **6 asli photos** baari-baari se aati hain:
   - photo dheere se badalti hai (fade) aur halki zoom hoti hai
   - left/right **teer (arrow) buttons**, neeche **caption** aur **dots** (kaun si photo chal rahi hai)
   - har 5 second mein khud agli photo; mouse frame par le jaao to ruk jaata hai
   - mobile par ungli se swipe karke, aur keyboard ke arrow keys se bhi photo badal sakte hain
   - frame ke upar "1500 sq. ft." wala glass card
2. **Nayi asli photos jodi:** aapki WhatsApp wali 3 photos jo website par kahin use nahi ho rahi thi, ab frame mein hain: yard mein trucks (pahad ke saath), pallet jack aur drum trolley, aur CCTV camera.
3. **Bold premium look:**
   - Warehouse section ab **dark navy-maroon** rang mein, taaki photos chamkein
   - Services ke cards ab **glass jaise**, gol kinare, mouse le jaane par upar uthte hain aur sunehri chamak guzarti hai
   - Services ke beech khaali jagah thi, wahan ek **dark "Not sure which service fits?" card** lagaya jo seedha call karata hai (phone icon ring karta hai)
   - Map ke charon taraf sunehri border, aur aakhri "Need space..." wala hissa ab glass panel mein
   - Sabhi sunehre (gold) buttons par mouse le jaane par chamak guzarti hai (poori website par)
4. **Galti theek ki (Services page):** "Handling equipment" photo mein asal mein aapka **Hindi poster** dikh raha tha. Ab wahan asli pallet jack aur trolley ki photo hai.

**Kyun:** Aapne kaha tha home page aur classy ho, photos ek frame mein hon, aur style "Bold premium" chuna.

**Kaun si files:**
- `app/components.tsx` — naya `PhotoFrame` (photo frame ka code)
- `app/page.tsx` — frame mein kaun si photos, unke caption, aur naya call card
- `app/globals.css` — naya premium look (file ke end mein "Bold premium home" section)
- `app/services/page.tsx` — galat photo theek ki
- `public/warehouse-photos/` — 3 nayi photos: `trucks-in-yard.jpeg`, `pallet-jack-and-trolley.jpeg`, `cctv-camera.jpeg`

**Kaise check karein:** Home page par neeche "Space for the in-between" tak scroll kariye. Frame mein photos khud badlengi; arrows dabakar bhi dekhiye. Phir Services cards par mouse le jaiye.

**Dhyan dene wali baat:**
- Frame mein photo add/hatani ho to `app/page.tsx` mein `facilityPhotos` list badliye (photo ka rasta, description, caption).
- Jinke device par "kam animation" setting on hai, unke liye photos khud nahi badlengi aur zoom nahi hoga. Arrows se badal sakte hain.
- `handling-equipment.jpeg` naam ki file asal mein poster hai. Ab yeh kahin use nahi hoti, par delete nahi ki.

---

## 17 Nov 2026 — Galti sudhari: truck ka animation wapas, sirf truck badla

**Kya hua tha:** Pichhli baar maine poori hero photo badal di thi aur truck ka "drive karke aane" wala animation hata diya tha. Aapka matlab tha ki **animation wahi rahe, sirf truck badle**. Woh galti ab theek kar di.

**Ab kya hai:**
- Hero ka **purana background wapas** aa gaya (computer par shaam wala warehouse, mobile par aapki asli photo).
- Truck ka **drive-in animation wapas**: truck right side se aata hai, rukte waqt halka sa jhatka leta hai, phir headlights jalti hain. Sab pehle jaisa.
- **Sirf truck badla:** rangeen Rama Krishna truck ki jagah ab **safed truck** hai, jo aapki di hui photo se kaat kar (cutout) banaya. Use ulta (mirror) kiya taaki truck aage ki taraf chalta dikhe, peeche nahi.
- Truck ka size thoda chhota rakha, taaki headline aur right side ka "01 NEEMRANA" label na dhake.

**Kaun si files:**
- `public/warehouse-photos/white-truck-cutout.webp` — naya safed truck (transparent background)
- `app/components.tsx` — hero ka code wapas purana, bas truck ki file badli
- `app/globals.css` — truck ka size, jagah, animation aur headlights
- `public/assets/hero-truck-dock.png` — pichhli baar wali photo hata di, ab use nahi hoti
- `README.md`, `PROJECT_STRUCTURE.md` — notes theek kiye

**Kaise check karein:** Home page kholiye (computer par). Pehle 3 second mein safed truck right se aakar rukega.

**Dhyan dene wali baat:**
- Truck chhoti photo (800×500) se kaata gaya hai, isliye bahut paas se dekhne par kinare thode soft dikh sakte hain. Agar aapke paas safed truck ki **badi photo ya transparent PNG** ho, to aur saaf ho jayega.
- Mobile par truck pehle bhi nahi dikhta tha, ab bhi nahi dikhta (jagah kam hoti hai).
- Website kholte waqt aane wala intro (loader) abhi bhi purana rangeen truck dikhata hai. Usko bhi safed karna ho to bata dijiye.
- **Agar aapke `npm run dev` mein badlav nahi dikh raha:** dev server purani CSS dikha raha tha. Terminal mein Ctrl+C dabakar `npm run dev` dobara chalaiye.

---

## 17 Nov 2026 — Home page ki hero photo badli (truck wali image hatayi)

**Kya badla:**
- Home page ke sabse upar wale hisse (hero) se **rangeen Rama Krishna truck** wali image hata di. Pehle yeh truck right side se "drive" karke aata tha.
- Uski jagah aapki di hui **nayi photo** lagayi: ek safed truck, warehouse ke loading dock par, peeche shelves mein maal.
- Yahi photo ab **computer aur mobile dono** par dikhti hai. Pehle mobile par alag photo thi.

**Animation same rakha:**
- Page khulte hi photo **wahi 2.65 second wali chaal** se right se slide hokar aati hai aur aakhir mein halka sa "jhatka" lekar ruk jaati hai, bilkul pehle wale truck ki tarah.
- Same time par truck ki **headlights jal uthti** hain (halki peeli roshni), ab nayi truck ki headlights par.
- Scroll karne par photo thoda dheere chalti hai (parallax), pehle jaisa.

**Kyun:** Aapne kaha tha ki truck wali image hatakar aisi photo lagao, aur animation same rakho.

**Kaun si files:**
- `public/assets/hero-truck-dock.png` — nayi photo yahan save ki
- `app/components.tsx` — hero ka code (`HeroBackground`)
- `app/globals.css` — photo ki position, animation aur headlights ki jagah
- `README.md`, `PROJECT_STRUCTURE.md` — notes update kiye

**Kaise check karein:** Home page kholiye aur shuru ke 3 second dekhiye. Photo slide hokar aayegi, ruk jayegi, aur headlights jalengi. Computer par truck headline ke right side mein dikhega.

**Dhyan dene wali baat:**
- **Photo chhoti hai (800×500 pixel).** Badi screen par thodi dhundhli lagti hai. Isi photo ka bada version (kam se kam 1920 pixel chaudi) mil jaye to aur saaf dikhegi. File ka naam same rakh kar `public/assets/` mein replace kar dijiye.
- **Yeh photo aapke asli warehouse ki nahi hai.** Yeh ek bada modern warehouse dikhati hai, jabki aapka 1500 sq. ft. RCC warehouse hai. Customer ko galat ummeed na ho, isliye baaki pages par asli photos hi rakhi hain.
- Pehle wali truck image file delete nahi ki. Woh website khulte waqt aane wale intro animation (loader) mein abhi bhi use hoti hai.
- Agar kabhi photo badlein to headlights ki position bhi `app/globals.css` mein badalni padegi.

---

## 17 Nov 2026 — Yeh Hinglish document banaya

**Kya badla:** `docs/BADLAV-HINGLISH.md` naam ki nayi file banayi (yahi file jo aap padh rahe hain).

**Kyun:** Aap chahte the ki project mein jo bhi change ho, uska record aasan Hinglish mein rahe.

**Kaun si files:**
- `docs/BADLAV-HINGLISH.md` — yeh document
- `CLAUDE.md` — nayi file, jisme Claude Code ke liye yeh niyam likha hai ki har change ke baad yahan entry likhni hai. Claude har baar is file ko padhta hai, isliye yeh niyam bhoola nahi jayega.

**Dhyan dene wali baat:** Ab se har change ke baad yahan entry add hogi. English wala record `docs/CHANGELOG.md` mein bhi chalta rahega.

---

## 17 Nov 2026 — Hallmark design tool setup kiya

**Kya badla:** Hallmark naam ka design tool Claude Code ke liye install kiya. Yeh tool website ke design ko check karta hai aur behtar banane mein madad karta hai.

**Kyun:** Aapne Hallmark ki setup guide di thi aur setup karne ko kaha tha. Pehle yeh sirf Codex ke folder (`.agents/skills/`) mein tha, isliye Claude Code ise use nahi kar pa raha tha.

**Kaun si files:**
- `.claude/skills/hallmark/` — naya folder, Hallmark yahan install hua
- `skills-lock.json` — isme Hallmark ka exact version note ho gaya
- `.hallmark/shots/` — Hallmark ne website ke 5 screenshots yahan save kiye

**Kaise use karein (Claude Code mein):**
- `/hallmark audit app` — sirf design ki kamiyan batata hai, kuch badalta nahi
- `/hallmark redesign app` — poora design naya karta hai, content aur links bachakar
- `/hallmark <aapki request>` — kuch naya banane ke liye

**Kaise check karein:** Claude Code restart karke `/` type karein, list mein `hallmark` dikhna chahiye.

**Dhyan dene wali baat:**
- Pehli jaanch mein Hallmark ne kai cheezein flag ki hain, jaise headings ke upar chhote CAPITAL labels ("02 / THE WAREHOUSE"), heading ke beech ek rangeen shabd, aur kuch spacing jo 4px ke hisaab se nahi hai. Yeh **bugs nahi hain**, Hallmark ke design sujhav hain. Abhi tak inme se kuch bhi theek nahi kiya gaya hai.
- Install karte waqt security check mein Hallmark ko "Medium Risk" bataya gaya. Har tool ki tarah ise bhi project files tak poori pahunch milti hai.

---

## 17 Nov 2026 — Navbar (upar wala menu) naya banaya: glass look + animations

**Kya badla:**
1. **Glass jaisa look:** Navbar ab ek tairta hua (floating) gol kinaron wala patta hai, jiske peeche ki cheezein dhundhli (blur) dikhti hain, bilkul frosted glass ki tarah.
   - Page ke upar (dark photo par): **dark glass**, safed text.
   - Neeche scroll karne par: **halka cream glass**, maroon text, taaki hamesha padhne mein aaye.
2. **"Bhagwan" brand ko sabse khaas banaya:** BW logo ab sunehra (gold) hai. Uske charon taraf ek gold ring dheere-dheere phailti rehti hai, har kuch second mein logo par chamak (shine) guzarti hai, aur mouse le jaane par logo halka sa ghoomta hai. "Bhagwan" naam bada aur bold hai.
3. **Har link ke saath icon aur animation:**
   - Home — icon uchhalta hai (bounce)
   - Our Warehouse — icon bada hokar wapas aata hai (pop)
   - Our Services, Contact Us — icon hilta hai (wiggle)
   - Location — pin neeche girta hai (drop)
   - Jis page par aap ho, uska link **gold** rang mein dikhta hai.
4. **"Call now" button:** phone ka icon har kuch second mein "ring" hota hai, aur mouse le jaane par tezi se hilta hai.
5. **Mobile menu:** Phone par menu button dabane se glass jaisa panel khulta hai, links ek-ek karke aate hain, aur menu icon "X" mein badal jaata hai. Keyboard ka Escape dabane se menu band ho jaata hai.

**Kyun:** Aapne kaha tha ki navbar glassy ho, icons par animation ho, aur "Bhagwan Warehouse" sabse zyada dhyan kheenche.

**Kaun si files:**
- `app/components.tsx` — navbar ka structure (icons, logo, buttons)
- `app/globals.css` — navbar ka look aur animations (file ke end mein "Glass navigation" section)
- Andar ke pages (Warehouse, Services, Location, Contact) ke upar wale hisse mein thodi extra jagah di, kyunki navbar ab unke upar tairta hai.

**Kaise check karein:**
- Home page kholiye, phir neeche scroll kariye. Navbar dark se light glass mein badalna chahiye.
- Har link par mouse le jaiye. Har icon alag tarah se hilega.
- Browser ko patla karke (ya phone par) menu button dabaiye.

**Dhyan dene wali baat:**
- Jinke phone/computer mein "kam animation" (reduce motion) setting on hai, unko animations nahi dikhenge. Yeh jaan-boojhkar kiya gaya hai.
- Ek technical cheez: CSS mein blur ke liye sirf `backdrop-filter` likhna hai, `-webkit-backdrop-filter` alag se mat likhiye. Warna build tool asli wali line hata deta hai aur Chrome mein blur gayab ho jaata hai. (Yeh galti pakdi gayi aur theek kar di gayi.)
- Ek purani code warning (menu band karne wala hissa) bhi saath mein theek kar di.
