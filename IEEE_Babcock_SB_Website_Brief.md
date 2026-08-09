

| IEEE BABCOCK UNIVERSITY STUDENT BRANCH *Official Website — Developer Requirements Brief* Prepared by: Kasie Umahi  •  IEEE Babcock Student Branch  •  July 2026 |
| :---- |

**1\. Project Overview**

This document outlines the full requirements for building the official website of the IEEE Babcock University Student Branch. The reference design is babcocktechweek.com — a Next.js-powered, clean, dark-themed event site with smooth animations, a media-rich hero, and well-organized sections.

The IEEE Babcock SB website should carry that same level of quality and professionalism, adapted to serve as a long-term branch presence — not just a one-time event page. It should represent the branch credibly to members, industry partners, and IEEE globally.

| Project Name | IEEE Babcock University Student Branch — Official Website |
| :---- | :---- |
| **Reference Site** | babcocktechweek.com |
| **Organisation** | IEEE Babcock University Student Branch |
| **Prepared By** | Kasie Umahi (Branch Officer, IEEE Babcock SB) |
| **Date** | July 2026 |
| **Target Launch** | Before AXIS Congress 2026 (September 2026\) |

**2\. Visual Style & Design Language**

The design must mirror the quality and feel of babcocktechweek.com. Key style principles:

**Colour Palette**

