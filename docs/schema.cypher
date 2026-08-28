// Constraints applied by scripts/seed.ts. Re-runnable — IF NOT EXISTS makes
// these idempotent.

CREATE CONSTRAINT IF NOT EXISTS FOR (n:Skill) REQUIRE n.id IS UNIQUE;
CREATE CONSTRAINT IF NOT EXISTS FOR (n:Course) REQUIRE n.id IS UNIQUE;
CREATE CONSTRAINT IF NOT EXISTS FOR (n:Role) REQUIRE n.id IS UNIQUE;

// --- Node shapes -----------------------------------------------------------
//
// (:Skill {id, name, category, description})
// (:Course {id, title, provider, level, hours, url})
// (:Role   {id, title, category, description})
//
// --- Relationships -----------------------------------------------------------
//
// (:Skill)-[:REQUIRES]->(:Skill)              -- prerequisite: source needs target first
// (:Skill)-[:RELATED_TO]-(:Skill)              -- undirected, lateral suggestion
// (:Course)-[:TEACHES]->(:Skill)               -- a course covers a skill
// (:Role)-[:REQUIRES_SKILL {importance}]->(:Skill)  -- importance: "core" | "nice-to-have"
