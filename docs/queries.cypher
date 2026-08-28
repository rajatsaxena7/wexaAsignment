// The main Cypher queries LearnPath runs, with the parameters the app passes
// in and a note on why each one earns its place in a graph database. The
// live versions (parameterised through the Neo4j driver, never string-
// concatenated) live in lib/queries/*.ts and lib/db.ts.

// ---------------------------------------------------------------------------
// 1. Full prerequisite closure for a goal skill (multi-hop, variable depth)
// lib/queries/plan.ts -> fetchClosureFromGoals
// Params: $goalIds = ["deep-learning"]
// ---------------------------------------------------------------------------
UNWIND $goalIds AS goalId
MATCH (goal:Skill {id: goalId})-[:REQUIRES*0..8]->(skill:Skill)
WITH DISTINCT skill
RETURN skill, [(skill)-[:REQUIRES]->(dep:Skill) | dep.id] AS directPrereqIds;
// Deep Learning requires Machine Learning requires Statistics + Linear
// Algebra requires Algebra Basics — the real chain is 4 hops deep and
// varies by skill. In SQL this needs either a fixed number of self-joins
// (breaks the moment the chain gets deeper) or a recursive CTE re-walked
// per goal. Here it's one traversal, no schema or query change as the
// graph grows deeper.

// ---------------------------------------------------------------------------
// 2. Shortest path from anything you already know to a goal (or set of goals)
// lib/queries/plan.ts -> shortestHops
// Params: $knownIds = ["python", "sql-basics"], $goalIds = ["machine-learning"]
// ---------------------------------------------------------------------------
UNWIND $knownIds AS knownId
UNWIND $goalIds AS goalId
MATCH (k:Skill {id: knownId})
MATCH (g:Skill {id: goalId})
OPTIONAL MATCH p = shortestPath((k)-[:REQUIRES*0..8]->(g))
WITH p WHERE p IS NOT NULL
RETURN min(length(p)) AS hops;
// There is often more than one legitimate route to a skill. shortestPath()
// is a native graph primitive; reproducing "cheapest of many possible
// variable-length routes" in SQL means materialising every route first.

// ---------------------------------------------------------------------------
// 3. Multi-source closure for a Role's required skills, minus what's known
// lib/queries/plan.ts -> planForRole
// Params: $goalIds = the Role's still-missing REQUIRES_SKILL targets
// ---------------------------------------------------------------------------
UNWIND $goalIds AS goalId
MATCH (goal:Skill {id: goalId})-[:REQUIRES*0..8]->(skill:Skill)
WITH DISTINCT skill
RETURN skill, [(skill)-[:REQUIRES]->(dep:Skill) | dep.id] AS directPrereqIds;
// Same traversal as #1, but seeded from several starting points at once (a
// Role usually requires 4-6 skills) and de-duplicated across all of their
// closures in one pass — a union of recursive closures, which is exactly
// the kind of query that turns into a wall of UNION ALL + recursive CTEs
// in a relational schema.

// ---------------------------------------------------------------------------
// 4. "Foundational" skills — how many others transitively depend on each one
// lib/queries/insights.ts -> getFoundationalSkills
// ---------------------------------------------------------------------------
MATCH (s:Skill)
OPTIONAL MATCH (dependent:Skill)-[:REQUIRES*1..8]->(s)
WITH s, count(DISTINCT dependent) AS unlocks
ORDER BY unlocks DESC, s.name ASC
LIMIT 10
RETURN s, unlocks;
// This is a variable-length traversal evaluated for every node in the
// graph, in one query. The relational equivalent is a recursive
// self-join re-run once per candidate skill (or a closure table you'd
// have to keep in sync by hand) — this is the query a relational schema
// would find genuinely awkward.

// ---------------------------------------------------------------------------
// 5. Skill detail: four relationship types from one node, no cartesian blow-up
// lib/queries/skills.ts -> getSkillDetail
// Params: $id = "machine-learning"
// ---------------------------------------------------------------------------
MATCH (s:Skill {id: $id})
RETURN s,
  [(s)-[:REQUIRES]->(pre:Skill) | pre] AS prerequisites,
  [(dep:Skill)-[:REQUIRES]->(s) | dep] AS unlocks,
  [(s)-[:RELATED_TO]-(rel:Skill) | rel] AS related,
  [(c:Course)-[:TEACHES]->(s) | c] AS courses;
// Pattern comprehensions keep four independent one-hop lookups from
// multiplying against each other the way four OPTIONAL MATCH clauses
// (or four LEFT JOINs) in the same query would.

// ---------------------------------------------------------------------------
// 6. Courses that overlap in skill coverage with a given course (2-hop)
// lib/queries/courses.ts -> getCourseDetail
// Params: $id = "combo-fullstack-bootcamp"
// ---------------------------------------------------------------------------
MATCH (c:Course {id: $id})
RETURN c,
  [(c)-[:TEACHES]->(s:Skill) | s] AS taught,
  [(c)-[:TEACHES]->(:Skill)<-[:TEACHES]-(other:Course) WHERE other <> c | other] AS overlapping;
// Course -> Skill <- Course is a two-hop pattern through a bridge
// relationship; in SQL that's a self-join through a junction table, fine
// once, but this app runs the equivalent pattern (skill overlap, path-length
// ranking) at several different hop-counts across the other queries above —
// the graph model keeps the query shape consistent no matter how deep it goes.