• Primary: IEEE Blue (\#005FAD) — headers, CTAs, accent elements

• Background: Deep dark (\#0A0F1E or similar near-black) — primary page background

• Surface: Slightly lighter dark card (\#111827 or \#1E2A3A) — section cards, panels

• Text: White (\#FFFFFF) for headings; Light grey (\#CBD5E1) for body copy

• Accent: Gold/Yellow (\#F59E0B or similar) — optional highlight for awards, stats

**Typography**

• Headings: Bold sans-serif — Inter, Satoshi, or similar modern typeface

• Body: Clean readable sans-serif, 16–18px base size

• IEEE logo and wordmark must follow official IEEE brand guidelines

**Motion & Interaction**

• Smooth scroll behaviour across all pages

• Subtle entrance animations on section load (fade-in, slide-up)

• Hover effects on cards, buttons, and navigation links

• Image carousel/slider in hero section (like babcocktechweek.com)

• Mobile menu with animated open/close (hamburger → X transition)

**3\. Recommended Tech Stack**

| Framework | Next.js 14 (App Router) |
| :---- | :---- |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Animations** | Framer Motion |
| **Hosting** | Vercel (free tier) OR IEEE Entity Web Hosting (site.ieee.org) |
| **CMS (optional)** | Contentlayer or Notion API for easy content updates |
| **Image Optimisation** | Next.js Image component (same as babcocktechweek.com) |
| **Forms** | Formspree or EmailJS for contact form submissions |

| NOTE: If submitting for official IEEE hosting (site.ieee.org), the site must be built on WordPress using the IEEE Sites 2019 template. In that case, the above stack applies only to a self-hosted or Vercel-deployed custom site. Clarify with Kasie which path is chosen before starting development. |
| :---- |

**4\. Pages & Content Structure**

**4.1  Home (/)**

The landing page. This is the most important page — it must make an immediate impact.

**◦ Hero Section:** Full-width, dark background. Auto-playing image carousel of branch activities/events (similar to babcocktechweek.com hero). Overlay with branch name, tagline, and two CTA buttons: 'Join IEEE' and 'Learn More'. Optional: looping background video or particle animation.

**◦ About Snippet:** A 2–3 line intro to the branch with a 'Read More' link to the About page.

**◦ Key Stats Bar:** Animated counter strip — e.g. 'X Members • X Events Held • Founded YEAR • Region 8'. Numbers count up on scroll.

**◦ Featured Pillars / Focus Areas:** 3–4 cards representing the branch's technical focus areas (e.g. Cybersecurity, AI, Embedded Systems, Networking). Icon \+ title \+ short description per card.

**◦ Upcoming Events:** A preview strip of the next 2–3 events with date, title, and a 'View All' link. Pull from vTools or hardcoded initially.

**◦ Featured Executives:** A highlights strip of the current executive team (Chair, Vice-Chair, Secretary, Treasurer) with headshots and titles. 'Meet the Team' button.

**◦ Partners/Sponsors Strip:** Horizontally scrolling logo strip (like babcocktechweek.com) showing partner organisations — IEEE, Babcock University, BUCC, GDG, and any AXIS Congress sponsors.

**◦ Latest News/Highlights:** 2–3 cards linking to blog posts, press mentions, or LinkedIn articles.

**◦ Footer CTA:** Dark-themed footer with newsletter signup or 'Join IEEE' prompt, quick links, and social media icons.

**4.2  About (/about)**

• Branch history — when it was chartered, key milestones

• IEEE global context — short paragraph on what IEEE is

• Branch mission, vision, and values

• Organogram or leadership structure diagram

• Faculty Counselor / Advisor profile

• Awards and recognition received

**4.3  Team (/team)**

Mirrors the /team page structure of babcocktechweek.com.

• Grid layout of all executives and committee leads

• Each card: professional headshot, name, role, and optional LinkedIn icon link

• Grouped by role category (Executive, Technical, Creative, Outreach, etc.)

• Hover effect reveals a short bio or social links

**4.4  Events (/events)**

• Upcoming events list with date, title, description, and registration link

• Past events archive — filterable by year

• Featured event highlight (e.g. AXIS Congress 2026\) with its own dedicated card or banner

• Integration with IEEE vTools event links where applicable

**4.5  AXIS Congress (/axis-congress)  — Dedicated Page**

AXIS Congress is the branch's flagship annual event. It deserves its own full page, not just a card on the events page.

• Hero banner with AXIS Congress branding

• Event description, theme, date, venue

• Speaker/panelist profiles (headshots, names, titles)

• Event schedule/programme breakdown

• Sponsors and partners logos

• Registration link (Luma, Google Form, or similar)

• Gallery from previous editions

**4.6  Projects (/projects)**

• Showcase of technical projects by branch members

• Each project: title, team, description, tech used, links (GitHub, demo)

• Includes GhostCipher AI and other notable branch outputs

**4.7  Blog / News (/blog)  — Optional**

• Lightweight blog for technical articles, event recaps, and branch updates

• Links out to Medium or LinkedIn articles if a full CMS is too heavy

**4.8  Contact (/contact)**

• Contact form (Name, Email, Subject, Message)

• Official IEEE email alias — sb-babcock@ieee.org (or equivalent once assigned)

• Social media links: LinkedIn, Instagram, Twitter/X

• Location: Babcock University, Ilishan-Remo, Ogun State, Nigeria

**5\. Global Components**

**Navigation Bar**

• Fixed/sticky on scroll

• Logo (IEEE Babcock SB) on the left, nav links on the right

• Links: Home • About • Team • Events • AXIS Congress • Projects • Contact

• Mobile: Hamburger menu with smooth animated dropdown (identical behaviour to babcocktechweek.com)

• Social media icons in nav (LinkedIn, Instagram, X)

**Footer**

• Dark background, 3–4 column layout

• Column 1: Branch logo \+ one-line description

• Column 2: Quick links

• Column 3: Upcoming event snippet

• Column 4: Social media links \+ IEEE membership CTA

• Bottom bar: copyright notice, Privacy Policy, Terms links

**6\. Assets to Be Provided by IEEE Babcock SB**

The developer will need the following assets before or during development. Kasie is responsible for supplying these:

| IEEE Babcock SB Logo | SVG \+ PNG (transparent background, light and dark variants) |
| :---- | :---- |
| **Executive Headshots** | Professional photos, minimum 800×800px, consistent style |
| **Event Photos** | High-resolution gallery images from past events (AXIS, Tethered, etc.) |
| **Partner/Sponsor Logos** | SVG or high-res PNG for all partner organisations |
| **Brand Colours** | Exact hex codes for IEEE Babcock SB identity (if different from standard IEEE Blue) |
| **Branch Bio Copy** | Written content for About page — history, mission, vision |
| **Social Media Handles** | LinkedIn, Instagram, Twitter/X, and any other active profiles |
| **vTools Event Links** | Links for upcoming events to embed in the Events section |
| **IEEE Membership Join Link** | Official link for prospective members to join |

**7\. SEO, Performance & Accessibility**

• Meta title and description set for every page

• Open Graph tags for social sharing previews

• Favicon using IEEE Babcock SB logo

• Google Analytics or similar (Vercel Analytics at minimum)

• All images optimised and served via Next.js Image component

• Lighthouse Performance score target: 90+ on mobile and desktop

• Alt text on all images

• Keyboard navigable — meets basic WCAG 2.1 AA standards

• Responsive on mobile, tablet, and desktop (no horizontal scroll)

**8\. Suggested Delivery Timeline**

| Week 1 | Setup, repo, domain, design system (colours, typography, components) |
| :---- | :---- |
| **Week 2** | Home page fully built and responsive |
| **Week 3** | About, Team, Contact pages complete |
| **Week 4** | Events, AXIS Congress, Projects pages complete |
| **Week 5** | Content integration (real assets, photos, copy) |
| **Week 6** | QA, SEO, performance optimisation, mobile testing |
| **Week 7** | Review session with Kasie — revisions |
| **Week 8** | Final deployment → Live before AXIS Congress 2026 |

**9\. Domain & Hosting**

• Recommended domain: ieeebabcock.org or ieeebusb.org (to be registered by the branch)

• Hosting: Deploy on Vercel (free for Next.js) initially

• After launch, optionally submit for official IEEE Entity Web Hosting at site.ieee.org

• SSL certificate: automatically provided by Vercel

• Request official IEEE email alias (sb-babcock@ieee.org) via IEEE Student Branch Resources portal

**10\. Contact for This Brief**

| Name | Kasie (Umahi Kasiemobi Samuel) |
| :---- | :---- |
| **Role** | IEEE Babcock University Student Branch |
| **Organisation** | Babcock University, Ilishan-Remo, Ogun State |
| **Context** | This brief is for the developer building the official branch website |

| NOTE: All questions, clarifications, and design decisions should be directed to Kasie before development begins. Do not deviate from the babcocktechweek.com visual reference without prior confirmation. |
| :---- |

*IEEE Babcock University Student Branch  •  Official Website Requirements Brief  •  July 2026*