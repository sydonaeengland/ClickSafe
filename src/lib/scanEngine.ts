// PhishGuard Scanning Engine - Hybrid Rule-Based + AI Explanation

export type RiskLevel = 'low' | 'medium' | 'high';

export interface ScanResult {
  riskScore: number;
  riskLevel: RiskLevel;
  redFlags: string[];
  explanation: string;
  safetyAdvice: string[];
  scamCategory?: string;
}

// Patterns for detecting phishing/scam indicators
const URGENCY_PATTERNS = [
  /\burgent\b/i,
  /\bact now\b/i,
  /\bimmediately\b/i,
  /\bexpires?\s*(today|soon|in \d+)/i,
  /\blast chance\b/i,
  /\blimited time\b/i,
  /\bdon't wait\b/i,
  /\baction required\b/i,
  /\bfinal notice\b/i,
  /\bsuspended\b/i,
];

const CREDENTIAL_PATTERNS = [
  /\bpassword\b/i,
  /\bverify your (account|identity|email)\b/i,
  /\bconfirm your (account|identity|details)\b/i,
  /\blogin\s*(here|now|to)\b/i,
  /\bsign in\b/i,
  /\bOTP\b/i,
  /\bverification code\b/i,
  /\bsocial security\b/i,
  /\bssn\b/i,
  /\bcredit card\b/i,
  /\bbank account\b/i,
];

const THREAT_PATTERNS = [
  /\baccount.*(will be |has been )?(suspended|closed|terminated|locked)\b/i,
  /\b(legal|police|fbi|irs) action\b/i,
  /\bwarrant\b/i,
  /\barrest\b/i,
  /\bpenalty\b/i,
  /\bfine\b/i,
  /\bfraud\s*detected\b/i,
  /\bunauthorized\s*(access|activity)\b/i,
];

const TOO_GOOD_PATTERNS = [
  /\bwon\b.*\b(prize|lottery|money|gift)\b/i,
  /\bcongratulations\b/i,
  /\bfree\s*(gift|money|iphone|laptop|vacation)\b/i,
  /\b(million|thousand)\s*dollars\b/i,
  /\binheritance\b/i,
  /\b100%\s*(free|guaranteed)\b/i,
  /\beasy money\b/i,
  /\bwork from home\b.*\b(\$\d+|earn)\b/i,
];

const SUSPICIOUS_LINK_PATTERNS = [
  /bit\.ly/i,
  /tinyurl/i,
  /t\.co/i,
  /goo\.gl/i,
  /ow\.ly/i,
  /is\.gd/i,
  /buff\.ly/i,
  /adf\.ly/i,
  /@.*\.(tk|ml|ga|cf|gq)\b/i,
  /\.(xyz|top|club|online|site|website|space|fun|icu)\b/i,
];

const IMPERSONATION_PATTERNS = [
  /\b(paypal|amazon|netflix|apple|microsoft|google|facebook|instagram|bank\s*of\s*america|wells\s*fargo|chase)\b/i,
  /\bcustomer\s*(service|support)\b/i,
  /\btech\s*support\b/i,
  /\bsecurity\s*(team|department|center)\b/i,
  /\bIT\s*department\b/i,
  /\bfinancial\s*aid\b/i,
  /\bscholarship\s*(committee|office)\b/i,
  /\bregistrar\b/i,
];

const SCAM_CATEGORIES = {
  scholarship: [/scholarship/i, /financial aid/i, /grant/i, /tuition/i, /education fund/i],
  job: [/job offer/i, /internship/i, /position available/i, /hiring/i, /work from home/i, /remote job/i, /employment/i],
  account: [/verify.*account/i, /account.*suspended/i, /password.*reset/i, /login.*attempt/i, /security.*alert/i],
  delivery: [/package/i, /delivery/i, /shipment/i, /tracking/i, /ups/i, /fedex/i, /usps/i, /dhl/i],
  prize: [/winner/i, /lottery/i, /prize/i, /reward/i, /gift card/i, /congratulations.*won/i],
  romance: [/dear friend/i, /lonely/i, /meet you/i, /relationship/i],
  tech_support: [/tech support/i, /virus detected/i, /computer.*infected/i, /call.*immediately/i],
};

