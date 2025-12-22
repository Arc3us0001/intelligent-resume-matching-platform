import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { skill: "React", candidates: 45 },
  { skill: "Python", candidates: 38 },
  { skill: "TypeScript", candidates: 32 },
  { skill: "Node.js", candidates: 28 },
  { skill: "SQL", candidates: 25 },
  { skill: "AWS", candidates: 22 },
];

export function SkillsChart() {
  return (
    <div className="card-elevated p-6 animate-slide-up" style={{ animationDelay: "0.3s" }}>
      <div className="mb-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Top Skills</h2>
        <p className="text-sm text-muted-foreground">Most common candidate skills</p>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
            <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis 
              type="category" 
              dataKey="skill" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              width={80}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Bar 
              dataKey="candidates" 
              fill="hsl(var(--primary))" 
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
