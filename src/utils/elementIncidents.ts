export function generateRecentIncident(symbol: string, name: string, category: string): string {
    // Add some specific high-profile incidents
    switch (symbol) {
        case 'Li':
            return "October 2025: A massive breakthrough in solid-state lithium battery tech was announced, promising a 300% range increase for EVs without the combustion risks of older liquid electrolytes.";
        case 'Au':
            return "March 2026: Authorities intercepted a high-tech smuggling ring attempting to move 400kg of gold by molding it into the shape of car suspension parts and painting them black.";
        case 'U':
            return "January 2026: Global energy debates spiked after the activation of a next-generation molten-salt uranium reactor designed to consume nuclear waste as fuel.";
        case 'He':
            return "Late 2025: The scientific community faced widespread delays as the global helium shortage reached a critical point, severely impacting MRI machine operations and deep-space cooling research.";
        case 'Co':
            return "November 2025: Major tech conglomerates pledged to transition to 'cobalt-free' battery chemistries within 5 years following severe supply chain disruptions and ethical mining concerns in Central Africa.";
        case 'Na':
            return "August 2025: A chemical factory fire involving tons of stored metallic sodium resulted in a spectacular, uncontrollable blaze when firefighters mistakenly attempted to extinguish it with water.";
        case 'Si':
            return "February 2026: The semiconductor industry unveiled the first commercially viable 1-nanometer silicon chip, completely revolutionizing AI processing speeds.";
        case 'C':
            return "December 2025: Carbon nanotube composites replaced traditional steel in the construction of the world's tallest suspension bridge, reducing the structural weight by 70%.";
        case 'O':
            return "Summer 2025: Aerospace engineers successfully tested a new cryogenic liquid oxygen delivery network in low Earth orbit, paving the way for sustainable lunar refuelling stations.";
        case 'F':
            return "September 2025: An accidental release of fluorine gas at a research facility caused spontaneous combustion of nearby glass lab equipment, forcing immediate building evacuation.";
        case 'Po':
            return "Historical Echo: Still haunted by the 2006 assassination of Alexander Litvinenko, international intelligence agencies clamped down heavily on the black market transport of microscopic amounts of Polonium-210.";
        default:
            break;
    }

    // Generic templates based on category for elements without specific hardcoded stories
    if (category.includes('metal')) {
        return `Recently, advancements in metallurgy have highlighted new alloy combinations using ${name} to dramatically improve the tensile strength of aerospace components.`;
    }
    if (category.includes('gas')) {
        return `In recent atmospheric studies, trace atmospheric interactions involving ${name} have led researchers to reconsider models of upper-stratosphere chemical reactions.`;
    }
    if (category.includes('actinide') || category.includes('lanthanide')) {
        return `Deep-sea mining expeditions off the coast of Japan recently reported locating dense deposits containing ${name}, sparking a new race for rare-earth independence.`;
    }

    return `Laboratory researchers recently published findings regarding unexpected quantum behaviors in ${name} isotopes when subjected to extreme near-absolute-zero temperatures.`;
}