// URL-specific patterns
const URL_RED_FLAGS = {
  shortened: [/bit\.ly/i, /tinyurl/i, /t\.co/i, /goo\.gl/i, /ow\.ly/i, /is\.gd/i],
  suspiciousTLD: [/\.(tk|ml|ga|cf|gq|xyz|top|club|online|site|website|pw|cc)$/i],
  impersonation: [
    /paypa[l1]/i, /amaz[o0]n/i, /g[o0][o0]gle/i, /micr[o0]s[o0]ft/i,
    /app[l1]e/i, /netf[l1]ix/i, /faceb[o0][o0]k/i,
  ],
  suspicious: [
    /login/i, /verify/i, /secure/i, /update/i, /account/i,
    /signin/i, /banking/i, /password/i,
  ],
  ipAddress: /^https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/,
  longSubdomain: /^https?:\/\/[^\/]*\.[^\/]*\.[^\/]*\.[^\/]*\.[^\/]*\//,
  obfuscated: /%[0-9a-f]{2}/i,
};

function detectPatterns(text: string, patterns: RegExp[]): string[] {
  const matches: string[] = [];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      matches.push(match[0]);
    }
  }
  return matches;
}

function detectScamCategory(text: string): string | undefined {
  for (const [category, patterns] of Object.entries(SCAM_CATEGORIES)) {
    for (const pattern of patterns) {
      if (pattern.test(text)) {
        return category;
      }
    }
  }
  return undefined;
}

function calculateRiskScore(flags: Record<string, number>): number {
  let score = 0;
  
  // Urgency: 15 points each, max 30
  score += Math.min(flags.urgency * 15, 30);
  
  // Credential requests: 20 points each, max 40
  score += Math.min(flags.credentials * 20, 40);
  
  // Threats: 20 points each, max 40
  score += Math.min(flags.threats * 20, 40);
  
  // Too good to be true: 25 points each, max 50
  score += Math.min(flags.tooGood * 25, 50);
  
  // Suspicious links: 15 points each, max 30
  score += Math.min(flags.suspiciousLinks * 15, 30);
  
  // Impersonation: 20 points each, max 40
  score += Math.min(flags.impersonation * 20, 40);
  
  return Math.min(score, 100);
}

function getRiskLevel(score: number): RiskLevel {
  if (score < 30) return 'low';
  if (score < 60) return 'medium';
  return 'high';
}

function generateExplanation(
  flags: Record<string, string[]>,
  category: string | undefined,
  riskLevel: RiskLevel
): string {
  const explanations: string[] = [];
  
  if (riskLevel === 'low') {
    explanations.push("This message appears relatively safe, but always stay vigilant.");
  } else if (riskLevel === 'medium') {
    explanations.push("This message shows some warning signs that warrant caution.");
  } else {
    explanations.push("This message contains multiple red flags commonly found in scams.");
  }
  
  if (flags.urgency.length > 0) {
    explanations.push("The message uses urgent language to pressure you into acting quickly without thinking.");
  }
  
  if (flags.credentials.length > 0) {
    explanations.push("It requests sensitive information like passwords or personal details - legitimate organizations rarely ask for this via email.");
  }
  
  if (flags.threats.length > 0) {
    explanations.push("The message contains threats about account suspension or legal action to scare you.");
  }
  
  if (flags.tooGood.length > 0) {
    explanations.push("It promises rewards or prizes that seem too good to be true - they usually are.");
  }
  
  if (category) {
    const categoryNames: Record<string, string> = {
      scholarship: "scholarship/financial aid",
      job: "job/internship offer",
      account: "account verification",
      delivery: "package delivery",
      prize: "prize/lottery winner",
      romance: "romance",
      tech_support: "tech support",
    };
    explanations.push(`This appears to be a ${categoryNames[category] || category} type scam.`);
  }
  
  return explanations.join(" ");
}

