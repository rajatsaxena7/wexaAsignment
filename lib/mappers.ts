import { Node, isInt } from "neo4j-driver";
import { Course, Role, Skill } from "./types";

function toNumber(value: unknown): number {
  if (isInt(value)) return value.toNumber();
  return typeof value === "number" ? value : Number(value);
}

export function toSkill(node: Node): Skill {
  const p = node.properties as Record<string, unknown>;
  return {
    id: String(p.id),
    name: String(p.name),
    category: String(p.category),
    description: String(p.description ?? ""),
  };
}

export function toCourse(node: Node): Course {
  const p = node.properties as Record<string, unknown>;
  return {
    id: String(p.id),
    title: String(p.title),
    provider: String(p.provider),
    level: p.level as Course["level"],
    hours: toNumber(p.hours),
    url: String(p.url ?? ""),
  };
}

export function toRole(node: Node): Role {
  const p = node.properties as Record<string, unknown>;
  return {
    id: String(p.id),
    title: String(p.title),
    category: String(p.category),
    description: String(p.description ?? ""),
  };
}
