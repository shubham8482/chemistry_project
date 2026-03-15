/**
 * Complete periodic table — all 118 elements.
 *
 * Properties per element:
 *   number, symbol, name, category, color (neon accent),
 *   row, col (18-column grid position),
 *   shells (electron shell config for Bohr model),
 *   mass (atomic mass string),
 *   state ("solid" | "liquid" | "gas" | "unknown"),
 *   year (year discovered, or "Ancient"),
 *   real_world_use (teenager-friendly one-liner)
 *
 * Layout:
 *   Rows 1-7  → main table
 *   Row 9     → lanthanides (cols 4–18)
 *   Row 10    → actinides   (cols 4–18)
 */

// ── Category colour map ────────────────────────────────────────────
const C = {
  am: "#f472b6", // alkali-metal
  ae: "#fb923c", // alkaline-earth
  tm: "#60a5fa", // transition-metal
  pt: "#38bdf8", // post-transition-metal
  ml: "#a3e635", // metalloid
  nm: "#22d3ee", // nonmetal
  ha: "#facc15", // halogen
  ng: "#a78bfa", // noble-gas
  la: "#f9a8d4", // lanthanide
  ac: "#fca5a5", // actinide
  uk: "#94a3b8", // unknown
};

export const ELEMENTS = [
  // ═══════════ Period 1 ═══════════
  { number:1,  symbol:"H",  name:"Hydrogen",    category:"nonmetal",         color:C.nm, row:1, col:1,  shells:[1],               mass:"1.008",   state:"gas",     year:"1766",    real_world_use:"Rocket fuel & clean energy cells" },
  { number:2,  symbol:"He", name:"Helium",       category:"noble-gas",        color:C.ng, row:1, col:18, shells:[2],               mass:"4.003",   state:"gas",     year:"1868",    real_world_use:"Party balloons & MRI coolant" },

  // ═══════════ Period 2 ═══════════
  { number:3,  symbol:"Li", name:"Lithium",      category:"alkali-metal",     color:C.am, row:2, col:1,  shells:[2,1],             mass:"6.941",   state:"solid",   year:"1817",    real_world_use:"Smartphone & EV batteries" },
  { number:4,  symbol:"Be", name:"Beryllium",    category:"alkaline-earth",   color:C.ae, row:2, col:2,  shells:[2,2],             mass:"9.012",   state:"solid",   year:"1798",    real_world_use:"Satellite mirrors & X-ray windows" },
  { number:5,  symbol:"B",  name:"Boron",        category:"metalloid",        color:C.ml, row:2, col:13, shells:[2,3],             mass:"10.81",   state:"solid",   year:"1808",    real_world_use:"Heat-resistant glass (Pyrex)" },
  { number:6,  symbol:"C",  name:"Carbon",       category:"nonmetal",         color:C.nm, row:2, col:14, shells:[2,4],             mass:"12.01",   state:"solid",   year:"Ancient", real_world_use:"Diamonds, graphite pencils & all life" },
  { number:7,  symbol:"N",  name:"Nitrogen",     category:"nonmetal",         color:C.nm, row:2, col:15, shells:[2,5],             mass:"14.01",   state:"gas",     year:"1772",    real_world_use:"78% of air, fertilisers & explosives" },
  { number:8,  symbol:"O",  name:"Oxygen",       category:"nonmetal",         color:C.nm, row:2, col:16, shells:[2,6],             mass:"16.00",   state:"gas",     year:"1774",    real_world_use:"Breathing, steel-making & hospitals" },
  { number:9,  symbol:"F",  name:"Fluorine",     category:"halogen",          color:C.ha, row:2, col:17, shells:[2,7],             mass:"19.00",   state:"gas",     year:"1886",    real_world_use:"Toothpaste & non-stick (Teflon) pans" },
  { number:10, symbol:"Ne", name:"Neon",         category:"noble-gas",        color:C.ng, row:2, col:18, shells:[2,8],             mass:"20.18",   state:"gas",     year:"1898",    real_world_use:"Glowing neon signs & lasers" },

  // ═══════════ Period 3 ═══════════
  { number:11, symbol:"Na", name:"Sodium",       category:"alkali-metal",     color:C.am, row:3, col:1,  shells:[2,8,1],           mass:"22.99",   state:"solid",   year:"1807",    real_world_use:"Table salt & orange street lights" },
  { number:12, symbol:"Mg", name:"Magnesium",    category:"alkaline-earth",   color:C.ae, row:3, col:2,  shells:[2,8,2],           mass:"24.31",   state:"solid",   year:"1755",    real_world_use:"Fireworks sparkle & lightweight alloys" },
  { number:13, symbol:"Al", name:"Aluminium",    category:"post-transition",  color:C.pt, row:3, col:13, shells:[2,8,3],           mass:"26.98",   state:"solid",   year:"1825",    real_world_use:"Soda cans, foil & aeroplanes" },
  { number:14, symbol:"Si", name:"Silicon",      category:"metalloid",        color:C.ml, row:3, col:14, shells:[2,8,4],           mass:"28.09",   state:"solid",   year:"1824",    real_world_use:"Computer chips & solar panels" },
  { number:15, symbol:"P",  name:"Phosphorus",   category:"nonmetal",         color:C.nm, row:3, col:15, shells:[2,8,5],           mass:"30.97",   state:"solid",   year:"1669",    real_world_use:"Matchsticks & DNA backbone" },
  { number:16, symbol:"S",  name:"Sulfur",       category:"nonmetal",         color:C.nm, row:3, col:16, shells:[2,8,6],           mass:"32.07",   state:"solid",   year:"Ancient", real_world_use:"Vulcanised rubber & gunpowder" },
  { number:17, symbol:"Cl", name:"Chlorine",     category:"halogen",          color:C.ha, row:3, col:17, shells:[2,8,7],           mass:"35.45",   state:"gas",     year:"1774",    real_world_use:"Pool disinfectant & PVC pipes" },
  { number:18, symbol:"Ar", name:"Argon",        category:"noble-gas",        color:C.ng, row:3, col:18, shells:[2,8,8],           mass:"39.95",   state:"gas",     year:"1894",    real_world_use:"Welding shield gas & light-bulb fill" },

  // ═══════════ Period 4 ═══════════
  { number:19, symbol:"K",  name:"Potassium",    category:"alkali-metal",     color:C.am, row:4, col:1,  shells:[2,8,8,1],         mass:"39.10",   state:"solid",   year:"1807",    real_world_use:"Bananas, fertilisers & soap" },
  { number:20, symbol:"Ca", name:"Calcium",      category:"alkaline-earth",   color:C.ae, row:4, col:2,  shells:[2,8,8,2],         mass:"40.08",   state:"solid",   year:"1808",    real_world_use:"Bones, teeth & cement" },
  { number:21, symbol:"Sc", name:"Scandium",     category:"transition-metal", color:C.tm, row:4, col:3,  shells:[2,8,9,2],         mass:"44.96",   state:"solid",   year:"1879",    real_world_use:"Lightweight sports equipment" },
  { number:22, symbol:"Ti", name:"Titanium",     category:"transition-metal", color:C.tm, row:4, col:4,  shells:[2,8,10,2],        mass:"47.87",   state:"solid",   year:"1791",    real_world_use:"Jet engines & hip replacements" },
  { number:23, symbol:"V",  name:"Vanadium",     category:"transition-metal", color:C.tm, row:4, col:5,  shells:[2,8,11,2],        mass:"50.94",   state:"solid",   year:"1801",    real_world_use:"High-strength steel & tools" },
  { number:24, symbol:"Cr", name:"Chromium",     category:"transition-metal", color:C.tm, row:4, col:6,  shells:[2,8,13,1],        mass:"52.00",   state:"solid",   year:"1797",    real_world_use:"Shiny chrome plating & stainless steel" },
  { number:25, symbol:"Mn", name:"Manganese",    category:"transition-metal", color:C.tm, row:4, col:7,  shells:[2,8,13,2],        mass:"54.94",   state:"solid",   year:"1774",    real_world_use:"Batteries & steel production" },
  { number:26, symbol:"Fe", name:"Iron",         category:"transition-metal", color:C.tm, row:4, col:8,  shells:[2,8,14,2],        mass:"55.85",   state:"solid",   year:"Ancient", real_world_use:"Steel beams, cars & your blood" },
  { number:27, symbol:"Co", name:"Cobalt",       category:"transition-metal", color:C.tm, row:4, col:9,  shells:[2,8,15,2],        mass:"58.93",   state:"solid",   year:"1735",    real_world_use:"Blue pigments & rechargeable batteries" },
  { number:28, symbol:"Ni", name:"Nickel",       category:"transition-metal", color:C.tm, row:4, col:10, shells:[2,8,16,2],        mass:"58.69",   state:"solid",   year:"1751",    real_world_use:"Coins, guitar strings & plating" },
  { number:29, symbol:"Cu", name:"Copper",       category:"transition-metal", color:C.tm, row:4, col:11, shells:[2,8,18,1],        mass:"63.55",   state:"solid",   year:"Ancient", real_world_use:"Electrical wiring & plumbing" },
  { number:30, symbol:"Zn", name:"Zinc",         category:"transition-metal", color:C.tm, row:4, col:12, shells:[2,8,18,2],        mass:"65.38",   state:"solid",   year:"Ancient", real_world_use:"Galvanising steel & sunscreen" },
  { number:31, symbol:"Ga", name:"Gallium",      category:"post-transition",  color:C.pt, row:4, col:13, shells:[2,8,18,3],        mass:"69.72",   state:"solid",   year:"1875",    real_world_use:"LEDs & melts in your hand (30 °C)" },
  { number:32, symbol:"Ge", name:"Germanium",    category:"metalloid",        color:C.ml, row:4, col:14, shells:[2,8,18,4],        mass:"72.63",   state:"solid",   year:"1886",    real_world_use:"Fibre optics & infrared lenses" },
  { number:33, symbol:"As", name:"Arsenic",      category:"metalloid",        color:C.ml, row:4, col:15, shells:[2,8,18,5],        mass:"74.92",   state:"solid",   year:"Ancient", real_world_use:"Wood preservatives & semiconductors" },
  { number:34, symbol:"Se", name:"Selenium",     category:"nonmetal",         color:C.nm, row:4, col:16, shells:[2,8,18,6],        mass:"78.97",   state:"solid",   year:"1817",    real_world_use:"Solar cells & anti-dandruff shampoo" },
  { number:35, symbol:"Br", name:"Bromine",      category:"halogen",          color:C.ha, row:4, col:17, shells:[2,8,18,7],        mass:"79.90",   state:"liquid",  year:"1826",    real_world_use:"Flame retardants & old-school photos" },
  { number:36, symbol:"Kr", name:"Krypton",      category:"noble-gas",        color:C.ng, row:4, col:18, shells:[2,8,18,8],        mass:"83.80",   state:"gas",     year:"1898",    real_world_use:"High-performance camera flashes" },

  // ═══════════ Period 5 ═══════════
  { number:37, symbol:"Rb", name:"Rubidium",     category:"alkali-metal",     color:C.am, row:5, col:1,  shells:[2,8,18,8,1],      mass:"85.47",   state:"solid",   year:"1861",    real_world_use:"Atomic clocks & GPS satellites" },
  { number:38, symbol:"Sr", name:"Strontium",    category:"alkaline-earth",   color:C.ae, row:5, col:2,  shells:[2,8,18,8,2],      mass:"87.62",   state:"solid",   year:"1790",    real_world_use:"Red fireworks & glow-in-the-dark paint" },
  { number:39, symbol:"Y",  name:"Yttrium",      category:"transition-metal", color:C.tm, row:5, col:3,  shells:[2,8,18,9,2],      mass:"88.91",   state:"solid",   year:"1794",    real_world_use:"TV screen phosphors & jet engines" },
  { number:40, symbol:"Zr", name:"Zirconium",    category:"transition-metal", color:C.tm, row:5, col:4,  shells:[2,8,18,10,2],     mass:"91.22",   state:"solid",   year:"1789",    real_world_use:"Nuclear reactor cladding & fake diamonds" },
  { number:41, symbol:"Nb", name:"Niobium",      category:"transition-metal", color:C.tm, row:5, col:5,  shells:[2,8,18,12,1],     mass:"92.91",   state:"solid",   year:"1801",    real_world_use:"Superconducting magnets (MRI)" },
  { number:42, symbol:"Mo", name:"Molybdenum",   category:"transition-metal", color:C.tm, row:5, col:6,  shells:[2,8,18,13,1],     mass:"95.95",   state:"solid",   year:"1781",    real_world_use:"High-strength steel alloys" },
  { number:43, symbol:"Tc", name:"Technetium",   category:"transition-metal", color:C.tm, row:5, col:7,  shells:[2,8,18,13,2],     mass:"(98)",    state:"solid",   year:"1937",    real_world_use:"Medical imaging tracer (radioactive)" },
  { number:44, symbol:"Ru", name:"Ruthenium",    category:"transition-metal", color:C.tm, row:5, col:8,  shells:[2,8,18,15,1],     mass:"101.1",   state:"solid",   year:"1844",    real_world_use:"Wear-resistant electrical contacts" },
  { number:45, symbol:"Rh", name:"Rhodium",      category:"transition-metal", color:C.tm, row:5, col:9,  shells:[2,8,18,16,1],     mass:"102.9",   state:"solid",   year:"1803",    real_world_use:"Catalytic converters & jewellery plating" },
  { number:46, symbol:"Pd", name:"Palladium",    category:"transition-metal", color:C.tm, row:5, col:10, shells:[2,8,18,18],       mass:"106.4",   state:"solid",   year:"1803",    real_world_use:"Catalytic converters & hydrogen storage" },
  { number:47, symbol:"Ag", name:"Silver",       category:"transition-metal", color:C.tm, row:5, col:11, shells:[2,8,18,18,1],     mass:"107.9",   state:"solid",   year:"Ancient", real_world_use:"Jewellery, coins & antibacterial coatings" },
  { number:48, symbol:"Cd", name:"Cadmium",      category:"transition-metal", color:C.tm, row:5, col:12, shells:[2,8,18,18,2],     mass:"112.4",   state:"solid",   year:"1817",    real_world_use:"Rechargeable NiCd batteries & pigments" },
  { number:49, symbol:"In", name:"Indium",       category:"post-transition",  color:C.pt, row:5, col:13, shells:[2,8,18,18,3],     mass:"114.8",   state:"solid",   year:"1863",    real_world_use:"Touchscreen coatings (ITO)" },
  { number:50, symbol:"Sn", name:"Tin",          category:"post-transition",  color:C.pt, row:5, col:14, shells:[2,8,18,18,4],     mass:"118.7",   state:"solid",   year:"Ancient", real_world_use:"Tin cans, solder & bronze" },
  { number:51, symbol:"Sb", name:"Antimony",     category:"metalloid",        color:C.ml, row:5, col:15, shells:[2,8,18,18,5],     mass:"121.8",   state:"solid",   year:"Ancient", real_world_use:"Flame retardants & lead-acid batteries" },
  { number:52, symbol:"Te", name:"Tellurium",    category:"metalloid",        color:C.ml, row:5, col:16, shells:[2,8,18,18,6],     mass:"127.6",   state:"solid",   year:"1783",    real_world_use:"Solar panels & thermoelectric devices" },
  { number:53, symbol:"I",  name:"Iodine",       category:"halogen",          color:C.ha, row:5, col:17, shells:[2,8,18,18,7],     mass:"126.9",   state:"solid",   year:"1811",    real_world_use:"Wound disinfectant & thyroid health" },
  { number:54, symbol:"Xe", name:"Xenon",        category:"noble-gas",        color:C.ng, row:5, col:18, shells:[2,8,18,18,8],     mass:"131.3",   state:"gas",     year:"1898",    real_world_use:"Car headlights & space-ion thrusters" },

  // ═══════════ Period 6 ═══════════
  { number:55, symbol:"Cs", name:"Caesium",      category:"alkali-metal",     color:C.am, row:6, col:1,  shells:[2,8,18,18,8,1],   mass:"132.9",   state:"solid",   year:"1860",    real_world_use:"Atomic clocks (defines the second)" },
  { number:56, symbol:"Ba", name:"Barium",       category:"alkaline-earth",   color:C.ae, row:6, col:2,  shells:[2,8,18,18,8,2],   mass:"137.3",   state:"solid",   year:"1808",    real_world_use:"Barium swallow X-ray imaging" },
  // La–Lu → row 9 (lanthanides)
  { number:72, symbol:"Hf", name:"Hafnium",      category:"transition-metal", color:C.tm, row:6, col:4,  shells:[2,8,18,32,10,2],  mass:"178.5",   state:"solid",   year:"1923",    real_world_use:"Nuclear reactor control rods" },
  { number:73, symbol:"Ta", name:"Tantalum",     category:"transition-metal", color:C.tm, row:6, col:5,  shells:[2,8,18,32,11,2],  mass:"180.9",   state:"solid",   year:"1802",    real_world_use:"Capacitors in phones & laptops" },
  { number:74, symbol:"W",  name:"Tungsten",     category:"transition-metal", color:C.tm, row:6, col:6,  shells:[2,8,18,32,12,2],  mass:"183.8",   state:"solid",   year:"1783",    real_world_use:"Light-bulb filaments & drill bits" },
  { number:75, symbol:"Re", name:"Rhenium",      category:"transition-metal", color:C.tm, row:6, col:7,  shells:[2,8,18,32,13,2],  mass:"186.2",   state:"solid",   year:"1925",    real_world_use:"Jet engine super-alloys" },
  { number:76, symbol:"Os", name:"Osmium",       category:"transition-metal", color:C.tm, row:6, col:8,  shells:[2,8,18,32,14,2],  mass:"190.2",   state:"solid",   year:"1803",    real_world_use:"Densest natural element; fountain pen tips" },
  { number:77, symbol:"Ir", name:"Iridium",      category:"transition-metal", color:C.tm, row:6, col:9,  shells:[2,8,18,32,15,2],  mass:"192.2",   state:"solid",   year:"1803",    real_world_use:"Spark plugs & kilogram standard" },
  { number:78, symbol:"Pt", name:"Platinum",     category:"transition-metal", color:C.tm, row:6, col:10, shells:[2,8,18,32,17,1],  mass:"195.1",   state:"solid",   year:"1735",    real_world_use:"Catalytic converters & luxury jewellery" },
  { number:79, symbol:"Au", name:"Gold",         category:"transition-metal", color:C.tm, row:6, col:11, shells:[2,8,18,32,18,1],  mass:"197.0",   state:"solid",   year:"Ancient", real_world_use:"Jewellery, electronics & astronaut visors" },
  { number:80, symbol:"Hg", name:"Mercury",      category:"transition-metal", color:C.tm, row:6, col:12, shells:[2,8,18,32,18,2],  mass:"200.6",   state:"liquid",  year:"Ancient", real_world_use:"Thermometers & fluorescent lights" },
  { number:81, symbol:"Tl", name:"Thallium",     category:"post-transition",  color:C.pt, row:6, col:13, shells:[2,8,18,32,18,3],  mass:"204.4",   state:"solid",   year:"1861",    real_world_use:"Semiconductor research & medical imaging" },
  { number:82, symbol:"Pb", name:"Lead",         category:"post-transition",  color:C.pt, row:6, col:14, shells:[2,8,18,32,18,4],  mass:"207.2",   state:"solid",   year:"Ancient", real_world_use:"Car batteries & radiation shielding" },
  { number:83, symbol:"Bi", name:"Bismuth",      category:"post-transition",  color:C.pt, row:6, col:15, shells:[2,8,18,32,18,5],  mass:"209.0",   state:"solid",   year:"1753",    real_world_use:"Pepto-Bismol & beautiful rainbow crystals" },
  { number:84, symbol:"Po", name:"Polonium",     category:"post-transition",  color:C.pt, row:6, col:16, shells:[2,8,18,32,18,6],  mass:"(209)",   state:"solid",   year:"1898",    real_world_use:"Anti-static devices (very radioactive!)" },
  { number:85, symbol:"At", name:"Astatine",     category:"halogen",          color:C.ha, row:6, col:17, shells:[2,8,18,32,18,7],  mass:"(210)",   state:"solid",   year:"1940",    real_world_use:"Rarest natural element; cancer therapy research" },
  { number:86, symbol:"Rn", name:"Radon",        category:"noble-gas",        color:C.ng, row:6, col:18, shells:[2,8,18,32,18,8],  mass:"(222)",   state:"gas",     year:"1900",    real_world_use:"Home radioactivity testing" },

  // ═══════════ Period 7 ═══════════
  { number:87, symbol:"Fr", name:"Francium",     category:"alkali-metal",     color:C.am, row:7, col:1,  shells:[2,8,18,32,18,8,1],mass:"(223)",   state:"solid",   year:"1939",    real_world_use:"Extremely rare; basic research only" },
  { number:88, symbol:"Ra", name:"Radium",       category:"alkaline-earth",   color:C.ae, row:7, col:2,  shells:[2,8,18,32,18,8,2],mass:"(226)",   state:"solid",   year:"1898",    real_world_use:"Once used in glow-in-the-dark paint" },
  // Ac–Lr → row 10 (actinides)
  { number:104,symbol:"Rf", name:"Rutherfordium",category:"transition-metal", color:C.tm, row:7, col:4,  shells:[2,8,18,32,32,10,2],mass:"(267)",  state:"unknown", year:"1969",    real_world_use:"Synthetic element; nuclear research" },
  { number:105,symbol:"Db", name:"Dubnium",      category:"transition-metal", color:C.tm, row:7, col:5,  shells:[2,8,18,32,32,11,2],mass:"(268)",  state:"unknown", year:"1970",    real_world_use:"Synthetic element; nuclear research" },
  { number:106,symbol:"Sg", name:"Seaborgium",   category:"transition-metal", color:C.tm, row:7, col:6,  shells:[2,8,18,32,32,12,2],mass:"(269)",  state:"unknown", year:"1974",    real_world_use:"Synthetic element; nuclear research" },
  { number:107,symbol:"Bh", name:"Bohrium",      category:"transition-metal", color:C.tm, row:7, col:7,  shells:[2,8,18,32,32,13,2],mass:"(270)",  state:"unknown", year:"1981",    real_world_use:"Synthetic element; nuclear research" },
  { number:108,symbol:"Hs", name:"Hassium",      category:"transition-metal", color:C.tm, row:7, col:8,  shells:[2,8,18,32,32,14,2],mass:"(269)",  state:"unknown", year:"1984",    real_world_use:"Synthetic element; nuclear research" },
  { number:109,symbol:"Mt", name:"Meitnerium",   category:"unknown",          color:C.uk, row:7, col:9,  shells:[2,8,18,32,32,15,2],mass:"(278)",  state:"unknown", year:"1982",    real_world_use:"Named after Lise Meitner; research only" },
  { number:110,symbol:"Ds", name:"Darmstadtium", category:"unknown",          color:C.uk, row:7, col:10, shells:[2,8,18,32,32,17,1],mass:"(281)",  state:"unknown", year:"1994",    real_world_use:"Synthetic element; research only" },
  { number:111,symbol:"Rg", name:"Roentgenium",  category:"unknown",          color:C.uk, row:7, col:11, shells:[2,8,18,32,32,18,1],mass:"(282)",  state:"unknown", year:"1994",    real_world_use:"Named after Wilhelm Röntgen (X-rays)" },
  { number:112,symbol:"Cn", name:"Copernicium",  category:"unknown",          color:C.uk, row:7, col:12, shells:[2,8,18,32,32,18,2],mass:"(285)",  state:"unknown", year:"1996",    real_world_use:"Synthetic; named after Copernicus" },
  { number:113,symbol:"Nh", name:"Nihonium",     category:"unknown",          color:C.uk, row:7, col:13, shells:[2,8,18,32,32,18,3],mass:"(286)",  state:"unknown", year:"2004",    real_world_use:"First element discovered in Asia (Japan)" },
  { number:114,symbol:"Fl", name:"Flerovium",    category:"unknown",          color:C.uk, row:7, col:14, shells:[2,8,18,32,32,18,4],mass:"(289)",  state:"unknown", year:"1999",    real_world_use:"Superheavy element; island of stability" },
  { number:115,symbol:"Mc", name:"Moscovium",    category:"unknown",          color:C.uk, row:7, col:15, shells:[2,8,18,32,32,18,5],mass:"(290)",  state:"unknown", year:"2003",    real_world_use:"Synthetic; named after Moscow" },
  { number:116,symbol:"Lv", name:"Livermorium",  category:"unknown",          color:C.uk, row:7, col:16, shells:[2,8,18,32,32,18,6],mass:"(293)",  state:"unknown", year:"2000",    real_world_use:"Superheavy element research" },
  { number:117,symbol:"Ts", name:"Tennessine",   category:"unknown",          color:C.uk, row:7, col:17, shells:[2,8,18,32,32,18,7],mass:"(294)",  state:"unknown", year:"2010",    real_world_use:"One of the newest elements confirmed" },
  { number:118,symbol:"Og", name:"Oganesson",    category:"unknown",          color:C.uk, row:7, col:18, shells:[2,8,18,32,32,18,8],mass:"(294)",  state:"unknown", year:"2006",    real_world_use:"Last element on the table (so far!)" },

  // ═══════════ Lanthanides (row 9, cols 4–18) ═══════════
  { number:57, symbol:"La", name:"Lanthanum",    category:"lanthanide",       color:C.la, row:9, col:4,  shells:[2,8,18,18,9,2],   mass:"138.9",   state:"solid",   year:"1839",    real_world_use:"Camera lenses & lighter flints" },
  { number:58, symbol:"Ce", name:"Cerium",       category:"lanthanide",       color:C.la, row:9, col:5,  shells:[2,8,18,19,9,2],   mass:"140.1",   state:"solid",   year:"1803",    real_world_use:"Self-cleaning oven coatings" },
  { number:59, symbol:"Pr", name:"Praseodymium", category:"lanthanide",       color:C.la, row:9, col:6,  shells:[2,8,18,21,8,2],   mass:"140.9",   state:"solid",   year:"1885",    real_world_use:"Green glass & aircraft engines" },
  { number:60, symbol:"Nd", name:"Neodymium",    category:"lanthanide",       color:C.la, row:9, col:7,  shells:[2,8,18,22,8,2],   mass:"144.2",   state:"solid",   year:"1885",    real_world_use:"Super-strong magnets in headphones" },
  { number:61, symbol:"Pm", name:"Promethium",   category:"lanthanide",       color:C.la, row:9, col:8,  shells:[2,8,18,23,8,2],   mass:"(145)",   state:"solid",   year:"1945",    real_world_use:"Nuclear-powered batteries" },
  { number:62, symbol:"Sm", name:"Samarium",     category:"lanthanide",       color:C.la, row:9, col:9,  shells:[2,8,18,24,8,2],   mass:"150.4",   state:"solid",   year:"1879",    real_world_use:"Cancer treatment & magnets" },
  { number:63, symbol:"Eu", name:"Europium",     category:"lanthanide",       color:C.la, row:9, col:10, shells:[2,8,18,25,8,2],   mass:"152.0",   state:"solid",   year:"1901",    real_world_use:"Red phosphor in TVs & Euro banknotes" },
  { number:64, symbol:"Gd", name:"Gadolinium",   category:"lanthanide",       color:C.la, row:9, col:11, shells:[2,8,18,25,9,2],   mass:"157.3",   state:"solid",   year:"1880",    real_world_use:"MRI contrast agent" },
  { number:65, symbol:"Tb", name:"Terbium",      category:"lanthanide",       color:C.la, row:9, col:12, shells:[2,8,18,27,8,2],   mass:"158.9",   state:"solid",   year:"1843",    real_world_use:"Green phosphor in screens" },
  { number:66, symbol:"Dy", name:"Dysprosium",   category:"lanthanide",       color:C.la, row:9, col:13, shells:[2,8,18,28,8,2],   mass:"162.5",   state:"solid",   year:"1886",    real_world_use:"Wind turbine magnets" },
  { number:67, symbol:"Ho", name:"Holmium",      category:"lanthanide",       color:C.la, row:9, col:14, shells:[2,8,18,29,8,2],   mass:"164.9",   state:"solid",   year:"1878",    real_world_use:"Strongest magnetic field of any element" },
  { number:68, symbol:"Er", name:"Erbium",       category:"lanthanide",       color:C.la, row:9, col:15, shells:[2,8,18,30,8,2],   mass:"167.3",   state:"solid",   year:"1842",    real_world_use:"Fibre-optic signal amplifiers" },
  { number:69, symbol:"Tm", name:"Thulium",      category:"lanthanide",       color:C.la, row:9, col:16, shells:[2,8,18,31,8,2],   mass:"168.9",   state:"solid",   year:"1879",    real_world_use:"Portable X-ray machines" },
  { number:70, symbol:"Yb", name:"Ytterbium",    category:"lanthanide",       color:C.la, row:9, col:17, shells:[2,8,18,32,8,2],   mass:"173.0",   state:"solid",   year:"1878",    real_world_use:"Stress gauges & laser research" },
  { number:71, symbol:"Lu", name:"Lutetium",     category:"lanthanide",       color:C.la, row:9, col:18, shells:[2,8,18,32,9,2],   mass:"175.0",   state:"solid",   year:"1907",    real_world_use:"PET scan detectors" },

  // ═══════════ Actinides (row 10, cols 4–18) ═══════════
  { number:89, symbol:"Ac", name:"Actinium",     category:"actinide",         color:C.ac, row:10,col:4,  shells:[2,8,18,32,18,9,2],mass:"(227)",   state:"solid",   year:"1899",    real_world_use:"Neutron source for research" },
  { number:90, symbol:"Th", name:"Thorium",      category:"actinide",         color:C.ac, row:10,col:5,  shells:[2,8,18,32,18,10,2],mass:"232.0",  state:"solid",   year:"1829",    real_world_use:"Nuclear fuel & gas-mantle lanterns" },
  { number:91, symbol:"Pa", name:"Protactinium", category:"actinide",         color:C.ac, row:10,col:6,  shells:[2,8,18,32,20,9,2],mass:"231.0",   state:"solid",   year:"1913",    real_world_use:"Ocean-floor dating research" },
  { number:92, symbol:"U",  name:"Uranium",      category:"actinide",         color:C.ac, row:10,col:7,  shells:[2,8,18,32,21,9,2],mass:"238.0",   state:"solid",   year:"1789",    real_world_use:"Nuclear power plants & dating rocks" },
  { number:93, symbol:"Np", name:"Neptunium",    category:"actinide",         color:C.ac, row:10,col:8,  shells:[2,8,18,32,22,9,2],mass:"(237)",   state:"solid",   year:"1940",    real_world_use:"Neutron detection instruments" },
  { number:94, symbol:"Pu", name:"Plutonium",    category:"actinide",         color:C.ac, row:10,col:9,  shells:[2,8,18,32,24,8,2],mass:"(244)",   state:"solid",   year:"1940",    real_world_use:"Space probe batteries & nuclear weapons" },
  { number:95, symbol:"Am", name:"Americium",    category:"actinide",         color:C.ac, row:10,col:10, shells:[2,8,18,32,25,8,2],mass:"(243)",   state:"solid",   year:"1944",    real_world_use:"Smoke detectors in your home!" },
  { number:96, symbol:"Cm", name:"Curium",       category:"actinide",         color:C.ac, row:10,col:11, shells:[2,8,18,32,25,9,2],mass:"(247)",   state:"solid",   year:"1944",    real_world_use:"Mars rover power source" },
  { number:97, symbol:"Bk", name:"Berkelium",    category:"actinide",         color:C.ac, row:10,col:12, shells:[2,8,18,32,27,8,2],mass:"(247)",   state:"solid",   year:"1949",    real_world_use:"Produced only in nuclear reactors" },
  { number:98, symbol:"Cf", name:"Californium",  category:"actinide",         color:C.ac, row:10,col:13, shells:[2,8,18,32,28,8,2],mass:"(251)",   state:"solid",   year:"1950",    real_world_use:"Detecting gold & water in oil wells" },
  { number:99, symbol:"Es", name:"Einsteinium",  category:"actinide",         color:C.ac, row:10,col:14, shells:[2,8,18,32,29,8,2],mass:"(252)",   state:"solid",   year:"1952",    real_world_use:"First found in H-bomb fallout" },
  { number:100,symbol:"Fm", name:"Fermium",      category:"actinide",         color:C.ac, row:10,col:15, shells:[2,8,18,32,30,8,2],mass:"(257)",   state:"unknown", year:"1952",   real_world_use:"Nuclear research only" },
  { number:101,symbol:"Md", name:"Mendelevium",  category:"actinide",         color:C.ac, row:10,col:16, shells:[2,8,18,32,31,8,2],mass:"(258)",   state:"unknown", year:"1955",   real_world_use:"Named after Mendeleev, the table creator!" },
  { number:102,symbol:"No", name:"Nobelium",     category:"actinide",         color:C.ac, row:10,col:17, shells:[2,8,18,32,32,8,2],mass:"(259)",   state:"unknown", year:"1966",   real_world_use:"Named after Alfred Nobel (Nobel Prize)" },
  { number:103,symbol:"Lr", name:"Lawrencium",   category:"actinide",         color:C.ac, row:10,col:18, shells:[2,8,18,32,32,8,3],mass:"(266)",   state:"unknown", year:"1961",   real_world_use:"Last of the actinides; research element" },
];