function generateSafetyAdvice(
  flags: Record<string, string[]>,
  riskLevel: RiskLevel
): string[] {
  const advice: string[] = [];
  
  if (riskLevel === 'high') {
    advice.push("Do NOT click any links or download attachments in this message");
    advice.push("Do NOT reply or provide any personal information");
    advice.push("Report this message to your IT department or email provider");
  }
  
  if (flags.credentials.length > 0) {
    advice.push("Never share passwords, SSN, or financial info via email");
    advice.push("If you're unsure, contact the organization directly using official contact info from their website");
  }
  
  if (flags.suspiciousLinks.length > 0) {
    advice.push("Hover over links to check the actual URL before clicking");
    advice.push("Shortened links can hide malicious destinations");
  }
  
  if (flags.urgency.length > 0 || flags.threats.length > 0) {
    advice.push("Take your time - legitimate organizations won't pressure you with artificial deadlines");
  }
  
  if (riskLevel === 'low') {
    advice.push("While this appears safe, verify the sender's email address");
    advice.push("When in doubt, contact the sender through official channels");
  }
  
  if (advice.length === 0) {
    advice.push("Stay cautious and verify any requests for sensitive information");
    advice.push("Check the sender's email address for signs of spoofing");
  }
  
  return [...new Set(advice)]; // Remove duplicates
}

export function scanText(text: string): ScanResult {
  const urgencyMatches = detectPatterns(text, URGENCY_PATTERNS);
  const credentialMatches = detectPatterns(text, CREDENTIAL_PATTERNS);
  const threatMatches = detectPatterns(text, THREAT_PATTERNS);
  const tooGoodMatches = detectPatterns(text, TOO_GOOD_PATTERNS);
  const suspiciousLinkMatches = detectPatterns(text, SUSPICIOUS_LINK_PATTERNS);
  const impersonationMatches = detectPatterns(text, IMPERSONATION_PATTERNS);
  
  const flagCounts = {
    urgency: urgencyMatches.length,
    credentials: credentialMatches.length,
    threats: threatMatches.length,
    tooGood: tooGoodMatches.length,
    suspiciousLinks: suspiciousLinkMatches.length,
    impersonation: impersonationMatches.length,
  };
  
  const flagDetails = {
    urgency: urgencyMatches,
    credentials: credentialMatches,
    threats: threatMatches,
    tooGood: tooGoodMatches,
    suspiciousLinks: suspiciousLinkMatches,
    impersonation: impersonationMatches,
  };
  
  const riskScore = calculateRiskScore(flagCounts);
  const riskLevel = getRiskLevel(riskScore);
  const scamCategory = detectScamCategory(text);
  
  // Build red flags list
  const redFlags: string[] = [];
  if (urgencyMatches.length > 0) {
    redFlags.push(`Urgent language detected: "${urgencyMatches[0]}"`);
  }
  if (credentialMatches.length > 0) {
    redFlags.push(`Requests sensitive information: "${credentialMatches[0]}"`);
  }
  if (threatMatches.length > 0) {
    redFlags.push(`Contains threats or warnings: "${threatMatches[0]}"`);
  }
  if (tooGoodMatches.length > 0) {
    redFlags.push(`Too-good-to-be-true offer: "${tooGoodMatches[0]}"`);
  }
  if (suspiciousLinkMatches.length > 0) {
    redFlags.push(`Suspicious or shortened link detected`);
  }
  if (impersonationMatches.length > 0) {
    redFlags.push(`Possible impersonation of: "${impersonationMatches[0]}"`);
  }
  
  return {
    riskScore,
    riskLevel,
    redFlags,
    explanation: generateExplanation(flagDetails, scamCategory, riskLevel),
    safetyAdvice: generateSafetyAdvice(flagDetails, riskLevel),
    scamCategory,
  };
}

