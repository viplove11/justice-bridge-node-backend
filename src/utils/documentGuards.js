// Lightweight, deterministic validators (heuristics) to guard endpoints.
// These are NOT perfect classifiers, but they help prevent obvious misuse.

export const looksLikeIndianLaw = (text = "") => {
  const t = String(text);
  if (t.trim().length < 50) return false;

  // Prefer strong India-specific markers.
  const strongIndianMarkers = [
    /\bConstitution\s+of\s+India\b/i,
    /\bGovernment\s+of\s+India\b/i,
    /\bRepublic\s+of\s+India\b/i,
    /\bSupreme\s+Court\s+of\s+India\b/i,
    /\bHigh\s+Court\b/i,
    /\bSCC\b/i, // Supreme Court Cases
    /\bAIR\b/i, // All India Reporter
    /\bIPC\b|\bIndian\s+Penal\s+Code\b/i,
    /\bCrPC\b|\bCode\s+of\s+Criminal\s+Procedure\b/i,
    /\bCPC\b|\bCode\s+of\s+Civil\s+Procedure\b/i,
    /\bGST\b|\bGoods\s+and\s+Services\s+Tax\b/i,
    /\bIncome\s+Tax\b/i,
    /\bCompanies\s+Act\b/i,
    /\bMotor\s+Vehicles\s+Act\b/i,
    /\bRTI\b|\bRight\s+to\s+Information\b/i,
    /\bFIR\b/i
  ];

  // Weaker structural markers that appear in many legal texts. We only use
  // these to *support* detection if at least one India marker exists.
  const legalStructureMarkers = [
    /\bSection\s+\d+[A-Za-z-]*/i,
    /\bArticle\s+\d+[A-Za-z-]*/i,
    /\bAct\b/i,
    /\bSchedule\b/i,
    /\bRule\s+\d+/i,
    /\bRegulation\s+\d+/i
  ];

  const hasStrongIndia = strongIndianMarkers.some((r) => r.test(t));
  if (hasStrongIndia) return true;

  // If it explicitly mentions India/Indian and looks like a legal statute.
  const mentionsIndia = /\bIndia\b|\bIndian\b/i.test(t);
  const hasLegalStructure = legalStructureMarkers.some((r) => r.test(t));

  return mentionsIndia && hasLegalStructure;
};

export const looksLikeJudgement = (text = "") => {
  const t = String(text);
  if (t.trim().length < 80) return false;

  const judgementMarkers = [
    /\bIN\s+THE\s+(SUPREME|HIGH)\s+COURT\b/i,
    /\bBEFORE\b/i,
    /\bCORAM\b/i,
    /\bJUDGMENT\b/i,
    /\bORDER\b/i,
    /\bDATED\b/i,
    /\bPETITIONER\b/i,
    /\bRESPONDENT\b/i,
    /\bAPPELLANT\b/i,
    /\bVersus\b/i,
    /\bv\.?\s/i,
    /\bCIVIL\s+APPEAL\b/i,
    /\bCRIMINAL\s+APPEAL\b/i,
    /\bWRIT\s+PETITION\b/i,
    /\bSLP\b/i,
    /\bNo\.?\s*\d+\s*(of)?\s*\d{4}\b/i
  ];

  return judgementMarkers.some((r) => r.test(t));
};

export const looksLikeIndianJudgement = (text = "") => {
  const t = String(text);

  // First, it must look structurally like a court judgement
  if (!looksLikeJudgement(t)) return false;

  // Looser India-specific markers for judgements.
  const indiaJudgementMarkers = [
    /\bSupreme\s+Court\s+of\s+India\b/i,
    /\bHigh\s+Court\b/i,
    /\bIndia\b/i,
    /\bIndian\b/i,
    /\bSCC\b/i, // Supreme Court Cases
    /\bAIR\b/i, // All India Reporter
  ];

  if (indiaJudgementMarkers.some((r) => r.test(t))) {
    return true;
  }

  // Fallback: if it clearly looks like a judgement and is long enough,
  // allow it to avoid blocking genuine use cases.
  return t.trim().length > 800;
};