export function scanUrl(url: string): ScanResult {
  const redFlags: string[] = [];
  let riskScore = 0;
  
  // Check for shortened URLs
  for (const pattern of URL_RED_FLAGS.shortened) {
    if (pattern.test(url)) {
      redFlags.push("Shortened URL detected - destination is hidden");
      riskScore += 25;
      break;
    }
  }
  
  // Check for suspicious TLDs
  for (const pattern of URL_RED_FLAGS.suspiciousTLD) {
    if (pattern.test(url)) {
      redFlags.push("Suspicious top-level domain commonly used by scammers");
      riskScore += 30;
      break;
    }
  }
  
  // Check for brand impersonation
  for (const pattern of URL_RED_FLAGS.impersonation) {
    if (pattern.test(url)) {
      redFlags.push("Possible brand impersonation in URL");
      riskScore += 35;
      break;
    }
  }
  
  // Check for suspicious keywords
  let keywordCount = 0;
  for (const pattern of URL_RED_FLAGS.suspicious) {
    if (pattern.test(url)) {
      keywordCount++;
    }
  }
  if (keywordCount > 0) {
    redFlags.push(`Suspicious keywords in URL (${keywordCount} found)`);
    riskScore += keywordCount * 10;
  }
  
  // Check for IP address
  if (URL_RED_FLAGS.ipAddress.test(url)) {
    redFlags.push("Uses IP address instead of domain name");
    riskScore += 40;
  }
  
  // Check for long subdomains
  if (URL_RED_FLAGS.longSubdomain.test(url)) {
    redFlags.push("Unusually long subdomain chain - may be hiding real domain");
    riskScore += 20;
  }
  
  // Check for obfuscation
  if (URL_RED_FLAGS.obfuscated.test(url)) {
    redFlags.push("URL contains encoded/obfuscated characters");
    riskScore += 15;
  }
  
  // Check for HTTPS
  if (!url.startsWith("https://")) {
    redFlags.push("Not using secure HTTPS connection");
    riskScore += 15;
  }
  
  riskScore = Math.min(riskScore, 100);
  const riskLevel = getRiskLevel(riskScore);
  
  let explanation = "";
  if (riskLevel === 'low') {
    explanation = "This URL appears relatively safe. The domain looks legitimate and uses secure protocols. However, always verify you're on the correct website before entering any information.";
  } else if (riskLevel === 'medium') {
    explanation = "This URL shows some warning signs. It may use techniques common in phishing sites. Verify the domain carefully before proceeding.";
  } else {
    explanation = "This URL exhibits multiple characteristics of malicious links. It may lead to a phishing site designed to steal your credentials or install malware.";
  }
  
  const safetyAdvice: string[] = [];
  if (riskLevel !== 'low') {
    safetyAdvice.push("Do not enter any personal information on this site");
    safetyAdvice.push("If you need to visit the service, type the official URL directly in your browser");
  }
  if (redFlags.some(f => f.includes("Shortened"))) {
    safetyAdvice.push("Use a URL expander tool to reveal the actual destination");
  }
  if (redFlags.some(f => f.includes("impersonation"))) {
    safetyAdvice.push("Visit the official website directly instead of using this link");
  }
  if (safetyAdvice.length === 0) {
    safetyAdvice.push("Always verify you're on the correct website before entering credentials");
    safetyAdvice.push("Look for the padlock icon in your browser's address bar");
  }
  
  return {
    riskScore,
    riskLevel,
    redFlags,
    explanation,
    safetyAdvice,
    scamCategory: 'phishing_link',
  };
}

export function formatReportForCopy(result: ScanResult, originalContent: string): string {
  return `
═══════════════════════════════════════
PHISHGUARD SCAN REPORT
═══════════════════════════════════════

RISK ASSESSMENT
───────────────────────────────────────
Risk Score: ${result.riskScore}/100
Risk Level: ${result.riskLevel.toUpperCase()}
${result.scamCategory ? `Category: ${result.scamCategory.replace(/_/g, ' ').toUpperCase()}` : ''}

RED FLAGS DETECTED
───────────────────────────────────────
${result.redFlags.length > 0 ? result.redFlags.map(f => `• ${f}`).join('\n') : '• No significant red flags detected'}

EXPLANATION
───────────────────────────────────────
${result.explanation}

SAFETY ADVICE
───────────────────────────────────────
${result.safetyAdvice.map(a => `• ${a}`).join('\n')}

SCANNED CONTENT
───────────────────────────────────────
${originalContent.substring(0, 500)}${originalContent.length > 500 ? '...' : ''}

═══════════════════════════════════════
Report generated by PhishGuard
Stay safe online!
═══════════════════════════════════════
`.trim();
}

export function formatReportForEmail(result: ScanResult, originalContent: string): string {
  return `
PhishGuard Scan Report

Risk Score: ${result.riskScore}/100
Risk Level: ${result.riskLevel.toUpperCase()}

Red Flags Detected:
${result.redFlags.length > 0 ? result.redFlags.map(f => `- ${f}`).join('\n') : '- No significant red flags detected'}

Explanation:
${result.explanation}

Scanned Content Preview:
${originalContent.substring(0, 300)}${originalContent.length > 300 ? '...' : ''}

---
This report was generated by PhishGuard, an AI-powered phishing detection tool.
  `.trim();
}
